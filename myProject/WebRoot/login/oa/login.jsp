<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";	
%>
<!DOCTYPE html>
<html lang="zh" class="hb-loaded">
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1">
	<meta name="renderer" content="webkit">
	<title><%=Constant.DefaultModuleRootName%></title>
	<meta name="keywords" content="">
	<meta name="description" content="">
	<base href="<%=basePath%>" /><!--[if IE]></base><![endif]-->
    <link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-gray.css" />
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="common/MD5.js"></script>
	<link rel="stylesheet" href="login/oa/css/bootstrap.css" />
	<link rel="stylesheet" href="login/oa/css/common.css" />
	<link rel="stylesheet" href="login/oa/css/login.css" />
</head>
<body huaban_collector_injected="true">
<div id="wrapper">
	<div class="aw-login-box">
		<div class="mod-body clearfix">
			<div class="content pull-left">
				<h1 class="logo"><a href=""></a></h1>
				<h4>天楚意客户管理系统</h4>
				<form id="login_form" method="post" onsubmit="return false" action="#">
					<ul>
						<li>
							<input type="text" id="aw-login-user-name" class="form-control" placeholder="邮箱 / 用户名" name="username">
						</li>
						<li>
							<input type="password" id="aw-login-user-password" class="form-control" placeholder="密码" name="password">
						</li>
						<li class="alert alert-danger hide error_message">
							<i class="icon icon-delete"></i> <em></em>
						</li>
						<li class="last">
							<a href="javascript:;" onclick="doLogin()" id="login_submit" class="pull-right btn btn-large btn-primary">登录</a>
							<label>
								<input type="checkbox" name="recordLogin"> 记住我 </label>
						</li>
					</ul>
				</form>
			</div>
			<div class="side-bar pull-left"></div>
		</div>
		<div class="mod-footer">
			湖北天楚意商务信息咨询有限公司 版权所有
		</div>
	</div>
</div>
<script  type="text/JavaScript">
	var ServletUrl = "servlet/SysServlet";

	var indexPage = "jsp/index/index.jsp";
	
	var dt = new Date();

	function eventonkeydown(e){
		var theEvent = window.event || e;
	    var srcElement = theEvent.srcElement;
	    if (!srcElement) {
	       srcElement = theEvent.target;
	    }
		if(srcElement.name=="username" && theEvent.keyCode==13)
			doLogin()
		if(srcElement.name=="password" && theEvent.keyCode==13)
			doLogin()
		/*if(srcElement.name=="verifycode" && theEvent.keyCode==13)
			doLogin()*/
	}
	
	document.onkeydown = eventonkeydown;
	document.all.username.focus();

	var name = getCookie("username")
	var pwd = getCookie("password")
	
	if (name && name != "undefined" && pwd && pwd != "undefined")
	{
		document.all.username.value = name
		document.all.password.value = pwd
		//document.all.recordLogin.checked = true
	}
	
	function checkLogin()
	{
		document.all.username.value = Trim(document.all.username.value)
		document.all.password.value = Trim(document.all.password.value)
		//document.all.verifycode.value = Trim(document.all.verifycode.value)
		if (document.all.username.value == "" || document.all.password.value == "" )//|| document.all.verifycode.value == ""
		{
			alert("请输入用户名、密码！")
			return false
		}
		
		/*
		if(document.all.recordLogin.checked)
		{
			setCookie("username", document.all.username.value)
			setCookie("password", document.all.password.value)
		}
		else
		{
			setCookie("username", "")
			setCookie("password", "")
		}
		*/
		return true
	}
	
	function reset() {
		document.all.username.value = ""
		document.all.password.value = ""
		//document.all.verifycode.value = ""
		//document.all.recordLogin.checked = false 
	}
	
	function doLogin(){
		if(!checkLogin())
			return 
		var processbar = Ext.MessageBox.show({
			title: '请稍候...',
			msg: '登录中 ...',
			width:240,
			progress:true,
			closable:false
		});
		
		var t = 0;
		var f = function(){
			t = (t == 100) ? 0 : t+1;
			Ext.MessageBox.updateProgress(t/100, '');
		};
	    var timer = setInterval(f, 30);
	    
		Ext.Ajax.request({
			url: ServletUrl,
			params: {ac:'login',target:'window', username:document.all.username.value, password: MD5(document.all.password.value)},
	  		method: "POST",
	  		success: function(response, params) {
	  			var rspXml = response.responseXML;	  			
	  			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue
	  			if(msg == "ok"){
					/*
	  				if (document.all.recordLogin.checked){
						setCookie("username", document.all.username.value);
					} else {
						setCookie("username", "");
					}
					*/
					var indexJsp = rspXml.documentElement.getElementsByTagName("jsp").item(0).firstChild.nodeValue
					window.location.href = indexJsp;
	  			} else {
					window.clearInterval(timer);
					processbar.updateProgress(0, '');
					processbar.hide();
					
					//Ext.example.msg('登录失败！', msg, 0);
					Ext.MessageBox.show({
			           title: '登录失败！',
			           msg: msg,
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});
					document.all.username.focus();
	  			}
			},
			failure: function(response, params) {
				window.clearInterval(timer);
				processbar.updateProgress(0, '');
				processbar.hide();
		  		var msg = response.statusText;
		  		if (response.statusText == "" || "communication failure"){
		  			msg = "系统不能处理当前登录请求！可能是：<li>服务器已当机<li>网络故障，无法连接到服务器</span>";
		  		}
				Ext.MessageBox.show({
		           title: '登录失败！',
		           msg: msg,
		           width:300,
		           buttons: Ext.MessageBox.OK,
		           icon: Ext.MessageBox.ERROR
				});
			}
			
		})
	}
	
	function setCookie(sName, sValue)
	{
		dt.setYear(dt.getYear()+10)
		document.cookie = sName + "=" + stringToHex(des(key, sValue, 1, 0)) + "; expires=" + dt.toGMTString();
	}
	
	function getCookie(sName)
	{
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			//var aCrumb = aCookie[i].split("=");
			//if (sName == aCrumb[0])
			//return des(key, hexToString(aCrumb[1]), 0, 0);
		}
		return null;
	}

	function Trim(str)
	{
		return  str.replace(/(^\s*)|(\s*$)/g, "");
	}	
	
	//IE9中Script438: 对象不支持“createContextualFragment”属性或方法
	if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
	    Range.prototype.createContextualFragment = function(html) {
	        var frag = document.createDocumentFragment(),
	        div = document.createElement("div");
	        frag.appendChild(div);
	        div.outerHTML = html;
	        return frag;
	    };
	}
</script>
</body>
</html>