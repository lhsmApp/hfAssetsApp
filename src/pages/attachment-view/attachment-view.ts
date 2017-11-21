import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,ActionSheetController} from 'ionic-angular';
import {DEFAULT_INVOICE} from "../../providers/Constants";
import { Attachment} from '../../model/attachment';
import {APP_SERVE_FILE_URL} from "../../providers/Constants";
import { NativeService} from "../../providers/NativeService";

/**
 * Generated class for the AttachmentViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attachment-view',
  templateUrl: 'attachment-view.html',
})
export class AttachmentViewPage {

  attachmentPath: string=DEFAULT_INVOICE;
  attachment:Attachment;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private nativeService: NativeService,
    private actionSheetCtrl: ActionSheetController) {
    this.attachment=this.navParams.get('attachment');
    this.attachmentPath=APP_SERVE_FILE_URL + this.attachment.filePath;
    //this.nativeService.alert('path',this.attachmentPath);
  }

  ionViewDidLoad() {
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  //下载图片
  downPhoto(){
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: '保存',
          handler: () => {
            this.nativeService.savePhoto(this.attachmentPath);
            console.log('Archive clicked');
          }
        },{
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
