var bean = "com.sgepit.pmis.routine.hbm.GzMonthReport";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'uuid';
var orderColumn = 'reportmonth';

var PAGE_SIZE = 10
var PAGE_SIZE_CONT = 20

var beanCont = "com.sgepit.pmis.routine.hbm.GzMonthReportList"
var primaryKeyCont = 'uuid';
var orderColumnCont = 'reportuuid';

var selectContUuid;

var dsCont

var planstate = new Array();
planstate = [['0', '未汇总'], ['1', '已汇总']];
var completestate = new Array();
completestate = [['0', '未完成'], ['1', '已完成']];
var billstate = new Array();
billstate = [['0', '上报完成'], ['-1', '汇总中'], ['1', '汇总完成']];
var bill = "0";
var recordstate = new Array();
recordstate = [['0', '部门上报'], ['1', '公司汇总']];
var contenttype = new Array();
contenttype = [['0', '本月完成情况'], ['1', '本月存在的问题'], ['2', '需要上级解决的问题'],
		['3', '下月工作计划']];

var monthArray = [['01', '01月'], ['02', '02月'], ['03', '03月'], ['04', '04月'],
		['05', '05月'], ['06', '06月'], ['07', '07月'], ['08', '08月'],
		['09', '09月'], ['10', '10月'], ['11', '11月'], ['12', '12月']];

var gridPanel

var filterStr = " 1=1 and PLANSTATE = '1' AND RECORDSTATE = '1'";

