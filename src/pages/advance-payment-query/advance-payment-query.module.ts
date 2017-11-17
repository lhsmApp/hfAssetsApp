import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancePaymentQueryPage } from './advance-payment-query';
//指令
import { TabQueryDirective } from "../../directive/";

@NgModule({
  declarations: [
    AdvancePaymentQueryPage,
    TabQueryDirective
  ],
  imports: [
    IonicPageModule.forChild(AdvancePaymentQueryPage),
  ],
})
export class AdvancePaymentQueryPageModule {}
