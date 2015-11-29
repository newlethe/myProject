package com.sgepit.pmis.finalAccounts.financialAudit.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class FaAuditMasterDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(FaMatAuditReportDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static FaMatAuditReportDAO getFromApplicationContext(ApplicationContext ctx) {
		return (FaMatAuditReportDAO) ctx.getBean("FaAuditMasterDAO");
	}
}