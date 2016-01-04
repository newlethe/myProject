package com.sgepit.frame.sysman.service;

import java.io.File;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.BeanUtils;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.operatehistory.service.OperateHistoryService;
import com.sgepit.frame.sysman.control.SysServlet;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.AppTemplate;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.frame.sysman.hbm.RockCharacter2power;
import com.sgepit.frame.sysman.hbm.RockPosition;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockPowerUser;
import com.sgepit.frame.sysman.hbm.RockPowerUserFav;
import com.sgepit.frame.sysman.hbm.RockPowerUserFavId;
import com.sgepit.frame.sysman.hbm.RockPowerUserId;
import com.sgepit.frame.sysman.hbm.RockRole;
import com.sgepit.frame.sysman.hbm.RockRole2user;
import com.sgepit.frame.sysman.hbm.RockUnitpos;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.RockUser2dept;
import com.sgepit.frame.sysman.hbm.RockUserLoginLog;
import com.sgepit.frame.sysman.hbm.RockUserOperatemoduleLog;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.hbm.SysGolobal;
import com.sgepit.frame.sysman.hbm.SysPortletConfig;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.MD5Util;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;

/**
 * 系统管理业务逻辑实现类.
 * 
 * @author xjdawu
 * @since 2007.11.21
 */
public class SystemMgmImpl extends BaseMgmImpl implements SystemMgmFacade {

	private SystemDao systemDao;

	private SgccIniUnitDAO sgccIniUnitDAO;
	
	private PropertyCodeDAO propertyCodeDAO;

	private Map<String,PropertyCode> propsMap = new HashMap<String,PropertyCode>();
	/**
	 * @param propertyCodeDAO the propertyCodeDAO to set
	 */
	public void setPropertyCodeDAO(PropertyCodeDAO propertyCodeDAO) {
		this.propertyCodeDAO = propertyCodeDAO;
	}

