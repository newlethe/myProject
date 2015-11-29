var info_grid, info_ds;
var info_rs
var info_cm;
var whereStr = " 1=1 ";
var state;
//var bean_info = "com.sgepit.fileAndPublish.hbm.ComFileInfo";
var listMethod = "getComFileInfoBySortId";
var updateInfoBtn, changestateVBtn;
var sortId = 'info_root';	//首页只显示消息发布模块中的新文件
Ext.onReady(function() {
		info_rs = Ext.data.Record.create([{
						name : 'uids',
						type : 'string'
					}, {
						name : 'fileLsh',
						type : 'string'
					}, {
						name : 'fileId',
						type : 'string'
					}, {
						name : 'fileTile',
						type : 'string'
					}, {
						name : 'fileSortName',
						type : 'string'
					}, {
						name : 'fileContent',
						type : 'string'
					}, {
						name : 'fileAutherName',
						type : 'string'
					}, {
						name : 'fileCreatetime',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'billStateName',
						type : 'string'
					}, {
						name : 'publisStateName',
						type : 'string'
					}, {
						name : 'fileBh',
						type : 'string'
					}, {
						name : 'publishUserName',
						type : 'string'
					}, {
						name : 'fileDeptName',
						type : 'string'
					}, {
						name : 'publishTypeStr',
						type : 'string'
					}, {
						name : 'publishTime',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
						
					}, {
						name : 'isNew',
						type : 'string'
					},
					{
						name : 'fileUnitName',
						type : 'string'
					}

			]);
	var info_reader = new Ext.data.JsonReader({id: 'infogrid',root: 'topics',
			totalProperty: 'totalCount'
			}, info_rs);
	 updateInfoBtn = new Ext.Toolbar.Button({
						id : 'update-info',
						iconCls:'btn',
						text : '详细信息',
						handler : onItemClick
					});
	 changestateVBtn= new Ext.Toolbar.Button({
						id:'change-state',
						icon : "images/icon-complete.gif",
						cls:"x-btn-text-icon",
						text: '标记已读',
						handler : onItemClick
					});
					
	var countLabel = new Ext.form.Label({html : '<span style="font-weight:bold;font-size:13px;color:#708090;">消息提醒(0条)</span>'});
					
	var goToMessagePageBtn = new Ext.Toolbar.Button({
						id : 'msg-page',
						icon : CONTEXT_PATH + "/jsp/res/images/icons/table_go.png",
						cls : "x-btn-text-icon",
						tooltip : '转到消息查询页面',
						handler : function(){
							window.location.href = CONTEXT_PATH+"/jsp/messageCenter/search/com.fileSearch.publish.query.jsp?rootId=info_root";
							if ( Ext.getCmp('east')  )
							Ext.getCmp('east').collapse();
						}
					});
					
	// checkbox column
	 var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	// row index column
	var info_nm = new Ext.grid.RowNumberer();
	 	info_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({}),
		{ 
			id : 'fileTile',
			header : '主题',
			dataIndex : 'fileTile',
			width:290,
			renderer : transLink
		},{
			id : 'fileAutherName',
			header : '用户',
			dataIndex : 'fileAutherName',
			align : 'center',
			width:60
		},{
			id : 'publishTime',
			header : '时间',
			dataIndex : 'publishTime',
			align : 'center',
			width:115,
			renderer:function(value){						
				var pubTimeStr = value.getFullYear()+'-'+(value.getMonth()+1) +'-'+value.getDate()
				 + '  ' + value.getHours() + ':' + value.getMinutes()+':'+value.getSeconds();		
				 return pubTimeStr;
			}
		}]);   
