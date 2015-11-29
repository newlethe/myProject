var bean = "com.sgepit.pmis.equipment.hbm.EquPackStyle"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "puuid"
var orderColumn = "puuid"
var SPLITB = "`"
var pid = CURRENTAPPID;
var types = new Array();
Ext.onReady(function() {
	DWREngine.setAsync(false);
	appMgm.getCodeValue('包装类别', function(list) { // 获取包装类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					types.push(temp);
				}
			});
	DWREngine.setAsync(true);
	var dsTypes = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : types
			});
	var sm = new Ext.grid.CheckboxSelectionModel(); // 创建选择模式

	var fm = Ext.form; // 包名简写（缩写）

	var fc = { // 创建编辑域配置
		'puuid' : {
			name : 'puuid',
			fieldLabel : '包装方式主键',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true
		},
		'packstyle' : {
			name : 'packstyle',
			fieldLabel : '包装方式',
			anchor : '95%',
			allowBlank : false
		},
		'packcategory' : {
			name : 'packcategory',
			fieldLabel : '包装类别',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			editable : false,
			store : dsTypes,
			allowBlank : false,
			anchor : '95%'
		},
		'description' : {
			name : 'description',
			fieldLabel : '描述',
			anchor : '95%'
		}
	}

	// 3. 定义记录集
	var Columns = [{
				name : 'puuid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'packstyle',
				type : 'string'
			}, {
				name : 'packcategory',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'description',
				type : 'string'
			}];

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantInt = {
		pid : CURRENTAPPID,
		puuid : '',
		packstyle : '',
		packcategory : '',
		description : ''
	} // 设置初始值

	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm,	new Ext.grid.RowNumberer({
						header : '序号',
						width : 33
					}), {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'puuid',
				header : fc['puuid'].fieldLabel,
				dataIndex : fc['puuid'].name,
				hidden : true
			}, {
				id : 'packstyle',
				header : fc['packstyle'].fieldLabel,
				dataIndex : fc['packstyle'].name,
				editor : new fm.TextField(fc['packstyle']),
				width : 100
			}, {
				id : 'packcategory',
				header : fc['packcategory'].fieldLabel,
				dataIndex : fc['packcategory'].name,
				editor : new fm.ComboBox(fc['packcategory']),
				renderer : dsTypeRender,
				width : 60
			}, {
				id : 'description',
				header : fc['description'].fieldLabel,
				dataIndex : fc['description'].name,
				editor : new fm.TextField(fc['description']),
				width : 80
			}]);

	cm.defaultSortable = true; // 设置是否可排序

	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : "pid='" + CURRENTAPPID + "'"
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
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	ds.setDefaultSort(orderColumn, 'asc'); // 设置默认排序列

	// 5. 创建可编辑的grid: grid-panel
	var grid = new Ext.grid.EditorGridTbarPanel({
				ds : ds, // 数据源
				cm : cm, // 列模型
				sm : sm, // 行选择模式
				tbar : ['<font color=#15428b><B>包装方式维护<B></font>', '-'], // 顶部工具栏，可选
				border : false, // 
				region : 'center',
				clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
				header : false, //
				frame : false, // 是否显示圆角边框
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
					emptyMsg : "无记录。"
				}),
				// expend properties
				plant : Plant,
				plantInt : PlantInt,
				servletUrl : MAIN_SERVLET,
				bean : bean,
				business : business,
				primaryKey : primaryKey,
				deleteHandler : deleteFun,
				saveHandler : saveFun,
				insertHandler : insertFun
			});

	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	function insertFun() {
		grid.defaultInsertHandler();
	};

	// 保存一个清单
	function saveFun() {
		grid.defaultSaveHandler();
	};
	// 删除一个清单
	function deleteFun() {
		if (sm.hasSelection()) {
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
					text) {
				if (btn == "yes") {
					var puuids = new Array();
					var records = sm.getSelections();
					for (i = 0; i < records.length; i++) {
						if (records[i].isNew || records[i].get('puuid') == "") {
						} else {
							puuids.push(records[i].get('puuid'));
						}
					}
					if (puuids.length > 0) {
						DWREngine.setAsync(false);
						equBaseInfo.deletePackStyleById(puuids, function(flag) {
									if (flag == 1) {
										Ext.Msg.show({
													title : '提示',
													msg : '该包装方式已经被使用，不能删除！',
													icon : Ext.Msg.WARNING,
													width : 300,
													buttons : Ext.MessageBox.OK
												})
									} else if (flag == 0) {
										Ext.example.msg('提示', '删除成功，成功删除了'
														+ puuids.length
														+ '条记录！');
										ds.reload();
									}
								})
						DWREngine.setAsync(true);
					} else {
						ds.reload();
					}
				}
			})
		}
	}

	// 属性值
	function dsTypeRender(value) {
		var str = "";
		for (var i = 0; i < types.length; i++) {
			if (types[i][0] == value) {
				str = types[i][1]
				break;
			}
		}
		return str;
	}
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});
});
