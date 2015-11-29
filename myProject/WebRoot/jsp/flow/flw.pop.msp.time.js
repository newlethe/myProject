var bean = "com.sgepit.frame.flow.hbm.PopMspTime";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";
var ds;

Ext.onReady(function() {
			var fc = {
				'uids' : {
					name : 'uids',
					fieldLabel : '主键'
				},
				'pid' : {
					name : 'pid',
					fieldLabel : '主键'
				},
				'schemName' : {
					name : 'schemName',
					fieldLabel : '计划名'
				},
				'beginTime' : {
					name : 'beginTime',
					fieldLabel : '上班时间'
				},
				'endTime' : {
					name : 'endTime',
					fieldLabel : '下班时间'
				},
				'schemTime' : {
					name : 'schemTime',
					fieldLabel : '定时发送时间'
				},
				'isWeekendSend' : {
					name : 'isWeekendSend',
					fieldLabel : '周末是否发送'
				},
				'isUsing' : {
					name : 'isUsing',
					fieldLabel : '是否使用'
				},
				'isOpen' : {
					name : 'isOpen',
					fieldLabel : '是否开启短信发送功能'
				},
				'timeout' : {
					name : 'timeout',
					fieldLabel : '超时提醒'
				}
			};

			var Columns = [{
						name : 'uids',
						type : 'string'
					}, {
						name : 'pid',
						type : 'string'
					}, {
						name : 'schemName',
						type : 'string'
					}, {
						name : 'beginTime',
						type : 'string'
					}, {
						name : 'endTime',
						type : 'string'
					}, {
						name : 'schemTime',
						type : 'string'
					}, {
						name : 'isWeekendSend',
						type : 'string'
					}, {
						name : 'isUsing',
						type : 'string'
					}, {
						name : 'isOpen',
						type : 'string'
					}, {
						name : 'timeout',
						type : 'string'
					}];
			var sm = new Ext.grid.CheckboxSelectionModel({singleSelect : true});

			var cm = new Ext.grid.ColumnModel([sm, {
						id : fc['uids'].name,
						header : fc['uids'].fieldLabel,
						dataIndex : fc['uids'].name,
						hidden : true
					}, {
						id : fc['pid'].name,
						header : fc['pid'].fieldLabel,
						dataIndex : fc['pid'].name,
						hidden : true
					}, {
						id : fc['schemName'].name,
						header : fc['schemName'].fieldLabel,
						dataIndex : fc['schemName'].name,
						align : 'center',
						editor : new Ext.form.TextField(fc['schemName'])
					}, {
						id : fc['beginTime'].name,
						header : fc['beginTime'].fieldLabel,
						dataIndex : fc['beginTime'].name,
						align : 'center',
						editor : new Ext.form.TimeField({
									minValue : '7:00',
									maxValue : '19:00',
									increment : 30,
									format : 'G:i',
									allowBlank : false
								})
					}, {
						id : fc['endTime'].name,
						header : fc['endTime'].fieldLabel,
						dataIndex : fc['endTime'].name,
						align : 'center',
						editor : new Ext.form.TimeField({
									minValue : '7:00',
									maxValue : '19:00',
									increment : 30,
									format : 'G:i',
									allowBlank : false
								})
					}, {
						id : fc['schemTime'].name,
						header : fc['schemTime'].fieldLabel,
						dataIndex : fc['schemTime'].name,
						align : 'center',
						editor : new Ext.form.TimeField({
									minValue : '7:00',
									maxValue : '19:00',
									increment : 30,
									format : 'G:i',
									allowBlank : false
								})
					}, {
						id : fc['isWeekendSend'].name,
						header : fc['isWeekendSend'].fieldLabel,
						dataIndex : fc['isWeekendSend'].name,
						align : 'center',
						editor : new Ext.form.Checkbox(fc['isWeekendSend']),
						renderer : function(v, m, r) {
							return v == "1" ? "是" : "否";
						}
					}, {
						id : fc['isUsing'].name,
						header : fc['isUsing'].fieldLabel,
						dataIndex : fc['isUsing'].name,
						align : 'center',
						editor : new Ext.form.Checkbox(fc['isUsing']),
						renderer : function(v, m, r) {
							return v == "1" ? "是" : "否";
						}
					}, {
						id : fc['isOpen'].name,
						header : fc['isOpen'].fieldLabel,
						dataIndex : fc['isOpen'].name,
						hidden : true,
						renderer : function(v) {
							return v == "1" ? "是" : "否";
						}
					}, {
						id : fc['timeout'].name,
						header : fc['timeout'].fieldLabel,
						dataIndex : fc['timeout'].name,
						hidden : true
					}]);
			cm.defaultSortable = true;

			ds = new Ext.data.Store({
						baseParams : {
							ac : 'list',
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
									id : 'uids'
								}, Columns),
						remoteSort : true,
						pruneModifiedRecords : true
					})
			ds.setDefaultSort('uids','desc');
			ds.on('load', function(){
				if (ds.getCount() > 0){
					var rec = ds.getAt(0);
					if (rec.get('isOpen') == '1'){
						document.getElementById('isOpenCheck').checked = true;
					} else {
						document.getElementById('isOpenCheck').checked = false;
					}
				}
			})
			var Plant = Ext.data.Record.create(Columns);

			var PlantInt = {
				uids : '',
				pid : CURRENTAPPID,
				schemName : '',
				beginTime : '',
				endTime : '',
				schemTime : '',
				isWeekendSend : '',
				isUsing : '',
				isOpen : '',
				timeout : ''
			};

			var grid = new Ext.grid.EditorGridTbarPanel({
						store : ds,
						cm : cm,
						sm : sm,
						tbar : ['设置短信发送时间'],
						border : false,
						layout : 'fit',
						region : 'center',
						clicksToEdit : 1,
						addBtn : true,
						saveBtn : true,
						delBtn : true,
						header : false,
						autoScroll : true,
						loadMask : true,
						stripeRows : true,
						trackMouseOver : true,
						viewConfig : {
							forceFit : true,
							ignoreAdd : true,
							getRowClass : function(rec, rowIndex, rowparams, ds) {
								if (rec.get('isUsing') == '1') {
									return 'grid-record-yollow';
								}
								return '';
							}
						},
						bbar : new Ext.PagingToolbar({ // 在底部工具栏上添加分页导航
							pageSize : PAGE_SIZE,
							store : ds,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录。"
						}),
						plant : Plant,
						plantInt : PlantInt,
						servletUrl : MAIN_SERVLET,
						bean : bean,
						business : business,
						primaryKey : primaryKey,
						saveHandler : function(){
							var recs = ds.getModifiedRecords();
							var useCount = 0;
							if (recs.length == 0){
								return false;
							}
							for (var i = 0; i < ds.getCount(); i++) {
								var record = ds.getAt(i);
								var begin = record.get('beginTime').split(':');
								var end = record.get('endTime').split(':');
								var scheme = record.get('schemTime').split(':');
								if (parseInt(begin[0]) > parseInt(end[0])
										|| (parseInt(begin[0]) == parseInt(end[0]) && parseInt(begin[1]) >= parseInt(end[1]))){
									Ext.example.msg('提示','下班时间不能早于上班时间');
									return false;
								}
								if (parseInt(scheme[0]) < parseInt(begin[0])
										|| (parseInt(scheme[0]) == parseInt(begin[0]) && parseInt(scheme[1]) < parseInt(begin[1]))){
									Ext.example.msg('提示','定时发送时间不能早于上班时间');
									return false;
								}
								if (parseInt(scheme[0]) > parseInt(end[0])
										|| (parseInt(scheme[0]) == parseInt(end[0]) && parseInt(scheme[1]) > parseInt(end[1]))){
									Ext.example.msg('提示','定时发送时间不能晚于下班时间');
									return false;
								}
								var isOpen = document.getElementById('isOpenCheck').checked;
								var isUsing = record.get('isUsing');
								if (isUsing == true || isUsing == '1'){
									useCount = useCount + 1;
								}
								record.set('isUsing',
									record.get('isUsing') == true || record.get('isUsing') == '1' ? '1' : '0');
								record.set('isWeekendSend',
									record.get('isWeekendSend') == true || record.get('isWeekendSend') == '1' ? '1' : '0');
								record.set('isOpen', document.getElementById('isOpenCheck').checked ? '1' : '0');
							}
							if (isOpen == true && useCount != 1){
								Ext.example.msg('提示', '开启短信状态下,必须只有一个计划处于使用状态');
								return false;
							} else if (useCount > 1){
								Ext.example.msg('提示', '只能有一个计划处于使用状态');
								return false;
							}
							this.defaultSaveHandler();
						},
						deleteHandler : function(){
							var recs = ds.getModifiedRecords();
							if (recs.length > 0){
								Ext.example.msg('提示', '请先保存');
								return false;
							}
							var rec = sm.getSelected();
							var useCount = 0;
							if (typeof rec == 'undefined'){
								return false;
							}
							var isOpen = document.getElementById('isOpenCheck').checked;
							var isUsing = rec.get('isUsing');
							if (isOpen == true && isUsing == '1'){
								Ext.example.msg('提示', '开启短信状态下不可删除正在使用的计划');
								return false;
							}
							this.defaultDeleteHandler();
						}
					});

			ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});

			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
					});

			grid.getTopToolbar().add("<input type='checkbox' id='isOpenCheck' onclick='checkOpen(this)'>", '是否开启短信发送功能');
		});

function checkOpen(checkbox) {
	var val = checkbox.checked ? '1' : '0';
	var useCount = 0;
	for (var i = 0; i < ds.getCount(); i++) {
		var record = ds.getAt(i);
		var isUsing = record.get('isUsing');
		if (isUsing == true || isUsing == '1'){
			useCount = useCount + 1;
		}
	}
	if (useCount > 1){
		Ext.example.msg('提示', '只能有一个计划处于使用状态');
		checkbox.checked = !checkbox.checked;
		return false;
	}
	Ext.Msg.show({
				title : '提示',
				msg : checkbox.checked ? '确定开启流程短信功能？' : '确定关闭流程短信功能？',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						var sql = "update pop_msp_time set is_open = '" + val + "'";
						baseDao.updateBySQL(sql);
					} else {
						checkbox.checked = !checkbox.checked;
						return false;
					}
				}
			})
};