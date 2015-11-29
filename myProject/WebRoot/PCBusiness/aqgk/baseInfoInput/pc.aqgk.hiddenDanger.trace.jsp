<%@ page language="java" pageEncoding="UTF-8" %>
<%
    //动态数据功能暂时不添加
	//String dydaView = request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	//String outFilterStr = request.getParameter("outFilter")==null?"1=1":request.getParameter("outFilter").toString();
	String pid = request.getParameter("pid")==null?"":(request.getParameter("pid"));
	String pname = request.getParameter("pname")==null?"":(request.getParameter("pname"));
 %>
 <html>
	<head>
		<title>安全隐患跟踪</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
			.button-cqjc {background: #FFFF00;}
			.button-zgwc {background: #92D050;}
			.button-wzg  {background: #FF0000;}
		</style>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/pcAqgkService.js'></script>
		<script type="text/javascript">
			var pid = "<%=pid%>";
			var pname = "<%=pname%>";
			
			if(pid==null || pid=="" || pname==null || pname==''){
				pid = CURRENTAPPID;
				pname = CURRENTAPPNAME;
			}
			else
			{
				ModuleLVL = 6;  //其他页面跳转到该页面，只具有查询全乡
			}
			/**
				var dydaView=eval("<!--%=dydaView%-->");
				if(dydaView){
					ModuleLVL=6;
				}
				var outFilter = "<!--%=outFilterStr%-->";
			*/
			
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/util.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/aqgk/baseInfoInput/pc.aqgk.hiddenDanger.trace.js"></script>
	</head>
	<body >
	<span></span>
		<form action="" id="formAc" method="post" name="formAc"></form>
		<div id="loading-mask" style="display:none"></div>
		<div id="loading" style="display:none">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
	</body>
</html>