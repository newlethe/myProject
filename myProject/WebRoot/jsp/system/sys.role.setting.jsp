<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
	
<html>
	<head>
		<title>系统角色设置</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script>
		var defaultParentId = '<%= Constant.APPModuleRootID %>';
		var ADMIN_ROLE_ID = '<%= Constant.ADMIN_ROLE_ID %>';
		var PUBLIC_ROLE_ID = '<%= Constant.PUBLIC_ROLE_ID %>';
		var ADMIN_ROLE_TYPE = '<%= Constant.ADMIN_ROLE_TYPE %>';
		var MANAGER_ROLE_TYPE = '<%= Constant.MANAGER_ROLE_TYPE %>';
		var PUBLIC_ROLE_TYPE = '<%= Constant.PUBLIC_ROLE_TYPE %>';
		var LEADER_ROLE_TYPE = '<%= Constant.LEADER_ROLE_TYPE %>';
		
		var ADMIN_ROLE_NAME = '<%= Constant.ADMIN_ROLE_NAME %>';
		var MANAGER_ROLE_NAME = '<%= Constant.MANAGER_ROLE_NAME %>';
		var PUBLIC_ROLE_NAME = '<%= Constant.PUBLIC_ROLE_NAME %>';
		var LEADER_ROLE_NAME = '<%= Constant.LEADER_ROLE_NAME %>';
		
		var basePath = '<%=basePath %>';
		var treedata = new Array();
		<%
			SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
			List<RockPower> modules = systemMgm.getListedModules("0", true);
			for(int i=0; i<modules.size(); i++){
				RockPower module = (RockPower)modules.get(i);
				String first = module.getParentid().equals(Constant.APPModuleRootID) ? "1" : "0";
				out.println("treedata["+i+"] = [\"" + module.getPowerpk() + "\", \"" + module.getPowername() + "\", \"" + module.getLeaf().toString() + "\", \"" + module.getParentid() + "\", \"" + first + "\", \"" + module.getUrl() + "\"];");
			}
		%>
		</script>
		<script src='dwr/interface/baseMgm.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
		<script type="text/javascript" src="<%=basePath%>extExtend/columnTreeNodeUI.js"></script>
		<script type="text/javascript" src="jsp/system/sys.role.setting.js"></script>
		<style>
			#grid-panel {border-left:1px solid #99bbe8;}
			#main-panel {border-left:1px solid #99bbe8;}
			#modules-tree-panel {border-left:1px solid #99bbe8;}
			#role-grid-panel {border-right:1px solid #99bbe8;}
			.trueImg {
				width: 16;
				height: 16;
				background:url(jsp/res/images/icon-complete.gif)
			}
			.falseImg {
				width: 16;
				height: 16;
				background:url(jsp/res/images/delete.gif)
			}			
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
