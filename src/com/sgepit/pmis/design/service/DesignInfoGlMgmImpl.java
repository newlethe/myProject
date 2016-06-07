/***********************************************************************
 * Module:  INFManageImpl.java
 * Author:  lixiaob
 * Purpose: Defines the Class INFManageImpl
 ***********************************************************************/

package com.sgepit.pmis.design.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.design.dao.DesignInfoGlDAO;
import com.sgepit.pmis.design.hbm.DesignInfoGl;
import com.sgepit.pmis.design.hbm.DesignInfoTree;

/** @pdOid df9d644d-22b8-44b6-a838-6b519b9b24f9 */
public class DesignInfoGlMgmImpl extends BaseMgmImpl implements DesignInfoGlMgmFacade {

	//private INFManageDAO infmanageDAO;
	private DesignInfoGlDAO designinfoglDAO; 
	private BusinessException businessException;
	public static DesignInfoGlMgmImpl getFromApplicationContext(ApplicationContext ctx) {

		return (DesignInfoGlMgmImpl) ctx.getBean("designMgm");
	}

	public void UpdateDesignInfotree(DesignInfoTree designinfotree) {
		this.designinfoglDAO.saveOrUpdate(designinfotree);
		
	}

	public int deleteDesignInfoChildNode(String noid) {
		int flag = 0;
		String beanName = BusinessConstants.DesInfo_PACKAGE
				+ BusinessConstants.DesignInfo_Tree;
		try {
			DesignInfoTree designinfotree = (DesignInfoTree) this.designinfoglDAO.findById(beanName,
					noid);
			List list = (List) this.designinfoglDAO.findByProperty(beanName,
					"parent", designinfotree.getParent());
			if (list != null) {
				if (list.size() == 1) { // 删除的节点为该父节点的最后一个
					DesignInfoTree sort = (DesignInfoTree) this.designinfoglDAO.findById(
							beanName, designinfotree.getParent());
					sort.setIsleaf(new Long(1));
					this.UpdateDesignInfotree(sort);
				}
				this.designinfoglDAO.delete(designinfotree);
			} else {
				flag = 1;
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}


	public void SaveDesignInfotree(DesignInfoTree designinfotree) {
		// TODO Auto-generated method stub
		this.designinfoglDAO.insert(designinfotree);
	}

	public int addOrUpdateDesignInfo(DesignInfoTree designinfotree, String indexid) {
		int flag = 0;
		String beanName = BusinessConstants.DesInfo_PACKAGE+BusinessConstants.DesignInfo_Tree;
		try {
			if ("".equals(designinfotree.getTreeid())) { // 新增
				/*
				 * 当新增节点是它父节点的第一个子节点，如果该父节点(新 增前是没子节点)原来是[工程量]，就要自动改成[概算]！
				 */
				// 查找是否有同级节点
				List list = (List) this.designinfoglDAO.findByProperty(beanName,
						"parent", designinfotree.getParent());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					DesignInfoTree parentBdg = (DesignInfoTree) this.designinfoglDAO.findById(
							beanName, designinfotree.getParent());
					parentBdg.setIsleaf(new Long(0));
					//parentBdg.setOrgid(parentBdg.getOrgid());
					this.UpdateDesignInfotree(parentBdg);
				}
				String str = this.getdesinfoindexid(designinfotree.getParent());

				if (str == null || str.equals("")) {
					return 0;
				}
				if (str.substring(str.length() - 1, str.length()).equals("9999")) {
					return 1;
				}
				designinfotree.setIndexid(str);
				this.SaveDesignInfotree(designinfotree);
			}else{
				designinfotree.setIndexid(indexid);
				this.UpdateDesignInfotree(designinfotree);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	

	public boolean checkinfobh(String id) {
		List list = this.designinfoglDAO.findByProperty(BusinessConstants.DesInfo_PACKAGE.concat(BusinessConstants.DesignInfo_Gl), "infobh", id);
		if (list.size()>0) return false;
		return true;
	}

	public String getinfobh(String id) {
		String getinfobh=null;
		DesignInfoGl designinfogl=new DesignInfoGl();
		designinfogl=(DesignInfoGl)this.designinfoglDAO.findById(BusinessConstants.DesInfo_PACKAGE.concat(BusinessConstants.DesignInfo_Gl), id);
		if(designinfogl!=null){
			getinfobh=designinfogl.getInfobh();
			return getinfobh;
		}
		return getinfobh;
	}

	public void savedesigninfogl(DesignInfoGl designinfogl) {
		this.designinfoglDAO.insert(designinfogl);
		
	}

	public void updatedesigninfogl(DesignInfoGl designinfogl) {
		this.designinfoglDAO.saveOrUpdate(designinfogl);
		// TODO Auto-generated method stub
		
	}
	public List<ColumnTreeNode> ShowDesInfo(String parentId,String pid)throws BusinessException {
		// TODO Auto-generated method stub
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		StringBuffer bfs = new StringBuffer();
		bfs.append("parent='" + parent+"'");
		bfs.append(" and pid='" + pid); 
		bfs.append("' order by indexid ");
		List modules = this.designinfoglDAO.findByWhere(BusinessConstants.DesInfo_PACKAGE.concat(BusinessConstants.DesignInfo_Tree), bfs.toString());
		Iterator<DesignInfoTree> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			DesignInfoTree temp = (DesignInfoTree) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getTreeid());			// treenode.id
			String aa=temp.getMc()+"("+temp.getBm()+")";
			n.setText(aa);
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("icon-pkg");		// treenode.cls
				//n.setIconCls("task-folder");	// treenode.iconCls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	
	}
	/**
	 * 系统自动存储编码
	 * 
	 * @param
	 * @return
	 */
	public String getdesinfoindexid(String parent) {
			String beanName = BusinessConstants.DesInfo_PACKAGE.concat(BusinessConstants.DesignInfo_Tree);
			DesignInfoTree designinfotree = (DesignInfoTree)this.designinfoglDAO.findById(beanName, parent);
			String indexId = designinfotree.getIndexid();
			JdbcTemplate jdbc =  JdbcUtil.getJdbcTemplate();
			String sql = "  select lpad(nvl(max(TO_NUMBER (substr(t.indexid, length(t.indexid)-3, length(t.indexid)))),0) + 1,4,0) indexid " +
						 "	from DESIGN_INFO_TREE t where t.parent = '"+parent+"'";
			List list = jdbc.queryForList(sql);
			Iterator it = list.iterator();
			while (it.hasNext()){
				Map map = (Map)it.next();
				String indexId2 = (String)map.get("indexid");
				indexId += indexId2;
			}
			return indexId;
		}

	public DesignInfoGlDAO getDesigninfoglDAO() {
		return designinfoglDAO;
	}

	public void setDesigninfoglDAO(DesignInfoGlDAO designinfoglDAO) {
		this.designinfoglDAO = designinfoglDAO;
	}

	public BusinessException getBusinessException() {
		return businessException;
	}

	public void setBusinessException(BusinessException businessException) {
		this.businessException = businessException;
	}
	/**
	 * 设计资料移交
	 * @param ids
	 * @param indexid
	 * @throws BusinessException
	 */
	public void ZlHandoverDesInfozlOk(String ids,String indexid,String unitid) throws BusinessException {
		String id[] = ids.split("==");
		for(int i=0;i<id.length;i++){
			DesignInfoGl desinfo = (DesignInfoGl)this.designinfoglDAO.findById(BusinessConstants.DesInfo_PACKAGE
					.concat(BusinessConstants.DesignInfo_Gl), id[i]);
			ZlInfo zlinfo = new ZlInfo ();
			zlinfo.setBillstate(new Long(0));
			zlinfo.setIndexid(indexid);
			zlinfo.setPid("GJMD");
			zlinfo.setFilelsh(desinfo.getFilelsh());
			zlinfo.setFilename(desinfo.getFilename());
			zlinfo.setResponpeople(desinfo.getBzr());
			zlinfo.setStockdate(desinfo.getBzrq());
			zlinfo.setMaterialname(desinfo.getMc());
			zlinfo.setOrgid(unitid);
			this.designinfoglDAO.saveOrUpdate(zlinfo);
			
			desinfo.setIsremove("1");
			this.designinfoglDAO.saveOrUpdate(desinfo);
		}
	}
	public int getRowCount(String id){
		int i=0;
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql="select  count(*) from  DA_DAML where daid='"+id+"'";
		i=jdbc.queryForInt(sql);
		return i;
		
	}	
				
}