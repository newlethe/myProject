package com.sgepit.pmis.wzgl.dao;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.pmis.wzgl.hbm.ViewWzArriveCgjh;
import com.sgepit.pmis.wzgl.hbm.ViewWzConCgjh;
import com.sgepit.pmis.wzgl.hbm.WzUser;

public class WZglDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(WZglDAO.class);

	protected void initDao() {
		super.initDao();
	}
	
	public static WZglDAO getFromApplicationContext(ApplicationContext ctx) {
		return (WZglDAO) ctx.getBean("wzglDAO");
	}
	
	//获取物资用户表的信息
	public List<WzUser> getWzUser(String where){
		
		List<WzUser> rtnList = new ArrayList<WzUser>();
		
		String sql = " select i1.* , i2.realname realAuthor from wz_user i1,rock_user i2 " +
		" where i1.userid=i2.userid ";
		if (where!=null && !where.equals("")){
			sql = sql + " and " + where + "order by i2.realname";
		} else{
			sql = sql + "order by i2.realname"; 
		}
		
		SQLQuery query2 = getSession().createSQLQuery(sql).addEntity("wz_user", WzUser.class)
						.addScalar("realAuthor", Hibernate.STRING);
		List listUser = query2.list();
		for (int i = 0; i < listUser.size(); i++) {
			Object[] objs = (Object[]) listUser.get(i);
			WzUser wzUser = (WzUser)objs[0];
			String realName = (String)(objs[1]==null?"":objs[1]);
			wzUser.setUsername(realName);
			rtnList.add(wzUser);
		}
		return rtnList;
	}
	//到货时获取采购计划的物资清单
	public List getArriveCgjh(String whereStr,String orderby, Integer start, Integer limit){
		String whereThis = (whereStr ==null || whereStr.equals("")?"" :" where " + whereStr);
		String orderbyThis = (orderby ==null || orderby.equals("")? "" :" order by r1." + orderby);
		String sql = "select r1.* from view_wz_arrive_cgjh r1 " +  whereThis + orderbyThis;
		String sqlCount = "select count(uids) from view_wz_arrive_cgjh " + whereThis  ;
		SQLQuery query = getSession().createSQLQuery(sql).addEntity("view_wz_arrive_cgjh", ViewWzArriveCgjh.class);		
		List list = this.getDataAutoCloseSes(sqlCount);;
		Integer size =10 ;
		if(list!=null && list.size()>0){
			size = ((BigDecimal)(list.get(0))).intValue();
		}
		
		if(start!=null&&limit!=null){
			query.setFirstResult(start.intValue());
			query.setMaxResults(limit.intValue());
		}		
		List rtnList = query.list();	
		rtnList.add(size);
		return rtnList;
	}
	
	
	//采购合同录入时获取采购计划的物资清单
	public List getConCgjh(String whereStr,String orderby, Integer start, Integer limit){
		String whereThis = (whereStr ==null || whereStr.equals("")?"" :" where " + whereStr);
		System.out.println("---->"+whereThis);
		String orderbyThis = (orderby ==null || orderby.equals("")? "" :" order by r1." + orderby);
		String sql = "select r1.* from view_wz_con_cgjh r1 " +  whereThis + orderbyThis;
		String sqlCount = "select count(uids) from view_wz_con_cgjh " + whereThis  ;
		SQLQuery query = getSession().createSQLQuery(sql).addEntity("view_wz_con_cgjh", ViewWzConCgjh.class);		
		List list = this.getDataAutoCloseSes(sqlCount);;
		Integer size =10 ;
		if(list!=null && list.size()>0){
			size = ((BigDecimal)(list.get(0))).intValue();
		}
		
		if(start!=null&&limit!=null){
			query.setFirstResult(start.intValue());
			query.setMaxResults(limit.intValue());
		}		
		List rtnList = query.list();	
		rtnList.add(size);
		return rtnList;
	}
}
