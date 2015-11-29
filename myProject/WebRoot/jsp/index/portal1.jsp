<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@page import="com.sgepit.frame.sysman.hbm.SysPortletConfig"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.base.Constant"%>
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


	<body>
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="loading-indicator">
				<br>
				<br>
				&nbsp;&nbsp;&nbsp;
				<img src="../res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle">
				页面加载中...
			</div>
		</div>
		<!-- include everything after the loading indicator -->
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<script type="text/javascript" src="portal1.js"></script>
	</body>
</html>
