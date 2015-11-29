package com.sgepit.pcmis.jdgk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class PCJdgkDao extends BaseDAO {
	private static final Log log = LogFactory.getLog(PCJdgkDao.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static PCJdgkDao getFromApplicationContext(ApplicationContext ctx) {
		return (PCJdgkDao) ctx.getBean("jdgkDao");
	}
}
