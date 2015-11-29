var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var nodeBean = "com.sgepit.frame.flow.hbm.NodeView";
var roleBean = "com.sgepit.frame.sysman.hbm.RockRole";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var gridFlw,gridMenuFlw,smFlw, dsFlw,cmFlw,flwWin;
var gridNode,smNode,dsNode,cmNode,nodeTitle;
var gridRole,smRole,dsRole,cmRole,roleTitle;
var flwRangeWin;
var selectedRec;
var selectedUnits = "";
var root;

Ext.onReady(function(){
	//流程信息
	initFlwDefGrid();
	//节点信息
	initNodeGrid();
	//角色信息
	initRoleGrid();

	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [gridFlw, {
			layout: 'border',
			region: 'south',
			height: 300,
			border: false,
			split: true,
			collapsed: false,
		    collapsible: true,
		    animCollapse: true,
			collapseMode: 'mini',
			items:[gridNode, gridRole]
		}]
	});

	dsFlw.load({
		params: {
			start: 0,
			limit: PAGE_SIZE
		}
	});
	ds=dsFlw;//flw.def.guide.js中用到变量ds
	dsFlw.on('load', function(){
		dsNode.removeAll();
		smFlw.selectFirstRow();
	});

	dsNode.on('load', function(){
		dsRole.removeAll();
		smNode.selectFirstRow();
	});

});

var viewTpl = new Ext.XTemplate(
	'<div style="padding: 0px 0px;">',
	'	<applet code="org.jhotdraw.samples.draw.ViewApplet" ',
	'	name="viewApplet" width="674" height="400" ',
	'	archive="'+CONTEXT_PATH+'/jsp/flow/FlowDraw.jar" id="viewApplet">',
	'		<param name="datafile" value="../../temp/{xmlName}.xml" />',
	'	</applet>',
	'</div>'
);

function showFlwPic(flwTitle, flwXml){
	if (!flwWin) {
		flwWin = new Ext.Window({
			title: '流程图',
			iconCls: 'option', closeAction: 'hide',
			width: 685, height: 430,
			modal: true, plain: true, border: false, resizable: false,
			items: viewTpl
		});
	}
	flwWin.setTitle(flwTitle+' - 流程图');
	var data = {xmlName: flwXml}
	flwWin.show();
	viewTpl.overwrite(flwWin.body, data);
}

function contextmenu(thisGrid, rowIndex, e){
	e.stopEvent();
	thisGrid.getSelectionModel().selectRow(rowIndex);
	var record = thisGrid.getStore().getAt(rowIndex);
	gridMenuFlw.removeAll();
	gridMenuFlw.addMenuItem({
		id: 'menu_add',
		text: '　新增流程',
		value: record,
		iconCls: 'add',
		handler: toHandler
	});
	gridMenuFlw.addMenuItem({
		id: 'menu_edit',
		text: '　修改流程',
		value: record,
		iconCls: 'btn',
		handler: toHandler
	});
	gridMenuFlw.addSeparator();
	gridMenuFlw.addMenuItem({
		id: 'menu_stop',
		text: '　删除流程',
		value: record,
		iconCls: 'multiplication',
		handler: toHandler
	});
	gridMenuFlw.addSeparator();
	gridMenuFlw.addMenuItem({
		id: 'flw_range',
		text: '　设置适用单位',
		value: record,
		iconCls: 'btn',
		handler: toHandler
	});
	gridMenuFlw.showAt(e.getXY());
}

function toHandler(){
	var _state = this.id;
	var _record = this.value;
	if ('menu_add' == _state) {
		STATE = 0;
		flwDefWin();
	} else if ('menu_edit' == _state) {
		loadFlowDefData(_record);
		STATE = 2;
		flwDefWin();
	} else if ('menu_stop' == _state) {
		Ext.Msg.show({
			title: '提示',
			msg: '停用流程后，将不会再发起该流程！你确定要停用吗？',
			buttons: Ext.Msg.YESNO,
			icon: Ext.MessageBox.WARNING,
			fn: function(value){
				if ('yes' == value){
					flwDefinitionMgm.stopFlow(_record.get('flowid'), function(){
						ds.load({
							params: {
								start: 0,
								limit: PAGE_SIZE
							}
						});
					});
				}
			}
		});
	} else if('flw_range'==_state){
		showFlwRangeWin(_record);
	}
}
/**
 * 修改流程时，加载_flwTitle, _xmlName, _allFigurePath, _allFlowNode
 */
