<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>发售招标文件</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="PCBusiness/bid/progressForm.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>		
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>		
		<script type="text/javascript">
		if(parent.dydaView)
		{
			ModuleLVL = '6';
			parent.outFilter[3] = 'TbSendZbDoc'
		}
		var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
		//当前选中的招标内容id
		var bidContentId = '<%=request.getParameter("bidContentId") == null ? "" : request.getParameter("bidContentId") %>';
		var type="PcBidSendZbdoc";
		//var bidContentId = '1';
		</script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.progress.form.nodata.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.send.zbdoc.js"></script>
	
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
