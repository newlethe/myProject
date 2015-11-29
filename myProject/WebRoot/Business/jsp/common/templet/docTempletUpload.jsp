<%@ page language="java" pageEncoding="GBK"%>
<!-- @author:guox  -->
<%@ page import="java.io.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="javax.sql.*"%>
<%@ page import="javax.naming.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.util.zip.*"%>

<%@ page import="org.apache.commons.fileupload.disk.*"%>
<%@ page import="org.apache.commons.fileupload.*"%>
<%@ page import="org.apache.commons.fileupload.servlet.*"%>
<%@ page import="com.sgepit.frame.util.db.SnUtil"%>
<%@ page import="com.sgepit.frame.util.JNDIUtil"%>

<%
String tmpid = request.getParameter("tmpid");
String fileid = request.getParameter("fileid");
String filename = request.getParameter("template_name");
//是否压缩
String compress = request.getParameter("compress")==null?"1":request.getParameter("compress");
boolean isMultipart = ServletFileUpload.isMultipartContent(request);
if(isMultipart) {
	Context initCtx = new InitialContext();
	
	DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
	Connection conn = ds.getConnection();
	//////////////////////////////////////////////////
	//String tmp = this.getServletContext().getRealPath("/temporary files");
	String tmp = application.getRealPath("/temporary files");
	File f2 = new File(tmp);
	if(!f2.exists()) {
		f2.mkdirs();
	}
	DiskFileItemFactory factory = new DiskFileItemFactory();
	factory.setSizeThreshold(10*2014);
	factory.setRepository(new File(tmp));
	ServletFileUpload upload = new ServletFileUpload(factory);
	//upload.setSizeMax(yourMaxRequestSize);
	List items = upload.parseRequest(request);
	Iterator iter = items.iterator();
	while (iter.hasNext()) {
		FileItem item = (FileItem) iter.next();
		if (!item.isFormField() && item.getSize()>0 ) {
			File f = new File(item.getName());
			//新增
			if(fileid==null || fileid.equals("")) {
				String sn = SnUtil.getNewID();
				PreparedStatement pstmt = conn.prepareStatement("insert into system_longdata(FILE_LSH,FILE_NAME,IS_COMPRESS,FILE_NR) values (?,?,?,?) ");
				pstmt.setString(1, sn);
				pstmt.setString(2, filename);
				
				//GZIP压缩
				if(compress.equals("1")) {
					pstmt.setString(3, "1");
					ByteArrayOutputStream bout = new ByteArrayOutputStream();    
					GZIPOutputStream zout = new GZIPOutputStream(bout);
					zout.write(item.get());
					zout.finish();
					pstmt.setBytes(4, bout.toByteArray());
					zout.close();
					bout.close();
				}
				else {
					pstmt.setString(3, "0");
					pstmt.setBytes(3, item.get());
				}
				//pstmt.setString(3, f.getName());
				pstmt.execute();
				pstmt.close();
				
				Statement stmt = conn.createStatement();
				stmt.execute("update SGCC_ANALYSE_REPORT_TEMPLATE set file_lsh='" + sn + "',TEMPLATE_DATE=sysdate where TEMPLATE_ID='" + tmpid + "'");
				//stmt.execute("insert into sgcc_attach_list(TRANSACTION_TYPE,TRANSACTION_ID,FILE_LSH,FILE_NAME,IS_COMPRESS) values('report','"+sn+"','"+sn+"','"+filename+"','"+compress+"')");
				//System.out.println("insert into sgcc_attach_list(TRANSACTION_TYPE,TRANSACTION_ID,FILE_LSH,FILE_NAME,IS_COMPRESS) values('report','"+sn+"','"+sn+"','"+filename+"','"+compress+"')");
				stmt.close();
			}
			//更新
			else {
				PreparedStatement pstmt = conn.prepareStatement("update system_longdata set FILE_NR=?  where  FILE_LSH='" + fileid +"'");
				//GZIP压缩
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
				pstmt.execute();
				pstmt.close();
				
				Statement stmt = conn.createStatement();
				stmt.execute("update SGCC_ANALYSE_REPORT_TEMPLATE set TEMPLATE_DATE=sysdate where TEMPLATE_ID='" + tmpid + "'");
				stmt.close();
			}
		}
	}
	conn.close();
	initCtx.close();
	out.print("true");
}	
%>