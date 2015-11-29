//var _flag;
var signArr = ['签字']

Ext.onReady(function(){
	
	DWREngine.setAsync(false);
//	flwFrameMgm.checkIsUploadSign(parent.USERID, function(flag){
//		_flag = flag;
//	});
    
    //判断“流程签字盖章”
	appMgm.getCodeValue('流程签字盖章',function(list){
	    for(i = 0; i < list.length; i++) {
	        signArr.push(list[i].propertyName);           
	    }
	});
	DWREngine.setAsync(true);
	
	var saveBtn = new Ext.Button({
		text: '上传签字',
		iconCls: 'upload',
        minWidth : 80,
		disabled: true,
		handler: function(){
			fileForm.getForm().submit({
				waitTitle: 'Please waiting...',
				waitMsg: 'Upload data...',
				success: function(form, action){
					Ext.Msg.show({
						title: '提示',
						msg: action.result.msg,
						icon: Ext.Msg.INFO,
						buttons: Ext.Msg.OK,
						fn: function(value){
							if('ok' == value){
								if(parent.uploadWindow!=null&&parent.uploadWindow!=undefined){
								parent.uploadWindow.hide();
								}  
								else{  
									window.location.reload();
								}

							}
						}
					});
				},
				failure: function(form, action){
					Ext.Msg.show({
						title: '提示',
						msg: action.result.msg,
						icon: Ext.Msg.ERROR,
						buttons: Ext.Msg.OK,
						fn: function(value){
							if('ok' == value){
								if(parent.uploadWindow!=null&&parent.uploadWindow!=undefined){
								parent.uploadWindow.hide();
								}
								else{  
									window.location.reload();
								}
							}
						}
					});
				}
			})
		}
	});
	
	function checkFileFormat(filename){
		var _filename = filename.split('\\')[filename.split('\\').length-1];
		return (_filename.indexOf('.jpg') != -1) ? true : false;
	}
    
    var refreshBtn = new Ext.Button({
        text: '刷新签字',
        iconCls: 'upload',
        minWidth : 80,
        handler: function(){
            window.location.reload();
        }
    });
	
	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		bodyStyle: 'padding: 30px 0px;',
		url: ""+CONTEXT_PATH+"/servlet/FlwServlet?ac=uploadSign&userid="+parent.USERID,
		autoScroll: true,
		labelAlign: 'right',
        buttonAlign: 'center',
		buttons: [refreshBtn,saveBtn]
	});

    for (var i = 0; i < signArr.length; i++) {
        var _flag = "";
        DWREngine.setAsync(false);
        flwFrameMgm.checkIsUploadSign(parent.USERID,function(flag){_flag = flag;});
        if(i>0){
            flwFrameMgm.checkIsUploadStamp(parent.USERID,i,function(flag){_flag = flag;});
        }
        DWREngine.setAsync(true);
        fileForm.insert(i,{
            border: false,
            layout: 'column',
            items:[{
                columnWidth: .8, 
                border: false,
                layout: 'form',
                items: [{
                    xtype: 'fileuploadfield',
                    id: 'uploadSign'+i,
                    fieldLabel: signArr[i],//'签字盖章'+n,
                    width: 270,
                    value: _flag ? '已上传文件' : '',
                    buttonText: '上传'+(i>0?'盖章':'签字'),
                    listeners: {
                        'fileselected': function(fup, v){
                            if (checkFileFormat(v)) {
                                saveBtn.enable();
                            } else {
                                fup.setValue("");
                                Ext.example.msg('警告', '请上传jpg格式图片！');
                            }
                        }
                    }
                }]
            },{
                columnWidth: .2, border: false,
                items: [{
                    xtype: 'button',
                    text: '下载',
                    iconCls: 'download',
                    tooltip: '下载已上传的图片',
                    disabled: _flag ? false : true,
                    order : i,
                    handler: function(){
                        window.location.href = ''+CONTEXT_PATH+'/servlet/FlwServlet?ac=downloadSign&userid='+parent.USERID+'&order='+this.order;
                    }
                }]
            }]
        })
    }
    
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [fileForm]
	});
});
