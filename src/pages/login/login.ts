import {Component} from '@angular/core';
import {ModalController,NavController, ViewController, Platform, AlertController, Events,ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {FormBuilder, Validators} from '@angular/forms';

import {LoginService} from '../../services/LoginService';

import {FindPasswordPage} from './find-password/find-password';
import {RegisterPage} from './register/register';
import { TabsPage } from '../../pages/tabs/tabs';

import {UserInfo, LoginInfo} from "../../model/userinfo";
import {ResultBase} from "../../model/result-base";
import {GlobalData} from "../../providers/GlobalData";
import {Utils} from "../../providers/Utils";
import {DEFAULT_LOGIN_BG} from "../../providers/Constants";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  
})
export class LoginPage {
  loginInfo: LoginInfo;
  userInfo: UserInfo;
  submitted: boolean = false;
  canLeave: boolean = false;
  loginForm: any;
  loginBg:string=DEFAULT_LOGIN_BG;

  constructor(public navCtrl:NavController,
              public toastCtrl: ToastController,
              private viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private storage: Storage,
              private globalData: GlobalData,
              private modalCtrl: ModalController,
              private platform: Platform,
              private alertCtrl: AlertController,
              private events: Events,
              private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      /*gdliyh 78005250*/
      /*usercode: ['gdliyh', [Validators.required, Validators.minLength(4)]],// 第一个参数是默认值
      password: ['78005250', [Validators.required, Validators.minLength(4)]],*/
      usercode: ['', [Validators.required]],// 第一个参数是默认值
      password: ['', [Validators.required]],
      departCode:['',[Validators.required]],
      ischeck:[false]
    });
  }

  ionViewWillEnter() {
    this.canLeave = false;
    this.storage.get('loginInfo').then((login: LoginInfo) => {
      console.log(login);
      //this.userInfo = loginInfo && loginInfo.user ? loginInfo.user : null;
      this.loginInfo = login ? login : null;
      if(this.loginInfo){
        if(this.loginInfo.ischeck){
          this.loginForm.patchValue({
            usercode:this.loginInfo.usercode,
            password:this.loginInfo.password,
            //departCode:this.loginInfo.departname,
            ischeck:this.loginInfo.ischeck    
          });
          //this.globalData.departCode=this.loginInfo.departcode;
        }
      }
    });
  }

  ionViewDidLoad(){
    this.events.subscribe('system:timeout', () => {
      this.navCtrl.popToRoot();
    });
  }

  login(user) {
    this.submitted = true;
    this.loginService.login(user)
      .subscribe(loginInfo => {
        let resultBase:ResultBase=loginInfo[0] as ResultBase;
        if(resultBase.result=='true'){
          //console.log(this.loginInfo[2]);

          //this.storage.clear();//清除缓存
          Utils.sessionStorageClear();//清除缓存
          //this.globalData.token = loginInfo.access_token;
          //this.globalData.sessionId = loginInfo.access_token;
          this.submitted = false;
          user.departname=user.departCode;
          user.departcode=this.globalData.departCode;
          this.storage.set('loginInfo', user);
          this.globalData.userId=user.usercode;
          this.globalData.passWord=user.password;
          this.userInfo = loginInfo[1] as UserInfo;
          this.userInfo.departCode=this.globalData.departCode;
          this.userInfo.departName=this.globalData.departName;
          this.navCtrl.push(TabsPage,{"userinfo":this.userInfo});
          //this.events.publish('user:login');
          //this.viewCtrl.dismiss(loginInfo.user);
        }else{
            let alert = this.alertCtrl.create({
            title: '提示信息',
            subTitle: resultBase.message,
            buttons: ['确定']
          });
          alert.present();

          /*let toast = this.toastCtrl.create({
            message: resultBase.message,
            duration: 3000
          });
          toast.present();*/
          this.submitted = false;
        }
        
      }, () => {
        this.submitted = false;
      });
  }

  //选择单位
  selectDepart(){
    console.log("select");
    let modal = this.modalCtrl.create('DepartSelectPage',{'userinfo':this.loginForm.value});
    modal.present();
    modal.onDidDismiss(departInfo => {
      if(departInfo){
        let departCodeAndName:string[]=departInfo.split('|');
        this.loginForm.patchValue({
          departCode:departCodeAndName[1]
        });
        this.globalData.departCode = departCodeAndName[0];
        this.globalData.departName=departCodeAndName[1];
      }
    });
  }


  /*toRegister() {
    this.canLeave = true;
    let modal = this.modalCtrl.create(RegisterPage);
    modal.present();
  }

  findPassword() {
    this.canLeave = true;
    let modal = this.modalCtrl.create(FindPasswordPage);
    modal.present();
  }

  ionViewCanLeave(): boolean {
    let bool = !!this.userInfo;
    if (this.canLeave || bool) {
      return true;
    } else {
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
      return false;
    }
  }*/
}
