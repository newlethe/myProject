package com.sgepit.frame.sysman.service;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.hbm.AppTemplate;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.frame.util.DateUtil;

/**
 * 公用模块业务逻辑实现类.
 * 
 * @author xjdawu
 * @since 2007.12.20
 */
public class ApplicationMgmImpl extends BaseMgmImpl implements
		ApplicationMgmFacade {

	private BaseDAO baseDao;

	public static ApplicationMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ApplicationMgmImpl) ctx.getBean("applicationMgm");
	}

	public void setBaseDao(BaseDAO baseDao) {
		this.baseDao = baseDao;
	}
	
	/**
	 * 根据合同分类一，查找分类一下所有的子分类
	 * @param firstSortCode
	 * @return
	 */
	public List<PropertyCode> getCodeValueForContractSort(String firstSortCode){
		List<PropertyCode> list = new ArrayList<PropertyCode>();
		PropertyType cat = (PropertyType) this.baseDao.findBeanByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_TYPECATAGORY),"typeName", "合同划分类型");
		if(cat != null){
			list = this.baseDao.findByWhere(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_CODECATAGORY), "type_name = '"+cat.getUids()+"' and property_code = '"+firstSortCode+"'");
			if(list.size()==1){
				PropertyCode code = list.get(0);
				list = this.getCodeValue(code.getPropertyName());
			}
		}		
		return list;
	}
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.ApplicationMgmFacade#getCodeValue(java.lang.String)
	 */
	public List<PropertyCode> getCodeValue(String catagory) {
		List<PropertyCode> list = new ArrayList<PropertyCode>();
		PropertyType cat = (PropertyType) this.baseDao.findBeanByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_TYPECATAGORY),"typeName", catagory);
		if (cat != null) {
			list = this.baseDao.findByProperty(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_CODECATAGORY), "typeName", cat.getUids(), "itemId");
		}
		return list;
	}

	

	/**
	 * 获取表的字段名称和字段注释组成的集合
	 * 
	 * @param table
	 *            表名
	 * @return
	 */
	public List getTableLable(String table) {
		List list = new ArrayList();
		String sql = "select column_name,comments from user_col_comments where table_name = '"
				+ table.toUpperCase() + "' order by comments";
		/*try {
			JdbcTemplate jdbc = Constant.getJdbcTemplate();
			list = jdbc.queryForList(sql);
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		return list;
	}

	/*
	 * (non-Javadoc)
	 * @see com.sgepit.frame.sysman.service.ApplicationMgmFacade#getCodeValueArrStr(java.lang.String)
	 */
	public String getCodeValueArrStr(String catagory) {
		List<PropertyCode> temp = getCodeValue(catagory);
		StringBuffer sbf = new StringBuffer("[");
		for(int i=0; i<temp.size(); i++){
			PropertyCode obj = (PropertyCode)temp.get(i);
			sbf.append("['"+obj.getPropertyCode()+"', ");
			sbf.append("'"+obj.getPropertyName()+"']");
			if (i<temp.size()-1)
				sbf.append(",");
		}
		sbf.append("]");
		return sbf.toString();
	}

	
	public String updateFile(String blobid, FileItem item) throws Exception{
		return updateFile(blobid,null,item);
	}
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hdkj.webpmis.domain.business.BaseMgmFacade#updateFile(java.lang.String,
	 *      org.apache.commons.fileupload.FileItem)
	 */
	public String updateFile(String blobid,String businessid, FileItem item)
			throws Exception {
		AppFileinfo obj = blobid == null ? null : (AppFileinfo) this.baseDao
				.findById(AppFileinfo.class.getName(), blobid);
		String str = blobid;
		Long size = new Long(item.getSize());
		String filename = item.getName().split("\\\\")[item.getName().split(
				"\\\\").length - 1];
		String compressed = "zip,rar,gz".indexOf(filename.substring(
				filename.lastIndexOf(".") + 1).toLowerCase()) > -1 ? "1" : "0";
		if (obj != null) {
			obj.setFilename(filename);
			obj.setFilesource(Constant.FILESOURCE);
			obj.setMimetype(item.getContentType());
			obj.setCompressed(compressed);
			obj.setFiledate(DateUtil.getSystemDateTime());
			obj.setFilesize(size);
			obj.setBusinessid(businessid);
			this.baseDao.saveOrUpdate(obj);
		} else {
			AppFileinfo fileinfo = new AppFileinfo(filename,
					Constant.FILESOURCE, item.getContentType(), compressed,
					DateUtil.getSystemDateTime(), size,businessid);
			str = this.baseDao.insert(fileinfo); 
		}

		try {
			InputStream is = item.getInputStream();
			if (Constant.FILESOURCE.equals("ftp")) {
				if (is != null) {
					// FtpUtil.ftpPut(is, hbm.getFileLsh());
				}
			} else if (Constant.FILESOURCE.equals("database")) {
				if (is != null) {
					this.baseDao.updateBlob(str, is, size.intValue(),
							(obj == null));
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new BusinessException(ex.getMessage());
		}
		return str;
	}
	/*
	 * (non-Javadoc)
	 * @see com.hdkj.webpmis.domain.business.ApplicationMgmFacade#getFileInputStream(com.hdkj.webpmis.domain.application.AppFileinfo)
	 */
	public InputStream getFileInputStream(AppFileinfo fileinfo) throws BusinessException {
		InputStream in = null;
		String fileid = fileinfo.getFileid();
		String filesource = fileinfo.getFilesource();
		String compressed = fileinfo.getCompressed();
		try {
			if (filesource.equalsIgnoreCase("database"))
				in = this.baseDao.getBlobInputStream(fileid, compressed);
			if (filesource.equalsIgnoreCase("ftp"))
				in = this.baseDao.getFtpInputStream(fileid, compressed);
		} catch (Exception ex) {
			throw new BusinessException(ex.getMessage());
		}
		return in;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hdkj.webpmis.domain.business.ApplicationMgmFacade#getFileInputStream(com.hdkj.webpmis.domain.application.AppFileinfo)
	 */
	public AppFileinfo getFile(String fileid) throws BusinessException {
		AppFileinfo file = (AppFileinfo) this.baseDao.findById(AppFileinfo.class.getName(), fileid);
		return file;
	}
	
	public List<AppFileinfo> getFiles(String businessid){
		return this.baseDao.findByProperty(AppFileinfo.class.getName(), "businessid", businessid);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hdkj.webpmis.domain.business.ApplicationMgmFacade#deleteFile(com.hdkj.webpmis.domain.application.AppFileinfo)
	 */
	public void deleteFile(String fileinfoId) throws BusinessException {
		try {
			AppFileinfo fileinfo = (AppFileinfo)this.baseDao.findById(AppFileinfo.class.getName(), fileinfoId);
			String fileid = fileinfo.getFileid();
			String filesource = fileinfo.getFilesource();
			if (filesource.equalsIgnoreCase("database")) {
				this.baseDao.deleteFileInBlob(fileid);
			}
			if (filesource.equalsIgnoreCase("ftp")) {
				this.baseDao.deleteFileOnFtp(fileid);
			}
			this.baseDao.delete(fileinfo);
		} catch (Exception ex) {
			throw new BusinessException(ex.getMessage());
		}
	}
	
	public void deleteFile(AppFileinfo fileinfo) throws BusinessException {
		try {
			String fileid = fileinfo.getFileid();
			String filesource = fileinfo.getFilesource();
			if (filesource.equalsIgnoreCase("database")) {
				this.baseDao.deleteFileInBlob(fileid);
			}
			if (filesource.equalsIgnoreCase("ftp")) {
				this.baseDao.deleteFileOnFtp(fileid);
			}
			this.baseDao.delete(fileinfo);
		} catch (Exception ex) {
			throw new BusinessException(ex.getMessage());
		}
	}

	public InputStream getTemplate(String templateCode) {
		AppTemplate template = (AppTemplate)this.baseDao.findBeanByProperty(AppTemplate.class.getName(), "templatecode", templateCode);
		String fileid = template.getFileid();
		InputStream is = null;
		try {
			is = this.baseDao.getBlobInputStream(fileid, "0");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return is;
	}	

}

	
