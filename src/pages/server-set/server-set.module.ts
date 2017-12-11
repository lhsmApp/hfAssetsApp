import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServerSetPage } from './server-set';

@NgModule({
  declarations: [
    ServerSetPage,
  ],
  imports: [
    IonicPageModule.forChild(ServerSetPage),
  ],
})
export class ServerSetPageModule {}
