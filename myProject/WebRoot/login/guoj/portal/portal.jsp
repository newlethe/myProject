<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@page import="com.sgepit.frame.sysman.hbm.SysPortletConfig"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.util.JSONUtil"%>
<%
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
List<RockPower> fastModules = systemMgm.getFastModulesByUserId((String)session.getAttribute(Constant.USERID));
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<link rel="stylesheet" type="text/css"
			href="../res/css/index.styles.css"></link>
		<link rel="stylesheet" type="text/css" href="../res/css/style.css" />
		<style>
			tr.row0 {
				height: 26px;
			}
			
			p {
				text-indent: 24px;
			}
			
			li.li0 {
				line-height: 19px;
				margin-top: 5px;
				background: url('../res/images/index/docs.gif') no-repeat;
				text-indent: 20px;
			}
			img.subsystem {
				width: 180px;
				height: 150px;
				cursor: hand;
			}
	
		</style>

	</head>

	<body>
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="loading-indicator">
				<br>
				<br>
				&nbsp;&nbsp;&nbsp;
				<img src="<%=request.getContextPath()%>/login/guoj/images/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle">
				页面加载中...
			</div>
		</div>
		<!-- include everything after the loading indicator -->
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<script>
		var portletConfigObj = new Array();
		var maxColIdx = 3;
		var temp
		var clientHeight   = document.body.offsetHeight;
		portletConfigObj.push({portletCode:'newsPic',portletName:'图片新闻',colIdx:'1',rowIdx:'1',ph:(clientHeight*0.67), header: false})		
		portletConfigObj.push({portletCode:'news',portletName:'国锦煤电新闻',colIdx:'2',rowIdx:'1',ph:(clientHeight*0.63), header: false})		
		portletConfigObj.push({portletCode:'todoList',portletName:'待办事项',colIdx:'3',rowIdx:'1',ph:(clientHeight*0.64), header: false})
		portletConfigObj.push({portletCode:'Messages',portletName:'提示窗口',colIdx:'1',rowIdx:'2',ph:(clientHeight*0.33), header: false})
		portletConfigObj.push({portletCode:'infos',portletName:'消息提醒',colIdx:'2',rowIdx:'2',ph:(clientHeight*0.44), header:false})	
		portletConfigObj.push({portletCode:'links',portletName:'常用链接',colIdx:'3',rowIdx:'2',ph:(clientHeight*0.38), header: false})	
		
		
		for(var i=0; i<portletConfigObj.length; i++){
			var str = "var "+portletConfigObj[i]["portletCode"]+" = {title:'" + portletConfigObj[i]["portletName"] + "',"
			str += "height: " + portletConfigObj[i]["ph"] + ","
			str += "header: " + portletConfigObj[i]["header"] + ","
			str += "html: \"\"}"
			eval(str);
		}
		</script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/extExtend/Portal.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/extExtend/PortalColumn.js"></script>
		<script type="text/javascript">
			Ext.ux.Portlet = Ext.extend(Ext.Panel, {
			    anchor: '100%',
			    frame:true,
			    collapsible:true,
			    draggable:false,
			    cls:'x-portlet'
			});
			Ext.reg('portlet', Ext.ux.Portlet);		
		</script>
		<link rel="stylesheet" type="text/css"
			href="/ext2/examples/portal/portal.css" />
		<link rel="stylesheet" type="text/css"
			href="/ext2/examples/portal/sample.css" />
		<script type='text/javascript' src='<%=path %>/dwr/interface/ComFileManageDWR.js'></script>
		<script src='<%=path %>/dwr/interface/fileServiceImpl.js'></script>
		<script src='<%=path %>/dwr/engine.js'></script>
		<script type="text/javascript" src="<%=path%>/business/jsp/common/file/fileupload.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/login/guoj/rowLayout.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/login/guoj/info.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/login/guoj/flow.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/login/guoj/portal/portal.js"></script>
	</body>
</html>
