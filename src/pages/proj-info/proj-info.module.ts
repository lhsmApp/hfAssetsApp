import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjInfoPage } from './proj-info';

@NgModule({
  declarations: [
    ProjInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjInfoPage),
  ],
})
export class ProjInfoPageModule {}
