(checkNextBtn()) ? 
	parent.flwDefWindow.getBottomToolbar().items.get('next').enable() :
	parent.flwDefWindow.getBottomToolbar().items.get('next').disable();
	
var appletPanel, roleGrid, smRole, configPanel, saveBtn, selectBtn;

var FlowNode = function(){
	this.nodeid,
	this.flowid,
	this.name,
	this.handler,
	this.role,
	this.rolename,
	this.type,
	this.funid,
	this.funname,
	this.realname,
	this.istopromoter
};

var NodeRecord = Ext.data.Record.create(
	{name: 'nodeid', type: 'string'},
	{name: 'flowid', type: 'string'},
	{name: 'name', type: 'string'},
	{name: 'handler', type: 'string'},
	{name: 'role', type: 'string'},
	{name: 'rolename', type: 'string'},
	{name: 'type', type: 'string'},
	{name: 'funid', type: 'string'},
	{name: 'funname', type: 'string'},
	{name: 'realname', type: 'string'},
	{name: 'istopromoter', type: 'string'}
);

Ext.onReady(function(){
	
	appletPanel = new Ext.Panel({
		region: 'west',
		border: false,
		split: true,
		width: 550, maxSize: 550, minSize: 550,
		collapseMode: 'mini'
    });
	
	var appletTpl = new Ext.XTemplate(
        '<applet code="org.jhotdraw.samples.draw.ConfigApplet" ',
		'name="configApplet" width="550" height="400" ',
		'archive="'+CONTEXT_PATH+'/jsp/flow/FlowDraw.jar" id="configApplet">',
		'<param name="datafile" value="../../temp/{xmlName}.xml" />',
		'</applet>'
    );
    
    var data = {
    	xmlName: parent._xmlName
    };
    
    smRole = new Ext.grid.CheckboxSelectionModel();
    roleGrid = new Ext.grid.GridPanel({
    	sm: smRole,
    	ds: new Ext.data.SimpleStore({
    		fields: [
	            {name: 'roleid', type: 'string'},
	            {name: 'rolename', type: 'string'}
	        ]
    	}),
        cm: new Ext.grid.ColumnModel([
        	smRole, {
        		header:'角色ID', 
        		dataIndex:'roleid', 
        		hidden: true
        	},{
        		header:'角色名', 
        		dataIndex:'rolename', 
        		width: 150
        	}
		]),
		//tbar: [],
        header: false,
        iconCls: 'icon-show-all',
        autoScroll: true,
        border: true,
        loadMask: true,
        width: 263, height: 180
    });
    
    saveBtn = new Ext.Button({
		id: 'save', text: '保存',
		iconCls: 'save',
//		tooltip: '保存状态节点配置信息',
		disabled: true,
		handler: saveFlwNode
	});
	
	selectBtn = new Ext.Button({
		id: 'select', text: '选择',
		iconCls: 'select', 
		tooltip: '选择处理角色', 
		disabled: true, 
		handler: selRole 
	});
    
    configPanel = new Ext.form.FormPanel({
    	border: false,
    	region: 'center',
    	width: 283,
    	split: true,
    	bodyStyle: 'padding:10px 10px; border: 0px dashed #3764A0',
    	iconCls: 'icon-detail-form',
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '配置信息',
    			border: true,
    			layout: 'form',
    			items: [
    				{xtype: 'textfield', name: 'name', fieldLabel: '状态点名称', allowBlank: false},
    				new Ext.form.ComboBox({
						name: 'funid', fieldLabel: '处理方法',
						valueField: 'k', displayField: 'v',
						emptyText: '请选择方法...',
						mode: 'local', typeAhead: true, editable: false,
						width: 125, triggerAction: 'all', disabled: true,
						store: new Ext.data.SimpleStore({
							fields: ['k', 'v'],
							data: parent._funData
						}),
						lazyRender: true,
						listClass: 'x-combo-list-small',
						allowBlank: false
					}),{
    					xtype: 'combo', 
    					name: 'istopromoter', 
    					fieldLabel: '处理人类型', 
    					allowBlank: false, 
    					width: 125,
						valueField: 'k', 
						displayField: 'v',	
						mode: 'local', 
						typeAhead: true, 
						editable: false,
						triggerAction: 'all', 
						disabled: true,
						lazyRender: true,
						value:'S',
						listClass: 'x-combo-list-small',
						store:new Ext.data.SimpleStore({
							fields: ['k', 'v'],
							data: [['S','普通'],['P','流程发起人']]
						})
    				},
    				{
						layout: 'table', layoutConfig: {columns: 2}, border: false,
						items: [{
								width: 172, layout: 'form', border: false,
								items: [{
									xtype: 'textfield', name: 'role', fieldLabel: '处理角色', hidden: true
								}]
							},{
								width: 60, layout: 'form', border: false,
								items: [ 
									selectBtn
								]
							}
						]
					},
					new Ext.form.TriggerField({
    					name: 'realname', 
    					fieldLabel: '默认处理人',
    					triggerClass: 'x-form-date-trigger',
    					readOnly: true, selectOnFocus: true,
    					width: 125, allowBlank: false,
    					onTriggerClick: showWin
    				})
    			]
    		}),{
    			layout: 'table', layoutConfig: {column: 4}, border: false,
    			items: [
    				{xtype: 'textfield', name: 'nodeid', fieldLabel: '状态点ID', hidden: true, hideLabel: true},
    				{xtype: 'textfield', name: 'type', fieldLabel: '状态点类型', hidden: true, hideLabel: true},
		    		{xtype: 'textfield', name: 'handler', fieldLabel: '默认处理人ID', hidden: true, hideLabel: true},
		    		{xtype: 'textfield', name: 'username', fieldLabel: '用户名', hidden: true, hideLabel: true}
    			]
    		},
    		roleGrid
    	],
    	bbar: ['<div id="prompt" style="padding-left: 10px;"></div>', '->', saveBtn]
    });
    
	var viewport1 = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [appletPanel, configPanel]
	});
	
	appletTpl.overwrite(appletPanel.body, data);
	roleGrid.setVisible(false);
	
});

