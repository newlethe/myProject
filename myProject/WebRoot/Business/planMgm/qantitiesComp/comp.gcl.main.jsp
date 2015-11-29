<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>工程量投资完成</title>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- 拓全局变量设置 -->
		<script language="JavaScript">
			/********流程参数--begin*/
			var monid_flow = "<%=request.getParameter("mon_id")==null?"":request.getParameter("mon_id")%>";
			var conno_flow = "<%=request.getParameter("conno")==null?"":request.getParameter("conno")%>";
			
			var step_flow = "<%=request.getParameter("step")==null?"":request.getParameter("step")%>";
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			/* 流程接口模块名称 */
			var funname_flow = "<%=request.getParameter("funname")==null?"":(String)request.getParameter("funname") %>";
			/********流程参数--end*/
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>  
		<script type='text/javascript' src='dwr/interface/proAcmMgm.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/baseMgm.js"></script>	
		
		<!-- 功能JS -->
		<script type='text/javascript' src='<%=path%>/Business/planMgm/qantitiesComp/comp.gcl.main.js'></script>
			
		
	</head>
	<body>
		<div>
			<input id='conInfo' type='text' value='' size=75
				style='border: 0; background-color: transparent; text-align: right'
				READONLY>
			</input>
		</div>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
</html>
