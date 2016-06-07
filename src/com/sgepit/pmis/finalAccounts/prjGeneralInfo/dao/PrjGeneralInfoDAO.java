package com.sgepit.pmis.finalAccounts.prjGeneralInfo.dao;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class PrjGeneralInfoDAO extends BaseDAO{
	
	public static PrjGeneralInfoDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PrjGeneralInfoDAO) ctx.getBean("prjGeneralInfoDAO");
	}

}
