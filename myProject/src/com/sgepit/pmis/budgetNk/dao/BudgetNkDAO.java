package com.sgepit.pmis.budgetNk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BudgetNkDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BudgetNkDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BudgetNkDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BudgetNkDAO) ctx.getBean("budgetNkDAO");
	}
}
