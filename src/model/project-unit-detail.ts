export class ProjectUnitDetail{    
              	projectCode: string;//所属项目计划编码"      
              	projectName: string;//所属项目计划名称"      
              	projectProgress: string;//项目进展概述"      
              	elementCode: string;//项目单元编码"          
 				elementName: string;//项目单元名称"          
				elementFlag: string;//项目单元类别"          
 				sgsx: string;//施工属性""                     
				planMoney: number;//初始计划金额" ,传double型 
				planMoneyCurrent: number;//当前计划金额",传double型    
				payMoney: number;//已付款金额",传double型               
              	completionProgress: string;//完工百分比"     
              	designFinishTime: string;//设计完成时间"    
              	drawingFinishTime: string;//施工图完成时间" 
              	planBeginTime: string;//计划开工时间"       
 				planEndTime: string;//计划完工时间"         
 				realBeginTime: string;//实际开工时间"       
 				realEndTime: string;//实际完工时间"         
 				realFinishTime: string;//竣工验收时间"      
 				certainDate: string;//预达转资时间"          
 				auditReportTime: string;//审计报告日期"     
 				requireUser: string;//操作人"                
 				requireDate: string;//操作日期"              
 				checkOpinion: string;//复核意见"          


				elementFlagName: string;//项目单元类别" 
 				sgsxName: string;//施工属性""                      		  
}