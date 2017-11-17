import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractChoiceListPage } from './contract-choice-list';

@NgModule({
  declarations: [
    ContractChoiceListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractChoiceListPage),
  ],
})
export class ContractChoiceListPageModule {}
