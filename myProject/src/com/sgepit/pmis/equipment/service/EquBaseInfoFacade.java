package com.sgepit.pmis.equipment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.HibernateException;
import org.springframework.dao.DataAccessResourceFailureException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.equipment.hbm.EquGoodsBodys;
import com.sgepit.pmis.equipment.hbm.EquTypeTree;
import com.sgepit.pmis.equipment.hbm.EquWarehouse;
import com.sgepit.pmis.equipment.hbm.SbCsb;
import com.sgepit.pmis.wzgl.hbm.WzCsbType;

public interface EquBaseInfoFacade {
	
	//yanglh

	/**
	 * 获取设备仓库Treegrid
	 * @param pid
	 * @return
	 */
	public List<EquWarehouse> equWarehouseGridTree(String orderBy, Integer start,
			Integer limit, HashMap map);
	/**
	 * 判断要被删除的设备仓库节点是否含有子节点
	 * @param bdgid
	 * @return
	 */
	public int deleteEquWarehouse(String uids,String pid);
	
	/**
	 * 修改或新增（点击后的新增）
	 * @param equid
	 * @return 
	 */
	public String addOrUpdateEquWarehouse(EquWarehouse equWarehouse,String equid,String uids)throws DataAccessResourceFailureException, HibernateException, IllegalStateException, ClassNotFoundException;
	/**
	 * 删除有节点的仓库信息
	 * 
	 */
	public boolean isHasChilds1(String equid);
	/**
	 * 获取设备仓库form上一级库区库位编码树及供货商分类树
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	/**
	 * 构建树结构
	 * @param parentId
	 * @param pid
	 * @return
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> getcsBmTree(String parentId,String pid) throws BusinessException;
	 /**
	  * 展现树结构
	  * @param parentId
	  * @param pid
	  * @param orgid
	  * @param isbody 是否主体设备材料 0 否 1 是
	  * @return
	  */
	public List<ColumnTreeNode> ShowCKTree(String parentId, String pid,
			String orgid, String isbody);
	/**
	 * 自动获取系统编码
	 * @param equid
	 * @param pid
	 * @return
	 */
	public String getActequid(String equid,String pid,int index);
	
	/**
	 * 根据删除或者修改的节点判断父节点是否有节点来修改父节点的状态
	 * 
	 */
	public void judgmentParent(String uids,String flag,String parent,String pid);
	//设备供货商
	 /** 
	  * @param csdm
	  * @检查供应商编码的唯一性 
	  */
    public boolean checkCSno(String csdm);
    /**
     * @param sbcsb
     * @关于供应商信息添加修改
     */
	 public String addOrUpdateEquCsb(SbCsb sbcsb);
	 /**
	  * @param uids
	  * @param flag
	  * @供应商启用或禁用
	  */
	 public boolean updateEquCsStateChange(String uids,String flag);
     /**
      * 重新构建设备合同分类树
      * @param parentId
      * @param whereStr
      * @param conid
      * @return
      */
	 public List<ColumnTreeNode> newEquTypeTreeList(String parentId, String whereStr,String conid);
	
	//qiupy
	 
	
	/**
	 * 删除包装方式--已经使用的包装方式不能删除
	 * @param ids
	 * @return
	 */
	public int deletePackStyleById(String [] ids);
	/**
	 * 使用ColumnTree组件构造设备合同分类树
	 * @param parentId
	 * @param whereStr
	 * @return
	 */
	public List<ColumnTreeNode> equTypeTree(String parentId, String whereStr,String conid,String initFlag);
	public List<ColumnTreeNode> equTypeTreeList(String parentId, String whereStr,String conid);
	/**
	 * 初始化设备合同分类树
	 */
	public void initEquTypeTree(String initFlag);
	/**
	 * 使用treegrid组件构造设备合同分类树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 */
	public List<ColumnTreeNode> buildEquTypeTree(String orderBy,Integer start, Integer limit, HashMap map);
	public boolean isHasChilds(String sbid);
	public int deleteChildNodes(String sbid);
	public int addOrUpdate(EquTypeTree equTypeTree,String oldParent);
	public Map getEquTypeTreeByProperties(String parent,String conid);
	public Map getEquTypeTreeRootByProperties(String parent,String conid);
	//zhangh
    /**
     * 重新构建设备合同分类树
     * @param parentId
     * @param whereStr
     * @param conid
     * @return
     */
	 public List<ColumnTreeNode> newEquTypeTreeListSingle(String parentId, String whereStr,String conid);
	 /**
		 * 设备主体设备出入库保存或修改
		 * 
		 * @param equGoodsBodys
		 * @return
		 */
	 public String equBodySaveOrUpdate(EquGoodsBodys equGoodsBodys);
		/**
		 * 构建通用的仓库树
		 * 
		 * @param treeName
		 * @param parentId
		 * @param params
		 * @return
		 * @author zhangh 2012-09-21
		 * @throws BusinessException
		 */
		public List<TreeNode> buildTree(String treeName, String parentId, Map params)
				throws BusinessException ;
		
		/**
		 * 设备仓库分类树
		 * 
		 * @param parentId
		 * @param conid 出入库单对应的合同
		 * @return
		 * @author zhangh 2012-09-21
		 */
		public List<TreeNode> ShowCKTreeNew(String parentId, String conid);
		/**
		 * 构建概算选择树
		 * @param parentId
		 * @param bdgidStr
		 * @return
		 */
		public List<ColumnTreeNode> equBdgTree(String parentId, String bdgidStr);

		// zhangh
		/**
		 * 设备仓库新保存方法
		 * 
		 * @param equWarehouse
		 * @return
		 * @author zhangh 2012-09-20
		 */
		public String addOrUpdateEquWarehouseNew(EquWarehouse equWarehouse);

}
