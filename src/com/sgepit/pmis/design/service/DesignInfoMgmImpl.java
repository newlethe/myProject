package com.sgepit.pmis.design.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.base.BusinessException;

public class DesignInfoMgmImpl extends BaseMgmImpl implements DesignInfoMgmFacade {
	
	private BaseDAO baseDao;
	private DesignInfoGlMgmFacade designinfoglMgm;
	
	public void setBaseDao(BaseDAO baseDao) {
		this.baseDao = baseDao;
	}
	
	


	/**
	 * @param zlglMgm the zlglMgm to set
	 */
	public void setDesignInfoglMgm(DesignInfoGlMgmFacade designinfoglMgm) {
		this.designinfoglMgm = designinfoglMgm;
	}




	public static DesignInfoMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (DesignInfoMgmImpl) ctx.getBean("designinfoMgm");
	}
	
	// -------------------------------------------------------------------------
	// user methods 
	// -------------------------------------------------------------------------
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
        
		if(treeName.equalsIgnoreCase("designinfoTree")){
			String pid = null;
			if ( params.get("pid") != null ){
				pid = ((String[])params.get("pid"))[0];
			}
			list = this.designinfoglMgm.ShowDesInfo(parentId,pid);
			return list;
		}
		
		return list;
	}




	public DesignInfoGlMgmFacade getDesigninfoglMgm() {
		return designinfoglMgm;
	}




	public void setDesigninfoglMgm(DesignInfoGlMgmFacade designinfoglMgm) {
		this.designinfoglMgm = designinfoglMgm;
	}




	public BaseDAO getBaseDao() {
		return baseDao;
	}

	
	

}
