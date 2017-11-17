import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ItemSliding } from 'ionic-angular';
import { AdvancePaymentMain} from '../../model/advance-payment-main';
import { PaymentService} from '../../services/paymentService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

/**
 * Generated class for the AdvancePaymentApplyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 const  ADVANTAGE_LIST: AdvancePaymentMain []= [  
 { payCode: 'FKD2017080001', payDigest: '付款缺失合同明细', reviewStatus: '1',requireUser: 'jiachao'},
 { payCode: 'FKD2017080004', payDigest: '进度款需要申请' ,reviewStatus: '4',requireUser: 'zhangsan'}
 ];

@IonicPage()
@Component({
  selector: 'page-advance-payment-apply-list',
  templateUrl: 'advance-payment-apply-list.html',
})
export class AdvancePaymentApplyListPage {
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  advancePaymentList:AdvancePaymentMain[];
  listAll:AdvancePaymentMain[];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private paymentService:PaymentService) {
  	//this.advancePaymentList=ADVANTAGE_LIST;
  }
  
  //初始化View
  ionViewDidLoad() {
    this.getList();
  }

  //获取付款单列表信息
  getList(){
      let state="0,2";
      //getPaymentMainList(type:string,reviewStatus:string,payCode:string,startDate:string,endDate:string)
      this.paymentService.getPaymentMainList('1',state,'','','')
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


  //打开详情页
  openPage(item: AdvancePaymentMain) {
  	//this.appCtrl.getRootNav().push(HomeDetailPage, { id: id });
  	this.navCtrl.push("AdvancePaymentInfoPage",{callback:this.saveSend,"paymentItem":item,'apply':true});
  }

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

  //增加
  add(){
  	this.navCtrl.push("AdvancePaymentApplyPage",{callback:this.saveSend});
  }

  //编辑
  edit(item: AdvancePaymentMain, slidingItem: ItemSliding){
    slidingItem.close();
	  this.navCtrl.push("AdvancePaymentApplyPage",{callback:this.saveSend,"paymentItem":item});
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

  //删除
  delete(item:AdvancePaymentMain, slidingItem: ItemSliding){
    slidingItem.close();
    let confirm = this.alertCtrl.create({
      title: '删除提示?',
      message: '确认要删除当前付款单吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('cancel');
          }
        },
        {
          text: '确认',
          handler: () => {
            console.log(item.payCode);
            this.paymentService.deletePaymentMain(item.payCode)
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                //this.listAll.unshift(item);
                //this.advancePaymentList.unshift(item);
                this.listAll = this.listAll.filter(h => h !== item);
                this.advancePaymentList = this.advancePaymentList.filter(h => h !== item);
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
        }
      ]
    });
    confirm.present();
  }

}
