import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ItemSliding } from 'ionic-angular';
import { InvoiceMain} from '../../model/invoice-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
/**
 * Generated class for the InvoiceApplyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const  INVOICE_LIST: InvoiceMain []= [  
 { chalanNumber: 'FP2017080001', chalanContent: '付款缺失合同明细', chalanMoney: 2000,chalanDate: '2017-09-30'},
 { chalanNumber: 'FPD2017080002', chalanContent: '进度款需要申请' ,chalanMoney: 3000,chalanDate: '2017-09-30'},
 { chalanNumber: 'FPD2017080003', chalanContent: '进度款需要申请' ,chalanMoney: 40000,chalanDate: '2017-09-30'},
 { chalanNumber: 'FPD2017080004', chalanContent: '进度款需要申请' ,chalanMoney: 50000,chalanDate: '2017-09-30'}
 ];

@IonicPage()
@Component({
  selector: 'page-invoice-apply-list',
  templateUrl: 'invoice-apply-list.html',
})
export class InvoiceApplyListPage {
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  invoiceList:InvoiceMain[];
  paymentMain:AdvancePaymentMain;
  contractCode:string;
  apply:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,private paymentService:PaymentService) {
  	//this.invoiceList=INVOICE_LIST;
    this.apply=this.navParams.get('apply');
    this.paymentMain=this.navParams.get("paymentItem");
    this.contractCode=this.navParams.get('contractCode');
  }

  ionViewDidLoad() {
    this.getList();
  }

  //获取发票列表信息
  getList() {
    if(this.paymentMain){
      this.paymentService.getInvoiceMainList(this.paymentMain.payCode,'')
        .subscribe(object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            if(object[1]!=null&&object[1].length>0){
              this.isEmpty=false;
              this.invoiceList = object[1] as InvoiceMain[];
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
  }


  //打开详情页
  openPage(item: InvoiceMain) {
  	//this.appCtrl.getRootNav().push(HomeDetailPage, { id: id });
  	this.navCtrl.push("InvoiceInfoPage",{"invoiceItem":item,'paymentItem':this.paymentMain,'contractCode':this.contractCode,'apply':this.apply});
  }

  //回调
  saveSend = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
          this.getList();
      }
      resolve();
    });
  };

  //上拉刷新
  doRefresh(refresher) {
  	this.getList();
  	refresher.complete();
  }

  //增加
  add(){
  	this.navCtrl.push("InvoiceApplyPage",{callback:this.saveSend,'paymentItem':this.paymentMain,contractCode:this.contractCode});
  }

  //编辑
  edit(item: InvoiceMain, slidingItem: ItemSliding){
    slidingItem.close();
	  this.navCtrl.push("InvoiceApplyPage",{callback:this.saveSend,"invoiceItem":item,'paymentItem':this.paymentMain,contractCode:this.contractCode});
  }

  //删除
  delete(item: InvoiceMain, slidingItem: ItemSliding){
    slidingItem.close();
    let confirm = this.alertCtrl.create({
      title: '删除提示?',
      message: '确认要删除当前发票吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('cancel');
          }
        },
        {
          text: '确认',
          handler: () => {
            this.paymentService.deleteInvoiceMain(this.paymentMain.payCode,item.chalanNumber)
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                //this.listAll.unshift(item);
                //this.advancePaymentList.unshift(item);
                this.invoiceList = this.invoiceList.filter(h => h !== item);
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
        }
      ]
    });
    confirm.present();
  }
}
