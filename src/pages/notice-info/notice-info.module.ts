import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticeInfoPage } from './notice-info';

@NgModule({
  declarations: [
    NoticeInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticeInfoPage),
  ],
})
export class NoticeInfoPageModule {}
