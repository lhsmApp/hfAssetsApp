import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AcceptAssetDetail} from '../../model/accept-asset-detail';
import {DicAsset} from '../../model/dic-asset';
import {ContractService} from '../../services/contractService';
import {ResultBase} from "../../model/result-base";

import {BillNumberCode} from '../../providers/TransferFeildName';
import {BillContractCode} from '../../providers/TransferFeildName';

import {Page_AssetDetailsItemPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Add} from '../../providers/TransferFeildName';
//import {BillNumberCode} from '../../providers/TransferFeildName';
//import {BillContractCode} from '../../providers/TransferFeildName';
import {BillKeyCode} from '../../providers/TransferFeildName';
import {ItemTranfer} from '../../providers/TransferFeildName';
import {TypeView,TypeView_AcceptApply} from '../../providers/TransferFeildName';

/**
 * Generated class for the AssetDetailsAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 const listGet:DicAsset[]=[
     {isCheck: false, assetsCode: '0001', assetsName: 'nsdfds', assetsStandard: 'xdsc', unitCode:'',scrapValue: '100.00',markTail:'',depreciateYear:8},
     {isCheck: false, assetsCode: '0002', assetsName: 'ncds', assetsStandard: 'xjt', unitCode:'',scrapValue: '100.00',markTail:'',depreciateYear:7},
     {isCheck: false, assetsCode: '0003', assetsName: 'nffs', assetsStandard: 'xxs', unitCode:'',scrapValue: '100.00',markTail:'',depreciateYear:5},
 ];

@IonicPage()
@Component({
  selector: 'page-asset-details-add',
  templateUrl: 'asset-details-add.html',
})
export class AssetDetailsAddPage {
  billNumber:string;
  contractCode:string;
  acceptanceFlag:string;

	list:DicAsset[];
  transferItem:AcceptAssetDetail;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public contractService:ContractService) {
    this.billNumber = this.navParams.get(BillNumberCode);
    this.contractCode = this.navParams.get(BillContractCode);
    this.acceptanceFlag = this.navParams.get(TypeView);
    
  	this.list=listGet;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetDetailsAddPage');
  }

  add(){
  	
  }

  viewDetail(){
    
  }

  toDetail(item: DicAsset){
    this.transferItem = new AcceptAssetDetail();
    this.transferItem.assetsCode = item.assetsCode;//资产编码
    this.transferItem.assetsName = item.assetsName;//资产名称
    this.transferItem.assetsStandard = item.assetsStandard;//规格型号
    this.transferItem.unitCode = item.unitCode;//计量单位
    this.transferItem.contractCode = this.contractCode;//合同编号
    this.transferItem.depreciateYear = item.depreciateYear;//预计使用年限
    //this.transferItem.assetsType//资产类型
    //this.transferItem.originalValue//原值
    //this.transferItem.nowValue//净值
    //this.transferItem.addDepreciate//累计折旧
    //this.transferItem.devalueValue//减值准备
    //this.transferItem.xh: string;//序号"
    //this.transferItem.keyCode: string;//资产键码
    this.navCtrl.push(Page_AssetDetailsItemPage, {BillNumberCode: this.billNumber, BillContractCode:this.contractCode, BillKeyCode: '',ItemTranfer: this.transferItem,Oper:Oper_Add});
  }

}
