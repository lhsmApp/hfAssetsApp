import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {AcceptApplyMain} from '../../model/accept-apply-main';
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {Page_AcceptApplyInfoPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Approval} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';
import {BillNumberCode} from '../../providers/TransferFeildName';


/**
 * Generated class for the AcceptApprovalListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  /*const listGet:AcceptApplyMain[] = [
        { billNumber: 'XMDY0001', reviewStatus: '99', requireDate: '2017-09-25', requireUser: '申请人'},
        { billNumber: 'XMDY0002', reviewStatus: '99', requireDate: '2017-09-25', requireUser: '申请人'},
        { billNumber: 'XMDY0003', reviewStatus: '99', requireDate: '2017-09-25', requireUser: '申请人'},
        { billNumber: 'XMDY0004', reviewStatus: '99', requireDate: '2017-09-25', requireUser: '申请人'},
    ];*/

@IonicPage()
@Component({
  selector: 'page-accept-approval-list',
  templateUrl: 'accept-approval-list.html',
})
export class AcceptApprovalListPage {
    listAll:AcceptApplyMain[];
    list:AcceptApplyMain[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public acceptService:AcceptService) {
    //this.listAll = [];
    //this.list = [];
  }

  ionViewDidLoad() {
    //this.listAll = [];
    //this.list = [];
    this.getList();
  }

  //获取列表信息
  getList() {
    this.isEmpty=false;
    //this.listAll = [];
    //this.list = [];
    //1.申请 2.查询 3.审批
    //0新增（新增）、99待审批（待审批）、1 审批成功（已审批）、2审批失败 （退回）
    //type:string, billNumber:string, startDate:string, endDate:string, reviewStatus:string
    let reviewStatus = "99";
    this.acceptService.getAcceptMainList('3', '', '', '', '').subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as AcceptApplyMain[];
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
    //this.listAll = listGet;
    //this.list = listGet;
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
        return (item.billNumber.toLowerCase().indexOf(val.toLowerCase()) > -1);
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

  //下拉加载
  doInfinite(infiniteScroll) {
    /*this.params.page++;
    setTimeout(() => {
      this.topicService.getTopics(this.params).subscribe(
        data => {
          if (data) {
            this.topics.push(...data.data);
            infiniteScroll.complete();
          }
          else {
            infiniteScroll.enable(false);
          }
        }
        );
    }, 500);*/
  }

    toDetail(billNumber: string) {
        this.navCtrl.push(Page_AcceptApplyInfoPage, {callback:this.checkRefresh,BillNumberCode: billNumber,Oper:Oper_Approval,Title:'验收审批','approvalState':'2'});
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

}
