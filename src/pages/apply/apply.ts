import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {GlobalData} from "../../providers/GlobalData";
import { Permission} from '../../model/permission';

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html'
})
export class ApplyPage {

  fkPermission:boolean=true;
  ysPermission:boolean=true;
  jdPermission:boolean=true;
  constructor(public navCtrl: NavController,private camera: Camera,private globalData: GlobalData) {
    if(this.globalData.permission){
      for(let item of this.globalData.permission){
        if(item.func_code=='390302'){
          this.fkPermission=item.enabled==1?true:false;
        }else if(item.func_code=='390501'){
          this.ysPermission=item.enabled==1?true:false;
        }else if(item.func_code=='39020108'){
          this.jdPermission=item.enabled==1?true:false;
        }
      }
    }
  }

  //付款申请
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
