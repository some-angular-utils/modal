export interface ModalOptions {
  /** Dialog width. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Set to 'static' to keep the modal open when the backdrop is clicked. Defaults to true. */
  backdrop?: boolean | 'static';
  /** Whether pressing Escape dismisses the modal. Defaults to true. */
  keyboard?: boolean;
}
