<%@ page contentType="text/html;charset=UTF-8" %>
<%
String fileid = (String)request.getParameter("fileid");
System.out.print(fileid);
String filename = (String)request.getParameter("filename");
System.out.print(filename);
%>
 <html>
	<head>
		<title>待办事项处理</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script language="javascript" src="tangerocx.js"></script>
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var _basePath = '<%=basePath%>';
			var _fileid = '<%=fileid%>';
			var _filename = '<%=filename%>';
		</script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<div id="ocxDic">
			<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404" 
				codebase="<%=basePath%><%=Constant.NTKOCAB%>" background-color='red' width="100%" 
				height="100%">
		        <param name="BorderStyle" value="0">
			 	<param name="BorderColor" value="14402205">   
			 	<param name="Menubar" value="false">     
			 	<param name="TitleBar" value=false>
			 	<param name="FileNew" value="false">
			 	<param name="FileOpen" value="false">
			 	<%=Constant.NTKOCOPYRIGHT%>
				<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
			</object>
		</div>
	</body>
	<script type="text/javascript">
		window.onload = init;
		function init() {
			TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _fileid);
		}
	</script>
</html>