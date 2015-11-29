<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
 <head>
 	 <base href="<%=basePath%>">
 	 <%	
		String templateId = request.getParameter("templateId")==null ? "" : request.getParameter("templateId");
		String reportId = request.getParameter("reportId")==null ? "" : request.getParameter("reportId");
		String sjType = request.getParameter("sjType")==null ? "" : request.getParameter("sjType");
		String saveable = (request.getParameter("saveable")!=null && request.getParameter("saveable").equals("true")) ? "true" : "false";
	%>
	<title>工资统计查询</title>
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.css"></link>
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar.css"></link>
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar_skins.css"></link>
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxmenu_dhx_blue.css">
    <!--XGRID-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcommon.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgridcell.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxtreegrid.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_math.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxdataprocessor.js"></script><!--记录编辑-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_filter.js"></script><!--一般过滤-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxtreegrid_filter.js"></script><!--树过滤-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_srnd.js"></script><!--异步加载-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_selection.js"></script><!--区域选择-->
	
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_splt.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/excells/dhtmlxgrid_excell_dhxcalendar.js "></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar.js "></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxmenu.js "></script>
	
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXProtobar.js"></script>
    <script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXMenuBar.js"></script>
	<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/xgridCommon/dhtmlxgridext.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXMenuBar_cp.js"></script>
	<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/excel/dataToExcel.js"></script><!--导出excel管理-->	
	<%--<script type='text/javascript' src="Business\rlzy\xgridMange.js"></script>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/rlzyMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/xgridCommon.js'></script>--%>
	
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='<%=path%>/dwr/interface/XgridBean.js'></script>
	<script type='text/javascript' src='dwr/interface/xgridCommon.js'></script>
	<script type='text/javascript' src='dwr/interface/rlzyXcglMgm.js'></script>
	</head>
 <body>
	<div id="gridbox" width="100%" height="100%"></div>
	  	<form action="" id="formAc" method="post" name="formAc"></form>
 </body>
<script type="text/javascript">
var mygrid = new dhtmlXGridObject('gridbox');
	mygrid.setImagePath(basePath + "dhtmlxGridCommon/dhtmlxgrid/codebase/imgs/");
	mygrid.setSkin("xp");
	var myDataProcessor = new dataProcessor("");
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.enableMathEditing(true);
	mygrid.setEditable(false);
	var Xml;
	
	//如果此行编辑了，设置此行的父节点也是变更状态；
	function setParentNodeUpdated(rowId) {
		var parentId = mygrid.getParentId(rowId);
		if ( parentId ){
			myDataProcessor.setUpdated(parentId, true);
			setParentNodeUpdated(parentId);
		}
	}

	
	function doReload() {
		mygrid.clearAll();
		var startSj = parent.startSj;
		var endSj = parent.endSj;
		var depts = parent.unitIds;
		var users = parent.userIds;
		var items = parent.itemIds != null ? parent.itemIds : "";
		var types = parent.typeIds != null ? parent.typeIds : "";  
		var userDetailItems=parent.userDetailItemsids != null ? parent.userDetailItemsids : "";//传入自定义的用户详情 
		try{       
			rlzyXcglMgm.getSalaryStatisticXml(startSj, endSj, depts, users, items, types,userDetailItems,CURRENTAPPID,function(dataXml){
			mygrid.loadXMLString(dataXml);	
			//alert(dataXml)
			Xml = dataXml;		
		});
		}catch(e){}
	}
	
	function exportExcel(){
		var startSj = parent.startSj;
		var endSj = parent.endSj;
		var depts = parent.unitIds;
		var users = parent.userIds;
		var items = parent.itemIds != null ? parent.itemIds : "";
		var types = parent.typeIds != null ? parent.typeIds : "";  
		var userDetailItems=parent.userDetailItemsids != null ? parent.userDetailItemsids : "";//传入自定义的用户详情 
		//HrSalaryMgm.getExcelTem(Xml,function(){})
		if(depts==null||depts==""){depts=""}
		if(users==null||users==""){users=""}
		var openUrl = CONTEXT_PATH + "/servlet/RlzyServlet?ac=exportCell&startSj=" + startSj + "&endSj=" + endSj + "&depts=" + depts +"&users="+users
		+"&items="+items+"&types="+types+"&userDetailItems="+userDetailItems+"&pid="+CURRENTAPPID;
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	//XgridBean.headerXMLStringToExcel(header,function(){})
	/*
		var items = parent.itemIds != null ? parent.itemIds : "";
		var types = parent.typeIds != null ? parent.typeIds : "";
		var header =getHeadData(mygrid);
		var out=getSerializeGridData(mygrid);
		HeaderArrayToExcel("工资统计查询表",40, header,out)*/	
	}
</script>
</html>