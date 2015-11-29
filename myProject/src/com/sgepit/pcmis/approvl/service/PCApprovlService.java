package com.sgepit.pcmis.approvl.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pcmis.approvl.hbm.PcPwSortTree;

/**
 * @ConAccinfoMgmFacade 批文管理-业务逻辑接口
 * @author Xiaoz
 */
public interface PCApprovlService {
	/**
	 * 新增或修改批文分类，在新增的时候需要同步更新父节点的leaf值
	 * @return
	 * @author liangwj
	 * @since 2011.5.25
	 */
	public abstract boolean addOrUpdateApprovlPWSort(PcPwSortTree pcPwSortTree);
	//项目批文分类维护	
	/**
	 * 批文分类树数据获取
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws SQLException, BusinessException;
	
	/**
	 * 在删除分类的时候判断是否有子分类
	 */
	public boolean deleteApprovlClassfiyByNO(String appClassfiyNO) throws SQLException, BusinessException;
	
	/**
	 * 新增 参考其他
	 */
	
	
	
	/**
	 * 删除
	 */
	public boolean deleteApporvlFileById(String id) throws SQLException, BusinessException;
	/**
	 * 编辑功能使用Ext.grid.EditorGridTbarPanel组件自有的编辑保存功能，这里不用实现
	 */
	
	/**
	 * 删除
	 */
	public boolean deleteApprovlInsById(String id) throws SQLException, BusinessException;
	
	/**
	 * 项目批文记录获取
	 */
	public List getProjectsApprolInfoByUnitid(String orderby, Integer start, Integer limit, HashMap params) throws SQLException, BusinessException;
	
	/*
	 * 取得所有项目单位(包含前期项目维护中的项目)批文信息以及项目信息(项目名称, 建设规模, 批文办理数量等)
	 * 
	 */
	public List getAllPrjPwInfoByUnitid(String orederby, Integer start, Integer limit, HashMap params) throws SQLException, BusinessException;
	
	public String getApprolsByWhere(String orderby, Integer start, Integer limit,Map params) throws SQLException, BusinessException;
	
	//添加生成树的方法在Impl中实现
	public List<ColumnTreeNode> pwSortTree(String parentId, String industryType) throws BusinessException;
	/**
	 * 根据批文分类实例化批文
	 */
	public boolean initApprolInfoBySortId(String sortPk,String nodePath,String pid);
	/**
	 * 根据二级企业、项目单位、批文编号串初始化项目单位的批文分类
	 * @param unitId 二级企业
	 * @param pid  项目单位
	 * @param sortIds 批文分类编号，使用","隔开
	 * @return
	 */
	public List<TreeNode> buildTree(String treeName, String parentId, Map params) throws BusinessException;
	  
	public boolean initProjPwSortBySortIds(String unitId,String pid,String sortIds);
	
	public String distributePcPwTree(String pid);
	
	public String submitPcPwMgm(String unitid);
	
	public String distributePcPwAdvise(String pid, String mgmUids);
	
	public List<TreeNode> pwUnitTree(String parentId, String unitType2Id, String pid);
	public List getAllPrjByUnit2(String unitID) throws SQLException, BusinessException;
	
	public String getPageLvl(String userid, String URL) throws SQLException, BusinessException;
}
