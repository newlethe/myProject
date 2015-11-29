var centerPanel
var dateSelected = "all";
var stateSelected = "all";
var titleSearchField;
var pathLabel;
Ext.onReady(function() {

			// 详细信息 附件 下载 标记已读
			var updateInfoBtn = new Ext.Toolbar.Button({
						id : 'update-info',
						text : '详细信息',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/toolbar/toolbar_item_edit.png",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			var editBtn = new Ext.Toolbar.Button({

						id : 'edit-doc',
						text : '查看',
						tooltip : '直接打开查看word文档',
						icon : CONTEXT_PATH + "/jsp/res/images/word.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			var attachmentBtn = new Ext.Toolbar.Button({
						id : 'attachment',
						text : '附件',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icons/attach.png",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			var downloadBtn = new Ext.Toolbar.Button({
						id : 'download',
						text : '下载',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/file-download.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			var markAsReadBtn = new Ext.Toolbar.Button({
						id : 'mark-as-read',
						text : '标记已读',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icon-complete.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});
					
					//搜索框
						var titleSearchField = new Ext.app.SearchField({
				width : 150,
				onTrigger2Click: function(){
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
			pathLabel = new Ext.form.Label({text : '当前分类:'});
			// 第二行工具栏，显示当前选择的分类
			var sortPathBar = new Ext.Toolbar([pathLabel]);
			
			var dateFilterArr = new Array();
			dateFilterArr[0] = new Array('oneMonth', '近一月文件');
			dateFilterArr[1] = new Array('threeMonth', '近三月文件');
			dateFilterArr[2] = new Array('all', '所有时期文件');

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
			stateFilterArr[0] = new Array('unRead', '未读文件');
			stateFilterArr[1] = new Array('read', '已读文件');
			stateFilterArr[2] = new Array('all', '所有文件');

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
						dateSelected = rec.data["val"]
						dsResult.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
					});
			stateSearchCombo.on('select', function(c, rec, i) {
						stateSelected = rec.data["val"]
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
					}

			]);
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
				//标题搜索字符串
						var keyword = titleSearchField.getRawValue().trim();
						//若输入了关键字则显示搜索框上的“X”按钮
						if ( keyword.length > 0 ){
							titleSearchField.hasSearch = true;
							titleSearchField.triggers[0].show();
						}
						else{
							titleSearchField.triggers[0].hide();
						}
						
						Ext.apply(ds1.baseParams, {
									method : 'getComFileInfoPbulishedByUserId',
									dateSelected : dateSelected,
									stateSelected : stateSelected,
									sortId : selectNode.id,
									whereStr : " 1=1 ",
									keyword : keyword,
									orderby : "publish_time desc",
									userId : USERID,
									deptId : USERDEPTID
								});
								
					})

			// 创建选择模型
			var sm = new Ext.grid.CheckboxSelectionModel({
						listeners : {
							beforerowselect : function(sm, rowIndex, keep, rec) {

								if (this.deselectingFlag
										&& this.grid.enableDragDrop) {
									this.deselectingFlag = false;
									this.deselectRow(rowIndex);
									return this.deselectingFlag;
								}

								return keep;
							}
						},
						onMouseDown : function(e, t) {
							/*
							 * If you want make selections only by checking the
							 * checker box, add "&& t.className ==
							 * 'x-grid3-row-checker'" to next if statement
							 * 
							 * If you want to make selection only with Ctrl key
							 * pressed, add "&& e.ctrlKey" to next if statement
							 */
							if (e.button === 0) {
								if (t.className == 'x-grid3-row-checker'
										|| e.ctrlKey) {
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

			// 创建列模型
			var regEx = /^<img src=.*<\/img>/;
			// 编号 名称 部门 作者 时间 状态
			var columnModel = new Ext.grid.ColumnModel([sm, {
						header : '文件编号',
						dataIndex : 'fileBh',
						width : 60
					}, {
						header : '文件名称',
						dataIndex : 'fileTile',
						width : 300,
						renderer : function(value, metaData, record, rowIndex,
								colIndex, store) {
								
							var toolTip = record.data.fileTile.replace(regEx, '');
							return "<a title=\""+ toolTip +"\" class=\"downloadLink\" onclick=\"downloadFile('"
									+ record.data.fileId
									+ "','"
									+ record.data.fileLsh
									+ "')\">"
									+ value
									+ "</a>";

						}
					}, {
						header : '文件分类',
						dataIndex : 'fileSortName'

					}, {
						header : '发布人',
						dataIndex : 'publishUserName',
						width : 60
					}, {
						header : '发布时间',
						dataIndex : 'publishTime',
						renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') // Ext内置日期renderer

					}, {
						header : '部门',
						dataIndex : 'fileDeptName',
						width : 100,
						// 鼠标悬停时显示完整信息
						renderer : function(data, metadata, record, rowIndex,
								columnIndex, store) {

							var qtip = " qtip= " + data + " >";
							return '<span ' + qtip + data + '</span>';

						}
					}, {
						header : '作者',
						dataIndex : 'fileAutherName',
						width : 60
					}, {
						header : '起草时间',
						dataIndex : 'fileCreatetime',
						renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') // Ext内置日期renderer
						,hidden : true
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
			var toolbarItems = [downloadBtn,
											attachmentBtn, markAsReadBtn,'->',
											 dateSearchCombo,
											'-', stateSearchCombo, '-',titleSearchField];
			
			// 是否具有在线编辑功能
			if (g_canOlEdit) {
				toolbarItems.splice(1, 0,  editBtn);
			}
					
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
							forceFit : true
						},
						bbar : pageToolbar,
						tbar : new Ext.Toolbar({
									items :toolbarItems
								}),
						listeners : {
							'render' : function() {
								sortPathBar.render(this.tbar);
								
							}
						}

					});
			// grid的单元格点击事件
			grid.on('click', function() {
						var selRecords = grid.getSelectionModel()
								.getSelections();

						if (selRecords.length == 1) {
							setSingleFileBtnDisabled(false);
						} else {
							setSingleFileBtnDisabled(true);
						}
					});

			// 设置工具栏上单个文件操作按钮禁用/可用
			function setSingleFileBtnDisabled(disable) {
				// 详细信息按钮
				updateInfoBtn.setDisabled(disable);
				// 附件按钮
				attachmentBtn.setDisabled(disable);
				// 下载按钮
				downloadBtn.setDisabled(disable);
			}

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

		case 'edit-doc' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			editInWordWindow(selRecords[0].data.fileId);
			break;
		case 'update-info' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			showPropertyWin(selRecords[0].data.fileId);
			break;
		case 'download' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			downloadFile(selRecords[0].data.fileId, selRecords[0].data.fileLsh);
			break;

		case 'attachment' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			showAttachWin(selRecords[0].data.fileId);
			break;

		case 'mark-as-read' :
			// 没有选中则退出
			var selRecords = grid.getSelectionModel().getSelections();

			// 单个标记
			if (selRecords.length == 1) {
				changeState(selRecords[0].data.fileId, "read");
			} else if (selRecords.length > 1) {
				markSelectedAdRead(selRecords);
			}

			break;
			
		case 'search-btn':
				
			
				dsResult.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
					
			
			break;

	}
}

function editInWordWindow(filePk) {
	// alert(CONTEXT_PATH
	// + "/Business/fileAndPublish/fileManage/OpenViaOffice.jsp?filePk="
	// + filePk + "&fileLsh=" + fileLsh + "&editable=" + editable);

	ComFileManageDWR.findById(filePk, function(comFile) {
		var fileSuffix = comFile.fileSuffix.toLowerCase();
		if (!(fileSuffix == 'doc' || fileSuffix == 'docx'
				|| fileSuffix == 'xls' || fileSuffix == 'xlsx')) {
			Ext.Msg.alert("在线编辑", "在线编辑只支持doc,docx,xls,xlsx格式文件!");
			return;
		}

		var filePk = comFile.uids;
		var fileLsh = comFile.fileLsh;
		var editable = (comFile.billState == 0) && (comFile.statePublish == 0);
		var fileName;
		if (comFile.fileName) {
			fileName = comFile.fileName;
		} else {
			fileName = comFile.fileTile;
		}

		var retVal = window
				.showModalDialog(
						CONTEXT_PATH
								+ "/Business/fileAndPublish/fileManage/OpenViaOffice.jsp?filePk="
								+ filePk + "&fileLsh=" + fileLsh + "&fileName="
								+ encodeURIComponent(fileName) + "&fileSuffix="
								+ fileSuffix + "&editable=" + false,
						null,
						"dialogWidth:1000px;dialogHeight:800px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");

	});

}

function showPropertyWin(filePk) {

	var obj = new Object();
	obj.editMode = 'update';
	obj.editEnable = false;
	ComFileManageDWR.findById(filePk, function(comFileInfo) {
		obj.rec = new Ext.data.Record(comFileInfo);
		obj.selectedNode = selectNode;
		var treeInfo = new Object();
		treeInfo.rootId = g_rootId;
		treeInfo.rootName = g_rootName;
		obj.treeInfo = treeInfo
		obj.gridStore = dsResult;
		var style = "dialogWidth:800px;dialogHeight:500px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
		if (filePk == null) {
			style = "dialogWidth:800px;dialogHeight:300px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
		}
		window
				.showModalDialog(
						CONTEXT_PATH
								+ "/Business/fileAndPublish/fileManage/com.fileManage.property.jsp",
						obj, style);
	});

}

function downloadFile(filePk, fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/filedownload?method=fileDownload&id="
				+ fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该文件不存在!")
	}
}
function changeState(filePk, state) {
	ComFileManageDWR.changeUserReadState(USERID, filePk, state, function(dat) {
				if (dat) {
					Ext.Msg.alert("操作提示", "状态标记成功!")
					dsResult.reload();
				} else {
					Ext.Msg.alert("操作提示", "状态标记失败!")
				}
			});
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
					dsResult.reload();
				} else {
					Ext.Msg.alert("操作提示", "状态标记失败!")
				}
			});

}

function showAttachWin(filePk) {
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable=false&businessId="
			+ filePk;
	templateWin = new Ext.Window({
				title : "附件",
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
	templateWin.show();
}