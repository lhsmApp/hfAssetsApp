import { Component,ViewChild } from '@angular/core';
import { IonicPage, ModalController,NavController, NavParams,AlertController,ToastController,Navbar } from 'ionic-angular';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import { InvoiceMain} from '../../model/invoice-main';
import { InvoiceDetail} from '../../model/invoice-detail';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { DictUtil} from '../../providers/dict-util';
import {INVOICE_TYPE} from '../../enums/enums';
import {ReviewType} from '../../enums/review-type';
import { InvoiceContent} from '../../enums/enums';

import {Oper,Oper_Look,Oper_Edit,Oper_Add,Oper_Approval} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';

/**
 * Generated class for the InvoiceApprovalItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-approval-item',
  templateUrl: 'invoice-approval-item.html',
})
export class InvoiceApprovalItemPage {
  @ViewChild('myNavbar') navBar: Navbar;
  
  title:string;
  oper:string;
  contractCode:string;
  paymentMain:AdvancePaymentMain;
  invoiceMain:InvoiceMain;

  itemShow:InvoiceDetail;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl:AlertController,
              private paymentService:PaymentService,
              private modalCtrl: ModalController,
              private dictUtil:DictUtil) {
    this.itemShow = new InvoiceDetail();
    this.oper=this.navParams.get(Oper);
    this.title = this.navParams.get(Title);
    this.contractCode=this.navParams.get('contractCode');
    this.paymentMain=this.navParams.get("paymentItem");
  	this.invoiceMain = this.navParams.get('invoiceItem');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoiceApprovalItemPage');
    this.itemShow = new InvoiceDetail();
    this.initData();
  }

  //初始化数据
  initData(){
    this.itemShow = new InvoiceDetail();
    this.paymentService.getInvoiceDetail(this.paymentMain.payCode,this.invoiceMain.chalanNumber)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          console.log(object[1][0]);
          this.itemShow = object[1][0] as InvoiceDetail;
          this.itemShow.chalanTypeName=this.dictUtil.getEnumsName(INVOICE_TYPE,this.itemShow.chalanType);
          this.itemShow.chalanContentName = this.dictUtil.getEnumsName(InvoiceContent, this.itemShow.chalanContent);
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
    if(this.oper === Oper_Edit || this.oper === Oper_Add){
      this.navCtrl.push("AttachmentPage",{'billNumber':this.itemShow.sequence,'contractCode':this.contractCode,'type':'2','attachmentType':'3','typeList':'2'});
    }else{
    	this.navCtrl.push("AttachmentInfoPage",{'billNumber':this.itemShow.sequence,'contractCode':this.contractCode,'type':'2','attachmentType':'3','typeList':'2'});
    }
  }

}
