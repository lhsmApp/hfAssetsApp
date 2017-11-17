import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttachmentAddPage } from './attachment-add';

@NgModule({
  declarations: [
    AttachmentAddPage,
  ],
  imports: [
    IonicPageModule.forChild(AttachmentAddPage),
  ],
})
export class AttachmentAddPageModule {}
