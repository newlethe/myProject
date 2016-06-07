package com.sgepit.pmis.rzgl.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class RzglFlQxUnitDAO extends BaseDAO {

	private static final Log log = LogFactory.getLog(RzglFlQxUnitDAO.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static RzglFlQxUnitDAO getFromApplicationContext(ApplicationContext ctx) {
		return (RzglFlQxUnitDAO) ctx.getBean("RzglFlQxUnitDAO");
	}
}
