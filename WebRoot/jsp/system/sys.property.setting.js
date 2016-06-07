﻿var treePanel, gridPanel, codeGridPanel, formPanel, formWin;
var nodes = new Array();
var catTypeSt;
var bean = "com.sgepit.frame.sysman.hbm.PropertyType";
var codeBean = "com.sgepit.frame.sysman.hbm.PropertyCode";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = "uids";
var codePrimaryKey = "uids";
var orderColumn = "moduleName,typeName";
var codeOrderColumn = "itemId"
var gridPanelTitle = "属性分类";
var codeGridPanelTitle = "属性值，请选择分类";
var formPanelTitle = "编辑记录（查看详细信息）";
var propertyName = "property";
var propertyValue = "0";
var SPLITB = "`";
var root;
var selectedTypeName = "-1";
var Positions = new Array();

Ext.onReady(function (){
	
	var showSqlWin;
	var showSqlBtn = new Ext.Toolbar.Button({
		text : '导出SQL',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/flowsend.png',
		handler : showSqlFun
	})
	var sendBtnText = "";
	var sendBtnHide = true;
	var sendBtnIcon = "";
	var sendWin;
	
	if(DEPLOY_UNITTYPE == "A"){
		sendBtnText = "上报";
		sendBtnHide = true;	//暂时屏蔽上报功能
		sendBtnIcon = "upload";
	}else if(DEPLOY_UNITTYPE == "0"){
		sendBtnText = "下发";
		sendBtnHide = false;
		sendBtnIcon = "download";
	}
	var sendPropertyBtn = new Ext.Toolbar.Button({
		text : sendBtnText,
		iconCls: sendBtnIcon,
		hidden : sendBtnHide,
		handler: function(){
			if(sm.getSelections().length == 0) {
				Ext.example.msg('提示',"请先选择需要"+sendBtnText+"的属性分类！");
				return;
			}
			
			var tempNode = "";
			if(DEPLOY_UNITTYPE == "0"){
				if(!sendWin){
					sendWin = new Ext.Window({
						title : '请选择需要下发的项目单位',
						width : 400,
						height : 450,
						layout : 'fit',
						resizable : false,
						border : false,
						modal: true,
						closeAction : 'hide',
						items : [
							new Ext.tree.TreePanel({
							    lines:true,
							    autoScroll:true,
							    animCollapse:false,
							    animate: false,
								width : 388,
								height : 438,
								tbar : [{
									xtype : 'button',
									iconCls: 'select',
									text : '选择',
									handler : function(){
										if(tempNode == ""){
											Ext.example.msg("提示","请选择需要下发的项目单位！")
										}else{
											var records = sm.getSelections();
											var uidsArr = new Array();
											var typeNameArr = "";
											for(var i=0;i<records.length;i++){
												uidsArr.push(records[i].data.uids)
												typeNameArr = typeNameArr +",'"+records[i].data.typeName+"'";
											}
											typeNameArr = typeNameArr.substring(1);
											sendPropertyFun(uidsArr,typeNameArr,tempNode.id);
											sendWin.hide();
										}
									}
								},'-',{
									xtype : 'button',
									iconCls: 'returnTo',
									text : '取消',
									handler : function(){
										sendWin.hide();
										return;
									}
								}],
								loader:new Ext.tree.TreeLoader({
									dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
									requestMethod: "GET",
									baseParams:{
										parentId:USERBELONGUNITID,
										ac:"buildingUnitTree",
										baseWhere:"unitTypeId in ('0','1','2','3','4','5','A')"
									}
								}),
								root:  new Ext.tree.AsyncTreeNode({
							       text: USERBELONGUNITNAME,
							       id: USERBELONGUNITID,
							       expanded:true
							    }),
								listeners:{
									beforeload:function(node){
										node.getOwnerTree().loader.baseParams.parentId = node.id; 
									},
									click : function(node){
										tempNode = node;
									}
								}
							})
						]
					})
				}
				sendWin.show();
			}else if(DEPLOY_UNITTYPE == "A"){
				sendPropertyFun(uidsArr,typeNameArr,defaultOrgRootID)
			}
			
		}
	})
	
	function sendPropertyFun(uidsArr,typeNameArr,tempPid){
		var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"数据交换进行中，请稍等！"});
		if(tempPid != ""){
			myMask.show();
			DWREngine.setAsync(false);
			systemMgm.exchangeDataToSendProperty(uidsArr,typeNameArr,tempPid,function(str){
				Ext.Msg.show({
					title : '提示',
					msg : str,
					width : 300,
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});

			})
			DWREngine.setAsync(true);
			myMask.hide();
		}
	}
	
	function showSqlFun(){
		var records = sm.getSelections();
		if(records.length == 0) {
			Ext.example.msg('提示',"请先选择需要导出的属性分类！");
			return;
		}
		var uidsArr = new Array();
		for(var i=0;i<records.length;i++){
			uidsArr.push(records[i].data.uids)
		}
		DWREngine.setAsync(false);	
		systemMgm.createPropertyInsertSql(uidsArr,function(str){
			if (!showSqlWin){
				showSqlWin = new Ext.Window({
					title : "导出SQL",
					width : 682,
					height : 375,
					modal: true,
					resizable : false,
					plain: true, 
					border: false, 
					closeAction : 'hide',
					items : [
						new Ext.FormPanel({
					        border: false,
					        region: 'center',
					        height : 348,
							items : [{
									id : 'exportSql',
									xtype : 'textarea',
									hideLabel : true,
									readOnly : true,
									border : false,
									width : 670,
									height : 310
								}],
							buttons : [{
									xtype:'button',
									text:'复制',
									handler:function(){
										window.clipboardData.setData("Text",(new Ext.getCmp('exportSql')).getValue());
										Ext.example.msg('提示',"导出的SQL已经复制到剪切板！");
									}
								},{
									xtype:'button',
									text:'关闭',
									handler:function(){
										showSqlWin.hide();
									}
								}]
						})
					]
				});
			}
			(new Ext.getCmp('exportSql')).setValue(str);
			showSqlWin.show();
		})
		DWREngine.setAsync(true);	
	}
	
	//针对cell的数据项，增加单独的配置界面
	addCellColBtn = new Ext.Toolbar.Button({
		id: 'add',
		text: '新增数据项',
		tooltip: '新增报表数据项',
		cls: 'x-btn-text-icon',
		icon : 'business/res/images/add.gif',
		hidden : true,
		handler: addCellColFun
	});
	
	editCellColBtn = new Ext.Toolbar.Button({
		id: 'edit',
		text: '修改数据项',
		tooltip: '修改报表数据项',
		cls: 'x-btn-text-icon',
		icon : 'business/res/images/edit.gif',
		hidden : true,
		handler: editCellColFun
	});
	
	catTypeSt = new Ext.data.SimpleStore({
		fields: ['k','v'],   
		data: [[0,'日期类'],[1,'度量衡'],[2,'业务属性'],[3,'系统属性'],[4,'其他']]
	});
	
	var fm = Ext.form;			// 包名简写（缩写）
	

    var fc = {		// 创建编辑域配置
    	'uids': {
			name: 'uids',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        }, 'typeName': {
			name: 'typeName',
			fieldLabel: '分类名称',
			allowBlank: false,
			anchor:'95%'
		}, 'moduleName': {
			name: 'moduleName',
			fieldLabel: '类别',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            //store: catTypeSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}
	}
	
    var Columns = [
    	{name: 'uids', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'typeName', type: 'string'},
		{name: 'moduleName', type: 'string'}];
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {
    	uids: '', 
    	typeName: '',
    	moduleName: ''
    }
    
    var sm =  new Ext.grid.CheckboxSelectionModel()
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:'uids',
           header: fc['uids'].fieldLabel,
           dataIndex: fc['uids'].name,
           hidden:true,
           width: 200
        }, {
           id:'typeName',
           header: fc['typeName'].fieldLabel,
           dataIndex: fc['typeName'].name,
           width: 200,
           editor: new fm.TextField(fc['typeName'])
        }, {
           id:'moduleName',
           header: fc['moduleName'].fieldLabel,
           dataIndex: fc['moduleName'].name,
           width: 80,
           editor: new fm.TextField(fc['moduleName'])
        }
	])
    cm.defaultSortable = true;						//设置是否可排序

    var ds = new Ext.data.GroupingStore({ // 分组
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params:"1=1"
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        remoteGroup: true,
        pruneModifiedRecords: true,
		sortInfo: {field: 'typeName', direction: "ASC"},	// 分组
		groupField: 'moduleName'	// 分组
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列

	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        title: gridPanelTitle,		//面板标题
        iconCls: 'icon-by-category',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		view: new Ext.grid.GroupingView({	// 分组
            forceFit: true,
            groupTextTpl: '{text}(共{[values.rs.length]}项)'
        }),
        
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: "systemMgm",	
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
		insertMethod: 'insertPropertyType',
		saveMethod: 'updatePropertyType',
		deleteMethod: 'deletePropertyType',
      	formBtn: true,
      	formHandler: function(){
      		if (codeGridPanel.collapsed){
      			codeGridPanel.expand();
    			catGridRowSelected(sm)
      		}
      	},
      	crudText: {
      		form: '定义属性列表'
      	}
	});
	sm.on('selectionchange', catGridRowSelected);
	
	function catGridRowSelected(obj){		
    	var record = sm.getSelected();    	
    	//配置cell数据项
    	if(record){
	    	if(record.get("typeName")=="REPORT_COL"){
	    		//codeGridPanel.disable()
	    		addCellColBtn.show();
	    	}else{
	    		//codeGridPanel.startEditing()
	    		addCellColBtn.hide();
	    	}
	    }    	
    	var reload = false;
    	if (record == null || (record.get("uids")=="")) {
    		if (selectedTypeName != "-1"){
	    		gridPanel.getTopToolbar().items.get("form").disable()
	    		selectedTypeName = "-1"
	    		codeGridPanel.setTitle(codeGridPanelTitle)
	    		reload = true;
    		}
    	} else {
    		if (selectedTypeName != record.get("uids")) {
	    		gridPanel.getTopToolbar().items.get("form").enable()
	    		codeGridPanel.setTitle(record.get("typeName") + "，属性值列表")
	    		selectedTypeName = record.get("uids")
	    		codePlantInt.typeName = selectedTypeName
	    		reload = true;
    		}
    	}
    	if (obj!= null && !codeGridPanel.collapsed) {
    		codeDs.baseParams.params = "typeName"+SPLITB+selectedTypeName
	    	codeDs.load({
		    	params:{
			    	start: 0,			//起始序号
			    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
		    	}
	    	})
    	}
	}
	
	/** 属性值 **/
    var codeColumns = [
    	{name: 'uids', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'typeName', type: 'string'},
		{name: 'propertyCode', type: 'string'},
		{name: 'propertyName', type: 'string'},
		{name: 'moduleName', type: 'string'},
		{name: 'detailType', type: 'string'},
		{name: 'itemId', type: 'int'}
	];
    var codePlant = Ext.data.Record.create(codeColumns);			//定义记录集
    var codePlantInt = {
    	typeName: selectedTypeName,
    	propertyCode: '',
    	propertyName: '',
    	moduleName: '',
    	itemId: ''
    }
    var codeDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: codeBean,				
	    	business: "baseMgm",
	    	method: "findbyproperty"
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: codePrimaryKey
        }, codeColumns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    codeDs.setDefaultSort(codeOrderColumn, 'asc');	//设置默认排序列
	
    var codeSm =  new Ext.grid.CheckboxSelectionModel()
    var codeCm = new Ext.grid.ColumnModel([		// 创建列模型
    	codeSm, {
           id:'uids',
           header: '主键',
           dataIndex: 'uids',
           hidden:true,
           width: 200
        }, {
           id:'typeName',
           header: '属性分类ID',
           dataIndex: 'typeName',
           hidden:true,
           width: 120
        }, {
           id:'propertyCode',
           header: '属性代码',
           dataIndex: 'propertyCode',
           width: 120,
           editor: new fm.TextField({
			name: 'propertyCode',
			allowBlank: false
           })
        }, {
           id:'propertyName',
           header: '属性值',
           dataIndex: 'propertyName',
           width: 220,
           editor: new fm.TextField({
			name: 'propertyName',
			allowBlank: false
           })
        }, {
           id:'moduleName',
           header: '模块',
           dataIndex: 'moduleName',
           width: 220,
           editor: new fm.TextField({
			name: 'moduleName'
           })
        }, {
           id:'detailType',
           header: '详细设置',
           dataIndex: 'detailType',
           width: 220,
           editor: new fm.TextField({
			name: 'detailType',
			allowBlank: true
           })
        }, {
           id:'itemId',
           header: '显示顺序',
           dataIndex: 'itemId',
           width: 90,
           editor: new fm.NumberField({
			name: 'itemId',
            allowNegative: false,
            maxValue: 999,
            allowDecimals: false,
			allowBlank: false
           })
        }
    ])
    codeCm.defaultSortable = true;
    
  	codeGridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'code-grid-panel',
        ds: codeDs,
        cm: codeCm,
        sm: codeSm,
        tbar: [],
        title: codeGridPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        width: 560,
        region: 'east',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        split: true,
        collapsed: true,
        collapsible: true,
        animCollapse: false,
    	collapseMode: 'mini',
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: codeDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: codePlant,				
      	plantInt: codePlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: codeBean,					
      	business: "baseMgm",	
      	primaryKey: codePrimaryKey,		
      	insertHandler: insertpropertyName
      	
	});
	codeGridPanel.on("expand", function(){
		catGridRowSelected(sm)
	})
	codeSm.on('selectionchange', codeGridRowSelected);
	
	function codeGridRowSelected(obj){		
    	var record = codeSm.getSelected();    	
    	//配置cell数据项
    	if(record){
    		selectUids = record.get("uids");
    		selectPCode = record.get("propertyCode");
    		selectPName = record.get("propertyName");
    		selectColCof = record.get("moduleName");
    		selectReportType = record.get("detailType");
    		selectOrder = record.get("itemId");
    		
    		if(record.get("typeName")=="REPORT_COL"){
    			editCellColBtn.show();
    		}else{
    			editCellColBtn.hide();
    		}
	    }else{
	    	editCellColBtn.hide();
	    }
	}
	
    var contentPanel = new Ext.Panel({
        id:'main-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[codeGridPanel, gridPanel]
    });	
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ contentPanel ]
    });	
    
    gridPanel.getTopToolbar().add('-',showSqlBtn,'-',sendPropertyBtn);
    
    //添加过滤
    function doFilter(){
    	gridPanel.getStore().baseParams.params =("typeName like'%"+nameFilter.getValue()+"%' and moduleName like'%"+sortFilter.getValue()+"%'");
		gridPanel.getStore().load({params:{start:0,limit:PAGE_SIZE}});
    }
    var nameFilter = new Ext.form.TextField({
    	width:100,
     	listeners:{
     		specialkey : function(textField, event ){
     			if(event.getKey()==13){	doFilter()}
     		}
     	}
     });
    var sortFilter = new Ext.form.TextField({
     	width:100,
     	listeners:{
     		specialkey : function(textField, event ){
     			if(event.getKey()==13){	doFilter()}
     		}
     	}
     })
    gridPanel.getTopToolbar().add('->','分类名称：',nameFilter,'类别：',sortFilter);
    
	codeGridPanel.getTopToolbar().add('->',addCellColBtn,'-',editCellColBtn);
    ds.load({
    	params:{
	    	start: 0,			//起始序号
	    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
    	}
    });
    
    function insertFun(){
    	gridPanel.defaultInsertHandler()
    }
    
    function insertpropertyName(){
    	if (selectedTypeName != "-1"){
    		codeGridPanel.defaultInsertHandler()
    	}
    }	
});
function codeGridLoad(){
	codeGridPanel.getStore().load({
    	params:{
	    	start: 0,			//起始序号
	    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
    	}
   	})
}
//cell数据项配置方法
var cellColConfigWin
var configMode
var cellColConfigWinUrl = CONTEXT_PATH+"/jsp/system/sys.property.cellColConfig.jsp"
function addCellColFun(){
	configMode = "insert"
	showConfigWin()
}
function editCellColFun(){
	configMode = "edit"
	showConfigWin()
}
function showConfigWin(){
	cellColConfigWin = new Ext.Window({
		id: 'uploadWin',
		title: '报表数据项配置',
		width: 650,
		height: 350,
		modal :true,
		resizable: false,
		//border: false,
		html: '<iframe name="fileFrm" src="'+cellColConfigWinUrl+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	cellColConfigWin.show()
}
