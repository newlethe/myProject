package com.sgepit.pmis.contract.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class ContractDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(ContractDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static ContractDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ContractDAO) ctx.getBean("contractDAO");
	}
}