import { Component,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Navbar } from 'ionic-angular';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PaymentService} from '../../services/paymentService';
import { ResultBase} from "../../model/result-base";
import { DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {Oper,Oper_Edit,Oper_Add,Oper_Approval,Oper_Look} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';

/**
 * Generated class for the InvoicePaymentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-payment-list',
  templateUrl: 'invoice-payment-list.html',
})
export class InvoicePaymentListPage {
  @ViewChild('myNavbar') navBar: Navbar;
  
  oper:String;
  title:String;

  listAll:AdvancePaymentMain[];
  list:AdvancePaymentMain[];

  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  sendSuccess=false;
  callback :any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl:AlertController,
    private paymentService:PaymentService) {
    //this.listAll = [];
    //this.list = [];
    this.oper = this.navParams.get(Oper);
    this.title = this.navParams.get(Title);
    this.callback = this.navParams.get('callback');
    this.sendSuccess=false;
  }

  //初始化View
  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePaymentListPage');
    this.sendSuccess=false;
    if(this.oper === Oper_Approval){
      this.navBar.backButtonClick=()=>{
        if(this.sendSuccess){
          this.callback(true).then(()=>{ this.navCtrl.pop() });
        }else{
          this.navCtrl.pop();
        }
      }
    }
    //this.listAll = [];
    //this.list = [];
    this.getList();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    if(this.oper === Oper_Approval){
      this.callback(true).then(()=>{ this.navCtrl.pop() });
    }
  }

  //获取付款单列表信息
  getList(){
    this.isEmpty=false;
      let send_status="";
      let payCode="";
      let startDate="";
      let endDate="";
      if(this.oper === Oper_Edit || this.oper === Oper_Add){
        send_status = "0,2";
      }
      if(this.oper === Oper_Approval){
        send_status = "1";
      }
      if(this.oper === Oper_Look){
        send_status = "";
      }
      //send_status字段，int型  0默认，1送审，2，退回，3审批完成
      //getPaymentMainList(type:string,reviewStatus:string,payCode:string,startDate:string,endDate:string)
      this.paymentService.getPaymentMainList('4','',payCode,startDate,endDate,send_status)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as AdvancePaymentMain[];
          this.list = this.listAll;
          if(!(this.listAll!=null&&this.listAll.length>0)){
            this.isEmpty=true;
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
        return (item.payCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
        this.list=this.listAll;
    }
  }

  //上拉刷新
  doRefresh(refresher) {
  	this.getList();
  	refresher.complete();
  }

  //打开详情页
  openPage(item: AdvancePaymentMain) {
    this.navCtrl.push("InvoicePaymentInfoPage",{callback:this.checkRefresh,"paymentItem":item,Oper:this.oper,Title:this.title});
  }

  //回调
  checkRefresh = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
          this.sendSuccess=data;
          this.getList();
      }
      resolve();
    });
  };
}
