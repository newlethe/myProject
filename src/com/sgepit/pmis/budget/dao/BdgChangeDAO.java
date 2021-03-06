package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class BdgChangeDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgChangeDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BdgChangeDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgChangeDAO) ctx.getBean("bdgChangeDAO");
	}
}