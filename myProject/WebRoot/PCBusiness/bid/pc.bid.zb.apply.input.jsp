<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String outFilterStr = request.getParameter("outFilter")==null?"1=1":request.getParameter("outFilter").toString();	
 %>
<html>
	<head>
		<title>招标申请</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/zlgkMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcDataExchangeService.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<script type="text/javascript" src="extExtend/Spinner.js"></script>
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="extExtend/SpinnerStrategy.js"></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript">
			var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
			var zbUids = '<%=request.getParameter("zbUids") == null ? "" : request.getParameter("zbUids") %>';
			var editable = '<%=request.getParameter("edit") == null ? "1" : request.getParameter("edit") %>';
			
			var mPageNo = '<%=request.getParameter("mPageNo") == null ? "" : request.getParameter("mPageNo") %>';
			var mIndex = '<%=request.getParameter("mIndex") == null ? "" : request.getParameter("mIndex") %>';
			var cPageNo = '<%=request.getParameter("cPageNo") == null ? "" : request.getParameter("cPageNo") %>';
			var cIndex = '<%=request.getParameter("cIndex") == null ? "" : request.getParameter("cIndex") %>';
			
			var contentUids = '<%=request.getParameter("cPageNo") == null ? "" : request.getParameter("contentUids") %>';
			var mUids = '<%=request.getParameter("mUids") == null ? "" : request.getParameter("mUids") %>';
			
			var dydaView=eval("<%=dydaView%>");
			if(dydaView){
				ModuleLVL = 6;
			}
			var outFilter = "<%=outFilterStr%>";
			//是否有新增，删除，保存按钮
			var hasBtn=<%=request.getParameter("hasBtn") == null ?true: request.getParameter("hasBtn") %>;	
		</script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.zb.apply.input.js"></script>
	
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
