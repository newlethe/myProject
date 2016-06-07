package com.imfav.business.customer.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

/**
 * @author zhangh
 * @version 创建时间：2015年12月6日 上午12:02:36
 */
public class CustomerDao extends BaseDAO {
	private static final Log log = LogFactory.getLog(CustomerDao.class);

	protected void initDao() {
		super.initDao();
	}

	public static CustomerDao getFromApplicationContext(ApplicationContext ctx) {
		return (CustomerDao) ctx.getBean("customerDao");
	}
}