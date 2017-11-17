/**
 * Created by jiachao on 2017-09-27.
 */
import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {DicComplex} from '../model/dic-complex';
import {DicInDepart} from '../model/dic-in-depart';
import {DicOutDepart} from '../model/dic-out-depart';
import {DicBasicEntity} from '../model/dic-basic-entity';
import {DicAsset} from '../model/dic-asset';
import {PAYMENT_CATEGORY} from '../enums/enums';
import {ASSETS_TYPE} from '../enums/enums';
import {DicBase} from '../model/dic-base';
import {SystemService} from '../services/systemService';
import {ResultBase} from "../model/result-base";
import {IN_DEPART} from "../enums/storage-type";
import {OUT_DEPART} from "../enums/storage-type";
import {BASIC_ENTITY} from "../enums/storage-type";
import {ASSETS} from "../enums/storage-type";
import {PROJECT_ELEMENT} from "../enums/storage-type";
import {CONTRACT_TYPE} from "../enums/storage-type";
import {ADDITIONAL_PERSON} from "../enums/storage-type";
import {IS_DIC_LOAD} from "../providers/Constants";

/**
 * 字典工具类
 * @description
 */
@Injectable()
export class DictUtil {

  constructor(private storage: Storage,private systemService:SystemService,) {
  }

  //数据字典刷新
  dictReflesh() {
    //this.navCtrl.push(WorkMapPage);
    //获取综合字典
    this.systemService.getSystemDict()
    .subscribe(object => {
      let resultBase:ResultBase=object[0] as ResultBase;
      if(resultBase.result=='true'){
        let complexDicts = object[1];
        for(let complexDict of complexDicts){
          //unit:计量单位
          //usedAspect:使用方向
          //applyCode:取得方式
          //usedState:使用状态
          //specialLine:技术部门
          //depositary:存放地点
          //additionalPerson:合同附加人
          //console.log(complexDict.CodeProperty);
          //console.log(complexDict.codeDetail);
          this.storage.set(complexDict.CodeProperty, complexDict.codeDetail);
          this.storage.set(IS_DIC_LOAD,true);
        }
        
      }
    }, () => {
      
    });

    //获取内部单位字典
    this.systemService.getDepartDict()
    .subscribe(object => {
      let resultBase:ResultBase=object[0] as ResultBase;
      if(resultBase.result=='true'){
        let inDepart = object[1] as DicInDepart[];
        this.storage.set(IN_DEPART, inDepart);
      }
    }, () => {
      
    });

    //获取外部单位字典
    this.systemService.getOutDepartDict()
    .subscribe(object => {
      let resultBase:ResultBase=object[0] as ResultBase;
      if(resultBase.result=='true'){
        let outDepart = object[1] as DicOutDepart[];
        this.storage.set(OUT_DEPART, outDepart);
      }
    }, () => {
      
    });

    //获取资产组字典
    this.systemService.getBasicEntityManagerDict()
    .subscribe(object => {
      let resultBase:ResultBase=object[0] as ResultBase;
      if(resultBase.result=='true'){
        let basicEntity = object[1] as DicBasicEntity[];
        this.storage.set(BASIC_ENTITY, basicEntity);
      }
    }, () => {
      
    });

    //获取资产目录字典
    this.systemService.getAssetsDict()
    .subscribe(object => {
      let resultBase:ResultBase=object[0] as ResultBase;
      if(resultBase.result=='true'){
        let aeests = object[1] as DicAsset[];
        this.storage.set(ASSETS, aeests);
      }
    }, () => {
      
    });

    //获取合同类别字典
    this.systemService.getContractTypeDict()
    .subscribe(object => {
      let contractTypeList = object as Array<Object>;
      let tarContractTypeList=new Array<DicBase>();
      if(contractTypeList){
        for(let item of contractTypeList){
          let dicBase=new DicBase();
          dicBase.code=item[0];
          dicBase.name=item[1];
          tarContractTypeList.push(dicBase);
        }
        this.storage.set(CONTRACT_TYPE, tarContractTypeList);
      }
    }, () => {
      
    });

    //获取项目单元字典
    this.systemService.getProjectElementDict()
    .subscribe(object => {

      let projectElementList = object as Array<Object>;
      let tarProjectElementList=new Array<DicBase>();
      if(projectElementList){
        for(let item of projectElementList){
          let dicBase=new DicBase();
          dicBase.code=item[0];
          dicBase.name=item[1];
          tarProjectElementList.push(dicBase);
        }
        this.storage.set(PROJECT_ELEMENT, tarProjectElementList);
      }
    }, () => {
      
    });
  }

