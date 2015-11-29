var bean = "com.sgepit.pmis.routine.hbm.GzWeekReport";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'uuid';
var orderColumn = 'reportweek';

var beanCont = "com.sgepit.pmis.routine.hbm.GzWeekReportList"
var primaryKeyCont = 'uuid';
var orderColumnCont = 'reportuuid';

var PAGE_SIZE = 10;
var PAGE_SIZE_CONT = 20
var maxStockBhPrefix;
var gridPanel, gridPanelCont;
var selectedData, selectObj, selectContUuid, selectContObj;
// var filterStr = " 1=1 and RECORDSTATE='0' and REPORTDEPT='"+USERDEPTID+"'";
var filterStr = " 1=1 and REPORTDEPT='" + USERDEPTID + "'";
var planstate = new Array();
planstate = [['0', '未汇总'], ['1', '已汇总']];
var completestate = new Array();
completestate = [['0', '未完成'], ['1', '已完成']];
var billstate = new Array();
billstate = [['0', '新增'], ['-1', '上报中'], ['1', '上报完成']];
var contenttype = new Array();
contenttype = [['0', '本周完成情况'], ['1', '本周存在的问题'], ['2', '需要上级解决的问题'],
		['3', '下周工作计划']];

var monthArray = [['01', '01月'], ['02', '02月'], ['03', '03月'], ['04', '04月'],
		['05', '05月'], ['06', '06月'], ['07', '07月'], ['08', '08月'],
		['09', '09月'], ['10', '10月'], ['11', '11月'], ['12', '12月']];
var weekArray = [['01', '第1周'], ['02', '第2周'], ['03', '第3周'], ['04', '第4周']];

var reportuser = new Array();
var reportdept = new Array();
var reportdeptlead = new Array();

