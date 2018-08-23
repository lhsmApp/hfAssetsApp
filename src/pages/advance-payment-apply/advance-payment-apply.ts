import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController,AlertController,ToastController,Navbar } from 'ionic-angular';
import {Storage} from "@ionic/storage";

import {FormBuilder, Validators} from '@angular/forms';
import { AdvancePaymentDetail} from '../../model/advance-payment-detail';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PAYMENT_CATEGORY} from '../../enums/enums';
import {Page_ContractChoiceListPage} from '../../providers/TransferFeildName';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DicComplex} from "../../model/dic-complex";
import {AJUST_TYPE} from "../../enums/storage-type";
import {JLDW} from "../../enums/storage-type";
import { PayType } from '../../enums/enums';

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
  @ViewChild('myNavbar') navBar: Navbar;

  paymentForm: any;
  oper:string;
  paymentDetail:AdvancePaymentDetail;
  paymentMain:AdvancePaymentMain;
  paymentCategory=PAYMENT_CATEGORY;
  listPayDept : DicInDepart;
  listDicJldw : DicComplex[];
  listIntercourse : DicOutDepart;
  listDicPayType = PayType;
  listAjustType : DicComplex[];
  gclListInfo:BillOfWorkMain[]=[];
  callback :any;
  sendSuccess=false;
  sendSuccess1=false;//用于校验送审成功后，按钮变成灰色

  //isYFK:boolean=false;//是预付款显示付款比例

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
      //变成 付款类型
      clauseType: [,[Validators.required]],//款项类别，选择 必须在acceptanceCode之前
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
      requireDate: [,[Validators.required]],//申请时间，自动填写当前时间
      requireUser: [,[Validators.required]],//申请人，自动填写当前用户
      requireDepart: [,[Validators.required]],//
      //合同税额
      bl: [,[]],//付款比例
      acceptanceCode:'',//实物确认单号，选择

      reviewStatus: [, []],//单据状态

      fkzt: [, []],//付款状态（01未生成，02已生成）综合编码fkzt
      pzzt: [, []],//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
      currKpNo: [, []],//当期已开票金额（不含税）double型
      seAdd: [, []],//当期税额double型
      ldjeAdd: [, []],//当期留抵金额double型
      ykKpNo: [, []],//合同已开票金额（不含税）double型
      fzDept: [, []],//负责部门 合同带过来的
      //fzDeptName: [, []],//负责部门 合同带过来的
      jlDept: [, [Validators.required]],//监理部门 综合编码jldw
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
      
  payType: [,[Validators.required]],//" 支付方式",(01,银付，02转账) 保存编码01,或02
    });
  }

  FromPatchValue(){
            //if(this.paymentDetail.clauseType=='1'){
            //  this.isYFK=true;//是预付款显示付款比例
            //} else {
            //  this.isYFK=false;//是预付款显示付款比例
            //}
              this.paymentForm.patchValue({
                payCode:this.paymentDetail.payCode,
                clauseType:this.paymentDetail.clauseType,
                contractCodeHf:this.paymentDetail.contractCodeHf,//合同编号，选择
                contractCode:this.paymentDetail.contractCode,
                contractName:this.paymentDetail.contractName,
                //elementType:this.paymentDetail.elementType,
                elementName:this.paymentDetail.elementName,
                planType:this.paymentDetail.planType,
                planTypeName:this.paymentDetail.planTypeName,
                payDigest:this.paymentDetail.payDigest,
                acceptanceCode:this.paymentDetail.acceptanceCode,
                costMoney:this.paymentDetail.costMoney,
                taxMoney:this.paymentDetail.taxMoney,
                payMoney:this.paymentDetail.payMoney,
                paymentCode:this.paymentDetail.paymentCode,
                intercourseCode:this.paymentDetail.intercourseCode,
                requireDate:this.paymentDetail.requireDate,
                requireUser:this.paymentDetail.requireUser,
                requireDepart:this.paymentDetail.requireDepart,
                bl:this.paymentDetail.bl,

                payDepart:this.paymentDetail.payDepart,//付款单位名称，选择

                reviewStatus:this.paymentDetail.reviewStatus,//单据状态

                fkzt:this.paymentDetail.fkzt,//付款状态（01未生成，02已生成）综合编码fkzt
                pzzt:this.paymentDetail.pzzt,//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
                currKpNo:this.paymentDetail.currKpNo,//当期已开票金额（不含税）double型
                seAdd:this.paymentDetail.seAdd,//当期税额double型
                ldjeAdd:this.paymentDetail.ldjeAdd,//当期留抵金额double型
                ykKpNo:this.paymentDetail.ykKpNo,//合同已开票金额（不含税）double型
                fzDept:this.paymentDetail.fzDept,//负责部门 合同带过来的
                //fzDeptName:this.paymentDetail.fzDeptName,//负责部门 合同带过来的
                jlDept:this.paymentDetail.jlDept,//监理部门 综合编码jldw
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

                payType:this.paymentDetail.payType,
              });
  }

  //初始化数据
  initData(){
    //this.isYFK=false;//是预付款显示付款比例
    if(this.paymentMain!=null && this.paymentMain.payCode!=null && this.paymentMain.payCode.trim()!=""){
      this.paymentService.getPaymentDetail(this.paymentMain.payCode)
        .subscribe(object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            console.log(object[1][0]);
            this.paymentDetail = object[1][0] as AdvancePaymentDetail;
            this.FromPatchValue();
            /*this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
              this.paymentDetail.fzDeptName=this.dicUtil.getInDepartName(inDepart,this.paymentDetail.fzDept);
              this.paymentForm.patchValue({
                fzDeptName:this.paymentDetail.fzDeptName
              });
            });*/
            this.storage.get(AJUST_TYPE).then((adjustType: DicComplex[]) => {
              this.paymentDetail.planTypeName=this.dicUtil.getAjustTypeName(adjustType,this.paymentDetail.planType);
              this.paymentForm.patchValue({
                planTypeName:this.paymentDetail.planTypeName
              });
            });

            //获取工程量信息
            /*this.paymentService.getGclMainList(this.paymentDetail.contractCode,'fk',this.paymentDetail.payCode,'0')
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                this.gclListInfo = object[1] as BillOfWorkMain[];
              }
            }, () => {
              
            });*/
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
        this.paymentDetail=new AdvancePaymentDetail();
        this.paymentDetail.requireDate = Utils.dateFormat(new Date());
        this.paymentDetail.requireUser = this.globalData.userName;
        this.paymentDetail.requireDepart = this.globalData.departCode;
        this.paymentDetail.reviewStatus = 0;//单据状态
        this.FromPatchValue();
      }
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick=()=>{
      console.log('back');
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
      //this.isYFK=false;//是预付款显示付款比例
    }
    
    this.sendSuccess=false;
    this.sendSuccess1=false;
    //console.log('ionViewDidLoad AdvancePaymentApplyPage');
    this.storage.get(IN_DEPART).then((inDepart: DicInDepart) => {
      this.listPayDept=inDepart;
    });
    this.storage.get(OUT_DEPART).then((outDepart: DicOutDepart) => {
      this.listIntercourse=outDepart;
    });
    this.storage.get(AJUST_TYPE).then((ajustType: DicComplex[]) => {
      this.listAjustType=ajustType;
    });
    this.storage.get(JLDW).then((dicList: DicComplex[]) => {
      this.listDicJldw=dicList;
    });
    this.initData();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //选择合同
  choiceContract(){
    if(this.sendSuccess1!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '已送审，不能再选择合同！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
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
          contractCodeHf:contractInfo.contractCodeHf,
          contractName:contractInfo.contractName,
          //elementType:contractInfo.elementCode,
          elementName:contractInfo.elementName,
          //fzDept:contractInfo.departCode,
          //fzDeptName:contractInfo.departName,
          fzDept:contractInfo.departName,
          bl:contractInfo.costMoney,
          planType:contractInfo.compactType,
          planTypeName:this.dicUtil.getAjustTypeName(this.listAjustType,contractInfo.compactType),
          costMoney:contractInfo.contractMoney,
          ctYfMoney:contractInfo.ctYfMoney,
          paySpMoney:contractInfo.ctYfMoney,
          ctYfBl:contractInfo.ctYfBl,
          elePlanMoney:contractInfo.elePlanMoney
        });
      }
      resolve();
    });
  }

  //选择实物确认单号
  choiceAccept(){
    if(this.sendSuccess1!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '已送审，不能再选择实物确认单号！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    let clauseType:string = this.paymentForm.get('clauseType').value;
    //款项为“预付款”时，无需选择“实物确认单号”，建议将字段隐藏或改为提示“当前款项为预付款，禁止选择实物确认单号”
    if(clauseType=='1'){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '当前款项为预付款，禁止选择实物确认单号！',
          buttons: ['确定']
        });
        alert.present();
        return;
    }
    if(clauseType=='3'){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '当前款项为质保金，禁止选择实物确认单号！',
          buttons: ['确定']
        });
        alert.present();
        return;
    }
    let contractCode:string = this.paymentForm.get('contractCode').value;
    if(!(contractCode!=null&&contractCode.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先选择合同流水号，再选择实物确认单号！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    if(!(clauseType!=null&&clauseType.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先选择款项类别，再选择实物确认单号！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    console.log(contractCode);
    this.navCtrl.push('AcceptSelectPage',  {'contractCode':contractCode,'clauseType':clauseType,callback: this.choiceAcceptOk});
  }

  choiceAcceptOk = (acceptInfo) =>
  {
    return new Promise((resolve, reject) => {
      if(acceptInfo&&acceptInfo.billNumber){
          this.paymentForm.patchValue({
            acceptanceCode:acceptInfo.billNumber
        });

        if(this.paymentForm.get('clauseType').value=='2'||this.paymentForm.get('clauseType').value=='5'||this.paymentForm.get('clauseType').value=='4'){  

          //获取工程量信息,当付款类型为进度款或者竣工款时付款金额需要根据实物确认单号下的工程量进行计算
          this.paymentService.getGclMainList(this.paymentForm.get('contractCode').value,'ys','','0',this.paymentForm.get('acceptanceCode').value)
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.gclListInfo = object[1] as BillOfWorkMain[];
              if(this.paymentForm.get('clauseType').value=='2'||this.paymentForm.get('clauseType').value=='5'||this.paymentForm.get('clauseType').value=='4'){
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
          }, () => {
            
          });
        }

      }
      resolve();
    });
  }

  //保存
  save(){
    if(this.sendSuccess1!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '已送审，不能再保存！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    //if(!this.paymentForm.valid) return;

    /*if(this.paymentForm.get('clauseType').value=='2'||this.paymentForm.get('clauseType').value=='5'||this.paymentForm.get('clauseType').value=='4'){
      if(this.gclListInfo==null||this.gclListInfo.length==0){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请选择工程量信息后再进行保存！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }*/

    if(this.paymentForm.get('acceptanceCode').value!=null && this.paymentForm.get('acceptanceCode').value.trim()!=""){
      if(this.paymentForm.get('clauseType').value=='1'){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '当前款项为预付款，禁止选择实物确认单号！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
      if(this.paymentForm.get('clauseType').value=='3'){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '当前款项为质保金，禁止选择实物确认单号！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    } else {
      if(this.paymentForm.get('clauseType').value!='1' && this.paymentForm.get('clauseType').value!='3'){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请先选择实物确认单号，再进行保存！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    }

    let paymentInfo=new Array<AdvancePaymentDetail>();
    let detail=this.paymentForm.value as AdvancePaymentDetail;
    detail.paySpMoney=parseFloat(detail.paySpMoney.toString());
    //if(this.isYFK){//this.paymentForm.get('clauseType').value=='1'
    //  detail.payMoney = parseFloat(detail.costMoney.toString()) * detail.bl * 0.01;
    //} else {
    //  detail.bl=0;
    //}
    //detail.requireUser='';
    paymentInfo.push(detail);
    /*console.log(this.gclListInfo);
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
    }*/

    //this.paymentService.savePaymentMain(JSON.stringify(paymentInfo),JSON.stringify(datalist))
    this.paymentService.savePaymentMain(JSON.stringify(paymentInfo))
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
          this.paymentMain.payCode=this.paymentDetail.payCode;
          this.FromPatchValue();
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
  /*getData = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.gclListInfo=data;
      if(this.paymentForm.get('clauseType').value=='2'||this.paymentForm.get('clauseType').value=='5'||this.paymentForm.get('clauseType').value=='4'){
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
  };*/

  //发票
  /*invoice(paymentDetail:AdvancePaymentDetail){
  	let payCode=this.paymentForm.get('payCode').value;
    console.log(this.paymentForm.get('payCode'));
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
  }*/

  //工程量清单
  billOfGcl(paymentDetail:AdvancePaymentDetail){
    if(this.sendSuccess1!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '已送审，不能再选择工程量信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    if(this.paymentForm.get('clauseType').value=='1'){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '当前款项类别为预付款，无需选择工程量清单！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    if(this.paymentForm.get('clauseType').value=='3'){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '当前款项类别为质保金，无需选择工程量清单！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    if(!(this.paymentForm.get('contractCode').value!=null&&this.paymentForm.get('contractCode').value.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先选择合同流水号，再选择工程量信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    if(!(this.paymentForm.get('acceptanceCode').value!=null&&this.paymentForm.get('acceptanceCode').value.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先选择实物确认单号，再查看工程量信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.paymentMain.payCode=this.paymentForm.get('payCode').value;
    //this.navCtrl.push("BillGclSelectPage",{'paymentItem':this.paymentMain,callback:this.getData,'contractCode':this.paymentForm.get('contractCode').value,'gclList':this.gclListInfo});
    this.navCtrl.push("BillGclPage",{'paymentItem':this.paymentMain,'contractCode':this.paymentForm.get('contractCode').value,'type':'fk'});
  }

  //送审
  send(){
    if(this.sendSuccess1!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '已送审，不能再进行送审！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    let payCode=this.paymentForm.get('payCode').value;
    if(!(payCode!=null&&payCode.trim()!="")){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请先保存，再进行送审！',
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
          this.sendSuccess=true;
          this.sendSuccess1=true;
          this.refBack();
      }
      resolve();
    });
  };

  //款项类别变化
  clauseChange(clauseType:string){
    if(this.sendSuccess1!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '已送审，不能再选择付款类型！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    console.log('change');
    //款项为“预付款”时，无需选择“实物确认单号”，建议将字段隐藏或改为提示“当前款项为预付款，禁止选择实物确认单号”
    console.log(clauseType);
    console.log(this.paymentForm.get('clauseType').value);
    if(clauseType=='1'||clauseType=='3'){
      this.paymentForm.patchValue({
        acceptanceCode:''
      });
    }
    //if(clauseType=='1'){
    //  this.isYFK=true;//是预付款显示付款比例
    //} else {
    //  this.isYFK=false;//是预付款显示付款比例
    //}
    if(clauseType=='2'||clauseType=='5'||clauseType=='4'){
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

  //附件列表
  attachment(item){
    if(this.sendSuccess1!=false){
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
        subTitle: '请先保存，再进行维护附件信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.navCtrl.push("AttachmentPage",{callback:this.attachmentChanged,'billNumber':this.paymentDetail.payCode,'contractCode':'','type':'3','attachmentType':'2','typeList':'1'});
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
