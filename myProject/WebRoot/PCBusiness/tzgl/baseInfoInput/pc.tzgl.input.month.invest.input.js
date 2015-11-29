var bean = "com.sgepit.pcmis.tzgl.hbm.PcTzglMonthInvestM"
var bean2 = "com.sgepit.pcmis.tzgl.hbm.PcTzglMonthInvestD"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var gridPanel = null;

Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({
				header : '',
				singleSelect : true
			})
	var array_yearMonth = getYearMonthBySjType(null, null);

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
				emptyText : "请选择",
				editable : false,
				maxHeight : 107,
				allowBlank : false,
				hiddenValue : true,
				listeners : {
					'expand' : function() {
						pcTzglService.sjTypeFilter(edit_pid, bean,
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
	sm, {
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
				header : "月度",
				width : 100,
				dataIndex : "sjType",
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
				width : 300,
				align : 'center',
				dataIndex : 'title',
				renderer : function(v) {
					return "<a href='javascript:showEditWindow2()'>" + v
							+ "</a>";
				}
			},  {
				id : 'createperson',
				type : 'string',
				header : "填报人员",
				width : 100,
				dataIndex : 'createperson',
				align : 'center',
				editor : new Ext.form.TextField({name : 'createperson', allowBlank : true})
			},{
				id : 'createDate',
				type : 'date',
				header : "报告日期",
				width : 90,
				align : 'center',
				dataIndex : 'createDate',
				editor : new Ext.form.DateField({name : 'createdate',format : 'Y-m-d'}),
				renderer : function(v) {
					if (v)
						return v.format('Y-m-d')
				}
			}, {
				id : 'unitUsername',
				type : 'string',
				header : "单位负责人",
				width : 100,
				dataIndex : 'unitUsername',
				hidden:true,
				align : 'center',
				editor : new Ext.form.TextField({name : 'unitUsername', allowBlank : true})
			},{
				id : 'countUsername',
				type : 'string',
				header : "统计负责人",
				width : 100,
				dataIndex : 'countUsername',
				hidden:true,
				align : 'center',
				editor : new Ext.form.TextField({name : 'countUsername', allowBlank : true})
			},{
				id : 'createpersonTel',
				type : 'string',
				header : "联系方式",
				width : 100,
				hidden:true,
				dataIndex : 'createpersonTel',
				align : 'center',
				editor : new Ext.form.TextField({name : 'createpersonTel', allowBlank : true})
			}, {
				id : 'reportStatus',
				type : 'float',
				header : "上报状态",
				width : 70,
				align : 'center',
				dataIndex : 'reportStatus',
				renderer :stateRender
			}

	]);
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
				name : 'reportStatus',
				type : 'float'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'createperson',
				type : 'string'
			}, {
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'unitUsername',
				type : 'string'
			}, {
				name : 'countUsername',
				type : 'string'
			}, {
				name : 'createpersonTel',
				type : 'string'
			}, {
				name : 'lastModifyDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}];
	/**
	 * 创建数据源
	 */
	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
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
	ds.load();

	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids : '',
		pid : edit_pid,
		sjType : '',
		unitId : edit_pid,
		title : '',
		reportStatus : '0',
		memo : '',
		createperson : REALNAME,
		createDate : new Date(),
		lastModifyDate : ''
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
		//autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			//forceFit : true,
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
								var records = sm.getSelections()
								var codes = []
								for (var i = 0; i < records.length; i++) {
									var m = records[i]
											.get(gridPanel.primaryKey)
									if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
										continue;
									}
									codes[codes.length] = m
								}
								var mrc = codes.length
								if (mrc > 0) {
									var ids = codes.join(",");
									gridPanel.doDelete(mrc, ids)
								} else {
									ds.reload();
								}
								if (!dydaView) {
									if (gridPanel.getTopToolbar().items
											.get('add'))
										gridPanel.getTopToolbar().items
												.get('add').enable();
									if (gridPanel.getTopToolbar().items
											.get('del'))
										gridPanel.getTopToolbar().items
												.get('del').disable();
								}
							}
						}, gridPanel);
			}
		},
		listeners : {
			'aftersave' : function(grid, idsOfInsert, idsOfUpdate, _primaryKey,
					_bean) {
				if (!dydaView) {
					if (grid.getTopToolbar().items.get('add'))
						grid.getTopToolbar().items.get('add').enable();
					if (grid.getTopToolbar().items.get('save'))
						grid.getTopToolbar().items.get('save').disable();
					if (grid.getTopToolbar().items.get('del'))
						grid.getTopToolbar().items.get('del').disable();
				}
				if(idsOfInsert){
	                var insertUids = idsOfInsert.split(",");
	                pcTzglService.initPcTzglMonthInvestD(CURRENTAPPID,idsOfInsert,function(){});
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
				var hql = "delete from " + bean2 + " where masterId='" + ids
						+ "'";
				baseDao.executeHQL(hql);
				if (!dydaView) {
					if (grid.getTopToolbar().items.get('add'))
						grid.getTopToolbar().items.get('add').enable();
					if (grid.getTopToolbar().items.get('del'))
						grid.getTopToolbar().items.get('del').disable();
				}
			},
			'rowclick' : function(grid, rowIndex, e) {
				m_grid_record = grid.getSelectionModel().getSelected();
				if (m_grid_record) {
					if (!dydaView) {
						if (m_grid_record.get('reportStatus') == 0
								|| m_grid_record.get('reportStatus') == 2) {
							if (grid.getTopToolbar().items.get('del'))
								grid.getTopToolbar().items.get('del').enable();
							if (grid.getTopToolbar().items.get('report'))
								grid.getTopToolbar().items.get('report')
										.enable();
						} else {
							if (grid.getTopToolbar().items.get('del'))
								grid.getTopToolbar().items.get('del').disable();
							if (grid.getTopToolbar().items.get('report'))
								grid.getTopToolbar().items.get('report')
										.disable();
						}

					}
				} else {
					if (!dydaView) {
						if (grid.getTopToolbar().items.get('del'))
							grid.getTopToolbar().items.get('del').disable();
						if (grid.getTopToolbar().items.get('report'))
							grid.getTopToolbar().items.get('report').disable();
					}
				}
			},
			'beforeedit' : function(e) {
				if (e.record.get('reportStatus') == 1)
					return false;
				if (!dydaView) {
					if (gridPanel.getTopToolbar().items.get('report'))
						gridPanel.getTopToolbar().items.get('report').disable();
				}
//				if (e.record.isNew !== true)
//					return false;
			},
			'afteredit' : function(o) {
				if (o.grid.getTopToolbar().items.get('save'))
					o.grid.getTopToolbar().items.get('save').enable();
				if (o.field === "sjType") {
					var display_value = "";
					for (var i = 0; i < array_yearMonth.length; i++) {
						if (o.value == array_yearMonth[i][0]) {
							display_value = array_yearMonth[i][1];
						}
					}
					o.record.set("title", CURRENTAPPNAME+display_value
									+ "投资完成情况表");
				}
			}
		},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
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
		}
	}
	
	function reportFn() {
		var m_record = gridPanel.getSelectionModel().getSelected();
		var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});
		if (m_record == null) {
			Ext.example.msg('提示', '请选中一条记录！', 2);
			return;
		} else {
			baseDao.findByWhere2("com.sgepit.pcmis.tzgl.hbm.PcTzglMonthInvestD",
					"sj_type='" + m_record.get('sjType') + "' and pid='"
							+ m_record.get('pid') + "'", function(list) {
				if (list.length > 0) {
					DWREngine.setAsync(false);
//					var hql="from PcTzglMonthCompM t where t.sjType='"+m_record.get('sjType')+"' and t.pid='"+edit_pid+"'";
//					baseDao.findByHql(hql,function(list){
//						if(list[0].flagNull == '1'){
//						   alert("有单元格未填写，请填写完整。填写说明见：\n系统右上角【帮助—系统使用帮助—报表填写说明】"); 
//						}else{
				            Ext.MessageBox.confirm('确认', '上报后将不可修改，确认要上报吗？',function(btn, text) {
								if (btn == "yes") {
									var selectRecords = gridPanel.getSelectionModel().getSelected();
									var uids = "";
									if (selectRecords != "") {
										var reportStatus = selectRecords.get('reportStatus')
										if (reportStatus != 1) {
											uids = selectRecords.get('uids');
											// 投资管理【月度完成】上报
											myMask.show();
											pcTzglService.submitReportFormXmdwToJt(uids,edit_pid,'投资完成情况报表上报',REALNAME,CURRENTAPPNAME,
												function(flag) {
													myMask.hide();
													if (flag == "1") {
														Ext.example.msg('','操作成功！')
														gridPanel.store.reload();// 刷新页面
														if (gridPanel.getTopToolbar().items.get('del'))
															gridPanel.getTopToolbar().items.get('del').disable();
														if (gridPanel.getTopToolbar().items.get('report'))
															gridPanel.getTopToolbar().items.get('report').disable();
													} else {
														Ext.example.msg('','操作失败！',2)
													}
												});
										}
									}
									gridPanel.getStore().reload();
							     	}
						      }, this);
//						    }
//				    	})
				    	DWREngine.setAsync(true);
				} else {
					Ext.Msg.show({
						title : '提示',
						msg : "报表未录入，请先录入！",
						buttons : Ext.Msg.OK,
						fn : showEditWindow2,
						icon : Ext.Msg.WARNING
					})
				}
			})
		}
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
	var xgridUrl = CONTEXT_PATH
			+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
	var record = gridPanel.getSelectionModel().getSelected();
	if (record.get('uids') == '') {
		Ext.example.msg("提示", "请先保存此条记录");
	} else {
		var param = new Object()
		param.sj_type = '2013'; // 时间
		param.unit_id = CURRENTAPPID; // 取表头用
		param.company_id = ''; // 取数据用（为空是全部单位）
		param.editable = true; // 是否能编辑，不传为不能编辑
		param.hasSaveBtn = true;
		if(dydaView||ModuleLVL>2||record.get('reportStatus') == '1'||record.get('reportStatus') == '3'){
        	param.editable=false;
        	param.hasSaveBtn = false;
        }
        param.headtype = 'PC_TZGL_MONTH_INVEST_REPORT';
		param.keycol = 'uids';
		param.xgridtype = 'grid';
		param.initInsertData = "pid`" + CURRENTAPPID;
		param.filter = " and Pc_Tzgl_Month_Invest_d.pid='"+CURRENTAPPID+"' and Pc_Tzgl_Month_Invest_d.sj_type='"+record.get('sjType')+"'"
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window.showModelessDialog(xgridUrl, param,
						"dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
}