/**
 * Created by jiachao on 2017-09-27.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class GlobalData {

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

  //设置http请求是否显示loading,注意:设置为true,接下来的请求会不显示loading,请求执行完成会自动设置为false
  private _showLoading: boolean = true;

  //app更新进度.默认为0,在app升级过程中会改变
  private _updateProgress: number = -1;

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
