<%@ page language="java" pageEncoding="UTF-8"%>
<%
String type = (String)request.getParameter("type");
String url = "";
String setPage = "";
if (!"".equals(type)){
	if ("search".equals(type)) setPage = "warn.search.index.jsp";
	if("dowith".equals(type))  setPage = "warn.dowith.index.jsp";
	if("manager".equals(type))  setPage = "warn.manager.index.jsp";
	url = setPage;
}
%>
<div>
    <iframe id="dispatcher" src="PCBusiness/warn/dowithmanager/<%=url%>" style="width:100%; height:100%" frameborder="0"></iframe>
</div>