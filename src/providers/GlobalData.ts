/**
 * Created by jiachao on 2017-09-27.
 */
import {Injectable} from '@angular/core';
import {APP_SERVE_IP,APP_PORT_NATIVE,APP_PORT_BROWER,APP_SERVE_URL,APP_SERVE_FILE_URL,APP_SERVE_URL_CHART,APP_VERSION_SERVE_URL} from "../providers/Constants";

@Injectable()
export class GlobalData {

  private _serverIP:string;//服务器地址
  private _serverPort:string;//端口号

  private _serverApiUrl:string;//接口服务器地址
  private _serverFileUrl:string;//文件服务器地址
  private _serverApkUrl:string;//本地升级服务器地址
  private _serverChartUrl:string;//图表接口地址

  private _appNo:string;//当前版本号
  private _userId: string;//用户ID(登录帐号) 
  private _userCode: string;//用户编码
  private _passWord: string;//用户密码
  private _userName: string;//用户名
  /*private _fullName: string;//姓名
  private _token: string;//token*/
  private _sessionId:string;//sessionID
  private _departCode:string;//当前登录部门
  private _departName:string;//当前登录部门名称
  private _userType:number;//单位类型：0：内部单位 1：外部单位

  //设置http请求是否显示loading,注意:设置为true,接下来的请求会不显示loading,请求执行完成会自动设置为false
  private _showLoading: boolean = true;

  //app更新进度.默认为0,在app升级过程中会改变
  private _updateProgress: number = -1;

  get serverIP(): string {
    console.log(this.serverPort);
    if(this.serverPort==APP_PORT_BROWER)
      return "localhost"
    else
      return this._serverIP;

    
  }

  set serverIP(value: string) {
    this._serverIP = value;
  }

  get serverPort(): string {
    return this._serverPort;
  }

  set serverPort(value: string) {
    this._serverPort = value;
  }

  get serverApiUrl(): string {
    if(this.serverIP){
      return "http://"+this.serverIP+":"+this.serverPort+APP_SERVE_URL;
    }else{
      return "http://"+APP_SERVE_IP+":"+this.serverPort+APP_SERVE_URL;
    }
  }

  get serverFileUrl(): string {
    if(this.serverIP){
      return "http://"+this.serverIP+":"+this.serverPort+APP_SERVE_FILE_URL;
    }else{
      return "http://"+APP_SERVE_IP+":"+this.serverPort+APP_SERVE_FILE_URL;
    }
  }

  get serverApkUrl(): string {
    if(this.serverIP){
      return "http://"+this.serverIP+":"+this.serverPort+APP_VERSION_SERVE_URL;
    }else{
      return "http://"+APP_SERVE_IP+":"+this.serverPort+APP_VERSION_SERVE_URL;
    }
  }

  get serverChartUrl(): string {
    if(this.serverIP){
      return "http://"+this.serverIP+":"+this.serverPort+APP_SERVE_URL_CHART;
    }else{
      return "http://"+APP_SERVE_IP+":"+this.serverPort+APP_SERVE_URL_CHART;
    }
  }

  get appNo(): string {
    return this._appNo;
  }

  set appNo(value: string) {
    this._appNo = value;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  set sessionId(value: string) {
    this._sessionId = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get userCode(): string {
    return this._userCode;
  }

  set userCode(value: string) {
    this._userCode = value;
  }

  get passWord(): string {
    return this._passWord;
  }

  set passWord(value: string) {
    this._passWord = value;
  }

  get userName(): string {
    return this._userName;
  }

  set userName(value: string) {
    this._userName = value;
  }

  get departCode(): string {
    return this._departCode;
  }

  set departCode(value: string) {
    this._departCode = value;
  }

  get departName(): string {
    return this._departName;
  }

  set departName(value: string) {
    this._departName = value;
  }

  get userType(): number {
    return this._userType;
  }

  set userType(value: number) {
    this._userType = value;
  }

  /*get fullName(): string {
    return this._fullName;
  }

  set fullName(value: string) {
    this._fullName = value;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }*/

  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(value: boolean) {
    this._showLoading = value;
  }

  get updateProgress(): number {
    return this._updateProgress;
  }

  set updateProgress(value: number) {
    this._updateProgress = value;
  }
}
