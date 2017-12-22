import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Notice} from '../../model/notice';
import {DEFAULT_YS,DEFAULT_YFK,DEFAULT_HT,DEFAULT_ZZ,DEFAULT_ZZTZ,IS_DEPT_CHANGE} from "../../providers/Constants";
import {NoticeService} from '../../services/noticeService';

import {Page_NoticeInfoPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Look} from '../../providers/TransferFeildName';
import {ItemTranfer} from '../../providers/TransferFeildName';
import {SystemService} from '../../services/systemService';
import {ResultBase} from "../../model/result-base";
import {Schedule} from "../../model/schedule";
import {GlobalData} from "../../providers/GlobalData";
import {NativeService} from '../../providers/NativeService';


/*const NOTICES: Notice[] = [
      { messageContent:'天津航空物流发展有限公司（以下简称为航发公司）成立于2014年07月，坐落在天津航空物流区,位于天津滨海国际机场西侧,总规划面积7.5平方公里。目前已有中外运、海航物流、中远空运、康捷空、顺丰等众多知名物流企业入驻,其目标是打造成为中国北方最便捷的航空物流综合平台,未来主要负责推进天津航空物流市场资源整合运营。航发公司领导在公司组建初期就高度重视企业的信息化建设，截止目前已正式应用的系统有金蝶ESM系统、建筑信息模型BIM系统、档案管理系统、实物资产管理系统等。但针对投资工程管理与财务核算的集成方面，还处于空白。由此，航发公司希望搭建一套满足ISO体系要求的投资项目资产管理平台，并且该平台可以与金蝶财务系统实现集成，进而实现将工程项目核算前移，以提高项目核算的精度与效率。', publishDate:'2016-01-06', userCode:'用户编码',username:'用户名称'},
      { messageContent:'天津航空物流发展有限公司（以下简称为航发公司）成立于2014年07月，坐落在天津航空物流区,位于天津滨海国际机场西侧,总规划面积7.5平方公里。目前已有中外运、海航物流、中远空运、康捷空、顺丰等众多知名物流企业入驻,其目标是打造成为中国北方最便捷的航空物流综合平台,未来主要负责推进天津航空物流市场资源整合运营。航发公司领导在公司组建初期就高度重视企业的信息化建设，截止目前已正式应用的系统有金蝶ESM系统、建筑信息模型BIM系统、档案管理系统、实物资产管理系统等。但针对投资工程管理与财务核算的集成方面，还处于空白。由此，航发公司希望搭建一套满足ISO体系要求的投资项目资产管理平台，并且该平台可以与金蝶财务系统实现集成，进而实现将工程项目核算前移，以提高项目核算的精度与效率。', publishDate:'2016-01-06', userCode:'用户编码',username:'用户名称'}
    ];*/

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  url1: string;
  url2:string;

  htPath: String = DEFAULT_HT;
  ysPath: String = DEFAULT_YS;
  yfkPath: String = DEFAULT_YFK;
  zzPath: String = DEFAULT_ZZ;
  zztzPath: String = DEFAULT_ZZTZ;

  /*htSchedule:Schedule;
  ysSchedule:Schedule;
  yfkSchedule:Schedule;
  zzSchedule:Schedule;
  zztzSchedule:Schedule;*/

  htBillCount:number=0;
  ysBillCount:number=0;
  yfkBillCount:number=0;
  zzBillCount:number=0;
  zztzBillCount:number=0;

  scheduleList:Schedule[];

  notices: Notice[];
  //messageCount: string;
  constructor(public navCtrl: NavController,private alertCtrl:AlertController,private systemService:SystemService,
              private noticeService:NoticeService,private storage: Storage,private globalData: GlobalData
              ,private nativeService: NativeService) {
    //this.messageCount="2";
  }

  //初始化View
  ionViewDidLoad() {
    this.noticeService.getNoticeMainList(2).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.notices = object[1] as Notice[];
        } else {
            let alert = this.alertCtrl.create({
              title: '提示!',
              subTitle: resultBase.message,
              buttons: ['确定']
            });
            alert.present();
        }
      }, () => {
    
      });
      this.getList();
      this.getListChart();
  }

  ionViewWillEnter(){
    this.storage.get(IS_DEPT_CHANGE).then((deptChange: boolean) => {
      if(deptChange){
        console.log('deptChange');
        this.getList();
        this.getListChart();
        this.storage.set(IS_DEPT_CHANGE,false);
      }
    });

    /*this.storage.get(IS_DEPT_CHANGE1).then((deptChange: boolean) => {
      if(deptChange){
        console.log('deptChange1');
        this.getList();
        this.storage.set(IS_DEPT_CHANGE1,false);
      }
    });*/
  }

  //获取代办事项列表信息
  getList(){
      this.systemService.getReviewTypeInfo().subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.scheduleList = object[1] as Schedule[];
          for(let item of this.scheduleList){
            if(item.businessType=='HTSP'){
              this.htBillCount=item.billCount;
            }else if(item.businessType=='ZCYS'){
              this.ysBillCount=item.billCount;
            }else if(item.businessType=='FKSP'){
              this.yfkBillCount=item.billCount;
            }else if(item.businessType=='ZZSP'){
              this.zzBillCount=item.billCount;
            }else if(item.businessType=='ZZTZSP'){
              this.zztzBillCount=item.billCount;
            }
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

  getListChart(){
    if(this.globalData.userType==1){
      this.url1='';
      this.url2='';
      return;
    }

    this.systemService.createJFreeChartBar().subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          let urls = object[1];
          this.url1=this.globalData.serverFileUrl+urls[0].url+"?r="+Math.random();
          this.url2=this.globalData.serverFileUrl+urls[0].url2+"?r="+Math.random();
          console.log(this.url1);
          console.log(this.url2);
        } else {
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

  toNoticeList(){
      this.navCtrl.push("NoticeQueryListPage");
  }

  itemSelected(notice:Notice){
      this.navCtrl.push(Page_NoticeInfoPage, {ItemTranfer: notice, Oper:Oper_Look});
  }

  openPage(cate: string) {
    if (cate === 'HTSP') {
      this.navCtrl.push("ContractApprovalPage",{callback:this.afterApproval});
    }else if (cate === 'FKSP') {
      this.navCtrl.push("AdvancePaymentApprovalPage",{callback:this.afterApproval});
    }else if(cate === 'ZCYS'){
      this.navCtrl.push("AcceptApprovalListPage",{callback:this.afterApproval});
    }else if(cate === 'ZZSP'){
      this.navCtrl.push("TransferFundsApprovalListPage",{callback:this.afterApproval});
    }else if(cate === 'ZZTZSP'){
      this.navCtrl.push("TransferAdjustApprovalListPage",{callback:this.afterApproval});
    }
  }

  //回调
  afterApproval = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      if(data){
          this.getList();
          
      }
      resolve();
    });
  };

  viewChart(type:number){
    console.log(this.globalData.userType);

    if(this.globalData.userType==1) return;
    if(type==1){
      this.nativeService.showPhotoViewer(this.url1);
    }else{
      this.nativeService.showPhotoViewer(this.url2);
    }  
  }

  //上拉刷新
  doRefresh(refresher) {
    this.getList();
    refresher.complete();
  }
}
