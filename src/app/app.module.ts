import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler,Config} from 'ionic-angular';
import {IonicStorageModule} from "@ionic/storage";

//Modules
import {MineModule} from "../pages/mine/mine.module";
import {LoginModule} from "../pages/login/login.module";

//Pages
import { MyApp } from './app.component';
//import { LoginPage } from '../pages/login/login';
//import { RegisterPage } from '../pages/login/register/register';

import { ApplyPage } from '../pages/apply/apply';
import { QueryPage } from '../pages/query/query';
import { HomePage } from '../pages/home/home';
import { ChartPage } from '../pages/chart/chart';
//import { MinePage } from '../pages/mine/mine';
import { TabsPage } from '../pages/tabs/tabs';

//Native Part
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import {AppVersion} from "@ionic-native/app-version";
import {Toast} from "@ionic-native/toast";
import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {FileOpener } from "@ionic-native/file-opener";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ImagePicker} from "@ionic-native/image-picker";
import {Network} from "@ionic-native/network";
import {AppMinimize} from "@ionic-native/app-minimize";
import {JPush} from "../../typings/modules/jpush/index";
import {PhotoLibrary } from "@ionic-native/photo-library";
import {AndroidPermissions  } from "@ionic-native/android-permissions";
import { PhotoViewer } from '@ionic-native/photo-viewer';

//Service Part
import {NativeService} from "../providers/NativeService";
import {HttpService} from "../providers/HttpService";
import {FileService} from "../providers/FileService";
import {Helper} from "../providers/Helper";
import {Utils} from "../providers/Utils";
import {HttpModule} from "@angular/http";
import {GlobalData} from "../providers/GlobalData";
import {ENABLE_FUNDEBUG, IS_DEBUG, FUNDEBUG_API_KEY} from "../providers/Constants";
import {Logger} from "../providers/Logger";
import {ModalFromRightEnter, ModalFromRightLeave, ModalScaleEnter, ModalScaleLeave} from "./modal-transitions";
import {Diagnostic} from "@ionic-native/diagnostic";
import {DictUtil} from "../providers/dict-util";
import {Base64} from "../providers/base64";



//Business Service
import {LoginService} from '../services/LoginService';
import {PaymentService} from '../services/paymentService';
import {AcceptService} from '../services/acceptService';
import {ContractService} from '../services/contractService';
import {ProjectElementService} from '../services/projectElementService';
import {SystemService} from '../services/systemService';
import {ApprovalService} from '../services/approvalService';
import {AttachmentService} from '../services/attachmentService';
import {NoticeService} from '../services/noticeService';

//指令
import { TabDirective } from "../directive/";

/*import * as fundebug from "fundebug-javascript";
fundebug.apikey = '23cca085684576f006bfec289b92bc0cb7830a4e44c052266a23b0fc154f7b13';

// 定义FundebugErrorHandler
class FundebugErrorHandler implements ErrorHandler {
   handleError(err:any) : void {
     fundebug.notifyError(err);
   }
}*/


@NgModule({
  declarations: [
    MyApp,
    //LoginPage,
    //RegisterPage,
    ApplyPage,
    QueryPage,
    HomePage,
    ChartPage,
    //MinePage,
    TabsPage

    //指令
    //TabDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot(),

    //自定义模块
    MineModule,
    LoginModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    //LoginPage,
    //RegisterPage,
    ApplyPage,
    QueryPage,
   ///MinePage,
    HomePage,
    ChartPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Toast,
    File,
    FileTransfer,
    FileOpener,
    InAppBrowser,
    ImagePicker,
    Network,
    AppMinimize,
    Diagnostic,
    AppVersion,
    PhotoLibrary,
    AndroidPermissions,
    PhotoViewer,
    {provide: ErrorHandler, useClass: IonicErrorHandler },
    //Native Part
    JPush,

    //Service Part
    NativeService,
    HttpService,
    FileService,
    Helper,
    Utils,
    GlobalData,
    Logger,
    DictUtil,
    Base64,

    //service
    LoginService,
    PaymentService,
    AcceptService,
    ContractService,
    ProjectElementService,
    SystemService,
    ApprovalService,
    AttachmentService,
    NoticeService
  ]
})
export class AppModule {

  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }
}
