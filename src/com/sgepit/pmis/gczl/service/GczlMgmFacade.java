package com.sgepit.pmis.gczl.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;

public interface GczlMgmFacade {
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;

	/**
	 * 根据PID、验评标准树的项目 查询检验项目
	 * @param orderby
	 * @param start
	 * @param limit
	 * @param params
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 27, 2011
	 */
	public List queryJyxmByPid(String orderby, Integer start, Integer limit, HashMap params);
	
	public Boolean deleteGczlZb(String zbBeanName, String xbBeanName, String bh);
}
