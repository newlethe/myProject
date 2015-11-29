package com.sgepit.frame.util.sms.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;


public class PopMspDAO extends IBaseDAO{
	private static final Log log = LogFactory.getLog(PopMspDAO.class);

	protected void initDao() {
		super.initDao();
	}
	
	public static PopMspDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PopMspDAO) ctx.getBean("popMspDAO");
	}
}
