<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String currAppName = request.getParameter("currAppName")==null?"":request.getParameter("currAppName");
	String currAppid = request.getParameter("currAppid")==null?"":request.getParameter("currAppid");
	String dydaView = request.getParameter("dydaView")==null?"false":
											(request.getParameter("dydaView").equals("true")?"true":"false");
	String outFilterStr = request.getParameter("outFilter")==null?"":request.getParameter("outFilter").toString();										
%>
<html>
	<head>   
		<title>项目组织机构</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<!-- DWR -->
		<script src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type="text/javascript">
		    var flag = "<%=request.getParameter("flag")==null?"":request.getParameter("flag")%>";
			var defaultParentId = CURRENTAPPID;
			var defaultParentName = CURRENTAPPNAME;
			var defaultUnit;
			var defaultParentUnit;
			DWREngine.setAsync(false);
			systemMgm.getUnitById(CURRENTAPPID, function(d){
				defaultUnit = d;
			});
			DWREngine.setAsync(true);
			if(defaultUnit&&defaultUnit!=null){
				defaultParentId=defaultUnit.upunit;
			}
			DWREngine.setAsync(false);
			systemMgm.getUnitById(defaultParentId, function(d){
				defaultParentUnit = d;
			});
			DWREngine.setAsync(true);
			if(defaultParentUnit&&defaultParentUnit!=null){
				defaultParentName=defaultParentUnit.unitname;
			}
			var outFilter = "<%=outFilterStr%>";
			var dydaView = eval("<%= dydaView %>");
			var EDIT = (ModuleLVL>3 ? false : true);
			if(dydaView){
				defaultParentId = '<%= currAppid %>';
			    defaultParentName = '<%= currAppName %>';
			    EDIT = false;
			    if(outFilter != '')
			    {
			    	var unitids = [];
			    	var sql = "select unitid from sgcc_ini_unit where uids in"+outFilter;
			    	DWREngine.setAsync(false);
			    	baseDao.getDataAutoCloseSes(sql, function(list){
			    		if(list.length>0){
			    			for(var i=0; i<list.length; i++)
			    			{
			    				unitids.push(list[i]);
			    			}
			    		}
			    	})
			    	DWREngine.setAsync(true);
			    }
			}
		</script>
		<script type="text/javascript" src="PCBusiness/zhxx/query/pc.zhxx.projinfo.unitStructure.js"></script>
	</head>
	<body >
		
	</body>
</html>
