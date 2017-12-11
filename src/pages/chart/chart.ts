import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {SystemService} from '../../services/systemService';
import {ResultBase} from "../../model/result-base";
import {CHART1,CHART2,IS_DEPT_CHANGE1} from "../../providers/Constants";

import {NoticeService} from '../../services/noticeService';
import {Notice} from '../../model/notice';
import {Page_NoticeInfoPage,Oper,Oper_Look} from '../../providers/TransferFeildName';
import {NativeService} from '../../providers/NativeService';
import {GlobalData} from "../../providers/GlobalData";

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {

  url1: string;
  url2:string;

  defaultUrl1=CHART1;
  defaultUrl2=CHART2;
  notices: Notice[];

  constructor(public navCtrl: NavController,private alertCtrl:AlertController,
    private systemService:SystemService,private noticeService:NoticeService,
    private nativeService: NativeService,
    private globalData: GlobalData,private storage: Storage) {

  }

  //初始化View
  ionViewDidLoad() {
    /*this.noticeService.getNoticeMainList(2).subscribe(
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
    
      });*/
    this.getList();
  }

  ionViewWillEnter(){
    this.storage.get(IS_DEPT_CHANGE1).then((deptChange: boolean) => {
      if(deptChange){
        console.log('deptChange1');
        this.getList();
        this.storage.set(IS_DEPT_CHANGE1,false);
      }
    });
  }

  getList(){
    if(this.globalData.userType==1){
      this.url1=this.defaultUrl1;
      this.url2=this.defaultUrl2;
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

  viewChart(type:number){
    console.log(this.globalData.userType);

    if(this.globalData.userType==1) return;
    if(type==1){
      this.nativeService.showPhotoViewer(this.url1);
    }else{
      this.nativeService.showPhotoViewer(this.url2);
    }  
  }
    
}
