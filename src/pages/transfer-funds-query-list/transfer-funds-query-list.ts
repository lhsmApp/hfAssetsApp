import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {TransferFundsMain} from '../../model/transfer-funds-main';
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import { QueryCondition } from '../../model/query-condition';
import {DictUtil} from '../../providers/dict-util';
import {FeeFlag} from '../../enums/enums';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {Page_TransferFundsInfoPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Look} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';
import {BillNumberCode} from '../../providers/TransferFeildName';
import {BillApprovalState} from '../../providers/TransferFeildName';

/**
 * Generated class for the TransferFundsQueryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  /*const listGet:TransferFundsMain[] = [
        { translateCode: 'ZZ0001', costTotal: 2017, elementName: '合同名称', reviewStatus: '1'},
        { translateCode: 'ZZ0002', costTotal: 209, elementName: '合同名称', reviewStatus: '2'},
        { translateCode: 'ZZ0003', costTotal: 1701, elementName: '合同名称', reviewStatus: '2'},
        { translateCode: 'ZZ0004', costTotal: 7091, elementName: '合同名称', reviewStatus: '3'},
    ];*/

@IonicPage()
@Component({
  selector: 'page-transfer-funds-query-list',
  templateUrl: 'transfer-funds-query-list.html',
})
export class TransferFundsQueryListPage {
  title:string;
  queryCondition:QueryCondition;
  
  listAll:TransferFundsMain[];
    list:TransferFundsMain[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              private dictUtil:DictUtil,
              public translateVoucherService:AcceptService) {
    //this.listAll = [];
    //this.list = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferFundsQueryListPage');
    //this.listAll = [];
    //this.list = [];
    this.title = this.navParams.get(Title);
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
          state="1,3";
        }else if(this.queryCondition.state=='3'){
          state="4";
        }else if(this.queryCondition.state=='4'){
          state="2";
        }else{
          state="";
        }
      }
      let code=this.queryCondition.queryString;
      let startDate=this.queryCondition.startDate;
      let endDate=this.queryCondition.endDate;
    //1.转资申请单据 2. 转资查询3.审批的转资单查询 4.审批的转资调整单查询
    //" 单据状态" //转资后端字段解释(括号中代表客户端对应字段)、
    //   0未提交(新增)、1未审批(待审批) 、2已驳回(退回)、3审批中(待审批)、4已审批(已审批)、若客户端传空的时候则后端查询全部
    //type:string, feeFlag:string, translateCode:string, startDate:string, endDate:string, reviewStatus:string
    this.translateVoucherService.getTranslateVoucherMainList('2','',code, startDate, endDate, state).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as TransferFundsMain[];
            for(let item of this.listAll){
              //"是否分摊费用"  
              item.feeFlagName = this.dictUtil.getEnumsName(FeeFlag,item.feeFlag);
            }
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
  
      });/**/
    /*this.listAll = listGet;
    this.list = listGet;*/
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

    toDetail(translateCode: string) {
        this.navCtrl.push(Page_TransferFundsInfoPage, {callback:this.checkRefresh,Oper:Oper_Look,Title:this.title,BillNumberCode: translateCode,'approvalState':this.queryCondition.state});
    }

  //回调
  checkRefresh = (data) =>
  {
    console.log(data);
    return new Promise((resolve, reject) => {
      if(data){
        this.getList();
      }
      resolve();
    });
  };

}
