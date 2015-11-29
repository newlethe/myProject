/**
 * Central China Technology Development of Electric Power Company LTD.
 * com.sgepit.lab.ocean.sysman.service.FileManagementService.java
 * @author: Shirley
 * @version: 2009
 *
 *
 */

package com.sgepit.frame.sysman.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.sysman.hbm.SgccAttachList;

/**
 * {class description}
 * @author Shirley
 * @createDate Mar 26, 2009
 **/
public interface FileManagementService {

	/**
	  * 根据条件查询attach_list
	  * @param propertyType
	  * @param fileType
	  * @param filePK
	  * @return
	  * @throws SQLException
	  * @throws BusinessException
	  **/
	public List getAttachList(String propertyType,String fileType,String filePK) throws SQLException,BusinessException;
	/**
	  * 根据条件获得attachList，转化成字符串
	  * @param propertyType
	  * @param fileType
	  * @param filePK
	  * @return
	  * @throws SQLException
	  * @throws BusinessException
	  **/
	public String getAttachListToString(String propertyType,String fileType,String filePK) throws SQLException,BusinessException;
	
	/**
	  * 根据多个流水号删除附件,仅删除sgcc_attach_list
	  * @param fileLshs
	  * @return
	  **/
	public boolean deleteAttach(String fileLshs,String indexDir);
	/**
	  * 根据多个流水号删除附件
	  * @param fileLshs
	  * @return
	  **/
	public boolean deleteAttachList(String fileLshs,String indexDir);	

	
	/**
	  * 根据单个对象AttachBlob
	  * @param SgccAttachList: attach
	  * @return
	  **/
	public boolean deleteAttachBlob(SgccAttachList attach);
	
	
	/**
	  * 根据条件获得文件信息
	  * @param filePK
	  * @param fileDept
	  * @return
	  **/
	public List getFileInfo(String filePK,String fileDept);
	
	/**
	  * 根据条件获得文件信息字符串
	  * @param filePK
	  * @param fileDept
	  * @return
	  **/
	public String getFileInfoString(String filePK,String fileDept);
	
	public String getBulletinInfo(String unitID,String filterSql,int p_pages,int p_size);
	public boolean deleteBulletinInfo(String searchCode);
	/*
	 * 获取atttachList的信息
	 */
	public List<SgccAttachList> geAttachListByWhere(String whereStr, Integer start, Integer limit);
}
