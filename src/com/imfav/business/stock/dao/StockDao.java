package com.imfav.business.stock.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

/**
 * 类说明
 * @author zhangh
 * @version 创建时间：2015年12月6日 下午11:36:07
 */
public class StockDao extends BaseDAO {
	private static final Log log = LogFactory.getLog(StockDao.class);

	protected void initDao() {
		super.initDao();
	}

	public static StockDao getFromApplicationContext(ApplicationContext ctx) {
		return (StockDao) ctx.getBean("stockDao");
	}
}
