import { Component, OnDestroy, Renderer2, WritableSignal, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SAUModalService } from '@some-angular-utils/modal';
import { CodeEditorComponent } from '../code-editor/code-editor';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { RenameDialogComponent } from '../rename-dialog/rename-dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog';

type DemoId = 'basic' | 'sizes' | 'backdrop' | 'form' | 'alert' | 'list' | 'theme';
type DemoKind = 'js' | 'css' | 'interactive';

interface DemoEntry {
  id: DemoId;
  label: string;
  description: string;
  kind: DemoKind;
  initialCode: string;
  code: WritableSignal<string>;
  parsed: WritableSignal<any>;
  error: WritableSignal<string | null>;
}

interface ListItem {
  id: number;
  name: string;
  taxId: string;
}

function evalConfig(text: string): any {
  return new Function(`"use strict"; return (\n${text}\n);`)();
}

function createDemo(id: DemoId, label: string, description: string, kind: DemoKind, initialCode: string): DemoEntry {
  const initialParsed = kind === 'css' ? { css: initialCode } : kind === 'interactive' ? {} : evalConfig(initialCode);
  return {
    id,
    label,
    description,
    kind,
    initialCode,
    code: signal(initialCode),
    parsed: signal<any>(initialParsed),
    error: signal<string | null>(null),
  };
}

const BASIC_CODE = `{
  name: 'Acme Corp',
  entity: 'Company',
}`;

const SIZES_CODE = `{
  size: 'lg',
  name: 'Production Database',
  entity: 'Database',
}`;

const BACKDROP_CODE = `{
  backdrop: 'static',
  keyboard: false,
  name: 'main.tf',
  entity: 'File',
}`;

const FORM_CODE = `{
  label: 'Document name',
  value: 'Untitled document',
}`;

const ALERT_CODE = `{
  title: 'Update available',
  message: 'Version 2.4 is ready to install.',
}`;

const THEME_CODE = `--sau-color-accent: rgb(220, 38, 38);
--sau-color-background: rgb(255, 255, 255);
--sau-color-text: rgb(31, 41, 55);`;

const INITIAL_LIST_ITEMS: ListItem[] = [
  { id: 1, name: 'Acme Corp', taxId: 'B12345678' },
  { id: 2, name: 'Globex Inc', taxId: 'B87654321' },
  { id: 3, name: 'Initech', taxId: 'B11223344' },
];

@Component({
  selector: 'app-demos',
  imports: [CodeEditorComponent],
  templateUrl: './demos.html',
})
export class DemosComponent implements OnDestroy {
  private sauModalService = inject(SAUModalService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private themeStyleEl = this.renderer.createElement('style') as HTMLStyleElement;

  activeTab = signal<DemoId>('basic');
  eventLog = signal<string | null>(null);
  listItems = signal<ListItem[]>(INITIAL_LIST_ITEMS);

  demos: DemoEntry[] = [
    createDemo('basic', 'Basic confirm', 'One call opens the dialog — the returned promise tells you what the visitor chose.', 'js', BASIC_CODE),
    createDemo('sizes', 'Sizes', "Pass size in the options: 'sm', 'md' or 'lg' control the dialog width.", 'js', SIZES_CODE),
    createDemo('backdrop', 'Backdrop & keyboard', "Set backdrop to 'static' and keyboard to false to force an explicit choice — clicking outside or pressing Escape won't close it.", 'js', BACKDROP_CODE),
    createDemo('form', 'A form, not just confirm/cancel', "open() doesn't know or care what shape the component is — this one is a text input that resolves with whatever was typed.", 'js', FORM_CODE),
    createDemo('alert', 'A single-button announcement', 'Same call, a completely different component again — no cancel path at all, just acknowledge and close.', 'js', ALERT_CODE),
    createDemo('list', 'Delete from a list', 'The real-world case: a delete button per row, wired to the modal, removing the row once it confirms.', 'interactive', ''),
    createDemo('theme', 'Theming', 'Every color is a CSS custom property on the dialog. Edit the values below, then open the dialog.', 'css', THEME_CODE),
  ];

  constructor() {
    this.renderer.appendChild(this.document.head, this.themeStyleEl);

    for (const demo of this.demos) {
      if (demo.kind === 'interactive') continue;

      let timer: ReturnType<typeof setTimeout> | undefined;

      effect(() => {
        const text = demo.code();

        if (demo.kind === 'css') {
          demo.parsed.set({ css: text });
          demo.error.set(null);
          this.renderer.setProperty(
            this.themeStyleEl,
            'textContent',
            `sau-modal, .app-confirm-dialog, .app-rename-dialog, .app-alert-dialog { ${text} }`,
          );
          return;
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            demo.parsed.set(evalConfig(text));
            demo.error.set(null);
          } catch (err) {
            demo.error.set(err instanceof Error ? err.message : 'Invalid code');
          }
        }, 600);
      });
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeChild(this.document.head, this.themeStyleEl);
  }

