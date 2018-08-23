export class ProjectQueryDetail {
	projectCode: string;//项目编号 "00000001" 
	sequence: number;//序号 0
	projectName: string;//项目名称 "测试项目计划1"
	entityCode: string;//所属资产组 " "
	projectProperty: string;//项目性质 "01"
	planType: string;//计划类别 " "
	planTypeName: string;//计划类别名称 " "
	fileId: string;//批文文号 " 报审序号:2013-358"
	reviewDate: string;//评审通过日期 " "
	totalInvest: number;//总投资 2000000
	totalInvestCurrent: number;//当前总投资 2000000
	selfInvest: number;//我方投资 2000000
	selfInvestCurrent: number;//当前我方投资 2000000
	operateType: number;//操作类型;  (1：正常;2：调整) 1
	requireDate: string;//录入日期 "2017-01-31"
	requireUser: string;//录入人 "李永恒"
	checkDate: string;//复核日期 "2017-12-22"
	checkUser: string;//复核人姓名 "李永恒"
	checkResult: number;//复核结果 1
	checkOpinion: string;//审批意见 " tongguo2"
	reviewStatus: number;//单据状态 0
	planTotal: number;//已下达计划金额 0
	payMoney: number;//已付款金额 0
	costMoney: number;//已确认成本金额 0
	feasibilityStudyGasoline: number;//可研汽油销量 0
	feasibilityStudyDiesel: number;//可研柴油销量 0
	internalYield: string;//内部收益率 "0"
	paybackPeriod: string;//投资回收期 " "
	discountedRentInstallment: number;//分年租金折现 0
	sourceOfFund: string;//资金来源 " "
	dutyCenter: string;//责任中心 " "
	dutyCenterName: string;//中心名称 " "
	assetsStandard: string;//资金渠道 "01"

	entityCodeName: string;//所属资产组 " "
	projectPropertyName: string;//项目性质 "01"
	operateTypeName: string;//操作类型;  (1：正常;2：调整) 1
	checkResultName: string;//复核结果 1
	reviewStatusName: string;//单据状态 0
	sourceOfFundName: string;//资金来源 " "
	assetsStandardName: string;//资金渠道 "01"
}

