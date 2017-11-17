import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {LoginInfo} from "../model/UserInfo";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";
import {ReviewType} from '../enums/review-type';

@Injectable()
export class ApprovalService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }

  //付款单据送审-审列表接口review_process 审批流程表
  queryUserReviewPay(billNumber:string, type:string): Observable<(Object)> {
    console.log('type: ' + type);
    let action = "";
    let reviewType = "";
    let getDo = "";
    if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT]){
        action = 'queryUserReviewPay';
        reviewType = "付款审批";
        getDo = "phonePaymentRequest.do";
    } else if(type == ReviewType[ReviewType.BASICACCEPTANCE_APPLY]){
        action = 'queryUserReviewAcceptance';
        reviewType = "验收申请审批";
        getDo = "phoneAcceptanceApply.do";
    }
    console.log('action: ' + action);
    console.log('reviewType: ' + reviewType);
    console.log('getDo: ' + getDo);
    let param = {
     //必传
     'action': action,
     'sessionid':this.globalData.sessionId,
     'billNumber': billNumber,
     'reviewType':reviewType//审批使用常量名
     };
     return this.httpService.get(getDo, param).map((res: Response) => res.json());
  }

  //审批进度获取 review_process 审批流程表
  queryApprovalProgress(billNumber:string, type:string,isHistory:string): Observable<(Object)> {
    let reviewType = "";
    if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT]){
        reviewType = "付款审批";
    } else if(type == ReviewType[ReviewType.BASICACCEPTANCE_APPLY]){
        reviewType = "验收申请审批";
    }else if(type == ReviewType[ReviewType.REVIEW_TYPE_CONTRACT_MAIN]){
        reviewType = "合同单据审批";
    } else if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_TRANSLATE_VOUCHER]){
        reviewType = "转资单审批";
    } else if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_TRANSLATE_ADJUST]){
        reviewType = "转资单调整审批";
    }
    let param = {
     //必传
     'action': 'getAuditList',
     'sessionid':this.globalData.sessionId,
     'billNumber': billNumber,
     'reviewType':reviewType,//审批使用常量名
     'isHistory':isHistory
     };
     return this.httpService.get('phoneCommon.do', param).map((res: Response) => res.json());
  }

  //单据送审确认接口- review_process 审批流程表
  sendReviewPay(billNumber:string,type:string,data:string): Observable<(Object)> {
    let reviewType = "";
    if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT]){
        reviewType = "付款审批";
    } else if(type == ReviewType[ReviewType.BASICACCEPTANCE_APPLY]){
        reviewType = "验收申请审批";
    } else if(type == ReviewType[ReviewType.REVIEW_TYPE_CONTRACT_MAIN]){
        reviewType = "合同单据审批";
    }
    let action = "sendReview";
    let formData: FormData = new FormData(); 
    formData.append('action', action);
    formData.append('sessionid', this.globalData.sessionId);
    formData.append('billNumber', billNumber);//单号”，
    formData.append('reviewType', reviewType);//审批使用常量名
    formData.append('data', data);
    console.log('action:' + action);
    console.log('sessionid:' + this.globalData.sessionId);
    console.log('billNumber:' + billNumber);
    console.log('reviewType: ' + reviewType);
    console.log('data:' + data);
    return this.httpService.postMultiFormData('phoneCommon.do', formData).map((res: Response) => res.json());
  }

  //审批接口review_process 审批流程表
  auditReview(billNumber:string,type:string,vetoReason:string): Observable<(Object)> {
    let reviewType = "";
    if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT]){
        reviewType = "付款审批";
    } else if(type == ReviewType[ReviewType.BASICACCEPTANCE_APPLY]){
        reviewType = "验收申请审批";
    } else if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_TRANSLATE_VOUCHER]){
        reviewType = "转资单审批";
    } else if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_TRANSLATE_ADJUST]){
        reviewType = "转资单调整审批";
    }else if(type == ReviewType[ReviewType.REVIEW_TYPE_CONTRACT_MAIN]){
        reviewType = "合同单据审批";
    }
    let action = "auditReview";
    let formData: FormData = new FormData(); 
    formData.append('action', action);
    formData.append('sessionid', this.globalData.sessionId);
    formData.append('billNumber', billNumber);//单号”，
    formData.append('reviewType', reviewType);//审批使用常量名
    formData.append('vetoReason', vetoReason);//审批意见
    console.log('action:' + action);
     console.log('sessionid:' + this.globalData.sessionId);
     console.log('billNumber:' + billNumber);
    console.log('reviewType: ' + reviewType);
     console.log('vetoReason:' + vetoReason);
     return this.httpService.postMultiFormData('phoneCommon.do', formData).map((res: Response) => res.json());
  }

  //否决接口review_process 审批流程表
  vetoReview(billNumber:string,type:string,vetoReason:string): Observable<(Object)> {
    let reviewType = "";
    if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_PAYMENT]){
        reviewType = "付款审批";
    } else if(type == ReviewType[ReviewType.BASICACCEPTANCE_APPLY]){
        reviewType = "验收申请审批";
    } else if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_TRANSLATE_VOUCHER]){
        reviewType = "转资单审批";
    } else if(type == ReviewType[ReviewType.REVIEW_TYPE_BASIC_TRANSLATE_ADJUST]){
        reviewType = "转资单调整审批";
    }else if(type == ReviewType[ReviewType.REVIEW_TYPE_CONTRACT_MAIN]){
        reviewType = "合同单据审批";
    }
    let action = "vetoReview";
    let formData: FormData = new FormData(); 
    formData.append('action', action);
    formData.append('sessionid', this.globalData.sessionId);
    formData.append('billNumber', billNumber);//单号”，
    formData.append('reviewType', reviewType);//审批使用常量名
    formData.append('vetoReason', vetoReason);//审批意见
    console.log('action:' + action);
     console.log('sessionid:' + this.globalData.sessionId);
     console.log('billNumber:' + billNumber);
    console.log('reviewType: ' + reviewType);
     console.log('vetoReason:' + vetoReason);
     return this.httpService.postMultiFormData('phoneCommon.do', formData).map((res: Response) => res.json());
  }
}
