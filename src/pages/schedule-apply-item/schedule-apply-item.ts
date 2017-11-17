import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import {ProjectUnitDetail} from '../../model/project-unit-detail'
import {GlobalData} from "../../providers/GlobalData";
import {Utils} from "../../providers/Utils";
import {ProjectElementService} from '../../services/projectElementService';
import {ResultBase} from "../../model/result-base";
import {DictUtil} from '../../providers/dict-util';
import {Storage} from "@ionic/storage";
import {Sgsx} from '../../enums/enums';
import {PROJECT_ELEMENT} from "../../enums/storage-type";
import {DicBase} from '../../model/dic-base';

import {Oper,Oper_Edit,Oper_Add} from '../../providers/TransferFeildName';
import {BillElementCode} from '../../providers/TransferFeildName';

import {Page_ChoiceApproversPage} from '../../providers/TransferFeildName';

/**
 * Generated class for the ScheduleApplyItemPage page.
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
  selector: 'page-schedule-apply-item',
  templateUrl: 'schedule-apply-item.html',
})
export class ScheduleApplyItemPage {
    oper:string;
	  billElementCode:string;

    applyFrom:any;
    list: ProjectUnitDetail[];
    itemShow:ProjectUnitDetail;
    maxYear:string;
  YearValues:string;
  callback :any;
  isBackRefrash=false;
  dicelementFlag: DicBase[];//项目单元类别"      
  dicSgsx: Array<{code: string, name: string}>;//施工属性"" 
 
  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
  	          public navParams: NavParams,
              public formBuilder: FormBuilder, 
              private globalData: GlobalData,
              public toastCtrl:ToastController,
              private storage: Storage,
              private dictUtil:DictUtil,
              public projectElementService: ProjectElementService) {
    this.itemShow = new ProjectUnitDetail();
    this.maxYear = ((new Date()).getFullYear() + 10).toString();
  	this.oper = this.navParams.get(Oper);
  	this.billElementCode = this.navParams.get(BillElementCode);
    this.callback    = this.navParams.get('callback');
    this.isBackRefrash=false;

    let minyear = (new Date()).getFullYear() - 100;
    let maxyear = (new Date()).getFullYear() + 100;
    for(let i=maxyear;i>=minyear;i--){
      this.YearValues += i + ",";
    }
    //yearValues ="{{YearValues}}"

    this.applyFrom = this.formBuilder.group({
            projectCode: [,[]], 
            projectName: [,[]], 

        projectProgress: [,[]], 
        elementCode: [,[]], 
        elementName: [,[]], 
        elementFlag: [,[]], 
        sgsx: [,[]], 
            planMoney: [,[]], 
            planMoneyCurrent: [,[]], 
            payMoney: [,[]], 
        completionProgress: [,[]], 
        designFinishTime: [,[]], 
        drawingFinishTime: [,[]], 
        planBeginTime: [,[]], 
        planEndTime: [,[]], 
        realBeginTime: [,[]], 
        realEndTime: [,[]], 
        realFinishTime: [,[]], 
        certainDate: [,[]], 
        auditReportTime: [,[]], 
        requireDate: [,[]], 
        requireUser: [,[]], 
        checkOpinion: [,[]], 

        elementFlagName: [,[]], 
        sgsxName: [,[]], 
    });
  }

  FromPatchValue(){
    this.applyFrom.patchValue({
            projectCode: this.itemShow.projectCode, 
            projectName: this.itemShow.projectName, 
        projectProgress: this.itemShow.projectProgress, 
        elementCode: this.itemShow.elementCode, 
        elementName: this.itemShow.elementName, 
        elementFlag: this.itemShow.elementFlag, 
        sgsx: this.itemShow.sgsx, 
            planMoney: this.itemShow.planMoney, 
            planMoneyCurrent: this.itemShow.planMoneyCurrent, 
            payMoney: this.itemShow.payMoney, 
        completionProgress: this.itemShow.completionProgress, 
        designFinishTime: this.itemShow.designFinishTime, 
        drawingFinishTime: this.itemShow.drawingFinishTime, 
        planBeginTime: this.itemShow.planBeginTime, 
        planEndTime: this.itemShow.planEndTime, 
        realBeginTime: this.itemShow.realBeginTime, 
        realEndTime: this.itemShow.realEndTime, 
        realFinishTime: this.itemShow.realFinishTime, 
        certainDate: this.itemShow.certainDate, 
        auditReportTime: this.itemShow.auditReportTime, 
        requireDate: this.itemShow.requireDate, 
        requireUser: this.itemShow.requireUser, 
        checkOpinion: this.itemShow.checkOpinion,
        
        elementFlagName: this.itemShow.elementFlagName, 
        sgsxName:  this.itemShow.sgsxName, 
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleApplyItemPage');
    this.isBackRefrash=false;
    this.itemShow = new ProjectUnitDetail();
    this.dicSgsx = Sgsx;
    this.storage.get(PROJECT_ELEMENT).then((dicList: DicBase[]) => {
      this.dicelementFlag=dicList;
    });
    this.getShowItem();
  }

  getShowItem(){
    this.itemShow = new ProjectUnitDetail();
    if(this.oper === Oper_Edit){
      this.projectElementService.getProjectElementDetailItem(this.billElementCode).subscribe(
        object => {
          let resultBase:ResultBase=object[0] as ResultBase;
          if(resultBase.result=='true'){
            this.list = object[1] as ProjectUnitDetail[];
            if(this.list && this.list.length > 0){
              this.itemShow = this.list[0];
              this.itemShow.elementFlagName = this.dictUtil.getProjectElementName(this.dicelementFlag,this.itemShow.elementFlag);//项目单元类别"
              this.itemShow.sgsxName = this.dictUtil.getEnumsName(this.dicSgsx,this.itemShow.sgsx);//施工属性"" 
              this.FromPatchValue();
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
        /*this.itemShow = item;
        this.FromPatchValue();*/
    } else if(this.oper === Oper_Add){
        this.itemShow.requireDate = Utils.dateFormat(new Date());
        this.itemShow.requireUser = this.globalData.userName;
        this.FromPatchValue();
    } else {
        this.FromPatchValue();
    }
  }

  //保存
  save(){
    let transferInfo=new Array<ProjectUnitDetail>();
    let detail=this.applyFrom.value as ProjectUnitDetail;
    
    transferInfo.push(detail);

    this.projectElementService.saveProjectElement(JSON.stringify(transferInfo))
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
              this.isBackRefrash=true;
          this.oper = Oper_Edit;
          console.log(object[1][0]);
          this.itemShow = object[1][0] as ProjectUnitDetail;
          this.billElementCode = this.itemShow.elementCode;
          this.FromPatchValue();
              let toast = this.toastCtrl.create({
                message: '保存成功',
                duration: 3000
              });
              toast.present();
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

  goBack(){
    console.log('back');
    if(this.isBackRefrash){
      this.callback(this.isBackRefrash).then(()=>{ this.navCtrl.pop() });
    }else{
      this.navCtrl.pop();
    }
  }

//送审
  /*send(){
      this.navCtrl.push(Page_ChoiceApproversPage, {BillNumberCode: this.billElementCode});
  }*/

}
