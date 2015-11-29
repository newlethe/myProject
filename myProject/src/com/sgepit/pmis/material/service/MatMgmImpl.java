package com.sgepit.pmis.material.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;


public class MatMgmImpl extends BaseMgmImpl implements MatMgmFacade {
	
	private MatFrameMgmFacade  matFrameMgm;
	private MatAppbuyMgmFacade appBuyMgm; 
	private MatGoodsMgmFacade  matGoodsMgm;
	
	public static MatMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (MatMgmImpl) ctx.getBean("matMgm");
	}
	
	public void setMatFrameMgm(MatFrameMgmFacade matFrameMgm) {
		this.matFrameMgm = matFrameMgm;
	}

	public void setAppBuyMgm(MatAppbuyMgmFacade appBuyMgm) {
		this.appBuyMgm = appBuyMgm;
	}

	public void setMatGoodsMgm(MatGoodsMgmFacade matGoodsMgm) {
		this.matGoodsMgm = matGoodsMgm;
	}
	
	// -------------------------------------------------------------------------
	// user methods 
	// -------------------------------------------------------------------------
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		
		if (treeName.equalsIgnoreCase("matFrameTree")) {			
			list = this.matFrameMgm.matFrameTree(parentId);
		}  
		
		if (treeName.equalsIgnoreCase("selectFrameTree")) {	
			String appid = ((String[])params.get("appid"))[0];
			list = this.appBuyMgm.getMatFrameTree(parentId, appid);
		}
		
		if (treeName.equalsIgnoreCase("getMatConTree")) {	
			String conid = ((String[])params.get("conid"))[0];
			list = this.matFrameMgm.getMatConTree(parentId, conid);
		}
		
		if (treeName.equalsIgnoreCase("matContractTree")) {	
			String conid = ((String[])params.get("conid"))[0];
			list = this.matFrameMgm.matContractTree(parentId, conid);
		}
		
		if (treeName.equalsIgnoreCase("contractMatTree")) {	
			String conid = ((String[])params.get("conid"))[0];
			String type = ((String[])params.get("type"))[0];
			list = this.matFrameMgm.contractMatTree(parentId, conid, type);
		}
		return list;
	}

	
	
	

}
