import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractQueryPage } from './contract-query';

@NgModule({
  declarations: [
    ContractQueryPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractQueryPage),
  ],
})
export class ContractQueryPageModule {}
