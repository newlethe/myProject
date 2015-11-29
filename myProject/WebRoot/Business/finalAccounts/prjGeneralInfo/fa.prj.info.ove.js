var servletName = 'servlet/PrjGeneralInfoServlet';
var fcParams, fcProgress, fcEqu, fcInvesment;
var paramsPanel, progressPanel, equPanel, invesmentPanel;
var business = "baseMgm";
var listMethod = "findWhereOrderby"
var pageSize = 12;
var currentPid = CURRENTAPPID;
var gridfilter = "pid = '" + currentPid +  "'";
//是否禁用添加/修改/删除按钮
var btnDisabled = ModuleLVL != '1';

Ext.onReady(function() {

			var paramTypeArr = [];
	
			DWREngine.setAsync(false);
			appMgm.getCodeValue('工程概况参数类型', function(list) {
						paramTypeArr.push(['-1', '全部']);
						for (i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i].propertyCode);
							temp.push(list[i].propertyName);
							paramTypeArr.push(temp);
						}
					});

			DWREngine.setAsync(true);

			var paramTypeStore = new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : paramTypeArr
					});

			// 通用combobox renderer
			Ext.util.Format.comboRenderer = function(combo) {
				return function(value) {
					var record = combo.findRecord(combo.valueField, value);
					return record
							? record.get(combo.displayField)
							: combo.valueNotFoundText;
				}
			}

			// 日期renderer
			var dateRenderer = Ext.util.Format.dateRenderer('Y年n月j日');

			// 参数类型下拉框
			var paramTypeCombo = new Ext.form.ComboBox({
						typeAhead : true,
						triggerAction : 'all',
						mode : 'local',
						lazyRender : true,
						store : paramTypeStore,
						valueField : 'k',
						displayField : 'v',
						allowBlank : true

					});

			// 数据类型下拉框
			var dataTypeCombo = new Ext.form.ComboBox({
						typeAhead : true,
						triggerAction : 'all',
						valueField : 'k',
						displayField : 'v',
						mode : 'local',
						allowBlank : true,
						store : new Ext.data.SimpleStore({
									fields : ['k', 'v'],
									data : [['char', '字符'], ['deci', '数字'],
											['date', '日期']]
								})
					});

			// 包名简写
			var fm = Ext.form;

			// 域模型
			var fc = {
				uids : {
					name : 'uids',
					fieldLabel : 'uids'
				},
				prjName : {
					name : 'prjName',
					fieldLabel : '工程名称',
					allowBlank : false
				},
				prjAddress : {
					name : 'prjAddress',
					fieldLabel : '建设地址',
					allowBlank : true
				},
				designUnit : {
					name : 'designUnit',
					fieldLabel : '主要设计单位',
					allowBlank : true
				},
				constructUnit : {
					name : 'constructUnit',
					fieldLabel : '主要建设单位',
					allowBlank : true
				},
				eqIntensity : {
					name : 'eqIntensity',
					fieldLabel : '地震强度',
					allowBlank : true
				},
				fdIntensity : {
					name : 'fdIntensity',
					fieldLabel : '地基计算强度',
					allowBlank : true
				}

			};

			// 基本信息fieldSet
			var formFieldsSet = new fm.FieldSet({
						title : '项目信息',
						border : true,
						width : 800,
						layout : 'column',
						items : [{
							layout : 'form',
							border : false,
							columnWidth : .5,
							defaults : { // defaults are applied to items,
								// not the container
								width : 270
							},
							items : [new fm.TextField(fc['prjName']),
									new fm.TextField(fc['designUnit']),
									new fm.TextField(fc['eqIntensity']),
									new fm.Hidden(fc['uids'])]

						}, {
							layout : 'form',
							border : false,
							columnWidth : .5,
							defaults : { // defaults are applied to items,
								// not the container
								width : 270
							},
							items : [new fm.TextField(fc['prjAddress']),
									new fm.TextField(fc['constructUnit']),
									new fm.TextField(fc['fdIntensity'])]
						}]

					});

			// 按钮
			var saveBtn = new Ext.Button({
						text : '保存',
						disabled : btnDisabled,
						handler : function() {
							if (!formPanel.getForm().isValid()) {
								return;
							}
							var prjInfoOve = formPanel.getForm().getValues();
							saveOrUpdate(prjInfoOve);
						}
					});

			// 创建表单Panel
			var formPanel = new Ext.FormPanel({
						id : 'form-panel',
						title : '工程基本信息',
						region : 'north',
						height : 240,
						labelAlign : 'left',
						bodyStyle : 'padding:10px 10px;',
						items : [formFieldsSet],
						buttonAlign : 'left',
						buttons : [saveBtn]
					});

			/*
			 * 工程参数部分 pid VARCHAR2(32), param_no VARCHAR2(32) not null,
			 * param_type VARCHAR2(32), param_name VARCHAR2(30), data_format
			 * VARCHAR2(50), unit VARCHAR2(10), data_type VARCHAR2(10),
			 * param_value VARCHAR2(100),
			 */

			fcParams = {
				uids : {
					name : 'uids',
					fieldLabel : 'uids',
					readOnly : true,
					hidden : true
				},

				pid : {
					name : 'pid',
					fieldLabel : '工程项目编号',
					readOnly : true,
					hidden : true
				},

				paramNo : {
					name : 'paramNo',
					fieldLabel : '参数编号'

				},
				paramType : {
					name : 'paramType',
					fieldLabel : '参数类别',
					valueField : 'k',
					displayField : 'v',
					store : paramTypeStore

				},
				paramName : {
					name : 'paramName',
					fieldLabel : '参数名称'
				},
				paramValue : {
					name : 'paramValue',
					fieldLabel : '参数值'
				},
				unit : {
					name : 'unit',
					fieldLabel : '单位'
				},
				dataType : {
					name : 'dataType',
					fieldLabel : '数据类型'

				},
				dataFormat : {
					name : 'dataFormat',
					fieldLabel : '显示格式',
					hidden : true
				}

			};

			var ColumnsParam = [{
						name : 'uids',
						type : 'string'
					}, {
						name : 'pid',
						type : 'string'
					}, {
						name : 'paramNo',
						type : 'string'
					}, {
						name : 'paramName',
						type : 'string'
					}, {
						name : 'paramType',
						type : 'string'
					}, {
						name : 'paramValue',
						type : 'string'
					}, {
						name : 'unit',
						type : 'string'
					}, {
						name : 'dataType',
						type : 'string'
					}, {
						name : 'dataFormat',
						type : 'string'
					}];

			var PlantParam = Ext.data.Record.create(ColumnsParam);
			var PlantParamInt = {
				pid : pid,
				paramNo : '',
				paramName : '',
				paramType : null,
				paramValue : null,
				unit : null,
				dataType : null,
				dataFormat : null
			};
			var smParam = new Ext.grid.CheckboxSelectionModel({

			});
			// 列模型
			var cmParam = new Ext.grid.ColumnModel([smParam, {
								id : 'uids',
								header : fcParams['uids'].fieldLabel,
								dataIndex : fcParams['uids'].name,
								hidden : true
							}, {
								id : 'pid',
								header : fcParams['pid'].fieldLabel,
								dataIndex : fcParams['pid'].name,
								hidden : fcParams['pid'].hidden
							}, {
								id : 'paramNo',
								header : fcParams['paramNo'].fieldLabel,
								dataIndex : fcParams['paramNo'].name
							}, {
								id : 'paramType',
								header : fcParams['paramType'].fieldLabel,
								dataIndex : fcParams['paramType'].name,
								renderer : Ext.util.Format
										.comboRenderer(paramTypeCombo)
							}, {
								id : 'paramName',
								header : fcParams['paramName'].fieldLabel,
								dataIndex : fcParams['paramName'].name,
								editor : new Ext.form.TextField()
							}, {
								id : 'paramValue',
								header : fcParams['paramValue'].fieldLabel,
								dataIndex : fcParams['paramValue'].name,
								editor : new Ext.form.TextField()
							}, {
								id : 'unit',
								header : fcParams['unit'].fieldLabel,
								dataIndex : fcParams['unit'].name
							}, {
								id : 'dataType',
								header : fcParams['dataType'].fieldLabel,
								dataIndex : fcParams['dataType'].name,
								renderer : Ext.util.Format
										.comboRenderer(dataTypeCombo)
							}], {
						id : 'dataFormat',
						header : fcParams['dataFormat'].fieldLabel,
						dataIndex : fcParams['dataFormat'].name,
						hidden : fcParams['dataFormat'].hidden
					});
			cmParam.defaultSortable = true;

			// 工程参数部分数据源
			var paramDs = new Ext.data.Store({
						baseParams : {
							ac : 'list',
							bean : paramBeanName,
							business : business,
							method : listMethod,
							params : gridfilter
						},
						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : 'uids'
								}, ColumnsParam),
						remoteSort : true,
						pruneModifiedRecords : true

					});

			paramDs.setDefaultSort('paramType', 'asc');

			//参数类型过滤Combo
			var paramTypeFilterCombo = new Ext.form.ComboBox({
						typeAhead : true,
						triggerAction : 'all',
						mode : 'local',
						lazyRender : true,
						store : paramTypeStore,
						valueField : 'k',
						displayField : 'v',
						allowBlank : true,
						editable : false,
						value : '-1'

					});
					
			paramTypeFilterCombo.on('select', function(combo, record){
				var filterStr = gridfilter;
				if ( record.data.k != '-1' ){
					filterStr += " and paramType = '" + record.data.k + "'";
				}
				paramDs.baseParams.params = filterStr;
				paramDs.load({
									params : {
										start : 0,
										limit : pageSize
									}
								});
			});
					
			// 工程概况参数tab页
			paramsPanel = new Ext.grid.EditorGridTbarPanel({
						id : 'params-panel',
						title : '工程参数',
						iconCls : 'icon-by-category',
						addBtn : false,
						delBtn : false,
						ds : paramDs,
						cm : cmParam,
						sm : smParam,
						servletUrl : MAIN_SERVLET,
						bean : paramBeanName,
						tbar : [paramTypeFilterCombo],
						border : false,
						autoScroll : 'true',
						clicksToEdit : 1,
						primaryKey : 'uids',
						loadMask : true,
						stripeRows : true,
						bbar : new Ext.PagingToolbar({
									pageSize : pageSize,
									beforePageText : "第",
									store : paramDs,
									displayInfo : true,
									displayMsg : ' {0} - {1} / {2}',
									emptyMsg : "无记录"
								}),
						plant : PlantParam,
						plantInt : PlantParamInt,
						saveHandler : saveHandler
					});

			/*
			 * 
			 * 主要设备部分
			 */
			fcEqu = {
				uids : {
					name : 'uids',
					fieldLabel : 'uids',
					readOnly : true,
					hidden : true
				},
				pid : {
					name : 'pid',
					fieldLabel : 'pid',
					readOnly : true,
					hidden : true
				},
				equNo : {
					name : 'equNo',
					fieldLabel : '编号'
				},
				equName : {
					name : 'equName',
					fieldLabel : '设备名称'
				},
				equModel : {
					name : 'equModel',
					fieldLabel : '设备型号'
				},
				equMaker : {
					name : 'equMaker',
					fieldLabel : '设备制造商'
				},
				equPrice : {
					name : 'equPrice',
					fieldLabel : '设备价格'
				}

			}

			var ColumnsEqu = [{
						name : 'uids',
						type : 'string'
					}, {
						name : 'pid',
						type : 'string'
					}, {
						name : 'equNo',
						type : 'string'
					}, {
						name : 'equName',
						type : 'string'
					}, {
						name : 'equModel',
						type : 'string'
					}, {
						name : 'equMaker',
						type : 'string'
					}, {
						name : 'equPrice',
						type : 'string'
					}

			];

			var PlantEqu = Ext.data.Record.create(ColumnsEqu);
			var PlantEquInt = {
				pid : pid,
				equNo : '',
				equName : '',
				equModel : null,
				equMaker : null,
				equPrice : null
			};
			var smEqu = new Ext.grid.CheckboxSelectionModel({

			});

			// 列模型
			var cmEqu = new Ext.grid.ColumnModel([smEqu, {
						id : 'uids',
						header : fcEqu['uids'].fieldLabel,
						dataIndex : fcEqu['uids'].name,
						hidden : true
					}, {
						id : 'pid',
						header : fcEqu['pid'].fieldLabel,
						dataIndex : fcEqu['pid'].name,
						hidden : fcEqu['pid'].hidden
					}, {
						id : 'equNo',
						header : fcEqu['equNo'].fieldLabel,
						dataIndex : fcEqu['equNo'].name,
						editor : new Ext.form.TextField()
					}, {
						id : 'equName',
						header : fcEqu['equName'].fieldLabel,
						dataIndex : fcEqu['equName'].name,
						editor : new Ext.form.TextField()
					}, {
						id : 'equModel',
						header : fcEqu['equModel'].fieldLabel,
						dataIndex : fcEqu['equModel'].name,
						editor : new Ext.form.TextField()
					}, {
						id : 'equMaker',
						header : fcEqu['equMaker'].fieldLabel,
						dataIndex : fcEqu['equMaker'].name,
						editor : new Ext.form.TextField()
					}, {
						id : 'equPrice',
						align : 'right',
						header : fcEqu['equPrice'].fieldLabel,
						dataIndex : fcEqu['equPrice'].name,
						renderer : cnMoney,
						editor : new Ext.form.NumberField()
					}

			]);
			cmParam.defaultSortable = true;

			// 设备概况部分数据源
			var equDs = new Ext.data.Store({
						baseParams : {
							ac : 'list',
							bean : equBeanName,
							business : business,
							method : listMethod,
	    					params: gridfilter
						},
						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : 'uids'
								}, ColumnsEqu),
						remoteSort : true,
						pruneModifiedRecords : true

					});

			equDs.setDefaultSort('uids', 'asc');

			// 设备概况参数tab页
			equPanel = new Ext.grid.EditorGridTbarPanel({
						id : 'equ-panel',
						title : '主要设备简况',
						iconCls : 'icon-by-category',
						ds : equDs,
						cm : cmEqu,
						sm : smEqu,
						servletUrl : MAIN_SERVLET,
						bean : equBeanName,
						tbar : [],
						border : false,
						autoScroll : 'true',
						clicksToEdit : 1,
						primaryKey : 'uids',
						loadMask : true,
						stripeRows : true,
						bbar : new Ext.PagingToolbar({
									pageSize : pageSize,
									beforePageText : "第",
									store : equDs,
									displayInfo : true,
									displayMsg : ' {0} - {1} / {2}',
									emptyMsg : "无记录"
								}),
						plant : PlantEqu,
						plantInt : PlantEquInt,
						saveHandler : saveHandler
					});

			/*
			 * 
			 * 工程进度部分
			 */
			fcProgress = {
				uids : {
					name : 'uids',
					fieldLabel : 'uids',
					readOnly : true,
					hidden : true
				},
				pid : {
					name : 'pid',
					fieldLabel : 'pid',
					readOnly : true,
					hidden : true
				},
				progName : {
					name : 'progName',
					fieldLabel : '名称'
				},
				planDate : {
					name : 'planDate',
					fieldLabel : '计划时间'
				},
				assesDate : {
					name : 'assesDate',
					fieldLabel : '考核时间'
				},
				actualDate : {
					name : 'actualDate',
					fieldLabel : '实际时间'
				}

			}

			var ColumnsProgress = [{
						name : 'uids',
						type : 'string'
					}, {
						name : 'pid',
						type : 'string'
					}, {
						name : 'progName',
						type : 'string'
					}, {
						name : 'planDate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'assesDate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'actualDate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}

			];

			var PlantProgress = Ext.data.Record.create(ColumnsProgress);
			var PlantProgressInt = {
				pid : pid,
				progName : '',
				planDate : null,
				assesDate : null,
				actualDate : null
			};
			var smProgress = new Ext.grid.CheckboxSelectionModel({

			});

			// 列模型
			var cmProgress = new Ext.grid.ColumnModel([smProgress, {
						id : 'uids',
						header : fcProgress['uids'].fieldLabel,
						dataIndex : fcProgress['uids'].name,
						hidden : true
					}, {
						id : 'pid',
						header : fcProgress['pid'].fieldLabel,
						dataIndex : fcProgress['pid'].name,
						hidden : fcProgress['pid'].hidden
					}, {
						id : 'progName',
						header : fcProgress['progName'].fieldLabel,
						dataIndex : fcProgress['progName'].name,
						editor : new Ext.form.TextField()
					}, {
						id : 'planDate',
						header : fcProgress['planDate'].fieldLabel,
						dataIndex : fcProgress['planDate'].name,
						editor : new Ext.form.DateField(),
						renderer : dateRenderer
					}, {
						id : 'assesDate',
						header : fcProgress['assesDate'].fieldLabel,
						dataIndex : fcProgress['assesDate'].name,
						editor : new Ext.form.DateField(),
						renderer : dateRenderer

					}, {
						id : 'actualDate',
						header : fcProgress['actualDate'].fieldLabel,
						dataIndex : fcProgress['actualDate'].name,
						editor : new Ext.form.DateField(),
						renderer : dateRenderer
					}

			]);
			cmProgress.defaultSortable = true;

			// 设备概况部分数据源
			var progressDs = new Ext.data.Store({
						baseParams : {
							ac : 'list',
							bean : progressBeanName,
							business : business,
							method : listMethod,
	    					params: gridfilter
						},
						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : 'uids'
								}, ColumnsProgress),
						remoteSort : true,
						pruneModifiedRecords : true

					});

			progressDs.setDefaultSort('uids', 'asc');
			
			

			// 设备概况参数tab页
			progressPanel = new Ext.grid.EditorGridTbarPanel({
						id : 'progress-panel',
						title : '工程进度',
						iconCls : 'icon-by-category',
						ds : progressDs,
						cm : cmProgress,
						sm : smProgress,
						servletUrl : MAIN_SERVLET,
						bean : progressBeanName,
						tbar : [],
						border : false,
						autoScroll : 'true',
						clicksToEdit : 1,
						primaryKey : 'uids',
						loadMask : true,
						stripeRows : true,
						bbar : new Ext.PagingToolbar({
									pageSize : pageSize,
									beforePageText : "第",
									store : progressDs,
									displayInfo : true,
									displayMsg : ' {0} - {1} / {2}',
									emptyMsg : "无记录"
								}),
						plant : PlantProgress,
						plantInt : PlantProgressInt,
						saveHandler : saveHandler
					});

			/*
			 * 
			 * 投资部分
			 */
			fcInvesment = {
				uids : {
					name : 'uids',
					fieldLabel : 'uids',
					readOnly : true,
					hidden : true
				},
				pid : {
					name : 'pid',
					fieldLabel : 'pid',
					readOnly : true,
					hidden : true
				},
				invesName : {
					name : 'invesName',
					fieldLabel : '名称'
				},
				invesTotal : {
					name : 'invesTotal',
					fieldLabel : '总投资'
				},
				invesAvg : {
					name : 'invesAvg',
					fieldLabel : '单位投资'
				}

			}

			var ColumnsInvesment = [{
						name : 'uids',
						type : 'string'
					}, {
						name : 'pid',
						type : 'string'
					}, {
						name : 'invesName',
						type : 'string'
					}, {
						name : 'invesTotal',
						type : 'float'
					}, {
						name : 'invesAvg',
						type : 'float'
					}

			];

			var PlantInvesment = Ext.data.Record.create(ColumnsInvesment);
			var PlantInvesmentInt = {
				pid : pid,
				invesName : '',
				invesTotal : null,
				invesAvg : null
			};
			var smInvesment = new Ext.grid.CheckboxSelectionModel({

			});

			// 列模型
			var cmInvesment = new Ext.grid.ColumnModel([smInvesment, {
						id : 'uids',
						header : fcInvesment['uids'].fieldLabel,
						dataIndex : fcInvesment['uids'].name,
						hidden : true
					}, {
						id : 'pid',
						header : fcInvesment['pid'].fieldLabel,
						dataIndex : fcInvesment['pid'].name,
						hidden : fcInvesment['pid'].hidden
					}, {
						id : 'invesName',
						header : fcInvesment['invesName'].fieldLabel,
						dataIndex : fcInvesment['invesName'].name,
						editor : new Ext.form.TextField()
					}, {
						id : 'invesTotal',
						header : fcInvesment['invesTotal'].fieldLabel,
						dataIndex : fcInvesment['invesTotal'].name,
						align : 'right',
						editor : new Ext.form.NumberField()
					}, {
						id : 'invesAvg',
						header : fcInvesment['invesAvg'].fieldLabel,
						dataIndex : fcInvesment['invesAvg'].name,
						align : 'right',
						editor : new Ext.form.NumberField()
					}

			]);
			cmInvesment.defaultSortable = true;

			// 设备概况部分数据源
			var invesmentDs = new Ext.data.Store({
						baseParams : {
							ac : 'list',
							bean : invesmentBeanName,
							business : business,
							method : listMethod,
	    					params: gridfilter
						},
						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : 'uids'
								}, ColumnsInvesment),
						remoteSort : true,
						pruneModifiedRecords : true

					});

			invesmentDs.setDefaultSort('uids', 'asc');

			// 投资tab页
			invesmentPanel = new Ext.grid.EditorGridTbarPanel({
						id : 'invesment-panel',
						title : '投资概况',
						iconCls : 'icon-by-category',
						ds : invesmentDs,
						cm : cmInvesment,
						sm : smInvesment,
						servletUrl : MAIN_SERVLET,
						bean : invesmentBeanName,
						tbar : [],
						border : false,
						autoScroll : 'true',
						clicksToEdit : 1,
						primaryKey : 'uids',
						loadMask : true,
						stripeRows : true,
						bbar : new Ext.PagingToolbar({
									pageSize : pageSize,
									beforePageText : "第",
									store : invesmentDs,
									displayInfo : true,
									displayMsg : ' {0} - {1} / {2}',
									emptyMsg : "无记录"
								}),
						plant : PlantInvesment,
						plantInt : PlantInvesmentInt,
						saveHandler : saveHandler
					});

			function deleteHandler() {
				var panelId = this.id;
				var ds = this.getStore();
				var sm = this.getSelectionModel();
				if (sm.getCount() == 0) {
					Ext.Msg.alert('提示!', '您尚未选择一条记录!');
					return;
				}

				var record = sm.getSelections();

				Ext.Msg.confirm('确认', '您确认删除所选记录？', function(btn, text) {
							if (btn == 'yes') {
								var json = [];
								Ext.each(modified, function(record) {
											var m = record.get(this.primaryKey);
											if (m == "") { // 主键值为空的记录不计入

											} else if (record.isNew) {
												ds.remove(record);

											} else {
												json.push(record.data);
											}

										});

								Ext.Ajax.request({
											method : 'POST',
											url : servletName,
											params : {
												ac : 'delete-all',
												data : json,
												beanName : this.bean
											},
											success : function(result, request) {
												reload(panelId);
											},
											failure : function(result, request) {
												Ext.example.msg('删除失败！',
														'删除失败！');
											}
										});
							}
						});
			}

			function saveOrUpdate(prjOveInfo) {

				Ext.Ajax.request({
							method : 'post',

							url : servletName,
							params : {
								ac : 'save-one'
							},
							jsonData : Ext.encode(prjOveInfo),
							success : function(result, request) {
								loadPrjInfo();
								Ext.example.msg('保存', '保存成功！');

							},
							failure : function(result, request) {

								Ext.Msg.show({
											title : '操作失败',
											msg : '操作失败',
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.ERROR
										});

							}
						});

			}

			function saveHandler() {
				var panelId = this.id;
				var ds = this.getStore();
				var modified = ds.getModifiedRecords();
				if (modified.length == 0)
					return;
				var json = [];
				Ext.each(modified, function(item) {

							json.push(item.data);
						});

				Ext.Ajax.request({
							method : 'POST',
							url : servletName,
							params : {
								beanName : this.bean,
								ac : 'save-update-all',
								data : Ext.encode(json)
							},
							success : function(result, request) {
								Ext.example.msg('保存', '保存成功！');
								reload(panelId);
							},
							failure : function(result, request) {
								Ext.example.msg('保存失败！', '保存失败！');
							}

						});

			}

			// TAB面板
			var tabPanel = new Ext.TabPanel({
						region : 'center',
						border : false,
						activeTab : 0,
						items : [paramsPanel, equPanel, progressPanel,
								invesmentPanel]
					});

			// 创建viewport，加入面板
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [formPanel, tabPanel]
					});

			loadPrjInfo();

			reload('params-panel');
			reload('equ-panel');
			reload('progress-panel');
			reload('invesment-panel');

			function reload(id) {
				switch (id) {
					case 'params-panel' :
						paramDs.load({
									params : {
										start : 0,
										limit : pageSize
									}
								});
						break;
					case 'equ-panel' :
						equDs.load({
									params : {
										start : 0,
										limit : pageSize
									}
								});
						break;
					case 'progress-panel' :
						progressDs.load({
									params : {
										start : 0,
										limit : pageSize
									}
								});
						break;

					case 'invesment-panel' :
						invesmentDs.load({
									params : {
										start : 0,
										limit : pageSize
									}
								});

						break;
				}
			}

			function loadPrjInfo() {
				formPanel.getForm().load({
							url : servletName,
							root : 'data',
							params : {
								ac : 'getPrjOveInfo'
							}
						});
			}

		});
