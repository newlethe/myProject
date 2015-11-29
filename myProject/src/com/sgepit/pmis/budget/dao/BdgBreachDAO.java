package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class BdgBreachDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgBreachDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BdgBreachDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgBreachDAO) ctx.getBean("bdgBreachDAO");
	}
}