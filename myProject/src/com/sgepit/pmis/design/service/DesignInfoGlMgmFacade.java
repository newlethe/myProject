/***********************************************************************
 * Module:  ZlGlMgmFacade.java
 * Author:  lixiaob
 * Purpose: Defines the Interface ZlGlMgmFacade
 ***********************************************************************/

package com.sgepit.pmis.design.service;

import java.util.List;

import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.design.hbm.DesignInfoGl;
import com.sgepit.pmis.design.hbm.DesignInfoTree;

/** 资料管理业务实现基本接口
 * 
 * @pdOid b0f27421-cebb-41c3-9e24-c63e92bfd441 */
public interface DesignInfoGlMgmFacade {
	
	   /*
	    * 设计资料树
	    */
	    List<ColumnTreeNode> ShowDesInfo(String parentId,String pid);
	   
	    public int deleteDesignInfoChildNode(String noid);
	    public void SaveDesignInfotree(DesignInfoTree designinfotree);
	    /*
	     * 新增或修改
	     */
		public int getRowCount(String id);
		/*
		 * 资料移交
		 */
		
	    public void ZlHandoverDesInfozlOk(String ids,String indexid,String unitid);
	    /*
	     * 新增节点
	     */
	    public int addOrUpdateDesignInfo(DesignInfoTree designinfotree, String indexid);
	    
	    public boolean checkinfobh(String id);
	    
	    public String getinfobh(String id);
	    
	    public void savedesigninfogl(DesignInfoGl designinfogl);
	    
	    public void updatedesigninfogl(DesignInfoGl designinfogl);
	    
	    public String getdesinfoindexid(String parent);
	    
	    public void UpdateDesignInfotree(DesignInfoTree designinfotree);
}