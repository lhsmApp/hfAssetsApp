import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticeQueryListPage } from './notice-query-list';

@NgModule({
  declarations: [
    NoticeQueryListPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticeQueryListPage),
  ],
})
export class NoticeQueryListPageModule {}
