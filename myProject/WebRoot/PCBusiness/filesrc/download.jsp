<%@page language="java" pageEncoding="UTF-8"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="org.apache.commons.io.FilenameUtils"%>
<%@page import="com.sgepit.frame.util.Log4jInit"%>
<%@page import="java.io.*"%>
<%
	
	String fpath = request.getParameter("fpath")==null?"":request.getParameter("fpath");
	String log = request.getParameter("log")==null?"0":request.getParameter("log");
	
	String root = Constant.AppRootDir;
	root = root.substring(0, root.lastIndexOf("/"));
	root = root.substring(0, root.lastIndexOf("/")).concat("/");
	//系统日志下载
	if(log.equals("1")){
		fpath = Log4jInit.LogFile;
	}else{
		fpath = root.concat(fpath);
	}
	File file = new File(fpath);
	
	if(file.exists()&&(!file.isDirectory())){
		response.reset();//可以加也可以不加   
		response.setContentType("application/x-msdownload");
		response.addHeader("Content-Disposition", "attachment;filename="+ file.getName());
		java.io.OutputStream outp = null;
		java.io.FileInputStream in = null;
		try {
			outp = response.getOutputStream();
			in = new FileInputStream(file);
	
			byte[] b = new byte[1024];
			int i = 0;
	
			while ((i = in.read(b)) > 0) {
				outp.write(b, 0, i);
			}
			outp.flush();
			out.clear();
			out = pageContext.pushBody();
		} catch (Exception e) {
			e.printStackTrace();
			response.reset();
			response.setContentType("text/html");
			response.setCharacterEncoding("utf-8");
			out.print("<script>history.back();alert('下载失败!');</script>");
		} finally {
			if (in != null) {
				in.close();
				in = null;
			}
		}
	}else{
		out.print("<script>history.back();alert('文件不存在,下载失败!');</script>");
	}
%>
