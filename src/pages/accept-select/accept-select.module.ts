import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcceptSelectPage } from './accept-select';
//指令
import { TabAcceptSelectDirective } from "../../directive/";

@NgModule({
  declarations: [
    AcceptSelectPage,
    TabAcceptSelectDirective
  ],
  imports: [
    IonicPageModule.forChild(AcceptSelectPage),
  ],
})
export class AcceptSelectPageModule {}
