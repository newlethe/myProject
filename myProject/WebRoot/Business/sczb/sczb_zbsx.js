var beanPB = "com.sgepit.pmis.sczb.hbm.SczbZbsx";
var businessPB = "baseMgm"
var listMethodPB = "findWhereOrderby"
var primaryKeyPB = "uids"
var orderColumnPB = "orderId"
var partbDet;
var partbWindow;
var queryWin;
var currentPid = CURRENTAPPID;
var tbUnitStore, tbUnitCombo;
Ext.onReady(function() {
	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}
	//是否禁用添加/修改/删除按钮
		var btnDisabled = ModuleLVL != '1';

		DWREngine.setAsync(false);
		systemMgm.getUnitById(CURRENTAPPID, function(u) {
			if (u && u != null && u != 'null') {
				currentPid = u.upunit;
			}
		});
		DWREngine.setAsync(true);

		var gridfilter = "pid = '" + currentPid + "'";
		//var gridfilter = "type = '1'";
		var fm = Ext.form;
		var fcPB = {
			'orderId' : {
				name : 'orderId',
				fieldLabel : '轮班顺序',
				anchor : '95%'
			},
			'uids' : {
				name : 'uids',
				fieldLabel : 'uids',
				//hidden:true,
				//hideLabel:true,
				anchor : '95%'
			},
			'zcName' : {
				name : 'zcName',
				fieldLabel : '值次',
				//hideLabel:true,
				//hidden:true,
				anchor : '95%'
			},
			'initialDate' : {
				name : 'initialDate',
				fieldLabel : '初始化日期',
				//allowBlank: false,
				anchor : '95%'
			},
			'pid' : {
				name : 'pid',
				fieldLabel : '项目',
				//allowBlank: false,
				anchor : '95%'
			}
		}
		function loadTbUnitCombo() {
			var tbUnitArr = new Array();

			DWREngine.setAsync(false);
			// tbUnitStore.removeAll();
			sczbZcMgm.getZcs(currentPid, function(list) {
				
				if(list!=null){
					for ( var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].zcName);
					temp.push(list[i].zcName);
					tbUnitArr.push(temp);
					}
				}
			});
			if (tbUnitArr.length == 0) {
				tbUnitArr.push( [ '-1', '(无)' ]);
			}
			DWREngine.setAsync(true);
			tbUnitStore.loadData(tbUnitArr);
		}
		tbUnitStore = new Ext.data.SimpleStore( {
			fields : [ 'k', 'v' ],
			data : []

		});
		loadTbUnitCombo();
		tbUnitCombo = new Ext.form.ComboBox( {
			triggerAction : 'all',
			mode : 'local',
			store : tbUnitStore,
			lazyRender : true,
			valueField : 'k',
			displayField : 'v',
			editable : false,
			allowBlank : false,
			name : fcPB['zcName'].name
		});

		var smPB = new Ext.grid.CheckboxSelectionModel( {
			singleSelect : false
		})
		var cmPB = new Ext.grid.ColumnModel( [ // 创建列模型
				smPB, {
					id : 'orderId',
					header : fcPB['orderId'].fieldLabel,
					dataIndex : fcPB['orderId'].name,
					width : 100,
					editor : new fm.TextField(fcPB['orderId']),
					renderer : function(data) {
						var qtip = "qtip=" + data;
						return '<span ' + qtip + '>' + data + '</span>';
						return data;
					}

				}, {
					id : 'uids',
					header : fcPB['uids'].fieldLabel,
					dataIndex : fcPB['uids'].name,
					hidden : true
				}, {
					id : 'zcName',
					header : fcPB['zcName'].fieldLabel,
					dataIndex : fcPB['zcName'].name,
					editor : tbUnitCombo,
					renderer : Ext.util.Format
									.comboRenderer(tbUnitCombo),
					hidden : false
					
				}, {
					id : 'pid',
					header : fcPB['pid'].fieldLabel,
					dataIndex : fcPB['pid'].name,
					width : 150,
					editor : new fm.TextField(fcPB['pid']),
					hidden : true
				}, {
					id : 'initialDate',
					header : fcPB['initialDate'].fieldLabel,
					dataIndex : fcPB['initialDate'].name,
					width : 150,
					editor : new fm.DateField(fcPB['initialDate']),
					renderer : Ext.util.Format.dateRenderer('Y-m-d')
				// Ext内置日期renderer
						} ]);
		
		cmPB.defaultSortable = true; //设置是否可排序

		// 3. 定义记录集
		var ColumnsPB = [ {
			name : 'uids',
			type : 'string'
		}, //Grid显示的列，必须包括主键(可隐藏)
				{
					name : 'zcName',
					type : 'string'
				}, {
					name : 'initialDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'pid',
					type : 'string'
				}, {
					name : 'orderId',
					type : 'float'
				} ]
		var PlantPB = Ext.data.Record.create(ColumnsPB); //定义记录集
		var PlantIntPB = {
			uids : '',
			pid : currentPid,
			zcName : '',
			initialDate : new Date(),
			orderId : ''
		} //设置初始值
		var PlantFieldsIntPB = new Object();
		Ext.applyIf(PlantFieldsIntPB, PlantIntPB)
		PlantFieldsIntPB = Ext.apply(PlantFieldsIntPB, {
			uids : '',
			pid : currentPid,
			zcName : '',
			initialDate : new Date(),
			orderId : ''
		});

		// 4. 创建数据源
		var dsPB = new Ext.data.Store( {
			baseParams : {
				ac : 'list',
				bean : beanPB,
				business : businessPB,
				method : listMethodPB,
				params : gridfilter
			},
			proxy : new Ext.data.HttpProxy( {
				method : 'GET',
				url : MAIN_SERVLET
			}),

			reader : new Ext.data.JsonReader( {
				root : 'topics',
				totalProperty : 'totalCount',
				id : 'uids'
			}, ColumnsPB),

			remoteSort : true,
			pruneModifiedRecords : true
		});
		dsPB.setDefaultSort(orderColumnPB, 'asc');

		var gridPB = new Ext.grid.EditorGridTbarPanel( {
			// basic properties
			id : 'grid-panrel', //id,可选
			ds : dsPB, //数据源
			cm : cmPB, //列模型
			sm : smPB, //行选择模式
			tbar : [], //顶部工具栏，可选
			height : 300, //高
			//        iconCls: 'icon-show-all',	//面板样式
			border : false,
			region : 'center',
			clicksToEdit : 2, //单元格单击进入编辑状态,1单击，2双击
			header : false,
			autoScroll : true, //自动出现滚动条
			collapsible : false, //是否可折叠
			animCollapse : false, //折叠时显示动画
			autoExpandColumn : 2, //列宽度自动扩展，可以用列名，也可以用序号（从1开始）
			loadMask : true, //加载时是否显示进度
			stripeRows : true,
			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			},
			bbar : new Ext.PagingToolbar( {//在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : dsPB,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
			// expend properties
			plant : PlantPB, //初始化记录集，必须
			plantInt : PlantIntPB, //初始化记录集配置，必须
			servletUrl : MAIN_SERVLET, //服务器地址，必须
			bean : beanPB, //bean名称，必须
			business : businessPB, //business名称，可选
			primaryKey : primaryKeyPB, //主键列名称，必须
			//      	formBtn:true,
			saveBtn : true,
			//      	formHandler: popPartbDet,
			saveHandler : partybSaveHandler,
			//		insertHandler : insertPartBHandler,
			listeners : {
				afterdelete : function(grid, ids, primaryKey, bean) {
					//		               conpartybMgm.immediatelySendPartybDel(ids,bean,function (rtn){
			//		               })

		}
	}
		});
		dsPB.load( {
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});

		// 13. 其他自定义函数，如格式化，校验等
		function partybSaveHandler() {
			var records = dsPB.getModifiedRecords();
			if (records && records.length > 0) {
				for ( var i = 0; i < records.length; i++) {
					var record = records[i];
					var flag = true;
					var zcName = records[i].get('zcName');
					if ("" == zcName) {
						Ext.example.msg('提示', '必填项：值次 未填写！');
						return;
					}
					DWREngine.setAsync(false);
					sczbZbsxMgm.exists(record.data, function(state) {
						if (state == true) {
							Ext.MessageBox.show( {
								title : '警告',
								msg : '轮班顺序 或 值次 有重复！<br>请重新输入...',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.WARNING
							});
							flag = false;
						}
					});
					DWREngine.setAsync(true);
				}
				if (flag) {
					gridPB.defaultSaveHandler();
				}
				//				dsPB.load();
			}
		}
		;

		var viewport = new Ext.Viewport( {
			layout : 'fit',
			items : [ gridPB ]
		});

	})
