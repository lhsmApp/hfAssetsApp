import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'query.html'
})
export class QueryPage {

  constructor(public navCtrl: NavController) {

	  
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
