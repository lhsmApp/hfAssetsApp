import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancePaymentApplyListPage } from './advance-payment-apply-list';
//指令
import { TabDirective } from "../../directive/";

@NgModule({
  declarations: [
    AdvancePaymentApplyListPage,
    TabDirective
  ],
  imports: [
    IonicPageModule.forChild(AdvancePaymentApplyListPage),
  ],
})
export class AdvancePaymentApplyListPageModule {}
