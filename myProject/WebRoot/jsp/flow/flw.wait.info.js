var bean = "com.sgepit.frame.flow.hbm.TaskView";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var params = "tonode='"+_userid+"' and flag=0";
fixedFilterPart=params;
var ds, grid,paramsStr;
var formWin;
//encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递，注意对所有有可能包含此类符号的参数进行一次编码

Ext.onReady(function(){

	var dsFtype = new Ext.data.SimpleStore(
		{
		id: 'my001',
        fields: ['k', 'v'],   
        data: F_TYPE
    });
	
	var sm = new Ext.grid.CheckboxSelectionModel({id: 'my002',singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			id: 'my004', 
			width: 35  
		}), {
			id: 'insid',
			type: 'string',
			header: '流程实例ID',
			dataIndex: 'insid',
			hidden: true
		},{
			id: 'flowid',
			type: 'string',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true
		},{
			id: 'flowtitle',
			type: 'string',
			header: '流程类型',
			dataIndex: 'flowtitle',
			width: 120
		},{
			id: 'title',
			type: 'string',
			header: '主题',
			dataIndex: 'title',
			width: 120
		},{
			id: 'ftime',
			type: 'date',
			header: '发送时间',
			dataIndex: 'ftime',
			width: 100,
			renderer: function(value){
		        return value ? value.dateFormat('Y-m-d H:i:s') : '';
		    }
		},{
			id: 'fromname',
			type: 'string',
			type: 'string',
			header: '发送人',
			dataIndex: 'fromname',
			width: 80
		},{
			id: 'ftype',
			type: 'combo',
			header: '处理类型',
			dataIndex: 'ftype',
			hidden: true,
			renderer: function(value){
				for (var i = 0; i < F_TYPE.length; i++) {
					if (F_TYPE[i][0] == value) return F_TYPE[i][1];
				}
			},
			store: dsFtype
		},{
			id: 'nodename',
			type: 'string',
			header: '处理说明',
			dataIndex: 'nodename',
			width: 60
		},{
			id: 'fromnode',
			type: 'string',
			header: '发送人ID',
			dataIndex: 'fromnode',
			hidden: true
		},{
			id: 'toname',
			type: 'string',
			header: '接收人',
			dataIndex: 'toname',
			hidden: true
		},{
			id: 'tonode',
			type: 'string',
			header: '接受人ID',
			dataIndex: 'tonode',
			hidden: true
		},{
			id: 'notes',
			type: 'string',
			header: '签署意见',
			dataIndex: 'notes',
			hidden: true
		},{
			id: 'flag',
			type: 'string',
			header: '是否完成',
			dataIndex: 'flag',
			hidden: true
		},{
			id: 'nodeid',
			type: 'string',
			header: '节点ID',
			dataIndex: 'nodeid',
			hidden: true
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'logid', type: 'string'},
		{name: 'flowid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromnode', type: 'string'},
		{name: 'tonode', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'flag', type: 'string'},
		{name: 'nodename', type: 'string'},
		{name: 'fromname', type: 'string'},
		{name: 'toname', type: 'string'},
		{name: 'nodeid', type: 'string'}
	];
	
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: bean,
			business: business,
			method: listMethod,
			params: params
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'logid'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('ftime', 'desc');
	
	ds.on("load",function(ds1){
		if(_flowInstantId !=""){  //外部应用调用流程传入的流程实例ID
			var toFlow = -1;
			for(i=0;i<ds1.getTotalCount();i++){
				var rec = ds1.getAt(i);
				if(rec&&rec.data.insid == _flowInstantId){
					toFlow = i;
					continue;
				}
			}
			if(toFlow > -1){
				var rec = ds1.getAt(toFlow)
				doHandler("menu_process",rec)
			}			
		}
	})
	var controlMenu = new Ext.Button({
	text: '相关操作', iconCls: 'option',
	menu: {
		items: [{
			id: 'log', text: '　流转日志', iconCls: 'refresh',
			handler: controlHandler
		}, {
			id: 'file', text: '　流程文件', iconCls: 'word',
			handler: controlHandler
		}, {
			id: 'adjunct', text: '　流程附件', iconCls: 'copyUser',
			handler: controlHandler
		}, {
			id: 'module', text: '　业务数据', iconCls: 'select',
			handler: controlHandler
		}, {
			id: 'remove_tozl', text: '　移交当前资料', iconCls: 'print',hidden:false,
			handler: controlHandler
		}, {
			id: 'remove_all', text: '　移交全部资料', iconCls: 'print',hidden:false,
			handler: controlHandler
		}]
	}
});

	grid = new Ext.grid.QueryExcelGridPanel({
		id: 'my2',
		ds: ds,
		cm: cm,
		sm: sm,
		region: 'center', 
		tbar: ["->"],
		split: true, 
		stripeRows: true,
		collapsible: true,
    	animCollapse: true,
		border: false,
		layout: 'fit',
		header: false,
		autoScroll: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
			id: 'my008',
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});

	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this);
	
