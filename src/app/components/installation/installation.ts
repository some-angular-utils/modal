import { Component } from '@angular/core';

@Component({
  selector: 'app-installation',
  templateUrl: './installation.html',
})
export class InstallationComponent {
  installSnippet = `npm install @some-angular-utils/modal`;

  importSnippet = `import { SAUModalService } from '@some-angular-utils/modal';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  // ...
})
export class CompaniesComponent {
  private sauModalService = inject(SAUModalService);
  // ...
}`;

  usageSnippet = `deleteCompany(company: Company) {
  // ConfirmDialogComponent is just a component you wrote — the service
  // doesn't ship one for you, it opens whatever you pass it.
  const modalRef = this.sauModalService.open(ConfirmDialogComponent, {});
  modalRef.componentInstance.name = company.name;
  modalRef.componentInstance.entity = 'Company';

  modalRef.result.then(
    () => this.removeFromList(company.id),
    () => {}, // cancelled
  );
}`;

  templateSnippet = `<button (click)="deleteCompany(company)">
  Delete
</button>`;
}
