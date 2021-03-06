package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class ConCompletionDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(ConCompletionDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static ConCompletionDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ConCompletionDAO) ctx.getBean("conCompletionDAO");
	}
}