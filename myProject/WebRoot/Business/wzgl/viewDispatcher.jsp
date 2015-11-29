<%@ page language="java" pageEncoding="UTF-8"%>
<%
String pageType = (String)request.getParameter("page");
String url = "";
String setPage = "";
if (!"".equals(pageType)){
	if ("tree".equals(pageType)) {
		setPage = "mat.appbuy.app.tree.jsp?appid="+(String)request.getParameter("appid")+"&type=apply";
	} else if ("buy".equals(pageType)) {
		setPage = "stock/stockPlanSelect.jsp?buyId="+(String)request.getParameter("buyId");
	} else if ("buy_guoj".equals(pageType)) {
		setPage = "stock_guoj/stockPlanSelect.jsp?buyId="+(String)request.getParameter("buyId");
	} else if ("form".equals(pageType)) {
		setPage = "mat.appbuy.form.select.jsp?formId="+(String)request.getParameter("formId");
	} else if("storein1".endsWith(pageType)){
		setPage = "mat.tree.con.select.jsp?conid="+(String)request.getParameter("conid")+"&appid="+(String)request.getParameter("appid")+"&type=apply";
	} else if("storein2".endsWith(pageType)){
		setPage = "mat.appbuy.app.tree.jsp?&type=storeIn&inId="+(String)request.getParameter("inId");
	} else if("storein3".endsWith(pageType)){
		setPage = "mat.store.in.select.jsp?&type=storeIn&inId="+(String)request.getParameter("inId");
	} else if("storein4".endsWith(pageType)){
		setPage = "mat.goods.check.select.jsp?type=storeIn&inId="+(String)request.getParameter("inId");
	} else if("applyHz".endsWith(pageType)){
		setPage = "stock/stockPlanApplyHz.jsp?buyId="+(String)request.getParameter("buyId");
	}
	url = setPage;
}
%>
<div>
    <iframe src="Business/wzgl/<%=url%>" style="width:100%; height:100%" frameborder="0"></iframe>
</div>
<script>
</script>