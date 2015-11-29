<%@ page language="java" pageEncoding="UTF-8"%>
<%
String pageType = (String)request.getParameter("page");
String url = "";
String setPage = "";
if (!"".equals(pageType)){
	if ("tree".equals(pageType)) {
		setPage = "mat.appbuy.app.tree.jsp?appid="+(String)request.getParameter("appid")+"&type=apply";
	} else if ("buy".equals(pageType)) {
		setPage = "mat.appbuy.buy.select.jsp?buyId="+(String)request.getParameter("buyId");
	} else if ("form".equals(pageType)) {
		setPage = "mat.appbuy.form.select.jsp?formId="+(String)request.getParameter("formId");
	} else if("storein1".endsWith(pageType)){//从合同中选择
		//setPage = "mat.tree.con.select.jsp?conid="+(String)request.getParameter("conid")+"&appid="+(String)request.getParameter("appid")+"&type=apply";
		setPage = "mat.store.in.selectConMat.jsp?conid="+(String)request.getParameter("conid")+"&appid="+(String)request.getParameter("appid")+"&type=apply";
	} else if("storein2".endsWith(pageType)){
		//setPage = "mat.appbuy.app.tree.jsp?&type=storeIn&inId="+(String)request.getParameter("inId");
		setPage = "mat.store.in.selectWz.jsp?&type=storeIn&inId="+(String)request.getParameter("inId");
	} else if("storein3".endsWith(pageType)){
		setPage = "mat.store.in.select.jsp?&type=storeIn&inId="+(String)request.getParameter("inId");
	} else if("storein4".endsWith(pageType)){
		setPage = "mat.goods.check.select.jsp?type=storeIn&inId="+(String)request.getParameter("inId");
	} else if("storein5".endsWith(pageType)){//从采购计划中选择
		//setPage = "mat.store.plan.select.jsp?type=storeIn&inId="+(String)request.getParameter("inId");
		setPage = "mat.store.plan.select.jsp?inId="+(String)request.getParameter("inId")+"&type=storeIn";
	}
	url = setPage;
}
%>
<div>
    <iframe src="Business/material/<%=url%>" style="width:100%; height:100%" frameborder="0"></iframe>
</div>
<script>
</script>