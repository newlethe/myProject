<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String url = (String)request.getParameter("url");
	String strParams = (String)request.getParameter("params");
	String funname = (String)request.getParameter("funname");
	String business = (String)request.getParameter("business");
	String method = (String)request.getParameter("method");
	String table = (String)request.getParameter("table");
	String[] params = strParams.split("`");
	StringBuilder sb = new StringBuilder("Business/"+url+"?");
	for(int i=0; i<params.length; i++){
		String[] param = params[i].split(":");
		if (i != 0) sb.append("&");
		if (param[2].equals("float")){
			sb.append(param[0]+"="+param[1]);
		} else {
			sb.append(param[0]+"="+param[1]+"");
		}
	}
	sb.append("&funname='"+funname+"'");
	sb.append("&business='"+business+"'");
	sb.append("&method='"+method+"'");
	sb.append("&table='"+table+"'");
	sb.append("&isView=true");
%>
<iframe src="<%=sb.toString()%>" style="width:100%; height:100%;" frameborder="0"></iframe>