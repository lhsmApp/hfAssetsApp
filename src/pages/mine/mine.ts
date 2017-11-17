import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {Platform, NavController, ModalController, AlertController,Tabs} from "ionic-angular";
import {MineEditPage} from "./mine-edit/mine-edit";
import {MineEditAvatarModalPage} from "./mine-edit-avatar-modal/mine-edit-avatar-modal";
import {UserInfo} from "../../model/UserInfo";
import {AboutPage} from "./about/about";
import {LoginPage} from "../login/login";
import {Helper} from "../../providers/Helper";
import {DEFAULT_AVATAR} from "../../providers/Constants";
import {WorkMapPage} from "./work-map/work-map";
import {SettingPage} from "./setting/setting";
import {NativeService} from "../../providers/NativeService";

import {SystemService} from '../../services/systemService';
import {ResultBase} from "../../model/result-base";
import {DictUtil} from "../../providers/dict-util";

import {GlobalData} from "../../providers/GlobalData";

@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  userInfo: UserInfo;
  avatarPath: String = DEFAULT_AVATAR;

  constructor(private navCtrl: NavController,
              private platform: Platform,
              private storage: Storage,
              private helper: Helper,
              private modalCtrl: ModalController,
              private nativeService: NativeService,
              private alertCtrl: AlertController,
              private systemService:SystemService,
              private dictUtil:DictUtil,
              private globalData: GlobalData) {

  }

  ionViewWillEnter() {
    this.storage.get('userinfo').then(userinfo => {
      if (userinfo) {
        this.userInfo = userinfo;
        //this.avatarPath = userinfo.avatarPath;
      }
    });
  }

  edit() {
    this.navCtrl.push(MineEditPage, {'userInfo': this.userInfo,'avatarPath':this.avatarPath});
  }

  setting() {
    this.navCtrl.push(SettingPage);
    //之后建议用下面这种方式
    //this.navCtrl.push('TestPage');
  }

  //切换单位
  changeUnit(){
    let userinfo={usercode:this.globalData.userId,password:this.globalData.passWord};
    console.log(userinfo);
    let modal = this.modalCtrl.create('DepartSelectPage',{'userinfo':userinfo});
    modal.present();
    modal.onDidDismiss(departInfo => {
        if(departInfo){
          let departCodeAndName:string[]=departInfo.split('|');
          this.systemService.changeDepart(departCodeAndName[0]).subscribe(object => {
            let resultBase:ResultBase=object[0] as ResultBase;
            if(resultBase.result=='true'){
              this.globalData.departCode = departCodeAndName[0];
              this.globalData.departName=departCodeAndName[1];
              this.userInfo.departCode=departCodeAndName[0];
              this.userInfo.departName=departCodeAndName[1];

            }
          }, () => {
            
          });
      }
    });
  }

  loginOut() {
    this.alertCtrl.create({
      title: '确认重新登录？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            if(this.navCtrl.canGoBack()){
              this.navCtrl.popAll();
            }
            let tabs:Tabs=this.navCtrl.parent;
            let parent:NavController=tabs.parent;
            parent.setRoot(LoginPage);
            
            //this.navCtrl.push(LoginPage);
            /*let modal = this.modalCtrl.create(LoginPage);
            modal.present();
            modal.onDidDismiss(userInfo => {
              if (userInfo) {
                this.userInfo = userInfo;
                this.helper.loadAvatarPath(userInfo.avatarId).subscribe(avatarPath => {//获取头像路径
                  this.avatarPath = avatarPath
                });
              }
            });*/
          }
        }
      ]
    }).present();
  }

  //数据字典刷新
  dictReflesh() {
    this.dictUtil.dictReflesh();
  }


  exitSoftware() {
    this.alertCtrl.create({
      title: '确认退出软件？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    }).present();
  }

  about() {
    this.navCtrl.push(AboutPage);
  }

  viewAvatar() {
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, {avatarPath: this.avatarPath});
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarPath)
    });
  }

  notice(){
    this.nativeService.alert('开发中...');
  }

}
