package com.sgepit.pmis.document.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.document.dao.SafetyDAO;
import com.sgepit.pmis.document.hbm.SafSort;
import com.sgepit.pmis.document.hbm.SafetySortIniti;


public class SafetyMgmImpl extends BaseMgmImpl  implements SafetyMgmFacade{

	private SafetyDAO safetyDAO;
	
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static SafetyMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (SafetyMgmImpl) ctx.getBean("safetyMgm");
	}

	/**
	 * @return the safetyDAO
	 */
	public SafetyDAO getSafetyDAO() {
		return safetyDAO;
	}

	/**
	 * @param safetyDAO the safetyDAO to set
	 */
	public void setSafetyDAO(SafetyDAO safetyDAO) {
		this.safetyDAO = safetyDAO;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#SafeTree(java.lang.String)
	 */
	public List<ColumnTreeNode> SafeTree(String parentId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		String str = "parent='"+ parent +"' order by safid ";
		List<SafSort> objects = this.safetyDAO.findByWhere(BusinessConstants.SAFE_PACKAGE.concat(BusinessConstants.SAFE_SORT), str);
		Iterator<SafSort> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			SafSort temp = (SafSort) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getSafid());			// id
			n.setText(temp.getPname());		// text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("task");				// cls
			} else {
				n.setLeaf(false);				// leaf
				n.setCls("master-task");
				n.setIconCls("task-folder");	// iconCls
			}
			cn.setTreenode(n);
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	

		/*
		 * (non-Javadoc)
		 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#addOrUpdate(com.hdkj.webpmis.domain.adjunct.TreeInfo)
		 */
		public int addOrUpdate(SafSort safsort) {
			int flag = 0;
			String beanName = BusinessConstants.SAFE_PACKAGE
					+ BusinessConstants.SAFE_SORT;
			try {
				if ("".equals(safsort.getSafid())) { // 新增
					/*
					 * 当新增节点是它父节点的第一个子节点.
					 */
					// 查找是否有同级节点
					List list = (List) this.safetyDAO.findByProperty(beanName,
							"parent", safsort.getParent());
					if (list.isEmpty() && !"0".equals(safsort.getParent()) ) { // 新增节点是它父节点的第一个子节点
						SafSort parentBdg = (SafSort) this.safetyDAO.findById(
								beanName, safsort.getParent());
						parentBdg.setIsleaf(new Long(0));
						this.safetyDAO.saveOrUpdate(parentBdg);
						safsort.setIsleaf(new Long(1));
						this.insertSafSort(safsort);
					}
					//如果新增节点不是它父节点的第一个子节点
					else{
						
						this.insertSafSort(safsort);
					}
				}else{
						//修改
						
						this.updateSafSort(safsort);
				}
				this.sumSafeHandler(safsort.getParent());
			} catch (Exception e) {
				flag = 1;
				e.printStackTrace();
			}
			return flag;
		}

	/*
	 * (non-Javadoc)
	 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#deleteChildNode(java.lang.String)
	 */
		public int deleteChildNode(String safid) {
			int flag = 0;
			String beanName = BusinessConstants.SAFE_PACKAGE+ BusinessConstants.SAFE_SORT;
			try {
				SafSort safsort = (SafSort) this.safetyDAO.findById(beanName,safid);
				
				List list = (List) this.safetyDAO.findByProperty(beanName,"parent", safsort.getParent());
				
				if (list != null) {
					SafSort sort = null;
					if (list.size() == 1) { // 删除的节点为该父节点的最后一个
						sort = (SafSort) this.safetyDAO.findById(
								beanName, safsort.getParent());
						sort.setIsleaf(new Long(1));
						this.safetyDAO.saveOrUpdate(sort);
					}
					    this.sumForDelete(safsort);//
						this.safetyDAO.delete(safsort);
				} else {
					flag = 1;
				}
			} catch (Exception e) {
				flag = 1;
				e.printStackTrace();
			}
			return flag;
		}
		
		/*
		 * 删除初始化的打分树
		 */
		public void DelInitTree(String safeid){
			String beanName1= BusinessConstants.SAFE_PACKAGE
			+ BusinessConstants.SAFE_SORT_INTI;
			List list=this.safetyDAO.findByProperty(beanName1, "safeexamin", safeid);
			this.safetyDAO.deleteAll(list);
		}
		/*
		 * 初始化安全分类树
		 * 
		 */
		public void initTree(String safeid) throws BusinessException{
			String beanName = BusinessConstants.SAFE_PACKAGE+ BusinessConstants.SAFE_SORT;
			String beanName1= BusinessConstants.SAFE_PACKAGE+ BusinessConstants.SAFE_SORT_INTI;
			//初始化删除数据
			//List list = this.safetyDAO.findAll(beanName1);

			  List list=this.safetyDAO.findByProperty(beanName1, "safeexamin", safeid);
			  if(list.size()>0){
				  this.safetyDAO.deleteAll(list);
			  }
	
			//
			List list1=this.safetyDAO.findOrderBy2(beanName, null);
			try {
//			SafSort saf;
//			SafetySortIniti safinit;
			if(list1.size()>0){
				for(int i=0;i<list1.size();i++){
//				 saf=new SafSort();
				 SafSort saf=(SafSort)list1.get(i);
				 SafetySortIniti safinit=new SafetySortIniti();
				 
				 safinit.setContentneed(saf.getContent());
				 safinit.setGradecriterion(saf.getGrade());
				 safinit.setItemname(saf.getPname());
				 safinit.setParent(saf.getParent());
				 safinit.setIsleaf(saf.getIsleaf());
				 
				 safinit.setTreedata(saf.getSafid());
				 
				 safinit.setScore(saf.getScore());
				 safinit.setSafeexamin(safeid);
				 this.insertSafSortInit(safinit);
				}
			}
					
		 } catch (SQLException e) {
					 e.printStackTrace();}
			}
			
	
	/*
	 * (non-Javadoc)
	 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#InitSafeTree(java.lang.String)
	 */
	public List<ColumnTreeNode> InitSafeTree(String parentId,String safeexamin)
		throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
		StringBuffer bfs = new StringBuffer();
		bfs.append("parent='" + parent);
		if (null != safeexamin && !safeexamin.equals("")) {
			bfs.append("' and safeexamin='" + safeexamin);
		}
		//String str = "parent='"+ parent +"' order by uuid ";
		bfs.append("' order by uuid ");
		List<SafetySortIniti> objects = this.safetyDAO.findByWhere(BusinessConstants.SAFE_PACKAGE.concat(BusinessConstants.SAFE_SORT_INTI), bfs.toString());
		Iterator<SafetySortIniti> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			SafetySortIniti temp = (SafetySortIniti) itr.next();
			int leaf = temp.getIsleaf().intValue();			
			n.setId(temp.getUuid());			// id
			n.setText(temp.getItemname());		// text
			if (leaf == 1) {
				n.setLeaf(true);
				n.setIconCls("task");				// cls
			} else {
				n.setLeaf(false);				// leaf
				n.setCls("master-task");
				n.setIconCls("task-folder");	// iconCls
			}
			cn.setTreenode(n);
			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
			return list;
}

		/*
		 * (non-Javadoc)
		 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#deleteSafSort(com.hdkj.webpmis.domain.safety.SafSort)
		 */
		public void deleteSafSort(SafSort safsort) throws SQLException,
				BusinessException {
			// TODO Auto-generated method stub
			this.safetyDAO.delete(safsort);
		}
		/*
		 * (non-Javadoc)
		 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#insertSafSort(com.hdkj.webpmis.domain.safety.SafSort)
		 */
		public void insertSafSort(SafSort safsort) throws SQLException,
				BusinessException {
			// TODO Auto-generated method stub
			this.safetyDAO.insert(safsort);
			
		}
		/*
		 * (non-Javadoc)
		 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#updateSafSort(com.hdkj.webpmis.domain.safety.SafSort)
		 */
		public void updateSafSort(SafSort safsort) throws SQLException,
				BusinessException {
			// TODO Auto-generated method stub
			this.safetyDAO.saveOrUpdate(safsort);
		}
		/*
         * (non-Javadoc)
         * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#deleteSafSortInit(com.hdkj.webpmis.domain.safety.SafetySortIniti)
         */
		public void deleteSafSortInit(SafetySortIniti safsortinit)
				throws SQLException, BusinessException {
			// TODO Auto-generated method stub
			this.safetyDAO.delete(safsortinit);
		}
        /*
         * (non-Javadoc)
         * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#insertSafSortInit(com.hdkj.webpmis.domain.safety.SafetySortIniti)
         */
		public void insertSafSortInit(SafetySortIniti safsortinit)
				throws SQLException, BusinessException {
			// TODO Auto-generated method stub
//			this.safetyDAO.insert(safsortinit);
			this.safetyDAO.saveOrUpdate(safsortinit);
		}
        /*
         * (non-Javadoc)
         * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#updateSafSortInit(com.hdkj.webpmis.domain.safety.SafetySortIniti)
         */
		public void updateSafSortInit(SafetySortIniti safsortinit)
				throws SQLException, BusinessException {
			// TODO Auto-generated method stub
			this.safetyDAO.saveOrUpdate(safsortinit);
		}

        /*
         * (non-Javadoc)
         * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#addOrUpdateInit(com.hdkj.webpmis.domain.safety.SafetySortIniti)
         */
		public int addOrUpdateInit(SafetySortIniti safeInit) {
			int flag = 0;
			String beanName = BusinessConstants.SAFE_PACKAGE
					+ BusinessConstants.SAFE_SORT_INTI;
			try {
				if ("".equals(safeInit.getUuid())) { // 新增
					/*
					 * 当新增节点是它父节点的第一个子节点.
					 */
					// 查找是否有同级节点
					List list = (List) this.safetyDAO.findByProperty(beanName,
							"parent", safeInit.getParent());
					if (list.isEmpty()) { // 新增节点是它父节点的第一个子节点
						SafetySortIniti parentBdg = (SafetySortIniti) this.safetyDAO.findById(
								beanName, safeInit.getParent());
						parentBdg.setIsleaf(new Long(0));
						this.safetyDAO.saveOrUpdate(parentBdg);
						safeInit.setIsleaf(new Long(1));
						this.insertSafSortInit(safeInit);
					}
					//如果新增节点不是它父节点的第一个子节点
					else{
						
						this.insertSafSortInit(safeInit);
					}
				}else{
						//修改
					this.updateSafSortInit(safeInit);
				}
				this.sumfinalscore(safeInit.getParent(),safeInit.getSafeexamin());
			} catch (Exception e) {
				flag = 1;
				e.printStackTrace();
			}
			return flag;
		}
		/*
		 * (non-Javadoc)
		 * @see com.hdkj.webpmis.domain.business.safety.SafetyMgmFacade#deleteChildNodeInit(java.lang.String)
		 */
		public int deleteChildNodeInit(String nodeid) {
			int flag = 0;
			String beanName = BusinessConstants.SAFE_PACKAGE
					+ BusinessConstants.SAFE_SORT_INTI;
			try {
				SafetySortIniti safsortinit = (SafetySortIniti) this.safetyDAO.findById(beanName,
						nodeid);
				List list = (List) this.safetyDAO.findByProperty(beanName,
						"parent", safsortinit.getParent());
				if (list != null) {
					SafetySortIniti sort = null;
					if (list.size() == 1) { // 删除的节点为该父节点的最后一个
						sort = (SafetySortIniti) this.safetyDAO.findById(
								beanName, safsortinit.getParent());
						sort.setIsleaf(new Long(1));
						this.safetyDAO.saveOrUpdate(sort);
					}
						this.safetyDAO.delete(safsortinit);
				} else {
					flag = 1;
				}
			} catch (Exception e) {
				flag = 1;
				e.printStackTrace();
			}
			return flag;
		}
      
	/*
	 * 验证主表删除信息
	 */
		
	public String checkDelete(String[] ids) throws SQLException,
		BusinessException {
	String state = "";
	String beanName = BusinessConstants.SAFE_PACKAGE
	+ BusinessConstants.SAFE_JOBEXA_LIST;
		for (int i = 0; i < ids.length; i++){
			List list = this.safetyDAO.findByProperty(beanName, "safejobexid", ids[i]);
			if (!list.isEmpty()){
				state = "有明细信息，不能被删除！";
				break;
			}
		}
		return state;
	}
	/*
	 * 安环初始分类-实际得分求和
	 */
   public void sumfinalscore(String parentId,String safeexamin) throws SQLException, BusinessException{
	   Double db = new Double(0); 
		String beanName = BusinessConstants.SAFE_PACKAGE + BusinessConstants.SAFE_SORT_INTI;
		//List list = (List)this.safetyDAO.findByProperty(beanName, "parent", parentId);
		List list=(List)this.safetyDAO.findByWhere(beanName, "parent='"+parentId+"' and safeexamin='"+safeexamin+"'");
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			SafetySortIniti safsort = (SafetySortIniti) iterator.next();
			Double d = safsort.getFinalscore();
			if(d==null){
				d=new Double(0);
			}
			db+=d;
		}
		//List list2 =(List)this.safetyDAO.findByProperty(beanName, "treedata", parentId);
		List list2 =(List)this.safetyDAO.findByWhere(beanName, "treedata='"+parentId+"' and safeexamin='"+safeexamin+"'");
		if(list2.size()>0){
			
			SafetySortIniti parentInfo = (SafetySortIniti)list2.get(0);
			parentInfo.setFinalscore(db);
			
			this.updateSafSortInit(parentInfo);

			if (!"0".equals(parentInfo.getParent()))
				sumfinalscore(parentInfo.getParent(),parentInfo.getSafeexamin());
		}
	
   }
	/**
	 * 安环分类 - 累计（新增、修改时）
	 * @author lxb
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumSafeHandler(String parentId) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.SAFE_PACKAGE + BusinessConstants.SAFE_SORT;
		List list = (List)this.safetyDAO.findByProperty(beanName, "parent", parentId);
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			SafSort safsort = (SafSort) iterator.next();
			db += safsort.getScore();
		}
		SafSort parentInfo = (SafSort)this.safetyDAO.findById(beanName, parentId);
		if(parentInfo != null)
		{
			parentInfo.setScore(db);
			this.updateSafSort(parentInfo);
		
		if (!"0".equals(parentInfo.getParent()))
			sumSafeHandler(parentInfo.getParent());
		}
	}
	
	
	/**
	 * 安环分类 - 累计（删除时）
	 * @author lxb
	 * @param safsort
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumForDelete(SafSort safsort) throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.SAFE_PACKAGE + BusinessConstants.SAFE_SORT;
		List list = (List)this.safetyDAO.findByProperty(beanName, "parent", safsort.getParent());
		
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			SafSort obj_Info = (SafSort) iterator.next();
			if (obj_Info.getSafid().equals(safsort.getSafid())) continue;
			db += obj_Info.getScore();
		}
		SafSort parentInfo = (SafSort)this.safetyDAO.findById(beanName, safsort.getParent());
		parentInfo.setScore(db);
		this.updateSafSort(parentInfo);
		this.sumSafeHandler(parentInfo.getParent());
	}
	/*
	 * 
	 */
	public Double sumnode(String str)throws SQLException, BusinessException{
		Double db = new Double(0); 
		String beanName = BusinessConstants.SAFE_PACKAGE + BusinessConstants.SAFE_SORT_INTI;
		List list=this.safetyDAO.findByWhere(beanName, "parent='root' and isleaf='0' and safeexamin='"+str+"'");
		SafetySortIniti safinit;
		if(list.size()>0){
			for(int i=0;i<list.size();i++){
				safinit=(SafetySortIniti)list.get(i);
				Double d = safinit.getFinalscore();
				if(d==null){
					d=new Double(0);
				}
				db+=d;
			}
			
		}
		return db;
		
	}
	/*
	 * 求考核平均值，自评平均值
	 */
	public Double avg(String str,String type){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		Double db = new Double(0);
		String sql ="select avg(nvl(t.totalize,0)) as db from safety_job_examine_list t where t.safejobexid='"+str+"' and t.gradeform='"+type+"'"; 
		try {
			db = (Double) jdbc.queryForObject(sql, Double.class);
		} catch (DataAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return db;
	}
	
}
