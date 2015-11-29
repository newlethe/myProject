package com.sgepit.frame.example.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class ExampleDAO extends BaseDAO {
	
	private static final Log log = LogFactory.getLog(ExampleDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static ExampleDAO getFromApplicationContext(ApplicationContext ctx) {
		return (ExampleDAO) ctx.getBean("exampleDAO");
	}	
}
