package com.sgepit.pmis.document.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;

public class ZlDAMgmImpl extends BaseMgmImpl implements ZlDAMgmFacade {
		
	private ZlGlMgmFacade zlglMgm;
	


	/**
	 * @param zlglMgm the zlglMgm to set
	 */
	public void setZlglMgm(ZlGlMgmFacade zlglMgm) {
		this.zlglMgm = zlglMgm;
	}




	public static ZlDAMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (ZlDAMgmImpl) ctx.getBean("zldaMgm");
	}
	
	// -------------------------------------------------------------------------
	// user methods 
	// -------------------------------------------------------------------------
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if (treeName.equalsIgnoreCase("zlTree")) {
			String orgid = ((String[])params.get("orgid"))[0];
			String pid = null;
			if ( params.get("pid") != null ){
				pid = ((String[])params.get("pid"))[0];
			}
			if ( pid != null && !orgid.equals("")&& parentId.equals("root") ){
				zlglMgm.initZlTree(orgid, pid, parentId);
			}
			list = this.zlglMgm.ShowZlTree(parentId, pid, orgid);
			return list;
		}
		if (treeName.equalsIgnoreCase("daTree")) {
			String pid = ((String[])params.get("pid"))[0];
			
			if ( pid != null && parentId.equals("root") ){
				zlglMgm.initDaTree(pid, parentId);
			}
			
			list = this.zlglMgm.ShowDATree(parentId,pid);

			return list;
		}
		if (treeName.equalsIgnoreCase("zdTree")) {
			list = this.zlglMgm.ShowZDTree(parentId);
			return list;
		}
		if (treeName.equalsIgnoreCase("zbwjTree")) {
			String pid = null;
			if ( params.get("pid") != null ){
				pid = ((String[])params.get("pid"))[0];
			}
			list = this.zlglMgm.ShowZBWJTree(parentId,pid);
			return list;
		}
		if (treeName.equalsIgnoreCase("orgZlTree")) {
			String pid = null;
			String orgid = ((String[])params.get("orgid"))[0];
			if ( params.get("pid") != null ){
				pid = ((String[])params.get("pid"))[0];
			}
			if ( pid != null && !orgid.equals("") && parentId.equals("root") ){
				zlglMgm.initZlTree(orgid, pid, parentId);
			}
			
			list = zlglMgm.getDeptAndChildZlTree(parentId, orgid);
			return list;
		}
		
		return list;
	}

	
	
	

}
