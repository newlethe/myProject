<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>   
  <head>
    <title>树</title>
  	<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equRecMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equlistMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		  	
  		<script type="text/javascript">
		var ggid = "<%=request.getParameter("ggid")%>";
		var conid = "<%=request.getParameter("conid")%>"; 
		var conno = "<%=request.getParameter("conno")%>"; 
		var conname = "<%=request.getParameter("conname")%>";
		var argments = "<%=request.getParameter("argments")%>";
		var partB = "<%=request.getParameter("partyb")%>";
	     DWREngine.setAsync(false);
		  baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conid='"+conid+"'" , function(conList){
			 conname = conList[0].conname;
		 });
		 var selectedSb = "(";
		 baseDao.findByWhere2("com.sgepit.pmis.equipment.hbm.EquSbdhArr", "dh_id='"+ggid+"'" , function(sbdhList){		 	
		 	for(var i=0;i<sbdhList.length;i++){
		 		selectedSb += "'"+sbdhList[i].sbId+"',";
		 	}
		 	selectedSb = selectedSb.substr(0,selectedSb.length-1)+")"		 
		 });
		 DWREngine.setAsync(true);
		</script>
	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		        <link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		

		
		<!-- PAGE -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<!--
		<script type="text/javascript" src="Business/equipment/equ.list.Tree.addorupdate.js"></script>
		<script type="text/javascript" src="Business/equipment/equ.list.selectTree.js"></script>
		
		-->
		<script type="text/javascript" src="Business/equipment/equ.list.select.js"></script>
  </head>
  <body>
  	<span></span>
  	<div id="tree"></div>
  </body>
</html>
