<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
 <HEAD>
 	 <base href="<%=basePath%>">
	<TITLE>年度投资汇总查询</TITLE>
    <!--XGRID-->
    <link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.css"></link>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcommon.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgridcell.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_deprecated.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/DataProcessor/dhtmlXDataProcessor.js"></script>
	
	<!-- DWR -->
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
 </HEAD>
 <BODY>
 </BODY>
	<div id="gridbox" width="100%" height="250px" style="background-color:white;overflow:hidden"></div>
	<div id="gridbox2" width="100%" height="height="100%" style="background-color:white;overflow:hidden"></div>
 <script>
 	
		mygrid = new dhtmlXGridObject('gridbox');
		mygrid.setImagePath(basePath + "dhtmlxGridCommon/dhtmlxgrid/codebase/imgs/");
		mygrid.init();
		var edit_pid=CURRENTAPPID;
		pcTzglService.getYearInvestXml(edit_pid, function(v){
			mygrid.clearAll(true);
        	//mygrid.loadXML(basePath+"PCBusiness/tzgl/query/head3.xml");
        	mygrid.loadXMLString(v);
		});
		
 </script>
</HTML>