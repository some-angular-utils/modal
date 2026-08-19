import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      title: 'No host markup',
      description:
        'No anchor component, no NgModule, no router-outlet-style placeholder. ModalService.open() creates the dialog and appends it to <body> on demand.',
      icon: 'M4 6h16M4 12h16M4 18h16',
    },
    {
      title: 'Promise-based result',
      description:
        'modalRef.result resolves with whatever close() was called with, and rejects with whatever dismiss() was called with — chain it with .then(onConfirm, onCancel).',
      icon: 'M5 13l4 4L19 7',
    },
    {
      title: 'Any component, not just dialogs',
      description:
        'Open your own standalone component. Set its @Input()s via modalRef.componentInstance right after open() — it works exactly like ng-bootstrap\'s NgbModal.',
      icon: 'M4 4h16v16H4z M4 9h16',
    },
    {
      title: 'Backdrop & keyboard control',
      description:
        'Dismiss on backdrop click and Escape by default, or lock it down per call with { backdrop: \'static\', keyboard: false }.',
      icon: 'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M18.4 5.6L17 7m-10 10l-1.4 1.4',
    },
    {
      title: 'Delete confirmation, ready to wire',
      description:
        'DeleteModalComponent ships in the package — set name and entity, hook it to a table\'s deleteEvent, done.',
      icon: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    },
    {
      title: 'Themeable & sized',
      description:
        'Every color is a CSS custom property, and { size: \'sm\' | \'md\' | \'lg\' } controls the dialog width — no rebuild required.',
      icon: 'M9 5l7 7-7 7',
    },
  ];
}
