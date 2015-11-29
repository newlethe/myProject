package com.sgepit.pcmis.approvl.dao;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.pcmis.approvl.dao.PCApprovlDAO;

public class PCApprovlDAO extends BaseDAO{
	
	private static final Log log = LogFactory.getLog(PCApprovlDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static PCApprovlDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PCApprovlDAO) ctx.getBean("ApprovlDAO");
	}

}
