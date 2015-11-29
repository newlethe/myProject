package com.sgepit.pmis.planMgm.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import com.sgepit.frame.base.dao.BaseDAO;


public class PlanQuarterDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(PlanQuarterDAO.class);

	protected void initDao() {
		super.initDao();
	}
	public static PlanQuarterDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PlanQuarterDAO) ctx.getBean("planQuarterDAO");
	}
}