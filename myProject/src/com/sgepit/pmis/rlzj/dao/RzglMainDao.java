package com.sgepit.pmis.rlzj.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
public class RzglMainDao extends IBaseDAO{
	private static final Log log = LogFactory.getLog(RzglMainDao.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static RzglMainDao getFromApplicationContext(ApplicationContext ctx) {
		return (RzglMainDao) ctx.getBean("rzglMainDao");
	}
}
