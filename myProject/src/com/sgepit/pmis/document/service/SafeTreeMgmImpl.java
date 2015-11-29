package com.sgepit.pmis.document.service;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;


public class SafeTreeMgmImpl extends BaseMgmImpl implements SafeTreegmFacade {
	
	private BaseDAO baseDao;
	private SafetyMgmImpl safetyMgm;
	
	public void setBaseDao(BaseDAO baseDao) {
		this.baseDao = baseDao;
	}
	
	/**
	 * @param zlglMgm the zlglMgm to set
	 */
	
	public static SafeTreeMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (SafeTreeMgmImpl) ctx.getBean("safetreeMgm");
	}
	
	// -------------------------------------------------------------------------
	// user methods 
	// -------------------------------------------------------------------------
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		
		List list = new ArrayList();
		
		if (treeName.equalsIgnoreCase("SafeTree")) {
			list = this.safetyMgm.SafeTree(parentId);
			return list;
		}
		
		if (treeName.equalsIgnoreCase("InitSafeTree")) {
			String safeexamin=((String[])params.get("safeexamin"))[0];
			list = this.safetyMgm.InitSafeTree(parentId,safeexamin);
			return list;
		}
		
		return list;
	}

	/**
	 * @param safetyMgm the safetyMgm to set
	 */
	public void setSafetyMgm(SafetyMgmImpl safetyMgm) {
		this.safetyMgm = safetyMgm;
	}
	
	

}
