/***********************************************************************
 * Module:  INFManageImpl.java
 * Author:  lixiaob
 * Purpose: Defines the Class INFManageImpl
 ***********************************************************************/

package com.sgepit.pmis.INFManage.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.frame.sysman.service.SystemMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.INFManage.dao.INFManageDAO;
import com.sgepit.pmis.INFManage.hbm.INFDAML;
import com.sgepit.pmis.INFManage.hbm.INFSORT;
import com.sgepit.pmis.INFManage.hbm.InfEleArc;
import com.sgepit.pmis.INFManage.hbm.ObjDaml;


/** @pdOid df9d644d-22b8-44b6-a838-6b519b9b24f9 */
public class INFManageImpl extends BaseMgmImpl implements INFMgmFacade {

	private INFManageDAO infmanageDAO;
	private INFManageImpl infmanImpl;
	private BusinessException businessException;

	public static INFManageImpl getFromApplicationContext(ApplicationContext ctx) {

		return (INFManageImpl) ctx.getBean("infMgm");
	}

	public void setInfmanageDAO(INFManageDAO infmanageDAO) {

		this.infmanageDAO = infmanageDAO;
	}

	public void saveSort(INFSORT infNo) {
		this.infmanageDAO.insert(infNo);
	}

	public void saveMainte(INFSORT infNo) {
		infNo.setParent("0"); // 建立父结点 0为默认值
		infNo.setLeaf(new Long(0));// 建立叶子结点 0为默认值
		this.infmanageDAO.saveOrUpdate(infNo);

	}

	public INFSORT getINFSor() {
		// TODO: implement
		INFSORT infsort = new INFSORT();
		List list = this.infmanageDAO.findOrderBy2("INFSORT",null);
		if (list.size() >= 1) {
			infsort = (INFSORT) list.get(0);
			return infsort;
		}
		return null;
	}

