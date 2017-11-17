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
import {BillAddTime} from '../../providers/TransferFeildName';
import {TypeView,TypeView_AcceptApply,TypeView_TransferFunds} from '../../providers/TransferFeildName';

import {Page_AssetDetailsItemPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Look,Oper_Add,Oper_Edit} from '../../providers/TransferFeildName';
//import {BillNumberCode} from '../../providers/TransferFeildName';
//import {BillContractCode} from '../../providers/TransferFeildName';
import {BillKeyCode} from '../../providers/TransferFeildName';
import {ItemTranfer} from '../../providers/TransferFeildName';
//import {BillAddTime} from '../../providers/TransferFeildName';
//import {TypeView,TypeView_AcceptApply} from '../../providers/TransferFeildName';

/**
 * Generated class for the AssetDetailsListPage page.
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
  selector: 'page-asset-details-list',
  templateUrl: 'asset-details-list.html',
})
export class AssetDetailsListPage {
  billNumber:string;
  contractCode:string;
  TypeView:string;
  addTime:string;

  listAll:AcceptAssetMain[];
	list:AcceptAssetMain[];
  listDept: DicInDepart[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              private dictUtil:DictUtil,
              public contractService:ContractService) {
    //this.listAll = [];
    //this.list = [];
    this.billNumber = this.navParams.get(BillNumberCode);
    this.contractCode = this.navParams.get(BillContractCode);
    this.TypeView = this.navParams.get(TypeView);
    this.addTime = this.navParams.get('BillAddTime');
    console.log(this.addTime);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetDetailsListPage');
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
    let checkResult = "";
    let contractCode = "";
    if(this.TypeView === TypeView_AcceptApply){
      acceptanceFlag = "1";
      contractCode = this.contractCode;
    }
    if(this.TypeView === TypeView_TransferFunds){
      acceptanceFlag = "1";
      translateCode = this.billNumber;
    }
    this.contractService.getAssetDetailList(contractCode, translateCode, acceptanceFlag, checkResult).subscribe(
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

  //add(){
  //	this.navCtrl.push(Page_AssetDetailsAddPage, {BillNumberCode: this.billNumber, BillContractCode:this.contractCode, TypeView:TypeView_AcceptApply});
  //}
  edit(item: AcceptAssetMain){
    this.navCtrl.push(Page_AssetDetailsItemPage, {callback:this.checkRefresh,BillNumberCode: this.billNumber, BillContractCode:this.contractCode, BillKeyCode: item.keyCode, 
                                                  'BillAddTime':this.addTime,ItemTranfer:[],Oper:Oper_Edit,TypeView:this.TypeView});
  }

  //回调
  checkRefresh = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
        this.getList();
      }
      resolve();
    });
  };
  
  //toDetail(item: AcceptAssetMain){
  //	this.navCtrl.push(Page_AssetDetailsInfoPage, {BillNumberCode: this.billNumber, BillContractCode:this.contractCode, BillKeyCode: item.keyCode});
  //}
  //delete(item: AcceptAssetMain){
  //  
  //}
}
