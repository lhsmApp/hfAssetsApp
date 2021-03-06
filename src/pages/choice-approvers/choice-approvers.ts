import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,AlertController } from 'ionic-angular';
import {ReviewProcessMain} from '../../model/review-process-main';
import {ReviewProcessDetail} from '../../model/review-process-detail';
import {ApprovalService} from '../../services/approvalService';
import {BillNumberCode} from '../../providers/TransferFeildName';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
import {BillContractCode} from '../../providers/TransferFeildName';


/**
 * Generated class for the ChoiceApproversPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 /*const detailList1: ReviewProcessDetail[]=[
     {isCheck:false, userCode:'审批人编码1',username:'审批人2'},
 ]
 const detailList2: ReviewProcessDetail[]=[
     {isCheck:false, userCode:'审批人编码12',username:'审批人12'},
     {isCheck:false, userCode:'审批人编码5',username:'审批人7'},
 ]
 const mainList: ReviewProcessMain[]=[
     {reviewType:'', billNumber:'', number:0, sequence:1,dutyId:'岗位编号1',dutyName:'项目经理',dutySpecial:'', current:9, userId:'', userName:'', result:0, date:'', option:'', vetoType:0, sendDate:'', designPosition:'', departCode:'', reviewPersons:'', reveiwPersonlist:detailList1},
     {reviewType:'', billNumber:'', number:0, sequence:2,dutyId:'岗位编号2',dutyName:'总经理',dutySpecial:'', current:9, userId:'', userName:'', result:0, date:'', option:'', vetoType:0, sendDate:'', designPosition:'', departCode:'', reviewPersons:'', reveiwPersonlist:detailList2},
 ]*/

@IonicPage()
@Component({
  selector: 'page-choice-approvers',
  templateUrl: 'choice-approvers.html',
})
export class ChoiceApproversPage {
  billNumber:string;
  contractCode:string = '';
  list: ReviewProcessMain[];
  reviewType:string;
  callback :any;
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private viewCtrl: ViewController,
              private approvalService:ApprovalService) {
    this.billNumber = this.navParams.get(BillNumberCode);
    this.contractCode = this.navParams.get(BillContractCode);
    this.reviewType=this.navParams.get('reviewType');
    this.callback    = this.navParams.get('callback');
      console.log('reviewType：' + this.reviewType);
    //this.list = mainList;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChoiceApproversPage');
    this.getList();
  }

  //获取付款单列表信息
  getList(){
    this.isEmpty=false;
      //console.log(ReviewType.REVIEW_TYPE_BASIC_PAYMENT);
      console.log('reviewType：' + this.reviewType);
      this.approvalService.queryUserReviewPay(this.billNumber,this.reviewType,this.contractCode)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.list = object[1] as ReviewProcessMain[];
          if(!(this.list!=null&&this.list.length>0)){
            this.isEmpty=true;
          }
        } else {
            this.navCtrl.pop();
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

  ok(){
    if(this.list!=null && this.list.length>0){
      /*let data = new Array<ReviewProcessMain>();
      let itemAdd = new ReviewProcessMain();
      itemAdd.userId = "";
      itemAdd.reveiwPersonlist = [];
      for(let each of this.list){
        if(!(each.userId!=null && each.userId!="")){
          let alert = this.alertCtrl.create({
            title: '提示',
            subTitle: "请勾选审批序号:" + each.sequence + "记录！",
            buttons: ['确定']
          });
          alert.present();
          return;
        }
        itemAdd.reviewType = each.reviewType;
        itemAdd.billNumber = each.billNumber;
        itemAdd.dutySpecial = each.dutySpecial;
        itemAdd.vetoType = each.vetoType;
        itemAdd.sendDate = each.sendDate;
        itemAdd.designPosition = each.designPosition;
        itemAdd.departCode = each.departCode;
        itemAdd.reviewPersons = each.reviewPersons;
        if(itemAdd.userId!=null && itemAdd.userId!=""){
            itemAdd.userId += '@';
        }
        itemAdd.userId += each.userId;
        if(each.reveiwPersonlist){
            for(let det of each.reveiwPersonlist){
              if(det.user_code == each.userId){
                  itemAdd.reveiwPersonlist.push(det);
              }
            }
        }
        //number:number;//审批岗位表流水号 int
        //sequence:number;//审批序号 int 
        //dutyId:string;//岗位编号"                  
        //dutyName:string;//岗位名称"     
        //current:number;//是否当前审批岗位 int    
        //result:number;//审批结果int                   
        //date:string;//审批日期”                     
        //option:string;//审批意见” 
      }

      if(!(itemAdd.userId!=null && itemAdd.userId!="")){
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: "请勾选记录！",
          buttons: ['确定']
        });
        alert.present();
        return;
      }
      data.push(itemAdd);*/
      let data = new Array<ReviewProcessMain>();
      for(let each of this.list){
        if(!(each.userId!=null && each.userId!="")){
          let alert = this.alertCtrl.create({
            title: '提示',
            subTitle: "请勾选审批序号:" + each.sequence + "记录！",
            buttons: ['确定']
          });
          alert.present();
          return;
        }
        let itemAdd = new ReviewProcessMain();
        itemAdd.userId = "";
        itemAdd.reveiwPersonlist = [];
        itemAdd.reviewType = each.reviewType;//审批类型"       
        itemAdd.billNumber = each.billNumber;//单号"    
        itemAdd.number = each.number;//审批岗位表流水号 int
        itemAdd.sequence = each.sequence;//审批序号 int 
        itemAdd.dutyId = each.dutyId;//岗位编号"                  
        itemAdd.dutyName = each.dutyName;//岗位名称"  
        itemAdd.dutySpecial = each.dutySpecial;//特殊处理”    
        itemAdd.current = each.current;//是否当前审批岗位 int   
        itemAdd.userName = each.userName;//审批人名称”               
        itemAdd.result = each.result;//审批结果int                   
        itemAdd.date = each.date;//审批日期”                     
        itemAdd.option = each.option;//审批意见”                 
        itemAdd.vetoType = each.vetoType;//打回类型int   
        itemAdd.sendDate = each.sendDate;//送审时间"
        itemAdd.designPosition = each.designPosition;//打印位置"     
        itemAdd.departCode = each.departCode;//所属单位"  
        itemAdd.reviewPersons = each.reviewPersons;//可审人"  

        itemAdd.userId += each.userId + '@';//审批人编号”
        if(each.reveiwPersonlist){
            for(let det of each.reveiwPersonlist){
              if(det.user_code == each.userId){
                  itemAdd.reveiwPersonlist.push(det);
              }
            }
        }
        data.push(itemAdd);
      }
      //billNumber:string,reviewType:string,data:object[]
      this.approvalService.sendReviewPay(this.billNumber,this.reviewType,JSON.stringify(data))
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
            this.callback(true).then(()=>{ this.navCtrl.pop() });
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
}
