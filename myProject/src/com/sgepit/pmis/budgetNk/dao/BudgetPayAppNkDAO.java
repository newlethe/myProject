package com.sgepit.pmis.budgetNk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BudgetPayAppNkDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BudgetPayAppNkDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BudgetPayAppNkDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BudgetPayAppNkDAO) ctx.getBean("budgetPayAppNkDAO");
	}
}
