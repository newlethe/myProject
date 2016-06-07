package com.sgepit.pmis.finalAccounts.financialAudit.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class FaEquAuditReportDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(FaEquAuditReportDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static FaEquAuditReportDAO getFromApplicationContext(ApplicationContext ctx) {
		return (FaEquAuditReportDAO) ctx.getBean("FaEquAuditReportDAO");
	}
}