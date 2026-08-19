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
import { ModalService, DeleteModalComponent } from '@some-angular-utils/modal';
```

## TYPESCRIPT
```ts
private modalService = inject(ModalService);

deleteCompany(company: Company) {
  const modalRef = this.modalService.open(DeleteModalComponent, {});
  modalRef.componentInstance.name = company.name;
  modalRef.componentInstance.entity = 'Company';

  modalRef.result.then(
    () => this.removeFromList(company.id), // confirmed
    () => {},                              // cancelled
  );
}
```

`open()` also accepts any of your own standalone components — set its `@Input()`s via `modalRef.componentInstance` the same way.

## OPTIONS
```ts
this.modalService.open(DeleteModalComponent, {
  size: 'lg',        // 'sm' | 'md' | 'lg', defaults to 'md'
  backdrop: 'static', // true | false | 'static' — 'static' keeps it open on outside click
  keyboard: false,    // whether Escape dismisses it, defaults to true
});
```

## COLORS

```css
sau-modal-container, .sau-delete-modal {
    --sau-color-primary: rgb(147, 51, 234);
    --sau-color-delete: rgb(239, 68, 68);
    --sau-color-background: rgb(255, 255, 255);
    --sau-color-text: rgb(31, 41, 55);
}
```
