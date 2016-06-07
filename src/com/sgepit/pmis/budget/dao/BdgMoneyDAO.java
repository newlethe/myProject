package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class BdgMoneyDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgMoneyDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BdgMoneyDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgMoneyDAO) ctx.getBean("bdgMoneyDAO");
	}
}