var txtInfo = "请注意时刻保存节点配置信息 >>>>>>", i = 0;
function changeCharColor(){
	str = "<font color='#15428b'>";
	for (var j = 0; j < txtInfo.length; j++) {
		if( j == i) {
			str += "<font color='white'>" + txtInfo.charAt(i) + "</font>";
		} else {
			str += txtInfo.charAt(j);
		}
	}
	str += "</font>";
	document.getElementById('prompt').innerHTML = str;
	(i == txtInfo.length) ? i=0 : i++;
}
setInterval("changeCharColor()", 100);

function showWin(){
	if (roleGrid.getSelectionModel().getSelections().length == 0) {
		oPopup._alert(window, '提示', '请先选择角色！');
		return;
	}
	if (!appletPanel.collapsed) document.getElementById('configApplet').style.display = 'none';//appletPanel.collapse();
	if(!userWindow){
		userWindow = new Ext.Window({	               
			title: '默认处理人列表',
			iconCls: 'form',
			layout: 'border',
			width: 600, height: 300,
			modal: true,
			closeAction: 'hide',
			maximizable: true,
			plain: true,
			items: [treePanel, grid]
		});
		userWindow.on('hide', function(){
			document.getElementById('configApplet').style.display = 'block';//appletPanel.expand();
		});
	}
	var roleArr = selectRoles();
	var userds = grid.getStore();
	buildRoleTree(roleArr);
	userds.removeAll();
	userWindow.show();
	if(roleArr.length>0){
		if(gridTitleBar&&gridTitleBar.setText) gridTitleBar.setText(roleArr[0][1]);
		userds.baseParams.params = 'roleid'+SPLITB+roleArr[0][0];
		userds.load({
			params:{
			 	start: 0,
			 	limit: PAGE_SIZE
			}
		});
	}
}

