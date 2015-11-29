<%@ page language="java" import="java.util.*,java.text.SimpleDateFormat"
	pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.util.JdbcUtil"%>
<!DOCTYPE html>
<html lang="zh">
	<%
String path = request.getContextPath();
String imagePath = path + "/login/dth/images";
%>
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<title>详细信息</title>
	<link href="<%=imagePath%>/instyle.css" rel="stylesheet"
		type="text/css" />

	<%
String outFilePkStr=request.getParameter("uids")==null?"":request.getParameter("uids");
String whereSql="select an.uids,an.author,an.title,to_char(an.pubtime, 'YYYY-MM-DD HH24:mi:ss') pubtime, "+
				" an.content,sal.file_lsh,sal.file_name,ru.realname,an.pid "+
				" from app_news an,sgcc_attach_list sal,rock_user ru "+
				" where ru.userid=an.pubperson and an.uids=sal.transaction_id(+) "+
				" and an.uids='"+outFilePkStr+"'";
List list=JdbcUtil.query(whereSql);
String uidsStr="";
String titleStr="";
String contentStr="";
String authorStr="";
String pubTimeStr="";
String author="";
if(list!=null&&list.size()>0){
    Map m=(Map) list.get(0);
    uidsStr=(m.get("uids")).toString();
	titleStr=(m.get("title")).toString();
	contentStr=(m.get("content")).toString();
	contentStr=contentStr.replaceAll(" ","&nbsp;").replaceAll("\r\n", "<br/>");
	authorStr=(m.get("realname")).toString();
	pubTimeStr=(m.get("pubtime")).toString();
	author=(m.get("author")).toString();
}
String fileList = "";
%>
	</head>
	<body>
		<div align="center">
			<div id="main_zi_right_Text">
				<h1><%=titleStr%></h1>
				<div class="msgbar">
					发布时间：<%=pubTimeStr %>
					&nbsp; 作者：<%= author%>
					&nbsp; 发布人：<%= authorStr%></div>
				<div class="content" align="left">
					<div
						style="text-align: justify; text-justify: inter-ideograph;  font-size: 14px; line-height: 150%; font-family: 宋体;"><%=contentStr %></div>
					<p style="text-align: center">
						<span style="font-size: small">
					<% 
						String picName="";
						String fileNameStr="";
						String file_lsh="";
						for(int c=0;c<list.size();c++){
							Map o=(Map) list.get(c);
							if(o.get("file_lsh")!=null){
					    		file_lsh=(o.get("file_lsh")).toString();
					 			if(o.get("file_name")!=null){
					 				fileNameStr=(o.get("file_name")).toString();
					 				String suffixName = fileNameStr.substring(fileNameStr.lastIndexOf(".")+1, fileNameStr.length());
					 				if(suffixName.equalsIgnoreCase("jpg")||suffixName.equalsIgnoreCase("png")||suffixName.equalsIgnoreCase("gif")
					 				||suffixName.equalsIgnoreCase("bmp")||suffixName.equalsIgnoreCase("jpeg")||suffixName.equalsIgnoreCase("tif")){
						 				picName=file_lsh+"."+suffixName;		             			
								 		out.print("<br>");
								 		out.print("<img src='"+path+"/Business/newsManage/guoj/news/upload/"+picName+"'>");
					 				}else{
								 		fileList+="附件：<a href='"+path+"/servlet/BlobCrossDomainServlet?ac=sgccfile&fileid="+file_lsh+"&pid="+o.get("pid")+"'>"+o.get("file_name")+"</a><br>";
					 				}
					 			}
							}	
						}
					%> </span>
					</p>
				</div>
			</div>
			<div id="fileList"><%=fileList%></div>
		</div>
	</body>
</html>





