import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController,Navbar } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {AcceptApplyDetail} from '../../model/accept-apply-detail';
import {AcceptService} from '../../services/acceptService';
import {ApprovalService} from '../../services/approvalService';
import {ResultBase} from "../../model/result-base";
import {IN_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DictUtil} from '../../providers/dict-util';
import {ReviewType} from '../../enums/review-type';
import {ContractCostProperty} from '../../enums/enums';
import {AcceptType} from '../../enums/enums';

import {Oper,Oper_Look,Oper_Edit,Oper_Add,Oper_Approval} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';
import {BillNumberCode} from '../../providers/TransferFeildName';

import {Page_AssetDetailsListInfoPage,Page_AssetDetailsListPage,Page_ChoiceApproversPage } from '../../providers/TransferFeildName';
import {TypeView,TypeView_AcceptApply} from '../../providers/TransferFeildName';
import {BillReviewType} from '../../providers/TransferFeildName';
import {BillApprovalState} from '../../providers/TransferFeildName';

/**
 * Generated class for the AcceptApplyInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  /*const listDeptGet: Depart[]=[
      {departCode:'1',departName:'单位1'},
      {departCode:'2',departName:'单位2'},
      {departCode:'133930001',departName:'单位3'},
      {departCode:'4',departName:'单位4'},
  ]*/

  /*const item: AcceptApplyDetail = { billNumber: 'XMDY0001', reviewStatus: '0', requireDate: '2017-09-25', requireUser: '申请人', contractCode:'HT0001', 
          contractName:'合同名称', elementCode:'XMDY0045', elementName:'项目单元名称', departCode:'4'};*/

@IonicPage()
@Component({
  selector: 'page-accept-apply-info',
  templateUrl: 'accept-apply-info.html',
})
export class AcceptApplyInfoPage {
  @ViewChild('myNavbar') navBar: Navbar;
  
  isShowCheck:boolean;
  isShowSend:boolean;
  title:string;
  oper:string;
  billNumber:string;

