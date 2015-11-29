package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgMoneyPlanSub;



/**
 * 工程量投资计划管理功能从表  -业务逻辑接口
 * @author liuhc10
 *
 */
public interface BdgMoneyPlanSubMgmFacade {
	String insertPlanSub(BdgMoneyPlanSub bdgMoney) throws SQLException,BusinessException;
	String updatePlanSub(BdgMoneyPlanSub bdgMoney) throws SQLException,BusinessException;
	String deletePlanSub(BdgMoneyPlanSub bdgMoney) throws SQLException,BusinessException;
	//user methods
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,String parentId,Map params)throws BusinessException;
	//检查主记录下面是否存在子树，存在则返回1，不存在则返回0
	public String checkMaintoSub(String mainid);
	//删除投资计划树的子节点
	public String deleteChildNodePlanSub(String id)throws BusinessException, SQLException;
	//根据概算编号得到该概算分摊下的合同编号集合
	public String getBdgAppConids(String bdgid);
	//根据概算编号得到该概算分摊下的合同名称集合
	public String getBdgAppConnames(String conids);
	//投资计划选择的概算树
	public List<ColumnTreeNode> getBudgetTree(String parentId,String mainId) throws BusinessException;
	//工程量投资计划树
	public List<ColumnTreeNode> planSubTree(String parentId,String mainId)throws BusinessException;
	//保存选择的子树 工程量投资计划
	public void savePlanSubTree(String mainId,String[] ids);
	//工程计划量投资金额统计，根据底层节点更新父节点的投资金额
	public void sumplanMoney(String parentid,String mainid) throws SQLException,BusinessException;
	//保存对投资计划树金额的数据 右键点编辑时
	public String updatePlanSubtree(BdgMoneyPlanSub bdgMoneyPlanSub);
	
	
}
