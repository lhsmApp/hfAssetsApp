import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {ReviewProcessMain} from '../../model/review-process-main';
import {ReviewProcessDetail} from '../../model/review-process-detail';
import {ApprovalService} from '../../services/approvalService';
import {BillNumberCode} from '../../providers/TransferFeildName';
import {ResultBase} from "../../model/result-base";

/**
 * Generated class for the ApprovalProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approval-progress',
  templateUrl: 'approval-progress.html',
})
export class ApprovalProgressPage {
  billNumber:string;
  list: ReviewProcessMain[];
  reviewType:string;
  approvalState:string='2';

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private approvalService:ApprovalService) {
  	this.billNumber = this.navParams.get(BillNumberCode);
    this.reviewType=this.navParams.get('reviewType');
    this.approvalState=this.navParams.get('approvalState');
  }

  ionViewDidLoad() {
    this.getList();
  }

  //上拉刷新
  doRefresh(refresher) {
    this.getList();
    refresher.complete();
  }

  //获取付款单列表信息
  getList(){
    let isHistory:string='0';
    if(this.approvalState=='3'){
      isHistory='1';
    }else{
      isHistory='0';
    }
    this.approvalService.queryApprovalProgress(this.billNumber,this.reviewType,isHistory)
    .subscribe(object => {
      let resultBase:ResultBase=object[0] as ResultBase;
      if(resultBase.result=='true'){
        this.list = object[1] as ReviewProcessMain[];
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
