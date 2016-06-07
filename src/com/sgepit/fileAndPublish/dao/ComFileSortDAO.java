package com.sgepit.fileAndPublish.dao;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

/**
 * A data access object (DAO) providing persistence and search support for
 * ComFileSort entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.file.ComFileSort
 * @author MyEclipse Persistence Tools
 */

public class ComFileSortDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(ComFileSortDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.fileAndPublish.hbm.ComFileSort";
	}

	public static ComFileSortDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ComFileSortDAO) ctx.getBean("ComFileSortDAO");
	}
	
	public static ComFileSortDAO getInstance(){
		return (ComFileSortDAO) Constant.wact.getBean("ComFileSortDAO");
	}
}