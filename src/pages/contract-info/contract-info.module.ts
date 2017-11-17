import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractInfoPage } from './contract-info';

@NgModule({
  declarations: [
    ContractInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractInfoPage),
  ],
})
export class ContractInfoPageModule {}
