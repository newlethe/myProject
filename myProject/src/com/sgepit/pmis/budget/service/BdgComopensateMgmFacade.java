package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgBreachApp;
import com.sgepit.pmis.budget.hbm.BdgClaApp;



/**
 * BdgChangeMgmFacade 合同索赔概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgComopensateMgmFacade {
	void insertBdgCompensate(BdgClaApp bdgCompensate) throws SQLException, BusinessException;
	void updateBdgCompensate(BdgClaApp bdgCompensate) throws SQLException, BusinessException;
	void deleteBdgCompensate(BdgClaApp bdgCompensate) throws SQLException, BusinessException;
	List<ColumnTreeNode> bdgCompensateTree(String parentId, String conid,String claid) throws BusinessException;
	/**
	 * zhugx 保存对合同索赔概算编辑(右键编辑)数据
	 * @param bdgId6
	 * @return
	 */
	public int addOrUpdateBdgCompensate(BdgClaApp bca);
	/**
	 * @author zhugx 删除合同索赔概算树 
	 * @param bdgId
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	public int deleteBdgCompensate(String claappid) throws SQLException, BusinessException;
	/**
	 * zhugx 保存选择的子树(合同索赔分摊)
	 * @param conid
	 * @param ids
	 */
	public int  saveBdgcompensateTree(String conid, String claid,String[] ids);
	/**
	 * @author zhugx  合同索赔概算金额统计(编辑时)
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgCompensate(String parentId, String conid,String claid) throws SQLException, BusinessException;
	/**
	 * @author zhugx  合同索赔概算金额统计(删除时)
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgCompensateForDelete(BdgClaApp bca) throws SQLException, BusinessException;
	/**
	 * 
	 * @param conpenid 索赔ID
	 * @param pid   项目ID
	 * @param bdgid 
	 * @param compenMoney  索赔金额
	 * @return  根据索赔条件进行索赔分摊数据验证
	 */
	public String validateCompensate(String conpenid,String pid,String bdgid,String compenMoney);
	/**
	 * zhugx 保存选择概算库的子树(合同索赔分摊)
	 * @param conid
	 * @param ids
	 */
	public int  saveBdgcompensateLibraryTree(String conid, String claid,String[] ids);
	/**
	 * shangtw  获得选择后的树(合同索赔分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgCompensateTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException;	
	/**
	 * shangtw  合同索赔分摊 - 删除节点
	 * @param clappid
	 * @return int
	 */	
	public int deleteCompensateChildNode(String clappid);
}
