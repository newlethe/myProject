/**
 * Central China Technology Development of Electric Power Company LTD.
 * com.sgepit.frame.sysman.service.FileManagementServiceImpl.java
 * @author: Shirley
 * @version: 2009
 *
 *
 */

package com.sgepit.frame.sysman.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.frame.util.db.Db2Json;
//import com.sgepit.frame.luceneSearch.LuceneMgm;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccBulletinSearchitem;

/**
 * {class description}
 * @author Shirley
 * @createDate Mar 26, 2009
 **/
public class FileManagementServiceImpl extends BaseMgmImpl implements
		FileManagementService {
	SystemDao systemDao;

	/**
	 * @param systemDao the systemDao to set
	 */
	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}
	
	/**
	  * 根据条件获得attachlist
	  * @param propertyType
	  * @param fileType
	  * @param filePK
	  * @return
	  * @throws SQLException
	  * @throws BusinessException
	  **/
	public List getAttachList(String propertyType,String fileType,String filePK) throws SQLException,BusinessException{
		String sql = "select file_lsh,file_name,tab1.unitname,template_id,tab1.unitid from sgcc_attach_list,"
			+ "(select property_code as unitid, property_name as unitname "
			+ "from property_code c,property_type t "
			+ "where t.type_name = '"+propertyType+"' and c.type_name=t.uids "
			+ "order by property_code)tab1 "
			+ "where sgcc_attach_list.file_type=tab1.unitid(+) and transaction_id='" + filePK + "'";
		if(!fileType.equals("")){
			sql +=  "and transaction_type='"+ fileType + "'";
		}
		return systemDao.getDataAutoCloseSes(sql);
	}
	
	/**
	  * 根据条件获得attachList，转化成字符串
	  * @param propertyType
	  * @param fileType
	  * @param filePK
	  * @return
	  * @throws SQLException
	  * @throws BusinessException
	  **/
	public String getAttachListToString(String propertyType,String fileType,String filePK) throws SQLException,BusinessException{
		List list = getAttachList(propertyType, fileType, filePK);
		String nodeStr = "[";
		for(int i=0;i<list.size();i++){
			Object[] obj = (Object[])list.get(i);
			String file_lsh = obj[0]==null?"":(String)obj[0];	
			String file_name = obj[1]==null?"":(String)obj[1];
			String unitname = obj[2]==null?"":(String)obj[2];
			String template_id = obj[3]==null?"":(String)obj[3];
			String unitid = obj[4]==null?"":(String)obj[4];
			nodeStr += "{file_lsh:'" + file_lsh+"'"
							+ ",file_name:'" + file_name + "'"
							+ ",unitname:'" + unitname+"'"
							+ ",template_id:'" + template_id + "'"
							+ ",unitid:'"+unitid+"'}";
			if(i<list.size()-1){
				nodeStr+=",";
			}
					
		}
		return nodeStr+"]";
	}
	/**
	  * 根据多个流水号删除附件,仅删除sgcc_attach_list
	  * @param fileLshs
	  * @return
	  **/
	public boolean deleteAttach(String fileLshs,String indexDir){
		try{			
			List<SgccAttachList> attachList = this.systemDao.findByWhere("com.sgepit.frame.sysman.hbm.SgccAttachList","file_Lsh in("+fileLshs+")");
			this.systemDao.deleteAll(attachList);
/*			if(indexDir != null && !indexDir.equals("")){
				LuceneMgm luceneMgm= new LuceneMgm();
				for (int i=0;i<attachList.size();i++){
					luceneMgm.delIndex(attachList.get(i).getId().getFileLsh(),indexDir);
				}		
			}*/
		}catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	  * 根据多个流水号删除附件(删除list 和blob)
	  * @param fileLshs
	  * @return
	  **/
	public boolean deleteAttachList(String fileLshs,String indexDir){
		try{			
			List<SgccAttachList> attachList = this.systemDao.findByWhere("com.sgepit.frame.sysman.hbm.SgccAttachList","file_Lsh in("+fileLshs+")");
			SgccAttachList attach = null;			
			for (int i = 0; i < attachList.size(); i++) {
				attach = (SgccAttachList)attachList.get(i);
				deleteAttachBlob(attach);
			}
			this.systemDao.deleteAll(attachList);
/*			if(indexDir != null && !indexDir.equals("")){
				LuceneMgm luceneMgm= new LuceneMgm();
				for (int i=0;i<attachList.size();i++){
					luceneMgm.delIndex(attachList.get(i).getId().getFileLsh(),indexDir);
				}		
			}*/
		}catch (Exception e) {
			return false;
		}
		return true;
	}	
	
	public boolean deleteAttachBlob(SgccAttachList attach){
		try{		
			if(attach != null){
				if(attach.getFileSource()!=null&&attach.getFileSource().equals("ftp")){
					this.systemDao.deleteFileOnFtp(attach.getId().getFileLsh(), attach.getId().getTransactionType());
				}else{
					String blobTable = (attach.getBlobTable()==null? "sgcc_attach_blob":attach.getBlobTable().toLowerCase());					
					if(blobTable.equals("system_longdata")){		
						Object blob = systemDao.findById("com.sgepit.frame.sysman.hbm.SystemLongdata", attach.getId().getFileLsh());
						if(blob != null){
							this.systemDao.delete(blob);
						}						
					} else if(blobTable.equals("app_blob")){
						this.systemDao.deleteFileInBlob(attach.getId().getFileLsh());						
					} else{
						Object blob = systemDao.findById("com.sgepit.frame.sysman.hbm.SgccAttachBlob", attach.getId().getFileLsh());
						if(blob != null){
							this.systemDao.delete(blob);
						}
					}										
				}
			}
		}catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	  * 根据条件获得文件信息
	  * @param filePK
	  * @param fileDept
	  * @return
	  **/
	public List getFileInfo(String filePK,String fileDept){
		String sql = "select file_lsh,decode(unitName,null,'','['||unitName||']')||file_name from sgcc_attach_list,sgcc_ini_unit"
			+ " where sgcc_attach_list.dept_id=sgcc_ini_unit.unitID(+)"
			+ " and (NLS_LOWER(file_name) like '%.doc%' or NLS_LOWER(file_name) like '%.xls%')"
			+ " and TRANSACTION_ID='" + filePK + "'";
		if(fileDept!=null&&fileDept.length()>0){
			sql += " and dept_id='" + fileDept + "'";
		}
		sql += " order by unitName";
		
		return systemDao.getDataAutoCloseSes(sql);
	}
	
	/**
	  * 根据条件获得文件信息字符串
	  * @param filePK
	  * @param fileDept
	  * @return
	  **/
	public String getFileInfoString(String filePK,String fileDept){
		List list = getFileInfo(filePK, fileDept);
		return JSONUtil.formObjectsToJSONStr(list);
	}
	
	
	public String getBulletinInfo(String unitID,String filterSql,int p_pages,int p_size){
		String sql = "select search_code,search_name,col_id,guideline_id,search_time,unitid,col_digit,col_zoom"
			+ " from sgcc_bulletin_searchitem t where exists (select 1 from sgcc_guideline_info where zb_seqno=t.guideline_id and (ifpub<>'3' or unit_id='" + unitID + "'))" + (filterSql==null?"":(" and " + filterSql)) + " order by search_code desc";
		Db2Json json = new Db2Json();
		String[] bulletin = json.selectPageData(sql, p_pages, p_size);
		String bulletinStr = "";
		for(int i=0;i<bulletin.length;i++){
			bulletinStr+= bulletin[i];
			if(i<bulletin.length-1){
				bulletinStr += "`";
			}
		}
		return bulletinStr;
	}
	
	public boolean deleteBulletinInfo(String searchCode){
		try{
			SgccBulletinSearchitem searchItem = (SgccBulletinSearchitem)systemDao.findBeanByProperty("com.sgepit.frame.sysman.hbm.SgccBulletinSearchitem", "id.searchCode",searchCode);
			systemDao.delete(searchItem);
		}catch (Exception e) {
			return false;
		}
		
		return true;
	}	
	/*
	 * 获取atttachList的信息
	 */
	public List<SgccAttachList> geAttachListByWhere(String whereStr, Integer start, Integer limit){
		List<SgccAttachList> listAttach =this.systemDao.findByWhere("com.sgepit.frame.sysman.hbm.SgccAttachList", whereStr, "uploadDate desc" ,start,limit);
		return listAttach;
		
	}
	
}
