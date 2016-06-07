package com.sgepit.pmis.budget.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.budget.hbm.BdgCorpBasic;
import com.sgepit.pmis.budget.hbm.BdgCorpInfo;

/**
 * BdgCorpMgmFacade 建设法人管理 - 业务逻辑接口
 * @author Xiaos
 */

public interface BdgCorpMgmFacade {
	public String insertBdgCorpBasic(BdgCorpBasic bdgcorpbasic) throws SQLException, BusinessException;
	public String updateBdgCorpBasic(BdgCorpBasic bdgcorpbasic) throws SQLException, BusinessException;
	public int deleteBdgCorpBasic(String bdgcorpbasicid) throws SQLException, BusinessException;	
	public void insertBdgCorpInfo(BdgCorpInfo corpinfo) throws SQLException, BusinessException;
	public void updateBdgCorpInfo(BdgCorpInfo corpinfo) throws SQLException, BusinessException;
	/**
	 * @description 保存建设法人对编辑数据
	 * @author Xiaos
	 * @param bdgCorpInfo
	 */
	public int addOrUpdateBdgCorpInfo(BdgCorpInfo bdgCorpInfo);
	/**
	 * @description 获得从概算树选择后的建设法人概算树
	 * @author Xiaos
	 * @param parentId
	 * @param corpbasicid
	 */
	public String corpInfoTree(String parentId, String corpbasicid) ;
	public int deleteChildNodeBdgCorpInfo(String corpid) throws SQLException, BusinessException;
	/**   
	 * @description建设法人管理获得概算树
	 * @author Xiaos
	 * @param parentId
	 * @return sbf
	 */
	public String getCorpBudgetTree(String parentId, String basicid) throws BusinessException;
	/**
	 * @description 保存选择的树
	 * @author Xiaos
	 * @param corpbasicid
	 * @param ids
	 */
	public void saveGetBudgetTree(String corpbasicid, String[] ids);
	
	/**
	 * @description 建设法人概算金额统计(编辑时)
	 * @author Xiaos
	 * @param parentId
	 * @param basicid
	 * @throws SQLException, BusinessException
	 */
	public void sumBdgCorpInfo(String parentId, String basicid) throws SQLException, BusinessException;
	public void sumBdgCorpInfoForDelete(BdgCorpInfo bci) throws SQLException, BusinessException;
	

}
