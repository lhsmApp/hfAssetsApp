import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { BillOfWorkMain} from '../../model/billof-work-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {BillNumberCode} from '../../providers/TransferFeildName';
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
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  workList:BillOfWorkMain[];
  callback :any;
  billNumber:string;//单号
  contractCode:string;//合同流水号

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,private paymentService:PaymentService) {
	  //this.workList=WORK_LIST;
    this.billNumber = this.navParams.get(BillNumberCode);
    this.contractCode=this.navParams.get('contractCode');
    this.callback = this.navParams.get('callback');
  }

  ionViewDidLoad() {
    this.getList();
  }

  //获取工程量列表信息
  getList() {
    //getGclMainList(contractCode:string,type:string,payCode:string,sequence :string)
    this.paymentService.getGclMainList(this.contractCode,'ys','','0',this.billNumber)
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
              }else if(workItem.acceptanceCode==this.billNumber){
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


  //确定选择
  confirm(){
    this.callback(this.workList).then(()=>{ this.navCtrl.pop() });
  	//this.navCtrl.pop();
  }

  //查看明细
  viewDetail(item: BillOfWorkMain){
  	this.navCtrl.push("BillGclDetailPage",{"gclItem":item,'contractCode':this.contractCode});
  }

}
