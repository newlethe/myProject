var bean = "com.sgepit.pmis.vehicle.hbm.VehicleUseManagement"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'usetime'
var businessType = "VehicleManagement";
var baseWheres="pid='"+CURRENTAPPID+"'";
var gridTitle=''
var gridPanel;
var PlantInt;
var licensenumberArr=new Array();
var driverArr=new Array();
var billStateArr=new Array();
billStateArr=[['0', '新增'], ['1', '处理中'], ['2', '确认'], ['3', '下达'], ['4', '完成'], ['5', '退回']]
Ext.onReady(function() {
	// -----------------部门
	var unitArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where UPUNIT = '"
					+ CURRENTAPPID + "' order by unitid", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					unitArr.push(temp);
				}
			});
	// -----------------车牌
	appMgm.getCodeValue("车牌",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			licensenumberArr.push(temp);			
		}
	});
	// -----------------司机
	appMgm.getCodeValue("司机",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			driverArr.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	var licensenumberDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : licensenumberArr
	})
	var driverDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : driverArr
	})
	var billStateDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : billStateArr
	})
	var unitDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : unitArr
	})
	var allMileage = new Ext.Button({
				id:"allMileage"
			})
	// -----------------申请人
	var userArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user where unitid = '"
					+ CURRENTAPPID + "' order by userid", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArr.push(temp);
				}
			});
	DWREngine.setAsync(true);
	if(useAction=="apply"){
		baseWheres+="and applydep = '" + USERDEPTID + "'";
		gridTitle+="车辆使用申请"
	}else if(useAction=="confirm"){
		baseWheres+="and applydep = '" + USERDEPTID + "' and state in(1,2)";
		gridTitle+="车辆使用确认"
	}else if(useAction=="approval"){
		baseWheres+="and state in(2,3)";
		gridTitle+="车辆使用批准安排"
	}else if(useAction=="complete"){
//		baseWheres+="and driver = '" + USERNAME + "' and state in(3,4)";
		baseWheres+="and driver = '" + REALNAME + "' and state in(3,4)";
		gridTitle+="车辆使用详细情况"
	}else if(useAction=="query"){
		gridTitle+="车辆使用查询统计"
	}
	// ----------------------车辆使用信息----------------------------//
	var fm = Ext.form;
	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			anchor : '95%'
		},
		'applyno' : {
			name : 'applyno',
			fieldLabel : '申请编号',
			anchor : '95%'
		},
		'applyperson' : {
			name : 'applyperson',
			fieldLabel : '申请人',
			anchor : '95%'
		},
		'applydep' : {
			name : 'applydep',
			fieldLabel : '申请部门',
			anchor : '95%'
		},
		'applyreason' : {
			name : 'applyreason',
			fieldLabel : '申请原因',
			allowBlank : false,
			anchor : '95%'
		},
		'usetime' : {
			name : 'usetime',
			fieldLabel : '使用时间',
			anchor : '95%',
			allowBlank : false,
			format : 'Y-m-d H:i',
			menu : new DatetimeMenu()
		},
		'depatureplace' : {
			name : 'depatureplace',
			fieldLabel : '出发地点',
			allowBlank : false,
			anchor : '95%'
		},
		'stopplace' : {
			name : 'stopplace',
			fieldLabel : '到达地点',
			allowBlank : false,
			anchor : '95%'
		},
		'isround' : {
			name : 'isround',
			fieldLabel : '是否往返',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			editable : false,
			store : new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [[1,"是"],[0,"否"]]
			}),
			allowBlank : false,
			anchor : '95%'
		},
		'state' : {
			name : 'state',
			fieldLabel : '状态',
			allowBlank : false,
			anchor : '95%'
		},
		'confirmperson' : {
			name : 'confirmperson',
			fieldLabel : '确认人',
			anchor : '95%'
		},
		'approver' : {
			name : 'approver',
			fieldLabel : '批准人',
			anchor : '95%'
		},
		'licensenumber' : {
			name : 'licensenumber',
			fieldLabel : '车牌',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : licensenumberDs,
			anchor : '95%'
		},
		'driver' : {
			name : 'driver',
			fieldLabel : '司机',
//			displayField : 'v',
//			valueField : 'k',
//			mode : 'local',
//			typeAhead : true,
//			triggerAction : 'all',
//			store : driverDs,
			anchor : '95%'
		},
		'startmileage' : {
			name : 'startmileage',
			fieldLabel : '开始里程',
			allowBlank : false,
			anchor : '95%'
		},
		'endmileage' : {
			name : 'endmileage',
			fieldLabel : '结束里程',
			allowBlank : false,
			anchor : '95%'
		},
		'mileagedifference' : {
			name : 'mileagedifference',
			allowBlank : false,
			fieldLabel : '里程差',
			anchor : '95%'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

	var Columns = [{
				name : 'uids',
				type : 'string'
			},{
				name : 'pid',
				type : 'string'
			}, {
				name : 'applyno',
				type : 'string'
			}, {
				name : 'applyperson',
				type : 'string'
			}, {
				name : 'applydep',
				type : 'string'
			}, {
				name : 'applyreason',
				type : 'string'
			}, {
				name : 'usetime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'depatureplace',
				type : 'string'
			}, {
				name : 'stopplace',
				type : 'string'
			}, {
				name : 'isround',
				type : 'float'
			}, {
				name : 'state',
				type : 'float'
			}]
	var cms=[
			new Ext.grid.RowNumberer({
				header : '序号',
				width : 35
			}),
		 	{
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			},{
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'applyno',
				header : fc['applyno'].fieldLabel,
				dataIndex : fc['applyno'].name,
				align : "center",
				width : 100,
				hidden : true
			}, {
				id : 'applyperson',
				header : fc['applyperson'].fieldLabel,
				dataIndex : fc['applyperson'].name,
				renderer : function(value) {
					if (userArr == "" || userArr == null) {
						return REALNAME;

					} else {
						var flag = false;
						for (var i = 0; i < userArr.length; i++) {
							if (value == userArr[i][0]) {
								flag = true;
								return userArr[i][1];
							}
						}
						if (flag == false) {
							return REALNAME;
						}
					}

				},
				align : "center",
				width : 80
			}, {
				id : 'applydep',
				header : fc['applydep'].fieldLabel,
				dataIndex : fc['applydep'].name,
				store:unitDs,
				renderer : function(value) {
					if (unitArr == null || unitArr == "") {
						return UNITNAME;
					} else {
						for (var i = 0; i < unitArr.length; i++) {
							if (value == unitArr[i][0]) {
								return unitArr[i][1]
							}
						}
					}

				},
				align : "center",
				width : 120,
				type : 'combo'
			}, {
				id : 'applyreason',
				header : fc['applyreason'].fieldLabel,
				dataIndex : fc['applyreason'].name,
				editor : new fm.TextField(fc['applyreason']),
				width : 240,
				renderer :function(value) {
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>';
				}

			}, {
				id : 'usetime',
				header : fc['usetime'].fieldLabel,
				dataIndex : fc['usetime'].name,
				editor : new fm.DateField(fc['usetime']),
				renderer:formatDate,
				align : "center",
				width : 120,
				type : 'date'
			}, {
				id : 'depatureplace',
				header : fc['depatureplace'].fieldLabel,
				dataIndex : fc['depatureplace'].name,
				editor : new fm.TextField(fc['depatureplace']),
				width : 120
			}, {
				id : 'stopplace',
				header : fc['stopplace'].fieldLabel,
				dataIndex : fc['stopplace'].name,
				editor : new fm.TextField(fc['stopplace']),
				width : 120
			}, {
				id : 'isround',
				header : fc['isround'].fieldLabel,
				dataIndex : fc['isround'].name,
				editor : new fm.ComboBox(fc['isround']),
				align : "center",
				renderer : function(value){
					if(value==1){
						return "是";
					}else{
						return "否";
					}
				},
				width : 80
			}, {
				id : 'state',
				header : fc['state'].fieldLabel,
				dataIndex : fc['state'].name,
				align : "center",
				width : 60,
				store:billStateDs,
				renderer : function(value,meta,record) {
					var renderStr="";
					if (value == 0) {
						renderStr="<font color=blue>新增</font>"
					} else if (value == 1) {
						renderStr="<font color=blue>处理中</font>";
					} else if (value == 2) {
						renderStr="<font color=blue>确认</font>"
					}else if (value == 3) {
					    renderStr="<font color=blue>下达</font>"
					}else if (value == 4) {
						renderStr="<font color=blue>完成</font>"
					}else if (value == 5) {
						renderStr="<font color=red>退回</font>"
					}
					return renderStr;
//					return "<a title='点击查看详细信息' " +
//						"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
				},
				type:'combo'
			}];
	PlantInt = {
		uids : '',
		pid : CURRENTAPPID,
		applyno : USERID,
		applyperson : USERID,
		applydep : USERDEPTID,
		applyreason : '',
		usetime : '',
		depatureplace : '',
		stopplace : '',
		isround : 1,
		state : 0
	}
	var _Columns=new Array();
	var _cms=new Array();
	//根据页面传过来的参数useAction，为页面动态添加数据列
	switch(0){
		case 0:
			if(useAction=="apply")break;
		case 1:
			_Columns=[{
				name : 'confirmperson',
				type : 'string'
			}];
			_cms=[{
				id : 'confirmperson',
				header : fc['confirmperson'].fieldLabel,
				dataIndex : fc['confirmperson'].name,
				width : 80,
				align : "center",
				renderer : function(value) {
					var str="";
					for (var i = 0; i < userArr.length; i++) {
						if (value == userArr[i][0]) {
							str = userArr[i][1];
							break;
						}
					}
					return str;
				}
			}];
			Columns=Columns.concat(_Columns);
			cms=cms.concat(_cms);
			PlantInt.confirmperson='';
			if(useAction=="confirm") break;
		case 2:
			_Columns=[{
				name : 'approver',
				type : 'string'
			}, {
				name : 'licensenumber',
				type : 'string'
			}, {
				name : 'driver',
				type : 'string'
			}];
			_cms=[{
				id : 'approver',
				header : fc['approver'].fieldLabel,
				dataIndex : fc['approver'].name,
				width : 80,
				align : "center",
				renderer : function(value) {
					var str="";
					for (var i = 0; i < userArr.length; i++) {
						if (value == userArr[i][0]) {
							str = userArr[i][1];
							break;
						}
					}
					return str;
				}
			}, {
				id : 'licensenumber',
				header : fc['licensenumber'].fieldLabel,
				dataIndex : fc['licensenumber'].name,
				align : "center",
				store : licensenumberDs,
				editor : new fm.ComboBox(fc['licensenumber']),
				renderer : function(value) {
					var str="";
					for (var i = 0; i < licensenumberArr.length; i++) {
						if (value == licensenumberArr[i][0]) {
							str = licensenumberArr[i][1];
							break;
						}
					}
					return str;
				},
				width : 80,
				type : 'combo'
			}, {
				id : 'driver',
				header : fc['driver'].fieldLabel,
				dataIndex : fc['driver'].name,
                editor : new fm.TextField(fc['driver']),
//				editor : new fm.ComboBox(fc['driver']),
//				store : driverDs,
//				renderer : function(value) {
//					var str="";
//					for (var i = 0; i < driverArr.length; i++) {
//						if (value == driverArr[i][0]) {
//							str = driverArr[i][1];
//							break;
//						}
//					}
//					return str;
//				},
				align : "center",
				width : 80,
				type : 'string'
			}];
			Columns=Columns.concat(_Columns);
			cms=cms.concat(_cms);
			PlantInt.approver='';
			PlantInt.licensenumber='';
			PlantInt.driver='';
			if(useAction=="approval") break;
		case 3:
			_Columns=[{
				name : 'startmileage',
				type : 'float'
			}, {
				name : 'endmileage',
				type : 'float'
			}, {
				name : 'mileagedifference',
				type : 'float'
			}];
			_cms=[{
				id : 'startmileage',
				header : fc['startmileage'].fieldLabel,
				dataIndex : fc['startmileage'].name,
				align : "right",
				editor : new fm.NumberField(fc['startmileage']),
				width : 80
			}, {
				id : 'endmileage',
				header : fc['endmileage'].fieldLabel,
				dataIndex : fc['endmileage'].name,
				editor : new fm.NumberField(fc['endmileage']),
				align : "right",
				width : 80
			}, {
				id : 'mileagedifference',
				header : fc['mileagedifference'].fieldLabel,
				dataIndex : fc['mileagedifference'].name,
				align : "right",
				width : 80
			}];
			Columns=Columns.concat(_Columns);
			cms=cms.concat(_cms);
			PlantInt.startmileage=0;
			PlantInt.endmileage=0;
			PlantInt.mileagedifference=0;
			if(useAction=="complete") break;
	}
	_Columns=[{
				name : 'remark',
				type : 'string'
			}];
	_cms=[{
		id : 'remark',
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
		editor : new fm.TextField(fc['remark']),
		width : 100
	}];
	Columns=Columns.concat(_Columns);
	cms=cms.concat(_cms);
	PlantInt.remark='';
	var Plant = Ext.data.Record.create(Columns);

	
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cm = new Ext.grid.ColumnModel(cms);

	cm.defaultSortable = true;// 可排序

	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					params : baseWheres
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
			})
	ds.setDefaultSort(orderColumn, 'desc');
	var applyBtn = new Ext.Button({
				id:'apply',
				text : '提交',
				iconCls : 'btn',
				handler : toHandler
			})
	var confirmBtn = new Ext.Button({
				id:'confirm',
				text : '提交',
				iconCls : 'btn',
				handler : toHandler
			})
	var approvalBtn = new Ext.Button({
				id:'approval',
				text : '下达',
				iconCls : 'btn',
				handler : toHandler
			})
	var completeBtn = new Ext.Button({
				id:'complete',
				text : '完成',
				iconCls : 'btn',
				handler : toHandler
			})
	var tobackBtn = new Ext.Button({
				id:'toback',
				text : '退回',
				iconCls : 'btn',
				handler : toHandler
			})
	var addBtn = new Ext.Button({
				id:'add',
				text : '新增',
				iconCls : 'add',
				handler : toHandler
			})
	var saveBtn = new Ext.Button({
				id:'save',
				text : '保存',
				iconCls : 'save',
				handler : toHandler
			})
	var finishSaveBtn = new Ext.Button({
				id:'finishSave',
				text : '保存',
				iconCls : 'save',
				handler : toHandler
			})
	var delBtn = new Ext.Button({
				id:'del',
				text : '删除',
				iconCls : 'remove',
				handler : toHandler
			})
	var printBtn = new Ext.Button({
				id:'print',
				text : '打印',
				iconCls : 'print',
				handler : printData
			})
	var queryBtn = new Ext.Button({
				id:'query',
				text : '查询',
				iconCls : 'option',
				handler : showWindow
			})
	gridPanel = new Ext.grid.EditorGridTbarPanel({
				id : 'ff-grid-panel',
				ds : ds,
				cm : cm,
				sm : sm,
				border : false,
				region : 'center',
				clicksToEdit : 2,
				header : false,
				addBtn : false, 
				saveBtn : false, 
				delBtn : false, 
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>'+gridTitle+'<B></font>','-'],
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				// expend properties
				plant : Plant,
				plantInt : PlantInt,
				servletUrl : MAIN_SERVLET,
				bean : bean,
				business : business,
				primaryKey : primaryKey
			});
	gridPanel.on('beforeedit',function(e){
		var record = e.record;
		if(useAction=="apply"){
			if(record.get('applyperson') == USERID){
				if(record.get('state')!=0&&record.get('state')!=5) e.cancel=true;
			}else{
				e.cancel=true;
			}
		}else if(useAction=="confirm"){
			e.cancel=true;
		}else if(useAction=="approval"){
			if(record.get('state')==2){
				if(e.field != "licensenumber"&&e.field!='driver') e.cancel=true;
			}else{
				e.cancel=true;
			}
		}else if(useAction=="complete"){
			if(record.get('state')==3){
				if(e.field != "startmileage"&&e.field!='endmileage') e.cancel=true;
			}else{
				e.cancel=true;
			}
		}else if(useAction=="query"){
			e.cancel=true;
		}
    });
    gridPanel.on('aftersave', function() {
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});
	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	ds.on('load', function(s, r, o) {
		if(useAction=="query"){//查询统计页面求完成状态总里程数
			var totalMileage=0;
			s.each(function(rec) {
				if (rec.get("state")==4) {
					totalMileage=totalMileage+rec.get("mileagedifference");
				}
			});
			allMileage.setText("<font color=red size=2>"+totalMileage+"</font>")
		}
	})
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel]
			});
	sm.on('rowselect',function(){
		var record = sm.getSelected();
		if(useAction=="apply"){
			if(record.get('applyperson') == USERID){
				if (record.get('state') == 0||record.get('state') == 5){
					saveBtn.setDisabled(false);
					delBtn.setDisabled(false);
					applyBtn.setDisabled(false);
				}else{
					saveBtn.setDisabled(true);
					delBtn.setDisabled(true);
					applyBtn.setDisabled(true);
				}
			}else{
				saveBtn.setDisabled(true);
				delBtn.setDisabled(true);
				applyBtn.setDisabled(true);
			}
		}else if(useAction=="confirm"){
			if(record.get('state')==2){
				tobackBtn.setDisabled(true);
				confirmBtn.setDisabled(true);
			}else{
				tobackBtn.setDisabled(false);
				confirmBtn.setDisabled(false);
			}
		}else if(useAction=="approval"){
			if(record.get('state')==3){
				tobackBtn.setDisabled(true);
				saveBtn.setDisabled(true);
				approvalBtn.setDisabled(true);
			}else{
				tobackBtn.setDisabled(false);
				saveBtn.setDisabled(false);
				approvalBtn.setDisabled(false);
			}
		}else if(useAction=="complete"){
			if(record.get('state')==4){
				finishSaveBtn.setDisabled(true);
				completeBtn.setDisabled(true);
			}else{
				finishSaveBtn.setDisabled(false);
				completeBtn.setDisabled(false);
			}
		}
	});
	if(useAction=="apply"){
		gridPanel.getTopToolbar().add(addBtn,'-',saveBtn,'-',delBtn,'-',applyBtn)
	}else if(useAction=="confirm"){
		gridPanel.getTopToolbar().add(tobackBtn,'-',confirmBtn)
	}else if(useAction=="approval"){
		gridPanel.getTopToolbar().add(tobackBtn,'-',saveBtn,'-',approvalBtn)
	}else if(useAction=="complete"){
		gridPanel.getTopToolbar().add(finishSaveBtn,'-',printBtn,'-',completeBtn)
	}else if(useAction=="query"){
		gridPanel.getTopToolbar().add(queryBtn,'-','总里程数：',allMileage,'->','计量单位:公里','-')
	}
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d H:i') : '';
	};
	function toHandler(node){
		var state=node.id;
		if(state=="add"){
			addFun()
		}else if(state=="save"){
			gridPanel.defaultSaveHandler()
		}else if(state=="del"){
			toDelHandler();
		}else if(state=="apply"){
			applyFun();
		}else if(state=="confirm"){
			confirmFun();
		}else if(state=="approval"){
			approvalFun();
		}else if(state=="complete"){
			completeFun()
		}else if(state=="toback"){
			tobackFun()
		}else if(state=="finishSave"){
			finishSaveFun()
		}
	};
	//新增申请时，根据数据库中申请编号求最新编号.
	function addFun(){
		var maxStockBhPrefix = USERNAME + new Date().format('ym');
		DWREngine.setAsync(false);
		vehicleMgm.getVehicleApplyNewBh(maxStockBhPrefix, "applyno", "vehicle_use_management",
				null, function(dat) {
					if (dat != "") {
						maxStockBh = dat;
						incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,
								4))
								* 1
						PlantInt.applyno=maxStockBh;
					}
				});
		DWREngine.setAsync(true);
		gridPanel.defaultInsertHandler()
	}
	//提交操作
	function applyFun() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record&&record!=null){
			Ext.MessageBox.confirm('确认',
						'是否现在提交车辆使用申请?',
						function(btn, text) {
							if (btn == "yes") {
								record.set('state',1);
								gridPanel.defaultSaveHandler();
								saveBtn.setDisabled(true);
								delBtn.setDisabled(true);
								applyBtn.setDisabled(true);
//								insertPcBuniessBack(record.get('uids'),"提交车辆申请");
							}
						});
		}else{
			Ext.example.msg('提示！', '请先选取一条数据！');
		}
	};
	//确认操作
	function confirmFun() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record&&record!=null){
			Ext.MessageBox.confirm('确认',
						'是否现确认车辆使用申请?',
						function(btn, text) {
							if (btn == "yes") {
								record.set('state',2);
								record.set('confirmperson',USERID);
								gridPanel.defaultSaveHandler();
								tobackBtn.setDisabled(true);
								confirmBtn.setDisabled(true);
//								insertPcBuniessBack(record.get('uids'),"确认车辆申请");
							}
						});
		}else{
			Ext.example.msg('提示！', '请先选取一条数据！');
		}
	};
	//批准操作
	function approvalFun() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record&&record!=null){
			if(record.get('licensenumber')!=""&&record.get('licensenumber')!=null&&record.get('driver')!=""&&record.get('driver')!=null){
				Ext.MessageBox.confirm('确认',
						'是否批准车辆使用申请?',
						function(btn, text) {
							if (btn == "yes") {
								record.set('state',3);
								record.set('approver',USERID);
								gridPanel.defaultSaveHandler();
								tobackBtn.setDisabled(true);
								saveBtn.setDisabled(true);
								approvalBtn.setDisabled(true);
//								insertPcBuniessBack(record.get('uids'),"批准车辆申请");
							}
						}, this);
			}else{
				Ext.example.msg('提示！', '请先将数据填写完整再下达！');
			}
		}else{
			Ext.example.msg('提示！', '请先选取一条数据！');
		}
	};
	//完成操作
	function completeFun() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record&&record!=null){
			Ext.MessageBox.confirm('确认',
						'是否完成车辆使用申请?',
						function(btn, text) {
							if (btn == "yes") {
								record.set('state',4);
								finishSaveFun();
								finishSaveBtn.setDisabled(true);
								completeBtn.setDisabled(true);
//								insertPcBuniessBack(record.get('uids'),"完成车辆申请");
							}
						}, this);
		}else{
			Ext.example.msg('提示！', '请先选取一条数据！');
		}
	};
	//退回操作
	function tobackFun() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record&&record!=null){
			Ext.MessageBox.confirm('确认',
						'是否退回车辆使用申请?',
						function(btn, text) {
							if (btn == "yes") {
								record.set('state',5);
								gridPanel.defaultSaveHandler();
//								insertPcBuniessBack(record.get('uids'),"完成车辆申请");
							}
						}, this);
//				var winPanel = new BackWindow({
//					doBack:function(reason){
//							var mask = new Ext.LoadMask(Ext.getBody(), {msg : "退回中，请稍等..."});
//							mask.show();
//							insertPcBuniessBack(record.get('uids'),"退回车辆申请",reason)
//							mask.hide();
//							win.close();
//							record.set('state',5);
//							gridPanel.defaultSaveHandler();
//							
//							ds.load({
//								params : {
//									start : 0,
//									limit : PAGE_SIZE
//								}
//							});
//					}
//				});
//				var win=new Ext.Window({
//					id:'backWin',
//					width: 700, minWidth: 460, height: 400,
//					layout: 'border', closeAction: 'close',
//					border: false, constrain: true, maximizable: true, modal: true,
//					items: [winPanel,{
//						region : 'south',
//						height:240,
//						title:'交互记录',
//						xtype : 'panel',
//	//					autoScroll:true,
//						html : '<iframe name="bidDetailFrame" src="'+CONTEXT_PATH+ 
//						'/Business/vehicle/pc.businessBack.log.jsp?edit_pid='+CURRENTAPPID+'&edit_uids='+record.get('uids')
//						+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
//					}]
//				});
//				win.show();
		}else{
			Ext.example.msg('提示！', '请先选取一条数据！');
		}
	};
	//车辆使用详细情况页面的保存功能
	function finishSaveFun() {
		var record = gridPanel.getSelectionModel().getSelected();
		var startM=record.get('startmileage');
		var endM=record.get('endmileage');
		var mDifference=endM-startM;
		if(mDifference<0){
			Ext.Msg.show({
				title: '提示',
	            msg: '里程差不能为负数',
	            icon: Ext.Msg.WARNING, 
	            width:200,
	            buttons: Ext.MessageBox.OK
			});
		}else{
			record.set('mileagedifference',mDifference.toFixed(4));
			gridPanel.defaultSaveHandler()
		}
	};
	//删除
	function toDelHandler() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record&&record!=null){
			if (record.get('state') != 0&&record.get('state') != 5) {
				Ext.MessageBox.alert("提示", "处理中的不能删除!");
			} else {
				gridPanel.defaultDeleteHandler()
			}
		}else{
			Ext.example.msg('提示！', '请先选取一条数据！');
		}
	}
	//打印功能
	function printData() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record&&record!=null){
			var _docUrl = BASE_PATH + "Business/vehicle/vehicle.use.management.Doc.jsp?businessType=" + businessType+"&uids="+record.get('uids');
			window.showModalDialog(_docUrl,"打印车辆申请信息","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;" +
									"resizable:yes;Minimize:yes;Maximize:yes");
		}else{
			Ext.example.msg('提示！', '请先选取一条数据！');
		}
	}
	
	//插入流转记录
	function insertPcBuniessBack(uids,busniessType,reason){
		DWREngine.setAsync(false);	
		var obj = new Object();
		obj.pid = CURRENTAPPID;
		obj.busniessId = uids;
		obj.backUser = REALNAME;
		obj.spareC2 = USERPOSNAME;
		obj.busniessType = busniessType;
		obj.backReason = reason!=null&&reason!=""?reason:"同意";
		vehicleMgm.insertBuniessBack(obj, function(state) {
		});	
		DWREngine.setAsync(true);	
	}
});
function showReportLog(pid,uids){
		var m_record=new Object();
		m_record.pid=pid;
		m_record.uids=uids;
		window.showModalDialog(
			CONTEXT_PATH+ "/Business/vehicle/pc.businessBack.log.jsp",
			m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
	}