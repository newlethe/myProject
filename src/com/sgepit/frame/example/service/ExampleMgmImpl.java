package com.sgepit.frame.example.service;

import java.util.ArrayList;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.example.dao.ExampleDAO;
import com.sgepit.frame.example.hbm.ExampleCategorytable;
import com.sgepit.frame.example.hbm.ExampleParenttable;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;

public class ExampleMgmImpl implements ExampleMgmFacade{
	private ExampleDAO expDao;

	public ExampleDAO getExpDao() {
		return expDao;
	}

	public void setExpDao(ExampleDAO expDao) {
		this.expDao = expDao;
	}
	
	public String buildTreeNodes(String treeName,String parentId){
		
		return "";
	}
	
	public List getCategoryByParentID(String parentID){
		List<ExampleCategorytable> tmplist = this.expDao.findByProperty("com.sgepit.frame.example.hbm.ExampleCategorytable", "parentid", parentID);
		
		List<TreeNode> tree = new ArrayList<TreeNode>();
		for (int i = 0;i<tmplist.size();i++){
			ExampleCategorytable tmpCategory = tmplist.get(i);
			TreeNode treeNode = new TreeNode();
			treeNode.setId(tmpCategory.getCategoryid());
			treeNode.setText(tmpCategory.getCategoryname());
			treeNode.setDescription("");
			treeNode.setCls("cls");
			treeNode.setLeaf(tmpCategory.getIsleaf().intValue() == 1 ? true : false);
			treeNode.setHref("");
			tree.add(treeNode);
		}
		return tree;
	}
	
	public void insertParent(ExampleParenttable parentRec) throws BusinessException {
		this.expDao.insert(parentRec);
	}
	
	public void updateParent(ExampleParenttable parentRec) throws BusinessException {
		this.expDao.saveOrUpdate(parentRec);
	}
	
	public void deleteParent(ExampleParenttable parentRec)throws BusinessException {
		this.expDao.delete(parentRec);
	}
}