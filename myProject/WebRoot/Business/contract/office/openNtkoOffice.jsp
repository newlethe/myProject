<%@ page language="java" pageEncoding="UTF-8" %>
<html>
	<HEAD>
		<title>office文件</title>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	 <body>	
			<div id="ocxDic">
				<table id="ocxTab" width=100% height=100% border=0 cellpadding=0 cellspacing=0 style="overflow-y: hidden;display:none;">
					<tr width=100%>
						<td width=100% valign="top">
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
							<!-- 以下函数相应控件的两个事件:OnDocumentClosed,和OnDocumentOpened -->
							<script language="JScript" for=TANGER_OCX event="OnDocumentClosed()">
								TANGER_OCX_OnDocumentClosed();
							</script>
							<script language="JScript" for=TANGER_OCX event="OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj)">
								TANGER_OCX_OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj);
								//TANGER_OCX_SetDocUser(_realname);
								//TANGER_OCX_SetMarkModify(false);
								//TANGER_OCX_ShowRevisions(true);
								//TANGER_OCX_EnableReviewBar(true);
							</script>
						</td>
					</tr>
				</table>
			</div>	 
		<script type="text/javascript" src="<%=basePath%>/Business/contract/office/tangerocx.js"></script>		
		<script type="text/javascript" src="<%=basePath%>/Business/contract/office/Constants.js"></script>						
		<script type="text/javascript">
		var fileid='<%=request.getParameter("fileid")== null ? "" : request.getParameter("fileid")%>';
		//alert(fileid);
		
		var sql = "select BLOB from APP_BLOB where FILEID ='" + fileid+ "'";
		baseDao.getData(sql,function(list){
			if(list!=null&&list.length>0){
				setTimeout("openDoc()",1000);
			}else{
				setTimeout("crossOpenDoc()",1000);
			}
		});
		//增加在线跨域打开word功能
		function crossOpenDoc(){
			displayOCX(true);
			var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet?ac=loadDoc&fileid=" + fileid + "&pid=" + CURRENTAPPID;
			TANGER_OCX_OpenDoc(openUrl, fileid);
		}
		
		function openDoc(){
			displayOCX(true);
			TANGER_OCX_OpenDoc(CONTEXT_PATH+"/servlet/FlwServlet?ac=loadDoc", fileid);			
		}
		</script>		
	</body>
</html>