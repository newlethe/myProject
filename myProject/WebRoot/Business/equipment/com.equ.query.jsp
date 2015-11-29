<%@ page language="java" import="java.util.*,com.sgepit.frame.util.JdbcUtil" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.util.db.SnUtil"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
	<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appNewsMgm.js'></script>		
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
			
		<meta http-equiv="Pragma" content= "no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<title>详细信息</title>
		<link href="../css/instyle.css" rel="stylesheet" type="text/css" />
		
				
<%
String outFilePkStr=request.getParameter("filePk")==null?"":request.getParameter("filePk");
String whereSql="select an.uids,an.author,an.content,sal.file_lsh,sal.file_name from app_equ an,sgcc_attach_list sal where  an.uids=sal.transaction_id(+) and an.uids='"+outFilePkStr+"'";
System.out.println("com.news.query.sql:"+whereSql);
List list=JdbcUtil.query(whereSql);
String uidsStr="";
String contentStr="";
if(list!=null&&list.size()>0){
    Map m=(Map) list.get(0);
	contentStr=(m.get("content")).toString();
	contentStr=contentStr.replaceAll(" ","&nbsp;").replaceAll("\r\n", "<br/>");
}

%>		

<script type="text/javascript">
function creatPic(){
	var ids = new Array();
	var uids='<%=outFilePkStr%>';
	ids.push(uids);
	DWREngine.setAsync(false);
	appNewsMgm.publishEquManagement(ids,SYS_TIME_STR,USERID, function(retVal) {
			});
	DWREngine.setAsync(true);	
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
      		picName=file_lsh+"."+fileNameStr.substring(fileNameStr.lastIndexOf(".")+1, fileNameStr.length());		             			
     		}
   		}	%>
   		var picNameFlag='<%=picName%>';
   		if(null!=picNameFlag&&picNameFlag){
   			document.images[<%=c%>].src="<%=path%>/Business/equipment/management/upload/<%=picName%>";	
   		}
   		
   		
   		<%
   	}
		
     %>
	//document.getElementById("equId").src="<%=path%>/Business/equipment/management/upload/<%=picName%>";
}
</script>	
	</head>
	<body onload = "creatPic()">
<div align="center">
<div id="main_zi_right_Text">	  
     <div class="content" align="left"><div style="text-align:justify;text-justify:inter-ideograph;text-indent: 20pt;font-size: 14px; line-height:150%;font-family: 宋体;"><%=contentStr %></div>
<p style="text-align: center">
<span style="font-size: small">

             <% 
             for(int c=0;c<list.size();c++){
            	 if(""!=picName){
            		
             %> 
	             
			<img  src=""/>
			<%} 
             }
			%>
	             <br/>
	             <br/>


</span></p></div>
                                </div>	
</div>	

	
	
	</body>
</html>





