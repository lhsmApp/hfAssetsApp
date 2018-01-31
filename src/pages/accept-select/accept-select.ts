import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import {AcceptApplyMain} from '../../model/accept-apply-main';
import {AcceptService} from '../../services/acceptService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
import {Page_AcceptApplyInfoPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Look} from '../../providers/TransferFeildName';

/**
 * Generated class for the AcceptSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accept-select',
  templateUrl: 'accept-select.html',
})
export class AcceptSelectPage {

  list:AcceptApplyMain[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  contractCode: string;
  clauseType:string;
  callback :any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public acceptService:AcceptService) {
  	this.callback    = this.navParams.get('callback');
    this.contractCode = this.navParams.get('contractCode');
    this.clauseType = this.navParams.get('clauseType');
  }

  ionViewDidLoad() {
    this.getList();
  }

  //获取列表信息
  getList() {
    this.isEmpty=false;
    let state="1";
    //1.申请 2.查询 3.审批
    //0新增（新增）、99待审批（待审批）、1 审批成功（已审批）、2审批失败 （退回）
    //type:string, billNumber:string, startDate:string, endDate:string, reviewStatus:string
    this.acceptService.getAcceptMainList('4', '' , this.contractCode, this.clauseType,'', '', state).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.list = object[1] as AcceptApplyMain[];
          if(!(this.list!=null&&this.list.length>0)){
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

  //上拉刷新
  doRefresh(refresher) {
    this.getList();
    refresher.complete();
  }

  toDetail(billNumber: string) {
    this.navCtrl.push(Page_AcceptApplyInfoPage, {BillNumberCode: billNumber,Oper:Oper_Look,Title:'选择验收单','approvalState':'1'});
  }

  //选择验收单
  selectAccept(selectItem){
      console.log('ccccccccccccccccc');
      this.callback(selectItem).then(()=>{ this.navCtrl.pop() });
  }
}
