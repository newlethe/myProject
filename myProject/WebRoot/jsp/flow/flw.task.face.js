var faceBean = "com.sgepit.frame.flow.hbm.FlwFace";
var paramBean = "com.sgepit.frame.flow.hbm.FlwFaceParams";
var modBean = "com.sgepit.frame.flow.hbm.FlwModule";
var colBean = "com.sgepit.frame.flow.hbm.FlwFaceColumns";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var modData = new Array();
var selectFaceid;
var modWindow;
var TCGrid, TCWin, TCData = new Array();
var INSERT_NUM = true;
//选择窗口
var triggerArr = [['no', '无'],['conove', '合同信息'],['mat', '物资信息'],['face','业务节点']]
//参数填写错误提示
var failmsgArr = [
	['编号为【{VALUE}】的出库单已经存在！'],
	['合同编号为【{VALUE}】的合同不存在！'],
	['合同编号为【{VALUE}】的合同变更不存在！'],
	['合同编号为【{VALUE}】已存在！'],
	['领用单号【{VALUE}】已存在！'],
	['开箱单号【{VALUE}】已存在！'],
	['编号为【{VALUE}】的合同付款不存在！'],
	['付款编号【{VALUE}】已存在！']
];
//参数校验的表对应的bean
var bizArr = [
	['com.sgepit.pmis.material.hbm.MatStoreOut', '物资出库'],
	['com.sgepit.pmis.contract.hbm.ConOve', '合同信息'],
	['com.sgepit.pmis.equipment.hbm.EquRec', '设备领用'],
	['com.sgepit.pmis.equipment.hbm.EquOpenBox', '设备开箱'],
	['com.sgepit.pmis.contract.hbm.ConCha', '合同变更'],
	['com.sgepit.pmis.contract.hbm.ConPay', '合同支付']
];
//接口默认值 【可以扩展，定义一些函数】
var defaultvalArr = [['no', '无']];
//自定义校验函数，此处选择后failmsg和bizArr定义将失效
var validateArr = [];

