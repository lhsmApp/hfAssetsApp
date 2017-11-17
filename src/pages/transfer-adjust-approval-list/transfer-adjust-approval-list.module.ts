import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferAdjustApprovalListPage } from './transfer-adjust-approval-list';
import { TabTransferAdjustApprovalDirective } from "../../directive/";

@NgModule({
  declarations: [
    TransferAdjustApprovalListPage,
    TabTransferAdjustApprovalDirective
  ],
  imports: [
    IonicPageModule.forChild(TransferAdjustApprovalListPage),
  ],
})
export class TransferAdjustApprovalListPageModule {}
