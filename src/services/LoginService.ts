import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {LoginInfo} from "../model/UserInfo";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";

@Injectable()
export class LoginService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }

  


  login(user): Observable<(Object)> {
    let param = {
     'action': 'userLogin',
     'sessionid':this.globalData.sessionId,
     'userCode': user.usercode,
     'passWord': user.password,
     'departCode':this.globalData.departCode
     };
     return this.httpService.get('phoneLogin/login.do', param).map((res: Response) => res.json());

     /*let loginInfo = [
      {result:'true',message:'success'},
      {
        userCode: 1,
        userName: 'gdliyh',
        departCode: '互联网+事业部',
        avatarId: ''
      }
    ];
    return Observable.create((observer) => {
      observer.next(loginInfo);
    });*/

  }

  loginTf(token): Observable<(Object)> {
    
    let param = {
     'action': 'userLoginDd',
     'userCode': '',
     'passWord': '',
     //'departCode':'',
     'ddToken':token
     };
     return this.httpService.get('phoneDDLogin/login.do', param).map((res: Response) => res.json());
  }

  getDepart(user): Observable<(Object)> {
    /*if(user.state=='1'){*/
    let param = {
     'action': 'userLogin',
     //'sessionid':'',
     'userCode': user.usercode,
     'passWord': user.password,
     //'departCode':''
     };

     return this.httpService.get('phoneLogin/login.do', param).map((res: Response) => res.json());
     
/*     }else{
       let param = {
       'action': 'userLogin',
       //'sessionid':'',
       'userCode': user.usercode,
       'passWord': user.password,
       //'departCode':''
       };

       return this.httpService.get('phoneLogin/login.do', param).map((res: Response) => res.json());
     }*/
  }

}