Ext.onReady(function(){
	
	DWREngine.setAsync(false);
	baseDao.queryWhereOrderBy(modBean,'','modname', function(list){
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].modid);
			temp.push(list[i].modname);
			modData.push(temp);
		}
	});
	DWREngine.setAsync(true);
	
	var addBtn = new Ext.Button({
		text: '新增',
		iconCls: 'add',
		handler: function(){
			formPanel.expand();
			saveBtn.setDisabled(false);
		}
	});
	
	var modBtn = new Ext.Button({
		text: '维护模块',
		iconCls: 'form',
		handler: function(){
			showModWin();
		}
	});
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		sm, {
			id: 'faceid',
			header: '接口ID',
			dataIndex: 'faceid',
			hidden: true
		},{
			id: 'modid',
			header: '模块ID',
			dataIndex: 'modid',
			width: 120,
			renderer: function(value){
				for(var i=0; i<modData.length; i++){
					if (modData[i][0] == value) return modData[i][1];
				}
			}
		},{
			id: 'funname',
			header: '功能描述',
			dataIndex: 'funname',
			width: 120
		},{
			id: 'businessname',
			header: '业务实现类',
			dataIndex: 'businessname',
			width: 120,
			hidden: true
		},{
			id: 'methodname',
			header: '方法名',
			dataIndex: 'methodname',
			width: 120,
			hidden: true
		},{
			id: 'tablename',
			header: '表名',
			dataIndex: 'tablename',
			width: 120
		},{
			id: 'viewname',
			header: '视图名',
			dataIndex: 'viewname',
			width: 120
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'faceid', type: 'string'},
		{name: 'modid', type: 'string'},
		{name: 'businessname', type: 'string'},
		{name: 'methodname', type: 'string'},
		{name: 'funname', type: 'string'},
		{name: 'tablename', type: 'string'},
		{name: 'viewname', type: 'string'}
	];
	
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: faceBean,
			business: business,
			method: listMethod,
			params : '1=1'
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'faceid'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('modid', 'desc');
	
	var grid = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: [
			{text: "<font color=#15428b><b>&nbsp;流程任务接口方法</b></font>", iconCls: 'option'},
			'-','模块',{
				xtype : 'textfield',
				width : 60,
				listeners : {
					'blur' : function(t){
						queryCol(ds,'funname',t.getValue());
					}
				}
			},
			'-','表',{
				xtype : 'textfield',
				width : 60,
				listeners : {
					'blur' : function(t){
						queryCol(ds,'tablename',t.getValue());
					}
				}
			},
			'-','视图',{
				xtype : 'textfield',
				width : 60,
				listeners : {
					'blur' : function(t){
						queryCol(ds,'viewname',t.getValue());
					}
				}
			},
			'->', addBtn, '-', modBtn
		],
		border: false,
		header: false, stripeRows: true,
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
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this);
	
	var saveBtn = new Ext.Button({
		text: '保存', 
		iconCls: 'save',
		handler: function(){
			var baseForm = formPanel.getForm();
			if (baseForm.isValid()){
				var obj = new Object();
				for (var i=0; i<Columns.length; i++){
		    		var name = Columns[i].name;
		    		var field = baseForm.findField(name);
		    		if (field) obj[name] = field.getValue();
		    	}
		    	flwFrameMgm.addOrUpdateFlwFace(obj, function(flag){
		    		if ("0" == flag){
		    			Ext.example.msg('保存成功！', '您成功保存一条任务接口信息！');
		    			ds.load({
							params: {
								start: 0,
								limit: PAGE_SIZE
							}
						});
						baseForm.reset();
		    		}
		    		saveBtn.setDisabled(true);
		    	});
			}
		}
	});
	
	var formPanel = new Ext.form.FormPanel({
		border: false,
    	region: 'east',
    	title: '接口方法配置',
    	width: 300,
    	split: true,
    	collapsed: true,
    	collapsible: true,
		collapseMode: 'mini',
    	bodyStyle: 'padding:10px 10px; border: 0px dashed #3764A0',
    	iconCls: 'icon-detail-form',
    	labelAlign: 'left',
    	items: [{
    		xtype: 'fieldset',
    		title: '请您务必正确填写',
    		items: [
    			{
	    			xtype: 'combo',
	    			name: 'modid', fieldLabel: '业务模块',
					valueField: 'k', displayField: 'v',
					emptyText: '请选择模块...',
					mode: 'local', typeAhead: true, editable: false,
					listWidth: 145, width: 133,triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k', 'v'],
						data: modData
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: false
	    		},
	    		{xtype: 'textfield', name: 'funname', fieldLabel: '功能描述', width: 150, allowBlank: false},
	    		{xtype: 'textfield', name: 'tablename', fieldLabel: '表名', width: 150, allowBlank: false},
	    		{xtype: 'textfield', name: 'viewname', fieldLabel: '视图名', width: 150, allowBlank: false},
	    		{xtype: 'textfield', name: 'businessname', fieldLabel: '业务实现类', width: 150, allowBlank: false, value: "无", hidden: true, hideLabel: true},
	    		{xtype: 'textfield', name: 'methodname', fieldLabel: '方法名', width: 150, allowBlank: false, value: "无", hidden: true, hideLabel: true}
    		]
    	},{xtype: 'textfield', name: 'faceid', fieldLabel: '接口ID', width: 150, hidden: true, hideLabel: true}
    		
    	],
    	bbar: ['->', 
    		{
	    		text: '重置', 
	    		iconCls: 'refresh', 
	    		handler: function(){formPanel.getForm().reset();}
    		}, '-', saveBtn
    	]
	});
	
	////////////////////////////////////////////////////////////////
	var addBtnP = new Ext.Button({
		text: '新增',
		iconCls: 'add',
		handler: function(){
			if (selectFaceid){
				formPanelP.expand();
				formPanelP.getForm().findField('faceid').setValue(selectFaceid);
				saveBtnP.setDisabled(false);
			} else {
				Ext.example.msg('提示', '请先选择接口方法！');
			}
		}
	});
	
	var smP = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cmP = new Ext.grid.ColumnModel([
		smP, {
			id: 'faceid',
			header: '接口ID',
			dataIndex: 'faceid',
			hidden: true
		},{
			id: 'paramid',
			header: '参数表ID',
			dataIndex: 'paramid',
			hidden: true
		},{
			id: 'pcname',
			header: '参数中文名',
			dataIndex: 'pcname',
			width: 80
		},{
			id: 'pname',
			header: '参数名',
			dataIndex: 'pname',
			width: 120
		},{
			id: 'ptype',
			header: '参数类型',
			dataIndex: 'ptype',
			width: 120
		}
	]);
	cmP.defaultSortable = true;
	
	var ColumnsP = [
		{name: 'faceid', type: 'string'},
		{name: 'paramid', type: 'string'},
		{name: 'pcname', type: 'string'},
		{name: 'pname', type: 'string'},
		{name: 'ptype', type: 'string'},
		{name: 'validatefn', type: 'string'},
		{name: 'ontrigger', type: 'string'},
		{name: 'defvalfn', type: 'string'},
		{name: 'failmsg', type: 'string'},
		{name: 'biz', type: 'string'},
		{name: 'isexist', type: 'string'}
	];
	
	dsP = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: paramBean,
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
			id: 'paramid'
		}, ColumnsP),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	dsP.setDefaultSort('paramid', 'desc');
	
	var gridP = new Ext.grid.GridPanel({
		ds: dsP,
		cm: cmP,
		sm: smP,
		tbar: [
			{text: "<font color=#15428b><b>&nbsp;流程任务接口参数</b></font>", iconCls: 'flow'},
			'->', addBtnP
		],
		border: false,
		header: false, stripeRows: true,
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
            store: dsP,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var gridMenuP = new Ext.menu.Menu({id: 'gridMenuP'});
	gridP.on('rowcontextmenu', contextmenuP, this);
	
	var saveBtnP = new Ext.Button({
		text: '保存', 
		iconCls: 'save',
		handler: function(){
			var baseForm = formPanelP.getForm();
			if (baseForm.isValid()){
				var obj = new Object();
				for (var i=0; i<ColumnsP.length; i++){
		    		var name = ColumnsP[i].name;
		    		var field = baseForm.findField(name);
		    		if (field) obj[name] = field.getValue();
		    	}
		    	flwFrameMgm.addOrUpdateFlwFaceParams(obj, function(flag){
		    		if ("0" == flag){
		    			Ext.example.msg('保存成功！', '您成功保存一条任务接口参数信息！');
		    			dsP.load({
							params: {
								start: 0,
								limit: PAGE_SIZE
							}
						});
						baseForm.reset();
		    		}
		    		saveBtnP.setDisabled(true);
		    	});
			}
		}
	});
	
	var formPanelP = new Ext.form.FormPanel({
		border: false,
    	region: 'east',
    	title: '接口参数配置',
    	width: 300,
    	split: true,
    	collapsed: true,
    	collapsible: true,
		collapseMode: 'mini',
    	bodyStyle: 'padding:10px 10px; border: 0px dashed #3764A0',
    	iconCls: 'icon-detail-form',
    	labelAlign: 'left',
    	labelWidth : 75,
    	items: [{
    		xtype: 'fieldset',
    		title: '请您务必正确填写',
    		items: [
    			{xtype: 'textfield', name: 'pcname', fieldLabel: '参数中文名', anchor:'98%', allowBlank: false},
	    		{xtype: 'textfield', name: 'pname', fieldLabel: '参数名', anchor:'98%', allowBlank: false},
	    		{
	    			xtype: 'combo',
	    			name: 'ptype', fieldLabel: '参数类型',
					valueField: 'k', displayField: 'v',
					emptyText: '请选择参数类型...',
					mode: 'local', typeAhead: true, editable: false,
					listWidth: 145, anchor:'98%',triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k', 'v'],
						data: [['string', '字符串'],['float', '数字/金额'],['date', '日期/时间']]
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: false
	    		},{
	    			xtype:'combo',
	    			name: 'ontrigger', fieldLabel: '选择窗口',
					valueField: 'k', displayField: 'v',
					mode: 'local', typeAhead: true, editable: false,
					listWidth: 145, anchor:'98%',triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k', 'v'],
						data: triggerArr
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: true
	    		},{
	    			xtype:'combo',
	    			name: 'defvalfn', fieldLabel: '默认值',hidden:true,
					valueField: 'k', displayField: 'v',value:'no',
					mode: 'local', typeAhead: true, editable: false,
					listWidth: 145, anchor:'98%',triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k', 'v'],
						data: defaultvalArr
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: true,
					listeners:{
						"beforehide":function(cmb){ //隐藏filelabel
		       	          cmb.getEl().up('.x-form-item').setDisplayed(false); 
				       } 
					}
	    		},{
	    			xtype:'combo',
	    			name: 'validatefn', fieldLabel: '数据验证',
					valueField: 'k', displayField: 'v',hidden:true,
					mode: 'local', typeAhead: true, editable: false,
					listWidth: 145, anchor:'98%',triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k', 'v'],
						data: validateArr
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: true,
					listeners:{
						"beforehide":function(cmb){ //隐藏filelabel
		       	          cmb.getEl().up('.x-form-item').setDisplayed(false); 
				       } 
					}
	    		},{
	    			xtype:'combo',
	    			name: 'biz', fieldLabel: '业务表',
					valueField: 'k', displayField: 'v',
					mode: 'local', typeAhead: true, editable: false,
					listWidth: 145, anchor:'98%',triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k', 'v'],
						data: bizArr
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: true
	    		},{
	    			xtype:'combo',
	    			name: 'failmsg', fieldLabel: '失败提示',
					valueField: 'k', displayField: 'k',value:'',
					mode: 'local', typeAhead: true, editable: false,
					listWidth: 300, anchor:'98%',triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k'],
						data: failmsgArr
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: true
	    		},{
	    			xtype:'combo',
	    			name: 'isexist', fieldLabel: '验证类别',
					valueField: 'k', displayField: 'v',value:'',
					mode: 'local', typeAhead: true, editable: false,
					anchor:'98%',triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields: ['k','v'],
						data: [['1','存在时验证失败'],['-1','不存在时验证失败']]
					}),
					lazyRender: true,
					listClass: 'x-combo-list-small',
					allowBlank: true
	    		}
    		]
    	},{xtype: 'textfield', name: 'faceid', fieldLabel: '接口ID', width: 150, hidden: true, hideLabel: true}
    	 ,{xtype: 'textfield', name: 'paramid', fieldLabel: '参数ID', width: 150, hidden: true, hideLabel: true}
    	],
    	bbar: ['->', 
    		{
	    		text: '重置', 
	    		iconCls: 'refresh', 
	    		handler: function(){formPanelP.getForm().reset();}
    		}, '-', saveBtnP
    	]
	});
	
	var fmCol = Ext.form;
	var fcCol = {
		'colid': {
			name: 'colid',
			fieldLabel: '列主键',
			anchor:'95%',
			readOnly:true
	    }, 'faceid': {
			name: 'faceid',
			fieldLabel: '接口主键',
			allowBlank: false,
			anchor:'95%'
		}, 'colname': {
			name: 'colname',
			fieldLabel: '列名',
			triggerClass: 'x-form-date-trigger',
			readOnly: true, 
			selectOnFocus: true,
			width: 100, 
			allowBlank: false,
			onTriggerClick: showTC,
			anchor:'95%'
		}
	};
	
	var ColumnsCol = [
		{name: 'colid', type: 'string'},
		{name: 'faceid', type: 'string'},
		{name: 'colname', type: 'string'}
	];
		
	var ColPlant = Ext.data.Record.create(ColumnsCol);
	var ColPlantInt = {
		colid: '',
		faceid: '', 
		colname: ''
	};
	
	var smCol =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	
	var cmCol = new Ext.grid.ColumnModel([
		smCol, {
			id: 'colid',
			header: fcCol['colid'].fieldLabel,
			dataIndex: fcCol['colid'].name,
			hidden: true
	    }, {
			id: 'faceid',
			header: fcCol['faceid'].fieldLabel,
			dataIndex: fcCol['faceid'].name,
			hidden: true
	    }, {
			id: 'colname',
			header: fcCol['colname'].fieldLabel,
			dataIndex: fcCol['colname'].name,
			width: 150,
//			editor: new fmCol.TextField(fcCol['colname'])
			editor: new fmCol.TriggerField(fcCol['colname'])
	    }
	]);
	cmCol.defaultSortable = true;
	
	var dsCol = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: colBean,				
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
	        id: 'colid'
	    }, ColumnsCol),
	
	    remoteSort: true,
	    pruneModifiedRecords: true
	});
	dsCol.setDefaultSort('colid', 'asc');
	
	var gridCol = new Ext.grid.EditorGridTbarPanel({
	    ds: dsCol,
	    cm: cmCol,
	    sm: smCol,
	    iconCls: 'icon-by-category',
	    tbar: [
			{text: "<font color=#15428b><b>&nbsp;可编辑列</b></font>", iconCls: 'flow'},'->'
		],
	    border: false, 
	    region: 'west',
	    clicksToEdit: 1,
	    split: true,
	    collapsed: false,
    	collapsible: true,
		collapseMode: 'mini',
	    header: false,
	    autoScroll: true,
	    autoExpandColumn: 1,
	    loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
	        pageSize: PAGE_SIZE,
	        store: dsCol,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    }),
	    // expend properties
	    plant: ColPlant,
	  	plantInt: ColPlantInt,
	  	servletUrl: MAIN_SERVLET,
	  	bean: colBean,
	  	business: 'baseMgm',
	  	primaryKey: 'colid',
	  	crudText: {
      		add:'',
      		save:'',
      		del:''
      	},
	  	refreshBtn: false,
	  	insertHandler: function(){
	  		if (sm.getSelected()){
	  			ColPlantInt.faceid = sm.getSelected().get('faceid');
				this.defaultInsertHandler();
				if (INSERT_FIRST){
					loadTableColumn(sm.getSelected().get('tablename'));
				}
				INSERT_FIRST = false;
			} else {
				Ext.example.msg('提示', '请先选择接口方法！');
			}
	  	},
	  	width: 200
	});
	
	var paramPanel = new Ext.Panel({
		border: false,
		layout: 'border',
		region: 'south',
		height: 300,
		split: true,
		collapsible: true,
    	animCollapse: true,
		items: [gridCol, gridP, formPanelP]
	});
	////////////////////////////////////////////////////////////////
	
	var centerPanel = new Ext.Panel({
		border: false,
		layout: 'border',
		region: 'center',
		split: true,
		collapsible: true,
    	animCollapse: true,
		items: [grid, paramPanel]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [centerPanel, formPanel]
	});
	
	ds.load({
		params: {
			start: 0,
			limit: PAGE_SIZE
		}
	});
	
	grid.on('click', function(){
		formPanel.collapse();
	});
	
	sm.on('selectionchange', function(){
		if (sm.getSelected()){
			saveBtnP.setDisabled(true);
			selectFaceid = sm.getSelected().get('faceid');
			dsP.baseParams.params = "faceid='"+selectFaceid+"'";
			dsP.load({
				params: {
					start: 0,
					limit: PAGE_SIZE
				}
			});
			INSERT_FIRST = true;
			dsCol.baseParams.params = "faceid='"+selectFaceid+"'";
			dsCol.load({
				params: {
					start: 0,
					limit: PAGE_SIZE
				}
			});
		}
	});
	
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		formPanel.getForm().reset();
		saveBtn.setDisabled(true);
		gridMenu.removeAll();
		gridMenu.add({
			id: 'menu_add',
			text: '　新增',
			iconCls: 'add',
			handler: toHandler
		});
		gridMenu.add({
			id: 'menu_edit',
			text: '　修改',
			value: record,
			iconCls: 'btn',
			handler: toHandler
		});
		gridMenu.add({
			id: 'menu_del',
			text: '　删除',
			value: record,
			iconCls: 'multiplication',
			handler: toHandler
		});
		gridMenu.showAt(e.getXY());
	}
	
	function toHandler(){
		var state = this.id;
		formPanel.expand();
		if ('menu_add' == state){
			formPanel.getForm().reset();
			saveBtn.setDisabled(false);
		} else if ('menu_edit' == state) {
			var record = this.value;
			formPanel.getForm().loadRecord(record);
			saveBtn.setDisabled(false);
		} else if ('menu_del' == state) {
			var faceid = this.value.get('faceid');
			Ext.Msg.show({
				title: '提示',
				msg: '您确定要删除该条数据吗？',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.WARNING,
				fn: function(value){
					if ('yes' == value){
						flwFrameMgm.deleteFlwFace(faceid, function(msg){
							if (msg == "") {
								Ext.example.msg('提示', '数据成功删除！');
								formPanel.getForm().reset();
								ds.load({
									params: {
										start: 0,
										limit: PAGE_SIZE
									}
								});
							} else {
								Ext.Msg.show({
									title: '提示',
									msg: msg,
									buttons: Ext.Msg.OK,
									icon: Ext.MessageBox.WARNING
								});
							}
						});
					}
				}
			});
			
		}
	}
	
	gridP.on('click', function(){
		formPanelP.collapse();
	});
	
	function contextmenuP(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		formPanelP.getForm().reset();
		saveBtnP.setDisabled(true);
		gridMenuP.removeAll();
		gridMenuP.add({
			id: 'menu_addP',
			text: '　新增',
			iconCls: 'add',
			handler: toHandlerP
		});
		gridMenuP.add({
			id: 'menu_editP',
			text: '　修改',
			value: record,
			iconCls: 'btn',
			handler: toHandlerP
		});
		gridMenuP.add({
			id: 'menu_delP',
			text: '　删除',
			value: record,
			iconCls: 'multiplication',
			handler: toHandlerP
		});
		gridMenuP.showAt(e.getXY());
	}
	
	
	function toHandlerP(){
		var state = this.id;
		formPanelP.expand();
		if ('menu_addP' == state){
			formPanelP.getForm().reset();
			formPanelP.getForm().findField('faceid').setValue(selectFaceid);
			saveBtnP.setDisabled(false);
		} else if ('menu_editP' == state) {
			var record = this.value;
			formPanelP.getForm().loadRecord(record);
			saveBtnP.setDisabled(false);
		} else if ('menu_delP' == state) {
			var paramid = this.value.get('paramid');
			Ext.Msg.show({
				title: '提示',
				msg: '您确定要删除该条数据吗？',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.WARNING,
				fn: function(value){
					if ('yes' == value){
						flwFrameMgm.deleteFlwFaceParams(paramid, function(msg){
							if (msg == "") {
								Ext.example.msg('提示', '数据成功删除！');
								formPanelP.getForm().reset();
								dsP.baseParams.params = "faceid='"+selectFaceid+"'";
								dsP.load({
									params: {
										start: 0,
										limit: PAGE_SIZE
									}
								});
							} else {
								Ext.Msg.show({
									title: '提示',
									msg: msg,
									buttons: Ext.Msg.OK,
									icon: Ext.MessageBox.WARNING
								});
							}
						});
					}
				}
			});
			
		}
	}
	
	function showTC(){
		if (!TCWin){
			TCGrid = new Ext.grid.GridPanel({
				ds: new Ext.data.SimpleStore({
					fields: [
						{name: 'COLUMN_NAME', type: 'string'},
						{name: 'DATA_TYPE', type: 'string'},
						{name: 'DATA_PRECISION', type: 'string'},
						{name: 'DATA_LENGTH', type: 'string'},
						{name: 'DATA_SCALE', type: 'string'},
						{name: 'NULLABLE', type: 'string'}
					]
				}),
				cm: new Ext.grid.ColumnModel([
					new Ext.grid.RowNumberer({width: 20}), 
					{id: 'COLUMN_NAME', header: '列名', dataIndex: 'COLUMN_NAME'}, 
					{id: 'DATA_TYPE', header: '数据类型', dataIndex: 'DATA_TYPE'}, 
					{id: 'DATA_PRECISION', header: '精度', dataIndex: 'DATA_PRECISION'}, 
					{id: 'DATA_LENGTH', header: '字段长度', dataIndex: 'DATA_LENGTH'}, 
					{id: 'DATA_SCALE', header: '范围', dataIndex: 'DATA_SCALE'}, 
					{id: 'NULLABLE', header: '是否为空', dataIndex: 'NULLABLE'}
				]),
				border: false, header: false,
				autoScroll: true, split: true,
				collapseMode: 'mini',
				collapsible: true,
		    	animCollapse: true,
		    	margins:'0 0 5 0',
				loadMask: true, stripeRows: true,
				viewConfig: {
					forceFit: true,
					ignoreAdd: true
				},
			    width: 200
			});
			TCWin = new Ext.Window({
				title: ' 表 - 所有列',
				iconCls: 'option',
				layout: 'fit',
				width: 600, height: 260,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: false, plain: true,
				items: [TCGrid]
			});
			TCGrid.on('dblclick', function(){
				var tc = TCGrid.getSelectionModel().getSelected().get('COLUMN_NAME');
				var record = gridCol.getSelectionModel().getSelected();
				record.set('colname', tc);
				TCWin.hide();
			});
		}
		TCWin.show();
		TCWin.setTitle(sm.getSelected().get('tablename')+' 表 - 所有列');
		TCGrid.getStore().loadData(TCData);
	}
});

