import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import { InvoiceMain} from '../../model/invoice-main';
import { InvoiceDetail} from '../../model/invoice-detail';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { DictUtil} from '../../providers/dict-util';
import {INVOICE_TYPE} from '../../enums/enums';
import {TrueOrFalse} from '../../enums/enums';
import { InvoiceContent} from '../../enums/enums';
/**
 * Generated class for the InvoiceInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-info',
  templateUrl: 'invoice-info.html',
})
export class InvoiceInfoPage {
  apply:boolean=false;
  invoiceMain:InvoiceMain;
  invoiceDetail:InvoiceDetail;
  paymentMain:AdvancePaymentMain;
  contractCode:string;

  constructor(public navCtrl: NavController,
   public navParams: NavParams,
   public alertCtrl:AlertController,
   private paymentService:PaymentService,
   private dictUtil:DictUtil) {
    this.apply=this.navParams.get('apply');
    this.invoiceMain=this.navParams.get("invoiceItem");
    this.paymentMain=this.navParams.get("paymentItem");
    this.contractCode=this.navParams.get('contractCode');
  }

  ionViewDidLoad() {
    this.initData();
  }

  //初始化数据
  initData(){
    this.paymentService.getInvoiceDetail(this.paymentMain.payCode,this.invoiceMain.chalanNumber)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          console.log(object[1][0]);
          this.invoiceDetail = object[1][0] as InvoiceDetail;
          this.invoiceDetail.chalanTypeName=this.dictUtil.getEnumsName(INVOICE_TYPE,this.invoiceDetail.chalanType);
          //this.invoiceDetail.chalanContentName = this.dictUtil.getEnumsName(InvoiceContent, this.invoiceDetail.chalanContent);
          this.invoiceDetail.uploadFlagName=this.dictUtil.getNumEnumsName(TrueOrFalse,this.invoiceDetail.uploadFlag);
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
    console.log(this.apply);
    if(this.apply){
      this.navCtrl.push("AttachmentPage",{callback:this.attachmentChanged,'billNumber':this.invoiceDetail.sequence,'contractCode':this.contractCode,'type':'2','attachmentType':'3','typeList':'2'});
    }else{
    	this.navCtrl.push("AttachmentInfoPage",{'billNumber':this.invoiceDetail.sequence,'contractCode':this.contractCode,'type':'2','attachmentType':'3','typeList':'2'});
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
