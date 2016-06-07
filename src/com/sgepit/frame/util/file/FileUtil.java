/**
 * 
 */
package com.sgepit.frame.util.file;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.List;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.enterprisedt.net.ftp.FTPException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.service.FileManagementService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.FtpUtil;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.db.SnUtil;

/**
 * @author Shirley
 *
 */
public class FileUtil {
	
	
	public String fileUpload(HttpServletRequest request, HttpServletResponse response)throws Exception, ServletException{
		String rtnval = "";
		//文档类型
		String type = request.getParameter("type")==null?"":request.getParameter("type");
		//主键值
		String pk = request.getParameter("pk")==null?"":request.getParameter("pk");
		//文件ID
		String fileid = request.getParameter("fileid")==null?"":request.getParameter("fileid");
		//模板ID
		String tmpid = request.getParameter("tmpid")==null?"":request.getParameter("tmpid");
		//
		String dept = request.getParameter("dept")==null?"":request.getParameter("dept");
		//
		String upper = request.getParameter("upper")==null?"":request.getParameter("upper");

		upper = new String(upper.getBytes("iso-8859-1"),"utf-8"); 
		//是否压缩
		String compress = request.getParameter("compress")==null?"1":request.getParameter("compress");
		//ftp/blob
		String fileSource = request.getParameter("filesource")==null?"blob":request.getParameter("filesource");
		//大对象表名(默认是sgcc_attach_blob)
		String tableName = request.getParameter("tableName")==null?"sgcc_attach_blob":request.getParameter("tableName");
		//如果传入的filesource 为ftp则，将tableName设置为""
		if(fileSource.equals("ftp")){
			tableName = "";
		}
		
		HttpSession session = request.getSession();
		String userID = (String)session.getAttribute(Constant.USERID);
		String unitID = (String)session.getAttribute(Constant.USERUNITID);
		if(dept.equals("")){
			dept = (String)session.getAttribute(Constant.USERPOSID);
		}
		//String orgID = (String)session.getAttribute(Constant.ORGID);
		
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		if(isMultipart) {
			ServletFileUpload upload = getUpload();
			List items = upload.parseRequest(request);			
			rtnval = fileUpload(items, type, pk, fileid, tmpid, userID, unitID, dept, upper, compress, fileSource, tableName);
		}
		return rtnval;
	}
		
	/**
	 * 文件上传
	 * @param items 文件对象
	 * @param type 业务类型
	 * @param pk 业务id
	 * @param fileid 文件id
	 * @param tmpid 模板id
	 * @param userID 
	 * @param unitID
	 * @param dept
	 * @param upper 文档类型（比如 报告类型）
	 * @param compress 是否压缩
	 * @param fileSource 上传方式（ftp/blob）
	 * @param tableName 大对象表名
	 * @throws Exception
	 * @throws ServletException
	 * @author Shirley 
	 * @createTime 2010-1-12 下午05:49:08
	 */
	public String fileUpload(List items,String type,String pk,String fileid,String tmpid ,String userID,String unitID,String dept,String upper,String compress,String fileSource,String tableName)throws Exception, ServletException{
		
		//解决文件名乱码问题
		Iterator iter = items.iterator();
		while (iter.hasNext()) {
			FileItem item = (FileItem) iter.next();
			
			if (!item.isFormField() && item.getSize()>0 ) {
				if(fileid == null || fileid.equals("")) {
					//新增
					fileid = this.insert(item, type, pk, userID, unitID, dept, upper, tmpid, compress, fileSource, tableName);
				}else {
					//编辑
					fileid = this.update(item, fileid, type, pk, userID, upper, compress, fileSource, tableName);
				}
			}
		}
		return fileid;
	}	
	
