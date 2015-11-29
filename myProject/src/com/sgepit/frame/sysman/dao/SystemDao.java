package com.sgepit.frame.sysman.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessResourceFailureException;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.sysman.hbm.RockRole;
import com.sgepit.frame.util.BusinessUtil;


public class SystemDao extends BaseDAO {
	
	private static final Log log = LogFactory.getLog(SystemDao.class);

	protected void initDao() {
		super.initDao();
	}

	public static SystemDao getFromApplicationContext(ApplicationContext ctx) {
		return (SystemDao) ctx.getBean("systemDao");
	}	
	
	public int countByProperty(String beanName, String propertyName,final Object value,boolean hasPos) {
		String table = BusinessUtil.getTableName(beanName);
		String str = "from " + table + " as model where model."
				+ propertyName + "= ?";
		if (!hasPos){
			str = str + " and model.unitTypeId<>'9'";
		}
		final String hsql = str;
		Query query = getSession().createQuery(str);
		query.setParameter(0, value);
		Integer size = query.list().size();
		return size.intValue();
	}
	public int countByProperty(String beanName, String propertyName,final Object value) {
		String table = BusinessUtil.getTableName(beanName);
		String str = "from " + table + " as model where model."
				+ propertyName + "= ?";
		final String hsql = str;
		Query query = getSession().createQuery(str);
		query.setParameter(0, value);
		Integer size = query.list().size();
		return size.intValue();
	}
}
