package com.sgepit.pmis.budgetNk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BudgetBreakAppNkDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BudgetBreakAppNkDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BudgetBreakAppNkDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (BudgetBreakAppNkDAO) ctx.getBean("budgetBreakAppNkDAO");
	}
}
