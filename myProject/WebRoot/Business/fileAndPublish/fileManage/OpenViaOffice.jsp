<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
		<base href="<%=basePath%>">


		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
		<title>在线文档编辑</title>
		<script type="text/javascript">
		
			
			//文件主键(uids)
			var filePk = '<%=request.getParameter("filePk")%>';
			//文件流水号(fileLsh)
			var fileLsh = '<%=request.getParameter("fileLsh")%>';
			//是否可编辑
			var editable = <%=request.getParameter("editable")%>;
			//文件名
			var fileName = '<%=request.getParameter("fileName")%>';
			//文件后缀名
			var fileSuffix = '<%=request.getParameter("fileSuffix")%>';
			
			var wordOcx;
			Ext.onReady(function(){
				//主文档部分
				try {
					wordOcx = document.getElementById('TANGER_OCX1');
					wordOcx.Titlebar = false;
					wordOcx.Menubar = false;
					wordOcx.Statusbar = false;
					wordOcx.Toolbars = true;
					
					wordOcx.FileNew = false;
					wordOcx.FileOpen = false;
					wordOcx.FileClose = false;
					wordOcx.FileSave = editable;
					wordOcx.FileSaveAS = true;
					wordOcx.FileProperties = false;
				} catch (err) {
					Ext.Msg.alert("菜单控制", err.description);
				}

			if((fileSuffix=="docx" && wordOcx.GetOfficeVer()!=12) ||(fileSuffix=="xlsx" && wordOcx.GetOfficeVer()!=12) ){
				ifOpenCorrect = false;
				Ext.Msg.alert("文件打开", "您的本机没有安装Office2007，无法打开该格式的文件！");
			} else if (fileSuffix=="docx" || fileSuffix=="doc" || fileSuffix == "xls" || fileSuffix == "xlsx" ) {
	
				try {
					wordOcx.OpenFromURL(CONTEXT_PATH + "/filedownload?method=fileDownload&id=" + fileLsh);
					} catch (err) {
										
						//alert(err);
						Ext.Msg.alert("文件打开", "文件不存在或您没有权限打开此文件！");
					}
					openDocType = wordOcx.DocType;
			}else {
								ifOpenCorrect = false;
								Ext.Msg.alert("文件打开", "系统不支持此类格式的文件！");
							}

			});
			
			function saveFile(){
			wordOcx.CancelLastCommand = true;
			//保存为office兼容模式
			if ( fileSuffix == "docx" )
				fileSuffix = "doc";
			else if ( fileSuffix == "xlsx" )
				fileSuffix = "xls";
			
			var saveUrl = CONTEXT_PATH + "/fileupload?method=fileBlobUpload&fileid="+ fileLsh +"&pk="+filePk+"&filesource=blob&type=FAPDocument&compress=0&tableName=sgcc_attach_blob";
			var saveFileName = fileName + "." + fileSuffix; 
				
			
			//wordOcx.SaveToURL(saveUrl, "filename1", null, encodeURIComponent(saveFileName));
			wordOcx.SaveAsOtherFormatToURL(5, saveUrl, "filename1", null, saveFileName);
			
		}
		</script>


	</head>

	<body>

		<object id="TANGER_OCX1"
			classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
			codebase="<%=basePath%>/<%=Constant.NTKOCAB%>" width="100%"
			height="100%" style="z-index: 50;">
			<param name="Menubar" value="0">
			<param name="Titlebar" value="0">
			<param name="IsShowToolMenu" value="0">
			<param name="IsShowInsertMenu" value="0">
			<param name="IsShowEditMenu" value="0">
			<param name="IsHiddenOpenURL" value="0">
			<param name="IsUseUTF8URL" value="1">
			<param name="IsUseUTF8Data" value="1">
			<%=Constant.NTKOCOPYRIGHT%>
			<SPAN STYLE="color: red"><br>不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
		</object>

		<SCRIPT language="JScript" for="TANGER_OCX1"
			event="OnFileCommand(cmd,cancel)">
	if(cmd==3) {
		saveFile();
	}
</SCRIPT>
	</body>
</html>
