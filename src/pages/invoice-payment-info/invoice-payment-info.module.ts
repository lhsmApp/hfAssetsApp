import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicePaymentInfoPage } from './invoice-payment-info';

@NgModule({
  declarations: [
    InvoicePaymentInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoicePaymentInfoPage),
  ],
})
export class InvoicePaymentInfoPageModule {}
