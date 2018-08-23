import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams,AlertController,ToastController ,Navbar } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { AdvancePaymentDetail} from '../../model/advance-payment-detail';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DicComplex} from "../../model/dic-complex";
import {AJUST_TYPE} from "../../enums/storage-type";
import {IN_DEPART} from "../../enums/storage-type";
import {OUT_DEPART} from "../../enums/storage-type";
import {JLDW} from "../../enums/storage-type";
import {FKZT} from "../../enums/storage-type";
import {PZZT} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DicOutDepart} from '../../model/dic-out-depart';
import { DictUtil} from '../../providers/dict-util';
import { ReviewType} from '../../enums/review-type';
import { AdvancePaymentReviewStatus } from '../../enums/enums';
import { InvoiceSendStatus } from '../../enums/enums';
import { PayType } from '../../enums/enums';
import {ApprovalService} from '../../services/approvalService';
import {FormBuilder, Validators} from '@angular/forms';

import {Page_ApprovalPage } from '../../providers/TransferFeildName';
import {BillNumberCode} from '../../providers/TransferFeildName';
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
  @ViewChild('myNavbar') navBar: Navbar;

  paymentForm: any;

  payCode:string;
  isapproval:boolean;
  isquery:boolean;
  apply:boolean=false;
  paymentDetail:AdvancePaymentDetail;
  paymentMain:AdvancePaymentMain;
  //listPayDept : DicInDepart[];
  listDicJldw : DicComplex[];
  listIntercourse : DicOutDepart[];
  listAjustType : DicComplex[];
  callback :any;
  sendSuccess=false;
  approvalState:string;
  hasApprovalProgress=false;

  //payUpdataMoneyText:number;

  //isYFK:boolean=false;//是预付款显示付款比例

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl:ToastController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private paymentService:PaymentService,
    private formBuilder: FormBuilder,
    private approvalService:ApprovalService,
    private dictUtil:DictUtil) {
    this.paymentDetail = new AdvancePaymentDetail();
    this.apply=this.navParams.get('apply');
    this.paymentMain=this.navParams.get("paymentItem");
    this.callback    = this.navParams.get('callback');
    this.approvalState=this.navParams.get('approvalState');
    if(this.approvalState=='2'||this.approvalState=='3'||this.approvalState=='4'){
      this.hasApprovalProgress=true;
    }else{
      this.hasApprovalProgress=false;
    }
    this.paymentForm = this.formBuilder.group({
      payCode: '',//付款单号，保存后自动生成
      //变成 付款类型
      clauseType: [,[Validators.required]],//款项类别，选择 必须在acceptanceCode之前
  clauseTypeName: [,[]],//款项类别名称
      contractCodeHf: [,[Validators.required]],//合同编号，选择
      contractCode: [,[Validators.required]],//合同流水号，自动带出
      contractName: [,[]],//合同名称，自动带出
      //变成 概算项目
      //elementType: [, [Validators.required]],//项目性质，自动带出
      elementName: [,[]],//项目单元名称，自动带出
      planType: [,[]],//项目核算类别，自动带出
  planTypeName: [,[]],//项目核算类别，自动带出
      payDigest: [,[Validators.required]],//付款原因，手工录入
      costMoney: [,[]],//合同标的（审计）额，自动带出
      //变成:累计已付款额度
      taxMoney: '',//已付款额度，自动带出
      //隐藏，用新增加的 paySpMoney：申请付款金额double型
      payMoney: [,[]],//本次申请金额，手工录入
      paymentCode: [,[]],//付款单位编号，选择
      payDepart: [, []],//付款单位名称，选择
      intercourseCode: [,[Validators.required]],//往来单位编号(收款单位)，选择
  intercourseName: [,[]],//往来单位编号(收款单位)
  company: [,[]],//企业名称 
  openBank: [,[]],//开户行  
  bankNum: [,[]],//银行账号
      requireDate: [,[Validators.required]],//申请时间，自动填写当前时间
      requireUser: [,[Validators.required]],//申请人，自动填写当前用户
      requireDepart: [,[Validators.required]],//
      //合同税额
      bl: [,[]],//付款比例
      acceptanceCode:'',//验收单号，选择

      reviewStatus: [, []],//单据状态
  reviewStatusName: [,[]],//审批状态（单据状态）

      fkzt: [, []],//付款状态（01未生成，02已生成）综合编码fkzt
      pzzt: [, []],//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
      fkztName: [, []],//付款状态（01未生成，02已生成）综合编码fkzt
      pzztName: [, []],//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
      currKpNo: [, []],//当期已开票金额（不含税）double型
      seAdd: [, []],//当期税额double型
      ldjeAdd: [, []],//当期留抵金额double型
      ykKpNo: [, []],//合同已开票金额（不含税）double型
      fzDept: [, []],//负责部门 合同带过来的
      //fzDeptName: [, []],//负责部门 合同带过来的
      jlDept: [, [Validators.required]],//监理部门 综合编码jldw
  jlDeptName: [,[]],//监理部门 综合编码jldw
      elePlanMoney: [, []],//概算金额（单元计划金额）double型
      tzPlanMoney: [, []],//累计完成投资额double型
      zs: [, []],//附件张数
      ctJsMoney: [, []],//结算金额double型
      ctYfMoney: [, []],//合同预付款double型
      ctYfBl: [, []],//合同预付款比例double型
      fkYfMoney: [, []],//已付款比例(%)double型
      fkCcBl: [, []],//此次付款后比例(%)double型
      paySpMoney: [, [Validators.required]],//申请付款金额double型
      payUpdataMoney: [, []],//审批付款金额(可修改)} double型

  sendStatus: [,[]],//发票状态” int型  0默认，1送审，2，退回，3审批完成）
  sendStatusName: [,[]],//发票状态” int型  0默认，1送审，2，退回，3审批完成）
  fpDate: [,[]],//日期-发票审核
  fpUser: [,[]],//人-发票审核

  payType: [,[Validators.required]],//" 支付方式",(01,银付，02转账) 保存编码01,或02
  payTypeName: [,[]],
    });
  }

  FromPatchValue(){
              this.paymentForm.patchValue({
                payCode:this.paymentDetail.payCode,
                clauseType:this.paymentDetail.clauseType,
  clauseTypeName: this.paymentDetail.clauseTypeName,//款项类别名称
                contractCodeHf:this.paymentDetail.contractCodeHf,//合同编号，选择
                contractCode:this.paymentDetail.contractCode,
                contractName:this.paymentDetail.contractName,
                //elementType:this.paymentDetail.elementType,
                elementName:this.paymentDetail.elementName,
                planType:this.paymentDetail.planType,//项目核算类别
  planTypeName:this.paymentDetail.planTypeName,//项目核算类别
                payDigest:this.paymentDetail.payDigest,
                acceptanceCode:this.paymentDetail.acceptanceCode,
                costMoney:this.paymentDetail.costMoney,
                taxMoney:this.paymentDetail.taxMoney,
                payMoney:this.paymentDetail.payMoney,
                paymentCode:this.paymentDetail.paymentCode,
                intercourseCode:this.paymentDetail.intercourseCode,
  //intercourseName: this.paymentDetail.intercourseName,//往来单位编号(收款单位)
  //company: this.paymentDetail.company,//企业名称 
  //openBank: this.paymentDetail.openBank,//开户行  
  //bankNum: this.paymentDetail.bankNum,//银行账号
                requireDate:this.paymentDetail.requireDate,
                requireUser:this.paymentDetail.requireUser,
                requireDepart:this.paymentDetail.requireDepart,
                bl:this.paymentDetail.bl,

                payDepart:this.paymentDetail.payDepart,//付款单位名称，选择

                reviewStatus:this.paymentDetail.reviewStatus,//单据状态
  reviewStatusName: this.paymentDetail.reviewStatusName,//审批状态（单据状态）

                fkzt:this.paymentDetail.fkzt,//付款状态（01未生成，02已生成）综合编码fkzt
                pzzt:this.paymentDetail.pzzt,//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
                fkztName:this.paymentDetail.fkztName,//付款状态（01未生成，02已生成）综合编码fkzt
                pzztName:this.paymentDetail.pzztName,//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
                currKpNo:this.paymentDetail.currKpNo,//当期已开票金额（不含税）double型
                seAdd:this.paymentDetail.seAdd,//当期税额double型
                ldjeAdd:this.paymentDetail.ldjeAdd,//当期留抵金额double型
                ykKpNo:this.paymentDetail.ykKpNo,//合同已开票金额（不含税）double型
                fzDept:this.paymentDetail.fzDept,//负责部门 合同带过来的
                //fzDeptName:this.paymentDetail.fzDeptName,//负责部门 合同带过来的
                jlDept:this.paymentDetail.jlDept,//监理部门 综合编码jldw
  //jlDeptName: this.paymentDetail.jlDeptName,//监理部门 综合编码jldw
                elePlanMoney:this.paymentDetail.elePlanMoney,//概算金额（单元计划金额）double型
                tzPlanMoney:this.paymentDetail.tzPlanMoney,//累计完成投资额double型
                zs:this.paymentDetail.zs,//附件张数
                ctJsMoney:this.paymentDetail.ctJsMoney,//结算金额double型
                ctYfMoney:this.paymentDetail.ctYfMoney,//合同预付款double型
                ctYfBl:this.paymentDetail.ctYfBl,//合同预付款比例double型
                fkYfMoney:this.paymentDetail.fkYfMoney,//已付款比例(%)double型
                fkCcBl:this.paymentDetail.fkCcBl,//此次付款后比例(%)double型
                paySpMoney:this.paymentDetail.paySpMoney,//申请付款金额double型
                payUpdataMoney:this.paymentDetail.payUpdataMoney,//审批付款金额(可修改)} double型

  //sendStatus: this.paymentDetail.sendStatus,//发票状态” int型  0默认，1送审，2，退回，3审批完成）
  sendStatusName: this.paymentDetail.sendStatusName,//发票状态” int型  0默认，1送审，2，退回，3审批完成）
  //fpDate: this.paymentDetail.fpDate,//日期-发票审核
  //fpUser: this.paymentDetail.fpUser,//人-发票审核

  payType: this.paymentDetail.payType,
  payTypeName: this.paymentDetail.payTypeName,
              });
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick=()=>{
      console.log('back');
      console.log(this.sendSuccess);
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    //this.isYFK=false;//是预付款显示付款比例
    this.sendSuccess=false;
    this.payCode=this.navParams.get('id');
    console.log(this.payCode);
    this.isapproval=this.navParams.get('approval');
    this.isquery=this.navParams.get('query');

    /*this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
      this.listPayDept=inDepart;
    });
    this.storage.get(OUT_DEPART).then((outDepart: DicOutDepart[]) => {
      this.listIntercourse=outDepart;
    });
    this.storage.get(CONTRACT_TYPE).then((contractType: DicBase[]) => {
      this.listContractType=contractType;
    });*/
    this.initData();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //初始化数据
  initData(){
    //this.isYFK=false;//是预付款显示付款比例
    this.paymentService.getPaymentDetail(this.paymentMain.payCode)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          console.log(object[1][0]);
          this.paymentDetail = object[1][0] as AdvancePaymentDetail;
          //this.payUpdataMoneyText = this.paymentDetail.payUpdataMoney;
          //if(this.paymentDetail.clauseType=='1'){
          //  this.isYFK=true;//是预付款显示付款比例
          //}
          this.paymentDetail.clauseTypeName=this.dictUtil.getClauseTypeName(this.paymentDetail.clauseType);
          this.paymentDetail.payTypeName=this.dictUtil.getEnumsName(PayType, this.paymentDetail.payType);
          this.paymentDetail.sendStatusName=this.dictUtil.getNumEnumsName(InvoiceSendStatus, this.paymentDetail.sendStatus);
          this.paymentDetail.reviewStatusName=this.dictUtil.getNumEnumsName(AdvancePaymentReviewStatus, this.paymentDetail.reviewStatus);
          this.FromPatchValue();
          /*this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
            this.listPayDept=inDepart;
            this.paymentDetail.fzDeptName=this.dictUtil.getInDepartName(this.listPayDept,this.paymentDetail.fzDept);
            this.paymentForm.patchValue({
              fzDeptName:this.paymentDetail.fzDeptName
            });
          });*/
          this.storage.get(JLDW).then((dicList: DicComplex[]) => {
            this.listDicJldw=dicList;
            this.paymentDetail.jlDeptName=this.dictUtil.getDicComplexName(this.listDicJldw,this.paymentDetail.jlDept);
            this.paymentForm.patchValue({
              jlDeptName:this.paymentDetail.jlDeptName
            });
          });
          //this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
          //  this.listPayDept=inDepart;
          //  this.paymentDetail.payDepart=this.dictUtil.getInDepartName(this.listPayDept,this.paymentDetail.paymentCode);
            //this.paymentForm.patchValue({
          //    payDepart:this.paymentDetail.payDepart
           // });
          //});
          this.storage.get(OUT_DEPART).then((outDepart: DicOutDepart[]) => {
            this.listIntercourse=outDepart;
            if(this.listIntercourse&&this.listIntercourse.length>0){
              for(let outDepart of this.listIntercourse){
                if(outDepart.departCode==this.paymentDetail.intercourseCode)
                  this.paymentDetail.intercourseName = outDepart.departName;
                  this.paymentDetail.company = outDepart.company;
                  this.paymentDetail.openBank = outDepart.openBank;
                  this.paymentDetail.bankNum = outDepart.bankNum;
              }
            }
            this.paymentForm.patchValue({
              intercourseName:this.paymentDetail.intercourseName,
              company:this.paymentDetail.company,
              openBank:this.paymentDetail.openBank,
              bankNum:this.paymentDetail.bankNum
            });
          });
          this.storage.get(AJUST_TYPE).then((adjustType: DicComplex[]) => {
            this.listAjustType=adjustType;
            this.paymentDetail.planTypeName=this.dictUtil.getAjustTypeName(this.listAjustType,this.paymentDetail.planType);
            this.paymentForm.patchValue({
              planTypeName:this.paymentDetail.planTypeName
            });
          });
          this.storage.get(FKZT).then((fkzt: DicComplex[]) => {
            this.paymentDetail.fkztName=this.dictUtil.getDicComplexName(fkzt,this.paymentDetail.fkzt);
            this.paymentForm.patchValue({
              fkztName:this.paymentDetail.fkztName
            });
          });
          this.storage.get(PZZT).then((pzzt: DicComplex[]) => {
            this.paymentDetail.pzztName=this.dictUtil.getDicComplexName(pzzt,this.paymentDetail.pzzt);
            this.paymentForm.patchValue({
              pzztName:this.paymentDetail.pzztName
            });
          });
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

  save(){
    if(!(this.isapproval&&!this.sendSuccess)){
      return;
    }
    if(this.paymentDetail!=null && this.paymentDetail.payCode!=null && this.paymentDetail.payCode.trim()!=""){
      let detail=this.paymentForm.value as AdvancePaymentDetail;
      if(detail!=null && detail.payCode!=null && detail.payCode.trim()!=""){
        if(this.paymentDetail.payCode == detail.payCode){
          if(!(detail.payUpdataMoney!=null&&detail.payUpdataMoney.toString().trim()!="")){
            detail.payUpdataMoney=0;
          }
          detail.payUpdataMoney=parseFloat(detail.payUpdataMoney.toString());
          this.paymentDetail.payUpdataMoney = detail.payUpdataMoney;
          this.paymentDetail.payMoney = detail.payUpdataMoney;
          //this.paymentDetail.paySpMoney=detail.payUpdataMoney;
          let paymentInfo=new Array<AdvancePaymentDetail>();
          paymentInfo.push(this.paymentDetail);
          this.paymentService.savePaymentMain(JSON.stringify(paymentInfo))
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                let toast = this.toastCtrl.create({
                  message: '保存成功！',
                  duration: 3000
                });
                toast.present();
                this.initData();
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
      }
    }
    /*if(this.paymentDetail!=null && this.paymentDetail.payCode!=null && this.paymentDetail.payCode.trim()!=""){
        let paymentInfo=new Array<AdvancePaymentDetail>();
        if(!(this.paymentDetail.payUpdataMoney!=null&&this.paymentDetail.payUpdataMoney.toString().trim()!="")){
          this.paymentDetail.payUpdataMoney=0;
        }
        if(!(this.paymentDetail.payMoney!=null&&this.paymentDetail.payMoney.toString().trim()!="")){
          this.paymentDetail.payMoney=0;
        }
        paymentInfo.push(this.paymentDetail);
        this.paymentService.savePaymentMain(JSON.stringify(paymentInfo))
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              //this.paymentDetail.payUpdataMoney = this.payUpdataMoneyText;
              let toast = this.toastCtrl.create({
                message: '保存成功！',
                duration: 3000
              });
              toast.present();
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
    }*/
  }

  //审批
  approval(){
    let reviewType = ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT];
    //this.navCtrl.push(Page_ApprovalPage, {callback:this.checkCallback,BillNumberCode: this.paymentDetail.payCode, "BillReviewType":reviewType});
  
    let modal = this.modalCtrl.create(Page_ApprovalPage,{BillNumberCode: this.paymentDetail.payCode, "BillReviewType":reviewType});
    modal.present();
    modal.onDidDismiss(data => {
      if(data){
        this.sendSuccess=true;
      }
    });
  }

  //回调
  checkCallback = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
        this.sendSuccess=true;
      }
      resolve();
    });
  };
  /* 
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
  }*/

  //发票
  invoice(){
    /*if(this.apply){
      this.navCtrl.push("InvoiceApplyListPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode,'apply':this.apply});
    }else{
  	  this.navCtrl.push("InvoiceListPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode,'apply':this.apply});
    }*/
      this.navCtrl.push("InvoiceListPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode});
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

  //审批进度
  approvalProgress(){
    this.navCtrl.push('ApprovalProgressPage',{BillNumberCode:this.paymentDetail.payCode,'reviewType':ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT],'approvalState':this.approvalState});
  }

  //附件
  attachment(){
    if(this.sendSuccess!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '已送审，不能再维护附件信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    let payCode=this.paymentForm.get('payCode').value;
    if(!(payCode!=null&&payCode.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '未获取到付款信息，不能维护附件信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    console.log(this.apply);
    if(this.apply){
      this.navCtrl.push("AttachmentPage",{callback:this.attachmentChanged,'billNumber':this.paymentDetail.payCode,'contractCode':'','type':'3','attachmentType':'2','typeList':'1'});
    }else{
      this.navCtrl.push("AttachmentInfoPage",{'billNumber':this.paymentDetail.payCode,'contractCode':'','type':'3','attachmentType':'2','typeList':'1'});
    }
  }
  //回调
  attachmentChanged = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
        this.initData();
      }
      resolve();
    });
  };
}
