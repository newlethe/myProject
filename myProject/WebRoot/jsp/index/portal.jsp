<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@page import="com.sgepit.frame.sysman.hbm.SysPortletConfig"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.util.JSONUtil"%>
<%
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
List<RockPower> fastModules = systemMgm.getFastModulesByUserId((String)session.getAttribute(Constant.USERID));
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<link rel="stylesheet" type="text/css"
			href="../res/css/index.styles.css"></link>
		<link rel="stylesheet" type="text/css" href="../res/css/style.css" />
		<style>
tr.row0 {
	height: 26px;
}

p {
	text-indent: 24px;
}

li.li0 {
	line-height: 19px;
	margin-top: 5px;
	background: url('../res/images/index/docs.gif') no-repeat;
	text-indent: 20px;
}
img.subsystem {
	width: 180px;
	height: 150px;
	cursor: hand;
}
</style>

	</head>

	<body>
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="loading-indicator">
				<br>
				<br>
				&nbsp;&nbsp;&nbsp;
				<img src="../res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle">
				页面加载中...
			</div>
		</div>
		<!-- include everything after the loading indicator -->
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<script>
		var portletConfigObj = new Array();
		var maxColIdx = 1;
		var temp
		<%
			List<SysPortletConfig> list = systemMgm.getUserPortletConfig(userid);
			for(int i=0; i<list.size(); i++) {
			SysPortletConfig pc = (SysPortletConfig)list.get(i);
			if (pc.getShow()!=null && pc.getShow().equalsIgnoreCase("true")){
		%>
			temp = "<%=pc.getColIdx()%>"=="null"?1:<%=pc.getColIdx()%>;
			maxColIdx =  maxColIdx < temp ? temp : maxColIdx;
			portletConfigObj.push({portletCode:'<%=pc.getPortletCode()%>',portletName:'<%=pc.getPortletName()%>',colIdx:temp,rowIdx:'<%=pc.getRowIdx()%>',ph:"<%=pc.getPh()%>"=="null"?120:<%=pc.getPh()%>})
		<%}}%>
		if (portletConfigObj.length == 0){
			portletConfigObj.push({portletCode:'FavorateModules',portletName:'常用操作',colIdx:'1',rowIdx:'1'})
			maxColIdx = 1;
		} else {
			maxColIdx = maxColIdx>3?3:(maxColIdx<1?1:maxColIdx);
		}
		
		for(var i=0; i<portletConfigObj.length; i++){
			var str = "var "+portletConfigObj[i]["portletCode"]+" = {title:'" + portletConfigObj[i]["portletName"] + "',"
			str += "height: " + portletConfigObj[i]["ph"] + ","
			str += "html: \"\"}"
			eval(str);
		}
		</script>
		<script type="text/javascript" src="../../extExtend/Portal.js"></script>
		<script type="text/javascript" src="../../extExtend/PortalColumn.js"></script>
		<script type="text/javascript" src="../../extExtend/Portlet.js"></script>
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/examples/portal/portal.css" />
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/examples/portal/sample.css" />
		<script type="text/javascript" src="portal.js"></script>
		<div id="favourites" style="padding-left: 10px; width: 100%">
			<table border=0 width=100%>
				<%
					int count = fastModules.size();
					int m = count > 0 ? count / 3 + (count % 3 > 0 ? 1 : 0) : 0;
				%>
				<%
					for (int i = 0; i < m; i++) {
				%>
				<tr class="row0">
					<%
						for (int j = 0; j < 3; j++) {
								int n = i * 3 + j;
								if (n < count) {
									RockPower r = (RockPower) fastModules.get(n);
									String iconCss = r.getIconcls();
					%>
					<td>
						<img src="../res/images/icons/<%=iconCss%>" align=absmiddle>
						&nbsp;&nbsp;
						<a href=javascript:fastIntoModule('<%=r.getPowerpk()%>')><%=r.getPowername()%></a>
					</td>
					<%
						} else {
					%>
					<td>
						&nbsp;
					</td>
					<%
						}
							}
					%>
				</tr>
				<%
					}
				%>
			</table>
		</div>
	</body>
</html>
