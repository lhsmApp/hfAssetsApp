import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {LoginInfo} from "../model/UserInfo";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";

@Injectable()
export class SystemService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }


  //综合编码字典查询
  getSystemDict(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryComplexByCodeProperty',
     'sessionid':this.globalData.sessionId,
     };
     return this.httpService.get('phoneDictionaryQuery.do', param).map((res: Response) => res.json());
  }

  //单位字典
  getDepartDict(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryDepartCodeList',
     'sessionid':this.globalData.sessionId,
     'departCode':''
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  //外部单位字典
  getOutDepartDict(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryOutDepartCodeList',
     'sessionid':this.globalData.sessionId,
     'departCode':''
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  //资产组字典
  getBasicEntityManagerDict(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'querySelectBasicEntityManagerList',
     'sessionid':this.globalData.sessionId,
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  //资产目录字典 assets_code 资产组表
  getAssetsDict(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'querySelectAssetsCodeList',
     'sessionid':this.globalData.sessionId,
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  //合同类别字典
  getContractTypeDict(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'compactTypeList',
     'sessionid':this.globalData.sessionId,
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  //项目单元字典
  getProjectElementDict(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'projectElementList',
     'sessionid':this.globalData.sessionId,
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  //切换单位
  changeDepart(departCode:string): Observable<(Object)> {
    let param = {
     //必传
     'action': 'loginSelectDepart',
     'sessionid':this.globalData.sessionId,
     'userCode':this.globalData.userCode,
     'password':this.globalData.userName,
     'departCode':departCode
     };
     return this.httpService.get('departmentLogin.do', param).map((res: Response) => res.json());
  }

  //待办事项
  getReviewTypeInfo(): Observable<(Object)> {
    let param = {
     //必传
     'action': 'getReviewTypeInfo',
     'sessionid':this.globalData.sessionId,
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  //修改密码sys_user用户表
  changePassword(password:string,newPassword:string): Observable<(Object)> {
    let param = {
     //必传
     'action': 'userPasswordChange',
     'sessionid':this.globalData.sessionId,
     'password':password,
     'newPassword':newPassword,
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }
}
