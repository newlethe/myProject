<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
String businessType = (String)request.getParameter("businessType");
String uids = (String)request.getParameter("uids");
System.out.println(">>>>>>"+businessType);
%>
 <html>
	<head>
		<title>打印车辆申请信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script language="javascript" src="<%=basePath%>/jsp/flow/tangerocx.js"></script>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var _basePath = '<%=basePath%>';
			var businessType = '<%=businessType%>';
			var uids = '<%=uids%>';
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
			TANGER_OCX_OpenDoc(_basePath+"/servlet/VehicleServlet?ac=printData", businessType);
			var ocxBookMarks;//word中所包含的书签
			var bean = "com.sgepit.pmis.vehicle.hbm.VVehicleUseManagement"
			var tablename="vehicle_use_management"
			DWREngine.setAsync(false);
			baseDao.findById(bean,uids,function(obj){
				if (obj){
						printDataToFile(obj, tablename);
				}else{
					Ext.example.msg('提示','打印失败，请和管理员联系！');
				};
			})
			DWREngine.setAsync(true);
		}
		function printDataToFile(obj, table){
			table = table.toUpperCase();
			ocxBookMarks = TANGER_OCX_OBJ.activeDocument.BookMarks;
			var isSign = false;
			for (var o in obj){
				for (var i=0; i<ocxBookMarks.Count; i++){
					var bookmark = ocxBookMarks(i+1).Name;
					var temp=o.toUpperCase();
					if (bookmark == temp){
						if(null != obj[o]){
							if ( temp == 'USETIME' && obj[o].dateFormat ){
								obj[o] = obj[o].dateFormat('Y-m-d H:i');				
							}
							if ( temp == 'ISROUND'){
								obj[o] = obj[o]==1?"是":"否";			
							}
						}
						TANGER_OCX_OBJ.SetBookmarkValue(bookmark, obj[o]);
						isSign = true;
					}
				}
			}
			if (isSign){
				Ext.example.msg('提示', '数据打印成功！');
			} else {
				Ext.example.msg('打印失败', '该文档上没有需要打印的数据位！');
			}
		}
	</script>
</html>