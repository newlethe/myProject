 <%@ page contentType="text/html;charset=UTF-8" %>
 <%
	String uidsArray = request.getParameter("uidsArray")==null?"":request.getParameter("uidsArray");
 %>
 <html>
	<head>
		<!--  <title>流程实例信息查看</title> -->
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var _basePath = '<%=basePath%>';
		var _userid = '<%=session.getAttribute(Constant.USERID)%>';
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwInstanceMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwBizMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<!-- PAGE -->
		<script type="text/javascript">
			var uidsArray = "<%=uidsArray%>";
			var renderArray = [];               //拼接【 【logid】【流程起草人】【本步骤完成时间】】数组
			if(uidsArray.indexOf(',') == -1) {
				var filterParam = "logid='"+uidsArray+"'";
				var sql = "select logid, realname, nexttime from" 
						+"((select logid, fromnode, insid, nodeid from flw_log where logid='"+uidsArray+"') V1"
						+" left join"
						+" (select userid, realname from rock_user) V2" 
						+" on V1.fromnode=V2.userid"
						+" left join"
						+" (select insid, fromnodeid,to_char(ftime,'yyyy-mm-dd HH24:MI:SS') nexttime from flw_log) V3"
						+" on V3.fromnodeid=V1.nodeid and V3.insid=V1.insid)"
			}
			else {
				var pkArray = uidsArray.split(",");
				var tmpArray = "('" + pkArray.toString().replace(/,/g, "','")+"')";
				var filterParam = "logid in" + tmpArray
				var sql = "select logid, realname, nexttime from" 
						+"((select logid, fromnode, insid, nodeid from flw_log where logid in"+tmpArray+") V1"
						+" left join"
						+" (select userid, realname from rock_user) V2" 
						+" on V1.fromnode=V2.userid"
						+" left join"
						+" (select insid, fromnodeid,to_char(ftime,'yyyy-mm-dd HH24:MI:SS') nexttime from flw_log) V3"
						+" on V3.fromnodeid=V1.nodeid and V3.insid=V1.insid)"
			}
			
			DWREngine.setAsync(false);
					baseDao.getDataAutoCloseSes(sql, function(list){
						if(list.length>0){
							for(var i=0; i<list.length; i++)
							{
								var arr = [];
								arr.push(list[i][0]);
								arr.push(list[i][1]);
								arr.push(list[i][2]);
								renderArray.push(arr);
							}
						}
					})
			DWREngine.setAsync(true);
		</script>
		<script type="text/javascript" src="jsp/flow/flw.statistics.instances.info.js"></script>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<span></span>
	</body>
</html>