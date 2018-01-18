import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {GlobalData} from "../../providers/GlobalData";
import { Permission} from '../../model/permission';

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html'
})
export class ApplyPage {

  /*fkPermission:boolean=true;
  ysPermission:boolean=true;
  jdPermission:boolean=true;*/
  constructor(public navCtrl: NavController,private alertCtrl:AlertController,private camera: Camera,private globalData: GlobalData) {
    /*if(this.globalData.permission){
      for(let item of this.globalData.permission){
        if(item.func_code=='390302'){
          this.fkPermission=item.enabled==1?true:false;
        }else if(item.func_code=='390501'){
          this.ysPermission=item.enabled==1?true:false;
        }else if(item.func_code=='39020108'){
          this.jdPermission=item.enabled==1?true:false;
        }
      }

      let flag:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='390302'){
          flag=true;
          break;
        }
      }
      if(!flag){
        this.fkPermission=false;
      }

      let flagys:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='390501'){
          flagys=true;
          break;
        }
      }
      if(!flagys){
        this.ysPermission=false;
      }

      let flagjd:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='39020108'){
          flagjd=true;
          break;
        }
      }
      if(!flagjd){
        this.jdPermission=false;
      }
    }
    */
  }

  //付款申请
  yukApply() {
    if(this.globalData.permission){
      let flag:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='390302'){
          flag=true;
          break;
        }
      }
      if(!flag){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '不能进行付款申请，您没有付款申请的权限！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }
    this.navCtrl.push("AdvancePaymentApplyListPage");
  }

  //验收申请
  ysApply() {
    if(this.globalData.permission){
      let flagys:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='390501'){
          flagys=true;
          break;
        }
      }
      if(!flagys){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '不能进行验收申请，您没有验收申请的权限！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }
    this.navCtrl.push('AcceptApplyListPage');
  }

  //进度管理
  jdApply() {
    if(this.globalData.permission){
      let flagjd:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='39020108'){
          flagjd=true;
          break;
        }
      }
      if(!flagjd){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '不能进行进度管理，您没有进度管理的权限！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }
    this.navCtrl.push('ScheduleApplyListPage');
  }

}
