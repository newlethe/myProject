var file_currentBID;
var file_currentFileID;
var attachfilewin;
var attachfileBean = "com.sgepit.frame.sysman.hbm.AppFileinfo";
var file_business = "systemMgm";
var file_listMethod = "findByProperty";
var file_primaryKey = "fileid";
var file_propertyName = "businessid";
var allowedDocTypes = "xls,xlsx,doc,docx";
var gridGetParam = "";
var file_ds ;
Ext.onReady(function() {
	
	var file_fc = { // 创建编辑域配置
		'fileid' : {
			name : 'fileid',
			fieldLabel : '附件主键',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true  
		},
		'filename' : {
			name : 'filename',
			fieldLabel : '文件名称',
			allowBlank : false,
			anchor : '95%'
		},
		'filedate' : {
			name : 'filedate',
			fieldLabel : '文件日期',
			anchor : '95%'
		}
	}
	
	var file_Columns = [{name : 'fileid',type : 'string'}, {name : 'filename',type : 'string'}, {name : 'filedate',type : 'date'}];
	
	var file_sm = new Ext.grid.CheckboxSelectionModel();
	
	var file_cm = new Ext.grid.ColumnModel([file_sm, {
		id : 'filename',
		header : file_fc['filename'].fieldLabel,
		dataIndex : file_fc['filename'].name,
		width : 100
	}, {
		id : 'filedate', 
		header :file_fc['filedate'].fieldLabel,
		dataIndex : file_fc['filedate'].name,
		width : 50
	},{
		id : 'fileid',
		header : file_fc['fileid'].fieldLabel,
		dataIndex : file_fc['fileid'].name,
		width : 50,
		renderer:fileidRender
	}])
	
	file_cm.defaultSortable = true;

	file_ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : attachfileBean,
			business : file_business,
			method : file_listMethod,
			params : gridGetParam
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : file_primaryKey
		}, file_Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	file_gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'file-grid-panel',
		ds : file_ds,
		cm : file_cm,
		sm : file_sm,
		title : "附件列表",
		iconCls : 'icon-by-category',
		border : false,
		region : 'center',
		clicksToEdit : 1,
		header : true,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		autoExpandColumn : 1, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : file_ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		servletUrl : MAIN_SERVLET,
		bean : attachfileBean,
		business : "systemMgm",
		primaryKey : file_primaryKey
	});
	
	file_gridPanel.on("cellclick", function(grid, rowIdx, colIdx, e){
		var record = grid.getStore().getAt(rowIdx);
		file_currentFileID = record.get("fileid");
    })
	
	attachfilewin = new Ext.Window({
                layout:'fit',
                width:500,
                height:300,
                closeAction:'hide',
                plain: true,
                
                items: [file_gridPanel],

                buttons: [{
                    text:'新增',
                    handler:uploadFile
                },{
                    text: '删除',
                    handler:deleteFile
                }]
            });
     attachfilewin.on('show',function(win){file_ds.reload();});      
     
    function deleteFile(){
    		Ext.Ajax.request({
			url : MAIN_SERVLET+"?ac=deleteFile",
			params : {
				ac : 'deleteFile',
				fileid : file_currentFileID,
				businessid : file_currentBID
			},
			method : "GET",
			success : function(response, params) {
				var rspXml = response.responseXML
				if (rspXml.documentElement == null) {
					alert('删除成功！');
					file_ds.reload();
					file_gridPanel.fireEvent("afterdelete", file_gridPanel)
				} else {
					var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue
					alert(msg);
				}
			},
			failure : function(response, params) {
				alert('Error: Delete failed!');
			}
		});
    } 
    
    function uploadFile(){
		var uploadForm = new Ext.form.FormPanel({   
		  baseCls: 'x-plain',   
		  labelWidth: 80,   
		  url: MAIN_SERVLET+"?ac=upload",   
		  fileUpload: true,   
		  defaultType: 'textfield',   
		
		  items: [
		  {   
		    xtype: 'textfield',   
		    fieldLabel: '业务流水号',   
		    name: 'businessid',
		    readOnly: false,
		    hidden: true,
		    hideLabel: true,
		    anchor: '90%'  // anchor width by percentage   
		  },{   
		    xtype: 'textfield',   
		    fieldLabel: '流水号',   
		    name: 'fileid1',
		    readOnly: true,
		    hidden: true,
		    hideLabel: true,
		    anchor: '90%'  // anchor width by percentage   
		  },{   
		    xtype: 'textfield',   
		    fieldLabel: '请选择文件',   
		    name: 'filename1',   
		    inputType: 'file',   
		    allowBlank: false,   
		    blankText: 'File can\'t not empty.',   
		    anchor: '90%'  // anchor width by percentage   
		  }]   
		});   
		
		var uploadWin = new Ext.Window({   
			  title: 'Upload file',   
			  width: 450,   
			  height: 180,   
			  minWidth: 300,   
			  minHeight: 100,   
			  layout: 'fit',   
			  plain:true,   
			  bodyStyle:'padding:5px;',   
			  buttonAlign:'center',   
			  items: uploadForm,   
			
			  buttons: [{   
			    text: '上传',   
			    handler: function() {
			     uploadForm.getForm().findField("businessid").setValue(file_currentBID);		
			      var filename = uploadForm.form.findField("filename1").getValue();
			      if (filename!= ""){
			      	var fileExt = filename.substring(filename.lastIndexOf(".")+1,filename.length).toLowerCase();
			     	if (allowedDocTypes.indexOf(fileExt) == -1) {
			     		Ext.MessageBox.alert("提示", "请选择Office文档！");
			     		return;
			     	}else{
			     		currentFileExt = fileExt
			     	}
			      }
			      if(uploadForm.form.isValid()){   
			        Ext.MessageBox.show({   
			             title: 'Please wait',   
			             msg: 'Uploading...',   
			             progressText: '',   
			             width:300,   
			             progress:true,   
			             closable:false,   
			             animEl: 'loading'  
			           });   
			        uploadForm.getForm().submit({
			          method: 'POST',
			          params:{ac:'upload'},
			          success: function(form, action){
						tip = Ext.QuickTips.getQuickTip();
						tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
						tip.show();
						Ext.MessageBox.hide();
			            uploadWin.hide();
			            var rtn = action.result.msg;
			            var fileid = rtn[0].fileid;
			            var filename = rtn[0].filename;
			            fileUploaded();
			          },       
			           failure: function(){       
			            Ext.Msg.alert('Error', 'File upload failure.');       
			           }   
			        })              
			      }   
			     }   
			  },{   
			    text: '关闭',   
			    handler:function(){uploadWin.hide();}   
			  }]   
			});
			uploadWin.show();
		}
		function fileUploaded(){
			file_ds.reload();
		}        
});

function setGetParam(){
	gridGetParam =	file_propertyName + SPLITB + file_currentBID
	file_ds.baseParams.params = gridGetParam;
}

function fileidRender(vl){
	return "<a href='javascript: viewAttachFile()' title='查看附件'>查看附件</a>"
}

function viewAttachFile(){
	window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+file_currentFileID)
}
