var treePanel, gridPanel, codeGridPanel, formPanel, formWin;
var nodes = new Array();
var catTypeSt;
var bean = "com.sgepit.pmis.contract.hbm.ConExp";
var codeBean = "com.sgepit.pmis.contract.hbm.ConExpkid";
var business = "baseMgm";
var listMethod = "findorderby";
var primaryKey = "expid";
var codePrimaryKey = "kidid";
var orderColumn = "conmodel";
var codeOrderColumn = "kidid"
var gridPanelTitle = "属性分类";
var codeGridPanelTitle = "属性值，请选择分类";
var formPanelTiServletUrltle = "编辑记录（查看详细信息）";
var propertyName = "property";
var propertyValue = "0";
var SPLITB = "`";
var root;
var selectedCatId = "-1";
var Positions = new Array();
var pid = CURRENTAPPID;

Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	'expid': {
			name: 'expid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        }, 'pid': {
			name: 'pid',
			fieldLabel: '项目工程编号',
			allowBlank: false,
			anchor:'95%'
		}, 'conmodel': {
			name: 'conmodel',
			fieldLabel: '公式名字',
			allowBlank: false,
			anchor:'95%'
			}
	}
	
    var Columns = [
    	{name: 'expid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conmodel', type: 'string'}];
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {
    	expid: '', 
    	pid: pid,
    	conmodel: ''
    }
    
    var sm =  new Ext.grid.RowSelectionModel()
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	//sm,
    	{
           id:'expid',
           header: fc['expid'].fieldLabel,
           dataIndex: fc['expid'].name,
           hidden:true,
           width: 200
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden:true,
           width: 200
           
        },{
           id:'conmodel',
           header: fc['conmodel'].fieldLabel,
           dataIndex: fc['conmodel'].name,
           width: 80,
           editor: new fm.TextField({
	           name: 'conmodel',
	           allowBlank: false
           })
           // editor: new fm.ComboBox(fc['conmodel'])
        }
	])
    cm.defaultSortable = true;						//设置是否可排序

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
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
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列

	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        title: gridPanelTitle,		//面板标题
        iconCls: 'icon-by-category',//面板样式
        border: false,				// 
        width: 200,
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: "baseMgm",	
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
      	crudText: {					//自定义按钮文字，可选，可部分设置add/save/del/refresh中的一个或几个
      		add:'',
			save:'',
			del:'',
			refresh:''
		},
      	formHandler: function(){
      		if (codeGridPanel.collapsed){
      			codeGridPanel.expand();
    			catGridRowSelected(sm)
      		}
      	},
      	formBtn: true,
      	crudText: {
      		form: '定义属性列表'
      	}
	});
	sm.on('selectionchange', catGridRowSelected);
	
	function catGridRowSelected(obj){
    	var record = sm.getSelected();
    	var reload = false;
    	if (record == null || (record.get("expid")=="")) {
    		if (selectedCatId != "-1"){
	    		gridPanel.getTopToolbar().items.get("form").disable()
	    		selectedCatId = "-1"
	    		codeGridPanel.setTitle(codeGridPanelTitle)
	    		reload = true;
    		}
    	} else {
    		if (selectedCatId != record.get("expid")) {
	    		gridPanel.getTopToolbar().items.get("form").enable()
	    		codeGridPanel.setTitle(record.get("conmodel") + " - 属性值列表")
	    		selectedCatId = record.get("expid")
	    		codePlantInt.expid = selectedCatId
	    		reload = true;
    		}
    	}
    	if (obj!= null && !codeGridPanel.collapsed) {
    		codeDs.baseParams.params = "expid"+SPLITB+selectedCatId
	    	codeDs.load({
		    	params:{
			    	start: 0,			//起始序号
			    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
		    	}
	    	})
    	}
	}
	/*
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	gridPanel.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		//var record = thisGrid.getStore().getAt(rowIndex);
		//var data = record.get("payid");
		gridMenu.removeAll();
	    gridMenu.addMenuItem({
	    	id: 'menu_property',
            text: '　定义属性列表',
            //value: data,
            iconCls: 'form',
            handler: function(){
	      		if (codeGridPanel.collapsed){
	      			codeGridPanel.expand();
	    			catGridRowSelected(sm)
	      		}
	      	}
	    })
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}
	*/
	/**从表**/
	/** 属性值 **/
    var codeColumns = [
    	{name: 'kidid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'expid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'expression', type: 'string'},
		{name: 'expsign', type: 'string'}
	];
    var codePlant = Ext.data.Record.create(codeColumns);			//定义记录集
    var codePlantInt = {
    	expid:selectedCatId,
    	pid: pid,
    	expression: '',
    	expsign: ''
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
	
    var codeSm =  new Ext.grid.RowSelectionModel()
    var codeCm = new Ext.grid.ColumnModel([		// 创建列模型
    	//codeSm, 
    	{
           id:'kidid',
           header: '主键',
           dataIndex: 'kidid',
           hidden:true,
           width: 200
        }, {
           id:'expid',
           header: '主表ID',
           dataIndex: 'expid',
           hidden:true,
           width: 120
        }, {
           id:'pid',
           header: '项目工程编号',
           dataIndex: 'pid',
           hidden:true,
           width: 120
          
        }, {
           id:'expression',
           header: '表达式',
           dataIndex: 'expression',
           width: 100,
           editor: new fm.TextField({
			name: 'expression',
			allowBlank: false
           })
        }, {
           id:'expsign',
           header: '符号',
           dataIndex: 'expsign',
           width: 80,
           editor: new fm.TextField({
			name: 'expsign',
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
        width: 700,
        region: 'east',
        clicksToEdit: 2,
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
      	insertHandler: insertCodevalue,
      	crudText: {					//自定义按钮文字，可选，可部分设置add/save/del/refresh中的一个或几个
      		add:'',
			save:'',
			del:'',
			refresh:''
		}
	});
	
	codeGridPanel.on("expand", function(){
		catGridRowSelected(sm)
	});
	
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;公式定义</b></font>',
		iconCls: 'title'
	});
	
	var btnReturn = new Ext.Button({
		text: '返回',
		tooltip: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
	
    var contentPanel = new Ext.Panel({
        id: 'main-panel',
		//tbar: [titleBar,'->',btnReturn],
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

    ds.load({
    	params:{
	    	start: 0,			//起始序号
	    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
    	}
    });
    
    function insertFun(){
    	gridPanel.defaultInsertHandler()
    }
    
    function insertCodevalue(){
    	if (selectedCatId != "-1"){
    		codeGridPanel.defaultInsertHandler()
    	}
    }	
});

