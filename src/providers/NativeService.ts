/**
 * Created by jiachao on 2017-09-27.
 */
import {Injectable} from "@angular/core";
import {ToastController, LoadingController, Platform, Loading, AlertController,Events } from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AppVersion} from "@ionic-native/app-version";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Toast} from "@ionic-native/toast";
import {File,FileEntry} from "@ionic-native/file";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {FileOpener } from "@ionic-native/file-opener";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ImagePicker} from "@ionic-native/image-picker";
import {Network} from "@ionic-native/network";
import {AppMinimize} from "@ionic-native/app-minimize";
import {Position} from "../model/type";
import {APP_DOWNLOAD, APK_DOWNLOAD, IMAGE_SIZE, QUALITY_SIZE, REQUEST_TIMEOUT} from "./Constants";
import {GlobalData} from "./GlobalData";
import {Observable} from "rxjs";
import {Logger} from "./Logger";
import {Utils} from "./Utils";
import {Diagnostic} from "@ionic-native/diagnostic";
import {PhotoLibrary } from "@ionic-native/photo-library";
import {AndroidPermissions  } from "@ionic-native/android-permissions";
import { PhotoViewer } from '@ionic-native/photo-viewer';

declare var LocationPlugin;
declare var AMapNavigation;

@Injectable()
export class NativeService {
  private loading: Loading;
  private loadingIsOpen: boolean = false;

  constructor(private platform: Platform,
              private events: Events,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private appVersion: AppVersion,
              private camera: Camera,
              private toast: Toast,
              private transfer: FileTransfer,
              private file: File,
              private fileOpener:FileOpener,
              private inAppBrowser: InAppBrowser,
              private imagePicker: ImagePicker,
              private network: Network,
              private appMinimize: AppMinimize,
              private loadingCtrl: LoadingController,
              private globalData: GlobalData,
              private diagnostic: Diagnostic,
              private photoLibrary:PhotoLibrary,
              private androidPermissions:AndroidPermissions,
              private photoViewer:PhotoViewer,
              public logger: Logger) {
  }


  /**
   * 使用默认状态栏
   */
  statusBarStyleDefault(): void {
    this.statusBar.styleDefault();
  }

