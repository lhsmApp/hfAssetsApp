import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {Notice} from '../../model/notice';
import {NoticeService} from '../../services/noticeService';
import {ResultBase} from "../../model/result-base";
import { QueryCondition } from '../../model/query-condition';
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

import {Page_NoticeInfoPage} from '../../providers/TransferFeildName';
import {Oper,Oper_Look} from '../../providers/TransferFeildName';
import {ItemTranfer} from '../../providers/TransferFeildName';

/**
 * Generated class for the NoticeQueryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/*const listGet: NoticeMain[] = [
      { messageContent:'天津航空物流发展有限公司（以下简称为航发公司）成立于2014年07月，坐落在天津航空物流区,位于天津滨海国际机场西侧,总规划面积7.5平方公里。目前已有中外运、海航物流、中远空运、康捷空、顺丰等众多知名物流企业入驻,其目标是打造成为中国北方最便捷的航空物流综合平台,未来主要负责推进天津航空物流市场资源整合运营。航发公司领导在公司组建初期就高度重视企业的信息化建设，截止目前已正式应用的系统有金蝶ESM系统、建筑信息模型BIM系统、档案管理系统、实物资产管理系统等。但针对投资工程管理与财务核算的集成方面，还处于空白。由此，航发公司希望搭建一套满足ISO体系要求的投资项目资产管理平台，并且该平台可以与金蝶财务系统实现集成，进而实现将工程项目核算前移，以提高项目核算的精度与效率。', publishDate:'2016-01-06', userCode:'用户编码',username:'用户名称', },
      { messageContent:'天津航空物流发展有限公司（以下简称为航发公司）成立于2014年07月，坐落在天津航空物流区,位于天津滨海国际机场西侧,总规划面积7.5平方公里。目前已有中外运、海航物流、中远空运、康捷空、顺丰等众多知名物流企业入驻,其目标是打造成为中国北方最便捷的航空物流综合平台,未来主要负责推进天津航空物流市场资源整合运营。航发公司领导在公司组建初期就高度重视企业的信息化建设，截止目前已正式应用的系统有金蝶ESM系统、建筑信息模型BIM系统、档案管理系统、实物资产管理系统等。但针对投资工程管理与财务核算的集成方面，还处于空白。由此，航发公司希望搭建一套满足ISO体系要求的投资项目资产管理平台，并且该平台可以与金蝶财务系统实现集成，进而实现将工程项目核算前移，以提高项目核算的精度与效率。', publishDate:'2016-01-06', userCode:'用户编码',username:'用户名称', },
    ];*/

@IonicPage()
@Component({
  selector: 'page-notice-query-list',
  templateUrl: 'notice-query-list.html',
})
export class NoticeQueryListPage {
  queryCondition:QueryCondition;
  
    listAll:Notice[];
    list:Notice[];
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              public noticeService:NoticeService) {
    //this.listAll = [];
    //this.list = [];
     this.queryCondition=this.navParams.get("queryCondition");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeQueryListPage');
    //this.listAll = [];
    //this.list = [];
    this.getList();
  }

  //获取列表信息
  getList() {
    this.isEmpty=false;
    //this.listAll = [];
    //this.list = [];
      /*let state;
      if(this.queryCondition){
        if(this.queryCondition.state=='1'){//新增
          state="0";
        }else if(this.queryCondition.state=='2'){//待审批
          state="99";
        }else if(this.queryCondition.state=='3'){//已审批
          state="1";
        }else if(this.queryCondition.state=='4'){//退回
          state="2";
        }else{
          state="";
        }
      }
      let code=this.queryCondition.queryString;
      let startDate=this.queryCondition.startDate;
      let endDate=this.queryCondition.endDate;*/

    this.noticeService.getNoticeMainList(0).subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          this.listAll = object[1] as Notice[];
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
        return (item.messageContent.toString().indexOf(val.toLowerCase()) > -1 
          || item.publishDate.toLowerCase().indexOf(val.toLowerCase()) > -1 
          || item.userCode.toLowerCase().indexOf(val.toLowerCase()) > -1 
          || item.userName.toLowerCase().indexOf(val.toLowerCase()) > -1);
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

    toDetail(item: Notice) {
        this.navCtrl.push(Page_NoticeInfoPage, {ItemTranfer: item, Oper:Oper_Look});
    }

}
