package com.sgepit.frame.util.file;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.sql.BatchUpdateException;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.db.SnUtil;

public class XlsUtil extends HttpServlet {
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		request.setCharacterEncoding("UTF-8");
		String type = request.getParameter("type");
		if(type!=null) {
			//上传
			if(type.equals("template") || type.equals("upload")) {
				PrintWriter out = response.getWriter();
				out.print(this.upload(request,response));
				out.close();
			}else if(type.equals("uploadXgridTemplate")) {
				PrintWriter out = response.getWriter();
				out.print(this.uploadXgridTemplate(request));
				out.close();
			}
			//下载
			else if(type.equals("download")) {
				this.download(request, response);
			}else if(type.equals("downloadXgridTemplate")) {
				this.downloadXgridTemplate(request, response);
			}
		}
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		doGet(request, response);
	}
	
	//判断字符串是否可转换成数字
	public static boolean isNum(String p_str) {
		if(p_str.matches("^[-]?\\d+[.]?\\d*$")) {
			return true;
		}
		else {
			return false;
		}
	}

	//获得主记录ID
	private String getMasterID(String p_tab, String p_col, String p_date,String p_corp) {
		String mID = "";
		try {
			//String[] s = p_tab.split("[.]");
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "";
			ResultSet rs0 = stmt.executeQuery("select 1 from user_tab_cols where table_name='" + p_tab.toUpperCase() + "' and column_name='UNIT_ID'");
			if(rs0.next()) {
				sql = "select " + p_col + " from " + p_tab + " where sj_type='" + p_date + "' and unit_id='" + p_corp + "'";
			}
			else {
				sql = "select " + p_col + " from " + p_tab + " where sj_type='" + p_date + "' and unitid='" + p_corp + "'";
			}
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				mID = rs.getString(1);
			}
			rs0.close();
			rs.close();
			
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return mID;
	}
	
	//上传附表(method=upload)当type=template为模板
	private String upload(HttpServletRequest request,HttpServletResponse response) {
		String flag = "true";
		String fileid = request.getParameter("fileid");
		try {
			String appid = request.getParameter("pk");
			
			String type = request.getParameter("type");
			String fileLshColName = request.getParameter("colname");
			//是否压缩
			String compress = request.getParameter("compress")==null?Constant.COMPRESS:request.getParameter("compress");
			boolean isMultipart = ServletFileUpload.isMultipartContent(request);
			String fileName = "";
			if(isMultipart) {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
				Connection conn = ds.getConnection();
				
//				String tmp = this.getServletContext().getRealPath("/temporary files");
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
				//upload.setHeaderEncoding("UTF-8"); 
				List items = upload.parseRequest(request);
				Iterator iter = items.iterator();
				while (iter.hasNext()) {
					FileItem item = (FileItem) iter.next();
					if (!item.isFormField() && item.getSize()>0 ) {
						fileid = doSave(conn, item, type, appid, fileid, fileLshColName,compress);
					}
				}
				conn.close();
				initCtx.close();
			}
			/*response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			out.write("true"+Constant.SPLITB+fileid);
			out.write("<script>");
			out.write("try{alert(parent.curFileLsh);parent.curFileLsh='" +fileid +"a';}catch(ex){}");
			out.write("</script>");
			out.close();*/
		}
		catch(Exception ex) {
			flag = "false";
			ex.printStackTrace();
		}
		return flag + "`"+ fileid;
	}
	
	public String doSave(Connection conn, FileItem item,String type,String appid,String fileid,String fileLshColName, String compress) throws SQLException, IOException{

		File f = new File(item.getName());
		String sql = "";
		//写入大对象表
		if(fileid==null || fileid.equals("")) {
			fileid = SnUtil.getNewID();
			if(type!=null && type.equals("template")) {
				sql = "insert into SYSTEM_LONGDATA(FILE_NR,FILE_LSH) values (?,?)";
			}else{
				sql = "insert into SGCC_ATTACH_BLOB(FILE_NR,FILE_LSH) values (?,?)";
			}
		}
		else {
			if(type!=null && type.equals("template")) {
				sql = "update SYSTEM_LONGDATA set FILE_NR=? where FILE_LSH=?";
			}else{
				sql = "update SGCC_ATTACH_BLOB set FILE_NR=? where FILE_LSH=?";
			}
		}
		PreparedStatement pstmt = conn.prepareStatement(sql);
		if(compress.equals("1")) {
			ByteArrayOutputStream bout = new ByteArrayOutputStream();    
			GZIPOutputStream zout = new GZIPOutputStream(bout);
			zout.write(item.get());
			zout.finish();
			pstmt.setBytes(1, bout.toByteArray());
			zout.close();
			bout.close();
		}
		else {
			pstmt.setBytes(1, item.get());
		}
		pstmt.setString(2, fileid);
		pstmt.execute();
		pstmt.close();
		
		//写入业务表
		Statement stmt = conn.createStatement();
		String sql1 = ""; 
		int lastPoint = item.getName().lastIndexOf("\\");
		String fileName = item.getName().substring(lastPoint+1);
		if(type!=null && type.equals("template")) {
			
			sql1 = "update sgcc_plan_appendix set file_lsh='" + fileid + "',file_name='" + fileName + "' where appendixId='" + appid + "'";
			stmt.addBatch(sql1);
		}
		else {
			sql1 = "update prj_plan_report set " + fileLshColName + "='" + fileid + "' where REPORT_ID='" + appid + "'";
			stmt.addBatch(sql1);
			
		}
		//stmt.addBatch(sql1);
		stmt.executeBatch();
		stmt.close();
		return fileid;
	}
	
	//根据单位和时间返回附表模板ID
	public String xlsTemplate(String p_date,String p_corp) {
		String fid = "";
		try {
			String sql = "select file_lsh from sgcc_plan_appendix where unit_id='" + p_corp + "' and sj_type='" + p_date + "'";
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				fid = rs.getString(1);
			}
			rs.close();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return fid;
	}
	//根据附表类型，单位和时间返回附表模板ID
	//param.sj_type, param.unit_id,fileType
	public String xlsTemplateType(String p_date,String p_corp,String fileType) {
		String fid = "";
		try {
			String sql = "select file_lsh from sgcc_plan_appendix where  sj_type='" + p_date + "' and appendix_type='"+fileType+"'";
			//System.out.println("**************************" + sql);
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				fid = rs.getString(1);
			}

			rs.close();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		
		return fid;
	}
	
	public String getXlsID(String appID) {
		String fid = "";
		try {
			String sql = "select file_lsh from sgcc_plan_report_master where report_id='" + appID + "'";
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				fid = (rs.getString(1)==null)?"":rs.getString(1);
			}
			rs.close();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return fid;
	}

	//下载附表
	private void download(HttpServletRequest request, HttpServletResponse response) {
		try{
			String fid = request.getParameter("fileid");
			
			response.setContentType("application/x-msdownload");
			//response.setHeader("Content-Disposition", "attachment; filename=" + java.net.URLEncoder.encode("sas.doc","UTF-8"));
			OutputStream out = response.getOutputStream();
			//////////////////////////////////////////////////
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select file_nr from sgcc_attach_blob where file_lsh='" + fid + "'";
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				Blob blob = rs.getBlob(1);
//				if("1".equals(rs.getString(3))) {
					byte[] buffer = new byte[1024];
					int offset = -1;
					GZIPInputStream zin = new GZIPInputStream(blob.getBinaryStream());
					while((offset = zin.read(buffer)) != -1) {
						out.write(buffer, 0, offset);
					}
					zin.close();
//				}
//				else {
//					out.write(blob.getBytes(1, (int)blob.length()));
//				}
				
			}
			//////////////////////////////////////////////////
			out.flush();
			out.close();
			rs.close();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	//得到部门查看附表表页的权限
	public String getDeptSheet(String p_date, String p_dept) {
		String str = "";
		try{
			String sql = "select SHEETNAME,ROW_ID from SGCC_PLAN_APPENDIX,SGCC_PLAN_APPENDIX_SHEET"
				+ " where SGCC_PLAN_APPENDIX.APPENDIXID=SGCC_PLAN_APPENDIX_SHEET.APPENDIXID"
				+ " and SJ_TYPE='"+p_date+"' and DEPT_ID='"+p_dept+"'";
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				str += "/" + rs.getString(1) + "*";
				if(rs.getString(2)!=null) {
					str += rs.getString(2);
				}
			}
			rs.close();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return str;
	}
	
	//根据附表类型得到部门查看附表表页的权限
	
	public String getDeptSheetType(String p_date, String p_dept,String fileType,String file_lsh) {
		String str = "";
		try{
			String sql = "select SHEETNAME,ROW_ID from SGCC_PLAN_APPENDIX,SGCC_PLAN_APPENDIX_SHEET"
						+ " where SGCC_PLAN_APPENDIX.APPENDIXID=SGCC_PLAN_APPENDIX_SHEET.APPENDIXID"
						+" and SGCC_PLAN_APPENDIX.file_lsh='"+file_lsh
						+ "' and SJ_TYPE='"+p_date+"' and DEPT_ID='"+p_dept+"' and file_type="+fileType;
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				str += "/" + rs.getString(1) + "*";
				if(rs.getString(2)!=null) {
					str += rs.getString(2);
				}
			}
			rs.close();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return str;
	}
	
	//设置部门查看附表表页的权限
	public boolean setDeptSheet(String p_appID, String p_dept, String p_sheetStr) {
		boolean flag = true;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			stmt.addBatch("delete from SGCC_PLAN_APPENDIX_SHEET where APPENDIXID='" + p_appID + "' and DEPT_ID='" + p_dept + "'");
			String[] sheets = p_sheetStr.split("[/]");
			for(int i=1;i<sheets.length;i++) {
				String[] s = sheets[i].split("[*]");
				stmt.addBatch("insert into SGCC_PLAN_APPENDIX_SHEET (APPENDIXID,SHEETID,DEPT_ID,SHEETNAME,ROW_ID)"
						+ "values ('" + p_appID + "','" + SnUtil.getNewID() + "','" + p_dept + "','" + s[0] + "','" + (s.length>1?s[1]:"") + "')");
			}
			stmt.executeBatch();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			flag = false;
			ex.printStackTrace();
		}
		return flag;
	}
	
	//dwr提交数据方式年度、公司、部门（单位）
	public String saveData(String p_date, String p_corp, String p_unit, String p_recordtype,String p_xml) {
		//long ss = System.currentTimeMillis();
		String errSheet = "";
		if(p_unit == null&& p_unit.equals("")){
			p_unit =p_corp;
		}
		if(p_xml.equals("")) {
			return errSheet;
		}
		Connection conn;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sheetName = "";
			String sheetType="";
			String templateType="";
			
			SAXBuilder sb = new SAXBuilder();
			Document doc = sb.build(new StringReader(p_xml));
			Element root = doc.getRootElement();
			List<Element> worksheets = root.getChildren();
			//用于存放已删除过记录的表，以免重复删除
			HashMap<String,String> delMap = new HashMap();
			String[] rowMap=null;
			for( int s=0; s<worksheets.size(); s++ ) {
				Element worksheet = worksheets.get(s);
				String tabName = worksheet.getAttributeValue("tabName");
				sheetName = worksheet.getAttributeValue("sheetName");
				sheetType = worksheet.getAttributeValue("sheetType");
				templateType = worksheet.getAttributeValue("templateType");
	
				if(sheetType.equals("TAB:")){
					sheetType = "行";
				} else{
					sheetType = "列";
				}
				Element colEl = worksheet.getChild("Column");
				//colMap用于存放字段的默认值
				HashMap<String,String> colMap = new HashMap();
				String delSql = "delete from " + tabName + " where 1=1";
				String colSql = "";
				
				List<Element> cols = colEl.getChildren();
				if(cols!=null && cols.size() >0){
					for( int c=0; c<cols.size(); c++ ) {
						Element datEl = cols.get(c);
						String[] colNm = datEl.getAttributeValue("Value").split("[:]");
						//外键
						if(colNm[0].equalsIgnoreCase("FPK")) {
							String masterID ="";
							String[] cs = colNm[1].split("[.]");
							if(templateType.equals("PrjItemHistory")){
								masterID = "H2008_" + p_unit;
							} else{
								masterID = this.getMasterID( cs[0], cs[1], p_date, p_unit );
							}
							delSql += " and " + cs[1] + "='" + masterID + "'";
							colMap.put(c+"", masterID);
							colNm[1] = cs[1];
						}
						//时间
						else if(colNm[0].equalsIgnoreCase("DATE")) {
							//delSql += " and " + colNm[1] + "='" + p_date + "'";
							colMap.put(c+"", p_date);
						}
						//公司
						else if(colNm[0].equalsIgnoreCase("CORP_ORG")) {						
							colMap.put(c+"", p_corp);
						}else if(colNm[0].equalsIgnoreCase("CORP_UNIT")) {
							//delSql += " and " + colNm[1] + "='" + p_unit + "'";
							colMap.put(c+"", p_unit);
						}
						//记录类型（上报、审核）
						else if(colNm[0].equalsIgnoreCase("RECORDTYPE")) {
							colMap.put(c+"", p_recordtype);
						}
						else {
	 						if(colNm[0].equalsIgnoreCase("COL")) {
								colMap.put(c+"", "-");
							} else if( colNm[0].equalsIgnoreCase("COL_DATE")){
								colMap.put(c+"", "dateData");
							}
							//NEWSN,ROWINX,PROJID
							else {
								colMap.put(c+"", colNm[0]);
							}
							//=设置默认值
							String[] cs = colNm[1].split("=");
							if(cs.length>1) {
								colMap.put(c+"", cs[1]);
								colNm[1] = cs[0];
							}
						}
						colSql += (c==0?"":",") + colNm[1];
						
					}
					if(delMap.get(tabName)==null) {
						stmt.execute(delSql);
						System.out.println("delSql:" + delSql);
						delMap.put(tabName, "1");
					}
					
					List<Element> rows = worksheet.getChildren("Row");
					rowMap = new String[rows.size()];
					String projID = "";
					for(int r=0;r<rows.size();r++) {
						Element row = rows.get(r);
						rowMap[r] = row.getAttributeValue("Index");
						List<Element> dats = row.getChildren();
						String valSql = "";
						for( int c=0; c<dats.size(); c++ ) {
							valSql += c==0?"":",";
							String val = dats.get(c).getAttributeValue("Value");						
							String colStr = colMap.get(c+"");
							if(colStr.equalsIgnoreCase("NEWSN")) {
								valSql += "'" + p_unit + SnUtil.getNewID() + "'";
							}
							else if(colStr.equalsIgnoreCase("ROWINX")) {
								valSql += "'" + (r+1) + "'";
							}//指标列不能为空
							else if(colStr.equalsIgnoreCase("INX")) {
								if(val.trim().equals("")) {
									continue;
								}
								else {
									valSql += "'" + val + "'";
								}
							}
							else {
								//excel中的数据为空
								if(val.trim().equals("") || val.trim().equals("-") || val.trim().startsWith("#")) {
									if(colStr.equals("-") || colStr.equals("dateData")) {
										val = "null";								
									}
									else {
										//缺省情况下取默认值--
										val =  colStr ;
									}
								}
								if(val.equals("null")){
									valSql += val ;
								} else{
									if (colStr.equals("dateData")){
										valSql += "to_date('" + val + "','yyyy-mm-dd')";
									} else{
										valSql += "'" +val +"'";
									}
								}							
							}
						}
						String sql = "insert into " + tabName + " (" + colSql + ") values (" + valSql + ")";
						System.out.println(sql+";");
						stmt.addBatch(sql);
					}
				}
				
				//////////////////////////////////////////////////
				try {
					stmt.executeBatch();
					stmt.clearBatch();
				}
				catch (BatchUpdateException ex) {
					errSheet = sheetName;
					stmt.clearBatch();
					int[] arrEx = ex.getUpdateCounts();
					errSheet += "第" + rowMap[arrEx.length] + sheetType +"格式错误 ";
					ex.printStackTrace();
				}
				catch(Exception ex) {
					errSheet = sheetName;
					stmt.clearBatch();
					ex.printStackTrace();
				}
			}
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		//System.out.println( "附表数据保存耗时:"+ (System.currentTimeMillis()-ss) );
		return errSheet;
	}
	private String uploadXgridTemplate(HttpServletRequest request) {
		String flag = "true";
		
		String appid = request.getParameter("appid");
		String fileid = request.getParameter("fid");
		String filesource = request.getParameter("filesource")==null?"blob":request.getParameter("filesource");//上传方式（ftp/blob）
		
		//是否压缩
		String compress = request.getParameter("compress")==null?"1":request.getParameter("compress");
		//业务类型
		String transType = request.getParameter("transType")==null?"other":request.getParameter("transType");
		
		String fileId = fileid;
		try {
			boolean isMultipart = ServletFileUpload.isMultipartContent(request);
			if(isMultipart) {
				FileUtil fileUtil = new FileUtil();
				ServletFileUpload upload = fileUtil.getUpload();
				List items = upload.parseRequest(request);
				fileId = fileUtil.fileBlobUploadBytable(request,items,  appid,fileid, filesource, compress, transType, "system_longdata");
			}
		}
		catch(Exception ex) {
			flag = "false";
			ex.printStackTrace();
		}
		return fileId.split("`")[0];
	}
	
	public boolean updateHead4Template(String xmlDocStr,String begancell,String templetId){
		
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			String sql = "update SGPRJ_TEMPLET_CONFIG set templet_header=?,templet_begancell=? where templet_sn=?";
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setString(1, xmlDocStr);
			stmt.setString(2, begancell);
			stmt.setString(3, templetId);
			stmt.execute() ;
			stmt.close();
			conn.close();
			initCtx.close();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	//下载附表
	private void downloadXgridTemplate(HttpServletRequest request, HttpServletResponse response) {
		try{
			String fid = request.getParameter("fid");			
			response.setContentType("application/x-msdownload");
			//response.setHeader("Content-Disposition", "attachment; filename=" + java.net.URLEncoder.encode("sas.doc","UTF-8"));
			OutputStream out = response.getOutputStream();
			//////////////////////////////////////////////////
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select file_nr,file_name,is_compress from system_longdata where file_lsh='" + fid + "'";
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				Blob blob = rs.getBlob(1);
				if("1".equals(rs.getString(3))) {
					byte[] buffer = new byte[1024];
					int offset = -1;
					GZIPInputStream zin = new GZIPInputStream(blob.getBinaryStream());
					while((offset = zin.read(buffer)) != -1) {
						out.write(buffer, 0, offset);
					}
					zin.close();
				}
				else {
					out.write(blob.getBytes(1, (int)blob.length()));
				}
				
			}
			//////////////////////////////////////////////////
			out.flush();
			out.close();
			rs.close();
			stmt.close();
			conn.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	
}