  /**
   * 隐藏启动页面
   */
  splashScreenHide(): void {
    this.splashScreen.hide();
  }

  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }

  /**
   * 判断是否有网络
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }

  /**
   * 调用最小化app插件
   */
  minimize(): void {
    this.appMinimize.minimize()
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 下载安装app
   */
  downloadApp(): void {
    if (this.isIos()) {//ios打开网页下载
      //this.openUrlByBrowser(APP_DOWNLOAD);
      this.openUrlByBrowser(this.globalData.serverApkUrl);
    }
    if (this.isAndroid()) {//android本地下载
      let backgroundProcess = false;//是否后台下载
      let alert = this.alertCtrl.create({//显示下载进度
        title: '下载进度：0%',
        enableBackdropDismiss: false,
        buttons: [{
          text: '后台下载', handler: () => {
            backgroundProcess = true;
          }
        }
        ]
      });
      alert.present();

      const fileTransfer: FileTransferObject = this.transfer.create();
      const apk = this.file.dataDirectory  + `android_${Utils.getSequence()}.apk`; //apk保存的目录

      //下载并安装apk
      //fileTransfer.download(APK_DOWNLOAD, apk).then(() => {
      fileTransfer.download(this.globalData.serverApkUrl, apk).then((entry) => {
        //window['install'].install(apk.replace('file://', ''));
        alert.dismiss();
        this.fileOpener.open(apk, 'application/vnd.android.package-archive').then(() =>{  
            console.log('File is opened')  
        }).catch(e => {  
            console.log('Error openening file', e)  
        });  
      }, (error) => {
        alert.dismiss();
        //this.logger.log(err, 'android app 本地升级失败');
        this.alertCtrl.create({
          title: '前往网页下载',
          subTitle: '本地升级失败',
          buttons: [
            {
              text: '确定',
              handler: () => {
                //this.openUrlByBrowser(APP_DOWNLOAD);//打开网页下载
                this.openUrlByBrowser(this.globalData.serverApkUrl);//打开网页下载
              }
            }
          ]
        }).present();
      });

      let timer = null;//由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
      fileTransfer.onProgress((event: ProgressEvent) => {
        let progress = Math.floor(event.loaded / event.total * 100);//下载进度
        this.globalData.updateProgress = progress;
        if (!backgroundProcess) {
          if (progress === 100) {
            alert.dismiss();
          } else {
            if (!timer) {
              timer = setTimeout(() => {
                clearTimeout(timer);
                timer = null;
                let title = document.getElementsByClassName('alert-title')[0];
                title && (title.innerHTML = `下载进度：${progress}%`);
              }, 1000);
            }
          }
        }
      });
    }
  }

  /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  alert(title: string, subTitle: string = "",): void {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{text: '确定'}]
    }).present();
  }

  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'middle',
        showCloseButton: false
      }).present();
    }
  };

  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading(content: string = ''): void {
    if (!this.globalData.showLoading) {
      return;
    }
    if (!this.loadingIsOpen) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content
      });
      this.loading.present();
      setTimeout(() => {
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
      }, REQUEST_TIMEOUT);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading(): void {
    if (!this.globalData.showLoading) {
      this.globalData.showLoading = true;
    }
    this.loadingIsOpen && this.loading.dismiss();
    this.loadingIsOpen = false;
  };

  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      destinationType: this.camera.DestinationType.DATA_URL,//默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
      quality: QUALITY_SIZE,//图像质量，范围为0 - 100
      allowEdit: false,//选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: IMAGE_SIZE,//缩放图像的宽度（像素）
      targetHeight: IMAGE_SIZE,//缩放图像的高度（像素）
      saveToPhotoAlbum: false,//是否保存到相册
      correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
    }, options);
    return Observable.create(observer => {
      this.camera.getPicture(ops).then((imgData: string) => {
        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
          observer.next('data:image/jpg;base64,' + imgData);
        } else {
          observer.next(imgData);
        }
      }).catch(err => {
        if (err == 20) {
          this.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        if (String(err).toLowerCase().indexOf('no image selected') != -1) {
          return;
        }
        //this.logger.log(err, '使用cordova-plugin-camera获取照片失败');
        this.alert('获取照片失败');
      });
    });
  };

  /**
   * 通过拍照获取照片
   * @param options
   */
  getPictureByCamera(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库获取照片
   * @param options
   */
  getPictureByPhotoLibrary(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过拍照获取照片(返回路径)
   * @param options
   */
  getPictureByCameraOfPath(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum:true,
      destinationType: this.camera.DestinationType.FILE_URI//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库获取照片(返回路径)
   * @param options
   */
  getPictureByPhotoLibraryOfPath(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库选择多图
   * @param options
   */
  getMultiplePicture(options = {}): Observable<any> {
    let that = this;
    let ops = Object.assign({
      maximumImagesCount: 6,
      width: IMAGE_SIZE,//缩放图像的宽度（像素）
      height: IMAGE_SIZE,//缩放图像的高度（像素）
      quality: QUALITY_SIZE//图像质量，范围为0 - 100
    }, options);
    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then(files => {
        let destinationType = options['destinationType'] || 0;//0:base64字符串,1:图片url
        if (destinationType === 1) {
          observer.next(files);
        } else {
          let imgBase64s = [];//base64字符串数组
          for (let fileUrl of files) {
            that.convertImgToBase64(fileUrl).subscribe(base64 => {
              imgBase64s.push(base64);
              if (imgBase64s.length === files.length) {
                observer.next(imgBase64s);
              }
            })
          }
        }
      }).catch(err => {
        //this.logger.log(err, '通过图库选择多图失败');
        this.alert('获取照片失败');
      });
    });
  };

  /**
   * 根据图片绝对路径转化为base64字符串
   * @param path 绝对路径
   */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          let reader = new FileReader();
          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(file);
        });
      }).catch(err => {
        //this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
      });
    });
  }

  /**
   * 根据图片绝对路径转化为ArrayBuffer
   * @param path 绝对路径
   */
  convertImgToArrayBuffer(path: string): Observable<any> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          let blob: Blob = <Blob>file;
          let reader = new FileReader();
          reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {type: blob.type});
            let blobInfo={fileName:(<any>blob).name,blob:imgBlob}
            observer.next(blobInfo);
          };
          reader.readAsArrayBuffer(blob);
        });
      }).catch(err => {
        //this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
      });

      /*let filePath=path.substring(0,path.lastIndexOf('/'));
      let fileName=path.substring(path.lastIndexOf('/')+1);
      let info:Promise<ArrayBuffer> =this.file.readAsArrayBuffer(filePath,fileName);
      this.alert('info',JSON.stringify(info));

      info.then(fileData=>{
        this.alert('sd',fileData.byteLength.toString());
        observer.next(fileData);
      }).catch(err=>{this.alert('err',JSON.stringify(err))});*/


      /*this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          let blob: Blob = <Blob>file;
          observer.next(blob);
        });
      }).catch(err => {
        //this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
        this.alert('err',err);
      });*/
    });
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        //this.logger.log(err, '获得app版本号失败');
      });
    });
  }

  /**
   * 获得app name,如现场作业
   * @description  对应/config.xml中name的值
   */
  getAppName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getAppName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        //this.logger.log(err, '获得app name失败');
      });
    });
  }

  /**
   * 获得app包名/id,如com.kit.ionic2tabs
   * @description  对应/config.xml中id的值
   */
  getPackageName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getPackageName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        //this.logger.log(err, '获得app包名失败');
      });
    });
  }

  /**
   * 获得用户当前坐标
   */
  getUserLocation = (() => {//自执行函数,使用闭包保存locationAuthorization变量
      let locationAuthorization = false;//是否有定位权限
      return () => {
        return Observable.create(observer => {
          if (this.isMobile()) {
            if (locationAuthorization) {
              return this.getLocation(observer);
            } else {
              this.diagnostic.isLocationAvailable().then(res => {//判断是否有定位权限.返回true或false
                if (res) {
                  locationAuthorization = true;
                  return this.getLocation(observer);
                } else {
                  this.diagnostic.requestLocationAuthorization('always').then(res => {//请求定位权限
                    if (res == 'DENIED_ALWAYS') {//拒绝访问状态,必须手动开启
                      locationAuthorization = false;
                      this.alert('缺少定位权限，请在手机设置中开启');
                      return;
                    } else {
                      locationAuthorization = true;
                      return this.getLocation(observer);
                    }
                  }).catch(err => {
                    //this.logger.log(err, '调用diagnostic.requestLocationAuthorization方法失败');
                  });
                }
              }).catch(err => {
                //this.logger.log(err, '调用diagnostic.isLocationAvailable方法失败');
              });
            }
          } else {
            console.log('非手机环境,即测试环境返回固定坐标');
            observer.next({'lng': 113.350912, 'lat': 23.119495});
          }
        });
      }
    })();


  private getLocation(observer){
    LocationPlugin.getLocation(data => {
      observer.next({'lng': data.longitude, 'lat': data.latitude});
    }, msg => {
      observer.error('获取位置失败');
      if (msg.indexOf('缺少定位权限') != -1) {
        this.alert('缺少定位权限，请在设备的设置中开启app的定位权限');
        return;
      }
      if (msg.indexOf('KEY错误') != -1) {
        this.alert('KEY错误，请到高德开发者官网申请key');
        return;
      }
      this.alert('错误消息：' + msg);
      //this.logger.log(msg, '获取位置失败');
    });
  }


  /**
   * 地图导航
   * @param startPoint 开始坐标
   * @param endPoint 结束坐标
   * @param type 0实时导航,1模拟导航,默认为模拟导航
   */
  navigation(startPoint: Position, endPoint: Position, type = 1): Observable<string> {
    return Observable.create(observer => {
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        AMapNavigation.navigation({
          lng: startPoint.lng,
          lat: startPoint.lat
        }, {
          lng: endPoint.lng,
          lat: endPoint.lat
        }, type, message => {
          observer.next(message);
        }, err => {
          //this.logger.log(err, '导航失败');
          this.alert('导航失败');
        });
      } else {
        this.alert('非手机环境不能导航');
      }
    });
  }

  //长时间未操作超时提示，跳转到登录页面
  alertReLogin(title: string, subTitle: string = "",): void {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: '确定',
        handler: () => {
            //this.navCtrl.popToRoot();
           this.events.publish('system:timeout');
        }
      }]
    }).present();
  }

  //预览图片
  showPhotoViewer(url:string){
    this.photoViewer.show(url,'',{share: false});
  }

  //保存图片到本地
  savePhoto(url:string){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      success=>{
        var tempSuccess=JSON.stringify(success);
        if(!tempSuccess['hasPermission']){
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(suc=>{
            this.photoLibrary.saveImage(url,'imgs').then(res=>{
              this.showToast('保存成功');
            }).catch(err=>{
              this.showToast('没有权限,请在设置中开启权限');
            });
          })
        }else{
          this.photoLibrary.saveImage(url,'imgs').then(res=>{
            this.showToast('保存成功');
          }).catch(res=>{
            this.showToast('保存失败');
          })
        }

      }).catch(
      err=>this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(suc=>{
        this.photoLibrary.saveImage(url,'imgs').then(res=>{
          this.showToast('保存成功');
        }).catch(error=>{
          this.showToast('保存失败'+JSON.stringify(error));
        })
      }).catch(err=>{
        this.showToast('没有权限,请在设置中开启权限');
      }));
  }
}
