<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<html>
	<head>
		<title>系统用户设置</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<script>
		var AppOrgRootId = '<%= Constant.APPOrgRootID %>';
		var AppOrgRootName = '<%= Constant.APPOrgRootNAME %>';
		var treedata = new Array();<%
		SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
		List<SgccIniUnit> orgs = systemMgm.getListedOrgs("0", true);
		for(int i=0; i<orgs.size(); i++){
			SgccIniUnit org = (SgccIniUnit)orgs.get(i);
			String first = org.getUpunit().equals("0") ? "1" : "0";
			out.println("treedata["+i+"] = [\"" + org.getUnitid() + "\", \"" + org.getUnitname() + "\", \"" + org.getLeaf().toString() + "\", \"" + org.getUpunit() + "\", \"" + first + "\", \"\"];");
		}
		%>
		</script>
		<script src='dwr/engine.js'></script>
		<script src='dwr/interface/baseDao.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script type="text/javascript" src="jsp/flow/flw.user.setting.js"></script>
		<style>
			#user-grid-panel {border-left:1px solid #99bbe8;}
			#user-grid-panel {border-right:1px solid #99bbe8;}
			#main-panel {border-left:1px solid #99bbe8;}
			#posi-grid-panel {border-bottom:1px solid #99bbe8;}
			#role-grid-panel {border-top:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>