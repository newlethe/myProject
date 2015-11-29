var info_grid, info_ds;
var info_rs
var info_cm;
var whereStr = " 1=1 ";
var state;
//var bean_info = "com.sgepit.fileAndPublish.hbm.ComFileInfo";
var listMethod = "getComFileInfoBySortId";
var updateInfoBtn, changestateVBtn
Ext.onReady(function() {
		info_rs = Ext.data.Record.create([
		{name : 'uids',type : 'string'}, 
		{name : 'fileId',type : 'string'}, 
		{name : 'fileTile',type : 'string'},
		{name : 'fileLsh',type : 'string'},
		{name : 'fileAutherName',type : 'string'},
		{name : 'fileSortName',type : 'string'},
		{name : 'fileCreatetime',type : 'string'}
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
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icon-complete.gif",
						cls:"x-btn-text-icon",
						text: '标记已读',
						handler : onItemClick
					})
	// checkbox column
	 var sm = new Ext.grid.CheckboxSelectionModel({});
	// row index column
	//var info_nm = new Ext.grid.RowNumberer();
	
	 info_cm = new Ext.grid.ColumnModel([sm,
			{
				id : 'subject',
				header : '主题',
				dataIndex : 'subject',
				renderer : transLink
			}]);

	function transLink(value, metaData, record, rowIndex,
								colIndex, store) {
									state="read"
									metaData.attr = 'style="white-space:normal;"';
									return "<a class=\"downloadLink\" onclick=\"downloadFile('"
									+ record.data.fileId
									+ "','"
									+ record.data.fileLsh
									+ "')\">"
									+ record.data.fileTile
									+ "</a><br>"
									+record.data.fileAutherName+"<br>"
									+record.data.fileCreatetime+"";

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
									sortId : '0',
									whereStr : " 1=1 ",
									orderby : "publish_time desc",
									userId : USERID,
									deptId : USERDEPTID
								})
					})
	//info_ds.setDefaultSort('fileCreatetime', 'desc');
	info_grid = new Ext.grid.GridPanel({
		id : 'infoGrid',
		height:300,
		title : '消息中心',
		store : info_ds,
		split: true, 
		stripeRows: true,
		collapsible: true,
    	animCollapse: true,
		border: false,
		header: false,
		autoScroll: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		sm : sm,
		cm : info_cm,
		autoExpandColumn  : 'subject',
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
		tbar : [updateInfoBtn,'-',changestateVBtn]
		
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
				else{showPropertyWin(selRecord[0],'update')}
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
				Ext.getCmp('east').expand();
			}
	//Ext.getCmp('east').expand()
	}
	})
}

function showPropertyWin(selRecord, eM) {
	var record = selRecord;
	var fileTitle=selRecord.get('fileTile')
	var _value =fileTitle.split(';')[fileTitle.split(';').length-1]
	//selRecord.set('fileTile',_value)
	var obj = new Object();
	obj.rec = record;
	obj.rec.data.fileTile=_value
	obj.editMode = eM;
	obj.billtype = true;
	var treeInfo = new Object();
	obj.treeInfo = 0;
	obj.editEnable = false;
	obj.gridStore = info_ds;
	var style = "dialogWidth:800px;dialogHeight:500px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	if (selRecord == null) {
		style = "dialogWidth:800px;dialogHeight:300px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	}
	window
			.showModalDialog(
					CONTEXT_PATH
							+ "/Business/fileAndPublish/fileManage/com.fileManage.property.jsp",
					obj, style);
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

	Ext.getCmp('center').setTitle('消息中心')
	window.frames["contentFrame"].location.href = CONTEXT_PATH+"/Business/fileAndPublish/search/com.fileSearch.publish.query.jsp?uids="+uids
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
