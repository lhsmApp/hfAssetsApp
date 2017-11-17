/**
 * 工程量清单明细信息
 * Created by jiachao on 2017-09-29.
 */
export class BillOfWorkDetail{

	payCode :string;//付款单号
	
	sequence:string;//序号
	
	listNumber:string;//清单项目编号

	listName :string;//清单项目名称

	unitCode :string;//计量单位

	unitCodeName:string;//计量单位

	projectLoad:string;//工程量

	complexPrice:number;//综合单价,传double型

	moneyTotal:number;//合价,传double型

	fees:number;//其中规费,传double型

	contractCode:string;//合同流水号
}