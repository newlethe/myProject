var logGridPanel, logDetailPanel;
var logBeanName = 'com.sgepit.frame.dataexchange.hbm.PcDataExchangeLog';
var logDetailBeanName = 'com.sgepit.frame.dataexchange.hbm.PcDataExchangeLogDetail';
var currentLogId;
var pageSize = 20;
var detailPageSize = 8;

Ext.onReady(function() {
	DWREngine.setAsync(false);
    var prjArray=new Array();
    var sql = 'select unitid, unitname,unit_type_id from sgcc_ini_unit order by unitid asc';
    var unitList = new Array();
	baseMgm.getData(sql,function(list){ 
		unitList = list;
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			prjArray.push(temp);			
		}
    }); 
    DWREngine.setAsync(true);
    //过滤出项目单位和集团公司
    var unitArray = new Array();
    for(var i=0,j=unitList.length;i<j;i++){
    	if(unitList[i][2]=="0"||unitList[i][2]=="A"||unitList[i][2]=="2"){
    		unitArray.push([unitList[i][0],unitList[i][1]])
    	}
    }
    //发送单位
    var fromStore = new Ext.data.SimpleStore({
    	fields : ['k', 'v'],
    	data : [['all','所有发送单位']].concat(unitArray)
    });
	var fromCombo = new Ext.form.ComboBox({
			mode : 'local',
			store : fromStore,
			triggerAction : 'all',
			width:200,
			valueField : 'k',
			displayField : 'v',
			editable : false,
			name : 'fromunit',
			value : 'all',
			listeners:{
				select:doLoad
			}
	});
    //接收单位
    var toStore = new Ext.data.SimpleStore({
    	fields : ['k', 'v'],
    	data : [['all','所有接收单位']].concat(unitArray)
    });
	var toCombo = new Ext.form.ComboBox({
		mode : 'local',
		store : toStore,
		triggerAction : 'all',
		width:200,
		valueField : 'k',
		displayField : 'v',
		editable : false,
		name : 'tounit',
		value : 'all',
		listeners:{
			select:doLoad
		}
	});
	// 日志类型下拉框
	var successTypeCombo = new Ext.form.ComboBox({
			mode : 'local',
			width:80,
			store : new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [['all', '成功&失败'], ['1', '交互成功'], ['0', '交互失败']]
			}),
			triggerAction : 'all',
			valueField : 'k',
			displayField : 'v',
			editable : false,
			name : 'successType',
			value : '0',
			listeners:{
				select:doLoad
			}
	});
	// 日志类型下拉框
	var comboDisabled = filterMode == '1';
	var exchangeTypeStore = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : [['all', '所有日志'], ['send', '发送日志'], ['receive', '接收日志']]
	});
	var exchangeTypeCombo = new Ext.form.ComboBox({
				mode : 'local',
				store : exchangeTypeStore,
				width:80,
				triggerAction : 'all',
				valueField : 'k',
				displayField : 'v',
				editable : false,
				name : 'exchangeType',
				value : 'all',
				disabled : comboDisabled,
				listeners:{
					select:doLoad
				}
	});
	function doLoad(){
		try{
			pageSize = logGridPanel.getBottomToolbar().pageSize;
		}catch(e){ }
		
		var whereStr = "1=1 ";
		var successType = successTypeCombo.getValue();
		var excType = exchangeTypeCombo.getValue();
		var from = fromCombo.getValue();
		var to = toCombo.getValue();
		
		if(successType!="all"){
			whereStr+="and spare_n1="+successType;
		}
		if(excType!="all"){
			whereStr+="and log_type='"+excType+"' ";
		}
		if(from!="all"){
			whereStr+="and fromunit='"+from+"' ";
		}
		if(to!="all"){
			whereStr+="and tounit='"+to+"' ";
		}
		logDs.baseParams.params = whereStr;
		logDs.load({
			params : {
				start : 0,
				limit : pageSize
			},
			callback:function(){
				try{
					logSm.clearSelections();
					var checker = (Ext.select('.x-grid3-hd-checker-on',true,logGridPanel.getView().innerHd).first());
	                checker.removeClass('x-grid3-hd-checker-on');
				}catch(e){
				}
			}
		});
	}
    var prjStore = new Ext.data.SimpleStore({
    	fields : ['k', 'v'],
    	data : prjArray
    });
    
	var logSm = new Ext.grid.CheckboxSelectionModel({});
	logSm.on('selectionchange', function(sm, idx, r) {
			var selRecs = logSm.getSelections()
			if(selRecs.length==1){
				currentLogId = selRecs[0].data.uids;
			}else{
				currentLogId = "-1";
			}
			reloadDetailPanel();
		});
	// 主表列结构
	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'txGroupId',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'fromunit',
				type : 'string'
			}, {
				name : 'tounit',
				type : 'string'
			}, {
				name : 'logDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'logContent',
				type : 'string'
			}, {
				name : 'logType',
				type : 'string'
			}, {
				name : 'spareC1',
				type : 'string'
			}, {
				name : 'spareC2',
				type : 'string'
			}, {
				name : 'spareN1',
				type : 'int'
			}
	];
	// 主表列模型
	var logCm = new Ext.grid.ColumnModel([logSm,new Ext.grid.RowNumberer(),{
				dataIndex : 'uids',
				header : 'uids',
				hidden : true
			}, {
				dataIndex : 'txGroupId',
				header : '事务编号',
				hidden:true,
				width : 150
			}, {
				dataIndex : 'fromunit',
				header : '发送单位',
				width : 150,
				renderer : function ( value ){
					var txt = value;
					prjStore.each(function(r){
						if(r.get('k')==value){
							txt =  r.get('v') ;
						}
					})
					return txt;
				}
			}, {
				dataIndex : 'tounit',
				header : '接受单位',
				width : 150,
				renderer : function ( value ){
					var txt = value;
					prjStore.each(function(r){
						if(r.get('k')==value){
							txt =  r.get('v') ;
						}
					})
					return txt;
				}
			}, {
				dataIndex : 'logDate',
				header : '记录时间',align:'center',
				renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
				width : 130
				// Ext内置日期renderer
			}, {
				id : 'logContent',
				dataIndex : 'logContent',
				width : 300,
				header : '日志内容（双击打开窗口查看）',
				renderer: function(data, metadata, record){
					metadata.attr = 'title="' + data + '"';
					if(record.get('spareN1')==0){
						return  '<font color=red>'+data+'</font>';
					}else{
						return  data;
					}
				}
			}, {
				dataIndex : 'spareC1',
				header : '前置事件',
				width : 80,
				align:'center',
				renderer : function(val) {
					if (val) {
						return '&lt;查看&gt;';
					} else {
						return '(空)';
					}
				}
			}, {
				dataIndex : 'spareC2',
				header : '后置事件',
				width : 80,
				align:'center',
				renderer : function(val) {
					if (val) {
						return '&lt;查看&gt;';
					} else {
						return '(空)';
					}
				}
			}, {
				dataIndex : 'logType',
				header : '日志类型',
				renderer : function(value) {
					if (value == 'send') {
						return '<font color="blue">数据发送</font>';
					} else if (value == 'receive') {
						return '<font color="green">数据接收</font>';
					} else {
						return value;
					}
				},
				width : 75
			}]);
	logCm.defaultSortable = true;

	var logDs = new Ext.data.Store({
				baseParams : {
					ac : 'list', // 表示取列表
					bean : logBeanName,
					business : "baseMgm",
					method : "findWhereOrderby"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : "uids"
						}, Columns),
				remoteSort : true
			});
	logDs.setDefaultSort('logDate', 'DESC');

	if (filterMode == '1') {
		logDs.baseParams.params = "tx_group_id in " + filterInStr;
	}
	var deleteBtn = new Ext.Toolbar.Button({
		text:'删除',
		iconCls : 'remove',
		handler:function(){
			var selRecs = logSm.getSelections()
			if(selRecs.length>0){
				Ext.Msg.confirm('提示','删除后不可恢复,是否继续?',function(txt){
					if(txt=="yes"){
						DWREngine.setAsync(false);
						var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"数据删除中……"});
						myMask.show();
						var uids = "";
						for(var i=0;i<selRecs.length;i++){
							uids+=",'"+selRecs[i].data.uids+"'";
							if(uids.length>1000){
								uids = uids.substring(1);
								var delLogSql= "delete from pc_data_exchange_log_detail where log_id in ("+uids+")";
								var delDetailSql= "delete from pc_data_exchange_log where uids in ("+uids+")";
								baseDao.updateBySQL(delDetailSql,function(flag){
									baseDao.updateBySQL(delLogSql,function(flag){
										uids="";
									});
								})
							}
						}
						
						if(uids.length>0){
							uids = uids.substring(1);
							var delLogSql= "delete from pc_data_exchange_log_detail where log_id in ("+uids+")";
							var delDetailSql= "delete from pc_data_exchange_log where uids in ("+uids+")";
							baseDao.updateBySQL(delDetailSql,function(flag){
								baseDao.updateBySQL(delLogSql,function(flag){
									uids="";
								});
							})
						}
						DWREngine.setAsync(true);
						myMask.hide();
						doLoad();
					}
				})
			}
		}
	});
	
	
	var deleteAllBtn = new Ext.Toolbar.Button({
		text:'全部删除',
		iconCls : 'remove',
		handler:function(){
			Ext.Msg.confirm('提示','删除后不可恢复,是否继续?',function(txt){
				if(txt=="yes"){
					DWREngine.setAsync(false);
					var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"数据删除中……"});
					var delDetailSql= "delete from pc_data_exchange_log_detail";
					var delLogSql= "delete from pc_data_exchange_log";
					var arrSql = new Array();
					arrSql.push(delDetailSql);
					arrSql.push(delLogSql);
					
					myMask.show();
					baseDao.updateByArrSQL(arrSql,function(flag){
						myMask.hide();
						if(flag){
							doLoad();
						}else{
							Ext.example.msg('提示','操作失败!');
						}
					})
				}
			})
		}
	});
	
	var refreshBtn = new Ext.Toolbar.Button({
		text:'刷新',
		iconCls : 'refresh',
		handler:doLoad
	});
	logGridPanel = new Ext.grid.GridPanel({
				region : 'north',
				ds : logDs,
				cm : logCm,
				sm : logSm,	
				tbar : [deleteBtn,'-',deleteAllBtn,'-',refreshBtn,'->',fromCombo,'-',toCombo,'-',successTypeCombo,'-',exchangeTypeCombo],
				loadMask : true,
				viewConfig : {
					forceFit:(screen&&screen.width&&screen.width>1024)?true:false,
					ignoreAdd : true
				},
				bbar : new Ext.ux.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : pageSize,
					store : logDs,
					maxSize:50,
					displayInfo : true
				}),
				anchor : '100%, 60%',
				split : true
			});
	logGridPanel.on('celldblclick', function(grid, rowIndex, columnIndex, e) {
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
				var isShowWin = false;
				if(fieldName=="logContent"||fieldName=="spareC1"||fieldName=="spareC2"){
					isShowWin=true;
				}
				
				var rec = grid.getStore().getAt(rowIndex);
				if (rec&&isShowWin) {
					var rowData = rec.data
					if(!rowData[fieldName]) return;
					var win = new Ext.Window({
								width : 600,
								height : 300,
								layout : 'fit',
								modal : true,
								items : [new Ext.form.TextArea({
											value : rowData[fieldName],
											readOnly : true

										})],
								buttonAlign : 'center',
								buttons : [{
										text : '复制',
										handler:function(){
											try{
												win.items.get(0).el.dom.select();
												window.clipboardData.setData("Text",rowData[fieldName]); 
											}catch(e){
												Ext.example.msg('提示','复制失败！')
											}
										}
									},{
										text : '关闭',
										handler : function() {
											win.close();
										}
								}]
							})
					win.show();
				}
			});

	// 从表列结构
	var DetailColumns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'txGroupId',
				type : 'string'
			}, {
				name : 'sqlData',
				type : 'string'
			}, {
				name : 'errorMessage',
				type : 'string'
			}, {
				name : 'logId',
				type : 'string'
			}];

	var detailSm = new Ext.grid.CheckboxSelectionModel({

	});
	// 详细表列模型
	var detailCm = new Ext.grid.ColumnModel({
				defaults : {
					sortable : false
				},
				columns : [new Ext.grid.RowNumberer(), {
							dataIndex : 'uids',
							header : 'uids',
							hidden : true
						}, {
							dataIndex : 'txGroupId',
							header : '事务id',
							hidden : true
						}, {
							id : 'sqlData',
							dataIndex : 'sqlData',
							header : 'SQL语句(点击打开窗口查看)'
						}, {
							dataIndex : 'errorMessage',
							header : '语句错误信息',
							width : 180
						}, {
							dataIndex : 'logId',
							header : '主表ID',
							hidden : true
						}]
			});

	var detailDs = new Ext.data.Store({
				baseParams : {
					ac : 'list', // 表示取列表
					bean : logDetailBeanName,
					business : 'baseMgm',
					method : 'findByProperty'
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : "uids"
						}, DetailColumns),
				remoteSort : true
			});
	detailDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'logId' + SPLITB + currentLogId;
			});

	logDetailPanel = new Ext.grid.GridPanel({
				region : 'center',
				ds : detailDs,
				cm : detailCm,
				sm : detailSm,
				loadMask : true,
				autoExpandColumn : 'sqlData',
				viewConfig : {
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : detailPageSize,
					store : detailDs,
					displayInfo : true

				}),
				anchor : '100%, 40%'
			});

	logDetailPanel.on('cellclick', function(grid, rowIndex, columnIndex, e) {
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
				if (fieldName == 'sqlData') {
					var rec = grid.getStore().getAt(rowIndex);
					if (rec) {
						var win3 = new Ext.Window({
									width : 600,
									height : 300,
									layout : 'fit',
									modal : true,
									items : [new Ext.form.TextArea({
												value : rec.data.sqlData,
												cls : 'codeField',
												readOnly : true

											})],
									buttonAlign : 'center',
									buttons : [{
										text : '复制',
										handler:function(){
											try{
												win3.items.get(0).el.dom.select();
												window.clipboardData.setData("Text",rec.data.sqlData); 
											}catch(e){
												Ext.example.msg('','复制失败！')
											}
										}
									},{
												text : '关闭',
												handler : function() {
													win3.close();
												}
											}]
								})
						win3.show();

					}
				}

			});

	var viewport = new Ext.Viewport({
				layout : 'anchor',
				items : [logGridPanel, logDetailPanel]
			});
	doLoad();
	function reloadDetailPanel() {
		if (currentLogId) {
			detailDs.load({
						params : {
							start : 0,
							limit : detailPageSize
						}
					});
		}
	}

});