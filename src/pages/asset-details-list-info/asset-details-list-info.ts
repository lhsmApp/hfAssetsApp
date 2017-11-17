import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {AcceptAssetMain} from '../../model/accept-asset-main';
import {ContractService} from '../../services/contractService';
import {ResultBase} from "../../model/result-base";
import {Storage} from "@ionic/storage";
import {IN_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DictUtil} from '../../providers/dict-util';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {BillNumberCode} from '../../providers/TransferFeildName';
import {BillContractCode} from '../../providers/TransferFeildName';
import {BillElementCode} from '../../providers/TransferFeildName';
import {BillCheckResult} from '../../providers/TransferFeildName';
import {BillTranslateType} from '../../providers/TransferFeildName';
import {TypeView,TypeView_AcceptApply,TypeView_TransferFunds,TypeView_Contract} from '../../providers/TransferFeildName';

import {Page_AssetDetailsInfoPage} from '../../providers/TransferFeildName';
//import {BillNumberCode} from '../../providers/TransferFeildName';
//import {BillContractCode} from '../../providers/TransferFeildName';
import {BillKeyCode} from '../../providers/TransferFeildName';

/**
 * Generated class for the AssetDetailsListInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 /*const listGet:AcceptAssetMain[]=[
     {assetsCode: '0001', assetsName: '资产名称', departCode: '单位', keyCode: '100'},
     {assetsCode: '0002', assetsName: '资产名称', departCode: '单位', keyCode: '100'},
     {assetsCode: '0003', assetsName: '资产名称', departCode: '单位', keyCode: '100'},
 ];*/

@IonicPage()
@Component({
  selector: 'page-asset-details-list-info',
  templateUrl: 'asset-details-list-info.html',
})
export class AssetDetailsListInfoPage {
  billNumber:string;
  elementCode:string;
  contractCode:string="";
  TypeView:string;
  translateType:string;
  checkResult:string="";

  listAll:AcceptAssetMain[];
	list:AcceptAssetMain[];
  listDept: DicInDepart[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              private dictUtil:DictUtil,
              public contractService:ContractService) {
    //this.listAll = [];
    //this.list = [];
    this.billNumber = this.navParams.get(BillNumberCode);
    this.contractCode = this.navParams.get(BillContractCode);
    this.elementCode = this.navParams.get(BillElementCode);

    this.translateType = this.navParams.get(BillTranslateType);

    this.TypeView = this.navParams.get(TypeView);
    this.checkResult=this.navParams.get(BillCheckResult);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetDetailsListInfoPage');
    //this.listAll = [];
    //this.list = [];
    this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
      this.listDept=inDepart;
    });

    this.getList();
  }

  //获取列表信息
  getList() {
    this.isEmpty=false;
    //this.listAll = [];
    //this.list = [];
        //1.合同调用,acceptanceFlag="",contractCode必传，checkResult必传
        //2.验收调用 acceptanceFlag=1，contractCode必传，translateCode传""或者不传都行
        //3.转资单调用acceptanceFlag=1，translateCode必传
    //contractCode:string, translateCode:string, acceptanceFlag:string checkResult
    let translateCode = "";
    let acceptanceFlag = "";
    //let contractCode = "";
    if(this.TypeView === TypeView_AcceptApply){
      acceptanceFlag = "1";
      //contractCode = this.contractCode;
    }
    if(this.TypeView === TypeView_TransferFunds){
      acceptanceFlag = "1";
      translateCode = this.billNumber;
    }
    this.contractService.getAssetDetailList(this.contractCode, translateCode, acceptanceFlag, this.checkResult).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as AcceptAssetMain[];
          if(this.listAll){
            for(let item of this.listAll){
              item.departName  = this.dictUtil.getInDepartName(this.listDept,item.departCode);
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
    
      });/**/
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
        return (item.assetsCode.toLowerCase().indexOf(val.toLowerCase()) > -1 
          || item.assetsName.toLowerCase().indexOf(val.toLowerCase()) > -1);
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
  
  toDetail(item: AcceptAssetMain){
      //资产明细详情-----basic_contract_detail 合同明细表
      //1.合同/验收调用 contractCode + keyCode(合同流水号+转资键码) checkResult(合同调用必传)
      //2.转资调用 translateCode+elementCode(转资单号+项目单元编码) translateType转资类型
      // reqTyle: ht/ ys /zz(合同/验收/转资)

    //当资产明细为：合同入口并审批状态为新增、待审批、退回状态时获取的明细信息字段比正常的明细信息字段要少很多,当为已审批时正常。
    if(this.TypeView == TypeView_Contract){
      if(this.checkResult=='1'){
        this.navCtrl.push(Page_AssetDetailsInfoPage, {BillNumberCode:this.billNumber, BillContractCode:this.contractCode, BillElementCode:this.elementCode, BillKeyCode:item.keyCode,
                                                  BillCheckResult:this.checkResult, BillTranslateType:this.translateType, 
                                                  TypeView:this.TypeView});
      }else{
        this.navCtrl.push('AssetDetailsInfoContractPage', {BillContractCode:this.contractCode, BillKeyCode:item.keyCode,
                                                  BillCheckResult:this.checkResult, TypeView:this.TypeView});
      }
    } else {
      this.navCtrl.push(Page_AssetDetailsInfoPage, {BillNumberCode:this.billNumber, BillContractCode:this.contractCode, BillElementCode:this.elementCode, BillKeyCode:item.keyCode,
                                                  BillCheckResult:this.checkResult, BillTranslateType:this.translateType, 
                                                  TypeView:this.TypeView});
    }
  }

}
