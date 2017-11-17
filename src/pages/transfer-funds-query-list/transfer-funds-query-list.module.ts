import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferFundsQueryListPage } from './transfer-funds-query-list';
import { TabTransferFundsQueryDirective } from '../../directive/tab-transfer-funds-query.directive';

@NgModule({
  declarations: [
    TransferFundsQueryListPage,
    TabTransferFundsQueryDirective,
  ],
  imports: [
    IonicPageModule.forChild(TransferFundsQueryListPage),
  ],
})
export class TransferFundsQueryListPageModule {}
