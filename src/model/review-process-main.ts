import {ReviewProcessDetail} from './review-process-detail';


export class ReviewProcessMain{
	reviewType:string;//审批类型"              
    billNumber:string;//单号"                  
    number:number;//审批岗位表流水号 int
    sequence:number;//审批序号 int 
    dutyId:string;//岗位编号"			            
    dutyName:string;//岗位名称"                
    dutySpecial:string;//特殊处理”              
    current:number;//是否当前审批岗位 int        
    userId:string;//审批人编号”			(用于确认返回时传选中用户id)   (返回时传参选中用户id字符串具体以@分隔)	
                  //(userId = userId +personList[j].value+'@') 最后一个不用加@
    userName:string;//审批人名称”               
    result:number;//审批结果int                   
    date:string;//审批日期”                     
    option:string;//审批意见”                   
    vetoType:number;//打回类型int                 
    sendDate:string;//送审时间"                
    designPosition:string;//打印位置"          
    departCode:string;//所属单位"              
    reviewPersons:string;//可审人"  
    reveiwPersonlist:ReviewProcessDetail[]//审批人信息列表
}