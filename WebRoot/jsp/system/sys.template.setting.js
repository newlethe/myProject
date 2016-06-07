var treePanel, gridPanel, formPanel, formWin;
var nodes = new Array();
var templateTypeSt;
var bean = "com.sgepit.lab.ocean.sysman.hbm.SgccGuidelineModelMaster";
var business = "systemTemplateService";
var listMethod = "getTemplatesByProperty";
var primaryKey = "modelId";
var orderColumn = "sjlx";
var COMPANY = defaultParentName
var gridPanelTitle = COMPANY;
var detailPanelTitle = "";
var posiGridPanelTitle = "岗位列表，请选择机构";
var formPanelTitle = "编辑记录（查看详细信息）";
var propertyName = "deptId";
var propertyValue = defaultParentId;
var SPLITA = ";";
var SPLITB = "`";
var root;
var templateType = new Array();
var yearBox,modelBox;

var defaultDept = defaultParentId;

//指标相关
var detailPanelTitle = "";
var detailPanel;
var detailBean = "com.sgepit.frame.sysman.hbm.SgccGuidelineModelDetail";
var detailBusiness = "systemTemplateService";
var listDetailMethod = "findbyProperty";
var detail_order = "zbSeqno";
var detailPlantInt
var detailPrimaryKey = "uids";
var d_propertyName = "modelId";
var d_propertyValue = '';
//end 指标相关

