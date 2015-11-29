		//点击查看时候弹出窗口
var multiFileWin
var fileLshUploads="";
var parentParam = null;


Ext.onReady(function() {
	fileLshUploads = "";
	multiFileWin = new Ext.Window({
        title: '查看文件',
        width: 600,
        height:400,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain: true,
        closeAction: 'hide',
        modal: true,
        html: "<iframe name='frmUploadPanel' src='" + CONTEXT_PATH + "/jsp/common/fileUploadMulti/fileUploadSwf.jsp' frameborder=0 width=100% height=100%></iframe>"
    });
    multiFileWin.on("beforehide", closeMultiFileWin)	
});


function closeMultiFileWin() {
	try{
		fileLshUploads = getReturnValue()
		if(fileLshUploads && fileLshUploads != ""){
			//根据返回的文件流水号，对上传完毕后的业务记录进行处理
			closeUploadWindow(true,fileLshUploads)
		}		
	} catch(e){
		
	}
}
function getReturnValue(){
	var frmUploadPanel = window.frames["frmUploadPanel"]
	var storeAttach = frmUploadPanel.uploader.getStore()
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

function showMultiFileWin(param) {
	parentParam = param;
	multiFileWin.show()	
	
	if(frmUploadPanel.uploader){
		frmUploadPanel.location.reload()
		//var storeAttach = frmUploadPanel.uploader.getStore()
		//storeAttach.load({params:{start:0,limit: 8}})
	}	
}

