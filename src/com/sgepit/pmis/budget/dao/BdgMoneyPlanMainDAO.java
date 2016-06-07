package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BdgMoneyPlanMainDAO extends BaseDAO {
	
	private static final Log log =LogFactory.getLog(BdgMoneyPlanMainDAO.class);
	
	protected void initDao(){
		super.initDao();
	}
	
	public static BdgMoneyPlanMainDAO getFromApplicationContext(ApplicationContext ctx){
		return (BdgMoneyPlanMainDAO) ctx.getBean("bdgMoneyPlanMainDAO");
	}
}
