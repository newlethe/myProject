package com.sgepit.frame.guideline.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;

/**
 * A data access object (DAO) providing persistence and search support for
 * SgccGuidelineInfoXd entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccGuidelineInfoXdDAO extends IBaseDAO {
	private static final Log log = LogFactory
			.getLog(SgccGuidelineInfoXdDAO.class);
	
	protected void initDao() {
		sBeanName = "com.sgepit.frame.guideline.hbm.SgccGuidelineInfoXd";
	}

	public static SgccGuidelineInfoXdDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (SgccGuidelineInfoXdDAO) ctx.getBean("sgccGuidelineInfoXdDAO");
	}
	public static SgccGuidelineInfoXdDAO getInstence() {
		return (SgccGuidelineInfoXdDAO) Constant.wact.getBean("sgccGuidelineInfoXdDAO");
	}
}