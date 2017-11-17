import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";

/*
 项目单元
 */
@Injectable()
export class ProjectElementService {
  constructor(public httpService: HttpService, private globalData: GlobalData) {
  }

  //项目单元列表-----basic_project_element  项目单元表
  getProjectElementMainList(type:string, sgsx:string, elementCode:string, startDate:string, endDate:string, checkResult:string): Observable<(Object)> {
  	console.log('项目单元列表'+this.globalData.sessionId);
    let param = {
     'action': 'queryListPhoneBasicProjectElement',
     'sessionid': this.globalData.sessionId,
     'type': type,//1.申请 2.查询 3.审批
     'sgsx': sgsx,//”施工属性”（如果是进度管理输入0，如果是项目单元查询则输入空）,
     'elementCode': elementCode,//"项目单元编号" (模糊查询)
     'startDate': startDate,//"开始日期"(对应  requireDate :"申请日期")
     'endDate': endDate,//"结束日期"(对应   requireDate :"申请日期")
     'checkResult': checkResult,//" 单据状态"
          //项目单元后端字段解释(括号中代表客户端对应字段)
          //0新增(新增) 
          //1审批通过(已审批)) 
          //2驳回(退回) 
          //3解约 
          //4审批中(待审批) 
          //10待审批(待审批)
     };
     return this.httpService.get('phoneProjectElement.do', param).map((res: Response) => res.json());
  }

  //项目单元详细-----basic_project_element  项目单元表
  getProjectElementDetailItem(elementCode:string):Observable<(object)>{
    console.log('项目单元详细'+this.globalData.sessionId);
    let param = {
        'action': "queryPhoneBasicProjectElement",
        'sessionid': this.globalData.sessionId,
        'elementCode': elementCode,//项目单元编号
    };
    return this.httpService.get('phoneProjectElement.do', param).map((res:Response) => res.json());
  }

  //项目单元修改（施工进度保存）-----basic_project_element  项目单元表
  saveProjectElement(data: string):Observable<(object)>{
    console.log('项目单元修改（施工进度保存）'+this.globalData.sessionId);
    /*let param = {
        'action': "savePhoneBasicProjectElement",
        'sessionid': this.globalData.sessionId,
        data：[{
            projectCode:"所属项目计划编码"
            projectName:"所属项目计划名称"
            projectProgress:"项目进展概述"
            elementCode:"项目单元编码"
            elementName:"项目单元名称"
            elementType:"项目单元类别"
            sgsx:"施工属性""
            planMoney:"初始计划金额",传double型
            planMoneyCurrent:"当前计划金额",传double型
            payMoney:"已付款金额",传double型
            completionProgress:"完工百分比"
            designFinishTime:"设计完成时间"
            drawingFinishTime:"施工图完成时间"
            planBeginTime:"计划开工时间"
            planEndTime:"计划完工时间"
            realBeginTime:"实际开工时间"
            realEndTime:"实际完工时间"
            realFinishTime:"竣工验收时间"
            certainDate:"预达转资时间"
            auditReportTime:"审计报告日期"
            requireUser:"操作人"
            requireDate:"操作日期"
            checkOpinion:"复核意见"
      }]
    };*/
    let formData: FormData = new FormData(); 
    formData.append('action', 'savePhoneBasicProjectElement');
    formData.append('sessionid', this.globalData.sessionId);
    formData.append('data', data);
    console.log('data:' + data);
    return this.httpService.postMultiFormData('phoneProjectElement.do', formData).map((res:Response) => res.json());
  }
}
