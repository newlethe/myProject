package com.sgepit.pmis.reimburse.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.pmis.budget.dao.BdgPayDAO;

public class ReimburseDao extends BaseDAO {
	private static final Log log = LogFactory.getLog(ReimburseDao.class);

	protected void initDao() {
		super.initDao();
	}

	public static ReimburseDao getFromApplicationContext(ApplicationContext ctx) {
		return (ReimburseDao) ctx.getBean("reimburseDao");
	}
}