Ext.onReady(function() {

	var user = new Array();
	baseMgm.getData("select userid,realname from rock_user", function(list) {
		// baseMgm.getData("select userid,realname from rock_user where dept_id
		// = '"+USERDEPTID+"'",function(list){
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			user.push(temp);
		}
	});
	DWREngine.setAsync(true);

	var userDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : user
	})

	var hzBtn = new Ext.Button({
		text : '进入汇总',
		tooltip : '进入汇总',
		iconCls : 'btn',
		handler : hzFun
	})

	var queryBtn = new Ext.Button({
		text : '查询',
		iconCls : 'option',
		handler : showWindow
	})

	if (isFlwTask || isFlwView) {
		filterStr += " and flowid='"+bh_flow+"'";
		hzBtn.setVisible(false);
		queryBtn.setVisible(false);
	}
	
	function hzFun() {
		var url = BASE_PATH + "Business/routine/gz.month.report.hz.add.jsp";
		window.location.href = url;
	}

	var planStateDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : planstate
	})
	var completeStateDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : completestate
	})
	var billStateDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : billstate
	})

	// --------------------月报--------------------
	var fm = Ext.form;

	var fc = {
		'uuid' : {
			name : 'uuid',
			fieldLabel : 'UUID',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'flowid' : {
			name : 'flowid',
			fieldLabel : '汇总编号',
			readOnly : true,
			anchor : '95%'
		},
		'reportmonth' : {
			name : 'reportmonth',
			fieldLabel : '汇总周期',
			anchor : '95%'
		},
		'reporttime' : {
			name : 'reporttime',
			fieldLabel : '汇总时间',
			readOnly : true,
			anchor : '95%'
		},
		'reportuser' : {
			name : 'reportuser',
			fieldLabel : '汇总人',
			readOnly : true,
			anchor : '95%'
		},
		'reportdept' : {
			name : 'reportdept',
			fieldLabel : '汇总部门',
			readOnly : true,
			anchor : '95%'
		},
		'planstate' : {
			name : 'planstate',
			fieldLabel : '汇总状态',
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '审批状态',
			anchor : '95%'
		},
		'recordstate' : {
			name : 'recordstate',
			fieldLabel : '记录类型',
			anchor : '95%'
		}
	};

	Columns = [{
		name : 'uuid',
		type : 'string'
	}, {
		name : 'flowid',
		type : 'string'
	}, {
		name : 'reportmonth',
		type : 'string'
	}, {
		name : 'reporttime',
		type : 'date',
		dateFormat : 'Y-m-d H:i:s'
	}, {
		name : 'reportuser',
		type : 'string'
	}, {
		name : 'reportdept',
		type : 'string'
	}, {
		name : 'reportdeptlead',
		type : 'string'
	}, {
		name : 'planstate',
		type : 'string'
	}, {
		name : 'billstate',
		type : 'float'
	}, {
		name : 'completestate',
		type : 'string'
	}, {
		name : 'recordstate',
		type : 'string'
	}];

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.ColumnModel([
			// sm,
			{
				id : 'uuid',
				header : fc['uuid'].fieldLabel,
				dataIndex : fc['uuid'].name,
				hidden : true
			}, {
				id : 'flowid',
				header : fc['flowid'].fieldLabel,
				dataIndex : fc['flowid'].name,
				align : "center",
				width : 80,
				type : 'string'
			}, {
				id : 'reportmonth',
				header : fc['reportmonth'].fieldLabel,
				dataIndex : fc['reportmonth'].name,
				align : "center",
				width : 100,
				renderer : function(value) {
					var str = value.substring(0, 4) + "年";
					for (var i = 0; i < monthArray.length; i++) {
						if (value.substring(4, 6) == monthArray[i][0]) {
							str += monthArray[i][1];
						}
					}
					return str;
				}
			}, {
				id : 'reporttime',
				header : fc['reporttime'].fieldLabel,
				dataIndex : fc['reporttime'].name,
				align : "center",
				width : 120,
				renderer : formatDate,
				type : 'date'
			}, {
				id : 'reportuser',
				header : fc['reportuser'].fieldLabel,
				dataIndex : fc['reportuser'].name,
				align : "center",
				width : 100,
				renderer : function(value) {
					DWREngine.setAsync(false);
					var userName = "";
					// -----------------汇总人
					baseMgm.getData(
							"select userid,realname from rock_user where userid = '"
									+ value + "'", function(list) {
								if (list.length > 0) {
									userName = list[0][1];
								}
							});
					DWREngine.setAsync(true);
					return userName;
				}
			},
			/*
			 * { id:'reportdept', header:fc['reportdept'].fieldLabel,
			 * dataIndex:fc['reportdept'].name, hidden: true, align:"center",
			 * width :100, renderer:function(value){ //reportdept == "00";
			 * return '公司汇总'; } },
			 */
			{
				id : 'planstate',
				header : fc['planstate'].fieldLabel,
				dataIndex : fc['planstate'].name,
				align : "center",
				hidden : true,
				width : 80,
				store : planStateDs,
				renderer : function(value) {
					for (var i = 0; i < planstate.length; i++) {
						if (value == planstate[i][0]) {
							return planstate[i][1]
						}
					}
				}
			}, {
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				align : "center",
				width : 80,
				store : billStateDs,
				renderer : function(value) {
					for (var i = 0; i < billstate.length; i++) {
						if (value == billstate[i][0]) {
							return billstate[i][1]
						}
					}
				}
			}
			/*
			 * , { id:'recordstate', header:fc['recordstate'].fieldLabel,
			 * dataIndex:fc['recordstate'].name, align:"center", hidden:true,
			 * width :80, renderer:function(value){ for(var i = 0;i<recordstate.length;i++){
			 * if(value == recordstate[i][0]){ return recordstate[i][1] } } } }
			 */
	]);

	cm.defaultSortable = true;// 可排序

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : filterStr
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列

	gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		border : false,
		region : 'north',
		height : 286,
		split : true,
		model : 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>部门月工作汇总<B></font>', hzBtn, queryBtn],
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
			emptyMsg : "无记录。"
		})

	});
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});

	// ----------------------------------内容----------------------------------
	var ColumnsCont = [{
		name : 'uuid',
		type : 'string'
	},		// Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'reportuuid',
				type : 'string'
			}, {
				name : 'thismonthitem',
				type : 'string'
			}, {
				name : 'thisuser',
				type : 'string'
			}, {
				name : 'plantime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'lastmonthitem',
				type : 'string'
			}, {
				name : 'lastuser',
				type : 'string'
			}, {
				name : 'complete',
				type : 'string'
			}];

	var smCont = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});

	var cmCont = new Ext.grid.ColumnModel([smCont, {
		id : 'uuid',
		header : 'UUID',
		dataIndex : 'uuid',
		hidden : true
	}, {
		id : 'reportuuid',
		header : '月报UUID',
		dataIndex : 'reportuuid',
		hidden : true
	}, {
		id : 'reportuuid',
		header : '汇总部门',
		dataIndex : 'reportdept',
		align : 'center',
		renderer : function(val, metadata, rec) {
			var reportuuid = rec.get("reportuuid");
			DWREngine.setAsync(false);
			var dept = "";
			var deptId = ""
			baseMgm.getData(
					"select reportdept from gz_month_report where uuid='"
							+ reportuuid + "'", function(list) {
						if (list.length > 0) {
							deptId = list[0];
						}
					});
			// -----------------汇总部门
			baseMgm.getData(
					"select unitid,unitname from sgcc_ini_unit where unitid='"
							+ deptId + "' order by unitid", function(list) {
						if (list.length > 0) {
							dept = list[0][1];
						}
					});
			DWREngine.setAsync(true);
			return dept;
		}
	}, {
		id : 'thismonthitem',
		header : '本月项目',
		dataIndex : 'thismonthitem',
		align : "center"
	}, {
		id : 'thisuser',
		header : '责任人',
		dataIndex : 'thisuser',
		align : "center",
		width : 50,
		renderer : function(value) {
			for (var i = 0; i < user.length; i++) {
				if (value == user[i][0]) {
					return user[i][1];
				}
			}
		}
	}, {
		id : 'plantime',
		header : '计划完成时间',
		dataIndex : 'plantime',
		align : "center",
		renderer : formatDate
	}, {
		id : 'lastmonthitem',
		header : '上月项目',
		dataIndex : 'lastmonthitem',
		align : "center"
	}, {
		id : 'lastuser',
		header : '责任人',
		dataIndex : 'lastuser',
		align : "center",
		width : 50,
		renderer : function(value) {
			for (var i = 0; i < user.length; i++) {
				if (value == user[i][0]) {
					return user[i][1];
				}
			}
		}
	}, {
		id : 'complete',
		header : '完成情况',
		dataIndex : 'complete',
		align : "center"
	}, {
		id : 'con',
		type : 'string',
		header : '操作',
		width : 50,
		dataIndex : 'con',
		align : "center",
		renderer : function(val, metadata, rec) {
			var uuid = rec.get("uuid")
			if(bill==1 || (bill==-1 && isFlwTask!=true)){
				return "";
			}else{
				return "<button onclick=outFun('"+uuid+"') style='height:16px' class='pageBtn'>剔除</button>"
			}
		}
	}]);

	dsCont = new Ext.data.GroupingStore({ // 分组
		baseParams : {
			ac : 'list', // 表示取列表
			bean : beanCont,
			business : business,
			method : listMethod
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyCont
		}, ColumnsCont)
	});
	dsCont.setDefaultSort("reportuuid", 'asc');

	var addBtnCont = new Ext.Button({
		text : '新增',
		tooltip : '新增',
		iconCls : 'add',
		handler : addCont
	})
	var editBtnCont = new Ext.Button({
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : editCont
	})
	var delBtnCont = new Ext.Button({
		text : '删除',
		tooltip : '删除',
		iconCls : 'remove',
		handler : delCont
	})

	function addCont() {
		if (selectedData == null) {
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择上面的月报！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else if (selectObj.get('planstate') != '0') {
			Ext.Msg.show({
				title : '提示',
				msg : '已经上报的月报不能新增内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {
			var url = BASE_PATH
					+ "Business/routine/gz.month.report.list.addorupdate.jsp?uuid="
					+ selectedData + "&bh=" + bh_flow + "&month=" + month
					+ flow;
			window.location.href = url;
		}
	}
	function editCont() {
		if (selectContUuid == null || selectContUuid == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择月报内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {
			var url = BASE_PATH
					+ "Business/routine/gz.month.report.list.addorupdate.jsp?uuid="
					+ selectedData + "&contuuid=" + selectContUuid + "&bh="
					+ bh_flow + "&month=" + month + flow;
			window.location.href = url;
		}
	}
	function delCont() {
		if (selectContUuid == null || selectContUuid == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择月报内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {

			Ext.MessageBox.confirm('确认',
					'删除该月报的详细内容，并且操作将不可恢复，请谨慎操作！<br><br>确认要删除吗？', function(btn,
							text) {
						if (btn == "yes") {
							var uuid = selectedData;
							DWREngine.setAsync(false);
							gzJhMgm.deleteMonthReportList(beanCont,
									selectContUuid, function(data) {
										Ext.example.msg('删除成功！',
												'您成功删除了一条月报信息！');
										// dsCont.remove(selectObj);
										// ds.reload();
										selectContUuid = "";
										dsCont.reload();
									});
							DWREngine.setAsync(true);
						}
					}, this);
		}
	}

	var gridPanelCont = new Ext.grid.GridPanel({
		ds : dsCont,
		cm : cmCont,
		sm : smCont,
		border : false,
		region : 'center',
		split : true,
		model : 'mini',
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>部门月报内容<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE_CONT,
			store : dsCont,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	})

	// ----------------------------------关联----------------------------------

	// ----------------------------------关联----------------------------------
	sm.on('rowselect', function(sm, rowIndex, record) {
		cmCont.defaultSortable = true;// 可排序
		selectObj = record;
		var week = record.get('reportmonth');
		bill = record.get('billstate')
		DWREngine.setAsync(false);
		var uuids = new Array();
		// -----------------汇总人
		baseMgm.getData(
				"select uuid from gz_month_report where reportmonth = '" + week
						+ "'", function(list) {
					for (i = 0; i < list.length; i++) {
						uuids.push("'" + list[i] + "'");
					}
				});
		DWREngine.setAsync(true);
		var ids = uuids.join(",");
		dsCont.baseParams.params = " reportuuid in (" + ids
				+ ") and remove='1' ";
		dsCont.load({
			params : {
				start : 0,
				limit : PAGE_SIZE_CONT
			}
		});
		selectedData = record.get('uuid');
	})
	smCont.on('rowselect', function(sm, rowIndex, record) {
		selectContObj = record;
		selectContUuid = record.get('uuid');
	})

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel, gridPanelCont]
			// items:[gridPanel]
	})
	
	if(isFlwView){
		gridPanel.getTopToolbar().disable();
		gridPanelCont.getTopToolbar().disable();
	}

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};
})

// function outFun(id,rec){
function outFun(id) {
	Ext.Msg.show({
		title : '提示！',
		msg : '是否需要剔除此条部门月报内容？',
		buttons : Ext.Msg.YESNO,
		 icon: Ext.Msg.WARNING,
		fn : function(value) {
			if ('yes' == value) {
				DWREngine.setAsync(false);
				baseMgm.getData("update gz_month_report_list set remove='0' where uuid= '"
						+ id + "'", function(list) {
					dsCont.reload();
				});
				DWREngine.setAsync(true);
			}
		}
	});
}