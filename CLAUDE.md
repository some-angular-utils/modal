# CLAUDE.md

Contexto para trabajar en este repo. Es un workspace de Angular con dos proyectos, con la misma estructura que el repo hermano `table` (`@some-angular-utils/table`):

- **`modal`** (`src/app`) — la landing page/showcase de la librería. No es un producto real, no tiene backend.
- **`@some-angular-utils/modal`** (`projects/some-angular-utils/modal`) — la librería Angular publicable de verdad (`SAUModalService` + `DeleteModalComponent`).

## Árbol del código

```
modal/
├── CLAUDE.md
├── README.md
├── angular.json
├── package.json
├── tsconfig.json                       # mapea "@some-angular-utils/modal" -> dist/some-angular-utils/modal
│
├── src/                                 # app showcase (proyecto "modal")
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss                      # Tailwind v4 (@import "tailwindcss" + @theme, sin tailwind.config.js)
│   └── app/
│       ├── app.ts / app.html / app.scss / app.config.ts / app.routes.ts
│       └── components/
│           ├── navbar/         navbar.ts                — barra superior fija
│           ├── hero/            hero.ts, hero.html        — sección de portada, renderiza <sau-delete-modal> inline
│           ├── features/        features.ts, features.html — grid de características
│           ├── demos/           demos.ts, demos.html       — "See it in action": demos editables en vivo + una lista interactiva
│           ├── code-editor/     code-editor.ts/html/scss   — mini editor de código reutilizable (usado por demos)
│           ├── installation/    installation.ts, installation.html — instrucciones de instalación/uso
│           └── footer/          footer.ts                  — pie de página
│
└── projects/some-angular-utils/modal/   # la librería publicable
    └── src/
        ├── public-api.ts                       # exports públicos del paquete npm
        └── lib/
            ├── modal.service.ts                # SAUModalService.open() — crea el contenedor con createComponent() y lo cuelga de <body>
            ├── modal-ref.ts                     # ModalRef — componentInstance + result (Promise), close()/dismiss()
            ├── modal-options.ts                 # ModalOptions — size / backdrop / keyboard
            ├── modal-container/                 # componente interno: backdrop + diálogo centrado + host de contenido dinámico
            ├── delete-modal/                    # DeleteModalComponent — diálogo de confirmación genérico (name/entity)
            └── icons/                           # trash/xmark como componentes standalone (encapsulation por defecto, no None)
```

## Cómo funciona `SAUModalService.open()`

No requiere ningún anchor/host en la app (nada de `<router-outlet>`-style placeholder ni NgModule). `open(Component, options)`:

1. Crea `ModalContainerComponent` con `createComponent()` + lo adjunta a `ApplicationRef` (`attachView`) y lo cuelga directamente de `document.body`.
2. Fuerza un `detectChanges()` inicial para que el `ViewChild` estático (`contentHost`, un `ViewContainerRef`) y el nodo DOM existan de forma síncrona antes de seguir.
3. Crea el componente pedido dentro de `contentHost`, con un injector hijo que provee `ModalRef` — así el componente montado puede hacer `inject(ModalRef)` para cerrarse a sí mismo (ver `delete-modal.component.ts`).
4. Devuelve un `ModalRef`: `componentInstance` (la instancia recién creada, para setear `@Input()`s justo después de `open()`) y `result` (una promise que resuelve con `close(valor)` y rechaza con `dismiss(razon)`), replicando la API clásica de `NgbModalRef` (`modalRef.componentInstance.x = y; modalRef.result.then(onConfirm, onCancel)`).

## Bug real encontrado y corregido: `:host` no funciona con `ViewEncapsulation.None`

`ModalContainerComponent` y `DeleteModalComponent` usan `encapsulation: ViewEncapsulation.None` (igual que `table.ts` en el repo hermano, para permitir custom properties CSS globales sin rebuild). **Con `ViewEncapsulation.None`, Angular no reescribe el selector `:host`** — al no haber scoping, el compilador simplemente concatena el CSS tal cual como una hoja de estilos global, y `:host` no es un selector CSS válido fuera de ese contexto, así que nunca matchea nada. Confirmado probando en el navegador: un `ModalContainerComponent` con `:host { position: fixed; inset: 0; ... }` se renderizaba sin overlay visible en absoluto (el diálogo terminaba en flujo normal al final de `<body>`, invisible en el viewport).

