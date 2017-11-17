import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttachmentInfoPage } from './attachment-info';

@NgModule({
  declarations: [
    AttachmentInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AttachmentInfoPage),
  ],
})
export class AttachmentInfoPageModule {}
