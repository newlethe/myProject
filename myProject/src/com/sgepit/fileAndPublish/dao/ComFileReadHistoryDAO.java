package com.sgepit.fileAndPublish.dao;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

/**
 * A data access object (DAO) providing persistence and search support for
 * ComFileReadHistory entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.file.ComFileReadHistory
 * @author MyEclipse Persistence Tools
 */

public class ComFileReadHistoryDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(ComFileReadHistoryDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.fileAndPublish.hbm.ComFileReadHistory";
	}

	public static ComFileReadHistoryDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ComFileReadHistoryDAO) ctx.getBean("ComFileReadHistoryDAO");
	}
	
	public static ComFileReadHistoryDAO getInstance(){
		return (ComFileReadHistoryDAO) Constant.wact.getBean("ComFileReadHistoryDAO");
	}
}