package com.sgepit.pmis.finalAccounts.basicData.service;

import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.finalAccounts.basicData.hbm.FAAssetsSortHBM;

public interface FAAssetsService {

	/**
	 * 资产分类树
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 * @author: Ivy
	 * @createDate: 2011-3-8
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	
	/**
	 * 根据父节点ID，获取资产分类树ColumnTree的信息
	 * @param parentId
	 * @param pid
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-2
	 */
	public List<ColumnTreeNode> assetSortTree(String parentId, String pid) throws BusinessException;
	
	/**
	 * 新增或更新资产分类信息
	 * @param fas
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-8
	 */
	public int addOrUpdateSort(FAAssetsSortHBM fas);
	
	/**
	 *删除一个资产分类
	 * @return
	 */
	public int deleteChildNodeSort(String sortId);
}
