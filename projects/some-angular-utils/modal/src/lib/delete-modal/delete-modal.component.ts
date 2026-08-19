import { Component, Input, ViewEncapsulation, inject } from '@angular/core';

import { ModalTrashIconComponent } from '../icons/trash-icon';
import { ModalXmarkIconComponent } from '../icons/xmark-icon';
import { ModalRef } from '../modal-ref';

@Component({
  selector: 'sau-delete-modal',
  encapsulation: ViewEncapsulation.None,
  imports: [ModalTrashIconComponent, ModalXmarkIconComponent],
  template: `
    <div class="sau-delete-modal">
      <button type="button" class="sau-delete-modal-close" (click)="cancel()" aria-label="Close">
        <sau-modal-xmark-icon></sau-modal-xmark-icon>
      </button>

      <div class="sau-delete-modal-icon">
        <sau-modal-trash-icon></sau-modal-trash-icon>
      </div>

      <h2 class="sau-delete-modal-title">Delete {{ entity }}</h2>

      <p class="sau-delete-modal-message">
        Are you sure you want to delete
        @if (name) {
          <strong>{{ name }}</strong>
        } @else {
          this {{ entity.toLowerCase() }}
        }? This action cannot be undone.
      </p>

      <div class="sau-delete-modal-actions">
        <button type="button" class="sau-delete-modal-cancel" (click)="cancel()">Cancel</button>
        <button type="button" class="sau-delete-modal-confirm" (click)="confirm()">Delete</button>
      </div>
    </div>
  `,
  // encapsulation None like sau-table, so custom properties are declared on the template's
  // own root class (`.sau-delete-modal`) rather than `:host`, which Angular never rewrites here.
  styles: [`
    .sau-delete-modal {
      --sau-color-delete: rgb(239, 68, 68);
      --sau-color-text: rgb(31, 41, 55);

      position: relative;
      padding: 2rem 1.75rem 1.75rem;
      text-align: center;
    }

    .sau-delete-modal-close {
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

    .sau-delete-modal-close:hover {
      background: rgb(243, 244, 246);
      color: var(--sau-color-text);
    }

    .sau-delete-modal-icon {
      width: 3rem;
      height: 3rem;
      margin: 0 auto 1rem;
      padding: 0.75rem;
      border-radius: 9999px;
      background: rgb(254, 226, 226);
      color: var(--sau-color-delete);
    }

    .sau-delete-modal-title {
      margin: 0 0 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--sau-color-text);
    }

    .sau-delete-modal-message {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
      color: rgb(107, 114, 128);
    }

    .sau-delete-modal-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .sau-delete-modal-actions button {
      flex: 1;
      padding: 0.55rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color .15s ease, border-color .15s ease;
    }

    .sau-delete-modal-cancel {
      border: 1px solid rgb(209, 213, 219);
      background: var(--sau-color-background, #fff);
      color: var(--sau-color-text);
    }

    .sau-delete-modal-cancel:hover {
      background: rgb(249, 250, 251);
    }

    .sau-delete-modal-confirm {
      border: 1px solid var(--sau-color-delete);
      background: var(--sau-color-delete);
      color: #fff;
    }

    .sau-delete-modal-confirm:hover {
      background: rgb(220, 38, 38);
      border-color: rgb(220, 38, 38);
    }
  `]
})
export class DeleteModalComponent {
  /** Name/label of the item being deleted, shown in the confirmation message. */
  @Input() name = '';
  /** Entity type, e.g. 'Company'. Shown in the title ("Delete Company"). */
  @Input() entity = 'item';

  private modalRef = inject<ModalRef<DeleteModalComponent>>(ModalRef);

  confirm(): void {
    this.modalRef.close(true);
  }

  cancel(): void {
    this.modalRef.dismiss(false);
  }
}
