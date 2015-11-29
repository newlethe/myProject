<%@ page language="java" pageEncoding="UTF-8"%>
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
		<script type="text/javascript" src='<%=path%>/dwr/interface/db2Json.js'></script>
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
		/*
			parem.businessType: 业务文档的类型 ：（必选项）
			parem.businessId: 业务表的主键：（可选项，设置为""，表示新增要新增业务记录）			
			param.fileType: 允许上传的文件类型多个类型用;进行分割比如*.doc;*.docx,默认为所有文件， （可选项）			
			param.fileSize: 业务文档的大小限制，默认为100M， （可选项）	
			param.whereCondition: 已上传的文件列表的查询条件，默认为 符合businessId  和 businessType的文档，（可选项）		
			param.editable: true:可以进行文件的增删，false禁止增删, 默认为允许增删	（可选项）			
			param.compressFlag: 0 or 1, 是否进行压缩，默认为1，进行压缩	（可选项）		
			param.fileSource: ftp or blob: 文件存储方式，默认为blob	 （可选项）		
			param.blobTable: 大文本文件存储的表名(选项内容为sgcc_attach_blob、system_longdata, app_blob ): 当fileSource为blob时需要传入，如果不传默认为sgcc_attach_blob 	 （可选项）	
		*/		
		
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
			if(param.whereCondition){
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
				//title: '文件上传', 
				renderTo: 'grid',
				width: 500,
				height: 300,
				upload_url: basePath + 'fileupload',
				flash_url: basePath +"/jsp/common/fileUploadMulti/js/swfupload.swf",
				// Set to true if you only want to select one file from the FileDialog.
				single_file_select: false, 
				// This will prompt for removing files from queue.
				confirm_delete: false, 
				// Remove file from grid after uploaded.
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
				//alert("文件流水号:"+data.fileLsh+"\r\n业务主键："+businessId+"\r\n类型："+businessType+"\r\n大对象："+blobTable)
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
				//alert(fidArr)
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
			/*uploader.on('queueUploadComplete', function() {
				if ( Ext.isGecko ) {
					console.log("Files Finished");
				} else {
					alert("Files Finished");
				}
			});	*/	
			
			viewport = new Ext.Viewport({
				layout:'fit',
				//hideBorders :false,
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
