package com.sgepit.frame.guideline.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;

/**
 * 指标公式定义
 * 
 * @author Shirley's
 * @createDate Apr 17, 2009
 */
public class SgccGuidelineFormulaDAO extends IBaseDAO {

	private static final Log log = LogFactory
			.getLog(SgccGuidelineFormulaDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.frame.guideline.hbm.SgccGuidelineFormula";
	}

	public static SgccGuidelineFormulaDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (SgccGuidelineFormulaDAO) ctx.getBean("sgccGuidelineFormulaDAO");
	}
	public static SgccGuidelineFormulaDAO getInstence() {
		return (SgccGuidelineFormulaDAO) Constant.wact.getBean("sgccGuidelineFormulaDAO");
	}
}
