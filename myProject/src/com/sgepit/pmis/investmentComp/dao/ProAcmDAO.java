package com.sgepit.pmis.investmentComp.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class ProAcmDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(ProAcmDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static ProAcmDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ProAcmDAO) ctx.getBean("proAcmDAO");
	}
}