package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgMoneyPlanCon;


/**
 * BdgMoneyPlanConMgmFacade 资金计划 合同付款计划-业务逻辑接口
 * @author liuhc10
 *
 */

public interface BdgMoneyPlanConMgmFacade {
	String insertBdgMoneyPlanCon(BdgMoneyPlanCon planCon) throws SQLException,BusinessException;
	String updateBdgMoneyPlanCon(BdgMoneyPlanCon planCon) throws SQLException,BusinessException;
	String deleteBdgMoneyPlanCon(BdgMoneyPlanCon planCon) throws SQLException,BusinessException;
	/**
	 * 合同分类-合同树
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,String paramentId,Map params) throws BusinessException;
	//合同分类树，第一层为合同分类（把合同分类依次取出来利用合同对象作为载体存储），第二层为具体合同列表
	public List<ColumnTreeNode> getConListTree(String parentId) throws BusinessException;
	public double getConPayTotal(String conid);

	
	
}
