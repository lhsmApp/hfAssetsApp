import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController  } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { AdvancePaymentDetail} from '../../model/advance-payment-detail';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DicBase} from "../../model/dic-base";
import {CONTRACT_TYPE} from "../../enums/storage-type";
import {IN_DEPART} from "../../enums/storage-type";
import {OUT_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DicOutDepart} from '../../model/dic-out-depart';
import { PAYMENT_CATEGORY} from '../../enums/enums';
import { DictUtil} from '../../providers/dict-util';
import {BillNumberCode} from '../../providers/TransferFeildName';
import { ReviewType} from '../../enums/review-type';
import {ApprovalService} from '../../services/approvalService';

/**
 * Generated class for the AdvancePaymentInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 /*const listPayDept: DicBase[]=[
      {code:'1',name:'单位1'},
      {code:'2',name:'单位2'},
      {code:'3',name:'单位3'},
      {code:'4',name:'单位4'},
  ]

  const listIntercourse: DicBase[]=[
      {code:'1',name:'单位1'},
      {code:'2',name:'单位2'},
      {code:'3',name:'单位3'},
      {code:'4',name:'单位4'},
  ]*/

@IonicPage()
@Component({
  selector: 'page-advance-payment-info',
  templateUrl: 'advance-payment-info.html'
})
export class AdvancePaymentInfoPage {
  payCode:string;
  isapproval:boolean;
  apply:boolean=false;
  paymentDetail:AdvancePaymentDetail;
  paymentMain:AdvancePaymentMain;
  paymentCategory=PAYMENT_CATEGORY;
  listPayDept : DicInDepart[];
  listIntercourse : DicOutDepart[];
  listContractType : DicBase[];
  callback :any;
  sendSuccess=false;
  approvalState:string;
  hasApprovalProgress=false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl:ToastController,
    private storage: Storage,
    private paymentService:PaymentService,
    private approvalService:ApprovalService,
    private dictUtil:DictUtil) {
    this.apply=this.navParams.get('apply');
    this.paymentMain=this.navParams.get("paymentItem");
    this.callback    = this.navParams.get('callback');
    this.approvalState=this.navParams.get('approvalState');
    if(this.approvalState=='2'||this.approvalState=='3'||this.approvalState=='4'){
      this.hasApprovalProgress=true;
    }else{
      this.hasApprovalProgress=false;
    }
  }

  ionViewDidLoad() {
    this.sendSuccess=false;
    this.payCode=this.navParams.get('id');
    this.isapproval=this.navParams.get('approval');

    this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
      this.listPayDept=inDepart;
    });
    this.storage.get(OUT_DEPART).then((outDepart: DicOutDepart[]) => {
      this.listIntercourse=outDepart;
    });
    this.storage.get(CONTRACT_TYPE).then((contractType: DicBase[]) => {
      this.listContractType=contractType;
    });
    this.initData();
  }

  //初始化数据
  initData(){
    this.paymentService.getPaymentDetail(this.paymentMain.payCode)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          console.log(object[1][0]);
          this.paymentDetail = object[1][0] as AdvancePaymentDetail;
          this.paymentDetail.clauseTypeName=this.dictUtil.getClauseTypeName(this.paymentDetail.clauseType);
          this.paymentDetail.payDepart=this.dictUtil.getInDepartName(this.listPayDept,this.paymentDetail.paymentCode);
          this.paymentDetail.intercourseName=this.dictUtil.getOutDepartName(this.listIntercourse,this.paymentDetail.intercourseCode);
          this.paymentDetail.planTypeName=this.dictUtil.getContractTypeName(this.listContractType,this.paymentDetail.planType);
        }else{
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
          this.approvalService.vetoReview(this.paymentDetail.payCode,ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT],data.title)
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
        this.approvalService.auditReview(this.paymentDetail.payCode,ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT],data.title)
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

  //发票
  invoice(){
    if(this.apply){
      this.navCtrl.push("InvoiceApplyListPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode,'apply':this.apply});
    }else{
  	  this.navCtrl.push("InvoiceListPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode,'apply':this.apply});
    }
  }

  //工程量清单
  billOfGcl(){
	  this.navCtrl.push("BillGclPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode,'type':'fk'});
  }

  //送审
  send(){
    this.navCtrl.push('ChoiceApproversPage',{callback:this.saveSend,BillNumberCode:this.paymentDetail.payCode,'reviewType':ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT]});
  }

  //回调
  saveSend = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
          //this.getShowItem();
          this.sendSuccess=true;
      }
      resolve();
    });
  };

  goBack(){
    console.log('back');
    if(this.sendSuccess){
      this.callback(true).then(()=>{ this.navCtrl.pop() });
    }else{
      this.navCtrl.pop();
    }
  }

  //审批进度
  approvalProgress(){
    this.navCtrl.push('ApprovalProgressPage',{BillNumberCode:this.paymentDetail.payCode,'reviewType':ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT],'approvalState':this.approvalState});
  }
}
