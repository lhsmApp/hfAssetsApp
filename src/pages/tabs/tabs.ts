import { Component ,OnInit ,ViewChild} from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {Helper} from "../../providers/Helper";
import { NativeService} from "../../providers/NativeService";
import {IS_DIC_LOAD} from "../../providers/Constants";
import {DictUtil} from "../../providers/dict-util";
import {LoginInfo} from "../../model/UserInfo";
import {Storage} from '@ionic/storage';
import {Tabs, Events} from "ionic-angular";

import { ApplyPage } from '../apply/apply';
import { QueryPage } from '../query/query';
import { HomePage } from '../home/home';
import { MinePage } from '../mine/mine';
/*import { ChartPage } from '../chart/chart';*/

import {AlertController, ModalController,NavParams} from 'ionic-angular';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {
  @ViewChild('mainTabs') tabs: Tabs;
  /*tab0Root=ChartPage;*/
  tab1Root = HomePage;
  tab2Root = ApplyPage;
  tab3Root = QueryPage;
  tab4Root = MinePage;
  constructor(private navParams: NavParams,
    public events: Events, 
    private globalData: GlobalData, 
    private storage: Storage, 
    private helper: Helper,
    private dictUtil:DictUtil,
    private nativeService: NativeService) {
    this.helper.assertUpgrade().subscribe(res => {//检测app是否升级
        res.update && this.nativeService.downloadApp();
      })
  }

   ngOnInit(): void {
     //this.userInfo = this.params.get('userInfo');
    //this.avatarPath = this.params.get('avatarPath');

    /*let userinfo=this.navParams.get('userinfo');
    console.log(userinfo);
    this.globalData.userCode = userinfo.userCode;
    this.globalData.userName = userinfo.userName;
    this.globalData.sessionId=userinfo.sessionId;
    this.storage.set('userinfo', userinfo);
    */


    /*if (!userinfo.avatarPath) {
      this.helper.loadAvatarPath(userinfo.avatarId).subscribe(avatarPath => {
        userinfo.avatarPath = avatarPath;
        console.log(userinfo);
        this.storage.set('userinfo', userinfo);
      });
    }*/

    
    this.storage.get(IS_DIC_LOAD).then((dicLoad: boolean) => {
      if(!dicLoad){
        console.log('dicLoad');
        this.dictUtil.dictReflesh();
      }
    });

    //this.helper.setTags();
    //this.helper.setAlias(userinfo.userCode);
  }

  /*ionViewWillEnter() {
    this.events.subscribe('user:login', (loginInfo: LoginInfo) => {
      let userInfo = loginInfo.user;
      this.globalData.userId = userInfo.id;
      this.globalData.username = userInfo.username;
      this.globalData.fullName = userInfo.fullName;
      if (!userInfo.avatarPath) {
        this.helper.loadAvatarPath(userInfo.avatarId).subscribe(avatarPath => {
          userInfo.avatarPath = avatarPath;
          this.storage.set('LoginInfo', loginInfo);
        });
      }
      this.helper.setTags();
      this.helper.setAlias(userInfo.id);
      console.log(loginInfo);
    });
  }*/
}
