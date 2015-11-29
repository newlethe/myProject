var centerPanel
var dateSelected = "all";
var stateSelected = "all";
var titleSearchField;
var pathLabel;
var recordUpdate;
var regEx = /^<img src=.*<\/img>/;
var reformArr = new Array();

DWREngine.setAsync(false);
baseMgm.getData("select t.comfile_uids,t.reform_time,t.reform_opinion from REFORM_NOTICE_INFO t where t.report_state = '3'", function(list){
	for (var i=0; i<list.length; i++){
		reformArr.push(list[i])
	}
})
DWREngine.setAsync(true);

Ext.onReady(function() {
	

	var detailInfoBtn = new Ext.Toolbar.Button({
				id : 'detail-info',
				text : '详细信息',
				icon : CONTEXT_PATH
						+ "/jsp/res/images/icons/application_view_detail.png",
				cls : "x-btn-text-icon",
				handler : onItemClick
			});

	var markAsReadBtn = new Ext.Toolbar.Button({
				id : 'mark-as-read',
				text : '标记所选为已读',
				icon : CONTEXT_PATH + "/jsp/res/images/icon-show-complete.gif",
				cls : "x-btn-text-icon",
				handler : onItemClick
			});

	var markAllReadBtn = new Ext.Toolbar.Button({
				id : 'mark-all-read',
				text : '标记全部为已读',
				icon : CONTEXT_PATH + "/jsp/res/images/icon-show-all.gif",
				cls : "x-btn-text-icon",
				handler : onItemClick
			});

	// 搜索框
	var titleSearchField = new Ext.app.SearchField({
				width : 150,
				onTrigger2Click : function() {
					dsResult.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
					this.focus();
				}
			});

	// 当前分类文字，显示在工具栏
	pathLabel = new Ext.form.Label({
				text : '当前分类:'
			});
	// 第二行工具栏，显示当前选择的分类
	var sortPathBar = new Ext.Toolbar([pathLabel]);

	var dateFilterArr = new Array();
	dateFilterArr[0] = new Array('oneMonth', '近一月信息');
	dateFilterArr[1] = new Array('threeMonth', '近三月信息');
	dateFilterArr[2] = new Array('all', '所有时期信息');

	var queryDateDt = new Ext.data.SimpleStore({
				fields : ['val', 'text'],
				data : dateFilterArr
			});

	var dateSearchCombo = new Ext.form.ComboBox({
				id : 'search-date',
				store : queryDateDt,
				fieldLabel : '时间段查询',
				displayField : 'text',
				valueField : 'val',
				mode : 'local',
				triggerAction : 'all',
				width : 100,
				editable : false,
				selectOnFocus : true
			});
	dateSearchCombo.setValue('all');

	var stateFilterArr = new Array();
	stateFilterArr[0] = new Array('unRead', '未读信息');
	stateFilterArr[1] = new Array('read', '已读信息');
	stateFilterArr[2] = new Array('all', '所有信息');

	var queryStateDt = new Ext.data.SimpleStore({
				fields : ['val', 'text'],
				data : stateFilterArr
			});
	var stateSearchCombo = new Ext.form.ComboBox({
				id : 'search-state',
				allowBlank : false,
				store : queryStateDt,
				fieldLabel : '状态查询',
				displayField : 'text',
				valueField : 'val',
				mode : 'local',
				triggerAction : 'all',
				width : 80,
				editable : false,
				selectOnFocus : true
			});
	stateSearchCombo.setValue('all');

	dateSearchCombo.on('select', function(c, rec, i) {
				dateSelected = rec.data["val"];
				dsResult.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});
	stateSearchCombo.on('select', function(c, rec, i) {
				stateSelected = rec.data["val"];
				if (stateSelected == "read") {
					markAsReadBtn.setDisabled(true);
				} else {
					markAsReadBtn.setDisabled(false);
				}
				dsResult.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});

	var dataGridRs = Ext.data.Record.create([{
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
			}, {
				name : 'fileUnitName',
				type : 'string'
			}, {
				name : 'reformUids',
				type : 'string'
			}, {
				name : 'reformTime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'reformOpinion',
				type : 'string'
			}, {
				name : 'reportState',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}]);

	var dataGridDsReader = new Ext.data.JsonReader({
				id : "fileId",
				root : 'topics',
				totalProperty : 'totalCount'
			}, dataGridRs)

	dsResult = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							method : 'POST',
							url : CONTEXT_PATH
									+ '/servlet/ComFileManageServlet'
						}),
				reader : dataGridDsReader
			});
	dsResult.on("beforeload", function(ds1) {
				// 标题搜索字符串
				var keyword = titleSearchField.getRawValue().trim();
				// 若输入了关键字则显示搜索框上的“X”按钮
				if (keyword.length > 0) {
					titleSearchField.hasSearch = true;
					titleSearchField.triggers[0].show();
				} else {
					titleSearchField.triggers[0].hide();
				}
				Ext.apply(ds1.baseParams, {
							method : 'getReformNoticeInfoPublished',
							dateSelected : dateSelected,
							stateSelected : stateSelected,
							sortId : selectNode.id,
							whereStr : " 1=1 ",
							keyword : keyword,
							orderby : "publish_time desc",
							userId : USERID
						});
			})

	// 创建选择模型
	var sm = new Ext.grid.CheckboxSelectionModel({
				listeners : {
					beforerowselect : function(sm, rowIndex, keep, rec) {

						if (this.deselectingFlag && this.grid.enableDragDrop) {
							this.deselectingFlag = false;
							this.deselectRow(rowIndex);
							return this.deselectingFlag;
						}

						return keep;
					}
				},
				onMouseDown : function(e, t) {
					/*
					 * If you want make selections only by checking the checker
					 * box, add "&& t.className == 'x-grid3-row-checker'" to
					 * next if statement
					 * 
					 * If you want to make selection only with Ctrl key pressed,
					 * add "&& e.ctrlKey" to next if statement
					 */
					if (e.button === 0) {
						if (t.className == 'x-grid3-row-checker' || e.ctrlKey) {
							e.stopEvent();
							var row = e.getTarget('.x-grid3-row');
							if (row) {
								var index = row.rowIndex;
								if (this.isSelected(index)) {
									if (!this.grid.enableDragDrop)
										this.deselectRow(index);
									else
										this.deselectingFlag = true;
								} else {
									if (this.grid.enableDragDrop)
										this.deselectingFlag = false;
									this.selectRow(index, true);
								}
							}
						} else {
							var row = e.getTarget('.x-grid3-row');
							if (row) {
								var index = row.rowIndex;
								this.selectRow(index);
							}
						}
					}
				}
			});

	var columnModel = new Ext.grid.ColumnModel([sm, {
		header : '发布单位',
		dataIndex : 'fileUnitName',
		align : 'center',
		width : 120,
		// 鼠标悬停时显示完整信息
		renderer : function(data, metadata, record) {
			var qtip = " qtip= \"" + data + "\" >";
			return '<span ' + qtip + data + '</span>';
		}
	}, {
		header : '发布部门',
		dataIndex : 'fileDeptName',
		align : 'center',
		width : 120,
		// 鼠标悬停时显示完整信息
		renderer : function(data, metadata, record) {
			if (record.data.fileUnitName == data) {
				return '';
			} else {
				var qtip = " qtip= " + data + " >";
				return '<span' + qtip + data + '</span>';
			}
		}
	}, {
		header : '发布人',
		align : 'center',
		dataIndex : 'publishUserName',
		width : 80
	}, {
		header : '标题',
		dataIndex : 'fileTile',
		width : 160,
		renderer : function(value, metaData, record) {
			var toolTip = record.data.fileTile.replace(regEx, '');
			var htmlStr = '<span class="downloadLink" qtip="' + toolTip
					+ '" onclick="showPropertyWin(' + record.data.fileId
					+ ')">' + value + '</span>';
			return htmlStr;

		}
	}, {
		header : '内容简述',
		dataIndex : 'fileContent',
		width : 160,
		renderer : function(value, metadata, record) {
			metadata.attr = ' ext:qtip="' + value + '"';
			return value;
		}
	}, {
		header : '附件',
		dataIndex : 'uids',
		align : 'center',
		width : 50,
		renderer : function(value, metadata, record) {
			var rtnStr = '';
			DWREngine.setAsync(false);
			ComFileManageDWR.getFileAttachCount(record.data.fileId, function(cnt) {
						rtnStr = '<span class="downloadLink" onclick="showAttachWin(\''
							+ record.data.fileId + '\',\'FAPAttach\')">附件[' + cnt + ']</span>';
					});
			DWREngine.setAsync(true);
			return rtnStr;
		}
	}, {
		header : '文件分类',
		dataIndex : 'fileSortName',
		hidden : true

	}, {
		header : '接收时间',
		dataIndex : 'publishTime',
		align : 'center',
		renderer : Ext.util.Format.dateRenderer('Y-n-j H:i')
	}, {
		header : '作者',
		dataIndex : 'fileAutherName',
		width : 60,
		hidden : true
	}, {
		header : '起草时间',
		dataIndex : 'fileCreatetime',
		renderer : Ext.util.Format.dateRenderer('Y-n-j H:i'), // Ext内置日期renderer
		hidden : true
	}, {
		header : '是否整改',
		dataIndex : 'isreform',
		align : 'center',
		width : 70,
		renderer : function(value) {
			return "已整改";
		}
	}, {
		header : '整改措施',
		dataIndex : 'uids',
		align : 'center',
		width : 70,
		renderer : function(value, metadata, record) {
			var rtnStr = '';
			DWREngine.setAsync(false);
			ComFileManageDWR.getReformFileAttachCount(record.data.fileId, function(cnt) {
							rtnStr = '<span class="downloadLink" onclick="showAttachWin(\''
								+ record.data.fileId + '\',\'ReformAttach\')">附件[' + cnt + ']</span>';
						});
			DWREngine.setAsync(true);
			return rtnStr;
		}
	}, {
		header : '整改时间',
		dataIndex : 'reformTime',
		align : 'center',
		width : 70,
		renderer : function(value, m, r) {
			for (var i=0; i<reformArr.length; i++){
				if(reformArr[i][0] == r.get('fileId')){
					return Ext.util.Format.date(reformArr[i][1], 'Y-n-j');
				}
			}
		}
	}, {
		header : '整改建议',
		dataIndex : 'reformOpinion',
		align : 'center',
		width : 300,
		renderer : function(value, m, r) {
			for (var i=0; i<reformArr.length; i++){
				if(reformArr[i][0] == r.get('fileId')){
					return reformArr[i][2];
				}
			}
		}
	}, {
		header : '审批状态',
		dataIndex : 'reportState',
		align : 'center',
		width : 100,
		renderer : function(v) {
			return '已审批';
		}
	}, {
		header : 'reformUids',
		dataIndex : 'reformUids',
		hidden : true
	}, {
		header : 'pid',
		dataIndex : 'pid',
		hidden : true
	}]);

	pageToolbar = new Ext.PagingToolbar({
				pageSize : PAGE_SIZE,
				beforePageText : "第",
				afterPageText : "页,共{0}页",
				store : dsResult,
				displayInfo : true,
				firstText : '第一页',
				prevText : '前一页',
				nextText : '后一页',
				lastText : '最后一页',
				refreshText : '刷新',
				displayMsg : '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
				emptyMsg : "无记录。"
			});
	// 所有工具栏按钮数组
	var toolbarItems = [detailInfoBtn, '-', markAsReadBtn, markAllReadBtn,
			'->', dateSearchCombo, '-', stateSearchCombo, '-', titleSearchField];

	// 创建Grid
	grid = new Ext.grid.GridPanel({
				ds : dsResult,
				cm : columnModel,
				sm : sm,
				region : 'center',
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : false
				},
				bbar : pageToolbar,
				tbar : new Ext.Toolbar({
							items : toolbarItems
						}),
				listeners : {
					'render' : function() {
						sortPathBar.render(this.tbar);
					}
				}
			});
	sm.on('rowselect', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				recordUpdate = record;
				DWREngine.setAsync(false);
				ComFileManageDWR.findById(record.data.fileId, function(
								comFileInfo) {
							recordUpdate.data.fileTile = comFileInfo.fileTile;
						});
				DWREngine.setAsync(true);
			});
	// grid的单元格点击事件
	grid.on('click', function() {
				var selRecords = grid.getSelectionModel().getSelections();
				if (selRecords.length == 1) {
					detailInfoBtn.setDisabled(false);
				} else {
					detailInfoBtn.setDisabled(true);
				}
			});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, grid]
			});
	dsResult.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
});

