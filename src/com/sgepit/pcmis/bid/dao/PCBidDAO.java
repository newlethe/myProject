package com.sgepit.pcmis.bid.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class PCBidDAO extends BaseDAO{
	private static final Log log = LogFactory.getLog(PCBidDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static PCBidDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PCBidDAO) ctx.getBean("pcBidDAO");
	}

}
