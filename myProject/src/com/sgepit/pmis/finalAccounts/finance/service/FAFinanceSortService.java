package com.sgepit.pmis.finalAccounts.finance.service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.finalAccounts.finance.hbm.FASubjectSort;

public interface FAFinanceSortService {
	public void deleteSubjectSort(FASubjectSort fss) throws SQLException,BusinessException ;
	
	public void insertSubjectSort(FASubjectSort fss) throws SQLException,BusinessException ;
	
	public void updateSubjectSort(FASubjectSort fss) throws SQLException,BusinessException ;
	
	public int addOrUpdateSubject(FASubjectSort fss);
	
	/**
	 * 删除 一个科目分类
	 * @return
	 */
	public int deleteChildNodeSubject(String subId);
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	List<FASubjectSort> getBdgSubjects(String bdgid, String sortColumn,boolean asc);
	void setSubjectsRefBdg(String[] subjectIds, String bdgid) throws BusinessException;

	/**
	 * 二次费用分摊操作
	 * @param tableName	分摊资产的表名
	 * @param ids		分摊资产的uids
	 * @param subNo		分摊的财务科目编码
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 19, 2011
	 */
	public String apportionSecond(String tableName, String ids, String subNo);
	
	/**
	 * 直接形成固定资产操作
	 * @param tableName	稽核业务表名
	 * @param ids	稽核资产数据uids
	 * @param accountId	财务套账号
	 * @return
	 * @author: Liuay
	 * @createDate: 2011-7-21
	 */
	public String fixAssetsDirect(String tableName, String ids, String accountId);
}
