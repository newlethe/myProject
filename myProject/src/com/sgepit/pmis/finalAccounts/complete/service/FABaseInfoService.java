package com.sgepit.pmis.finalAccounts.complete.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompBdgInfo;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFinanceSubject;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompGcType;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompInfoOve;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompUncompCon;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompProofInfo;
/**
 * 基本信息接口，包括 项目基本信息，概算体系，未完工工程管理 三个模块
 * @author pengy
 * @createtime 2013-6-26 11:45:00
 */
public interface FABaseInfoService {

	/**
	 * 获取工程项目概况对象
	 * @return 工程概况对象，若没有记录返回null
	 */
	FACompInfoOve getCompInfoOve(String pid);

	/**
	 * 保存工程项目概况对象
	 * @param prjInfoOve
	 */
	void saveOrUpdate(FACompInfoOve prjInfoOve);

	/**
	 * 通用更新bean方法，根据传入实体的类型保存到相应的table
	 * @param objects bean数组
	 * @throws BusinessException
	 */
	void saveOrUpdate(Object[] objects) throws BusinessException;

	/**
	 * 验证竣工决算概算管理选择的概算是否已存在
	 * @param pid	项目ID
	 * @param uids	主键
	 * @param name	字段名称（设备，设备，安装，其他）
	 * @param value	选择的概算NO
	 * @return	true 未重复，false 已存在
	 */
	public String checkBdgno(String pid, String uids, String name, String value);

	/**
	 * 添加或更新节点
	 * @param node	FABdgInfo 竣工决算概算管理表
	 * @param isleaf	父节点是否是叶子节点，新增节点时用到
	 * @return	节点主键
	 */
	String saveOrUpdateNode(FACompBdgInfo node, String isleaf);

	/**
	 * 添加或保存节点
	 * @param node	FAGcType 工程类型管理表
	 * @param isleaf	父节点是否是叶子节点，新增节点时用到
	 * @return	节点主键
	 */
	String saveOrUpdateNode(FACompGcType node, String isleaf);

	/**
	 * 添加或保存节点
	 * @param node	FACompFinanceSubject 财务科目维护表
	 * @param isleaf	父节点是否是叶子节点，新增节点时用到
	 * @return	节点主键
	 */
	String saveOrUpdateNode(FacompFinanceSubject node, String isleaf);

	/**
	 * 获得竣工决算概算 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	概算 - 树节点集合
	 */
	List<ColumnTreeNode> budgetTree(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 为竣建概算结构对象设置扩展属性（各个部分金额及名称）
	 * 
	 * @param bdgInfo	竣工决算概算对象
	 */
	void setExtendAttributes(FACompBdgInfo bdgInfo);

	/**
	 * 获得竣工决算工程类型 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算工程类型集合
	 */
	List<ColumnTreeNode> gcTypeTree(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 获得概算关联 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算概算集合
	 */
	List<ColumnTreeNode> VBdgTree(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 获得竣工决算财务科目 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	竣工决算财务科目表集合
	 */
	List<ColumnTreeNode> financeSubjectTree(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 删除叶子节点
	 * @param beanType	实体类简称
	 * @param id		节点id
	 * @param parentid	父节点
	 */
	void deleteNode(String beanType, String id, String parentid);

	/**
	 * 竣工决算模块树结构新增时获取新的节点编号
	 * @param pid PID
	 * @param prefix 编号前缀
	 * @param col 列名称
	 * @param table 表名称
	 * @param lsh 最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author zhangh 2013-06-27
	 */
	String getNewTreeid(String pid, String prefix, String col,
			String table, Long lsh);

	/**
	 * 获得未完工合同
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	未完工合同集合
	 */
	List<FACompUncompCon> getUncompCon(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 工程量清单中的工程量结构 - 树
	 * 扩展的treeGrid
	 * @param orderBy	排序对象
	 * @param start		起始
	 * @param limit		显示数量
	 * @param map		参数集合
	 * @return	工程量集合
	 */
	List<ColumnTreeNode> buildBdgPrjTree(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 构建工程类型的TreeCombo
	 * @param treeName	树名称
	 * @param parentId	父节点ID
	 * @param params	参数
	 * @return		树节点集合
	 * @throws BusinessException
	 */
	List<TreeNode> buildTree(String treeName, String parentId, Map params) throws BusinessException;

	/**
	 * 构建工程类型ColumnTree
	 * @param parentId	父节点ID
	 * @param pid		项目ID
	 * @return	树节点集合
	 */
	public List<TreeNode> ShowGcTypeColumnTree(String parentId, String pid);
	
	/**
	 * 构建财务科目ColumnTree
	 * @param parentId	父节点ID
	 * @param pid		项目ID
	 * @return	树节点集合
	 */
	public List<TreeNode> ShowSubjectColumnTree(String parentId, String pid);

	/**
	 * 保存凭证
	 * @param proof	凭证对象
	 * @return	保存后的主键
	 */
	String saveOrUpdateNode(FacompProofInfo proof);

	/**
	 * 删除凭证及其子数据
	 * @param uids	凭证主键
	 * @return	成功则返回true
	 */
	String deleteProof(String uids);

	/**
	 * 构造columntree
	 * @param treeName	树名称
	 * @param parentId	父节点ID
	 * @param params	参数
	 * @return			树节点集合
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;

	/**
	 * 合同工程量分摊树
	 * @param parentId	父节点ID
	 * @param conId		合同ID
	 * @return
	 * @throws BusinessException
	 */
	List<ColumnTreeNode> buildBdgProjectTree(String parentId, String conId) throws BusinessException;

	//======  zhengh  ======
	
}