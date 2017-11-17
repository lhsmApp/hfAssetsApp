import { Component ,ViewChild} from '@angular/core';
import { Platform,Keyboard,IonicApp,Nav,ToastController,Tabs  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeService} from "../providers/NativeService";
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import {Helper} from "../providers/Helper";
import {GlobalData} from "../providers/GlobalData";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;
  rootPage:any = LoginPage;
  backButtonPressed: boolean = false;

  constructor(private platform: Platform,
    private keyboard: Keyboard,
    private ionicApp: IonicApp,
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private nativeService: NativeService,
    private helper: Helper,
    private toastCtrl: ToastController,
    private globalData: GlobalData) {
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
    });
  }

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
          //return activeNav.canGoBack() ? activeNav.pop() : this.nativeService.minimize();//this.showExit()
          if(activeNav.canGoBack()) {
            activeNav.pop();
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
