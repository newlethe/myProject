var beanName = "com.sgepit.pmis.gczl.hbm.GczlJyStat";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "sjType";
var servletName = "servlet/ZlypServlet";
var title = "<b>质量验评统计</b>";
// 相应下来列表是否已读取完毕
var unitStoreReady;
var specStoreReady;
var sjTypeReady;
var billStateReady;

var pageSize = 6;

/**
 * 流程使用参数
 */
// 主表记录是否已保存
var mainRecordSaved = false;

Ext.onReady(function() {

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			});
	

	// 用户数组
	var userArr = new Array();

	// 包名简称
	var fm = Ext.form;

	// combo store数据就绪
	unitStoreReady = false;
	specStoreReady = false;

	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}

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

	// 专业字段下拉列表
	var specStore = new Ext.data.Store({

				url : servletName,
				baseParams : {
					ac : 'listbox',
					category : '专业'
				},

				reader : selReader
			});

	// 验评专业下拉框
	var specCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : specStore,
				valueField : 'key',
				displayField : 'value',
				allowBlank : false

			});

	// 单位下拉列表
	var unitStore = new Ext.data.Store({

				url : servletName,
				baseParams : {
					ac : 'unitListBox'
				},

				reader : selReader
			});

	// 流程状态数据源
	var billStateStore = new Ext.data.Store({
				url : servletName,
				baseParams : {
					ac : 'listbox',
					category : '流程状态'

				},

				reader : selReader
			});

	// 编制年月数据源(包含全部，供renderer调用)
	var yearMonthStore = new Ext.data.Store({
				url : servletName,
				baseParams : {
					ac : 'yearMonthListBox',
					deptid : USERDEPTID
				},

				reader : selReader

			});

	// 编制年月数据源，过滤掉已存在的年月，添加数据时使用
	var sjTypeAddStore = new Ext.data.Store({
				url : servletName,
				baseParams : {
					ac : 'addSjTypeListBox'
				},

				reader : selReader

			});

	// 编制年月下拉框
	var yearMonthCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : sjTypeAddStore,
				valueField : 'key',
				displayField : 'value',
				allowBlank : false
			});

	// 初始化数据
	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user where userid in (select user_id from gczl_jy_stat union select '"+ USERID +"' from dual)", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArr.push(temp);
				}
			});
	DWREngine.setAsync(true);

	specStore.load({

				callback : function() {
					specStoreReady = true;
					reload();
				}

			});
	unitStore.load({

				callback : function() {
					unitStoreReady = true;
					reload();
				}
			});
	yearMonthStore.load({
				callback : function() {
					sjTypeReady = true;
					reload();
				}
			});

	billStateStore.load({
				callback : function() {
					billStateReady = true;
					reload();
				}
			});

	// 域模型
	var fc = {

		'uids' : {
			name : 'uids',
			fieldLabel : 'uids',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'statNo' : {
			name : 'statNo',
			fieldLabel : '编号',
			anchor : '95%'
		},
		'userId' : {
			name : 'userId',
			fieldLabel : '编制人',
			anchor : '95%'

		},
		'deptId' : {
			name : 'deptId',
			fieldLabel : '编制单位',
			anchor : '95%'
		},
		'sjType' : {
			name : 'sjType',
			fieldLabel : '编制年月',
			anchor : '95%'
		},
		'specialty' : {
			name : 'specialty',
			fieldLabel : '专业',
			anchor : '95%'
		},
		'createTime' : {
			name : 'createTime',
			fieldLabel : '创建时间',
			anchor : '95%'
		},
		'jyStatus' : {
			name : 'jyStatus',
			fieldLabel : '状态',
			anchor : '95%'
		},
		'billState' : {
			name : 'billState',
			fieldLabel : '流程状态',
			anchor : '95'
		}

	};

	// 列模型
	var cm = new Ext.grid.ColumnModel([sm, {
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			},{
				id : 'statNo',
				header : fc['statNo'].fieldLabel,
				dataIndex : fc['statNo'].name,
				editor : new Ext.form.TextField()
			}, {
				id : 'userId',
				header : fc['userId'].fieldLabel,
				dataIndex : fc['userId'].name,
				renderer : showUserNameFun
			},  {
				id : 'deptId',
				header : fc['deptId'].fieldLabel,
				dataIndex : fc['deptId'].name,
				width : 200,
				renderer : function(value) {
					var index = unitStore.find('key', value);
					if (index > -1) {
						return unitStore.getAt(index).get('value');
					} else {
						return '';
					}

				}
			}, {
				id : 'specialty',
				header : fc['specialty'].fieldLabel,
				dataIndex : fc['specialty'].name,
				editor : specCombo,
				renderer : Ext.util.Format.comboRenderer(specCombo)
			}, {
				id : 'sjType',
				header : fc['sjType'].fieldLabel,
				dataIndex : fc['sjType'].name,
				editor : yearMonthCombo,
				renderer : function(value) {
					var index = yearMonthStore.find('key', value);
					if (index > -1) {
						return yearMonthStore.getAt(index).get('value');
					} else {
						return '';
					}

				}

			}, {
				id : 'createTime',
				header : fc['createTime'].fieldLabel,
				dataIndex : fc['createTime'].name,
				renderer : Ext.util.Format.dateRenderer('Y-m-d H:s'), // Ext内置日期renderer
				type : 'date'
			}, {
				id : 'jyStatus',
				header : fc['jyStatus'].fieldLabel,
				dataIndex : fc['jyStatus'].name,
				hidden : true
			}, {
				id : 'billState',
				header : fc['billState'].fieldLabel,
				dataIndex : fc['billState'].name,
				renderer : function(value) {
					var index = billStateStore.find('key', value);
					if (index > -1) {
						return billStateStore.getAt(index).get('value');
					} else {
						return '';
					}
				}
			}]);
	cm.defaultSortable = true;

	// 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'statNo',
				type : 'string'
			}, {
				name : 'userId',
				type : 'string'
			}, {
				name : 'deptId',
				type : 'string'
			}, {
				name : 'specialty',
				type : 'string'
			}, {
				name : 'sjType',
				type : 'string'
			}, {
				name : 'createTime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'jyStatus',
				type : 'int'
			}, {
				name : 'billState',
				type : 'int'
			}];

	var MainPlant = Ext.data.Record.create(Columns)
	var MainPlantInt = {
		uids : null,
		statNo : null,
		userId : USERID,
		deptId : USERDEPTID,	//用户部门
		specialty : '',
		sjType : '',
		createTime : new Date()
	};

	// 创建数据源
	var ds = new Ext.data.Store({

				baseParams : {
					ac : 'list',
					bean : beanName,
					business : business,
					method : listMethod
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true

			});
	ds.setDefaultSort(orderColumn, 'asc');
	
	/**
	 * 流程中的添加/删除功能按钮不显示
	 */
	var showSaveBtn = true;
	var showAddBtn = true;
	var showDelBtn = true;
	
	if ( isFlwView || isFlwTask ){
		showAddBtn = false;
		showDelBtn = false;
	}
	
	if ( isFlwView ){
		showSaveBtn = false;
	}

	var grid = new Ext.grid.EditorGridTbarPanel({
				id : 'zlyp-stat-panel',
				ds : ds,
				cm : cm,
				sm : sm,
				addBtn : showAddBtn,
				saveBtn :showSaveBtn,
				delBtn : showDelBtn,
				tbar : [{
							xtype : 'tbtext',
							text : title
						}],
				iconCls : 'icon-by-category',
				border : false,
				region : 'center',
				autoScroll : 'true',
				clicksToEdit : 1,
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : "第",
							store : ds,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录"
						}),
				width : 800,
				height : 300,
				saveHandler : saveHandler,
				deleteHandler : deleteHandler,
				plant : MainPlant,
				plantInt : MainPlantInt
			});

	sm.on('rowselect', function(sm, rowIndex, record) {

				if (!record.data.sjType)
					return;
				if (record.data.sjType == '')
					return;
				if (record.modified) {
					if (record.modified.sjType == '')
						return;
				}

				if (record && record.data["uids"]
						&& record.data["uids"] != null) {
					parent.curRecord = record;

					var specIdx = specStore.find('key',
							record.data['specialty']);

					if (record.modified) {
						if (record.modified['specialty']) {
							specIdx = specStore.find('key',
									record.modified['specialty']);
						}
					}

					var unitIdx = unitStore.find('key', record.data['deptId']);

					if (specIdx != -1) {
						parent.specRec = specStore.getAt(specIdx);
					}

					if (unitIdx != -1) {
						parent.unitRec = unitStore.getAt(unitIdx);
					}
					
					var editable = checkEditable(record);

					parent.loadDetailData(editable);
				}

			});

	grid.on('beforeedit', function(e) {
				if ( !checkEditable(e.record) ){
					e.cancel = true;
					return;
				
				}
		

				// 编制年月
				if (e.field == 'sjType') {

					// 修改现有记录的情况
					if (e.record.data.uids) {
						e.cancel = true;
							return;
					
					}

					var curField = cm.getCellEditor(e.column, e.row).field;
					sjTypeAddStore.load({
								params : {
									deptid : e.record.data.deptId
								}
							});

				}

			});

	// 创建viewport
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});

	// 加载数据
	// reload();

	function reload() {
		if (!(unitStoreReady && specStoreReady && sjTypeReady && billStateReady))
			return;

		// 流程任务
		if (isFlwTask) {
			if (mainRecordSaved) {
				ds.load({

							params : {
								params : "stat_no='" + statNo + "'",
								start : 0,
								limit : pageSize
							},
							callback : function(r) {
								if (r.length > 0) {
									sm.selectFirstRow();
								}
							}
						});
			} else {

				initTask();

			}
		} else if (isFlwView) { // 流程查看
			ds.load({

						params : {
							params : "stat_no='" + statNo + "'",
							start : 0,
							limit : pageSize
						},
						callback : function(r) {
							if (r.length > 0) {
								sm.selectFirstRow();
							}
						}
					});
		} else {
			ds.load({
						params : {
							start : 0,
							limit : pageSize
						},
						callback : function(r) {
							if (r.length > 0) {
								sm.selectFirstRow();
							}
						}
					});
		}

	}

	// 显示用户名
	function showUserNameFun(value) {
		var str = '';
		for (var i = 0; i < userArr.length; i++) {
			if (userArr[i][0] == value) {
				str = userArr[i][1]
				break;
			}
		}
		return str;
	}

	function saveHandler() {

		if (isFlwTask) {
			if (ds.getAt(0)) {
				if (ds.getAt(0).data.sjType == ''
						|| ds.getAt(0).data.specialty == '') {
					Ext.Msg.alert('保存', '记录信息未填写完整!');
					return;
				}
			}
		}

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
						ac : 'save-update',
						data : Ext.encode(json)
					},
					success : function(result, request) {
						if (isFlwTask) {
							mainRecordSaved = true;
							Ext.Msg.alert('质量验评统计','主表信息保存成功，已可以添加报表记录。');
						}
						reload();
					},
					failure : function(result, request) {
						Ext.example.msg('保存失败！', '保存失败！');
					}

				});

	}

	function deleteHandler() {
		if (sm.getCount() == 0) {
			Ext.Msg.alert('提示!', '您尚未选择一条记录!');
			return;
		}
		
		var record = sm.getSelected();
		
		if ( record.data.billState ){
			if ( record.data.billState != 0 && !isFlwTask){
				Ext.Msg.alert('删除记录', '无法删除当前记录，请检查其审批状态!');
			return;
			}
		}
		
		Ext.Msg.confirm('确认', '您确认删除所选记录及其相关的报表数据信息？', function(btn, text) {
					if (btn == 'yes') {
						
						var m = record.get(this.primaryKey);
						if (m == "") { // 主键值为空的记录不计入
							return;
						} else if (record.isNew) {
							ds.remove(record);
							return;
						}
						Ext.Ajax.request({
									method : 'POST',
									url : servletName,
									params : {
										ac : 'delete',
										statid : record.data.uids
									},
									success : function(result, request) {
										reload();
									},
									failure : function(result, request) {
										Ext.example.msg('删除失败！', '删除失败！');
									}
								});
					}
				});
	}

	// 流程任务初始化
	function initTask() {
		if (!mainRecordSaved) {
			var oNew = new Object();
			var initVal = {
				uids : null,
				statNo : statNo,
				userId : USERID,
				deptId : UNITID,
				specialty : '',
				sjType : '',
				createTime : new Date()
			};
			Ext.applyIf(oNew, initVal);
			var p = new MainPlant(oNew);
			p.isNew = true;
			ds.insert(0, p);
			grid.startEditing(0, 0);
			//Ext.Msg.alert('质量验评统计', '请填写相应的信息并点击"保存"');
		}

	}

});

function checkEditable(record){
	if ( isFlwView ){
		return false;
	}
		
	
	if ( isFlwTask ){
		return true;
	}
	
	if ( record.data.billState ){
		if ( record.data.billState != 0 ){
			return false;
		}
	}
	
	return true;
}