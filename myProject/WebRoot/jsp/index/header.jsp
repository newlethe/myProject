<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

	<%
		String imagePath = request.getContextPath()
				+ "/jsp/res/images/header";
	%>


	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<title>HOME</title>
		<style type="text/css" media="screen">
body {
	margin: 0;
	padding: 0;
	background: #F4F5F5;
}

div,h1,h2,h3,h4,p,form,label,input,textarea,img,span {
	margin: 0;
	padding: 0;
}

ul {
	margin: 0;
	padding: 0;
	list-style-type: none;
	font-size: 0;
}

.spacer {
	clear: both;
	font-size: 0;
	line-height: 0;
}

#top_bg {
	background: url(<%=imagePath%>/top_bg.jpg) 0 0 repeat-x;
	width: 100%;
	height: 82px;
	display: block;
}

.top_bg1 {
	background: url(<%=imagePath%>/top_logo.jpg) top left no-repeat;
	height: 82px;
	margin: 0;
	padding: 0;
	display: block;
}

.top_bg1 .right_nav {
	background: url(<%=imagePath%>/top_right_bg.jpg) no-repeat;
	width: 297px;
	height: 43px;
	float: right;
	padding: 59px 0 0 40px;
}

.top_bg1 .right_nav a {
	display: block;
	font: 12px/ 18px Arial, Helvetica, sans-serif;
	text-decoration: none;
	color: #000000;
}

.top_bg1 .right_nav a:hover {
	color: #fff;
	text-decoration: underline;
}
</style>

	</head>
	<body>
		<div id="top_bg">
			<div class="top_bg1">
				<div class="right_nav">
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td width="7%" align="left" valign="middle">
								<img src="<%=imagePath%>/tb_sy.png" alt="" width="16"
									height="16" />
							</td>
							<td width="10%" align="left" valign="middle">
								<a href="<%=request.getContextPath()%>/jsp/index/portal2.jsp"
									target="contentFrame">首页</a>
							</td>
							<td width="2%" align="left" valign="middle">
								&nbsp;
							</td>
							<td width="7%" align="left" valign="middle">
								<img src="<%=imagePath%>/tb_sy.png" alt="" width="16"
									height="16" />
							</td>
							<td width="10%" align="left" valign="middle">
								<nobr><a id='changePid' href="javascript:void(0)" title="切换项目" onclick="parent.changeCurrentPID()" style="width:38px;overflow:hidden; text-overflow:ellipsis"></a></nobr>
							</td>
							<td width="2%" align="left" valign="middle">
								&nbsp;
							</td>
							<td width="7%" align="left" valign="middle">
								<img src="<%=imagePath%>/tb_xg.png" alt="" width="16"
									height="16" />
							</td>
							<td width="20%" align="left" valign="middle">
								<a href="javascript:void(0)" onclick="parent.modifyPwd()">修改密码</a>
							</td>
							<td width="1%" align="left" valign="middle">
								&nbsp;
							</td>
							<td width="6%" align="left" valign="middle">
								<img src="<%=imagePath%>/tb_bz.png" alt="" width="16"
									height="16" />
							</td>
							<td width="10%" align="left" valign="middle">
								<a href="javascript:void(0)" onclick="parent.showHelp()">帮助</a>
							</td>
							<td width="2%" align="left" valign="middle">
								&nbsp;
							</td>
							<td width="7%" align="left" valign="middle">
								<img src="<%=imagePath%>/tb_zx.png" alt="" width="16"
									height="16" />
							</td>
							<td width="15%" align="left" valign="middle">
								<a href="javascript:void(0)" onclick="parent.logout()">注销</a>
							</td>
							<td width="5%" align="left" valign="middle">
								&nbsp;
							</td>
						</tr>
					</table>

				</div>
			</div>
		</div>
	</body>
</html>

<script>
	changePnameFun(parent.CURRENTAPPNAME);
	function changePnameFun(pname) {
		document.getElementById("changePid").innerHTML = pname;
		var pidDataArr = new Array();
		var pidArr = parent.USERPIDS.split(",");
		if(pidArr.length>1){
			document.getElementById("changePid").title = pname + "【切换项目】"
		} else {
			document.getElementById("changePid").title = pname;
		}
	}
</script>