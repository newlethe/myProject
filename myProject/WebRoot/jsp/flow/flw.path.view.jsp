<%@ page language="java" pageEncoding="UTF-8" %>
<html>
	<HEAD>
		<title>流程结构树维护</title>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">
		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<!-- EXT -->
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/oViewNode.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</HEAD>

	<body>
		<table cellspacing="0" cellpadding="0" border="0">
		<script type="text/javascript">
			var insid = '402848b91e3ed1bd011e3ed6a40e0001';
			var insBean = "com.sgepit.frame.flow.hbm.FlwInstanceView";
			var nodeBean = "com.sgepit.frame.flow.hbm.FlwNodeView";
			var commonNodeBean = "com.sgepit.frame.flow.hbm.FlwCommonNode";
			var commonNodePathInsBean = "com.sgepit.frame.flow.hbm.FlwCommonNodePathIns";
			var currentNodeInsBean = "com.sgepit.frame.flow.hbm.FlwCommonCurrentNodeIns";
			DWREngine.setAsync(false);
			
			baseDao.findByWhere2(insBean, "insid='"+insid+"'", function(list){
				if (list.length && list.length > 0){
					var worklog = list[0].worklog;
					var flowid = list[0].flowid;
					baseDao.findByWhere2(nodeBean, "flowid='"+flowid+"'", function(nodes){
						for (var i=0; i<nodes.length; nodes++){
							var nodename = nodes[i].name;
							var nodeid = nodes[i].nodeid;
							baseDao.findByWhere2(commonNodePathInsBean, "insid='"+insid+"' and nodeid='"+nodeid+"'", function(has){
								
							});
						}
					});
				}
			});
			DWREngine.setAsync(true);
		</script>
		</table>
	</body>
</html>