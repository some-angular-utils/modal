/**
 * Handle returned by `SAUModalService.open()`.
 *
 * Mirrors the classic `NgbModalRef` shape so existing call sites that do
 * `modalRef.componentInstance.x = y` and `modalRef.result.then(onConfirm, onCancel)`
 * work unchanged.
 */
export class ModalRef<T = unknown> {
  /** The instance of the component rendered inside the modal. Set inputs on it right after `open()`. */
  componentInstance!: T;

  /** Resolves with the value passed to `close()`, rejects with the value passed to `dismiss()`. */
  readonly result: Promise<unknown>;

  private resolveFn!: (value: unknown) => void;
  private rejectFn!: (reason?: unknown) => void;
  private teardown: () => void = () => {};

  constructor() {
    this.result = new Promise<unknown>((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }

  /** @internal wired by SAUModalService once the modal's view exists in the DOM */
  _bindTeardown(teardown: () => void): void {
    this.teardown = teardown;
  }

  /** Confirms the modal: resolves `result` and removes it from the DOM. */
  close(result?: unknown): void {
    this.teardown();
    this.resolveFn(result);
  }

  /** Cancels the modal: rejects `result` and removes it from the DOM. */
  dismiss(reason?: unknown): void {
    this.teardown();
    this.rejectFn(reason);
  }
}
