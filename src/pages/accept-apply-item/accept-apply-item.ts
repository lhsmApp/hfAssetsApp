import {Component,ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {DictUtil} from '../../providers/dict-util';
import {IonicPage, NavController, NavParams, ViewController,ModalController,AlertController,ToastController,Navbar} from 'ionic-angular';
import {AcceptApplyDetail} from '../../model/accept-apply-detail';
import {BillOfWorkMain} from '../../model/billof-work-main';
import {Depart} from '../../model/depart';
import {GlobalData} from "../../providers/GlobalData";
import {Utils} from "../../providers/Utils";
import {AcceptService} from '../../services/acceptService';
import {PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {ReviewType} from '../../enums/review-type';
import {ContractCostProperty} from '../../enums/enums';
import {AcceptType} from '../../enums/enums';

import {IN_DEPART} from "../../enums/storage-type";
import {DicInDepart} from '../../model/dic-in-depart';

import {Oper,Oper_Add,Oper_Edit} from '../../providers/TransferFeildName';
import {BillNumberCode} from '../../providers/TransferFeildName';

import {Page_ContractChoiceListPage,Page_AssetDetailsListPage} from '../../providers/TransferFeildName';
import {Page_ChoiceApproversPage} from '../../providers/TransferFeildName';
import {TypeView,TypeView_AcceptApply} from '../../providers/TransferFeildName';
import {BillReviewType} from '../../providers/TransferFeildName';
import {BillAddTime} from '../../providers/TransferFeildName';

/**
 * Generated class for the AcceptApplyItemPage page.
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
  selector: 'page-accept-apply-item',
  templateUrl: 'accept-apply-item.html',
})
export class AcceptApplyItemPage {
  @ViewChild('myNavbar') navBar: Navbar;
  
  oper:string;
  billNumber:string;

  applyFrom:any;
  list: AcceptApplyDetail[];
  itemShow:AcceptApplyDetail;
  listDept: DicInDepart[];
  callback :any;
  sendSuccess=false;
  isBackRefresh = false;

  gclListInfo:BillOfWorkMain[]=[];
  //billOfGclIsSaved:boolean = true;

  dicCostProperty: Array<{code: number, name: string}>;//”成本属性”（1.直接成本2.间接费用）
  dicClauseType: Array<{code: string, name: string}>;//”验收类型（2.进度验收，4，竣工验收）”

  constructor(public navCtrl: NavController,
              public params: NavParams,
              private formBuilder: FormBuilder,
              private alertCtrl: AlertController,
              private storage: Storage,
              public toastCtrl:ToastController,
              private dictUtil:DictUtil,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              public acceptService:AcceptService, 
              private paymentService:PaymentService,
              private globalData: GlobalData) {
    this.itemShow = new AcceptApplyDetail();
    //this.billOfGclIsSaved = true;
  	this.oper = this.params.get(Oper);
  	this.billNumber = this.params.get(BillNumberCode);
    this.callback    = this.params.get('callback');
    this.sendSuccess=false;
    this.isBackRefresh = false;
    //this.listDept = listDeptGet;

    this.applyFrom = this.formBuilder.group({
      contractCode: [, [Validators.required]],
      contractName: [, []],
      elementCode: [, []],
      elementName: [, []],
      departCode: [, [Validators.required]],
      requireDate: [, [Validators.required]],
      requireUser: [, [Validators.required]],
      costProperty: [, [Validators.required]],
      clauseType: [, [Validators.required]],

      billNumber: [, []],
      reviewStatus: [, []],
      
      departName: [, []],
      costPropertyName: [, []],
      clauseTypeName: [, []],
    });
  }

  FromPatchValue(){
    this.applyFrom.patchValue({
      contractCode: this.itemShow.contractCode,
      contractName: this.itemShow.contractName,
      elementCode: this.itemShow.elementCode,
      elementName: this.itemShow.elementName,
      departCode: this.itemShow.departCode,
      requireDate: this.itemShow.requireDate,
      requireUser: this.itemShow.requireUser,
      costProperty: this.itemShow.costProperty,
      clauseType: this.itemShow.clauseType,

      billNumber: this.itemShow.billNumber,
      reviewStatus: this.itemShow.reviewStatus,
      
      departName: this.itemShow.departName,
      costPropertyName: this.itemShow.costPropertyName,
      clauseTypeName: this.itemShow.clauseTypeName,
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcceptApplyItemPage');

    this.dicCostProperty = ContractCostProperty;//”成本属性”（1.直接成本2.间接费用）
    this.dicClauseType = AcceptType;//”验收类型（2.进度验收，4，竣工验收）”

    this.navBar.backButtonClick=()=>{
      if(this.sendSuccess || this.isBackRefresh){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    this.sendSuccess=false;
    this.isBackRefresh = false;
    this.itemShow = new AcceptApplyDetail();
    //this.billOfGclIsSaved = true;
    this.getShowItem();
  }

  getShowItem(){
    this.itemShow = new AcceptApplyDetail();
    this.gclListInfo = [];
    if(this.oper === Oper_Edit){
      //this.billOfGclIsSaved = true;
      console.log(this.oper);
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
                this.FromPatchValue();
              });
              //获取工程量信息
              //contractCode:string,type:string,payCode:string,sequence :string,billNumber:string
              this.paymentService.getGclMainList(this.itemShow.contractCode,'ys','','0',this.itemShow.billNumber)
                    .subscribe(object => {
                  let resultBase:ResultBase=object[0] as ResultBase;
                  if(resultBase.result=='true'){
                      this.gclListInfo = object[1] as BillOfWorkMain[];
                  }
              }, () => {
                      
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
      //this.FromPatchValue();
    } else if(this.oper === Oper_Add){
      //this.billOfGclIsSaved = false;
      console.log(this.oper);
      this.itemShow.billNumber = "";
      this.itemShow.contractCode = "";
      this.itemShow.contractName = "";
      this.itemShow.elementCode = "";
      this.itemShow.elementName = "";
      this.itemShow.departCode = this.globalData.departCode;
      this.itemShow.departName = this.globalData.departName;
      this.itemShow.requireDate =  Utils.dateFormat(new Date());
      this.itemShow.requireUser = this.globalData.userName;
      this.itemShow.reviewStatus = "0";
      this.itemShow.costProperty = 1;
      this.itemShow.clauseType = "";
      this.itemShow.costPropertyName = this.dictUtil.getNumEnumsName(ContractCostProperty,this.itemShow.costProperty);
      this.itemShow.clauseTypeName = "";
      this.FromPatchValue();
    } else {
      this.FromPatchValue();
    }
  }

  //保存
  save(){
    if(this.sendSuccess!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "单据已送审！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    let transferInfo=new Array<AcceptApplyDetail>();
    let detail=this.applyFrom.value as AcceptApplyDetail;
    detail.costProperty = Number(detail.costProperty);
    detail.requireDate =  Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm');
    transferInfo.push(detail);

    let datalistTransfer = "";
    //成本属性”（1.直接成本2.间接费用）
    //间接费用 不可以打开验收明细和勾选工程量清单
    if(detail.billNumber!=null&&detail.billNumber.trim()!="" && detail.costProperty==2){
        let datalist=new Array();
        let seqceList =[];
        let xzList =[];
        let seqceStr='';
        let xzStr='';
        if(this.gclListInfo){
          for(let seq of this.gclListInfo){
            if(seq.acceptanceCode==detail.billNumber || seq.checked==true){
              seqceList.push(seq.sequence);
              xzList.push(0);
            }
          }
          seqceStr=seqceList.join(',');
          if(seqceStr!=null && seqceStr.trim()!=""){
            if(!seqceStr.trim().endsWith(',')){
              seqceStr += ',';
            }
          }
          xzStr=xzList.join(',');
          if(xzStr!=null && xzStr.trim()!=""){
            if(!xzStr.trim().endsWith(',')){
              xzStr += ',';
            }
          }
          console.log(seqceStr);
          console.log(xzStr);
          let gclInfo={cCode:detail.contractCode,billNumber:detail.billNumber,seqceList:seqceStr,xzList:xzStr};
          datalist.push(gclInfo);
          datalistTransfer = JSON.stringify(datalist);
        }
    }

    this.acceptService.saveAcceptApplyMain(JSON.stringify(transferInfo),datalistTransfer)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.isBackRefresh = true;
          this.oper = Oper_Edit;
          console.log(object[1][0]);
          if(this.oper == Oper_Add){
            this.itemShow = object[1][0] as AcceptApplyDetail;
            this.billNumber = this.itemShow.billNumber;
          } else {
            this.itemShow = detail;
          }
          this.FromPatchValue();
          this.getShowItem();
          //this.billOfGclIsSaved = true;
          let toast = this.toastCtrl.create({
              message: '保存成功',
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

  //送审
  send(){
    if(this.sendSuccess!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "单据已送审！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
      if(!(this.billNumber!=null&&this.billNumber.trim()!="")){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请保存后再进行送审！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
    let isHave:boolean = false;
    let isAll:boolean = true;
    if(this.gclListInfo){
      for(let seq of this.gclListInfo){
        if(seq.checked==true){
          isHave = true;
        }else{
          if(!(seq.acceptanceCode!=null && seq.acceptanceCode.trim()!="") || seq.acceptanceCode==this.itemShow.billNumber){
            isAll = false;
          }
        }
      }
    }
    //验收类型（2.进度验收，4，竣工验收）
    //验收单据加验收类型：（进度验收，竣工验收）进度验收正常勾选工程量清单，竣工验收需要判断工程量清单是否全部勾选，不全部勾选不让点确定。
    if(this.itemShow.clauseType=="4" && isAll == false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "验收类型：竣工验收，工程量清单要全部勾选！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    //成本属性”（1.直接成本2.间接费用）
    //间接费用 不可以打开验收明细和勾选工程量清单
    if(this.itemShow.costProperty==2 && isHave == true){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "成本属性：间接费用，不可以勾选工程量清单！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
      console.log("ReviewType：" + ReviewType[ReviewType.BASICACCEPTANCE_APPLY]);
      this.navCtrl.push(Page_ChoiceApproversPage, {callback:this.checkRefresh,BillNumberCode: this.billNumber, BillContractCode:this.itemShow.contractCode,'reviewType':ReviewType[ReviewType.BASICACCEPTANCE_APPLY]});
  }

  //回调
  checkRefresh = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
         this.sendSuccess=true;
      }
      resolve();
    });
  };

  //工程量清单
  billOfGcl(){
    if(this.sendSuccess!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "单据已送审！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    if(!(this.billNumber!=null&&this.billNumber.trim()!="")){// || this.billOfGclIsSaved == false
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请先保存验收信息，再选择工程量信息！',
          buttons: ['确定']
        });
        alert.present();
        return;
    }
    //成本属性”（1.直接成本2.间接费用）
    //间接费用 不可以打开验收明细和勾选工程量清单
    /*if(this.itemShow.costProperty==2){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "成本属性：间接费用，不可以勾选工程量清单！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }*/
    //if(this.applyFrom.get('contractCode').value==null||this.applyFrom.get('contractCode').value==""){
    //  let alert = this.alertCtrl.create({
    //    title: '提示',
    //    subTitle: '请先选择合同流水号，再选择工程量信息！',
    //    buttons: ['确定']
    //  });
    //  alert.present();
    //  return;
    //}
    this.navCtrl.push("BillGclSelectPage",{ItemTranfer:this.itemShow,'type':'ys',callback:this.choiceGclOk});
  }

  //回调获取选择的工程量清单
  choiceGclOk = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log("choiceGclOk");
      //this.gclListInfo=data;
      //this.billOfGclIsSaved = false;
      if(data){
        this.isBackRefresh = true;
        this.getShowItem();
      }
      resolve();
    });
  };
  
  //资产明细
  toAssetDetail(){
    if(this.sendSuccess!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "单据已送审！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
      if(!(this.billNumber!=null&&this.billNumber.trim()!="")){// || this.billOfGclIsSaved == false
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请先保存验收信息，再进行维护资产明细信息！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
      //成本属性”（1.直接成本2.间接费用）
      //间接费用 不可以打开验收明细和勾选工程量清单
      /*if(this.itemShow.costProperty==2){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: "成本属性：间接费用，不可以打开验收明细！",
          buttons: ['确定']
        });
        alert.present();
        return;
      }
      let haveGcl: boolean = false;
      if(this.gclListInfo){
        for(let seq of this.gclListInfo){
          if(seq.acceptanceCode==this.billNumber){
            haveGcl = true;
          }
        }
      }
      if(haveGcl == false){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请先选择工程量信息，再进行维护资产明细信息！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }*/
      console.log(this.itemShow.requireDate);
      this.navCtrl.push(Page_AssetDetailsListPage, {BillNumberCode: this.billNumber, BillContractCode:this.itemShow.contractCode, 'BillAddTime':this.itemShow.requireDate, TypeView:TypeView_AcceptApply});
  }

  //选择合同
  choiceContract(){
    if(this.sendSuccess!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "单据已送审！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
      this.navCtrl.push(Page_ContractChoiceListPage,  {callback: this.choiceContractOk});
  }

  choiceContractOk = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
          this.itemShow.contractCode = data.contractCode;
          this.itemShow.contractName = data.contractName;
          this.itemShow.elementCode = data.elementCode;
          this.itemShow.elementName = data.elementName;
          this.FromPatchValue();
      }
      resolve();
    });
  }

  //附件列表
  attachment(){
    if(this.sendSuccess!=false){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "单据已送审！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    if(!(this.billNumber!=null&&this.billNumber.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先保存验收信息，再进行维护附件信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.navCtrl.push("AttachmentPage",{'billNumber':this.billNumber,'contractCode':'','type':'1','attachmentType':'2','typeList':'1'});
  }

}
