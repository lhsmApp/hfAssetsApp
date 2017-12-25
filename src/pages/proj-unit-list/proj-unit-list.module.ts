import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjUnitListPage } from './proj-unit-list';

@NgModule({
  declarations: [
    ProjUnitListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjUnitListPage),
  ],
})
export class ProjUnitListPageModule {}
