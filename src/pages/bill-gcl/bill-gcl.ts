import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { BillOfWorkMain} from '../../model/billof-work-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
/**
 * Generated class for the BillGclPage page.
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
 * 工程量清单列表
 * Created by jiachao on 2017-09-29.
 */
@IonicPage()
@Component({
  selector: 'page-bill-gcl',
  templateUrl: 'bill-gcl.html',
})
export class BillGclPage {
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  workList:BillOfWorkMain[];
  paymentMain:AdvancePaymentMain;
  contractCode:string;
  type:string;//ht，fk
  sequence:string;//合同序号sequence

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,private paymentService:PaymentService) {
	  //this.workList=WORK_LIST;
    this.paymentMain=this.navParams.get("paymentItem");
    this.contractCode=this.navParams.get('contractCode');
    this.type=this.navParams.get('type');
    this.sequence=this.navParams.get('sequence');
  }

  ionViewDidLoad() {
    this.getList();
  }

  //获取工程量列表信息
  getList() {
    let nullItem1='0';
    let payCode='';
    if(this.type=='ht')
      nullItem1=this.sequence;
    else
      payCode=this.paymentMain.payCode;
    this.paymentService.getGclMainList(this.contractCode,this.type,payCode,nullItem1)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          if(object[1]!=null&&object[1].length>0){
            this.isEmpty=false;
            this.workList = object[1] as BillOfWorkMain[];
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
  openPage(item: BillOfWorkMain){
    //this.navCtrl.push("BillGclDetailPage",{id:id});
    this.navCtrl.push("BillGclDetailPage",{"gclItem":item,'paymentItem':this.paymentMain,'contractCode':this.contractCode});
  }

}
