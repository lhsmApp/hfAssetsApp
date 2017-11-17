/**
 * 合同资产明细信息（当资产明细为：合同入口并审批状态为新增、待审批、退回状态时获取的明细信息字段比正常的明细信息字段要少很多）
 * Created by jiachao on 2017-10-10.
 */
export class ContractAssetDetail {
    xh: string;//序号"
    assetsType: string;//资产类型"
    
	realCode: string;//实物编码"
    assetsCode: string;//资产编码"
    assetsName: string;//资产名称"
    amount: number;//数量"
    price:number;//单价
    money:number;//金额

    departCode: string;//所属单位"
    assetsStandard: string;//规格型号"
    unitCode: string;//计量单位"
    contractCode: string;//合同编号"
    keyCode: string;//资产键码

    assetsTypeName: string;//资产类型"
    departCodeName: string;//所属单位"
    unitCodeName: string;//计量单位"
}