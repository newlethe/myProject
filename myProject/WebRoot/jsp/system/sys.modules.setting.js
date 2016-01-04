var treePanel, treeLoader, gridPanel, formPanel, formWin;
var nodes = new Array();
var moduleTypeArr = [[0, '模块分类'], [1, '功能模块'], [2, '功能操作'], [3, 'Portlet']]
var moduleTypeSt;
/*
	None：该模块不允许流程审批（及从业务上不存在审批）；
	BusinessProcess：通过业务流程平台运转；
	ChangeState：通过手动的方式修改流程审批状态；
	ChangeStateAuto：自动修改流程审批状态（即录入时自动设置流程状态为已审批）；
*/
var moduleFlowTypeArr = [['None','不使用流程'],['BusinessProcess','使用业务流程'],['ChangeState','手动设置流程状态'],['ChangeStateAuto','自动设置流程状态']];
var moduleFlowTypeSt;
//0：不显示，1：只显示返回子系统按钮，2：只显示项目选择框，3：两者均显示';
var moduleAloneTypeArr = [['1','显示返回按钮'],['2','显示项目选择框'],['3','两者均显示'],['0','两者均不显示']]
var moduleAloneTypeSt;

var bean = "com.sgepit.frame.sysman.hbm.RockPower";
var business = "systemMgm";
var listMethod = "findByProperty";
var primaryKey = "powerpk";
var orderColumn = "ordercode";
var gridPanelTitle = MODULE_ROOT_NAME;
var formPanelTitle = "编辑记录（查看详细信息）";
var propertyName = "parentid";
var propertyValue = defaultParentId;
var SPLITB = "`";
var root;
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree";
var selectedModuleNode = null;

