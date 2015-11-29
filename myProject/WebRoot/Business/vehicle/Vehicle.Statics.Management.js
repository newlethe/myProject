var Vbean = "com.sgepit.pmis.vehicle.hbm.VehicleStaticsManagement"; //车辆年度综合统计
var Mbean = "com.sgepit.pmis.vehicle.hbm.VehicleStaticsManagement"; //车辆年度综合统计
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var gridPanel = null;
var m_grid_record = null;
var editWin = null;
Ext.onReady(function() {
var deleteRecord = null;
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	var fm = Ext.form;

	var array_yearMonth = getYearBysjType((new Date().getYear()-2), (new Date().getYear() + 3));
	
    var dsCombo_yearMonth = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [['', '']]
			});
	dsCombo_yearMonth.loadData(array_yearMonth);
	var yearMonthCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : dsCombo_yearMonth,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				emptyText : "请选择",
				allowBlank : false,
				hiddenValue : true,
				listeners : {
					'expand' : function() {
						pcTzglService.sjTypeFilter(CURRENTAPPID, Mbean,
								function(arr) {
									if (arr.length > 0) {
										dsCombo_yearMonth
												.filterBy(sjTypeFilter);
										function sjTypeFilter(record, id) {
											for (var i = 0; i < arr.length; i++) {
												if (record.get("k") == arr[i])
													return false;
											}
											return true;
										}
									}
								});
					}
				}
			});
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, new Ext.grid.RowNumberer(), {
				id : 'uids',
				type : 'string',
				header : "主键",
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'pid',
				type : 'string',
				header : "项目编码",
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'sjType',
				type : 'string',
				header : "年份",
				dataIndex : "sjType",
				width : 40,
				align : 'center',
				editor : yearMonthCombo,
				renderer : function(k) {
					for (var i = 0; i < array_yearMonth.length; i++) {
						if (k == array_yearMonth[i][0]) {
							return array_yearMonth[i][1];
						}
					}
				}
			}, {
				id : 'title',
				type : 'string',
				header : "报表名称",
				width : 140,
				align : 'center',
				dataIndex : 'title',
				renderer : function(v) {
					return "<a href='javascript:showEditWindow2()' title='"+v+"'>" + v
							+ "</a>";
				}
			},{
				id : 'userId',
				type : 'string',
				header : "填报人",
				width : 50,
				dataIndex : 'userId',
				align : 'center'
			},{
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width : 80,
				align : 'center',
				dataIndex : 'createDate',
				renderer : function(v) {
					if (v)
						return v.format('Y-m-d')
				}

			},   {
				id : 'issueStatus',
				type : 'float',
				header : "上报状态",
				hidden:true,
				width : 40,
				align : 'center',
				dataIndex : 'issueStatus'
				//renderer :stateRender
			}, {
				id : 'memo',
				type : 'string',
				header : "备注",
				width : 150,
				hidden : true,
				dataIndex : 'memo',
				editor : new Ext.form.TextField()
			},{
				id : 'flagNull',
				type : 'string',
				header : '报表是否填写完整',
				hidden : true,
				dataIndex : 'flagNull'
			}]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'sjType',
				type : 'string'
			}, {
				name : 'unitId',
				type : 'string'
			}, {
				name : 'title',
				type : 'string'
			}, {
				name : 'billState',
				type : 'float'
			}, {
				name : 'issueStatus',
				type : 'float'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'userId',
				type : 'string'
			}, {
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'lastModifyDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'flagNull',
				type : 'string'
			}, {
				name : 'reason',
				type : 'string'
			}];
	/**
	 * 创建数据源
	 */
	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : Vbean,
					business : business,
					method : listMethod,
					outFilter : outFilter,
					params : "pid='" + edit_pid + "' order by sjType desc"
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
	ds.load({
				callback : function() {
				}
			});

	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids : '',
		pid : CURRENTAPPID,
		sjType : '',
		unitId : '',
		title : '',
		billState : '',
		issueStatus : '0',
		memo : '',
		userId : REALNAME,
		createDate : new Date(),
		lastModifyDate : '',
		flagNull : '1'
	}

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar : [],
		border : false,
		layout : 'fit',
		region : 'center',
		header : false,
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		stripeRows : true,
		trackMouseOver : true,
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
		insertHandler : function() {
			gridPanel.defaultInsertHandler();
			if (!dydaView) {
				if (gridPanel.getTopToolbar().items.get('add'))
					gridPanel.getTopToolbar().items.get('add').disable();
				if (gridPanel.getTopToolbar().items.get('save'))
					gridPanel.getTopToolbar().items.get('save').disable();
				if (gridPanel.getTopToolbar().items.get('del'))
					gridPanel.getTopToolbar().items.get('del').enable();
			}
		},
        deleteHandler : function(){
            deleteRecord = sm.getSelected();
            gridPanel.defaultDeleteHandler();
        },
		listeners : {
			'aftersave' : function(grid, idsOfInsert, idsOfUpdate, _primaryKey,
					_bean) {
				if (m_grid_record)
					m_grid_record.set('uids', idsOfInsert);
				if (!dydaView) {
					if (grid.getTopToolbar().items.get('add'))
						grid.getTopToolbar().items.get('add').enable();
					if (grid.getTopToolbar().items.get('save'))
						grid.getTopToolbar().items.get('save').disable();
					if (grid.getTopToolbar().items.get('del'))
						grid.getTopToolbar().items.get('del').disable();
				}
			},
			'render' : function(grid) {
				if (!dydaView) {
					if (grid.getTopToolbar().items.get('del'))
						grid.getTopToolbar().items.get('del').disable();
					if (grid.getTopToolbar().items.get('save'))
						grid.getTopToolbar().items.get('save').disable();
				}
			},
			'afterdelete' : function(grid, ids) {
				m_grid_record = null;
                if(deleteRecord!=null){
                    //删除主记录同时删除大对象
	                baseDao.updateBySQL("DELETE FROM  cell_datafile t WHERE " +
	                    " t.datadate = '"+deleteRecord.get("sjType")+"' " +
	                    " AND t.ptype = 'CARS_USING_REPORT' " +
	                    " AND t.report_unitid = '"+CURRENTAPPID+"'",function(){});
                }
				if (!dydaView) {
					if (grid.getTopToolbar().items.get('add'))
						grid.getTopToolbar().items.get('add').enable();
					if (grid.getTopToolbar().items.get('del'))
						grid.getTopToolbar().items.get('del').disable();
				}
			},
			'rowclick' : function(grid, rowIndex, e) {
				record = grid.getSelectionModel().getSelected();
				if (record && !dydaView) {
					if (record.get('issueStatus') == 0
							|| record.get('issueStatus') == 2) {
						if (grid.getTopToolbar().items.get('del'))
							grid.getTopToolbar().items.get('del').enable();
					} else {
						if (grid.getTopToolbar().items.get('del'))
							grid.getTopToolbar().items.get('del').disable();
					}
				} else {
					if (grid.getTopToolbar().items.get('del'))
						grid.getTopToolbar().items.get('del').disable();
				}
			},
			'beforeedit' : function(e) {
				if (e.record.get('issueStatus') == 1)
					return false;
				if (e.record.isNew !== true)
					return false;
			},
			'afteredit' : function(o) {
				if (gridPanel.getTopToolbar().items.get('save'))
					gridPanel.getTopToolbar().items.get('save').enable();
				if (o.field === "sjType") {
					var display_value = "";
					for (var i = 0; i < array_yearMonth.length; i++) {
						if (o.value == array_yearMonth[i][0]) {
							display_value = array_yearMonth[i][1];
						}
					}
					o.record.set("title", display_value
									+ "嘉节燃气车辆年度综合统计报表");
				}
			}
		},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : Mbean,
		business : business,
		primaryKey : primaryKey
	});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel]
			});


});


function showEditWindow2() {
	var m_record = gridPanel.getSelectionModel().getSelected();
	if (m_record.get('uids') == '') {
		Ext.example.msg("提示", "请先保存此条记录");
	} else {
		var record = gridPanel.getSelectionModel().getSelected();
		var params = {
			p_type : 'CARS_USING_REPORT',
			p_date : record.get('sjType'),
			p_corp : edit_pid,
            p_saveAsFile : true,
			savable :true
		}
		var cellUrl = "/" + ROOT_CELL + "/cell/eReport.jsp";
		window.showModalDialog(cellUrl, params, "dialogWidth:"
						+ screen.availWidth + ";dialogHeight:"
						+ screen.availHeight + ";center:yes;resizable:yes;");
	}
}