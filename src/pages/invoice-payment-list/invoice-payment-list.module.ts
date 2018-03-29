import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicePaymentListPage } from './invoice-payment-list';
import { TabInvoicePaymentListDirective } from "../../directive";

@NgModule({
  declarations: [
    InvoicePaymentListPage,
    TabInvoicePaymentListDirective
  ],
  imports: [
    IonicPageModule.forChild(InvoicePaymentListPage),
  ],
})
export class InvoicePaymentListPageModule {}
