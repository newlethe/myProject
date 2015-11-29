var bean = "com.sgepit.pmis.contract.hbm.ConOveView"
var primaryKey = "conid"
var orderColumn = "conno"
var partBs = new Array();
var contractType = new Array();
var bidtype = new Array();
var BillState = new Array();
Ext.onReady(function() {
	DWREngine.setAsync(false);
	DWREngine.beginBatch();
	conpartybMgm.getPartyB(function(list) { // 获取乙方单位
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].cpid);
					temp.push(list[i].partyb);
					partBs.push(temp);
				}
			});

	appMgm.getCodeValue('合同状态', function(list) { // 获取合同状态
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					BillState.push(temp);
				}
			});

   baseMgm.findAll('com.sgepit.pcmis.bid.hbm.PcBidZbContent',function(list){   
     	//获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].uids);		
			temp.push(list[i].contentes);	
			bidtype.push(temp);			
		}
    }); 
	DWREngine.endBatch();
	DWREngine.setAsync(true);

	var dsPartB = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : partBs
			});
	var dsBillState = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : BillState
			});
	var dsbidtype = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidtype
			});

	// 1. 创建选择模式
	// 2. 创建列模型
	var fm = Ext.form;

	var fc = { // 创建编辑域配置
		'conid' : {
			name : 'conid',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
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
		'signdate' : {
			name : 'signdate',
			fieldLabel : '签订日期',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'conmoney' : {
			name : 'conmoney',
			fieldLabel : '合同签定金额',
			anchor : '95%'
		},
		'convaluemoney' : {
			name : 'convaluemoney',
			fieldLabel : '合同总金额',
			anchor : '95%'
		},
		'partybno' : {
			name : 'partybno',
			fieldLabel : '乙方单位',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsPartB,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '合同状态',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			emptyText : '合同审定',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsBillState,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'isChange' : {
			name : 'isChange',
			fieldLabel : '是否变更',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}
		// zhangh 2010-10-27
		,
		'bidtype' : {
			name : 'bidtype',
			fieldLabel : '招标标号',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsbidtype,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},'performancedate': {
			name : 'performancedate',
			fieldLabel : '履约保函到期日',
			format : 'Y-m-d',
			anchor : '95%'		    
		},'contractors':{
			name : 'contractors',
			fieldLabel : '承办人',
			anchor : '95%'
		},'contractordept':{
		   name : 'contractordept',
		   fieldLabel : '承办部门',
		   anchor :'95%'
		},'conpay':{
		   name : 'conpay',
		   fieldLabel : '已付款金额',
		   anchor : '95'
		},'coninvoicemoney': {
		   name : 'coninvoicemoney',
		   fieldLabel : '发票金额',
		   anchor : '95%'
		},'differencemoney':{
		   name : 'differencemoney',
		   fieldLabel : '合同付款差额',
		   anchor : '95%'
		}
	}

	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	    new Ext.grid.RowNumberer()
        , {
				id : 'conid',
				type : 'string',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				width : 60,
				hidden : true
			}, {
				id : 'pid',
				type : 'string',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				width : 60,
				hidden : true
			}, {
				id : 'conno',
				type : 'string',
				header : fc['conno'].fieldLabel,
				dataIndex : fc['conno'].name,
				align : 'center',
				width : 60,
				renderer : renderConno
			}, {
				id : 'conname',
				type : 'string',
				header : fc['conname'].fieldLabel,
				dataIndex : fc['conname'].name,
				align : 'center',
				width : 180
			}, {
				id : 'partybno',
				type : 'combo',
				header : fc['partybno'].fieldLabel,
				dataIndex : fc['partybno'].name,
				width : 120,
				align : 'center',
				renderer : partbRender,
				store : dsPartB
			}, {
				id : 'conmoney',
				type : 'float',
				header : fc['conmoney'].fieldLabel,
				dataIndex : fc['conmoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			},{
			    id :'contractors',
			    type : 'string',
			    header : fc['contractors'].fieldLabel,
			    dataIndex :fc['contractors'].name,
			    width : 100,
			    align : 'center'
			},{
			    id : 'contractordept',
			    type : 'string',
			    header : fc['contractordept'].fieldLabel,
			    dataIndex : fc['contractordept'].name,
			    width :100,
			    align : 'center'
			},{
			    id : 'conpay',
			    type : 'float',
			    header : fc['conpay'].fieldLabel,
			    dataIndex : fc['conpay'].name,
			    width : 100,
			    align : 'right',
			    renderer : cnMoneyToPrec
			
			},{
			    id : 'coninvoicemoney',
			    type : 'float',
			    header : fc['coninvoicemoney'].fieldLabel,
			    dataIndex : fc['coninvoicemoney'].name,
			    width : 100,
			    align : 'right',
			    renderer :cnMoneyToPrec
			},{
			    id : 'differencemoney',
			    type : 'float',
			    header : fc['differencemoney'].fieldLabel,
			    dataIndex : fc['convaluemoney'].name,
			    width : 100,
			    align : 'right',
			    renderer : function (v,p,r){
			      return  cnMoneyToPrec(r.get('convaluemoney')-r.get('conpay'),p);
			    }
			},{
			   id : 'realdifferencemoney',
			   type : 'float',
			   header : '实际付款差额',
			   dataIndex : 'conpay',
			   align:'right',
			   renderer : function (v,p,r){
			       return cnMoneyToPrec(r.get('conpay')-r.get('coninvoicemoney'),p);
			   }
			}, {
				id : 'convaluemoney',
				type : 'float',
				header : fc['convaluemoney'].fieldLabel,
				dataIndex : fc['convaluemoney'].name,
				width : 100,
				align : 'right',
				renderer : isChange
			}, {
				id : 'signdate',
				type : 'date',
				header : fc['signdate'].fieldLabel,
				dataIndex : fc['signdate'].name,
				align : 'center',
				width : 80,
				renderer : formatDate
			},{
			    id : 'performancedate',
			    type : 'date',
			    header : fc['performancedate'].fieldLabel,
			    dataIndex : fc['performancedate'].name,
			    align : 'center',
			    width : 80,
			    renderer : formatDate
			},{
				id : 'billstate',
				type : 'combo',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				disabled : true,
				align : 'center',
				width : 80,
				renderer : BillStateRender,
				store : dsBillState
			}, {
				id : 'isChange',
				header : fc['isChange'].fieldLabel,
				dataIndex : fc['isChange'].name,
				width : 60,
				align : 'center',
				hidden : true
			}, {
				id : 'bidtype',
				type : 'combo', // 加入此行，查询中会出现“招标批次”
				header : fc['bidtype'].fieldLabel,
				dataIndex : fc['bidtype'].name,
				align : 'center',
				width : 80,
				renderer : bidtypeRender,
				store : dsbidtype
		}

	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'conid',
				type : 'string'
			}, 
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
				name : 'convaluemoney',
				type : 'float'
			}, {
				name : 'billstate',
				type : 'string'
			}, {
				name : 'isChange',
				type : 'string'
			}, {
				name : 'signdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},
			// zhangh 2010-10-27 bidtype
			{
				name : 'bidtype',
				type : 'string'
			},{
			    name : 'performancedate',
			    type : 'date',
			    dateFormat : 'Y-m-d H:i:s'
			},{
			    name : 'contractors',
			    type : 'string'
			},{
			    name : 'contractordept',
			    type : 'string'
			},{
			    name : 'conpay',
			    type : 'float'
			},{
			    name : 'coninvoicemoney',
			    type : 'float'
			}];

	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			beanName : bean,
			primaryKey: 'conid',
			pid : PID,
			uids : UIDS
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
					id : 'cpid'
				}, Columns),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
		});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
    ds.load();
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
				border : false,
				layout : 'fit',
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					ignoreAdd : true,
					getRowClass :function (rec,rowIndex,rowparams,ds){
						var date = new Date();
						var  perdate =  rec.data.performancedate;
						var abs =-1;
						if(perdate!=''){
							abs=parseInt((perdate-date)/1000/60/60/24)
						}
					    if(abs>=0&&abs<=10){
					        return 'x-grid-record-red';
					    }
					    return '';
					}
				},
