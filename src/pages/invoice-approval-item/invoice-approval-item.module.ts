import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceApprovalItemPage } from './invoice-approval-item';

@NgModule({
  declarations: [
    InvoiceApprovalItemPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceApprovalItemPage),
  ],
})
export class InvoiceApprovalItemPageModule {}
