package com.sgepit.pmis.finalAccounts.basicData.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class FAAssetsSortDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(FAAssetsSortDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static FAAssetsSortDAO getFromApplicationContext(ApplicationContext ctx) {
		return (FAAssetsSortDAO) ctx.getBean("FAAssetsSortDAO");
	}
}