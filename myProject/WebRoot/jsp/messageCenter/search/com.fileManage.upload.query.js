var centerPanel
var whereStr = " 1=1 ";
//* 0-0: 获取以sortId为根节点且具备访问权限的所有分类下，本部门的文档 
var showType = '0-0';
var pathLabel;
var dateSelected = "all";
var stateSelected = "all";
if(dydaView==true){
	stateSelected="unRead";
}
var titleSearchField;
var proTreeCombo;
var recordUpdate;
var stateSearchCombo;
Ext.onReady(function() {
	if(!dydaView){
		var array_prjs=new Array();
		var dsCombo_prjs=new Ext.data.SimpleStore({
		    fields: ['k', 'v'],   
		    data: [['','']]
		});
		var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit";
		DWREngine.setAsync(false);
		systemMgm.getPidsByUnitid(USERBELONGUNITID,function(list){  
			    var arrayTemp=new Array();
			    arrayTemp.push("all");
			    arrayTemp.push("所有项目单位");
			    array_prjs.push(arrayTemp);
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].unitid);
				temp.push(list[i].unitname);
				array_prjs.push(temp);			
			}
	    }); 
	    DWREngine.setAsync(true);
	    dsCombo_prjs.loadData(array_prjs);
		proTreeCombo=new Ext.form.ComboBox({
			hidden :false,
			anchor : '95%',
			width:200,
			listWidth:300,
			store:dsCombo_prjs,
        	displayField:'v',
       		valueField:'k',
        	typeAhead: true,
        	editable:false,
       		mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
       		selectOnFocus:true
		});
		proTreeCombo.setValue("all");
		proTreeCombo.on("select",function(obj,rec,inx){
			var key=rec.get('k');
			if(key!="all"){
				pid=key;
			}else if(key=="all"){
				pid="";
			}
			dsResult.reload();				
	 })	
	}else{
		selectNode.id=g_rootId;
	}
	// 详细信息 附件 下载 标记已读
			var updateInfoBtn = new Ext.Toolbar.Button({
						id : 'update-info',
						text : '详细信息',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icons/application_view_detail.png",
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
						text : '标记所选为已读',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icon-show-complete.gif",
						cls : "x-btn-text-icon",
						handler : onItemClick
					});
			
					var markAllReadBtn = new Ext.Toolbar.Button({
						id : 'mark-all-read',
						text : '标记全部为已读',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icon-show-all.gif",
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
			stateSearchCombo = new Ext.form.ComboBox({
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
			if(dydaView==true){
				stateSearchCombo.setValue('unRead');
				}
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
						stateSelected = rec.data["val"];
						if(stateSelected=="read"){
							markAsReadBtn.setDisabled(true);
						}else{
							markAsReadBtn.setDisabled(false);
						}						
						dsResult.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									},
						callback: function(records, options, success){
							var curCount=dsResult.getTotalCount();
							if(dydaView==true){
								parent.tabPublishUploadPanel.getActiveTab().setTitle("信息上报查询"+"("+curCount+")");
								}
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
									method : 'getComFileReadOrNotInfoBySortId',
									sortId : selectNode.id,
									whereStr : "report_status = 1 and (state_publish is null or state_publish=0 or state_publish=1) ",
									orderby : "file_createtime desc",
									showType : showType,
									//deptIds : USERDEPTID,
									pid:pid,
									keyword : keyword,
									dateSelected : dateSelected,
									stateSelected : stateSelected,
									userId : USERID
								})
					})
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

			// 编号 名称 部门 作者 时间 状态
			var regEx = /^<img src=.*<\/img>/;
			var columnModel = new Ext.grid.ColumnModel([sm, {
				header : '上报单位',
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
						header : '上报部门',
						dataIndex : 'fileDeptName',
						align : 'center',
						width : 80,
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
						width : 58
					},{
						header : '标题',
						dataIndex : 'fileTile',
						width : 160,
						align:'left',
						renderer : function(value, metaData, record, rowIndex,
								colIndex, store) {
									var toolTip = record.data.fileTile.replace(regEx, '');
									
							var htmlStr = '<span class="downloadLink" qtip="' + toolTip + '" onclick="showPropertyWin('+record.data.uids+')">' + value + '</span>';
							return htmlStr;
	
						}
					},{
						header : '内容简述',
						dataIndex : 'fileContent',
						width : 160,
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
											if ( cnt > 0 ){
												rtnStr = '<span class="downloadLink"  >附件['+ cnt +']</span>';
											}
											else{
												rtnStr = '<span class="deactivateLink"  >附件['+ cnt +']</span>';
											}
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
						header : '接收时间',
						dataIndex : 'fileCreatetime',
						align : 'center',
						renderer : Ext.util.Format.dateRenderer('Y-n-j H:i'), // Ext内置日期renderer
						width : 80
					}, {
						header : '文件分类',
						dataIndex : 'fileSortName',
						align : 'center',
						width : 100,
						hidden :true

					}, {
						header : '发布状态',
						dataIndex : 'publisStateName',
						align : 'center',
						width : 42,
						hidden :true
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
            var dytbar=new Ext.Toolbar({   
									items : [updateInfoBtn, '-',markAsReadBtn,markAllReadBtn,'->',proTreeCombo,'-',
											 dateSearchCombo,
											'-', stateSearchCombo, '-',titleSearchField]
								});		
			if(dydaView==true){
             	dytbar=new Ext.Toolbar({
									items : [updateInfoBtn, '-',markAsReadBtn,'->',
											 dateSearchCombo,
											'-', stateSearchCombo, '-',titleSearchField]
				});	
			}
			// 创建Grid
			grid = new Ext.grid.GridPanel({

						ds : dsResult,
						cm : columnModel,
						sm : sm,
						region : 'center',
						layout : 'anchor',
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						viewConfig : {
							forceFit : true
						},
						bbar : pageToolbar,
						tbar : dytbar,
						listeners : {
							'render' : function() {	
							    if(!dydaView)							
								  sortPathBar.render(this.tbar);
								
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
					
			grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
				if ( fieldName == 'fileTile' ){
				var rec = grid.getStore().getAt(rowIndex);
/*					if ( rec ){
						showPropertyWin(rec.data.uids, 'update');
					}*/
				}
				else if ( fieldName == 'uids' ){
					//alert()
					//raw text
					var rawValue = grid.getView().getCell(rowIndex,columnIndex).innerHTML;

					if ( rawValue.indexOf('deactivateLink') > -1 ){
						return;
					}
					
					var rec = grid.getStore().getAt(rowIndex);
				if ( rec ){
					showAttachWin(rec);
				}
					
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
					
            if(dydaView){
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
			editInWordWindow(selRecords[0].data.uids);
			break;
		case 'update-info' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			showPropertyWin(selRecords[0].data.uids);
			break;
		case 'download' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			downloadFile(selRecords[0].data.uids, selRecords[0].data.fileLsh);
			break;

		case 'attachment' :
			// 只接受单行
			var selRecords = grid.getSelectionModel().getSelections();

			if (selRecords.length != 1) {
				return;
			}

			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			showAttachWin(selRecords[0]);
			break;

		case 'mark-as-read' :
			// 没有选中则退出
			var selRecords = grid.getSelectionModel().getSelections();
			if(dydaView==true){
				var totalCount = dsResult.getTotalCount();
				var reamin=totalCount-selRecords.length;
				parent.tabPublishUploadPanel.getActiveTab().setTitle("信息上报查询"+"("+reamin+")");			
			}
			// 单个标记
			if (selRecords.length == 1) {
				changeState(selRecords[0].data.uids, "read");
			} else if (selRecords.length > 1) {
				markSelectedAdRead(selRecords);
			}

			break;
		
		case 'mark-all-read':
			var remain=0;
			DWREngine.setAsync(false);
			var text = ''; //根据点击功能节点时判断节点名称yanglh 2013-8-17
			if(g_rootId == 'aqwmsg'){
			   text = '安全文明施工';
			}else if(g_rootId == 'aqsgjc'){
			   text = '项目单位上报信息';
			}else if(g_rootId == 'aqxxbs'){
			   text = '安全报送信息';
			}
            ComFileManageDWR.getModuleUrlByUserId(text/*'上报消息提醒'*/, USERID, function(url) {
            	if(url){
            		uploadUrl=CONTEXT_PATH+"/"+url;            		
            		var rootId=getRootId(url);
					ComFileManageDWR.getUnreadMsgNumUpload(USERID, USERDEPTID,rootId,function(retVal){
						if(retVal){
						remain=retVal;
					}
				});	            		
            	}else{
            		remain=0;
            	}
             });             	
			DWREngine.setAsync(true);
			var totalCount = dsResult.getTotalCount();		
			if ( remain  > 0){
				Ext.Msg.show({
				   title:'全部标记已读',
				   msg: '确定将全部 <b>' + remain + '个未读信息</b> 标记为已读?',
				   buttons: Ext.Msg.YESNO,
				   fn: function(btn){ 
				   	if ( btn == 'yes' ){
				   		markAllAsRead();
				   	}
				   }
				});
			}else{
				if(totalCount>0){
					Ext.MessageBox.alert("提示", "信息已全部为已读状态!");					
				}else{
					return;
				}			
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
function changeState(filePk, state) {
  	var count=0;
 	 DWREngine.setAsync(false);
 	 db2Json.selectData("select count(uids) as count from COM_FILE_READ_HISTORY where file_id ='"+filePk+"' and file_reader='"+USERID+"'", function (jsonData) {
      var list = eval(jsonData);
      if(list!=null&&list[0]){
        count=list[0].count;
            }  
           });
 	 if(count>0){
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
//解析url得到rootid的值
function getRootId(url){
	var params="";
	var array=url.split("?");
    if(array.length>1){
    	var paramArr = array[1].split("&");
    	for (i=0; i<paramArr.length; i++) {
    		if(paramArr[i].indexOf("rootId=")==0) {
    			params = (paramArr[i].split("="))[1];
    		}
    	}
    }
    return params;
}
function markAllAsRead(){
	ComFileManageDWR.markAllAsReadForUserUpload(USERID, selectNode.id,pid,function(retVal) {
				if (retVal) {
					Ext.example.msg('操作提示', '状态标记成功!');
					dsResult.reload();
				} else {
					Ext.example.msg('操作提示', '状态标记失败!');
				}
			});
}

function markSelectedAdRead(records) {
	var totalCount=0;
	totalCount=parseInt(totalCount);
	DWREngine.setAsync(false);
	var ids = new Array();
	for (var i = 0; i < records.length; i++) {
		ids.push(records[i].data.uids);
		db2Json.selectData("select count(uids) as count from COM_FILE_READ_HISTORY where file_id ='"+records[i].data.uids+"' and file_reader='"+USERID+"'", function (jsonData) {
     	 var list = eval(jsonData);
     	 if(list!=null&&list[0]){
      		  totalCount+=parseInt(list[0].count);
            }  
           });
	}
 	if(totalCount>0){
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
function downloadFile(fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/filedownload?&method=fileDownload&id="
				+ fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该文件不存在!")
	}
}
function uploadFile(filePk) {
	var record = dsResult.getById(filePk);
	if (record.get("billState") != 0 || record.get("statePublish") != 0) {
		Ext.Msg.alert("提示", "不能更新该文件，请检查文件审批状态和发布状态!")
	} else {
		var param = new Object()
		param.allowableFileType = ".doc`.docx`.wps`.ppt`.pptx`.rtf`.dps";
		param.businessId = filePk;
		param.businessType = "FAPDocument";
		param.fileSource = "blob";
		param.compressFlag = "0";
		param.fileId = record.get("fileLsh");
		upWin = showBlobFileWin(param)
	}

}
function showAttachWin(rec) {
	var filePk = rec.data.uids;
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable=false&businessId="
			+ filePk;
var record = dsResult.getById(filePk);
		var fileTitle = record.get("fileTile");
		var regEx = /^<img src=.*<\/img>/;
		fileTitle = fileTitle.replace(regEx, '');
		fileTitle = fileTitle.replace('[未读] ', '');
	var ext=Ext;
	try {
		if(dydaView==true){
			ext = parent.Ext			
		}
	} catch (e) {
		ext = Ext
	}		
	templateWin = new ext.Window({
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
	templateWin.show();
}

function showPropertyWin(filePk, eM) {
	var record = dsResult.getById(filePk);
	var obj = new Object();
	obj.rec = record;
	obj.editMode = eM;
	obj.editEnable = false;
//	if (record) {
//		if (record.get("billState") != 0 || record.get("statePublish") != 0
//				|| record.get("fileAuther") != USERID) {
//			obj.editEnable = false;
//		}
//	}
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
							+ "/jsp/messageCenter/fileManage/com.fileManage.property.jsp",
					obj, style);	
}
//详细信息查看
function showPropertyWin(filePk) {
	var obj = new Object();
	obj.editMode = 'update';
	obj.editEnable = false;
	obj.rec =recordUpdate;
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
							+ "/jsp/messageCenter/fileManage/com.fileManage.property.jsp",
					obj, style);
		//关闭窗口后将该文件改为已读
					var state=stateSearchCombo.getValue();
					//if(state=="unRead"){
					var selRecords = grid.getSelectionModel().getSelections();
					var uids=selRecords[0].data.uids;
					DWREngine.setAsync(false);
						ComFileManageDWR.changeUserReadState(USERID, uids, "read", function(dat) 
							{
								if ( dat ){
									dsResult.reload();
								}
							});							
				DWREngine.setAsync(true);
				if(dydaView==true&&state=="unRead"){
					var totalCount = dsResult.getTotalCount();
					var reamin=totalCount-selRecords.length;
					parent.tabPublishUploadPanel.getActiveTab().setTitle("信息上报查询"+"("+reamin+")");			
				}				
			//}
				
}
