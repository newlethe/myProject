var changePanel;
var flowData = new Array();
var nodeBean = "com.sgepit.frame.flow.hbm.FlwNodeView";
var nodeViewBean = "com.sgepit.frame.flow.hbm.NodeView";
var roleBean = "com.sgepit.frame.sysman.hbm.RockRole";
var beanLog = "com.sgepit.frame.flow.hbm.TaskView";
var beanPB = "com.sgepit.pmis.contract.hbm.ConPartyb";
var beginNode = new Array();
var arrRoles = new Array();
var beginNodeId;
var beginNodeName;
var unitType = new Array();
var specType = new Array();

var chooseBhWin;
var maxflwinsbh;

var conoveWindow;
var SEL_CONNO = '-1';

var contractType = new Array(); 
var contSort2_gc = new Array();
var contSort2_sb = new Array();
var dsContractType;
var type;
var dsConParam = "";

Ext.onReady(function(){
	
	DWREngine.setAsync(false); 
	
	baseDao.findByWhere2(nodeViewBean, "flowid='"+parent.ZlypFlowInfo.flowid+"' and type='0'", function(list){
		beginNode.push(list[0].handler);
		beginNode.push(list[0].realname);
		arrRoles = list[0].role.split(',');
		beginNodeId = list[0].nodeid;
		beginNodeName = list[0].name;
	});
	
	appMgm.getCodeValue('流程单位',function(list){         //获取流程单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			unitType.push(temp);			
		}
    }); 
    
    appMgm.getCodeValue('流程专业',function(list){         //获取流程专业类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			specType.push(temp);	
		}
    }); 
    
    appMgm.getCodeValue('工程合同分类',function(list){         //获取工程合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort2_gc.push(temp);			
		}
    });     
    
    appMgm.getCodeValue('设备合同分类',function(list){         //获取设备合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyCode);	
			contSort2_sb.push(temp);			
		}
    });     
	
	DWREngine.setAsync(true); 
	
	if("" != parent.FLOW_TYPE && (parent.FLOW_TYPE).indexOf("设备")!= -1){
		contractType = contractType.concat(contSort2_sb);
		contractType.push(['-1','所有设备合同']);
		dsConParam = "condivno = 'SB'";
	}else if("" != parent.FLOW_TYPE && (parent.FLOW_TYPE).indexOf("工程合同")!= -1){
		contractType = contractType.concat(contSort2_gc);
		contractType.push(['-1','所有工程合同']);
		dsConParam = "condivno = 'GC'";
	}else{
		contractType = contractType.concat(contSort2_gc).concat(contSort2_sb);
		contractType.push(['-1','所有合同']);
	}
	
	var dsUnitType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: unitType
    });
    
    var dsSpecType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: specType
    });
    
    dsContractType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: contractType
    });
	var institle = parent.ZlypFlowInfo.xmmc+" 流程审批 "
	changePanel = new Ext.form.FormPanel({
		id: 'goto-form', width: 600,
		header: false, border: false,
		bodyStyle: 'padding:10px 10px;',
		iconCls: 'icon-detail-form',
		labelAlign: 'right',
		items: [
			new Ext.form.FieldSet({
				title: '填写内容',
				layout: 'column',
				border: true,
				items:[{
						columnWidth: 1, layout: 'form', border: false,
						items: [
							new Ext.form.TriggerField({
								name: 'title', fieldLabel: '主题',
								triggerClass: 'x-form-date-trigger',
								readOnly: false,
								selectOnFocus: true,
								onTriggerClick: showConove,
								width: 471,
								value:institle
							})
						]
					},	{
						columnWidth: .5, layout: 'form', border: false,
						items: [
							new Ext.form.TextField({
								name: 'flowname', fieldLabel: '流程名称',
								value: parent.ZlypFlowInfo.flowname,
								width: 161, readOnly: true, allowBlank: false
							}),
							new Ext.form.TriggerField({
		    					name: 'selhandler', 
		    					fieldLabel: '指定处理人<br>(可选)',
		    					triggerClass: 'x-form-date-trigger',
		    					readOnly: true, selectOnFocus: true,
		    					width: 161, value: _realname,//beginNode[1],
		    					onTriggerClick: showChangeWin
		    				}),
							new Ext.form.ComboBox({
								name: 'unit', fieldLabel: '单位',
								valueField:'k', displayField: 'v',
								mode: 'local', triggerAction: 'all',
					            typeAhead: true, store: dsUnitType,
					            lazyRender:true, editable: false,
					            width: 161, disabled:true,
					            listClass: 'x-combo-list-small',
					            hideLabel: true, hidden: true
							})
						]
					}, {
						columnWidth: .5, layout: 'form', border: false,
						items: [
							new Ext.form.TriggerField({
								name: 'flowno', fieldLabel: '文件编号',
								triggerClass:'x-form-date-trigger',
								//readOnly:true,
								selectOnFocus:true,
								onTriggerClick:showChooseBh,
								width: 180
							}),
							new Ext.form.ComboBox({
								name: 'spec', fieldLabel: '专业',
								valueField:'k', displayField: 'v',
								mode: 'local', triggerAction: 'all',
					            typeAhead: true, store: dsSpecType,
					            lazyRender:true, editable: false,
					            width: 161,disabled:true,
					            listClass: 'x-combo-list-small',
					            hideLabel: true, hidden: true
							})
						]
					}, {
						columnWidth: 1, layout: 'form', border: false,
    					layout: 'column', border: false,
    					items: [{
    						columnWidth: .25, layout: 'form', border: false,
							items: [
								{xtype: 'textfield', fieldLabel: '流程ID', name: 'defhandlerid', value: _userid,/*beginNode[0],*/ hideLabel: true, hidden: true}
							]
    					},{
    						columnWidth: .25, layout: 'form', border: false,
							items: [
								{xtype: 'textfield', name: 'defhandler', fieldLabel: '默认处理人', width: 161, value: _realname,/*beginNode[1],*/ readOnly: true, hideLabel: true, hidden: true}
							]
    					},{
    						columnWidth: .25, layout: 'form', border: false,
							items: [
								{xtype: 'textfield', name: 'selhandlerid', fieldLabel: '指定处理人', hidden: true, hideLabel: true}
							]
    					},{
    						columnWidth: .25, layout: 'form', border: false,
							items: [
    							{xtype: 'textarea', name: 'notes', fieldLabel: '签署意见', hidden: true, hideLabel: true}
							]
    					}]
    				}
				]
			})
		],
		bbar: ['->', {text: '下一步', iconCls: 'returnTo', handler: sendHandler}]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [changePanel]
	});
	
															
	function showChooseBh(){
		if(!chooseBhWin){
			chooseBhWin = new FlwNoWindow();
		}
		chooseBhWin.show()
	}
	
	var dsConove = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: 'com.sgepit.pmis.contract.hbm.ConOve',
			business: 'baseMgm',
			method: 'findWhereOrderBy',
			params:dsConParam
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'conid'
		}, [
			{name: 'conid', type: 'string'},
			{name: 'conno', type: 'string'},
			{name: 'conname', type: 'string'},
			{name: 'partybno', type: 'string'}
		]),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	
	var gridConove = new Ext.grid.GridPanel({
		ds: dsConove,
		cm: new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer({
				width: 20
			}), {
				id: 'conid',
				header: '合同ID',
				dataIndex: 'conid',
				hidden: true
			}, {
				id: 'conno',
				header: '合同编号',
				dataIndex: 'conno',
				width: .3
			}, {
				id: 'conname',
				header: '合同名称',
				dataIndex: 'conname',
				width: .6
			}, {
				id: 'partybno',
				header: '乙方编码',
				dataIndex: 'partybno',
				hidden: true
			}
		]),
		region: 'center',
		border: false,
		header: false,
		autoScroll: true,
		loadMask: true, stripeRows: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsConove,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	function showConove(){
		if (!conoveWindow){	
			conoveWindow = new Ext.Window({
				title: '合同列表',
				iconCls: 'form', layout: 'border',
				closeAction: 'hide',
				width: 592, height: 280,
				modal: true, resizable: false,
				closable: true, border: false,
				maximizable: false, plain: true,
				tbar: [
					new Ext.form.ComboBox({
						id: 'conCombo',
					    store: dsContractType,
					    displayField:'v',
					    valueField:'k',
					    typeAhead: true,
					    mode: 'local',
					    triggerAction: 'all',
					    emptyText:'选择合同分类....',
					    selectOnFocus:true,
					    width:110,
					    listeners: {
					    	select: function(combo, record, index){
					    		var _ds = gridConove.getStore();
				    			_ds.baseParams.params = (combo.getValue() == '-1') ? dsConParam : (dsConParam == '')?"sort='"+combo.getValue()+"'":dsConParam + " and sort='"+combo.getValue()+"'";
				    			_ds.load();
					    	}
					    }
					}), '-',
					'<font color=#15428b>合同编号：</font>',
					{xtype: 'textfield', id: 'q-conno', name: 'conno', width: 110}, '-',
					'<font color=#15428b>合同名称：</font>',
					{xtype: 'textfield', id: 'q-conname', name: 'conname', width: 110}, '-', '->',
					{text: '查询', iconCls: 'btn', handler: qConOve}, '-',
					{text: '选择', iconCls: 'save', handler: function(){
							var sm = gridConove.getSelectionModel()
							if (sm.getSelected()){
								var conno = sm.getSelected().get('conno');
								var conname = sm.getSelected().get('conname');
								var partybno = sm.getSelected().get('partybno');
								var str = "";
								if (partybno!='') {
									DWREngine.setAsync(false);
									baseMgm.findById(beanPB, partybno, function(obj){
										if (obj) str += obj.partyb;
									});
									DWREngine.setAsync(true);
								}
								str += "[合同]"+conname+"("+conno+")";
								SEL_CONNO = conno;
								changePanel.getForm().findField('title').setValue(str);
								conoveWindow.hide();
							} else {
								Ext.example.msg('提示', '请选择数据！');
							}
						}
					}
				],
				items: [gridConove]
			});
		}
		conoveWindow.show();
		gridConove.on('rowdblclick', function(grid, rowIndex, e){
			var conno = grid.getStore().getAt(rowIndex).get('conno');
			var conname = grid.getStore().getAt(rowIndex).get('conname');
			var partybno = grid.getStore().getAt(rowIndex).get('partybno');
			var str = "";
			if (partybno!='') {
				DWREngine.setAsync(false);
				baseMgm.findById(beanPB, partybno, function(obj){
					if (obj) str += obj.partyb;
				});
				DWREngine.setAsync(true);
			}
			str += "[合同]"+conname+"("+conno+")";
			SEL_CONNO = conno;
			changePanel.getForm().findField('title').setValue(str);
			conoveWindow.hide();
		});
		gridConove.getStore().load();
	}
	
	function qConOve(){
		var fConno = Ext.getCmp('q-conno');
		var fConname = Ext.getCmp('q-conname');
		var sql = '';
		if (fConno.getValue() != ''){
			sql += "conno like '%"+fConno.getValue()+"%'";
		}
		if (fConname.getValue() != ''){
			if (sql != '') sql += " and ";
			sql += "conname like '%"+fConname.getValue()+"%'";
		}
		var _ds = gridConove.getStore();
		var conCombo = Ext.getCmp('conCombo');
		if (conCombo.getValue() != '-1' && conCombo.getValue() != ''){
			var commboSql = "sort='"+conCombo.getValue()+"'";
			if(dsConParam == ''){
				_ds.baseParams.params = (sql =='')?commboSql:commboSql + " and "+sql;
			}else{
				_ds.baseParams.params = (sql =='')?commboSql + " and "+dsConParam:commboSql + " and "+sql + " and "+dsConParam;
			}
		} else {
			_ds.baseParams.params = (dsConParam == '')?sql:(sql =='')?dsConParam:dsConParam + " and "+sql;
		}
		_ds.load();
	}
	
});

