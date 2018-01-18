import { Component } from '@angular/core';
import { NavController ,AlertController} from 'ionic-angular';
import {GlobalData} from "../../providers/GlobalData";
import { Permission} from '../../model/permission';

@Component({
  selector: 'page-query',
  templateUrl: 'query.html'
})
export class QueryPage {

  /*projectQueryPermission:boolean=true;
  zzQueryPermission:boolean=true;*/


  constructor(public navCtrl: NavController,private alertCtrl:AlertController,private globalData: GlobalData) {
    /*if(this.globalData.permission){
      for(let item of this.globalData.permission){
        if(item.func_code=='3902010901'){
          this.projectQueryPermission=item.enabled==1?true:false;
        }else if(item.func_code=='390511'){
          this.zzQueryPermission=item.enabled==1?true:false;
        }
      }

      let flag:boolean=false;
      console.log(this.globalData.permission);
      for(let item of this.globalData.permission){
        if(item.funcCode=='3902010901'){
          flag=true;
          break;
        }
      }
      if(!flag){
        this.projectQueryPermission=false;
      }

      let flagzz:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='390511'){
          flagzz=true;
          break;
        }
      }
      if(!flagzz){
        this.zzQueryPermission=false;
      }
    }*/
  }

  //项目单元查询
  queryProjectUnit() {
    if(this.globalData.permission){
      let flag:boolean=false;
      console.log(this.globalData.permission);
      for(let item of this.globalData.permission){
        if(item.funcCode=='3902010901'){
          flag=true;
          break;
        }
      }
      if(!flag){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '不能进行项目信息查询，您没有项目信息查询的权限！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }
    this.navCtrl.push("ProjQueryListPage");
  }

  //合同信息查询
  queryContract() {
    this.navCtrl.push('QueryConditionPage', {'oper': 'ht'});
  }

  //付款信息查询
  queryPayment() {
    this.navCtrl.push('QueryConditionPage', {'oper': 'yfk'});
  }

  //验收信息查询
  queryYs() {
    this.navCtrl.push('QueryConditionPage', {'oper': 'topics1'});
  }

  //转资信息查询
  queryZz() {
    if(this.globalData.permission){
      let flagzz:boolean=false;
      for(let item of this.globalData.permission){
        if(item.funcCode=='390511'){
          flagzz=true;
          break;
        }
      }
      if(!flagzz){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '不能进行转资信息查询，您没有转资信息查询的权限！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }
    this.navCtrl.push('QueryConditionPage', {'oper': 'topics2'});
  }
}
