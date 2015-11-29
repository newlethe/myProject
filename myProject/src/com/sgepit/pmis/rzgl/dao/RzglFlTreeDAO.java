package com.sgepit.pmis.rzgl.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
/**
 * 日志管理-分类树DAO
 * @author zhengw
 * @versionV1.00
 * @since2-14-2-17
 */
public class RzglFlTreeDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(RzglFlTreeDAO.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static RzglFlTreeDAO getFromApplicationContext(ApplicationContext ctx) {
		return (RzglFlTreeDAO) ctx.getBean("RzglFlTreeDAO");
	}
}
