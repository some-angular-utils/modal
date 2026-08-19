import { Component } from '@angular/core';

@Component({
  selector: 'app-installation',
  templateUrl: './installation.html',
})
export class InstallationComponent {
  installSnippet = `npm install @some-angular-utils/modal`;

  importSnippet = `import { ModalService, DeleteModalComponent } from '@some-angular-utils/modal';

@Component({
  // ...
})
export class CompaniesComponent {
  private modalService = inject(ModalService);
  // ...
}`;

  usageSnippet = `deleteCompany(company: Company) {
  const modalRef = this.modalService.open(DeleteModalComponent, {});
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
