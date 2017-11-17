import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {ResultBase} from "../../model/result-base";
import {DictUtil} from '../../providers/dict-util';
import {IN_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';

import {TypeView_Contract} from '../../providers/TransferFeildName';
import {BillContractCode} from '../../providers/TransferFeildName';
import {BillKeyCode} from '../../providers/TransferFeildName';
import {BillCheckResult} from '../../providers/TransferFeildName';

import {ContractAssetDetail} from '../../model/contract-asset-detail';
import {ContractService} from '../../services/contractService';

/**
 * Generated class for the AssetDetailsInfoContractPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//当资产明细为：合同入口并审批状态为新增、待审批、退回状态时获取的明细信息字段比正常的明细信息字段要少很多。
@IonicPage()
@Component({
  selector: 'page-asset-details-info-contract',
  templateUrl: 'asset-details-info-contract.html',
})
export class AssetDetailsInfoContractPage {
  list: ContractAssetDetail[];
  itemShow:ContractAssetDetail;

  contractCode:string;
  keyCode:string;
  TypeView:string;
  checkResult:string="";
  DicDepartCode: DicInDepart[];//所属单位"
  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public alertCtrl: AlertController,
  	private storage: Storage,
	private dictUtil:DictUtil,
	public contractService:ContractService) {
    this.contractCode = this.navParams.get(BillContractCode);
    this.keyCode = this.navParams.get(BillKeyCode);
    this.checkResult=this.navParams.get(BillCheckResult);
  }

  ionViewDidLoad() {
    this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
      this.DicDepartCode=inDepart;
    });
    this.getShowItem();
  }

  getShowItem(){
    //资产明细详情-----basic_contract_detail 合同明细表
    //1.合同/验收调用 contractCode + keyCode(合同流水号+转资键码) checkResult(合同调用必传)
    //2.转资调用 translateCode+elementCode(转资单号+项目单元编码) translateType转资类型
    // reqTyle: ht/ ys /zz(合同/验收/转资)
    //contractCode:string, keyCode:string, checkResult:string,
    //translateCode:string, elementCode:string, translateType:string,
    //reqTyle:string

    this.contractService.getAssetDetailItem(this.contractCode, this.keyCode, this.checkResult,
            '', '', '', TypeView_Contract).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.list = object[1] as ContractAssetDetail[];
          if(this.list && this.list.length > 0){
              this.itemShow = this.list[0];
              this.itemShow.departCodeName = this.dictUtil.getInDepartName(this.DicDepartCode,this.itemShow.departCode);//所属单位"
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
  }
}