function selectRoles(){
	var records = roleGrid.getSelectionModel().getSelections();
	var arrRoles = new Array();
	for (var i = 0; i < records.length; i++) {
		var _role = new Array();
		_role.push(records[i].get('roleid'));
		_role.push(records[i].get('rolename'));
		arrRoles.push(_role);
	}
	return arrRoles;
}

/////////////////////////////////////////////////////////////
//TODO 暂时无法实现在 Popup 中使用 Ext ;
//	var oPopup = window.createPopup();
//	function ButtonClick()
//	{
//		var oPopBody = oPopup.document.body;
////		oPopBody.style.backgroundColor = "lightyellow";
////		oPopBody.style.border = "solid black 1px";
//		var _inner = '<html><head><title>dsf</title>';
//		_inner += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
//		_inner += '<link rel="stylesheet" type="text/css" href="/ext2/resources/css/ext-all.css" />';
//		_inner += '<script type="text/javascript" src="/ext2/adapter/ext/ext-base.js"></script>';
//		_inner += '<script type="text/javascript" src="/ext2/ext-all.js"></script>';
//		_inner += '<script type="text/javascript" src="/ext2/ext-lang-zh_CN.js"></script>';
//		_inner += '<script type="text/javascript" src="jsp/flow/flw.defUser.choose.js"></script>';
//		_inner += '<script type="text/javascript">';
//		_inner += '';
//		_inner += '    Ext.onReady(function(){';
//		_inner += '        var userPanel = new Ext.Panel({';
//		_inner += '            title: "默认处理人列表",';
//		_inner += '            iconCls: "form",';
//		_inner += '            layout: "border",';
//		_inner += '            width: 600, height: 300,';
//		_inner += '            plain: true,';
//		_inner += '            items: [treePanel, grid]';
//		_inner += '        });';
//		_inner += '        var viewport = new Ext.Viewport({';
//		_inner += '            layout: "fit",';
//		_inner += '            border: false,';
//		_inner += '            items: [userPanel]';
//		_inner += '        });';
//		_inner += '    });';
//		_inner += '</script>';
//		_inner += '</head>';
//		_inner += '<body><span></span></body></html>';
////		oPopBody.innerHTML = _inner;//"Click outside <B>popup</B> to close.";
//		oPopup.document.write(_inner);
//		oPopup.show(2, 2, 600, 300, document.body);
//	}
////	ButtonClick();
/////////////////////////////////////////////////////////////

function selRole(){
	roleGrid.setVisible(true);
	roleGrid.getStore().loadData(parent._roleData);
}

//设置勾选项
function selSelected(roles){
	var _arrIndex = new Array();
	var _arrRoles = roles.split(',');
	for (var i = 0; i < _arrRoles.length; i++) {
		for (var j = 0; j < roleGrid.getStore().getCount(); j++) {
			var record = roleGrid.getStore().getAt(j);
			if (record.get('roleid') == _arrRoles[i]){
				_arrIndex.push(j);
			}
		}
	}
	if (_arrIndex.length > 0) 
		roleGrid.getSelectionModel().selectRows(_arrIndex);
}

//从角色Grid上得到选择的角色
function getRoles(){
	var _roles = '', _rolenames = '', _arr = new Array();
	var _records = roleGrid.getSelectionModel().getSelections();
	for (var i = 0; i < _records.length; i++) {
		var record = _records[i];
		_roles += record.get('roleid');
		_rolenames += record.get('rolename');
		if (_records.length - 1 != i) {
			_roles += ',', _rolenames += ',';
		}
	}
	_arr.push(_roles);
	_arr.push(_rolenames);
	return _arr;
}

function findFlowNode(nodeid){
	for (var i = 0; i < parent._allFlowNode.length; i++) {
		if (parent._allFlowNode[i].nodeid == nodeid)
			return i;
	}
	return null;
}

