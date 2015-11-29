package com.sgepit.fileAndPublish.dao;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

/**
 * A data access object (DAO) providing persistence and search support for
 * ComFileSortDept entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.file.ComFileSortDept
 * @author MyEclipse Persistence Tools
 */

public class ComFileSortDeptDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(ComFileSortDeptDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.fileAndPublish.hbm.ComFileSortDept";
	}

	public static ComFileSortDeptDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ComFileSortDeptDAO) ctx.getBean("ComFileSortDeptDAO");
	}
	
	public static ComFileSortDeptDAO getInstance(){
		return (ComFileSortDeptDAO) Constant.wact.getBean("ComFileSortDeptDAO");
	}
}