var load;
var tree;
var root;
Ext.onReady(function(){

   load = new Ext.tree.TreeLoader({
   	        dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:USERBELONGUNITID,
				ifcheck : true,
				ac:"buildingUnitTree",
				baseWhere:"unitTypeId in ('0','2','3','4','7','8','9','A')"
			},
			clearOnLoad: true,
			uiProviders:{
			    'col': Ext.tree.ColumnNodeUI
			}
	});
		
	var cm1 = [
		  {header:'单位名称',width:450,height:0,dataIndex:'unitname'}
	    ];
		
    root=new Ext.tree.AsyncTreeNode({
		text: USERBELONGUNITNAME,
		id: USERBELONGUNITID,
		expanded: true
	});
	 var chooseBtn = new Ext.Button({
	    text: "选择",
		iconCls: 'btn',
		handler: chooseFun
	 })  
	 tree = new Ext.tree.ColumnTree({
	    	id:'checkTree',
	        region: 'center',  
	        width:298,
	        height:400,
	        checkModel: 'cascade',
	        tbar:[{
	            iconCls: 'icon-expand-all',
				tooltip: '全部展开',
	            handler: function(){ root.expand(true); }
	        }, '-', {
	            iconCls: 'icon-collapse-all',
	            tooltip: '全部折叠',
	            handler: function(){ root.collapse(true); }
	        },'-',chooseBtn],
	        autoScroll:true,
	        columns:[
		  		{header:'',width:450,dataIndex:'unitname',height:0}
	    	],
	        loader: load,
	        root: root,
	        rootVisible : true
	    });
})