function onItemClick(item) {
	switch (item.id) {
		case 'detail-info' :
			var selRecords = grid.getSelectionModel().getSelections();
			if (selRecords.length != 1) {
				return;
			}
			showPropertyWin(selRecords[0].data.fileId);
			break;
		case 'mark-as-read' :
			var selRecords = grid.getSelectionModel().getSelections();
			// 单个标记
			if (selRecords.length == 1) {
				changeState(selRecords[0].data.fileId, "read");
			} else if (selRecords.length > 1) {
				markSelectedAdRead(selRecords);
			}
			break;
		case 'mark-all-read' :
			var remain = 0;// 未读的数量
			DWREngine.setAsync(false);
			ComFileManageDWR.getModuleUrlByUserId('发布消息提醒', USERID, function(
							url) {
						if (url) {
							publishUrl = CONTEXT_PATH + "/" + url;
							var rootId = getRootId(url);
							ComFileManageDWR.getUnreadMsgNumPublish(USERID,
									USERDEPTID, rootId, function(retVal) {
										if (retVal) {
											remain = retVal;
										}
									});
						} else {
							remain = 0;
						}
					});
			DWREngine.setAsync(true);
			var totalCount = dsResult.getTotalCount();
			if (remain > 0) {
				Ext.Msg.show({
							title : '全部标记已读',
							msg : '确定将全部 <b>' + remain + '个未读信息</b> 标记为已读?',
							buttons : Ext.Msg.YESNO,
							fn : function(btn) {
								if (btn == 'yes') {
									markAllAsRead();
								}
							}
						});
			} else {
				if (totalCount > 0) {
					Ext.MessageBox.alert("提示", "信息已全部为已读状态!");
				} else {
					return;
				}
			}
			break;
	}
}

