import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { ContractMain} from '../../model/contract-main';
import {ContractService} from '../../services/contractService';
import {ResultBase} from "../../model/result-base";
import { QueryCondition } from '../../model/query-condition';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
/**
 * Generated class for the ContractQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const  CONTRACT_LIST: ContractMain []= [  
 { contractCode: 'HT2017080001',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044', contractName: '付款缺失合同明细', requireUser: 'zhangsan',checkResult: '1'},
 { contractCode: 'HTD2017080002',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044', contractName: '进度款需要申请' ,requireUser: 'zhangsan',checkResult: '1'},
 { contractCode: 'HTD2017080003',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044', contractName: '进度款需要申请' ,requireUser: 'zhangsan',checkResult: '1'},
 { contractCode: 'HTD2017080004',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044', contractName: '进度款需要申请' ,requireUser: 'zhangsan',checkResult: '1'}
 ];

@IonicPage()
@Component({
  selector: 'page-contract-query',
  templateUrl: 'contract-query.html',
})
export class ContractQueryPage {
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  contractList:ContractMain[];
  queryCondition:QueryCondition;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,private contractService:ContractService) {
  	//this.contractList=CONTRACT_LIST;
    this.queryCondition=this.navParams.get("queryCondition");
  }

  ionViewDidLoad() {
    this.getList();
  }

  //获取列表信息
  getList() {
    //type,//1.申请 2.查询 3.审批
    //contractCode,//合同流水号" (模糊查询)
    //checkResult,//" 单据状态" //合同后端字段解释(括号中代表客户端对应字段)
    //0新增(新增) 
    //1审批通过(已审批)) 
    //2驳回(退回) 
    //3解约 
    //4审批中(待审批) 
    //10待审批(待审批)
    //contract_type,//类型，新增：基建与租赁区分1基建，2租赁(如果是查询界面调用必须输入)
    //type:string, contractCode:string, startDate:string, endDate:string, checkResult:string, contract_type:string

    let state;
    if(this.queryCondition){
      if(this.queryCondition.state=='1'){
        state="0";
      }else if(this.queryCondition.state=='2'){
        state="4,10";
      }else if(this.queryCondition.state=='3'){
        state="1";
      }else if(this.queryCondition.state=='4'){
        state="2";
      }else{
        state="";
      }
    }
    let contractCode=this.queryCondition.queryString;
    let startDate=this.queryCondition.startDate;
    let endDate=this.queryCondition.endDate;
    this.contractService.getContractMainList('2', contractCode, startDate, endDate, state, '1').subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          if(object[1]!=null&&object[1].length>0){
            this.isEmpty=false;
            this.contractList = object[1] as ContractMain[];
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
  openPage(item: ContractMain) {
  	//this.appCtrl.getRootNav().push(HomeDetailPage, { id: id });
  	this.navCtrl.push("ContractInfoPage",{'contractMain':item,'approvalState':this.queryCondition.state});
  }

  //上拉刷新
  doRefresh(refresher) {
  	this.getList();
  	refresher.complete();
  }
}
