import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from '../../providers/Utils';
import { QueryCondition } from '../../model/query-condition';

import {Oper_Look} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';


/**
 * Generated class for the QueryConditionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-query-condition',
  templateUrl: 'query-condition.html',
})
export class QueryConditionPage {
  oper:string;
  title:string;
  startDate:string;
  endDate:string;
  state:string;
  queryString:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.oper = this.navParams.get("oper");
      this.title = this.navParams.get(Title);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QueryConditionPage');
    this.state="1";
    this.startDate=Utils.dateFormat(new Date());
    //this.endDate=(new Date()).toISOString();
    this.endDate=Utils.dateFormat(new Date());
    console.log(this.endDate);
  }

  openQuery(){
    let condition=new QueryCondition();
    condition.queryString=this.queryString;
    condition.startDate=this.startDate;
    condition.endDate=this.endDate;
    condition.state=this.state; 
    if (this.oper === 'ht') {
        //合同信息查询
        this.navCtrl.push("ContractQueryPage",{'queryCondition':condition,Oper:Oper_Look,Title:this.title});
    }
    else if (this.oper === 'yfk') {
        //付款信息查询
        this.navCtrl.push("AdvancePaymentQueryPage",{'queryCondition':condition,Oper:Oper_Look,Title:this.title});
    }
    else if (this.oper === 'topics1') {
        //实物确认查询
        this.navCtrl.push("AcceptQueryListPage",{'queryCondition':condition,Oper:Oper_Look,Title:this.title});
    }
    else if (this.oper === 'topics2') {
        //转资信息查询
        this.navCtrl.push("TransferFundsQueryListPage",{'queryCondition':condition,Oper:Oper_Look,Title:this.title});
    }

  }
}
