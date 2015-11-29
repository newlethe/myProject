package com.sgepit.pmis.finalAccounts.bdgStructure.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABdgInfo;

public interface FABdgStructureService {
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	/**
	 * 添加或保存节点
	 * @param node
	 * @return
	 */
	String saveOrUpdateNode(FABdgInfo node, Boolean exchangeData) throws BusinessException;
	void deleteNode(String id, Boolean exchangeData) throws BusinessException;
	/**
	 * 设置竣工
	 * @param bdgid 概算id
	 * @param isFinish 是否竣工
	 */
	void setFinish(String bdgid, Boolean isFinish, Boolean exchangeData) throws BusinessException;
	/**
	 * 保存基座对应的安装工程
	 * @param bdgid 建筑部分（基座）bdgid
	 * @param correspondBdgid
	 */
	void saveCoBdgid(String bdgid, String correspondBdgid) throws BusinessException;

	
	/**
	 * 初始化[竣工工程决算一览表(竣建02)表]，不进行数据交互
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 */
	public void initFAOverallReport( Boolean force, String pid );
	
	/**
	 * 初始化[竣工工程决算一览表(竣建02)表]
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @param exchangeData 是否进行数据交换。如果该参数为True，会在初始化的同时将数据发送到集团
	 */
	public void initFAOverallReport(Boolean force, String pid, Boolean exchangeData);
	
	/**
	 * 初始化竣工决算一览表(建筑部分)（竣建02-1表）
	 * @param force 是否强制初始化。若为假则当表中已存在数据时不会初始化。
	 * 若为真，则会重新初始化覆盖表中已有数据
	 */
	void initFABuildOveReport(Boolean force, String pid);
	void initFABuildOveReport(Boolean force, String pid, Boolean exchangeData);
	
	/**
	 * 初始化竣工决算一览表(安装和设备)（竣建02-2表）
	 * @param force 是否强制初始化。若为假则当表中已存在数据时不会初始化。
	 * 若为真，则会重新初始化覆盖表中已有数据
	 */
	void initFAInstallEquReport(Boolean force, String pid);
	void initFAInstallEquReport(Boolean force, String pid, Boolean exchangeData);
	
	/**
	 * 初始化预计未完工程明细表（竣建02附表）
	 * @param force 是否强制初始化。若为假则当表中已存在数据时不会初始化。
	 * 若为真，则会重新初始化覆盖表中已有数据
	 */
	void initFAUnfinishedPrjReport(Boolean force, String pid);
	void initFAUnfinishedPrjReport(Boolean force, String pid, Boolean exchangeData);
	
	/**
	 * 将对应的系统该算项目父节点与系统该算父节点逐层向上关联
	 * @param faBdgInfo 竣建概算项目
	 */
	void setCoSysBdgUpToRoot(FABdgInfo faBdgInfo, Boolean exchangeData);
	
	void exchangeFaBdgInfo(FABdgInfo bdgInfo);
	
	/**
	 * 根据pid对竣工决算结构全部进行数据交换
	 * @param pid
	 * @author zhangh 2012-05-22
	 */
	public void exchangeAllFaBdgInfoByPid(String pid);
}