  list: AcceptApplyDetail[];
  itemShow:AcceptApplyDetail;
  listDept: DicInDepart[];
  callback :any;
  sendSuccess=false;
  hasApprovalProgress=false;
  approvalState:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              public toastCtrl:ToastController,
              private dictUtil:DictUtil,
              public acceptService:AcceptService,
              public approvalService:ApprovalService) {
    this.itemShow = new AcceptApplyDetail();
    this.isShowCheck = false;
    this.isShowSend = false;
    this.title = this.navParams.get(Title);
    this.oper = this.navParams.get(Oper);
    if(this.oper === Oper_Approval){
        this.isShowCheck = true;
    }
    if(this.oper === Oper_Edit || this.oper === Oper_Add){
        this.isShowSend = true;
    }
  	this.billNumber = this.navParams.get(BillNumberCode);
    this.approvalState=this.navParams.get('approvalState');
    console.log(BillApprovalState + ':' + this.approvalState);
    if(this.approvalState=='2'||this.approvalState=='3'||this.approvalState=='4'){
      this.hasApprovalProgress=true;
    }else{
      this.hasApprovalProgress=false;
    }
    this.callback = this.navParams.get('callback');
    this.sendSuccess=false;
    console.log('constructor');
    console.log(this.sendSuccess);
    //this.listDept = listDeptGet;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad");
    this.navBar.backButtonClick=()=>{
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    this.sendSuccess=false;
    console.log('ionViewDidLoad');
    console.log(this.sendSuccess);
    this.itemShow = new AcceptApplyDetail();
    this.getShowItem();
  }

  getShowItem(){
    this.itemShow = new AcceptApplyDetail();
    this.acceptService.getAcceptDetailItem(this.billNumber).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.list = object[1] as AcceptApplyDetail[];
          if(this.list && this.list.length > 0){
              this.itemShow = this.list[0] as AcceptApplyDetail;
              this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
                this.listDept=inDepart;
                this.itemShow.departName = this.dictUtil.getInDepartName(this.listDept,this.itemShow.departCode);
                //”成本属性”（1.直接成本2.间接费用）
                this.itemShow.costPropertyName = this.dictUtil.getEnumsName(ContractCostProperty,this.itemShow.costProperty);
                //”验收类型（3.质保验收，4，竣工验收）”
                this.itemShow.clauseTypeName = this.dictUtil.getEnumsName(AcceptType,this.itemShow.clauseType);
              });
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
    //this.itemShow = item;
  }

  //工程量清单
  billOfGcl(){
    //this.navCtrl.push("BillGclPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode,'type':'fk'});
  }
  
  //资产明细
  toAssetDetail(){
    if(this.oper === Oper_Edit || this.oper === Oper_Add){
      this.navCtrl.push(Page_AssetDetailsListPage,  {BillNumberCode: this.billNumber, BillContractCode:this.itemShow.contractCode, 'BillAddTime':this.itemShow.requireDate, TypeView:TypeView_AcceptApply});
    } else {
      //资产明细详情-----basic_contract_detail 合同明细表
      //1.合同/验收调用 contractCode + keyCode(合同流水号+转资键码) checkResult(合同调用必传)
      //2.转资调用 translateCode+elementCode(转资单号+项目单元编码) translateType转资类型
      // reqTyle: ht/ ys /zz(合同/验收/转资)
      this.navCtrl.push(Page_AssetDetailsListInfoPage, {BillNumberCode: this.billNumber, BillContractCode:this.itemShow.contractCode, BillElementCode: '',
                                                        BillCheckResult:'', BillTranslateType: '', 
                                                        TypeView:TypeView_AcceptApply});
    }
  }

  check(){
        console.log('check');
        console.log(this.sendSuccess);
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
        //billNumber:string,reviewType:string,vetoReason:string
        this.approvalService.vetoReview(this.itemShow.billNumber, ReviewType[ReviewType.BASICACCEPTANCE_APPLY], data.title)
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.sendSuccess=true;
              console.log('不通过');
              console.log(this.sendSuccess);
              let toast = this.toastCtrl.create({
                message: resultBase.message,
                duration: 3000
              });
              toast.present();
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
      });
    prompt.addButton({
      text: '通过',
      cssClass:'alertButtionYes',
      handler: data => {
        //billNumber:string,reviewType:string,vetoReason:string
        this.approvalService.auditReview(this.itemShow.billNumber, ReviewType[ReviewType.BASICACCEPTANCE_APPLY], data.title)
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.sendSuccess=true;
              console.log('通过');
              console.log(this.sendSuccess);
              let toast = this.toastCtrl.create({
                message: resultBase.message,
                duration: 3000
              });
              toast.present();
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
    });
    prompt.present();
  }

  send(){
    console.log("ReviewType：" + ReviewType[ReviewType.BASICACCEPTANCE_APPLY]);
      this.navCtrl.push(Page_ChoiceApproversPage, {callback:this.checkRefresh,BillNumberCode: this.billNumber,'reviewType':ReviewType[ReviewType.BASICACCEPTANCE_APPLY]});
  }

  //回调
  checkRefresh = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
        this.sendSuccess=true;
        console.log('checkRefresh');
        console.log(this.sendSuccess);
      }
      resolve();
    });
  };

  //审批进度
  approvalProgress(){
    this.navCtrl.push('ApprovalProgressPage',{BillNumberCode:this.billNumber,'approvalState':this.approvalState,'reviewType':ReviewType[ReviewType.BASICACCEPTANCE_APPLY]});
  }

  //附件
  attachment(){
    if(this.oper === Oper_Edit || this.oper === Oper_Add){
      this.navCtrl.push("AttachmentPage",{'billNumber':this.billNumber,'contractCode':'','type':'1','attachmentType':'2','typeList':'1'});
    } else {
      this.navCtrl.push("AttachmentInfoPage",{'billNumber':this.billNumber,'contractCode':'','type':'1','attachmentType':'2','typeList':'1'});
    }
  }

}
