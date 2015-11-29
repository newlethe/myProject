package com.sgepit.pcmis.aqgk.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class AqgkDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(AqgkDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static AqgkDAO getFromApplicationContext(ApplicationContext ctx) {
		return (AqgkDAO) ctx.getBean("aqgkDAO");
	}
}