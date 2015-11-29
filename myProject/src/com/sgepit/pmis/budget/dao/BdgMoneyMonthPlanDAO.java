package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BdgMoneyMonthPlanDAO extends BaseDAO{
	private static final Log log = LogFactory.getLog(BdgBalDAO.class);
	
	protected void initDao(){
		super.initDao();
	}
	
	public static BdgMoneyMonthPlanDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgMoneyMonthPlanDAO) ctx.getBean("bdgMoneyMonthPlanConDAO");
	}
}
