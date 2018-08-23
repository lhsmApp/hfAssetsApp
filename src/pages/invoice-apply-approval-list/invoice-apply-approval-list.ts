import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ItemSliding,Navbar } from 'ionic-angular';
import { InvoiceMain} from '../../model/invoice-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
import { InvoiceContent} from '../../enums/enums';
import {DictUtil} from "../../providers/dict-util";
import {INVOICE_TYPE} from '../../enums/enums';

import {Oper,Oper_Edit,Oper_Add,Oper_Approval,Oper_Look} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';

/**
 * Generated class for the InvoiceApplyApprovalListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-apply-approval-list',
  templateUrl: 'invoice-apply-approval-list.html',
})
export class InvoiceApplyApprovalListPage {
  @ViewChild('myNavbar') navBar: Navbar;
  
  oper:String;
  title:String;
  paymentMain:AdvancePaymentMain;
  contractCode:string;

    listAll:InvoiceMain[];
    list:InvoiceMain[];

  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEdit:boolean=false;
  isEmpty:boolean=false;
  sendSuccess=false;
  callback :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,
              private paymentService:PaymentService,
              private dictUtil:DictUtil) {
    this.isEdit = false;
    this.oper=this.navParams.get(Oper);
    this.title=this.navParams.get(Title);
  	this.paymentMain=this.navParams.get("paymentItem");
    this.contractCode=this.navParams.get('contractCode');
    this.callback = this.navParams.get('callback');
    if(this.oper === Oper_Edit || this.oper === Oper_Add){
        //添加、编辑、删除单据按钮是否显示
        this.isEdit = true;
    }
    if(this.oper === Oper_Approval || this.oper === Oper_Look){
    }
    this.sendSuccess=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoiceApplyApprovalListPage');
    this.navBar.backButtonClick=()=>{
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    this.sendSuccess=false;
    this.getList();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //获取发票列表信息
  getList() {
      this.isEmpty=false;
      this.paymentService.getInvoiceMainList(this.paymentMain.payCode,'')
        .subscribe(object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.listAll = object[1] as InvoiceMain[];
            if(this.listAll){
              for(let item of this.listAll){
            //    item.chalanContentName = this.dictUtil.getEnumsName(InvoiceContent, item.chalanContent);
                item.chalanTypeName=this.dictUtil.getEnumsName(INVOICE_TYPE,item.chalanType);
              }
            }
            this.list = this.listAll;
            if(!(this.listAll!=null&&this.listAll.length>0)){
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

  //模糊查询
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.list = this.listAll.filter((item) => {
        return (item.chalanNumber.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.list = this.listAll;
    }
  }

  //上拉刷新
  doRefresh(refresher) {
    this.getList();
    refresher.complete();
  }


  //打开详情页
  openPage(item: InvoiceMain) {
  	this.navCtrl.push("InvoiceApprovalItemPage",{"paymentItem":this.paymentMain,"contractCode":this.contractCode,"invoiceItem":item,Oper:this.oper,Title:this.title});
  }

  //增加
  add(){
    this.navCtrl.push("InvoiceApplyItemPage",{callback:this.checkRefresh,Oper:Oper_Add,"paymentItem":this.paymentMain,"contractCode":this.contractCode,Title:this.title});
  }

  //编辑
  edit(item: InvoiceMain, slidingItem: ItemSliding){
    slidingItem.close();
    this.navCtrl.push("InvoiceApplyItemPage",{callback:this.checkRefresh,Oper:Oper_Edit,"invoiceItem":item,"paymentItem":this.paymentMain,"contractCode":this.contractCode,Title:this.title});
  }

  //回调
  checkRefresh = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
          this.getList();
      }
      resolve();
    });
  };

  //删除
  delete(item: InvoiceMain, slidingItem: ItemSliding){
    slidingItem.close();
    console.log(item);
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
            console.log(item.chalanNumber);
            this.paymentService.deleteInvoiceMain(this.paymentMain.payCode,item.chalanNumber)
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                this.getList();
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
