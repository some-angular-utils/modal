import { DOCUMENT } from '@angular/common';
import { ApplicationRef, EnvironmentInjector, Injectable, Injector, Type, createComponent, inject } from '@angular/core';

import { SAUModalComponent } from './sau-modal/sau-modal.component';
import { ModalOptions } from './modal-options';
import { ModalRef } from './modal-ref';

/**
 * Opens components inside a centered, backdrop-covered dialog without requiring
 * any host markup in the app (no `<router-outlet>`-style anchor needed) — the
 * container is created on demand and appended straight to `<body>`.
 */
@Injectable({ providedIn: 'root' })
export class SAUModalService {
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);
  private injector = inject(Injector);
  private document = inject(DOCUMENT);
  private previousBodyOverflow: string | null = null;

  open<T>(component: Type<T>, options: ModalOptions = {}): ModalRef<T> {
    const modalRef = new ModalRef<T>();

    const containerRef = createComponent(SAUModalComponent, {
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector,
    });
    containerRef.instance.size = options.size ?? 'md';
    containerRef.instance.backdrop = options.backdrop ?? true;
    containerRef.instance.keyboard = options.keyboard ?? true;

    this.appRef.attachView(containerRef.hostView);
    // Force an initial render so the static ViewChild + DOM node are ready
    // for the synchronous work below (contentHost.createComponent, body.appendChild).
    containerRef.changeDetectorRef.detectChanges();

    const nativeElement = containerRef.instance.nativeElement;
    this.document.body.appendChild(nativeElement);

    // Lock background scroll while at least one modal is open (stacked opens share the lock).
    if (this.previousBodyOverflow === null) {
      this.previousBodyOverflow = this.document.body.style.overflow;

      const scrollbarWidth = (this.document.defaultView?.innerWidth ?? 0) - this.document.documentElement.clientWidth;
      this.document.body.style.width = `calc(100% - ${scrollbarWidth}px)`;

      this.document.body.style.overflow = 'hidden';
    }

    // A child injector so the hosted component can `inject(ModalRef)` to close/dismiss itself.
    const contentInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: ModalRef, useValue: modalRef }],
    });

    const contentRef = containerRef.instance.contentHost.createComponent(component, {
      injector: contentInjector,
    });
    modalRef.componentInstance = contentRef.instance;

    const backdropSub = containerRef.instance.backdropClick.subscribe(() => modalRef.dismiss('backdrop-click'));
    const escSub = containerRef.instance.escKey.subscribe(() => modalRef.dismiss('esc'));

    modalRef._bindTeardown(() => {
      backdropSub.unsubscribe();
      escSub.unsubscribe();

      // Play the exit transition before actually tearing down the DOM/view — close()/dismiss()
      // still resolve immediately, this just delays the cleanup so the animation is visible.
      containerRef.instance.animateClose().then(() => {
        this.appRef.detachView(containerRef.hostView);
        containerRef.destroy();
        nativeElement.remove();
        if (!this.document.querySelector('sau-modal')) {
          this.document.body.style.overflow = this.previousBodyOverflow ?? '';
          this.document.body.style.width = `100%`;
          this.previousBodyOverflow = null;
        }
      });
    });

    return modalRef;
  }
}
