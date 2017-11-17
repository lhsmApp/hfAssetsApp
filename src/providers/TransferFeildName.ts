

//验收的转界面类型
export const TypeView = 'TypeView';
export const TypeView_AcceptApply = 'ys';
export const TypeView_TransferFunds = 'zz';
export const TypeView_Contract = 'ht';

export const Oper = 'Oper';
export const Oper_Look = '查看';
export const Oper_Add = '添加';
export const Oper_Edit = '编辑';
export const Oper_Approval = '审批';

//标题
export const Title = 'Title';
//验收申请单号、转资单号、转资调整单号
export const BillNumberCode = 'BillNumberCode';
//合同号
export const BillContractCode = 'BillContractCode';
//查询的审批状态
export const BillAddTime = 'AddTime';
//资产键码
export const BillKeyCode = 'BillKeyCode';
//
export const ItemTranfer = 'ItemTranfer';
//项目单元编码
export const BillElementCode = 'BillElementCode';
//送审类型
export const BillReviewType = 'reviewType';
//查询的审批状态
export const BillApprovalState = 'approvalState';
//合同调用必传
export const BillCheckResult = 'BillCheckResult';
//转资类型
export const BillTranslateType = 'BillTranslateType';

//页面
//验收申请：查看、审批 BillNumberCode title oper:Oper_Look、Oper_Add、Oper_Edit、Oper_Approval BillApprovalState
export const Page_AcceptApplyInfoPage = 'AcceptApplyInfoPage';
//验收申请：添加、编辑、送审 BillNumberCode oper:Oper_Add、Oper_Edit
export const Page_AcceptApplyItemPage = 'AcceptApplyItemPage';

//合同选择
export const Page_ContractChoiceListPage = 'ContractChoiceListPage';
//合同选择确认 BillContractCode
export const Page_ContractChoiceConfirmPage = 'ContractChoiceConfirmPage';

//资产列表查看：BillNumberCode BillContractCode BillElementCode 
//              TypeView:TypeView_AcceptApply、TypeView_TransferFunds、TypeView_Contract
//              BillCheckResult(合同调用必传) BillTranslateType转资类型
export const Page_AssetDetailsListInfoPage = 'AssetDetailsListInfoPage';
//资产列表操作： BillNumberCode BillContractCode TypeView:TypeView_AcceptApply
export const Page_AssetDetailsListPage = 'AssetDetailsListPage';
//资产详情查看： BillNumberCode BillContractCode BillElementCode BillKeyCode 
//              TypeView:TypeView_AcceptApply、TypeView_TransferFunds、TypeView_Contract
//              BillCheckResult(合同调用必传) BillTranslateType转资类型
export const Page_AssetDetailsInfoPage = 'AssetDetailsInfoPage';
//资产详情添加： BillNumberCode BillContractCode TypeView
//export const Page_AssetDetailsAddPage = 'AssetDetailsAddPage';
//资产详情编辑： BillNumberCode BillContractCode BillKeyCode Oper:Oper_Add、Oper_Edit TypeView ItemTranfer//从添加界面传入
export const Page_AssetDetailsItemPage = 'AssetDetailsItemPage';

//项目单元详情查看： BillElementCode Oper:Oper_Look
export const Page_ProjInfoPage = 'ProjInfoPage';

//转资审批：Oper,Oper_Look、Oper_Approval Title BillNumberCode TypeView:TypeView_TransferFunds BillApprovalState
export const Page_TransferFundsInfoPage = 'TransferFundsInfoPage';

//公告 ItemTranfer Oper:Oper_Look
export const Page_NoticeInfoPage = 'NoticeInfoPage';

//进度管理详情 BillElementCode oper:Oper_Add、Oper_Edit、Oper_Look、Oper_Approval Title
export const Page_ScheduleApplyInfoPage = 'ScheduleApplyInfoPage';
//进度管理申请 BillElementCode oper:Oper_Add、Oper_Edit
export const Page_ScheduleApplyItemPage = 'ScheduleApplyItemPage';

//转资调整审批 ItemTranfer oper:Oper_Approval Title
export const Page_TransferAdjustApprovalInfoPage = 'TransferAdjustApprovalInfoPage';
//转资调整审批 oper:Oper_Approval Title ItemTranfer
export const Page_TransferAdjustAssetListPage = 'TransferAdjustAssetListPage';
//转资调整审批 BillNumberCode BillKeyCode oper:Oper_Approval Title
export const Page_TransferAdjustAssetInfoPage = 'TransferAdjustAssetInfoPage';

//选择审批人 BillNumberCode BillReviewType
export const Page_ChoiceApproversPage = 'ChoiceApproversPage';