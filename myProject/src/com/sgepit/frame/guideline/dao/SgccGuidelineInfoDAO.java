package com.sgepit.frame.guideline.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Query;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.frame.util.BusinessUtil;

/**
 * A data access object (DAO) providing persistence and search support for
 * SgccGuidelineInfo entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccGuidelineInfoDAO extends IBaseDAO {
	private static final Log log = LogFactory
			.getLog(SgccGuidelineInfoDAO.class);
	

	protected void initDao() {
		sBeanName = "com.sgepit.frame.guideline.hbm.SgccGuidelineInfo";
	}

	public static SgccGuidelineInfoDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (SgccGuidelineInfoDAO) ctx.getBean("sgccGuidelineInfoDAO");
	}
	
	public static SgccGuidelineInfoDAO getInstence() {
		return (SgccGuidelineInfoDAO) Constant.wact.getBean("sgccGuidelineInfoDAO");
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