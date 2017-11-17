import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,AlertController} from 'ionic-angular';
import { Depart} from '../../model/depart';
import {LoginService} from '../../services/LoginService';
import {ResultBase} from "../../model/result-base";
import {GlobalData} from "../../providers/GlobalData";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
/**
 * Generated class for the DepartSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const  DEPART_LIST: Depart []= [  
 { departCode: '13393000100010001', departName: '广东销售/广东分公司/营销管理处'},
 { departCode: '10223700000300030001', departName: '党群工作处'},
 { departCode: '10223700000300030002', departName: '河源分公司'},
 { departCode: '10223700000300030003', departName: '广东销售/肇庆地区'}
 ];

@IonicPage()
@Component({
  selector: 'page-depart-select',
  templateUrl: 'depart-select.html',
})
export class DepartSelectPage {
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  departList:Depart[];
  selectDepart:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private loginService: LoginService,
    private globalData: GlobalData,
    private alertCtrl:AlertController
    ) {
	  //this.departList=DEPART_LIST;
  }

  ionViewDidLoad() {
    this.getList();
  }

  getList(){
    let userinfo=this.navParams.get('userinfo');
    this.loginService.getDepart(userinfo)
      .subscribe(object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          let userInfo=object[1];
          this.globalData.sessionId=userInfo.sessionId;
          if(object[2]!=null&&object[2].length>0){
            this.isEmpty=false;
            this.departList = object[2] as Depart[];
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

  //上拉刷新
  doRefresh(refresher) {
  	this.getList();
  	refresher.complete();
  }


  //确定选择
  confirm(){
  	console.log(this.selectDepart);
  	this.viewCtrl.dismiss(this.selectDepart);
  	//this.navCtrl.pop();
  }

}