	public String fileBlobUpload(HttpServletRequest request,List items,String pk, String fileId,String fileSource,String compress,String transType)throws Exception{
		return fileBlobUploadBytable(request,items, pk, fileId, fileSource, compress, transType, "sgcc_attach_blob");
	}
	/**
	 * 文件上传（只针对大对象表,需要传tableName）
	 * @param items ：文件对象
	 * @param fileId ：文件id
	 * @param fileSource : ftp/blob
	 * @param compress : 是否压缩
	 * @param transType :业务类型
	 * @param tableName : 大对象表名
	 * @return
	 * @author Shirley 
	 * @createTime 2010-1-11 下午02:45:28
	 */
	public String fileBlobUploadBytable(HttpServletRequest request,List items,String pk, String fileId,String fileSource,String compress,String transType,String tableName)throws Exception{
		HttpSession session = request.getSession();
		String userID = (String)session.getAttribute(Constant.USERID);
		String unitID = (String)session.getAttribute(Constant.USERUNITID);
		String dept = (String)session.getAttribute(Constant.USERPOSID);
		return fileUpload(items,transType, pk, fileId, "", userID,unitID,dept,"",compress,fileSource,tableName);
		//fileUpload(List items,String type,String pk,String fileid,String tmpid ,String userID,String unitID,String dept,String upper,String compress,String fileSource,String tableName)throws Exception, ServletException{

	}
	
	public String insertAttach(FileItem p_item, String p_type, String p_pk, String p_compress,String p_filesource,String p_tableName, 
			String p_user, String p_unit, String p_dept)
	throws Exception{
		return this.insert(p_item, p_type, p_pk, p_user, p_unit, p_dept, "", "", p_compress, p_filesource, p_tableName);
	}
	public String updateAttach(FileItem p_item, String p_fileID,
			String p_type, String p_pk, 
			String p_compress,String p_filesource, String p_tableName) throws Exception{
		return this.update(p_item, p_fileID, p_type, p_pk, "", "", p_compress, p_filesource, p_tableName);
	}
	/**
	 * 新增文档
	 * @param p_item
	 * @param p_type 业务类型
	 * @param p_pk 业务id
	 * @param p_user 
	 * @param p_unit
	 * @param p_dept
	 * @param p_upper 文档类型（比如报告类型）
	 * @param p_tmpID 模板id
	 * @param p_compress 是否压缩
	 * @param p_filesource 上传方式（ftp/blob）
	 * @param p_tableName 大对象表名
	 * @return
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:55:14
	 */
	private String insert(FileItem p_item, String p_type, String p_pk, 
			String p_user, String p_unit, String p_dept, String p_upper, String p_tmpID, String p_compress,String p_filesource,String p_tableName)
	throws Exception{
		Context initCtx = new InitialContext();
		DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
		Connection p_conn = ds.getConnection();
		
		String sn = SnUtil.getNewID();
		String sName = "";
		long fileSize =0;
		
		File f = new File(p_item.getName());
		sName = f.getName();
		if(sName.equals("")){
			sName="newDocument";
		}
		
		if(p_pk.equals("")){
			p_pk  = sn;
		}
		fileSize = p_item.getSize();
//		String fileName = new String(p_item.getName().getBytes("GBK"),"utf-8");
		PreparedStatement pstmt = null;
		insertBlob(p_conn, p_item.getInputStream(), sn, p_compress, p_filesource, p_type, sName, p_tableName);
		
		System.out.println(p_pk);
		if(p_pk != null && !p_pk.equals("") && !p_pk.equals("undefined"))
		{
			pstmt = p_conn.prepareStatement("insert into SGCC_ATTACH_LIST(TRANSACTION_TYPE,TRANSACTION_ID,FILE_LSH,FILE_NAME,"
					+"USERID,UNIT_ID,DEPT_ID,FILE_TYPE,TEMPLATE_ID,UPLOAD_DATE,FILESOURCE,IS_COMPRESS,blob_table,file_size)"
					+" values (?,?,?,?,?,?,?,?,?,sysdate,?,?,?,?)");
			pstmt.setString(1, p_type);
			pstmt.setString(2, p_pk);
			pstmt.setString(3, sn);				
			pstmt.setString(4, sName);
			pstmt.setString(5, p_user);
			pstmt.setString(6, p_unit);
			pstmt.setString(7, p_dept);
			pstmt.setString(8, p_upper);
			pstmt.setString(9, p_tmpID);
			pstmt.setString(10, p_filesource);
			pstmt.setString(11, p_compress);
			pstmt.setString(12, p_tableName);
			pstmt.setLong(13, fileSize);
			
			pstmt.execute();
			pstmt.close();
		}
		
		p_conn.close();
		initCtx.close();
		return sn +  "``"+ sName + "``" + fileSize;
	}
	
