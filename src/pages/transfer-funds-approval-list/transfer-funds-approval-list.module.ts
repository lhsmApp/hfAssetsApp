import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferFundsApprovalListPage } from './transfer-funds-approval-list';
import { TabTransferFundsApprovalDirective } from '../../directive/tab-transfer-funds-approval.directive';

@NgModule({
  declarations: [
    TransferFundsApprovalListPage,
    TabTransferFundsApprovalDirective,
  ],
  imports: [
    IonicPageModule.forChild(TransferFundsApprovalListPage),
  ],
})
export class TransferFundsApprovalListPageModule {}