  //翻译计量单位
  getUnitName(dictInfo:DicComplex[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
    	for(let unit of dictInfo){
    		if(unit.complexCode==code)
    			return unit.complexName;
    	}
    }
    return code;
  }

  //翻译使用方向
  getUsedAspectName(dictInfo:DicComplex[],code:string):string{
  	if(dictInfo&&dictInfo.length>0){
      for(let usedAspect of dictInfo){
    		if(usedAspect.complexCode==code)
    			return usedAspect.complexName;
    	}
    }
    return code;
  }

  //翻译取得方式
  getApplyCodeName(dictInfo:DicComplex[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
    	for(let applyCode of dictInfo){
    		if(applyCode.complexCode==code)
    			return applyCode.complexName;
    	}
    }
    return code;
  }

  //翻译使用状态
  getUsedStateName(dictInfo:DicComplex[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
    	for(let usedState of dictInfo){
    		if(usedState.complexCode==code)
    			return usedState.complexName;
    	}
    }
    return code;
  }

  //翻译技术部门
  getSpecialLineName(dictInfo:DicComplex[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
    	for(let specialLine of dictInfo){
    		if(specialLine.complexCode==code)
    			return specialLine.complexName;
    	}
    }
    return code;
  }

  //翻译存放地点
  getDepositaryName(dictInfo:DicComplex[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
      for(let depositary of dictInfo){
        if(depositary.complexCode==code)
          return depositary.complexName;
      }
    }
    return code;
  }

  //翻译附加相对人
  getAdditionalPersonName(dictInfo:DicComplex[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
      for(let depositary of dictInfo){
        if(depositary.complexCode==code)
          return depositary.complexName;
      }
    }
    return code;
  }

  //翻译内部单位
  getInDepartName(dictInfo:DicInDepart[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
    	for(let inDepart of dictInfo){
    		if(inDepart.departCode==code)
    			return inDepart.departName;
    	}
    }
    return code;
  }

  //翻译外部单位
  getOutDepartName(dictInfo:DicOutDepart[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
    	for(let outDepart of dictInfo){
    		if(outDepart.departCode==code)
    			return outDepart.departName;
    	}
    }
    return code;
  }

  //翻译资产组
  getBasicEntityName(dictInfo:DicBasicEntity[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
    	for(let basicEntity of dictInfo){
    		if(basicEntity.entityCode==code)
    			return basicEntity.entityName;
    	}
    }
    return code;
  }

  //翻译资产目录
  getAssetsName(dictInfo:DicAsset[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
      for(let basicEntity of dictInfo){
        if(basicEntity.assetsCode==code)
          return basicEntity.assetsName;
      }
    }
    return code;
  }

  //翻译款项类别
  getClauseTypeName(code:string):string{
    for(let clauseType of PAYMENT_CATEGORY){
      if(clauseType.code==code)
        return clauseType.name;
    }
    return code;
  }

  //枚举类翻译
  getEnumsName(list:Array<{code: string, name: string}>,code:string):string{
    if(list){
    for(let enu of list){
      if(enu.code==code)
        return enu.name;
    }
    }
    return code;
  }

  //翻译资产类型
  getAssetsTypeName(code:string):string{
    for(let assetsType of ASSETS_TYPE){
      if(assetsType.code==code)
        return assetsType.name;
    }
    return code;
  }

  //翻译合同类别字典
  getContractTypeName(dictInfo:DicBase[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
      for(let contractType of dictInfo){
        if(contractType.code==code)
          return contractType.name;
      }
    }
    return code;
  }

  //翻译项目单元字典
  getProjectElementName(dictInfo:DicBase[],code:string):string{
    if(dictInfo&&dictInfo.length>0){
      for(let projectElement of dictInfo){
        if(projectElement.code==code)
          return projectElement.name;
      }
    }
    return code;
  }
}
