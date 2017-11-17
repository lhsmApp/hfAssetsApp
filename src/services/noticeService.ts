import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";

/*
 公告
 */
@Injectable()
export class NoticeService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }

  //查看通告（获取系统中已经发布的公告信息）
  getNoticeMainList(size:number): Observable<(Object)> {
  	console.log('查看通告'+this.globalData.sessionId);
    let param = {
       'action': 'getNoticeInfo',
       'sessionid': this.globalData.sessionId,
       'size': size,//0是传全部，x是查询x数量
     };
     return this.httpService.get('phoneMyInfo.do', param).map((res: Response) => res.json());
  }

  /*//查看通告（获取系统中已经发布的公告信息）
  getNoticeDetailItem(): Observable<(Object)> {
    console.log('查看通告'+this.globalData.sessionId);
    let param = {
       'action': '',
       'sessionid': this.globalData.sessionId,
     };
     return this.httpService.get('.do', param).map((res: Response) => res.json());
  }*/
}
