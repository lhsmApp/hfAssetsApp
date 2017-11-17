import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavParams, ViewController} from 'ionic-angular';
import {NativeService} from '../../../providers/NativeService';
import {UserInfo} from "../../../model/UserInfo";
import {FileService} from "../../../providers/FileService";
import {FileObj} from "../../../model/FileObj";
import {MineService} from "../MineService";
declare var AlloyCrop;

@Component({
  selector: 'page-mine-edit-avatar-modal',
  templateUrl: 'mine-edit-avatar-modal.html'
})
export class MineEditAvatarModalPage {
  isChange: boolean = false;//头像是否改变标识
  avatarPath: string;

  constructor(private params: NavParams,
              private viewCtrl: ViewController,
              private fileService: FileService,
              private nativeService: NativeService,
              private mineService: MineService,
              private storage: Storage) {
    this.avatarPath = this.params.get('avatarPath');
  }

  getPicture(type) {//1拍照,0从图库选择
    let options = {
      targetWidth: 400,
      targetHeight: 400,
      quality: 100
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options).subscribe(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).subscribe(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    }
  }

  private getPictureSuccess(imageBase64) {
    new AlloyCrop({//api:https://github.com/AlloyTeam/AlloyCrop
      image_src: imageBase64,
      circle: true, // optional parameters , the default value is false
      width: 256, // crop width
      height: 256, // crop height
      output: 1,
      ok: (base64) => {
        this.isChange = true;
        this.avatarPath = base64;
      },
      cancel: () => {
      },
      ok_text: "确定", // optional parameters , the default value is ok
      cancel_text: "取消" // optional parameters , the default value is cancel
    });

  }

  saveAvatar() {
    if (this.isChange) {
      let fileObj = <FileObj>{'base64': this.avatarPath};
      this.fileService.uploadByBase64(fileObj).subscribe(fileObj => {// 上传头像图片到文件服务器
        let avatarId = fileObj.id, avatarPath = fileObj.origPath;
        this.mineService.updateUserAvatarId(avatarId).subscribe(res => {//保存avatar字段到用户表
          this.storage.get('userinfo').then((userinfo: UserInfo) => {
            userinfo.avatarId = avatarId;
            userinfo.avatarPath = avatarPath;
            this.storage.set('userinfo', userinfo);
          });
          this.viewCtrl.dismiss({avatarPath: avatarPath});
        });
      });
    } else {
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