	/**
	 * @param sgccIniUnitDAO the sgccIniUnitDAO to set
	 */
	public void setSgccIniUnitDAO(SgccIniUnitDAO sgccIniUnitDAO) {
		this.sgccIniUnitDAO = sgccIniUnitDAO;
	}

	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}
	public SystemDao getSystemDao() {
		return systemDao;
	}

	public static SystemMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (SystemMgmImpl) ctx.getBean("systemMgm");
	}

	/*
	 * 获取用户有权限访问的模块集合 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getUserModules(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public HashMap<String, RockPower> getUserModules(RockUser user) {
		HashMap<String, RockPower> map = new HashMap<String, RockPower>();
		//ROCK_ROLE2USER
		List list = systemDao.findByHql("from RockPower m, RockCharacter2power v, RockRole2user u where m.powerpk = v.powerpk and v.rolepk = u.rolepk and u.userid = '" + user.getUserid() + "'");
		for(int i=0; i<list.size(); i++){
			Object[] obj = (Object[])list.get(i); 
			for(int j=0; j<obj.length; j++){
				RockCharacter2power rolemod = (RockCharacter2power)obj[1];
				String modId = rolemod.getPowerpk();
				int lvl = rolemod.getLvl().intValue();
				if (lvl!=BusinessConstants.IDF_SYSROLE_DISABLED.intValue()) {
					RockPower module = (RockPower)obj[0];
					RockPower mod = map.get(modId);
					if (mod != null) {
						if (lvl < mod.getLvl().intValue()) {// 如果当前遍历的模块lvl等级高（数值小），替换Map中的模块lvl值  
							mod.setLvl(lvl);
						}
					} else {
						if (!module.getModelflag().equalsIgnoreCase("3")){// 除去portlet
							module.setLvl(lvl);
							map.put(modId, module);
						}
					}
				}
			}
		}

		return map;
	}

	/*
	 * 从功能模块map中得到排序过的List (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getListedModules(java.util.HashMap)
	 */
	public List<RockPower> getListedModules(HashMap<String, RockPower> map,
			boolean menu) throws BusinessException {
		List<RockPower> list = new ArrayList<RockPower>();
		//RockPower root = (RockPower) this.rockPowerDao.findBeanByProperty("parentid", "0");
		RockPower root = (RockPower) this.systemDao.findBeanByProperty(
				BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_MODULE), "parentid", "0");
		if (Constant.APPModuleRootID == null)
			Constant.APPModuleRootID = root.getPowerpk();
		try {
			list = getLinkedModules(map, root, menu);
		} catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return list;
	}

	/**
	 * 递归得到所有功能模块节点，同级子节点排序
	 * 
	 * @param map
	 * @param parent
	 * @return
	 * @throws Exception
	 */
	private List<RockPower> getLinkedModules(HashMap<String, RockPower> map,
			RockPower parent, boolean menu) throws Exception {
		try {
			List<RockPower> list = new ArrayList<RockPower>();
			Iterator itr = map.entrySet().iterator();
			while (itr.hasNext()) {
				Map.Entry entry = (Map.Entry) itr.next();
				RockPower temp = (RockPower) entry.getValue();
				if (temp.getParentid().equals(parent.getPowerpk())) {
					if (!menu || (menu && !temp.getModelflag().equals("2")))
						list.add(temp);
				}

			}
			Collections.sort(list, new SortOrderAsc());
			List<RockPower> obj = new ArrayList<RockPower>();
			for (int i = 0; i < list.size(); i++) {
				RockPower mod = (RockPower) list.get(i);
				List children = getLinkedModules(map, mod, menu);
				if (children.size() == 0) {
					mod.setLeaf(1);
					obj.add(mod);
				} else {
					obj.add(mod);
					obj.addAll(children);
				}
			}
			return obj;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 根据父节点id，从功能模块集合中得到排序过的所有子节点
	 * 
	 * @param parentId
	 * @param deep
	 * @return
	 * @throws BusinessException
	 */
	public List<RockPower> getListedModules(String parentId, boolean deep)
			throws BusinessException {
		List<RockPower> list = new ArrayList<RockPower>();
		try {
			String parent = (parentId != null ? parentId: Constant.APPModuleRootID);
			//List modules = this.rockPowerDao.findByProperty( "parentid",parent);
			List modules = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_MODULE), "parentid",parent,null,null,null);
			
			Collections.sort(modules, new SortOrderAsc());
			Iterator itr = modules.iterator();
			while (itr.hasNext()) {
				RockPower temp = (RockPower) itr.next();
				list.add(temp);
				//0不是叶子，1叶子
				if (temp.getLeaf().intValue() == 0 && deep) {
					list.addAll(getListedModules(temp.getPowerpk(), true));
				}
			}
		} catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return list;
	}

	/**
	 * 按照RockPower.bindex排序; 按照SysOrg.ordernum排序
	 * 
	 * @author xjdawu
	 */
	class SortOrderAsc implements Comparator<Object> {
		public int compare(Object arg0, Object arg1) {
			if (arg0 instanceof RockPower && arg1 instanceof RockPower) {
				return ((RockPower) arg0).getOrdercode().intValue()
						- ((RockPower) arg1).getOrdercode().intValue();
			}
			if (arg0 instanceof SgccIniUnit && arg1 instanceof SgccIniUnit) {
				return ((SgccIniUnit) arg0).getViewOrderNum().intValue()
						- ((SgccIniUnit) arg1).getViewOrderNum().intValue();
			}
			return 0;
		}
	}
	
	/*
	 * 通过父节点id查找模块 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getModulesByParentId(java.lang.String)
	 */
	private List<SgccIniUnit> getOrgByParentId(String parentId,String attachUnit) {
		String where = "upunit='" + parentId + "'";
		
		if (!attachUnit.equals(""))
		{
			//where = where + " and (attach_unitid is null or attach_unitid='" + attachUnit+ "')";
			where = where + " and  attach_unitid='" + attachUnit+ "'";
		}
		
		List<SgccIniUnit> list = this.systemDao.findByWhere(
				BusinessConstants.SYS_ORG, where , "viewOrderNum");
		
		return list;
	}
	
	/**
	  * 通过父节点id查找模块 
	  * @param parentId
	  * @param attachUnit
	  * @param year
	  * @return
	  **/
	private List<SgccIniUnit> getOrgByParentId(String parentId,String attachUnit,String year) {
		String where = "upunit='" + parentId + "'";
		
		if (!attachUnit.equals(""))
		{
			//where = where + " and (attach_unitid is null or attach_unitid='" + attachUnit+ "')";
			where = where + " and  attach_unitid='" + attachUnit+ "'";
		}
		
		where += " and (start_year<='"+year+"' or start_year is null) and (end_year>='"+year+"' or end_year is null) and state='1'" ;
		
		List<SgccIniUnit> list = this.systemDao.findByWhere(
				BusinessConstants.SYS_ORG, where , "viewOrderNum");
		
		return list;
	}
	/**
	 * 通过父节点id查找模块 
	 * @param parentId
	 * @param attachUnit
	 * @param year
	 * @param filter
	 * @return
	 **/
	private List<SgccIniUnit> getOrgByParentId(String parentId,String attachUnit,String year,String unitType) {
		String where = "upunit='" + parentId + "'";
		if (unitType!=null && unitType.length()>0) {
			String unitTypeInStr = StringUtil.transStrToIn(unitType, "`");
			where += " and unit_type_id not in (" + unitTypeInStr + ") ";
		}
		if (!attachUnit.equals(""))
		{
			//where = where + " and (attach_unitid is null or attach_unitid='" + attachUnit+ "')";
			where = where + " and  attach_unitid='" + attachUnit+ "'";
		}
		
		where += " and (start_year<='"+year+"' or start_year is null) and (end_year>='"+year+"' or end_year is null) and state='1'" ;
		
		List<SgccIniUnit> list = this.systemDao.findByWhere(
				BusinessConstants.SYS_ORG, where , "viewOrderNum");
		
		return list;
	}
	
	/**
	  * 根据年度获得所有单位
	  * @param year
	  * @return
	  **/
	public List<SgccIniUnit> getAllUnitByYear(String year){
		return sgccIniUnitDAO.getAllUnitByYear(year);
	}

	/*
	 * 通过父节点id查找模块 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getModulesByParentId(java.lang.String)
	 */
	public List<RockPower> getModulesByParentId(String parentId) {
		//List<RockPower> list = this.rockPowerDao.findByProperty("parentid", parentId, "ordercode");
		List<RockPower> list = this.systemDao.findByProperty(
				BusinessConstants.SYS_MODULE, "parentid", parentId, "ordercode",null,null);
		
		return list;
	}

	/*
	 * 新增模块，更新父节点 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#insertModule(com.ocean.webpmis.domain.system.RockPower)
	 */
	public void insertModule(RockPower rockPower) throws BusinessException {
		// validate
		String modName = rockPower.getPowername();
		String parentId = rockPower.getParentid();
		String property = rockPower.getModelflag();
		Integer bindex = rockPower.getOrdercode();
		StringBuffer msg = new StringBuffer("");
		if (modName == null || modName.equals("")) {
			msg.append(BusinessConstants.MSG_MODULENAME_IS_NULL);
			msg.append("<br>");
		}
		if (parentId == null || parentId.equals("")) {
			msg.append(BusinessConstants.MSG_PARENTID_IS_NULL);
			msg.append("<br>");
		}
		if (property == null) {
			msg.append(BusinessConstants.MSG_SYS_PROPERTY_IS_NULL);
			msg.append("<br>");
		}
		if (bindex == null) {
			msg.append(BusinessConstants.MSG_SYS_BINDEX_IS_NULL);
			msg.append("<br>");
		}
		//RockPower tempObj = (RockPower) this.rockPowerDao.findById(parentId);
		
		RockPower tempObj = (RockPower) this.systemDao.findById(
				BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_MODULE), parentId);
		
		if (tempObj == null) {
			msg.append(BusinessConstants.MSG_PARENT_IS_MISS);
			msg.append("<br>");
		}
		if (!msg.toString().equals("")) {
			throw new BusinessException(msg.toString());
		}

		// insert into RockPower
		try {
			this.systemDao.insert(rockPower);
	
			// 更新父节点
			if (tempObj.getLeaf().intValue() != 0) {
				tempObj.setLeaf(0);
				//this.rockPowerDao.saveOrUpdate(tempObj);
				this.systemDao.saveOrUpdate(tempObj);
			}
			//系统管理员、用户管理员
			List<RockRole> listRole = (List<RockRole>) this.systemDao.findByWhere(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_ROLE), "roletype='"+Constant.ADMIN_ROLE_TYPE+"' or roletype='"+Constant.MANAGER_ROLE_TYPE+"'");		
			for (int index=0;index<listRole.size();index++)
			{	
				RockCharacter2power rm = new RockCharacter2power(rockPower.getPowerpk(), listRole.get(index).getRolepk(),
						BusinessConstants.IDF_SYSROLE_ALL);
				if(rockPower.getUnitId()==null || rockPower.getUnitId().equals("")){
					//公用模块
					this.systemDao.insert(rm);
				} else
				{
					//某个单位的模块，公用角色和当前单位的角色
					if(rockPower.getUnitId().equals(listRole.get(index).getUnitId()) || listRole.get(index).getUnitId().equals("share")){
						this.systemDao.insert(rm);
					}
				}
				
			}
			//如果是Portlet
			if (rockPower.getModelflag().equals(Constant.MODULEFLAG_OF_PORTLET))
				insertSysPortletConfig(rockPower.getPowerpk());
		}catch(Exception ex){
			throw new BusinessException(ex.getMessage());
		}

	}

	private void insertSysPortletConfig(String powerpk) {
		SysPortletConfig pc = new SysPortletConfig(Constant.ADMIN_ROLE_ID, powerpk);
		pc.setShow("false");
		this.systemDao.insert(pc);
	}

	/*
	 * 更新模块 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#updateModule(com.ocean.webpmis.domain.system.RockPower)
	 */
	public void updateModule(RockPower rockPower) throws SQLException,
			BusinessException {
		// 更新portletconfig
		List list = this.systemDao.getDataAutoCloseSes("select modelflag from Rock_Power where powerpk='" + rockPower.getPowerpk() + "'");
		if (list!=null){
			String p = (String)list.get(0);
			if (p.equals(Constant.MODULEFLAG_OF_PORTLET)){
				if (!rockPower.getModelflag().equals(Constant.MODULEFLAG_OF_PORTLET)){
					deletePortletConfig(rockPower.getPowerpk());
				}
			} else {
				if (rockPower.getModelflag().equals(Constant.MODULEFLAG_OF_PORTLET)){
					insertSysPortletConfig(rockPower.getPowerpk());
				}
			}
		}

		// update RockPower
		this.systemDao.saveOrUpdate(rockPower);

		// TODO maybe update rolemod
		
	}

	private void deletePortletConfig(String powerpk) {
		this.systemDao.executeHQL("delete from SysPortletConfig where portletId='" + powerpk + "'");
	}

	/*
	 * 删除模块，批量 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#deleteModules(java.lang.String[])
	 */
	public void deleteModules(String[] ida) throws SQLException,
			BusinessException {
		for (int i = 0; i < ida.length; i++) {
			RockPower RockPower = (RockPower) this.systemDao.findById(
					BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE),ida[i]);
			deleteModule(RockPower);
		}
	}

	/*
	 * 删除模块 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#deleteModule(com.ocean.webpmis.domain.system.RockPower)
	 */
	public void deleteModule(RockPower RockPower) throws SQLException,
			BusinessException {
		// must not null
		if (RockPower == null) {
			return;
		}
		String modId = RockPower.getPowerpk();
		String parentId = RockPower.getParentid();

		// delete from RoleMod
		List list = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLEMOD),"powerpk", 
				modId,null,null,null);
		this.systemDao.deleteAll(list);

		// delete children
		List<RockPower> children = getModulesByParentId(modId);
		if (children.size() != 0) {
			for (int i = 0; i < children.size(); i++) {
				deleteModule((RockPower) children.get(i));
			}
		}

		// delete self
		this.systemDao.delete(RockPower);

		// update parent's property: leaf
		List<RockPower> temp = getModulesByParentId(parentId);
		if ((temp.size() == 0) && !parentId.equals("0")) {
			RockPower tempObj = (RockPower) this.systemDao.findById(
					BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_MODULE), parentId);
			tempObj.setLeaf(1);
			this.systemDao.saveOrUpdate(tempObj);
		}
	}
	
	/**
	  * 移动功能点位置
	  * @param powerPk 被移动的节点
	  * @param relationPk 
	  * @param type
	  * 	(in:在relationPk内
	  * 	after:在relationPk下面
	  * 	before:在relationPk上面)
	  * @return
	  * @throws BusinessException
	  **/
	public boolean moveModule(String powerPk,String relationPk,String type){ RockPower rockPower = (RockPower) this.systemDao.findById(
				BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE),powerPk);
		if(type.equals("append")){//在某个节点内
			rockPower.setParentid(relationPk);
			String sql = "select max(ordercode) from rock_power where parentid='"+relationPk+"'";
			List list = systemDao.getDataAutoCloseSes(sql);
			int order = 0;
			if(list!=null&&list.size()>0){
				if(list.get(0)!=null){
					order = ((BigDecimal)list.get(0)).intValue();
				}
			}
			rockPower.setOrdercode(order+1);
			systemDao.saveOrUpdate(rockPower);
		}else{
			RockPower relationPower = (RockPower) this.systemDao.findById(
					BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE),relationPk);
			if(type.equals("above")){//在某个节点上面
				//判断relationPk的顺序号-1是不是被占用
				String where = "ordercode="+String.valueOf(relationPower.getOrdercode()-1)+" and parentid='"+relationPower.getParentid()+"'";
				List list = systemDao.findByWhere(
						BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE), where);
				Integer curOrder = relationPower.getOrdercode()-1;
				if(list!=null&&list.size()>0){
					//依次将以后的顺序号+1
					where = "ordercode>="+String.valueOf(relationPower.getOrdercode())+" and parentid='"+relationPower.getParentid()+"'";
					List orderlist = systemDao.findByWhere(
							BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE), where);
					setModuleOrderCode(orderlist);
					curOrder = relationPower.getOrdercode();
				}
				rockPower.setParentid(relationPower.getParentid());
				rockPower.setOrdercode(curOrder);
				systemDao.saveOrUpdate(rockPower);
			}else if(type.equals("below")){//在某个节点下面
				//判断relationPk的顺序号+1是不是被占用
				String where = "ordercode="+String.valueOf(relationPower.getOrdercode()+1)+" and parentid='"+relationPower.getParentid()+"'";
				List list = systemDao.findByWhere(
						BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE), where);
				if(list!=null&&list.size()>0){
					//依次将以后的顺序号+1
					where = "ordercode>"+String.valueOf(relationPower.getOrdercode())+" and parentid='"+relationPower.getParentid()+"'";
					List orderlist = systemDao.findByWhere(
							BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE), where);
					setModuleOrderCode(orderlist);
				}
				rockPower.setParentid(relationPower.getParentid());
				rockPower.setOrdercode(relationPower.getOrdercode()+1);
				systemDao.saveOrUpdate(rockPower);
			}
		} 
		return true;
	}
	
	/*
	 * 获取系统管理模块中的树，动态加载节点 (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmImpl#buildTreeNodes(java.lang.String,
	 *      java.lang.String)
	 */
	public List<TreeNode> buildTreeNodes(String treeName, String parentId,String attachUnit,String year) {
		List<TreeNode> list = null;
		if (treeName.equals(BusinessConstants.TREE_SYS_MODULE)) {
			list = buildModuleTreeNodes(parentId);
		}	else if (treeName.equals(BusinessConstants.TREE_SYS_ORG)) {
			list =  buildOrgTreeNodes(parentId,attachUnit,year);
		}
		return list;
	}
	/*
	 */
	public List<TreeNode> buildTreeNodes(String treeName, String parentId,String attachUnit,String year,String unitType) {
		List<TreeNode> list = null;
		if (treeName.equals(BusinessConstants.TREE_SYS_MODULE)) {
			list = buildModuleTreeNodes(parentId);
		}	else if (treeName.equals(BusinessConstants.TREE_SYS_ORG)) {
			list =  buildOrgTreeNodes(parentId,attachUnit,year);
		}	else if (treeName.equals("HrManOrgTree")) {
			list =  buildOrgTreeNodesWithOutUnitType(parentId,attachUnit,year,unitType);
		} 
		return list;
	}
	
	/**
	 * 根据组织Id获取所有组织机构信息
	 */
	public List<SgccIniUnit> buildTreeNodes (String parentId,String attachUnit,String year) {
		List<SgccIniUnit> list = null;
		if(!year.equals("all")){
			list = getOrgByParentId(parentId,attachUnit,year);
		}else{
			list = getOrgByParentId(parentId,attachUnit);
		}
		return list;
	}
	
	/**
	 * 获取系统组织机构树节点
	 * 
	 * @param parentId
	 * @return
	 */
	private List<TreeNode> buildOrgTreeNodes(String parentId,String attachUnit,String year) {
		List<SgccIniUnit> list = null;
		if(!year.equals("all")){
			list = getOrgByParentId(parentId,attachUnit,year);
		}else{
			list = getOrgByParentId(parentId,attachUnit);
		}
		List<TreeNode> tree = new ArrayList<TreeNode>();
		for (int i = 0; i < list.size(); i++) {
			SgccIniUnit org = (SgccIniUnit) list.get(i);
			TreeNode treeNode = new TreeNode();
			treeNode.setId(org.getUnitid());
			treeNode.setText(org.getUnitname());
			treeNode.setDescription("");
			treeNode.setCls("cls");
			treeNode.setIconCls(org.getUnitTypeId());
			treeNode.setNodeType(org.getUnitTypeId());
			treeNode.setLeaf(org.getLeaf().intValue() == 1 ? true : false);
			treeNode.setHref("");
			tree.add(treeNode);
		}
		return tree;
	}
	private List<TreeNode> buildOrgTreeNodesWithOutUnitType(String parentId,String attachUnit,String year,String unitType) {
		List<SgccIniUnit> list = null;
		if(!year.equals("all")){
			list = getOrgByParentId(parentId,attachUnit,year,unitType);
		}else{
			list = getOrgByParentId(parentId,attachUnit);
		}
		List<TreeNode> tree = new ArrayList<TreeNode>();
		for (int i = 0; i < list.size(); i++) {
			SgccIniUnit org = (SgccIniUnit) list.get(i);
			TreeNode treeNode = new TreeNode();
			treeNode.setId(org.getUnitid());
			treeNode.setText(org.getUnitname());
			treeNode.setDescription("");
			treeNode.setCls("cls");
			treeNode.setIconCls(org.getUnitTypeId());
			treeNode.setNodeType(org.getUnitTypeId());
			
			if(org.getLeaf().intValue()==1) {
				treeNode.setLeaf(true);
			} else {
				List<SgccIniUnit> list1 = null;
				if(!year.equals("all")){
					list1 = getOrgByParentId(org.getUnitid(),attachUnit,year,unitType);
				}else{
					list1 = getOrgByParentId(org.getUnitid(),attachUnit);
				}
				if (list1!=null && list1.size()>0) {
					treeNode.setLeaf(false);
				} else {
					treeNode.setLeaf(true);
				}
			}
			treeNode.setHref("");
			tree.add(treeNode);
		}
		return tree;
	}
	
	private TreeNode convertRocePowerNode(RockPower rockPower){
		TreeNode treeNode = new TreeNode();
		treeNode.setId(rockPower.getPowerpk());
		treeNode.setText(rockPower.getPowername());
		treeNode.setDescription("");
		treeNode.setCls(rockPower.getLeaf().intValue() == 1  ? "cls" : "package");
		treeNode.setIconCls(rockPower.getLeaf().intValue() == 1 ? "icon-cmp" : "icon-pkg");
		treeNode.setLeaf(rockPower.getLeaf().intValue() == 1 ? true : false);
		treeNode.setHref(rockPower.getLeaf().intValue() == 0 ? "" : "jspDispatcher.jsp");
		return treeNode;
	}
	
	public List getFastModulesByUserId(String userId){
		StringBuffer hqlBuff = new StringBuffer();
		hqlBuff.append("select t from RockPower t,RockPowerUser u where t.powerpk=u.id.powerpk and u.id.userid='")
				.append(userId)
				.append("' order by u.showOrder" );
		return this.systemDao.findByHql(hqlBuff.toString());
	}
	
	/**
	 * 获取系统模块树节点
	 * 
	 * @param parentId
	 * @return
	 */
	private List<TreeNode> buildModuleTreeNodes(String parentId) {
		List<RockPower> list = getModulesByParentId(parentId);
		List<TreeNode> tree = new ArrayList<TreeNode>();
		for (int i = 0; i < list.size(); i++) {
			RockPower RockPower = (RockPower) list.get(i);
			TreeNode treeNode = new TreeNode();
			treeNode.setId(RockPower.getPowerpk());
			treeNode.setText(RockPower.getPowername());
			treeNode.setDescription("");
			treeNode.setCls("cls");
			treeNode.setIconCls(RockPower.getIconcls());
			treeNode.setLeaf(RockPower.getLeaf().intValue() == 1 ? true : false);
			treeNode.setHref(RockPower.getUrl());
			tree.add(treeNode);
		}
		return tree;
	}

	/*
	 * 用户登录验证 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#authentication(java.lang.String,
	 *      java.lang.String)
	 */
	public RockUser authentication(String username, String password)
			throws SQLException, BusinessException {
		RockUser user = (RockUser) this.systemDao.findBeanByProperty(BusinessConstants.SYS_USER,"useraccount", username);
		if (user == null) {
			throw new BusinessException(BusinessConstants.MSG_USER_NOT_EXIST);
		}

		
		//口令不正确
		String _password = user.getUserpassword();
		if (!_password.equals(password)) {
			//只有系统配置了NEED_OPERATE_HISTORY=1才会启用日志添加操作，目前用于中煤物资采购系统
			if(Constant.propsMap.get("NEED_OPERATE_HISTORY")!=null&&Constant.propsMap.get("NEED_OPERATE_HISTORY").equals("1")){
				OperateHistoryService operateHistoryService= (OperateHistoryService) Constant.wact.getBean("operateHistoryService");
				operateHistoryService.addOperateHistory(user.getUserid(), user.getUnitid(), "LOGIN", "登录"+Constant.DefaultModuleRootName+"失败", "FAILURE");
			}
			throw new BusinessException(BusinessConstants.MSG_USER_LOGIN_ERR);
		}
		//用户不可用
		if (user.getUserstate() == null	|| user.getUserstate().equals(
						BusinessConstants.IDF_SYS_USER_FREEZE)) {
			//只有系统配置了NEED_OPERATE_HISTORY=1才会启用日志添加操作，目前用于中煤物资采购系统
			if(Constant.propsMap.get("NEED_OPERATE_HISTORY")!=null&&Constant.propsMap.get("NEED_OPERATE_HISTORY").equals("1")){
				OperateHistoryService operateHistoryService= (OperateHistoryService) Constant.wact.getBean("operateHistoryService");
				operateHistoryService.addOperateHistory(user.getUserid(), user.getUnitid(), "LOGIN", "登录"+Constant.DefaultModuleRootName+"失败", "FAILURE");
			}
			throw new BusinessException(BusinessConstants.MSG_USER_NOT_ACTIVE);
		}
		//用户被锁定
		if (user.getUserstate() != null	&& user.getUserstate().equals(
				BusinessConstants.IDF_SYS_USER_LOCK)) {
			//只有系统配置了NEED_OPERATE_HISTORY=1才会启用日志添加操作，目前用于中煤物资采购系统
			if(Constant.propsMap.get("NEED_OPERATE_HISTORY")!=null&&Constant.propsMap.get("NEED_OPERATE_HISTORY").equals("1")){
				OperateHistoryService operateHistoryService= (OperateHistoryService) Constant.wact.getBean("operateHistoryService");
				operateHistoryService.addOperateHistory(user.getUserid(), user.getUnitid(), "LOGIN", "登录"+Constant.DefaultModuleRootName+"失败", "FAILURE");
			}
			throw new BusinessException(BusinessConstants.MSG_USER_LOCK);
		}
		return user;
	}
	//用于门户集成，传入的密码没有经过MD5加密
	public RockUser authenticationPortal(String username, String password,boolean chkPwd)
	throws SQLException, BusinessException {
		RockUser user = (RockUser) this.systemDao.findBeanByProperty(BusinessConstants.SYS_USER,"useraccount", username);
		if (user == null) {
			throw new BusinessException(BusinessConstants.MSG_USER_NOT_EXIST);
		}
		MD5Util md5Util = MD5Util.getMd5();

		//口令不正确
		String Md5Pwd = md5Util.md5(password);
		String _password = user.getUserpassword();
		System.out.println(_password);
		if(chkPwd){
			if (!_password.equals(Md5Pwd)) {
				throw new BusinessException(BusinessConstants.MSG_USER_LOGIN_ERR);
			}
		}
		//用户不可用
		if (user.getUserstate() == null	|| user.getUserstate().equals(
						BusinessConstants.IDF_SYS_USER_FREEZE)) {
			throw new BusinessException(BusinessConstants.MSG_USER_NOT_ACTIVE);
		}
		//用户被锁定
		if (user.getUserstate() != null	&& user.getUserstate().equals(
				BusinessConstants.IDF_SYS_USER_LOCK)) {
			throw new BusinessException(BusinessConstants.MSG_USER_LOCK);
		}
		return user;
	}
	
	
	/*
	 * 获取用户组织结构/岗位 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getUserOrg(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public List<RockUser2dept> getUserOrg(RockUser user) {
		List list = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_USERORG),"userid", 
				user.getUserid(),null,null,null);
		return list;
	}

	/*
	 * 获取用户组织结构/岗位等信息 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getUserOrgInfo(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public String getUserDeptPosInfo(RockUser user) {
		List<RockUser2dept> list = getUserOrg(user);
		StringBuffer orgInfo = new StringBuffer("");
		for (int i = 0; i < list.size(); i++) {
			if(list.get(i) != null)
			{			
				RockUser2dept userorg = (RockUser2dept) list.get(i);
				SgccIniUnit sysorg = (SgccIniUnit) this.systemDao.findBeanByProperty(
						BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG),"unitid",userorg.getDeptId());
				String deptName=sysorg.getUnitname();
				orgInfo.append(deptName);	
				SgccIniUnit sysposi = (SgccIniUnit) this.systemDao.findBeanByProperty(
						BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG),"unitid", userorg.getGwId());
				//岗位和部门不同，则累加岗位
				if (sysposi != null && !deptName.equals(sysposi.getUnitname())) {
					orgInfo.append(",");
					orgInfo.append(sysposi.getUnitname());
				}
				orgInfo.append(";");
			}
		}
		return orgInfo.length() > 0 ? orgInfo
				.substring(0, orgInfo.length() - 1) : orgInfo.toString();
	}	
	/*
	 * 获取部门ID (non-Javadoc)
	 */
	public String getUserDeptId(RockUser user) {
		List<RockUser2dept> list = getUserOrg(user);
		StringBuffer orgInfo = new StringBuffer("");
		
		for (int i = 0; i < list.size(); i++) {
			if(list.get(i) != null)
			{
				RockUser2dept userorg = (RockUser2dept) list.get(i);
				if(userorg.getDeptId()!= null && !userorg.getDeptId().equals(""))
				{
					orgInfo.append(userorg.getDeptId());
					orgInfo.append(",");
				}
			}
		}
		return orgInfo.length() > 0 ? orgInfo
				.substring(0, orgInfo.length() - 1) : orgInfo.toString();
	}
	
	public String getUserUnitName(RockUser user) {
		
		String orgInfo = "";		
			SgccIniUnit sysorg = (SgccIniUnit) this.systemDao.findBeanByProperty(
					BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_ORG),"unitid",user.getUnitid());
			orgInfo= sysorg.getUnitname();
		return orgInfo;
	}
	/*
	 * 获取岗位ID (non-Javadoc)
	 */
	public String getUserPosId(RockUser user) {
		List<RockUser2dept> list = getUserOrg(user);
		StringBuffer orgInfo = new StringBuffer("");
		
		for (int i = 0; i < list.size(); i++) {
			if(list.get(i) != null)
			{
				RockUser2dept userorg = (RockUser2dept) list.get(i);
				if(userorg.getGwId()!= null && !userorg.getGwId().equals(""))
				{
					orgInfo.append(userorg.getGwId());
					orgInfo.append(",");
				}
			}
		}
		return orgInfo.length() > 0 ? orgInfo
				.substring(0, orgInfo.length() - 1) : orgInfo.toString();
	}


	/*
	 * 新增角色
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#insertUser(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public void insertRole(RockRole role) throws SQLException, BusinessException {
		if (role.getRolename() == null || role.getRolename().trim().equals("")){
			throw new BusinessException(
					BusinessConstants.MSG_ROLENAME_IS_NULL);
		} else {
			if (role.getRolename().equals(Constant.PUBLIC_ROLE_NAME) && role.getRoletype().equals(Constant.PUBLIC_ROLE_TYPE)){
				throw new BusinessException("类型为“普通用户”、名称为“公用角色”的为系统默认角色，具有唯一性！");
			}
			if (role.getRolename().equals(Constant.ADMIN_ROLE_NAME) && role.getRoletype().equals(Constant.ADMIN_ROLE_TYPE)){
				throw new BusinessException("类型为“系统管理”、名称为“系统管理员”的为系统默认角色，具有唯一性！");
			}		
			this.systemDao.insert(role);
		}
		
	}
	

	/*
	 * 更新角色 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#updateUser(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public void updateRole(RockRole role) throws SQLException, BusinessException {
	
			if (role.getRolename() == null || role.getRolename().trim().equals("")){
				throw new BusinessException(
						BusinessConstants.MSG_ROLENAME_IS_NULL);
			} else {
				this.systemDao.saveOrUpdate(role);
			}
		
	}
	
	public void deleteRole(RockRole role) throws SQLException, BusinessException {
		if (role.getRoletype().equals(Constant.ADMIN_ROLE_TYPE) && role.getRolename().equals(Constant.ADMIN_ROLE_NAME)) {
				throw new BusinessException("系统默认的系统管理员角色不允许删除！");
		} else {
			List list = this.systemDao.findByProperty(BusinessConstants.SYS_USERROLE, "rolepk", role.getRolepk(),null,null,null);
			if (list.size() > 0) {
				throw new BusinessException(
						BusinessConstants.MSG_ROLE_HAS_USERS);
			}else {
				this.systemDao.delete(role);
			}
			
		}
	}	

	public void insertUserRole(RockRole2user rru){
		this.systemDao.insert(rru);
		updateUserPortletByUserRole(rru.getUserid());
	}

	public void updateUserRole(RockRole2user rru) throws BusinessException{
		this.systemDao.saveOrUpdate(rru);
		updateUserPortletByUserRole(rru.getUserid());
	}	
	
	public void deleteUserRole(RockRole2user rru){
		this.systemDao.delete(rru);
		updateUserPortletByUserRole(rru.getUserid());
	}	
	
	private void updateUserPortletByUserRole(String userid) {
		List temp = this.systemDao.findByProperty(SysPortletConfig.class.getName(), "userId", userid);
		this.systemDao.deleteAll(temp);
		
		List rrus = this.systemDao.findByWhere(RockRole2user.class.getName(), "userId='"+userid+"'");
		HashMap map = new HashMap();
		for(int i=0; i<rrus.size(); i++){
			RockRole2user rru = (RockRole2user)rrus.get(i);
			List spcs = this.systemDao.findByProperty(SysPortletConfig.class.getName(), "userId", rru.getRolepk());
			for (int j=0; j<spcs.size(); j++){
				SysPortletConfig spc = (SysPortletConfig)spcs.get(j);
				if (!map.containsKey(spc.getPortletId())){
					map.put(spc.getPortletId(), "");
					SysPortletConfig obj = new SysPortletConfig(userid, spc.getPortletId(), spc.getRowIdx(),
						spc.getColIdx(), spc.getPh(), spc.getCustomParams(), "true");
					this.systemDao.insert(obj);
				}
			}
		}
	}
	
	
	/*
	 * 新增用户，同时记录创建用户的时刻，同时新增用户的组织结构、岗位信息，添加默认的"一般用户"角色；
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#insertUser(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public void insertUser(RockUser user) throws SQLException, BusinessException {
		if (checkUserUnique(user)!= null) {
			String msg = checkUserValid(user);
			if (msg.equals("")) {
				user.setCreatedon(DateUtil.getSystemDateTime());
				//获取当前组织机构类型
				Map<String,String> infoMap = getOrgInfoById(user.getPosid());
				
				String unitType = infoMap.get("type");
				if (unitType.equals("0")){
					user.setDeptId(user.getPosid());
				} else if (unitType.equals("9")||unitType.equals("1")){
					user.setDeptId(infoMap.get("dept"));
				} else {
					user.setDeptId(user.getPosid());
				}
				this.systemDao.insert(user);


				RockUser2dept userorg = new RockUser2dept(user.getUserid(),user.getDeptId(), user
						.getPosid());
				
				
				this.systemDao.insert(userorg);
			} else {
				throw new SQLException(msg);
			}
		} else {
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
	}

	/*
	 * 更新用户 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#updateUser(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public void updateUser(RockUser user) throws SQLException, BusinessException {
		
		if(user.getUserstate().equals("1")) {
			if(SysServlet.loginAudit.get(user.getUseraccount()) != null) {
				SysServlet.loginAudit.get(user.getUseraccount()).count = 0;
				SysServlet.loginAudit.get(user.getUseraccount()).locked = false;
			}
		} else {
			if(SysServlet.loginAudit.get(user.getUseraccount()) != null) {
				SysServlet.loginAudit.get(user.getUseraccount()).locked = true;
			}
		}
		RockUser userRtn =checkUserUnique(user);
		if (userRtn!= null) {
			String msg = checkUserValid(user); 
			if (msg.equals("")) {
				BeanUtils.copyProperties(user, userRtn);
				this.systemDao.saveOrUpdate(userRtn);
			} else {
				throw new SQLException(msg);
			}
		} else {
			//用户名被占用
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
	}

	/*
	 * 删除用户, 同时删除组织机构/岗位信息，角色信息 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#updateUser(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public void deleteUser(RockUser user) throws SQLException, BusinessException {
		if (!checkUserIsAdmin(user)) {
			String userid = user.getUserid();
			List list = this.systemDao.findByProperty(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_USERORG), "userid",userid,null,null,null);
			this.systemDao.deleteAll(list);
			
			list = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USERROLE), "userid", userid,null,null,null);
			this.systemDao.deleteAll(list);
			
			this.systemDao.delete(user);
		} else {
			throw new BusinessException(
					BusinessConstants.MSG_ADMIN_CANNOT_DELETE);

		}
	}
	
	/**
	 * 检查用户是否是系统管理员
	 * @param user
	 * @return
	 */
	private boolean checkUserIsAdmin(RockUser user) {
		return user != null
				&& user.getRealname() != null
				&& user.getRealname().equals(
						BusinessConstants.IDF_SUPERADMINISTRATOR);
	}
	public String getUserRoleType(RockUser user)
	{
		String roleType = "2";
		String isLeader="0";
		List list = systemDao.findByHql("from RockRole m, RockRole2user u where  m.rolepk = u.rolepk and u.userid = '" + user.getUserid() + "'");
		for(int i=0; i<list.size(); i++){
			Object[] obj = (Object[])list.get(i); 
			for(int j=0; j<obj.length; j++){
				RockRole roles = (RockRole)obj[0];
				if (roles.getRoletype().equals("3"))
				{
					isLeader = "3";
				} else
				{
					if (Integer.valueOf(roleType).intValue() > Integer.valueOf(roles.getRoletype()).intValue())
					{
						roleType = roles.getRoletype();
						
					}
				}
				
			}
		}
		return roleType.concat("`").concat(isLeader);
	}

	/**
	 * 用户信息完整性校验
	 * 
	 * @param user
	 * @return 若为空串表示通过校验，否则返回提示信息
	 */
	private String checkUserValid(RockUser user) {
		StringBuffer msg = new StringBuffer("");
		if (user.getUseraccount() == null || user.getUseraccount().trim().equals("")) {
			msg.append(BusinessConstants.MSG_USERNAME_IS_NULL);
		}
		if (user.getUserpassword() == null || user.getUserpassword().trim().equals("")) {
			msg.append(BusinessConstants.MSG_PASSWORD_IS_NULL);
		}
		if (user.getUserstate() == null || user.getUserstate().trim().equals("")) {
			msg.append(BusinessConstants.MSG_STATUS_IS_NULL);
		}		
		return msg.toString();
	}

	/**
	 * 用户唯一性校验
	 * 
	 * @param user
	 * @return 若为真则表示通过校验
	 */
	private RockUser checkUserUnique(RockUser user) {
		List list = this.systemDao.findByProperty("RockUser", "useraccount", user.getUseraccount(),null,null,null);
		RockUser rtnUser =null;
		if (list.size() == 0) {
			rtnUser = new RockUser();
		} else {
			RockUser temp = (RockUser) list.get(0);
			if (temp.getUserid().equals(user.getUserid())) {
				rtnUser = temp;
			}
		}
		return rtnUser;
	}

	/*
	 * 用户已经登录，记录用户登录时间 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#userLogon(com.sgepit.frame.sysman.hbm.RockUser)
	 */
	public void userLogon(RockUser user) {
		user.setLastlogon(DateUtil.getSystemDateTime());
		this.systemDao.saveOrUpdate(user);
	}

	/*
	 * 新增组织结构，更新父节点
	 */
	public void insertOrg(SgccIniUnit sysOrg) throws SQLException, BusinessException {
		// validate
		String orgName = sysOrg.getUnitname();
		String parentId = sysOrg.getUpunit();
		Integer ordernum = sysOrg.getViewOrderNum();
		String unitType = sysOrg.getUnitTypeId();
		String startYear = sysOrg.getStartYear();
		String endYear = sysOrg.getEndYear();
		StringBuffer msg = new StringBuffer("");
		if (orgName == null || orgName.equals("")) {
			msg.append(BusinessConstants.MSG_ORGNAME_IS_NULL);
			msg.append("<br>");
		}
		if (parentId == null || parentId.equals("")) {
			msg.append(BusinessConstants.MSG_PARENTID_IS_NULL);
			msg.append("<br>");
		}
		if (ordernum == null) {
			msg.append(BusinessConstants.MSG_SYS_BINDEX_IS_NULL);
			msg.append("<br>");
		}
		SgccIniUnit	parentObj = (SgccIniUnit) this.systemDao
			.findBeanByProperty((BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_ORG)),"unitid", parentId);
		if (parentObj == null) {
			msg.append(BusinessConstants.MSG_PARENT_IS_MISS);
			msg.append("<br>");
		}
		
		if(startYear!=null&&!startYear.equals("")&&startYear.length()!=4&&!isInteger(startYear)){
			msg.append(BusinessConstants.MSG_ORG_STARTYEAR_WRONG);
			msg.append("<br>");
		}
		if(endYear!=null&&!endYear.equals("")&&endYear.length()!=4&&!isInteger(endYear)){
			msg.append(BusinessConstants.MSG_ORG_ENDYEAR_WRONG);
			msg.append("<br>");
		}
		if(startYear!=null&&endYear!=null&&startYear.compareTo(endYear)>0){
			msg.append(BusinessConstants.MSG_ORG_START_END_COMPARE);
			msg.append("<br>");
		}

		if (!msg.toString().equals("")) {
			throw new BusinessException(msg.toString());
		} else {
			List temp = this.systemDao.findByWhere(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_ORG), "unitname='"
							+ sysOrg.getUnitname() + "' and upunit='" + parentId
							+ "'",null,null,null);
			if (temp.size() > 0)
				throw new BusinessException(parentObj.getUnitname().concat(
						BusinessConstants.MSG_ORG_NAME_IS_EXIST));
		}		
		
		SgccIniUnit tempObj = (SgccIniUnit) this.systemDao.findBeanByProperty(
				BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG),"unitid", parentId);
		
		if (tempObj == null) {
			msg.append(BusinessConstants.MSG_PARENT_IS_MISS);
			msg.append("<br>");
		}
		if (!msg.toString().equals("")) {
			throw new BusinessException(msg.toString());
		}
		//父层不是国家电网公司
		if(!parentId.equals(Constant.DefaultOrgRootID))
		{
			//公司(网省、直属、地市)
			if(unitType.equals("1") || unitType.equals("2") ||unitType.equals("6")){
				sysOrg.setAttachUnitid(sysOrg.getUnitid());
			} else if(!unitType.equals("3"))  //不是分类（3）
			{
				SgccIniUnit parent = (SgccIniUnit)this.systemDao.findBeanByProperty(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG), "unitid", parentId);
				sysOrg.setAttachUnitid(parent.getAttachUnitid());
			}
		}		
	
		this.systemDao.insert(sysOrg);	
		
		// update parent
		if (tempObj.getLeaf().intValue() != 0) {
			tempObj.setLeaf(0);
			//this.rockPowerDao.saveOrUpdate(tempObj);
			this.systemDao.saveOrUpdate(tempObj);
		}
		
	}

	/*
	 * 更新组织结构
	 */
	/**
	  * {method discription}
	  * @param sysOrg
	  * @throws SQLException
	  * @throws BusinessException
	  **/
	public void updateOrg(SgccIniUnit sysOrg) throws SQLException, BusinessException {
		
		String orgName = sysOrg.getUnitname();
		String parentId = sysOrg.getUpunit();
		Integer ordernum = sysOrg.getViewOrderNum();
		String unitType = sysOrg.getUnitTypeId();
		String startYear = sysOrg.getStartYear();
		String endYear = sysOrg.getEndYear();
		StringBuffer msg = new StringBuffer("");
		if (orgName == null || orgName.equals("")) {
			msg.append(BusinessConstants.MSG_ORGNAME_IS_NULL);
			msg.append("<br>");
		}
		if (parentId == null || parentId.equals("")) {
			msg.append(BusinessConstants.MSG_PARENTID_IS_NULL);
			msg.append("<br>");
		}
		if (ordernum == null) {
			msg.append(BusinessConstants.MSG_SYS_BINDEX_IS_NULL);
			msg.append("<br>");
		}
		SgccIniUnit parentObj = (SgccIniUnit) this.systemDao.findBeanByProperty(
				BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG),"unitid", sysOrg
						.getUpunit());
		if (parentObj == null) {
			msg.append(BusinessConstants.MSG_PARENT_IS_MISS);
			msg.append("<br>");
		}
		
		if(startYear!=null&&!startYear.equals("")&&startYear.length()!=4&&!isInteger(startYear)){
			msg.append(BusinessConstants.MSG_ORG_STARTYEAR_WRONG);
			msg.append("<br>");
		}
		if(endYear!=null&&!endYear.equals("")&&endYear.length()!=4&&!isInteger(endYear)){
			msg.append(BusinessConstants.MSG_ORG_ENDYEAR_WRONG);
			msg.append("<br>");
		}
		if(startYear!=null&&!startYear.equals("")&&endYear!=null&&!endYear.equals("")&&startYear.compareTo(endYear)>0){
			msg.append(BusinessConstants.MSG_ORG_START_END_COMPARE);
			msg.append("<br>");
		}
		//检查是否在上级节点的起止年份内
		String pStart = parentObj.getStartYear();
		String pEnd = parentObj.getEndYear();
		if(pStart!=null&&!pStart.equals("")&&pStart.compareTo(startYear)>0){
			msg.append(BusinessConstants.MSG_ORG_START_EXCEED);
			msg.append("<br>");
		}
		if(pEnd!=null&&!pEnd.equals("")&&pEnd.compareTo(endYear)<0){
			msg.append(BusinessConstants.MSG_ORG_END_EXCEED);
			msg.append("<br>");
		}

		if (!msg.toString().equals("")) {
			throw new BusinessException(msg.toString());
		}
		
		// check unique
		List unique = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_ORG), "unitname='"
				+ sysOrg.getUnitname() + "' and upunit='" + sysOrg.getUpunit()
				+ "'",null,null,null);
		if (unique.size() > 0) {
			SgccIniUnit temp = (SgccIniUnit) unique.get(0);
			if (!temp.getUnitid().equals(sysOrg.getUnitid())) {
				throw new BusinessException(parentObj.getUnitname().concat(
						BusinessConstants.MSG_ORG_NAME_IS_EXIST));
			}
		}
		
		//将所有下级节点的起止年份与本单位统一,本单位失效其下级单位都失效
		List childList = sgccIniUnitDAO.getAllChildrenByUnitid(sysOrg.getUnitid());
		if(childList!=null&&childList.size()>0){
			SgccIniUnit childUnit = null;
			for(int i=0;i<childList.size();i++){
				childUnit = (SgccIniUnit)childList.get(i);
				String start = childUnit.getStartYear();
				boolean changed = false;
				if(start!=null&&!start.equals("")&&(start.compareTo(startYear)<0||start.compareTo(endYear)>0)){
					if(!startYear.equals("")){
						childUnit.setStartYear(startYear);
						changed = true;
					}
				}
				String end = childUnit.getEndYear();
				if(end!=null&&!end.equals("")&&(end.compareTo(startYear)<0||end.compareTo(endYear)>0)){
					if(!endYear.equals("")){
						childUnit.setEndYear(endYear);
						changed = true;
					}
				}
				String state = childUnit.getState();
				if(!sysOrg.getState().equals(state)&&sysOrg.getState().equals("0")){
					childUnit.setState(sysOrg.getState());
					changed = true;
				}
				if(changed==true){
					sgccIniUnitDAO.saveOrUpdate(childUnit);
				}
			}
		}
		// update
		//this.sgccIniUnitDAO.saveOrUpdate(sysOrg);
		
		
	}

	/*
	 * 删除组织结构，批量
	 */
	public void deleteOrgs(String[] ida) throws SQLException, BusinessException {
		for (int i = 0; i < ida.length; i++) {
			SgccIniUnit sysOrg = (SgccIniUnit) this.systemDao.findBeanByProperty(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_ORG), "unitid",ida[i]);
			deleteOrg(sysOrg);
		}
	}

	/*
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#deleteOrg(com.ocean.webpmis.domain.system.SysOrg)
	 */
	public void deleteOrg(SgccIniUnit sysOrg) throws SQLException, BusinessException {
		// must not null
		if (sysOrg == null) {
			return;
		}
		String orgId = sysOrg.getUnitid();
		String parentId = sysOrg.getUpunit();

		// update Userorg
		List list = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_USERORG), "deptId", orgId,null,null,null);
		if (list != null) {
			for (int i = 0; i < list.size(); i++) {
				RockUser2dept suo = (RockUser2dept) list.get(i);
				suo.setDeptId(Constant.APPOrgRootID);
				this.systemDao.saveOrUpdate(suo);
			}
		}

		// delete children
		List children = this.systemDao
				.findByProperty(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG), "upunit", orgId,null,null,null);
		if (children != null) {
			for (int i = 0; i < children.size(); i++) {
				deleteOrg((SgccIniUnit) children.get(i));
			}
		}

		// delete self
		this.systemDao.delete(sysOrg);

		// update parent's property: leaf
		List temp = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_ORG), "upunit", parentId,null,null,null);
		if ((temp.size() == 0) && !parentId.equals("0")) {
			SgccIniUnit tempObj = (SgccIniUnit) this.systemDao.findBeanByProperty(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_ORG),"unitid", parentId);
			tempObj.setLeaf(1);			
			this.systemDao.saveOrUpdate(tempObj);
		}
	}

	/*
	 * 根据上级组织结构ID，得到排序过的所有下级组织结构
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getListedOrgs(java.lang.String, boolean)
	 */
	public List<SgccIniUnit> getListedOrgs(String parentId, boolean deep)
			throws BusinessException {
		List<SgccIniUnit> list = new ArrayList<SgccIniUnit>();
		try {
			String parent = parentId != null ? parentId : Constant.APPOrgRootID;
			List orgs = this.systemDao.findByProperty(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_ORG), "upunit",
					parent,null,null,null);
			Collections.sort(orgs, new SortOrderAsc());
			Iterator itr = orgs.iterator();
			while (itr.hasNext()) {
				SgccIniUnit temp = (SgccIniUnit) itr.next();
				list.add(temp);
				if (temp.getLeaf().intValue() == 0 && deep) {
					list.addAll(getListedOrgs(temp.getUnitid(), true));
				}
			}
		} catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return list;
	}

	/*
	 * 取全部岗位列表
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getPositions()
	 */
	public List getPositions() {
		List list = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_POSITION),null,null,null,null);
		return list;
	}
	
		
	/*
	 * 根据组织结构ID，获取该组织结构下的岗位列表
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getOrgPositions(java.lang.String)
	 */
	public List getOrgPositions(String orgid) {
		List temp = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_ORGPOS), "orgid", orgid,null,null,null);
		List list = new ArrayList();;
		for(int i=0; i<temp.size(); i++){
			RockUnitpos orgpos = (RockUnitpos)temp.get(i);
			RockPosition pos = (RockPosition)this.systemDao.findById(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_POSITION), orgpos.getPosid());
			list.add(pos);
		}
		return list;
	}
	
	/**
	 * 取角色列表
	 * 
	 * @return
	 */
	public List getRoles() {
		List list = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_ROLE),null, "rolename",null,null);
		return list;
	}
	
	/**
	 * 取角色列表
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<RockRole> getRolesByPrivilege(String roleType,String unitId) {
		List<RockRole> list = new ArrayList();
			list = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_ROLE),"unitId='" +unitId+"'" , "rolename");
		return list;
	}
	
	
	
	private Map<String,String> getOrgInfoById(String unitid){
		SgccIniUnit org = (SgccIniUnit)this.systemDao.findBeanByProperty(BusinessConstants.SYS_PACKAGE
								.concat(BusinessConstants.SYS_ORG), "unitid", unitid);
		
		Map<String,String> map = new HashMap<String,String>();
		if(org != null)
		{
			if(unitid.equals(Constant.DefaultOrgRootID)){
				map.put("unit", unitid );
				map.put("dept", unitid );
			} else
			{
				map.put("unit", org.getAttachUnitid() );
				map.put("dept", org.getUpunit() );
			}
			
			map.put("type", org.getUnitTypeId() );			
		}
		
		return map;
		
	}
	
	private Map<String,String> getOrgInfoById2(String unitid){
		SgccIniUnit org = (SgccIniUnit)this.systemDao.findBeanByProperty(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_ORG), "unitid", unitid);
		
		Map<String,String> map = new HashMap<String,String>();
		if(org != null)
		{
			if(unitid.equals(Constant.DefaultOrgRootID)){
				map.put("unit", unitid );
				map.put("dept", unitid );
			} else
			{
				//map.put("unit", org.getAttachUnitid() );
				map.put("unit", unitid );
				map.put("dept", org.getUpunit() );
			}
			
			map.put("type", org.getUnitTypeId() );			
		}
		
		return map;
		
	}
	
	public List<RockUser> findUserByOrg(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid) {
		String value = orgid.get("posid");
		String includeSubFlag = orgid.get("includeSub");
		List<RockUser> users = new ArrayList();
		if(value == null){
			users =this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USER), "",orderby,start,limit);
		} else {
			String tempWhere = "select unitid from sgcc_ini_unit start with unitid = '" + value + "' connect by prior unitid = upunit";
			if (includeSubFlag!=null && !includeSubFlag.equalsIgnoreCase("true")) {
				tempWhere = value;
			}
			String sql = "select * from rock_user where unitid in (" + tempWhere + ") or dept_id in (" + tempWhere + ") or posid in (" + tempWhere + ")";
			if (orderby != null && !orderby.trim().equals("")){
				sql += " order by " + orderby;
			}
			Session s = HibernateSessionFactory.getSession();
			SQLQuery query = s.createSQLQuery(sql).addEntity(RockUser.class);
			int size = query.list().size();
			if(start!=null && limit!=null) {
				query.setFirstResult(start.intValue());
				query.setMaxResults(limit.intValue());
			}
			List list = query.list();
			list.add(size);
			users = list;
		}
		return users;
	}
	
	public List<RockUser> findUserByOrgNotInManInfo(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid) {
		
		String unitType = (String)orgid.get("unitType");
		String propertyName ="unitid";
		Object value = orgid.get("posid");
		List<RockUser> users = new ArrayList();
		if(value == null){
			users =this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USER), "",orderby,start,limit);
		} else
		{
			if(unitType.equals("0")){
				propertyName = "deptId";
			} else if(unitType.equals("9")||unitType.equals("1")){
				propertyName = "posid";
			} else if(unitType.equals("2")){
				propertyName = "posid";
			} else {
				propertyName = "unitid";			
			}
		}
		
		return users;
	}
	
	/**
	  * 根据条件查询用户信息
	  * @param where
	  * @return
	  **/
	public List getUserByWhere(String where){
		return this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_USER), where);
	}

	public HashMap<String, String> getUserModuleActions(HashMap<String, RockPower> userModMap, String modid) {
		HashMap<String, String> moduleActions = new HashMap<String, String>();
		Iterator itr = userModMap.entrySet().iterator();
		while (itr.hasNext()) {
			Map.Entry entry = (Map.Entry) itr.next();
			RockPower temp = (RockPower) entry.getValue();
			if (temp.getParentid().equals(modid) && temp.getModelflag().equals("2")) {
				moduleActions.put(temp.getPowername(), String.valueOf(temp.getLvl()));
			}
		}
		return moduleActions;
	}

	public String getModuleIdByName(String modulename, String parent) {

		if (parent != null) {
			List temp = this.systemDao.findByWhere(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_MODULE), "powername='"
							+ parent + "'",null,null,null);
			if (temp.size() > 0) {
				RockPower p = (RockPower) temp.get(0);
				List obj = this.systemDao.findByWhere(
						BusinessConstants.SYS_PACKAGE
								.concat(BusinessConstants.SYS_MODULE),
						"powername='" + modulename + "' and parentid='"
								+ p.getPowerpk() + "'",null,null,null);
				if (obj.size() > 0)
					return ((RockPower) obj.get(0)).getPowerpk();
			}
		} else {
			List obj = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_MODULE), "powername='"
					+ modulename + "'",null,null,null);
			if (obj.size() > 0)
				return ((RockPower) obj.get(0)).getPowerpk();
		}
		return null;
	}

	public String getRoleModTree(String roleid, String unitid) throws BusinessException {
		HashMap<String, RockPower> map = new HashMap<String, RockPower>();
		List list = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_ROLEMOD), "rolepk", roleid,null,null,null);
		HashMap rolemod = new HashMap();
		for(int i=0; i<list.size(); i++) {
			RockCharacter2power o = (RockCharacter2power)list.get(i);
			rolemod.put(o.getPowerpk(), o.getLvl());
		}
		return getListedRoleModules("0", rolemod,unitid);
	}

	public String getListedRoleModules(String parentId, Map rolemod, String unitid)
		throws BusinessException {
		StringBuffer sbf = new StringBuffer("[");
		try {
			String parent = parentId != null ? parentId	: Constant.APPModuleRootID;
			List modules = new ArrayList();
			List list = systemDao.findByHql("from RockPower m, RockCharacter2power v, RockRole u where " +
					" m.powerpk = v.powerpk and v.rolepk = u.rolepk and u.unitId='UNITROLE' and u.remark='"+unitid+"' " +
					" and m.parentid='"+parentId+"'");
			
			for(int i=0; i<list.size(); i++){
				Object[] obj = (Object[])list.get(i); 
				modules.add((RockPower)obj[0]);
			}
			
			Collections.sort(modules, new SortOrderAsc());
			Iterator itr = modules.iterator();
			while (itr.hasNext()) {
				RockPower temp = (RockPower) itr.next();
				boolean leaf = temp.getLeaf().intValue() > 0 ? true : false;
				Integer lvl = (Integer)rolemod.get(temp.getPowerpk());
				int lvlInt = (lvl == null) ? 4 : lvl.intValue();
				String read = lvlInt < 4 ? "true" : "false";
				String write = lvlInt < 3 ? "true" : "false";
				String control = lvlInt == 1 ? "true" : "false";
				sbf.append("{id:'");
				sbf.append(temp.getPowerpk());
				sbf.append("',text:'");
				if("01".equals(temp.getPowerpk())){
					sbf.append(Constant.DefaultModuleRootName);
				}else{
					sbf.append(temp.getPowername());
				}
				sbf.append("',read:");
				sbf.append(read);
				sbf.append(",write:");
				sbf.append(write);
				sbf.append(",control:");
				sbf.append(control);
				sbf.append(",lvl:");
				sbf.append(lvlInt);
				sbf.append(",uiProvider:'col'");
				if (!leaf) {
					sbf.append(",cls:'master-task',iconCls:'task-folder'");
					sbf.append(",children:");
					sbf.append(getListedRoleModules(temp.getPowerpk(), rolemod, unitid));
				} else {
					sbf.append(",iconCls:'task',leaf:true");
				}
				sbf.append("}");
				if (itr.hasNext()) {
					sbf.append(",");
				}
			}
			sbf.append("]");
		} catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return sbf.toString();
	}

	public void deleteRoleMod(String roleid) {
		List lt = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_USERROLE), "rolepk", roleid);
		for(int i=0; i<lt.size(); i++){
			RockRole2user rru = (RockRole2user) lt.get(i);
			List temp = this.systemDao.findByProperty(SysPortletConfig.class.getName(), "userId", rru.getUserid());
			this.systemDao.deleteAll(temp);
		}
		List tempList = this.systemDao.findByProperty(SysPortletConfig.class.getName(), "userId", roleid);
		this.systemDao.deleteAll(tempList);
		List list = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLEMOD), "rolepk", roleid,null,null,null);
		this.systemDao.deleteAll(list);
	}

	public void insertRolemod(Object rolemod) {
		this.systemDao.insert(rolemod);
	}
	
	public void savePassword(String userid, String oldpwd, String newpwd) throws BusinessException {
		RockUser user = (RockUser)this.systemDao.findById(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_USER), userid);
		if (user != null){
			if (!oldpwd.equals(user.getUserpassword()))
				throw new BusinessException(BusinessConstants.MSG_USER_OLDPWD_WRONG);
			user.setUserpassword(newpwd);
			this.systemDao.saveOrUpdate(user);
		} else {
			throw new BusinessException(BusinessConstants.MSG_USER_NOT_EXIST);
		}
	}
	
	public void insertPosition(RockPosition position) throws BusinessException{
		if (checkPosiUnique(position)) {
			if (position.getPosname() == null || position.getPosname().trim().equals("")){
				throw new BusinessException(
						BusinessConstants.MSG_POSNAME_IS_NULL);
			} else {
				this.systemDao.insert(position);
			}
		} else {
			throw new BusinessException(
					BusinessConstants.MSG_POSNAME_NOT_UNIQUE);
		}
	}
	
	public void deletePosition(RockPosition position) throws BusinessException{
		List list = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_ORGPOS), "posid", position.getPosid(),null,null,null);
		if (list.size() > 0){
			throw new BusinessException(BusinessConstants.MSG_POSI_HAS_CHILD);
		}
		this.systemDao.delete(position);
	}
	
	public void updatePosition(RockPosition position) throws BusinessException{
		if (checkPosiUnique(position)) {
			if (position.getPosname() == null || position.getPosname().trim().equals("")){
				throw new BusinessException(
						BusinessConstants.MSG_POSNAME_IS_NULL);
			} else {
				this.systemDao.saveOrUpdate(position);
			}
		} else {
			throw new BusinessException(
					BusinessConstants.MSG_POSNAME_NOT_UNIQUE);
		}		
	}

	/**
	 * 岗位唯一性校验
	 * 
	 * @param user
	 * @return 若为真则表示通过校验
	 */
	private boolean checkPosiUnique(RockPosition position) {
		List list = this.systemDao.findByWhere(BusinessConstants.SYS_POSITION, 
				"posname='" + position.getPosname() + "' and unitid='" + position.getUnitid() + "'", 
				null, null, null);
		boolean flag = false;
		if (list.size() == 0) {
			flag = true;
		} else {
			RockPosition temp = (RockPosition) list.get(0);
			if (temp.getPosid().equals(position.getPosid())) {
				flag = true;
			}
		}
		return flag;
	}
	/*
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getModulesMap()
	 */
	public HashMap getModulesMap() {
		List list = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
				.concat(BusinessConstants.SYS_MODULE),null,null,null,null);
		HashMap map = new HashMap();
		for(int i=0; i<list.size(); i++){		
			RockPower mod = (RockPower)list.get(i);
			//map.put(mod.getModname(), mod);
			map.put(mod.getPowerpk(), mod);
		}
		return map;
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#saveRolemod(java.lang.String, com.ocean.webpmis.util.UpdateBeanInfo)
	 */
	public void saveRolemod(String roleid, UpdateBeanInfo jab) {
		this.deleteRoleMod(roleid);
		List<Object> beanList = jab.beanList;
		for (int i = 0; i < beanList.size(); i++) {
			RockCharacter2power rcp = (RockCharacter2power)beanList.get(i);
			RockPower rp = (RockPower)this.systemDao.findById(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_MODULE), rcp.getPowerpk());
			if (Constant.MODULEFLAG_OF_PORTLET.equals(rp.getModelflag())){
				SysPortletConfig spc = new SysPortletConfig(roleid, rcp.getPowerpk());
				spc.setShow("true");
				this.systemDao.insert(spc);
			}
			this.insertRolemod(rcp);
		}
	}

	/**
	 * 在组织机构之间移动或复制用户
	 * @param ida　多个用户的userid组成的字符串
	 * @param oldOrgid 要移动或复制的用户所在的源组织机构id
	 * @param newUnitId 要移动或复制到的目标组织机构id
	 * @param newDeptId 移动或复制到的目标部门id；
	 * @param newPosId	移动或复制到的目标岗位id；
	 * @param move 标示符，表示移动还是复制
	 * last modified by Liuay 2011-06-02	用户复制粘贴时，获取粘贴到的相应的unitId、deptId、posId;
	 */
	public void moveUser(String[] ida, String oldOrgid, String newUnitId, String newDeptId, String newPosId, String move) {
		if (move.equalsIgnoreCase("copy")) {
			//没有考虑拷贝用户情况,只有异动,一下代码无暇
			for(int i=0; i<ida.length; i++){
				List list = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_USERORG), "userid='" + ida[i] + "' and deptId='" + newDeptId + "'",null,null,null);
				if (list.size()==0) {
					RockUser2dept userorg = new RockUser2dept();
					userorg.setUserid(ida[i]);
					userorg.setDeptId(newDeptId);
					this.systemDao.insert(userorg);						
				}
			}
		} else {
			for(int i=0; i<ida.length; i++){
				RockUser user = (RockUser)this.systemDao.findBeanByProperty(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_USER), "userid",ida[i]);
				user.setPosid(newPosId);
				user.setDeptId(newDeptId);
				user.setUnitid(newUnitId);
				this.systemDao.saveOrUpdate(user);

				List<RockUser2dept> list = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_USERORG), "userid='" + ida[i] + "'");
				this.systemDao.deleteAll(list);
				
				RockUser2dept userorg = new RockUser2dept();
				userorg.setUserid(ida[i]);
				userorg.setGwId(newPosId);
				userorg.setDeptId(newDeptId);
				this.systemDao.insert(userorg);
			}
		}
	}
	
	public void setUserPassword(String[] ida, String defaultPassword) {
			
		for(int i=0; i<ida.length; i++){
			RockUser user = (RockUser)this.systemDao.findBeanByProperty(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USER), "userid",ida[i]);
			user.setUserpassword(defaultPassword);
			this.systemDao.saveOrUpdate(user);
		}
	}
	

	public void deleteUserorg(String[] ida, String orgid) {
		for(int i=0; i<ida.length; i++){
			List list = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
			.concat(BusinessConstants.SYS_USERORG), "userid='" + ida[i] + "'",null,null,null);
			if (list.size()>1) {
				RockUser2dept temp = (RockUser2dept)list.get(0);
				this.systemDao.delete(temp); 
			} else if (list.size() == 1) {
				RockUser2dept temp = (RockUser2dept)list.get(0);
				temp.setDeptId(Constant.APPOrgRootID);
				this.systemDao.saveOrUpdate(temp);
			}
		}
	}
	
	/*通过组织机构ID过滤用户，带分页,资料电子文档密级
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#findUserByOrgOther(java.lang.String, java.lang.Integer, java.lang.Integer, java.util.HashMap)
	 */
	public List<RockUser> findUserByOrgOther(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid) {
		StringBuffer hql = new StringBuffer("from RockUser u, RockUser2dept o where u.userid = o.userid and o.DeptId='");
		hql.append((String)orgid.get("orgid"));
		hql.append("'");
		hql.append(" and u.userid not in(");
		hql.append((String)orgid.get("userid"));
		hql.append(")");
		if(orderby!=null) {
			hql.append(" order by u.");
			hql.append(orderby);
		}

		List list = this.systemDao.findByHql(hql.toString());
		List<RockUser> users = new ArrayList();
		for(int i=0; i<list.size(); i++){
			Object[] obj = (Object[])list.get(i); 
			for(int j=0; j<obj.length; j++){
				users.add((RockUser)obj[0]);
			}
		}
		return users;
	}
	
	public List<RockUser> findUserByRole(String orderby, Integer start, Integer limit,
			HashMap<String, String> roleid) {
		StringBuffer hql = new StringBuffer("from RockUser u, RockRole2user r where u.userid = r.userid and u.userstate='1' and r.rolepk='");
		hql.append((String)roleid.get("roleid"));
		hql.append("'");
		if(orderby!=null) {
			hql.append(" order by u.");
			hql.append(orderby);
		}

		List list = this.systemDao.findByHql(hql.toString());
		List<RockUser> users = new ArrayList();
		for(int i=0; i<list.size(); i++){
			Object[] obj = (Object[])list.get(i); 
			for(int j=0; j<obj.length; j++){
				users.add((RockUser)obj[0]);
			}
		}
		return users;
	}

	/**
	 * 角色唯一性校验
	 * 
	 * @param user
	 * @return 若为真则表示通过校验
	 */
	private boolean checkRoleUnique(RockRole role) {
		List list = this.systemDao.findByProperty(BusinessConstants.SYS_ROLE,"rolename", role.getRolename(),null,null,null);
		boolean flag = false;
		if (list.size() == 0) {
			flag = true;
		} else {
			RockRole temp = (RockRole) list.get(0);
			if (temp.getRolepk().equals(role.getRolepk())) {
				flag = true;
			}
		}
		return flag;
	}
	
	/**
	 * 属性模型唯一性校验
	 * @param type
	 * @return 若为真则表示通过校验
	 */
	private boolean checkTypeNameUnique(PropertyType type) {
		List list = this.systemDao.findByProperty("PropertyType", "typeName", type.getTypeName(), null, null, null);
		boolean flag = false;
		if(list.size() == 0) {
			flag = true;
		} else {
			PropertyType temp = (PropertyType)list.get(0);
			if(temp.getUids().equals(type.getUids())) {
				flag = true;
			}
		}
		return flag;
	}
	
	/**
	  * 获得属性代码List
	  * @param catagory
	  * @return
	  **/
	public List getCodeValue(String catagory) {
		return propertyCodeDAO.getCodeValue(catagory);
	}
	
	/**
	  * 根据类型名称和属性代码获得属性名称
	  * @param codeValue
	  * @param propertyName
	  * @return
	  **/
	private String getCodeNameByPropertyName(String codeValue,String propertyName) {
		
		return propertyCodeDAO.getCodeNameByPropertyName(codeValue, propertyName);
	}

	/**
	 *新增propertyType
	 */
	public void insertPropertyType(PropertyType type) throws SQLException,
			BusinessException {
		if(this.checkTypeNameUnique(type)) {
			if(type.getTypeName() == null || type.getTypeName().trim().equals("")) {
				throw new BusinessException("属性名称不能为空!");
			} else {
				this.systemDao.insert(type);
			}
		} else {
			throw new BusinessException("属性名称不唯一!");
		}
	}
	
	/**
	 *更新propertyType
	 */
	public void updatePropertyType(PropertyType type) throws SQLException,
			BusinessException {
		//if(this.checkTypeNameUnique(type)) {
			if(type.getTypeName() == null || type.getTypeName().trim().equals("")) {
				throw new BusinessException("属性名称不能为空!");
			} else {
				this.systemDao.saveOrUpdate(type);
			}
		/*} else {
			throw new BusinessException("属性名称不唯一!");
		}*/
	}
	
	/**
	 *删除propertyType，同时删除propertyCode
	 */
	public void deletePropertyType(PropertyType type) throws SQLException,
			BusinessException {
		this.systemDao.deleteAll(this.getCodeValue(type.getTypeName()));
		this.systemDao.delete(type);
	}

	/**
	 * 通过上级单位ID，获得下级单位的个数
	 */
	public int getUnitCountByParentId(String parentId,boolean hasPos) {
		return this.systemDao.countByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ORG), "upunit", parentId,hasPos);
	}
	
	
	
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
			
			List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
			
			if (treeName.equalsIgnoreCase("getOrgTree")) {			
				list = getOrgTree(parentId);
			}  
			
			/*if (treeName.equalsIgnoreCase("selectFrameTree")) {	
				String appid = ((String[])params.get("appid"))[0];
				list = this.appBuyMgm.getMatFrameTree(parentId, appid);
			}
			
			if (treeName.equalsIgnoreCase("getMatConTree")) {	
				String conid = ((String[])params.get("conid"))[0];
				list = this.matFrameMgm.getMatConTree(parentId, conid);
			}
			
			if (treeName.equalsIgnoreCase("matContractTree")) {	
				String conid = ((String[])params.get("conid"))[0];
				list = this.matFrameMgm.matContractTree(parentId, conid);
			}
			
			if (treeName.equalsIgnoreCase("contractMatTree")) {	
				String conid = ((String[])params.get("conid"))[0];
				String type = ((String[])params.get("type"))[0];
				list = this.matFrameMgm.contractMatTree(parentId, conid, type);
			}*/
			return list;
		}
	
	
	private List<ColumnTreeNode> getOrgTree(String parentId) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null && !parentId.equals("") ? parentId: Constant.APPOrgRootID;
		String str = "upunit='"+ parent +"'";
		List<SgccIniUnit> objects = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ORG), str,"viewOrderNum");
		Iterator<SgccIniUnit> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			SgccIniUnit temp = (SgccIniUnit) itr.next();
			int leaf = temp.getLeaf().intValue();			
			n.setId(temp.getUnitid());			// treenode.id
			n.setText(temp.getUnitname());		// treenode.text
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			jo.accumulate("ischeck", "false");
			
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	/**
	 * 锁定用户
	 */
	public void lockUser(String username) {
		RockUser user = (RockUser) this.systemDao.findBeanByProperty(BusinessConstants.SYS_USER,"useraccount", username);
		user.setUserstate("2");
		this.systemDao.saveOrUpdate(user);
	}
	
	/**
	 * 拼写column树(带复选框和不带复选框)的json串
	 */
	public String convertUnitColumnJson(String unitid , String pubId , String type , String treeType) {
		System.out.println("-----------------------------The unitid is "+unitid);
		String sql = "";
		sql = "select t.unitid, t.unitname,(select count(unitid) from sgcc_ini_unit where upunit=t.unitid and unit_type_id <> '9') as leaf , "
			+ "decode((select count(*) from sgcc_info_pub_history p where p.unitid = t.unitid and p.pubinfo_id='"+pubId+"'),'0','false','true') as flag , t.unit_type_id unitTypeId "
			+ "from sgcc_ini_unit t  where t.unit_type_id <> '9' and t.upunit = '" + unitid + "' order by t.view_order_num " ;

		System.out.println("********************* The hql is "+sql);
		List list = this.systemDao.getDataAutoCloseSes(sql);
		String jsonStr = "[";
		if(treeType.equals("columnCheck")) {
			for (int i = 0; i < list.size(); i++) {
				Object[] rs = (Object[])list.get(i);
				String leaf = (rs[2].toString().equals("0") ? ",leaf: true" : ",leaf: false");
				jsonStr += "{id:'"+rs[0]+"'"  + ",unitname:'"+rs[1]+"'" + leaf;
				if("10000100000000".equals(rs[0])) {
					jsonStr = jsonStr + ",flag:'',unitTypeId:'',checked:false,disabled:true,uiProvider:'col'" ;
				} else if(rs[4].equals("3") || rs[4].equals("5")) {
					jsonStr = jsonStr + ",flag:'',unitTypeId:'"+rs[4]+"',checked:false,disabled:false,uiProvider:'col'" ;
				} else {
					jsonStr = jsonStr + ",flag:'"+rs[3]+"'"
							+",unitTypeId:'"+rs[4]+"'"
					   		+",checked:"+rs[3]
					        +",disabled:"+rs[3]
							+ ",uiProvider:'col'";
				}
				jsonStr += "}";
				if(i<list.size()-1){
					jsonStr += ",";
				}
			}
		}
		jsonStr += "]";
		System.out.println(jsonStr);
		return jsonStr;
	}
	
	/**
	 * 通过单位ID获取单位对象信息
	 * @param unitid
	 * @return
	 */
	public SgccIniUnit getUnitById(String unitid) {
		SgccIniUnit unit = (SgccIniUnit)this.systemDao.findBeanByProperty("com.sgepit.frame.sysman.hbm.SgccIniUnit", "unitid", unitid);
		return unit;
	}
	
	/**
	 * 通过上级单位ID，获得下级单位的个数
	 */
	public int getUnitCountByParentId(String parentId) {
		return this.systemDao.countByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ORG), "upunit", parentId);
	}
	
	private void setModuleOrderCode(List list){
		if(list!=null&&list.size()>0){
			RockPower rockPower = null;
			for(int i=0;i<list.size();i++){
				rockPower = (RockPower)list.get(i);
				rockPower.setOrdercode(rockPower.getOrdercode()+1);
				systemDao.saveOrUpdate(rockPower);
			}
		}
	}

	private static boolean isInteger(String value) { 
		try { 
			Integer.parseInt(value); 
			return true; 
		} catch (NumberFormatException e) { 
			return false; 
		} 
	}
	
	public List getChildRockPowersByParentId(String parentId, HttpSession session){
		List<RockPower> list = new ArrayList<RockPower>();
		HashMap map = (HashMap)session.getAttribute(Constant.USERMODULES);
		Iterator itr = map.entrySet().iterator();
		while (itr.hasNext()) {
			Map.Entry entry = (Map.Entry) itr.next();
			RockPower temp = (RockPower) entry.getValue();
			if (temp.getParentid().equalsIgnoreCase(parentId)){
				list.add(temp);
			}
		}
		Collections.sort(list, new SortOrderAsc());
		return list;
	}
	
	public String getChildRockPowerStr(String parentId, HttpSession session){
		List<RockPower> list = getChildRockPowersByParentId(parentId, session);
		StringBuffer sbf = new StringBuffer("[");
		for(int i=0; i<list.size(); i++){
			RockPower r = (RockPower)list.get(i);
			if (this.hasModuleChild(r.getPowerpk(), session)){
				sbf.append("new Ext.tree.TreePanel({id:'");
				sbf.append(r.getPowerpk());
				sbf.append("',iconCls:'");
				sbf.append(r.getIconcls()!=null?r.getIconcls().split("\\.")[0].trim():"icon-config");
				sbf.append("',rootVisible:false,loader: new Ext.tree.TreeLoader(),title:'");
				sbf.append(r.getPowername());
				sbf.append("',flowflag:'");
				sbf.append(r.getFlowflag());
				sbf.append("',ifalone:'");
				sbf.append(r.getIfalone());
				sbf.append("',root: new Ext.tree.AsyncTreeNode(");
				sbf.append(getChildPowerInTreeNode(r, session));
				sbf.append(")}),");
			} else {
				sbf.append("{id:'");
				sbf.append(r.getPowerpk());
				sbf.append("',iconCls:'");
				sbf.append(r.getIconcls()!=null?r.getIconcls().split("\\.")[0].trim():"icon-config");
				sbf.append("',title:'");
				sbf.append(r.getPowername());
				sbf.append("',flowflag:'");
				sbf.append(r.getFlowflag());
				sbf.append("',ifalone:'");
				sbf.append(r.getIfalone());
				sbf.append("',html:'<div class=powerNode");
				sbf.append(r.getUrl()!=null?"":" disabled=true");
				sbf.append("><img src=../res/images/application_side_boxes.png align=absmiddle>&nbsp;<a href=");
				//sbf.append(Constant.AppRoot.concat(r.getUrl()));
				sbf.append(Constant.AppRoot.concat("servlet/SysServlet?ac=loadmodule&modid="));
				sbf.append(r.getPowerpk());
				sbf.append(" target=contentFrame>");
				sbf.append(r.getPowername());
				sbf.append("</a></div>'},");
			}
		}
		if (sbf.lastIndexOf(",") == sbf.length() - 1)
			sbf.deleteCharAt(sbf.length() - 1);
		sbf.append("]");
		return sbf.toString();
	}
	public String getTreeByPk(String parentId, HttpSession session){
		StringBuffer sbf = new StringBuffer();
		try{
			RockPower r = null;
			HashMap map = (HashMap)session.getAttribute(Constant.USERMODULES);
			Iterator itr = map.entrySet().iterator();
			while (itr.hasNext()) {
				Map.Entry entry = (Map.Entry) itr.next();
				r = (RockPower) entry.getValue();
				if (r.getPowerpk().equalsIgnoreCase(parentId)){
					break;
				}
			};
			if(r!=null){
					sbf.append("new Ext.tree.TreePanel({id:'");
					sbf.append(r.getPowerpk().concat("_tree"));
					sbf.append("',iconCls:'");
					sbf.append(r.getIconcls()!=null?r.getIconcls().split("\\.")[0].trim():"icon-config");
					sbf.append("',rootVisible:false,autoScroll:true,loader: new Ext.tree.TreeLoader()");
					sbf.append(",root: new Ext.tree.AsyncTreeNode(");
					sbf.append(getChildPowerInTreeNode(r, session));
					sbf.append(")})");
			}else{
				sbf.append("new Ext.Panel({html:'功能菜单未定义'})");
			}
		}catch(Exception ex){
			ex.printStackTrace();
			StringBuffer msg = new StringBuffer("");
			StackTraceElement[] st = ex.getStackTrace();
			for (int i = 0; i < st.length; i++) {
				if (st[i].getClassName().indexOf("com.sgepit") > -1) {
					msg.append(st[i].getClassName());
					msg.append(".");
					msg.append(st[i].getMethodName());
					msg.append("(");
					msg.append(st[i].getFileName());
					msg.append(":");
					msg.append(st[i].getLineNumber());
					msg.append(")\\n");
				}
			}
			sbf.append("new Ext.form.TextArea({readOnly:true,value:'载入目录失败!\\n抛出异常");
			sbf.append(ex.toString());
			sbf.append("\\n");
			sbf.append(msg.toString());
			sbf.append("'})");
		}	
		return sbf.toString();
	}
	
	public boolean hasModuleChild(String parentId, HttpSession session) {
		List<RockPower> list = new ArrayList<RockPower>();
		HashMap map = (HashMap)session.getAttribute(Constant.USERMODULES);
		Iterator itr = map.entrySet().iterator();
		while (itr.hasNext()) {
			Map.Entry entry = (Map.Entry) itr.next();
			RockPower temp = (RockPower) entry.getValue();
			if (temp.getParentid().equalsIgnoreCase(parentId)){
				if ( temp.getModelflag()!=null && (temp.getModelflag().equals("0")||temp.getModelflag().equals("1")))
				return true;
			}
		}
		return false;
	}

	public String getChildPowerInTreeNode(RockPower parent, HttpSession session) {
		StringBuffer sbf = new StringBuffer("{");
		sbf.append("text:'");
		sbf.append(parent.getPowername());
		sbf.append("',id:'");
		sbf.append(parent.getPowerpk());
		sbf.append("',iconCls:'");
		sbf.append(parent.getIconcls()!=null?parent.getIconcls().split("\\.")[0].trim():"icon-config");
		sbf.append("'");
		List<RockPower> list = getChildRockPowersByParentId(parent.getPowerpk(),session);
		boolean hasModule = false;
		if (list.size()>0){
			sbf.append(",expanded:true,children:[");
			for(int i=0; i<list.size(); i++){
				RockPower r = (RockPower)list.get(i);
				boolean hsChild = hasModuleChild(r.getPowerpk(), session);
				if (r.getModelflag()!=null && (r.getModelflag().equals("0") || r.getModelflag().equals("1"))) {
					hasModule = true;
					if(r.getLeaf().intValue()==1 || (r.getLeaf().intValue()==0 && !hsChild)){
						sbf.append("{text:'");
						sbf.append(r.getPowername());
						sbf.append("',id:'");
						sbf.append(r.getPowerpk());
						sbf.append("',flowflag:'");
						sbf.append(r.getFlowflag());
						sbf.append("',ifalone:'");
						sbf.append(r.getIfalone());
						sbf.append("',iconCls:'");
						sbf.append(r.getIconcls()!=null?r.getIconcls().split("\\.")[0].trim():"");
						sbf.append("',href:'");
						sbf.append(Constant.AppRoot.concat("servlet/SysServlet?ac=loadmodule&modid="));
						sbf.append(r.getPowerpk());
						//sbf.append(Constant.AppRoot.concat(r.getUrl()));
						sbf.append(r.getUrl()!=null?"',":"',disabled :true,");
						sbf.append("hrefTarget:'contentFrame',leaf:true},");
					}else{
						sbf.append(getChildPowerInTreeNode(r, session));
						sbf.append(",");
					}
				}
			}
			if (sbf.lastIndexOf(",") == sbf.length() - 1)
				sbf.deleteCharAt(sbf.length() - 1);
			sbf.append("]");

			if (!hasModule) {
				sbf.delete(sbf.length()-26, sbf.length());
			}
		} 
		if(list.size() == 0 || !hasModule){
			sbf.append(",href:'");
			sbf.append(Constant.AppRoot.concat("servlet/SysServlet?ac=loadmodule&modid="));
			sbf.append(parent.getPowerpk());
			//sbf.append(Constant.AppRoot.concat(parent.getUrl()));
			sbf.append("',flowflag:'");
			sbf.append(parent.getFlowflag());
			sbf.append(parent.getUrl()!=null?"',":"',disabled :true,");
			sbf.append("hrefTarget:'contentFrame'");
		}
		sbf.append("}");
		return sbf.toString();
	}

	/**
	 * 获取功能树节点（包括常用菜单）
	 * 
	 * @param parentId
	 * @return
	 */
	public List<TreeNode> buildModuleConfigTreeNodes(String parentId, String userId, HashMap modulesMap, boolean includeFast) {
		String commonId = Constant.CommonModuleRootID;
		List<TreeNode> tree = new ArrayList<TreeNode>();
		if (includeFast) {
			if(parentId.equals(Constant.DefaultModuleRootID)){
				TreeNode treeNode = new TreeNode();
				treeNode.setId(commonId);
				treeNode.setText("常用操作");
				treeNode.setDescription("");
				treeNode.setCls("cls");
				treeNode.setIconCls("icon-fast-pkg");
				treeNode.setLeaf(false);
				treeNode.setHref("");
				tree.add(treeNode);
			}else if(parentId.equals(commonId)){
				List uList = getFastModulesByUserId(userId);
				for (int i = 0; i < uList.size(); i++) {
					RockPower rockPower = (RockPower) uList.get(i);
					TreeNode treeNode = convertRocePowerNode(rockPower);
					treeNode.setId(treeNode.getId()+Constant.SPLITB+userId);
					treeNode.setIconCls("icon-leaf");
					tree.add(treeNode);
				}
			}
		}
		if(!parentId.equals(commonId)){
			List<RockPower> list = getModulesByParentId(parentId);
			for (int i = 0; i < list.size(); i++) {
				RockPower rockPower = (RockPower) list.get(i);
				if (modulesMap.containsKey(rockPower.getPowerpk()))
					tree.add(convertRocePowerNode(rockPower));
			}
		}
		
		return tree;
	}

	/**
	  * 设为常用操作
	  * @param powerPk
	  * @param userId
	  * @return
	  **/
	public String addCommonPower(String powerPk,String targetPk,String userId,String type)throws BusinessException{
		String result = "ok";
//		List allList = systemDao.findByWhere(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), "userid='"+userId+"' and powerpk='"+powerPk+"'");
//		if(allList!=null&&allList.size()>0){
//			throw new BusinessException(BusinessConstants.MSG_ROCK_POWER_USER_EXIST);
//		}
		if(type.equals("append")){//在某个节点内
			int showOrder = 0 ;
			String sql = "select max(show_order) from rock_power_user where userid='"+userId+"'";
			List list = systemDao.getDataAutoCloseSes(sql);
			if(list!=null&&list.size()>0){
				if(list.get(0)!=null){
					showOrder = ((BigDecimal)list.get(0)).intValue();
				}
			}
			RockPowerUser powerUser = new RockPowerUser();
			RockPowerUserId id = new RockPowerUserId();
			id.setPowerpk(powerPk);
			id.setUserid(userId);
			powerUser.setId(id);
			powerUser.setShowOrder(showOrder+1);
			systemDao.insert(powerUser);
		}else{
			RockPowerUserId id = new RockPowerUserId();
			id.setPowerpk(targetPk);
			id.setUserid(userId);
			RockPowerUser targetNode = (RockPowerUser)systemDao.findByCompId(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), id);
			if(targetNode!=null){
				List list = null;
				int curShowOrder = targetNode.getShowOrder();
				if(type.equals("above")){
					List preList = systemDao.findByWhere(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), "userid='"+userId+"' and show_order="+String.valueOf(targetNode.getShowOrder()-1));
					if(preList!=null&&preList.size()>0){
						list = systemDao.findByWhere(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), "userid='"+userId+"' and show_order>="+targetNode.getShowOrder());
					}
				}else if(type.equals("below")){
					List sufList = systemDao.findByWhere(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), "userid='"+userId+"' and show_order="+String.valueOf(targetNode.getShowOrder()+1));
					if(sufList!=null&&sufList.size()>0){
						list = systemDao.findByWhere(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), "userid='"+userId+"' and show_order>"+targetNode.getShowOrder());
					}
					curShowOrder++;
				}
				RockPowerUser afterNode = null;
				if(list!=null&& list.size()>0){
					for(int i=0;i<list.size();i++){
						afterNode = (RockPowerUser)list.get(i);
						afterNode.setShowOrder(afterNode.getShowOrder()+1);
						systemDao.saveOrUpdate(afterNode);
					}
				}
				RockPowerUserId pId = new RockPowerUserId();
				pId.setPowerpk(powerPk);
				pId.setUserid(userId);
				RockPowerUser curPower = (RockPowerUser)systemDao.findByCompId(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), pId);
				if(curPower!=null){
					curPower.setShowOrder(curShowOrder);
					systemDao.saveOrUpdate(curPower);
				}else{
					curPower = new RockPowerUser();
					curPower.setId(pId);
					curPower.setShowOrder(curShowOrder);
					systemDao.insert(curPower);
				}
				
			}
			
		}
		
		return result;
	}
	
	/**
	  * 删除常用操作
	  * @param powerPk
	  * @param userId
	  **/
	public void deleteCommonPower(String powerPk,String userId){

		RockPowerUserId id = new RockPowerUserId();
		id.setPowerpk(powerPk);
		id.setUserid(userId);
		RockPowerUser rockPowerUser = (RockPowerUser)systemDao.findByCompId(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE_USER), id);
		systemDao.delete(rockPowerUser);
	}


	public void deleteTemplate(AppTemplate appTemplate) {
		String fileid = appTemplate.getFileid();
		this.systemDao.deleteFileInBlob(fileid);
		this.systemDao.delete(appTemplate);
	}

	public void deleteTemplates(String[] ida) {
		for (int i = 0; i < ida.length; i++) {
			AppTemplate appTemplate = (AppTemplate) this.systemDao.findById(AppTemplate.class.getName(), ida[i]);
			deleteTemplate(appTemplate);
		}
	}

	public void insertTemplate(AppTemplate appTemplate) throws BusinessException {
		if (appTemplate.getTemplatecode() == null || appTemplate.getTemplatecode().trim().equals(""))
			throw new BusinessException("模板编码不能为空!");
		AppTemplate obj = (AppTemplate)this.systemDao.findBeanByProperty(AppTemplate.class.getName(), "templatecode", appTemplate.getTemplatecode());
		if (obj != null){
			throw new BusinessException("模板编码已经存在,不能重复!");
		}
		Date d = DateUtil.getSystemDate();
		appTemplate.setDatecreated(d);
		appTemplate.setLastmodify(d);
		this.systemDao.insert(appTemplate);
	}

	public void updateTemplate(AppTemplate appTemplate) throws BusinessException {
		List list = this.systemDao.getDataAutoCloseSes("select templateid from App_Template where templatecode='" + appTemplate.getTemplatecode() + "'");
		if (list != null && list.size()>0) {
			String id = (String)list.get(0);
			if(!id.equalsIgnoreCase(appTemplate.getTemplateid()))
				throw new BusinessException("模板编码已经存在,不能重复!");
		}
		Date d = DateUtil.getSystemDate();
		appTemplate.setLastmodify(d);
		this.systemDao.saveOrUpdate(appTemplate);
	}

	public List<SgccIniUnit> getUnitListByWhere(String where) {
		return this.systemDao.findByWhere(SgccIniUnit.class.getName(),  where, "viewOrderNum");
	}

	public List<?> buildFastModuleTreeNodes(String parentId, String userId,
			HashMap<String, RockPower> modulesMap) {
		List<TreeNode> tree = new ArrayList<TreeNode>();
		List uList = getFastModulesByUserId(userId);
		for (int i = 0; i < uList.size(); i++) {
			RockPower rockPower = (RockPower) uList.get(i);
			TreeNode treeNode = convertRocePowerNode(rockPower);
			treeNode.setId(treeNode.getId()+Constant.SPLITB+userId);
			treeNode.setIconCls("icon-leaf");
			tree.add(treeNode);
		}
		return tree;
	}

	public List<SysPortletConfig> getUserPortletConfig(String userid) {
		List list = new ArrayList();
		//取用户数据
		list = this.systemDao.findByHql("from SysPortletConfig m, RockPower u where m.portletId = u.powerpk and m.userId = '" + userid + "' order by m.colIdx, m.rowIdx");
		if (list==null || list.size()==0){
			//取用户角色的数据
			list = systemDao.findByHql("from SysPortletConfig m, RockPower p, RockRole2user u where m.userId = u.rolepk and u.userid = '" + userid + "' and m.portletId=p.powerpk order by m.colIdx, m.rowIdx");
			//List temp = systemDao.findByHql("from RockPower m, RockCharacter2power v, RockRole2user u where m.powerpk = v.powerpk and v.rolepk = u.rolepk and u.userid = '" + userid + "' and m.modelflag='3'");
			if (list==null || list.size()==0){
				//取公用角色的数据（这里不考虑用户角色在SysPortletConfig中的初始化，另有专门的维护模块）
				List templist = systemDao.findByHql("from SysPortletConfig m, RockPower u where m.portletId = u.powerpk and m.userId = '" + Constant.PUBLIC_ROLE_ID + "' order by m.colIdx, m.rowIdx");
				if (templist!=null){
					for(int i=0; i<templist.size(); i++){
						Object[] object = (Object[])templist.get(i); 
						SysPortletConfig spc = (SysPortletConfig)object[0];
						RockPower rpc = (RockPower)object[1];
						SysPortletConfig obj = new SysPortletConfig(userid, spc.getPortletId(), spc.getRowIdx(),
								spc.getColIdx(), spc.getPh(), spc.getCustomParams(), spc.getShow());
						this.systemDao.insert(obj);
						obj.setPortletName(rpc.getPowername());
						obj.setPortletCode(rpc.getResourcepk());
						list.add(obj);
					}
				}
			} else {
				List tempList = new ArrayList();
				HashMap temp = new HashMap();
				for(int i=0; i<list.size(); i++){
					Object[] obj = (Object[])list.get(i);
					SysPortletConfig spc = (SysPortletConfig)obj[0];
					if (!temp.containsKey(spc.getPortletId())){
						RockPower rpc = (RockPower)obj[1];
						temp.put(spc.getPortletId(), spc);
						SysPortletConfig tempSpc = new SysPortletConfig(userid, spc.getPortletId(), spc.getRowIdx(),
								spc.getColIdx(), spc.getPh(), spc.getCustomParams(), spc.getShow());
						this.systemDao.insert(tempSpc);
						tempSpc.setPortletName(rpc.getPowername());
						tempSpc.setPortletCode(rpc.getResourcepk());
						tempList.add(tempSpc);
					}
				}
				list = tempList;
			}
		} else {
			List tempList = new ArrayList();
			for(int i=0; i<list.size(); i++){
				Object[] obj = (Object[])list.get(i);
				SysPortletConfig spc = (SysPortletConfig)obj[0];
				RockPower rpc = (RockPower)obj[1];
				spc.setPortletName(rpc.getPowername());
				spc.setPortletCode(rpc.getResourcepk());
				tempList.add(spc);
			}
			list = tempList;
		}

		return list;
	}

	public void initRolePortlets() {
		List list = systemDao.findByHql("from RockPower m, RockCharacter2power v where m.powerpk = v.powerpk and v.rolepk = '" + Constant.PUBLIC_ROLE_ID + "' and m.modelflag='3'");
		HashMap temp = new HashMap();
		for(int i=0; i<list.size(); i++){
			Object[] obj = (Object[])list.get(i); 
			for(int j=0; j<obj.length; j++){
				RockPower rock = (RockPower)obj[0];
				if (!temp.containsKey(rock.getPowerpk())){
					temp.put(rock.getPowerpk(), rock);
					SysPortletConfig spc = new SysPortletConfig(Constant.PUBLIC_ROLE_ID, rock.getPowerpk());
					spc.setShow("true");
					this.systemDao.insert(spc);
				}
			}
		}
		
		list = systemDao.findByHql("from RockPower m, RockCharacter2power v where m.powerpk = v.powerpk and v.rolepk = '" + Constant.ADMIN_ROLE_ID + "' and m.modelflag='3'");
		temp = new HashMap();
		for(int i=0; i<list.size(); i++){
			Object[] obj = (Object[])list.get(i); 
			for(int j=0; j<obj.length; j++){
				RockPower rock = (RockPower)obj[0];
				if (!temp.containsKey(rock.getPowerpk())){
					temp.put(rock.getPowerpk(), rock);
					SysPortletConfig spc = new SysPortletConfig(Constant.ADMIN_ROLE_ID, rock.getPowerpk());
					spc.setShow("true");
					this.systemDao.insert(spc);
				}
			}
		}		
	}	
	
	
	public String getModulesIconClsStr(){
		List list = systemDao.findByWhere(RockPower.class.getName(), "iconcls is not null");
		StringBuffer sbf = new StringBuffer("");
		for(int i=0; i<list.size(); i++){
			RockPower r = (RockPower)list.get(i);
			sbf.append(".");
			sbf.append(r.getIconcls().split("\\.")[0]);
			sbf.append(" { background-image:url("+Constant.AppRoot+"jsp/res/images/icons/");
			sbf.append(r.getIconcls());
			sbf.append(") !important;}\r");
		}
		return sbf.toString();
	}

	public void updatePortletConfig(SysPortletConfig config) {
		this.systemDao.saveOrUpdate(config);
	}

	/**
	 * 根据组织Id获取所有组织机构信息（没有岗位）
	 */
	public List<SgccIniUnit> buildTreeNodesWithoutPos (String parentId,String attachUnit,String year) {
		List<SgccIniUnit> list = null;
		if(!year.equals("all")){
			list = getOrgByParentId(parentId,attachUnit,year,false);
		}else{
			list = getOrgByParentId(parentId,attachUnit,false);
		}
		return list;
	}
	
	/*
	 * 通过父节点id查找模块 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#getModulesByParentId(java.lang.String)
	 */
	private List<SgccIniUnit> getOrgByParentId(String parentId,String attachUnit,boolean withPos) {
		String where = "upunit='" + parentId + "'";
		
		if (!attachUnit.equals(""))
		{
			//where = where + " and (attach_unitid is null or attach_unitid='" + attachUnit+ "')";
			where = where + " and  attach_unitid='" + attachUnit+ "'";
		}
		if(withPos==false){
			where += " and unit_type_id<>'9'";
		}
		
		List<SgccIniUnit> list = this.systemDao.findByWhere(
				BusinessConstants.SYS_ORG, where , "viewOrderNum");
		
		return list;
	}
	
	/**
	  * 通过父节点id查找模块 
	  * @param parentId
	  * @param attachUnit
	  * @param year
	  * @return
	  **/
	private List<SgccIniUnit> getOrgByParentId(String parentId,String attachUnit,String year,boolean withPos) {
		String where = "upunit='" + parentId + "'";
		
		if (!attachUnit.equals(""))
		{
			//where = where + " and (attach_unitid is null or attach_unitid='" + attachUnit+ "')";
			where = where + " and  attach_unitid='" + attachUnit+ "'";
		}
		
		where += " and (start_year<='"+year+"' or start_year is null) and (end_year>='"+year+"' or end_year is null) and state='1'" ;
		
		if(withPos==false){
			where += " and unit_type_id<>'9'";
		}
		List<SgccIniUnit> list = this.systemDao.findByWhere(
				BusinessConstants.SYS_ORG, where , "viewOrderNum");
		
		return list;
	}

	public List<SysPortletConfig> getRolePortletConfig(String roleid) {
		List list = this.systemDao.findByHql("from SysPortletConfig m, RockPower u where m.portletId = u.powerpk and m.userId = '" + roleid + "' order by m.colIdx, m.rowIdx");
		List tempList = new ArrayList();
		for(int i=0; i<list.size(); i++){
			Object[] obj = (Object[])list.get(i);
			SysPortletConfig spc = (SysPortletConfig)obj[0];
			RockPower rpc = (RockPower)obj[1];
			spc.setPortletName(rpc.getPowername());
			spc.setPortletCode(rpc.getResourcepk());
			tempList.add(spc);
		}
		return tempList;
	}
	
	public Map<String,SgccIniUnit> getUnitMap(){
		Map<String,SgccIniUnit> mapUnit = new HashMap<String,SgccIniUnit>();		
		List<SgccIniUnit> unitList = this.sgccIniUnitDAO.findAll();
		for (int index=0;index<unitList.size();index++){
			mapUnit.put(unitList.get(index).getUnitid(), unitList.get(index));
		}
		return mapUnit;
	}
	/**
	 * 收藏夹
	 * @param parentId
	 * @param userId
	 * @param session
	 * @return
	 */
	public String getFavTree(String userId, HttpSession session){
		StringBuffer sbf = new StringBuffer();
		try{
			//01
			String parentId = "01";
			RockPower rock = null;
			HashMap<String,String > resultMap = new HashMap<String,String>();
			HashMap map = (HashMap)session.getAttribute(Constant.USERMODULES);
			Iterator itr = map.entrySet().iterator();
			while (itr.hasNext()) {
				Map.Entry entry = (Map.Entry) itr.next();
				rock = (RockPower) entry.getValue();
				if (rock.getPowerpk().equalsIgnoreCase(parentId)){
					break;
				}
			};
			
			if(rock!=null){
				List<RockPowerUserFav> list = systemDao.findByWhere("com.sgepit.frame.sysman.hbm.RockPowerUserFav", 
						"userid = '"+userId+"'");
				if(list.size()>0){
					for(int i=0;i<list.size();i++){
						resultMap.put(list.get(i).getId().getPowerpk(), "");
					}
				}
				///////////////////////////////////////
				sbf.append("new Ext.tree.TreePanel({id:'");
				sbf.append(rock.getPowerpk().concat("_fav"));
				sbf.append("', checkModel:'cascade',onlyLeafCheckable:false,iconCls:'");
				sbf.append(rock.getIconcls()!=null?rock.getIconcls().split("\\.")[0].trim():"icon-config");
				sbf.append("',rootVisible:true,autoScroll:true,animate: false");
				sbf.append(",loader: new Ext.tree.TreeLoader({baseAttrs: { uiProvider: Ext.tree.TreeCheckNodeUI }})");
				sbf.append(",root: new Ext.tree.AsyncTreeNode(");
				sbf.append(getFavChildPowerInTreeNode(rock, resultMap,session));
				sbf.append(")})");
			}else{
				sbf.append("new Ext.Panel({html:'功能菜单未定义'})");
			}
		}catch(Exception ex){
			ex.printStackTrace();
			StringBuffer msg = new StringBuffer("");
			StackTraceElement[] st = ex.getStackTrace();
			for (int i = 0; i < st.length; i++) {
				if (st[i].getClassName().indexOf("com.sgepit") > -1) {
					msg.append(st[i].getClassName());
					msg.append(".");
					msg.append(st[i].getMethodName());
					msg.append("(");
					msg.append(st[i].getFileName());
					msg.append(":");
					msg.append(st[i].getLineNumber());
					msg.append(")\\n");
				}
			}
			sbf.append("new Ext.form.TextArea({readOnly:true,value:'载入目录失败!\\n抛出异常");
			sbf.append(ex.toString());
			sbf.append("\\n");
			sbf.append(msg.toString());
			sbf.append("'})");
		}	
		System.out.println(sbf.toString());
		return sbf.toString();
	};
	public String getFavChildPowerInTreeNode(RockPower parent,Map<String,String> resultMap, HttpSession session) {
		StringBuffer sbf = new StringBuffer("{");
		sbf.append("text:'");
		sbf.append(parent.getPowername());
		sbf.append("',id:'");
		sbf.append(parent.getPowerpk());
		sbf.append("',iconCls:'");
		sbf.append(parent.getIconcls()!=null?parent.getIconcls().split("\\.")[0].trim():"icon-config");
		sbf.append("'");
		if(resultMap.containsKey(parent.getPowerpk())) sbf.append(",checked:true,disabled:true"); 
		
		List<RockPower> list = getChildRockPowersByParentId(parent.getPowerpk(),session);
		boolean hasModule = false;
		if (list.size()>0){
			sbf.append(",expanded:true,children:[");
			for(int i=0; i<list.size(); i++){
				RockPower r = (RockPower)list.get(i);
				boolean hsChild = hasModuleChild(r.getPowerpk(), session);
				if (r.getModelflag()!=null && (r.getModelflag().equals("0") || r.getModelflag().equals("1"))) {
					hasModule = true;
					if(r.getLeaf().intValue()==1 || (r.getLeaf().intValue()==0 && !hsChild)){
						sbf.append("{text:'");
						sbf.append(r.getPowername());
						sbf.append("',id:'");
						sbf.append(r.getPowerpk());
						sbf.append("',iconCls:'");
						sbf.append(r.getIconcls()!=null?r.getIconcls().split("\\.")[0].trim():"");
						
						if(resultMap.containsKey(r.getPowerpk())){
							sbf.append("',checked:true,disabled:true,leaf:true},"); 
						}else{
							sbf.append("',leaf:true},");
						} 
						
					}else{
						sbf.append(getFavChildPowerInTreeNode(r,resultMap, session));
						sbf.append(",");
					}
				}
			}
			if (sbf.lastIndexOf(",") == sbf.length() - 1)
				sbf.deleteCharAt(sbf.length() - 1);
			sbf.append("]");

			if (!hasModule) {
				sbf.delete(sbf.length()-26, sbf.length());
			}
		} 
		sbf.append("}");
		return sbf.toString();
	}
	/**
	 * 添加到收藏夹
	 * @param userid
	 * @param powerpks
	 * @return
	 */
	public String addFavs(String userid,String powerpks){
		String rockbean = "com.sgepit.frame.sysman.hbm.RockPower";
		String[] powerpkarr = powerpks.split("`");
		String resultValue="";
		for(int i=0;i<powerpkarr.length;i++){
			resultValue += "`" + addFav(powerpkarr[i],userid);
		}
		String[] resultValuearr= resultValue.split("`");
		String rtrnStr="";
		for(int i=0;i<resultValuearr.length;i++){
			if(resultValuearr[i]=="false"){
				RockPower rockPower = (RockPower) systemDao.findById(rockbean,powerpkarr[i]);				
				rtrnStr += ";添加["+rockPower.getPowername()+"]失败";
			}
		}
		if(rtrnStr.length()==0){
			rtrnStr = "操作成功";
		}else{
			rtrnStr = rtrnStr.substring(1);
		}
		return rtrnStr;
	}
	public String addFav(String powerpk,String userid){
		String returnValue = "addSucess";
		try{
			String favbean = "com.sgepit.frame.sysman.hbm.RockPowerUserFav";
			String rockbean = "com.sgepit.frame.sysman.hbm.RockPower";
			RockPowerUserFavId rockPowerUserFavID = new RockPowerUserFavId();
			rockPowerUserFavID.setPowerpk(powerpk);
			rockPowerUserFavID.setUserid(userid);
			List lt = systemDao.findByWhere(favbean, (new StringBuilder()).append("powerpk='").append(powerpk).
					append("' and userid='").append(userid).append("'").toString());
			if(lt.size()==0){//收藏功能
				String sql = "select nvl(max(ordercode),0) maxcode from rock_power_user_fav where userid='"+userid+"'";
				List list = (new JdbcUtil()).query(sql);
				Long order = new Long(0);
				if(list!=null&&list.size()>0){
					if(list.get(0)!=null){
						Map map = (Map) list.get(0);
						order = ((BigDecimal)map.get("maxcode")).longValue(); 
					}
				}
				RockPowerUserFav rockPowerUserFav = new RockPowerUserFav();
				rockPowerUserFav.setId(rockPowerUserFavID);
				
				RockPower rockPower = (RockPower) systemDao.findById(rockbean,powerpk);			
				rockPowerUserFav.setPowername(rockPower.getPowername());
				rockPowerUserFav.setOrdercode(new Long(order+1));
				systemDao.saveOrUpdate(rockPowerUserFav);
			}else{
				systemDao.deleteAll(lt);
				returnValue = "deleteSucess";
			}
		}catch(Exception e){
			e.printStackTrace();
			returnValue = "false";
		}
		return returnValue;
	}
	public String getFavByUserID(String userID){
		String returnValue = "";
		String favbean = "com.sgepit.frame.sysman.hbm.RockPowerUserFav";
		String rockbean = "com.sgepit.frame.sysman.hbm.RockPower";
		List<RockPowerUserFav> rockFavList =  systemDao.queryWhereOrderBy(favbean, "userid='"+userID+"'", "ordercode asc");
		for(int i =0;i<rockFavList.size();i++){
			String powerpk = rockFavList.get(i).getId().getPowerpk();
			RockPower rockpower = (RockPower) systemDao.findById(rockbean,powerpk);
			
			if(rockpower!=null)
				returnValue += ";".concat(powerpk).concat("|").concat(rockpower.getPowername()).concat("|").
							concat(Constant.AppRoot).concat("servlet/SysServlet?ac=loadmodule&modid=").
							concat(rockpower.getPowerpk()).concat("|").concat((rockpower.getIconcls()!=null?rockpower.getIconcls().split("\\.")[0].trim():"icon-config"));
		}
		if(returnValue.equals("")){
			returnValue = ";";
		}
		return returnValue.substring(1);
	}
	public String updateOrder(String userid,String powerpk,String relationPk,String type){
		String favbean = "com.sgepit.frame.sysman.hbm.RockPowerUserFav";
		String rockbean = "com.sgepit.frame.sysman.hbm.RockPower";
		RockPowerUserFavId  id = new RockPowerUserFavId();
		id.setPowerpk(powerpk);
		id.setUserid(userid);
		
		RockPowerUserFavId  relationId = new RockPowerUserFavId();
		relationId.setPowerpk(relationPk);
		relationId.setUserid(userid);
		
		RockPowerUserFav hbm = (RockPowerUserFav) systemDao.findByCompId(favbean, id);
		RockPowerUserFav relationHbm = (RockPowerUserFav) systemDao.findByCompId(favbean, relationId);
		if(type.equals("above")){//在某个节点上面
			//判断relationPk的顺序号-1是不是被占用
			String where = "ordercode="+(relationHbm.getOrdercode()-1)+" and userid='"+userid+"' ";
			List list = systemDao.findByWhere(favbean,where);
			Long curOrder = relationHbm.getOrdercode()-1;
			if(list!=null&&list.size()>0){
				//依次将以后的顺序号+1
				where = "ordercode>="+(relationHbm.getOrdercode())+" and userid='"+userid+"'";
				List orderlist = systemDao.findByWhere(favbean,where);
				setTreeOrderCode(orderlist);
				curOrder = relationHbm.getOrdercode();
			}
			hbm.setOrdercode(curOrder);
			systemDao.saveOrUpdate(hbm);
		}else if(type.equals("below")){//在某个节点下面
			//判断relationPk的顺序号+1是不是被占用
			String where = "ordercode="+(relationHbm.getOrdercode()+1)+" and  userid='"+userid+"'";
			List list = systemDao.findByWhere(favbean,where);
			if(list!=null&&list.size()>0){
				//依次将以后的顺序号+1
				where = "ordercode>"+(relationHbm.getOrdercode())+" and userid='"+userid+"'";
				List orderlist = systemDao.findByWhere(favbean,where);
				setTreeOrderCode(orderlist);
			}
			hbm.setOrdercode(relationHbm.getOrdercode()+1);
			systemDao.saveOrUpdate(hbm);
		}
		return "";
	}
	public void setTreeOrderCode(List list){
		if(list!=null&&list.size()>0){
			for(int i=0;i<list.size();i++){
				RockPowerUserFav hbm = (RockPowerUserFav)list.get(i);
				hbm.setOrdercode(new Long(hbm.getOrdercode()+1));
				systemDao.saveOrUpdate(hbm);
			}
		}
	}
	/**
	 * 0显示功能菜单 1显示常用操作
	 */
	public boolean setShowTab(String userid, int index){
		boolean flag = false;
		try{
			Object object  = systemDao.findById("com.sgepit.frame.sysman.hbm.RockUser", userid);
			if(object!=null&&index>-1&&index<2){
				RockUser rockuser = (RockUser)object;
				rockuser.setShowtab(String.valueOf(index));
				flag = true;
			}
		}catch(RuntimeException e){
			e.printStackTrace();
		}
		return flag;
	}
	/**
	 * 组织结构树的获取，一般配合SysServlet使用，ac=buildingUnitTree,paramsmap存放由客户端采用get或post传递的参数
	 * @param paramsmap
	 * @return
	 */
	public String buildingUnitTree(Map paramsmap) {
		String jsonstring = "";

		String deployMode = paramsmap.get("deployMode")==null?"3group":paramsmap.get("deployMode").toString();//部署模式
		boolean async     = paramsmap.get("async")==null||paramsmap.get("async").toString().equals("true")?true:false;//同步异步
		String userunitid = paramsmap.get(Constant.USERUNITID).toString();
		String typeName   = paramsmap.get("typeName")==null?"组织机构类型": paramsmap.get("typeName").toString();
		boolean ignore    = paramsmap.get("ignore")!=null&&paramsmap.get("ignore").toString().equals("true")?true:false;//忽略部署模式，显示所有树节点
		String baseWhere  = paramsmap.get("baseWhere")!=null?paramsmap.get("baseWhere").toString():"1=1";
		String business   = paramsmap.get("business")==null?"":paramsmap.get("business").toString();
		String method     = paramsmap.get("method")==null?"":paramsmap.get("method").toString();
		
		initPropsMap(typeName);
		
		if(!(business.equals(""))&&!(method.equals(""))&&!(business.equals("systemMgm"))){//采用自定义的单位树获取方式，需要有一个参数为Map的方法
			paramsmap.remove("business");
			paramsmap.remove("method");
			Class partypes[] = new Class[1];
			partypes[0] = Map.class; // 参数集
			try {
				Object businessObj = Constant.wact.getBean(business);
				Method buildingTreeMethod = businessObj.getClass().getDeclaredMethod(method, partypes);
				jsonstring = (String) buildingTreeMethod.invoke(businessObj,paramsmap);
			} catch (SecurityException e) {
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			} catch (NullPointerException e) {
				throw new NullPointerException("Can not find the bean of "+business);
			}
		}else if(ignore){//忽略部署模式，显示所有树节点
			String parentId    = paramsmap.get("parentId")==null?"":paramsmap.get("parentId").toString();//父节点
			String unitbean    = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
			boolean columnTree = paramsmap.get("columnTree")==null||paramsmap.get("columnTree").toString().equals("false")?false:true;
			boolean ifcheck   = paramsmap.get("ifcheck")==null||paramsmap.get("ifcheck").toString().equals("false")?false:true;
			
			Map<String,Object> attrMap = new HashMap<String,Object>();
			if(ifcheck) attrMap.put("checked", false);
			if(columnTree) attrMap.put("uiProvider", "col");
			attrMap.put("modifyauth", true);
			
			if(async){//异步
				List list = sgccIniUnitDAO.findByWhere(unitbean, "upunit='"+parentId+"' and " +baseWhere,"view_order_num asc");
				JSONArray jsonArray = JSONArray.fromObject(list);
				for(int i=0,j=jsonArray.size();i<j;i++){
					addAttributesToUnitNode(jsonArray.getJSONObject(i), attrMap);
				}	
				jsonstring = jsonArray.toString();
			}else{//同步
				jsonstring = syncGetUnitChildrens(parentId,baseWhere,attrMap).toString();
			}
		}else if(deployMode.equals("3group")){//3group 3scatter 2Ascatter 2Bscatter
			if(async){//异步
				jsonstring = asyncBuilding3GroupUnitTree(paramsmap);
			}else{//同步
				jsonstring = syncBuilding3GroupUnitTree(paramsmap);
			}
		}else if(deployMode.equals("3scatter")){
			
		}else if(deployMode.equals("2Ascatter")){
			
		}else if(deployMode.equals("2Bscatter")){
			
		}
		//System.out.println(jsonstring);
		return jsonstring;
	}
	/**
	 * 同步加载三层集中部署组织结构树
	 * * @param paramsmap
	 * @return
	 */
	private String syncBuilding3GroupUnitTree(Map paramsmap){
		String parentId    = paramsmap.get("parentId")==null?"":paramsmap.get("parentId").toString();//父节点
		boolean columnTree = paramsmap.get("columnTree")==null||paramsmap.get("columnTree").toString().equals("false")?false:true;
		boolean ifcheck   = paramsmap.get("ifcheck")==null||paramsmap.get("ifcheck").toString().equals("false")?false:true;
		String userunitid  = paramsmap.get(Constant.USERUNITID).toString();
		String typeName    = paramsmap.get("typeName")==null?"组织机构类型": paramsmap.get("typeName").toString();
		String unitbean    = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
		String _unitsort = ((SgccIniUnit)systemDao.findBeanByProperty(unitbean, "unitid", userunitid)).getUnitTypeId();
		String baseWhere  = paramsmap.get("baseWhere")!=null?paramsmap.get("baseWhere").toString():"1=1";
		String jsonstring = "";
		
		Map<String,Object> attrMap = new HashMap<String,Object>();
		if(ifcheck)   attrMap.put("checked", false);
		if(columnTree) attrMap.put("uiProvider", "col");
		attrMap.put("modifyauth", true);
		
		if(_unitsort.equals(0)||_unitsort.equals("1")){//集团公司及集团总部用户
			JSONArray jsonArray = new JSONArray();
			List list = sgccIniUnitDAO.findByWhere(unitbean, "upunit='"+parentId+"' and " +baseWhere,"view_order_num asc");
			for(Iterator it=list.iterator();it.hasNext();){
				SgccIniUnit hbm = (SgccIniUnit) it.next();
				hbm = reviseLeafByUnitHMBAndWhere(hbm, "upunit='"+hbm.getUnitid()+"' and " +baseWhere);
				
				JSONObject jsonobject = JSONObject.fromObject(hbm);
				addAttributesToUnitNode(jsonobject, attrMap);
				
				if(hbm.getLeaf()==0){
					jsonobject.put("children",syncGetUnitChildrens(jsonobject.get("unitid").toString(),baseWhere,attrMap));
				}
				jsonArray.add(jsonobject);
			}
			jsonstring = jsonArray.toString();
		}else{//非集团公司及集团总部用户
			JSONArray jsonArray = null;
			int postion = -1;
			List list = sgccIniUnitDAO.getDataAutoCloseSes("select unitid from sgcc_ini_unit connect by prior upunit = unitid " +
							"start with unitid = '"+userunitid+"'");//向上递归
			//list的单位类型从小到到
			if(list.size()>0){
				List list1 = new ArrayList();
				for(int i=0,j=list.size();i<j;i++){
					String unitid = (String) list.get(i);
					if(unitid.equals(parentId)){
						break;
					}else{
						list1.add(sgccIniUnitDAO.findBeanByProperty(unitbean, "unitid", ((String) list.get(i))));
					}
				}
				
				JSONArray jsonArray1 = JSONArray.fromObject(list1);
				JSONObject prop = null;
				JSONObject tmp = null;
				
				for(int i=0,j=list.size();i<j;i++){
					SgccIniUnit hbm = (SgccIniUnit) list.get(i);
					hbm = reviseLeafByUnitHMBAndWhere(hbm, "upunit='"+hbm.getUnitid()+"' and " +baseWhere);
					
					prop = JSONObject.fromObject(hbm);
					
					if(i==0){//用户所在的单位
						attrMap.put("modifyauth", true);//具有编辑权限
						if(hbm.getLeaf()==0){//具有下级单位
							prop.put("children", syncGetUnitChildrens(prop.getString("unitid"), baseWhere, attrMap));
						}
					}else{//用户所在的单位的上级单位
						attrMap.put("modifyauth", false);//不具有编辑权限
						if(tmp!=null){
							prop.put("children", JSONArray.fromObject(tmp));
						}
					}
					addAttributesToUnitNode(prop, attrMap);
					tmp = prop;
				}
				
				jsonArray = JSONArray.fromObject(prop);
			}
			if(jsonArray!=null) jsonstring = jsonArray.toString();
		}
		return jsonstring;
	}
	/**
	 * 异步加载三层集中部署组织结构树
	 * @param paramsmap
	 * @return
	 * @author liangwj 
	 * @since 2011.5.31 
	 * sgcc_ini_unit的leaf不十分靠谱
	 */
	private String asyncBuilding3GroupUnitTree(Map paramsmap){
		String parentId  = paramsmap.get("parentId")==null?"":paramsmap.get("parentId").toString();//父节点
		boolean columnTree = paramsmap.get("columnTree")==null||paramsmap.get("columnTree").toString().equals("false")?false:true;
		String userunitid= paramsmap.get(Constant.USERUNITID).toString();
		String unitbean  = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
		boolean ifcheck = paramsmap.get("ifcheck")==null||paramsmap.get("ifcheck").toString().equals("false")?false:true;
		String _unitsort = ((SgccIniUnit)systemDao.findBeanByProperty(unitbean, "unitid", userunitid)).getUnitTypeId();
		String baseWhere  = paramsmap.get("baseWhere")!=null?paramsmap.get("baseWhere").toString():"1=1";
		String jsonstring= "";
		
		Map<String,Object> attrMap = new HashMap<String,Object>();
		if(ifcheck)    attrMap.put("checked", false);
		if(columnTree) attrMap.put("uiProvider", "col");
		attrMap.put("modifyauth", true);
		
		if(_unitsort.equals("0")||_unitsort.equals("1")){//集团公司及集团总部用户
			JSONArray jsonArray = new JSONArray();
			List list = sgccIniUnitDAO.findByWhere(unitbean, "upunit='"+parentId+"' and " +baseWhere,"view_order_num asc");
			for(Iterator it=list.iterator();it.hasNext();){
				SgccIniUnit hbm=new SgccIniUnit();
				SgccIniUnit hbm1 = (SgccIniUnit) it.next();
				BeanUtils.copyProperties(hbm1, hbm);//防止Hibernate setXXX方法自动更新数据
				hbm = reviseLeafByUnitHMBAndWhere(hbm, "upunit='"+hbm.getUnitid()+"' and " +baseWhere);
				
				JSONObject jsonobject = JSONObject.fromObject(hbm);
				addAttributesToUnitNode(jsonobject, attrMap);
				
				jsonArray.add(jsonobject);
			}
			jsonstring = jsonArray.toString();
		}else{
			JSONArray jsonArray = new JSONArray();
			int postion = -1;
			
			List list = sgccIniUnitDAO.getDataAutoCloseSes("select unitid from sgcc_ini_unit connect by prior upunit = unitid " +
							"start with unitid = '"+userunitid+"'");//向上递归

			for(int i=0,j=list.size();i<j;i++){
				String tmpunitid =  (String) list.get(i);
				if(tmpunitid.equals(parentId)){
					postion = i;
					break;
				}
			}
			if(postion>0){
				String fid = (String) list.get(postion-1);
				List lt = sgccIniUnitDAO.findByWhere(unitbean, "unitid='"+fid+"' and " +baseWhere,"view_order_num asc");
				
				if(lt.size()>0){
					SgccIniUnit hbm = (SgccIniUnit) lt.get(0);
					hbm = reviseLeafByUnitHMBAndWhere(hbm, "upunit='"+hbm.getUnitid()+"' and " +baseWhere);
					
					JSONObject jsonobject = JSONObject.fromObject(hbm);
					if(postion>1) attrMap.put("modifyauth", false);
					addAttributesToUnitNode(jsonobject, attrMap);
					jsonArray.add(jsonobject);
				}
			}else{
				attrMap.put("modifyauth", true);
				List list1 = sgccIniUnitDAO.findByWhere(unitbean, "upunit='"+parentId+"' and " +baseWhere,"view_order_num asc");
				
				for(Iterator it=list1.iterator();it.hasNext();){
					SgccIniUnit hbm = (SgccIniUnit) it.next();
					hbm = reviseLeafByUnitHMBAndWhere(hbm, "upunit='"+hbm.getUnitid()+"' and " +baseWhere);
					
					JSONObject jsonobject = JSONObject.fromObject(hbm);
					addAttributesToUnitNode(jsonobject, attrMap);
					
					jsonArray.add(jsonobject);
				}
			}
			jsonstring = jsonArray.toString();
		}
		
		return jsonstring;
	}
	
	
	private JSONArray syncGetUnitChildrens(String upunit ,String baseWhere, Map<String,Object> attributesMap){
		List list = sgccIniUnitDAO.findByWhere(SgccIniUnit.class.getName(), "upunit='"+upunit+"' and "+baseWhere);
		JSONArray jsonarray = new JSONArray();
		
		for(Iterator it=list.iterator();it.hasNext();){
			SgccIniUnit hbm = (SgccIniUnit) it.next();
			hbm = reviseLeafByUnitHMBAndWhere(hbm, "upunit='"+hbm.getUnitid()+"' and " +baseWhere);
			
			JSONObject jsonobject = JSONObject.fromObject(hbm);
			addAttributesToUnitNode(jsonobject, attributesMap);
			
			if(hbm.getLeaf()==0){
				jsonobject.put("children",syncGetUnitChildrens(jsonobject.get("unitid").toString(),baseWhere,attributesMap));
			}
			jsonarray.add(jsonobject);
		}
		return jsonarray;
	} 
	private void initPropsMap(String typeName){
		propsMap.clear();
		List list = propertyCodeDAO.getCodeValue(typeName);
		if(list!=null){
			for(Object codeHBM :list){
				PropertyCode pchbm = (PropertyCode)codeHBM;
				propsMap.put(pchbm.getPropertyCode(), pchbm);
			}
		}
	}
	private void addAttributesToUnitNode(JSONObject jsonObject, Map<String,Object> attributesMap){
		PropertyCode pchbm = propsMap.get(jsonObject.get("unitTypeId").toString());
		jsonObject.put("text", jsonObject.get("unitname"));
		jsonObject.put("id", jsonObject.get("unitid"));
		if(attributesMap!=null) jsonObject.putAll(attributesMap);
		
		if(pchbm!=null){
			jsonObject.put("orgsort", pchbm.getDetailType());//类别代码
			jsonObject.put("orgtypename", pchbm.getPropertyName());//分类名称
		}else{
			jsonObject.put("orgsort", "");//类别代码
			jsonObject.put("orgtypename", "");//分类名称
		}
	}
	/**
	 * 根据过滤调整修正SgccIniUnit的leaf属性（一般在树的加载时使用）
	 * @param unitHBM
	 * @param where
	 * @return
	 */
	private SgccIniUnit reviseLeafByUnitHMBAndWhere(SgccIniUnit unitHBM, String where){
		try{
			if(sgccIniUnitDAO.findByWhere(SgccIniUnit.class.getName(), where).size()>0){
				unitHBM.setLeaf(0);
			}else{
				unitHBM.setLeaf(1);
			}
		}catch(BusinessException ex){
			unitHBM.setLeaf(0);
			ex.printStackTrace();
		}
		return unitHBM;
	}
	/**
	 * 组织结构树获取
	 */
	public String buildingRockPowerTree(Map paramsmap) {
		boolean async = paramsmap.get("async")==null||paramsmap.get("async").toString().equals("true")?true:false;//同步异步
		String jsonstring= "";
		
		if(async){
			jsonstring = asyncBuildingRockPowerTree(paramsmap);
		}else{
			jsonstring = syncBuildingRockPowerTree(paramsmap);
		}
		System.out.println(jsonstring);
		return jsonstring;
	}
	//异步加载模块功能树
	private String asyncBuildingRockPowerTree(Map paramsmap){
		String parentId  = paramsmap.get("parentId")==null?"":paramsmap.get("parentId").toString();//父节点
		
		boolean columnTree = paramsmap.get("columnTree")==null||paramsmap.get("columnTree").toString().equals("false")?false:true;
		boolean ifcheck = paramsmap.get("ifcheck")==null||paramsmap.get("ifcheck").toString().equals("false")?false:true;
		String  type = paramsmap.get("type")==null?"":paramsmap.get("type").toString();
		String rockbean = "com.sgepit.frame.sysman.hbm.RockPower";
		String jsonstring = "";
		Map<String,Object> attrMap = new HashMap<String,Object>();
		
		if(ifcheck) attrMap.put("checked", false);
		if(columnTree) attrMap.put("uiProvider", "col");
		
		if(type.equals("getUnitPower")){
			String  unitids = paramsmap.get("unitids")==null?"":paramsmap.get("unitids").toString();
			jsonstring = asyncGetUnitRockPowerTree(parentId,unitids,attrMap).toString();
		}
		//System.out.println("功能菜单："+jsonstring);
		return jsonstring;
	}
	//同步加载模块功能树
	private String syncBuildingRockPowerTree(Map paramsmap){
		String parentId  = paramsmap.get("parentId")==null?"":paramsmap.get("parentId").toString();//父节点
		
		boolean columnTree = paramsmap.get("columnTree")==null||paramsmap.get("columnTree").toString().equals("false")?false:true;
		boolean ifcheck = paramsmap.get("ifcheck")==null||paramsmap.get("ifcheck").toString().equals("false")?false:true;
		String  type = paramsmap.get("type")==null?"":paramsmap.get("type").toString();
		String rockbean = "com.sgepit.frame.sysman.hbm.RockPower";
		String jsonstring = "";
		Map<String,Object> attrMap = new HashMap<String,Object>();
		
		if(ifcheck) attrMap.put("checked", false);
		if(columnTree) attrMap.put("uiProvider", "col");
		
		if(type.equals("getUnitPower")){
			String  unitids = paramsmap.get("unitids")==null?"":paramsmap.get("unitids").toString();
			jsonstring = syncGetUnitRockPowerTree(parentId,unitids,attrMap).toString();
		}
		//System.out.println("功能菜单："+jsonstring);
		return jsonstring;
	}
	private void addAttributesToRockNode(JSONObject jsonObject, Map<String,Object> attributesMap){
		String iconCls = jsonObject.get("iconcls")!=null?(jsonObject.get("iconcls").toString().split("\\.")[0].trim()):"";
		jsonObject.put("iconCls", iconCls);
		jsonObject.put("text", jsonObject.get("powername"));
		jsonObject.put("id", jsonObject.get("powerpk"));
		jsonObject.remove("iconcls");
		
		if(attributesMap!=null) jsonObject.putAll(attributesMap);
	}
	/**
	 * 异步获取单位功能树
	 * @param parentId
	 * @param unitid
	 * @param attributesMap
	 * @return
	 */
	private String asyncGetUnitRockPowerTree(String parentId, String unitid, Map<String, Object> attributesMap){
		String rolebean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLE);
		String rockbean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE);
		HashMap<String,String> selectedRock = new HashMap<String,String>();
		
		List list1 = systemDao.findByWhere(rockbean, "parentid='"+parentId+"'","ORDERCODE asc");
		List list2 = systemDao.findByWhere(rolebean, "remark='"+unitid+"' and unit_id = 'UNITROLE'");
		
		if(list2.size()>0){
			String rolePk = ((RockRole)list2.get(0)).getRolepk();
			List list3 = systemDao.findByWhere( BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLEMOD), "rolepk='"+rolePk+"'");
			for(int i=0,j=list3.size();i<j;i++){
				RockCharacter2power hbm = (RockCharacter2power) list3.get(i);
				selectedRock.put(hbm.getPowerpk(), null);
			}
		};
		
		JSONArray jsonArray = JSONArray.fromObject(list1);
		for(int i=0,j=jsonArray.size();i<j;i++){
			JSONObject jsonobject = jsonArray.getJSONObject(i);
			String rockpk = jsonobject.getString("powerpk");
			
			if(selectedRock.containsKey(rockpk)) 
				attributesMap.put("checked", true);
			else
				attributesMap.put("checked", false);
				
			addAttributesToRockNode(jsonArray.getJSONObject(i), attributesMap);
		}	
		return jsonArray.toString();
	}
	/**
	 * 同步获取单位功能树
	 * @param parentId
	 * @param unitid
	 * @param attributesMap
	 * @return
	 */
	private String syncGetUnitRockPowerTree(String parentId, String unitid, Map<String, Object> attributesMap){
		String rolebean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLE);
		String rockbean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE);
		HashMap<String,String> selectedRock = new HashMap<String,String>();
		
		List list2 = systemDao.findByWhere(rolebean, "remark='"+unitid+"' and unit_id = 'UNITROLE'");
		
		if(list2.size()>0){
			String rolePk = ((RockRole)list2.get(0)).getRolepk();
			List list3 = systemDao.findByWhere( BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLEMOD), "rolepk='"+rolePk+"'");
			for(int i=0,j=list3.size();i<j;i++){
				RockCharacter2power hbm = (RockCharacter2power) list3.get(i);
				selectedRock.put(hbm.getPowerpk(), null);
			}
		};
		
		JSONArray jsonArray = this.syncGetUnitRockChildrens(parentId, "1=1", selectedRock, attributesMap);	
		return jsonArray.toString();
	}
	/**
	 *遍历单位功能树
	 * @param parentId
	 * @param baseWhere
	 * @param selectedRock
	 * @param attributesMap
	 * @return
	 */
	private JSONArray syncGetUnitRockChildrens(String parentId ,String baseWhere, Map<String,String> selectedRock,
			Map<String,Object> attributesMap){
		String rockbean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_MODULE);
		List list = systemDao.findByWhere(rockbean, "parentid='"+parentId+"' and "+baseWhere+" order by ordercode asc");
		JSONArray jsonarray = JSONArray.fromObject(list);
		
		for(int i=0,j=jsonarray.size();i<j;i++){
			JSONObject prop = jsonarray.getJSONObject(i);
			String rockpk = prop.getString("powerpk");
			if("01".equals(prop.getString("powerpk"))){
				prop.remove("powername");
				prop.accumulate("powername", Constant.DefaultModuleRootName);
			}
			
			if(selectedRock.containsKey(rockpk)) 
				attributesMap.put("checked", true);
			else
				attributesMap.put("checked", false);
			
			addAttributesToRockNode(prop, attributesMap);
			if(prop.get("leaf")!=null&&((Integer)prop.get("leaf"))==0){
				prop.put("children",syncGetUnitRockChildrens(prop.get("powerpk").toString(),baseWhere,selectedRock,attributesMap));
			}
		}
		return jsonarray;
	}
	/**
	 * 单位下功能模块维护
	 */
	public String saveUnitRockPower(String pks ,String unitid){
		String rolebean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLE);
		String rolemodbean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ROLEMOD);
		String unitbean = BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_ORG);
		if(unitid==null||pks==null||unitid.equals("")||pks.equals("")){
			return "1";
		}else{
			try{
				String[] pkArr = pks.split("`");
				SgccIniUnit unitbhm = (SgccIniUnit) systemDao.findBeanByProperty(unitbean, "unitid", unitid);
				List list1 = systemDao.findByWhere(rolebean, "remark='"+unitid+"' and unit_id = 'UNITROLE'");
				RockRole rrhbm = null;
				if(list1.size()==0){
					rrhbm = new RockRole();
					rrhbm.setRemark(unitid);
					rrhbm.setUnitId("UNITROLE");
					rrhbm.setRolename(unitbhm.getUnitname().concat("-功能模块"));
					rrhbm.setRolepk(SnUtil.getNewID());
					systemDao.insert(rrhbm);
					
				}else{
					rrhbm = (RockRole) list1.get(0);
				}
				String rpk = rrhbm.getRolepk();
				List list2 = systemDao.findByWhere(rolemodbean, "rolepk='"+rpk+"'");
				systemDao.deleteAll(list2);
				for(String ppk : pkArr){
					RockCharacter2power rchbm = new RockCharacter2power();
					rchbm.setPowerpk(ppk);
					rchbm.setRolepk(rpk);
					rchbm.setLvl(1);
					
					systemDao.insert(rchbm);
				}
			}catch(Exception ex){
				ex.printStackTrace();
				return "0";
			}
			return "1";
		}
	};
	public String saveSysGolobal(SysGolobal sysGolobal) {
		  //systemDao.saveOrUpdate(sysGolobal);
		String success = "ok";
		String types=sysGolobal.getFiletype();
		String filepath=sysGolobal.getFilepath();
		if("1".equals(sysGolobal.getTypes())){
		  StringBuffer  buf=new StringBuffer();
		   buf.append(" pname='"+sysGolobal.getPname()+"'");
		   buf.append(" and filepath='"+sysGolobal.getFilepath()+"'");
		   buf.append(" and types='"+sysGolobal.getTypes()+"'");
		List list=systemDao.findByWhere(SysGolobal.class.getName(), buf.toString());
		   if(list.size()==0){
			   systemDao.saveOrUpdate(sysGolobal);
			   return success;
		   }else {
			   return "该文件已添加!请添加其他";
		   }
		}else {
			if("2".equals(types)){
				//首先判断该类型资源文件是否存在
				   int tempnum=filepath.lastIndexOf(".properties");
				   if(tempnum==-1){
					   return "资源文件路径不正确";
				   }
				   
				   String tempPath=filepath.substring(0, tempnum);
				   String temp=tempPath.replace(".", "/");
				   String path=temp+".properties";
				 String workspace= System.getProperty("user.dir");
				 String realpath=workspace.split("bin")[0]+"webapps\\frame\\WEB-INF\\classes\\"+path;
				   File  file=new File(realpath);
				 if(file.exists()){
					 //添加配置文件的同时判断该配置文件是否存在
					List list=systemDao.findByWhere(SysGolobal.class.getName(), " filepath='"+path+"' and types=2");
					     if(list.size()==0){
					    	 sysGolobal.setOperatedate(new Date());
					    	 sysGolobal.setTypes("2");
					    	 systemDao.saveOrUpdate(sysGolobal);
					    	 return success;
					     }else {
					    	 return "该配置文件已存在";
					     }
				}else {
					return "文件不存在!请检查文件路径是否正确";
				}
				 
			}else if("1".equals(types)) {
				boolean flag=false;
				//如果填写了.java  则截取掉
				int num=filepath.lastIndexOf(".java");
				String path="";
				if(num==-1){
				  path=filepath;
				}else {
					path=filepath.substring(0,num);
				}
				try {
					Class.forName(path);
				} catch (Exception e) {
					flag=true;
				}
				if(flag==true){
					return "该类文件不存在!请重新填写";
				}else {
					List list=systemDao.findByWhere(SysGolobal.class.getName(), " filepath='"+path+"' and types=1");
					if(list.size()==0){
						sysGolobal.setFilepath(path);
						sysGolobal.setTypes("2");
						systemDao.saveOrUpdate(sysGolobal);
						return success;
					}else {
						return "该类文件已经添加";
					}
				}
			}
			
		}
		return "添加系统异常!请重新添加";
	}

	public List findPropertyOrClassByProperty(String filepath, String filename,
			String filetype) {
		List<SysGolobal> listSys=new ArrayList<SysGolobal>();
		List list=systemDao.findByWhere(SysGolobal.class.getName(), " filepath='"+filepath+"' and filename='" +
				""+filename+"' and filetype='"+filetype+"'");
		List listExist=systemDao.findByWhere(SysGolobal.class.getName(), " filepath='"+filepath+"'" +
				" and filename='"+filename+"' and types='1'");
		if(list.size()>0){
		   if("2".equals(filetype)){
			   	Properties pro=new Properties();
			   	try {
				   	InputStream is = Constant.class.getResourceAsStream("/"+filepath);
					pro.load(is);
				} catch (Exception e) {
					System.out.println("读取资源文件异常");
					return null;
				}
				Enumeration<?>enu=pro.propertyNames();
				while(enu.hasMoreElements()){
				  boolean flag=false;
				  SysGolobal sys=new SysGolobal();
				  String key=(String)enu.nextElement();
				  for(int k=0;k<listExist.size();k++){
					  SysGolobal sysGolobal=(SysGolobal)listExist.get(k);
					  if(key.equals(sysGolobal.getPname())){
						  flag=true;
						  break;
					  }
				  }
				  if(!flag){
					  sys.setPname(key);
					  sys.setPvalue(pro.getProperty(key));
					  sys.setFilename(filename);
					  sys.setFilepath(filepath);
					  sys.setFiletype(filetype);
					  listSys.add(sys);
				  }
			  }
		   } else
		   if("1".equals(filetype)){
			   
			   boolean flag=false;
			   Class clas=null;
			   try {
				   clas=Class.forName(filepath);
			} catch (Exception e) {
				flag=true;
				System.out.println("读取Class文件异常");
				return null;
			}
			if(!flag){
				Field [] fields=clas.getFields();
				for(int i=0;i<fields.length;i++){
					boolean exist=false;
					SysGolobal sys=new SysGolobal();
					Field field=fields[i];
					String pname=field.getName();
					for(int k=0;k<listExist.size();k++){
						SysGolobal sysGolobal=(SysGolobal)listExist.get(k);
						if(pname.equals(sysGolobal.getPname())){
							exist=true;
							 break;
						}
					}
					if(!exist){
						sys.setPname(pname);
						String pvalue=null;
						try {
							pvalue =field.get(pname)==null?"":field.get(pname).toString();
						} catch (IllegalArgumentException e) {
							e.printStackTrace();
						} catch (IllegalAccessException e) {
							e.printStackTrace();
						}
						sys.setPvalue(pvalue);
						String pclass=field.getType().toString();
						sys.setPclass(pclass);
						StringBuffer sbuf=new StringBuffer();
						int modifiers=field.getModifiers();
						if(Modifier.isPrivate(modifiers)){
							sbuf.append("private ");
						}
						if(Modifier.isProtected(modifiers)){
							sbuf.append(" protected ");
						}
						if(Modifier.isPublic(modifiers)){
							sbuf.append(" public ");
						}
						if(Modifier.isStatic(modifiers)){
							sbuf.append(" static ");
						}
						if(Modifier.isFinal(modifiers)){
							sbuf.append(" final");
						}
						sys.setPmodify(sbuf.toString());
						sys.setFilename(filename);
						sys.setFilepath(filepath);
						sys.setFiletype(filetype);					 
						listSys.add(sys);
					}
				}
			}
		   }
		}
		return listSys;
	}
	/**
	 * 通过单位id查询其所管理的项目单位
	 * @param unitid
	 * @return
	 */
	public List<SgccIniUnit> getPidsByUnitid(String unitid) {
		ArrayList<SgccIniUnit> list = new ArrayList<SgccIniUnit>();
		SgccIniUnit hbm = (SgccIniUnit) systemDao.findBeanByProperty(SgccIniUnit.class.getName(), "unitid", unitid);
		
		if(hbm!=null){
			if(hbm.getUnitTypeId()!=null&&hbm.getUnitTypeId().equals("A")){//单位类型为A时，表示项目单位
				list.add(hbm);
			};
			List<SgccIniUnit> lt = getUnitListByUpunit(unitid);
			if(lt!=null&&lt.size()>0){
				list.addAll(lt);
			}
		}
		return list;
	}
	/**
	 * 循环查找下级项目单位
	 * @param parentid
	 * @return
	 */
	private List<SgccIniUnit> getUnitListByUpunit(String upunit){
		ArrayList<SgccIniUnit> list = new ArrayList<SgccIniUnit>();
		List list1 = systemDao.findByWhere(SgccIniUnit.class.getName(), "upunit='"+upunit+"'", "view_order_num");

		for(int i=0,j=list1.size();i<j;i++){
			SgccIniUnit hbm = (SgccIniUnit) list1.get(i);
			if(hbm.getUnitTypeId()!=null&&hbm.getUnitTypeId().equals("A")){//单位类型为A时，表示项目单位
				list.add(hbm);
			};
			list.addAll(getUnitListByUpunit(hbm.getUnitid()));
		}
		return list;
	}
	public String switchByPid(String pid, HttpSession session){
		String flag = "fail";
		if(pid!=null){
			String curPid = (String) session.getAttribute(Constant.CURRENTAPPPID);
			String userPids = (String) session.getAttribute(Constant.USERPIDS);
			String userPnames = (String) session.getAttribute(Constant.USERPNAMES);
			if(curPid!=null&&userPids!=null&&userPnames!=null&&!(pid.equals(curPid))){
				String[] userPidArr = userPids.split(",");
				String[] userPnameArr = userPnames.split(",");
				
				boolean exist = false;
				int postion = -1;
				for(int i=0;i<userPidArr.length;i++){
					String newPid = userPidArr[i];
					if(newPid.equals(pid)){
						exist = true;
						postion = i;
						break;
					}
				}
				if(exist){
					session.setAttribute(Constant.CURRENTAPPPID,userPidArr[postion]);
					session.setAttribute(Constant.CURRENTAPPPNAME,userPnameArr[postion]);
					flag = "ok";
				}
			}
		}
		return flag;
	}
	/**
	 * 获取子系统的第一个具备权限的功能模块（即第一个具备权限，且URL不为空的模块）
	 * @param subSystemId   子系统模块ID
	 * @param userId        当前用户ID
	 * @return              模块实体
	 */
	 public RockPower getFirstPowerFromSubSystem(String subSystemId,String userId)
	    {
	        DetachedCriteria criteria = DetachedCriteria.forClass(RockPower.class);
	        String sql = String.format("url is not null and powerpk in(select powerpk from rock_character2power where rolepk in (select" +
	        		" rolepk from rock_role2user where userid = '"+userId+"')) " +
	        				"start with parentid = '%s' connect by prior  powerpk = parentid order siblings by ordercode", new Object[] {
	            subSystemId
	        });
	        //System.out.println(sql);
	        criteria.add(Restrictions.sqlRestriction(sql));
	        List rockPowerList = systemDao.getHibernateTemplate().findByCriteria(criteria);
	        if(rockPowerList.size() > 0)
	            return (RockPower)rockPowerList.get(0);
	        else
	            return null;
	    }
	 
	 /**
	 * 获取当前用户的所属单位，可作为所属单位的类型取自system.properties 的 USERBELONGUNITTYPE
	 * @param unitid
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 14, 2011
	 */
	public SgccIniUnit getBelongUnit(String unitid) {
		String unitTypeIds = Constant.propsMap.get("USERBELONGUNITTYPE");
		String sql = "select * from sgcc_ini_unit";
		if (unitTypeIds!=null && unitTypeIds.length()>0) {
			String inStr = StringUtil.transStrToIn(unitTypeIds, "`");
			sql += " where unit_type_id in (" + inStr + ")";
		}
		sql += " start with unitid = '" + unitid + "' connect by prior upunit = unitid ";
		
		Session ses = HibernateSessionFactory.getSession();
		SQLQuery q = ses.createSQLQuery(sql).addEntity(SgccIniUnit.class);
		List l = q.list();
		ses.close();
		if (l!=null && l.size()>0) {
			return (SgccIniUnit) l.get(0);
		} else {
			return null;
		}
	}

	public String getFlowType(String pid, String powerPk) {
		// TODO Auto-generated method stub
		String flowType = "None";
		//优先获取项目单位个性化配置表的数据
		List list_pid = JdbcUtil.query("select flowtype from rock_power_flow where powerpk='"+powerPk+"' and pid = '"+pid+"'");
		if(list_pid.size()==1){
			Map map = (Map) list_pid.get(0);
			if(map.get("flowtype")!=null){
				flowType = (map.get("flowtype")).toString();
			}			
		}else{//如果没有个性化配置，那么获取公共配置数据
			List list = JdbcUtil.query("select flowflag from rock_power where powerpk = '"+powerPk+"'");
			if(list.size()==1){				
				Map map = (Map) list.get(0);
				if(map.get("flowflag")!=null){
					flowType = (map.get("flowflag")).toString();
				}	
			}
		}
		return flowType;		
	}	
	
	/**
	 *	组织机构的数据交换：项目单位的组织机构同集团公司保持一致；
	 * @param:	pid			项目单位向集团上报数据的时候，项目单位的PID；如果此项为NUll或“”，表示集团向项目单位下达数据；
	 * @author: Liuay
	 * @createDate: Sep 19, 2011
	 */
	public void unitDataExchange(String pid){
		Session ses = HibernateSessionFactory.getSession();
		try{
			PCDataExchangeService exchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			String sql = "";
			
			if (pid!=null && !pid.equals("")) {
				//项目单位向集团
				sql = "select * from sgcc_ini_unit u start with unitid='" + pid + "' connect by prior unitid=upunit";
				
				SQLQuery q = ses.createSQLQuery(sql).addEntity(SgccIniUnit.class);
				List unitList = q.list();
				String sqlBefore = "delete from sgcc_ini_unit where unitid in (select unitid from sgcc_ini_unit u start with unitid='" + pid + "' connect by prior unitid=upunit)";
				List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
				if(unitList.size()>0){
					//getExcDataList参数说明：待报送数据list，接收单位，发送单位，前置sql，后置sql，业务说明
					sendDataList = exchangeService.getExcDataList(unitList, Constant.DefaultOrgRootID, pid, sqlBefore, null, "项目编码为【"+pid+"】的项目单位组织机构报送。");
				}
				Map<String,String> map = exchangeService.sendExchangeData(sendDataList);
				if(map.get("result").equalsIgnoreCase("fail")) {
					exchangeService.addExchangeListToQueue(sendDataList);
        		}
			} else {
				//集团向项目单位				
				String sql0 = "select u.unitid from sgcc_ini_unit u where u.unit_type_id = 'A'";
				List lt0 = this.systemDao.getDataAutoCloseSes(sql0);
				
				List unitList = null;
				
				String sqlBefore = "";
				Map<String, SgccIniUnit> unitMap = new HashMap<String, SgccIniUnit>();
				for(int i=0; i<lt0.size(); i++){
					String unitid0 = lt0.get(i).toString();
					SgccIniUnit tempUnit = this.getUnitById(unitid0);
					if (tempUnit.getAppUrl()==null || tempUnit.getAppUrl().length()==0 || (unitMap.size()>0 && unitMap.containsKey(tempUnit.getAppUrl()))) {
						continue;
					} else {
						unitMap.put(tempUnit.getAppUrl(), tempUnit);
					}
					
					unitList = new ArrayList();
					sqlBefore = "";
					
//					（1）项目单位的上级组织机构
					String sql1 = "select * from sgcc_ini_unit start with unitid = '" + unitid0 + "' connect by prior upunit=unitid";
					SQLQuery q1 = ses.createSQLQuery(sql1).addEntity(SgccIniUnit.class);
					List unitList1 = q1.list();
					unitList.addAll(unitList1);
					sqlBefore = "delete from sgcc_ini_unit where unitid in (select unitid from sgcc_ini_unit start with unitid = '" + unitid0 + "' connect by prior upunit=unitid);";
					
					for (int j=0; j<unitList1.size(); j++) {
						String upunit0 = ((SgccIniUnit)unitList1.get(j)).getUnitid();
//					（2）查询上级单位的本部及本部下的组织机构
						String sql2 = "select * from sgcc_ini_unit start with " +
							" unitid in( select unitid from sgcc_ini_unit where upunit ='" + upunit0 + "' and unit_type_id = '1') connect by prior unitid=upunit";
						SQLQuery q2 = ses.createSQLQuery(sql2).addEntity(SgccIniUnit.class);
						List unitList2 = q2.list();
						unitList.addAll(unitList2);
						sqlBefore += "delete from sgcc_ini_unit where unitid in (select unitid from sgcc_ini_unit start with " +
							" unitid in( select unitid from sgcc_ini_unit where upunit ='" + upunit0 + "' and unit_type_id = '1') connect by prior unitid=upunit);";
					}
//					（3）与当前单位APP_URL相同的项目单位及项目单位下级组织机构
					String sql3 = "select * from sgcc_ini_unit start with unitid in (select unitid from sgcc_ini_unit where app_url = '" + tempUnit.getAppUrl() + "' and unit_type_id='A') connect by prior unitid=upunit";
					SQLQuery q3 = ses.createSQLQuery(sql3).addEntity(SgccIniUnit.class);
					List unitList3 = q3.list();
					unitList.addAll(unitList3);
					sqlBefore += "delete from sgcc_ini_unit where unitid in (select unitid from sgcc_ini_unit start with unitid in (select unitid from sgcc_ini_unit where app_url = '" + tempUnit.getAppUrl() + "' and unit_type_id='A') connect by prior unitid=upunit);";
					
					List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
					if(unitList.size()>0){
						//getExcDataList参数说明：待报送数据list，接收单位，发送单位，前置sql，后置sql，业务说明
						sendDataList = exchangeService.getExcDataList(unitList, unitid0, Constant.DefaultOrgRootID, 
								sqlBefore, null, "向项目编码为【"+unitid0+"】的项目单位组织机构报送。");
					}
					Map<String,String> map = exchangeService.sendExchangeData(sendDataList);
					if(map.get("result").equalsIgnoreCase("fail")) {
						exchangeService.addExchangeListToQueue(sendDataList);
	        		}
				}
			}
		}catch (BusinessException e) {
			e.printStackTrace();
		} finally {
			ses.close();
		}
	}
	
	/**
	 * 用户信息数据交换
	 * 目前存在的问题：现系统的处理方式是把变动单位下所有的用户都做了同步数据交互，利于系统初始使用和同步其他位置系统时使用；
	 * 但是后期使用稳定后，这样的方式数据交互的数据量比较大，可以采用只交互变更数据的方式；
	 * @param unitId	需要处理的用户所在单位
	 * 						如果是剪切-粘贴操作， 此参数为 原单位unitid`粘贴单位unitid
	 * @param sendType	数据交换类型：UP：项目单位->集团；DOWN:集团->项目单位
	 * @author: Liuay
	 * @createDate: 2011-9-22
	 */
	public void userDataExchange(String unitId, String sendType) {
		PCDataExchangeService exchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		Session ses = HibernateSessionFactory.getSession();
		
		String inUnitIdStr = StringUtil.transStrToIn(unitId, "`");
	
		String sql1 = "select * from rock_user where userid <> '1' and (unitid in (" + inUnitIdStr + ") or dept_id in (" + inUnitIdStr + ") or posid in (" + inUnitIdStr + "))";
		SQLQuery q1 = ses.createSQLQuery(sql1).addEntity(RockUser.class);
		List unitList = q1.list();
		String sqlBefore = "delete from rock_user where userid <> '1' and (unitid in (" + inUnitIdStr + ") or dept_id in (" + inUnitIdStr + ") or posid in (" + inUnitIdStr + "))";
		try {
			if (sendType.equalsIgnoreCase("UP")) {
//				项目单位向集团报送
				List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
				if(unitList.size()>0){
					sendDataList = exchangeService.getExchangeDataList(unitList, Constant.DefaultOrgRootID, sqlBefore, null, "单位【"+unitId+"】的组织机构报送集团。");
				}
				Map<String,String> map = exchangeService.sendExchangeData(sendDataList);
				if(map.get("result").equalsIgnoreCase("fail")) {
					exchangeService.addExchangeListToQueue(sendDataList);
        		}
			} else if (sendType.equalsIgnoreCase("DOWN")) {
//				集团向项目单位下达
				String sql0 = "select u.unitid from sgcc_ini_unit u where u.unit_type_id = 'A'";
				List lt0 = this.systemDao.getDataAutoCloseSes(sql0);
				
				Map<String, SgccIniUnit> unitMap = new HashMap<String, SgccIniUnit>();
				for(int i=0; i<lt0.size(); i++){
					String unitid0 = lt0.get(i).toString();
					SgccIniUnit tempUnit = this.getUnitById(unitid0);
					if (tempUnit.getAppUrl()==null || tempUnit.getAppUrl().length()==0 || (unitMap.size()>0 && unitMap.containsKey(tempUnit.getAppUrl()))) {
						continue;
					} else {
						unitMap.put(tempUnit.getAppUrl(), tempUnit);
					}
					
					String sql10 = "select unitid from sgcc_ini_unit start with unitid = '" + unitid0 + "' connect by prior upunit=unitid";
					SQLQuery q10 = ses.createSQLQuery(sql10).addScalar("unitid", Hibernate.STRING);
					List unitIdList1 = q10.list();
					
					String sql = sql10;
//					（1）包括项目单位的下级单位和部门
					sql += " union all " +
						" select unitid from sgcc_ini_unit start with unitid = '" + unitid0 + "' connect by prior unitid=upunit";
					
					for (int j=0; j<unitIdList1.size(); j++) {
						String upunit0 = (String)unitIdList1.get(j);
						
//					（2）查询上级单位的本部及其下属单位
						String sql2 = "select unitid from sgcc_ini_unit start with " +
								" unitid in( select unitid from sgcc_ini_unit where upunit ='" + upunit0 + "' and unit_type_id = '1') connect by prior unitid=upunit";
						sql += " union all " + sql2;
						
					}
					
					String sql00 = " select * from sgcc_ini_unit where unitid in ( " + sql + " ) and unitid in (" + inUnitIdStr + ")";
					SQLQuery q00 = ses.createSQLQuery(sql00).addEntity(SgccIniUnit.class);
					List unitList2 = q00.list();
					if(unitList2.size()>0) {
						List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
						if(unitList.size()>0){
							sendDataList = exchangeService.getExchangeDataList(unitList, unitid0, sqlBefore, null, "向项目编码为【"+unitid0+"】的项目单位组织机构报送。");
						}
						Map<String,String> map = exchangeService.sendExchangeData(sendDataList);
						if(map.get("result").equalsIgnoreCase("fail")) {
							exchangeService.addExchangeListToQueue(sendDataList);
		        		}
					}
				}
			}
		} catch (BusinessException e) {
			e.printStackTrace();
		} finally {
			ses.close();
		}
	}
	
	public String createPropertyInsertSql(String[] uidsArr) {
		String typeColumnNames = "";
		String codeColumnNames = "";
		String mergeSqlType = "";
		String mergeSqlCode = "";
		String str = "";
		Object obj = null;
		for (String uidsStr : uidsArr) {
			// 主表Property_type
			List<Map<String, String>> ltType = JdbcUtil.query("select * from property_type where uids = '" + uidsStr + "' ");
			if (ltType.size() == 1) {
				if(typeColumnNames.equals("")){
					Map<String, String> colsMap = ltType.get(0);
					Set<String> keyType  = colsMap.keySet();
					typeColumnNames = keyType.toString();
					typeColumnNames = typeColumnNames.substring(1, typeColumnNames.length()-1);
				}
				Map<String, String> mapType = ltType.get(0);
				String[] colsType = typeColumnNames.split(",");
				String typeColumnValues = "";
				String typeTab2Cols = "";
				String typeUpdateCols = "";
				for (int i = 0; i < colsType.length; i++) {
					String col = colsType[i].trim();
					obj = mapType.get(col);
					typeColumnValues = typeColumnValues + ",'" + (obj==null?"":obj.toString()) + "' ";
					//处理merge into 中的tab2
					typeTab2Cols = typeTab2Cols + ", '"+(obj==null?"":obj.toString())+"' as "+col+" ";
					//处理merge into 中的update
					if(!col.equalsIgnoreCase("uids"))
						typeUpdateCols = typeUpdateCols + ", tab1."+col+" = tab2."+col;
				}
				typeTab2Cols = typeTab2Cols.substring(1);
				typeUpdateCols = typeUpdateCols.substring(1);
				typeColumnValues = typeColumnValues.substring(1);
				mergeSqlType = "merge into property_type tab1 using (select "+typeTab2Cols+" from dual) tab2 " +
						"on (tab1.uids = tab2.uids) when matched then " +
						"update set "+typeUpdateCols+" " +
						"when not matched then " +
						"insert ("+typeColumnNames+") values(" + typeColumnValues + ");";

				// 从表Property_code
				List<Map<String, String>> ltCode = JdbcUtil.query("select * from property_code where type_name = '" + mapType.get("UIDS") + "' ");
				if (ltCode.size() > 0) {
					if(codeColumnNames.equals("")){
						Map<String, String> colsMap = ltCode.get(0);
						Set<String> keyCode  = colsMap.keySet();
						codeColumnNames = keyCode.toString();
						codeColumnNames = codeColumnNames.substring(1, codeColumnNames.length()-1);
					}
					for (Map<String, String> mapCode : ltCode) {
						String codeTab2Cols = "";
						String codeUpdateCols = "";
						String[] colsCode = codeColumnNames.split(",");
						String codeColumnValues = "";
						codeTab2Cols = "";
						codeUpdateCols = "";
						for (int i = 0; i < colsCode.length; i++) {
							String col = colsCode[i].trim();
							obj = mapCode.get(col);
							codeColumnValues = codeColumnValues + ",'" + (obj==null?"":obj.toString()) + "' ";
							//处理merge into 中的tab2
							codeTab2Cols = codeTab2Cols + ", '"+(obj==null?"":obj.toString())+"' as "+col+" ";
							//处理merge into 中的update
							if(!col.equalsIgnoreCase("uids"))
								codeUpdateCols = codeUpdateCols + ", tab1."+col+" = tab2."+col;
						}
						codeTab2Cols = codeTab2Cols.substring(1);
						codeUpdateCols = codeUpdateCols.substring(1);
						codeColumnValues = codeColumnValues.substring(1);
						mergeSqlCode = mergeSqlCode + "merge into property_code tab1 using (select "+codeTab2Cols+" from dual) tab2 " +
								"on (tab1.uids = tab2.uids) when matched then " +
								"update set "+codeUpdateCols+" " +
								"when not matched then " +
								"insert ("+codeColumnNames+") values(" + codeColumnValues + ");";
					}
				}
			}
			str = str + mergeSqlType + mergeSqlCode;
		}
		return str;
	}
	
	public String exchangeDataToSendProperty(String[] uidsArr, String typeNameArr,String pid){
		try {
			String sqlData = this.createPropertyInsertSql(uidsArr);
			List<PcDataExchange> allDataList = new ArrayList<PcDataExchange>();
			String txGroup = SnUtil.getNewID("tx-");
			
			//数据发送前生成删除porperty_type中type_name相同的数据
			String beforeDeleteTypeSql = "delete from property_type where type_name in ("+typeNameArr+")";
			PcDataExchange exchangeType = new PcDataExchange();
			exchangeType.setPid(pid);
			exchangeType.setTxGroup(txGroup);
			exchangeType.setSqlData(beforeDeleteTypeSql);
			allDataList.add(exchangeType);
			
			String beforeDeleteCodeSql = "delete from property_code where type_name in (select uids from property_type where type_name in ("+typeNameArr+"))";
			PcDataExchange exchangeCode = new PcDataExchange();
			exchangeCode.setPid(pid);
			exchangeCode.setTxGroup(txGroup);
			exchangeCode.setSqlData(beforeDeleteCodeSql);
			allDataList.add(exchangeCode);
			
			String[] sqlArr = sqlData.split(";");
			for (String sql : sqlArr) {
				PcDataExchange exchange = new PcDataExchange();
				exchange.setPid(pid);
				exchange.setTxGroup(txGroup);
				exchange.setSqlData(sql);
				allDataList.add(exchange);
			}
			PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			Map<String, String> rtnMap = exchangeServiceImp.sendExchangeData(allDataList);
			//if(rtnMap.get("result").equals("success")){}
			return rtnMap.get("message");
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}
	
	/**
	 * 根据二级模块ID过滤项目单位，数据提供给功能页面切换项目单位的combo
	 * 在golobalJs.jsp中使用
	 * @param modid 二级模块id
	 * @return
	 * @author zhangh 2012-05-18
	 */
	public List<SgccIniUnit> findUnitsByModid(String modid,String belongUnitid){
		//根据USERBELONGUNITID查询出下属项目单位
		String sql = "select t.unitid from sgcc_Ini_Unit t where t.unit_Type_Id = 'A' "
					+ " start with t.unitid = '"+belongUnitid+"' connect by prior t.unitid =  t.upunit";
		List<Map<String, String>> listUnitid = JdbcUtil.query(sql);
		String unitidString = "";
		for (Map<String, String> map : listUnitid) {
			String unitStr = map.get("UNITID");
			unitidString += ",'"+unitStr+"'";
		}
		unitidString = unitidString.substring(1);
		String where = " unitTypeId = 'A' and unitid not in "
					+ " (select m.unitid from SgccUnitModule m where m.powerpk = '"+modid+"') "
					+ " and unitid in ("+unitidString+")";
		List<SgccIniUnit> list = systemDao.findByWhere(SgccIniUnit.class.getName(), where);
		return list;
	}
	
	
	/**
	 * 记录用户登陆时间和IP
	 * @param userid
	 * @param ip
	 * @author zhangh 2013-01-11
	 */
	public void saveUserLoginTimeAndIp(String userid, String ip){
		RockUserLoginLog loginLog = new RockUserLoginLog();
		loginLog.setUserid(userid);
		loginLog.setThistime(DateUtil.getSystemDateTime());
		loginLog.setThisip(ip);
		loginLog.setHasalert("0");
		this.systemDao.insert(loginLog);
	}
	/**
	 * 
	* @Title: saveUserOperateModule
	* @Description: 记录用户操作模块
	* @param userid  用户id
	* @param ip  用户ip地址
	* @param moduleid   模块id 
	* @return void    
	* @throws
	* @author qiupy 2013-5-7
	 */
	public void saveUserOperateModule(String userid,String ip,String moduleid){
		RockUserOperatemoduleLog operateLog=new RockUserOperatemoduleLog();
		operateLog.setUserid(userid);
		operateLog.setUserip(ip);
		operateLog.setOperatetime(DateUtil.getSystemDateTime());
		operateLog.setModuleid(moduleid);
		this.systemDao.insert(operateLog);
	}

	@Override
	public String getNaviMenus(String parentId, HttpSession session, String indexModid) {
		List<RockPower> list = getChildRockPowersByParentId(parentId, session);
		StringBuffer sbf = new StringBuffer("");
		//String indexModid = "";//返回首页使用的MODID
		for(int i=0; i<list.size(); i++){
			RockPower r = (RockPower)list.get(i);
			if (this.hasModuleChild(r.getPowerpk(), session)){
				sbf.append("{id:'");
				sbf.append(r.getPowerpk());
				sbf.append("',text:'");
				sbf.append(r.getPowername());
				sbf.append("',");
				if(r.getUrl()!=null && !r.getParentid().equals("01")){
					sbf.append("handler: function(){loadMenusModule('"+indexModid+"',this.id,this.text)},");
				}
				sbf.append("menu:[");
				if(r.getParentid().equals("01") && r.getUrl() != null){
					indexModid = r.getPowerpk();
					sbf.append("{id:'"+r.getPowerpk()+"',text:'查询首页',handler: function(){loadMenusModule('"+indexModid+"',this.id,this.text,1)}},");
				}
				sbf.append(getNaviMenus(r.getPowerpk(), session, indexModid));
				sbf.append("]},");
			} else {
				sbf.append("{id:'");
				sbf.append(r.getPowerpk());
				sbf.append("',text:'");
				sbf.append(r.getPowername());
				
				sbf.append("',handler: function(){loadMenusModule('"+indexModid+"',this.id,this.text)}");
				sbf.append("},");
			}
		}
		if (sbf.lastIndexOf(",") == sbf.length() - 1)
			sbf.deleteCharAt(sbf.length() - 1);
		return sbf.toString();
	}
}