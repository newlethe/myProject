package com.sgepit.frame.sysman.dao;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.SQLQuery;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;

/**
 * A data access object (DAO) providing persistence and search support for
 * SgccGuidelineModelMaster entities. Transaction control of the save(),
 * update() and delete() operations can directly support Spring
 * container-managed transactions or they can be augmented to handle
 * user-managed Spring transactions. Each of these methods provides additional
 * information for how to configure it for the desired type of transaction
 * control.
 * 
 * @see com.sgepit.frame.sysman.hbm.SgccGuidelineModelMaster
 * @author MyEclipse Persistence Tools
 */

public class SgccIniUnitDAO extends IBaseDAO {
	private static final Log log = LogFactory
			.getLog(SgccIniUnitDAO.class);
	

	protected void initDao() {
		sBeanName = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
	}
	public static SgccIniUnitDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (SgccIniUnitDAO) ctx.getBean("sgccIniUnitDAO");
	}
	public static SgccIniUnitDAO getInstence() {
		return (SgccIniUnitDAO) Constant.wact.getBean("sgccIniUnitDAO");
	}
	
	/**
	  * 根据unitId获得所有上级组织机构
	  * @param unitId
	  * @return
	  **/
	public List getAllParentsByUnitid(String unitId){
		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append("select {t.*} from Sgcc_Ini_Unit t start with unitid='").append(unitId).append("' connect by prior upunit=unitid");
		SQLQuery query = getSession().createSQLQuery(sqlBuf.toString())
						.addEntity("t",SgccIniUnit.class);
		List list = query.list();
		List uList = new ArrayList();
		if(list!=null&&list.size()>0){
			Iterator iter = list.iterator();
			SgccIniUnit iniUnit = null;
			while(iter.hasNext()){
//				Object[] obj = (Object[])iter.next();
//				uList.add(obj[0]);
				iniUnit = (SgccIniUnit)iter.next();
				uList.add(iniUnit);
			}
		}
		return uList;
	}
	
	/**
	  * 获得某单位的所有子结点
	  * @param unitId
	  * @return
	  **/
	public List<SgccIniUnit> getAllChildrenByUnitid(String unitId){
		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append("select * from sgcc_ini_unit t start with unitid='")
				.append(unitId)
				.append("' connect by prior unitid = upunit");
		SQLQuery query = getSession().createSQLQuery(sqlBuf.toString())
						.addEntity("t",SgccIniUnit.class);
		List list = query.list();
		List uList = new ArrayList();
		if(list!=null&&list.size()>0){
			Iterator iter = list.iterator();
			SgccIniUnit iniUnit = null;
			while(iter.hasNext()){
				iniUnit = (SgccIniUnit)iter.next();
				uList.add(iniUnit);
			}
		}
		return uList;
	}
	
	/**
	  * 根据年度获得某单位的所有子结点
	  * @param unitId
	  * @return
	  **/
	public List getAllChildrenByUnitid(String unitId,String year){
		List uList = new ArrayList();
		if(unitId!=null&&!unitId.equals("")&&year!=null&&!year.equals("")){
			StringBuffer sqlBuf = new StringBuffer();
			sqlBuf.append("select * from (");
			sqlBuf.append("select * from sgcc_ini_unit t start with unitid='")
					.append(unitId)
					.append("' connect by prior unitid = upunit");
			sqlBuf.append(")where state='1' and (start_year<='"+year+"' or start_year is null) and (end_year>='"+year+"' or end_year is null)") ;
			sqlBuf.append(" order by unitid");
			SQLQuery query = getSession().createSQLQuery(sqlBuf.toString())
							.addEntity("t",SgccIniUnit.class);
			List list = query.list();
			if(list!=null&&list.size()>0){
				Iterator iter = list.iterator();
				SgccIniUnit iniUnit = null;
				while(iter.hasNext()){
					iniUnit = (SgccIniUnit)iter.next();
					uList.add(iniUnit);
				}
			}
		}else if(unitId==null||unitId.equals("")){
			uList = getAllUnitByYear(year);
		}else if(year==null||year.equals("")){
			uList = getAllChildrenByUnitid(unitId);
		}
		return uList;
	}
	
	/**
	  * 根据年度获得所有单位信息
	  * @param year
	  * @return
	  **/
	public List getAllUnitByYear(String year){
		
		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append("select * from sgcc_ini_unit t ");
		sqlBuf.append("where state='1' and (start_year<='"+year+"' or start_year is null) and (end_year>='"+year+"' or end_year is null)") ;
		sqlBuf.append(" order by unitid");
		SQLQuery query = getSession().createSQLQuery(sqlBuf.toString())
						.addEntity("t",SgccIniUnit.class);
		List list = query.list();
		List uList = new ArrayList();
		if(list!=null&&list.size()>0){
			Iterator iter = list.iterator();
			SgccIniUnit iniUnit = null;
			while(iter.hasNext()){
				iniUnit = (SgccIniUnit)iter.next();
				uList.add(iniUnit);
			}
		}
		return uList;
	}
	
	/**
	 * 根据年度获得下级单位信息（单位的unit_type_id为1）
	 * @param parentId
	 * @param year
	 * @return
	 */
	public List getSubUnitByYear(String parentId,String year){
		
		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append("select * from sgcc_ini_unit t ");
		sqlBuf.append("where upunit='"+parentId+"' and unit_type_id in('1','2','3','5') and state='1' and (start_year<='"+year+"' or start_year is null) and (end_year>='"+year+"' or end_year is null)") ;
		sqlBuf.append(" order by unitid");
		SQLQuery query = getSession().createSQLQuery(sqlBuf.toString())
						.addEntity("t",SgccIniUnit.class);
		List list = query.list();
		List uList = new ArrayList();
		if(list!=null&&list.size()>0){
			Iterator iter = list.iterator();
			SgccIniUnit iniUnit = null;
			while(iter.hasNext()){
				iniUnit = (SgccIniUnit)iter.next();
				uList.add(iniUnit);
			}
		}
		return uList;
	}
}