function showChangeWin(){
	if (changePanel.getForm().findField('defhandlerid').getValue() != ''){
		cbuildRoleTree(arrRoles);
		cgrid.getStore().removeAll();
		cuserWindow.show();
	} 
}

function sendHandler(){
	var baseForm = changePanel.getForm();
	if (baseForm.isValid()){
		if (baseForm.findField('title').getValue()=='') {
			Ext.Msg.alert('提示', '&nbsp;&nbsp;&nbsp;请填写主题!&nbsp;&nbsp;&nbsp;');
			return; 
		};
		Ext.Msg.show({
			title: '提示',
			msg: '确定要下一步操作吗？　　　　',
			buttons: Ext.Msg.YESNO,
			icon: Ext.MessageBox.WARNING,
			fn: function(value){
				if ('yes' == value) doSendFlow();
			}
		});
	}
}

function doSendFlow(){
	var baseForm = changePanel.getForm();
	var title = baseForm.findField('title').getValue();			//流程标题
	var notes = baseForm.findField('notes').getValue();			//签署意见
	var flowno = baseForm.findField('flowno').getValue();		//流程编号
	var unit = baseForm.findField('unit').getValue();			//流程单位
	var spec = baseForm.findField('spec').getValue();			//流程专业
	var defid = parent.ZlypFlowInfo.flowid;		//流程
	var handler = '';
	if (baseForm.findField('selhandlerid').getValue() == ''){
		handler = baseForm.findField('defhandlerid').getValue();
	} else {
		handler = baseForm.findField('selhandlerid').getValue();
	}
	var fromNode = _userid;														//当前用户ID
	var obj_log = new Object();
		obj_log.fromnode = fromNode;
		obj_log.tonode = handler;
		obj_log.ftime = new Date();
		obj_log.ftype = '7A';
		obj_log.notes = notes;
		obj_log.flag = 0;
		obj_log.nodename = beginNodeName;
		obj_log.nodeid = beginNodeId;//接受节点
		obj_log.fromnodeid = "-1";//流程发起，默认发起节点是-1
	var obj_ins = new Object();
		obj_ins.params = '';
		obj_ins.title = title;
		obj_ins.status = '0';
		obj_ins.worklog = beginNodeId;
		obj_ins.flowno = flowno;
		obj_ins.unit = unit;
		obj_ins.spec = spec;
		obj_ins.isyp="1";
		obj_ins.xmbh=parent.ZlypFlowInfo.xmbh;
		obj_ins.fileid=parent.ZlypFlowInfo.fileid;
		obj_ins.xmbh=parent.ZlypFlowInfo.xmbh;
		obj_ins.xmbh=parent.ZlypFlowInfo.xmbh;

	flwInstanceMgm.insertFlwInstance(defid, obj_ins, obj_log, function(insid){
		if ("" != insid){
			if (_userid == handler) {
				baseDao.findByWhere2(beanLog, "flowid='"+parent.ZlypFlowInfo.flowid+"' and insid='"+insid+"' and tonode='"+_userid+"' and flag=0", function(list){
					if (list.length > 0){
						if(parent.flowModelWindow&&parent.flowModelWindow.flowWindow) parent.flowModelWindow.flowWindow.hide();
						var log = list[0];
						toProcessFlow(log);
					}
				});
			}else{
				if(parent.flowModelWindow&&parent.flowModelWindow.flowWindow) parent.flowModelWindow.flowWindow.hide();
			}
		}else{
			Ext.example.msg('提示','发起失败！');
		}
	});
}