function showModWin(){
	if (!modWindow){
		modWindow = new Ext.Window({
			title: '流程模块维护',
			iconCls: 'division',
			layout: 'fit',
			width: 510, height: 460,
			modal: true, resizable: false,
			closeAction: 'hide',
			maximizable: false, plain: true,
			items: [gridMod],
			listeners: {
				hide: function(){window.location.reload();}
			}
		})
	}
	modWindow.show();
	dsMod.load({
		params:{
			start: 0,
			limit: PAGE_SIZE
		}
	});
}

var fmMod = Ext.form;
var fcMod = {
	'modid': {
		name: 'modid',
		fieldLabel: '模块主键',
		anchor:'95%',
		readOnly:true
    }, 'modname': {
		name: 'modname',
		fieldLabel: '模块名称',
		allowBlank: false,
		anchor:'95%'
	}, 'url': {
		name: 'url',
		fieldLabel: '地址',
		allowBlank: false,
		anchor:'95%'
	}
};

var ColumnsMod = [
	{name: 'modid', type: 'string'},
	{name: 'modname', type: 'string'},
	{name: 'url', type: 'string'}
];
	
var Plant = Ext.data.Record.create(ColumnsMod);
var PlantInt = {
	modid: '',
	modname: '', 
	url: ''
};

