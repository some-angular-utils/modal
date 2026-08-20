import { Component, Input, inject } from '@angular/core';
import { ModalRef } from '@some-angular-utils/modal';

@Component({
  selector: 'app-rename-dialog',
  template: `
    <div class="app-rename-dialog">
      <h2 class="app-rename-dialog-title">{{ label }}</h2>

      <input
        class="app-rename-dialog-input"
        type="text"
        [value]="value"
        (input)="onInput($event)"
        (keydown.enter)="confirm()"
      />

      <div class="app-rename-dialog-actions">
        <button type="button" class="app-rename-dialog-cancel" (click)="cancel()">Cancel</button>
        <button type="button" class="app-rename-dialog-confirm" (click)="confirm()">Save</button>
      </div>
    </div>
  `,
  // A completely different shape of component from ConfirmDialogComponent (a form
  // instead of a confirm/cancel prompt, resolving with the typed string) — SAUModalService.open()
  // doesn't know or care, it just mounts whatever component you give it.
  styles: [`
    .app-rename-dialog {
      padding: 1.75rem;
      text-align: left;
    }

    .app-rename-dialog-title {
      margin: 0 0 1rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--sau-color-text, rgb(31, 41, 55));
    }

    .app-rename-dialog-input {
      box-sizing: border-box;
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 0.9rem;
      color: var(--sau-color-text, rgb(31, 41, 55));
      background: var(--sau-color-background, #fff);
    }

    .app-rename-dialog-input:focus {
      outline: none;
      border-color: var(--sau-color-primary, rgb(147, 51, 234));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--sau-color-primary, rgb(147, 51, 234)) 20%, transparent);
    }

    .app-rename-dialog-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .app-rename-dialog-actions button {
      flex: 1;
      padding: 0.55rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color .15s ease, border-color .15s ease;
    }

    .app-rename-dialog-cancel {
      border: 1px solid rgb(209, 213, 219);
      background: var(--sau-color-background, #fff);
      color: var(--sau-color-text, rgb(31, 41, 55));
    }

    .app-rename-dialog-cancel:hover {
      background: rgb(249, 250, 251);
    }

    .app-rename-dialog-confirm {
      border: 1px solid var(--sau-color-primary, rgb(147, 51, 234));
      background: var(--sau-color-primary, rgb(147, 51, 234));
      color: #fff;
    }

    .app-rename-dialog-confirm:hover {
      filter: brightness(0.9);
    }
  `],
})
export class RenameDialogComponent {
  /** Field label shown above the input. */
  @Input() label = 'Name';
  /** Starting value of the input. */
  @Input() value = '';

  private modalRef = inject<ModalRef<RenameDialogComponent>>(ModalRef);

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

  confirm(): void {
    this.modalRef.close(this.value);
  }

  cancel(): void {
    this.modalRef.dismiss(false);
  }
}
