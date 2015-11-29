package com.sgepit.pmis.gczl.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class GczlDAO extends BaseDAO{
	private static final Log log = LogFactory.getLog(GczlDAO.class);

	protected void initDao() {
		super.initDao();
	}
	
	public static GczlDAO getFromApplicationContext(ApplicationContext ctx) {
		return (GczlDAO) ctx.getBean("gczlDAO");
	}
}
