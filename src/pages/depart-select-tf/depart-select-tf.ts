import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,AlertController} from 'ionic-angular';
import { Depart} from '../../model/depart';
import {ResultBase} from "../../model/result-base";
import {GlobalData} from "../../providers/GlobalData";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";

/**
 * Generated class for the DepartSelectTfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-depart-select-tf',
  templateUrl: 'depart-select-tf.html',
})
export class DepartSelectTfPage {

  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  departList:Depart[];
  selectDepart:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	private viewCtrl: ViewController,
    private globalData: GlobalData,
    private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    this.getList();
  }

  getList(){
    let departments=this.navParams.get('departments');
      let userInfo=departments[1];
      this.globalData.sessionId=userInfo.sessionId;
      if(departments[2]!=null&&departments[2].length>0){
        this.isEmpty=false;
        this.departList = departments[2] as Depart[];
      }else{
        this.isEmpty=true;
      }
  }


  //确定选择
  confirm(){
  	if(!this.isEmpty&&!this.selectDepart){
  		let alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle: '请先选择单位.',
          buttons: ['确定']
        });
        alert.present();
        return;
  	}

  	this.viewCtrl.dismiss(this.selectDepart);
  	//this.navCtrl.pop();
  }

}
