import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcceptApprovalListPage } from './accept-approval-list';
import { TabAcceptApprovalDirective } from "../../directive/";

@NgModule({
  declarations: [
    AcceptApprovalListPage,
    TabAcceptApprovalDirective
  ],
  imports: [
    IonicPageModule.forChild(AcceptApprovalListPage),
  ],
})
export class AcceptApprovalListPageModule {}
