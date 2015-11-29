var servletName = 'servlet/PrjGeneralInfoServlet';
var fcParams, fcProgress, fcEqu, fcInvesment;
var paramsPanel, progressPanel, equPanel, invesmentPanel;
var business = "baseMgm";
var listMethod = "findWhereOrderby"
var pageSize = PAGE_SIZE;
var currentPid = CURRENTAPPID;
var gridfilter = "pid = '" + currentPid +  "'";

Ext.onReady(function() {

			var paramTypeArr = [];

			DWREngine.setAsync(false);
			appMgm.getCodeValue('工程概况参数类型', function(list) {
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

			/*
			 * 工程参数部分 
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
								dataIndex : fcParams['paramNo'].name,
								editor : new Ext.form.TextField()
							}, {
								id : 'paramType',
								header : fcParams['paramType'].fieldLabel,
								dataIndex : fcParams['paramType'].name,
								editor : paramTypeCombo,
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
								hidden : true
							}, {
								id : 'unit',
								header : fcParams['unit'].fieldLabel,
								dataIndex : fcParams['unit'].name,
								editor : new Ext.form.TextField()
							}, {
								id : 'dataType',
								header : fcParams['dataType'].fieldLabel,
								dataIndex : fcParams['dataType'].name,
								editor : dataTypeCombo,
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
								}, ColumnsParam),
						remoteSort : true,
						pruneModifiedRecords : true

					});

			paramDs.setDefaultSort('paramType', 'asc');

			// 工程概况参数tab页
			paramsPanel = new Ext.grid.EditorGridTbarPanel({
						region : 'center',
						id : 'params-panel',
						title : '工程参数',
						iconCls : 'icon-by-category',
						ds : paramDs,
						cm : cmParam,
						sm : smParam,
						servletUrl : MAIN_SERVLET,
						bean : paramBeanName,
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
									store : paramDs,
									displayInfo : true,
									emptyMsg : "无记录"
								}),
						plant : PlantParam,
						plantInt : PlantParamInt,
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

		

			// 创建viewport，加入面板
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [paramsPanel]
					});

			reload('params-panel');

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

				}
			}

		});
