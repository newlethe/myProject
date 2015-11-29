package com.sgepit.pmis.rzgl.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class RzglRzPlDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(RzglRzPlDAO.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static RzglRzPlDAO getFromApplicationContext(ApplicationContext ctx) {
		return (RzglRzPlDAO) ctx.getBean("RzglRzPlDAO");
	}
}
