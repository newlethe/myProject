package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class BdgCorpDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgCorpDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static BdgCorpDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BdgCorpDAO) ctx.getBean("bdgCorpDAO");
	}
}