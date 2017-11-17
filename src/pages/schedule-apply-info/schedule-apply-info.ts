import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {ProjectUnitDetail} from '../../model/project-unit-detail'
import {ProjectElementService} from '../../services/projectElementService';
import {ResultBase} from "../../model/result-base";
//import {} from "../../enums/storage-type";
import {DictUtil} from '../../providers/dict-util';
import {Storage} from "@ionic/storage";
import {Sgsx} from '../../enums/enums';
import {PROJECT_ELEMENT} from "../../enums/storage-type";
import {DicBase} from '../../model/dic-base';

import {Oper,Oper_Look,Oper_Edit,Oper_Add,Oper_Approval} from '../../providers/TransferFeildName';
import {Title} from '../../providers/TransferFeildName';
import {BillElementCode} from '../../providers/TransferFeildName';

import {Page_ChoiceApproversPage} from '../../providers/TransferFeildName';

/**
 * Generated class for the ScheduleApplyInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  /*const item: ProjectUnitDetail = { projectCode: '所属项目计划编码',
        projectName: '所属项目计划名称',
        projectProgress: '项目进展概述',
        elementCode: '项目单元编码',
        elementName: '项目单元名称',
        elementFlag: '项目单元类别',
        sgsx: '施工属性',
        planMoney: 47.00,//初始计划金额" ,传double型 
        planMoneyCurrent: 28.00,//当前计划金额",传double型    
        payMoney: 6.00,//已付款金额",传double型               
        completionProgress: '57',//完工百分比
        designFinishTime: '2017-12-14 15:16',//设计完成时间"
        drawingFinishTime: '2017-12-14 15:16',//施工图完成时间"
        planBeginTime: '2017-12-14 15:16',//计划开工时间"
         planEndTime: '2017-12-14 15:16',//计划完工时间"
         realBeginTime: '2017-12-14 15:16',//实际开工时间"
         realEndTime: '2017-12-14 15:16',//实际完工时间"
         realFinishTime: '2017-12-14 15:16',//竣工验收时间"
         certainDate: '2017-12-14 15:16',//预达转资时间"
         auditReportTime: '2017-12-14 15:16',//审计报告日期"
         requireUser: '操作人',//
         requireDate: '2017-12-14 15:16',//操作日期"
         checkOpinion: '复核意见',};*/

@IonicPage()
@Component({
  selector: 'page-schedule-apply-info',
  templateUrl: 'schedule-apply-info.html',
})
export class ScheduleApplyInfoPage {
  isShowCheck:boolean;
  isShowSend:boolean;

  title:string;
  oper:string;
  billElementCode:string;

  list: ProjectUnitDetail[];
  itemShow:ProjectUnitDetail;
  dicelementFlag: DicBase[];//项目单元类别"   
  dicSgsx: Array<{code: string, name: string}>;//施工属性"" 

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              private storage: Storage,
              private dictUtil:DictUtil,
              public projectElementService: ProjectElementService) {
    this.itemShow = new ProjectUnitDetail();
    this.isShowCheck = false;
    this.isShowSend = false;
    this.title = this.navParams.get(Title);
  	this.oper = this.navParams.get(Oper);
    if(this.oper === Oper_Approval){
        this.isShowCheck = true;
    }
    if(this.oper === Oper_Edit || this.oper === Oper_Add){
        this.isShowSend = true;
    }
  	this.billElementCode = this.navParams.get(BillElementCode);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleApplyInfoPage');
    this.itemShow = new ProjectUnitDetail();
    this.dicSgsx = Sgsx;
    this.storage.get(PROJECT_ELEMENT).then((dicList: DicBase[]) => {
      this.dicelementFlag=dicList;
    });
    this.getShowItem();
  }

  getShowItem(){
    this.itemShow = new ProjectUnitDetail();
    this.projectElementService.getProjectElementDetailItem(this.billElementCode).subscribe(
      object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.list = object[1] as ProjectUnitDetail[];
            if(this.list && this.list.length > 0){
              this.itemShow = this.list[0];
              this.itemShow.elementFlagName = this.dictUtil.getProjectElementName(this.dicelementFlag,this.itemShow.elementFlag);//项目单元类别"
              this.itemShow.sgsxName = this.dictUtil.getEnumsName(this.dicSgsx,this.itemShow.sgsx);//施工属性"" 
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

  /*check(){
    let prompt = this.alertCtrl.create({
      title: '审批',
      message: "请输入审批意见",
      inputs: [
        {
          name: 'title',
          placeholder: '请输入审批意见'
        },
      ],
      
    });

    prompt.addButton({
        text: '取消',
        cssClass:'alertButtionCancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      });
    prompt.addButton({
        text: '不通过',
        cssClass:'alertButtionNo',
        handler: data => {
          console.log(data);
        }
      });
    prompt.addButton({
      text: '通过',
      cssClass:'alertButtionYes',
      handler: data => {
      }
    });
    prompt.present();
  }

  send(){
      this.navCtrl.push(Page_ChoiceApproversPage, {BillNumberCode: this.billElementCode});
  }*/

}
