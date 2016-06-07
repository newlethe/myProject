package com.sgepit.pmis.budgetNk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BudgetChangeAppNkDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BudgetChangeAppNkDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BudgetChangeAppNkDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BudgetChangeAppNkDAO) ctx.getBean("budgetChangeAppNkDAO");
	}
}
