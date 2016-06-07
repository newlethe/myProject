package com.sgepit.pmis.tenders.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class TendersDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(TendersDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static TendersDAO getFromApplicationContext(ApplicationContext ctx) {
		return (TendersDAO) ctx.getBean("tendersDAO");
	}
}