import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetDetailsInfoPage } from './asset-details-info';

@NgModule({
  declarations: [
    AssetDetailsInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetDetailsInfoPage),
  ],
})
export class AssetDetailsInfoPageModule {}
