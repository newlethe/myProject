package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgChangApp;



/**
 * BdgChangeMgmFacade 合同变更概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgChangeMgmFacade {
	void insertBdgChange(BdgChangApp bdgChange) throws SQLException, BusinessException;
	void updateBdgChange(BdgChangApp bdgChange) throws SQLException, BusinessException;
	void deleteBdgChange(BdgChangApp bdgChange) throws SQLException, BusinessException;
	List<ColumnTreeNode> bdgChangeTree(String parentId,  String conId,String chaid) throws BusinessException ;
	/**
	 * @author zhugx 删除合同变更概算树 
	 * @param bdgId
	 * @return
	 * @throws BusinessException 
	 * @throws SQLException 
	 */
	public int deleteChildNodeBdgChangeApp(String caid) throws SQLException, BusinessException;
	/**
	 *  判断该合同是否有设备
	 */
	public int isEquipment(String conid);
	/**
	 *  判断该合同是否有工程量分摊
	 */
	public int isProject(String conid);
	/**
	 * zhugx 保存选择的子树(合同变更分摊)
	 * @param conid
	 * @param ids
	 */
	public int  saveBdgmoneyTree(String conid, String chaid,String[] ids);
	/**
	 * @author zhugx  合同变更概算金额统计(编辑时)
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgChangeApp(String parentId, String conid,String cano) throws SQLException, BusinessException;
	
	/**
	 * @author zhugx  合同变更概算金额统计(删除时)
	 * @param bdgInfo
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumbdgChangeAppForDelete(BdgChangApp bca) throws SQLException, BusinessException;
	
	
	/**
	 * zhugx 保存对合同变更概算编辑(右键编辑)数据
	 * @param bdgId6
	 * @return
	 */
	public int addOrUpdateBdgChangeApp(BdgChangApp bca);
	/**
	 * 
	 * @param conid 合同ID
	 * @param bdgid 概算项目ID
	 * @param pid   项目ID
	 * @param money 变更分摊填写金额
	 * @return 根据上述传入条件来对变更分摊中的数据填写进行验证
	 */
	public String CheckChaAppIsValid(String conid,String bdgid,String pid,String money);
	/**
	 * zhugx 保存选择的子树(概算金额分摊)
	 * @param conid
	 * @param ids
	 * @param chaid
	 */
	public void saveGetBudgetTree(String conid, String chaid,String[] ids);
	

	/**
	 * shangtw  工程量变更分摊
	 * @param parentId
	 * @param conid
	 * @param chaid
	 * @return
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> bdgProjectChangeTree(String parentId,  String conId,String chaid) throws BusinessException ;
	/**
	 * shangtw 保存选择的子树(合同变更分摊)
	 * @param conid
	 * @param ids
	 * 
	 */
	public int  saveBdgmoneyNewTree(String conid, String chaid,String[] ids)throws BusinessException ;	
	/**
	 * shangtw  获得选择后的树(合同变更分摊)
	 * @param parentId
	 * @param conid
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bdgChangeTreeGrid(String orderBy,
			Integer start, Integer limit, HashMap map) throws BusinessException;	
	
}
