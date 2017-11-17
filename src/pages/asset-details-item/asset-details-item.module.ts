import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetDetailsItemPage } from './asset-details-item';

@NgModule({
  declarations: [
    AssetDetailsItemPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetDetailsItemPage),
  ],
})
export class AssetDetailsItemPageModule {}
