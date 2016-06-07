<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String filterMode = request.getParameter("filterMode")==null?"0":(String)request.getParameter("filterMode");

 %>
<html>
	<head>
		<title>数据交互日志查看</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<style type="text/css">
			.codeField{
				font-family: Courier New;
			}
		</style>
		<script type="text/javascript">
			var filterMode = '<%=filterMode %>';
			var filterInStr;
			if ( filterMode=='1' ){
				var filterIds = parent.txIds;
				filterInStr = "(";
				for ( var i = 0; i < filterIds.length; i++ ){
					filterInStr += "'" + filterIds[i] +"'";
					if ( i < filterIds.length - 1 ){
						filterInStr += ",";
					}
				}
				filterInStr += ")";
			}
		</script>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/baseMgm.js'></script>
		<script type="text/javascript" src="jsp/dataexchange/Ext.ux.PagingToolbar.js"></script>
		<script type="text/javascript" src="jsp/dataexchange/pc.exchange.log.js"></script>
  </head>
  
  <body>
    <div></div>
  </body>
</html>
