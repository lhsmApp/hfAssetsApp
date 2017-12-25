import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillGclSelectPage } from './bill-gcl-select';
//指令
import { GclTypeApplyDirective } from "../../directive";

@NgModule({
  declarations: [
    BillGclSelectPage,
    GclTypeApplyDirective
  ],
  imports: [
    IonicPageModule.forChild(BillGclSelectPage),
  ],
})
export class BillGclSelectPageModule {}
