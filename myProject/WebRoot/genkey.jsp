<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sgepit.frame.base.Constant"%>
<%
	String src = request.getParameter("src")==null?"":request.getParameter("src").toString();
String des = "";
if (src.length()>0) {
	des = com.sgepit.frame.util.DESUtil.encryStr(src);
}
%>
<body>
<form action="genkey.jsp" method="post">
<table height="100%" width="100%" border="0">
<tr height="40%" align="left" valign="top">
<td>明文:<input type="text" name="src" value="<%=src%>" size="20"/><br>
密文:<input type="text" name="des" value="<%=des%>" size="40"/><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="submit" name="submit" value="提交"/>
</td>
</tr>
<tr>	
	ROOT_APP=<%=Constant.propsMap.get("ROOT_APP")%>
	DOMAIN=<%=Constant.propsMap.get("DOMAIN")%>
	AppRoot =<%=Constant.AppRoot%>
</tr>
</table>
</form>
</body>