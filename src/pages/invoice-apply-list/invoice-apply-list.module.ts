import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceApplyListPage } from './invoice-apply-list';

@NgModule({
  declarations: [
    InvoiceApplyListPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceApplyListPage),
  ],
})
export class InvoiceApplyListPageModule {}
