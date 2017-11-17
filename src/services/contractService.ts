import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";

/*
 合同
 */
@Injectable()
export class ContractService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }

  //合同申请列表-----basic_contract_main  合同主表
  getContractMainList(type:string, contractCode:string, startDate:string, endDate:string, 
              checkResult:string, contract_type:string): Observable<(Object)> {
  	console.log('合同申请列表'+this.globalData.sessionId);
    console.log(type + " " + checkResult + " " + contract_type);
    let param = {
     'action': 'queryListPhoneContractMain',
     'sessionid': this.globalData.sessionId,
     'type': type,//1.申请 2.查询 3.审批
     'contractCode': contractCode,//合同流水号" (模糊查询)
     'startDate': startDate,//"开始日期"(对应  requireDate :"申请日期")
     'endDate': endDate,//"结束日期"(对应   requireDate :"申请日期")
     'checkResult': checkResult,//" 单据状态"
          //合同后端字段解释(括号中代表客户端对应字段)
          //0新增(新增) 
          //1审批通过(已审批)) 
          //2驳回(退回) 
          //3解约 
          //4审批中(待审批) 
          //10待审批(待审批)
     'contract_type': contract_type,//类型，新增：基建与租赁区分1基建，2租赁(如果是查询界面调用必须输入)
     };
     return this.httpService.get('phoneContactMain.do', param).map((res: Response) => res.json());
  }

  //合同单据详情-----basic_contract_main  合同主表
  getContractDetailItem(contractCode:string, sequence:string):Observable<(object)>{
    console.log('合同单据详情'+this.globalData.sessionId);
    let param = {
        'action': "queryPhoneContractMain",
        'sessionid': this.globalData.sessionId,
        'contractCode': contractCode,//合同流水号
        'sequence': sequence,//序号
    };
    return this.httpService.get('phoneContactMain.do', param).map((res:Response) => res.json());
  }

  //资产明细列表-----basic_contract_detail 合同明细表
  getAssetDetailList(contractCode:string, translateCode:string, acceptanceFlag:string, checkResult:string):Observable<(object)>{
    console.log('资产明细列表'+this.globalData.sessionId);
    let param = {
        'action': "queryListPhoneContractDetail",
        'sessionid': this.globalData.sessionId,
        'contractCode': contractCode,//合同流水号
        'translateCode': translateCode,//”转资单号”
        'checkResult': checkResult,
        'acceptanceFlag': acceptanceFlag,
        //1.合同调用,acceptanceFlag="",contractCode必传，checkResult必传
        //2.验收调用 acceptanceFlag=1，contractCode必传，translateCode传""或者不传都行
        //3.转资单调用acceptanceFlag=1，translateCode必传
    };
    return this.httpService.get('phoneContactMain.do', param).map((res:Response) => res.json());
  }

  //资产明细详情-----basic_contract_detail 合同明细表
  //1.合同/验收调用 contractCode + keyCode(合同流水号+转资键码) checkResult(合同调用必传)
  //2.转资调用 translateCode+elementCode(转资单号+项目单元编码) translateType转资类型
  // reqTyle: ht/ ys /zz(合同/验收/转资)
  getAssetDetailItem(contractCode:string, keyCode:string, checkResult:string,
        translateCode:string, elementCode:string, translateType:string,
        reqTyle:string):Observable<(object)>{
    console.log('资产明细详情'+this.globalData.sessionId);
    let param = {
        'action': "queryPhoneContractDetailMain",
        'sessionid': this.globalData.sessionId,
        'contractCode': contractCode,//合同流水号
        'checkResult': checkResult,//合同调用必传
        'keyCode': keyCode,//资产键码

        'translateCode': translateCode,//转资单号
        'elementCode': elementCode,//项目单元编码
        'translateType': translateType,//转资类型
        
        'reqTyle': reqTyle,//ht/ ys /zz(合同/验收/转资)
    };
    return this.httpService.get('phoneContactMain.do', param).map((res:Response) => res.json());
  }

}