	public List getINFSortlist(String parentId) {
		List list = new ArrayList();

		try {
			String parent = parentId != null ? parentId
					: Constant.APPModuleRootID;

			List modules = this.infmanageDAO.findByProperty(
					BusinessConstants.Zl_PACKAGE
							.concat(BusinessConstants.Inf_Sort), "parent",
					parent);

			Collections.sort(modules, new SortOrderAsc());
			Iterator itr = modules.iterator();
			while (itr.hasNext()) {
				INFSORT temp = (INFSORT) itr.next();
				list.add(temp);
				if (temp.getLeaf().intValue() == 0) {
					list.addAll(getINFSortlist(temp.getTreeData()));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	class SortOrderAsc implements Comparator<Object> {
		public int compare(Object arg0, Object arg1) {
			if (arg0 instanceof INFSORT && arg1 instanceof INFSORT) {
				return ((INFSORT) arg0).getBmPos().intValue()
						- ((INFSORT) arg1).getBmPos().intValue();
			}
			return 0;
		}
	}

	/**
	 * 更新资料分类信息
	 * 
	 * @param infsort
	 * @pdOid f00903ee-1bd0-4136-bd22-90a3ccd727e7
	 */
	public void updateINFSort(INFSORT infsort) {
		this.infmanageDAO.saveOrUpdate(infsort);
	}

	public void delINFSort(List list) {
		// TODO: implement
		this.infmanageDAO.deleteAll(list);

	}

	public String checkDeptIntact(INFDAML infdaml) {
		StringBuffer msg = new StringBuffer("");
		/*
		 * 检查数据是否唯一
		 */

		
		String where = " orgid = '" + infdaml.getOrgid() + "' and treeData='" + infdaml.getTreeData() + "'  and FILENO='" + infdaml.getWjbh() + "'";;
		List list = this.infmanageDAO.findByWhere(BusinessConstants.Zl_PACKAGE.concat(BusinessConstants.Inf_DAML), where);		
		if (list.size()> 0) {
			msg.append(new BusinessException(BusinessConstants.MSG_INF_IS_NOT_UNIQUEE));
			msg.append("<br>");	
		}
		return msg.toString();
	}

	/**
	 * 提交部门资料录入
	 * 
	 * @param infdaml
	 * @throws SQLException
	 * @pdOid 726a773d-2cb2-4754-9ba9-e63c85823ed7
	 */
	public void saveDeptInfo(INFDAML infdaml) throws SQLException {
		infdaml.setBillState(new Long(0));
		this.infmanageDAO.saveOrUpdate(infdaml);
	}

	/*
	 * 根据用户名得到用户id
	 */
	public List finduser(String name) {
		return this.infmanageDAO.findByProperty("SysUser", "username", name);

	}

	public void getuserid(String username) {
//		SysUser sysuser = new SysUser();
//		SystemMgmImpl sys = new SystemMgmImpl();
//
//		sysuser = (SysUser) sys.findBeanByProperty("SysUser", "username",
//				username);
		
		//按新框架修改
		RockUser sysuser = new RockUser();
		SystemMgmImpl sys = new SystemMgmImpl();

		sysuser = (RockUser) sys.findBeanByProperty("SysUser", "username",
				username);

	}

	/**
	 * 提交部门的资料移交
	 * 
	 * @param
	 * @throws BusinessException
	 * @pdOid
	 */
	public void saveDeptHandover(String[] ids) throws BusinessException {
		
		INFDAML daml;
          for(int i=0;i<ids.length;i++){
        	  daml = (INFDAML) this.infmanageDAO
				.findById(BusinessConstants.Zl_PACKAGE
						.concat(BusinessConstants.Inf_DAML), ids[i]);
        	  daml.setBillState(new Long(-1));
      		  this.infmanageDAO.saveOrUpdate(daml);
          }
	
	}
	


	/**
	 * 资料管理员确认移交
	 * 
	 * @param
	 * @pdOid
	 */
	public void Handovered(String[] ids) throws BusinessException {

		INFDAML daml;
		for(int i=0;i<ids.length;i++){
		daml = (INFDAML) this.infmanageDAO
				.findById(BusinessConstants.Zl_PACKAGE
						.concat(BusinessConstants.Inf_DAML), ids[i]);
		daml.setBillState(new Long(1));
		this.infmanageDAO.saveOrUpdate(daml);
		 }
	}

	/**
	 * 显示部门资料信息
	 * 
	 * @pdOid c08f8991-ae04-4f0c-9ce5-8e6c58fe1476
	 */
	public INFDAML showINFDept() {
		// TODO: implement
		List list = this.infmanageDAO.findOrderBy2("INFDAML",null);
		INFDAML infdaml = new INFDAML();
		if (list.size() >= 1) {
			infdaml = (INFDAML) list.get(0);
			return infdaml;
		}
		return null;
	}

	/*
	 * 得到资料库列表
	 */
	public List getINFDAML() {

		return this.infmanageDAO.findOrderBy2(BusinessConstants.Zl_PACKAGE
				.concat(BusinessConstants.Inf_DAML), "treeData");

	}

	/**
	 * 更新部门资料信息
	 * 
	 * @param infdaml
	 * @pdOid 5460320d-9bd9-494f-bfed-422a63fe803c
	 */
	public void updateINFDept(INFDAML infdaml) {
		// TODO: implement
		String s[] = infdaml.getFileLsh().split("'");
		infdaml.setFileLsh(s[0]);
		this.infmanageDAO.saveOrUpdate(infdaml);	
	}

	/**
	 * @param infdaml
	 * @pdOid 6edd2912-e2a6-4b8c-b910-941134357262
	 */
	public void delINFDept(INFDAML infdaml) {
		// TODO: implement
		this.infmanageDAO.delete(infdaml);
	}

	/**
	 * 选择需上传文件并上传
	 * 
	 * @param fileNo
	 * @pdOid 1a1ed709-c9e7-47f0-b5c4-5f8b6d5f842d
	 */
	public int selectFile(String fileNo) {
		// TODO: implement
		return 0;
	}

	/**
	 * 效验资料文件是否分类正确 no
	 * 
	 * @param InfNo
	 * @pdOid 1ab59f4b-9b34-406b-8ac6-2f0e4e14a7f7
	 */
	public int checkInfoSort(String InfNo) {
		// TODO: implement

		return 0;
	}

	/**
	 * 提交已选中资料信息
	 * 
	 * @param InfNo
	 * @pdOid 1d756eeb-dfde-4ad5-a918-765f2ceacd4b
	 */
	public void saveInfo(INFDAML infdaml) {
		// TODO: implement
		this.infmanageDAO.saveOrUpdate(infdaml);
	}

	/**
	 * 提交选中的资料文件信息
	 * 
	 * @param InfNo
	 * @pdOid 629b32e1-c12f-4a76-8b81-a9f9e2107a1d
	 */
	public void saveInfFile(INFDAML infdaml) {
		// TODO: implement
		this.infmanageDAO.saveOrUpdate(infdaml);
	}

	/**
	 * 选中正确资料分类并提交
	 * 
	 * @param InfNo
	 * @pdOid 0b077f8c-827e-433a-8399-22cf637a30c3
	 */
	public void saveSelectedSort(String InfNo) {
		// TODO: implement
		INFDAML daml = new INFDAML();

	}

	/**
	 * @param lsh
	 * @param userid
	 * @param groupid
	 * @pdOid 6ccd5d18-0cca-451a-ad97-1e1dcec498e2
	 */
	public void findInfo(String lsh, String userid, String groupid) {
		// TODO: implement
	}

	/**
	 * 对选中用户的权限进行修改并提交(根据用户编号)
	 * 
	 * @param userID
	 * @pdOid e88531a8-0911-4bfe-9eda-cc7205cf8429
	 */
	public void savaEleRchives(String userID) {
		// TODO: implement
	}

	/**
	 * 根据对选中用户的权限进行修改并提交(userid+groupid)
	 * 
	 * @param userID
	 * @param groupID
	 * @pdOid c04af834-0cb8-409f-a9bc-5b97f11b8f65
	 */
	public void saveEleRchives(String userID, String groupID) {
		// TODO: implement

	}

	/**
	 * 根据登陆用户权限
	 * 
	 * @param userID
	 * @param groupID
	 * @pdOid ab6079b1-d819-42b4-9a0f-214cb3c3538d
	 */
	public List findEleRchives(String roleId) {
		// TODO Auto-generated method stub
		// this.infmanageDAO.findById("INFELEARC", roleId);

		return this.infmanageDAO.findByProperty("INFELEARC", "roleId", roleId);

	}

	/**
	 * @param beanName
	 * @param propertyName
	 * @param value
	 * @pdOid 2826a9e0-345a-4f74-841b-d656ab9aebe2
	 */
	public List findInfByProperty(String beanName, String propertyName,
			Object value) {
		// TODO: implement
		return null;
	}

	/**
	 * @return the infmanImpl
	 */
	public INFManageImpl getInfmanImpl() {
		return infmanImpl;
	}

	/**
	 * @param infmanImpl
	 *            the infmanImpl to set
	 */
	public void setInfmanImpl(INFManageImpl infmanImpl) {
		this.infmanImpl = infmanImpl;
	}

	/**
	 * 获取分类树节点
	 * 
	 * @param parentId
	 * @return
	 */
	private List<TreeNode> buildModuleTreeNodes(String parentId) {
		List<INFSORT> list = getModulesByParentId(parentId);

		List<TreeNode> tree = new ArrayList<TreeNode>();
		for (int i = 0; i < list.size(); i++) {
			INFSORT sort = (INFSORT) list.get(i);
			TreeNode treeNode = new TreeNode();
			treeNode.setId(sort.getTreeData());
			treeNode.setText(sort.getTreeLabel());
			treeNode.setDescription("");
			treeNode.setCls("cls");
			treeNode.setIconCls(sort.getIconcls());
			treeNode.setLeaf(sort.getLeaf().intValue() == 1 ? true : false);
			treeNode.setHref(sort.getAction());
			tree.add(treeNode);
		}
		return tree;
	}

	/*
	 * 通过父节点id查找模块 (non-Javadoc)
	 * 
	 * @see com.hdkj.webpmis.domain.business.SystemMgmFacade#getModulesByParentId(java.lang.String)
	 */
	public List<INFSORT> getModulesByParentId(String parentId) {
		List<INFSORT> list = this.infmanageDAO.findByProperty(
				BusinessConstants.Inf_Sort, "parent", parentId, "pid");
		return list;
	}

	/*
	 * 获取资料管理模块中的树，动态加载节点 (non-Javadoc)
	 * 
	 * @see com.hdkj.webpmis.domain.business.BaseMgmImpl#buildTreeNodes(java.lang.String,
	 *      java.lang.String)
	 */
	public List<TreeNode> buildTreeNodes(String treeName, String parentId) {
		List<TreeNode> list = null;
		if (treeName.equals(BusinessConstants.TREE_INF_SORT)) {
			list = buildModuleTreeNodes(parentId);
		}
		return list;
	}

	public List getCodeValue(String catagory) {
		List list = new ArrayList();
//		AppCodecatagory cat = (AppCodecatagory) this.infmanageDAO
//				.findBeanByProperty(BusinessConstants.APP_PACKAGE
//						.concat(BusinessConstants.APP_CODECATAGORY),
//						"catagory", catagory);
//		if (cat != null) {
//			list = this.infmanageDAO.findByProperty(
//					BusinessConstants.APP_PACKAGE
//							.concat(BusinessConstants.APP_CODEVALUE), "catid",
//					cat.getCatid(), "vieworder");
//		}
		
		PropertyType cat = (PropertyType) this.infmanageDAO
		.findBeanByProperty("com.sgepit.frame.sysman.hbm.PropertyType",
				"typeName", catagory);
		if (cat != null) {
			list = this.infmanageDAO.findByProperty(
					"com.sgepit.frame.sysman.hbm.PropertyCode", "uids",
					cat.getUids(), "vieworder");
		}
		return list;
	}

	/*
	 * 从sys_org表取出信息，并保存到inf_sort表中
	 */

	public void initSysOrgInfo() {
		List list = this.infmanageDAO.findOrderBy2("INFSORT",null);
		this.infmanageDAO.deleteAll(list);
		deepIn("0", "0");

	}

	private void deepIn(String parentId, String treedata) {
		List list = this.infmanageDAO.findByWhere(
				"com.sgepit.frame.sysman.hbm.PropertyType", "parent='"
						+ parentId + "' and property<=2", "");
		for (int i = 0; i < list.size(); i++) {
			SgccIniUnit org = (SgccIniUnit) list.get(i);
			List temp = this.infmanageDAO.findByWhere(
					"com.sgepit.frame.sysman.hbm.PropertyCode",
					"parent='" + org.getUnitid().toString() + "' and property<=2", "");
			INFSORT sort = new INFSORT();
			sort.setBmPos(new Long(org.getViewOrderNum()));
			sort.setParent(treedata);
			sort.setLeaf(temp.size() > 0 ? new Long("0") : new Long("1"));
			sort.setTreeLabel(org.getUnitname());
			sort.setPid("111");
			this.infmanageDAO.insert(sort);
			deepIn(org.getUnitid(), sort.getTreeData());
		}

	}

	public INFDAML getDaml(String id) {
		return (INFDAML) this.infmanageDAO
				.findById(BusinessConstants.Zl_PACKAGE
						.concat(BusinessConstants.Inf_DAML), id);
	}
	/*
	 *  获得资料分类 - 整改树
	 */
	public List<ColumnTreeNode> InfSortTree(String parentId,String orgid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		
		String parent = parentId != null && !parentId.equals("") ? parentId: com.sgepit.pmis.common.BusinessConstants.APPBudgetRootID;
		StringBuffer bfs = new StringBuffer();
		bfs.append("parent='" + parent);
		if (null != orgid && !orgid.equals("")) {
			bfs.append("' and orgid='" + orgid);
		}
		bfs.append("' order by bmpos ");

		List modules = this.infmanageDAO
				.findByWhere(BusinessConstants.Zl_PACKAGE
						.concat(BusinessConstants.Inf_Sort), bfs.toString());
		
		//String str = "parent='"+ parent +"' order by treeData ";
		//List<INFSORT> objects = this.infmanageDAO.findByWhere(BusinessConstants.Zl_PACKAGE.concat(BusinessConstants.Inf_Sort), str);
		
		
		Iterator<INFSORT> itr = modules.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			INFSORT temp = (INFSORT) itr.next();
			int leaf = temp.getLeaf().intValue();			
			n.setId(temp.getTreeData());			// treenode.id
			n.setText(temp.getTreeLabel());		// treenode.text
			
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				//n.setIconCls("task-folder");	// treenode.iconCls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}


//	public String getListSortModules(String parentId, String orgid)
//			throws BusinessException {
//		StringBuffer sbf = new StringBuffer("[");
//		try {
//			String parent = parentId != null ? parentId : Constant.SortRootID;
//
//			StringBuffer bfs = new StringBuffer();
//			bfs.append("parent='" + parent);
//			if (null != orgid && !orgid.equals("")) {
//				bfs.append("' and orgid='" + orgid);
//			}
//			bfs.append("' order by bmpos ");
//
//			List modules = this.infmanageDAO
//					.findByWhere(BusinessConstants.Zl_PACKAGE
//							.concat(BusinessConstants.Inf_Sort), bfs.toString());
//
//			Iterator itr = modules.iterator();
//			while (itr.hasNext()) {
//				INFSORT temp = (INFSORT) itr.next();
//				int leaf = temp.getLeaf().intValue();
//				sbf.append("{treeData:'");
//				sbf.append(temp.getTreeData());
//				sbf.append("',pid:'");
//				sbf.append(temp.getPid());
//				sbf.append("',treeLabel:'");
//				sbf.append(temp.getTreeLabel());
//				sbf.append("',bm:'");
//				sbf.append(temp.getBm());
//				sbf.append("',bmPos:'");
//				sbf.append(temp.getBmPos());
//				//
//				sbf.append("',orgid:'");
//				sbf.append(temp.getOrgid());
//
//				//
//				sbf.append("',action:'");
//				sbf.append(temp.getAction());
//				sbf.append("',leaf:");
//				sbf.append(temp.getLeaf());
//				sbf.append(",parent:'");
//				sbf.append(temp.getParent());
//				sbf.append("',uiProvider:'col'");
//				if (0 == leaf) {
//					bfs.append(",cls:'master-task',iconCls:'task-folder'");
//					// sbf.append(",children:");
//					// sbf.append(getListSortModules(temp.getTreeData()));
//				} else {
//					sbf.append(",iconCls:'task',leaf:true");
//				}
//				sbf.append("}");
//				if (itr.hasNext()) {
//					sbf.append(",");
//				}
//			}
//			sbf.append("]");
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new BusinessException(e.getMessage());
//		}
//
//		return sbf.toString();
//	}

	/*
	 * public String getBdgModTree(String treeData, String orgid) throws
	 * BusinessException { // HashMap<String, SysModule> map = new HashMap<String,
	 * SysModule>(); List list = this.infmanageDAO
	 * .findByProperty(BusinessConstants.Zl_PACKAGE
	 * .concat(BusinessConstants.Inf_Sort), "treeData", treeData); String str =
	 * getListSortModules("root", orgid); return str; }
	 */

	public int addOrUpdate(INFSORT infsort, String action, String orgid) {
		int flag = 0;
		String beanName = BusinessConstants.Zl_PACKAGE
				+ BusinessConstants.Inf_Sort;
		try {
			if ("".equals(infsort.getTreeData())) { // 新增
				/*
				 * 当新增节点是它父节点的第一个子节点，如果该父节点(新 增前是没子节点)原来是[工程量]，就要自动改成[概算]！
				 */
				// 查找是否有同级节点
				List list = (List) this.infmanageDAO.findByProperty(beanName,
						"parent", infsort.getParent());
				if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
					INFSORT parentBdg = (INFSORT) this.infmanageDAO.findById(
							beanName, infsort.getParent());
					parentBdg.setLeaf(new Long(0));
					parentBdg.setOrgid(parentBdg.getOrgid());
					this.updateINFSort(parentBdg);
				}
				String str = this.getNewAction(action, orgid);

				if (str == null || str.equals("")) {
					return 0;
				}
				if (str.substring(str.length() - 2, str.length()).equals("99")) {
					return 1;
				}
				infsort.setAction(str);
				infsort.setOrgid(orgid);
				this.saveSort(infsort);
			}else{
				infsort.setAction(action);
				infsort.setOrgid(orgid);
				this.updateINFSort(infsort);
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	public int deleteChildNode(String bdgId) {
		int flag = 0;
		String beanName = BusinessConstants.Zl_PACKAGE
				+ BusinessConstants.Inf_Sort;
		try {
			INFSORT infsort = (INFSORT) this.infmanageDAO.findById(beanName,
					bdgId);
			List list = (List) this.infmanageDAO.findByProperty(beanName,
					"parent", infsort.getParent());
			if (list != null) {
				if (list.size() == 1) { // 删除的节点为该父节点的最后一个
					INFSORT sort = (INFSORT) this.infmanageDAO.findById(
							beanName, infsort.getParent());
					sort.setLeaf(new Long("1"));
					this.updateINFSort(sort);
				}
				this.infmanageDAO.delete(infsort);
			} else {
				flag = 1;
			}
		} catch (Exception e) {
			flag = 1;
			e.printStackTrace();
		}
		return flag;
	}

	/**
	 * 取当前对应字节点的资料编号
	 * 
	 * @param
	 * @return
	 */
	public String getNewAction(String antion, String orgid) {
		String rs = null;
		try {
			String sql = "select max(action) from inf_sort where length(action)="
					+ String.valueOf(antion.length() + 2)
					+ " and action like '"
					+ antion
					+ "%' and orgid='"
					+ orgid
					+ "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			rs = (String) jdbc.queryForObject(sql, String.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null == rs || rs.equals("") ? antion + "01" : rs
				.substring(0, 32)
				+ ((String.valueOf(Integer.parseInt(rs.substring(32)) + 1))
						.length() == 2 ? String.valueOf(Integer.parseInt(rs
						.substring(32)) + 1)
						: "0"
								+ String.valueOf(Integer.parseInt(rs
										.substring(32)) + 1));
	}

	/*
	 * 通过DWR获取部门资料名称
	 */
	public List getdeptname() {

		List list = this.infmanageDAO.findOrderBy2("com.sgepit.frame.sysman.hbm.SgccIniUnit",null);
		return list;

	}

	/**
	 * 新增合同信息上传功能 lixiaob
	 * 
	 * @param
	 * @return
	 */
	public List getConUpload(String cid) {
		List list = new ArrayList();
		try {
			String sql = "select * from OBJ_DAML where cid='" + cid + "'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			list = jdbc.queryForList(sql);
			StringBuffer bf = new StringBuffer();
			bf.append("");
			Iterator itr = list.iterator();
			list = null;
			while (itr.hasNext()) {
				Map m = (Map) itr.next();
				bf.append(",");
				bf.append((String) m.get("runningnumber"));

			}
			sql = "select * from INF_DAML where RUNNINGNUMBER in("
					+ bf.toString() + ")";
			list = jdbc.queryForList(sql);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;

	}

	/**
	 * 保存同信息上传资料,同时保存到中间OBJ_DAML表 lixiaob
	 * 
	 * @param
	 * @return
	 */

	public void saveConUpload(INFDAML infdaml) {

		this.infmanageDAO.saveOrUpdate(infdaml);
		String uid = infdaml.getLsh();
		ObjDaml objdaml = new ObjDaml();
		objdaml.setCid(infdaml.getConid());
		infdaml = (INFDAML) this.infmanageDAO
				.findById(BusinessConstants.Zl_PACKAGE
						.concat(BusinessConstants.Inf_DAML), uid);
		if (infdaml != null) {
			objdaml.setRunningnumber(infdaml.getLsh());
			this.infmanageDAO.saveOrUpdate(objdaml);
		}

	}

	
	/*
	 * 新增电子文档用户DWR
	 */
	public void saveInfEleArc(String[] ids,String grade){
		InfEleArc infelearc;
		for(int i=0;i<ids.length;i++){
			infelearc=new InfEleArc();
			infelearc.setUserid(ids[i]);
			infelearc.setGrade(grade);
			this.infmanageDAO.saveOrUpdate(infelearc);
		}
		
	}
	/*
	 * 新增电子文档密级DWR
	 */
	
	public void saveInfGrade(String[] ids,String grade){
		INFDAML infdaml;
		for(int i=0;i<ids.length;i++){
			infdaml=new INFDAML();
			infdaml.setUserid(ids[i]);
			infdaml.setInfgrade(new Long(grade));
			this.infmanageDAO.saveOrUpdate(infdaml);
		}
		
	}
	
	/*
	 * 根据用户id得到用户名称
	 */
	public List getusername()
	{
		String beanName="com.sgepit.frame.sysman.hbm.RockUser";
		
		List list =  this.infmanageDAO.findOrderBy2(beanName,null);
		//for(int i=0;i<list.size();i++){
		//	SysUser c = (SysUser)list.get(i);
		//	System.out.println("---------------->"+c.getUsername()+"--"+c.getUserid());
		//}
		return list;
	}
	/*
	 * DWR方法,根据用户对象查找存在的userid
	 */
	public List getExistUserid(){
		String beanName=BusinessConstants.Zl_PACKAGE + BusinessConstants.Inf_EleArc;
		List list =this.infmanageDAO.findOrderBy2(beanName,null);
		//for(int i=0;i<list.size();i++){
			//list=(List)list.get(i);
			//return list;
		//}
		return list;
	}
	
	/*
	 * 部门资料验证资料信息,如果资料信息已经被确认,则在部门资料页面不能被删除
	 */
	public String checkDelete(String[] lsh) throws SQLException,
	BusinessException {
		String state = "";
		String BeanName = BusinessConstants.Zl_PACKAGE + BusinessConstants.Inf_DAML;
		for (int i = 0; i < lsh.length; i++){
			List list =this.infmanageDAO.findByWhere(BeanName,"lsh='"+lsh[i]+"' and billState=1 ");
			//List list = this.infmanageDAO.findByProperty(BeanName, "lsh", lsh[i], "billState=1", "");
			if (!list.isEmpty()){
				state = "该资料信息已经被确认，不能被删除！";
				break;
			}
		}
		return state;

}
	/*
	 * 得到资料密级列表
	 */
	public List getcodecatagory(String catagory){
		 String BeanName = "com.sgepit.frame.sysman.hbm.PropertyType";
		 String beanName = "com.sgepit.frame.sysman.hbm.PropertyCode";
		 List list=this.infmanageDAO.findByProperty(BeanName, "catagory", catagory);
    	// AppCodecatagory appvalue=(AppCodecatagory)list.get(0); PropertyType
		 PropertyType appvalue=(PropertyType)list.get(0);
		 return this.infmanageDAO.findByProperty(beanName, "catid",appvalue.getUids());
	
	}
	
	/*
	 * 电子文档权限判断
	 */
	public List findwhereorderby(String beanName, String where, String a, Integer c, Integer b)
	{
	
		List list = this.infmanageDAO.findByWhere(beanName, where, a, c, b);
		List arr = new ArrayList();
		INFDAML infDaml;
		for(int i=0;i<list.size();i++){	
			if(i == list.size()-1){
				arr.add(list.get(i));
				break;
			}
			infDaml = new INFDAML();
			infDaml = (INFDAML)list.get(i);
			infDaml.setFileLsh(infDaml.getFileLsh() + "'" +infDaml.getInfgrade());
			arr.add(infDaml);
		}
		return arr;
	}
	/*
	 * 根据用户id得到用户电子文档权限
	 */
	public String getusergrade(String userid){
		String str = "1";
		String beanName = BusinessConstants.Zl_PACKAGE+BusinessConstants.Inf_EleArc;
		InfEleArc ele=new InfEleArc();
		List list = this.infmanageDAO.findByProperty(beanName, "userid", userid);
		if(list != null && list.size()>0){
			ele = (InfEleArc)list.get(0);
			str = ele.getGrade();
		}
		return str;
	}
	/*
	 * 根据用户名称得到用户id
	 */
	public String getusergradeid(String username){
		String beanName="com.sgepit.frame.sysman.hbm.RockUser";
//		SysUser sysuser=new SysUser();
//		if(sysuser!=null){
//		sysuser=(SysUser)this.infmanageDAO.findBeanByProperty(beanName, "realname", username);
//			return sysuser.getUserid();
//		}
		
		RockUser sysuser=new RockUser();
		if(sysuser!=null){
		sysuser=(RockUser)this.infmanageDAO.findBeanByProperty(beanName, "realname", username);
			return sysuser.getUserid();
		}
		
		return "该用户没有设置电子文档权限";
	}
	
	/*
	 * DWR如果文件流水号不为空调用此方法 上传保存流水号和文件名称
	 */
	public String saveuploaddata(String id,String filename,String filelsh){
		String str = "111";
		String beanName = BusinessConstants.Zl_PACKAGE+BusinessConstants.Inf_DAML;
		INFDAML infdaml=new INFDAML();
		infdaml=(INFDAML)this.infmanageDAO.findById(beanName, id);
		if(infdaml!=null){
			infdaml.setFileLsh(filelsh);
			infdaml.setFileName(filename);
			this.infmanageDAO.saveOrUpdate(infdaml);
		}
		return str;
	}
	
	/*
	 * 批量修改资料分类DWR
	 */
	public void saveInfEditSort(String[] ids,String editsort){
		String beanName = BusinessConstants.Zl_PACKAGE+BusinessConstants.Inf_DAML;
		INFDAML infdaml;
		for(int i=0;i<ids.length;i++){
			infdaml=(INFDAML)this.infmanageDAO.findById(beanName, ids[i]);
			infdaml.setTreeData(editsort);
			this.infmanageDAO.saveOrUpdate(infdaml);
		}
	}
	
	/*
	 * 批量修改资料密级DWR
	 */
	public void saveEditInfGrade(String[] ids,String editinfgrade){
		String beanName = BusinessConstants.Zl_PACKAGE+BusinessConstants.Inf_DAML;
		INFDAML infdaml;
		for(int i=0;i<ids.length;i++){
			infdaml=(INFDAML)this.infmanageDAO.findById(beanName, ids[i]);
			infdaml.setInfgrade(new Long(editinfgrade));
			this.infmanageDAO.saveOrUpdate(infdaml);
		}
	}
	/*
	 * 资料分类查询dwr
	 */
	public String  querySort(String str){
		StringBuffer treedate = new StringBuffer();
		String beanName1 = BusinessConstants.Zl_PACKAGE+BusinessConstants.Inf_Sort;
		INFSORT infsort;
		List list = this.infmanageDAO.findByWhere(beanName1, " treeLabel like '%"+str+"%'");
		if(list.size()>0){
			treedate.append("(");
			for(int i=0;i<list.size();i++){
			  infsort=new INFSORT(); 
			  infsort=(INFSORT)list.get(i);
			  
			  if(treedate.length()==1){
				  
				  treedate.append("treedata like "+"'"+infsort.getAction()+"%"+"'");
			  }else{
				  treedate.append("or");
				  treedate.append(" "+"treedata like "+"'"+infsort.getAction()+"%"+"'");
			  }
			}
			treedate.append(")");		
		}
		
		return treedate.toString();
	}
	
}