//解析url得到rootid的值
function getRootId(url) {
	var params = "";
	var array = url.split("?");
	if (array.length > 1) {
		var paramArr = array[1].split("&");
		for (i = 0; i < paramArr.length; i++) {
			if (paramArr[i].indexOf("rootId=") == 0) {
				params = (paramArr[i].split("="))[1];
			}
		}
	}
	return params;
}

function showPropertyWin(filePk) {
	var obj = new Object();
	obj.editMode = 'update';
	obj.editEnable = false;
	obj.rec = recordUpdate;
	obj.billtype = true;
	obj.selectedNode = selectNode;
	var treeInfo = new Object();
	treeInfo.rootId = g_rootId;
	treeInfo.rootName = g_rootName;
	obj.treeInfo = treeInfo
	obj.gridStore = dsResult;
	obj.opinion = '';
	for (var i=0; i<reformArr.length; i++){
		if(reformArr[i][0] == recordUpdate.get('fileId')){
			obj.opinion = reformArr[i][2];
		}
	}
	var style = "dialogWidth:800px;dialogHeight:600px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	if (filePk == null) {
		style = "dialogWidth:800px;dialogHeight:300px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	}
	window.showModalDialog(CONTEXT_PATH + "/Business/fileAndPublish/reformNotice/reformNotice.property.jsp", obj, style);
	//关闭窗口后将该文件改为已读
	var selRecords = grid.getSelectionModel().getSelections();
	var fileId = selRecords[0].data.fileId;
	DWREngine.setAsync(false);
	ComFileManageDWR.changeUserReadState(USERID, fileId, "read", function(dat) {
				if (dat) {
					dsResult.reload();
				}
			});
	DWREngine.setAsync(true);
}

