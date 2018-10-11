import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TfLoginPage } from './tf-login';

@NgModule({
  declarations: [
    TfLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(TfLoginPage),
  ],
})
export class TfLoginPageModule {}
