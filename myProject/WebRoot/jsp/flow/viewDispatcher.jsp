<%@ page language="java" pageEncoding="UTF-8"%>
<%
String type = (String)request.getParameter("type");
String url = "";
String setPage = "";
if (!"".equals(type)){
	if ("task".equals(type)) setPage = "flw.wait.info.jsp";
	else if ("worked".equals(type)) setPage = "flw.worked.info.jsp";
	else if ("action".equals(type)) setPage = "flw.action.info.jsp";
	else if ("finish".equals(type)) setPage = "flw.finish.info.jsp";
	else if ("ins".equals(type)) setPage = "flw.new.action.jsp";
	else if ("inszlyp".equals(type)) setPage = "zlyp/flw.new.action.jsp";
	else if ("flow".equals(type)) setPage = "flw.addorupdate.view.jsp";
	else if ("form".equals(type)) setPage = "flw.repeat.form.jsp";
	else if ("common".equals(type)) setPage = "flw.common.node.info.jsp";
	else if ("bookmark".equals(type)) setPage = "flw.bookmark.config.jsp";
	else if ("uploadSign".equals(type)) setPage = "flw.upload.sign.jsp";
	else if ("uploadAdjunct".equals(type)) setPage = "flw.adjunct.upload.jsp";
	else if ("flowing".equals(type)) setPage = "flw.ins.flowing.jsp";
	else if ("flowed".equals(type)) setPage = "flw.ins.flowed.jsp";
	else if ("commonConfig".equals(type)) setPage = "flw.common.node.config.jsp";
	else if ("flwInfo".equals(type)) {
		String insid = (String)request.getParameter("insid");
		setPage = "flw.info.fromdata.jsp?insid="+insid;
	}
	else if("zlypflowing".equals(type)) setPage="zlyp/flw.ins.flowing.jsp";
	else if("zlypflowed".equals(type)) setPage="zlyp/flw.ins.flowed.jsp";
	url = setPage;
}
%>
<div>
    <iframe id="viewDispatcher" src="jsp/flow/<%=url%>" style="width:100%; height:100%" frameborder="0"></iframe>
</div>
