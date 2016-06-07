package com.sgepit.pmis.rzgl.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class RzglRzDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(RzglRzDAO.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static RzglRzDAO getFromApplicationContext(ApplicationContext ctx) {
		return (RzglRzDAO) ctx.getBean("RzglRzDAO");
	}
}
