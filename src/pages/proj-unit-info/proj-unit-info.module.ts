import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjUnitInfoPage } from './proj-unit-info';

@NgModule({
  declarations: [
    ProjUnitInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjUnitInfoPage),
  ],
})
export class ProjUnitInfoPageModule {}
