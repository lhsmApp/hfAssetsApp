import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancePaymentApprovalPage } from './advance-payment-approval';
//指令
import { YfkTypeDirective } from "../../directive";

@NgModule({
  declarations: [
    AdvancePaymentApprovalPage,
    YfkTypeDirective
  ],
  imports: [
    IonicPageModule.forChild(AdvancePaymentApprovalPage),
  ],
})
export class AdvancePaymentApprovalPageModule {}