//	grid.on('click', function(){if (!qPanel.collapsed) qPanel.collapse();});
	
	grid.on('celldblclick', function(grid, rowIndex, columnIndex){
		var record = grid.getStore().getAt(rowIndex);
		//合同付款:实际付款和计划付款的比较
		var sql="select paramvalues from flw_face_params_ins where nodeid=("+
			"select nodeid from flw_node where "+
			"funid =(select faceid from flw_face where funname='付款实际') and flowid='"+record.get('flowid')+"'"+
			" )  and insid='"+record.get('insid')+"'";
			
	    var planSj=""
	    DWREngine.setAsync(false);  
		baseMgm.find("","","findbysqlforlist",sql,"",0,0,function(_list){
			var PARAMVALUES = {PARAMVALUES:''};
			planSj= (_list.length==0)? "" :_list[0].PARAMVALUES;
			//conno:GJMD-SB-DQ-2010-003:string`payno:20108017:string
			//[{PARAMVALUES=conno:GJMD-SB-DQ-2010-003:string`payno:20108017:string}]
		});
		DWREngine.setAsync(true);
		if(planSj!=""){
			var params = planSj.split("`");
			var where = "";
			for (var x=params.length-1; x<params.length; x++){
				var param = params[x].split(":");
				where = param[0]+"='"+param[1]+"'";
			}
			DWREngine.setAsync(false);
			/*
			var flag="";
			var sql_ ="select decode(planmoney,null,'nullplan',paymoney-planmoney)flag from con_pay t where "+where;
			baseMgm.find("","","findbysqlforlist",sql_,"",0,0,function(_list){
				flag= (_list.length==0)? "" :_list[0].FLAG;
			});
		    DWREngine.setAsync(true);
		    var textWar = "";
		    if(flag=="nullplan"){textWar="<br>此项合同付款，未对应资金计划！"}
		    if(flag>0){textWar="<br>此项合同付款，实际付款大于计划付款！"}
		    
		    if(flag>0 || flag=="nullplan"){
		    	Ext.Msg.show({
	              title: '提示',
	              msg: textWar,
	              width: 300,
	              animEl: 'elId',
	              icon: Ext.MessageBox.WARNING,
	              buttons: Ext.Msg.YESNO,
	              fn: function(d){if(d=="yes"){
						if ('S' == record.get('ftype')){
							parent.showSendFiles(record.get('insid'), encodeURIComponent(record.get('title')), record.get('logid'));
						} else {
							flwProcessFun(record);
						}		
	              	}}
	      		 })
		    }else{
		    */
		    	if ('S' == record.get('ftype')){
					parent.showSendFiles(record.get('insid'), encodeURIComponent(record.get('title')), record.get('logid'));
				} else {
					flwProcessFun(record);
				}
			/*
		    }
			*/
		}else{
			if ('S' == record.get('ftype')){
				parent.showSendFiles(record.get('insid'), encodeURIComponent(record.get('title')), record.get('logid'));
			} else {
				flwProcessFun(record);
			}		
		}
	});
	
	grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("4" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('title')
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	
	});

	var viewport = new Ext.Viewport({
		id: 'my1',
		layout: 'border',
		border: false,
		items: [grid]
	});
	grid.getTopToolbar().add(controlMenu);
	ds.load({
		params: {
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
	});

	var notesTip = new Ext.ToolTip({
		id: 'my006',
		width: 200,
		target: grid.getEl()
	});
	
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		gridMenu.removeAll();
		gridMenu.addMenuItem({
			id: 'menu_process',
			text: '　处理',
			value: record,
			iconCls: 'btn',
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_query',
			text: '　查询',
			value: record,
			iconCls: 'form',
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_log',
			text: '　流转日志',
			value: record,
			iconCls: 'refresh',
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_file',
			text: '　流程文件',
			iconCls: 'word',
			value: record,
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_adjunct',
			text: '　流程附件',
			iconCls: 'copyUser',
			value: record,
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_module',
			text: '　业务数据',
			iconCls: 'select',
			value: record,
			handler: toHandler
		});
		gridMenu.showAt(e.getXY());
	}
	function toHandler(){
		var state = this.id;
		var record = this.value;
		doHandler(state,record)
	}
	function doHandler(sta,rec){
		var state = sta;
		var record = rec;
		//合同付款:实际付款和计划付款的比较
		var sql="select paramvalues from flw_face_params_ins where nodeid=("+
			"select nodeid from flw_node where "+
			"funid =(select faceid from flw_face where funname='付款实际') and flowid='"+record.get('flowid')+"'"+
			" )  and insid='"+record.get('insid')+"'";
			
	    var planSj=""
	    DWREngine.setAsync(false);  
		baseMgm.find("","","findbysqlforlist",sql,"",0,0,function(_list){
			var PARAMVALUES = {PARAMVALUES:''};
			planSj= (_list.length==0)? "" :_list[0].PARAMVALUES;
			//conno:GJMD-SB-DQ-2010-003:string`payno:20108017:string
			//[{PARAMVALUES=conno:GJMD-SB-DQ-2010-003:string`payno:20108017:string}]
		});
		DWREngine.setAsync(true);
		if(planSj!=""){
			var params = planSj.split("`");
			var where = "";
			for (var x=params.length-1; x<params.length; x++){
				var param = params[x].split(":");
				where = param[0]+"='"+param[1]+"'";
			}
			DWREngine.setAsync(false);
			/*
			var flag="";
			var sql_ ="select decode(planmoney,null,'nullplan',paymoney-planmoney)flag from con_pay t where "+where;
			baseMgm.find("","","findbysqlforlist",sql_,"",0,0,function(_list){
				flag= (_list.length==0)? "" :_list[0].FLAG;
			});
		    DWREngine.setAsync(true);
		    var textWar = "";
		    if(flag=="nullplan"){textWar="<br>此项合同付款，未对应资金计划！"}
		    if(flag>0){textWar="<br>此项合同付款，实际付款大于计划付款！"}
		    
		    if(flag>0 || flag=="nullplan"){
		    	Ext.Msg.show({
	              title: '提示',
	              msg: textWar,
	              icon: Ext.Msg.WARNING, 
	              width: 300,
	              icon: Ext.MessageBox.WARNING,
	              buttons: Ext.Msg.YESNO,
	              fn: function(d){if(d=="yes"){
						if ("" != state){
							if ("menu_query" == state){
								if (qPanel.collapsed) qPanel.expand();
							} else if ("menu_process" == state){
								if ('S' == record.get('ftype')){
									parent.showSendFiles(record.get('insid'), encodeURIComponent(record.get('title')), record.get('logid'));
								} else {
									flwProcessFun(record);
								}
							} else if ("menu_log" == state){
								parent.showLogWin(record.get('insid'), record.get('title'));
							} else if ("menu_file" == state){
								parent.showFlowFile(record.get('insid'), record.get('title'));
							} else if ("menu_adjunct" == state){
								parent.showFlowAdjunct(record.get('insid'), record.get('title'));
							} else if ("menu_module" == state){
								parent.showModule(record.get('insid'), record.get('title'));
							}
						}             	
	              }}
	      		 })
		    }else{
		    */
				if ("" != state){
					if ("menu_query" == state){
						showWindowQuery();
					} else if ("menu_process" == state){
						if ('S' == record.get('ftype')){
							parent.showSendFiles(record.get('insid'), encodeURIComponent(record.get('title')), record.get('logid'));
						} else {
							flwProcessFun(record);
						}
					} else if ("menu_log" == state){
						parent.showLogWin(record.get('insid'), record.get('title'));
					} else if ("menu_file" == state){
						parent.showFlowFile(record.get('insid'), record.get('title'));
					} else if ("menu_adjunct" == state){
						parent.showFlowAdjunct(record.get('insid'), record.get('title'));
					} else if ("menu_module" == state){
						parent.showModule(record.get('insid'), record.get('title'));
					}
				} 
			/*
		    }
			*/
		}else{
			if ("" != state){
				if ("menu_query" == state){
					showWindowQuery();
				} else if ("menu_process" == state){
					if ('S' == record.get('ftype')){
						parent.showSendFiles(record.get('insid'), encodeURIComponent(record.get('title')), record.get('logid'));
					} else {
						flwProcessFun(record);
					}
				} else if ("menu_log" == state){
					parent.showLogWin(record.get('insid'), record.get('title'));
				} else if ("menu_file" == state){
					parent.showFlowFile(record.get('insid'), record.get('title'));
				} else if ("menu_adjunct" == state){
					parent.showFlowAdjunct(record.get('insid'), record.get('title'));
				} else if ("menu_module" == state){
					parent.showModule(record.get('insid'), record.get('title'));
				}
			}
			
		}
		
	}
	
