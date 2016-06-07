package com.sgepit.pmis.safeManage.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.document.hbm.ZlTree;
import com.sgepit.pmis.safeManage.dao.SafeManageDao;
import com.sgepit.pmis.safeManage.hbm.SafeAccidentReport;
import com.sgepit.pmis.safeManage.hbm.SafeCasualtyAccident;
import com.sgepit.pmis.safeManage.hbm.SafeEducationCard;
import com.sgepit.pmis.safeManage.hbm.SafeEnterpriseAccident;
import com.sgepit.pmis.safeManage.hbm.SafeEnterpriseDetail;
import com.sgepit.pmis.safeManage.hbm.SafeExamineType;
import com.sgepit.pmis.safeManage.hbm.SafeUser;
import com.sgepit.pmis.safeManage.hbm.SafeUserType;
import com.sgepit.pmis.safeManage.hbm.SafetyCheckContent;
import com.sgepit.pmis.safeManage.hbm.SafetyCheckItem;
import com.sgepit.pmis.safeManage.hbm.SafetyMoneyApplyPg;
import com.sgepit.pmis.safeManage.hbm.SevereAccidentRegister;

public class SafeManageMgmImpl extends BaseMgmImpl implements
		SafeManageMgmFacade {
	private SafeManageDao safeManageDAO;
	private BusinessException businessException;

	public static SafeManageMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {

		return (SafeManageMgmImpl) ctx.getBean("safeManageMgmImpl");
	}

	public SafeManageDao getSafeManageDAO() {
		return safeManageDAO;
	}

	public void setSafeManageDAO(SafeManageDao safeManageDAO) {
		this.safeManageDAO = safeManageDAO;
	}

	public void insertSafeAccident(SafeAccidentReport safeAccident) {
		this.safeManageDAO.insert(safeAccident);
	}

	public void updateSafeAccident(SafeAccidentReport safeAccident) {
		this.safeManageDAO.saveOrUpdate(safeAccident);
	}

	public void insertCasualtyAccident(SafeCasualtyAccident safeAccident) {
		this.safeManageDAO.insert(safeAccident);
	}

	public void updateCasualtyAccident(SafeCasualtyAccident safeAccident) {
		this.safeManageDAO.saveOrUpdate(safeAccident);
	}

	public void insertSafeEnterpriseAccident(SafeEnterpriseAccident safeAccident) {
		this.safeManageDAO.insert(safeAccident);
	}

	public void updateSafeEnterpriseAccident(SafeEnterpriseAccident safeAccident) {
		this.safeManageDAO.saveOrUpdate(safeAccident);
	}

	public void insertSafeEnterpriseDetail(SafeEnterpriseDetail safeAccident) {
		this.safeManageDAO.insert(safeAccident);
	}

	public void updateSafeEnterpriseDetail(SafeEnterpriseDetail safeAccident) {
		this.safeManageDAO.saveOrUpdate(safeAccident);
	}

	public void insertSevereAccidentRegister(
			SevereAccidentRegister severeAccidentRegister) {
		this.safeManageDAO.insert(severeAccidentRegister);
	}

	public void updateSevereAccidentRegister(
			SevereAccidentRegister severeAccidentRegister) {
		this.safeManageDAO.saveOrUpdate(severeAccidentRegister);
	}

	public void insertSafeUser(SafeUser safeUser) {
		this.safeManageDAO.insert(safeUser);
	}

	public void updateSafeUser(SafeUser safeUser) {
		this.safeManageDAO.saveOrUpdate(safeUser);
	}

	public void insertSafeExamineType(SafeExamineType safeType) {
		this.safeManageDAO.insert(safeType);
	}

	public void updateSafeExamineType(SafeExamineType safeType) {
		this.safeManageDAO.saveOrUpdate(safeType);
	}

	public void insertSafeEducationCard(SafeEducationCard safeCard) {
		this.safeManageDAO.insert(safeCard);
	}

	public void updateSafeEducationCard(SafeEducationCard safeCard) {
		this.safeManageDAO.saveOrUpdate(safeCard);
	}

	public List<ColumnTreeNode> ShowUserTypeTree(String parentId)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();

		String parent = parentId != null && !parentId.equals("") ? parentId
				: "root";
		StringBuffer bfs = new StringBuffer();
		bfs.append("parent='" + parent);
		bfs.append("' order by id ");
		List modules = this.safeManageDAO.findByWhere(
				"com.sgepit.pmis.safeManage.hbm.SafeUserType", bfs.toString());
		Iterator<SafeUserType> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			SafeUserType temp = (SafeUserType) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getId().toString()); // treenode.id
			n.setText(temp.getName().toString()); // treenode.text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
				// n.setIconCls("task-folder"); // treenode.iconCls
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;

	}

	public List<ColumnTreeNode> ShowSafeTypeTree(String parentId)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();

		String parent = parentId != null && !parentId.equals("") ? parentId
				: "root";
		StringBuffer bfs = new StringBuffer();
		bfs.append("parent='" + parent);
		bfs.append("' order by treeid ");
		List modules = this.safeManageDAO.findByWhere(
				"com.sgepit.pmis.safeManage.hbm.SafeExamineType", bfs.toString());
		Iterator<SafeExamineType> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			SafeExamineType temp = (SafeExamineType) itr.next();
			int leaf = temp.getIsleaf().intValue();
			n.setId(temp.getTreeid().toString()); // treenode.id
			n.setText(temp.getMc().toString()); // treenode.text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("icon-cmp");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("icon-pkg"); // treenode.cls
				// n.setIconCls("task-folder"); // treenode.iconCls
			}
			cn.setTreenode(n); // ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // columns
			list.add(cn);
		}
		return list;

	}

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {

		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if (treeName.equalsIgnoreCase("userTypeTree")) {
			list = ShowUserTypeTree(parentId);
		}

		if (treeName.equalsIgnoreCase("safeTypeTree")) {
			list = ShowSafeTypeTree(parentId);
		}

		return list;
	}

	public int deleteChildNode(String noid) {
		int flag = 0;
		String beanName = "com.sgepit.pmis.safeManage.hbm.SafeExamineType";
		try {
			SafeExamineType tree = (SafeExamineType) this.safeManageDAO
					.findById(beanName, noid);
			List list = (List) this.safeManageDAO.findByProperty(beanName,
					"parent", tree.getParent());
			if (list != null) {
				if (list.size() == 1) { // 删除的节点为该父节点的最后一个
					SafeExamineType sort = (SafeExamineType) this.safeManageDAO
							.findById(beanName, tree.getParent());
					sort.setIsleaf(new Long(1));
					this.updateSafeExamineType(sort);
				}
				this.safeManageDAO.delete(tree);
			} else {
				flag = 1;
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}
	
	public String getMaxBm(String treeid,String bm){
		String maxbm = "";
		int temp = 0;
		try{
			String sql = "select max(bm)+1 as bh from safe_examine_type t where parent='"+treeid+"'";
			JdbcTemplate jb = JdbcUtil.getJdbcTemplate();
			temp = jb.queryForInt(sql);
			if(temp==0){
				maxbm = bm + "01";
			}else{
				if(temp<10){
					maxbm = bm + "0" + String.valueOf(temp);
				}else{
					maxbm = bm + String.valueOf(temp);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return maxbm;
	}
	
	public int addOrUpdate(SafeExamineType tree) {
		int flag = 0;
		String beanName = "com.sgepit.pmis.safeManage.hbm.SafeExamineType";
		try {
			
			if ("".equals(tree.getTreeid())) { // 新增
				// 查找是否有同级节点
				List list = (List) this.safeManageDAO.findByProperty(beanName,
						"parent", tree.getParent());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					SafeExamineType parentBdg = (SafeExamineType) this.safeManageDAO.findById(
							beanName, tree.getParent());
					parentBdg.setIsleaf(new Long(0));
					this.updateSafeExamineType(parentBdg);
				}

				this.insertSafeExamineType(tree);
			}else{
				this.updateSafeExamineType(tree);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}
	
	
	//新增检查项目
	public String insertSafetyCheckItem(SafetyCheckItem safetyCheckItem) {
		return this.safeManageDAO.insert(safetyCheckItem);
	}
	//修改检测项目
	public void updateSafetyCheckItem(SafetyCheckItem safetyCheckItem) {
		this.safeManageDAO.saveOrUpdate(safetyCheckItem);
	}
	//删除检查项目
	public void deleteSafetyCheckItem(String beanName,String beanCont,String uuid) {
		SafetyCheckItem safetyCheckItem = (SafetyCheckItem) this.safeManageDAO.findById(beanName, uuid);
		List<SafetyCheckContent> list = this.safeManageDAO.findByProperty(beanCont, "itemuuid", uuid); 
		this.safeManageDAO.deleteAll(list);
		this.safeManageDAO.delete(safetyCheckItem);
	}
	
	
	//新增安全专款评估
	public String insertSafetyMoneyApplyPg(SafetyMoneyApplyPg safetyMoneyApplyPg) {
		return this.safeManageDAO.insert(safetyMoneyApplyPg);
	}
	//修改安全专款评估
	public void updateSafetyMoneyApplyPg(SafetyMoneyApplyPg safetyMoneyApplyPg) {
		this.safeManageDAO.saveOrUpdate(safetyMoneyApplyPg);
	}
	//删除安全专款评估
	public void deleteSafetyMoneyApplyPg(String beanName,String uuid){
		SafetyMoneyApplyPg safetyMoneyApplyPg = (SafetyMoneyApplyPg) this.safeManageDAO.findById(beanName, uuid);
		this.safeManageDAO.delete(safetyMoneyApplyPg);
	}
	public Object findBeanByProperty(String beanName,String propertyName,String value){
		return this.safeManageDAO.findBeanByProperty(beanName, propertyName, value);
	}
}
