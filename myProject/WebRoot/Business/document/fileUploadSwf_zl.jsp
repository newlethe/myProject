<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.util.StringUtil"%>
<%
	String openType = request.getParameter("openType")==null?"open":(String)request.getParameter("openType");
	String fileType = request.getParameter("fileType")==null?"*.*":(String)request.getParameter("fileType");
	String businessId = request.getParameter("businessId")==null?"":(String)request.getParameter("businessId");
	String businessType = request.getParameter("businessType")==null?"RemarkFile":(String)request.getParameter("businessType");
	String compressFlag = request.getParameter("compressFlag")==null?"1":(String)request.getParameter("compressFlag");
	String fileSource = request.getParameter("fileSource")==null?"blob":(String)request.getParameter("fileSource");
	String fileSize = request.getParameter("fileSize")==null?"1048576":(String)request.getParameter("fileSize");
	String editable = request.getParameter("editable")==null?"true":(String)request.getParameter("editable");
	String beanName = request.getParameter("beanName")==null?"":(String)request.getParameter("beanName");
	String whereCondition = request.getParameter("whereCondition")==null?"":(String)request.getParameter("whereCondition");
	if(whereCondition.length()>0){
		whereCondition = "file_lsh in (" + StringUtil.transStrToIn(whereCondition, "`") + ")";
	}
 %>
