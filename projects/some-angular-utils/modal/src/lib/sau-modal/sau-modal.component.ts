import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, ViewContainerRef, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'sau-modal',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="sau-modal-backdrop" (click)="onBackdropClick()"></div>
    <div class="sau-modal-dialog"
      [class.sau-modal-size-sm]="size === 'sm'"
      [class.sau-modal-size-lg]="size === 'lg'"
      role="dialog"
      aria-modal="true">
      <ng-container #contentHost></ng-container>
    </div>
  `,
  // encapsulation is None (same reason as sau-table: dynamic runtime theming needs plain
  // global CSS custom properties), which means Angular does NOT rewrite `:host` — it isn't
  // shimmed to anything and never matches. Style the host element via its own tag name
  // (`sau-modal`) instead, same pattern table.scss uses via a `.sau-table` class.
  styles: [`
    sau-modal {
      --sau-color-primary: rgb(147, 51, 234);
      --sau-color-background: rgb(255, 255, 255);
      --sau-color-text: rgb(31, 41, 55);

      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: sau-modal-fade-in .15s ease-out;
    }

    .sau-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(17, 24, 39, 0.5);
    }

    .sau-modal-dialog {
      position: relative;
      width: 100%;
      max-width: 28rem;
      max-height: calc(100vh - 2rem);
      overflow: auto;
      border-radius: 0.75rem;
      background: var(--sau-color-background);
      color: var(--sau-color-text);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      animation: sau-modal-scale-in .15s ease-out;
    }

    .sau-modal-dialog.sau-modal-size-sm {
      max-width: 20rem;
    }

    .sau-modal-dialog.sau-modal-size-lg {
      max-width: 40rem;
    }

    @keyframes sau-modal-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes sau-modal-scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class SAUModalComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() backdrop: boolean | 'static' = true;
  @Input() keyboard = true;

  @Output() backdropClick = new EventEmitter<void>();
  @Output() escKey = new EventEmitter<void>();

  @ViewChild('contentHost', { read: ViewContainerRef, static: true }) contentHost!: ViewContainerRef;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  onBackdropClick(): void {
    if (this.backdrop !== 'static') {
      this.backdropClick.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.keyboard) {
      this.escKey.emit();
    }
  }
}