Ext.onReady(function (){
	DWREngine.setAsync(false);	
	var temp1 = new Array();
	temp1.push("all");
	temp1.push("所有");
	templateType.push(temp1);
	systemMgm.getCodeValue("REPORT_TYPE", function(list){
		
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			templateType.push(temp);
		}
	});	
    DWREngine.setAsync(true);
    
	templateTypeSt = new Ext.data.SimpleStore({
		fields: ['k','v'],   
		data: templateType
	});
	
	//组织机构树
    treePanel.on('click', function(node, e){
		e.stopEvent();
		PlantInt.deptId = node.id;
		PlantInt.deptName = node.text;
		PlantInt.dwlx = node.attributes.nodeType;
		var titles = [node.text];
		var obj = node.parentNode;
		while(obj!=null){
			titles.push(obj.text);
			obj = obj.parentNode;
		}
		
		defaultDept = node.id;
		//yearLoad()
		modelBox.clearValue();
		yearBox.clearValue();
		detailPanel.collapse();
		
		var title = titles.reverse().join(" / ");
		gridPanel.setTitle(title);  
		refreshGrid();
    });
    
	//模板区域
    var fc = {		// 创建编辑域配置
    	'modelId': {
			name: 'modelId',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			allowBlank: false,
			hidden:true,
			hideLabel:true
        },'unitId': {
			name: 'unitId',
			fieldLabel: '单位编号',
			readOnly:true,
			allowBlank: false,
			anchor:'95%',
			hidden:true,
			hideLabel:true
		}, 'deptId': {
			name: 'deptId',
			fieldLabel: '部门编号',
			readOnly:true,
			allowBlank: false,
			hidden:true,
			anchor:'95%'
		}, 'deptName': {
			name: 'deptName',
			fieldLabel: '部门名称',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
		}, 'sjlx': {
			name: 'sjlx',
			fieldLabel: '时间',
			allowBlank: false
		}, 'dwlx': {
			name: 'dwlx',
			fieldLabel: '单位类型id',
			readOnly:true,
			hidden:true
		}, 'modelType': {
			name: 'modelType',
			fieldLabel: '模板类型',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: templateTypeSt,
            lazyRender:true,
            listClass: 'x-combo-list-small'
		}, 'title': {
			name: 'title',
			fieldLabel: '名称',
			allowBlank: false
		}, 'memo': {
			name: 'memo',
			fieldLabel: '模板'
		}, 'resportNo': {
			name: 'resportNo',
			fieldLabel: 'cell模板',
			hidden:true
        }
	};
	
    var Columns = [
    	{name: 'modelId', type: 'string'},			//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'unitId', type: 'string'},	
    	{name: 'deptId', type: 'string'},	
		{name: 'deptName', type: 'string'},
		{name: 'sjlx', type: 'string'},
		{name: 'modelType', type: 'string'},
    	{name: 'title', type: 'string'},
    	{name: 'dwlx', type: 'string'},
    	{name: 'memo', type: 'string'},
    	{name: 'resportNo', type: 'string'}];
	var Fields = Columns;
		
    var Plant = Ext.data.Record.create(Columns);
    
    var PlantInt = {
    	modelId:'',
    	unitId:defaultDept,
    	deptId: defaultDept, 
    	sjlx: '',
    	dwlx:'1',
    	modelType: '',
    	title: ''
    };
    
    var sm =  new Ext.grid.CheckboxSelectionModel();

    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:'modelId',
           header: fc['modelId'].fieldLabel,
           dataIndex: fc['modelId'].name,
           hidden:true,
           width: 60
        }, {
           id:'unitId',
           header: fc['unitId'].fieldLabel,
           dataIndex: fc['unitId'].name,
           hidden:true,
           width: 100
		}, {
           id:'deptName',
           header: fc['deptName'].fieldLabel,
           dataIndex: fc['deptName'].name,
           //hidden:true,
           width: 80
        }, {
           id:'deptId',
           header: fc['deptId'].fieldLabel,
           dataIndex: fc['deptId'].name,
           hidden:true,
           width: 60
        }, {
           id:'dwlx',
           header: fc['dwlx'].fieldLabel,
           dataIndex: fc['dwlx'].name,
           hidden:true,
           width: 60
        }, {
           id:'modelType',
           header: fc['modelType'].fieldLabel,
           dataIndex: fc['modelType'].name,
           width: 100,
  			renderer: function(value){
           	 for(var i=0; i<templateType.length; i++){
           	 	if (value == templateType[i][0])
           	 		return templateType[i][1]
           	 }
           },
           editor: new Ext.form.ComboBox(fc['modelType'])
        }, {
           id:'sjlx',
           header: fc['sjlx'].fieldLabel,
           dataIndex: fc['sjlx'].name,
           width: 60,
           editor: new Ext.form.TextField(fc['sjlx'])
        }, {
           id:'title',
           //align: 'right',
           header: fc['title'].fieldLabel,
           dataIndex: fc['title'].name,
           width: 220,
           editor: new Ext.form.TextField(fc['title'])
        }, {
           id:'resportNo',
           //align: 'right',
           header: fc['resportNo'].fieldLabel,
           dataIndex: fc['resportNo'].name,
           hidden:true,
           width: 200
        }, {
           id:'memo',
           //align: 'right',
           header: fc['memo'].fieldLabel,
           dataIndex: fc['memo'].name,
           renderer:function(){ return "<img src='jsp/res/images/xls.png' onclick='openCellWin()' alt='Cell报表'>&nbsp;&nbsp;<img src='jsp/res/images/grid.gif' onclick='openDetailGrid()' alt='指标配置' style='display:none'>"},
           width: 80
           //editor: new Ext.Button(fc['title'])
        }
	]);
    cm.defaultSortable = true;						//设置是否可排序

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+SPLITB+propertyValue
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

	//模板列表
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'org-grid-panel',			//id,可选
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
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        //ctCls: 'borderLeft',
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
      	business: "systemTemplateService",	
      	primaryKey: primaryKey,		
      	//insertHandler: insertFun,
      	deleteHandler: deleteFun,
		insertMethod: 'insertTemplate',
		saveMethod: 'updateTemplate',
		deleteMethod: 'deleteTemplate'
	});
	
	gridPanel.on("aftersave", reloadTree)
	gridPanel.on("afterdelete", reloadTree)
	
	//指标相关***
	//模板区域
    var detailfc = {		// 创建编辑域配置
    	'uids': {
			name: 'uids',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			allowBlank: false,
			hidden:true,
			hideLabel:true
    	},'modelId': {
			name: 'modelId',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			allowBlank: false,
			hidden:true,
			hideLabel:true
        },'zbSeqno': {
			name: 'zbSeqno',
			fieldLabel: '指标编号',
			readOnly:true,
			allowBlank: false,
			anchor:'95%',
			hidden:true,
			hideLabel:true
		}, 'name': {
			name: 'name',
			fieldLabel: '指标名称',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
		}, 'sheetname': {
			name: 'sheetname',
			fieldLabel: '表单显示名称',
			readOnly:true,
			hidden:true,
			anchor:'95%'
		}, 'jldw': {
			name: 'jldw',
			fieldLabel: '计量单位',
			allowBlank: false,
			anchor:'95%'
		}, 'isDisplay': {
			name: 'isDisplay',
			fieldLabel: '汇总表是否显示',
			anchor:'95%'
		}, 'readonly': {
			name: 'readonly',
			fieldLabel: '是否只读',
			readOnly:true,
			hidden:true,
			anchor:'95%'
        }
	};
	
	var isDisplayColumn = new Ext.grid.CheckColumn({
		id:'isDisplay',
           header: detailfc['isDisplay'].fieldLabel,
           dataIndex: detailfc['isDisplay'].name,
           width: 10
    });
    var readonlyColumn = new Ext.grid.CheckColumn({
		id:'readonly',
        header: detailfc['readonly'].fieldLabel,
        dataIndex: detailfc['readonly'].name,
        width: 10
    });
    
    var detailColumns = [
    	{name: 'uids', type: 'string'},	
    	{name: 'modelId', type: 'string'},			//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'zbSeqno', type: 'string'},		
		{name: 'name', type: 'string'},
		{name: 'sheetname', type: 'string'},
		{name: 'jldw', type: 'string'},
		{name: 'isDisplay', type: 'bool'},
		{name: 'readonly', type: 'bool'}];
		
    var detailPlant = Ext.data.Record.create(detailColumns);
    
    detailPlantInt = {
//    	uids:'',
    	modelId:'',
    	zbSeqno:'',
    	name:'',
    	sheetname:'',
    	jldw: '',
    	isDisplay:'',
    	readonly: ''
    };
    
    var d_sm =  new Ext.grid.CheckboxSelectionModel();

    var d_cm = new Ext.grid.ColumnModel([		// 创建列模型
    	d_sm, {
           id:'uids',
           header: detailfc['uids'].fieldLabel,
           dataIndex: detailfc['uids'].name,
           hidden:true,
           width: 10
        }, {
       	id:'modelId',
           header: detailfc['modelId'].fieldLabel,
           dataIndex: detailfc['modelId'].name,
           hidden:true,
           width: 10
        }, {
           id:'zbSeqno',
           header: detailfc['zbSeqno'].fieldLabel,
           dataIndex: detailfc['zbSeqno'].name,
           width: 10
		}, {
           id:'name',
           header: detailfc['name'].fieldLabel,
           dataIndex: detailfc['name'].name,
           width: 10,
           editor: new Ext.form.TextField(fc['name'])
        }, {
           id:'sheetname',
           header: detailfc['sheetname'].fieldLabel,
           dataIndex: detailfc['sheetname'].name,
           width: 10,
           editor: new Ext.form.TextField(fc['sheetname'])
        }, {
           id:'jldw',
           header: detailfc['jldw'].fieldLabel,
           dataIndex: detailfc['jldw'].name,
           width: 10,
           editor: new Ext.form.TextField(fc['jldw'])
        },isDisplayColumn,readonlyColumn
	]);
    d_cm.defaultSortable = true;						//设置是否可排序

    var d_ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: detailBean,				
	    	business: detailBusiness,
	    	method: listDetailMethod
	    	//params: d_propertyName+SPLITB+d_propertyValue
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
            id: detailPrimaryKey
        }, detailColumns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    d_ds.setDefaultSort(detail_order, 'asc');	//设置默认排序列

	//指标配置列表
	detailPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'detail-grid-panel',			//id,可选
        ds: d_ds,						//数据源
        cm: d_cm,						//列模型
        sm: d_sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        title: gridPanelTitle,		//面板标题
        iconCls: 'icon-by-category',	//面板样式
        //border: false,				// 
        width: 600,
        split:true,
        region: 'east',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        header: true,	
        collapsed: true,			//
        collapseMode: 'mini',
        collapsible: true,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        //ctCls: 'borderLeft',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: d_ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plugins:[
			isDisplayColumn,readonlyColumn
		],
        // expend properties
        plant: detailPlant,				
      	plantInt: detailPlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: detailBean,					
      	business: "systemTemplateService",	
      	primaryKey: detailPrimaryKey,		
      	insertHandler: insertDetailFun,
      	deleteHandler: deleteDetailFun,
		insertMethod: 'insertDetail',
		saveMethod: 'updateDetail',
		deleteMethod: 'deleteDetail'
	});
	//end 指标相关***
	
	function reloadTree() {	
		var tree = Ext.getCmp("orgs-tree")		
		var nodePath = selectedOrgNode.getPath();
		if(selectedOrgNode.parentNode!=null){
			selectedOrgNode.parentNode.reload()	;
		}else{
			selectedOrgNode.reload();
		}
		tree.expandPath(nodePath,null,function(){
			var curNode = tree.getNodeById(selectedOrgNode.id);
			curNode.select()
		})	
	}	
	
    var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        region:'center',
        split:true,
        layout:'fit',
        layoutConfig: {
        	height:'100%'
        },
        items:[gridPanel/*,detailPanel*/]
    });	
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ treePanel, contentPanel ]
    });	
    
    var backBtn = new Ext.Toolbar.Button({
			id: 'back',
			text: '返回',
			cls: 'x-btn-text-icon',
			icon: BASE_PATH+'jsp/res/images/toolbar/undo.gif',
			handler: backMaster
	});
	function backMaster(){
		//detailPanel.collapse();
	}
    //查询条件
    modelBox = new Ext.form.ComboBox({
    	id:'modelBox',
		store: templateTypeSt,
		width:180,
		displayField:'v',
		valueField : 'k',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    modelBox.on('select',function(c,r,i){
		refreshGrid();
	});
    
    var store = new Ext.data.SimpleStore({
        fields: ['val','txt']
    });
    yearBox = new Ext.form.ComboBox({
		id:'yearBox',
		store: store,
		width:80,
		//allowBlank: false,
		displayField:'txt',
		valueField : 'val',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
	});
	yearBox.on('select',function(c,r,i){
		refreshGrid();
	});
	yearLoad();
	
	function yearLoad(){
		DWREngine.setAsync(false);	
		
		systemTemplateService.getMasterYear(defaultDept, function(dat){
			store.loadData(eval(dat),false)
		});	
	    DWREngine.setAsync(true);
	}

	initOthers();
	
	function initOthers(){
		gridPanel.getTopToolbar().add( '->',  '选择模板类型:',modelBox,'年度:', yearBox);
		//detailPanel.getTopToolbar().add(backBtn);

		treeNodeUrl =  CONTEXT_PATH + "/servlet/SysServlet?ac=tree";
		
		treePanel.render()
		root.expand();	
		root.select();
		selectedOrgNode = root
		PlantInt.deptId = defaultDept;
		PlantInt.deptName = COMPANY;
		refreshGrid();
    }
    
    
    
    function insertFun(){
    	gridPanel.defaultInsertHandler();
    }
    
    function deleteFun(){
    	var records = sm.getSelections();
    	if (records.length > 0){
	    	var ids = new Array();
	    	for (var i=0; i<records.length; i++){
	    		ids.push(records[i].get('modelId'));
	    	}
	    	gridPanel.defaultDeleteHandler();
    	}
    }
    
    function insertDetailFun(){
    	showInxTree()
    	//detailPanel.defaultInsertHandler();
    }
    function deleteDetailFun(){
    	var records = sm.getSelections();
    	if (records.length > 0){
	    	var ids = new Array();
	    	for (var i=0; i<records.length; i++){
	    		ids.push(records[i].get('modelId'));
	    	}
	    	detailPanel.defaultDeleteHandler();
    	}
    }
    
    function showInxTree() {
		var treeWin = new Ext.Window({
			title:'指标选择',
			width:300,
			height:400,
			autoScroll: true,
			resizable: false,
			plain: true,
			modal: true,
			closeAction:'hide',
			//items: inxTree,
			html:'<iframe name="content1" src="jsp/common/tree/guidelineTree.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>',
			buttons: [{text:'确定',handler:confirm},{text:'取消',handler:cancel}],
			buttonAlign:'center'
	    });
	    treeWin.show()
	    function confirm() {
	    	var frm = window.frames["content1"]
	    	var zbStr = frm.getSelectZb();
	    	var zbArr = zbStr.split('&&')
	    	var zbSeqnos = zbArr[0].split('`');
	    	var names = zbArr[1].split('`');
	    	var jldws = zbArr[2].split('`');
	    	for(var i=0;i<zbSeqnos.length;i++){
	    		detailPlantInt.zbSeqno = zbSeqnos[i];
		    	detailPlantInt.name = names[i];
		    	detailPlantInt.jldw = jldws[i];
		    	detailPanel.defaultInsertHandler();
	    	}
	    	treeWin.close()
	    }
	    function cancel() {
	    	treeWin.close()
	    }
	}
});

