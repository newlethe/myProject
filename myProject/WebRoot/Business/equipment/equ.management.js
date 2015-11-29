var centerPanel
var whereStr = "1=1 ";
var grid;
var dsResult;
var sm;
var dateSelected = "all";
var stateSelected = "all";
var recordView;
var users=new Array();
if(1===dyView){
	stateSelected="publish";
}
var bean = "com.sgepit.pmis.news.hbm.AppEqu"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
Ext.onReady(function() { 
    
    var classArr = new Array();
    DWREngine.setAsync(false);  
    appMgm.getCodeValue('设备到货信息通知分类',function(list){         //获取合同付款方式
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            classArr.push(temp);         
        }
    });
    DWREngine.setAsync(true);
    
			var btnDisabled = ModuleLVL != '1';
			DWREngine.setAsync(false);
			baseMgm.getData("select userid, realname from rock_user ",function(list){
			for(var i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				users.push(temp);
			}
   		 });
		DWREngine.setAsync(true);   		 
			var uploadFileBtn = new Ext.Toolbar.Button({
						id : 'upload-file',
						icon : CONTEXT_PATH + "/jsp/res/images/icons/add.png",
						cls : "x-btn-text-icon",
						text : "新增",      
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
		var saveBtn = new Ext.Button({
					id : 'save',
					text : '保存',
					iconCls : 'save',
					handler : saveFun
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
			dateFilterArr[0] = new Array('oneMonth', '近一月设备到货信息');
			dateFilterArr[1] = new Array('threeMonth', '近三月设备到货信息');
			dateFilterArr[2] = new Array('all', '所有时期设备到货信息');

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
						width : 150,
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

			var stateFilterArr = new Array();
			stateFilterArr[0] = new Array('unPublish', '未发布设备到货信息');
			stateFilterArr[1] = new Array('publish', '已发布设备到货信息');
			stateFilterArr[2] = new Array('all', '所有状态设备到货信息');

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
						width :100,
						editable : false,
						selectOnFocus : true
					});
			stateSearchCombo.setValue('all');
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
						name : 'content',
						type : 'string'
					}, {
						name : 'createtime',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'author',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'pubtime',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'pubperson',
						type : 'string'
					}, {
						name : 'pid',
						type : 'string'
					}, {
						name : 'equclass',
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
											+ '/servlet/NewsServlet'
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
									method : 'getEqu',
									whereStr : whereStr,
									orderby : "createtime desc",
									pid : CURRENTAPPID,
									dateSelected : dateSelected,
									stateSelected : stateSelected,
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
				recordView=record;
			});							
			// 创建列模型

			// 编号 名称 部门 作者 时间 状态
			var columnModel = new Ext.grid.ColumnModel([sm,
					 {
						header : '设备到货信息',
						dataIndex : 'content',
						align : 'left',
						width :document.body. clientWidth -400,
				// 鼠标悬停时显示完整设备到货信息
						renderer : function(value, metadata, record, rowIndex,
								columnIndex, store) {
							var uids=record.data.uids;
						    var   htmlStr="<span style='color:blue;cursor:hand' qtip='"+value+"' onclick='showPropertyWinView(\"" + uids + "\")'>"+value+"</span>";
							return htmlStr;

						}						
					},{
						header : '记录时间',
						dataIndex : 'createtime',
						align : 'center',
						renderer : Ext.util.Format.dateRenderer('Y-n-j H:i'), // Ext内置日期renderer
						width : 170,
						editor : new Ext.form.DateField({
								name : 'createtime',
								format : 'Y-m-d H:i',
								menu : new DatetimeMenu()
							})
					},{
						header : '创建者',
						dataIndex : 'author',
						width : 100,
						align:'center'
					},  
					{
						header : '发布人',
						hidden:true,
						dataIndex : 'pubperson',
						align : 'center',
						width : 100,
          				 renderer: function(value){
           					for(var i=0; i<users.length; i++){
           						if (users[i][0] == value) {
           						return users[i][1];
           				}
           		}
           }
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
			var toolbarItems = [uploadFileBtn, '-', updateInfoBtn, '-',saveBtn,'-', delBtn,'->',
											 dateSearchCombo,
											'-',titleSearchField];
	var PlantInt = {
			uids:'',
			title:'',
			content:'',
			picture:'',
			createtime:new Date(),
		    author:REALNAME,
		  	status:'1',
		  	pubtime:new Date(),
		  	pubperson:REALNAME,
		    pid:CURRENTAPPID,
		   	equclass:''			
			}
		
			// 创建Grid
			grid = new Ext.grid.EditorGridTbarPanel({
						id : 'file-grid',
						ds : dsResult,
						cm : columnModel,
						addBtn:false,
						delBtn:false,
						saveBtn:false,
						sm : sm,
						region : 'center',
						layout : 'anchor',
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
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
							}
						},
						plant : dataGridRs,
						plantInt : PlantInt,
						servletUrl : MAIN_SERVLET,
						bean : bean,
						business : business,
						primaryKey : "uids"
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
					var rec = grid.getStore().getAt(rowIndex);
					
				if ( rec ){
					showAttachWin(rec);
				}
					
				}
				
			});

			// 设置工具栏上单个设备到货信息操作按钮禁用/可用
			function setSingleFileBtnDisabled(disable) {
				// 修改按钮
				updateInfoBtn.setDisabled(disable);
				saveBtn.setDisabled(disable);
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
						items : [ grid]
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
			dsResult.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});

		});
		
