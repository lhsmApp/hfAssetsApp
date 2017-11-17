import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetDetailsListInfoPage } from './asset-details-list-info';

@NgModule({
  declarations: [
    AssetDetailsListInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetDetailsListInfoPage),
  ],
})
export class AssetDetailsListInfoPageModule {}
