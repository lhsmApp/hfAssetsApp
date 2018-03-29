import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams,AlertController,ToastController ,Navbar } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { AdvancePaymentDetail} from '../../model/advance-payment-detail';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import {ReviewProcessMain} from '../../model/review-process-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DicComplex} from "../../model/dic-complex";
import {AJUST_TYPE} from "../../enums/storage-type";
import {IN_DEPART} from "../../enums/storage-type";
import {OUT_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DicOutDepart} from '../../model/dic-out-depart';
import { DictUtil} from '../../providers/dict-util';
import { ReviewType} from '../../enums/review-type';
import {ApprovalService} from '../../services/approvalService';

import {Oper,Oper_Edit,Oper_Add,Oper_Approval,Oper_Look} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';

/**
 * Generated class for the InvoicePaymentInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-payment-info',
  templateUrl: 'invoice-payment-info.html',
})
export class InvoicePaymentInfoPage {
  @ViewChild('myNavbar') navBar: Navbar;
  
  oper:String;
  title:String;
  paymentMain:AdvancePaymentMain;

  isShowCheck:boolean;
  isShowSend:boolean;

  list: AdvancePaymentDetail[];
  itemShow:AdvancePaymentDetail;

  listPayDept : DicInDepart[];
  listIntercourse : DicOutDepart[];
  listAjustType : DicComplex[];
  callback :any;
  sendSuccess=false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl:ToastController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private paymentService:PaymentService,
    private approvalService:ApprovalService,
    private dictUtil:DictUtil) {
    this.itemShow = new AdvancePaymentDetail();
    this.isShowCheck = false;
    this.isShowSend = false;
    this.oper=this.navParams.get(Oper);
    this.title=this.navParams.get(Title);
    this.paymentMain=this.navParams.get("paymentItem");
    this.callback = this.navParams.get('callback');
    if(this.oper === Oper_Approval){
        this.isShowCheck = true;
    }
    if(this.oper === Oper_Edit || this.oper === Oper_Add){
        this.isShowSend = true;
    }
    if(this.oper === Oper_Look){
    }
    this.sendSuccess=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePaymentInfoPage');
    this.navBar.backButtonClick=()=>{
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    this.sendSuccess=false;
    this.itemShow = new AdvancePaymentDetail();
    this.initData();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //初始化数据
  initData(){
    this.itemShow = new AdvancePaymentDetail();
    this.paymentService.getPaymentDetail(this.paymentMain.payCode)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.list = object[1] as AdvancePaymentDetail[];
          if(this.list && this.list.length > 0){
              this.itemShow = this.list[0] as AdvancePaymentDetail;
              this.itemShow.clauseTypeName=this.dictUtil.getClauseTypeName(this.itemShow.clauseType);
              this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
                this.listPayDept=inDepart;
                this.itemShow.payDepart=this.dictUtil.getInDepartName(this.listPayDept,this.itemShow.paymentCode);
              });
              this.storage.get(OUT_DEPART).then((outDepart: DicOutDepart[]) => {
                this.listIntercourse=outDepart;
                this.itemShow.intercourseName=this.dictUtil.getOutDepartName(this.listIntercourse,this.itemShow.intercourseCode);
              });
              this.storage.get(AJUST_TYPE).then((adjustType: DicComplex[]) => {
                this.listAjustType=adjustType;
                this.itemShow.planTypeName=this.dictUtil.getAjustTypeName(this.listAjustType,this.itemShow.planType);
              });
          }
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

  //附件
  attachment(){
      this.navCtrl.push("AttachmentInfoPage",{'billNumber':this.itemShow.payCode,'contractCode':'','type':'3','attachmentType':'2','typeList':'1'});
  }

  //工程量清单
  billOfGcl(){
    this.navCtrl.push("BillGclPage",{'paymentItem':this.paymentMain,'contractCode':this.itemShow.contractCode,'type':'fk'});
  }

  //送审
  send(){
    let reviewType = ReviewType[ReviewType.REVIEW_TYPE_INVOICE];
    console.log(this.itemShow.payCode);
    console.log(reviewType);
      let data = new Array<ReviewProcessMain>();
      //billNumber:string,reviewType:string,data:object[]
      this.approvalService.sendReviewPay(this.itemShow.payCode,reviewType,JSON.stringify(data))
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
            this.sendSuccess=true;
            this.isShowCheck = false;
            this.isShowSend = false;
            this.oper = Oper_Look
            this.callback(true).then(()=>{ this.navCtrl.pop() });
            let toast = this.toastCtrl.create({
              message: resultBase.message,
              duration: 3000
            });
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

  //审批
  check(){
    let reviewType = ReviewType[ReviewType.REVIEW_TYPE_INVOICE];
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
          this.approvalService.vetoReview(this.itemShow.payCode,reviewType,data.title)
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.sendSuccess=true;
              this.isShowCheck = false;
              this.isShowSend = false;
              this.oper = Oper_Look
              this.callback(true).then(()=>{ this.navCtrl.pop() });
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
        this.approvalService.auditReview(this.itemShow.payCode,reviewType,data.title)
        .subscribe(object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.sendSuccess=true;
            this.isShowCheck = false;
            this.isShowSend = false;
            this.oper = Oper_Look
            this.callback(true).then(()=>{ this.navCtrl.pop() });
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
    this.navCtrl.push("InvoiceApplyApprovalListPage",{'paymentItem':this.paymentMain,'contractCode':this.itemShow.contractCode,Oper:this.oper,Title:this.title});
  }
}

