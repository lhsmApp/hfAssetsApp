import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {GlobalData} from "../../providers/GlobalData";
import { Permission} from '../../model/permission';

@Component({
  selector: 'page-query',
  templateUrl: 'query.html'
})
export class QueryPage {

  projectQueryPermission:boolean=true;
  zzQueryPermission:boolean=true;


  constructor(public navCtrl: NavController,private globalData: GlobalData) {
    if(this.globalData.permission){
      for(let item of this.globalData.permission){
        if(item.func_code=='391209'){
          this.projectQueryPermission=item.enabled==1?true:false;
        }else if(item.func_code=='391306'){
          this.zzQueryPermission=item.enabled==1?true:false;
        }
      }
    }
  }

  //项目单元查询
  queryProjectUnit() {
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
    this.navCtrl.push('QueryConditionPage', {'oper': 'topics2'});
  }
}
