import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceApplyItemPage } from './invoice-apply-item';

@NgModule({
  declarations: [
    InvoiceApplyItemPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceApplyItemPage),
  ],
})
export class InvoiceApplyItemPageModule {}
