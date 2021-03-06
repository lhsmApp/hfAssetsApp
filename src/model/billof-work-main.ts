/**
 * 工程量清单主信息
 * Created by jiachao on 2017-09-29.
 */
export class BillOfWorkMain{

	payCode :string;//付款单号
	acceptanceCode :string;//验收单号
	
	sequence:string;//序号
	
	listNumber:string;//清单项目编号

	listName :string;//清单项目名称

	projectLoad:string;//工程量

	moneyTotal :number;//合价

	checked:boolean;//是否选中

	gclType:string;//工程量类型 1、本次 2、历史 3、未完成

	disabled:boolean;
}