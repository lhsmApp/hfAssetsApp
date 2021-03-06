import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Navbar } from 'ionic-angular';
import {TransferFundsMain} from '../../model/transfer-funds-main';
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import {Storage} from "@ionic/storage";
import {DictUtil} from '../../providers/dict-util';
import {FeeFlag} from '../../enums/enums';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {Page_TransferAdjustApprovalInfoPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Approval} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';
import {ItemTranfer} from '../../providers/TransferFeildName';

/**
 * Generated class for the TransferAdjustApprovalListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  /*const listGet:TransferFundsMain[] = [
        { translateCode: "1", assetsCode: 'ZZ0001', assetsName: '2017-09-01', departCode: '单位XXX', keyCode: ''},
        { translateCode: "2", assetsCode: 'ZZ0002', assetsName: '2017-09-01', departCode: '单位XXX', keyCode: ''},
        { translateCode: "3", assetsCode: 'ZZ0003', assetsName: '2017-09-01', departCode: '单位XXX', keyCode: ''},
        { translateCode: "4", assetsCode: 'ZZ0004', assetsName: '2017-09-01', departCode: '单位XXX', keyCode: ''},
    ];/**/

@IonicPage()
@Component({
  selector: 'page-transfer-adjust-approval-list',
  templateUrl: 'transfer-adjust-approval-list.html',
})
export class TransferAdjustApprovalListPage {
  @ViewChild('myNavbar') navBar: Navbar;
    listAll:TransferFundsMain[];
    list:TransferFundsMain[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  sendSuccess=false;
  
  title:string;
  callback :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              private dictUtil:DictUtil,
              public tzCostService:AcceptService) {
    this.title = this.navParams.get(Title);
    this.callback = this.navParams.get('callback');
    this.sendSuccess=false;
    //this.listAll = [];
    //this.list = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferAdjustApprovalListPage');
    this.sendSuccess=false;
    this.navBar.backButtonClick=()=>{
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    //this.listAll = [];
    //this.list = [];
    this.getList();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //获取列表信息
  getList() {
    this.isEmpty=false;
    //this.listAll = [];
    //this.list = [];
    
    //1.转资申请单据 2. 转资查询3.审批的转资单查询 4.审批的转资调整单查询
    //" 单据状态" //转资后端字段解释(括号中代表客户端对应字段)、0未提交(新增)、1未审批(待审批) 、2已驳回(退回)、3审批中(待审批)、4已审批(已审批)、若客户端传空的时候则后端查询全部
    //type:string, feeFlag:string, translateCode:string, startDate:string, endDate:string, reviewStatus:string
    this.tzCostService.getTranslateVoucherMainList('4','','','','','').subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as TransferFundsMain[];
          if(this.listAll){
            for(let item of this.listAll){
              //"是否分摊费用"  
              item.feeFlagName = this.dictUtil.getEnumsName(FeeFlag,item.feeFlag);
            }
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
  
      });
    /*this.listAll = listGet;
    this.list = listGet;*/
  }

  //模糊查询
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.list = this.listAll.filter((item) => {
        return (item.translateCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.list = this.listAll;
    }
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

    toDetail(item: TransferFundsMain) {
        this.navCtrl.push(Page_TransferAdjustApprovalInfoPage, {callback:this.checkRefresh,ItemTranfer: item, Oper:Oper_Approval,Title:this.title,'approvalState':'2'});
    }

  //回调
  checkRefresh = (data) =>
  {
    return new Promise((resolve, reject) => {
      if(data){
        this.sendSuccess=data;
        this.getList();
      }
      resolve();
    });
  };

}
