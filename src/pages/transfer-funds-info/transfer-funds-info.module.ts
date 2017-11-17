import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferFundsInfoPage } from './transfer-funds-info';

@NgModule({
  declarations: [
    TransferFundsInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferFundsInfoPage),
  ],
})
export class TransferFundsInfoPageModule {}
