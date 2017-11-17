import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {TransferFundsMain} from '../../model/transfer-funds-main';
import {TransferAdjustMain} from '../../model/transfer-adjust-main';
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import {Storage} from "@ionic/storage";
import {IN_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DictUtil} from '../../providers/dict-util';
import {FeeFlag} from '../../enums/enums';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {Oper,Oper_Approval} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';
import {ItemTranfer} from '../../providers/TransferFeildName';

import {Page_TransferAdjustAssetInfoPage} from '../../providers/TransferFeildName';
//import {Oper,Oper_Approval} from '../../providers/TransferFeildName';
//import {Title} from '../../providers/TransferFeildName';
import {BillNumberCode} from '../../providers/TransferFeildName';
import {BillKeyCode} from '../../providers/TransferFeildName';


/**
 * Generated class for the TransferAdjustAssetListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transfer-adjust-asset-list',
  templateUrl: 'transfer-adjust-asset-list.html',
})
export class TransferAdjustAssetListPage {
    title:string;
    oper:string;
    itemTranfer:TransferFundsMain;
    
    listAll:TransferAdjustMain[];
    list:TransferAdjustMain[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
    listDept: DicInDepart[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              private dictUtil:DictUtil,
              public tzCostService:AcceptService) {
    this.title = this.navParams.get(Title);
    this.oper = this.navParams.get(Oper);
    this.itemTranfer = this.navParams.get(ItemTranfer);
    //this.listAll = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferAdjustAssetListPage');
    //this.listAll = [];
    this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
      this.listDept=inDepart;
    });
    this.getList();
  }

  //获取列表信息
  getList() {
    this.isEmpty=false;
    //this.listAll = [];
    
    //type,//  1.申请明细(没有) 2.查询明细 3.审批明细
    //feeFlag,//  是否已分摊费用 0否 1是
    //type:string, feeFlag:string, translateCode:string, sequence:string
    this.tzCostService.getTzCostMainList('3',this.itemTranfer.feeFlag,this.itemTranfer.translateCode,this.itemTranfer.sequence).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as TransferAdjustMain[];
          if(this.listAll){
            for(let item of this.listAll){
              //"是否分摊费用"  
              item.feeFlagName = this.dictUtil.getEnumsName(FeeFlag,item.feeFlag);
              item.departName = this.dictUtil.getInDepartName(this.listDept,item.departCode);
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

    toDetail(item: TransferAdjustMain) {
        this.navCtrl.push(Page_TransferAdjustAssetInfoPage, {BillNumberCode: item.translateCode, BillKeyCode: item.keyCode, Oper:Oper_Approval,Title:'转资调整审批'});
    }

}
