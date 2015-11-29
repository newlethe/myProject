<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/Business/rlzy/salary/xgridjs.jsp" %>
<!-- @author:lizp  -->
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>表头预览</title>
	</head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=no>
		<div id="gridbox" width="100%" height="100%" ></div>
	</body>
</html>
<script>
	var param = window.dialogArguments
	mygrid = new dhtmlXGridObject("gridbox");
	mygrid.setImagePath(xgridImagePath);
	mygrid.setSkin("xp");
	mygrid.enableColumnMove(true);
	var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
	xmlDoc.setProperty("SelectionLanguage", "XPath");
	xmlDoc.async = false;
	xmlDoc.loadXML(param.head)
	var column = xmlDoc.documentElement.selectNodes("/rows/head/column")
	for(var i=0;i<column.length;i++) {
		var c = column[i] ;
		c.setAttribute("type","ro")
	}
	mygrid.parse(xmlDoc)
</script>