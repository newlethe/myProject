package com.sgepit.frame.xgridTemplet.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;

public class SgprjTempletConfigDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(SgprjTempletConfigDAO.class);

	protected void initDao() {
         sBeanName = "com.sgepit.frame.xgridTemplet.hbm.SgprjTempletConfig";
	}
	
	public static SgprjTempletConfigDAO getFromApplicationContext(ApplicationContext ctx){
		return (SgprjTempletConfigDAO) ctx.getBean("SgprjTempletConfigDAO");
	}
	
	public static SgprjTempletConfigDAO getInstance(){
		return (SgprjTempletConfigDAO) Constant.wact.getBean("SgprjTempletConfigDAO");
	}
}
