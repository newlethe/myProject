<%@ page language="java" pageEncoding="UTF-8" %>
<html>
	<head>
		<title>Applet HTML Page</title>
		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwDefinitionMgm.js'></script>
	
		<!-- PAGE -->
		<script type='text/javascript'>
		</script>
		<script type='text/javascript' src='jsp/flow/flw.common.finish.js'></script>
		<script type='text/javascript'>
			function showOrHide(_obj, _id){
				var _tr = document.getElementById(_id);
				var _display = _tr.style.display;
				if ('none' == _display){
					_tr.style.display = 'block';
					_obj.className = 'trFurlBtn';
				} else {
					_tr.style.display = 'none';
					_obj.className = 'trUnFurlBtn';
				}
			}
		</script>

		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
			.trFurlBtn{
				background-image: url(jsp/res/images/tr-furl.gif) !important;
				background-repeat: no-repeat;
			}
			.trUnFurlBtn{
				background-image: url(jsp/res/images/tr-unfurl.gif) !important;
				background-repeat: no-repeat;
			}
			.viewTitle{
				font-weight: bold;
				white-space: nowrap;
				background: #f0f0f0;
				text-align: center;
				height: 22;
			}
		</style>
	</head>
<body>
	<span></span>
</body>
</html>
