package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class MatCompletionDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(MatCompletionDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static MatCompletionDAO getFromApplicationContext(ApplicationContext ctx) {
		return (MatCompletionDAO) ctx.getBean("matCompletionDAO");
	}
}