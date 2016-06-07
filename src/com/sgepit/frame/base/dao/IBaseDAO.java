package com.sgepit.frame.base.dao;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateCallback;

public class IBaseDAO extends BaseDAO{
	private static final Log log = LogFactory.getLog(IBaseDAO.class);
	public static BaseDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BaseDAO) ctx.getBean("IBaseDAO");
	}
	protected String sBeanName = "";
	
	public Object findBeanByProperty(String propertyName,
			Object value) {
		return super.findBeanByProperty(sBeanName, propertyName, value);
	}
	
	public Object findByCompId(Serializable id) {
		return super.findByCompId(sBeanName, id);
	}

	public Object findById(String id) {
		return super.findById(sBeanName, id);
	}		
	
	public List findByPropertyOrder(String propertyName,Object value, String orderby) {

		return super.findByProperty(sBeanName,propertyName, value, orderby,null,null);
	}
	public List findByProperty(String propertyName,	Object value) {

		return findByPropertyOrder(propertyName, value,null);
	}
	public List findAll() {
		return findByWhere(null,null,null,null);
	}
	
	public List findWhere(String where) {

		return findByWhere(where,null,null,null);
	}	
	public List findOderby(String orderby) {

		return findByWhere(null,orderby,null,null);
	}		
	public List findWhereOrderBy(String where, String orderby) {
		return findByWhere(where, orderby,null,null);
	}
	public List findByWhere(String where, String orderby,Integer firstRow, Integer maxRow) {

		return super.findByWhere(sBeanName, where, orderby, firstRow, maxRow);
	}	
	
	protected void initDao() {	
		super.initDao();
	}
}
