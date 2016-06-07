package com.sgepit.frame.util.file;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Iterator;
import java.util.List;
import java.util.zip.GZIPOutputStream;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.service.FileManagementService;
import com.sgepit.frame.util.file.FileUtil;


public class FileUpload extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		
		String method = request.getParameter("method")==null?"":request.getParameter("method");
		if(method.equals("fileUpload")){
			fileUpload(request, response);
		}else if(method.equals("fileBlobUpload")){
			fileBlobUpload(request, response);
		}else if(method.equals("fileUploadMulti")){
			fileUploadMulti(request, response);
		}else{
			try {
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
				String memo = request.getParameter("memo")==null?"":request.getParameter("memo");
				//memo=new String(memo.getBytes("ISO-8859-1"),"utf-8"); 
				//
				String upper = request.getParameter("upper")==null?"":request.getParameter("upper");
				//是否压缩
				String compress = request.getParameter("compress")==null?"1":request.getParameter("compress");
				
				HttpSession session = request.getSession();
				String userID = (String)session.getAttribute(Constant.USERID);
				String unitID = (String)session.getAttribute(Constant.USERUNITID);
				//String orgID = (String)session.getAttribute(Constant.ORGID);
				
				boolean isMultipart = ServletFileUpload.isMultipartContent(request);
				if(isMultipart) {
					Context initCtx = new InitialContext();
					DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
					Connection conn = ds.getConnection();
					//////////////////////////////////////////////////
//					String tmp = this.getServletContext().getRealPath("/temporary files");
					String tmp = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
					//tmp = new String(tmp.getBytes("ISO-8859-1"),"utf-8");
					File f2 = new File(tmp);
					if(!f2.exists()) {
						f2.mkdirs();
					}
					DiskFileItemFactory factory = new DiskFileItemFactory();
					factory.setSizeThreshold(10*2014);
					factory.setRepository(new File(tmp));
					ServletFileUpload upload = new ServletFileUpload(factory);
					upload.setSizeMax(10 * 1024 * 1024);
					List items = upload.parseRequest(request);
					Iterator iter = items.iterator();
					while (iter.hasNext()) {
						FileItem item = (FileItem) iter.next();
						if (!item.isFormField() && item.getSize()>0 ) {
							if(fileid.equals("")) {
								//新增
								fileid = this.insert(conn, item, type, pk, userID, unitID, dept, upper, tmpid, compress, memo);
							}
							else {
								//编辑
								this.update(conn, item, fileid, type, pk, userID, upper, compress);
							}
						}
					}
					//////////////////////////////////////////////////
					conn.close();
					initCtx.close();
				}
				response.setCharacterEncoding("GBK");
				PrintWriter out = response.getWriter();
				out.write("true");
				out.write("<script>");
				out.write("try{parent.loadFileGrid();parent.closeUploadWin();}catch(ex){}");
				out.write("</script>");
				out.close();
			}
			catch(Exception ex) {
				ex.printStackTrace();
			}
		}
	}
	/**
	 * 文件上传
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:54:26
	 */
	public void fileUpload(HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException{
		try {
			//主键值
			String pk = request.getParameter("pk")==null?"":request.getParameter("pk");
			//文件ID
			String fileid = request.getParameter("fileid")==null?"":request.getParameter("fileid");
			
			FileUtil fileUtil = new FileUtil();
			fileid = fileUtil.fileUpload(request, response);
			response.setCharacterEncoding("GBK");
			PrintWriter out = response.getWriter();
			String rtnValue = fileid;
			//out.write("true" + fileid.split("``"));
			out.write("<script>");
			if(pk != null && !pk.equals("") && !pk.equals("undefined"))
			{
				out.write("try{alert('文件上传成功');window.returnValue='" + rtnValue + "';parent.loadFileGrid();parent.closeUploadWin();}catch(ex){}");

			} else
			{
				out.write("try{alert('文件上传成功!');parent.handleAfterUpload('" + rtnValue +"');}catch(ex){}");
				System.out.println("*************************************");
			}
			out.write("</script>");
			out.close();
		}catch(Exception ex) {
			ex.printStackTrace();
			response.setCharacterEncoding("GBK");
			PrintWriter out = response.getWriter();
			out.write("<script>");
			out.write("try{alert('文件上传失败!');parent.closeUploadWin();}catch(ex){}");
			out.write("</script>");
			out.close();
		}
	}
	
	/**
	 * 文件上传（不关联sgcc_attach_list）
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author Shirley 
	 * @createTime 2010-1-8 上午11:54:42
	 */
	public void fileBlobUpload(HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException{
		String fileName = "";
		try {
			FileUtil fileUtil = new FileUtil();
			String rtnValue = fileUtil.fileUpload(request, response);
			String[] rtnValues = rtnValue.split("``");
			fileName = rtnValues[1];
			response.setCharacterEncoding("GBK");
			PrintWriter out = response.getWriter();
			out.write(rtnValues[1]+"上传成功\n");
			out.write("<script>\n");
			out.write("parent.fileId='"+rtnValues[0]+"';\n");
			out.write("parent.fileName='"+rtnValues[1]+"';\n");
			out.write("parent.fileSize='"+rtnValues[2]+"';\n");
			out.write("parent.uploadBlobWin.hide();\n");
			out.write("parent.closeBlobUploadWin(true);\n");
			out.write("</script>");
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
			PrintWriter out = response.getWriter();
			out.write(fileName+"上传失败\n");
			out.write("<script>\n");
			out.write("parent.uploadBlobWin.hide();\n");
			out.write("parent.closeBlobUploadWin(false);\n");
			out.write("</script>");
			out.close();
		}
		
	}
	public void fileUploadMulti(HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException{
		try {
			//主键值
			String pk = request.getParameter("pk")==null?"":request.getParameter("pk");
			//文件ID
			String fileid = request.getParameter("fileid")==null?"":request.getParameter("fileid");
			
			FileUtil fileUtil = new FileUtil();
			fileid = fileUtil.fileUpload(request, response);
			response.setCharacterEncoding("GBK");
			PrintWriter out = response.getWriter();
			fileid = fileid.split("``")[0];
			FileManagementService fileService= (FileManagementService) Constant.wact.getBean("fileServiceImpl");
			List<SgccAttachList> list = fileService.geAttachListByWhere("file_lsh ='" +fileid + "'",null,null);
			String uploadDate ="";
			if(list.size() >0){
				SgccAttachList attach = list.get(0);
				if(attach.getUploadDate()!= null){
					uploadDate = DateUtil.getDateTimeStr(attach.getUploadDate(), "yyyy-MM-dd HH:mm:ss");
				}									
			}
			if(uploadDate.equals("")){
				out.write("{success:true, fileLsh:'" + fileid + "'}");
			}else{
				out.write("{success:true, uploadDate:'" + uploadDate+"', fileLsh:'" + fileid + "'}");
			}
			
			
			
			out.close();
		}catch(Exception ex) {
			ex.printStackTrace();
			response.setCharacterEncoding("GBK");
			PrintWriter out = response.getWriter();
			out.write("{success:false}");			
			out.close();
		}
	}
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		doGet(request, response);
	}
	
	private String insert(Connection p_conn, FileItem p_item, String p_type, String p_pk, 
			String p_user, String p_unit, String p_dept, String p_upper, String p_tmpID, String p_compress , String p_memo) {
		String sn = SnUtil.getNewID();
		p_compress="1";
		try {
			File f = new File(new String(p_item.getName().getBytes("GBK"),"utf-8"));
			PreparedStatement pstmt = null;
			pstmt = p_conn.prepareStatement("insert into SYSTEM_LONGDATA(FILE_LSH,FILE_NR,FILE_NAME,TYPE,IS_COMPRESS) values (?,?,?,'blob','" + p_compress + "')");
			pstmt.setString(1, sn);
			//GZIP压缩
			if(p_compress.equals("1")) {
				ByteArrayOutputStream bout = new ByteArrayOutputStream();    
				GZIPOutputStream zout = new GZIPOutputStream(bout);
				zout.write(p_item.get());
				zout.finish();
				pstmt.setBytes(2, bout.toByteArray());
				zout.close();
				bout.close();
			}
			else {
				pstmt.setBytes(2, p_item.get());
			}
			pstmt.setString(3, f.getName());
			pstmt.execute();
			pstmt.close();
			pstmt = p_conn.prepareStatement("insert into SGCC_ATTACH_LIST(TRANSACTION_TYPE,TRANSACTION_ID,FILE_LSH,FILE_NAME,"
											+"USERID,UNIT_ID,DEPT_ID,FILE_TYPE,TEMPLATE_ID,MEMO,UPLOAD_DATE)"
											+" values (?,?,?,?,?,?,?,?,?,?,sysdate)");
			pstmt.setString(1, p_type);
			pstmt.setString(2, p_pk);
			pstmt.setString(3, sn);
			pstmt.setString(4, f.getName());
			pstmt.setString(5, p_user);
			pstmt.setString(6, p_unit);
			pstmt.setString(7, p_dept);
			pstmt.setString(8, p_upper);
			pstmt.setString(9, p_tmpID);
			pstmt.setString(10, p_memo);
			System.out.println(p_type+"***"+p_pk+"***"+sn+"***"+f.getName()+"***"+p_user+"***"+p_unit+"***"+p_dept+"***"+p_upper+"***"+p_tmpID+"***"+p_memo);
			pstmt.execute();
			pstmt.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sn;
	}
	
	private void update(Connection p_conn, FileItem p_item, String p_fileID, String p_type, String p_pk, String p_user, String p_upper, String p_compress) {
		try {
			File f = new File(p_item.getName());
			PreparedStatement pstmt = null;
			pstmt = p_conn.prepareStatement("update SYSTEM_LONGDATA set FILE_NR=?,FILE_NAME=?,TYPE='blob',IS_COMPRESS='" + p_compress + "' where FILE_LSH='" + p_fileID + "'");
			//GZIP压缩
			if(p_compress.equals("1")) {
				ByteArrayOutputStream bout = new ByteArrayOutputStream();    
				GZIPOutputStream zout = new GZIPOutputStream(bout);
				zout.write(p_item.get());
				zout.finish();
				pstmt.setBytes(1, bout.toByteArray());
				zout.close();
				bout.close();
			}
			else {
				pstmt.setBytes(1, p_item.get());
			}
			//pstmt.setBytes(1, p_item.get());
			pstmt.setString(2, f.getName());
			pstmt.execute();
			pstmt.close();
			
			
			pstmt = p_conn.prepareStatement("update SGCC_ATTACH_LIST set FILE_NAME=?,USERID=?,FILE_TYPE=?"
							+ " where TRANSACTION_ID='" + p_pk + "' and TRANSACTION_TYPE='" + p_type + "' and FILE_LSH='" + p_fileID + "'");
			pstmt.setString(1, f.getName());
			pstmt.setString(2, p_user);
			pstmt.setString(3, p_upper);
			pstmt.execute();
			pstmt.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
}