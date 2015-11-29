var Vbean = "com.sgepit.pcmis.tzgl.hbm.VPcTzglYearPlanM"; // 年度投资视图bean
var Mbean = "com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanM"; // 年度投资主表bean
var bean2 = "com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanD"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var gridPanel = null;
var m_grid_record = null;
var editWin = null;
Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	var fm = Ext.form;

	var array_yearMonth = getYearBysjType(null, (new Date().getYear() + 5));
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
					return "<a href='javascript:showEditWindow2()'>" + v
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
				width : 40,
				align : 'center',
				dataIndex : 'issueStatus',
				renderer :stateRender
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
		deleteHandler : function() {
			var sm = gridPanel.getSelectionModel();
			var ds = gridPanel.getStore();
			if (sm.getCount() > 0) {
				Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
						text) {
					if (btn == "yes") {
						var deleteArr = new Array();
						var records = sm.getSelections()
						for (var i = 0; i < records.length; i++) {
							var m = records[i].get(gridPanel.primaryKey)
							if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
								continue;
							}
							// 主记录删除
							var delMaster = "delete from pc_tzgl_year_plan_m where uids = '"
									+ m + "'";
							// 细表记录删除
							var delDetail = "delete from pc_tzgl_year_plan_d where unit_id = '"
									+ records[i].get("pid")
									+ "' and s"
									+ "j_type='"
									+ records[i].get('sjType')
									+ "'";
							deleteArr.push(delMaster);
							deleteArr.push(delDetail);
						}
						if (deleteArr.length > 0) {
							baseDao.updateByArrSQL(deleteArr, function(bool) {
										if (bool) {
											ds.reload();
										} else {
											Ext.Msg.alert('提示', '操作失败');
										}
									})
						} else {
							ds.reload();
						}
						if (!dydaView) {
							if (gridPanel.getTopToolbar().items.get('add'))
								gridPanel.getTopToolbar().items.get('add')
										.enable();
							if (gridPanel.getTopToolbar().items.get('del'))
								gridPanel.getTopToolbar().items.get('del')
										.disable();
						}
					}
				}, gridPanel);
			}
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
						Ext.getCmp('report').enable();
					} else {
						if (grid.getTopToolbar().items.get('del'))
							grid.getTopToolbar().items.get('del').disable();
						Ext.getCmp('report').disable();
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
					o.record.set("title", display_value + CURRENTAPPNAME
									+ "年度投资计划报表");
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
	if (!dydaView) {
		if(ModuleLVL<3){
			gridPanel.getTopToolbar().addButton({
						id : 'report',
						text : '上报',
						iconCls : 'upload',
						handler : reportFn
					});
			gridPanel.getTopToolbar().add('->');
			gridPanel.getTopToolbar().addButton({
						text : '返回',
						iconCls : 'returnTo',
						handler : function() {
							history.back();
						}
					})
		}
	}

	// --------方法
	function reportFn() {
		var m_record = gridPanel.getSelectionModel().getSelected();
		var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});
		if (m_record == null) {
			Ext.example.msg('提示', '请选中一条记录!');
			return;
		}
		var flagNull = m_record.get('flagNull');
		if(flagNull != '0'){
			alert("有单元格未填写，请填写完整。填写说明见：\n系统右上角【帮助—系统使用帮助—报表填写说明】");
			return false;
		}
		DWREngine.setAsync(false);
		baseDao.findByWhere2("com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanD",
				"sj_type='" + m_record.get('sjType') + "' and unit_id='"
						+ m_record.get('pid') + "'", function(list) {
					if (list.length > 0) {
						Ext.MessageBox.confirm('确认', '上报后将不可修改，确认要上报吗？',
								function(btn, text) {
									if (btn == "yes") {
										var selectRecords = gridPanel
												.getSelectionModel()
												.getSelected();
										var uids = "";
										if (selectRecords != "") {
											var issueStatus = selectRecords
													.get('issueStatus');
											if (issueStatus != 1) {
												uids = selectRecords.get('uids');
												// var sql = "update
												// PC_TZGL_YEAR_PLAN_M set
												// ISSUE_STATUS=1 where
												// uids='"+uids+"'";
												// baseDao.updateBySQL(sql);
												// 投资管理【年度计划】上报
											    myMask.show();
												pcTzglService.mis2jtOfYearPlan(uids,'2',edit_pid,'年度投资计划上报二级企业',REALNAME,
														function(flag) {
															myMask.hide();
															if (flag == 1) {
																Ext.example.msg('','操作成功！')
																Ext.getCmp('report').disable();
																gridPanel.getTopToolbar().items.get('del').disable();
																gridPanel.store.reload();// 刷新页面
															} else {
																Ext.example.msg('','操作失败！',2)
															}
														});
											}
										}

										gridPanel.getStore().reload();
									}
								}, this);
					} else {
						Ext.example.msg('提示', "报表未录入，不可上报，请先录入！");
					}
					DWREngine.setAsync(true);
				});
	}
});

function stateRender(value,meta,record){
	var renderStr="";
	if(value=="0") return "<font color=gray>未上报</font>";
	if(value=="1") {
		renderStr="<font color=black>已上报</font>";
	}
	if(value=="2") renderStr="<font color=red>退回重报</font>";
	if(value=="3") renderStr="<font color=blue>审核通过</font>";
	return "<a title='点击查看详细信息' " +
			"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
}

function showReportLog(pid,uids){
	var m_record=new Object();
	m_record.pid=pid;
	m_record.uids=uids;
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
		m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}
function showEditWindow2() {
	var m_record = gridPanel.getSelectionModel().getSelected();
	if (m_record.get('uids') == '') {
		Ext.example.msg("提示", "请先保存此条记录");
	} else {
		window
				.showModalDialog(
						CONTEXT_PATH
								+ "/PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.yearInvest.form.jsp",
						m_record,
						"dialogWidth:820px;dialogHeight:540px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
		gridPanel.getStore().reload();
	}
}