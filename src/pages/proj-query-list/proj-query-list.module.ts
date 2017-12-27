import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjQueryListPage } from './proj-query-list';
import { TabProjQueryDirective } from "../../directive/";

@NgModule({
  declarations: [
    ProjQueryListPage,
    TabProjQueryDirective
  ],
  imports: [
    IonicPageModule.forChild(ProjQueryListPage),
  ],
})
export class ProjQueryListPageModule {}
