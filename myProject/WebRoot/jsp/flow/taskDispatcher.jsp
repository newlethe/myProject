<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String url = (String)request.getParameter("url");
	String strParams = (String)request.getParameter("params");
	String funname = (String)request.getParameter("funname");
	String business = (String)request.getParameter("business");
	String method = (String)request.getParameter("method");
	String table = (String)request.getParameter("table");
	String faceid = (String)request.getParameter("faceid");
	StringBuilder sb = new StringBuilder();
	if(url.lastIndexOf("?")>-1){
		sb.append("Business/"+url+"&");
	}else{
		sb.append("Business/"+url+"?");
	}
	
	if (!strParams.equals("")) {
		String[] params = strParams.split("`");
		for(int i=0; i<params.length; i++){
			String[] param = params[i].split(":");
			if (i != 0) sb.append("&");
			if (param[2].equals("float")){
				sb.append(param[0]+"="+param[1]);
			} else {
				sb.append(param[0]+"="+param[1]+"");
			}
		}
		sb.append("&");
	}
	sb.append("funname='"+funname+"'");
	sb.append("&business='"+business+"'");
	sb.append("&method='"+method+"'");
	sb.append("&table='"+table+"'");
	sb.append("&faceid="+faceid+"");
	sb.append("&isTask=true");
%>
<iframe src="<%=sb.toString()%>" style="width:100%; height:100%;" frameborder="0"></iframe>