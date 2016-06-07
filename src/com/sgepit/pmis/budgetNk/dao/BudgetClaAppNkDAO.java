package com.sgepit.pmis.budgetNk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BudgetClaAppNkDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BudgetClaAppNkDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BudgetClaAppNkDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BudgetClaAppNkDAO) ctx.getBean("budgetClaAppNkDAO");
	}
}
