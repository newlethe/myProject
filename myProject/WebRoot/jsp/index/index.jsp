<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.hbm.RockUser"%>
<%@ page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>


<html>
	<head>
		<title>工程项目管理系统</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

		<link rel="stylesheet" type="text/css" href="../res/css/index.styles.css"></link>
		<link rel="stylesheet" type="text/css" href="../res/css/style.css" />
		<!-- link rel="stylesheet" type="text/css" href="resources/style.css"></link> -->
		<style type="text/css">
			.c4 { background:url('../res/images/top_pmis.jpg') no-repeat}
		</style>
		<!-- GC -->
	</head>
	<body scroll="no" id="docs">
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="../res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...
			</div>
		</div>
		<!-- include everything after the loading indicator -->
		
		<script type="text/javascript">
			var treedata = new Array();  

			<%
				// 以下,必须放在包含golobalJs.jsp语句之后
				RockUser user = (RockUser)session.getAttribute(Constant.USER);
				//String realname = (String)session.getAttribute(Constant.USERNAME);
				
				//String unitname = (String)session.getAttribute(Constant.USERUNITNAME);
				String orginfo = (String)session.getAttribute(Constant.USERDEPTPOSNAME);
				
				String companyInfo = "";
				if(orginfo.length() == 0)
					companyInfo = unitname;
				else 
					companyInfo = unitname+"|"+orginfo.replace(',','|');
				
				SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
				HashMap<String, RockPower> modulesMap = (HashMap<String, RockPower>) session.getAttribute(Constant.USERMODULES);
				List<RockPower> modules = systemMgm.getListedModules(modulesMap, true);
				for(int i=0; i<modules.size(); i++){
					RockPower module = (RockPower)modules.get(i);
					String first = module.getParentid().equals(Constant.APPModuleRootID) ? "1" : "0";
					out.println("treedata["+i+"] = [\"" + module.getPowerpk() + "\", \"" + module.getPowername() + "\", \"" + module.getLeaf() + "\", \"" + module.getParentid() + "\", \"" + first + "\", \"" + module.getUrl() + "\", \"" + module.getLvl() + "\", \"" + module.getIconcls() + "\"];");
				}
				//单位类型
				String unitId = (String)session.getAttribute(Constant.USERUNITID);
			%>
			var companyInfo = '<%=companyInfo%>'
			var realname = '<%=realname %>'
			
			var defaultParentId = '<%= Constant.APPModuleRootID %>';
		</script>
		<script type="text/javascript" src="<%=basePath %>extExtend/TabCloseMenu.js"></script>
		<script type="text/javascript" src="index.js"></script>

		<div id="north" style="width: 100%; height:100%;" class="c4">
			<span class='top-icon'><%=companyInfo%> <img
					src="../res/images/shared/icons/user.png" align="absmiddle"></img><span>&nbsp;<%=realname %></span>&nbsp;
				<img src="../res/images/index/key.png" align="absmiddle"></img>&nbsp;<a href="#" style="color:white" onclick='modifyPwd()'>修改口令</a> 
				<img src="../res/images/index/docs.gif" align="absmiddle"></img>&nbsp;<a href="#" style="color:white" onclick='showHelp()'>帮助</a>
				<img src="../res/images/index/logout.gif" align="absmiddle"></img>&nbsp;<a href="#" style="color:white" onclick='logout()'>注销</a> </span>
				
				<% String rootname = Constant.DefaultModuleRootName; %>
		<!-- 	<div class="api-title">
				<sup>
					&copy;
				</sup>
			</div>
			
		 -->
		</div>

		<div id="classes"></div>

		<div id="main"></div>

	</body>
</html>