function loadFlowDefData(record){
	_flwTitle = record.get('flowtitle');
	_xmlName = record.get('xmlname');

	var FigurePath = function(){
		this.pathid,
		this.flowid,
		this.startid,
		this.startType,
		this.endid
	};
	DWREngine.setAsync(false);
	baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwNodePathView","flowid = '"+record.get('flowid')+"'", function(list){
		for (var i = 0; i < list.length; i++) {
			var obj = new FigurePath();
			obj.pathid = list[i].pathid;
			obj.flowid = list[i].flowid;
			obj.startid = list[i].startid;
			obj.startType = list[i].startType;
			obj.endid = list[i].endid;
			_allFigurePath.push(obj);
		}
	});
	DWREngine.setAsync(true);

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
	for (var i = 0; i < dsNode.getCount(); i++) {
		var r = dsNode.getAt(i);
		var o = new FlowNode();
		o.nodeid = r.get('nodeid');
		o.flowid = r.get('flowid');
		o.name = r.get('name');
		o.handler = r.get('handler');
		o.role = r.get('role');
		o.rolename = getRolename(r.get('role'));
		o.type = r.get('type');
		o.funid = r.get('funid');
		o.funname = r.get('funname');
		o.realname = r.get('realname');
		o.istopromoter = r.get('istopromoter');
		_allFlowNode.push(o);
	}
}

