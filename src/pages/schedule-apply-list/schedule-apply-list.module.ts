import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleApplyListPage } from './schedule-apply-list';

@NgModule({
  declarations: [
    ScheduleApplyListPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleApplyListPage),
  ],
})
export class ScheduleApplyListPageModule {}
