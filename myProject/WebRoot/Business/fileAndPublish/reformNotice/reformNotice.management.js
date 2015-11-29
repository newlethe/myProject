var whereStr;
var grid;
var dsResult;
var showType = '0-0';
var defaultFilterType = 'all1';
var pathLabel;
var dateSelected = "all";
var queryTemplateBtn;
var sm;
var toolbarItems;// 所有工具栏按钮数组

Ext.onReady(function() {
	var btnDisabled = ModuleLVL != '1';

	var uploadFileBtn = new Ext.Toolbar.Button({
				id : 'upload-file',
				icon : CONTEXT_PATH + "/jsp/res/images/icons/add.png",
				cls : "x-btn-text-icon",
				text : "起草",
				handler : onItemClick,
				disabled : btnDisabled
			});

	var delBtn = new Ext.Toolbar.Button({
				id : 'delete',
				icon : CONTEXT_PATH + "/jsp/res/images/delete.gif",
				cls : "x-btn-text-icon",
				text : "删除",
				handler : onItemClick,
				disabled : btnDisabled
			});

	var updateInfoBtn = new Ext.Toolbar.Button({
				id : 'update-info',
				text : '修改',
				icon : CONTEXT_PATH + "/jsp/res/images/icons/application_view_detail.png",
				cls : "x-btn-text-icon",
				handler : onItemClick,
				disabled : btnDisabled
			});

	var publishBtn = new Ext.Toolbar.Button({
				id : 'publish',
				text : '发布',
				icon : CONTEXT_PATH + "/jsp/res/images/portal/page_up.gif",
				cls : "x-btn-text-icon",
				handler : onItemClick,
				disabled : btnDisabled
			});

	var queryBtn = new Ext.Toolbar.Button({
				id : 'advance-search',
				text : '查询',
				icon : CONTEXT_PATH + "/jsp/res/images/icons/search.png",
				cls : "x-btn-text-icon",
				handler : onItemClick,
				disabled : btnDisabled
			});

	var saveBtn = new Ext.Toolbar.Button({
				id : 'saveReform',
				text : '保存',
				iconCls : 'save',
				disabled : btnDisabled,
				handler : onItemClick
			});

	var reportBtn = new Ext.Toolbar.Button({
				id : 'report',
				text : action == 'report' ? '上报' : '审批',
				iconCls : action == 'report' ? 'upload' : 'permit',
				disabled : btnDisabled,
				handler : onItemClick
			});

	var rollback = new Ext.Button({
				id : 'rollback',
				text : '退回',
				iconCls : 'rollback',
				disabled : btnDisabled,
				handler : onItemClick
			});

	queryTemplateBtn = new Ext.Toolbar.Button({
				id : 'query-template',
				icon : CONTEXT_PATH + "/jsp/res/images/page_word.png",
				cls : "x-btn-text-icon",
				text : "下载分类模板[0]",
				handler : onItemClick
			});

	var detailInfoBtn = new Ext.Toolbar.Button({
						id : 'detail-info',
						text : '详细信息',
						icon : CONTEXT_PATH + "/jsp/res/images/icons/application_view_detail.png",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

	pathLabel = new Ext.form.Label({
				text : '当前分类:'
			});

	// 第二行工具栏，显示当前选择的分类
	var sortPathBar = new Ext.Toolbar([pathLabel]);

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

	var isreformStore = new Ext.data.SimpleStore({
			fields : ['val', 'text'],
			data : [[0,'未整改'], [1,'已整改']]
		});

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
	dateSearchCombo.on('select', function(c, rec, i) {
				dateSelected = rec.data["val"];
				dsResult.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});

	var dataGridRs = Ext.data.Record.create([{
				name : 'comfileUids',
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
				name : 'fileSortId',
				type : 'string'
			}, {
				name : 'fileSortName',
				type : 'string'
			}, {
				name : 'fileContent',
				type : 'string'
			}, {
				name : 'fileAuther',
				type : 'string'
			}, {
				name : 'fileAutherName',
				type : 'string'
			}, {
				name : 'fileCreatetime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'billState',
				type : 'int'
			}, {
				name : 'billStateName',
				type : 'string'
			}, {
				name : 'fileDept',
				type : 'string'
			}, {
				name : 'statePublish',
				type : 'int'
			}, {
				name : 'publisStateName',
				type : 'string'
			}, {
				name : 'fileDeptName',
				type : 'string'
			}, // 重要：用于在线编辑使用
			{ // 信息名（下载时保存的信息名）
				name : 'fileName',
				type : 'string'
			}, { // 信息后缀名（判断信息是否可以在线编辑）
				name : 'fileSuffix',
				type : 'string'
			}, { // 移交状态
				name : 'isTransfered',
				type : 'boolean'
			}, { // 上报状态
				name : 'reportStatus',
				type : 'int'
			}, { // 所属单位名称
				name : 'fileUnitName',
				type : 'string'
			}, {
				name : 'reformUids',
				type : 'string'
			}, {
				name : 'isreform',
				type : 'float'
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
				id : "comfileUids",
				root : 'topics',
				totalProperty : 'totalCount'
			}, dataGridRs)

	dsResult = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : CONTEXT_PATH + '/servlet/ComFileManageServlet'
						}),
				reader : dataGridDsReader
			});

	dsResult.on("beforeload", function(ds1) {
				var keyword = titleSearchField.getRawValue().trim();
				// 若输入了关键字则显示搜索框上的“X”按钮
				if (keyword.length > 0) {
					titleSearchField.hasSearch = true;
					titleSearchField.triggers[0].show();
				} else {
					titleSearchField.triggers[0].hide();
				}
				Ext.apply(ds1.baseParams, {
							method : 'getReformNoticeBySortIdNoDepts',
							sortId : selectNode.id,
							whereStr : whereStr,
							orderby : "file_createtime desc",
							showType : showType,
							// deptIds : USERDEPTID,
							pid : CURRENTAPPID,
							dateSelected : dateSelected,
							keyword : keyword
						})
			});

	// 创建选择模型
	sm = new Ext.grid.CheckboxSelectionModel({
				listeners : {
					beforerowselect : function(sm, rowIndex, keep, rec) {
						if (this.deselectingFlag && this.grid.enableDragDrop) {
							this.deselectingFlag = false;
							this.deselectRow(rowIndex);
							return this.deselectingFlag;
						}
						return keep;
					},
					rowselect : function(sm, rowIndex, rec) {
						if (action == 'publish') {
							var flag = rec.get('statePublish') == 1 ? true : false;
							updateInfoBtn.setDisabled(flag);
							delBtn.setDisabled(flag);
						} else if (action == 'report') {
							var flag = rec.get('reportState') == '0' || rec.get('reportState') == '2' ? false : true;
							saveBtn.setDisabled(flag);
							reportBtn.setDisabled(flag)
						} else if (action == 'examine') {
							var flag = rec.get('reportState') == '1' ? false : true;
							saveBtn.setDisabled(flag);
							reportBtn.setDisabled(flag);
							rollback.setDisabled(flag);
						}
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

	var columnModel = new Ext.grid.ColumnModel([sm,
				{
					header : '单位',
					dataIndex : 'fileUnitName',
					align : 'center',
					width : 120,
					renderer : function(data, metadata, record, rowIndex, columnIndex,
							store) {
						var qtip = " qtip= " + data + " >";
						return '<span ' + qtip + data + '</span>';
					}
				}, {
					header : '部门',
					dataIndex : 'fileDeptName',
					align : 'center',
					width : 120,
					renderer : function(data, metadata, record) {
						if (record.data.fileUnitName == data) {
							return '';
						} else {
							var qtip = " qtip= " + data + " >";
							return '<span ' + qtip + data + '</span>';
						}
					}
				}, {
					header : '起草人',
					dataIndex : 'fileAutherName',
					align : 'center',
					width : 80
				}, {
					header : '标题',
					dataIndex : 'fileTile',
					width : 200,
					align : 'center',
					renderer : function(value, metaData, record, rowIndex, colIndex, store) {
						var htmlStr = '<span qtip="' + value + '" class="downloadLink" onclick="showPropertyWin(\''
								+ record.data.comfileUids + '\',\'update\')" >' + value + '</span>';
						return htmlStr;
					}
				}, {
					header : '内容简述',
					dataIndex : 'fileContent',
					width : 200,
					align : 'center',
					renderer : function(value, metadata, record) {
						metadata.attr = ' ext:qtip="' + value + '"';
						return value;
					}
				}, {
					header : '附件',
					dataIndex : 'comfileUids',
					align : 'center',
					width : 60,
					renderer : function(value, metadata, record) {
						var rtnStr = '';
						DWREngine.setAsync(false);
						ComFileManageDWR.getFileAttachCount(record.data.comfileUids, function(cnt) {
									rtnStr = '<span class="downloadLink" onclick="showAttachWin(\''
										+ record.data.comfileUids + '\',\'FAPAttach\')">附件[' + cnt + ']</span>';
								});
						DWREngine.setAsync(true);
						return rtnStr;
					}
				}, {
					header : '移交状态',
					dataIndex : 'isTransfered',
					hidden : true,
					renderer : function(value) {
						return value ? '已移交' : '未移交'
					}
				}, {
					header : '起草时间',
					dataIndex : 'fileCreatetime',
					align : 'center',
					width : 100,
					renderer : Ext.util.Format.dateRenderer('Y-n-j H:i') // Ext内置日期renderer
				}, {
					header : '信息分类',
					dataIndex : 'fileSortName',
					align : 'center',
					hidden : true
				}, {
					header : '发布状态',
					dataIndex : 'statePublish',
					align : 'center',
					width : 60,
					hidden : action != 'publish',
					renderer : function(value) {
						return value ? '已发布' : '未发布';
					}
				}, {
					header : 'reportStatus',
					dataIndex : 'reportStatus',
					align : 'center',
					hidden : true,
					width : 100,
					renderer : function(value) {
						return value ? "已上报" : "未上报";
					}
				}, {
					header : '是否整改',
					dataIndex : 'isreform',
					align : 'center',
					hidden : action == 'publish',
					width : 70,
					renderer : function(value, metadata, record) {
						if (action == 'report'){
							metadata.attr = "style=background-color:#FBF8BF";
						}
						return value ? "已整改" : "未整改";
					},
					editor : new Ext.form.ComboBox({
						store : isreformStore,
						displayField : 'text',
						valueField : 'val',
						mode : 'local',
						triggerAction : 'all'
					})
				}, {
					header : '整改措施',
					dataIndex : 'comfileUids',
					align : 'center',
					width : 70,
					hidden : action == 'publish',
					renderer : function(value, metadata, record) {
						if (action == 'report'){
							metadata.attr = "style=background-color:#FBF8BF";
						}
						var rtnStr = '';
						DWREngine.setAsync(false);
						ComFileManageDWR.getReformFileAttachCount(record.data.comfileUids, function(cnt) {
									rtnStr = '<span class="downloadLink" onclick="showAttachWin(\''
										+ record.data.comfileUids + '\',\'ReformAttach\')">附件[' + cnt + ']</span>';
								});
						DWREngine.setAsync(true);
						return rtnStr;
					}
				}, {
					header : '整改时间',
					dataIndex : 'reformTime',
					hidden : action == 'publish',
					align : 'center',
					width : 70,
					editor : new Ext.form.DateField({allowBlank : false}),
					renderer : function(value, metadata, record) {
						if (action == 'report'){
							metadata.attr = "style=background-color:#FBF8BF";
						}
						return Ext.util.Format.date(value, 'Y-n-j');
					}
				}, {
					header : '整改建议',
					dataIndex : 'reformOpinion',
					hidden : action == 'publish',
					align : 'center',
					width : 300,
					editor : new Ext.form.TextArea(),
					renderer : function(value, metadata, record) {
						if (action == 'examine'){
							metadata.attr = "style=background-color:#FBF8BF";
						}
						return value;
					}
				}, {
					header : action == 'report' ? '上报状态' : '审批状态',
					dataIndex : 'reportState',
					align : 'center',
					hidden : action == 'publish',
					width : 100,
					renderer : function(v) {
						var str = "未上报";
						if (v == '2'){	//退回
							str = '退回';
						} else if ((v == '1' || v == '3') && action == 'report'){
							str = '已上报';
						} else if (v == '1' && action == 'examine'){
							str = '未审批';
						} else if (v == '3' && action == 'examine'){
							str = '已审批';
						}
						return str;
					}
				}, {
					header : 'reformUids',
					dataIndex : 'reformUids',
					hidden : true
				}, {
					header : 'pid',
					dataIndex : 'pid',
					hidden : true
				}
			]);

	pageToolbar = new Ext.PagingToolbar({
				pageSize : PAGE_SIZE,
				beforePageText : "第",
				afterPageText : "页, 共{0}页",
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

	switch (action) {
		case 'publish' :
			toolbarItems = [uploadFileBtn, '-', updateInfoBtn, '-', delBtn, '-', publishBtn,
						'->', dateSearchCombo, '-', titleSearchField];
			// 是否有“下载分类模板”按钮
			if (g_templateBtn == 1) {
				toolbarItems.splice(7, 0, '-', queryTemplateBtn);
			}
			break;
		case 'report' :
			toolbarItems = [saveBtn, '-', reportBtn, '->', dateSearchCombo, '-', titleSearchField];
			break;
		case 'examine' :
			toolbarItems = [saveBtn, '-', reportBtn, '-', rollback, '->', dateSearchCombo, '-', titleSearchField];
			break;
		case 'query' :
		toolbarItems = [saveBtn, '-', permit, '-', rollback, '->', dateSearchCombo, '-', titleSearchField];
//			toolbarItems = [detailInfoBtn, '-',markAsReadBtn,markAllReadBtn,
//						'->', dateSearchCombo, '-', stateSearchCombo, '-',titleSearchField];
			break;
	}

	grid = new Ext.grid.EditorGridTbarPanel({
				id : 'file-grid',
				ds : dsResult,
				cm : columnModel,
				sm : sm,
				region : 'center',
				layout : 'anchor',
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				stripeRows : true,
				addBtn : false,
				saveBtn : false,
				delBtn : false,
				servletUrl : MAIN_SERVLET,
				primaryKey : 'reformUids',
				bean : 'com.sgepit.fileAndPublish.hbm.ReformNoticeInfo',
				viewConfig : {
					forceFit : false,
					addIgnore : true
				},
				bbar : pageToolbar,
				tbar : new Ext.Toolbar({
							items : toolbarItems
						}),
				listeners : {
					'render' : function() {
						sortPathBar.render(this.tbar);
					},
					'beforeedit' : function(e) {
						if(action == 'report' && (e.field == 'reformOpinion'
								|| e.record.get('reportState') == '1' || e.record.get('reportState') == '3')){
							return false;
						}else if(action == 'examine' && (e.field == 'isreform'
								|| e.field == 'reformTime' || e.record.get('reportState') == '3')){
							return false;
						}
					}
				}
			});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, grid]
			});

	grid.getStore().on("load", function() {
				var count = grid.getStore().getCount();
				if (count == 0) {
					// 修改按钮
					updateInfoBtn.setDisabled(true);
					// 删除按钮
					delBtn.setDisabled(true);

				}
			});

	setFilter(defaultFilterType);

	function setFilter(val) {
		showType = '0-0';
		whereStr = " 1=1 ";
		if (action == 'report') {
			whereStr = " statePublish = 1 ";
		} else if (action == 'examine') {
			whereStr = " (reportState = '1' or reportState = '3') ";
		}
		dsResult.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}

})

function onItemClick(item) {
	switch (item.id) {
		case 'upload-file' :
			showPropertyWin(null, "insert");
			break;
		case 'query-template' :
			var fileUploadUrl = CONTEXT_PATH
					+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPTemplate&editable=false&businessId="
					+ selectNode.id;
			templateWin = new Ext.Window({
						title : selectNode.getPath('text') + '-模板',
						width : 600,
						height : 400,
						minWidth : 300,
						minHeight : 200,
						layout : 'fit',
						plain : true,
						closeAction : 'hide',
						modal : true,
						html : "<iframe name='frmTemplatePanel' src='"
								+ fileUploadUrl
								+ "' frameborder=0 width=100% height=100%></iframe>"
					});
			templateWin.show();
			break;
		case 'update-info' :
			var selRecords = grid.getSelectionModel().getSelections();
			if (selRecords.length != 1) {
				Ext.example.msg('提示','请选择一条整改通知单!');
				break;
			}
			showPropertyWin(selRecords[0].data.comfileUids, 'update');
			break;
		case 'delete' :
			var selRecords = grid.getSelectionModel().getSelections();
			if (selRecords.length == 0) {
				Ext.example.msg('提示','请选择要删除的整改通知单!');
				break;
			}
			deleteReformNotice(selRecords);
			break;
		case 'publish' :
			var selRecords = grid.getSelectionModel().getSelections();
			if (selRecords.length != 1) {
				Ext.example.msg("操作提示", "请选择一条信息发布!");
			} else {
				pubfileWinBatch(selRecords);
			}
			break;
		case 'saveReform' :
			grid.defaultSaveHandler();
			break;
		case 'report' :
			var selRecords = grid.getSelectionModel().getSelections();
			var msgname,reportState;
			var reformIdArr = [];
			if (action == 'report') {
				msgname = '上报';
				reportState = '1';
			} else if (action == 'examine') {
				msgname = '审批';
				reportState = '3';
			} 
			if (selRecords.length == 0){
				Ext.example.msg('提示', '请选择要' + msgname + '的信息!');
				return false;
			}
			for (var i = 0; i < selRecords.length; i++) {
				if (selRecords[i].isModified('isreform') || selRecords[i].isModified('reformTime')
						 || selRecords[i].isModified('reformOpinion')){
					Ext.example.msg('提示', '信息[' + selRecords[i].data.fileTile + ']有修改,请先保存!');
					return false;
				}
				if (action == 'report'){
					if(selRecords[i].data.isreform == 0){
						Ext.example.msg('提示', '信息[' + selRecords[i].data.fileTile + ']未整改!');
						return false;
					}
					if(!selRecords[i].data.reformTime){
						Ext.example.msg('提示', '信息[' + selRecords[i].data.fileTile + ']整改时间不可为空!');
						return false;
					}
					var count = 0;
					DWREngine.setAsync(false);
					ComFileManageDWR.getReformFileAttachCount(selRecords[i].data.comfileUids, function(cnt) {
								count = cnt;
							});
					DWREngine.setAsync(true);
					if(count == 0){
						Ext.example.msg('提示', '信息[' + selRecords[i].data.fileTile + ']未上传整改措施文件!');
						return false;
					}
				}
				if (selRecords[i].data.reportState == reportState) {
					Ext.example.msg('提示', '信息[' + selRecords[i].data.fileTile + ']已' + msgname);
					return false;
				}
				reformIdArr.push(selRecords[i].data.reformUids);
			}
			DWREngine.setAsync(false);
			Ext.Msg.confirm("提示", "是否" + msgname + "所选的" + selRecords.length + "条信息?",
					function(btn) {
						if (btn == "yes") {
							var doExchange = DEPLOY_UNITTYPE != '0';
							ComFileManageDWR.reportReformNotice(reformIdArr, reportState, function(retVal) {
										if (retVal) {
											Ext.example.msg("提示", msgname + "成功!")
											dsResult.reload();
											sm.clearSelections();
										} else {
											Ext.example.msg("提示", msgname + "失败!")
										}
									});
						}
					});
			DWREngine.setAsync(true);
			break;
		case 'rollback' :
			var selRecords = grid.getSelectionModel().getSelections();
			if	(selRecords.length == 0){
				Ext.example.msg('提示', '请选择要退回的信息');
				return false;
			}
			var	reportState = '2';
			var reformIdArr = [];
			for (var i = 0; i < selRecords.length; i++) {
				if (selRecords[i].isModified('reformOpinion')){
					Ext.example.msg('提示', '信息[' + selRecords[i].data.fileTile + ']有修改,请先保存!');
					return false;
				}
				if (selRecords[i].data.reportState == reportState) {
					Ext.example.msg('提示', '信息[' + selRecords[i].data.fileTile + ']已退回!');
					return false;
				}
				reformIdArr.push(selRecords[i].data.reformUids);
			}
			DWREngine.setAsync(false);
			Ext.Msg.confirm("提示", "是否退回所选的" + selRecords.length + "条信息?",
					function(btn) {
						if (btn == "yes") {
							var doExchange = DEPLOY_UNITTYPE != '0';
							ComFileManageDWR.reportReformNotice(reformIdArr, reportState, function(retVal) {
										if (retVal) {
											Ext.example.msg("提示", "退回成功!")
											dsResult.reload();
											sm.clearSelections();
										} else {
											Ext.example.msg("提示", "退回失败!")
										}
									});
						}
					});
			DWREngine.setAsync(true);
			break;
	}
}

// 附件窗口
function showAttachWin(filePk, businessType) {
	var record = dsResult.getById(filePk);
	var editEnable = true;
	if (record && businessType == 'FAPAttach' && record.get("statePublish") == 1) {
		editEnable = false;
	}else if (record && businessType == 'ReformAttach' && (action != 'report'
			|| record.get("reportState") == '1' || record.get("reportState") == '3')) {
		editEnable = false;
	}
	if (ModuleLVL != '1')
		editEnable = false;
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editEnable + "&businessId=" + filePk;
	var fileTitle = record.get("fileTile");
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

function showPropertyWin(filePk, eM) {
	var record;
	if (filePk){
		record = dsResult.getById(filePk);
	}
	var obj = new Object();
	obj.rec = record;
	obj.editMode = eM;
	obj.editEnable = true;
	if (record && record.get("statePublish") == 1) {
		obj.editEnable = false;
	}
	obj.selectedNode = selectNode;
	var treeInfo = new Object();
	treeInfo.rootId = g_rootId;
	treeInfo.rootName = g_rootName;
	obj.treeInfo = treeInfo;
	obj.gridStore = dsResult;
	obj.filterPid = filterPid;
	obj.opinion = '';
	var style = "dialogWidth:800px;dialogHeight:500px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	var winUrl = CONTEXT_PATH + "/Business/fileAndPublish/reformNotice/reformNotice.property.jsp";

	var retVal = window.showModalDialog(winUrl, obj, style);
	if (retVal == 'changed') {
		dsResult.reload();
	}
}

// 批量删除
function deleteReformNotice(records) {
	// 生成id数组
	var ids = new Array();
	// 检查所有信息的状态
	for (var i = 0; i < records.length; i++) {
		if (records[i].get('statePublish') == 1) {
			Ext.example.msg("提示", "不能删除已发布的信息[" + records[i].data.fileTile + "]!");
			return false;
		}
		// 向数组添加值
		ids.push(records[i].data.comfileUids);
	}
	// 批量删除
	Ext.Msg.confirm("提示", "将删除所选的" + ids.length + "个信息及其附件，删除后将无法恢复，请确认?",
			function(btn) {
				if (btn == "yes") {
					var mask = new Ext.LoadMask(Ext.getBody(), {
								msg : "正在删除..."
							});
					mask.show();
					ComFileManageDWR.deleteReformNotice(ids, function(retVal) {
								if (retVal) {
									mask.hide();
									Ext.example.msg("提示", "信息删除成功!");
									dsResult.reload();
								} else {
									mask.hide();
									Ext.example.msg("提示", "信息删除失败，操作终止!");
								}
							})
				}
			});
}

function pubfileWinBatch(records) {
	var ids = new Array();
	for (var i = 0; i < records.length; i++) {
		ids.push(records[i].data.comfileUids);
	}
	var rtn = window.showModalDialog(CONTEXT_PATH
					+ "/Business/fileAndPublish/fileManage/com.fileManage.pub.batch.jsp?exchangeOnPublish="
					+ exchangeOnPublish, ids,
					"dialogWidth:800px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
		dsResult.reload();
		sm.clearSelections();
	}
}

function yjzls(filePk) {
	var rtn = windowshowModalDialog(
				CONTEXT_PATH + "/Business/fileAndPublish/fileTrans/com.fileTrans.jsp?fileId="+ filePk,
				null,"dialogWidth:900px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
		dsResult.reload();
	}
}