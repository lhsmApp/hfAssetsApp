import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController,Navbar } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {FileTransfer,FileTransferObject} from "@ionic-native/file-transfer";
import {FileOpener } from "@ionic-native/file-opener";
import {File,FileEntry} from "@ionic-native/file";

import { Attachment} from '../../model/attachment';
import {DEFAULT_INVOICE,DEFAULT_INVOICE_EMPTY} from "../../providers/Constants";
import { AttachmentService} from '../../services/attachmentService';
import {ResultBase} from "../../model/result-base";
import {NativeService} from '../../providers/NativeService';
import {GlobalData} from "../../providers/GlobalData";


/**
 * Generated class for the AttachmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 /*const  ATTACHMENT_LIST: Attachment []= [  
 { fileName: '办公发票', fileInfo: '办公发票描述', filePath: DEFAULT_INVOICE,sequence:1},
 { fileName: '旅游发票', fileInfo: '旅游发票描述',filePath: DEFAULT_INVOICE,sequence:2}
 ];*/


@IonicPage()
@Component({
  selector: 'page-attachment',
  templateUrl: 'attachment.html',
})
export class AttachmentPage {
  @ViewChild('myNavbar') navBar: Navbar;

  sendSuccess:Boolean = false;
  callback :any;

  emptyPath=DEFAULT_INVOICE_EMPTY;
  isEmpty:boolean=false;
  title:string;
  thumbPath=DEFAULT_INVOICE;
  attachmentList:Attachment[];
  billNumber:string;
  contractCode :string;
  type:string;//1.合同/验收 2.发票 3.付款
  typeList:string;//1、合同 2、付款、发票、验收
  attachmentType:string;//1.合同 2.付款 3.发票 4.验收

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl:AlertController,
    private inAppBrowser:InAppBrowser,
    private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    private file:File,
    private attachmentService:AttachmentService,
    private nativeService: NativeService,
    private globalData: GlobalData) {
  	//this.attachmentList=ATTACHMENT_LIST;
    this.billNumber=this.navParams.get('billNumber');
    this.contractCode=this.navParams.get('contractCode');
    this.type=this.navParams.get('type');
    this.callback = this.navParams.get('callback');
    this.typeList=this.navParams.get('typeList');
    this.attachmentType=this.navParams.get('attachmentType');
    if(this.attachmentType=='1'){
      this.title='合同附件';
    }else if(this.attachmentType=='2'){
      this.title='付款附件';
    }else if(this.attachmentType=='3'){
      this.title='发票附件';
    }else if(this.attachmentType=='4'){
      this.title='实物确认附件';
    }
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick=()=>{
      console.log('back');
      if(this.sendSuccess){
        this.callback(true).then(()=>{ this.navCtrl.pop() });
      }else{
        this.navCtrl.pop();
      }
      //this.isYFK=false;//是预付款显示付款比例
    }
    this.sendSuccess=false;
    this.getList();
  }

  //当点击手机物理后退键时促发审批或者送审刷新动作
  refBack(){
    console.log("refBack");
    this.callback(true).then(()=>{ this.navCtrl.pop() });
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
      //this.nativeService.showPhotoViewer(this.globalData.serverFileUrl+item.filePath);
    }else if(fileType.toLowerCase()=="txt"||fileType.toLowerCase()=="docx"
      ||fileType.toLowerCase()=="doc"||fileType.toLowerCase()=="pptx"
      ||fileType.toLowerCase()=="ppt"||fileType.toLowerCase()=="xlsx"
      ||fileType.toLowerCase()=="xls"||fileType.toLowerCase()=="zip"
      ||fileType.toLowerCase()=="rar"||fileType.toLowerCase()=="pdf"){
      const fileTransfer: FileTransferObject = this.fileTransfer.create();
      const nativePath = this.file.dataDirectory + item.fileName; //文件保存的目录

      //下载并安装apk
      fileTransfer.download(this.globalData.serverFileUrl +item.filePath, nativePath).then((entry) => {
        // entry.nativeURL 是上面那个插件文件下载后的保存路径
        this.fileOpener.open(entry.nativeURL, this.getFileMimeType(fileType))
        .then(() => {
          console.log('打开成功');
        })
        .catch((error) => {
          console.log('打开失败');
          window.open(this.globalData.serverFileUrl +item.filePath,'_system');
        });
      }, err => {
        window.open(this.globalData.serverFileUrl +item.filePath,'_system');
      });
    }else{
      //this.inAppBrowser.create(this.globalData.serverFileUrl +item.filePath);
      window.open(this.globalData.serverFileUrl +item.filePath,'_system');
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
      console.log(data);
      if(data){
        this.sendSuccess = true;
        data.reflesh && this.getList();
      }
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
      message: '确认要删除吗?',
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
            this.attachmentService.deleteAttachment(this.billNumber,this.contractCode,this.type,item.sequence,'0')
            .subscribe(object => {
              let resultBase:ResultBase=object[0] as ResultBase;
              if(resultBase.result=='true'){
                this.sendSuccess = true;
                this.getList();
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
