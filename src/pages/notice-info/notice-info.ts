import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Notice} from '../../model/notice';
import {NoticeService} from '../../services/noticeService';
import {ResultBase} from "../../model/result-base";

import {Oper,Oper_Look} from '../../providers/TransferFeildName';
import {ItemTranfer} from '../../providers/TransferFeildName';

/**
 * Generated class for the NoticeInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/*const item: NoticeMain = { 
    messageContent:'天津航空物流发展有限公司（以下简称为航发公司）成立于2014年07月，坐落在天津航空物流区,位于天津滨海国际机场西侧,总规划面积7.5平方公里。目前已有中外运、海航物流、中远空运、康捷空、顺丰等众多知名物流企业入驻,其目标是打造成为中国北方最便捷的航空物流综合平台,未来主要负责推进天津航空物流市场资源整合运营。航发公司领导在公司组建初期就高度重视企业的信息化建设，截止目前已正式应用的系统有金蝶ESM系统、建筑信息模型BIM系统、档案管理系统、实物资产管理系统等。但针对投资工程管理与财务核算的集成方面，还处于空白。由此，航发公司希望搭建一套满足ISO体系要求的投资项目资产管理平台，并且该平台可以与金蝶财务系统实现集成，进而实现将工程项目核算前移，以提高项目核算的精度与效率。', 
    publishDate:'2016-01-06', userCode:'用户编码',username:'用户名称', },;*/

@IonicPage()
@Component({
  selector: 'page-notice-info',
  templateUrl: 'notice-info.html',
})
export class NoticeInfoPage {
  itemTranfer: Notice;
  oper: string;

  list: Notice[];
  itemShow:Notice;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public noticeService:NoticeService) {
    this.itemShow = new Notice();
  	this.itemTranfer = this.navParams.get(ItemTranfer);
    this.oper = this.navParams.get(Oper);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeInfoPage');
    this.itemShow = this.itemTranfer;
    //this.getShowItem();
  }

  getShowItem(){
    this.itemShow = this.itemTranfer;
    /*this.itemShow = new Notice();
    this.noticeService.getNoticeDetailItem().subscribe(
      object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.list = object[1] as Notice[];
            if(this.list && this.list.length > 0){
              this.itemShow = this.list[0];
            }
          }
      }, () => {
        
      });*/
    /*this.itemShow = item;*/
  }

}
