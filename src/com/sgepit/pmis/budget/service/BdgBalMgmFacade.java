package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.List;


import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgBalApp;

/**
 * BdgChangeMgmFacade 合同付款概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgBalMgmFacade {
	void insertBdgBal(BdgBalApp bdgBal) throws SQLException, BusinessException;
	void updateBdgBal(BdgBalApp bdgBal) throws SQLException, BusinessException;
	void deleteBdgBal(BdgBalApp bdgBal) throws SQLException, BusinessException;
	/**
	 * 合同结算分摊 - 新增、修改节点
	 * @author xiaos
	 * @param bdgInfo
	 * @return
	 */
	public int addOrUpdateBdgBalApp(BdgBalApp bdgBalApp);
	/**
	 * 获得结算概算 - 树
	 * @author xiaos
	 * @param parentId
	 * @return json
	 * @throws BusinessException
	 */
	public String bdgBalTreeStr(String parentId, String conid, String balid)throws BusinessException;
	
	public List<ColumnTreeNode> bdgBalTree(String parentId, String contId, String balId) throws BusinessException;
	public int deleteBalChildNode(String balappid);
	/**
	 * 合同结算分摊 - 保存在合同金额树上选中的数据节点
	 * @author xiaos
	 * @param conid
	 * @param ids
	 * @throws BusinessException
	 * @return flag
	 */
	public int saveBalTree(String conid, String balid, String[] ids) throws BusinessException;
	public void sumBalHandler(String parentId, String conid, String balid) throws SQLException, BusinessException;
	/**
	 * 合同付款分摊 - 累计（删除时）
	 * @author xiaos
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumForBalDelete(BdgBalApp bdgBalApp) throws SQLException, BusinessException;
	

	
	
	
}
