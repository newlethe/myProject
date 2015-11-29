/*
 * 
 * 
 */

var bean = "com.sgepit.frame.xgridTemplet.hbm.SgprjPropertyCode";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'codeSn';
var orderColumn = 'codeSn';
var queryData = '';
var gridfiter = 'PROJECT_TYPE';
var checkWindow;
var store
var codeNoteData = new Array();
var codeTableData = new Array();
Ext.onReady(function() {

	Ext.QuickTips.init();
	queryData = " code_type= '" + gridfiter + "'";
	// 查询数据库表名数据
	DWREngine.setAsync(false);
	baseMgm.getData('select us.table_name ,us.comments from user_tab_comments us order by us.table_name',
			function(list) {
				if (list != null || list.length != 0) {
					for (var i = 0; i < list.length; i++) {    
						if (list[i][0] != null) {
							var temp = new Array()
							temp.push(list[i][0])
							temp.push(list[i][0])
							temp.push(list[i][1])
							codeTableData.push(temp)
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
	var combox = new Ext.form.ComboBox({
				store : codeTableStore,
				valueField : 'k',
				displayField : 'v',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '选择数据库表名....',
				selectOnFocus : true
			});
		combox.on('select',function(){
		      var value = combox.getValue();
		      var record = sm.getSelected();
		      for (var i = 0; i < codeTableData.length; i++) {		      	
					if (value == codeTableData[i][0]) {
						record.set('codeNote', codeTableData[i][2]);
						break;
					}
				}
		})	
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
				width : 220,
				sortable : true,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				header : '类型',
				dataIndex : 'codeType',
				width : 100,
				sortable : true,
				hidden : true
			}, {
				header : '模板类型',
				dataIndex : 'modelType',
				width : 200,
				sortable : true,
				hidden : true
			}, {
				header : '数据库表名',
				dataIndex : 'codeTable',
				width : 200,
				sortable : true,
				editor : combox
			}, {
				header : '数据库列名',
				dataIndex : 'codeCol',
				width : 200,
				sortable : true,
				hidden : true
			}, {
				header : '列类型',
				dataIndex : 'codeColtype',
				width : 100,
				sortable : true,
				hidden : true
			}, {
				header : '表的备注',
				dataIndex : 'codeNote',
				width : 200,
				sortable : true,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				header : '时间转换类型',
				dataIndex : 'sjTran',
				width : 100,
				sortable : true,
				hidden : true
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
				editor : new Ext.form.TextArea()

			}])

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
		codeType : gridfiter,
		codeTable : '',
		codeCol : '',
		codeColtype : '',
		codeNote : '',
		sjTran : '',
		orderId : '',
		note : '',
		modelType : ''
	}

	store = new Ext.data.Store({
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
//				title : '模板类型配置',
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
				saveHandler : saveFun,
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

	var view = new Ext.Viewport({
		layout : 'border',
		items : [gridpanel]
	})
	
   gridpanel.getTopToolbar().add(btnview);

	function saveFun() {
		var flag = true;
		var records = store.getModifiedRecords();
		if(records.length == ""){
		   Ext.Msg.alert("信息提示","您没有要保存的记录！");
		}else{
		  for(var i = 0; i < records.length; i++){
		  	if(records[i].get("codeSn") == ""){
			  	if(records[i].get("codeId") == ""){
			  	    Ext.Msg.alert("信息提示","编号不能为空，请输入编号！");
			  	    return;
			  	}else  if(records[i].get("codeTable") == ""){
			  	    Ext.Msg.alert("信息提示","请选择数据库表名！");
			  	     return;
			  	}else{
			  		   var sql = "select spc.code_id from sgprj_property_code spc where spc.code_id= '"
			  		            +records[i].get("codeId")+"'";
			  		   DWREngine.setAsync(false);         
			  	       baseDao.getData(sql,function(list){
						   if(list!=null&&list.length != 0){
						   	flag = false;
						   }
			  	       })
			  	       DWREngine.setAsync(true);
					   if(!flag)break;
				      }
		  }else{
		  	if(records[i].get("codeTable") == null||records[i].get("codeTable") ==""){
		  	    Ext.Msg.alert("信息提示","请输入数据库表名！");
		  	    break;
		  	}else{
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

	store.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	var form = new Ext.form.FormPanel({
				renderTo : new Ext.getBody(),
				form : true,
				labelAlign : 'left',
				buttonAlign : 'center',
				region : 'center',
				labelWidth : 100,
				// title : '查询',
				frame : true,
				width : 400,
				items : [new Ext.form.FieldSet({
									title : '基本信息',
									border : true,
									width : 360,
									layout : 'column',
									items : [{
												layout : 'form',
												columnWidth : .95,
												bodyStyle : 'border: 0px',
												items : [ {
															xtype : 'textfield',
															width : 120,
															name : 'CODE_ID',
															fieldLabel : '编号'
														},{
															xtype : 'textfield',
															width : 120,
															name : 'CODE_TABLE',
															fieldLabel : '数据库表名'
														}, {
															xtype : 'textfield',
															width : 120,
															name : 'CODE_NOTE',
															fieldLabel : '表说明'
														}]
											}]

								})],
				buttons : [{
							text : '查询',
							type : 'submit',
							handler : submitSave
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
	function submitSave(value) {
		var form1 = form.getForm();
		queryData = "CODE_TYPE ='PROJECT_TYPE'";
		if (form1.valueOf()) {
			if ('' != form1.findField('CODE_ID').getValue()) {
				queryData += '  and ';
				queryData += ' CODE_ID like \'%'
						+ form1.findField('CODE_ID').getValue().toUpperCase() + '%\'';
			}
			if ('' != form1.findField('CODE_TABLE').getValue()) {
				queryData += '  and ';
				queryData += ' CODE_TABLE like \'%'
						+ form1.findField('CODE_TABLE').getValue().toUpperCase() + '%\'';
			}		
			if ('' != form1.findField('CODE_NOTE').getValue()) {
				queryData += '  and ';
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
				checkWindow.show()
			})
})
