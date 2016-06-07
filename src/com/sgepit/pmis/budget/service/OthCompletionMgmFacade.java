package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.OtherCompletionSub;

/**
 * @BdgMoneyMgmFacade 合同金额概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface OthCompletionMgmFacade {
	public void deleteOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException;
	
	public void insertOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException;
	
	public void updateOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException;
	
	public List<ColumnTreeNode> getOtherTree(String parentId, String id) throws BusinessException ;
	
	public List<ColumnTreeNode> otherCompTree(String parentId, String id) throws BusinessException ;
	/**
	 * zhugx 保存选择的子树(其他费用投资完成)
	 * @param conid
	 * @param ids
	 */
	public void saveOtherCompTree(String id, String[] ids);
	/**
	 * zhugx 保存对 概算金额编辑(右键编辑)数据
	 * @param bdgId6
	 * @return
	 */
	public int addOrUpdateBdgMoneyApp(OtherCompletionSub oc);
	/**
	 * @author zhugx 删除合同金额概算树 
	 * @param bdgId
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	public int deleteChildNodeBdgMoneyApp(String appid) throws SQLException, BusinessException;
	
	/**
	 * @author zhugx  合同金额概算金额统计(编辑时)
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgMoneyApp(String parentId, String id) throws SQLException, BusinessException;
	
	/**
	 * @author zhugx  合同金额概算金额统计(删除时)
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgMoneyAppForDelete(OtherCompletionSub bma) throws SQLException, BusinessException;
	/**
	 * 对累计金额的计算
	 */
	public void sumMonthMoney(String id);
	
}

