package com.sgepit.pmis.budgetNk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BudgetMoneyAppNkDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BudgetMoneyAppNkDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BudgetMoneyAppNkDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BudgetMoneyAppNkDAO) ctx.getBean("budgetMoneyAppNkDAO");
	}
}