	/**
	 * 更新文档
	 * @param p_item 文件对象 
	 * @param p_fileID 文件id
	 * @param p_type  业务类型
	 * @param p_pk 业务id
	 * @param p_user
	 * @param p_upper 文档类型（比如报告类型）
	 * @param p_compress 是否压缩
	 * @param p_filesource 上传方式（ftp/blob）
	 * @param p_tableName 大对象表名
	 * @return
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:55:46
	 */
	private String update(FileItem p_item, String p_fileID, String p_type, String p_pk, String p_user, String p_upper, String p_compress,String p_filesource, String p_tableName) throws Exception{
		Context initCtx = new InitialContext();
		DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
		Connection p_conn = ds.getConnection();
		
		String sn = p_fileID;
		String fileName = "";
		long fileSize=0;
		File f = new File(p_item.getName());
		fileName = f.getName();
		if(fileName.equals("")){
			fileName="newDocument";
		}
		
		fileSize = p_item.getSize();
		
		//String fileName = new String(p_item.getName().getBytes("GBK"),"utf-8");
		PreparedStatement pstmt = null;
		updateBlob(p_conn, p_item.getInputStream(), p_fileID,  p_compress, p_filesource, p_type, fileName, p_tableName);
		
		if(p_pk != null && !p_pk.equals("") && !p_pk.equals("undefined"))
		{
			pstmt = p_conn.prepareStatement("update SGCC_ATTACH_LIST set FILE_NAME=?,USERID=?,FILE_TYPE=?,FILESOURCE=?,"
					+ " BLOB_TABLE=?, FILE_SIZE=? "
					+ " where TRANSACTION_ID='" + p_pk + "' and TRANSACTION_TYPE='" + p_type + "' and FILE_LSH='" + p_fileID + "'");
			pstmt.setString(1, fileName);
			pstmt.setString(2, p_user);
			pstmt.setString(3, p_upper);
			pstmt.setString(4, p_filesource);
			pstmt.setString(5, p_tableName);
			pstmt.setLong(6, fileSize);
			pstmt.execute();
			pstmt.close();
		}
		p_conn.close();
		initCtx.close();
		//return sn + "``" + fileName;
		return sn +  "``"+ fileName + "``" + fileSize;
	}
	
	////************************不保存到sgcc_attach_list表的情况***********************************************************************//
	
	/**
	 * 保存Blob大对象(需要传表名，还要传文件名)
	 * @param p_conn
	 * @param ins
	 * @param fileId 
	 * @param p_compress 是否压缩
	 * @param p_filesource ：ftp/blob
	 * @param p_transType  :业务类型
	 * @param fileName ：文件名(如果是system_longdata表就需要传文件名)
	 * @param tableName ：大对象表名
	 * @return
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-12 下午05:23:39
	 */
	public String insertBlob(Connection p_conn, InputStream ins,String fileId,String p_compress,String p_filesource,String p_transType,String fileName,String tableName) throws Exception {
		
		if(p_transType == null && p_transType.equals("")){
			p_transType = "other";
		}
		if("1".equals(p_compress)){
			insertBlobCompress(p_conn, ins, fileId, p_filesource, p_transType,fileName, tableName);
		}else{
			if(p_filesource.equals("ftp")){
				FtpUtil.ftpPut(ins, fileId , p_transType);
			}else{
				PreparedStatement pstmt = null;
				pstmt = p_conn.prepareStatement(getSql(tableName, "insert"));
				pstmt.setString(1, fileId);
				pstmt.setBytes(2, transInput2Byte(ins));
				if("system_longdata".equals(tableName.toLowerCase())){
					pstmt.setString(3, fileName);
					pstmt.setString(4, p_filesource);
					pstmt.setString(5, p_compress);
				}
				pstmt.execute();
				pstmt.close();
			}
		}
		return fileId;
	}
	
