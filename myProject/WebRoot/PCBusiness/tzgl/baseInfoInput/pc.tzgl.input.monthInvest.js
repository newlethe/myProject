var bean = "com.sgepit.pcmis.tzgl.hbm.VPcTzglMonthCompM"
var bean2 = "com.sgepit.pcmis.tzgl.hbm.PcTzgkMonthCompDetail"
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
				width : 60,
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
				width : 200,
				align : 'center',
				dataIndex : 'title',
				renderer : function(v) {
					return "<a href='javascript:showEditWindow2()'>" + v
							+ "</a>";
				}
			},  {
				id : 'createperson',
				type : 'string',
				header : "填报人",
				width : 100,
				dataIndex : 'createperson',
				align : 'center',
				editor : new Ext.form.TextField({name : 'createperson', allowBlank : true})
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
				width : 60,
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
				name : 'billState',
				type : 'float'
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
				name : 'reason',
				type : 'string'
			}, {
				name : 'backUser',
				type : 'string'
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
		billState : '',
		reportStatus : '',
		memo : '',
		createperson : REALNAME,
		createDate : new Date(),
		lastModifyDate : '',
		userId : USERID
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
									+ "投资完成月度报表");
				}
			}
		},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : "com.sgepit.pcmis.tzgl.hbm.PcTzglMonthCompM",
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
			baseDao.findByWhere2("com.sgepit.pcmis.tzgl.hbm.PcTzgkMonthCompDetail",
					"sj_type='" + m_record.get('sjType') + "' and unit_id='"
							+ m_record.get('pid') + "'", function(list) {
				if (list.length > 0) {
					for(var i in sign){
						if(Ext.isEmpty(m_record.get(sign[i].id))){
							//报表模板改变，去掉相关的签字验证，yanglh 2014-02-14
//							alert("'"+sign[i].label+"'  不能为空! 请在报表中填写完整。");
//							return;
						}
					}
					DWREngine.setAsync(false);
					var hql="from PcTzglMonthCompM t where t.sjType='"+m_record.get('sjType')+"' and t.pid='"+edit_pid+"'";
					baseDao.findByHql(hql,function(list){
						if(list[0].flagNull == '1'){
						   alert("有单元格未填写，请填写完整。填写说明见：\n系统右上角【帮助—系统使用帮助—报表填写说明】"); 
						}else{
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
											pcTzglService.xmdwSubmitReport2(uids,'2',edit_pid,'月度投资完成月报上报二级企业',REALNAME,
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
						    }
				    	})
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

var sign = {
	memoVar1:{label:'单位负责人',id:'unitUsername',column:'UNIT_USERNAME'},
	memoVar2:{label:'统计负责人',id:'countUsername',column:'COUNT_USERNAME'},
	memoVar3:{label:'联系方式',id:'createpersonTel',column:'CREATEPERSON_TEL'},
	userId:{label:'填报人',id:'createperson',column:'CREATEPERSON'}
}

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
		var record = gridPanel.getSelectionModel().getSelected();
		var params = {
			p_type : 'TZGK_MONTH_REPORT',
			p_date : record.get('sjType'),
			p_corp : edit_pid,
			p_key_col : 'MASTER_ID',
			p_key_val : record.get('uids'),
			openCellType : 'open',
			p_checkNull : true,
			savable : record.get('reportStatus') == '0'
					|| record.get('reportStatus') == '2',
			onCellOpened : onCellOpened,
			afterCellSaved : afterCellSaved
//			,//后期集团报表调整，去掉负责人等签字，yanglh 2014-02-14
//			beforeCellSaved:beforeCellSaved
		}
		var cellUrl = "/" + ROOT_CELL + "/cell/eReport.jsp";
		window.showModalDialog(cellUrl, params, "dialogWidth:"
						+ screen.availWidth + ";dialogHeight:"
						+ screen.availHeight + ";center:yes;resizable:yes;");
		gridPanel.getStore().reload();
	}
}
var CellDoc=null;
// 打开报表时，写入备注字段
function onCellOpened(CellWeb1) {
	var record = gridPanel.getSelectionModel().getSelected();
	var reportId = record.get('uids');
	
	CellDoc=new CellXmlDoc(CellWeb1);
	DWREngine.setAsync(false);
	pcTzglService.findDataByTableId("Pc_Tzgl_Month_Comp_M","uids='"+reportId+"'",function(masterRecord){
		CellDoc.replaceSign(masterRecord);
	});
	DWREngine.setAsync(true);
}

// 报表保存的时候，只保存填写的备注字段的数据。
function afterCellSaved(CellWeb1,v_checkNullResult) {
    var  flag = 0;
    var sql ='';
	var m_record=gridPanel.getSelectionModel().getSelected();
	if(!m_record) return;
	var dataMap=CellDoc.getValues();
	if(dataMap&&dataMap.length>0){
		pcTzglService.updateDataByTableId("Pc_Tzgl_Month_Comp_M", " uids='" + m_record.get('uids') + "'", dataMap, function(){
            if(v_checkNullResult == true){
               flag = 0;//报表中单元格不为空
            }else{
                flag = 1;//报表中存在单元格为空
            }
            sql = "update pc_tzgl_month_comp_m t set t.flag_null='"+flag+"' where t.sj_type='"+m_record.get('sjType')+"' and t.unit_id='"+edit_pid+"'";
            baseDao.updateBySQL(sql);
			gridPanel.getStore().load();
			});
	}
}

function beforeCellSaved(CellWeb1,win){
	var signCells=CellDoc.signCells;
	for(var i in sign){
		var tag=sign[i].column;
		var flag =  win.isNull(signCells[tag].c,signCells[tag].r,signCells[tag].s);
		if(flag=="1"){//单元格数据为空
			return {success:false,msg:"'"+sign[i].label+"为必填项'"}
		}
	}
	return {success:true};	
}