  selectTab(id: DemoId): void {
    this.activeTab.set(id);
    this.eventLog.set(null);
  }

  setConfigField(demoId: DemoId, field: string, value: string): void {
    const demo = this.demos.find((d) => d.id === demoId);
    if (!demo) return;

    const text = demo.code();
    const regex = new RegExp(`(${field}\\s*:\\s*)'[^']*'`);
    if (!regex.test(text)) return;

    const nextText = text.replace(regex, `$1'${value}'`);
    demo.code.set(nextText);

    try {
      demo.parsed.set(evalConfig(nextText));
      demo.error.set(null);
    } catch (err) {
      demo.error.set(err instanceof Error ? err.message : 'Invalid code');
    }
  }

  openBasic(): void {
    const cfg = this.demos.find((d) => d.id === 'basic')!.parsed();
    const modalRef = this.sauModalService.open(ConfirmDialogComponent, {});
    modalRef.componentInstance.name = cfg.name;
    modalRef.componentInstance.entity = cfg.entity;
    modalRef.result.then(
      () => this.eventLog.set(`Confirmed → ${cfg.name}`),
      () => this.eventLog.set(`Cancelled → ${cfg.name}`),
    );
  }

  openSizes(): void {
    const cfg = this.demos.find((d) => d.id === 'sizes')!.parsed();
    const modalRef = this.sauModalService.open(ConfirmDialogComponent, { size: cfg.size });
    modalRef.componentInstance.name = cfg.name;
    modalRef.componentInstance.entity = cfg.entity;
    modalRef.result.then(
      () => this.eventLog.set(`Confirmed → ${cfg.name} (${cfg.size})`),
      () => this.eventLog.set(`Cancelled → ${cfg.name} (${cfg.size})`),
    );
  }

  openBackdrop(): void {
    const cfg = this.demos.find((d) => d.id === 'backdrop')!.parsed();
    const modalRef = this.sauModalService.open(ConfirmDialogComponent, { backdrop: cfg.backdrop, keyboard: cfg.keyboard });
    modalRef.componentInstance.name = cfg.name;
    modalRef.componentInstance.entity = cfg.entity;
    modalRef.result.then(
      () => this.eventLog.set(`Confirmed → ${cfg.name}`),
      () => this.eventLog.set(`Cancelled → ${cfg.name}`),
    );
  }

  openForm(): void {
    const cfg = this.demos.find((d) => d.id === 'form')!.parsed();
    const modalRef = this.sauModalService.open(RenameDialogComponent, {});
    modalRef.componentInstance.label = cfg.label;
    modalRef.componentInstance.value = cfg.value;
    modalRef.result.then(
      (value) => this.eventLog.set(`Saved → ${value}`),
      () => this.eventLog.set('Cancelled'),
    );
  }

  openAlert(): void {
    const cfg = this.demos.find((d) => d.id === 'alert')!.parsed();
    const modalRef = this.sauModalService.open(AlertDialogComponent, {});
    modalRef.componentInstance.title = cfg.title;
    modalRef.componentInstance.message = cfg.message;
    modalRef.result.then(() => this.eventLog.set('Dismissed'));
  }

  openThemed(): void {
    const modalRef = this.sauModalService.open(ConfirmDialogComponent, {});
    modalRef.componentInstance.name = 'Acme Corp';
    modalRef.componentInstance.entity = 'Company';
    modalRef.result.then(
      () => this.eventLog.set('Confirmed → Acme Corp'),
      () => this.eventLog.set('Cancelled → Acme Corp'),
    );
  }

  deleteListItem(item: ListItem): void {
    const modalRef = this.sauModalService.open(ConfirmDialogComponent, {});
    modalRef.componentInstance.name = item.name;
    modalRef.componentInstance.entity = 'Company';
    modalRef.result.then(
      () => {
        this.listItems.update((list) => list.filter((i) => i.id !== item.id));
        this.eventLog.set(`Deleted → ${item.name}`);
      },
      () => this.eventLog.set(`Cancelled → ${item.name}`),
    );
  }
}
