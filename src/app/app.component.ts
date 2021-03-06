import { Component ,ViewChild} from '@angular/core';
import { Platform,NavController,Keyboard,IonicApp,Nav,ToastController,Tabs ,Tab,ViewController,AlertController,ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeService} from "../providers/NativeService";
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import {Helper} from "../providers/Helper";
import {GlobalData} from "../providers/GlobalData";
import {Storage} from '@ionic/storage';
import {APP_PORT_BROWER,APP_PORT_NATIVE} from "../providers/Constants";
import {Broadcaster} from "@ionic-native/broadcaster"
import {LoginService} from '../services/LoginService';
import {ResultBase} from "../model/result-base";
import {UserInfo, LoginInfo} from "../model/userinfo";
import { Permission} from '../model/permission';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;
  rootPage:any = LoginPage;
  backButtonPressed: boolean = false;
  userInfo: UserInfo;
  hasTfLogin:boolean=false;

  constructor(private platform: Platform,
    private keyboard: Keyboard,
    private ionicApp: IonicApp,
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private nativeService: NativeService,
    private helper: Helper,
    private toastCtrl: ToastController,
    private storage: Storage,
    private globalData: GlobalData,
    private broadcaster:Broadcaster,
    private alertCtrl:AlertController,
    //private navCtrl:NavController,
    private modalCtrl: ModalController,
    private loginService: LoginService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.registerBackButtonAction();//注册返回按键事件
      this.assertNetwork();//检测网络
      /*this.helper.assertUpgrade().subscribe(res => {//检测app是否升级
        res.update && this.nativeService.downloadApp();
      })*/
      this.nativeService.getVersionNumber().subscribe(currentNo => {//获得当前app版本
        this.globalData.appNo=currentNo;
      });

      /*if(this.nativeService.isMobile()){
          this.storage.get('SERVERPORT').then((serverPort: string) => {
          if(serverPort){
            this.globalData.serverPort=serverPort;
          }else{
            this.globalData.serverPort=APP_PORT_NATIVE;
          }
        });
        this.globalData.serverPort=APP_PORT_NATIVE;
      }
      else{
        this.globalData.serverPort=APP_PORT_BROWER;
      }

      this.storage.get('SERVERIP').then((serverIP: string) => {
        if(serverIP){
          this.globalData.serverIP=serverIP;
        }
      });*/


      /***************************************/
      //唤醒
      /***************************************/
    });
  }

  /*//选择单位
  selectDepart(loginInfo){
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
        this.login(user)
      }
    });
  }

  login(user) {
    this.loginService.login(user).subscribe(loginInfo => {
        let resultBase:ResultBase=loginInfo[0] as ResultBase;
        if(resultBase.result=='true'){
          this.rootPage=TabsPage;
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
  }*/

  assertNetwork() {
    if (!this.nativeService.isConnecting()) {
      this.toastCtrl.create({
        message: '未检测到网络,请连接网络',
        showCloseButton: true,
        closeButtonText: '确定'
      }).present();
    }
  }

  registerBackButtonAction() {
    if (!this.nativeService.isAndroid()) {
      return;
    }
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
        this.keyboard.close();
        return;
      }
      //let nav = this.getNav();
      /*if (this.nav.canGoBack()) {
        this.nav.pop();
        return;
      }*/
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive()
      
      let activeOverlayPortal = this.ionicApp._overlayPortal.getActive();
      if (activeOverlayPortal) {
        activeOverlayPortal.dismiss();
        return;
      }

      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
      
      let activeVC = this.nav.getActive();
      if(this.nav.getViews().length>1){
        let tabs=activeVC.instance.tabs;
        if(tabs){
          let activeNav = tabs.getSelected();
          let tb=activeNav as Tab;
          
          //return activeNav.canGoBack() ? activeNav.pop() : this.nativeService.minimize();//this.showExit()
          if(activeNav.canGoBack()) {
            let vc=tb.getActive() as ViewController;
            if(vc.instance.sendSuccess){
              if(vc.instance.refBack instanceof Function){
                vc.instance.refBack();
              }else{
                activeNav.pop();
              }
            }else{
              activeNav.pop();
            }
            return;
          }
        }
      }
      this.showExit();
    }, 1);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.nativeService.showToast('再按一次退出应用');
      this.backButtonPressed = true;
      setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
        this.backButtonPressed = false;
      }, 2000)
    }
  }
}