//				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
//					pageSize : PAGE_SIZE,
//					store : ds,
//					displayInfo : true,
//					displayMsg : ' {0} - {1} / {2}',
//					emptyMsg : "无记录。"
//				}),
				listeners : {
				    "render" : function (){
				    }
				}
			});



	// 10. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid
				]
			});



	// 13. 其他自定义函数，如格式化，校验等
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};

	function renderConno(value, metadata, record) {
		var getConid = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\'' + BASE_PATH
		output += 'PCBusiness/dynamicdata/conove/con_ove.detail.jsp?conid='
				+ getConid + '\'">' + value + '</span>'
		return output;
	}

	// 下拉列表中 k v 的mapping
	// 乙方单位
	function partbRender(value) {
		var str = '';
		for (var i = 0; i < partBs.length; i++) {
			if (partBs[i][0] == value) {
				str = partBs[i][1]
				break;
			}
		}
		return str;
	}
	// 合同状态
	function BillStateRender(value) {
		for (var i = 0; i < dsBillState.getCount(); i++) {
			if (dsBillState.getAt(i).get('k')==value) {
				return dsBillState.getAt(i).get('v')
			}
		}
	}

	// 招标批次
	function bidtypeRender(value) {
		var str = '';
		for (var i = 0; i < bidtype.length; i++) {
			if (bidtype[i][0] == value) {
				str = bidtype[i][1]
				break;
			}
		}
		return str;
	}

	// 如果变更了 就颜色区分
	function isChange(value, cellMeta, record) {
		value = cnMoneyToPrec(value);

		if (record.get('isChange') == "是") {
			value = '<font color=#0000ff>' + value + '</font>';
		}
		return value;
	}

});