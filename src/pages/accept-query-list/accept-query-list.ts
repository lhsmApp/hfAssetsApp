import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {AcceptApplyMain} from '../../model/accept-apply-main';
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import { QueryCondition } from '../../model/query-condition';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {Page_AcceptApplyInfoPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Look} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';
import {BillNumberCode} from '../../providers/TransferFeildName';
import {BillApprovalState} from '../../providers/TransferFeildName';

/**
 * Generated class for the AcceptQueryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  /*const listGet:AcceptApplyMain[] = [
        { billNumber: 'XMDY0001', reviewStatus: '0', requireDate: '2017-09-25', requireUser: '申请人'},
        { billNumber: 'XMDY0002', reviewStatus: '99', requireDate: '2017-09-25', requireUser: '申请人'},
        { billNumber: 'XMDY0003', reviewStatus: '1', requireDate: '2017-09-25', requireUser: '申请人'},
        { billNumber: 'XMDY0004', reviewStatus: '2', requireDate: '2017-09-25', requireUser: '申请人'},
    ];*/

@IonicPage()
@Component({
  selector: 'page-accept-query-list',
  templateUrl: 'accept-query-list.html',
})
export class AcceptQueryListPage {
  queryCondition:QueryCondition;

    listAll:AcceptApplyMain[];
    list:AcceptApplyMain[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              public acceptService:AcceptService) {
    //this.listAll = [];
    //this.list = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcceptQueryListPage');
    //this.listAll = [];
    //this.list = [];
     this.queryCondition=this.navParams.get("queryCondition");
    this.getList();
  }

  //获取列表信息
  getList() {
    this.isEmpty=false;
    //this.listAll = [];
    //this.list = [];
      let state;
      if(this.queryCondition){
        if(this.queryCondition.state=='1'){
          state="0";
        }else if(this.queryCondition.state=='2'){
          state="99";
        }else if(this.queryCondition.state=='3'){
          state="1";
        }else if(this.queryCondition.state=='4'){
          state="2";
        }else{
          state="";
        }
      }
      let code=this.queryCondition.queryString;
      let startDate=this.queryCondition.startDate;
      let endDate=this.queryCondition.endDate;
    //1.申请 2.查询 3.审批
    //0新增（新增）、99待审批（待审批）、1 审批成功（已审批）、2审批失败 （退回）
    //type:string, billNumber:string, startDate:string, endDate:string, reviewStatus:string
    this.acceptService.getAcceptMainList('2', code, startDate, endDate, state).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as AcceptApplyMain[];
          this.list = this.listAll;
          if(!(this.listAll!=null&&this.listAll.length>0)){
            this.isEmpty=true;
          }
        } else {
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: resultBase.message,
              buttons: ['确定']
            });
            alert.present();
        }
      }, () => {
    
      });
    //this.listAll = listGet;
    //this.list = listGet;
  }

  //上拉刷新
  doRefresh(refresher) {
    this.getList();
    refresher.complete();
  }

  //下拉加载
  doInfinite(infiniteScroll) {
    /*this.params.page++;
    setTimeout(() => {
      this.topicService.getTopics(this.params).subscribe(
        data => {
          if (data) {
            this.topics.push(...data.data);
            infiniteScroll.complete();
          }
          else {
            infiniteScroll.enable(false);
          }
        }
        );
    }, 500);*/
  }

  toDetail(billNumber: string) {
    console.log(BillApprovalState + ':' + this.queryCondition.state);
    this.navCtrl.push(Page_AcceptApplyInfoPage, {BillNumberCode: billNumber,Oper:Oper_Look,Title:'验收查询','approvalState':this.queryCondition.state});
  }

}
