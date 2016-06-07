package com.sgepit.fileAndPublish.service;

import java.util.List;
import java.util.Map;

import com.sgepit.fileAndPublish.hbm.ComFileSort;
import com.sgepit.fileAndPublish.hbm.ComFileSortRightBean;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;

public interface IComFileSortService {
	/**
	 * 根据父层节点ID获取新的子节点编号
	 * @param parentId
	 * @return
	 */
	public String getNewSortBhByParentId(String parentId);
	/**
	 * 根据父节点ID找到所有他的所有儿子节点
	 * @param parentId  父节点ID
	 * @param deptIds   访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return 儿子节点实体List
	 */
	public List<ComFileSort> getComFileNodesByParentId(String parentId,String deptIds);
	
	/**
	 * 根据父节点查找以该父节点为根节点的所有节点，构成树结构
	 * @param parentId  父节点ID
	 * @param deptIds   访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return Map List，map的key 与实体的属性对应
	 */
	public List<Map> getComFileSortTreeByParentId(String parentId,String deptIds);
	
	/**
	 * 增加节点方法 节点编号自动设置，与全路径排序号一致
	 * @param parentId   父层节点ID
	 * @param sortNodeName  节点名称
	 * @param deptIds  访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @param pid 项目id
	 * @return
	 */
	public boolean addNodeForComFileSortTree(String parentId,String sortNodeName,String deptIds, String pid);
	
	/**
	 * 增加节点方法
	 * @param parentId   父层节点ID
	 * @param sortNodeName  节点名称
	 * @param sortNodeBh    节点编号
	 * @param pid 项目id
	 * @param deptIds  访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return
	 */
	public boolean addNodeForComFileSortTree(String parentId,String sortNodeName,String deptIds, String pid, String sortNodeBh);
	
	/**
	 * 更新节点名称
	 * @param nodeName
	 * @return
	 */
	public boolean updateNodeInfo(String nodeId,String nodeName,String nodeBh);
	
	/**
	 * 删除节点
	 * @param nodeId
	 * @return
	 */
	public boolean deleteNode(String nodeId);
	
	/**
	 * 移动分类树节点
	 * @param nodeId          移动节点ID
	 * @param relationNodeId  被移动
	 * @param type
	 * @return
	 */
	public boolean moveComFileSortTreeNode(String nodeId,String relationNodeId,String type);
	
	/**
	 * 设置节点可访问的部门及权限
	 * @param nodeId
	 * @param rightMap
	 * @return
	 */
	public boolean setComFileSortNodeRight(String nodeId,Map<String,String> rightMap);
	/**
	 * 获取节点权限树
	 * @param nodeId
	 * @return
	 */
	public List<ComFileSortRightBean> getComFileSortRightTree(String nodeId, String rootId);
	List<ComFileSortRightBean> getComFileSortRightTree(String nodeId, String rootId, Boolean excludeDept);
	
	String issueFileSort(String rootId) throws BusinessException;
	void setSyncStatus(String nodeId, Boolean sync) throws BusinessException;
	/**
	 * 分类下发单位选择
	 * @param rootId
	 * @param userBelongUnitId 	当前登录用户所属单位ID
	 * @param start
	 * @param limit
	 * @return
	 */	
	public List<SgccIniUnit> getIssueFileSortUnit(String rootId, String userBelongUnitId, Integer start,Integer limit);
	/*@param选择的下发单位
	 * @param unitids单位
	 * @param rootId
	 * @return
	 */	
	public String issueFileSortBySelect(String unitids[],String rootId);	
}
