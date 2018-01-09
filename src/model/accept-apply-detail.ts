export class AcceptApplyDetail {

    billNumber: string;//验收单编码
    reviewStatus: string;//验收单状态
    requireDate: string;//申请时间
    requireUser: string;//申请人
    contractCode :string;//合同流水号
    contractName:string;//合同名称
    elementCode :string;//项目单元编码
    elementName :string;//项目单元名称
    departCode:string;//申请单位
    costProperty:string;//”成本属性”（1.直接成本2.间接费用）
    clauseType:string;//”验收类型（3.质保验收，4，竣工验收）”

    departName:string;//申请单位
    costPropertyName:string;//”成本属性”（1.直接成本2.间接费用）
    clauseTypeName:string;//”验收类型（3.质保验收，4，竣工验收）”
}