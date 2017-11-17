import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcceptApplyListPage } from './accept-apply-list';
import { TabAcceptApplyDirective } from "../../directive/";

@NgModule({
  declarations: [
    AcceptApplyListPage,
    TabAcceptApplyDirective
  ],
  imports: [
    IonicPageModule.forChild(AcceptApplyListPage),
  ],
})
export class AcceptApplyListPageModule {
	
}
