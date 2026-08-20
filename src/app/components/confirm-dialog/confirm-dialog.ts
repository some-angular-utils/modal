import { Component, Input, inject } from '@angular/core';
import { ModalRef } from '@some-angular-utils/modal';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="app-confirm-dialog">
      <button type="button" class="app-confirm-dialog-close" (click)="cancel()" aria-label="Close">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; fill: currentColor;">
          <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.88-4.89c.39-.38.39-1.02.01-1.4z" />
        </svg>
      </button>

      <div class="app-confirm-dialog-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; fill: currentColor;">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </div>

      <h2 class="app-confirm-dialog-title">Delete {{ entity }}</h2>

      <p class="app-confirm-dialog-message">
        Are you sure you want to delete
        @if (name) {
          <strong>{{ name }}</strong>
        } @else {
          this {{ entity.toLowerCase() }}
        }? This action cannot be undone.
      </p>

      <div class="app-confirm-dialog-actions">
        <button type="button" class="app-confirm-dialog-cancel" (click)="cancel()">Cancel</button>
        <button type="button" class="app-confirm-dialog-confirm" (click)="confirm()">Delete</button>
      </div>
    </div>
  `,
  // Just an ordinary app component — SAUModalService.open() doesn't care where it lives
  // or how it's styled, it only needs to exist and (optionally) inject ModalRef to close itself.
  // CSS custom properties still cascade in from the <sau-modal> host that wraps this content,
  // which is what lets the "theme" demo re-theme it at runtime without rebuilding anything.
  styles: [`
    .app-confirm-dialog {
      --sau-color-accent: rgb(239, 68, 68);

      position: relative;
      padding: 2rem 1.75rem 1.75rem;
      text-align: center;
    }

    .app-confirm-dialog-close {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 1.75rem;
      height: 1.75rem;
      padding: 0.35rem;
      border: none;
      border-radius: 9999px;
      background: transparent;
      color: rgb(156, 163, 175);
      cursor: pointer;
      transition: background-color .15s ease, color .15s ease;
    }

    .app-confirm-dialog-close:hover {
      background: rgb(243, 244, 246);
      color: var(--sau-color-text, rgb(31, 41, 55));
    }

    .app-confirm-dialog-icon {
      width: 3rem;
      height: 3rem;
      margin: 0 auto 1rem;
      padding: 0.75rem;
      border-radius: 9999px;
      background: rgb(254, 226, 226);
      color: var(--sau-color-accent);
    }

    .app-confirm-dialog-title {
      margin: 0 0 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--sau-color-text, rgb(31, 41, 55));
    }

    .app-confirm-dialog-message {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
      color: rgb(107, 114, 128);
    }

    .app-confirm-dialog-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .app-confirm-dialog-actions button {
      flex: 1;
      padding: 0.55rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color .15s ease, border-color .15s ease;
    }

    .app-confirm-dialog-cancel {
      border: 1px solid rgb(209, 213, 219);
      background: var(--sau-color-background, #fff);
      color: var(--sau-color-text, rgb(31, 41, 55));
    }

    .app-confirm-dialog-cancel:hover {
      background: rgb(249, 250, 251);
    }

    .app-confirm-dialog-confirm {
      border: 1px solid var(--sau-color-accent);
      background: var(--sau-color-accent);
      color: #fff;
    }

    .app-confirm-dialog-confirm:hover {
      filter: brightness(0.9);
    }
  `],
})
export class ConfirmDialogComponent {
  /** Name/label of the item being deleted, shown in the confirmation message. */
  @Input() name = '';
  /** Entity type, e.g. 'Company'. Shown in the title ("Delete Company"). */
  @Input() entity = 'item';

  private modalRef = inject<ModalRef<ConfirmDialogComponent>>(ModalRef);

  confirm(): void {
    this.modalRef.close(true);
  }

  cancel(): void {
    this.modalRef.dismiss(false);
  }
}