Ext.onReady(function() {

	var flow = ""
	if (isFlwTask) {
		filterStr += " and flowid='" + bh_flow + "'";
		flow = "&isTask=true";
	}
	if (isFlwView) {
		filterStr += " and flowid='" + bh_flow + "'";
		flow = "&isView=true";
	}
	

	// 新增编号获取
	maxStockBhPrefix = USERNAME + new Date().format('ym');
	DWREngine.setAsync(false);
	stockMgm.getStockPlanNewBh(maxStockBhPrefix, "FLOWID", "GZ_WEEK_REPORT",
			null, function(dat) {
				if (dat != "") {
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,
							4))
							* 1
				}
			});

	DWREngine.setAsync(true);

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

	// --------------------周报--------------------
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
			fieldLabel : '编号',
			readOnly : true,
			anchor : '95%'
		},
		'reportweek' : {
			name : 'reportweek',
			fieldLabel : '汇报周期',
			anchor : '95%'
		},
		'reporttime' : {
			name : 'reporttime',
			fieldLabel : '汇报时间',
			readOnly : true,
			anchor : '95%'
		},
		'reportuser' : {
			name : 'reportuser',
			fieldLabel : '汇报人',
			readOnly : true,
			anchor : '95%'
		},
		'reportdept' : {
			name : 'reportdept',
			fieldLabel : '汇报部门',
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
		}
	};

	Columns = [{
		name : 'uuid',
		type : 'string'
	}, {
		name : 'flowid',
		type : 'string'
	}, {
		name : 'reportweek',
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
	}];

	var Plant = Ext.data.Record.create(Columns);
	PlantInt = {
		uuid : '',
		flowid : '',
		reportweek : '',
		reporttime : '',
		reportuser : '',
		reportdept : '',
		reportdeptlead : '',
		planstate : '',
		billstate : '',
		completestate : ''
	};

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var cm = new Ext.grid.ColumnModel([sm, {
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		renderer : function(value, cellmeta, record, rowIndex, columnIndex,
				store) {
			if (backUuid == value) {
				sm.selectRow(rowIndex);
			}
			return value;
		},
		hidden : true
	}, {
		id : 'flowid',
		header : fc['flowid'].fieldLabel,
		dataIndex : fc['flowid'].name,
		align : "center",
		width : 80,
		type : 'string'
	}, {
		id : 'reportweek',
		header : fc['reportweek'].fieldLabel,
		dataIndex : fc['reportweek'].name,
		align : "center",
		width : 100,
		renderer : function(value) {
			var str = value.substring(0, 4) + "年";
			for (var i = 0; i < monthArray.length; i++) {
				if (value.substring(4, 6) == monthArray[i][0]) {
					str += monthArray[i][1];
				}
			}
			for (var i = 0; i < weekArray.length; i++) {
				if (value.substring(6, 8) == weekArray[i][0]) {
					str += weekArray[i][1];
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
			var user = "";
			// -----------------汇报人
			baseMgm.getData(
					"select userid,realname from rock_user where userid = '"
							+ value + "'", function(list) {
						if (list.length > 0) {
							user = list[0][1];
						}
					});
			DWREngine.setAsync(true);
			return user;
		}
	}, {
		id : 'reportdept',
		header : fc['reportdept'].fieldLabel,
		dataIndex : fc['reportdept'].name,
		align : "center",
		width : 100,
		renderer : function(value) {
			DWREngine.setAsync(false);
			var dept = "";
			// -----------------汇报部门
			baseMgm.getData(
					"select unitid,unitname from sgcc_ini_unit where unitid='"
							+ value + "' order by unitid", function(list) {
						if (list.length > 0) {
							dept = list[0][1];
						}
					});
			DWREngine.setAsync(true);
			return dept;
		}
	}, {
		id : 'planstate',
		header : fc['planstate'].fieldLabel,
		dataIndex : fc['planstate'].name,
		align : "center",
		width : 80,
		store : planStateDs,
		renderer : function(value) {
			for (var i = 0; i < planstate.length; i++) {
				if (value == planstate[i][0]) {
					return planstate[i][1]
				}
			}
		},
		type : 'combo'
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
		},
		type : 'combo'
	}]);

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

	var addBtn = new Ext.Button({
		text : '新增',
		tooltip : '新增',
		iconCls : 'add',
		handler : addFun
	})
	var editBtn = new Ext.Button({
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : editFun
	})
	var delBtn = new Ext.Button({
		text : '删除',
		tooltip : '删除',
		iconCls : 'remove',
		handler : delFun
	})
	/*
	 * var sbBtn = new Ext.Button({ text:'上报', iconCls:'btn', handler:sbFun })
	 */
	var queryBtn = new Ext.Button({
		text : '查询',
		iconCls : 'option',
		handler : showWindow
	})

	function addFun() {
		if (!isFlwTask) {
			bh_flow = maxStockBh;
		}
		var url = BASE_PATH
				+ "Business/routine/gz.week.report.addorupdate.jsp?flowid="
				+ bh_flow;
		window.location.href = url;
	}
	function editFun() {
		if (selectedData == null) {
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择需要修改的周报！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {
			if (selectObj.get('planstate') != '0') {
				Ext.Msg.show({
					title : '提示',
					msg : '已经上报的周报不能修改！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});
				return;
			} else {
				var url = BASE_PATH
						+ "Business/routine/gz.week.report.addorupdate.jsp?uuid="
						+ selectedData + "&flowid=" + bh_flow + flow;
				window.location.href = url;
			}
		}
	}
	function delFun() {
		if (selectedData == null || selectedData == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择需要删除的周报！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {
			if (selectObj.get('planstate') == '1') {
				Ext.Msg.show({
					title : '提示',
					msg : '已经汇总的周报不能删除！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});
				return;
			} else {
				Ext.MessageBox.confirm('确认',
						'删除该周报将同时删除该周报的详细内容，并且操作将不可恢复，请谨慎操作！<br><br>确认要删除吗？',
						function(btn, text) {
							if (btn == "yes") {
								var uuid = selectedData;
								DWREngine.setAsync(false);
								gzJhMgm.deleteWeekReport(bean, beanCont, uuid,
										function(data) {
											Ext.example.msg('删除成功！',
													'您成功删除了一条周报信息！');
											selectedData = "";
											cmCont.defaultSortable = false;// 可排序
											ds.remove(selectObj);
											ds.reload();
											dsCont.reload();
										});
								DWREngine.setAsync(true);
							}
						}, this);
			}
		}
	}

	/*
	 * function sbFun(){ //alert(selectedData) DWREngine.setAsync(false);
	 * baseMgm.getData("update gz_week_report set planstate='1' where uuid =
	 * '"+selectedData+"'",function(list){ Ext.Msg.show({ title : '提示', msg :
	 * '上报成功！', buttons : Ext.Msg.OK, icon : Ext.MessageBox.INFO });
	 * ds.reload(); }); DWREngine.setAsync(true); }
	 */
	var h = 286
	if(isFlwTask || isFlwView) h = 140
	gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'north',
		split : true,
		height : h,
		model : 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>部门周工作上报<B></font>', '-', addBtn,
				editBtn, delBtn, queryBtn],
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
	
	//gridPanel.getTopToolbar().disable();
	
	if (isFlwTask) {
		addBtn.disable();
		delBtn.disable();
		queryBtn.disable();
	} else {
		addBtn.enable();
		delBtn.enable();
		queryBtn.enable();
	}
	

	// ----------------------------------内容----------------------------------
	var ColumnsCont = [{
		name : 'uuid',
		type : 'string'
	},		// Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'reportuuid',
				type : 'string'
			}, {
				name : 'contenttype',
				type : 'string'
			}, {
				name : 'reportcontent',
				type : 'string'
			}];

	var smCont = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});

	var cmCont = new Ext.grid.ColumnModel([smCont, {
		id : 'uuid',
		header : 'UUID',
		width : 0,
		dataIndex : 'uuid',
		hidden : true
	}, {
		id : 'reportuuid',
		header : '周报UUID',
		width : 0,
		dataIndex : 'reportuuid',
		hidden : true
	}, {
		id : 'contenttype',
		type : 'string',
		header : '内容类别',
		width : 0,
		dataIndex : 'contenttype',
		hidden : true,
		renderer : function(value) {
			for (var i = 0; i < contenttype.length; i++) {
				if (value == contenttype[i][0]) {
					return contenttype[i][1]
				}
			}
		}
	}, {
		id : 'reportcontent',
		type : 'string',
		header : '工作详情',
		width : 400,
		dataIndex : 'reportcontent'
	}]);

	// cmCont.defaultSortable = true;//可排序

	var dsCont = new Ext.data.GroupingStore({ // 分组
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
		}, ColumnsCont),

		// 设置是否可以服务器端排序
		remoteSort : true,
		remoteGroup : true,
		pruneModifiedRecords : true,
		sortInfo : {
			field : 'contenttype',
			direction : "ASC"
		}, // 分组
		groupField : 'contenttype' // 分组
	});
	// dsCont.setDefaultSort(orderColumnCont, 'asc'); //设置默认排序列

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
				msg : '请先选择上面的周报！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else if (selectObj.get('planstate') != '0') {
			Ext.Msg.show({
				title : '提示',
				msg : '已经上报的周报不能新增内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {
			var url = BASE_PATH
					+ "Business/routine/gz.week.report.list.addorupdate.jsp?uuid="
					+ selectedData + "&flowid=" + bh_flow + flow;
			window.location.href = url;
		}
	}
	function editCont() {
		if (selectContUuid == null || selectContUuid == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择周报内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {
			var url = BASE_PATH
					+ "Business/routine/gz.week.report.list.addorupdate.jsp?uuid="
					+ selectedData + "&contuuid=" + selectContUuid + "&flowid="
					+ bh_flow + flow;
			window.location.href = url;
		}
	}
	function delCont() {
		if (selectContUuid == null || selectContUuid == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择周报内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {

			Ext.MessageBox.confirm('确认',
					'删除该周报的详细内容，并且操作将不可恢复，请谨慎操作！<br><br>确认要删除吗？', function(btn,
							text) {
						if (btn == "yes") {
							var uuid = selectedData;
							DWREngine.setAsync(false);
							gzJhMgm.deleteWeekReportList(beanCont,
									selectContUuid, function(data) {
										Ext.example.msg('删除成功！',
												'您成功删除了一条周报信息！');
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

	gridPanelCont = new Ext.grid.GridPanel({
		ds : dsCont,
		cm : cmCont,
		sm : smCont,
		border : false,
		region : 'center',

		split : true,
		model : 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>部门周报内容<B></font>', '-', addBtnCont,
				editBtnCont, delBtnCont],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE_CONT,
			store : dsCont,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		view : new Ext.grid.GroupingView({ // 分组
			forceFit : true,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		})
	})

	// ----------------------------------关联----------------------------------
	sm.on('rowselect', function(sm, rowIndex, record) {
		cmCont.defaultSortable = true;// 可排序
		selectObj = record;
		var uuid = record.get('uuid');
		
		var bill = record.get('billstate');
   		if(isFlwTask){
  			editBtn.enable();
  			queryBtn.disable();
			if(bill=='-1' || bill=="0"){
				addBtn.disable();
				delBtn.disable();
			}
   		}else if(isFlwView){
   			gridPanel.getTopToolbar().disable();
			gridPanelCont.getTopToolbar().disable();
   		}else{
  			addBtn.enable();
			if(bill=='-1' || bill=="1"){
				editBtn.disable();
				delBtn.disable();
				gridPanelCont.getTopToolbar().disable();
			}else{
				editBtn.enable();
				delBtn.enable();
				gridPanelCont.getTopToolbar().enable();
			}
   		}
		
		/*
		if (record.get('billstate') != '0' || record.get('planstate') == '1') {
			if(isFlwView){
				gridPanel.getTopToolbar().disable();
				gridPanelCont.getTopToolbar().disable();
			}else if(isFlwTask){
				addBtn.disable();
				delBtn.disable();
				if(record.get('billstate')!='-1')gridPanelCont.getTopToolbar().disable();
			}else{
				editBtn.disable();
				delBtn.disable();
				gridPanelCont.getTopToolbar().disable();
			}
		} else {
			if(isFlwView){
				gridPanel.getTopToolbar().disable();
				gridPanelCont.getTopToolbar().disable();
			}else if(isFlwTask){
				addBtn.disable();
				delBtn.disable();
				//gridPanelCont.getTopToolbar().disable();
			}else{
				editBtn.enable();
				delBtn.enable();
				gridPanelCont.getTopToolbar().enable();
			}
		}
		*/
		
		dsCont.baseParams.params = " reportuuid='" + uuid + "'";
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
