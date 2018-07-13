/**
 * 付款明细信息
 * Created by jiachao on 2017-09-29.
 */
export class AdvancePaymentDetail{
	payCode :string = "";//付款单号
	//变成 付款类型
	clauseType:string = "";//款项类别
	clauseTypeName:string = "";//款项类别名称
	//隐藏，变成 contractCodeHf 合同编号
	contractCode:string = "";//合同流水号
	contractName:string = "";//合同名称
	//变成 概算项目
	elementType:string = "";//项目性质
	elementName:string = "";//项目单元名称
	planType:string = "";//项目核算类别
	planTypeName:string = "";//项目核算类别
	payDigest:string = "";//付款原因
	costMoney:number = 0;//合同标的（审计）额,传double型
	//变成:累计已付款额度
	taxMoney:number = 0;//已付款额度,传double型
	//隐藏，用新增加的 paySpMoney：申请付款金额double型
	payMoney:number = 0;//本次申请金额,传double型
	paymentCode:string = "";//付款单位编号
	payDepart:string = "";//付款单位名称
	intercourseName:string = "";//往来单位编号(收款单位)
	intercourseCode:string = "";//往来单位名称(收款单位)
	requireDate:string = "";//申请时间
	requireUser:string = "";//申请人
	requireDepart:string = "";//
	
	//合同税额
	bl:number = 0;//付款比例 double型
	sendStatus:number = 0;//发票状态” int型  0默认，1送审，2，退回，3审批完成）
	sendStatusName:string = "";//发票状态” int型  0默认，1送审，2，退回，3审批完成）
	fpDate:string = "";//日期-发票审核
	fpUser:string = "";//人-发票审核

	reviewStatus:number = 0;//单据状态
	acceptanceCode:string = "";//验收单号

	company:string = "";//企业名称 
	openBank:string = "";//开户行  
	bankNum:string = "";//银行账号


	contractCodeHf:string = "";//合同编号
	//reviewStatus:string = "";//审批状态（单据状态）
	reviewStatusName:string = "";//审批状态（单据状态）
	fkzt:string = "";//付款状态（01未生成，02已生成）综合编码fkzt
	fkztName:string = "";//付款状态（01未生成，02已生成）综合编码fkzt
	pzzt:string = "";//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
    pzztName:string = "";//凭证状态（01未生成、02已生成、03已提交、04已审核、05已退回）综合编码pzzt
	currKpNo:number = 0;//当期已开票金额（不含税）double型
	seAdd:number = 0;//当期税额double型
	ldjeAdd:number = 0;//当期留抵金额double型
	ykKpNo:number = 0;//合同已开票金额（不含税）double型
	fzDept:string = "";//负责部门 合同带过来的 保存名称
	//fzDeptName:string = "";//负责部门 合同带过来的
	jlDept:string = "";//监理部门 综合编码jldw
	jlDeptName:string = "";//监理部门 综合编码jldw
	elePlanMoney:number = 0;//概算金额（单元计划金额）double型
	tzPlanMoney:number = 0;//累计完成投资额double型
	zs:number = 0;//附件张数
	ctJsMoney:number = 0;//结算金额double型
	ctYfMoney:number = 0;//合同预付款double型
	ctYfBl:number = 0;//合同预付款比例double型
	fkYfMoney:number = 0;//已付款比例(%)double型
	fkCcBl:number = 0;//此次付款后比例(%)double型
	paySpMoney:number = 0;//申请付款金额double型
	payUpdataMoney:number = 0;//审批付款金额(可修改)} double型

	//" 支付方式",(01,银付，02转账) 保存编码01,或02
	payType:string = "";//
	payTypeName:string = "";//

}