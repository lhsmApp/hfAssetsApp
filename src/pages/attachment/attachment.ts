import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {FileTransfer,FileTransferObject} from "@ionic-native/file-transfer";
//import {FileOpener } from "@ionic-native/file-opener";
import {File,FileEntry} from "@ionic-native/file";

import { Attachment} from '../../model/attachment';
import {DEFAULT_INVOICE} from "../../providers/Constants";
import { AttachmentService} from '../../services/attachmentService';
import {ResultBase} from "../../model/result-base";
import {DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
import {APP_SERVE_FILE_URL} from "../../providers/Constants";
import {NativeService} from '../../providers/NativeService';


/**
 * Generated class for the AttachmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 const  ATTACHMENT_LIST: Attachment []= [  
 { fileName: '办公发票', fileInfo: '办公发票描述', filePath: DEFAULT_INVOICE,sequence:1},
 { fileName: '旅游发票', fileInfo: '旅游发票描述',filePath: DEFAULT_INVOICE,sequence:2}
 ];


@IonicPage()
@Component({
  selector: 'page-attachment',
  templateUrl: 'attachment.html',
})
export class AttachmentPage {
  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  title:string;
  thumbPath=DEFAULT_INVOICE;
  attachmentList:Attachment[];
  billNumber:string;
  contractCode :string;
  type:string;//1.合同 2.发票 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl:AlertController,
    private inAppBrowser:InAppBrowser,
    //private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    private file:File,
    private attachmentService:AttachmentService,
    private nativeService: NativeService) {
  	//this.attachmentList=ATTACHMENT_LIST;
    this.billNumber=this.navParams.get('billNumber');
    this.contractCode=this.navParams.get('contractCode');
    this.type=this.navParams.get('type');
    if(this.type=='1'){
      this.title='合同附件';
    }else if(this.type=='2'){
      this.title='发票附件';
    }
  }

  ionViewDidLoad() {
    this.getList();
  }

  //获取附件列表信息
  getList(){
    //this.nativeService.alert(this.billNumber+'|'+this.contractCode+'|'+this.type);
    this.attachmentService.getAttachmentList(this.billNumber,this.contractCode,this.type)
    .subscribe(object => {
      let resultBase:ResultBase=object[0] as ResultBase;
      if(resultBase.result=='true'){
        if(object[1]!=null&&object[1].length>0){
          this.isEmpty=false;
          this.attachmentList = object[1] as Attachment[];
        }else{
          this.isEmpty=true;
        }
      }else{
        let alert = this.alertCtrl.create({
          title: '提示!',
          subTitle: resultBase.message,
          buttons: ['确定']
        });
        alert.present();
      }
    }, () => {
      
    });
  }

  //打开详情页
  openPage(item: Attachment) {
    let fileType=item.filePath.substring(item.filePath.lastIndexOf('.')+1);
    if(fileType.toLowerCase()=="jpg"||fileType.toLowerCase()=="jpeg"
      ||fileType.toLowerCase()=="png"||fileType.toLowerCase()=="gif"
      ||fileType.toLowerCase()=="bmp"||fileType.toLowerCase()=="eps"
      ||fileType.toLowerCase()=="tga"||fileType.toLowerCase()=="lic"
      ||fileType.toLowerCase()=="emf"||fileType.toLowerCase()=='wmf'
      ||fileType.toLowerCase()=="dxf"||fileType.toLowerCase()=="pcx"
      ||fileType.toLowerCase()=="svg"||fileType.toLowerCase()=="swf"
      ||fileType.toLowerCase()=="psd"||fileType.toLowerCase()=="tiff"
      ||fileType.toLowerCase()=="jpeg2000"||fileType.toLowerCase()=="exif"
      ||fileType.toLowerCase()=="cdr"||fileType.toLowerCase()=="hdri"
      ||fileType.toLowerCase()=="raw"||fileType.toLowerCase()=="ufo"
      ||fileType.toLowerCase()=="ai"){
      this.navCtrl.push("AttachmentViewPage",{attachment:item});
    }/*else if(fileType.toLowerCase()=="txt"||fileType.toLowerCase()=="docx"
      ||fileType.toLowerCase()=="doc"||fileType.toLowerCase()=="pptx"
      ||fileType.toLowerCase()=="ppt"||fileType.toLowerCase()=="xlsx"
      ||fileType.toLowerCase()=="xls"||fileType.toLowerCase()=="zip"
      ||fileType.toLowerCase()=="rar"||fileType.toLowerCase()=="pdf"){
      const fileTransfer: FileTransferObject = this.fileTransfer.create();
      const nativePath = this.file.externalRootDirectory + item.fileName; //文件保存的目录

      //下载并安装apk
      fileTransfer.download(APP_SERVE_FILE_URL +item.filePath, nativePath).then((entry) => {
        // entry.nativeURL 是上面那个插件文件下载后的保存路径
        this.fileOpener.open(entry.nativeURL, this.getFileMimeType(fileType))
        .then(() => {
          console.log('打开成功');
        })
        .catch(() => {
          console.log('打开失败');
          window.open(APP_SERVE_FILE_URL +item.filePath,'_system');
        });
      }, err => {
        window.open(APP_SERVE_FILE_URL +item.filePath,'_system');
      });
    }*/else{
      //this.inAppBrowser.create(APP_SERVE_FILE_URL +item.filePath);
      window.open(APP_SERVE_FILE_URL +item.filePath,'_system');
    }
  }

  //上拉刷新
  doRefresh(refresher) {
  	this.getList();
  	refresher.complete();
  }

  //增加
  add(){
    let modal = this.modalCtrl.create('AttachmentAddPage', {title:this.title,billNumber:this.billNumber,contractCode:this.contractCode,type:this.type});
    modal.present();
    modal.onDidDismiss(data => {
      data.reflesh && this.getList();
    });
  }

  getFileMimeType(fileType: string): string {
    let mimeType: string = '';
    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }

  //删除
  delete(item:Attachment){
    let confirm = this.alertCtrl.create({
      title: '删除提示?',
      message: '确认要删除当前付款单吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('cancel');
          }
        },
        {
          text: '确认',
          handler: () => {
            this.attachmentService.deleteAttachment(this.billNumber,this.contractCode,this.type,item.sequence)
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                this.attachmentList = this.attachmentList.filter(h => h !== item);
              }else{
                let alert = this.alertCtrl.create({
                title: '提示!',
                subTitle: resultBase.message,
                buttons: ['确定']
              });
              alert.present();
              }
            }, () => {
              
            });
          }
        }
      ]
    });
    confirm.present();
  }
}
