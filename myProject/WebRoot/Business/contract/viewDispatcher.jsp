<%@ page language="java" pageEncoding="UTF-8"%>
<%
String type = (String)request.getParameter("type");
String conid = (String)request.getParameter("conid");
String g_conname = (String)request.getParameter("conname")==null?"":(String)request.getParameter("conname");
String g_conno = (String)request.getParameter("conno");

String url = "";
String setPage = "";
if (!"".equals(type)){
	if ("pay".equals(type)) setPage = "cont.payInfo.grid.view.jsp";
	if ("change".equals(type)) setPage = "cont.change.grid.view.jsp";
	if ("breach".equals(type)) setPage = "cont.breach.grid.view.jsp";
	if ("compensate".equals(type)) setPage = "cont.compensate.grid.view.jsp";
	if ("balance".equals(type)) setPage = "cont.balance.grid.view.jsp";
	if ("conView".equals(type)) setPage = "cont.generalInfo.modelview.jsp";
	if ("adjunct".equals(type)) setPage = "cont.adjunct.upload.jsp";
	if ("conView".equals(type)){
		url = setPage + "?conid=" + conid;
	} else if ("adjunct".equals(type)){
		url = setPage + "?select=" + conid+"&conname=" +g_conname + "&conno=" + g_conno;
	} else {
		url = setPage + "?conid=" + conid;
	}
}
%>

<div>
    <iframe src="Business/contract/<%=url%>" style="width:100%; height:100%" frameborder=no></iframe>
</div>