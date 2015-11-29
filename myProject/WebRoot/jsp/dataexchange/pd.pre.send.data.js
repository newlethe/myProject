var beanName = "com.sgepit.frame.dataexchange.hbm.PcDataExchange";
var plantInt;
var txIds;

Ext.onReady(function() {

    var originalFunction = Ext.grid.GroupingView.prototype.interceptMouse;

    Ext.override(Ext.grid.GroupingView, {
        interceptMouse : function( e)
    	{
    	     if (e.getTarget().tagName == 'INPUT')
    	     {
    	         e.stopPropagation();
    	     }
    	     else
    	     {
    	         originalFunction.apply(this, arguments);
    	     }
    	}
    });
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
    unitArray.push(['all','所有单位'])
    for(var i=0,j=unitList.length;i<j;i++){
    	if(unitList[i][2]=="0"||unitList[i][2]=="A"){
    		unitArray.push([unitList[i][0],unitList[i][1]])
    	}
    }
    //发送单位
    var fromStore = new Ext.data.SimpleStore({
    	fields : ['k', 'v'],
    	data : unitArray
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
    	data : unitArray
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
    function doLoad(){
		var whereStr = "1=1 ";
		var from = fromCombo.getValue();
		var to = toCombo.getValue();
		
		if(from!="all"){
			whereStr+="and spareC1='"+from+"' ";
		}
		if(to!="all"){
			whereStr+="and pid='"+to+"' ";
		}
		exchangeListDs.baseParams.params = whereStr;
		exchangeListDs.load({
			params : {
				start : 0,
				limit : 20
			}
		});
	}
    var prjStore = new Ext.data.SimpleStore({
    	fields : ['k', 'v'],
    	data : prjArray
    });

	var sm = new Ext.grid.CheckboxSelectionModel({
		 header: '',
		renderer : function(v, p, record){
	        return '';
	    }
	});
	var cm = new Ext.grid.ColumnModel([sm,
			new Ext.grid.RowNumberer({
				width:30,
				header: '<input type="checkbox" class="cbx" name="cbxAll" onclick="checkAll(this)"/>'
			}), 
			{
				id : 'txGroup',
				header : '事务编号',
				dataIndex : 'txGroup',
				hidden : true
			},
			{
				id : 'tableName',
				header : '业务表',
				width : 100,
				dataIndex : 'tableName',
				editor : new Ext.form.TextField({
							name : 'tableName'
						}),
				groupable : false
			}, {

				id : 'keyValue',
				header : '主键键值(点击查看详细)',
				width : 100,
				dataIndex : 'keyValue',
				groupable : false,
				hidden:true
			}, {
				id : 'pid',
				header : '接受单位',
				dataIndex : 'pid',
				width : 70,
				groupable : false,
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
				id : 'spareC5',
				header : '发送单位',
				dataIndex : 'spareC5',
				width : 70,
				groupable : false,
				renderer : function ( value ){
					var txt = value;
					prjStore.each(function(r){
						if(r.get('k')==value){
							txt =  r.get('v');
						}
					})
					return txt;
				}
			},  {
				id : 'successFlag',
				header : '状态',
				dataIndex : 'successFlag',
				width : 22,
				align : 'center',
				groupable : false
			}, {
				id : 'successDate',
				header : '发送成功时间',
				dataIndex : 'successDate',
				renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'), // Ext内置日期renderer
				hidden : true,
				groupable : false
			}, {
				id : 'failCount',
				header : '失败次数',
				dataIndex : 'spareN1',
				width : 32,
				align : 'center',
				groupable : false
			}, {
				id : 'lastSendDate',
				header : '最近发送时间',
				dataIndex : 'spareD1',
				width : 80,
				renderer : Ext.util.Format.dateRenderer('Y/m/d H:i:s'),
				groupable : false
				// Ext内置日期renderer
			},{
				id : 'spareD2',
				header : '创建时间',
				dateIndex : 'spareD2',
				width : 80,
				renderer : function(v,m,r){
					return Ext.util.Format.date(new Date(r.get("spareD2")),'Y/m/d H:i:s')
				},
				groupable : false
			}, {
				id : 'sqlData',
				header : '自定义SQL',
				dataIndex : 'sqlData',
				align:'center',
				renderer : function(val) {
					if (val) {
						return '&lt;查看&gt;';
					} else {
						return '(空)';
					}
				},
				width : 40,
				groupable : false,
				sortable : false
			}, {
				id : 'spareC1',
				header : '前置事件',
				dataIndex : 'spareC1',
				align:'center',
				renderer : function(val) {
					if (val) {
						return '&lt;查看&gt;';
					} else {
						return '(空)';
					}
				},
				width : 40,
				groupable : false,
				sortable : false
			}, {
				id : 'spareC2',
				header : '后置事件',
				align:'center',
				dataIndex : 'spareC2',
				renderer : function(val) {
					if (val) {
						return '&lt;查看&gt;';
					} else {
						return '(空)';
					}
				},
				width : 40,
				groupable : false,
				sortable : false
			}, {
				id : 'blobCol',
				header : 'BLOB',
				dataIndex : 'blobCol',
				width : 50,
				align:'center',
				renderer : function(val) {
					if (val) {
						return val;
					} else {
						return '(无)';
					}
				},
				groupable : false
			}, {
				id : 'clobCol',
				header : 'CLOB/LONG',
				dataIndex : 'clobCol',
				width : 50,
				align:'center',
				renderer : function(val) {
					if (val) {
						return val;
					} else {
						return '(无)';
					}
				},
				groupable : false
			}, {
				id : 'bizInfo',
				header : '业务说明',
				dataIndex : 'bizInfo',
				hidden : true,
				groupable : false
			}]);
	cm.defaultSortable = true; // 设置是否可排序

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'tableName',
				type : 'string'
			}, {
				name : 'keyValue',
				type : 'string'
			}, {
				name : 'txGroup',
				type : 'string'
			}, {
				name : 'blobCol',
				type : 'string'
			}, {
				name : 'xh',
				type : 'int'
			}, {
				name : 'successFlag',
				type : 'string'
			}, {
				name : 'successFlag',
				type : 'string'
			}, {
				name : 'spareC1',
				type : 'string'
			}, {
				name : 'spareC5',
				type : 'string'
			}, {
				name : 'spareC2',
				type : 'string',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'spareN1',
				type : 'int'
			}, {
				name : 'spareD1',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'spareD2',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'sqlData',
				type : 'string'
			}, {
				name : 'bizInfo',
				type : 'string'
			}, {
				name : 'clobCol',
				type : 'string'
			}]

	exchangeListDs = new Ext.data.GroupingStore({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : beanName,
			business : "baseMgm",
			method : "findWhereOrderBy"
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
		sortInfo : {
			field : 'xh',
			direction : "asc"
		},
		groupField : 'txGroup',
		remoteSort : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
		
	
	reload();

	plantInt = {
		uids : '',
		tableName : '',
		keyValue : '',
		blobCol : ''
	};

	exchangeListGrid = new Ext.grid.GridPanel({
		region : 'center',
		ds : exchangeListDs, // 数据源
		cm : cm, // 列模型
		sm : sm,
		view : new Ext.grid.GroupingView({
			forceFit : true,
			groupTextTpl : '<span class="gridHeaderSubmitBtn">' +
						   '&nbsp;&nbsp;&nbsp;<input type="checkbox" onclick="checkSingle(this)" class="cbx" name="cbx" value="{[values.rs[0].data["txGroup"]]}" />' +
						   '</span>' +
						   '{[values.rs[0].data["bizInfo"] ?  ' +
					       '"<font color=green>业务说明:&nbsp;&nbsp;" + values.rs[0].data["bizInfo"] + ' +
					       '"</font>&nbsp;&nbsp;&nbsp;&nbsp;" : "&nbsp;&nbsp;&nbsp;&nbsp;"]}'+
						   '{text}'
		}),
		saveBtn : false,
		addBtn : false,
		delBtn : false,
		tbar : [{
					text:'<b>调试</b>',
					hidden:true,
					handler:function(){
						pcDataExchangeService.sendAllQueuedExchangeData()
					}
				},{
					text : 'SQL预览',
					tooltip : '查看进行交互时当前数据生成的SQL语句',
					iconCls:'option',
					handler : function() {
						var rec = sm.getSelected();
						if (rec) {
							pcDataExchangeService.createMergeSQL({
										tableName : rec.get("tableName"),
										keyValue : rec.get("keyValue")
									}, function(sql) {
										var win2 = new Ext.Window({
													width : 600,
													height : 300,
													layout : 'fit',
													modal : true,
													items : [new Ext.form.TextArea(
															{
																cls : 'codeField',
																readOnly : true,
																value : sql

															})],
													buttonAlign : 'center',
													buttons : [{
																text : '复制',
																handler:function(){
																	try{
																		win2.items.get(0).el.dom.select();
																		window.clipboardData.setData("Text",sql); 
																	}catch(e){
																		Ext.example.msg('提示','复制失败！')
																	}
																}
															},{
																text : '关闭',
																handler : function() {
																	win2.close();
																}
															}]
												});
										win2.show();
									});
						}
					}
				},'-',{
					text : '发送',
					tooltip: '将勾选的事务立即进行数据发送',
					iconCls:'option',
					handler : exchangeDataByTxId
				},'-',{
					text: '删除',
					iconCls:'remove',
					handler : function() {
						var txIds = new Array();
						var cbArr = document.getElementsByName('cbx');
						for ( var i = 0; i < cbArr.length; i++ ){
							if ( cbArr[i].checked )		txIds.push("'"+cbArr[i].value+"'");
						}
						if ( txIds.length == 0 )return;
						Ext.Msg.show({
							   title:'删除数据',
							   msg: '是否删除选中的事务数据?',
							   buttons: Ext.Msg.YESNO,
							   fn: function(buttonId){
							   		if ( buttonId == 'yes'){
							   			var mask = new Ext.LoadMask(Ext.getBody(), {
											msg : "删除中..."
										});
										var deleteSQL = "DELETE FROM PC_DATA_EXCHANGE WHERE TX_GROUP IN ("+txIds.join(",")+")";										
										mask.show();
							   			baseDao.updateBySQL(deleteSQL,function(num){
							   				mask.hide();
							   				if(num==0){
							   					Ext.example.msg('提示','操作失败！');
							   				}else{
							   					Ext.example.msg('提示','操作成功！');
							   					reload();
							   				}
							   			})
							   		}
							   },
							   icon: Ext.MessageBox.QUESTION
							});
					}
				},'-',{
					text:'刷新',
					iconCls : 'refresh',
					handler:doLoad
				},'->','<b>发送单位：</b>',fromCombo,'<b>接收单位：</b>',toCombo], // 顶部工具栏，可选
		iconCls : 'icon-by-category', // 面板样式
		//title : "数据交互队列管理",
		border : false, // 
		region : 'center',
		clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
		header : false, //
		autoScroll : true, // 自动出现滚动条
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.ux.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : exchangeListDs,
			displayInfo : true,
			maxSize:1000,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : Ext.data.Record.create(Columns),
		plantInt : plantInt,
		servletUrl : MAIN_SERVLET,
		bean : beanName,
		business : "baseMgm",
		primaryKey : "uids"
	});
	exchangeListGrid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
		var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
		if (fieldName == 'sqlData') {
			var rec = grid.getStore().getAt(rowIndex);
			if (rec&&rec.data.sqlData!="") {
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
										text : '关闭',
										handler : function() {
											win3.close();
										}
									}]
						})
				win3.show();

			}
		} else if (fieldName == 'keyValue') {
			var rec = grid.getStore().getAt(rowIndex);
			var keyJsonStr = rec.data.keyValue;
			var keyArr;
			if (keyJsonStr && keyJsonStr.length > 0
					&& keyJsonStr.charAt(0) == '[') {
				keyArr = eval(keyJsonStr);
			} else {
				return;
			}

			if (rec) {
				var win = new Ext.Window({
							width : 600,
							height : 200,
							layout : 'fit',
							modal : true,
							items : [{
								xtype : 'editorgrid',
								columns : [ {
											header : '主键列名',
											width : 130,
											dataIndex : 'colName'
										}, {
											header : '数据类型',
											width : 120,
											dataIndex : 'type'
										}, {
											header : '主键值',
											width : 230,
											dataIndex : 'value',
											editor : new Ext.form.TextField({
														name : 'value'
													})
										}],
								store : new Ext.data.SimpleStore({
											fields : ["colName", "type",
													"value"]
										})
							}],
							buttonAlign : 'center',
							buttons : [{
										text : '关闭',
										handler : function() {
											win.close();
										}
									}]
						})

				var Record = Ext.data.Record.create({})
				var store = win.items.get(0).store;

				// alert(tempArr[0].UIDS)
				pcDataExchangeService.getPrimaryKeyByTableName(rec
								.get("tableName"), function(data) {
							for (var i in data) {
								if (data[i].indexOf("VARCHAR") > -1) {
									var kValue;
									for (var j = 0; j < keyArr.length; j++) {
										if (keyArr[j][i]) {
											kValue = keyArr[j][i]
										}
									}
									store.add(new Record({
												colName : i,
												type : "【字符串型】",
												value : kValue
											}))
								} else if (data[i].indexOf("NUMBER") > -1) {
									var kValue;
									for (var j = 0; j < keyArr.length; j++) {
										if (keyArr[j][i]) {
											kValue = keyArr[j][i]
										}
									}
									store.add(new Record({
												colName : i,
												type : "【数值型】",
												value : kValue
											}))
								} else if (data[i].indexOf("DATE") > -1) {
									var kValue;
									for (var j = 0; j < keyArr.length; j++) {
										if (keyArr[j][i]) {
											kValue = keyArr[j][i]
										}
									}
									store.add(new Record({
												colName : i,
												type : "【日期型：格式为YYYYMMDDHHMISS】",
												value : kValue
											}))
								} else {
									var kValue;
									for (var j = 0; j < keyArr.length; j++) {
										if (keyArr[j][i]) {
											kValue = keyArr[j][i]
										}
									}
									store.add(new Record({
												colName : i,
												type : data[i],
												value : kValue
											}));
								}
							}

							win.show();
						});
			}
		}else if(fieldName == 'spareC1'||fieldName == 'spareC2') {
			var rec = grid.getStore().getAt(rowIndex);
			if (rec&&(rec.data)[fieldName]!="") {
				var win3 = new Ext.Window({
							width : 600,
							height : 300,
							layout : 'fit',
							modal : true,
							items : [new Ext.form.TextArea({
										value : (rec.data)[fieldName],
										cls : 'codeField',
										readOnly : true

									})],
							buttonAlign : 'center',
							buttons : [{
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
				layout : 'fit',
				items : [exchangeListGrid]
			});
			
	function reload(){
		exchangeListDs.load({
				params : {
					limit : 20,
					start : 0
				},
				callback : function() {
				}
			});
	}
	
	function exchangeDataByTxId(){
		var txIds = new Array();
		var cbArr = document.getElementsByName('cbx');
		for ( var i = 0; i < cbArr.length; i++ ){
			if ( cbArr[i].checked )
			txIds.push(cbArr[i].value);
		}
		if ( txIds.length == 0 ) return;
		
		Ext.Msg.show({
		   title:'数据交互',
		   msg: '是否发送选中的事务数据?',
		   buttons: Ext.Msg.YESNO,
		   fn: function(buttonId){
		   		if ( buttonId == 'yes'){
		   			var mask = new Ext.LoadMask(Ext.getBody(), {msg : "正在进行数据交互..."});
					mask.show();
					pcDataExchangeService.sendExchangeDataByTxId(txIds, function(retVal){
						mask.hide();
						if ( retVal == '1' ){
							Ext.example.msg('提示','操作成功！');
							reload();
						}
						else{
							Ext.Msg.show({
							   title:'数据交互',
							   msg: retVal,
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.WARNING,
							   fn:function(){
							   		reload();
							   }
							});
						}
					});
		   		}
		   },
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	function openLogWin() {
		var exLogPanel = new Ext.Panel({
	
			html : '<iframe name="exLogFrame" src="'
					+ CONTEXT_PATH
					+ '/jsp/dataexchange/pc.exchange.log.jsp?filterMode=1" frameborder="0" style="width:100%;height:100%;"></iframe>'
		});
		userMsgWin = new Ext.Window({
					title : '日志查看',
				header : false,
				layout : 'fit',
				width : 900,
				height : 400,
				maximizable : true,
				closeAction : 'close',
				plain : true,
				items : [exLogPanel]
			});
		userMsgWin.on('close', function(){
			reload();
		});
		userMsgWin.show();
	}
});
//单选，每次发送一个事务，如果发送多个事务（也就是可以多选），有的会成功，有的会失败，对于返回不好提示
function checkSingle(o){
	return;
	var currSelectVal = o.value;
	var cbArr = document.getElementsByName('cbx');
	if(cbArr){
		for ( var i = 0; i < cbArr.length; i++ ){
			if (cbArr[i].checked&&cbArr[i].value!=currSelectVal)		
				cbArr[i].checked = false;
		}
	}
}
//单选，每次发送一个事务，如果发送多个事务（也就是可以多选），有的会成功，有的会失败，对于返回不好提示
function checkAll(o){
	var currSelectVal = o.checked;
	var cbArr = document.getElementsByName('cbx');
	if(cbArr){
		for ( var i = 0; i < cbArr.length; i++ ){
				cbArr[i].checked = currSelectVal;
		}
	}
}