var smMod =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

var cmMod = new Ext.grid.ColumnModel([
	smMod, {
       id:'modid',
       header: fcMod['modid'].fieldLabel,
       dataIndex: fcMod['modid'].name,
       hidden:true
    }, {
       id:'modname',
       header: fcMod['modname'].fieldLabel,
       dataIndex: fcMod['modname'].name,
       width: 120,
       editor: new fmMod.TextField(fcMod['modname'])
    }, {
       id:'url',
       header: fcMod['url'].fieldLabel,
       dataIndex: fcMod['url'].name,
       width: 150,
       editor: new fmMod.TextField(fcMod['url'])
    }
]);
cmMod.defaultSortable = true;

var dsMod = new Ext.data.Store({
	baseParams: {
    	ac: 'list',
    	bean: modBean,				
    	business: business,
    	method: listMethod,
    	params : '1=1'
	},
    proxy: new Ext.data.HttpProxy({
        method: 'GET',
        url: MAIN_SERVLET
    }),
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount',
        id: 'modid'
    }, ColumnsMod),

    remoteSort: true,
    pruneModifiedRecords: true
});
dsMod.setDefaultSort('modname', 'asc');

var gridMod = new Ext.grid.EditorGridTbarPanel({
	id: 'role-grid-panel',
    ds: dsMod,
    cm: cmMod,
    sm: smMod,
    iconCls: 'icon-by-category',
    tbar: [
    	{
			xtype : 'textfield',
			width : 60,
			fieldLabel : '名称',
			listeners : {
				'blur' : function(t){
					queryCol(dsMod,'modname',t.getValue());
				}
			}
		},
		'-','-',
		{
			xtype : 'textfield',
			width : 60,
			fieldLabel : '地址',
			listeners : {
				'blur' : function(t){
					queryCol(dsMod,'url',t.getValue());
				}
			}
		},
		'-'
	],
    border: false, 
    region: 'center',
    clicksToEdit: 1,
    header: false,
    autoScroll: true,
    autoExpandColumn: 1,
    loadMask: true,
	viewConfig:{
		forceFit: true,
		ignoreAdd: true
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: dsMod,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    }),
    // expend properties
    plant: Plant,				
  	plantInt: PlantInt,			
  	servletUrl: MAIN_SERVLET,		
  	bean: modBean,					
  	business: 'baseMgm',	
  	primaryKey: 'modid'
});

	function queryCol(ds,col,val){
		if(val != ""){
			ds.baseParams.params = col+" like '%"+val+"%'";
			ds.reload();
		}
	}

function loadTableColumn(tabName){
	DWREngine.setAsync(false);
	flwFrameMgm.getTableColumns(tabName, function(list){
		for (var i=0; i<list.length; i++){
			var temp = new Array();
			temp.push(list[i].COLUMN_NAME);
			temp.push(list[i].DATA_TYPE);
			temp.push(list[i].DATA_PRECISION);
			temp.push(list[i].DATA_LENGTH);
			temp.push(list[i].DATA_SCALE);
			temp.push(list[i].NULLABLE);
			TCData.push(temp);
		}
	});
	DWREngine.setAsync(true);
}