import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {Utils} from "../../../providers/Utils";
import {LoginPage} from "../../login/login";
import {ChangePasswordPage} from "../change-password/change-password";

/**
 * Generated class for the SettingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
  }

  clearCache() {
    this.alertCtrl.create({
      title: '确认清除缓存？',
      subTitle: '清除后需要重新登录',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            Utils.sessionStorageClear();
            this.storage.clear();
            let modal = this.modalCtrl.create(LoginPage);
            modal.present();
            modal.onDidDismiss(data => {
              this.navCtrl.popToRoot();
            });
          }
        }
      ]
    }).present();
  }


  changePassword() {
    let modal = this.modalCtrl.create(ChangePasswordPage);
    modal.present();
    modal.onDidDismiss(data => {
    });
  }


}
