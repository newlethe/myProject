var bean = "com.sgepit.pmis.equipment.hbm.EquSupervisionReport";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "createdate";

var reportType = [['1', '周报'], ['2', '月报']];
var reportStat = [['0', '未上报'], ['1', '已上报']];
var gridpanel = null;
var RW = parseInt(ModuleLVL) < 3 ? true : false; //全局判断是否显示顶部工具栏按钮以及附件上传还是查看
Ext.onReady(function() {
	var Columns = [{
				name : 'pid',
				type : 'string'
			}, {
				name : 'uids',
				type : 'string'
			}, {
				name : 'createdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'createperson',
				type : 'string'
			}, {
				name : 'type',
				type : 'string'
			}, {
				name : 'reportname',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'reportStat',
				type : 'string'
			}, {
				name : 'reportunit',
				type : 'string'
			}]

	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					params : ""
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
	ds.setDefaultSort(orderColumn, 'desc');
	var fm = Ext.form;
	// 创建可编辑配置区域
	var fc = { // 创建编辑域配置
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'uids' : {
			name : 'uids',
			fieldLabel : 'UIDS'
		},
		'createdate' : {
			name : 'createdate',
			fieldLabel : '报告日期',
			format : 'Y-m-d',
			minValue : '2010-01-01'
		},
		'createperson' : {
			name : 'createperson',
			fieldLabel : '报告撰写人'
		},
		'type' : {
			name : 'type',
			fieldLabel : '报告类型',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			triggerAction : 'all',
			lazyRender : false,
			listClass : 'x-combo-list-small',
			store : new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : [['1', '周报'], ['2', '月报']]
					})
		},
		'reportname' : {
			name : 'reportname',
			fieldLabel : '报告名称'
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注'
		},
		'reportStat' : {
			name : 'reportStat',
			fieldLabel : '上报状态',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			triggerAction : 'all',
			lazyRender : false,
			listClass : 'x-combo-list-small',
			store : new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : [['0', '未上报'], ['1', '已上报']]
					}),
			anchor : '95%',
			align : 'center'
		},
		'reportunit' : {
			name : 'reportunit',
			fieldLabel : '报告单位'
		}
	}
	// 编辑区域配置完成-------------------------------------
	// 创建列模型
	var sm = new Ext.grid.CheckboxSelectionModel({
				header : '',
				singleSelect : true
			})
	var cm = new Ext.grid.ColumnModel([sm, {
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'createdate',
				header : fc['createdate'].fieldLabel,
				dataIndex : fc['createdate'].name,
				width : 120,
				editor : (RW ? new fm.DateField(fc['createdate']) : null),
				renderer : formatDate,
				align : 'center'
			}, {
				id : 'createperson',
				header : fc['createperson'].fieldLabel,
				dataIndex : fc['createperson'].name,
				hidden : true,
				width : 140,
				editor : (RW ? new fm.TextField(fc['createperson']) : null)
			}, {
				id : 'type',
				header : fc['type'].fieldLabel,
				dataIndex : fc['type'].name,
				editor : (RW ? new fm.ComboBox(fc['type']) : null),
				renderer : typeShow,
				align : 'center'
			}, {
				id : 'reportname',
				header : fc['reportname'].fieldLabel,
				dataIndex : fc['reportname'].name,
				width : 220,
				editor : (RW ? new fm.TextField(fc['reportname']) : null),
				align : 'center'
			}, {
				id : 'memo',
				header : fc['memo'].fieldLabel,
				dataIndex : fc['memo'].name,
				width : 120,
				hidden : true,
				editor : (RW ? new fm.TextField(fc['memo']) : null),
				align : 'center'
			}, {
				id : 'uids',
				header : '附件',
				dataIndex : fc['uids'].name,
				hidden : false,
				align : 'center',
				width : 100,
				renderer : function(v, m, r) {
					if (r.isNew) {
						return '';
					} else {
						var status = r.get("reportStat");
						var enable = '1';
						if (!RW || status == '1') {
							enable = '';
						}
						return "<a href='javascript:uploadfile(\"" + v
								+ "\",\"" + enable + "\")'>" + '附件' + "</a>"
					}
				}
            }, {
                id : 'reportunit',
                header : fc['reportunit'].fieldLabel,
                dataIndex : fc['reportunit'].name,
                width : 150,
                align : 'center',
                editor : (RW ? new fm.TextField(fc['reportunit']) : null)
			}, {
				id : 'reportStat',
				header : fc['reportStat'].fieldLabel,
				dataIndex : fc['reportStat'].name,
				hidden : true,
				align : 'center',
				//editor : (RW?new fm.ComboBox(fc['reportStat']):null),
				renderer : statShow
			}]);
	// 列模型创建完毕

	// 创建显示批文办理情况的grid
	gridpanel = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				id : 'glGrid',
				ds : ds,
				cm : cm, // 列模型
				sm : sm,
				//                      title : '<center><b><font size=3>监理报告信息录入</font></b></center>',// 面板标题
				border : false, // 
				clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
				editable : false,
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				addBtn : RW,
				header : false,
				delBtn : RW,
				title : false,
				saveBtn : RW,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				tbar : [],// 顶部工具栏，可选
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : {
					uids : '',
					pid : CURRENTAPPID,
					createdate : SYS_DATE_DATE,
					createperson : '',
					reportname : '',
					reportStat : '0',
					type : '1',
					reportunit : USERORG,
					memo : ''
				},
				servletUrl : MAIN_SERVLET,
				bean : bean,
				primaryKey : "uids",
				saveHandler : function() {
					var record = this.getSelectionModel().getSelected();

					if (record == null) {
						Ext.example.msg('', '请选中一条记录!');
						return;
					} else if ((record.get('reportname') == '' || record
							.get('reportname') == null)) {
						Ext.example.msg('', '请填写报告名称!');
						return;
					} else if (record.get('reportunit') == ''
							|| record.get('reportunit') == null) {
						Ext.example.msg('', '请填写报告单位!');
					} else {
						this.defaultSaveHandler();
					}
				},
				deleteHandler : function() {
					var record = this.getSelectionModel().getSelected();
					if (record == null) {
						Ext.example.msg('', '请选中一条记录!');
						return;
					}
					var stat = record.get('reportStat');
					if (stat == '1') {
						Ext.example.msg('', '已上报的监理报告无法删除!');
						return;
					} else if (stat == '0') {
						var businessType = 'PCJianLiBaoGao';
						var whereSql = "TRANSACTION_TYPE='" + businessType
								+ "' and TRANSACTION_ID='" + record.get('uids')
								+ "'";
						var fileLshs = "";
						fileServiceImpl.geAttachListByWhere(whereSql, null,
								null, function(list) {
									if (list.length > 0) {
										for (var j = 0; j < list.length - 1; j++) {
											fileLshs += "'" + list[j].fileLsh
													+ "',";

											//1.删除附件表的从表(sgcc_attach_blob)中对应将要删除附件的记录
											fileServiceImpl
													.deleteAttachBlob(list[j]);
										}
										fileLshs += "'"
												+ list[list.length - 1].fileLsh
												+ "'";
										//2.删除附件(sgcc_attach_list)
										fileServiceImpl.deleteAttachList(
												fileLshs, null);
									}
								});

						this.defaultDeleteHandler();
					} else {
						Ext.example.msg('', '未知错误导致操作失效!');
					}
				},
				listeners : {
					beforeedit : function(o) {
						var rec = o.record;
						var unedit = rec.get('reportStat');
						if (unedit == '1') {
							return false
						} else {
							return true
						}
					},
					rowclick : function() {
						var record = gridpanel.getSelectionModel()
								.getSelected();
						var able = record.get('reportStat');

						if (able == '1' && RW) {
							//gridpanel.getTopToolbar().items.get('up').disable();
							gridpanel.getTopToolbar().items.get('del')
									.disable();
							gridpanel.getTopToolbar().items.get('save')
									.disable();

						} else if (able == 0 && RW) {
							//gridpanel.getTopToolbar().items.get('up').enable();
							gridpanel.getTopToolbar().items.get('del').enable();
							gridpanel.getTopToolbar().items.get('save')
									.enable();
						} else {
							return;
						}
					}
				}
			});

	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [gridpanel]
			})

	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	//    if(RW)
	//    {
	//        gridpanel.getTopToolbar().add(upBtn);
	//        gridpanel.header = null;
	//        gridpanel.tbar  = null;
	//    }

})


// 其他自定义函数(格式化)
function typeShow(value) {
	for (var i = 0; i < reportType.length; i++) {
		if (value == reportType[i][0]) {
			return reportType[i][1];
			break;
		}
	}
	return "";
}

function statShow(value) {
	for (var i = 0; i < reportStat.length; i++) {
		if (value == reportStat[i][0]) {
			return reportStat[i][1];
		}
	}
	return "";
}

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
}

function uploadfile(val, enable) {
	var param = {
		businessId : val,
		businessType : 'EquSupervisionReport',
		editable : enable
	};
	showMultiFileWin(param);
}
