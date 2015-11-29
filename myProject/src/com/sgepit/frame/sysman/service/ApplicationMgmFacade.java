package com.sgepit.frame.sysman.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.commons.fileupload.FileItem;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.hbm.PropertyCode;

/**
 * 公用模块业务逻辑接口.
 *
 * @author xjdawu
 * @since 2007.12.20
 */
public interface ApplicationMgmFacade {
	public List<PropertyCode> getCodeValueForContractSort(String firstSortCode);
	/**
	 * 根据指定的分类名称，获取自定义属性数据集合
	 * @param catagory 分类名称
	 * @return
	 */
	List<PropertyCode> getCodeValue(String catagory);
	
	/**
	 * 根据指定的分类名称，获取自定义属性数据集合表示的字符串,用于客户端Ext下拉框组件
	 * @param catagory 分类名称
	 * @return
	 */
	String getCodeValueArrStr(String catagory);
		
	
	/**
	 * 获得表栏位名称和对应中文名称
	 * @param table
	 * @return
	 */
	List getTableLable(String table);
	
	/**
	 * 更新上传文件
	 * @param blobid
	 * @param item
	 * @return
	 * @throws Exception
	 */
	public String updateFile(String blobid, FileItem item) throws Exception;
	/**
	 * 更新上传文件
	 * @param blobid
	 * @param businessid
	 * @param item
	 * @return
	 * @throws Exception
	 */
	public String updateFile(String blobid,String businessid, FileItem item) throws Exception;
	/**
	 * 获取文件二进制流
	 * @param fileinfo
	 * @return
	 * @throws BusinessException
	 */
	public InputStream getFileInputStream(AppFileinfo fileinfo) throws BusinessException;
	/**
	 * 获取文件信息对象
	 * @param fileid
	 * @return
	 * @throws BusinessException
	 */
	public AppFileinfo getFile(String fileid) throws BusinessException;
	/**
	 * 获取业务对象对应的所有文件
	 * @param businessid
	 * @return
	 * @throws BusinessException
	 */
	public List<AppFileinfo> getFiles(String businessid) throws BusinessException;
	/**
	 * 删除某个文件的文件信息
	 * @param fileinfo
	 * @throws BusinessException
	 */
	public void deleteFile(AppFileinfo fileinfo) throws BusinessException;
	/**
	 * 删除某个文件的文件信息
	 * @param fileinfoId
	 * @throws BusinessException
	 */
	public void deleteFile(String fileinfoId) throws BusinessException;

	/**
	 * 获取Office文档模板对象对应文档的二进制流
	 * @param templateCode
	 * @return
	 */
	InputStream getTemplate(String templateCode);

}
