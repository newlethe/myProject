package com.sgepit.pcmis.balance.dao;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.pcmis.balance.dao.PCBalanceDAO;
public class PCBalanceDAO extends BaseDAO{
	
	private static final Log log = LogFactory.getLog(PCBalanceDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static PCBalanceDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PCBalanceDAO) ctx.getBean("pcBalanceDAO");
	}

}
