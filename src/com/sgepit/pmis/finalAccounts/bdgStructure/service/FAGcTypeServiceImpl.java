package com.sgepit.pmis.finalAccounts.bdgStructure.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.finalAccounts.bdgStructure.dao.FABdgStructureDAO;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType;

public class FAGcTypeServiceImpl implements FAGcTypeService {

	private FABdgStructureDAO bdgStructureDAO;

	private String beanName = BusinessConstants.FA_BDG_STRUC_PKG
			+ BusinessConstants.FA_GC_TYPE;

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {

		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.FA_GC_TYPE_ROOT_ID;

		List<FAGcType> objects = bdgStructureDAO
				.findByProperty(beanName, "parent", parent);
		if (objects.size() > 0) {
			FAGcType gcType = objects.get(0);
			ColumnTreeNode columnTreeNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();
			boolean leaf = gcType.getIsLeaf();
			node.setId(gcType.getUids());
			node.setText(gcType.getGcTypeName());

			if (leaf) {
				node.setLeaf(true);
				node.setIconCls("task");
			} else {
				node.setLeaf(false); // treenode.leaf
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			node.setIfcheck("none");
			columnTreeNode.setTreenode(node); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(gcType);
			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}

		return list;
	}

	public FABdgStructureDAO getBdgStructureDAO() {
		return bdgStructureDAO;
	}

	public void setBdgStructureDAO(FABdgStructureDAO bdgStructureDAO) {
		this.bdgStructureDAO = bdgStructureDAO;
	}

	public void deleteNode(String id) {
		FAGcType node = (FAGcType) bdgStructureDAO.findById(beanName, id);
		
		String sql = "delete from FA_GC_TYPE where uids in ( select uids from FA_GC_TYPE start with uids = '" + id + "' connect by prior uids = parent )";
		JdbcUtil.update(sql);
		
		//将父节点的isLeaf设为true
		if ( ! node.getParent().equals(BusinessConstants.FA_GC_TYPE_ROOT_ID) ){
			String sqlParent = "update FA_GC_TYPE set is_leaf = 1 where uids = '"+ node.getParent() +"'";
			JdbcUtil.update(sqlParent);
		}
		
	}

	public String saveOrUpdateNode(FAGcType node) {

		boolean isAdd = false;
		if (node.getUids() == null) {
			isAdd = true;
		} else if (node.getUids().equals("")) {
			isAdd = true;
		}
		String id = node.getUids();

	
		if (isAdd) {
			
			id = bdgStructureDAO.insert(node);
			// 若为新增子节点则把父节点的isLeaf属性设为false
			// 获取父节点
			FAGcType parentNode = (FAGcType) bdgStructureDAO.findById(beanName,
					node.getParent());
			if (parentNode.getIsLeaf()) {
				parentNode.setIsLeaf(false);
				bdgStructureDAO.saveOrUpdate(parentNode);
			}

		} else {
			bdgStructureDAO.saveOrUpdate(node);

		}

		return id;
	}
	
	public List<Object[] > getGcTypeList(){
		List<Object[]> rtnList = new ArrayList<Object[]>();
		String sql = "select * from FA_GC_TYPE t start with parent = '" + BusinessConstants.FA_GC_TYPE_ROOT_ID + "' connect by prior uids = parent";
		List<Map<String, Object>> list = JdbcUtil.query(sql);
		for (Map map : list) {
			Object[] arr = new Object[2];
			arr[0] = map.get("uids");	//key
			arr[1] = map.get("GC_TYPE_NAME");	//value
			rtnList.add(arr);
		}
		
		return rtnList;
	}

}
