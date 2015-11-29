//用于文件上传后的文件Id,文件名称、文件大小	
var fileId,fileName,fileSize;
var uploadBlobWin
var allowableFileType = "";

function showBlobFileWin(param) {	
	fileId = "";
	fileName = "";
	fileSize = "";
	var url = basePath +"Business/jsp/common/fileBlob/fileBlobUpload.jsp?"
			+ "fileId="   +  (param.fileId ==null? "" :param.fileId)
	        + "&compress=" + (param.compressFlag==null? "1":param.compressFlag)
	        + "&filesource=" + (param.fileSource ==null? "blob" : param.fileSource)
	        + "&transType=" + (param.businessType ==null? "other":  param.businessType)
	        + "&pk=" + param.businessId
	        + "&tableName="+ (param.blobTable ==null ? "sgcc_attach_blob" : param.blobTable)
	        
	//added by Ivy 2010-04-09 上传文件的时候，允许的文件格式 如：".doc`.ppt`.rtf", 如果未设置此参数，表示没有任何格式限制；
	if (param && param.allowableFileType && param.allowableFileType!=null) {
		allowableFileType = param.allowableFileType;
	}
	uploadBlobWin = new Ext.Window({
		title: "上传文档",
		width: 450,
		height: 150,
		layout: 'fit',
		resizable: false,
		autoScroll: true,
		plain: true,
		modal: true,
		buttonAlign: 'center',
		//closeAction: 'hide',
		html:"<iframe name='frameBlobUpload'  scrolling='no' src='" + url +"' width='100%' height='100%'></iframe>",
		buttons: [{id:'uploadBtn', disabled:true, text:'上传',handler:fileUpSubmit},{id:'cancelBtn', text:'关闭',handler:closeBlobUploadWin}]
	});
	uploadBlobWin.show()	
	//uploadBlobWin.on("beforehide",closeBlobUploadWin)
	return uploadBlobWin
}


//上传文件 - 确定
function fileUpSubmit(){
	window.frames["frameBlobUpload"].doSubmit()
}
function closeBlobUploadWin(sucess) {
	var rtnObj = new Object();
	rtnObj.fileId = fileId
	rtnObj.fileName = fileName
	rtnObj.fileSize = fileSize

	try{
		if(fileId && fileId != ""){			
				uploadBlobWin.rtnObj = rtnObj;
			closeUploadWindow(sucess,rtnObj)
		}	else{
			uploadBlobWin.close()
		}	
	} catch(e){
		uploadBlobWin.close()
	}
}