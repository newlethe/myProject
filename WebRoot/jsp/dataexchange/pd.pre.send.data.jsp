<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>待报送业务数据</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/pcDataExchangeService.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/baseMgm.js'></script>
		<script type="text/javascript" src="jsp/dataexchange/Ext.ux.PagingToolbar.js"></script>
		<script type="text/javascript" src="<%=path%>/jsp/dataexchange/pd.pre.send.data.js"></script>
		<style>
			textarea
			{
				width:100%;
				height:100px;
				
			}
			.codeField{
				font-family: Courier New;
			}
			.cbx{
				height : 15px;
			}
		</style>
  </head>
  
  <body>
    <div></div>
  </body>
</html>
