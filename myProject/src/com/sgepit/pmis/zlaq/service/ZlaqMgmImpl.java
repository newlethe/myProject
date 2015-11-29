package com.sgepit.pmis.zlaq.service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.springframework.beans.BeanUtils;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.service.BusinessConstants;
import com.sgepit.frame.util.UUIDGenerator;
import com.sgepit.pmis.zlaq.dao.ZlaqFileDAO;
import com.sgepit.pmis.zlaq.dao.ZlaqFilemodelDAO;
import com.sgepit.pmis.zlaq.dao.ZlaqTreeDAO;
import com.sgepit.pmis.zlaq.hbm.ZlaqFile;
import com.sgepit.pmis.zlaq.hbm.ZlaqFilemodel;

/**
 * 系统管理业务逻辑实现类.
 * 
 * @author xjdawu
 * @since 2007.11.21
 */
/**
 * @author Administrator
 *
 */
public class ZlaqMgmImpl extends BaseMgmImpl implements ZlaqMgmFacade {

	private ZlaqTreeDAO zlaqTreeDAO;

	private ZlaqFileDAO zlaqFileDAO;
	
	private ZlaqFilemodelDAO zlaqFilemodelDAO;
	
	private SgccAttachListDAO sgccAttachListDAO;
	

	public ZlaqTreeDAO getZlaqTreeDAO() {
		return zlaqTreeDAO;
	}

	public void setZlaqTreeDAO(ZlaqTreeDAO zlaqTreeDAO) {
		this.zlaqTreeDAO = zlaqTreeDAO;
	}

	public ZlaqFileDAO getZlaqFileDAO() {
		return zlaqFileDAO;
	}

	public void setZlaqFileDAO(ZlaqFileDAO zlaqFileDAO) {
		this.zlaqFileDAO = zlaqFileDAO;
	}

	public ZlaqFilemodelDAO getZlaqFilemodelDAO() {
		return zlaqFilemodelDAO;
	}

	public void setZlaqFilemodelDAO(ZlaqFilemodelDAO zlaqFilemodelDAO) {
		this.zlaqFilemodelDAO = zlaqFilemodelDAO;
	}

	public SgccAttachListDAO getSgccAttachListDAO() {
		return sgccAttachListDAO;
	}

	public void setSgccAttachListDAO(SgccAttachListDAO sgccAttachListDAO) {
		this.sgccAttachListDAO = sgccAttachListDAO;
	}