function toProcessFlow(log){
	var frm = parent.parent.frames;
	var url = BASE_PATH + 'jsp/flow/flw.wait.process.jsp';
	frm['contentFrame'].location.href = url + '?logid='+log.logid
			+'&flowid='+log.flowid
			+'&title='+encodeURIComponent(log.title)
			+'&insid='+log.insid
			+'&ftype='+log.ftype
			+'&fromnode='+log.fromnode;
}

//流程编号
var FlwNoWindow = Ext.extend(Ext.Window ,{
	title:"选择编号",
	width:300,
	height:231,
	buttonAlign:"center",
	closeAction:"hide",
	collapsible:false,
	modal:true,
	layout:"fit",
	initComponent: function(){
		this.sgdwCombo=new Ext.data.SimpleStore({fields: ['k','v']});
		this.zydmCombo=new Ext.data.SimpleStore({fields: ['k','v']});
		this.dwgcCombo=new Ext.data.SimpleStore({fields: ['k','v']});
		this.clmcCombo=new Ext.data.SimpleStore({fields: ['k','v']});
		var THIS = this;
		this.items=[{
			xtype:"form",
			labelWidth:60,
			labelAlign:"right",
			layout:"form",
			bodyStyle:'padding:10px',
			items:[{
					xtype:"combo",
					triggerAction:"all",
					fieldLabel:"施工单位",
					name:"sgdw",hiddenName:"sgdw",
					//editable:false,
					allowBlank:false,
					anchor:"90%",
					valueField:'k', displayField: 'v',
					mode: 'local', triggerAction: 'all',
					store:THIS.sgdwCombo
				},{
					xtype:"combo",
					triggerAction:"all",
					fieldLabel:"专业代码",
					name:"zydm",hiddenName:"zydm",
					//editable:false,
					allowBlank:false,
					anchor:"90%",
					valueField:'k', displayField: 'v',
					mode: 'local', triggerAction: 'all',
					store:THIS.zydmCombo
				},{
					xtype:"combo",
					triggerAction:"all",
					fieldLabel:"单位工程",
					name:"dwgc",hiddenName:"dwgc",
					anchor:"90%",
					valueField:'k', displayField: 'v',
					mode: 'local', triggerAction: 'all',
					store:THIS.dwgcCombo
				},{
					xtype:"combo",
					triggerAction:"all",
					fieldLabel:"材料名称",
					name:"clmc",hiddenName:"clmc",
					anchor:"90%",
					valueField:'k', displayField: 'v',
					mode: 'local', triggerAction: 'all',
					store:THIS.clmcCombo
				},{
					xtype:"textfield",
					triggerAction:"all",
					fieldLabel:"流水号",
					name:"lsh",
					readOnly:true,
					anchor:"90%"
				}
			]
		}];
		this.buttons=[{
			text:'确定',
			scope:this,
			handler:function(){
				var formPanel= this.items.get(0);
				var baseform = formPanel.getForm();
				if(baseform.isValid()){
					var sgdwComo=formPanel.items.get(0);
					var zydmComo=formPanel.items.get(1);
					var dwgcComo=formPanel.items.get(2);
					var clmcComo=formPanel.items.get(3);
					var lshField=formPanel.items.get(4);
					var sgdwVal=sgdwComo.getRawValue()==""?"":(sgdwComo.getValue()==""?sgdwComo.getRawValue():sgdwComo.getValue());
					var zydmVal=zydmComo.getRawValue()==""?"":(zydmComo.getValue()==""?("-"+zydmComo.getRawValue()):("-"+zydmComo.getValue()));
					var dwgcVal=dwgcComo.getRawValue()==""?"":(dwgcComo.getValue()==""?("-"+dwgcComo.getRawValue()):("-"+dwgcComo.getValue()));
					var clmcVal=clmcComo.getRawValue()==""?"":(clmcComo.getValue()==""?("-"+clmcComo.getRawValue()):("-"+clmcComo.getValue()));
					var lshVal ="-"+lshField.getValue();
					var bh=sgdwVal+zydmVal+dwgcVal+clmcVal+lshVal;
					
					changePanel.getForm().findField('flowno').setValue(bh);
					this.hide();
				}
			}
		},{
			text:'重置',
			scope:this,
			handler:function(){
				var form=this.items.get(0).getForm();
				form.reset();
				form.findField('lsh').setValue(this.randomNum(4));
			}
		}];
		this.on('beforeshow',function(){
			var form=this.items.get(0).getForm();
			form.reset();
			form.findField('lsh').setValue(this.randomNum(4));
		});
		FlwNoWindow.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		FlwNoWindow.superclass.onRender.call(this, ct, position);
		var sgdwCombo=this.sgdwCombo;
		var zydmCombo=this.zydmCombo;
		var dwgcCombo=this.dwgcCombo;
		var clmcCombo=this.clmcCombo;
		
		DWREngine.setAsync(false);
		flwInstanceMgm.getSelectData(function(json){
			try{
				var data=eval(json);
				sgdwCombo.loadData(data[0].sgdw);
				zydmCombo.loadData(data[0].zydm);
				dwgcCombo.loadData(data[0].dwgc);
				clmcCombo.loadData(data[0].clmc);
			}catch(e){
				
			}
		});
		DWREngine.setAsync(true);
	},
	randomNum : function(n){
		var rnd="";
		if(!n) n=4;		
		for(var i=0;i<n;i++) rnd+=Math.floor(Math.random()*10);
		return rnd;
	}
});