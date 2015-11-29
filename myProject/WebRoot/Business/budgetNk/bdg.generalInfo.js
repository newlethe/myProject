var ServletUrl = MAIN_SERVLET;
var BudgetNkServlet = 'servlet/BudgetNkServlet';
var bean = "com.sgepit.pmis.contract.hbm.ConOve";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "conid";
var orderColumn = "conno";
var gridPanelTitle = "所有记录";
var formPanelTitle = "编辑记录（查看详细信息）";
var propertyName = "condivno";
var propertyValue = "1";

// var SPLITB = "`"
// var pid = PID;

// var contractType = new Array();
// var contarctType2 = new Array();
// var appType =
// [['none','未分摊合同'],['conovenopay','合同分摊(无付款分摊)'],['conovenocha','合同分摊(无变更分摊)'],['pay','付款分摊'],['change','变更分摊'],['pay-change','付款-变更分摊']];
// var BillState = new Array();
// var payways = new Array();
// //var contractType= [['01', '工程合同'],['02', '其他合同'],['03', '总承包合同'],['04',
// '设备(自营)合同'],['05','前期合同'],['06', '设备(总包)合同'],['-1', '所有合同']];
// //var BillState = [[1,'合同签订'],[2,'合同执行'],[3,'付款完成'],[4,'合同结算'],[5,'终止合同']];
// var dsCombo2 = new Ext.data.SimpleStore({
// fields: ['k', 'v'],
// data: [['','']]
// });
//
// var formWindow;
// var partbWindow;
// var partbDet;
// var partBField;

