package com.sgepit.pmis.finalAccounts.prjGeneralInfo.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInfoOve;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjParams;

public interface FAPrjInfoOveService {
	
	/**
	 * 获取工程项目概况对象
	 * @return 工程概况对象，若没有记录返回null
	 */
	FAPrjInfoOve getPrjInfoOve(String pid);
	
	/**
	 * 保存工程项目概况对象
	 * @param prjInfoOve
	 */
	void saveOrUpdate(FAPrjInfoOve prjInfoOve);
	
	/**
	 * 通用更新bean方法，根据传入实体的类型保存到相应的table
	 * @param objects bean数组
	 * @throws BusinessException
	 */
	void saveOrUpdate(Object[] objects) throws BusinessException;
	
	/**
	 * 通用删除方法
	 * @param objects bean数组
	 * @throws BusinessException
	 */
	void delete(Object[] objects) throws BusinessException;
	
	/**
	 * 取得分类下的参数列表
	 * @param typeId 参数类型id
	 * @return 参数列表
	 */
	List<FAPrjParams> getPrjParamsByType( String typeId, String pid );

}
