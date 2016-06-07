package com.sgepit.pmis.finalAccounts.financialAudit.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class FaBuildingAuditReportDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(FaBuildingAuditReportDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static FaBuildingAuditReportDAO getFromApplicationContext(ApplicationContext ctx) {
		return (FaBuildingAuditReportDAO) ctx.getBean("FaBuildingAuditReportDAO");
	}
}