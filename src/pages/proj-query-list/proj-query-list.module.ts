import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjQueryListPage } from './proj-query-list';

@NgModule({
  declarations: [
    ProjQueryListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjQueryListPage),
  ],
})
export class ProjQueryListPageModule {}
