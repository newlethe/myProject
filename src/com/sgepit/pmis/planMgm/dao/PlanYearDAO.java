package com.sgepit.pmis.planMgm.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import com.sgepit.frame.base.dao.BaseDAO;


public class PlanYearDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(PlanYearDAO.class);

	protected void initDao() {
		super.initDao();
	}
	public static PlanYearDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PlanYearDAO) ctx.getBean("planYearDAO");
	}
}