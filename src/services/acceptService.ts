import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";

/*
 验收
 */
@Injectable()
export class AcceptService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }

  //验收申请单据列表---basic_assets_accept_apply  验收单据表
  getAcceptMainList(type:string, billNumber:string, startDate:string, endDate:string, 
             reviewStatus:string): Observable<(Object)> {
  	console.log('验收申请单据列表'+this.globalData.sessionId);
    let param = {
     'action': 'queryListAssetsAcceptanceApply',
     'sessionid': this.globalData.sessionId,
     'type': type,//1.申请 2.查询 3.审批
     'reviewStatus': reviewStatus,//0新增（新增）、99待审批（待审批）、1 审批成功（已审批）、2审批失败 （退回）
     'billNumber': billNumber,//"验收编号"(模糊查询)
     'startDate': startDate,//"开始日期"(对应   requireDate:"申请时间")
     'endDate': endDate,//"结束日期"(对应   requireDate:"申请时间")
     };
     return this.httpService.get('phoneAcceptanceApply.do', param).map((res: Response) => res.json());
  }

  //验收申请单据详情---basic_assets_accept_apply  验收单据表
  getAcceptDetailItem(billNumber:string):Observable<(object)>{
    console.log('验收申请单据详情'+this.globalData.sessionId);
    let param = {
        'action': "queryAssetsAcceptanceApply",
        'sessionid': this.globalData.sessionId,
        'billNumber': billNumber,//"验收编号"
    };
    return this.httpService.get('phoneAcceptanceApply.do', param).map((res:Response) => res.json());
  }

  //验收申请主页面保存---basic_assets_accept_apply  验收单据表
  saveAcceptApplyMain(data: string):Observable<(object)>{
    console.log('验收申请主页面保存'+this.globalData.sessionId);
    /*let param = {
        'action': "saveAssetsAcceptanceApply",
        'sessionid': this.globalData.sessionId,
        //data:[{//单条
        //      reviewStatus:"单据状态",
        //     billNumber :"单据编号",
        //     contractCode :"合同流水号",
        //      contractName:"合同名称",
        //     elementCode :"项目单元编码",
        //     elementName :"项目单元名称",
        //      departCode:"申请单位",
        //      requireUser:"申请人",
        //      requireDate:"申请日期"
        //           }]
    };*/
    let formData: FormData = new FormData(); 
    formData.append('action', 'saveAssetsAcceptanceApply');
    formData.append('sessionid', this.globalData.sessionId);
    formData.append('data', data);
    console.log('data:' + data);
    return this.httpService.postMultiFormData('phoneAcceptanceApply.do', formData).map((res:Response) => res.json());
  }

  //验收明细主页面保存---就是显示合同已审批通过的明细----basic_contract_detail   合同明细表
  saveAcceptApplyDetail(billNumber:string, contractCode:string, data: string):Observable<(object)>{
    console.log('验收明细主页面保存'+this.globalData.sessionId);
    /*let param = {
        'action': "savebasicContractDetail",
        //'sessionid': this.globalData.sessionId,
        'billNumber': billNumber,//”验收单号”，
        'contractCode': contractCode,//合同单号
        //data:[{
        //   xh:"序号",
        //   assetsType:"资产类型",
        //   assetsCodeType :"资产类别",
        //   assetsCode:"资产编码",
        //   assetsName:"资产名称",
        //   departCode:"所属单位",
        //   entityCode:"所属资产组",
        //   assetsStandard:"规格型号",
        //   licenceNumber:"车牌井号",
        //   unitCode:"计量单位",
        //   makeFactory :"制作厂家",
        //   factoryNumber:"出厂编号",
        //   productDate:"出厂日期",
        //   operateDate:"投产日期",
        //   usedAspect:"使用方向",
        //   contractCode :"合同编号",
        //   applyCode:"取得方式",
        //   guaDate :"保修截止日期",
        //   depreciateYear:预计使用年限(int 型)
        //   usedState:"使用状况"
        //   storePlace:"存放地点""
        //   userPerson:"保管人"
        //   specialLine:"技术鉴定部门"
        //   originalValue:原值(double)
        //   nowValue:净值(double)
        //   addDepreciate:累计折旧(double)
        //   devalueValue:减值准备(double)
        //   keyCode:资产键码}]
    };*/
    let formData: FormData = new FormData(); 
    formData.append('action', 'savebasicContractDetail');
    formData.append('sessionid', this.globalData.sessionId);
    formData.append('billNumber', billNumber);//”验收单号”，
    formData.append('contractCode', contractCode);//合同单号
    formData.append('data', data);
    console.log('data:' + data);
    return this.httpService.postMultiFormData('phoneAcceptanceApply.do', formData).map((res:Response) => res.json());
  }

  //（暂时不开发）验收单据删除---basic_assets_accept_apply  验收单据表
  /*deleteAcceptApply(billNumber:string):Observable<(object)>{
    console.log('验收单据删除'+this.globalData.sessionId);
    let param = {
        'action': "deletePhoneAssetsAcceptanceApply",
        'sessionid': this.globalData.sessionId,
        'billNumber': billNumber,//”验收单号”，
    };
    return this.httpService.post('phoneAcceptanceApply.do', param).map((res:Response) => res.json());
  }*/

  //

  //

  //

  //

  //

  

