import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferAdjustAssetListPage } from './transfer-adjust-asset-list';

@NgModule({
  declarations: [
    TransferAdjustAssetListPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferAdjustAssetListPage),
  ],
})
export class TransferAdjustAssetListPageModule {}
