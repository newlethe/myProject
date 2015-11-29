<%@ page language="java" pageEncoding="UTF-8"%>
<%
String type = (String)request.getParameter("type");
String conid = (String)request.getParameter("conid");
String conname = (String)request.getParameter("conname")==null?"":(String)request.getParameter("conname");
String conno = (String)request.getParameter("conno");

String url = "";
String setPage = "";
if (!"".equals(type)){
	if ("adjunct".equals(type)) setPage = "cont.files.view.jsp";
	if ("conView".equals(type)){
		url = setPage + "?conid=" + conid;
	} else if ("adjunct".equals(type)){
		url = setPage + "?select=" + conid+"&conname=" + conname + "&conno=" + conno;
	} else {
		url = setPage + "?conid=" + conid;
	}
}
%>

<div>
    <iframe src="Business/contract/<%=url%>" style="width:100%; height:100%" frameborder=no></iframe>
</div>