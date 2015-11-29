<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<html>
	<head>
		<title>上传模板</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style>
			html, body {
				BACKGROUND-COLOR: transparent;
		        font:normal 12px verdana;
		        margin:0;
		        padding:0;
		        border:0 none;
		        overflow:hidden;
		        height:100%;
		    }
		    td, select {
		    	font:normal 12px verdana;
		    }
		    input {
				border: 1px solid Gray;
				width: 260px;
				font-size: 12px;
			}
		</style>	
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
	</head>
	<body onload=init()>
		<table style="width:100%;height:100%" border=0 cellpadding=0 cellspacing=0>
			<tr align=center>
				<td align='right'>模&nbsp&nbsp&nbsp板</td>
				<td><select name="docTemplet" style="width:220"></select>
				</td>
			</tr>
			<tr align=center>
				<td align='right'>文件名</td>
				<td><input name="fileName" style="width:220"></td>
			</tr>
		</table>
	</body>
</html>
<script>
function init() {
	var sql = "select template_name,template_id from sgcc_analyse_report_template"
			+ " where unitid='"+UNITID+"' and fun_code='" + parent._fileType + "'  and file_lsh is not null"
	if(parent._fileDept) {
		sql += " and dept_id='" + parent._fileDept + "'"
	}
	else {
		sql += " and dept_id is null"
	}
	sql += "  order by template_date desc"
	db2Json.selectSimpleData(sql, function(dat){
		var s = eval(dat)
		for(var i=0;i<s.length;i++) {
			docTemplet.options[i] = new Option( s[i][0], s[i][1], false, false )
		}
	});
}
</script>