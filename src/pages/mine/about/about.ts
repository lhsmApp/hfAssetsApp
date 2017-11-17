import {Component} from "@angular/core";
import {NavController, AlertController} from "ionic-angular";
import {NativeService} from "../../../providers/NativeService";
import {UpdateLogPage} from "../update-log/update-log";
import {FeedBackPage} from "../feed-back/feed-back";
import {Helper} from "../../../providers/Helper";
import {GlobalData} from "../../../providers/GlobalData";
import {DEFAULT_LOGO} from "../../../providers/Constants";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  versionNo: string = '0.0.1';
  logo:string=DEFAULT_LOGO;

  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
              private helper: Helper,
              private globalData: GlobalData,
              private nativeService: NativeService) {
    if (this.nativeService.isMobile()) {
      this.nativeService.getVersionNumber().subscribe(value => {
        this.versionNo = value;
      });
    }
  }

  checkNewVersion() {
    if (this.globalData.updateProgress == -1 || this.globalData.updateProgress == 100) {
      this.helper.assertUpgrade().subscribe(res => {
        if (res.update) {
          this.nativeService.downloadApp();
        } else {
          res.msg && this.nativeService.alert(res.msg);
        }
      })
    } else {//正在更新
      let alert = this.alertCtrl.create({
        title: `下载进度：${this.globalData.updateProgress}%`,
        buttons: [{text: '确定'}
        ]
      });
      alert.present();
      let interval = setInterval(() => {
        alert.setTitle(`下载进度：${this.globalData.updateProgress}%`);
        if (this.globalData.updateProgress == 100) {
          clearInterval(interval);
          alert && alert.dismiss();
        }
      }, 1000);
    }
  }

  updateLog() {
    this.navCtrl.push(UpdateLogPage);
  }

  features() {
    this.nativeService.showToast('正在完善...');
  }

  feedBack() {
    this.navCtrl.push(FeedBackPage);
  }

}


