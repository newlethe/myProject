package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class BdgBalDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgBalDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BdgBalDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgBalDAO) ctx.getBean("bdgBalDAO");
	}
}