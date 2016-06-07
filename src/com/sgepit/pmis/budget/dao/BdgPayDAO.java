package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class BdgPayDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgPayDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BdgPayDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgPayDAO) ctx.getBean("bdgPayDAO");
	}
}