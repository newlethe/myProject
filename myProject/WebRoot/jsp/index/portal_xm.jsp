<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@page import="com.sgepit.frame.sysman.hbm.SysPortletConfig"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.util.JSONUtil"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
List<RockPower> fastModules = systemMgm.getFastModulesByUserId((String)session.getAttribute(Constant.USERID));
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<link rel="stylesheet" type="text/css"
			href="../res/css/index.styles.css"></link>
		<link rel="stylesheet" type="text/css" href="../res/css/style.css" />
	</head>
	<body>
	</body>
</html>
<script>
   var northpanel = new Ext.Panel({
   		title: '三维系统',//标题
        autoWidth:true,
        height:document.body.clientHeight,
        html: '<iframe name="contentFrameSw" width="100%" height="100%" frameborder="0" style="border-style:SOLID;border-width:0 0 0 0;" src="swxt.html"></iframe>'
       });
   var panel = new Ext.Panel({
   		title: '综合查询',//标题
        autoWidth:true,
        html: '<iframe name="contentFrameQu" width="100%" height="100%" frameborder="0" style="border-style:SOLID;border-width:0 0 0 0;" src=""></iframe>'
   });
   var panelAll = new Ext.Panel({
   		//title: '三维系统及综合查询',//标题
        region: 'center',//这个panel显示在html中id为container的层中
        autoWidth:true,
        height:document.body.clientHeight,
       // layout:'accordion',
        layout:'fit',
        items:[panel]
   });
   	new Ext.Viewport({
		layout:'border',
		items:panelAll
		});
</script>