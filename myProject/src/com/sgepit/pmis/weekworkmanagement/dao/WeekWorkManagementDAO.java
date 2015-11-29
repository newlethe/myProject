/**
 * 
 */
package com.sgepit.pmis.weekworkmanagement.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

/**
 * @author qiupy 2013-5-3 
 *
 */
public class WeekWorkManagementDAO extends BaseDAO{

private static final Log log = LogFactory.getLog(WeekWorkManagementDAO.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static WeekWorkManagementDAO getFromApplicationContext(ApplicationContext ctx) {
		return (WeekWorkManagementDAO) ctx.getBean("weekWorkManagementDAO");
	}
}