Ext.onReady(function() {

			// TODO 分摊类型筛选下拉框

			// 选项对象(通用)
			var SelectItem = Ext.data.Record.create([{
						name : 'key'
					}, {
						name : 'value'
					}]);
			// 下拉列表reader(通用)
			var selReader = new Ext.data.ArrayReader({
						id : 'key'
					}, ['key', 'value']);

			// 合同所属部门(合同分类1)
			var contractDeptStore = new Ext.data.Store({

						url : BudgetNkServlet,
						baseParams : {
							ac : 'listbox',
							category : '合同划分类型'
						},

						reader : selReader
					});
			// 初始化数据
			contractDeptStore.load({
						callback : function() {
							// 插入‘所有合同’的选项
							var allCon = new SelectItem({
										key : -1,
										value : '所有合同'

									});
							contractDeptStore.insert(0, allCon);
						}
					});

			// 乙方单位列表
			var partyBStore = new Ext.data.Store({
						reader : new Ext.data.ArrayReader({
									id : 'cpid'
								}, ['cpid', 'pid', 'partybno', 'partyb'])
					});

			// 获取乙方单位
			DWREngine.setAsync(false);
			conpartybMgm.getPartyB(function(list) {
						var temp = new Array();
						for (var i = 0; i < list.length; i++) {
							var curObj = list[i];

							temp.push([curObj.cpid, curObj.pid,
									curObj.partybno, curObj.partyb]);

						}
						partyBStore.loadData(temp);
					});

			DWREngine.setAsync(true);

			// 合同具体分类(合同分类2)
			var contractSubStore = new Ext.data.Store({

						url : BudgetNkServlet,
						// 在级联改变时再设置baseParam
						reader : selReader

					});

			// 合同付款方式
			var contractPaymentStore = new Ext.data.Store({

						url : BudgetNkServlet,
						baseParams : {
							ac : 'listbox',
							category : '合同付款方式'
						},
						reader : selReader,
						autoLoad : true
					});

			// 合同状态
			var contractStateStore = new Ext.data.Store({

						url : BudgetNkServlet,
						baseParams : {
							ac : 'listbox',
							category : '合同状态'
						},
						reader : selReader,
						autoLoad : true

					});

			var fc = { // 创建编辑域配置
				'conid' : {
					name : 'conid',
					fieldLabel : '主键',
					anchor : '95%',
					hidden : true,
					readOnly : true,
					hideLabel : true
				},
				'pid' : {
					name : 'pid',
					fieldLabel : '工程项目编号',
					readOnly : true,
					hidden : true,
					allowBlank : false,
					hideLabel : true,
					anchor : '95%'
				},
				'conno' : {
					name : 'conno',
					fieldLabel : '合同编号',
					anchor : '95%'
				},
				'conname' : {
					name : 'conname',
					fieldLabel : '合同名称',
					anchor : '95%'
				},
				'condivno' : {
					name : 'condivno',
					fieldLabel : '合同分类编码',
					valueField : 'key',
					displayField : 'value',
					inputType : 'select-one',
					mode : 'local',
					typeAhead : true,
					triggerAction : 'all',
					store : contractDeptStore,
					lazyRender : true,
					listClass : 'x-combo-list-small',
					anchor : '95%'
				},
				'signdate' : {
					name : 'signdate',
					fieldLabel : '签订日期',
					width : 45,
					format : 'Y-m-d',
					minValue : '2000-01-01',
					disabledDays : [0, 6],
					disabledDaysText : '只能选择工作日！',
					anchor : '95%'
				},
				'convalue' : {
					name : 'convalue',
					fieldLabel : '合同金额',
					readOnly : true,
					anchor : '95%'
				},
				'conmoney' : {
					name : 'conmoney',
					fieldLabel : '合同签定金额',
					allowNegative : false,
					maxValue : 100000000,
					anchor : '95%'
				},
				'bidno' : {
					name : 'bidno',
					fieldLabel : '招标编号',
					anchor : '95%'
				},
				'partya' : {
					name : 'partya',
					fieldLabel : '甲方',
					anchor : '95%'
				},
				'actionpartya' : {
					name : 'actionpartya',
					fieldLabel : '甲方经办人',
					anchor : '95%'
				},
				'partybno' : {
					name : 'partybno',
					fieldLabel : '乙方单位',
					valueField : 'cpid',
					displayField : 'partyb',
					mode : 'local',
					typeAhead : true,
					triggerAction : 'all',
					store : partyBStore,
					lazyRender : true,
					listClass : 'x-combo-list-small',
					anchor : '95%'
				},
				'partybman' : {
					name : 'partybman',
					fieldLabel : '乙方代表',
					anchor : '95%'
				},
				'partybphone' : {
					name : 'partybphone',
					fieldLabel : '乙方代表电话',
					anchor : '95%'
				},
				'advmoney' : {
					name : 'advmoney',
					fieldLabel : '预付款',
					allowNegative : false,
					maxValue : 100000000,
					anchor : '95%'
				},
				'matmoney' : {
					name : 'matmoney',
					fieldLabel : '质保金',
					allowNegative : false,
					maxValue : 100000000,
					anchor : '95%'
				},
				'context' : {
					name : 'context',
					fieldLabel : '合同摘要',
					height : 200,
					width : 200,
					anchor : '95%'
				},
				'billstate' : {
					name : 'billstate',
					fieldLabel : '合同状态',
					readOnly : true,
					valueField : 'key',
					displayField : 'value',
					emptyText : '合同审定',
					mode : 'local',
					typeAhead : true,
					triggerAction : 'all',
					store : contractStateStore,
					lazyRender : true,
					listClass : 'x-combo-list-small',
					allowNegative : false,
					maxValue : 100000000,
					anchor : '95%'
				},
				'payper' : {
					name : 'payper',
					fieldLabel : '付款比例',
					anchor : '95%'
				},
				'payway' : {
					name : 'payway',
					fieldLabel : '付款方式',
					valueField : 'key',
					displayField : 'value',
					mode : 'local',
					typeAhead : true,
					triggerAction : 'all',
					// store: contractPaymentStore,
					lazyRender : true,
					listClass : 'x-combo-list-small',
					anchor : '95%'
				},
				'conadmin' : {
					name : 'conadmin',
					fieldLabel : '合同管理员',
					anchor : '95%'
				}
			}

			// 选择模型(只能单选的checkbox)
			var sm = new Ext.grid.CheckboxSelectionModel({ // 单击时的事件
				header : '', // 表头不需要checkbox
				singleSelect : true,
				listeners : {
					rowselect : function(sm, row, rec) {
						parent.conid = rec.get('conid');
						parent.conno = rec.get('conno');
						parent.conname = rec.get('conname');
						parent.conmoney = rec.get('conmoney');
						var tb = parent.mainPanel.getTopToolbar();
						tb.items.get("money").enable();
						
					},
					rowdeselect: function(sm, row, rec){
						var tb = parent.mainPanel.getTopToolbar();
						tb.items.get("money").disable();
					}
				}
			});

			var cm = new Ext.grid.ColumnModel([ // 创建列模型
					// 第一列为复选框
					sm, {
						id : 'conid',
						header : fc['conid'].fieldLabel,
						dataIndex : fc['conid'].name,
						hidden : true,
						type : 'string',
						width : 200
					}, {
						id : 'pid',
						header : fc['pid'].fieldLabel,
						dataIndex : fc['pid'].name,
						hidden : true,
						type : 'string',
						width : 120
					}, {
						id : 'conno',
						header : fc['conno'].fieldLabel,
						dataIndex : fc['conno'].name,
						width : 60,
						type : 'string'
					}, {
						id : 'conname',
						header : fc['conname'].fieldLabel,
						dataIndex : fc['conname'].name,
						width : 120,
						type : 'string',
						// 鼠标悬停时显示完整信息
						renderer : function(data, metadata, record, rowIndex,
								columnIndex, store) {

							var qtip = " qtip= " + data + " />";
							return '<span ' + qtip + data + '</span>';

							return data;
						}
					}, {
						id : "partybno",
						header : fc['partybno'].fieldLabel,
						dataIndex : fc['partybno'].name,
						width : 120,
						renderer : function(value) {
							var index = partyBStore.find('cpid', value);
							if (index > -1) {
								return partyBStore.getAt(index).get('partyb');
							} else {
								return '';
							}

						},
						type : 'string'
					}, {
						id : "conmoney",
						header : fc['conmoney'].fieldLabel,
						dataIndex : fc['conmoney'].name,
						width : 70,
						align : 'right',
						renderer : cnMoneyToPrec,
						type : 'float'
					}, {
						id : "signdate",
						header : fc['signdate'].fieldLabel,
						dataIndex : fc['signdate'].name,
						width : 60,
						renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext
						// 内置日期renderer
						type : 'date'
					}, {
						id : "billstate",
						header : fc['billstate'].fieldLabel,
						dataIndex : fc['billstate'].name,
						disabled : true,
						width : 60,
						hidden : true,
						renderer : function(value) {
							var index = contractStateStore.find('key', value);
							if (index > -1) {
								return contractStateStore.getAt(index)
										.get('value');
							} else {
								return '';
							}
						}
					}

			]);
			cm.defaultSortable = true; // 设置是否可排序

			// 3. 定义合同实体
			var Contract = [{
						name : 'conid',
						type : 'string'
					}, // Grid显示的列，必须包括主键(可隐藏)
					{
						name : 'pid',
						type : 'string'
					}, {
						name : 'conno',
						type : 'string'
					}, {
						name : 'conname',
						type : 'string'
					}, {
						name : 'partybno',
						type : 'string'
					}, {
						name : 'conmoney',
						type : 'float'
					}, {
						name : 'billstate',
						type : 'string'
					}, {
						name : 'signdate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}];

			// 4. 创建数据源
			var ds = new Ext.data.Store({
						baseParams : {
							ac : 'list', // 表示取列表
							bean : bean, // 实体名
							business : business, // service名
							method : listMethod, // 方法名
							params : null
							// 筛选条件
						},

						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : ServletUrl
								}),

						// 创建reader读取数据
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : 'conid' // 主键
								}, Contract),
						// 设置是否可以服务器端排序
						remoteSort : true
					});
			ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列

			// 创建ComboBox
			var cboConType = new Ext.form.ComboBox({
						store : contractDeptStore,
						displayField : 'value',
						valueField : 'key',
						typeAhead : true,
						mode : 'local',
						triggerAction : 'all',
						emptyText : '选择合同所属部门...',
						width : 135
					});
			cboConType.on('select', function() {

						cboConHandler();
						reload();

					});

			var cboConSubType = new Ext.form.ComboBox({
						store : contractSubStore,
						displayField : 'value',
						valueField : 'key',
						typeAhead : true,
						mode : 'local',
						triggerAction : 'all',
						emptyText : '选择合同分类...',
						width : 165,
						disabled : true,// 初始状态禁用
						autoHeight : true

					});

			cboConSubType.on("select", function() {

						cboSubConHandler();
						reload();

					});

			// combo1改变时触发的事件，级联改变合同分类2
			function cboConHandler() {
				cboConSubType.setDisabled(true);
				cboConSubType.clearValue();
				// 合同分类1的值
				var conDiv = cboConType.getValue();
				// 合同分类1的显示值
				var conDivDesc = cboConType.getRawValue();

				if (conDiv == -1) {
					// 选择全部，清空筛选条件
					ds.baseParams.params = null;
					return;
				} else {
					ds.baseParams.params = propertyName + "='" + conDiv + "'";
				}

				contractSubStore.baseParams = {
					ac : 'listbox',
					category : conDivDesc

				}

				contractSubStore.load({
							callback : function() {
								// 插入‘所有合同’的选项
								var allCon = new SelectItem({
											key : -1,
											value : '所有合同'

										});
								contractSubStore.insert(0, allCon);

								// 启用
								cboConSubType.setDisabled(false);
							}
						});

			}

			// combo2选择时触发的事件,改变数据源ds的筛选条件参数
			function cboSubConHandler() {

				var conDeptType = cboConType.getValue(); // 合同部门分类
				var subType = cboConSubType.getValue(); // 合同类型
				if (subType != '-1') {
					ds.baseParams.params = propertyName + "='" + conDeptType
							+ "' and sort = '" + subType + "'";
				} else {// 选择的“全部”
					ds.baseParams.params = propertyName + "='" + conDeptType
							+ "'";
				}

			}

			var grid = new Ext.grid.QueryExcelGridPanel({
						ds : ds,
						cm : cm,
						sm : sm,
						// TODO tbar
						tbar : [cboConType, '-', cboConSubType],
						title : gridPanelTitle,
						iconCls : 'icon-show-all',
						border : false,
						layout : 'fit',
						region : 'center',
						header : false,
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						viewConfig : {
							forceFit : true,
							ignoreAdd : true
						},
						bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
							pageSize : PAGE_SIZE,
							store : ds,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录"
						}),
						width : 800,
						height : 300
					});

			// 10. 创建viewport，加入面板action和content
			if (Ext.isAir) { // create AIR window
				var win = new Ext.air.MainWindow({
							layout : 'border',
							items : [grid],
							iconCls : 'icon-show-all'
						}).render();
			} else {
				var viewport = new Ext.Viewport({
							layout : 'border',
							items : [grid]
						});

			}

			// grid.getTopToolbar().add(new Ext.Toolbar.TextItem('<font
			// color=#00cc00>合同状态颜色为绿色的为分摊合同</font>'));
			// 11. 事件绑定
//			sm.on('rowselect', function(sm) { // grid 行选择事件
//
//					});
//
//			sm.on('rowdeselect', function() {
//
//					})
			// 12. 加载数据
			reload();
			function reload() {
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			}

		});
