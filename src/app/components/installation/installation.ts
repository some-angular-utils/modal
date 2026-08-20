import { Component } from '@angular/core';

@Component({
  selector: 'app-installation',
  templateUrl: './installation.html',
})
export class InstallationComponent {
  installSnippet = `npm install @some-angular-utils/modal`;

  importSnippet = `import { SAUModalService, DeleteModalComponent } from '@some-angular-utils/modal';

@Component({
  // ...
})
export class CompaniesComponent {
  private sauModalService = inject(SAUModalService);
  // ...
}`;

  usageSnippet = `deleteCompany(company: Company) {
  const modalRef = this.sauModalService.open(DeleteModalComponent, {});
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
