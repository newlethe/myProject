package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgBreachApp;



/**
 * BdgChangeMgmFacade 合同违约概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgBreachMgmFacade {
	void insertBdgBreach(BdgBreachApp bdgBreach) throws SQLException, BusinessException;
	void updateBdgBreach(BdgBreachApp bdgBreach) throws SQLException, BusinessException;
	void deleteBdgBreach(BdgBreachApp bdgBreach) throws SQLException, BusinessException;
	List<ColumnTreeNode> bgdgBreachTree(String parentId, String conid, String breid) throws BusinessException;
	/**
	 * 合同违约分摊 - 新增、修改节点
	 * @author xiaos
	 * @param bdgInfo
	 * @return
	 */
	public int addOrUpdateBdgBreachApp(BdgBreachApp bdgBreachApp);
	/**
	 * 合同违约分摊 - 删除节点
	 * @author xiaos
	 * @param bdgId
	 * @return
	 */
	public int deleteBreachChildNode(String breappid);
	/**
	 * 合同违约分摊 - 保存在合同金额树上选中的数据节点
	 * @author xiaos
	 * @param conid
	 * @param ids
	 * @throws BusinessExceptionsaveBreachLibraryTree
	 */
	public int saveBreachTree(String conid, String breid, String[] ids) throws BusinessException;
	/**
	 * 合同违约分摊 - 累计（新增、修改时）
	 * author xiaos
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumBreachMoneyHandler(String parentId, String conid, String breid) throws SQLException, BusinessException;
	
	/**
	 * 合同违约分摊 - 累计（删除时）
	 * @author xiaos
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumForBreachDelete(BdgBreachApp bdgBreachApp) throws SQLException, BusinessException;
	/**
	 * 
	 * @param breid 违约ID
	 * @param pid   项目单位ID
	 * @param bdgid 概算项目ID
	 * @param bremoney 违约金额
	 * @return 根据违约中的相关数据计算数据
	 */
	public String checkBdgBreachValid(String breid,String pid,String bdgid,String bremoney);
	/**
	 * 合同违约分摊 - 保存在合同金额概算库树树上选中的数据节点
	 * @author shangtw
	 * @param conid
	 * @param ids
	 * @param breid
	 * @throws BusinessExceptionsave
	 */
	public int saveBreachLibraryTree(String conid, String breid, String[] ids) throws BusinessException;
	/**
	 * shangtw  获得选择后的树(合同违约分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bgdgBreachTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException;	
	
		
}
