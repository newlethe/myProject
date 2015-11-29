<%@ page language="java" pageEncoding="UTF-8"%><%
String modid = (String)request.getParameter("modid");
%>
<div>
    <iframe id="pageContentFrame" src="<%= request.getContextPath() %>/servlet/SysServlet?ac=loadmodule&modid=<%=modid %>" style="width:100%; height:100%" frameborder=no></iframe>
</div>