/*
 转资
 */
  //转资申请列表----basic_translate_voucher  转资单据表
  getTranslateVoucherMainList(type:string, feeFlag:string, translateCode:string, startDate:string, endDate:string, reviewStatus:string): Observable<(Object)> {
    console.log('转资申请列表'+this.globalData.sessionId);
    let param = {
     'action': 'queryListPhoneBasicTranslateVoucher',
     'sessionid': this.globalData.sessionId,
     'type': type,//1.申请 2.查询 3.审批
     'feeFlag': feeFlag,//  是否已分摊费用 0否 1是
     'translateCode': translateCode,//单据编号
     'startDate': startDate,//"开始日期"(对应  requireDate :"申请日期")
     'endDate': endDate,//"结束日期"(对应   requireDate :"申请日期")
     'reviewStatus': reviewStatus,//" 单据状态"  
          //转资后端字段解释(括号中代表客户端对应字段)
          //0未提交(新增) 
          //1未审批(待审批) 
          //2已驳回(退回) 
          //3审批中(待审批)  
          //4已审批(已审批) 
          //若客户端传空的时候则后端查询全部
     };
     return this.httpService.get('phoneBasicTranslateVoucher.do', param).map((res: Response) => res.json());
  }

  //转资申请详细----basic_translate_voucher  转资单据表
  getTranslateVoucherDetailItem(translateCode:string):Observable<(object)>{
    console.log('转资申请详细'+this.globalData.sessionId);
    let param = {
        'action': "queryPhoneBasicTranslateVoucher",
        'sessionid': this.globalData.sessionId,
        'translateCode': translateCode,//单据编号
    };
    return this.httpService.get('phoneBasicTranslateVoucher.do', param).map((res:Response) => res.json());
  }
    
/*
 转资调整
 */
  //转资调整单明细列表-----basic_tz_cost 转资调整明细表
  getTzCostMainList(type:string, feeFlag:string, translateCode:string, sequence:string): Observable<(Object)> {
    console.log('转资调整单明细列表'+this.globalData.sessionId);
    let param = {
     'action': 'queryListPhonebasicTzCost',
     'sessionid': this.globalData.sessionId,
     'type': type,//  1.申请明细(没有) 2.查询明细 3.审批明细
     'feeFlag': feeFlag,//  是否已分摊费用 0否 1是
     'translateCode': translateCode,//”转资单号”
     'sequence': sequence,// 转资序号
     };
     return this.httpService.get('phoneBasicTranslateVoucher.do', param).map((res: Response) => res.json());
  }

  //转资调整单明细-----basic_tz_cost 转资调整明细表
  getTzCostDetailItem(translateCode:string, keyCode:string):Observable<(object)>{
    console.log('转资调整单明细'+this.globalData.sessionId);
    let param = {
        'action': "queryPhonebasicTzCost",
        'sessionid': this.globalData.sessionId,
        'translateCode': translateCode,//转资单号
        'keyCode': keyCode,//资产键码
    };
    return this.httpService.get('phoneBasicTranslateVoucher.do', param).map((res:Response) => res.json());
  }
}
