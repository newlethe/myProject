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
var conUnit = new Array();
var proCode = new Array();
var fileTypeList = new Array();
var chooseBhWin;
var maxflwinsbh;

var conoveWindow;
var SEL_CONNO = '-1';

var contractType = new Array(); 
var contSort2_gc = new Array();
var contSort2_sb = new Array();
var unitProject=new Array();//单位工程
var matName = new Array();//材料名称
var dsContractType;
var type;
var dsConParam = "";

Ext.onReady(function(){
	
	DWREngine.setAsync(false); 
	
	baseDao.findByWhere2(nodeViewBean, "flowid='"+parent.FLOW_ID+"' and type='0'", function(list){
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
    
    appMgm.getCodeValue('施工单位',function(list){  //获取施工单位
    	for(i = 0; i<list.length; i++){
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	    		
			conUnit.push(temp)
    	}
    })
    
     appMgm.getCodeValue('专业代码',function(list){  //获取专业代码
    	for(i = 0; i<list.length; i++){
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	    		
			proCode.push(temp)
    	}
    });
    
    appMgm.getCodeValue('单位工程',function(list){  //获取单位工程
    	for(i = 0; i<list.length; i++){
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	    		
			unitProject.push(temp)
    	}
    });
    
      appMgm.getCodeValue('材料名称',function(list){  //获取材料名称
    	for(i = 0; i<list.length; i++){
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	    		
			matName.push(temp)
    	}
    });
    
    appMgm.getCodeValue('流程文件类别',function(list){  //获取流程文件文件类型
    	for(i = 0; i<list.length; i++){
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	    		
			fileTypeList.push(temp)
    	}
    });
    
//	appMgm.getCodeValue('合同划分类型',function(list){		//获取合同划分类型
//		for(i = 0; i < list.length; i++) {
//			var temp = new Array();	
//			temp.push(list[i].codekey);		
//			temp.push(list[i].codevalue);	
//			contractType.push(temp);
//		}
//    }); 
    
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
    
    var dsConUnit = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data:conUnit
    });
    
    var dsProCode = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data:proCode
    });
    
    var dsMatName= new Ext.data.SimpleStore({
        fields:['k','v'],
        data:matName
    })
    
    var dsUnitProject=new Ext.data.SimpleStore({
         fields:['k','v'],
         data:unitProject
    })
    
    
    var dsfileType = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data:fileTypeList
    });
    
    dsContractType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: contractType
    });
	
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
								width: 471
							})
						]
					},	{
						columnWidth: .5, layout: 'form', border: false,
						items: [
							new Ext.form.TextField({
								name: 'flowname', fieldLabel: '流程名称',
								value: parent.FLOW_NAME,
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
			var chooseForm = new Ext.form.FormPanel({
				id:'choosebh',
				layout:'form',
				bodyStyle:'padding:12px',
				border:false,
				frame:true,
				items:[{
						xtype:'combo',fieldLabel:'施工单位',name:'conunit',
						valueField:'k',displayField:'v',allowBlank:false,
						mode:'local',triggerAction:'all',
						typeAhead:true,store:dsConUnit,
						lazyRender:true,editable:false,
						listClass:'x-combo-list-all'
					},{	
						xtype:'combo',fieldLabel:'专业代码',name:'proCode',
						valueField:'k',displayField:'v',allowBlank:false,
						mode:'local',triggerAction:'all',
						typeAhead:true,store:dsProCode,
						lazyRender:true,editable:false,
						listClass:'x-combo-list-all'						
					},{
						xtype:'combo',fieldLabel:'单位工程',name:'unitProject',
						valueField:'k',displayField:'v',
						mode:'local',triggerAction:'all',
						typeAhead:true,store:dsUnitProject,
						lazyRender:true,editable:false,
						listClass:'x-combo-list-all'					    
					},{
					  	xtype:'combo',fieldLabel:'材料名称',name:'matName',
						valueField:'k',displayField:'v',
						mode:'local',triggerAction:'all',
						typeAhead:true,store:dsMatName,
						lazyRender:true,editable:false,
						listClass:'x-combo-list-all'	
					},{	
						xtype:'textfield',fieldLabel:'流水号',name:'serNumber',
						id:'serNumber',
						allowBlank:false,
						width:141,
						readOnly:true
//						listeners:{
//							'collapse':function(combo){
//								changePanel.getForm().findField('unit').setValue(combo.getValue())
//								changePanel.getForm().findField('unit').setRawValue(combo.getRawValue())								
//							}
//						}							
				}],
				buttons:[{
					text:'确定',iconCls:'save',
					handler:function(){
						var baseform = this.ownerCt.getForm()
						if(baseform.isValid()){
							//type=baseform.findField('filename').getValue()
							var conunit = baseform.findField('conunit').getValue();//施工单位
							var proCode = baseform.findField('proCode').getValue();//专业代码
							var unitProject = baseform.findField('unitProject').getValue();//单位工程
							var matName = baseform.findField('matName').getValue();//材料名称
							var serNumber =baseform.findField('serNumber').getValue();//材料名称
							var str=conunit+'-'+proCode;
							if(unitProject!=''){
							    str+='-'+unitProject;
							if(matName!=''){
							   str+='-'+matName;
							}
							}
							str+='-'+serNumber;
							DWREngine.setAsync(false); 
							flwInstanceMgm.findFlwInsno(str,function(flag){
								maxflwinsbh = '-'+flag
							})
							DWREngine.setAsync(true);  
							changePanel.getForm().findField('flowno').setValue(str+maxflwinsbh)
							chooseBhWin.hide()
						}
					}
				},{
					text:'重选',iconCls:'btn',
					handler:function(){this.ownerCt.getForm().reset();
					var str='';
							for(var i=0;i<3;i++){
							str+=parseInt(10*Math.random()).toString();
							}
					this.ownerCt.getForm().findField('serNumber').setValue(str);
					}
				}]
			})
			
			chooseBhWin = new Ext.Window({
				title:'选择编号',
				width:360,
				height:240,
				closeAction:'hide',
				frame:true,
				modal:true,
				listeners:{
					'show':function(){
							changePanel.getForm().findField('spec').setDisabled(false)
							changePanel.getForm().findField('unit').setDisabled(false)
							var str='';
							for(var i=0;i<3;i++){
							str+=parseInt(10*Math.random()).toString();
							}
							Ext.getCmp('serNumber').setValue(str);
							var flowtitle = changePanel.getForm().findField('flowname').getValue()
							var flwotitleValue = ''
							var flag = true
							for(var i = 0;i<fileTypeList.length;i++){
								if(fileTypeList[i][1] == flowtitle)
								{
									flwotitleValue = fileTypeList[i][0]
									this.findById('choosebh').getForm().findField('filename').setValue(flwotitleValue)
									this.findById('choosebh').getForm().findField('filename').setRawValue(flowtitle)
									flag = false
								}
							}
							//if(flag)Ext.example.msg('注意','该流程主题的文件类别不存在，请在编号中重新选择文件类别')
					}
				},				
				items:[chooseForm]
			}) 
		}
       chooseBhWin.items.get(0).getForm().reset();
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
	parent.flowWindow.getEl().mask();

	var baseForm = changePanel.getForm();
	var title = baseForm.findField('title').getValue();			//流程标题
	var notes = baseForm.findField('notes').getValue();			//签署意见
	var flowno = baseForm.findField('flowno').getValue();		//流程编号
	var unit = baseForm.findField('unit').getValue();			//流程单位
	var spec = baseForm.findField('spec').getValue();			//流程专业
	var defid = parent.FLOW_ID;		//流程
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
	flwInstanceMgm.insertFlwInstance(defid, obj_ins, obj_log, function(insid){
		if ("" != insid){
			//发起流程选的合同 把合同编号存到实例参数里面 -_-! my god
			if (SEL_CONNO != '-1') {
				DWREngine.setAsync(false);
				flwInstanceMgm.addConToFaceIns(insid, SEL_CONNO);
				DWREngine.setAsync(true);
			}
			if (_userid == handler) {
				baseDao.findByWhere2(beanLog, "flowid='"+parent.FLOW_ID+"' and insid='"+insid+"' and tonode='"+_userid+"' and flag=0", function(list){
					if (list.length > 0){
						parent.flowWindow.hide();
						parent.flowWindow = null;
						var log = list[0];
						toProcessFlow(log);
					} else {
						Ext.Msg.show({
							title: '提示',
							msg: title+'流程已发起！是否上传附件？',
							icon: Ext.Msg.INFO,
							buttons: Ext.Msg.YESNO,
							fn: function(value){
								if ('yes' == value){
									parent.INS_ID = insid;
									parent.showUpload();
								}
								parent.flowWindow.hide();
								parent.flowWindow = null;
							}
						});
					}
				});
			} else {
				Ext.Msg.show({
					title: '提示',
					msg: title+'流程已发起！是否上传附件？',
					icon: Ext.Msg.INFO,
					buttons: Ext.Msg.YESNO,
					fn: function(value){
						if ('yes' == value){
							parent.INS_ID = insid;
							parent.showUpload();
						}
						parent.flowWindow.hide();
						parent.flowWindow = null;
					}
				});
			}
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