/**
 * 款项类别
 * Created by jiachao on 2017-10-16.
 */
export const PAYMENT_CATEGORY= [{code:'1',name:'预付款'}, {code:'2',name:'进度款'},  {code:'4',name:'竣工款'},{code:'3',name:'质保金'}];

//发票类型
export const INVOICE_TYPE= [{code:'1',name:'普通发票'}, {code:'2',name:'增值税专用发票'}];

//验收申请单据状态
export const AcceptReviewStatus= [{code: '0', name: '新增'}, {code: '99', name: '待审批'}, {code: '1', name: '已审批'}, {code: '2', name: '退回'}]

//转资单据状态
export const TransferFundsReviewStatus= [{code: '0', name: '新增'}, {code: '1', name: '未审批'}, {code: '2', name: '退回'}, {code: '3', name: '审批中'}, {code: '4', name: '已审批'}]

//是否已分摊费用 0否 1是
export const FeeFlag= [{code: '0', name: '否'}, {code: '1', name: '是'}]

//施工属性 施工类/非施工类
export const Sgsx= [{code: '0', name: '施工类'}, {code: '1', name: '非施工类'}]

//转资类型：1、固定资产 2、无形资产3、长期待摊费用4、长期股权投资
export const TransferFundsType= [{code: '1', name: '固定资产'}, {code: '2', name: '无形资产'}, {code: '3', name: '长期待摊费用'}, {code: '4', name: '长期股权投资'}]

//合同成本属性 直接成本/间接费用
export const ContractCostProperty= [{code:'1',name:'直接成本'}, {code:'2',name:'间接费用'}];

//资产类型：1、实物资产 2、无形资产3、长期待摊费用4、长期股权投资5、固定资产
export const ASSETS_TYPE= [{code: '1', name: '实物资产'}, {code: '2', name: '无形资产'}, {code: '3', name: '长期待摊费用'}, {code: '4', name: '长期股权投资'},{code: '5', name: '固定资产'}]