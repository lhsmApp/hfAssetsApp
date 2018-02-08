import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController,Navbar } from 'ionic-angular';
import { BillOfWorkMain} from '../../model/billof-work-main';
import { PaymentService} from '../../services/paymentService';
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
import {AcceptApplyDetail} from '../../model/accept-apply-detail';

import {ItemTranfer} from '../../providers/TransferFeildName';
/**
 * Generated class for the BillGclSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/*const  WORK_LIST: BillOfWorkMain []= [  
 { payCode: 'FKD2017080001', sequence: '001', listNumber: 'QD001',listName: '牙膏'},
 { payCode: 'FKD2017080002', sequence: '002' ,listNumber: 'QD002',listName: '铁锹'},
 { payCode: 'FKD2017080003', sequence: '003' ,listNumber: 'QD003',listName: '自行车'},
 { payCode: 'FKD2017080004', sequence: '004' ,listNumber: 'QD004',listName: '扳手'}
 ];*/

/**
 * 工程量清单列表多选选择
 * Created by jiachao on 2017-09-29.
 */
@IonicPage()
@Component({
  selector: 'page-bill-gcl-select',
  templateUrl: 'bill-gcl-select.html',
})
export class BillGclSelectPage {
  @ViewChild('myNavbar') navBar: Navbar;

  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  workList:BillOfWorkMain[];
  callback :any;
  //billNumber:string;//单号
  //contractCode:string;//合同流水号
  itemTranfer:AcceptApplyDetail;
  type:string;//ht，fk,htAssets

  isBackRefresh = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl:AlertController,
              public acceptService:AcceptService, 
              public toastCtrl:ToastController,
              private paymentService:PaymentService) {
	  //this.workList=WORK_LIST;
    //this.billNumber = this.navParams.get(BillNumberCode);
    //this.contractCode=this.navParams.get('contractCode');
    this.itemTranfer=this.navParams.get(ItemTranfer);
    this.type=this.navParams.get('type');
    this.callback = this.navParams.get('callback');
    this.isBackRefresh = false;
  }

  ionViewDidLoad() {
    this.isBackRefresh = false;

    this.navBar.backButtonClick=()=>{
      this.callback(this.isBackRefresh).then(()=>{ this.navCtrl.pop()});
      //this.navCtrl.pop();
    }

    this.getList();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //获取工程量列表信息
  getList() {
    let payCode:string = '';
    let sequence:string = '';
    if(this.type=='ys'){
      sequence = '0';
    }
    //getGclMainList(contractCode:string,type:string,payCode:string,sequence :string,billNumber:string)
    this.paymentService.getGclMainList(this.itemTranfer.contractCode,this.type,payCode,sequence,this.itemTranfer.billNumber)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          if(object[1]!=null&&object[1].length>0){
            this.isEmpty=false;
            this.workList = object[1] as BillOfWorkMain[];
            for(let workItem of this.workList){
              if(workItem.acceptanceCode==null||workItem.acceptanceCode.trim()==""){
                workItem.checked=false;
                workItem.gclType='3';
                workItem.disabled=false;
              }else if(workItem.acceptanceCode==this.itemTranfer.billNumber){
                workItem.checked=true;
                workItem.gclType="1";
                workItem.disabled=false;
              }else{
                workItem.checked=false;
                workItem.gclType='2';
                workItem.disabled=true;
              }
            }
          }else{
            this.isEmpty=true;
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

  //上拉刷新
  doRefresh(refresher) {
  	this.getList();
  	refresher.complete();
  }

  //查看明细
  viewDetail(item: BillOfWorkMain){
  	this.navCtrl.push("BillGclDetailPage",{"gclItem":item,'contractCode':this.itemTranfer.contractCode});
  }


  //确定选择
  confirm(){
    let transferInfo=new Array<AcceptApplyDetail>();
    transferInfo.push(this.itemTranfer);

    //console.log(this.gclListInfo);
    let isHave:boolean = false;
    let isAll:boolean = true;
    let datalist=new Array();
    let seqceList =[];
    let xzList =[];
    let seqceStr='';
    let xzStr='';
    if(this.workList){
      for(let seq of this.workList){
        if(seq.acceptanceCode==this.itemTranfer.billNumber || seq.checked==true){
          seqceList.push(seq.sequence);
          if(seq.checked==true){
            xzList.push(1);
          }else{
            xzList.push(0);
          }
        }
        if(seq.checked==true){
          isHave = true;
        }else{
          if(!(seq.acceptanceCode!=null && seq.acceptanceCode.trim()!="") || seq.acceptanceCode==this.itemTranfer.billNumber){
            isAll = false;
          }
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
      let gclInfo={cCode:this.itemTranfer.contractCode,billNumber:this.itemTranfer.billNumber,seqceList:seqceStr,xzList:xzStr};
      datalist.push(gclInfo);
    }else{
      let gclInfo={cCode:this.itemTranfer.contractCode,billNumber:this.itemTranfer.billNumber,seqceList:'',xzList:''};
      datalist.push(gclInfo);
    }
    //验收类型（2.进度验收，4，竣工验收）
    //验收单据加验收类型：（进度验收，竣工验收）进度验收正常勾选工程量清单，竣工验收需要判断工程量清单是否全部勾选，不全部勾选不让点确定。
    if(this.itemTranfer.clauseType=="4" && isAll == false){
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
    if(this.itemTranfer.costProperty==2 && isHave == true){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "成本属性：间接费用，不可以勾选工程量清单！",
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.acceptService.saveAcceptApplyMain(JSON.stringify(transferInfo),JSON.stringify(datalist))
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.isBackRefresh = true;
          this.getList();
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

}
