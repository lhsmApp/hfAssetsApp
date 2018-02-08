import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController,Navbar } from 'ionic-angular';
import {ApprovalService} from '../../services/approvalService';
import {ResultBase} from "../../model/result-base";

import {BillNumberCode} from '../../providers/TransferFeildName';
import {BillReviewType} from '../../providers/TransferFeildName';

/**
 * Generated class for the ApprovalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approval',
  templateUrl: 'approval.html',
})
export class ApprovalPage {
  @ViewChild('myNavbar') navBar: Navbar;

  message:string;
  isBackRefrash:boolean;

  billNumber:string;
  ReviewType:string;
  callback :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl:ToastController,
              public approvalService:ApprovalService) {
    this.message = "";
    this.isBackRefrash = false;
    this.billNumber = this.navParams.get(BillNumberCode);
    this.ReviewType = this.navParams.get("BillReviewType");
    this.callback = this.navParams.get('callback');
        console.log(this.ReviewType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApprovalPage');
    this.navBar.backButtonClick=()=>{
      if(this.isBackRefrash){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
    }
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    this.callback(true).then(()=>{ this.navCtrl.pop() });
  }

  cancel(){
      if(this.isBackRefrash){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
  }

  checkTrue(){
  	if(this.isBackRefrash){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "已审批！",
        buttons: ['确定']
      });
      alert.present();
      return;
  	}
        //billNumber:string,reviewType:string,vetoReason:string
        console.log(this.billNumber);
        console.log(this.ReviewType);
        console.log(this.message);
        this.approvalService.auditReview(this.billNumber, this.ReviewType, this.message)
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.isBackRefrash=true;
              console.log('通过');
              let toast = this.toastCtrl.create({
                message: resultBase.message,
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

  checkFalse(){
  	if(this.isBackRefrash){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "已审批！",
        buttons: ['确定']
      });
      alert.present();
      return;
  	}
        //billNumber:string,reviewType:string,vetoReason:string
        console.log(this.billNumber);
        console.log(this.ReviewType);
        console.log(this.message);
        this.approvalService.vetoReview(this.billNumber, this.ReviewType, this.message)
          .subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.isBackRefrash=true;
              console.log('不通过');
              console.log(this.isBackRefrash);
              let toast = this.toastCtrl.create({
                message: resultBase.message,
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
