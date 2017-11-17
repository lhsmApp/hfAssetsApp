import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractApprovalPage } from './contract-approval';

@NgModule({
  declarations: [
    ContractApprovalPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractApprovalPage),
  ],
})
export class ContractApprovalPageModule {}
