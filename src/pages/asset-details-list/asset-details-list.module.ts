import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetDetailsListPage } from './asset-details-list';

@NgModule({
  declarations: [
    AssetDetailsListPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetDetailsListPage),
  ],
})
export class AssetDetailsListPageModule {}
