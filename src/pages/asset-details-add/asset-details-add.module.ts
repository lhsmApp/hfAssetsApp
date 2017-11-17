import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetDetailsAddPage } from './asset-details-add';

@NgModule({
  declarations: [
    AssetDetailsAddPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetDetailsAddPage),
  ],
})
export class AssetDetailsAddPageModule {}
