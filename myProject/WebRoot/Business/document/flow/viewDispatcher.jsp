<%@ page language="java" pageEncoding="UTF-8"%>
<%
String type = (String)request.getParameter("type");
String _insid = (String)request.getParameter("INSID");
String url = "";
String setPage = "";
if (!"".equals(type)){
	if ("flowed".equals(type)) setPage = "flw.ins.flowed.jsp?INSID="+_insid;
	url = setPage;
}
%>
<div>
    <iframe id="viewDispatcher" src="Business/document/flow/<%=url%>" style="width:100%; height:100%" frameborder="0"></iframe>
</div>