	//-------------------------------------------------------------------------------------
	public boolean insertFile(ZlaqFile transientInstance) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			zlaqFileDAO.save(transientInstance);
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}
	
	public boolean updateFile(ZlaqFile transientInstance) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			zlaqFileDAO.saveOrUpdate(transientInstance);
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}

	public boolean deleteFile(ZlaqFile persistentInstance) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			String fileLsh = persistentInstance.getFileLsh();
			List<SgccAttachList> attachList = sgccAttachListDAO.findByWhere("com.sgepit.lab.ocean.sysman.hbm.SgccAttachList"," file_lsh = '" + fileLsh + "'");
			if(attachList != null && attachList.size() > 0){
				String blobTable = attachList.get(0).getBlobTable();
				if(blobTable == null && blobTable.trim().equals("")){
					blobTable = "system_longdata";
				}
				if(blobTable.equalsIgnoreCase("sgcc_attach_blob")){
//					sgccAttachBlobDAO.deleteByPK(fileLsh);
				}else if(blobTable.equalsIgnoreCase("system_longdata")){
//					systemLongdataDAO.deleteByPK(fileLsh);
				}
				
				sgccAttachListDAO.delete(attachList.get(0));
			}
			zlaqFileDAO.delete(persistentInstance);
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}
	
	public boolean insertFileIDS(String fileLshIds,String type,String author,String modelid) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			String[] fileLshArr = fileLshIds.split(",");
			for(int i = 0; i < fileLshArr.length; i++){
				String fileLsh = fileLshArr[i];
				List<SgccAttachList> attachList = sgccAttachListDAO.findByWhere("com.sgepit.lab.ocean.sysman.hbm.SgccAttachList"," file_lsh = '" + fileLsh + "'");
				if(attachList != null && attachList.size() > 0){
					String fileName = attachList.get(0).getFileName();
					String name = null;
					if(fileName != null && fileName.indexOf(".")>0)
						name = fileName.substring(0, fileName.indexOf("."));
					else
						name = fileName;
					String isComp = attachList.get(0).getIsCompress();
					Long isCompress = new Long(isComp == null && isComp.trim().equals("")? "0" : isComp);
					
					ZlaqFile hbm = new ZlaqFile(UUIDGenerator.getNewID(),type,fileLsh,fileName,isCompress);
					if(modelid != null && !modelid.equals(""))
						hbm.setModelid(modelid);
					hbm.setName(name);
					hbm.setAuthor(author);
					hbm.setVersion(new Long("1"));
					hbm.setBillState("0");
					hbm.setMemod1(attachList.get(0).getUploadDate());
					
					zlaqFileDAO.save(hbm);
				}
			}
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}
	
	public boolean insertFilemodel(ZlaqFilemodel transientInstance) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			zlaqFilemodelDAO.save(transientInstance);
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}
	
	public boolean updateFilemodel(ZlaqFilemodel transientInstance) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			zlaqFilemodelDAO.saveOrUpdate(transientInstance);
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}
	
	public boolean deleteFilemodel(ZlaqFilemodel persistentInstance) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			String fileLsh = persistentInstance.getFileLsh();
			List<SgccAttachList> attachList = sgccAttachListDAO.findByWhere("com.sgepit.lab.ocean.sysman.hbm.SgccAttachList"," file_lsh = '" + fileLsh + "'");
			if(attachList != null && attachList.size() > 0){
				String blobTable = attachList.get(0).getBlobTable();
				if(blobTable == null && blobTable.trim().equals("")){
					blobTable = "system_longdata";
				}
				if(blobTable.equalsIgnoreCase("sgcc_attach_blob")){
					//sgccAttachBlobDAO.deleteByPK(fileLsh);
				}else if(blobTable.equalsIgnoreCase("system_longdata")){
					//systemLongdataDAO.deleteByPK(fileLsh);
				}
				
				sgccAttachListDAO.delete(attachList.get(0));
			}
			zlaqFilemodelDAO.delete(persistentInstance);
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}

	public boolean insertFilemodelIDS(String fileLshIds,String type,String author) throws BusinessException {
		// TODO Auto-generated method stub
		boolean rtn = true;
		try{
			String[] fileLshArr = fileLshIds.split(",");
			for(int i = 0; i < fileLshArr.length; i++){
				String fileLsh = fileLshArr[i];
				List<SgccAttachList> attachList = sgccAttachListDAO.findByWhere("com.sgepit.lab.ocean.sysman.hbm.SgccAttachList"," file_lsh = '" + fileLsh + "'");
				if(attachList != null && attachList.size() > 0){
					String fileName = attachList.get(0).getFileName();
					String name = null;
					if(fileName != null && fileName.indexOf(".")>0)
						name = fileName.substring(0, fileName.indexOf("."));
					else
						name = fileName;
					String isComp = attachList.get(0).getIsCompress();
					Long isCompress = new Long(isComp == null && isComp.trim().equals("")? "0" : isComp);
					
					ZlaqFilemodel hbm = new ZlaqFilemodel(UUIDGenerator.getNewID(),type,fileLsh,fileName,isCompress);
					hbm.setName(name);
					hbm.setAuthor(author);
					hbm.setVersion(new Long("1"));
					hbm.setBillState("0");
					hbm.setMemod1(attachList.get(0).getUploadDate());
					
					zlaqFilemodelDAO.save(hbm);
				}
			}
		}catch(Exception e){
			rtn = false;
			throw new BusinessException(e.getMessage());
		}
		return rtn;
	}
	
	public boolean saveObject(Object obj, String className) {
		// TODO Auto-generated method stub
		return false;
	}
	
}
