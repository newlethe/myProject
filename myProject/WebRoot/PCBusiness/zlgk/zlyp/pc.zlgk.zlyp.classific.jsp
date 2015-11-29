<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
  <head>
    <title>质量验评分类维护页面</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
  </head>
     <script type="text/javascript">
		var PID = CURRENTAPPID;
	 </script>
  <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src="dwr/interface/equMgm.js"></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/zlgkMgm.js'></script>
  <!-- EXTEND -->	
  
  <!-- treegrid -->
  		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
  
  <!--PAGE -->
        <script type='text/javascript' src='PCBusiness/zlgk/zlyp/pc.zlgk.zlyp.classific.tree.js'></script>
        <script type='text/javascript' src='PCBusiness/zlgk/zlyp/pc.zlgk.zlyp.classific.js'></script>
  <body>
     <div id='fileFrame'></div>
  </body>
</html>
