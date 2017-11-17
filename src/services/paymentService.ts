import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {LoginInfo} from "../model/UserInfo";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";

@Injectable()
export class PaymentService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }


  //付款单据申请列表---basic_pay_main       付款主表
  getPaymentMainList(type:string,reviewStatus:string,payCode:string,startDate:string,endDate:string): Observable<(Object)> {
  	console.log('付款主表'+this.globalData.sessionId);
    let param = {
     //必传
     'action': 'queryListPhonePayMain',
     'sessionid':this.globalData.sessionId,
     'type':type,//1.申请 2.查询 3.审批
     //可传
     /*付款后端字段解释(括号中代表客户端对应字段)
      0录入(新增)
      1审批中(待审批)
      2驳回(退回)
      3驳回至上一个审批人(待审批)
      4审批完成(已审批)
      6作废(若有作废按钮需求可加上作废按钮)
      若客户端传空的时候则后端查询全部*/
     'reviewStatus': reviewStatus,
     'payCode': payCode,
     'startDate':startDate,
     'endDate':endDate,
     
     };
     return this.httpService.get('phonePaymentRequest.do', param).map((res: Response) => res.json());
  }

  //付款单据申请详情---basic_pay_main
  getPaymentDetail(payCode:string): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryPhonePayMain',
     'sessionid':this.globalData.sessionId,
     'payCode': payCode
     };
     return this.httpService.get('phonePaymentRequest.do', param).map((res: Response) => res.json());
  }

  //付款申请新增（修改）---basic_pay_main       付款主表
  savePaymentMain(paymentInfo:string,gclInfo:string):Observable<(Object)> {
    /*let param = {
     //必传
     'action': 'savePhonePayMain',
     'sessionid':this.globalData.sessionId,
     'data': paymentInfo,
     'datalist':gclInfo
     };*/

    let formData: FormData = new FormData(); 
    //必传
    formData.append('action', 'savePhonePayMain');
    formData.append('sessionid', this.globalData.sessionId);
    formData.append('data', paymentInfo);
    formData.append('datalist', gclInfo);

    console.log('data:'+paymentInfo);
    console.log('datalist:'+gclInfo);
    //formData.append('data', '[{"payCode":"好","clauseType":"1","contractCode":"0000000101000009","contractName":"合同工作量清单test","elementType":"项目性质","elementName":"项目单元名称","planType":"0","payDigest":"付款原因","costMoney":100,"taxMoney":0,"payMoney":0,"paymentCode":"0000002","intercourseCode":"往来单位名称(收款单位)","requireDate":"20170202x","requireUser":"比如往来单位名称(收款单往来单位名称(收款单往来单位名称(收款单往来单位名称(收款单往来单位名称(收款单 "}]');
    return this.httpService.postMultiFormData('phonePaymentRequest.do', formData).map((res: Response) => res.json());
  }

  //付款单据删除---basic_pay_main       付款主表
  deletePaymentMain(payCode:string):Observable<(Object)> {
    /*let param = {
     //必传
     'action': 'deletePhonePayMain',
     'sessionid':this.globalData.sessionId,
     'payCode': payCode,
     };*/

     let formData: FormData = new FormData(); 
     //必传
     formData.append('action', 'deletePhonePayMain');
     formData.append('sessionid', this.globalData.sessionId);
     formData.append('payCode', payCode);

     console.log('payCode:'+payCode);
     return this.httpService.postMultiFormData('phonePaymentRequest.do', formData).map((res: Response) => res.json());
  }

  //发票列表basic_chalan_manager 发票主表
  getInvoiceMainList(payCode:string,chalanNumber :string): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryListPhoneBasicChalan',
     'sessionid':this.globalData.sessionId,
     'payCode': payCode,
     //可传
     'chalanNumber' :chalanNumber
     };
     return this.httpService.get('phonePaymentRequest.do', param).map((res: Response) => res.json());
  }

  //发票详细信息basic_chalan_manager 发票主表
  getInvoiceDetail(payCode:string,chalanNumber :string): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryPhoneBasicChalan',
     'sessionid':this.globalData.sessionId,
     'payCode': payCode,
     'chalanNumber' :chalanNumber
     };
     return this.httpService.get('phonePaymentRequest.do', param).map((res: Response) => res.json());
  }

  //发票单据新增（修改）---basic_chalan_manager发票主表
  saveInvoiceMain(payCode:string,chalanNumber:string,invoiceInfo:string):Observable<(Object)> {
    /*let param = {
     //必传
     'action': 'savePhoneBasicChalan',
     //'sessionid':this.globalData.sessionId,
     'payCode':payCode,
     //可传
     'data': invoiceInfo
     };*/
     let formData: FormData = new FormData(); 
     //必传
     formData.append('action', 'savePhoneBasicChalan');
     formData.append('sessionid', this.globalData.sessionId);
     formData.append('payCode', payCode);
     formData.append('chalanNumber', chalanNumber);
     //可传
     formData.append('data', invoiceInfo);

     console.log('payCode:'+payCode);
     console.log('data:'+invoiceInfo);
     return this.httpService.postMultiFormData('phonePaymentRequest.do', formData).map((res: Response) => res.json());
  }

  //发票详细信息删除basic_chalan_manager 发票主表
  deleteInvoiceMain(payCode:string,chalanNumber:string):Observable<(Object)> {
    /*let param = {
     //必传
     'action': 'deletePhoneBasicChalan',
     'sessionid':this.globalData.sessionId,
     'payCode':payCode,
     'chalanNumber': chalanNumber
     };*/

     let formData: FormData = new FormData(); 
     //必传
     formData.append('action', 'deletePhoneBasicChalan');
     formData.append('sessionid', this.globalData.sessionId);
     formData.append('payCode', payCode);
     formData.append('chalanNumber', chalanNumber);

     console.log('payCode:'+payCode);
     console.log('chalanNumber:'+chalanNumber);
     return this.httpService.postMultiFormData('phonePaymentRequest.do', formData).map((res: Response) => res.json());
  }

  //工作量清单列表----basic_contract_work_list工作量清单表
  getGclMainList(contractCode:string,type:string,payCode:string,sequence :string): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryListPhoneContractWorkList',
     //'sessionid':this.globalData.sessionId,
     'contractCode': contractCode,//合同流水号
     'type': type,//ht，fk（ht合同，fk付款，合同时把工作量清单全部查出，付款的话查询付款单号及没有付款单号的清单）
     'nullItem1' :sequence,//工作量清单序号
     //可传
     'payCode': payCode,//付款单号
     };
     return this.httpService.get('phonePaymentRequest.do', param).map((res: Response) => res.json());
  }

  //工作量清单详情----basic_contract_work_list工作量清单表
  getGclDetail(contractCode:string,sequence :string): Observable<(Object)> {
    let param = {
     //必传
     'action': 'queryPhoneContractWorkList',
     'contractCode':contractCode,//合同流水号
     'sequence': sequence//工作量清单序号
     };
     return this.httpService.get('phonePaymentRequest.do', param).map((res: Response) => res.json());
  }
}
