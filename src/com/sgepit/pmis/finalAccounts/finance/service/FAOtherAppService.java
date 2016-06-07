package com.sgepit.pmis.finalAccounts.finance.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.finalAccounts.finance.hbm.FAOutcomeAppReport;

public interface FAOtherAppService {

	/**
	 * 初始化分摊金额（一次分摊）
	 */
	void initAllOutcomeApp(String pid);
	/**
	 * 保存分摊项
	 * @param outcomeApp
	 */
	void saveOutcomeApp(FAOutcomeAppReport outcomeApp);

	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId,
			Map params) throws BusinessException;
	
	void initFAOtherDetailReport(Boolean force, String pid);
	void initFAOtherDetailReport(Boolean force, String pid, Boolean exchangeData);
	
	void initFAOutcomeAppReport(Boolean force, String pid);
	
	/**
	 * 自动将竣建03附表一条记录的待摊支出按比例摊入共益费中
	 * @param outcomeApp
	 */
	void autoCalcPubExpense(FAOutcomeAppReport outcomeApp);

	/**
	 * 根据pid对竣工决算结构全部进行数据交换
	 * @param pid
	 * @author zhangh 2012-05-22
	 */
	public void exchangeAllFaBdgInfoByPid(String pid);
}
