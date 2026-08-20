# @some-angular-utils/modal

[![github stars](https://img.shields.io/github/stars/some-angular-utils/modal.svg?style=social&label=Star)](https://github.com/some-angular-utils/modal)

[![NPM Version](https://img.shields.io/npm/v/@some-angular-utils/modal)](https://www.npmjs.com/package/@some-angular-utils/modal)
[![NPM Downloads](https://img.shields.io/npm/dm/@some-angular-utils/modal)](https://www.npmjs.com/package/@some-angular-utils/modal)

[![npm bundle size](https://img.shields.io/bundlephobia/min/@some-angular-utils/modal)](https://www.npmjs.com/package/@some-angular-utils/modal)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@some-angular-utils/modal)](https://www.npmjs.com/package/@some-angular-utils/modal)

---

[NPM](https://www.npmjs.com/package/@some-angular-utils/modal)

---

## DEMO

This repo ships with an interactive showcase app — every feature has a live, editable example (edit the code, open the dialog). Run it locally:

```bash
npm install
npm run dev
```

Then open http://localhost:4200.

## IMPORT
```ts
import { SAUModalService } from '@some-angular-utils/modal';
```

The library doesn't ship a dialog component — `open()` takes any component of your own (standalone, injecting `ModalRef` if it needs to close/dismiss itself):

```ts
import { Component, Input, inject } from '@angular/core';
import { ModalRef } from '@some-angular-utils/modal';

@Component({ selector: 'app-confirm-dialog', template: `...` })
export class ConfirmDialogComponent {
  @Input() name = '';
  @Input() entity = 'item';

  private modalRef = inject<ModalRef<ConfirmDialogComponent>>(ModalRef);

  confirm(): void { this.modalRef.close(true); }
  cancel(): void { this.modalRef.dismiss(false); }
}
```

## TYPESCRIPT
```ts
private sauModalService = inject(SAUModalService);

deleteCompany(company: Company) {
  const modalRef = this.sauModalService.open(ConfirmDialogComponent, {});
  modalRef.componentInstance.name = company.name;
  modalRef.componentInstance.entity = 'Company';

  modalRef.result.then(
    () => this.removeFromList(company.id), // confirmed
    () => {},                              // cancelled
  );
}
```

## OPTIONS
```ts
this.sauModalService.open(ConfirmDialogComponent, {
  size: 'lg',        // 'sm' | 'md' | 'lg', defaults to 'md'
  backdrop: 'static', // true | false | 'static' — 'static' keeps it open on outside click
  keyboard: false,    // whether Escape dismisses it, defaults to true
});
```

## COLORS

```css
sau-modal {
    --sau-color-primary: rgb(147, 51, 234);
    --sau-color-background: rgb(255, 255, 255);
    --sau-color-text: rgb(31, 41, 55);
}
```

These custom properties cascade from `<sau-modal>` down into whatever component you open, so your own component's styles can reference them too (e.g. `var(--sau-color-background, #fff)`).
