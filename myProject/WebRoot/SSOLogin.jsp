<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%
	String path = request.getContextPath();	
	String username = request.getParameter("UserCode")==null?"noUser":request.getParameter("UserCode").toString();
	String password = request.getParameter("UserPswd")==null?"notVerifyPwd":request.getParameter("UserPswd").toString();
 %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<head>
	<title><%=Constant.DefaultModuleRootName%></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body onload="init()" style="display:none">
	<form action="<%=path%>/servlet/SSOLogin">
		<table border=0 width=100% height=30%>
			<tr>
				<td class="text0">
					用户名
				</td>
				<td colspan=2>
					<input TABINDEX="1" name="username" class="text1">
				</td>
			</tr>
			<tr>
				<td class="text0">
					密
					<font style="color: #007D74"> </font>码
				</td>
				<td colspan=2>
					<input TABINDEX="2" name="password" class="text1" type="password" >
				</td>
			</tr>			
			<tr>
				<td colspan=3>
					<input type="button" value="登录" onclick="init()"/>
				</td>
			</tr>			
		</table>
	</form>

	<script language="JavaScript" type="text/JavaScript">	
	function init(){
		document.all.username.value = "<%=username%>"
		document.all.password.value = "<%=password%>"
		document.forms[0].submit()
	}
</script>