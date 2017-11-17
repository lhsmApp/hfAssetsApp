import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcceptQueryListPage } from './accept-query-list';
import { TabAcceptqueryDirective } from "../../directive/";

@NgModule({
  declarations: [
    AcceptQueryListPage,
    TabAcceptqueryDirective
  ],
  imports: [
    IonicPageModule.forChild(AcceptQueryListPage),
  ],
})
export class AcceptQueryListPageModule {}
