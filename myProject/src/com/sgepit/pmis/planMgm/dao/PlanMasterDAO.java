package com.sgepit.pmis.planMgm.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import com.sgepit.frame.base.dao.BaseDAO;


public class PlanMasterDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(PlanMasterDAO.class);

	protected void initDao() {
		super.initDao();
	}
	public static PlanMasterDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PlanMasterDAO) ctx.getBean("planMasterDAO");
	}
}