package com.sgepit.pmis.sczb.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.pmis.contract.dao.ContractDAO;

public class SczbBcDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(SczbBcDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static ContractDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ContractDAO) ctx.getBean("sczbBcDAO");
	}
}
