<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.jspsmart.upload.*"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
SmartUpload su=new SmartUpload();
su.initialize(pageContext);
su.setContentDisposition(null);
su.downloadFile("jsp/index/plug/gjmdPlug.rar");
out.clear();
out = pageContext.pushBody();
%> 