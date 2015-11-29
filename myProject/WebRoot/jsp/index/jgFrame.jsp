<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="java.net.*"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>技改项目管理</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type="text/javascript">
		//提供给技改接入集团的首页页面打开集团左侧菜单
		function openLeft(){
			parent.loadFirstModule(CURRENTAPPID,'技改项目管理','xmdw');
			parent.lt.expand();
		}
		</script>
	</head>

	<body scroll="no">
		<iframe id="gotoJgFrame" src=""  frameborder="no" scrolling="no" width="100%" height="100%" ></iframe>
		<script type="text/javascript">
		var appUrl = "";
		var urlServlet = "/servlet/GotoCrossDomainServlet";
		var gotoUrl = "";
		var modid = "<%=request.getParameter("modid")==null?"":request.getParameter("modid")%>";
		var lvl = "<%=request.getParameter("lvl")==null?"":request.getParameter("lvl")%>";
		if(lvl==null || lvl=="")lvl="3"
		DWREngine.setAsync(false);
		//根据技改项目的unitid查询技改的app_url
		var sql = "select t.app_url from sgcc_ini_unit t where unitid = '10302'";
		baseDao.getData(sql,function(rtn){
			appUrl = rtn;
		});
		sql = "select t.jg_url from rock_power t where t.powerpk = '"+modid+"'";
		baseDao.getData(sql,function(rtn){
			gotoUrl = rtn;
		});
		DWREngine.setAsync(true);
		var gotoServlet = appUrl + urlServlet;
		gotoServlet += "?ac=crossDomainLoginGotoUrl";
		gotoServlet += "&gotoUrl="+encodeURIComponent(gotoUrl);
		gotoServlet += "&userId=<%=session.getAttribute(Constant.USERID)%>";
		gotoServlet += "&lvl="+lvl;
		window["gotoJgFrame"].location.href = gotoServlet;
		</script>
	</body>
</html>
