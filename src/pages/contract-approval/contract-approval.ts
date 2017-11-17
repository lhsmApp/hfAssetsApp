import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { ContractMain} from '../../model/contract-main';
import {ContractService} from '../../services/contractService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

/**
 * Generated class for the ContractApprovalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const  CONTRACT_LIST: ContractMain []= [  
 { contractCode: 'HT2017080001', contractName: '付款缺失合同明细',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044', requireUser: 'zhangsan',checkResult: '1'},
 { contractCode: 'HTD2017080002', contractName: '进度款需要申请',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044' ,requireUser: 'zhangsan',checkResult: '1'},
 { contractCode: 'HTD2017080003', contractName: '进度款需要申请',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044' ,requireUser: 'zhangsan',checkResult: '1'},
 { contractCode: 'HTD2017080004', contractName: '进度款需要申请',sequence:'001',elementCode:'12001',elementName:'私营',compactType:'销售',contractMoney:'2044' ,requireUser: 'zhangsan',checkResult: '1'}
 ];

@IonicPage()
@Component({
  selector: 'page-contract-approval',
  templateUrl: 'contract-approval.html',
})
export class ContractApprovalPage {

  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  contractList:ContractMain[];
  listAll:ContractMain[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,private contractService:ContractService) {
  	//this.contractList=CONTRACT_LIST;
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

    let state="4,10";
    this.contractService.getContractMainList('3', '', '', '', state, '1').subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          if(object[1]!=null&&object[1].length>0){
            this.isEmpty=false;
            this.listAll = object[1] as ContractMain[];
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

 //模糊查询
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contractList = this.listAll.filter((item) => {
        return (item.contractCode.toLowerCase().indexOf(val.toLowerCase()) > -1||item.contractName.indexOf(val)> -1);
      })
    }else{
        this.contractList=this.listAll;
    }
  }

  //打开详情页
  openPage(item: ContractMain) {
  	//this.appCtrl.getRootNav().push(HomeDetailPage, { id: id });
  	this.navCtrl.push("ContractInfoPage",{callback:this.saveSend,'contractMain':item,approval:true,'approvalState':'2'});
  }

  //回调
  saveSend = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
          this.getList();
      }
      resolve();
    });
  };

  //上拉刷新
  doRefresh(refresher) {
  	/*this.params.page = 1;
  	setTimeout(() => {
  		this.topicService.getTopics(this.params).subscribe(
  			data => {
  				this.advancePaymentList = data.data;
  				refresher.complete();
  			}
  			);
  	}, 2000);*/

    this.getList();
  	refresher.complete();
  }
}
