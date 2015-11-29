<%@ page language="java" pageEncoding="UTF-8"%>
<%
String type = (String)request.getParameter("type");
String conid = (String)request.getParameter("conid");
String url = "";
String setPage = "";
if (!"".equals(type)){
	if ("pay".equals(type)) setPage = "cont.payInfo.grid.view.jsp";
	if ("change".equals(type)) setPage = "cont.change.grid.view.jsp";
	if ("breach".equals(type)) setPage = "cont.breach.grid.view.jsp";
	if ("compensate".equals(type)) setPage = "cont.compensate.grid.view.jsp";
	if ("balance".equals(type)) setPage = "cont.balance.grid.view.jsp";
	url = setPage + "?conid='" + conid + "'";
}
%>

<div>
    <iframe src="Business/contract/<%=url%>" style="width:100%; height:100%" frameborder=no></iframe>
</div>