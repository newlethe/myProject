package com.sgepit.pmis.budget.service;

import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgInfo;



/**
 * BdgChangeMgmFacade 合同变更概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgInfoMgmFacade {
	void sumContmoney(String bdgid);
	void insertBdgInfo(BdgInfo bdgInfo) throws SQLException, BusinessException;
	void updateBdgInfo(BdgInfo bdgInfo) throws SQLException, BusinessException;
	void deleteBdgInfo(BdgInfo bdgInfo) throws SQLException, BusinessException;
	public Double sumAllRealmoney(String pid);
	List<ColumnTreeNode> BdgInfoTree(String parentId, String pid) throws BusinessException;
	List<ColumnTreeNode> BdgInfoTreeQuery(String parentId, String pid) throws BusinessException;
	
	/**
	 * 获得概算结构 - 树,平衡检查树。列出所有不平衡的树
	 * @param parentId
	 * @param pid
	 * @deprecated	使用新的方法 ：bdgCheckTreeGrid
	 * @return
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> BdgCheckTree(String parentId, String pid) throws BusinessException;
	
	/**
	 * 检查概算项目  录入概算金额≠汇总计算概算金额
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map	参数
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-5-29
	 */
	public List<ColumnTreeNode> bdgCheckTreeGrid(String orderBy, Integer start, Integer limit, HashMap map);
	
	public int addOrUpdate(BdgInfo bdgInfo);
	public int deleteChildNode(String bdgId);
	public boolean isApportion(String bdgid);
	public List queryBdgid(String bdgid);
	/**
	 * 判断要被删除的概算节点是否含有子節點
	 * @param bdgid
	 * @return
	 */
	public boolean isHasChilds(String bdgid);
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: zhangh
	 * @createDate: 2011-4-7
	 */
	public InputStream getExcelTemplate(String businessType);

	/**
	 * 概算项目的一键平衡功能： 设置概算金额、预计未签订金额 为累计计算值；
	 * 新增批准概算金额，也需要设置
	 * @param pid	项目ID
	 * @param flag	分两种情况： 1   设置概算金额、预计未签订金额 ， 2  只设置批准概算金额
	 * @return
	 */	
	public boolean clearBdgMoney(String pid, String flag);
	/**
	 * 
	 * @param parent 父节点Id
	 * @param pid   项目单位ID
	 * @return  返回值 返回0表示 没有 1 表示已存在
	 */
	public String checkBdgInit(String parent,String pid);
	/**
	 * 初始化节点
	 * @param parent
	 * @param pid
	 */
	public void initBdgTree(String parent,String pid);
   
	/**
	 *  获得概算结构 - 树
	 *  扩展的treeGrid
	 */
	public List<ColumnTreeNode> budgetMaintenanceTree(String orderBy,
			Integer start, Integer limit, HashMap map);
    /**
     * 初始化预计未签订合同金额
     * 
     * 
     */
	public  String initializationAction(String pid,String UNPid);
	/**
	 * 更新预计未签订金额值
	 * @author: shangtw
	 * @param bdgids
	 * @param value 为变化的值
	 */
	public void updaterRemainingMoney(String bdgids[],Double value);
	
	/**
	 * 更新bdginfo表的标识：包括当前节点以及当前节点的所有上层节点
	 * @param bdgid 当前节点
	 * @param newFlag	要更新成的标识
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-4-9
	 */
	public String updateBdginfoFlag (String bdgid, String newFlag);
	/**
	 * 删除bdginfo表当前节点及其子节点，并递归更新父节点相关金额
	 * @param bdgid 当前节点
	 * @param flag	要更新成的标识
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-5-15
	 */	
	public int deleteChildNodesByCalMoney(String bdgId);
	
	/**
	 * 新增或修改概算信息并计算金额
	 * @param BdgInfo 当前概算实体
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-5-15
	 */	
	public int addOrUpdateByCalMoney(BdgInfo bdgInfo);

	/**
	 * 平衡检查：计算概算金额及预计未签订金额 父节点的计算值，写入数据库库相应字段
	 * 新增批准概算金额，也需要计算
	 * @param pid	项目ID
	 * @param flag	分三种情况：0 进入页面时都计算， 1 只计算概算金额及预计未签订金额， 2 只计算批准概算金额
	 * @throws SQLException
	 * @throws BusinessException
	 * @author: Liuay
	 * @createDate: 2012-5-31
	 */
	public void sumMoneyOfBdgInfo(String pid, String flag) throws SQLException, BusinessException;

}