function refreshGrid(){
    	var paramStr = propertyName+SPLITB+defaultDept; 
    	if(yearBox.getValue()!='' && yearBox.getValue()!= "all"){
    		paramStr += SPLITA+'sjlx'+SPLITB+yearBox.getValue();
    	}
    	if(modelBox.getValue()!='' && modelBox.getValue()!= "all"){
    		paramStr += SPLITA+'modelType'+SPLITB+modelBox.getValue();
    	}
    	var ds = gridPanel.getStore();
    	ds.baseParams.params = paramStr
    	ds.load({
			params : {
				start : 0, // 起始序号
				limit : PAGE_SIZE
			// 结束序号，若不分页可不用设置这两个参数
			}
		});
    }
    
function openDetailGrid(){
	var obj = gridPanel.getSelectionModel();
   	var record = obj.getSelected();
	var d_ds = detailPanel.getStore();
   	if (obj!= null && detailPanel.collapsed) {
   		detailPanel.setSize(gridPanel.getSize().width+7)
   		detailPanel.expand();
   		detailPlantInt.modelId = record.get("modelId");
   		d_ds.baseParams.params = "modelId"+SPLITB+record.get("modelId");
    	d_ds.load({
	    	params:{
		    	start: 0,			//起始序号
		    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
	    	}
    	})
   	}
}

function openCellWin() {
	var row = gridPanel.getSelectionModel().getSelected()
	var param = new Object()
	param.reportID = row.get('resportNo');
	param.p_type = row.get('modelType');
	param.p_dept = row.get('deptId');
	param.p_date = row.get('sjlx');

	var n = window.showModalDialog( CONTEXT_PATH+"/cell/designer.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;" )
	if(n!=null||1==1) {
		refreshGrid()
	}
}
