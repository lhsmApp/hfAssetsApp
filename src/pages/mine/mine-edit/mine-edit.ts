import {Component} from '@angular/core';
import {ModalController, NavParams} from 'ionic-angular';
import {MineEditModalPage} from '../mine-edit-modal/mine-edit-modal';
import {MineEditAvatarModalPage} from '../mine-edit-avatar-modal/mine-edit-avatar-modal';
import {UserInfo} from "../../../model/UserInfo";
import {DEFAULT_AVATAR} from "../../../providers/Constants";

@Component({
  selector: 'page-mine-edit',
  templateUrl: 'mine-edit.html'
})
export class MineEditPage {
  userInfo: UserInfo;
  avatarPath: String = DEFAULT_AVATAR;

  constructor(private modalCtrl: ModalController,
              private params: NavParams) {
    this.userInfo = this.params.get('userInfo');
    this.avatarPath = this.params.get('avatarPath');
  }

  viewAvatar() {
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, {avatarPath: this.avatarPath});
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarPath)
    });
  }

  openModal() {
    let modal = this.modalCtrl.create(MineEditModalPage, {'userInfo':this.userInfo});
    modal.present();
    modal.onDidDismiss(userInfo => {
      userInfo && (this.userInfo = userInfo)
    });
  }

}
