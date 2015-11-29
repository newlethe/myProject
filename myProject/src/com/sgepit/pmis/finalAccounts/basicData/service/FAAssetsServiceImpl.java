package com.sgepit.pmis.finalAccounts.basicData.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.pmis.finalAccounts.basicData.dao.FAAssetsSortDAO;
import com.sgepit.pmis.finalAccounts.basicData.hbm.FAAssetsSortHBM;

public class FAAssetsServiceImpl extends BaseMgmImpl implements FAAssetsService {
	public FAAssetsSortDAO faAssetsSortDAO = null;

	public void setFaAssetsSortDAO(FAAssetsSortDAO faAssetsSortDAO) {
		this.faAssetsSortDAO = faAssetsSortDAO;
	}
	
	/**
	 * 资产分类树
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 * @author: Ivy
	 * @createDate: 2011-3-8
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String[] pArr = (String[]) params.get("pid");
		String pid = pArr[0];
		if (treeName.equalsIgnoreCase("assetSortTree")) {	
			list = this.assetSortTree(parentId, pid);  
		}  
		return list;
	}
	
	/**
	 * 根据父节点ID，获取资产分类树ColumnTree的信息
	 * @param parentId
	 * @param pid
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-2
	 */
	public List<ColumnTreeNode> assetSortTree(String parentId, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: Constant.APPBudgetRootID;
		String str = "parent_id='"+ parent +"' and pid='"+ pid +"' order by assetsNo";
		List<FAAssetsSortHBM> objects = this.faAssetsSortDAO.findByWhere2(FAAssetsSortHBM.class.getName(), str);
		Iterator<FAAssetsSortHBM> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			FAAssetsSortHBM temp = (FAAssetsSortHBM) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getUids());			// treenode.id
			n.setText(temp.getAssetsName());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	/**
	 * 新增或更新资产分类信息
	 * @param fas
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-8
	 */
	public int addOrUpdateSort(FAAssetsSortHBM fas){
		int flag = 0;
		String beanName = FAAssetsSortHBM.class.getName();
		try {
			if ("".equals(fas.getUids())){   //  新增
				List list = (List)this.faAssetsSortDAO.findByProperty(beanName, "parentId", fas.getParentId());
				if (list.isEmpty()){
					FAAssetsSortHBM parentSort = (FAAssetsSortHBM)this.faAssetsSortDAO.findById(beanName, fas.getParentId());
					parentSort.setIsleaf(new Long(0));
					this.faAssetsSortDAO.saveOrUpdate(parentSort);
				}
				this.faAssetsSortDAO.insert(fas);
			}else{
				this.faAssetsSortDAO.saveOrUpdate(fas);
			}
		} catch (BusinessException e) {
			flag = 1; 
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 *删除一个资产分类
	 * @return
	 */
	public int deleteChildNodeSort(String sortId){
		String beanName = FAAssetsSortHBM.class.getName();
		FAAssetsSortHBM fas = (FAAssetsSortHBM)this.faAssetsSortDAO.findById(beanName, sortId);
		String parentId = fas.getParentId();
		List list = (List)this.faAssetsSortDAO.findByProperty(beanName, "parentId", parentId);
		
		try {
			if (!"0".equals(parentId)){
				faAssetsSortDAO.delete(fas);
				if (list.size() == 1){
					this.deleteChildNodeSort(parentId);
				}
			}
		} catch (BusinessException e) {
			e.printStackTrace();
		} 
		
		return 0;
	}
}
