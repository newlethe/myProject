package com.sgepit.pmis.planMgm.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import com.sgepit.frame.base.dao.BaseDAO;


public class PlanMonthDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(PlanMonthDAO.class);

	protected void initDao() {
		super.initDao();
	}
	public static PlanMonthDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PlanMonthDAO) ctx.getBean("planMonthDAO");
	}
}