Ext.onReady(function() {
	moduleTypeSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : moduleTypeArr
	});
	moduleFlowTypeSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : moduleFlowTypeArr
	});
	moduleAloneTypeSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : moduleAloneTypeArr
	});
	var fm = Ext.form; // 包名简写（缩写）
	root = new Ext.tree.AsyncTreeNode({
		text : MODULE_ROOT_NAME,
		id : defaultParentId
	});


	treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=" + defaultParentId + "&treeName=SysModuleTree",
		requestMethod: "GET"
	})
	treePanel = new Ext.tree.TreePanel({
		id : 'modules-tree',
		region : 'west',
		split : true,
		width : 200,
		minSize : 175,
		maxSize : 500,
		frame : false,
		tbar : [{
			iconCls : 'icon-expand-all',
			tooltip : '全部展开',
			handler : function() {
				root.expand(true);
			}
		}, '-', {
			iconCls : 'icon-collapse-all',
			tooltip : '全部折叠',
			handler : function() {
				root.collapse(true);
			}
		}],
		collapsible : true,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader : treeLoader,
		root : root,
		collapseFirst : false
	});

	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=SysModuleTree"; 
	});
	
	treePanel.on('nodedrop',function(e){
		Ext.Msg.show({
			title: '提示',
			msg: '是否确定移动该节点？',
			buttons: Ext.Msg.YESNO,
			fn: function(value){
				if ("yes" == value)
					moveNode(e); 
				else reloadTree();
			},
			icon: Ext.MessageBox.QUESTION
		});
	});

	
	treePanel.on('click', function(node, e) {
		e.stopEvent();
		PlantInt.parentid = node.id;
		var titles = [node.text];
		var obj = node.parentNode
		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		var title = titles.reverse().join(" / ");
		gridPanel.setTitle(title);
		ds.baseParams.params = propertyName + SPLITB + node.id
		selectedModuleNode = node
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});
	
	function moveNode(e){
		Ext.Ajax.request({
			url:CONTEXT_PATH + "/servlet/SysServlet?ac=moveModuleNode",
			method:'post',
			params:{powerPk:e.dropNode.id,relationPk:e.target.id,type:e.point},
			success: function(response, option) {
				var rspXml = response.responseXML
				var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue;
				if(msg=='ok'){
					Ext.example.msg('执行成功',"<p>节点已经移动完毕！");
					ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
				}else{
					Ext.Msg.alert('执行出错',msg);
					reloadTree();
				}
			},
			failure: function(response, option) {
				Ext.Msg.alert('访问出错',"异步通讯失败，请与管理员联系！");
				reloadTree();
			}
		});
	
	}
	

	var fc = { // 创建编辑域配置
		'powerpk' : {
			name : 'powerpk',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'powername' : {
			name : 'powername',
			fieldLabel : '功能名称',
			allowBlank : false
		},
		'resourcepk' : {
			name : 'resourcepk',
			fieldLabel : '标识符（唯一）',
			allowBlank : true
		},
		'parentid' : {
			name : 'parentid',
			fieldLabel : '父模块ID',
			readOnly : true,
			hidden : true
		},
		'modelflag' : {
			name : 'modelflag',
			fieldLabel : '类型',
			allowBlank : false,
			emptyText : '请选择...',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : moduleTypeSt,
			lazyRender : true,
			listClass : 'x-combo-list-small'
		},
		'ordercode' : {
			name : 'ordercode',
			fieldLabel : '排序',
			maxValue : 1000
		},
		'url' : {
			name : 'url',
			fieldLabel : '功能地址'
		},
		'leaf' : {
			name : 'leaf',
			fieldLabel : '叶子？'
		},
		'iconcls' : {
			name : 'iconcls',
			fieldLabel : '图标'
		},
		'flowflag':{
			name : 'flowflag',
			fieldLabel : '流程设置',
			//allowBlank : false,
			emptyText : '请选择...',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : moduleFlowTypeSt,
			lazyRender : true,
			listClass : 'x-combo-list-small'
		},
		'ifalone':{
			name : 'ifalone',
			fieldLabel : '多项目设置',
			//allowBlank : false,
			emptyText : '请选择...',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : moduleAloneTypeSt,
			lazyRender : true,
			listClass : 'x-combo-list-small'
		}
		
	}

	var Columns = [{
		name : 'powerpk',
		type : 'string'
	}, {
		name : 'powername',
		type : 'string'
	}, {
		name : 'resourcepk',
		type : 'string'
	}, {
		name : 'parentid',
		type : 'string'
	}, {
		name : 'modelflag',
		type : 'int'
	}, {
		name : 'ordercode',
		type : 'int'
	}, {
		name : 'url',
		type : 'string'
	}, {
		name : 'leaf',
		type : 'int'
	}, {
		name : 'iconcls',
		type : 'string'
	}, {
		name : 'flowflag',
		type : 'string'
	}, {
		name : 'ifalone',
		type : 'string'
	}];
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		powername : '',
		resourcepk: '',
		parentid : defaultParentId,
		modelflag : '1',
		ordercode : '',
		url : '',
		leaf : 1,
		iconcls : 'folder.png',
		flowflag : 'None',
		ifalone : '3'
	}

	var sm = new Ext.grid.CheckboxSelectionModel()

	var cm = new Ext.grid.ColumnModel([sm, {
		id : 'powerpk',
		header : fc['powerpk'].fieldLabel,
		dataIndex : fc['powerpk'].name,
		hideable:false,
		hidden : true,
		width : 0
	}, {
		id : 'parentid',
		header : fc['parentid'].fieldLabel,
		dataIndex : fc['parentid'].name,
		hideable:false,
		hidden : true,
		width : 0
	}, {
		id : 'ordercode',
		align : 'right',
		header : fc['ordercode'].fieldLabel,
		dataIndex : fc['ordercode'].name,
		width : 40,
		align : 'center',
		editor : new fm.NumberField(fc['ordercode'])
	}, {
		id : 'iconcls',
		header : fc['iconcls'].fieldLabel,
		dataIndex : fc['iconcls'].name,
		width : 40,
		align : 'center',
		renderer: function(vl){
			return vl!=null&&vl!="" ? "<img src='jsp/res/images/icons/" + vl + "'>" : vl
		},
		editor : new fm.TextField(fc['iconcls'])
	}, {
		id : 'powername',
		header : fc['powername'].fieldLabel,
		dataIndex : fc['powername'].name,
		width : 180,
		editor : new fm.TextField(fc['powername'])
	}, {
		id : 'url',
		header : fc['url'].fieldLabel,
		dataIndex : fc['url'].name,
		width : 460,
		editor : new fm.TextField(fc['url'])
	}, {
		id : 'resourcepk',
		header : fc['resourcepk'].fieldLabel,
		dataIndex : fc['resourcepk'].name,
		hideable:false,
		hidden : true,
		width : 0,
		editor : new fm.TextField(fc['resourcepk'])
	}, {
		id : 'modelflag',
		header : fc['modelflag'].fieldLabel,
		dataIndex : fc['modelflag'].name,
		hideable:false,
		hidden : true,
		width : 0,
		renderer : function(value) {
			for(var i=0; i<moduleTypeArr.length; i++){
				if(moduleTypeArr[i][0]+""==value+"")
					return moduleTypeArr[i][1]
			}
		},
		editor : new fm.ComboBox(fc['modelflag'])
	}, {
		id : 'leaf',
		header : fc['leaf'].fieldLabel,
		dataIndex : fc['leaf'].name,
		hideable:false,
		hidden : true,
		width : 0,
		align : 'center',
		renderer : function(value) {
			return value ? '是' : '否';
		}
	}, {
		id : 'flowflag',
		header : fc['flowflag'].fieldLabel,
		dataIndex : fc['flowflag'].name,
		hideable:false,
		hidden : true,
		width : 0,
		renderer : function(value) {
			for(var i=0; i<moduleFlowTypeArr.length; i++){
				if(moduleFlowTypeArr[i][0]+""==value+"")
					return moduleFlowTypeArr[i][1]
			}
		},
		editor : new fm.ComboBox(fc['flowflag'])
	}, {
		id : 'ifalone',
		header : fc['ifalone'].fieldLabel,
		dataIndex : fc['ifalone'].name,
		hideable:false,
		hidden : true,
		width : 0,
		renderer : function(value) {
			for(var i=0; i<moduleAloneTypeArr.length; i++){
				if(moduleAloneTypeArr[i][0]+""==value+"")
					return moduleAloneTypeArr[i][1]
			}
		},
		editor : new fm.ComboBox(fc['ifalone'])
	}])
	cm.defaultSortable = true;

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : propertyName + SPLITB + propertyValue
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
	ds.setDefaultSort(orderColumn, 'asc');

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'module-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : [{
			id:'addIcon',
			text:'设置图标',
			iconCls :'icon-class',
			handler: addIconForModule
		}],
		title : gridPanelTitle,
		iconCls : 'icon-by-category',
		border : false,
		region : 'center',
		clicksToEdit : 1,
		header : true,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		//autoExpandColumn : 1, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		// ctCls: 'borderLeft',
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
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : "systemMgm",
		primaryKey : primaryKey,
		insertHandler : insertFun,
		insertMethod : 'insertModule',
		saveMethod : 'updateModule',
		deleteMethod : 'deleteModule'
	});
	gridPanel.on("aftersave", reloadTree)
	gridPanel.on("afterdelete", reloadTree)
	function reloadTree() {	
		var tree = Ext.getCmp("modules-tree")	
		var path = selectedModuleNode.getPath();
		if(selectedModuleNode.parentNode){
			selectedModuleNode.parentNode.reload();
		}else{
			selectedModuleNode.reload()	
		}
		tree.expandPath(path,null,function(){
			var curNode = tree.getNodeById(selectedModuleNode.id);
			curNode.select()
		})	
	}
	/*
	 * formPanel = new Ext.form.FormPanel({ id:'form-panel', header: false,
	 * border: false, iconCls: 'icon-detail-form', //面板样式 labelAlign: 'top',
	 * items:[ new fm.TextField(fc['modid']), new fm.TextField(fc['parent']),
	 * new fm.TextField(fc['modname']), new fm.ComboBox(fc['property']), new
	 * fm.NumberField(fc['bindex']), new fm.TextField(fc['action']), new
	 * fm.TextField(Ext.apply(fc['leaf'], {inputType : 'checkbox'})) ] });
	 */
	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [gridPanel]
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});
	
	treePanel.render()
	root.expand();
	root.select();
	selectedModuleNode = root
	ds.load({
		params : {
			start : 0, // 起始序号
			limit : PAGE_SIZE
		// 结束序号，若不分页可不用设置这两个参数
		}
	});
	function insertFun() {
		gridPanel.defaultInsertHandler()
	}

});

var iconsWin,portletWin
var gridRecordSelected
var iconSelected
function addIconForModule(){
	var sm = gridPanel.getSelectionModel()
	if (!sm.hasSelection()){
		Ext.MessageBox.alert('操作提示', '请选择一个模块');
		return
	}
	gridRecordSelected = sm.getSelected();
	iconSelected = "";
	if (!iconsWin)
       iconsWin = new Ext.Window({
			title : "设置模块图标操作",
			width : 720,
			height: 480,
			html: "<iframe src='jsp/system/sys.resource.icons.list.jsp' frameborder=0 width=100% height=100%></iframe>",
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: true, maximizable: false,
			listeners:{
				hide : afterConfig
			}
       });
    iconsWin.show();
}

function afterConfig(){
	if (iconSelected!=null &&　iconSelected!="")
		gridRecordSelected.set("iconcls",iconSelected.trim());
}

function configPortlet(){
	if (!portletWin)
		portletWin = new Ext.Window({
			title : "Portlets设置",
			width : 680,
			height: 480,
			html: "<iframe src='jsp/system/sys.portlets.config.jsp' frameborder=0 width=100% height=100%></iframe>",
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: true, maximizable: false
		});
   	portletWin.show();
}