function getRolename(strRole){
	var arr = strRole.split(',');
	var strName = "";
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < _roleData.length; j++){
			if (arr[i] == _roleData[j][0]) {
				strName += _roleData[j][1];
				break;
			}
		}
		if (i != arr.length - 1) strName += ',';
	}
	return strName;
}
//实例化流程定义Grid信息
function initFlwDefGrid(){
	smFlw = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
    var isypCheck = new Ext.grid.CheckColumn({
		header : "是否验评流程",
		dataIndex : "isyp",
		autoCommit:true,
		align :"center",
		width: 30
	});
	cmFlw = new Ext.grid.ColumnModel([
		smFlw, {
			id: 'flowid',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true
		},{
			id: 'flowtitle',
			header: '流程标题',
			dataIndex: 'flowtitle',
			width: 100,
			editor: new Ext.form.TextField({readOnly: true})
		},{
			id: 'xmlname',
			header: '流程图',
			dataIndex: 'xmlname',
			width: 100,
			renderer: function(value){
				return '%服务器地址%\\frame\\temp\\'+value+'.xml';
			}
		},{
			id: 'state',
			header: '查看',
			dataIndex: 'state',
			width: 20,
			align: 'center',
			renderer: function(value, meta, record){
				return '<img src="jsp/res/images/shared/icons/application_view_list.png" '
						+'onclick="showFlwPic(\''+record.get('flowtitle')+'\',\''+record.get('xmlname')+'\')" '
						+'onmouseover="this.style.cursor=\'hand\'">';
			}
		},isypCheck
	]);
	cmFlw.defaultSortable = true;
	var ColumnsFlw = [
		{name: 'flowid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'xmlname', type: 'string'},
		{name: 'isyp', type: 'bool'},
		{name: 'state', type: 'string'}
	];

	dsFlw = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: bean,
			business: business,
			method: listMethod,
			params: 'state = \'0\''
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'flowid'
		}, ColumnsFlw),
		remoteSort: true,
		pruneModifiedRecords: true
	});

	dsFlw.setDefaultSort('flowtitle', 'desc');

	var newFlow = new Ext.Button({
		text: '新增流程',
		tooltip: '流程定义',
		iconCls: 'add',
		handler: flwDefWin
	});

	gridFlw = new Ext.grid.EditorGridPanel({
		ds: dsFlw,
		cm: cmFlw,
		sm: smFlw,
		plugins:isypCheck,
		tbar: [{text: "<font color=#15428b><b>&nbsp;定义的流程</b></font>", iconCls: 'option'},'->',newFlow],
		border: false,
		header: false,stripeRows: true,
		clicksToEdit: 1,
		split: true,
		region: 'center',
		autoScroll: true,
		loadMask: true,
		collapsible: true,
    	animCollapse: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsFlw,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        listeners:{
        	afteredit:function(e){
        		var flowid = e.record.get("flowid");
        		flwZlypMgm.setIsypByFlowid(flowid,e.value,function(success){
        			if(!success) Ext.example.msg('','操作失败！');
        		});
        	}
        }
	});

	gridMenuFlw = new Ext.menu.Menu({id: 'gridMenuFlw'});
	gridFlw.on('rowcontextmenu', contextmenu, this);
	smFlw.on('selectionchange', function(){
		var record = smFlw.getSelected();
		if (record) {
			nodeTitle.setText('<font color=#15428b><b>&nbsp;'+record.get('flowtitle')+' - 流程关键节点</b></font>');

			baseDao.findByWhere2(nodeBean,"flowid='"+record.get('flowid')+"'",function(list1){
				if(list1.length>0){
					var sql = "select A.STARTID  from FLW_NODE_PATH A WHERE A.FLOWID='"+record.get('flowid')+"' connect by prior" +
							  " a.endid = a.startid start with a.starttype='0'";
					baseDao.getData(sql,function(list2){
						var nodes = new Array();
						for(var i=0;i<list2.length;i++){
							var nodeid = list2[i];
							for(var j=0;j<list1.length;j++){
								var node = list1[j];
								if(node.nodeid==nodeid){
									nodes.push([nodeid,node.flowid,node.name,node.handler,node.role,node.type,node.funid,node.funname,
											node.username,node.realname,node.modid,node.businessname,node.methodname,node.tablename,node.istopromoter]);
									break;
								}
							}
						}
						dsNode.loadData(nodes);
					})
				}
			})
		}
	});
};
//实例化节点Grid信息
function initNodeGrid(){
	smNode = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	cmNode = new Ext.grid.ColumnModel([
		smNode, {
			id: 'nodeid',
			header: '节点ID',
			dataIndex: 'nodeid',
			hidden: true
		},{
			id: 'flowid',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true
		},{
			id: 'handler',
			header: '处理人ID',
			dataIndex: 'handler',
			hidden: true
		},{
			id: 'role',
			header: '角色IDs',
			dataIndex: 'role',
			hidden: true
		},{
			id: 'type',
			header: '节点类型',
			dataIndex: 'type',
			hidden: true
		},{
			id: 'funid',
			header: '方法ID',
			dataIndex: 'funid',
			hidden: true
		},{
			id: 'name',
			header: '节点名称',
			dataIndex: 'name',
			width: 120
		},{
			id: 'funname',
			header: '方法名称',
			dataIndex: 'funname',
			width: 120
		},{
			id: 'username',
			header: '账号名',
			dataIndex: 'username',
			width: 120
		},{
			id: 'realname',
			header: '用户名',
			dataIndex: 'realname',
			width: 120
		},{
			id: 'modid',
			header: '模块ID',
			dataIndex: 'modid',
			hidden: true
		},{
			id: 'businessname',
			header: '业务实现类',
			dataIndex: 'businessname',
			hidden: true
		},{
			id: 'methodname',
			header: '方法名',
			dataIndex: 'methodname',
			hidden: true
		},{
			id: 'tablename',
			header: '表名',
			dataIndex: 'tablename',
			hidden: true
		},{
			id: 'istopromoter',
			header: '处理人类型',
			dataIndex: 'istopromoter',
			hidden: true
		}
	]);
	cmNode.defaultSortable = false;

	dsNode = new Ext.data.SimpleStore({
		fields:[
			{name: 'nodeid', type: 'string'},
			{name: 'flowid', type: 'string'},
			{name: 'name', type: 'string'},
			{name: 'handler', type: 'string'},
			{name: 'role', type: 'string'},
			{name: 'type', type: 'string'},
			{name: 'funid', type: 'string'},
			{name: 'funname', type: 'string'},
			{name: 'username', type: 'string'},
			{name: 'realname', type: 'string'},
			{name: 'modid', type: 'string'},
			{name: 'businessname', type: 'string'},
			{name: 'methodname', type: 'string'},
			{name: 'tablename', type: 'string'},
			{name: 'istopromoter', type: 'string'}
		]
	});
	nodeTitle = new Ext.Button({
    	text: "<font color=#15428b><b>&nbsp;流程关键节点</b></font>",
    	iconCls: 'division'
    });

	gridNode = new Ext.grid.GridPanel({
		ds: dsNode,
		cm: cmNode,
		sm: smNode,
		tbar: [nodeTitle],
		border: false,draggable :false,
		enableColumnMove :false,enableColumnResize :false,
		enableDragDrop :false,enableHdMenu :false,
		header: false,stripeRows: true,
		split: true,
		region: 'center',
		autoScroll: true,
		loadMask: true,
		collapsible: true,
    	animCollapse: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
	});
	smNode.on('selectionchange', function(){
		var record = smNode.getSelected();
		if (record) {
			roleTitle.setText('<font color=#15428b><b>&nbsp;'+record.get('name')+' - 角色范围</b></font>');
			if (record.get('role')) {
				var arr = record.get('role').split(',');
				var inStr = "(";
				for (var i = 0; i < arr.length; i++) {
					inStr += "'"+arr[i]+"'";
					if (i != arr.length - 1) inStr += ",";
				}
				inStr += ")";
				dsRole.baseParams.params = "rolepk in " + inStr;
				dsRole.load({
					params: {
						start: 0,
						limit: PAGE_SIZE
					}
				})
			}
		}
	});
};
//实例化角色Grid
function initRoleGrid(){
	smRole = new Ext.grid.CheckboxSelectionModel();

	var ColumnsRole = [
		{name: 'rolepk', type: 'string'},
		{name: 'rolename', type: 'string'}
	];

	dsRole = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: roleBean,
			business: business,
			method: listMethod
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'rolepk'
		}, ColumnsRole),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	dsRole.setDefaultSort('rolepk', 'desc');

	roleTitle = new Ext.Button({
    	text: "<font color=#15428b><b>&nbsp;角色范围</b></font>",
    	iconCls: 'pasteUser'
    });

    gridRole = new Ext.grid.GridPanel({
    	sm: smRole,
    	ds: dsRole,
        cm: new Ext.grid.ColumnModel([
        	smRole, {
        		header:'角色ID',
        		dataIndex:'rolepk',
        		hidden: true
        	},{
        		header:'角色名',
        		dataIndex:'rolename',
        		width: 150
        	}
		]),
		tbar: [roleTitle],
        header: false,
        split: true,stripeRows: true,
        collapseMode: 'mini',
        region: 'east',
        iconCls: 'icon-show-all',
        autoScroll: true,
        border: false,
        loadMask: true,
        collapsible: true,
    	animCollapse: true,
        width: 200,
        viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
    });
}

