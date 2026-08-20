import { Component, inject, signal } from '@angular/core';
import { SAUModalService } from '@some-angular-utils/modal';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
})
export class HeroComponent {
  private sauModalService = inject(SAUModalService);

  copied = signal(false);

  copyInstall() {
    navigator.clipboard?.writeText('npm install @some-angular-utils/modal');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  openDemo(): void {
    const modalRef = this.sauModalService.open(AlertDialogComponent, {});
    modalRef.componentInstance.title = 'It works!';
    modalRef.componentInstance.message = 'This dialog was opened with a single SAUModalService.open() call.';
  }
}
