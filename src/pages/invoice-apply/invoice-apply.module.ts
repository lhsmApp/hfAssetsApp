import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceApplyPage } from './invoice-apply';

@NgModule({
  declarations: [
    InvoiceApplyPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceApplyPage),
  ],
})
export class InvoiceApplyPageModule {}