var regEx = /^<img src=.*<\/img>/;
	function transLink(value, metaData, record, rowIndex,
								colIndex, store) {				
									state="read"
									metaData.attr = 'style="white-space:normal;"';
									var toolTip = record.data.fileTile.replace(regEx, '');
							var htmlStr = '<span class="downloadLink" style="cursor:hand" qtip="' + toolTip + '" >' + record.data.fileTile+ "</span>";															
							return htmlStr;
									

						}
			

	 info_ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: CONTEXT_PATH
											+ '/servlet/ComFileManageServlet'
		}),
		reader : info_reader
		//remoteSort: true
		//pruneModifiedRecords: true
	
	});
	info_ds.on("beforeload", function(ds1) {
						Ext.apply(ds1.baseParams, {
									method : 'getComFileInfoPbulishedByUserId',
									dateSelected : 'all',
									stateSelected : 'unRead',
									sortId : sortId,
									whereStr : " 1=1 ",
									orderby : "publish_time desc",
									userId : USERID,
									deptId : USERDEPTID
								})
					})
	//info_ds.setDefaultSort('fileCreatetime', 'desc');
	info_ds.on("load", function(store, records, opt){
		if ( countLabel )
		Ext.get(countLabel.getEl()).update('<span style="font-weight:bold;font-size:13px;color:#708090;">消息提醒(' + store.getTotalCount() +'条)</span>');
	});
					
	info_grid = new Ext.grid.GridPanel({
		id : 'infoGrid',
	//	height:300,
		rowHeight: .5,
		//title : '消息中心',
		hideHeaders: true,	//去掉标题拦
		store : info_ds,
		split: true, 
		stripeRows: true,
		collapsible: true,
    	animCollapse: true,
		border: false,
		header: false,
		autoScroll: true,
		loadMask: false,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true,
			 emptyText: '当前没有未读消息'
		},
		sm : sm,
		cm : info_cm,
//		/autoExpandColumn  : 'subject',
		//selModel : new Ext.grid.RowSelectionModel(),
		border : false,
		bbar: new Ext.PagingToolbar({
			//id: 'my008',
            pageSize: PAGE_SIZE,
            store: info_ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		tbar : [ countLabel,'->', goToMessagePageBtn]
		
	});
		info_grid.on('click', function() {
				var selRecord = info_grid.getSelectionModel()
						.getSelections();

				if (selRecord.length == 1) {
					setSingleFileBtnDisabled(false);
				} else {
					setSingleFileBtnDisabled(true);
				}
			});
			
		info_grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
				if ( fieldName == 'fileTile' ){
				var rec = grid.getStore().getAt(rowIndex);
					if ( rec ){
						showPropertyWin(rec.data.fileId, 'update');
					}
				}
				else if ( fieldName == 'uids' ){
					//alert()
					var rec = grid.getStore().getAt(rowIndex);
				if ( rec ){
					showAttachWin(rec.data.fileId);
				}
					
				}
				
			});
		function setSingleFileBtnDisabled(state) {
		// 详细信息按钮
		updateInfoBtn.setDisabled(state);
	}
});
function onItemClick(item) {
			if(item.id=='update-info'){
			var selRecord = info_grid.getSelectionModel().getSelections();

			if (selRecord.length==0) {
				Ext.Msg.show({
						   title: '提示！',
						   msg: '请选择要查看的数据',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO
						   })
				}
				else{showPropertyWin(selRecord[0].data.uids,'update')}
			}
			else if(item.id=='change-state'){	
				var selRecord = info_grid.getSelectionModel().getSelections();
					if(selRecord.length==1){
						changereadState(selRecord[0].data.fileId, "read")
					}
					else if(selRecord.length>1){ 
						markSelectedAdRead(selRecord)					
					}
			}
			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			//showPropertyWin(selRecords[0].data.fileId);
	}

function loadInfo() {	
	info_ds.load({
		params: {
	    	start: 0,
	    	limit: PAGE_SIZE
		},
		callback: function(){
				if(info_ds.getCount()>0){
				//Ext.getCmp('east').expand();
			}
	//Ext.getCmp('east').expand()
	}
	})
}

function showPropertyWin(filePk) {
	var obj = new Object();
	obj.editMode = 'update';
	obj.editEnable = false;
	ComFileManageDWR.findById(filePk, function(comFileInfo) {
		obj.rec = new Ext.data.Record(comFileInfo);
		//obj.selectedNode = selectNode;
		obj.treeInfo = 0;
		var style = "dialogWidth:800px;dialogHeight:500px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
		if (filePk == null) {
			style = "dialogWidth:800px;dialogHeight:300px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
		}
		window
				.showModalDialog(
						CONTEXT_PATH
								+ "/jsp/messageCenter/fileManage/com.fileManage.property.jsp",
						obj, style);
		//关闭窗口后将该文件改为已读
						var MessagesUrl=CONTEXT_PATH+'/login/guoj/portal/ps.jsp';
						ComFileManageDWR.changeUserReadState(USERID, filePk, "read", function(dat) 
							{
								if ( dat ){
									info_ds.reload();
									if(MessagesPanel.body){
										//alert(document.frames["MessagesPanelFrm"].location)
										document.frames["MessagesPanelFrm"].location.reload(true);
										//MessagesPanel.body.update('<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="'+MessagesUrl+'"></iframe>');											
									}
							}
							});
					
	});

}
function downloadFile(filePk, fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/filedownload?&method=fileDownload&id="
				+ fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该文件不存在!")
	}

}
function changereadState(filePk,state){
				ComFileManageDWR.changeUserReadState(USERID, filePk, state, function(dat) {
				if (dat) {
						info_ds.reload()
						Ext.Msg.alert("操作提示", "状态标记成功!")
					}
				else{	Ext.Msg.alert("操作提示", "状态标记失败!")
						}
			});
}
function sendInfoURL(uids,t) {

	//Ext.getCmp('center').setTitle('消息中心')
	window.location.href = CONTEXT_PATH+"/Business/fileAndPublish/search/com.fileSearch.publish.query.jsp?uids="+uids
}
function markSelectedAdRead(records) {
	var ids = new Array();
	for (var i = 0; i < records.length; i++) {
		ids.push(records[i].data.fileId);
	}

	ComFileManageDWR.markSelectedFilesAsRead(USERID, ids, true,
			function(retVal) {
				if (retVal) {
					Ext.Msg.alert("操作提示", "状态标记成功!")
					info_ds.reload();
				} else {
					Ext.Msg.alert("操作提示", "状态标记失败!")
				}
			});

}
