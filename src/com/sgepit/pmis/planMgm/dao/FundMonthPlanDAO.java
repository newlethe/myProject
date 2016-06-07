/**
 * 
 */
package com.sgepit.pmis.planMgm.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

/**
 * @author qiupy 2014-3-4 
 *
 */
public class FundMonthPlanDAO extends BaseDAO{

	private static final Log log = LogFactory.getLog(FundMonthPlanDAO.class);
	protected void initDao() {
		super.initDao();
	}
	public static FundMonthPlanDAO getFromApplicationContext(ApplicationContext ctx) {
		return (FundMonthPlanDAO) ctx.getBean("fundMonthPlanDAO");
	}
}
