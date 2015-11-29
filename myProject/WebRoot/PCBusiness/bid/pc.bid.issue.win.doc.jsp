<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>发送中标通知书</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="PCBusiness/bid/progressForm.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>		
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<script type="text/javascript" src="extExtend/Spinner.js"></script>
		<script type="text/javascript" src="extExtend/SpinnerStrategy.js"></script>
		
		<script type="text/javascript">
			if(parent.dydaView)
			{
				ModuleLVL = '6';
				parent.outFilter[3] = null; //有动态数据的时候 该参数只在该页面有效
			}
			var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
			//当前选中的招标内容id
			var bidContentId = '<%=request.getParameter("bidContentId") == null ? "" : request.getParameter("bidContentId") %>';
			//传过来的工作进度
			var rateStatus= '<%=request.getParameter("rateStatus") == null ? "" : request.getParameter("rateStatus") %>';
			
			//是否有新增，删除，保存按钮
			var hasBtn=<%=request.getParameter("hasBtn") == null ?true: request.getParameter("hasBtn") %>;
		//var bidContentId = '1';
		</script>
		
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.issue.win.doc.js"></script>
	
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
