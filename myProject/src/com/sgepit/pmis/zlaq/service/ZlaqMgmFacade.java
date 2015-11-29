package com.sgepit.pmis.zlaq.service;

import java.sql.SQLException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.zlaq.hbm.*;

/**
 * 系统管理业务逻辑接口.
 * 
 * @author xjdawu
 * @since 2007.11.21
 */
public interface ZlaqMgmFacade {
	

	/**
	 * 新增模块
	 * 
	 * @param ZlaqFile
	 * @throws BusinessException
	 */
	boolean insertFile(ZlaqFile transientInstance) throws BusinessException;

	/**
	 * 更新模块
	 * 
	 * @param ZlaqFile
	 * @throws BusinessException
	 */
	boolean updateFile(ZlaqFile transientInstance) throws BusinessException;

	/**
	 * 删除模块
	 * 
	 * @param ZlaqFile
	 * @throws BusinessException
	 */
	boolean deleteFile(ZlaqFile persistentInstance) throws BusinessException;

	/**
	 * 新增文件列表
	 * 
	 * @param fileLshIds
	 * @param type
	 * @param modelid
	 * @param author
	 * @throws BusinessException
	 */
	boolean insertFileIDS(String fileLshIds,String type,String author,String modelid) 
		throws BusinessException;
	
	/**
	 * 新增模块
	 * 
	 * @param ZlaqFilemodel
	 * @throws BusinessException
	 */
	boolean insertFilemodel(ZlaqFilemodel transientInstance) throws BusinessException;
	
	/**
	 * 更新模块
	 * 
	 * @param ZlaqFile
	 * @throws BusinessException
	 */
	boolean updateFilemodel(ZlaqFilemodel transientInstance) throws BusinessException;
	
	/**
	 * 删除模块
	 * 
	 * @param ZlaqFilemodel
	 * @throws BusinessException
	 */
	boolean deleteFilemodel(ZlaqFilemodel persistentInstance) throws BusinessException;
	
	/**
	 * 新增文件模块列表
	 * 
	 * @param fileLshIds
	 * @param type
	 * @param modelid
	 * @param author
	 * @throws BusinessException
	 */
	boolean insertFilemodelIDS(String fileLshIds,String type,String author) 
		throws BusinessException;
	
	boolean saveObject(Object obj,String className);

}
