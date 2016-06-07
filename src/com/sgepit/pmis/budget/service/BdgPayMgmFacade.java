package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgPayApp;



/**
 * BdgChangeMgmFacade 合同付款概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgPayMgmFacade {
	void insertBdgPay(BdgPayApp bdgPay) throws SQLException, BusinessException;
	void updateBdgPay(BdgPayApp bdgPay) throws SQLException, BusinessException;
	void deleteBdgPay(BdgPayApp bdgPay) throws SQLException, BusinessException;
	List<ColumnTreeNode> bdgPayTree(String parentId, String conid, String payid) throws BusinessException;
	/**
	 * 合同付款分摊 - 新增、修改节点
	 * @author xiaos
	 * @param bdgInfo
	 * @return
	 */
	public int addOrUpdateBdgPayApp(BdgPayApp bdgPayApp);
	/*
	 * payappno:合同付款编号
	 * payappid：合同付款分摊编号
	 * flag 0没有子节点；1有子节点
	 */
	public String checkifhavaChild(String payappno,String parentno);
	/**
	 * 合同付款分摊 - 删除节点
	 * @author xiaos
	 * @param bdgId
	 * @return
	 */
	public int deletePayChildNode(String payappid);
	
	/**
	 * 合同付款分摊 - 保存在合同金额树上选中的数据节点
	 * @author xiaos
	 * @param conid
	 * @param ids
	 * @throws BusinessException
	 * @return flag
	 */
	public int savePayTree(String conid, String payid, String[] ids) throws BusinessException;
	/**
	 * 合同付款分摊 - 累计（删除时）
	 * @author xiaos
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumForPayDelete(BdgPayApp bdgPayApp) throws SQLException, BusinessException;
	/**
	 * 合同付款分摊 - 累计（新增、修改时）
	 * author xiaos
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumPayMoneyHandler(String parentId, String conid, String payid) throws SQLException, BusinessException;
	/**
	 * 
	 * @param payid
	 * @param pid
	 * @param bdgid
	 * @param applyMoney
	 * @param realMoney
	 * @return 根据传入条件判断验证填写数据是否符合要求
	 */
	public String checkAppPay(String payid,String pid,String bdgid,String applyMoney,String realMoney);
	/**
	 * 合同付款分摊 - 保存在合同金额概算库树上选中的数据节点
	 * @author shangtw
	 * @param conid
	 * @param ids
	 * @throws BusinessException
	 * @return flag
	 */
	public int savePayLibraryTree(String conid, String payid, String[] ids) throws BusinessException;
	/**
	 * shangtw  获得选择后的树(合同付款分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgPayTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException;	
	
}
