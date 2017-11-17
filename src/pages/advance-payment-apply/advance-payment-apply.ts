import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController,AlertController,ToastController } from 'ionic-angular';
import {Storage} from "@ionic/storage";

import {FormBuilder, Validators} from '@angular/forms';
import { AdvancePaymentDetail} from '../../model/advance-payment-detail';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PAYMENT_CATEGORY} from '../../enums/enums';
import {Page_ContractChoiceListPage} from '../../providers/TransferFeildName';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DicBase} from "../../model/dic-base";
import {CONTRACT_TYPE} from "../../enums/storage-type";

import {IN_DEPART} from "../../enums/storage-type";
import {OUT_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';
import {DicOutDepart} from '../../model/dic-out-depart';

import { BillOfWorkMain} from '../../model/billof-work-main';
import { BillOfWorkDetail} from '../../model/billof-work-detail';
import {BillNumberCode} from '../../providers/TransferFeildName';
import { ReviewType} from '../../enums/review-type';
import { Utils } from '../../providers/Utils';
import {GlobalData} from "../../providers/GlobalData";
import {DictUtil} from "../../providers/dict-util";

/**
 * Generated class for the AdvancePaymentApplyPage page.
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
  selector: 'page-advance-payment-apply',
  templateUrl: 'advance-payment-apply.html',
})
export class AdvancePaymentApplyPage {
  paymentForm: any;
  oper:string;
  paymentDetail:AdvancePaymentDetail;
  paymentMain:AdvancePaymentMain;
  paymentCategory=PAYMENT_CATEGORY;
  listPayDept : DicInDepart;
  listIntercourse : DicOutDepart;
  listContractType : DicBase[];
  gclListInfo:BillOfWorkMain[]=[];
  callback :any;
  sendSuccess=false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl:ToastController,
              private viewCtrl: ViewController,
              private storage: Storage,
              private formBuilder: FormBuilder,
              private modalCtrl: ModalController,
              private paymentService:PaymentService,
              private alertCtrl: AlertController,
              private globalData: GlobalData,
              private dicUtil:DictUtil) {
  	/*this.paymentForm = this.formBuilder.group({
      username: [, [Validators.required, Validators.pattern('[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+')]],
      verificationCode: [, [Validators.required, Validators.minLength(6), Validators.pattern('1[0-9]{6}')]],
      phone: [, [Validators.required, Validators.pattern('1[0-9]{10}')]],
      password: [, [Validators.required]]
    })*/
    this.callback    = this.navParams.get('callback');
    this.paymentMain=this.navParams.get("paymentItem");
    this.oper=this.navParams.get('oper');
    this.paymentForm = this.formBuilder.group({
      payCode: '',//付款单号，保存后自动生成
      clauseType: [,[Validators.required]],//款项类别，选择
      contractCode: [,[Validators.required]],//合同流水号，选择
      contractName: [,[Validators.required]],//合同名称，自动带出
      //elementType: [, [Validators.required]],//项目性质，自动带出
      elementName: [,[Validators.required]],//项目单元名称，自动带出
      planType: [,[Validators.required]],//项目核算类别，自动带出
      planTypeName: [,[Validators.required]],//项目核算类别，自动带出
      payDigest: [,[Validators.required]],//付款原因，手工录入
      costMoney: [,[Validators.required]],//合同标的（审计）额，自动带出
      taxMoney: '',//已付款额度，自动带出
      payMoney: [,[Validators.required]],//本次申请金额，手工录入
      paymentCode: [,[Validators.required]],//付款单位编号，选择
      //payDepart: [, [Validators.required]],//付款单位名称，选择
      intercourseCode: [,[Validators.required]],//往来单位编号(收款单位)，选择
      //intercourseName: [, [Validators.required]],//往来单位名称(收款单位)，选择
      requireDate: [,[Validators.required]],//申请时间，自动填写当前时间
      requireUser: [,[Validators.required]]//申请人，自动填写当前用户
    });


  }

  //初始化数据
  initData(){
    if(this.paymentMain){
      this.paymentService.getPaymentDetail(this.paymentMain.payCode)
        .subscribe(object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            console.log(object[1][0]);
            this.paymentDetail = object[1][0] as AdvancePaymentDetail;
            this.paymentForm.patchValue({
              payCode:this.paymentDetail.payCode,
              clauseType:this.paymentDetail.clauseType,
              contractCode:this.paymentDetail.contractCode,
              contractName:this.paymentDetail.contractName,
              //elementType:this.paymentDetail.elementType,
              elementName:this.paymentDetail.elementName,
              planType:this.paymentDetail.planType,
              planTypeName:this.dicUtil.getContractTypeName(this.listContractType,this.paymentDetail.planType),
              payDigest:this.paymentDetail.payDigest,
              costMoney:this.paymentDetail.costMoney,
              taxMoney:this.paymentDetail.taxMoney,
              payMoney:this.paymentDetail.payMoney,
              paymentCode:this.paymentDetail.paymentCode,
              intercourseCode:this.paymentDetail.intercourseCode,
              requireDate:this.paymentDetail.requireDate,
              requireUser:this.paymentDetail.requireUser
            });

            //获取工程量信息
            this.paymentService.getGclMainList(this.paymentDetail.contractCode,'fk',this.paymentDetail.payCode,'0')
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                this.gclListInfo = object[1] as BillOfWorkMain[];
              }
            }, () => {
              
            });
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
      }else{
        this.paymentMain=new AdvancePaymentMain();
        this.paymentForm.patchValue({
          requireDate:Utils.dateFormat(new Date()),
          requireUser:this.globalData.userName
        });
      }
  }

  ionViewDidLoad() {
    this.sendSuccess=false;
    //console.log('ionViewDidLoad AdvancePaymentApplyPage');
    this.storage.get(IN_DEPART).then((inDepart: DicInDepart) => {
      this.listPayDept=inDepart;
    });
    this.storage.get(OUT_DEPART).then((outDepart: DicOutDepart) => {
      this.listIntercourse=outDepart;
    });
    this.storage.get(CONTRACT_TYPE).then((contractType: DicBase[]) => {
      this.listContractType=contractType;
    });
    this.initData();
  }

  //选择合同
  choiceContract(){
    /*let modal = this.modalCtrl.create(Page_ContractChoiceListPage);
    modal.present();
    modal.onDidDismiss(contractInfo => {
      console.log(contractInfo);
      if(contractInfo){
        console.log(contractInfo);
        this.paymentForm.patchValue({

          contractCode:contractInfo.contractCode,
          contractName:contractInfo.contractName,
          //elementType:contractInfo.elementCode,
          elementName:contractInfo.elementName,
          planType:contractInfo.compactType,
          costMoney:contractInfo.contractMoney
        });
      }
    });*/
    this.navCtrl.push(Page_ContractChoiceListPage,  {callback: this.choiceOk});
  }

  choiceOk = (contractInfo) =>
  {
    return new Promise((resolve, reject) => {
      console.log(contractInfo);
      if(contractInfo){
          this.paymentForm.patchValue({
          contractCode:contractInfo.contractCode,
          contractName:contractInfo.contractName,
          //elementType:contractInfo.elementCode,
          elementName:contractInfo.elementName,
          planType:contractInfo.compactType,
          planTypeName:this.dicUtil.getContractTypeName(this.listContractType,contractInfo.compactType),
          costMoney:contractInfo.contractMoney
        });
      }
      resolve();
    });
  }

  //保存
  save(){
    //if(!this.paymentForm.valid) return;
    if(this.paymentForm.get('clauseType')._value=='2'||this.paymentForm.get('clauseType')._value=='4'){
      if(this.gclListInfo==null||this.gclListInfo.length==0){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请选择工程量信息后再进行保存！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }

    let paymentInfo=new Array<AdvancePaymentDetail>();
    let detail=this.paymentForm.value as AdvancePaymentDetail;
    if(detail.taxMoney==null||detail.taxMoney.toString()==""){
      detail.taxMoney=0;
    }
    detail.payMoney=parseFloat(detail.payMoney.toString());
    //detail.requireUser='';
    paymentInfo.push(detail);
    console.log(this.gclListInfo);
    let datalist=new Array();
    if(this.gclListInfo){
      let seqceList =[];
      let xzList =[];
      let seqceStr='';
      let xzStr='';
      for(let seq of this.gclListInfo){
        seqceList.push(seq.sequence);
        if(seq.checked==true){
          xzList.push(1);
        }else{
          xzList.push(0);
        }
      }
      seqceStr=seqceList.join(',');
      xzStr=xzList.join(',');
      console.log(seqceStr);
      console.log(xzStr);
      let gclInfo={cCode:detail.contractCode,payCode:detail.payCode,seqceList:seqceStr,xzList:xzStr};
      datalist.push(gclInfo);
    }else{
      let gclInfo={cCode:detail.contractCode,payCode:detail.payCode,seqceList:'',xzList:''};
      datalist.push(gclInfo);
    }

    this.paymentService.savePaymentMain(JSON.stringify(paymentInfo),JSON.stringify(datalist))
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          let toast = this.toastCtrl.create({
            message: '保存成功！',
            duration: 3000
          });
          toast.present();
          this.paymentDetail = object[1][0] as AdvancePaymentDetail;
          this.sendSuccess=true;
          this.paymentMain.payCode=this.paymentForm.get('payCode')._value;
          this.paymentForm.patchValue({
            payCode:this.paymentDetail.payCode,
            clauseType:this.paymentDetail.clauseType,
            contractCode:this.paymentDetail.contractCode,
            contractName:this.paymentDetail.contractName,
            //elementType:this.paymentDetail.elementType,
            elementName:this.paymentDetail.elementName,
            planType:this.paymentDetail.planType,
            planTypeName:this.dicUtil.getContractTypeName(this.listContractType,this.paymentDetail.planType),
            payDigest:this.paymentDetail.payDigest,
            costMoney:this.paymentDetail.costMoney,
            taxMoney:this.paymentDetail.taxMoney,
            payMoney:this.paymentDetail.payMoney,
            paymentCode:this.paymentDetail.paymentCode,
            intercourseCode:this.paymentDetail.intercourseCode,
            requireDate:this.paymentDetail.requireDate,
            requireUser:this.paymentDetail.requireUser
          });
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

  /*getData = function(data){
    return new Promise((resolve, reject) => {
      for (let order of orders) {
        this.data = data;
      }
      console.log(data);
      resolve();
    });
  };*/

  //回调获取选择的工程量清单
  getData = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.gclListInfo=data;
      if(this.paymentForm.get('clauseType')._value=='2'||this.paymentForm.get('clauseType')._value=='4'){
        let sumHj=0;
        if(this.gclListInfo){
          for(let gclItem of this.gclListInfo){
            if(gclItem.checked){
            sumHj+=gclItem.moneyTotal;
            }
          }
        }
        this.paymentForm.patchValue({
            payMoney:sumHj,
          });
      }
      resolve();
    });
  };

  //发票
  invoice(paymentDetail:AdvancePaymentDetail){
  	let payCode=this.paymentForm.get('payCode')._value;
    if(!(payCode!=null&&payCode.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先保存付款信息，再进行维护发票信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.navCtrl.push("InvoiceApplyListPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentDetail.contractCode});
  }

  //工程量清单
  billOfGcl(paymentDetail:AdvancePaymentDetail){
    if(this.paymentForm.get('contractCode')._value==null||this.paymentForm.get('contractCode')._value==""){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先选择合同流水号，再选择工程量信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.paymentMain.payCode=this.paymentForm.get('payCode')._value;
    this.navCtrl.push("BillGclSelectPage",{'paymentItem':this.paymentMain,callback:this.getData,'contractCode':this.paymentForm.get('contractCode')._value,'gclList':this.gclListInfo});
  }

  //送审
  send(){
    let payCode=this.paymentForm.get('payCode')._value;
    if(!(payCode!=null&&payCode.trim()!="")){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请先保存付款信息，再进行送审！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
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

  //款项类别变化
  clauseChange(){
    console.log('change');
    if(this.paymentForm.get('clauseType')._value=='2'||this.paymentForm.get('clauseType')._value=='4'){
        let sumHj=0;
        if(this.gclListInfo){
          for(let gclItem of this.gclListInfo){
            if(gclItem.checked){
            sumHj+=gclItem.moneyTotal;
            }
          }
        }
        this.paymentForm.patchValue({
            payMoney:sumHj,
          });
      }
  }
}