	/**
	 * 保存Blob大对象(需要传表名,还要传文件名)
	 * @param p_conn
	 * @param ins
	 * @param p_fileID
	 * @param p_compress :是否压缩
	 * @param p_filesource ：ftp/blob
	 * @param p_transType ：业务类型
	 * @param tableName ：大对象表名
	 * @return
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-12 下午05:25:13
	 */
	public String updateBlob(Connection p_conn, InputStream ins,String p_fileID,String p_compress,String p_filesource,String p_transType,String p_fileName,String tableName) throws Exception {
		
		if(p_transType == null && p_transType.equals("")){
			p_transType = "other";
		}
		
		if("1".equals(p_compress)){
			updateBlobCompress(p_conn, ins, p_fileID, p_filesource, p_transType, p_fileName, tableName);
		}else{
			if(p_filesource.equals("ftp")){
				FtpUtil.ftpPut(ins, p_fileID, p_transType);
			}else{
				PreparedStatement pstmt = null;
				pstmt = p_conn.prepareStatement(getSql(tableName, "update"));
				pstmt.setBytes(1, transInput2Byte(ins));
				if(tableName.equals("system_longdata")){
					pstmt.setString(2, p_fileName);
					pstmt.setString(3, p_filesource);
					pstmt.setString(4, p_compress);
					pstmt.setString(5, p_fileID);
				}else{
					pstmt.setString(2, p_fileID);
				}
				pstmt.execute();
				pstmt.close();
			}
		}
		return p_fileID;
	}
	
	/**
	 * 保存大对象（压缩）
	 * @param p_conn
	 * @param ins
	 * @param fileId
	 * @param p_filesource ：ftp/blob
	 * @param p_transType :业务类型
	 * @param fileName ：文件名
	 * @param tableName ：大对象表名
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-12 下午05:25:38
	 */
	private void insertBlobCompress(Connection p_conn, InputStream ins,String fileId, String p_filesource,String p_transType,String fileName,String tableName) throws Exception {

		//ZIP压缩
		ByteArrayOutputStream bout = new ByteArrayOutputStream();    
		GZIPOutputStream zout = new GZIPOutputStream(bout);
		zout.write(transInput2Byte(ins));
		zout.finish();
		
		if(p_filesource.equals("ftp")){
			FtpUtil.ftpPut(bout.toByteArray(), fileId , p_transType);
		}else{
			PreparedStatement pstmt = null;
			pstmt = p_conn.prepareStatement(getSql(tableName, "insert"));
			pstmt.setString(1, fileId);
			pstmt.setBytes(2, bout.toByteArray());
			if("system_longdata".equals(tableName.toLowerCase())){
				pstmt.setString(3, fileName);
				pstmt.setString(4, p_filesource);
				pstmt.setString(5, "1");
			}
			pstmt.execute();
			pstmt.close();
		}
		zout.close();
		bout.close();
		
	}

	/**
	 * 更新Blob大对象(压缩)
	 * @param p_conn
	 * @param ins
	 * @param p_fileID
	 * @param p_filesource：ftp/blob
	 * @param p_transType ：业务类型
	 * @param tableName : 大对象表名
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-12 下午05:26:21
	 */
	private void updateBlobCompress(Connection p_conn, InputStream ins,String p_fileID,String p_filesource,String p_transType,String p_fileName,String tableName) throws Exception {

		//ZIP压缩
		ByteArrayOutputStream bout = new ByteArrayOutputStream();    
		GZIPOutputStream zout = new GZIPOutputStream(bout);
		zout.write(transInput2Byte(ins));
		zout.finish();
		
		if(p_filesource.equals("ftp")){
			FtpUtil.ftpPut(bout.toByteArray(), p_fileID , p_transType);
		}else{
			PreparedStatement pstmt = null;
			pstmt = p_conn.prepareStatement(getSql(tableName, "update"));
			pstmt.setBytes(1, bout.toByteArray());
			if("system_longdata".equals(tableName)){
				pstmt.setString(2, p_fileName);
				pstmt.setString(3, p_filesource);
				pstmt.setString(4, "1");
				pstmt.setString(5, p_fileID);
			}else{
				pstmt.setString(2, p_fileID);
			}
			pstmt.execute();
			pstmt.close();
		}
		zout.close();
		bout.close();
	}
	
