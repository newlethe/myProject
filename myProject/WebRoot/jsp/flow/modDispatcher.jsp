<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String action = (String)request.getParameter("action");
%>
<iframe src="jsp/<%=action%>" style="width:100%; height:100%; border: 1px dashed #15428b" frameborder="1" scrolling="yes"></iframe>