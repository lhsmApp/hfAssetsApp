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
import { Permission} from '../../model/permission';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Broadcaster } from "@ionic-native/broadcaster";
import { NativeService} from "../../providers/NativeService";
import { AppAvailability } from '@ionic-native/app-availability';
import {APP_PORT_BROWER,APP_PORT_NATIVE} from "../../providers/Constants";

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
  state:string;
  hasTfLogin:boolean=false;

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
              private loginService: LoginService,
              private iab: InAppBrowser,
              private nativeService: NativeService,
              private appAvailability:AppAvailability,
              private broadcaster:Broadcaster) {
    this.loginForm = this.formBuilder.group({
      /*gdliyh 78005250*/
      /*usercode: ['gdliyh', [Validators.required, Validators.minLength(4)]],// 第一个参数是默认值
      password: ['78005250', [Validators.required, Validators.minLength(4)]],*/
      usercode: ['', [Validators.required]],// 第一个参数是默认值
      password: ['', [Validators.required]],
      departCode:['',[Validators.required]],
      /*state:['1'],*/
      ischeck:[false]
    });

    /***************************************/
    if(this.nativeService.isMobile()){
          this.storage.get('SERVER').then((server: string) => {
          if(server){
            let serverIpAndPort:string[]=server.split(',');
            let serverIP=serverIpAndPort[0];
            let serverPort=APP_PORT_NATIVE;
            if(serverIpAndPort.length>1)
               serverPort=serverIpAndPort[1];
            this.globalData.serverPort=serverPort;
          }else{
            this.globalData.serverPort=APP_PORT_NATIVE;
          }

          this.broadcaster.addEventListener('com.lhsm.hfApp.getToken').subscribe((event) => {
            //this.nativeService.showToast('资产获取的天房的TOKEN值为:'+event['usertoken']);
            if(!this.hasTfLogin){
              if(event['usertoken']){
                this.loginService.loginTf(JSON.stringify(event['usertoken'])).subscribe(loginInfo => {
                  
                  let resultBase:ResultBase=loginInfo[0] as ResultBase;
                  if(resultBase.result=='true'){
                    //选单位  
                    this.selectDepartTf(loginInfo);
                    
                  }else{
                      let alert = this.alertCtrl.create({
                      title: '提示信息',
                      subTitle: resultBase.message,
                      buttons: ['确定']
                    });
                    alert.present();
                  }
                  
                }, () => {
                });
              }
            }
            this.hasTfLogin=true;
          });  

          //启动成功后通知原生App
          this.broadcaster.fireNativeEvent('jumpNative',{"item":"ionic的值"}).then(()=>console.log('success'));

        });
      }
      else{
        this.globalData.serverPort=APP_PORT_BROWER;
      }
      /***************************************/
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
      this.loginForm.patchValue({
        departCode:''
      });
    });
  }

  //选择单位
  selectDepartTf(loginInfo){
    let modal = this.modalCtrl.create('DepartSelectTfPage',{'departments':loginInfo});
    modal.present();
    modal.onDidDismiss(departInfo => {
      if(departInfo){

        let departCodeAndName:string[]=departInfo.split('|');
        this.globalData.departCode = departCodeAndName[0];
        this.globalData.departName=departCodeAndName[1];
        //this.navCtrl.push(TabsPage,{"userinfo":this.userInfo});
        //this.rootPage=TabsPage;

        this.userInfo = loginInfo[1] as UserInfo;
        let user={'usercode':this.userInfo.userCode}
        this.loginTf(user)
      }
    });
  }

  loginTf(user) {
    this.loginService.login(user).subscribe(loginInfo => {
        let resultBase:ResultBase=loginInfo[0] as ResultBase;
        if(resultBase.result=='true'){
          this.userInfo = loginInfo[1] as UserInfo;
          this.userInfo.departCode=this.globalData.departCode;
          this.userInfo.departName=this.globalData.departName;
          this.globalData.userId=this.userInfo.userCode;
          this.globalData.passWord=this.userInfo.passWord;
          this.globalData.userType=this.userInfo.userType;

          this.globalData.userCode = this.userInfo.userCode;
          this.globalData.userName = this.userInfo.userName;
          this.globalData.permission=loginInfo[1].userFuntionList as Permission[];
          this.storage.set('userinfo', this.userInfo);
          this.navCtrl.push(TabsPage,{"userinfo":this.userInfo});
        }else{
            let alert = this.alertCtrl.create({
            title: '提示信息',
            subTitle: resultBase.message,
            buttons: ['确定']
          });
          alert.present();
        }
        
      }, () => {
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

          this.globalData.userCode = this.userInfo.userCode;
          this.globalData.userName = this.userInfo.userName;
          this.globalData.userType=this.userInfo.userType;
          this.storage.set('userinfo', this.userInfo);

          this.navCtrl.push(TabsPage,{"userinfo":this.userInfo});

          this.globalData.permission=loginInfo[1].userFuntionList as Permission[];
          
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
    let modal = this.modalCtrl.create('DepartSelectPage',{'userinfo':this.loginForm.value});
    modal.present();
    modal.onDidDismiss(departInfo => {
      if(departInfo){
        let departCodeAndName:string[]=departInfo.split('|');
        console.log(this.loginForm.controls.departCode);
        this.loginForm.patchValue({
          departCode:departCodeAndName[1]
        });
        this.loginForm.patchValue({
          departCode:departCodeAndName[1]
        });
        this.globalData.departCode = departCodeAndName[0];
        this.globalData.departName=departCodeAndName[1];
      }
    });
  }

  //更换IP
  serverIP(){
    console.log('ccccc');
    let modal = this.modalCtrl.create('ServerSetPage');
    modal.present();
  }

  tfLogin(){
    /*let modal = this.modalCtrl.create('TfLoginPage');
    modal.present();
    console.log("ok"+frames.document.cookie);*/

    
    var app = '';
    if (this.platform.is('ios')) {
        app = 'weixin://';      /* 微信的Scheme URL */
    } else if (this.platform.is('android')) {
        app = 'com.tencent.mm';     /* 微信的安卓包名 */
    }

    this.appAvailability.check(app)     /* 检测微信是否已安卓 */
    .then(
        (yes: boolean) => {
            this.iab.create('weixin://', '_system');    /* 打开微信 */
        },
        (no: boolean) => {
            /* 未安装，请编写提示代码或跳转下载 */
            this.nativeService.showToast('您还未安装天房手机移动助手,请安装后再试一次.');
        }
    );
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