	//***********************文件下载*************************************************************************************
	
	public void fileDownload( HttpServletResponse response, String fileLsh,SgccAttachList attachInput)throws Exception{		
		SgccAttachListDAO  attachListDao  = SgccAttachListDAO.getInstance();
		Object attach =  attachListDao.findBeanByProperty("id.fileLsh", fileLsh);		
		if(attach != null){
			fileDownload(response, (SgccAttachList)attach);
		} else{
			if(attachInput != null){
				fileDownload(response, attachInput);
			}
		}
	}	
//***********************文件下载*************************************************************************************	
	public void fileDownload( HttpServletResponse response, SgccAttachList attach)throws Exception{		
		if(attach != null){
			Context initCtx = null;
			DataSource ds = null;
			Connection conn = null;
			Statement stmt = null;
			ResultSet rs = null;
			try {
				initCtx = new InitialContext();
				ds = (DataSource)JNDIUtil.lookup(initCtx) ;
				conn = ds.getConnection();
				stmt = conn.createStatement();
				
				String fileSoure = (attach.getFileSource()==null?"blob": attach.getFileSource());
				String fileType = (attach.getId().getTransactionType() ==null? "other": attach.getId().getTransactionType());
				String compress = (attach.getIsCompress()==null?"1":attach.getIsCompress());
				String blobTable = (attach.getBlobTable() ==null? "sgcc_attach_blob":attach.getBlobTable());
				String fileName = (attach.getFileName()==null? "未命名":attach.getFileName().trim());
				String fileLsh = attach.getFileLsh();
				String sql = getDownSelSql(blobTable,fileLsh);			
				//String sql = "select l.file_name, t.file_nr, l.IS_COMPRESS,l.filesource, l.transaction_type from sgcc_attach_blob t, sgcc_attach_list l where t.file_lsh(+) = l.file_lsh and l.file_lsh = '" + fileLsh + "'";
				rs = stmt.executeQuery(sql);
				if(rs.next()) {
					response.setContentType("application/octet-stream");
					response.setHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes("GB2312"),"ISO8859-1"));
					OutputStream out = response.getOutputStream();
					InputStream ins = null;
					if(fileSoure!=null && fileSoure.equals("ftp")){
						if(compress.equals("1")) {//如果是压缩模式，则获取InputStream
							byte[] outByte = FtpUtil.ftpGet(fileLsh, fileType);
							ins = new ByteArrayInputStream(outByte);
						}else{
							FtpUtil.ftpGet(out, fileLsh, fileType);
						}
					}else{
						Blob blob = rs.getBlob(1);
						//解压缩
						if(compress.equals("1")) {//如果是压缩模式，则获取InputStream
							ins = blob.getBinaryStream();
						}else {
							try {
								out.write(blob.getBytes(1, (int)blob.length()));
							} catch (SocketException e) {
								System.out.println("FileDownLoad Error::::::");
								e.printStackTrace();
							}
						}
					}
					/*
					 * 解压缩
					 */
					if(compress.equals("1")) {
						byte[] buffer = new byte[1024];
						int offset = -1;
						GZIPInputStream zin = new GZIPInputStream(ins);
						while((offset = zin.read(buffer)) != -1) {
							out.write(buffer, 0, offset);
						}
						zin.close();
					}
					
					out.flush();
					out.close();
				}
				else {
					response.sendError(404);
				}
			} catch (Exception e) {
			} finally {
				rs.close();
				stmt.close();
				conn.close();
				initCtx.close();
			}
		}
	}	
	//*******************文件删除************************************************************************************************//
	/**
	 * 根据fileLsh删除文件（包括sgcc_attach_list和sgcc_attach_blob）
	 * @param fileLsh
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-12 上午09:39:47
	 */
	public void deleteFile(String fileLsh)throws Exception{
		FileManagementService  fileServiceImpl = (FileManagementService)Constant.wact.getBean("fileServiceImpl");
		if(fileLsh.indexOf("'")<0){
			fileLsh = "'" + fileLsh + "'";
		}
		fileServiceImpl.deleteAttachList(fileLsh, null);
	}
	
	/**
	 * 删除文件（sgcc_attach_blob）
	 * @param fileLsh
	 * @param transType
	 * @param fileSource
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-12 上午10:01:49
	 */
	public void deleteBlobFile(String fileLsh,String transType,String fileSource)throws Exception{		
		deleteBlobFile(fileLsh, transType, fileSource, "sgcc_attach_blob");
	}
	/**
	 * 删除文件（sgcc_attach_blob）
	 * @param fileLsh
	 * @param transType
	 * @param fileSource
	 * @throws Exception
	 * @author Shirley 
	 * @createTime 2010-1-12 上午10:01:49
	 */
	public void deleteBlobFile(String fileLsh,String transType,String fileSource,String tableName)throws Exception{
		
		if(fileSource.equals("ftp")){
			transType = "".equals(transType)?"other":transType;
			FtpUtil.ftpDel(fileLsh, transType);
		}else{
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			PreparedStatement pstmt = null;
			
			pstmt = conn.prepareStatement(getSql(tableName, "delete"));
			pstmt.setString(1, fileLsh);
			pstmt.execute();
			pstmt.close();
			conn.close();
		}
		FileManagementService  fileServiceImpl = (FileManagementService)Constant.wact.getBean("fileServiceImpl");
		if(fileLsh.indexOf("'")<0){
			fileLsh = "'" + fileLsh + "'";
		}
		fileServiceImpl.deleteAttachList(fileLsh, null);
		
	}
	//*************************************************************************************************************************//
	
	private String getSql(String tableName,String sqlType){
		tableName = tableName.toLowerCase();
		String sql = "";
		if("system_longdata".equals(tableName)){
			if("insert".equals(sqlType)){
				sql = "insert into SYSTEM_LONGDATA(FILE_LSH,FILE_NR,FILE_NAME,TYPE,IS_COMPRESS) values (?,?,?,?,?)";
			}else if("update".equals(sqlType)){
				sql = "update SYSTEM_LONGDATA set FILE_NR=?,FILE_NAME=?,TYPE=?,IS_COMPRESS=?  where FILE_LSH=?";
			}else if("delete".equals(sqlType)){
				sql = "delete from SYSTEM_LONGDATA where FILE_LSH= ?" ;
			}
		}else if("app_blob".equals(tableName)){
			if("insert".equals(sqlType)){
				sql = "insert into APP_BLOB (FILEID, BLOB, DATETIME) values (?, ?, sysdate)";
			}else if("update".equals(sqlType)){
				sql = "update APP_BLOB set BLOB = ?, DATETIME = sysdate where FILEID = ?";
			}else if("delete".equals(sqlType)){
				sql = "delete from APP_BLOB where FILEID = ?";
			}
		}else{//sgcc_attach_blob
			if("insert".equals(sqlType)){
				sql = "insert into SGCC_ATTACH_BLOB(FILE_LSH,FILE_NR) values (?,?)";
			}else if("update".equals(sqlType)){
				sql = "update sgcc_attach_blob set FILE_NR=?  where FILE_LSH=?";
			}else if("delete".equals(sqlType)){
				sql = "delete from sgcc_attach_blob where file_lsh = ?";
			}
		}
		return sql;
	}
	/*
	 * 获取下载文件的Sql
	 */
	private String getDownSelSql(String tableName, String fileLsh){
		String sql = "";
		tableName = tableName.toLowerCase();
		if(tableName.equals("system_longdata")){
			sql = "select FILE_NR from system_longdata where file_lsh ='" + fileLsh+ "'";
		} else if(tableName.equals("app_blob")){
			sql = "select BLOB from APP_BLOB where FILEID ='" + fileLsh+ "'";
		}else{
			sql = "select FILE_NR from sgcc_attach_blob where file_lsh ='" + fileLsh+ "'";	
		}
		return 	sql;		
		
	}
	/**
	 * 输入流转成byte[]
	 * @param ins
	 * @return
	 * @throws IOException
	 * @author Shirley 
	 * @createTime 2010-1-11 下午04:22:28
	 */
	private byte[] transInput2Byte(InputStream ins)throws IOException{
		
		BufferedInputStream bufferIn = new BufferedInputStream(ins);
		byte b[] = new byte[bufferIn.available()];
		ins.read(b);
		
		return b;
	}
	

	/**
	 * 设置文件的缓存
	 * @return
	 * @author Shirley 
	 * @createTime 2010-1-11 下午04:24:36
	 */
	public ServletFileUpload getUpload(){
		String tmp = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
		File f2 = new File(tmp);
		if(!f2.exists()) {
			f2.mkdirs();
		}
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(10*2014);
		factory.setRepository(new File(tmp));
		ServletFileUpload upload = new ServletFileUpload(factory);
		//解决文件名乱码问题
		upload.setHeaderEncoding("UTF-8"); 
		return upload;
	}
	
	/**
	 * 获得业务数据大对象的存储方式
	 * @param businessType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-1-8
	 */
	public String getFileSource(String businessType){
		String fileSource = "blob";
		//获取本模块对对象的存储方式 -- 默认是存储到数据库(blob)
		SystemMgmFacade sysMgm = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
		List<PropertyCode> listProperty  = sysMgm.getCodeValue("大对象存储方式");
		if(listProperty != null){
			for (int i=0; i<listProperty.size(); i++) {
				if (listProperty.get(i).getPropertyCode().equalsIgnoreCase(businessType)) {
					fileSource = listProperty.get(i).getPropertyName();
					break;
				}
			}
		}		
		return fileSource;
	};
	
	/**
	 * 读取数据库中的大对象信心，转成inputStream返回
	 * 
	 * @param attach
	 * @return
	 * @throws NamingException
	 * @throws SQLException
	 * @throws IOException
	 * @createDate: 2010-3-18
	 */
	public InputStream transBlobToInputStream(SgccAttachList attach) throws NamingException, SQLException, IOException{
		InputStream ins = null;
		if(attach != null){
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			
			String fileSoure = (attach.getFileSource()==null?"blob": attach.getFileSource());
			String fileType = (attach.getId().getTransactionType() ==null? "other": attach.getId().getTransactionType());
			String compress = (attach.getIsCompress()==null?"1":attach.getIsCompress());
			String blobTable = (attach.getBlobTable() ==null? "sgcc_attach_blob":attach.getBlobTable());
			String fileLsh = attach.getFileLsh();
			String sql = getDownSelSql(blobTable,fileLsh);			
			ResultSet rs = stmt.executeQuery(sql);			
			if(rs.next()) {				
				if(fileSoure!=null && fileSoure.equals("ftp")){
					byte[] outByte = FtpUtil.ftpGet(fileLsh, fileType);
					ins = new ByteArrayInputStream(outByte);
				}else{
					Blob blob = rs.getBlob(1);
					//解压缩
					ins = blob.getBinaryStream();
				}
				/*
				 * 解压缩
				 */
				if(compress.equals("1")) {
					byte[] buffer = new byte[1024];
					int offset = -1;
					GZIPInputStream zin = new GZIPInputStream(ins);			
					ins = zin;
					zin.close();
				}
			}
			
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		return ins;
	}
	/**
	 * 更新报告材料部分的大对象信息(只更新大对象信息，sgcc_attach_blob或ftp上的文件)		
	 * --   通用的方法(根据业务处理ftp和blob大对象的更新)
	 * @param thisTransType 大对象的业务标识 (不能为Null)
	 * @param fileLsh file流水号 (不能为Null)
	 * @param in 大对象信息 (可为Null)
	 * @param thisCompressFlag: 是否压缩存储的标识 0：不压缩；1：压缩存储。(可为Null)
	 * @param operateStr 具体操作的参数：saveOrUpdate:新增或更新大对象的操作; delete: 删除大对象；
	 * 当operateStr=="delete" 参数in为null, thisCompressFlag为null
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-1-8
	 */
	public String updateFileBlob(String thisTransType, String fileLsh, InputStream in, String thisCompressFlag, String operateStr) {
		/*
		 * 2010-01-08更新--大对象处理兼容（数据库存储和ftp存储两种方式）
		 */
		String fileSource = this.getFileSource(thisTransType);
		if (fileSource.equalsIgnoreCase("blob")) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
				Connection conn = ds.getConnection();
				
				//删除已经存在的文件
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='" + fileLsh + "'";
				Statement stmt = conn.createStatement() ;
				stmt.execute(deleteSql) ;
				stmt.close() ;
				
				if (operateStr.equalsIgnoreCase("saveOrUpdate")) {
					//插入新的文件
					PreparedStatement pstmt = null;
					pstmt = conn.prepareStatement("insert into SGCC_ATTACH_BLOB(FILE_LSH,FILE_NR) values (?,?)");
					pstmt.setString(1, fileLsh);
					
			        byte b[] = this.getBytesFromInputStream(in);

					//GZIP压缩
					if(thisCompressFlag.equals("1")) {
						ByteArrayOutputStream bout = new ByteArrayOutputStream();    
						GZIPOutputStream zout = new GZIPOutputStream(bout);
						zout.write(b);
						zout.finish();
						pstmt.setBytes(2, bout.toByteArray());
						zout.close();
						bout.close();
					} else {
						pstmt.setBytes(2, b);
					}
					pstmt.execute();
					pstmt.close();
					conn.close();
				}
				
				initCtx.close();
			} catch (NamingException e) {
				e.printStackTrace();
				return "-1";
			} catch (SQLException e) {
				e.printStackTrace();
				return "-1";
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else if (fileSource.equalsIgnoreCase("ftp")) {
			//大对象存到FTP的处理方式-----------2010-01-08 Modified By Ivy;
			//TODO: ftp的压缩处理暂时未做设置。
			try {
				if (operateStr.equalsIgnoreCase("saveOrUpdate")) {
					FtpUtil.ftpPut(in, fileLsh, "FAPDocument");
				} else if(operateStr.equalsIgnoreCase("delete")) {
					FtpUtil.ftpDel(fileLsh, "FAPDocument");
				} else {
					System.out.println("操作错误！");
					return "-1";
				}
			} catch (IOException e) {
				e.printStackTrace();
				return "-1";
			} catch (FTPException e) {
				e.printStackTrace();
				return "-1";
			}
		} else {
			System.out.println("您设置的大对象存储方式错误。在系统属性处配置为ftp/blob");
			return "-1";
		}
		return fileLsh;
	}
	/**
	 * inputstream 转换为 byte[]的方法
	 * @param in
	 * @return
	 * @throws IOException
	 * @author: Ivy
	 * @createDate: 2010-1-11
	 */
	public byte[] getBytesFromInputStream(InputStream in) throws IOException {
		ByteArrayOutputStream os  = new java.io.ByteArrayOutputStream(); 
        byte[] buffer = new byte[64*1024]; 
        for(;;) { 
            int count = in.read(buffer); 
            if (count < 0) 
                break; 
            os.write(buffer,0,count); 
        } 
        return os.toByteArray();
	}
}
