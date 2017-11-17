import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleQueryListPage } from './schedule-query-list';

@NgModule({
  declarations: [
    ScheduleQueryListPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleQueryListPage),
  ],
})
export class ScheduleQueryListPageModule {}
