<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String edit_time = request.getParameter("time")==null?"":request.getParameter("time").toString();
	String edit_opType = request.getParameter("opType")==null?"":request.getParameter("opType").toString();
	String dydaView = request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String proName=request.getParameter("proName")==null?"":request.getParameter("proName");
 %>
<html>
	<head>
		<title>招标过程信息</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
			.gridTitle{
			}
		</style>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		
		<script type="text/javascript">
		var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
		//当前选中的招标内容id
		var bidContentId = '<%=request.getParameter("bidContentId") == null ? "" : request.getParameter("bidContentId") %>';
		//var bidContentId = '1';
		var outFilter=[3];
		var dydaView=eval("<%=dydaView%>");
		if(dydaView){
			outFilter[0]=currentPid;
			outFilter[1]="<%=edit_time%>";
			outFilter[2]="<%=edit_opType%>";
			outFilter[3] = null; //招标进度类型, 这里初始化为null, 在子页面中判断是否父页面有动态数据请求, 如果有就在子页面初始化
			
			var proName = "<%=proName%>"
			ModuleLVL = 6;
		}else{
			outFilter=null;
		}
		</script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.detail.mainFrame.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
	
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
