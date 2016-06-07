package com.sgepit.pcmis.tzgl.dao;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class TzglDAO extends BaseDAO{
	
	private static final Log log = LogFactory.getLog(TzglDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static TzglDAO getFromApplicationContext(ApplicationContext ctx) {
		return (TzglDAO) ctx.getBean("tzglDAO");
	}

}
