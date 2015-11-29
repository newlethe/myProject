var viewWindow;
var viewCase = "";
Ext.onReady(function() {
			Ext.QuickTips.init();
			var fm = Ext.form;

			// 创建编辑域配置
			var fc = {
				'connno' : {
					name : 'connno',
					fieldLabel : '合同编号',
					anchor : '95%'
				},
				'conname' : {
					name : 'conname',
					fieldLabel : '合同名称',
					anchor : '95%'
				},
				'bdgno' : {
					name : 'bdgno',
					fieldLabel : '概算编号',
					anchor : '95%'
				},
				'bdgname' : {
					name : 'bdgname',
					fieldLabel : '概算名称',
					anchor : '95%'
				},
				'bdgmoney' : {
					name : 'bdgmoney',
					fieldLabel : '概算金额',
					anchor : '95%'
				}
				,
				'conappmoney' : {
					name : 'conappmoney',
					fieldLabel : '合同分摊总金额',
					anchor : '95%'
				}
				,
				'initappmoney' : {
					name : 'initappmoney',
					fieldLabel : '签订分摊金额',
					anchor : '95%'
				},
				'changeappmoney' : {
					name : 'changeappmoney',
					fieldLabel : '变更分摊金额',
					anchor : '95%'
				},
				'claappmoney' : {
					name : 'claappmoney',
					fieldLabel : '索赔分摊金额',
					anchor : '95%'
				},
				'breachappmoney' : {
					name : 'breachappmoney',
					fieldLabel : '违约分摊金额',
					anchor : '95%'
				},
				'convaluemoney' : {
					name : 'convaluemoney',
					fieldLabel : '合同总金额',
					anchor : '95%'
				}
				,'conbidbdgmoney':{name : 'conbidbdgmoney',fieldLabel : '招标合同分摊金额'}
			}

			// 定义记录集
			var Columns = [{
						name : 'connno',
						type : 'string'
					}, {
						name : 'conname',
						type : 'string'
					}, {
						name : 'bdgno',
						type : 'string'
					}, {
						name : 'bdgname',
						type : 'string'
					}, {
						name : 'bdgmoney',
						type : 'string'
					}
					, {
						name : 'conappmoney',
						type : 'string'
					}
					, {
						name : 'initappmoney',
						type : 'string'
					}, {
						name : 'changeappmoney',
						type : 'string'
					}, {
						name : 'claappmoney',
						type : 'string'
					}, {
						name : 'breachappmoney',
						type : 'string'
					}, {
						name : 'convaluemoney',
						type : 'string'
					}
					,{name : 'conbidbdgmoney', type : 'float'}
					];

			// 创建列模型
			var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
						id : 'connno',
						header : fc['connno'].fieldLabel,
						dataIndex : fc['connno'].name,
						width : 180
					}, {
						id : 'conname',
						header : fc['conname'].fieldLabel,
						dataIndex : fc['conname'].name,
						width : 300,
						renderer : function(data, metadata, record, rowIndex,
								columnIndex, store) {
							var qtip = "qtip=" + data;
							return '<span ' + qtip + '>' + data + '</span>';

						}

					}, {
						header : fc['bdgno'].fieldLabel,
						dataIndex : fc['bdgno'].name,
						align : 'center',
						hidden : true,
						width : 100
					}, {
						id : 'bdgname',
						header : fc['bdgname'].fieldLabel,
						dataIndex : fc['bdgname'].name,
						align : 'center',
						hidden : true,
						width : 100
					}, {
						header : fc['bdgmoney'].fieldLabel,
						dataIndex : fc['bdgmoney'].name,
						align : 'right',
						renderer : function(value) {
							if (value < 0) {
								return '<div align=right style="color:red">￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else if (value != 0) {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							}
						},
						width : 100
					}, {
						header : fc['convaluemoney'].fieldLabel,
						dataIndex : fc['convaluemoney'].name,
						align : 'right',
						renderer : function(value) {
							if (value < 0) {
								return '<div align=right style="color:red">￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else if (value != 0) {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							}
						},
						width : 100
					}, {
						header : fc['conappmoney'].fieldLabel,
						dataIndex : fc['conappmoney'].name,
						align : 'right',
						renderer : function(value) {
							if (value < 0) {
								return '<div align=right style="color:red">￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else if (value != 0) {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							}
						},
						width : 100
					}
					//BUG8335新增字段 zhangh 2015-11-18
					//招标合同分摊金额
					,{
						header : fc['conbidbdgmoney'].fieldLabel,
						dataIndex : fc['conbidbdgmoney'].name,
						align : 'right',
						renderer : function(value) {
							return '￥'+cnMoneyToPrec(value);
						},
						width : 100
					}
					
					, {
						header : fc['initappmoney'].fieldLabel,
						dataIndex : fc['initappmoney'].name,
						align : 'right',
						hidden : true,
						renderer : function(value) {
							if (value < 0) {
								return '<div align=right style="color:red">￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else if (value != 0) {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							}
						},
						width : 100
					}, {
						header : fc['changeappmoney'].fieldLabel,
						dataIndex : fc['changeappmoney'].name,
						align : 'right',
						hidden : true,
						renderer : function(value) {
							if (value < 0) {
								return '<div align=right style="color:red">￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else if (value != 0) {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							}
						},
						width : 100
					}, {
						header : fc['claappmoney'].fieldLabel,
						dataIndex : fc['claappmoney'].name,
						align : 'right',
						hidden : true,
						renderer : function(value) {
							if (value < 0) {
								return '<div align=right style="color:red">￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else if (value != 0) {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							}
						},
						width : 100
					}, {
						header : fc['breachappmoney'].fieldLabel,
						dataIndex : fc['breachappmoney'].name,
						align : 'right',
						hidden : true,
						renderer : function(value) {
							if (value < 0) {
								return '<div align=right style="color:red">￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else if (value != 0) {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							} else {
								return '<div align=right>￥'
										+ cnMoneyToPrec(value) + '</div>';
							}
						},
						width : 100
					}
					]);

			// 4. 创建数据源
			var ds = new Ext.data.SimpleStore({
				fields : Columns
					// data: datas
				});

			var grid = new Ext.grid.GridPanel({
						title : "该概算分摊情况查看",
						store : ds,
						cm : cm,
						header : false,
						viewConfig : {
							forceFit : true
						},
						width : 1200,
						height : 500,
						// iconCls: 'icon-show-all',
						border : false,
						region : 'center'
					});

			var datas = new Array();
			DWREngine.setAsync(false);
			bdgInfoMgm.queryBdgid(queryBdgid, function(list) {
						for (var i = 0; i < list.length; i++) {
							if (list[i].CONNAME == null) {
							} else {
								var obj = new Array();
								obj.push((list[i].CONNO));
								obj.push((list[i].CONNAME));
								obj.push((list[i].BDGNO));
								obj.push((list[i].BDGNAME));
								obj.push((list[i].BDGMONEY));
								obj.push((list[i].CONAPPMONEY));
								obj.push((list[i].INITAPPMONEY));
								obj.push((list[i].CHANGEAPPMONEY));
								obj.push((list[i].CLAAPPMONEY));
								obj.push((list[i].BREACHAPPMONEY));
//								obj.push((list[i].FACTAPPMONEY));
								obj.push(list[i].CONVALUEMONEY);
								obj.push(list[i].CONBIDBDGMONEY);
								datas.push(obj);
							}
						}
					});
			DWREngine.setAsync(true);
			ds.loadData(datas)
			var view = new Ext.Viewport({
						layout : 'fit',
						items : [grid]
					});
		})
