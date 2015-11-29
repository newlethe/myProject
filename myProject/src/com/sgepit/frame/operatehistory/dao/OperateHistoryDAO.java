/**
 * 
 */
package com.sgepit.frame.operatehistory.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;

/**
 * @author qiupy 2013-1-29 
 *
 */
public class OperateHistoryDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(OperateHistoryDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.frame.operatehistory.hbm.UOperateHistory";
	}

	public static OperateHistoryDAO getInstence() {
		return (OperateHistoryDAO) Constant.wact.getBean("operateHistoryDAO");
	}

	public static OperateHistoryDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (OperateHistoryDAO) ctx.getBean("operateHistoryDAO");
	}

}
