<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<% String showAllSort = request.getParameter("showAll") == null ? "false" : request.getParameter("showAll"); %>
<% String singleSelect = request.getParameter("singleSelect") == null ? "false" : request.getParameter("singleSelect"); %>
<html>
	<head>
		<title>财务科目余额</title>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		
		<!-- EXT -->
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script>
var root,treeLoader,treePanel
var rootText='财务科目'
var ds,cm,Columns,gridPanel

var bean = "com.sgepit.pmis.finalAccounts.finance.hbm.FaFinBalance"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'subNo'

var subjectRootId = '0000';

var whereStr = "sub_name like '%待摊费用%'";
var showAll = <%=showAllSort%>;
var singleSelect = <%=singleSelect%>;

Ext.onReady(function(){

	if ( showAll ){
		whereStr = '';
	}
	
   root = new Ext.tree.AsyncTreeNode({
		text:rootText,
		inconCls:'form'
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "subjectSortSelectTree",
			businessName : "financeSortService",
			parent : '0',
			whereStr: whereStr
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	})
	
	treePanel = new Ext.tree.ColumnTree({
		id : 'tree-panel',
		region : 'west',
		split : true,
		width : 205,
		minSize : 175,
		maxSize : 300,
		frame : false,
		border: false,
		tbar:[{
            iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ root.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ root.collapse(true); }
        	}],
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		columns : [{
			header : '科目名称',
			width : 250,
			dataIndex : 'subName'
		}, {
			header : '科目主键',
			width : 0, // 隐藏字段
			dataIndex : 'uuid',
			renderer : function(value) {
				return "<div id='uuid'>" + value + "</div>";
			}
		}, {
			header : '科目编号',
			width : 90, // 隐藏字段
			dataIndex : 'subNo',
			renderer : function(value) {
				return "<div id='subNo'>" + value + "</div>";}
		}, {
			header : '帐套代码',
			width : 90, // 隐藏字段
			dataIndex : 'accoutId'
		}, {
			header : '科目类别',
			width : 70,
			dataIndex : 'subType'
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf',
			renderer : function(value) {
				return "<div id='isleaf'>" + value + "</div>";
			}
		}, {
			header : '父节点',
			width : 0,
			dataIndex : 'parent',
			renderer : function(value) {
				return "<div id='parent'>" + value + "</div>";
			}
		}
        ],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var uuid = node.attributes.uids;
		if (uuid == null)
			uuid = subjectRootId;
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = uuid;
	})	
	treePanel.getRootNode().expand(); 
	treePanel.on('click',onClick);
	
	function onClick(node,e){
		var selectSubNo = node.attributes.subNo;
		if(selectSubNo&&selectSubNo!="0000"){
			DWREngine.setAsync(true);
			ds.baseParams.params = " subNo = '"+selectSubNo+"'"
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
		}
		
	}
	

	var fc={
		'uids':{
			name:'uids',
			fieldLabel:'系统编号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'pid':{
			name:'pid',
			fieldLabel:'项目编号',
			allowBlank: false,
			anchor:'95%'
		},'accountId':{
			name:'accountId',
			fieldLabel:'套帐号',
			allowBlank: false,
			anchor:'95%'
		},'subYear':{
			name:'subYear',
			fieldLabel:'科目年度',
			allowBlank: false,
			anchor:'95%'
		},'period':{
			name:'period',
			fieldLabel:'会计期间',
			allowBlank: false,
			anchor:'95%'
		},'subNo':{
			name:'subNo',
			fieldLabel:'科目代码',
			allowBlank: false,
			anchor:'95%'
		},'beginningBalance':{
			name:'beginningBalance',
			fieldLabel:'期初余额',
			allowBlank: false,
			anchor:'95%'
		},'termEndBalance':{
			name:'termEndBalance',
			fieldLabel:'期末余额',
			allowBlank: false,
			anchor:'95%'
		},'debitAmount':{
			name:'debitAmount',
			fieldLabel:'借方发生额',
			allowBlank: false,
			anchor:'95%'
		},'creditAmount':{
			name:'creditAmount',
			fieldLabel:'贷方发生额',
			allowBlank: false,
			anchor:'95%'
		},'debitAmountAddup':{
			name:'debitAmountAddup',
			fieldLabel:'借方累计',
			allowBlank: false,
			anchor:'95%'
		},'creditAmountAddup':{
			name:'creditAmountAddup',
			fieldLabel:'贷方累计',
			allowBlank:false,
			acchor:'95%'
		}
	};

	Columns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
		{name:'accountId',type:'float'},
		{name:'subYear',type:'float'},
		{name:'period',type:'string'},
		{name:'subNo',type:'string'},
		{name:'beginningBalance',type:'string'},
		{name:'termEndBalance',type:'string'},
		{name:'debitAmount',type:'string'},
		{name:'creditAmount',type:'float'},
		{name:'debitAmountAddup',type:'float'},
		{name:'creditAmountAddup',type:'string'}
	]

	sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:singleSelect});
	
	//sm.lock();
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,width:50,hidden:true},
    	{id:'accountId',header:fc['accountId'].fieldLabel,type:'string',dataIndex:fc['accountId'].name,width:90},
    	{id:'subYear',header:fc['subYear'].fieldLabel,type:'string',dataIndex:fc['subYear'].name,width:90},
    	{id:'period',header:fc['period'].fieldLabel,type:'string',dataIndex:fc['period'].name,width:50},
    	{id:'subNo',header:fc['subNo'].fieldLabel,type:'string',dataIndex:fc['subNo'].name,width:50},
    	{id:'beginningBalance',header:fc['beginningBalance'].fieldLabel,type:'float',dataIndex:fc['beginningBalance'].name,width:50},
    	{id:'termEndBalance',header:fc['termEndBalance'].fieldLabel,type:'float',dataIndex:fc['termEndBalance'].name,width:50},
    	{id:'debitAmount',header:fc['debitAmount'].fieldLabel,dataIndex:fc['debitAmount'].name,width:50},
    	{id:'creditAmount',header:fc['creditAmount'].fieldLabel,dataIndex:fc['creditAmount'].name,width:50,hidden:true},
    	{id:'debitAmountAddup',header:fc['debitAmountAddup'].fieldLabel,dataIndex:fc['debitAmountAddup'].name,width:50,hidden:true},
    	{id:'creditAmountAddup',header:fc['creditAmountAddup'].fieldLabel,dataIndex:fc['creditAmountAddup'].name,width:50,hidden:true}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
    	'uids':'' ,    'pid':'',    'accountId':'',      'subYear':'',
    	'period':'' ,          'subNo':'',       'beginningBalance':'',    'termEndBalance':'',
    	'debitAmount':'' ,     'creditAmount':'',      'debitAmountAddup':'',     'creditAmountAddup':''
	}
    ds = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod
		},// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
    })
    
    ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
    
    var confirmSelectBtn = new Ext.Button({
		text: '确定选择',
		iconCls: 'btn',
		handler: selectFun 
	});
	
    var closeBtn = new Ext.Button({
		text: '关闭',
		iconCls: 'remove',
		handler: function(){
			window.close();
		} 
	});
    
    gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region: 'center',
		clicksToEdit : 2,
		header : false,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>科目余额<B></font>','-', confirmSelectBtn, closeBtn],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
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
		business : business,
		primaryKey : primaryKey
	});
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel, gridPanel]
    });
    
    function selectFun(){
    	var selectRec = gridPanel.getSelectionModel().getSelected();
    	if(selectRec) {
    		window.returnValue = selectRec.data.subNo;
    		window.close();
    	}
    }
});
</script>
		
	</head>
	<body></body>
</html>