function showPropertyWinView(filePk) {
			//设备到货信息详情窗口居中显示参数WLeft,WTop
			var   WLeft   = Math.ceil((window.screen.width-850)/2 );   
			var   WTop    = Math.ceil((window.screen.height-600)/2);	
			var   width=window.screen.width;
			var   height=window.screen.height;
			var winUrl = CONTEXT_PATH
			+ "/Business/equipment/com.equ.query.jsp?filePk="+filePk;
			　//window.open (winUrl, '设备到货信息详情', 'height='+height+', width='+width+',scrollbars=yes,toolbar=no, menubar=no,resizable=no, top='+WTop+', left='+WLeft+' ');
			var style = "dialogWidth:'"+width+"';dialogHeight:'"+height+"';center:yes;resizable:yes;Minimize=no;Maximize=no";
			var retVal = window.showModalDialog(winUrl, null, style);			
}		
function showPropertyWin(filePk, eM) {
	if ( filePk )
		var record = dsResult.getById(filePk);
	var obj = new Object();
	obj.rec = record;
	obj.editMode = eM;
	obj.editEnable = true;
/*	if (record) {
		if (record.get("status") != 0) {
			obj.editEnable = false;
		}
	}*/
	var treeInfo = new Object();
	obj.gridStore = dsResult;
	var style = "dialogWidth:900px;dialogHeight:600px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	var winUrl = CONTEXT_PATH
			+ "/Business/equipment/com.equ.management.jsp";
  
	var retVal = window.showModalDialog(winUrl, obj, style);
	if ( retVal == 'changed' ){
		dsResult.reload();
	}
	
}
function showPropertyWinShow(uids){
	var obj = new Object();
	obj.rec = recordView;
	obj.editMode = 'update';
	obj.editEnable = false;
	obj.gridStore = dsResult;
	var style = "dialogWidth:900px;dialogHeight:600px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	
	var winUrl = CONTEXT_PATH
			+ "/Business/equipment/com.equ.management.jsp";
  
	var retVal = window.showModalDialog(winUrl, obj, style);
	if ( retVal == 'changed' ){
		dsResult.reload();
	}	
	

}

function onItemClick(item) {
	switch (item.id) {
		case 'upload-file' :
			showPropertyWin(null, "insert");
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
	}

}

// 批量删除
function deleteSelectedFiles(records) {

	// 生成id数组
	var ids = new Array();
	// 检查所有设备到货信息的状态
	for (var i = 0; i < records.length; i++) {
		var curRow = records[i].data;
		//if (!validateFile(records[i])) {
		//	return;
		//}
		// 向数组添加值
		ids.push(curRow.uids);
	}

	// 批量删除

	Ext.Msg.confirm("提示", "将删除所选的" + ids.length + "个设备到货信息及其附件，删除后将无法恢复，请确认?",
			function(btn) {
				if (btn == "yes") {
					var mask = new Ext.LoadMask(Ext.getBody(), {
								msg : "正在删除..."
							});
					mask.show();
					DWREngine.setAsync(false);
					appNewsMgm.deleteSelectedEqus(ids, function(retVal) {
								if (retVal) {
									mask.hide();
									Ext.example.msg("提示", "设备到货信息删除成功!");

									dsResult.reload();
								} else {
									mask.hide();
									Ext.example.msg("提示", "设备到货信息删除失败，操作终止!");
								}
							})
					DWREngine.setAsync(true);		
				}
			});
}

function deleteFile(filePk) {
	var record = dsResult.getById(filePk);
	//if (validateFile(record)) {
		Ext.Msg.confirm("提示", "将删除该设备到货信息及其附件，删除后将无法恢复，是否确认删除？", function(btn) {
					if (btn == "yes") {
						DWREngine.setAsync(false);
						appNewsMgm.deleteEqu(filePk, function(dat) {
									if (dat) {
										Ext.example.msg("提示", "设备到货信息删除成功!")
										dsResult.reload();
									} else {
										Ext.example.msg("提示", "设备到货信息删除失败!")
									}
								})
						DWREngine.setAsync(true);		
					}
				});
	//}
}

function pubfileWinBatch(records) {
	var ids = new Array();
	for (var i = 0; i < records.length; i++) {
/*		if(records[i].data.status==1){
			Ext.example.msg("操作提示", "存在已经发布的设备到货信息,请重新选择！");
			sm.clearSelections();
			return;
		}*/
		ids.push(records[i].data.uids);
	}
	var mask = new Ext.LoadMask(Ext.getBody(), {
				msg : "正在发布..."
			});
	mask.show();
	DWREngine.setAsync(false);
	appNewsMgm.publishNews(ids,SYS_TIME_STR,USERID, function(retVal) {
				if (retVal) {
					mask.hide();
						Ext.example.msg("提示", "设备到货信息发布成功!");
					dsResult.reload();
					sm.clearSelections();
				} else {
					mask.hide();
					Ext.example.msg("提示", "设备到货信息发布失败，操作终止!");
				}
			});
	DWREngine.setAsync(true);		
}

//附件窗口
function showAttachWin(rec) {
	var filePk = rec.data.uids;
	if ( filePk )
		var record = dsResult.getById(filePk);
	var editEnable = true;
	if (record) {
		if (record.get("status") != 0 ) {
			editEnable = false;
		}
	}
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable=" + editEnable + "&businessId="
			+ filePk;
	var title = record.get("title");			
	templateWin = new Ext.Window({
				title : '设备到货信息[' + title +'] 的附件',
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



function validateFile(record) {
	var status=record.data.status;
	if(status==1){
    	Ext.example.msg("操作提示", "设备到货信息已为已发布状态，不能删除！");
    	return;
	}else{
		return true;
	}
}
function saveFun(){
      grid.defaultSaveHandler();
}
