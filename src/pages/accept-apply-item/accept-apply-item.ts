import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {DictUtil} from '../../providers/dict-util';
import {IonicPage, NavController, NavParams, ViewController,ModalController,AlertController,ToastController} from 'ionic-angular';
import {AcceptApplyDetail} from '../../model/accept-apply-detail';
import {Depart} from '../../model/depart';
import {GlobalData} from "../../providers/GlobalData";
import {Utils} from "../../providers/Utils";
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import {ReviewType} from '../../enums/review-type';

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
  oper:string;
  billNumber:string;

  applyFrom:any;
  list: AcceptApplyDetail[];
  itemShow:AcceptApplyDetail;
  listDept: DicInDepart[];
  callback :any;
  isBackRefrash=false;

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
              private globalData: GlobalData) {
    this.itemShow = new AcceptApplyDetail();
  	this.oper = this.params.get(Oper);
  	this.billNumber = this.params.get(BillNumberCode);
    this.callback    = this.params.get('callback');
    this.isBackRefrash=false;
    //this.listDept = listDeptGet;

    this.applyFrom = this.formBuilder.group({
      contractCode: [, [Validators.required]],
      contractName: [, []],
      elementCode: [, []],
      elementName: [, []],
      departCode: [, [Validators.required]],
      requireDate: [, [Validators.required]],
      requireUser: [, [Validators.required]],

      billNumber: [, []],
      reviewStatus: [, []],
      
      departName: [, []],
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

      billNumber: this.itemShow.billNumber,
      reviewStatus: this.itemShow.reviewStatus,
      
      departName: this.itemShow.departName,
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcceptApplyItemPage');
    this.isBackRefrash=false;
    this.itemShow = new AcceptApplyDetail();
    this.storage.get(IN_DEPART).then((inDepart: DicInDepart[]) => {
      this.listDept=inDepart;
    });
    this.getShowItem();
  }

  getShowItem(){
    this.itemShow = new AcceptApplyDetail();
    if(this.oper === Oper_Edit){
      console.log(this.oper);
      this.acceptService.getAcceptDetailItem(this.billNumber).subscribe(
        object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.list = object[1] as AcceptApplyDetail[];
            if(this.list && this.list.length > 0){
              this.itemShow = this.list[0] as AcceptApplyDetail;
              this.itemShow.departName = this.dictUtil.getInDepartName(this.listDept,this.itemShow.departCode);
              this.FromPatchValue();
            } else {
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: resultBase.message,
              buttons: ['确定']
            });
            alert.present();
        }
          }
        }, () => {
        
        });
      //this.itemShow = item;
      //this.FromPatchValue();
    } else if(this.oper === Oper_Add){
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
      this.FromPatchValue();
    } else {
      this.FromPatchValue();
    }
  }

  //保存
  save(){
    let transferInfo=new Array<AcceptApplyDetail>();
    let detail=this.applyFrom.value as AcceptApplyDetail;
    detail.requireDate =  Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm');
    transferInfo.push(detail);

    this.acceptService.saveAcceptApplyMain(JSON.stringify(transferInfo))
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.isBackRefrash=true;
          this.oper = Oper_Edit;
          console.log(object[1][0]);
          this.itemShow = object[1][0] as AcceptApplyDetail;
          this.billNumber = this.itemShow.billNumber;
          this.FromPatchValue();
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
      if(!(this.billNumber!=null&&this.billNumber.trim()!="")){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请保存后再进行送审！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
      console.log("ReviewType：" + ReviewType[ReviewType.BASICACCEPTANCE_APPLY]);
      this.navCtrl.push(Page_ChoiceApproversPage, {callback:this.checkRefresh,BillNumberCode: this.billNumber,'reviewType':ReviewType[ReviewType.BASICACCEPTANCE_APPLY]});
  }

  //回调
  checkRefresh = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
         this.isBackRefrash=true;
      }
      resolve();
    });
  };
  
  //资产明细
  toAssetDetail(){
      if(!(this.billNumber!=null&&this.billNumber.trim()!="")){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请先保存验收信息，再进行维护资产明细信息！',
          buttons: ['确定']
        });
        alert.present();
        return;
      }
      console.log(this.itemShow.requireDate);
      this.navCtrl.push(Page_AssetDetailsListPage,  {BillNumberCode: this.billNumber, BillContractCode:this.itemShow.contractCode, 'BillAddTime':this.itemShow.requireDate, TypeView:TypeView_AcceptApply});
  }

  //选择合同
  choiceContract(){
      this.navCtrl.push(Page_ContractChoiceListPage,  {callback: this.choiceOk});
  }

  choiceOk = (data) =>
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

  goBack(){
    console.log('back');
    if(this.isBackRefrash){
      this.callback(this.isBackRefrash).then(()=>{ this.navCtrl.pop() });
    }else{
      this.navCtrl.pop();
    }
  }

}
