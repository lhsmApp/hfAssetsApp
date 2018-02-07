import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Navbar } from 'ionic-angular';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

/**
 * Generated class for the AdvancePaymentApprovalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 /*const  ADVANTAGE_LIST: AdvancePaymentMain []= [  
 { payCode: 'FKD2017080001', payDigest: '付款缺失合同明细', reviewStatus: '1',requireUser: 'jiachao'},
 { payCode: 'FKD2017080002', payDigest: '进度款需要申请' ,reviewStatus: '2',requireUser: 'zhangsan'},
 { payCode: 'FKD2017080003', payDigest: '进度款需要申请' ,reviewStatus: '3',requireUser: 'zhangsan'},
 { payCode: 'FKD2017080004', payDigest: '进度款需要申请' ,reviewStatus: '4',requireUser: 'zhangsan'}
 ];*/

@IonicPage()
@Component({
  selector: 'page-advance-payment-approval',
  templateUrl: 'advance-payment-approval.html',
})
export class AdvancePaymentApprovalPage {
  @ViewChild('myNavbar') navBar: Navbar;

  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  advancePaymentList:AdvancePaymentMain[];
  listAll:AdvancePaymentMain[];
  callback :any;
  sendSuccess=false;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl:AlertController,
    private paymentService:PaymentService) {
    this.callback    = this.navParams.get('callback');
  	//this.advancePaymentList=ADVANTAGE_LIST;
  }

  //初始化View
  ionViewDidLoad() {
    this.sendSuccess=false;
    this.navBar.backButtonClick=()=>{
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
    this.getList();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  //获取付款单列表信息
  getList(){
      let state="1,3";
      //getPaymentMainList(type:string,reviewStatus:string,payCode:string,startDate:string,endDate:string)
      this.paymentService.getPaymentMainList('3','',"","","")
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          if(object[1]!=null&&object[1].length>0){
            this.isEmpty=false;
            this.listAll = object[1] as AdvancePaymentMain[];
            this.advancePaymentList = object[1] as AdvancePaymentMain[];
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

  //模糊查询
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.advancePaymentList = this.listAll.filter((item) => {
        return (item.payCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
        this.advancePaymentList=this.listAll;
    }
  }


  //打开详情页
  openPage(item: AdvancePaymentMain) {
    this.navCtrl.push("AdvancePaymentInfoPage",{callback:this.saveSend,"paymentItem":item,approval:true,'approvalState':'2','apply':false});
  }

  //回调
  saveSend = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.sendSuccess=data;
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
}