function checkNextBtn(){
	var _figures = new Array();
	for (var i = 0; i < parent._allFigurePath.length; i++) {
		_figures.push(parent._allFigurePath[i].startid);
	}
	
	Array.prototype.strip=function(){
    if(this.length<2) [this[0]]||[];
	    var arr=[];
	    for(var i=0;i<this.length;i++){
	        arr.push(this.splice(i--,1));
	        for(var j=0;j<this.length;j++){
	            if(this[j]==arr[arr.length-1]){
	                this.splice(j--,1);
	            }
	        }
	    }
	    return arr;
	}
	
	_figures = _figures.strip();
	if (_figures.length > 0 && _figures.length == parent._allFlowNode.length){
		return true;
	}
	return false;
}

function saveFlwNode(){
	var _form = configPanel.getForm();
	if (_form.isValid() && roleGrid.getSelectionModel().getCount() > 0){
		var _flowNode = new FlowNode();
		var _arrRole = getRoles();
		_flowNode.nodeid = _form.findField('nodeid').getValue();
		_flowNode.flowid = '';
		_flowNode.name = _form.findField('name').getValue();
		_flowNode.handler = _form.findField('handler').getValue();
		_flowNode.role = _arrRole[0];
		_flowNode.rolename = _arrRole[1];
		_flowNode.type = _form.findField('type').getValue();
		_flowNode.funid = _form.findField('funid').getValue();
		_flowNode.funname = _form.findField('funid').getRawValue();
		_flowNode.realname = _form.findField('realname').getValue();
		_flowNode.istopromoter = _form.findField('istopromoter').getValue();
		var _index = findFlowNode(_flowNode.nodeid);
		(null != _index) ? parent._allFlowNode[_index] = _flowNode : parent._allFlowNode.push(_flowNode);
		
		document.applets[0].saveTaskFigure(_flowNode.name, _flowNode.realname, _flowNode.funname);
		
		if (checkNextBtn()) {
			parent.flwDefWindow.getBottomToolbar().items.get('next').enable();
			oPopup._alert(window, '提示', '节点配置完毕,可以进行一步！');
		} else {
			oPopup._alert(
				window, 
				'提示', 
				'节点:['+_form.findField('name').getValue()+']保存成功！');
		}
		setBtnEnable(false);
	}
}

/**
 * 与Applet通信的方法 - 页面上相应绘图区的鼠标单击、拖动事件
 */
function doAction(strNodeInfo){
	var _form = configPanel.getForm();
	_form.reset();
	setBtnEnable(true);
	var nodeInfo = strNodeInfo.split('@');
	var _index = findFlowNode(nodeInfo[0].split(':')[1]);
	if (null != _index){
		_form.loadRecord(new NodeRecord(parent._allFlowNode[_index]));
		selRole();
		selSelected(_form.findField('role').getValue());
	} else {
	
		_form.findField('nodeid').setValue(nodeInfo[0].split(':')[1]);
		_form.findField('name').setValue(nodeInfo[1].split(':')[1]);
		_form.findField('type').setValue(nodeInfo[3].split(':')[1]);
		if (roleGrid.isVisible()){
			roleGrid.setVisible(false);
			roleGrid.getSelectionModel().clearSelections();
		}
	}
}

/**
 * 与Applet通信的方法 - 控制页面上按钮的状态
 */
function setBtnEnable(state){
	if (state){
		saveBtn.enable();
		selectBtn.enable();
		configPanel.getForm().findField('funid').enable();
		configPanel.getForm().findField('istopromoter').enable();
	} else {
		saveBtn.disable();
		selectBtn.disable();
		configPanel.getForm().findField('funid').disable();
		configPanel.getForm().findField('istopromoter').disable();
		configPanel.getForm().reset();
		roleGrid.setVisible(false);
		roleGrid.getSelectionModel().clearSelections();
	}
}

/**
 * 与Applet通信的方法 - 保存流程图
 */
function saveFigures(xmlOutput){
	flwDefinitionMgm.createXML(xmlOutput, parent._xmlName);
}