var centerPanel
var whereStr = " file_auther = '" + USERID + "' ";
var grid;
var dsResult;
var showType = '0-0';
var defaultFilterType = 'person';
var pathLabel;
var recordUpdate;
var sm;
Ext.onReady(function() { 
			var btnDisabled = ModuleLVL != '1';

			var uploadFileBtn = new Ext.Toolbar.Button({
						id : 'upload-file',
						icon : CONTEXT_PATH + "/jsp/res/images/icons/add.png",
						cls : "x-btn-text-icon",
						text : "新增文件",      
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
			var queryTemplateBtn = new Ext.Toolbar.Button({
						id : 'query-template',
						icon : CONTEXT_PATH + "/jsp/res/images/page_word.png",
						cls : "x-btn-text-icon",
						text : "下载分类模板",
						handler : onItemClick
					});

			// 编辑 修改 删除 重新上传
			var editBtn = new Ext.Toolbar.Button({

						id : 'edit-doc',
						text : SETTLEMENT=='true'?'下载':'编辑',
						tooltip : SETTLEMENT=='true'?'下载':'直接打开编辑word文档',
						icon : SETTLEMENT=='true'?CONTEXT_PATH + "/jsp/res/images/file-download.gif":CONTEXT_PATH + "/jsp/res/images/word.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});

			var updateInfoBtn = new Ext.Toolbar.Button({
						id : 'update-info',
						text : '详细信息',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/toolbar/toolbar_item_edit.png",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});

			var reuploadBtn = new Ext.Toolbar.Button({
						id : 'reupload',
						text : '重新上传',
						icon : CONTEXT_PATH + "/jsp/res/images/upload.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});

			var publishBtn = new Ext.Toolbar.Button({
						id : 'publish',
						text : '发布',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icon-no-group.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});
			var recycleBtn = new Ext.Toolbar.Button({
						id : 'recycle',
						text : '回收',
						icon : CONTEXT_PATH + "/jsp/res/images/upload.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});
			// 模糊查找
			var queryBtn = new Ext.Toolbar.Button({
						id : 'advance-search',
						text : '查询',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icons/search.png",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});

			// 移交资料室
			var transBtn = new Ext.Toolbar.Button({

						id : 'transfer',
						text : '移交文件',
						handler : onItemClick,
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icons/book_go.png",
						cls : "x-btn-text-icon",
						disabled : btnDisabled
					});

			// 上报
			var reportBtn = new Ext.Toolbar.Button({
						id : 'report',
						text : '上报',
						handler : onItemClick,
						icon : CONTEXT_PATH + "/jsp/res/images/file-upload.gif",
						cls : "x-btn-text-icon",
						disabled : btnDisabled
					});

			//sortItem = new Ext.Toolbar.Item('softPath');
			pathLabel = new Ext.form.Label({text : '当前分类:'});
			// 第二行工具栏，显示当前选择的分类
			var sortPathBar = new Ext.Toolbar([pathLabel]);

			var filterArr = new Array();
			// 有上报功能的模块，在集团中添加“所有的文件”过滤选项
			// if (g_canReport && DEPLOY_UNITTYPE == '0') {
			// filterArr.push(new Array('all', '所有的文件'));
			// //defaultFilterType = 'reported';
			// }
			// filterArr.push(new Array('ALL', '部门所有文件'));
			filterArr.push(new Array('person', '我起草(上传)的文件'));
			// filterArr.push(new Array('other', '部门其他文件'));
			filterArr.push(new Array('deptAndPublish', '部门文件和发布给我的文件'));

			var queryDt = new Ext.data.SimpleStore({
						fields : ['val', 'text'],
						data : filterArr
					});
			var searchCombo = new Ext.form.ComboBox({
						id : 'search',
						allowBlank : false,
						store : queryDt,
						fieldLabel : '查询',
						displayField : 'text',
						valueField : 'val',
						typeAhead : true,
						mode : 'local',
						triggerAction : 'all',
						width : 180,
						editable : false,
						disabled : true,
						selectOnFocus : true
					});
			searchCombo.setValue(defaultFilterType);

			searchCombo.on('select', function(c, rec, i) {
						setFilter(rec.data['val']);
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
					{ // 文件名（下载时保存的文件名）
						name : 'fileName',
						type : 'string'
					}, { // 文件后缀名（判断文件是否可以在线编辑）
						name : 'fileSuffix',
						type : 'string'
					}, { // 移交状态
						name : 'isTransfered',
						type : 'boolean'
					}, { // 上报状态
						name : 'reportStatus',
						type : 'int'
					}]);
			var dataGridDsReader = new Ext.data.JsonReader({
						id : "uids",
						root : 'topics',
						totalProperty : 'totalCount'
					}, dataGridRs)

			dsResult = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : CONTEXT_PATH
											+ '/servlet/ComFileManageServlet'
								}),
						reader : dataGridDsReader
					});
			dsResult.on("beforeload", function(ds1) {

						Ext.apply(ds1.baseParams, {
									method : 'getComFileInfoBySortId',
									sortId : SETTLEMENT=='true'?'settlement':selectNode.id,
									whereStr : SETTLEMENT=='true'?null:whereStr,
									orderby : "file_createtime desc",
									showType : SETTLEMENT=='true'?"":showType,
									deptIds : USERDEPTID,
									pid : filterPid
								})
					});
			/*
			 * var fileNameShow = ""; if(parent.fromModule &&
			 * parent.fromModule=="editDoc") { fileNameShow = '<u
			 * style="cursor:hand;"><a
			 * onclick=openThisDocAtEast("{fileid}");return false;><font
			 * color=blue>{filename}</font></a></u>' } else { fileNameShow = '<a
			 * href=' + CONTEXT_PATH + '{url} >{filename}</a>'; }
			 */

			var imgs = "<img src='" + CONTEXT_PATH
					+ "/jsp/res/images/white_word.png'>"

			// 创建选择模型
			sm = new Ext.grid.CheckboxSelectionModel({
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
			sm.on('rowselect', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				recordUpdate=record;
				DWREngine.setAsync(false);
				ComFileManageDWR.findById(record.data.uids, function(comFileInfo) {
					recordUpdate.data.fileTile=comFileInfo.fileTile;
				});
				DWREngine.setAsync(true);				
			});	
			// 创建列模型

			// 编号 名称 部门 作者 时间 状态
			var columnModel = new Ext.grid.ColumnModel([sm, {
						header : '文件编号',
						dataIndex : 'fileId',
						width : 80
					}, {
						header : '文件名称',
						dataIndex : 'fileTile',
						width : 160,
						align:'center',
						renderer : function(value, metaData, record, rowIndex,
								colIndex, store) {
//							if(SETTLEMENT=='true'){
//							return '<a class="downloadLink" fileTitle="'+record.data.fileTitle+
//							'" fileName="'+record.data.fileName+'" reportStatus="'+record.data.reportStatus+
//							'" statePublish="'+record.data.statePublish+'" billState="'+record.data.billState+
//							'" fileLsh="'+record.data.fileLsh+'" uids="'
//							+record.data.uids+'" fileSuffix="'+record.data.fileSuffix+'" title="在线编辑'
//									+ value + '" onclick=editInWordWindow(this)>' + value
//									+ '</a>';
//							}else {
							return '<a class="downloadLink" title="下载'
									+ value + '" onclick=downloadFile("'+ record.data.uids + '","'+ record.data.fileLsh + '")>' + value
									+ '</a>';
//							}		
						}
					}, {
						header : '移交状态',
						dataIndex : 'isTransfered',
						renderer : function(value) {
							return value ? '已移交' : '未移交'
						},
						width : 38,
						hidden : true
					}, {
						header : '部门',
						dataIndex : 'fileDeptName',
						align : 'center',
						width : 80
					}, {
						header : '作者',
						dataIndex : 'fileAutherName',
						align : 'center',
						width : 58
					}, {
						header : '创建时间',
						dataIndex : 'fileCreatetime',
						align : 'center',
						renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'), // Ext内置日期renderer
						width : 80
					}, {
						header : '文件分类',
						dataIndex : 'fileSortName',
						align : 'center',
						width : 100,
						hidden :SETTLEMENT=="true"?true:false

					}, {
						header : '发布状态',
						dataIndex : 'statePublish',
						align : 'center',
						width : 42,
						hidden :SETTLEMENT=="true"?true:false,
						renderer : function(value) {
							return value ?value==1?'已发布':'已回收': '未发布';
						}
					}, {
						header : '上报状态',
						dataIndex : 'reportStatus',
						align : 'center',
						renderer : function(value) {
							return value ? '已上报' : '未上报'
						},
						width : 42,
						hidden : true
					}]);

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
             
			// 所有工具栏按钮数组
			var toolbarItems = [uploadFileBtn, '-', updateInfoBtn, '-', delBtn,
					'-', reuploadBtn, '-', publishBtn, '-', recycleBtn,'-',searchCombo];
			// 是否有“下载分类模板”按钮
			if (g_templateBtn) {
				toolbarItems.splice(9, 0, '-', queryTemplateBtn)
			}
            if(SETTLEMENT=='true'){
             toolbarItems.splice(8, 1)
            }
			// 上报功能
			if (g_canReport ) {

				columnModel.setHidden(9, false);
				// 上报按钮
				toolbarItems.splice(9, 0, '-', reportBtn);

			}

			// 是否显示移交资料室功能
			if (g_canTrans) {
				// 移交状态列
				columnModel.setHidden(3, false);
				// 移交按钮
				toolbarItems.splice(5, 0, '-', transBtn);
			}
			// 是否具有在线编辑功能
			if (g_canOlEdit) {
				toolbarItems.splice(1, 0, '-', editBtn);
			}

			// 创建Grid
			grid = new Ext.grid.GridPanel({

						ds : dsResult,
						cm : columnModel,
						sm : sm,
						region : 'center',
						layout : 'anchor',
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						stripeRows : true,
						viewConfig : {
							forceFit : true
						},
						bbar : pageToolbar,
						tbar : new Ext.Toolbar({
									items : toolbarItems
								}),
						listeners : {
							'render' : function() {
								if(SETTLEMENT!='true')
								sortPathBar.render(this.tbar);
							}
						}

					});

			// grid的单元格点击事件
			grid.on('click', function() {
						var selRecords = grid.getSelectionModel()
								.getSelections();
						if (ModuleLVL != '1')
							return;
						if (selRecords.length == 1) {
							setSingleFileBtnDisabled(false);
						} else {
							setSingleFileBtnDisabled(true);
						}
					
						if(selRecords.length>=1){//针对删除按钮，选择一条或多条时都能删除,发布按钮可以多条发布，故同理
							setDelBtnDisabled(false);
						}else{ 
							setDelBtnDisabled(true);
						}
						 
					});

			// 设置工具栏上单个文件操作按钮禁用/可用
			function setSingleFileBtnDisabled(disable) {
				// 修改按钮
				updateInfoBtn.setDisabled(disable);
				// 编辑按钮
				editBtn.setDisabled(disable);
				// 重新上传按钮
				reuploadBtn.setDisabled(disable);
			}
			//设置删除按钮是否可用 
			function setDelBtnDisabled(disable) {
				delBtn.setDisabled(disable); 
			    publishBtn.setDisabled(disable); 
			    recycleBtn.setDisabled(disable);
			    var record = sm.getSelected();
			    if(record){
				    if((USERID==record.data.fileAuther)&&!disable){
				    	 recycleBtn.setDisabled(false);
				    }else{
				    	 recycleBtn.setDisabled(true);
				    }			    	
			    }
			}
            if(SETTLEMENT=='true'){
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
					});
            }else {
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [treePanel, grid]
					});
            
            }
			grid.getStore().on("load",function(){
			var count=grid.getStore().getCount();
			if(count==0){ 
    			// 修改按钮
				updateInfoBtn.setDisabled(true);
				// 编辑按钮
				editBtn.setDisabled(true);
				// 重新上传按钮
				reuploadBtn.setDisabled(true);
				//删除按钮
				delBtn.setDisabled(true); 
				//发布按钮
				publishBtn.setDisabled(true);
				//回收按钮
				recycleBtn.setDisabled(true);
			}
			});
			if (collapseSortPnl) {
				treePanel.collapse();
			}
			setFilter(defaultFilterType);
			dsResult.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});

			function setFilter(val) {
				if(SETTLEMENT=='true'){
				showType = '0-0';
				whereStr = " 1=1 ";
				if (val == 'all') {
					showType = '0-1';
				} else if (val == 'person') {
					whereStr = " file_auther = '" + USERID + "' ";
				} else if (val == 'other') {
					whereStr = " file_auther <> '" + USERID + "' ";
				} else if (val == 'deptAndPublish') {
					showType = '0-2';
				}
				}else {
				showType = '0-0';
				whereStr = " 1=1 ";
				if (val == 'all') {
					showType = '0-1';
				} else if (val == 'person') {
					whereStr = " file_auther = '" + USERID + "' ";
				} else if (val == 'other') {
					whereStr = " file_auther <> '" + USERID + "' ";
				} else if (val == 'deptAndPublish') {
					showType = '0-2';
				}
				}
				// else if (val == 'reported') {
				// showType = '1-1';
				// whereStr = " report_status = 1";
				// }
				dsResult.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			}

		});
function showPropertyWin(filePk, eM) {
	var record = dsResult.getById(filePk);

	var obj = new Object();
	obj.rec = record;
	obj.editMode = eM;
	obj.editEnable = true;
	if (record) {
		if (record.get("billState") != 0 || record.get("statePublish") != 0
				|| record.get('reportStatus') != 0) {
			obj.editEnable = false;
		}
		if(2==record.get("statePublish")){//回收状态
			obj.editEnable = true;
		}
	}
	obj.selectedNode = selectNode;
	var treeInfo = new Object();
	treeInfo.rootId = g_rootId;
	treeInfo.rootName = g_rootName;
	obj.treeInfo = treeInfo;
	obj.gridStore = dsResult;
	obj.filterPid = filterPid;
	var style = "dialogWidth:800px;dialogHeight:500px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	if (filePk == null) {
		style = "dialogWidth:800px;dialogHeight:300px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	}
	
	var winUrl = CONTEXT_PATH
			+ "/Business/fileAndPublish/fileManage/com.fileManage.property.jsp";
			if(SETTLEMENT=='true')
			winUrl+="?settlement=true";
	window.showModalDialog(winUrl, obj, style);
}

function onItemClick(item) {
	switch (item.id) {
		case 'upload-file' :
			if (tmp_parent != true) {
				Ext.Msg.show({
					title : '提示',
					msg : '请选择子节点！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
		
				});
				return;
			}
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

		case 'edit-doc' :
			var selRecords = grid.getSelectionModel().getSelections();
			if (selRecords.length != 1) {
				return;
			}

			var curComFile = selRecords[0].data;
		     if(SETTLEMENT=='true'){
		     downloadFile(curComFile.fileLsh);
		     }else {
			   editInWordWindow(curComFile);
		     }

			break;

		case 'update-info' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			showPropertyWin(selRecords[0].data.uids, 'update');
			break;
		case 'reupload' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			uploadFile(selRecords[0].data.uids);
			break;

		case 'delete' :
			// 没有选中则退出
			var selRecords = grid.getSelectionModel().getSelections();

			// 单个删除
			if (selRecords.length == 1) {
				deleteFile(selRecords[0].data.uids);
			} else if (selRecords.length > 1) {
				deleteSelectedFiles(selRecords);
			}

			break;

		case 'publish' :
			
			var selRecords = grid.getSelectionModel().getSelections();
			// 没有选中则退出
			if (selRecords.length < 1) {
				return;
			}
			// // 单个发布
			// if (selRecords.length == 1) {
			// pubfileWin(selRecords[0].data.uids);
			// } else if (selRecords.length > 1) {
			// pubfileWinBatch(selRecords);
			// }
			pubfileWinBatch(selRecords);
			break;
		case 'recycle' :
			
			var selRecords = grid.getSelectionModel().getSelections();
			// 没有选中则退出
			if (selRecords.length < 1) {
				return;
			}
			recyleSelectedFiles(selRecords);
			break;			

		case 'transfer' :

			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length < 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			var fileIdArr = [];
			for (var i = 0; i < selRecords.length; i++) {
				fileIdArr.push(selRecords[i].data.uids);
			}
			yjzls(fileIdArr.join(','));

			break;

		case 'report' :
			// 没有选中则退出
			var selRecords = grid.getSelectionModel().getSelections();
		    var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});
		    DWREngine.setAsync(false); 
			Ext.Msg.confirm("提示", "是否上报所选的" + selRecords.length + "个文件及其附件?",
					function(btn) {
						if (btn == "yes") {
							var fileIdArr = [];
							for (var i = 0; i < selRecords.length; i++) {
								if ( selRecords[i].data.reportStatus ){
									Ext.Msg.alert('文件发布', '文件[' + selRecords[i].data.fileTile + ']已经上报！');
									return;
								}
								fileIdArr.push(selRecords[i].data.uids);
							}
							var doExchange = DEPLOY_UNITTYPE != '0';
							myMask.show();
							ComFileManageDWR.reportSelectedFiles(fileIdArr, 1,
									doExchange, function(retVal) {
										myMask.hide();
										if (retVal) {
											Ext.Msg.alert("文件上报", "上报成功!")
											dsResult.reload();
										} else {
											Ext.Msg.alert("文件上报", "上报失败!")
										}
									});
						}
					});
			DWREngine.setAsync(true); 		
			break;
	}

}
function downloadFile(filepk,fileLsh) {
	if (fileLsh != "") {
        //根据文件流水号，查询文件类型，只有office类型文件才能在线打开
        var filename;
        var suffix;
        var _office = false;
        var sql="select file_lsh,file_name from Sgcc_Attach_List where file_lsh='"+fileLsh+"'";
        DWREngine.setAsync(false);
        db2Json.selectData(sql, function(jsonData) {
			var list = eval(jsonData);
			if (list != null && list && list[0]) {
				filename = list[0].file_name;
			}
		});
        DWREngine.setAsync(true);
        if(filename){
            suffix=filename.substring(filename.lastIndexOf(".")+1,filename.length);  
            if(suffix=="doc"||suffix=="xls"||suffix=="ppt"||suffix=="docx"||suffix=="xlsx"||suffix=="pptx"){
                _office = true;
            }
        }
        if((NTKOWAY!=null&&NTKOWAY==1)&&(_office)){
            var docUrl = BASE_PATH + "jsp/common/open.file.online.jsp" +
                    "?fileid="+fileLsh+"" +
                    "&filetype=sgccfile" +
                    "&ModuleLVL="+ModuleLVL;
                window.showModalDialog(docUrl,"","dialogWidth:"
                    + screen.availWidth + "px;dialogHeight:"
                    + screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
        }else{
			//文件管理的发布直接打开文件，因为文件管理发布的只有一个附件
            var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet" +
                    "?ac=sgccfile" +
                    "&fileid="+fileLsh+"" +
                    "&pid="+CURRENTAPPID;
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
        }
	} else {//消息沟通发布的弹出查看窗口，因为消息沟通发布的有多个附件
		showPropertyWin(filepk, 'update');
	}	
}
function uploadFile(filePk) {
	var record = dsResult.getById(filePk);
	if (validateFile(record)||(2==record.get('statePublish'))) {
		var param = new Object()
//		param.allowableFileType = ".doc`.docx`.wps`.ppt`.pptx`.rtf`.dps";
		param.allowableFileType = "";
		param.businessId = filePk;
		param.businessType = "FAPDocument";
		param.fileSource = "blob";
		param.compressFlag = "0";
		param.fileId = record.get("fileLsh");
		upWin = showBlobFileWin(param);
		upWin.on('beforeclose', function(panel) {
					// alert(panel.rtnObj.fileName);
					// 返回的文件信息（id，文件名，大小）
					var updatedInfo = panel.rtnObj;
					if (updatedInfo)
						ComFileManageDWR.updateFileName(updatedInfo.fileId,
								updatedInfo.fileName,function(){
									grid.getStore().reload();
								});
				});
	}

}
// 批量删除
function deleteSelectedFiles(records) {

	// 生成id数组
	var ids = new Array();
	// 检查所有文件的状态
	for (var i = 0; i < records.length; i++) {
		var curRow = records[i].data;
		if (!validateFile(records[i])) {
			return;
		}
		// 向数组添加值
		ids.push(curRow.uids);
	}

	// 批量删除

	Ext.Msg.confirm("提示", "将删除所选的" + ids.length + "个文件及其附件，删除后将无法恢复，请确认!",
			function(btn) {
				if (btn == "yes") {
					var mask = new Ext.LoadMask(Ext.getBody(), {
								msg : "正在删除..."
							});
					mask.show();
					ComFileManageDWR.deleteSelectedFiles(ids, function(retVal) {
								if (retVal) {
									mask.hide();
									Ext.Msg.alert("提示", "文件删除成功!");

									dsResult.reload();
								} else {
									mask.hide();
									Ext.Msg.alert("提示", "文件删除失败，操作终止!");
								}
							})
				}
			});
}


// 批量回收
function recyleSelectedFiles(records) {

	// 生成id数组
	var ids = new Array();
	// 检查所有文件的状态
	for (var i = 0; i < records.length; i++) {
		var curRow = records[i].data;
		if (!validateRecycleFile(records[i])) {
			return;
		}
		// 向数组添加值
		ids.push(curRow.uids);
	}

	// 批量回收

	Ext.Msg.confirm("提示", "将回收所选的" + ids.length + "个文件及其附件，请确认!",
			function(btn) {
				if (btn == "yes") {
					var mask = new Ext.LoadMask(Ext.getBody(), {
								msg : "正在回收..."
							});
					mask.show();
					ComFileManageDWR.recycleSelectedFiles(ids, function(retVal) {
								if (retVal) {
									mask.hide();
									Ext.Msg.alert("提示", "文件回收成功!");

									dsResult.reload();
								} else {
									mask.hide();
									Ext.Msg.alert("提示", "文件回收失败，操作终止!");
								}
							})
				}
			});
}
function deleteFile(filePk) {
	var record = dsResult.getById(filePk);
	if (validateFile(record)) {
		Ext.Msg.confirm("提示", "将删除该文件及其附件，删除后将无法恢复，请确认!", function(btn) {
					if (btn == "yes") {
						ComFileManageDWR.deleteFile(filePk, function(dat) {
									if (dat) {
										Ext.Msg.alert("提示", "文件删除成功!")
										dsResult.reload();
									} else {
										Ext.Msg.alert("提示", "文件删除失败!")
									}
								})
					}
				});
	}
}

function pubfileWinBatch(records) {
	var ids = new Array();
	for (var i = 0; i < records.length; i++) {
		ids.push(records[i].data.uids);
	}

	var rtn = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/Business/fileAndPublish/fileManage/com.fileManage.pub.batch.jsp?exchangeOnPublish="
							+ exchangeOnPublish,
					ids,
					"dialogWidth:800px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
		dsResult.reload();
	}
}

function editInWordWindow(comFile) {
	if(SETTLEMENT=='true'){
	var fileSuffix = comFile.getAttribute('fileSuffix').toLowerCase();
	if (!(fileSuffix == 'doc' || fileSuffix == 'docx' || fileSuffix == 'xls' || fileSuffix == 'xlsx')) {
		Ext.Msg.alert("在线编辑", "在线编辑只支持doc,docx,xls,xlsx格式文件!");
		return;
	}
	var filePk = comFile.getAttribute('uids');
	var fileLsh = comFile.getAttribute('fileLsh');
	var editable = !(comFile.getAttribute('billState') || comFile.getAttribute('statePublish') || comFile.getAttribute('reportStatus'));
	var fileName;
	if (comFile.getAttribute('fileName')) {
		fileName = comFile.getAttribute('fileName');
	} else {
		fileName = comFile.getAttribute('fileTile');
	}

	var retVal = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/Business/fileAndPublish/fileManage/OpenViaOffice.jsp?filePk="
							+ filePk + "&fileLsh=" + fileLsh + "&fileName="
							+ encodeURIComponent(fileName) + "&fileSuffix="
							+ fileSuffix + "&editable=" + editable,
					null,
					"dialogWidth:1000px;dialogHeight:800px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}else {
	var fileSuffix = comFile.fileSuffix.toLowerCase();
	if (!(fileSuffix == 'doc' || fileSuffix == 'docx' || fileSuffix == 'xls' || fileSuffix == 'xlsx')) {
		Ext.Msg.alert("在线编辑", "在线编辑只支持doc,docx,xls,xlsx格式文件!");
		return;
	}
	var filePk = comFile.uids;
	var fileLsh = comFile.fileLsh;
	var editable = !(comFile.billState || comFile.statePublish || comFile.reportStatus);
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
							+ fileSuffix + "&editable=" + editable,
					null,
					"dialogWidth:1000px;dialogHeight:800px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}

}

function yjzls(filePk) {
	var rtn = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/Business/fileAndPublish/fileTrans/com.fileTrans.jsp?fileId="
							+ filePk,
					null,
					"dialogWidth:900px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
		dsResult.reload();
	}
}

function validateFile(record) {
	// 只要某一状态为真即不可编辑
	if (record.get('billState')) {
		Ext.Msg.alert("提示", "不能修改或删除文件[" + record.data.fileTile
						+ "],请检查文件审批状态!");
		return false;
	}

	if (record.get('statePublish')&&(record.get('statePublish')!=2)) {
		Ext.Msg.alert("提示", "不能修改或删除文件[" + record.data.fileTile
						+ "],请检查文件发布状态!");
		return false;
	}

	if (record.get('reportStatus')) {
		Ext.Msg.alert("提示", "不能修改或删除文件[" + record.data.fileTile
						+ "],请检查文件上报状态!");
		return false;
	}

	return true;
}

function validateRecycleFile(record) {
	// 只要某一状态为真即不可编辑
	if (0==record.get('statePublish')||(2==record.get('statePublish'))) {
		Ext.Msg.alert("提示", "不能回收文件[" + record.data.fileTile
						+ "],请检查文件发布状态!");
		return false;
	}

	return true;
}
