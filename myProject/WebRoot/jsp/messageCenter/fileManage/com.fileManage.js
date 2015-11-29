var centerPanel
var whereStr = " file_auther = '" + USERID + "' ";
var grid;
var dsResult;
var showType = '0-0';
var defaultFilterType = 'all1';
var pathLabel;
var dateSelected = "all";
var keyword = "";
var haha = 'ghahahah';
var queryTemplateBtn;
var sm;
var recordUpdate;
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


			// 编辑 修改 删除 重新上传
			var editBtn = new Ext.Toolbar.Button({

						id : 'edit-doc',
						text : '编辑',
						tooltip : '直接打开编辑word文档',
						icon : CONTEXT_PATH + "/jsp/res/images/word.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});

			var updateInfoBtn = new Ext.Toolbar.Button({
						id : 'update-info',
						text : '修改',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icons/application_view_detail.png",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});


			var publishBtn = new Ext.Toolbar.Button({
						id : 'publish',
						text : '发布',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/portal/page_up.gif",
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

			// 上报
			var reportBtn = new Ext.Toolbar.Button({
						id : 'report',
						text : '上报',
						handler : onItemClick,
						icon : CONTEXT_PATH + "/jsp/res/images/file-upload.gif",
						cls : "x-btn-text-icon",
						disabled : btnDisabled
					});
			queryTemplateBtn = new Ext.Toolbar.Button({
						id : 'query-template',
						icon : CONTEXT_PATH + "/jsp/res/images/page_word.png",
						cls : "x-btn-text-icon",
						text : "下载分类模板[0]",
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
			//sortItem = new Ext.Toolbar.Item('softPath');
			pathLabel = new Ext.form.Label({text : '当前分类:'});
			// 第二行工具栏，显示当前选择的分类
			var sortPathBar = new Ext.Toolbar([pathLabel]);

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
						dateSelected = rec.data["val"]
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
					},{	//所属单位名称
						name : 'fileUnitName',
						type : 'string'
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
									method : 'getComFileInfoBySortIdNoDepts',
									sortId : selectNode.id,
									whereStr : whereStr,
									orderby : "file_createtime desc",
									showType : showType,
									//deptIds : USERDEPTID,
									pid : CURRENTAPPID,
									dateSelected : dateSelected,
									keyword : keyword
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

			// 创建列模型

			// 编号 名称 部门 作者 时间 状态
			var columnModel = new Ext.grid.ColumnModel([sm, {
				header : '单位',
				dataIndex : 'fileUnitName',
				align : 'center',
				width : 100,
				// 鼠标悬停时显示完整信息
						renderer : function(data, metadata, record, rowIndex,
								columnIndex, store) {

							var qtip = " qtip= " + data + " >";
							return '<span ' + qtip + data + '</span>';

						}
			}, {
						header : '部门',
						dataIndex : 'fileDeptName',
						align : 'center',
						width : 120,
						// 鼠标悬停时显示完整信息
						renderer : function(data, metadata, record, rowIndex,
								columnIndex, store) {
							if ( record.data.fileUnitName == data ){
								return '';
							}
							else{
							var qtip = " qtip= " + data + " >";
							return '<span ' + qtip + data + '</span>';

							}
							
						}
					},{
						header : '起草人',
						dataIndex : 'fileAutherName',
						align : 'center',
						width : 80
					},{
						header : '标题',
						dataIndex : 'fileTile',
						width : 160,
						align:'left',
						renderer : function(value, metaData, record, rowIndex,
								colIndex, store) {
							var htmlStr = '<span qtip="' + value + '" class="downloadLink" onclick="showPropertyWinUpdate('+record.data.uids+')" >' + value + '</span>';
							return htmlStr;
	
						}
					},{
						header : '内容简述',
						dataIndex : 'fileContent',
						width : 200,
						renderer: function(value, metadata, record){
						metadata.attr = ' ext:qtip="'+value+'"';
						return   value;
						}
					}, 
						 {
							id : 'attachment',
							header : '附件',
							dataIndex : 'uids',
							align : 'center',
							width : 50,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
										var rtnStr = ''
										DWREngine.setAsync(false);
										ComFileManageDWR.getFileAttachCount(record.data.uids, function(cnt){
										rtnStr = '<span class="downloadLink"  >附件['+ cnt +']</span>';
									});
									DWREngine.setAsync(true);
									return rtnStr;
								
							}
						},
					{
						header : '移交状态',
						dataIndex : 'isTransfered',
						renderer : function(value) {
							return value ? '已移交' : '未移交'
						},
						width : 38,
						hidden : true
					},   {
						header : '起草时间',
						dataIndex : 'fileCreatetime',
						align : 'center',
						renderer : Ext.util.Format.dateRenderer('Y-n-j H:i'), // Ext内置日期renderer
						width : 100
					}, {
						header : '信息分类',
						dataIndex : 'fileSortName',
						align : 'center',
						width : 100,
						hidden :true

					}, {
						header : '发布状态',
						dataIndex : 'statePublish',
						align : 'center',
						width : 100,
						renderer : function(value) {
							return value ?value==1?'已发布':'已回收': '未发布';
						}
					}, {
						header : '上报状态',
						dataIndex : 'reportStatus',
						align : 'center',
						renderer : function(value, metadata, record,
								rowIndex, colIndex, store) {
 						if(g_canReport==1&&g_canPublish==1){
							if(value==1){
								return Ext.util.Format.date(record.data.fileCreatetime,'Y-n-j H:i');
							}else{
								return "未上报";
							}
 						}else{
 							return value?"已上报":"未上报";
 						}														
							},
						width : 100,
						hidden : false
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
			var toolbarItems = [uploadFileBtn, '-', updateInfoBtn, '-', delBtn, '-', publishBtn,'->',
											 dateSearchCombo,
											'-',titleSearchField];
			
			//默认具有发布功能
			var queryIndex=9;								
			//仅有上报功能
			if (g_canReport==1&&g_canPublish==0) {
				// 上报按钮
				columnModel.setHidden(11, false);
				columnModel.setHidden(10, true);
				toolbarItems.splice(6, 1, reportBtn);
				queryIndex=7;
			}
			//发布与上报同时具有
			else if(g_canReport==1&&g_canPublish==1){
				toolbarItems.splice(7, 0,'-', reportBtn);
			}
			//无上报功能
			else if(g_canReport==0){
				columnModel.setHidden(11, true);
				columnModel.setHidden(10, false);
				queryIndex=7;
			}
			
			// 是否显示移交资料室功能
			if (g_canTrans) {
				// 移交状态列
				columnModel.setHidden(7, false);
				// 移交按钮
				toolbarItems.splice(queryIndex, 0, '-', transBtn);
			}		
			
			// 是否有“下载分类模板”按钮
			if (g_templateBtn==1) {
				toolbarItems.splice(queryIndex, 0, '-', queryTemplateBtn)
			}
			var recycleBtn = new Ext.Toolbar.Button({
						id : 'recycle',
						text : '回收',
						icon : CONTEXT_PATH + "/jsp/res/images/upload.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick,
						disabled : btnDisabled
					});
			toolbarItems.splice(queryIndex, 0, '-', recycleBtn)					
			// 创建Grid
			grid = new Ext.grid.GridPanel({
						id : 'file-grid',
						ds : dsResult,
						cm : columnModel,
						sm : sm,
						region : 'center',
						layout : 'anchor',
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						stripeRows : true,
						viewConfig : {
							//forceFit : true
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
			sm.on('rowselect', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				recordUpdate=record;
			});								
			grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
				var record= grid.getStore().getAt(rowIndex);//reportStatus publisStateName
				var reportStatus=record.data.reportStatus;
				var publisStateName=record.data.publisStateName;
				//alert(reportStatus+":"+publisStateName);
				if ( fieldName == 'fileTile' ){
				var rec = grid.getStore().getAt(rowIndex);
/*					if ( rec ){
						showPropertyWin(rec.data.uids, 'update');
					}*/
				}
				else if ( fieldName == 'uids' ){
					//alert()
					var rec = grid.getStore().getAt(rowIndex);
					
				if ( rec ){
					showAttachWin(rec);
				}
					
				}
				if (ModuleLVL != '1')
					return;
				if(reportStatus&&reportStatus==1){
					updateInfoBtn.setDisabled(true);
					delBtn.setDisabled(true); 
					reportBtn.setDisabled(true);
				}
				else if(reportStatus==0){
					updateInfoBtn.setDisabled(false);
					delBtn.setDisabled(false); 					
					reportBtn.setDisabled(false);
				}
//				if(publisStateName=='已发布'){
//					updateInfoBtn.setDisabled(true);
//					delBtn.setDisabled(true); 		
//					publishBtn.setDisabled(false);
//				}else{
//					updateInfoBtn.setDisabled(false);
//					delBtn.setDisabled(false); 						
//				}
			     recycleBtn.setDisabled(true);
			    if(record){
			    	  	if(2==record.get('statePublish')){
			    			updateInfoBtn.setDisabled(false);
							delBtn.setDisabled(false); 	
							reportBtn.setDisabled(false);			    	  		
			    	  	}
				    if((USERID==record.data.fileAuther)){
				    	 recycleBtn.setDisabled(false);
				    }else{
				    	 recycleBtn.setDisabled(true);
				    }			    	
			    }				
	
			});

			// 设置工具栏上单个信息操作按钮禁用/可用
			function setSingleFileBtnDisabled(disable) {
				// 修改按钮
				updateInfoBtn.setDisabled(disable);
				// 编辑按钮
				editBtn.setDisabled(disable);
		
			}
			//设置删除按钮是否可用 
			function setDelBtnDisabled(disable) {
				delBtn.setDisabled(disable); 
			    publishBtn.setDisabled(disable); 
			}
     
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [treePanel, grid]
					});

			grid.getStore().on("load",function(){
			var count=grid.getStore().getCount();
			if(count==0){ 
    			// 修改按钮
				updateInfoBtn.setDisabled(true);
				// 编辑按钮
				editBtn.setDisabled(true);
				//删除按钮
				delBtn.setDisabled(true); 

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
				
			
				dsResult.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			}

		});
		
function showPropertyWinUpdate(filePk) {
	var obj = new Object();
	obj.rec = recordUpdate;
	obj.editMode = 'update';
	obj.editEnable = true;
	if (recordUpdate) {
		if (recordUpdate.get("billState") != 0 || recordUpdate.get("statePublish") != 0
				|| recordUpdate.get('reportStatus') != 0) {
			obj.editEnable = false;
		}
		if(2==recordUpdate.get("statePublish")){//回收状态
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
	
	var winUrl = CONTEXT_PATH
			+ "/jsp/messageCenter/fileManage/com.fileManage.property.jsp";

	var retVal = window.showModalDialog(winUrl, obj, style);
	if ( retVal == 'changed' ){
		dsResult.reload();
	}
}		
function showPropertyWin(filePk, eM) {
	if ( filePk )
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
	
	var winUrl = CONTEXT_PATH
			+ "/jsp/messageCenter/fileManage/com.fileManage.property.jsp";

	var retVal = window.showModalDialog(winUrl, obj, style);
	if ( retVal == 'changed' ){
		dsResult.reload();
	}
	
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
		     
			   editInWordWindow(curComFile);
		     

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
			if(selRecords.length>1){
				Ext.example.msg("操作提示", "请选择单条发布！");		
				break;
			}else{
				pubfileWinBatch(selRecords);	
				break;
			}
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
			Ext.Msg.confirm("提示", "是否上报所选的" + selRecords.length + "个信息及其附件?",
					function(btn) {
						if (btn == "yes") {
							var fileIdArr = [];
							for (var i = 0; i < selRecords.length; i++) {
								if ( selRecords[i].data.reportStatus ){
									Ext.Msg.alert('信息发布', '信息[' + selRecords[i].data.fileTile + ']已经上报！');
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
											Ext.Msg.alert("信息上报", "上报成功!")
											dsResult.reload();	
											sm.clearSelections();
										} else {
											Ext.Msg.alert("信息上报", "上报失败!")
										}
									});
						}
					});
			DWREngine.setAsync(false); 		
			break;
		case 'recycle' :
			
			var selRecords = grid.getSelectionModel().getSelections();
			// 没有选中则退出
			if (selRecords.length < 1) {
				return;
			}
			recyleSelectedFiles(selRecords);
			break;					
			
			
			
	}

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
function downloadFile(fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/filedownload?method=fileDownload&id="
				+ fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该信息不存在!");
	}
}
function uploadFile(filePk) {
	var record = dsResult.getById(filePk);
	if (validateFile(record)) {
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
					// 返回的信息信息（id，信息名，大小）
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
	// 检查所有信息的状态
	for (var i = 0; i < records.length; i++) {
		var curRow = records[i].data;
		if (!validateFile(records[i])) {
			return;
		}
		// 向数组添加值
		ids.push(curRow.uids);
	}

	// 批量删除

	Ext.Msg.confirm("提示", "将删除所选的" + ids.length + "个信息及其附件，删除后将无法恢复，请确认?",
			function(btn) {
				if (btn == "yes") {
					var mask = new Ext.LoadMask(Ext.getBody(), {
								msg : "正在删除..."
							});
					mask.show();
					ComFileManageDWR.deleteSelectedFiles(ids, function(retVal) {
								if (retVal) {
									mask.hide();
									Ext.Msg.alert("提示", "信息删除成功!");

									dsResult.reload();
								} else {
									mask.hide();
									Ext.Msg.alert("提示", "信息删除失败，操作终止!");
								}
							})
				}
			});
}

function deleteFile(filePk) {
	var record = dsResult.getById(filePk);
	if (validateFile(record)) {
		Ext.Msg.confirm("提示", "将删除该信息及其附件，删除后将无法恢复，是否确认删除？", function(btn) {
					if (btn == "yes") {
						ComFileManageDWR.deleteFile(filePk, function(dat) {
									if (dat) {
										Ext.Msg.alert("提示", "信息删除成功!")
										dsResult.reload();
									} else {
										Ext.Msg.alert("提示", "信息删除失败!")
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
							+ exchangeOnPublish + "&rootId=" + g_rootId,
					ids,
					"dialogWidth:800px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
		dsResult.reload();
		sm.clearSelections();
	}
}

//附件窗口
function showAttachWin(rec) {
	var filePk = rec.data.uids;
	if ( filePk )
		var record = dsResult.getById(filePk);
	var editEnable = true;
	if (record) {
		if (record.get("billState") != 0 || record.get("statePublish") != 0
				|| record.get('reportStatus') != 0) {
			editEnable = false;
		}
	}
	if (ModuleLVL != '1')
		editEnable = false;;
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable=" + editEnable + "&businessId="
			+ filePk;
	var fileTitle = record.get("fileTile");			
	templateWin = new Ext.Window({
				title : '信息[' + fileTitle +'] 的附件',
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
	templateWin.on('hide', function(win){
		grid.getView().refreshRow(record);
	});
	templateWin.show();
}

function editInWordWindow(comFile) {
	
	var fileSuffix = comFile.fileSuffix.toLowerCase();
	if (!(fileSuffix == 'doc' || fileSuffix == 'docx' || fileSuffix == 'xls' || fileSuffix == 'xlsx')) {
		Ext.Msg.alert("在线编辑", "在线编辑只支持doc,docx,xls,xlsx格式信息!");
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
	if ( retVal ){
		dsResult.reload();
	}
	

}



function validateFile(record) {
	// 只要某一状态为真即不可编辑
	if (record.get('billState')) {
		Ext.Msg.alert("提示", "不能修改或删除信息[" + record.data.fileTile
						+ "],请检查信息审批状态!");
		return false;
	}

	if (record.get('statePublish')&&(record.get('statePublish')!=2)) {
		Ext.Msg.alert("提示", "不能修改或删除信息[" + record.data.fileTile
						+ "],请检查信息发布状态!");
		return false;
	}

	if (record.get('reportStatus')) {
		Ext.Msg.alert("提示", "不能修改或删除信息[" + record.data.fileTile
						+ "],请检查信息上报状态!");
		return false;
	}

	return true;
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
function validateRecycleFile(record) {
	// 只要某一状态为真即不可编辑
	if (0==record.get('statePublish')||(2==record.get('statePublish'))) {
		Ext.Msg.alert("提示", "不能回收文件[" + record.data.fileTile
						+ "],请检查文件发布状态!");
		return false;
	}

	return true;
}