<html>
	<head>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>文件上传</title>		
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/jsp/common/fileUploadMulti/css/SwfUploadPanel.css" />
		<script type="text/javascript" src='<%=path%>/dwr/engine.js'></script>
		<script type="text/javascript" src='<%=path%>/dwr/interface/fileServiceImpl.js'></script>
		<!-- Files needed for SwfUploaderPanel -->
		<script type="text/javascript" src="<%=path%>/jsp/common/fileUploadMulti/js/SwfUpload.js"></script>
		<script type="text/javascript" src="<%=path%>/jsp/common/fileUploadMulti/js/SwfUploadPanel.js"></script>
	</head>
	<body>
		<div id="grid" style="width: 400px;"></div>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm" style="display:none"> </form>
   		<iframe name="frm" frameborder="1" style="width: 0; height: 0" scrolling="auto" style="display:none"></iframe>   
		
	</body>
	<script type="text/javascript">		
		var console,openType = "";
		function setParmValue(){
			param = new Object()
			param.fileType = "<%=fileType%>"
			param.businessId = "<%=businessId%>"
			param.businessType = "<%=businessType%>"
			param.compressFlag = "<%=compressFlag%>"
			param.fileSource = "<%=fileSource%>"
			param.fileSize = "<%=fileSize%>"
			param.editable = <%=editable%>==true?true:false;
			param.beanName = "<%=beanName%>";
			param.whereCondition = "<%=whereCondition%>";
		}
		if("<%=openType%>" == "open"){
			try{
				param = window.dialogArguments
				if(param == null || param == ""){
					param = parent.parentParam
				}
			
			}catch(e){
			
			}
		}else{
			setParmValue()
		}
		window.onunload  = unloadWin;
		
		var businessId =  "test"
		var businessType =  "test"		
		var whereCondition = "transaction_Type='" +businessType + "' and transaction_Id = '" +  businessId + "'"
		var fileType = "*.*"
		var fileSize = "1048576"
		//var editable = true
		var uploader
		var compressFlag ="1";
		var fileSource="blob"
		var blobTable =(fileSource=="blob"? "sgcc_attach_blob": "")
		
		if(param != null){
			fileType = param.fileType
			businessId =  param.businessId
			businessType =  param.businessType			
			if(param.fileSize){
				fileSize = param.fileSize
			}
			if(param.whereCondition && param.whereCondition!=""){
				whereCondition = param.whereCondition
			} else{
				whereCondition = "transaction_Type='" +businessType + "' and transaction_Id = '" +  businessId + "'"
			}
			if(param.compressFlag){
				compressFlag = param.compressFlag
			}
			if(param.fileSource){
				fileSource = param.fileSource
			}			
			if(fileSource == "blob"){
				if(param.blobTable){
					blobTable = param.blobTable
				} 
			}
		}		
		
		if(!console) var console = {
		    log: function() {}
		}
		Ext.onReady(function() {
		
			String.prototype.trim = function() {
				return this.replace(/^\s+|\s+$/g,"");
			}
			uploader = new Ext.ux.SwfUploadPanel({
				renderTo: 'grid',
				width: 500,
				height: 300,
				upload_url: basePath + 'fileupload',
				flash_url: basePath +"/jsp/common/fileUploadMulti/js/swfupload.swf",
				single_file_select: false, 
				confirm_delete: false, 
				remove_completed: false, 
				whereStr: whereCondition
			});	 
		    var pageBar = new Ext.PagingToolbar({
					pageSize: 8,
		            beforePageText:"第",
			        afterPageText :"页,共{0}页",
		            store: uploader.getStore(),
		            displayInfo: true,
			        firstText: '第一页',  
			   		prevText: '前一页',  
			        nextText: '后一页',  
			        lastText: '最后一页',  
			        refreshText: '刷新',  
			        displayMsg: '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
		            emptyMsg: "无记录。"
			});
			pageBar.render(uploader.bbar);	
			if(!param.editable){
				uploader.addBtn.hide()
				uploader.delBtn.hide()
				uploader.endCharBtn.hide()
				uploader.progress_bar.hide()
			}
			
			uploader.on('swfUploadLoaded', function() { 
				this.addPostParam('method', 'fileUploadMulti');
				this.addPostParam('pk', businessId);
				this.addPostParam('type', businessType);
				this.addPostParam('compress', compressFlag);
				this.addPostParam('filesource', fileSource);
				this.addPostParam('tableName', blobTable);
				
			});	
			uploader.on('fileUploadComplete', function(panel, file, response) {
						
			});	
			//上传成功后进行业务操作(如进行数据交互等)
			uploader.on('fileUploadSuccess', function(panel, file, data) {
				if(openType=="open"){
					if(param.uploadSuccess&&(typeof param.uploadSuccess =="function")){
						param.uploadSuccess(data.fileLsh, businessId, businessType, blobTable, param.beanName)
					}
				}else{
					if(parent.uploadSuccess&&(typeof parent.uploadSuccess=="function")){
						parent.uploadSuccess(data.fileLsh, businessId, businessType, blobTable, param.beanName)
					}
				}	
			});	
			//文件删除成功后进行业务操作(如进行数据交互等)
			uploader.on('deleteFiles', function(panel, fidArr) {
				if(openType=="open"){
					if(param.deleteSuccess&&(typeof param.deleteSuccess =="function")){
						param.deleteSuccess(fidArr,businessId, businessType, blobTable, param.beanName)
					}
				}else{
					if(parent.deleteSuccess&&(typeof parent.deleteSuccess=="function")){
						parent.deleteSuccess(fidArr,businessId, businessType, blobTable, param.beanName)
					}
				}	
			});	
			uploader.store.load({params:{start:0,limit: 8}})
			
			viewport = new Ext.Viewport({
				layout:'fit',
				items:[uploader]
			});
			
		});
		
		
		function getReturnValue(){
			var storeAttach = uploader.getStore()
			var totalCount = storeAttach.getCount()

			var bussinessIdArr = new Array();
			for(var i=0;i<totalCount;i++ ){
				//已上传				
				if(storeAttach.getAt(i).get("status") == "2"){
					bussinessIdArr.push(storeAttach.getAt(i).get("fileLsh"));
				}				
			}
			if(bussinessIdArr.length>0){
				return bussinessIdArr.join(",");
			} else{
				return "";
			}
		}
		
		function unloadWin(){
			if ( ! window.returnValue ){//文件管理的编辑窗口需要自己定义返回值
				window.returnValue = getReturnValue();
			}
			
		}
		function downFile(val){
			var openUrl = basePath + "filedownload?method=fileDownload&id=" + val;
			document.all.formAc.action = openUrl
			document.all.formAc.submit()
		}
			
</script>


</html>
