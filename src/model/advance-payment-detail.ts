/**
 * 付款明细信息
 * Created by jiachao on 2017-09-29.
 */
export class AdvancePaymentDetail{
	payCode :string;//付款单号
	clauseType:string;//款项类别
	clauseTypeName:string;//款项类别名称
	contractCode:string;//合同流水号
	contractName:string;//合同名称
	elementType:string;//项目性质
	elementName:string;//项目单元名称
	planType:string;//项目核算类别
	planTypeName:string;//项目核算类别
	payDigest:string;//付款原因
	costMoney:number;//合同标的（审计）额,传double型
	taxMoney:number;//已付款额度,传double型
	payMoney:number;//本次申请金额,传double型
	paymentCode:string;//付款单位编号
	payDepart:string;//付款单位名称
	intercourseName:string;//往来单位编号(收款单位)
	intercourseCode:string;//往来单位名称(收款单位)
	requireDate:string;//申请时间
	requireUser:string;//申请人

	reviewStatus:string;//单据状态
}