function showFlwRangeWin(record){
	selectedRec = record;
	var flowId = selectedRec.get('flowid');
	DWREngine.setAsync(false);
	flwDefinitionMgm.getFlwRangeUnit(flowId, function(r) {
		selectedUnits = r;
	});

	DWREngine.setAsync(true);
	if (!flwRangeWin){
		root=new Ext.tree.AsyncTreeNode({
	        	  text: USERBELONGUNITNAME,
	        	  id: USERBELONGUNITID,
	        	  checked :false,
	              expanded: true
	        })
		var tree = new Ext.tree.TreePanel({
			id: 'range-unit',
	        animate : true,
	        containerScroll : true,
	        rootVisible : true,
	        width : 150,
	        split : true,
	        autoScroll : true,
	        collapseMode : 'mini',
	        border : false,
	        loader:new Ext.tree.TreeLoader({
				dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
				requestMethod: "GET",
				baseParams:{
					parentId:USERBELONGUNITID,
					ifcheck: true,
					ac:"buildingUnitTree",
					baseWhere:"unitTypeId in ('0','2','3','4','5','A')"
				}
			}),
	        root:root,
	        listeners:{
				beforeload:function(node){
					node.getOwnerTree().loader.baseParams.parentId = node.id;
				}
			}
		});
		tree.on("load", function(){
			if(selectedUnits!=""){
			 	var temp = "`" + selectedUnits + "`";
				if(temp.indexOf("`" + USERBELONGUNITID + "`")>-1) {
					root.getUI().toggleCheck(true);
				}
			}
		});
		tree.on("append", function(tp, pn, n){
			if(selectedUnits!=""){
				var temp = "`" + selectedUnits + "`";
				if(temp.indexOf("`" + n.id + "`")>-1) {
					n.attributes.checked=true;
				}
			}
		})
		flwRangeWin = new Ext.Window({
			title: '流程适用单位',
			closeAction: 'hide',
			width: 370,
			height: 472,
			modal: true, plain: true, border: false, resizable: false,
			layout: 'fit',
			items: [tree],
			tbar: ['->',{
				id: 'saveRange', text: '确定',
				iconCls: 'btn',
				handler: saveRangeFun
			}
			]
		});
	} else {
		var tp = flwRangeWin.getComponent("range-unit");
		var tempNode = tp.getRootNode();
		tempNode.reload();
	}

	flwRangeWin.show();
}

//确定设置流程的适用单位，如果流程已经被某单位使用，则不取消该单位的设置
function saveRangeFun(){
	var flowId = selectedRec.get('flowid');
	var nodeArr = flwRangeWin.getComponent("range-unit").getChecked();
	if(nodeArr && nodeArr.length>0) {
		var unitIds = "";
		for (i=0; i<nodeArr.length; i++) {
			var node = nodeArr[i];
			unitIds += "`" + node.id;
		}
		if(unitIds.length>0) {
			unitIds = unitIds.substring(1);
			flwDefinitionMgm.setFlwRangeUnit(flowId, unitIds, function(r) {
				if(r) {
					Ext.Msg.alert("提示", "设置成功！");
					flwRangeWin.hide();
				} else {
					Ext.Msg.alert("提示", "设置失败！");
				}
			});
		}
	} else {
		Ext.Msg.alert("提示", "请选择本流程适用的单位");
	}
}