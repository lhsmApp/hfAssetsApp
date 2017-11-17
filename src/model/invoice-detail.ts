/**
 * 发票明细信息
 * Created by jiachao on 2017-09-29.
 */
export class InvoiceDetail{

    sequence:string;//序号

    chalanType:string//发票类型

	chalanNumber :string;//发票编号
	
	chalanContent:string;//发票内容

	price:number;//发票单价,double

	singleAmount:number;//发票数量

	sl:string;//税率

	chalanMoney:number;//发票金额,传double型

	noTaxMoney:number;//不含税金额,传double型

	deductibleInputString:string;//可抵扣进项税

	chalanDate:string;//发票日期

	taxNumber:string;//完税凭证号
}