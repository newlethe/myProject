var bean = "com.sgepit.pmis.contract.hbm.ConPay"
var primaryKey = "payid"
var orderColumn = "payno"
var billTypes = new Array();
var penaltytypes = new Array();
var changes = new Array();
var payTypes = new Array();
var dspenaltytype = new Array();
var countInfoList = new Array();
Ext.onReady(function() {

	// 2. 创建列模型
	var fm = Ext.form; // 包名简写（缩写）
	DWREngine.setAsync(false);
	DWREngine.beginBatch();
	appMgm.getCodeValue('合同违约类型', function(list) { // 获取违约类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					penaltytypes.push(temp);
				}
			});

	appMgm.getCodeValue('合同变更类型', function(list) { // 获取变更类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					changes.push(temp);
				}
			});

	//高级查询使用
	appMgm.getCodeValue('合同付款类型', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyName);
					temp.push(list[i].propertyName);	//原始数据中付款类型存储的是属性名称（如“余额”），不是属性代码
					payTypes.push(temp);
				}
			});


	appMgm.getCodeValue('单据状态', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					billTypes.push(temp);
				}
			});

	DWREngine.endBatch();
	DWREngine.setAsync(true);

	var payTypeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : payTypes
			});

	// 1结算 0未结算 -1流程中
	var billTypestate = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : billTypes
			});

	var fc = { // 创建编辑域配置
		'payid' : {
			name : 'payid',
			fieldLabel : '付款编号',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			allowBlank : false,
			anchor : '95%'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同名称',
			readOnly : true,
			allowBlank : false,
			anchor : '95%'
		},
		'payno' : {
			name : 'payno',
			fieldLabel : '付款编号',
			anchor : '95%'
		},
		'actman' : {
			name : 'actman',
			fieldLabel : '经办人',
			anchor : '95%'
		},
		'paydate' : {
			name : 'paydate',
			fieldLabel : '付款申请日期',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			allowBlank : false,
			anchor : '95%'
		},
		'paytype' : {
			name : 'paytype',
			fieldLabel : '付款类型',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			editable : false,
			store : payTypeStore,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			allowBlank : false,
			anchor : '95%'
		},
		'payins' : {
			name : 'payins',
			fieldLabel : '付款说明',
			height : 130,
			width : 490,
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '单据状态',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			editable : false,
			store : billTypestate,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'filelsh' : {
			name : 'filelsh',
			fieldLabel : '付款附件编号',
			anchor : '95%'
		},
		'appmoney' : {
			name : 'appmoney',
			fieldLabel : '申请付款',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'passmoney' : {
			name : 'passmoney',
			fieldLabel : '批准付款',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'demoney' : {
			name : 'demoney',
			fieldLabel : '应扣款',
			allowNegative : false,
			// maxValue: 100000000,
			anchor : '95%'
		},
		'paymoney' : {
			name : 'paymoney',
			fieldLabel : '实际付款',
			allowNegative : false,
			maxValue : 100000000,
			allowBlank : false,
			anchor : '95%'
		},
		'invoicemoney' : {
			name : 'invoicemoney',
			fieldLabel : '发票金额',
			allowNegative : false,
			maxValue : 100000000,
			allowBlank : false,
			anchor : '95%'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '付款备注',
			allowBlank : true,
			anchor : '95%'
		},
		'planmoney' : {
			name : 'planmoney',
			fieldLabel : '计划付款',
			allowBlank : false,
			anchor : '95%'
		}
	}

	var cm = new Ext.grid.ColumnModel([ 
	new Ext.grid.RowNumberer(),// 创建列模型
	{
				id : 'payid',
				header : fc['payid'].fieldLabel,
				dataIndex : fc['payid'].name,
				hidden : true,
				width : 200
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true,
				width : 120
			}, {
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				// hidden: true,
				align : 'center',
				width : 120,
				renderer : renderConid
			}, {
				id : 'payno',
				header : fc['payno'].fieldLabel,
				dataIndex : fc['payno'].name,
				width : 120,
				align : 'center',
				renderer : renderPayno
			}, {
				id : 'paydate',
				header : fc['paydate'].fieldLabel,
				dataIndex : fc['paydate'].name,
				width : 90,
				align : 'center',
				renderer : formatDate,
				type : 'date'
			}, {
				header : fc['appmoney'].fieldLabel,
				dataIndex : fc['appmoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				header : fc['passmoney'].fieldLabel,
				dataIndex : fc['passmoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'demoney',
				header : fc['demoney'].fieldLabel,
				dataIndex : fc['demoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'planmoney',
				header : fc['planmoney'].fieldLabel,
				dataIndex : fc['planmoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				header : fc['paymoney'].fieldLabel,
				dataIndex : fc['paymoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				header : fc['invoicemoney'].fieldLabel,
				dataIndex : fc['invoicemoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'paytype',
				header : fc['paytype'].fieldLabel,
				dataIndex : fc['paytype'].name,
				width : 120,
				align : 'center',
				store : fc['paytype'].store,
				type : 'combo'
				// ,
			// renderer: payTypeRender
		}	, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				align :'center',
				width : 100
			}, {
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				align : 'center',
				width : 120,
				renderer : billTypeRender
			}]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'payid',
				type : 'string'
			}, 
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'payno',
				type : 'string'
			}, {
				name : 'paydate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'appmoney',
				type : 'float'
			}, {
				name : 'passmoney',
				type : 'float'
			}, {
				name : 'demoney',
				type : 'float'
			}, {
				name : 'planmoney',
				type : 'float'
			}, {
				name : 'paymoney',
				type : 'float'
			}, {
				name : 'paytype',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'billstate',
				type : 'float'
			}, {
				name : 'actman',
				type : 'string'
			}, {
				name : 'payins',
				type : 'string'
			}, {
				name : 'filelsh',
				type : 'string'
			}, {
				name : 'invoicemoney',
				type : 'float'
			}];
	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			primaryKey:'payid',
			beanName : bean,
			pid : PID,
			uids:UIDS 
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : CONTEXT_PATH + "/servlet/DynamicServlet"
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
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列


	// 5. 创建可编辑的grid: grid-panel
	var grid = new Ext.grid.GridPanel({
				store : ds,
				cm : cm,
				tbar :['->',new Ext.Button({
						  	text: '返回',
						  	iconCls: 'returnTo',
						  	handler: function(){
								history.back();
						  	}
					})],
				listeners : {
				},
				// split: true,
				iconCls : 'icon-show-all',
				border : false,
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				width : 800,
				height : 450
			});
			
	var viewport = new Ext.Viewport({
				layout : 'border',
				border : false,
				items : [grid],
				listeners : {
				}
			});



	ds.load();

	// 13. 其他自定义函数，如格式化，校验等
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};

	function renderConid(value, metadata, record) {
		var getConid = record.get('conid');
		var conObj;
		DWREngine.setAsync(false);
		baseDao.findByWhere2('com.sgepit.pmis.contract.hbm.ConOve',"pid='"+PID+"' and conid='"+getConid+"'",function(list){
		    conObj=list[0];
		});
		DWREngine.setAsync(true);
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\'' + BASE_PATH
		output += 'PCBusiness/dynamicdata/conove/con_ove.detail.jsp?conid='
				+ getConid + '\'">'+conObj.conname+'</span>'
		return output;
	}

	function renderPayno(value, metadata, record) {
		var getPayid = record.get('payid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\'' + BASE_PATH
		output += 'PCBusiness/dynamicdata/conove/conpay_detail.jsp?payid='+ getPayid+'&conid='+record.get('conid');
		output += '\'">' + value + '</span>'
		return output;
	}

	// 下拉列表中 k v 的mapping
	function payTypeRender(value) { // 付款类型
		var str = '';
		for (var i = 0; i < payTypes.length; i++) {
			if (payTypes[i][0] == value) {
				str = payTypes[i][1]
				break;
			}
		}
		return str;
	}
	function billTypeRender(value) { // 单据状态类型
		var str = '';
		for (var i = 0; i < billTypes.length; i++) {
			if (billTypes[i][0] == value) {
				str = billTypes[i][1]
				break;
			}
		}
		return str;
	}
});
