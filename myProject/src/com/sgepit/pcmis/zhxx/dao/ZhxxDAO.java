package com.sgepit.pcmis.zhxx.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class ZhxxDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(ZhxxDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static ZhxxDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ZhxxDAO) ctx.getBean("zhxxDAO");
	}
}