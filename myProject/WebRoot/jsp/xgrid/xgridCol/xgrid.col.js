/*
 * 
 * 
 */

var bean = "com.sgepit.frame.xgridTemplet.hbm.SgprjPropertyCode";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'codeSn';
var orderColumn = 'codeSn';
var checkWindow;
var combox;
var queryData = '';
var sqlCase = '';
var dataSql = '';

var codeTableData = new Array();
var modelTypeData = new Array();
var noteData = new Array();
var colTypeData = new Array();

var gridfilter = 'PROJECT_COL';
var columnExplainData = new Array();
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	queryData = " code_type= '" + gridfilter + "'";
	// 查询模板类型数据
	DWREngine.setAsync(false);
	baseMgm.getData(
					"select spc.code_id , spc.code_table from sgprj_property_code spc  where  spc.code_type ='PROJECT_TYPE'",
					 function(list) {
						if (list != null || list.length != 0) {
							for (var i = 0; i < list.length; i++) {
								if (list[i][1] != null) {
									var temp = new Array()
									temp.push(list[i][0])
									temp.push(list[i][1])
									modelTypeData.push(temp)
								} else {
								}
							}
						}

					})
	DWREngine.setAsync(true);

	var codeTableStore = new Ext.data.SimpleStore({ // 数据库表名数据源
		fields : ['k', 'v'],
		data : codeTableData
	});

	var modelTypeStore = new Ext.data.SimpleStore({ // 模板类型数据源
		fields : ['k', 'v'],
		data : modelTypeData
	})
	var columnStore = new Ext.data.SimpleStore({ // 数据库列名数据源
		fields : ['k', 'v']
	})

	 combox = new Ext.form.ComboBox({
				// store : codeTableStore,
				AutoWidth : true,
				autoHeight : true,
				displayField : 'k',
				valueField : '',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '  --数据库表名--',
				selectOnFocus : true
			});

	var columnCombox = new Ext.form.ComboBox({
		        id : 'columnCombox1',
				store : columnStore,
				AutoWidth : true,
				autoHeight : true,
				displayField : 'v',
				valueField : 'k',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '  --数据库表字段名选择--',
				selectOnFocus : true,
				listeners : {
					beforequery : function() {
						var record = sm.getSelected();
						var modeType = record.get('modelType');
						getColFromTable(modeType)
					}
				}

			})
	columnCombox.on('select', function() {
				var value = columnCombox.getValue();
				var record = sm.getSelected();
				for (var i = 0; i < colTypeData.length; i++) {
					if (value == colTypeData[i][0]) {
						 for(var j = 0; j< noteData.length; j++){
						 	 if(value == noteData[j][0] ){
								record.set('codeColtype', colTypeData[i][1]);
								if(noteData[j][0] != "" || noteData[j][0] != null){
								  record.set('codeNote', noteData[j][1]);
								}
								break;
						 	 }
						}
					}
				}
			})			
			
	var modelTypeCom = new Ext.form.ComboBox({
				id : 'modelTypeCom1',
				store : modelTypeStore,
				AutoWidth : true,
				autoHeight : true,
				displayField : 'k',
				valueField : 'k',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '--模板类型选择--',
				selectOnFocus : true,
				listeners : {
					select : function(com) {
						var modeType = com.getValue();
						var record = sm.getSelected();
                        record.set('codeCol',''); 
                        record.set('codeColtype', '');
                        record.set('codeNote', ''); 
						getColFromTable(modeType);
					}
				}
			})

	function getColFromTable(modeType) {
		var columnData = new Array();
		// 查询数据库表名数据
		var table;
		for (var i = 0; i < modelTypeData.length; i++) {
			if (modeType == modelTypeData[i][0]) {
				table = modelTypeData[i][1]
				break;
			}
		}
        if(table ==  null && table == ""){
           Ext.Msg.alert("信息提示","请选择模板类型后在选择数据库表字段名！")          
        }else{
         var sql = "select t.COLUMN_NAME, t.DATA_TYPE,t.DATA_LENGTH, t.DATA_PRECISION, t.DATA_SCALE from user_tab_columns t where t.table_name = '"
				+ table + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(list) {
			if (list != null && list.length != 0) {
				for (var i = 0; i < list.length; i++) { // list.length
					if (list[i] != null) {
						var temp = new Array()
						var temp1 = new Array()
						temp.push(list[i][0]);
						temp.push(list[i][0]);
						temp1.push(list[i][0]);
						if (list[i][1] == "VARCHAR2") {
							temp1.push(list[i][1] + "(" + list[i][2] + ")");
						} else if (list[i][1] == "NUMBER") {
							if (list[i][4] == "" || list[i][4] == null ) {
								temp1.push(list[i][1]);
							} else if (list[i][4] == "0") {
								temp1.push(list[i][1] + "(" + list[i][3] + ")");
							} else {
								temp1.push(list[i][1] + "(" + list[i][3] + ","
										+ list[i][4] + ")");
							}
						}
						columnData.push(temp)
						colTypeData.push(temp1);
					}
				}
			}

		})
		DWREngine.setAsync(true);
		var sql1 = "select ucc.column_name,ucc.comments from  user_col_comments ucc  where   ucc.table_name = '"+ table + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql1, function(list1) {
		      if(list1 != null && list1.length!= 0){
		      	 for(var j = 0;j < list1.length;j++){
		      	    var temp = new Array()
		      	    temp.push(list1[j][0])
		      	    temp.push(list1[j][1])
		      	    noteData.push(temp)
		      	 }
		      }
		
		})
		columnStore.removeAll();
		columnStore.loadData(columnData);
        }
		
	}

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})

	var colModel = new Ext.grid.ColumnModel([sm, {
				id : 'codeSn',
				header : '主键',
				dataIndex : 'codeSn',
				width : 200,
				sortable : true,
				hidden : true
			}, {
				header : '编号',
				dataIndex : 'codeId',
				width : 100,
				sortable : true,
				editor : new Ext.form.TextField({
							allowBlank : false,
							handler : function() {

							}
						})
			}, {
				header : '类型',
				dataIndex : 'codeType',
				width : 100,
				sortable : true,
				hidden : true

			}, {
				header : '模板类型', // CODE_TYPE=’PROJECT_COL’时必填，内容从CODE_TYPE=’PROJECT_TYPE’的数据中选择，
				dataIndex : 'modelType', // 存表名，即本表CODE_TABLE的值
				width : 220,
				sortable : true,
				editor : modelTypeCom
			}, {
				header : '数据库表名',
				dataIndex : 'codeTable',
				width : 200,
				sortable : true,
				hidden : true,
				editor : combox
			}, {
				header : '数据库表字段名', // CODE_TYPE=’PROJECT_COL’时,为数据库表字段名；
				dataIndex : 'codeCol',
				width : 180,
				sortable : true,
				editor : columnCombox

			}, {
				header : '数据库表字段类型',// CODE_TYPE=’PROJECT_COL’为字段的备注；
				dataIndex : 'codeColtype',
				width : 100,
				sortable : true

			}, {
				header : '表字段的备注',
				dataIndex : 'codeNote',
				width : 200,
				sortable : true,
				editor : new Ext.form.TextField({})
			}, {
				header : '时间转换类型',
				dataIndex : 'sjTran',
				width : 100,
				sortable : true,
				hidden : true,
				editor : new Ext.form.TextField({
							allowBlank : true
						})
			}, {
				header : '排序',
				dataIndex : 'orderId',
				width : 100,
				sortable : true,
				hidden : true
			}, {
				header : '备注',
				dataIndex : 'note',
				width : 100,
				sortable : true,
				hidden : true,
				editor : new Ext.form.TextField({
							allowBlank : true
						})

			}])

	// var Columns = Ext.data.Record.create([ // grid显示记录
	var Columns = [{
				name : 'codeSn',
				type : 'string'
			}, {
				name : 'codeId',
				type : 'string'
			}, {
				name : 'codeType',
				type : 'string'
			}, {
				name : 'codeTable',
				type : 'string'
			}, {
				name : 'codeCol',
				type : 'string'
			}, {
				name : 'codeColtype',
				type : 'string'
			}, {
				name : 'codeNote',
				type : 'string'
			}, {
				name : 'sjTran',
				type : 'string'
			}, {
				name : 'orderId',
				type : 'string'
			}, {
				name : 'note',
				type : 'string'
			}, {
				name : 'modelType',
				type : 'string'
			}]
	// );

	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		codeSn : '',
		codeId : '',
		codeType : gridfilter,
		codeTable : '',
		codeCol : '',
		codeColtype : '',
		codeNote : '',
		sjTran : '',
		orderId : '',
		note : '',
		modelType : ''
	}

	var store = new Ext.data.Store({
				baseParams : {
					ac : 'list', // 表示取列表
					bean : bean,
					business : business,
					method : listMethod,
					params : queryData
				},// 设置代理（保持默认）
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				// 创建reader读取数据（保持默认）
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, Columns),
				// 设置是否可以服务器端排序
				remoteSort : true,
				pruneModifiedRecords : true
			});

	var btnview = new Ext.Button({
				id : 'view',
				text : '查询',
				iconCls : 'btn',
				items : [checkWindow]
			})

	var gridpanel = new Ext.grid.EditorGridTbarPanel({
				ds : store,
				cm : colModel,
				sm : sm,
//				title : '列类型配置',
				tbar : [],
				iconCls : 'icon-by-category',
				border : false,
				region : 'center',
				clicksToEdit : 1,
				layout : 'fit',
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				autoExpandColumn : 1, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
				loadMask : true, // 加载时是否显示进度
				// addBtn : false, // 是否显示新增按钮
				// saveBtn : false, // 是否显示保存按钮
				// delBtn : false, // 是否显示删除按钮
				saveHandler : saveData,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : store,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Plant,
				plantInt : PlantInt,
				servletUrl : MAIN_SERVLET,
				bean : bean,
				business : business,
				primaryKey : primaryKey
			})

			
	function saveData() {
		var flag = true;
		var records = store.getModifiedRecords();
		if (records.length == 0 || records == "") {
			Ext.Msg.alert("信息提示","您没有要保存的记录！")
			store.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
		} else {
			for (var i = 0; i < records.length; i++) {
				if (records[i].get("codeSn") == "" || records[i].get("codeSn") == null) {
					if (records[i].get("codeId") == "" || records[i].get("codeId") == null) {
						Ext.Msg.alert("信息提示","请输入编号！")
						return;
					} else if (records[i].get("modelType") == "" || records[i].get("modelType") == null) {
						Ext.Msg.alert("信息提示","请选择模板类型!");
						return;
					} else if(records[i].get("codeCol") == "" || records[i].get("codeCol") == null){
						Ext.Msg.alert("信息提示","请选择数据库字段!")
						return;
					}else{
						var sql = "select spc.code_id  from sgprj_property_code spc where"
                     	        +" spc.code_id ='"+records[i].get("codeId")+"'"; 
						DWREngine.setAsync(false);
						baseDao.getData(sql, function(list) {
						   if(list!=null&&list.length != 0){
						   	flag = false;
						   }
						})
						DWREngine.setAsync(true);
						if(!flag)break;
					}
				} else {
                     if(records[i].get("codeCol")== ""||records[i].get("codeCol") == null){
                     	Ext.Msg.alert("信息提示","请选择择字段!");
                     	return;
                     }else if(records[i].get("codeCol") != ""||records[i].get("codeCol") != null) {
                     	var sql = "select spc.code_id from sgprj_property_code spc where" 
                     	        +"  spc.code_id='"+records[i].get("codeId")
                     	        +"' and spc.code_sn  !='"+records[i].get("codeSn")+"'";
                     	DWREngine.setAsync(false);
						baseDao.getData(sql,function(list){
                     	        if(list != null && list.length != 0){
                                   flag = false;
                     	        }
						})
						DWREngine.setAsync(true);
		     			if(!flag)break;
                     }
				}
	
			}
		}
		if(flag == true){
		    gridpanel.defaultSaveHandler();
		}else if(flag == false){
		    Ext.Msg.alert("信息提示","您输入的编号已存在，请修改后再保存！")
		}
	}

	var view = new Ext.Viewport({
				layout : 'border',
				items : [gridpanel]
			})
	
	store.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    
	gridpanel.getTopToolbar().add(btnview);		
	
	var form = new Ext.form.FormPanel({
				form : true,
				labelAlign : 'left',
				buttonAlign : 'center',
				region : 'center',
				labelWidth : 100,
				frame : true,
				width : 400,
				hieght : 500,
				items : [new Ext.form.FieldSet({
									title : '基本信息',
									autoWidth : true,
									autoHieght : true,
									border : true,
									width : 300,
									layout : 'column',
									items : [{
												layout : 'form',
												columnWidth : .95,
												bodyStyle : 'border: 0px',
												items : [ {
															xtype : 'textfield',
															autoWidth : true,
															name : 'CODE_ID',
															fieldLabel : '编号'
														}, {
															xtype : 'textfield',
															autoWidth : true,
															name : 'MODEL_TYPE',
															fieldLabel : '模板类型'
										             	},{
															xtype : 'textfield',
															autoWidth : true,
															name : 'CODE_COL',
															fieldLabel : '数据库表字段名'
														}, {
															xtype : 'textfield',
															autoWidth : true,
															name : 'CODE_COLTYPE',
															fieldLabel : '数据库表字段类型'
														}, {
															xtype : 'textfield',
															autoWidth : true,
															name : 'CODE_NOTE',
															fieldLabel : '列说明'
														}]
											}]

								})],
				buttons : [{
					        id : 'btnB',
							type : 'submit',
							handler : submitJson
						}, {
							text : '重置',
							id : 'reset',
							disabled : false,
							handler : function() {
								form.form.reset();

							}

						}, {
							text : '返回',
							id : 'reset',
							text : '取消',
							disabled : false,
							handler : function() {
								checkWindow.hide();
							}
						}]

			})
	form.form.render('form')
	function submitJson(value) {
		var form1 = form.getForm();
		queryData = "CODE_TYPE ='PROJECT_COL' ";
		if (form1.valueOf()) {
			if ('' != form1.findField('CODE_ID').getValue()) {
				queryData += '  and ';
				queryData += ' CODE_ID like \'%'
						+ form1.findField('CODE_ID').getValue() + '%\'';
			}
			if ('' != form1.findField('MODEL_TYPE').getValue()) {
				queryData += '  and ';
				queryData += ' MODEL_TYPE like \'%'
						+ form1.findField('MODEL_TYPE').getValue().toUpperCase()  + '%\'';
			}
			if ('' != form1.findField('CODE_COL').getValue()) {
				queryData += '  and ';
				queryData += ' CODE_COL like \'%'
						+ form1.findField('CODE_COL').getValue().toUpperCase()   + '%\'';
			}
			if ('' != form1.findField('CODE_COLTYPE').getValue()) {
				queryData += '  and  ';
				queryData += ' CODE_COLTYPE like \'%'
						+ form1.findField('CODE_COLTYPE').getValue().toUpperCase()   + '%\'';
			}
			if ('' != form1.findField('CODE_NOTE').getValue()) {
				queryData += '  and  ';
				queryData += ' CODE_NOTE like \'%'
						+ form1.findField('CODE_NOTE').getValue() + '%\'';
			}
			store.baseParams.params = queryData;
			store.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
			checkWindow.hide();
		}

	}
	checkWindow = new Ext.Window({
				title : '查询',
				layout : 'fit',
				width : 400,
				height : 300,
				closeAction :'hide',
				autoDestroy : true,				
				minimizable : 1000,
				maximizable : 800,
				items : [form]
			})
	btnview.on('click', function() {
		        form.form.reset();
		        Ext.getCmp("btnB").setText("查询")
				checkWindow.show()
			})

})
