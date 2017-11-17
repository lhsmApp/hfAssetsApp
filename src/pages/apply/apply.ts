import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-about',
  templateUrl: 'apply.html'
})
export class ApplyPage {

  constructor(public navCtrl: NavController,private camera: Camera) {

  }

  //预付款申请
  yukApply() {
    this.navCtrl.push("AdvancePaymentApplyListPage");
  }

  //验收申请
  ysApply() {
    this.navCtrl.push('AcceptApplyListPage');
  }

  //进度管理
  jdApply() {
    this.navCtrl.push('ScheduleApplyListPage');
  }

}
