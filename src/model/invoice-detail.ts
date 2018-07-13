/**
 * 发票明细信息
 * Created by jiachao on 2017-09-29.
 */
export class InvoiceDetail{

	chalanNumber :string = "";//发票编号

    chalanType:string = ""//发票类型
    chalanTypeName:string = ""//发票类型

	chalanDate:string = "";//开票日期

	chalanMoney:number = 0;//发票金额,传double型  含税金额

	noTaxMoney:number = 0;//不含税金额,传double型

	sl:string = "";//税率

	deductibleInputString:string = "";//可抵扣进项税  税额

    ldje:number = 0;//留抵金额
    uploadFlag:number = 0;//是否已上传扫描件
    uploadFlagName:string = "";//是否已上传扫描件
    remark:string = "";//备注

    sequence:string = "";//序号
	chalanContent:string = "";//发票内容
	chalanContentName:string = "";//发票内容
	price:number = 0;//发票单价,double
	singleAmount:string = "";//发票数量
	taxNumber:string = "";//完税凭证号

}