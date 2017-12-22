import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillGclPage } from './bill-gcl';
//指令
import { GclTypeDirective } from "../../directive";

@NgModule({
  declarations: [
    BillGclPage,
    GclTypeDirective
  ],
  imports: [
    IonicPageModule.forChild(BillGclPage),
  ],
})
export class BillGclPageModule {}
