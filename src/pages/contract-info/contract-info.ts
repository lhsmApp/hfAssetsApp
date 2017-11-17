import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController,ToastController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {ContractDetail} from '../../model/contract-detail';
import {ContractMain} from '../../model/contract-main';
import {ContractService} from '../../services/contractService';
import {ResultBase} from "../../model/result-base";
import { ReviewType} from '../../enums/review-type';
import {BillContractCode} from '../../providers/TransferFeildName';
import {DictUtil} from '../../providers/dict-util';
import {IN_DEPART} from "../../enums/storage-type";
import {OUT_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DicOutDepart} from '../../model/dic-out-depart';
import {ContractCostProperty} from '../../enums/enums';
import {CONTRACT_TYPE} from "../../enums/storage-type";
import {ADDITIONAL_PERSON} from "../../enums/storage-type";
import {DicBase} from '../../model/dic-base';
import {DicComplex} from '../../model/dic-complex';
import {ApprovalService} from '../../services/approvalService';
import {BillCheckResult} from '../../providers/TransferFeildName';

import {TypeView,TypeView_Contract} from '../../providers/TransferFeildName';

/**
 * Generated class for the ContractInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contract-info',
  templateUrl: 'contract-info.html',
})
export class ContractInfoPage {
  approvalState:string;
  hasApprovalProgress=false;
  isapproval:boolean;
  contractDetailInfo:ContractDetail;
  contractMain:ContractMain;
  sendSuccess=false;
  callback :any;

  dicInDept: DicInDepart[];
  dicOutDept: DicOutDepart[];
  dicContractType: DicBase[];
  dicAdditionalPerson: DicComplex[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl:ToastController,
    private contractService:ContractService,
    private approvalService:ApprovalService,
    private dictUtil:DictUtil,
    private storage: Storage) {
    this.isapproval=this.navParams.get('approval');
    this.callback    = this.navParams.get('callback');
    this.contractMain=this.navParams.get('contractMain');
     this.approvalState=this.navParams.get('approvalState');
    if(this.approvalState=='2'||this.approvalState=='3'||this.approvalState=='4'){
      this.hasApprovalProgress=true;
    }else{
      this.hasApprovalProgress=false;
    }
  }

  ionViewDidLoad() {
    this.sendSuccess=false;
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
    this.initData();
  }

  //初始化数据
  initData(){
    this.contractService.getContractDetailItem(this.contractMain.contractCode,this.contractMain.sequence)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          console.log(object[1][0]);
          this.contractDetailInfo = object[1][0] as ContractDetail;
          //合同类别
          this.contractDetailInfo.compactTypeName = this.dictUtil.getContractTypeName(this.dicContractType,this.contractDetailInfo.compactType);
          //合同相对人
          this.contractDetailInfo.relativePersonName = this.dictUtil.getOutDepartName(this.dicOutDept,this.contractDetailInfo.relativePerson);
          //附加相对人
          this.contractDetailInfo.additionalPersonName = this.dictUtil.getAdditionalPersonName(this.dicAdditionalPerson,this.contractDetailInfo.additionalPerson);
          //甲方签约单位
          this.contractDetailInfo.ownDepartName = this.dictUtil.getInDepartName(this.dicInDept,this.contractDetailInfo.ownDepart);
          //成本属性
          this.contractDetailInfo.costPropertyName = this.dictUtil.getEnumsName(ContractCostProperty,this.contractDetailInfo.costProperty);
        }else{
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

  //审批
  approval(){
    let prompt = this.alertCtrl.create({
      title: '审批',
      message: "请输入审批意见",
      inputs: [
        {
          name: 'title',
          placeholder: '请输入审批意见'
        },
      ],
      
    });

    prompt.addButton({
        text: '取消',
        cssClass:'alertButtionCancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      });
    prompt.addButton({
        text: '不通过',
        cssClass:'alertButtionNo',
        handler: data => {
          this.approvalService.vetoReview(this.contractDetailInfo.contractCode,ReviewType[ReviewType.REVIEW_TYPE_CONTRACT_MAIN],data.title)
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.sendSuccess=true;
              let toast = this.toastCtrl.create({
                message: resultBase.message,
                duration: 3000
              });
              toast.present();
            } else {
                let alert = this.alertCtrl.create({
                  title: '提示!',
                  subTitle: resultBase.message,
                  buttons: ['确定']
                });
                alert.present();
            }
          }, () => {
            
          });
        }
      });
    prompt.addButton({
      text: '通过',
      cssClass:'alertButtionYes',
      handler: data => {
        console.log(data);
        this.approvalService.auditReview(this.contractDetailInfo.contractCode,ReviewType[ReviewType.REVIEW_TYPE_CONTRACT_MAIN],data.title)
        .subscribe(object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.sendSuccess=true;
            let toast = this.toastCtrl.create({
              message: resultBase.message,
              duration: 3000
            });
            toast.present();
          } else {
              let alert = this.alertCtrl.create({
                title: '提示!',
                subTitle: resultBase.message,
                buttons: ['确定']
              });
              alert.present();
          }
        }, () => {
          
        });
      }
    });
    prompt.present();
  }

  //合同明细
  contractDetail(){
    console.log(this.contractDetailInfo.checkResult);
    console.log(this.contractDetailInfo.contractCode);
  	this.navCtrl.push("AssetDetailsListInfoPage",{BillContractCode:this.contractDetailInfo.contractCode,BillCheckResult:this.contractDetailInfo.checkResult, 
                                                        TypeView:TypeView_Contract});
  }

  //工程量清单
  billOfGcl(){
	  this.navCtrl.push("BillGclPage",{'contractCode':this.contractDetailInfo.contractCode,'type':'ht','sequence':this.contractDetailInfo.sequence});
  }

  //附件
  attachment(){
  	this.navCtrl.push("AttachmentInfoPage",{'billNumber':this.contractDetailInfo.contractCode,'contractCode':'','type':'1'});
  }

  //审批进度
  approvalProgress(){
    this.navCtrl.push('ApprovalProgressPage',{BillNumberCode:this.contractDetailInfo.contractCode,'reviewType':ReviewType[ReviewType.REVIEW_TYPE_CONTRACT_MAIN],'approvalState':this.approvalState});
  }

  goBack(){
    console.log('back');
    if(this.sendSuccess){
      this.callback(true).then(()=>{ this.navCtrl.pop() });
    }else{
      this.navCtrl.pop();
    }
  }
}
