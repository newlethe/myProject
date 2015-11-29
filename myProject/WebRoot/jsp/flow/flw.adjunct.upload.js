var arrUploadfields = new Array(),console;
String.prototype.trim = function() {return this.replace(/^\s+|\s+$/g,"");}
Ext.onReady(function(){
	if(!console) console = {log: function() {}};
	Ext.override(Ext.data.Store,{load:Ext.emptyFn});
	uploadPanel = new Ext.ux.SwfUploadPanel({
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		upload_url: BASE_PATH + 'servlet/FlwServlet',
		flash_url: BASE_PATH +"/jsp/common/fileUploadMulti/js/swfupload.swf",
		single_file_select: false, 
		confirm_delete: false, 
		remove_completed: false,
		deleteFile: function() {
	    	 var arr = this.getSelectionModel().getSelections()
	    	 var attacthStore = this.store
	    	 var fileIDs = "";
	    	 var fileIDArr = new Array();
	    	 var fileQueceIDArr = new Array();
			 for(var i=0;i<arr.length;i++) {
				if(arr[i].get('status') == "0"){
					fileQueceIDArr.push(arr[i]);			
				} else{
					fileIDArr.push(arr[i]);
					if(fileIDs == ""){
						fileIDs = "'" +arr[i].get('fileLsh') + "'"
					} else{
						fileIDs = fileIDs  + ",'" + arr[i].get('fileLsh') + "'"
					}	
				}
			}   
	    	if(fileQueceIDArr.length > 0){    	 	
	    	 	for(var i=0;i<fileQueceIDArr.length;i++) {
	    	 		this.suo.cancelUpload(fileQueceIDArr[i].get("fileLsh"), false)
		    	 	this.store.remove(fileQueceIDArr[i])
		    	 	var files_left = this.suo.getStats().files_queued; 
		    	 	if(files_left <=0){
		    	 		this.clearBtn.hide()
		    	 		this.uploadBtn.hide()
		    	 	}
	    	 	}    	 	
	    	 }
	   	 	if(fileIDs != ""){
	   	 		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,	text) {
					if (btn == "yes") {	
						flwInstanceMgm.delInsAdjunct(fileIDs,function(b){
							if(b) {
								loadAdjunctStore();
							} else{
								Ext.Msg.alert("提示","删除操作执行失败，请联系系统管理员！")
							}
						});
					}    	 		
				})
	   	 	}
	    },
		listeners:{
			swfUploadLoaded:function(){
				this.addPostParam('ac', 'uploadAdjunct');
				this.addPostParam('insid', parent.INS_ID);
			},
			fileUploadComplete:function(panel, file, response){
				loadAdjunctStore();
			}
		}
	});
	
	viewport = new Ext.Viewport({
		layout:'fit',
		items:[uploadPanel],
		listeners:{
			afterlayout:function(){
				loadAdjunctStore();
			}
		}
	});
});		
function loadAdjunctStore(){
	uploadPanel.getStore().removeAll();
	baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwAdjunctIns", 
		"insid='"+parent.INS_ID+"'", function(list){
		var Record = uploadPanel.rec;
		if(Record){
			for(var i=0;i<list.length;i++){
				var data = list[i];
				var fileRecord = new Record({
					fileName: data.filename,
					fileLsh: data.fileid,
					uploadDate: data.filedate,
					status: "2"
				});
				uploadPanel.getStore().add(fileRecord);
			}
		}
	})
}
function downloadFile(val){
	var openUrl = basePath + '/servlet/FlwServlet?ac=loadAdjunct&fileid='+val;
	document.all.formAc.action = openUrl
	document.all.formAc.submit()
}