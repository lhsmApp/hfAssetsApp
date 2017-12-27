import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import { QueryCondition } from '../../model/query-condition';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
/**
 * Generated class for the AdvancePaymentQueryPage page.
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
 	selector: 'page-advance-payment-query',
 	templateUrl: 'advance-payment-query.html',
 })
 export class AdvancePaymentQueryPage {
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
 	advancePaymentList:AdvancePaymentMain[];
  queryCondition:QueryCondition;

 	constructor(public navCtrl: NavController, 
     public navParams: NavParams,
     public alertCtrl:AlertController,
     private paymentService:PaymentService) {
 		//this.advancePaymentList=ADVANTAGE_LIST;
     this.queryCondition=this.navParams.get("queryCondition");
 	}

 	//页面初始化
 	ionViewDidLoad() {
 		this.getList();
 	}

 	//获取付款单列表信息
  getList(){
      let state;
      if(this.queryCondition){
        if(this.queryCondition.state=='1'){
          state="0";
        }else if(this.queryCondition.state=='2'){
          state="1,3";
        }else if(this.queryCondition.state=='3'){
          state="4";
        }else if(this.queryCondition.state=='4'){
          state="2";
        }else{
          state="";
        }
      }
      let payCode=this.queryCondition.queryString;
      let startDate=this.queryCondition.startDate;
      let endDate=this.queryCondition.endDate;
      //getPaymentMainList(type:string,reviewStatus:string,payCode:string,startDate:string,endDate:string)
      this.paymentService.getPaymentMainList('2',state,payCode,startDate,endDate)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          if(object[1]!=null&&object[1].length>0){
            this.isEmpty=false;
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


  //打开详情页
  openPage(item: AdvancePaymentMain) {
  	//this.appCtrl.getRootNav().push(HomeDetailPage, { id: id });
  	this.navCtrl.push("AdvancePaymentInfoPage",{"paymentItem":item,'approvalState':this.queryCondition.state,'apply':false,query:true});
  }

  //上拉刷新
  doRefresh(refresher) {
  	this.getList();
  	refresher.complete();
  }

}
