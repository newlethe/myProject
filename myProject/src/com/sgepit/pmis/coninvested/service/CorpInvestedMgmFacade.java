/**
 * 
 */
package com.sgepit.pmis.coninvested.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;

/**
 * @author pluto
 *
 */
public interface CorpInvestedMgmFacade{
	
	/*
	 * 删除验证
	 */
	String checkDelete(String[] equids)throws SQLException, BusinessException;
	public String CreatedBdgCorpTree(String parentId,String corpbasicid);
	/*
	 * 
	 * 初始华概算树数据,并将选中数据保存到表中
	 */
	public void CreatedBdgCorpTree(String corpbasicid,String[] ids);
	
	


}
