/**
 * 合同明细信息
 * Created by jiachao on 2017-10-10.
 */
export class ContractDetail{
	sequence:string;//序号
	elementCode:string;//项目单元编码
	elementName:string;//项目单元名称
	contractCode:string;//合同流水号
	contractName:string;//合同名称
	compactType:string;//合同类别
	relativePerson:string;//合同相对人
	additionalPerson:string;//附加相对人
	ownDepart :string;//甲方签约单位
	contractMoney:number;//合同标的额,传double型
	costProperty :string;//成本属性
	contractDate:string;//签约日期
	uploadFlag:boolean;//是否上传附件
	requireUser:string;//申请人
	requireDate :string;//申请时间
	checkResult :string;//单据状态
	checkOpinion:string;//审批意见


	compactTypeName:string;//合同类别
	relativePersonName:string;//合同相对人 外部单位字典
	additionalPersonName:string;//附加相对人 综合编码字典
	ownDepartName :string;//甲方签约单位 组织机构字典
	costPropertyName :string;//成本属性
	
}