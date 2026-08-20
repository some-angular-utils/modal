import { Component, OnDestroy, Renderer2, WritableSignal, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DeleteModalComponent, SAUModalService } from '@some-angular-utils/modal';
import { CodeEditorComponent } from '../code-editor/code-editor';

type DemoId = 'basic' | 'sizes' | 'backdrop' | 'list' | 'theme';
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

const THEME_CODE = `--sau-color-delete: rgb(220, 38, 38);
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
            `sau-modal-container, .sau-delete-modal { ${text} }`,
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
    const modalRef = this.sauModalService.open(DeleteModalComponent, {});
    modalRef.componentInstance.name = cfg.name;
    modalRef.componentInstance.entity = cfg.entity;
    modalRef.result.then(
      () => this.eventLog.set(`Confirmed → ${cfg.name}`),
      () => this.eventLog.set(`Cancelled → ${cfg.name}`),
    );
  }

  openSizes(): void {
    const cfg = this.demos.find((d) => d.id === 'sizes')!.parsed();
    const modalRef = this.sauModalService.open(DeleteModalComponent, { size: cfg.size });
    modalRef.componentInstance.name = cfg.name;
    modalRef.componentInstance.entity = cfg.entity;
    modalRef.result.then(
      () => this.eventLog.set(`Confirmed → ${cfg.name} (${cfg.size})`),
      () => this.eventLog.set(`Cancelled → ${cfg.name} (${cfg.size})`),
    );
  }

  openBackdrop(): void {
    const cfg = this.demos.find((d) => d.id === 'backdrop')!.parsed();
    const modalRef = this.sauModalService.open(DeleteModalComponent, { backdrop: cfg.backdrop, keyboard: cfg.keyboard });
    modalRef.componentInstance.name = cfg.name;
    modalRef.componentInstance.entity = cfg.entity;
    modalRef.result.then(
      () => this.eventLog.set(`Confirmed → ${cfg.name}`),
      () => this.eventLog.set(`Cancelled → ${cfg.name}`),
    );
  }

  openThemed(): void {
    const modalRef = this.sauModalService.open(DeleteModalComponent, {});
    modalRef.componentInstance.name = 'Acme Corp';
    modalRef.componentInstance.entity = 'Company';
    modalRef.result.then(
      () => this.eventLog.set('Confirmed → Acme Corp'),
      () => this.eventLog.set('Cancelled → Acme Corp'),
    );
  }

  deleteListItem(item: ListItem): void {
    const modalRef = this.sauModalService.open(DeleteModalComponent, {});
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
