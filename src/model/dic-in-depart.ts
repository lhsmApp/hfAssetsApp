/**
 * 内部单位字典
 * Created by jiachao on 2017-10-19.
 */
export class DicInDepart{

	departCode :string;//单位编码
	
	parentCode:string;//父编码

	departName:string;//单位名称

	shortName:string;//单位简称

	markHolding:string;//单位性质，是否为控股公司

	departLevel:number;//单位级别int

	markTail:number;//是否明细(0:否,1:是)	int

	dutyCenterName:string;//责任中心名称

	costCenterName:string;//成本中心名称
}