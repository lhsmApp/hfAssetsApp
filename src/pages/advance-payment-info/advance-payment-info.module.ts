import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancePaymentInfoPage } from './advance-payment-info';

@NgModule({
  declarations: [
    AdvancePaymentInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdvancePaymentInfoPage),
  ],
})
export class AdvancePaymentInfoPageModule {}
