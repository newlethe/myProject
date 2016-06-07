package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class BdgCompensateDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgCompensateDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BdgCompensateDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgCompensateDAO) ctx.getBean("bdgCompensateDAO");
	}
}