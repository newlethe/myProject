<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String edit = request.getParameter("edit")==null?"true":(request.getParameter("edit").equals("true")?"true":"false");
	String currAppid = (String)session.getAttribute(Constant.CURRENTAPPPID);
	String edit_add=request.getParameter("edit_add")==null?"false":(request.getParameter("edit_add").equals("true")?"true":"false");
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"false":(request.getParameter("pid"));
	if(pid.equals("false")){}else{currAppid=pid;};
%>
<html>
	<head>
		<title>项目基本信息添加或更新</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	   <base href="<%=basePath%>">
	   <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
			.form-field{
				/*background:'#D3FCD7' none no-repeat 0 0!important;*/
			}
		</style>
		<!-- DWR -->
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>

		<script type="text/javascript">
			var edit_pid = "<%=currAppid%>";
			var edit_add=eval("<%=edit_add%>");
			var dydaView=eval("<%=dydaView%>");
			
			//如果是动态数据跳转, 修改页面标题并将权限设置为只读
			if(dydaView){
				ModuleLVL = 6;
			}
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/zhxx/baseInfoInput/pc.zhxx.projinfo.baseinfo.addOrUpdate.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
