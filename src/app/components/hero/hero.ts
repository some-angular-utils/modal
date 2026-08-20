import { Component, signal } from '@angular/core';
import { DeleteModalComponent, ModalRef } from '@some-angular-utils/modal';

@Component({
  selector: 'app-hero',
  imports: [DeleteModalComponent],
  // The hero preview renders <sau-delete-modal> inline (not through SAUModalService) so it
  // sits inside the mock browser card instead of a full-page overlay. DeleteModalComponent
  // injects ModalRef itself, so a throwaway instance is provided here just to satisfy that.
  providers: [{ provide: ModalRef, useValue: new ModalRef() }],
  templateUrl: './hero.html',
})
export class HeroComponent {
  copied = signal(false);

  copyInstall() {
    navigator.clipboard?.writeText('npm install @some-angular-utils/modal');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