//	流程处理
	function flwProcessFun(record) {
		var url = BASE_PATH + 'jsp/flow/flw.wait.process.jsp';
		parent.location.href = url + '?logid='+record.get('logid')
						+'&flowid='+record.get('flowid')
						+'&title='+encodeURIComponent(record.get('title'))
						+'&insid='+record.get('insid')
						+'&ftype='+record.get('ftype')
						+'&fromnode='+record.get('fromnode');
		/*
		if(!record.get("appUrl") || record.get("appUrl")==BASE_PATH) {
			var url = BASE_PATH + 'jsp/flow/flw.wait.process.jsp';
			parent.location.href = url + '?logid='+record.get('logid')
							+'&flowid='+record.get('flowid')
							+'&title='+encodeURIComponent(record.get('title'))
							+'&insid='+record.get('insid')
							+'&ftype='+record.get('ftype')
							+'&fromnode='+record.get('fromnode');

		} else {
			crossDomainUrl = record.get("appUrl") + 'jsp/flow/flw.wait.process.jsp';
			crossDomainUrl = crossDomainUrl + '?logid='+record.get('logid')
							+'&flowid='+record.get('flowid')
							+'&title='+encodeURIComponent(record.get('title'))
							+'&insid='+record.get('insid')
							+'&ftype='+record.get('ftype')
							+'&fromnode='+record.get('fromnode')
							+'&crossDomainFlag=true';
			var ServletUrl = record.get("appUrl") + "servlet/CrossDomainServlet";
			Ext.Ajax.request({
				url: ServletUrl,
				params: {ac:'crossDomainLogin', userId:USERID},
		  		method: "POST",
		  		scriptTag: true,
		  		success: function(response, params) {
					console.log(response);
				}
			})
		}
		*/
	}
});
function controlHandler(){
	var _type = this.id;
	if(_type=="remove_all"&&parent.showRemoveFiles) {//parent jsp is flw.main.frame.jsp
		parent.showRemoveFiles(grid.getStore());	
	}else if  (grid.getSelectionModel().getSelected()){
		var record = grid.getSelectionModel().getSelected();
		var _insid = record.get('insid'), _title = record.get('title');
		if(!_insid && !_title){
			_insid = record.get('INSID'); 
			_title = record.get('TITLE');
		}
		if ('log' == _type) {
			parent.showLogWin(_insid, _title);
		} else if ('file' == _type) {
			parent.showFlowFile(_insid, _title);
		} else if ('adjunct' == _type) {
			parent.showFlowAdjunct(_insid, _title);
		} else if ('module' == _type) {
			parent.showModule(_insid, _title);
		} else if ('remove_tozl' == _type) {
			parent.showRemoveFiles(grid.getStore(),_insid, _title);
		} 
	} else {
		Ext.example.msg('提示', '请先选择一条数据！');
	}
}
function showWindowQuery(){
		if(!formWin){
		formWin = new Ext.Window({	               
			title: '查询数据',
			width: 600, minWidth: 460, height: 300,
			layout: 'fit', iconCls: 'form', closeAction: 'hide',
			border: false, constrain: true, maximizable: false, modal: true,
			items: [formPanelQuery]
		});   
    	}
    	formWin.show();
  	}