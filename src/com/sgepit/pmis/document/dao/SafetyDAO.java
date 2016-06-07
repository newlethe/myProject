package com.sgepit.pmis.document.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;



public class SafetyDAO extends BaseDAO{
	
	private static final Log log = LogFactory.getLog(SafetyDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static SafetyDAO getFromApplicationContext(ApplicationContext ctx) {
		return (SafetyDAO) ctx.getBean("safetyDAO");
	}

}
