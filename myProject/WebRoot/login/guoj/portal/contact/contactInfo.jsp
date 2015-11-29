<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
	<head>
		<link href="contactInfo.css" rel="stylesheet" type="text/css">
		<%
			List nameList = new ArrayList();
			List urlList = new ArrayList();
			int count = 0;
			if (Constant.propsMap.get("LINKNUM") != null) {
				count = Integer.parseInt(Constant.propsMap.get("LINKNUM"));
			}
			for (int c = 1; c <= count; c++) {
				String LINK = Constant.propsMap.get("LINK" + c);
				String array[] = LINK.split(Constant.SPLITA);
				nameList.add(array[0]);
				urlList.add(array[1]);
			}
		%>
		<script type="text/javascript">
function openContact(url) {
	if (url) {
		var h = window.screen.height;
		var w = window.screen.weight;
		window.open (url, "", "width='"+w+"',height='"+h+"',resizable=yes,top=0,left=0");
		
	} else {
		parent.window.alert("暂无通讯录的信息!");
	}
}
</script>
<STYLE type=text/css>
			.green12 {
				FONT-SIZE: 16px;
				LINE-HEIGHT: 100%;
				FONT-FAMILY: "宋体";
				padding: 1px;
				TEXT-DECORATION: none
			}
</STYLE>
	</head>
	<body>
		<table width="100%" height="100%" border="0" align="center">
			<tr>
				<td>
					<table cellpadding="0" cellspacing="15" border="0" width="100%">
						<tr class='middle-portlet-table-list'>
							<%
								for (int i = 0; i < nameList.size(); i++) {
							%>



							<td width='10'>
								<img src='../res/list.gif'>
							</td>
							<td align='left' width='55%'>
								<a class=green12 style='color:blue;cursor:hand'  href='javascript:openContact("<%=urlList.get(i)%>");'> <%=nameList.get(i)%>
								</a>
							</td>



							<%
								if (i % 2 == 1) {

										if (i < nameList.size()) {
							%>
						</tr>
						<tr class='middle-portlet-table-list'>
							<%
								} else {
							%>
						</tr>
						<%
							}

								}

							}
							if (nameList.size() % 2 == 1) {
						%>

						<td>
							&nbsp;
						</td>
						
						<td>
							&nbsp;
						</td>
						</tr>

						<%
							}
						%>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>