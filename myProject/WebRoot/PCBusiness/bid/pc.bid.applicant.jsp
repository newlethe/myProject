<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>投标人报名信息及预审结果</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<link rel="stylesheet" type="text/css" href="PCBusiness/bid/progressForm.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='extExtend/Spinner.js'></script>
		<script type='text/javascript' src='extExtend/SpinnerStrategy.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>	
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>	
		<script type="text/javascript">
		if(parent.dydaView)
		{
			ModuleLVL = '6';
			parent.outFilter[3] = 'TbUnitInfo'
		}
		var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
		//当前选中的招标内容id
		var bidContentId = '<%=request.getParameter("bidContentId") == null ? "" : request.getParameter("bidContentId") %>';
		//var bidContentId = '1';
		var type="applicant";
		</script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.DeptUser.common.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.progress.form.nodata.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.applicant.js"></script>
		
	
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
  <form action="" id="formAc" method="post" name="formAc"></form>
    <div></div>
  </body>
</html>
