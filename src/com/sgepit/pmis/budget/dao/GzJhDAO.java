package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class GzJhDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(GzJhDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static GzJhDAO getFromApplicationContext(ApplicationContext ctx) {
		return (GzJhDAO) ctx.getBean("gzJhDAO");
	}
}