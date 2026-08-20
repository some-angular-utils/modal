import { Component, Input, inject } from '@angular/core';
import { ModalRef } from '@some-angular-utils/modal';

@Component({
  selector: 'app-alert-dialog',
  template: `
    <div class="app-alert-dialog">
      <h2 class="app-alert-dialog-title">{{ title }}</h2>
      <p class="app-alert-dialog-message">{{ message }}</p>

      <div class="app-alert-dialog-actions">
        <button type="button" class="app-alert-dialog-ok" (click)="acknowledge()">Got it</button>
      </div>
    </div>
  `,
  // A one-button announcement — no cancel path at all, just close(). Another shape
  // entirely from ConfirmDialogComponent and RenameDialogComponent, same open() call.
  styles: [`
    .app-alert-dialog {
      padding: 1.75rem;
      text-align: left;
    }

    .app-alert-dialog-title {
      margin: 0 0 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--sau-color-text, rgb(31, 41, 55));
    }

    .app-alert-dialog-message {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
      color: rgb(107, 114, 128);
    }

    .app-alert-dialog-actions {
      display: flex;
      margin-top: 1.5rem;
    }

    .app-alert-dialog-ok {
      flex: 1;
      padding: 0.55rem 1rem;
      border: 1px solid var(--sau-color-primary, rgb(147, 51, 234));
      border-radius: 0.5rem;
      background: var(--sau-color-primary, rgb(147, 51, 234));
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: filter .15s ease;
    }

    .app-alert-dialog-ok:hover {
      filter: brightness(0.9);
    }
  `],
})
export class AlertDialogComponent {
  @Input() title = 'Heads up';
  @Input() message = '';

  private modalRef = inject<ModalRef<AlertDialogComponent>>(ModalRef);

  acknowledge(): void {
    this.modalRef.close(true);
  }
}