function changeState(filePk, state) {
	var count = 0;
	DWREngine.setAsync(false);
	db2Json.selectData("select count(uids) as count from COM_FILE_READ_HISTORY where file_id ='"
					+ filePk + "' and file_reader='" + USERID + "'", function(jsonData) {
				var list = eval(jsonData);
				if (list != null && list[0]) {
					count = list[0].count;
				}
			});
	if (count > 0) {
		Ext.example.msg("操作提示", "信息已为已读状态！");
		return;
	}
	ComFileManageDWR.changeUserReadState(USERID, filePk, state, function(dat) {
				if (dat) {
					Ext.example.msg("操作提示", "状态标记成功!")
					dsResult.reload();
				} else {
					Ext.example.msg("操作提示", "状态标记失败!")
				}
			});
	DWREngine.setAsync(true);
}

function markAllAsRead() {
	ComFileManageDWR.markAllAsReadForUser(USERID, selectNode.id, function(
					retVal) {
				if (retVal) {
					Ext.example.msg('操作提示', '状态标记成功!');
					dsResult.reload();
				} else {
					Ext.example.msg('操作提示', '状态标记失败!');
				}
			});
}

function markSelectedAdRead(records) {
	var totalCount = 0;
	totalCount = parseInt(totalCount);
	DWREngine.setAsync(false);
	var ids = new Array();
	for (var i = 0; i < records.length; i++) {
		ids.push(records[i].data.uids);
		db2Json.selectData("select count(uids) as count from COM_FILE_READ_HISTORY where file_id ='"
						+ records[i].data.uids + "' and file_reader='" + USERID + "'", function(jsonData) {
					var list = eval(jsonData);
					if (list != null && list[0]) {
						totalCount += parseInt(list[0].count);
					}
				});
	}
	if (totalCount > 0) {
		Ext.example.msg("操作提示", "信息存在已读状态！");
		return;
	}
	ComFileManageDWR.markSelectedFilesAsRead(USERID, ids, true,
			function(retVal) {
				if (retVal) {
					Ext.example.msg('操作提示', '状态标记成功!');
					dsResult.reload();
				} else {
					Ext.example.msg('操作提示', '状态标记失败!');
				}
			});
	DWREngine.setAsync(true);
}

// 附件窗口
function showAttachWin(filePk, businessType) {
	var record = dsResult.getById(filePk);
	var fileUploadUrl = CONTEXT_PATH + "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=false&businessId=" + filePk;
	var fileTitle = record.get("fileTile");
	fileTitle = fileTitle.replace(regEx, '');
	fileTitle = fileTitle.replace('[未读] ', '');
	templateWin = new Ext.Window({
				title : '信息[' + fileTitle + '] 的附件',
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				plain : true,
				closeAction : 'hide',
				modal : true,
				html : "<iframe name='frmAttachPanel' src='" + fileUploadUrl
						+ "' frameborder=0 width=100% height=100%></iframe>"
			});
	templateWin.on('hide', function(win) {
				grid.getView().refreshRow(record);
			});
	templateWin.show();
}