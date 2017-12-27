import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {ProjectQueryDetail} from '../../model/project-query-detail';
import {ProjectElementService} from '../../services/projectElementService';
import {ResultBase} from "../../model/result-base";
//import {} from "../../enums/storage-type";
import {DictUtil} from '../../providers/dict-util';
import {Storage} from "@ionic/storage";
import {ProjQueryReviewStatus} from '../../enums/enums';
import {OperaType} from '../../enums/enums';
import {BASIC_ENTITY} from "../../enums/storage-type";
import {DicBase} from '../../model/dic-base';
import {DicBasicEntity} from '../../model/dic-basic-entity';

import {BillProjectCode} from '../../providers/TransferFeildName';
import {Oper,Oper_Look} from '../../providers/TransferFeildName';

import {Page_ProjUnitListPage} from '../../providers/TransferFeildName';
//import {Oper,Oper_Look} from '../../providers/TransferFeildName';
//import {BillProjectCode} from '../../providers/TransferFeildName';

/**
 * Generated class for the ProjInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-proj-info',
  templateUrl: 'proj-info.html',
})
export class ProjInfoPage {
	projectCode: string;
  oper: string;

  list: ProjectQueryDetail[];
  itemShow:ProjectQueryDetail;
  dicEntityCode: DicBasicEntity[];//所属资产组 " "    

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              private dictUtil:DictUtil,
              public projectElementService: ProjectElementService) {
    this.itemShow = new ProjectQueryDetail();
  	this.projectCode = this.navParams.get(BillProjectCode);
    this.oper = this.navParams.get(Oper);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjInfoPage');
    this.itemShow = new ProjectQueryDetail();
    this.getShowItem();
  }

  getShowItem(){
    this.itemShow = new ProjectQueryDetail();
    this.projectElementService.getProjectInfo(this.projectCode).subscribe(
      object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.list = object[1] as ProjectQueryDetail[];
            if(this.list && this.list.length > 0){
              this.itemShow = this.list[0];
              this.itemShow.operateTypeName = this.dictUtil.getNumEnumsName(OperaType,this.itemShow.operateType);//操作类型;  (1：正常;2：调整) 1
              this.itemShow.reviewStatusName = this.dictUtil.getNumEnumsName(ProjQueryReviewStatus,this.itemShow.reviewStatus);//单据状态 0
              this.storage.get(BASIC_ENTITY).then((dicList: DicBasicEntity[]) => {
                this.dicEntityCode=dicList;
                this.itemShow.entityCodeName = this.dictUtil.getBasicEntityName(this.dicEntityCode,this.itemShow.entityCode);//项目单元类别"          
              });

  //projectPropertyName: string;//项目性质 "01"
  //checkResultName: string;//复核结果 1
  //sourceOfFundName: string;//资金来源 " "
  //assetsStandardName: string;//资金渠道 "01"

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
        
      });/**/
    /*this.itemShow = item;*/
  }
  
  //项目单元
  toProjUnit(){
    this.navCtrl.push(Page_ProjUnitListPage,  {BillProjectCode: this.projectCode, Oper:Oper_Look});
  }

}