La solución (y el patrón ya usado por `table.scss` vía la clase `.sau-table`) es **nunca usar `:host` en un componente con `encapsulation: None`** — hay que apuntar directamente al nombre de la etiqueta del propio host (`sau-modal-container { ... }`, ya que el nombre de la etiqueta HTML real coincide con el selector del componente) o a una clase en la raíz de la plantilla (`.sau-delete-modal { ... }`, como hace `DeleteModalComponent` para sus custom properties). Si en el futuro se añade un componente nuevo con `encapsulation: None`, no usar `:host` ahí tampoco.

## El orden de build importa

La app importa la librería como `@some-angular-utils/modal`, que `tsconfig.json` mapea a `./dist/some-angular-utils/modal` — **no** al código fuente. Si editas algo dentro de `projects/some-angular-utils/modal/src`, hay que reconstruir antes de que la app lo vea:

```bash
npm run build:lib   # ng-packagr -> dist/some-angular-utils/modal
```

`ng serve` (usa Vite) pre-empaqueta dependencias y **no** recoge de forma confiable un `dist/` recién construido. Después de `build:lib`, mata y reinicia `ng serve` (o borra `.angular/cache` antes) — no asumas que el hot-reload lo detectó.

## Cómo funciona el editor de las demos en vivo (`src/app/components/demos`)

Sigue el mismo patrón que el repo `table`: cada pestaña "js"/"css" tiene su propio mini editor de código (`src/app/components/code-editor`), enlazado a un string de configuración. Al editar (debounce ~600ms), el texto se evalúa con `new Function('"use strict"; return (' + texto + ');')()` — mismo modelo de confianza que un playground de JS (CodePen/StackBlitz), es intencional. El objeto resultante (`demo.parsed()`) alimenta el botón "Open modal" de cada pestaña, que llama a `sauModalService.open(DeleteModalComponent, { size, backdrop, keyboard })` y setea `componentInstance.name/entity`.

La pestaña **"list"** es de tipo `interactive` (no tiene editor de código): es el caso de uso real, una tabla de compañías con un botón "Delete" por fila que abre el modal y, al confirmar, quita la fila de `listItems` (un signal mutado directamente, no derivado de config evaluada).

La pestaña **"theme"** inyecta el CSS dinámico vía `Renderer2` + `DOCUMENT` (un único `<style>` creado en el constructor, actualizado dentro de un `effect()`, eliminado en `ngOnDestroy`) apuntando a `sau-modal-container, .sau-delete-modal { ... }` — **no** a un `<style [textContent]>` literal en la plantilla, porque Angular extrae las etiquetas `<style>` de las plantillas en tiempo de compilación y un binding de propiedad ahí nunca llega al DOM en runtime (mismo gotcha documentado en el CLAUDE.md de `table`).

## Tailwind v4

No hay `tailwind.config.js` — v4 se configura con `@import "tailwindcss";` + un bloque `@theme { ... }` directamente en `src/styles.scss`, procesado por `@tailwindcss/postcss` (ver `.postcssrc.json`). La escala de color de marca (`brand-50`...`brand-900`) vive ahí. El IDE puede marcar "Unknown at rule @theme" como advertencia — es solo que el linter no conoce la sintaxis de Tailwind v4, no es un error de build.

## Gotcha de rutas en Windows + git-bash (solo importa al scriptear/probar con la herramienta Bash)

El `/tmp` de git-bash está mapeado a `AppData/Local/Temp`, pero un proceso `node.exe` nativo resuelve un string literal `'/tmp/...'` pasado como argumento JS relativo a la raíz de la unidad actual (`C:\tmp\...`) en su lugar — **no** son el mismo directorio. Si un script de Node escribe archivos en `/tmp/...` y la herramienta Bash no los encuentra después, revisar primero `C:\tmp\...` antes de asumir que la escritura falló.
