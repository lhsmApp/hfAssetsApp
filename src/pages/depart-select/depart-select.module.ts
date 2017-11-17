import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartSelectPage } from './depart-select';

@NgModule({
  declarations: [
    DepartSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(DepartSelectPage),
  ],
})
export class DepartSelectPageModule {}
