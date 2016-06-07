package com.sgepit.pmis.news.dao;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.fileAndPublish.dao.ComFileInfoDAO;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;

public class AppNewsDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(AppNewsDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static AppNewsDAO getFromApplicationContext(ApplicationContext ctx) {
		return (AppNewsDAO) ctx.getBean("appNewsDAO");
	}
	public static AppNewsDAO getInstance(){
		return (AppNewsDAO) Constant.wact.getBean("appNewsDAO");
	}	
}