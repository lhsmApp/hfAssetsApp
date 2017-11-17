import {Component } from '@angular/core';
import {IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {ContractDetail} from '../../model/contract-detail';
import {ContractService} from '../../services/contractService';
import {ResultBase} from "../../model/result-base";
import {Storage} from "@ionic/storage";
import {DictUtil} from '../../providers/dict-util';
import {IN_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {OUT_DEPART} from "../../enums/storage-type";
import {DicOutDepart} from '../../model/dic-out-depart';
import {ContractCostProperty} from '../../enums/enums';
import {CONTRACT_TYPE} from "../../enums/storage-type";
import {ADDITIONAL_PERSON} from "../../enums/storage-type";
import {DicBase} from '../../model/dic-base';
import {DicComplex} from '../../model/dic-complex';

import {BillContractCode} from '../../providers/TransferFeildName';

/**
 * Generated class for the ContractChoiceConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  /*const item: ContractDetail = { 
   sequence:'序号',
  elementCode:'项目单元编码',
  elementName:'项目单元名称',
  contractCode:'合同流水号',
  contractName:'合同名称',
  compactType:'合同类别',
  relativePerson:'合同相对人',
  additionalPerson:'附加相对人',
  ownDepart :'甲方签约单位',
  contractMoney:28,//合同标的额,传double型
  costProperty :'成本属性',
  contractDate:'签约日期',
  uploadFlag:true,//是否上传附件
  requireUser:'申请人',
  requireDate :'申请时间',
  checkResult :'单据状态',
  checkOpinion:'审批意见',
  };*/


@IonicPage()
@Component({
  selector: 'page-contract-choice-confirm',
  templateUrl: 'contract-choice-confirm.html',
})
export class ContractChoiceConfirmPage {
  contractCode:string;

  list: ContractDetail[];
  itemShow:ContractDetail;
  dicInDept: DicInDepart[];
  dicOutDept: DicOutDepart[];
  dicContractType: DicBase[];
  dicAdditionalPerson: DicComplex[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storage: Storage,
              private dictUtil:DictUtil,
              public alertCtrl: AlertController,
              public contractService:ContractService) {
    this.itemShow = new ContractDetail();
  	this.contractCode = this.navParams.get(BillContractCode);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractChoiceConfirmPage');
    this.itemShow = new ContractDetail();
    this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
      this.dicInDept=inDepart;
    });
    this.storage.get(OUT_DEPART).then((outDepart: DicOutDepart[]) => {
      this.dicOutDept=outDepart;
    });
    this.storage.get(CONTRACT_TYPE).then((list: DicBase[]) => {
      this.dicContractType=list;
    });
    this.storage.get(ADDITIONAL_PERSON).then((list: DicComplex[]) => {
      this.dicAdditionalPerson=list;
    });
    this.getShowItem();
  }

  getShowItem(){
    this.itemShow = new ContractDetail();
    ////合同流水号 序号
    //contractCode:string, sequence:string
    this.contractService.getContractDetailItem(this.contractCode, '0').subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.list = object[1] as ContractDetail[];
          if(this.list && this.list.length > 0){
              this.itemShow = this.list[0];
              //合同类别
              this.itemShow.compactTypeName = this.dictUtil.getContractTypeName(this.dicContractType,this.itemShow.compactType);
              //合同相对人
              this.itemShow.relativePersonName = this.dictUtil.getOutDepartName(this.dicOutDept,this.itemShow.relativePerson);
              //附加相对人
              this.itemShow.additionalPersonName = this.dictUtil.getAdditionalPersonName(this.dicAdditionalPerson,this.itemShow.additionalPerson);
              //甲方签约单位
              this.itemShow.ownDepartName = this.dictUtil.getInDepartName(this.dicInDept,this.itemShow.ownDepart);
              //成本属性
              this.itemShow.costPropertyName = this.dictUtil.getEnumsName(ContractCostProperty,this.itemShow.costProperty);
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
    /*this.itemShow = item;*/
  }

  /*ok(){

  }*/

}
