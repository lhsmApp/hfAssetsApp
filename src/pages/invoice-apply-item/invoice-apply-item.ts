import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController ,Navbar} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import { InvoiceDetail} from '../../model/invoice-detail';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import { InvoiceMain} from '../../model/invoice-main';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { INVOICE_TYPE} from '../../enums/enums';
import {TrueOrFalse} from '../../enums/enums';
import {ReviewType} from '../../enums/review-type';
import { DictUtil} from '../../providers/dict-util';
import {Utils} from "../../providers/Utils";
import { InvoiceContent} from '../../enums/enums';

import {Oper,Oper_Add,Oper_Edit} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';

/**
 * Generated class for the InvoiceApplyItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-apply-item',
  templateUrl: 'invoice-apply-item.html',
})
export class InvoiceApplyItemPage {
  @ViewChild('myNavbar') navBar: Navbar;
  
  title:string;
  oper:string;
  contractCode:string;
  paymentMain:AdvancePaymentMain;
  invoiceMain:InvoiceMain;

  list: InvoiceDetail[];
  itemShow:InvoiceDetail;

  invoiceForm: any;
  invoiceType=INVOICE_TYPE;
  invoiceContent=InvoiceContent;
  callback :any;
  sendSuccess = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl:AlertController,
    public toastCtrl:ToastController,
   private dictUtil:DictUtil,
    private formBuilder: FormBuilder,private paymentService:PaymentService) {
    this.itemShow = new InvoiceDetail();

    this.oper = this.navParams.get(Oper);
    this.title = this.navParams.get(Title);
    this.contractCode=this.navParams.get('contractCode');
    this.paymentMain=this.navParams.get("paymentItem");
    this.invoiceMain = this.navParams.get('invoiceItem');

    this.callback    = this.navParams.get('callback');
    this.sendSuccess = false;

    this.invoiceForm = this.formBuilder.group({
      chalanNumber: [,[]],//发票编号，手工录入
      chalanType: [,[Validators.required]],//发票类型，选择
      chalanDate : [,[Validators.required]],//开票日期，手工录入
      chalanMoney : [,[Validators.required]],//发票金额，手工录入 含税金额
      noTaxMoney: [,[Validators.required]],//不含税金额，手工录入
      sl: [,[Validators.required]],//税率，手工录入
      deductibleInputString : [,[Validators.required]],//可抵扣进项税，手工录入
    ldje : [,[Validators.required]],//留抵金额
    uploadFlag : [,[Validators.required]],//是否已上传扫描件
    uploadFlagName : [,[]],//是否已上传扫描件
    remark : [,[]],//备注

      sequence: [,[]],//序号，自动生成，判断是否为空，空为增加，有则修改
      chalanContent: [,[]],//发票内容，选择
      price: [,[]],//发票单价，手工录入
      singleAmount: [,[]],//发票数量，手工录入
      taxNumber: [,[]],//完税凭证号，手工录入
    })
  }

  FromPatchValue(){
            this.invoiceForm.patchValue({
            chalanNumber:this.itemShow.chalanNumber,
            chalanType:this.itemShow.chalanType,
            chalanDate:this.itemShow.chalanDate,
            chalanMoney:this.itemShow.chalanMoney,
            noTaxMoney:this.itemShow.noTaxMoney,
            sl:this.itemShow.sl,
            deductibleInputString:this.itemShow.deductibleInputString,
    ldje:this.itemShow.ldje,
    uploadFlag:this.itemShow.uploadFlag,
    uploadFlagName:this.itemShow.uploadFlagName,
    remark:this.itemShow.remark,

            sequence:this.itemShow.sequence,
            chalanContent:this.itemShow.chalanContent,
            price:this.itemShow.price,
            singleAmount:this.itemShow.singleAmount,
            taxNumber:this.itemShow.taxNumber,
            });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoiceApplyItemPage');
    this.navBar.backButtonClick=()=>{
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    this.sendSuccess = false;
    this.itemShow = new InvoiceDetail();
    this.initData();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //初始化数据
  initData(){
    this.itemShow = new InvoiceDetail();
    if(this.oper === Oper_Edit){
      console.log(this.oper);
      this.paymentService.getInvoiceDetail(this.paymentMain.payCode,this.invoiceMain.chalanNumber)
        .subscribe(object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.list = object[1] as InvoiceDetail[];
            if(this.list && this.list.length > 0){
              this.itemShow = this.list[0] as InvoiceDetail;
              this.itemShow.uploadFlagName=this.dictUtil.getNumEnumsName(TrueOrFalse,this.itemShow.uploadFlag);
              this.FromPatchValue();
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
    } else if(this.oper === Oper_Add){
      console.log(this.oper);
      this.itemShow.chalanDate = Utils.dateFormat(new Date());
      this.itemShow.uploadFlagName=this.dictUtil.getNumEnumsName(TrueOrFalse,this.itemShow.uploadFlag);
      this.FromPatchValue();
    } else {
      this.FromPatchValue();
    }
  }

  //附件列表
  attachment(item){
    let sequence=this.invoiceForm.get('sequence').value;
    if(!(sequence!=null&&sequence.trim()!="")){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请先保存，再进行维护附件信息！',
        buttons: ['确定']
      });
      alert.present();
      return;
    }
    this.navCtrl.push("AttachmentPage",{callback:this.attachmentChanged,'billNumber':this.itemShow.sequence,'contractCode':this.contractCode,'type':'2','attachmentType':'3','typeList':'2'});
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

  //发票保存
  save(){
    let invoiceInfo=new Array<InvoiceDetail>();
    let detail=<InvoiceDetail>this.invoiceForm.value;
    detail.chalanMoney = parseFloat(detail.chalanMoney.toString());
    detail.noTaxMoney=parseFloat(detail.noTaxMoney.toString());
    //detail.sl =parseFloat(detail.sl.toString());
    //detail.deductibleInputString =parseFloat(detail.deductibleInputString.toString());
    detail.ldje =parseFloat(detail.ldje.toString());
    console.log(detail);
    invoiceInfo.push(detail);

    this.paymentService.saveInvoiceMain(this.paymentMain.payCode,detail.chalanNumber,JSON.stringify(invoiceInfo))
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.sendSuccess = true;
          this.oper = Oper_Edit;
          this.invoiceMain = new InvoiceMain();
          console.log(object[1][0]);
          this.itemShow = object[1][0] as InvoiceDetail;
          this.invoiceMain.chalanNumber = this.itemShow.chalanNumber
          this.FromPatchValue();
          this.initData();
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

