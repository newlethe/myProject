package com.sgepit.fileAndPublish.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;

/**
 * A data access object (DAO) providing persistence and search support for
 * ComFileInfo entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.file.ComFileInfo
 * @author MyEclipse Persistence Tools
 */

public class ComFileInfoDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(ComFileInfoDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.fileAndPublish.hbm.ComFileInfo";
	}

	public static ComFileInfoDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ComFileInfoDAO) ctx.getBean("ComFileInfoDAO");
	}
	
	public static ComFileInfoDAO getInstance(){
		return (ComFileInfoDAO) Constant.wact.getBean("ComFileInfoDAO");
	}
}