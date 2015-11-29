package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BdgMoneyPlanSubDAO extends BaseDAO {
	
	private static final Log log = LogFactory.getLog(BdgMoneyPlanSubDAO.class);
	
	protected void initDao(){
		super.initDao();
	}
	
	public static BdgMoneyPlanSubDAO getFromApplicationContext(ApplicationContext ctx){
		return (BdgMoneyPlanSubDAO) ctx.getBean("bdgMoneyPlanSubDAO");
	}
}
