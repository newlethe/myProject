package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan;



/**
 * @BdgMoneyMgmFacade 合同金额概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgMoneyMgmFacade {
	void insertBdgMoney(BdgMoneyApp bdgMoney) throws SQLException, BusinessException;
	void updateBdgMoney(BdgMoneyApp bdgMoney) throws SQLException, BusinessException;
	void deleteBdgMoney(BdgMoneyApp bdgMoney) throws SQLException, BusinessException;
	List<ColumnTreeNode> getBudgetTree(String parentId, String pid,String contId) throws BusinessException;
	List<ColumnTreeNode> bdgMoneyTree(String parentId,String conId) throws BusinessException ; 
	List<ColumnTreeNode> getBdgMoneyTree(String parentId, String contId,String type,String typeId) throws BusinessException ;
	int addOrUpdateBdgMoneyApp(BdgMoneyApp bdgMoneyApp);
	
	/**
	 * 判断页面的父节点是否有子节点；flag:0 则没有子节点；flag：1 则有子节点
	 * 因为合同分摊的时候有时候是直接分摊到父节点上的
	 */
	public String checkifhaveChild(String conid,String parentno);
	/**
	 * @author zhugx 删除合同金额概算树 
	 * @param bdgId
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	public int deleteChildNodeBdgMoneyApp(String appid) throws SQLException, BusinessException;
	public boolean isMonneyApp(String conid);
	/**
	 * 判断被删除的合同分摊的项目是否存在付款分摊和变更分摊
	 */
	public boolean isPayorChangeApp(String bdgid,String conid);
	/**
	 * zhugx 保存选择的子树(概算金额分摊)
	 * @param conid
	 * @param ids
	 */
	public void saveGetBudgetTree(String conid, String[] ids);
	/**
	 * @author zhugx  合同金额概算金额统计
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgMoneyApp(String parentId, String conid) throws SQLException, BusinessException;
	
		

	public String addOrUpdateBdgMonthMoneyPlan(BdgMonthMoneyPlan cjspb);
	/**
	 * 
	 * @param conId 合同编号
	 * @param appmoney 合同分摊值
	 * @param pid   合同对应的工程项目pID
	 * @param bdgId 概算对应的概算项目ID
	 * @return   根据返回的状态进行页面提醒
	 */	
    public String checkBdgMonAppValueByConId(String conId,String appmoney,String pid,String bdgId);
    /**
     * 
     * @param conid合同编号
     * @param bdgid概算编号
     * @param pid 项目ID
     * @return  更具传入条件进行处理后计算出合同是否可以修改
     */
    public String checkBdgMonAppNotModify(String conid,String bdgid,String pid);
    /**
     * 
     * @param conid合同编号
     * @param parentId概算父节点ID
     * @param changeId 变更ID
     * @return  返回变更选择分摊树
     */
    List<ColumnTreeNode> getBdgMoneyChangeTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException ;
    /**
     * 
     * @param conid合同编号
     * @param parentId概算父节点ID
     * @param pid 项目编号
     * @return  选择其他概算结构树组成变更分摊树
     */
    List<ColumnTreeNode> getBudgetOtherChangeTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException;
    /**
     * 
     * @param conid合同编号
     * @param parentId概算父节点ID
     * @param type 类型
     * @param typeId 类型编号
     * @return  返回付款，索赔，违约选择分摊树
     */
    List<ColumnTreeNode> getBdgMoneyPayBreClaTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException ;
    /**
     * 
     * @param conid合同编号
     * @param bdgid概算节点ID
     */
    public int deleteChildNodeBdgVMoneyApp(String conid,String bdgid) throws SQLException, BusinessException;
	/**
	 * 合同工程量分摊树
	 */
	public List<ColumnTreeNode> bdgMoneyProjectTree(String parentId, String conId) throws BusinessException;   	
	/**
	 * 合同金额分摊树
	 */
	public List<ColumnTreeNode> bdgMoneyNewTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException;
	/*
	 * 合同金额分摊时获得概算树（被选择的树）treeGrid
	 */
	public List<ColumnTreeNode> getBudgetNewTree(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException;	
	/**
	 * shangtw 得到MoneyAPP
	 * @param bdgMoneyApp
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getBdgMoneyAppNew(BdgMoneyApp bdgMoneyApp)throws BusinessException;	
}
