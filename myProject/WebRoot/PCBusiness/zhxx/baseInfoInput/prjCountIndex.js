var edit_unitid = window.dialogArguments;
var projDS=null;
Ext.onReady(function (){
       projDS = new Ext.data.Store({
       baseParams: {
	    	ac: 'list',
	    	bean: "",				
	    	business: "pcPrjServiceImpl",
	    	method: "prjCountIndex",
	    	params:"unitid"+SPLITB+edit_unitid
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "pid"
         }, [
        	{name: 'uids', type: 'string'},
        	{name: 'pid', type: 'string'},
        	{name: 'prjName', type: 'string'},
        	{name: 'industryTypeName', type: 'string'},
        	{name: 'buildNatureName', type: 'string'},
        	{name: 'memoC2', type: 'string'},
        	{name: 'investScale', type: 'string'},
        	{name: 'prjTypeName', type: 'string'},
        	{name: 'prjRespond', type: 'string'},
        	{name: 'fundSrcTotal', type: 'float'},
        	{name: 'zbjjtTotal', type: 'float'},
        	{name: 'zbjzyTotal', type: 'float'},
        	{name: 'zbjqtTotal', type: 'float'},
        	{name: 'dkTotal', type: 'float'},
        	{name: 'qtTotal', type: 'float'}
        ])
    });
	projDS.load();
	var panel = new Ext.grid.GridPanel({
		title:'<div style="float:right">单位：万元</div>',
		ds:projDS,
		columns:[
			new Ext.grid.RowNumberer(),
//			{header:"pid",dataIndex:"pid"},
			{
				header:"项目名称",dataIndex:"prjName",width:300
			},{
				header:"产业类型",dataIndex:"industryTypeName",width:60,align:"center"
			},{
				header:"建设性质",dataIndex:"buildNatureName",width:60,align:"center"
			},{
				header:"建设规模",dataIndex:"memoC2",width:100,align:"center"
			},{
				header:"投资规模",dataIndex:"investScale",width:100,align:"right",
				renderer:function (value){
				    return cnMoneyToPrec(value/10000,2);
				}
			},{
				header:"项目类型",dataIndex:"prjTypeName",width:60,align:"center"
			},{
				header:"项目负责人",dataIndex:"prjRespond",width:70,align:"center"
			},{
	           header: "资金来源",
	           dataIndex: "fundSrcTotal",
	           width: 80,
	           align:'right',
	           renderer:function(v,m,record,row){
	           	var value=cnMoneyToPrec(v/10000,2);
	           	return "<a href='javascript:foundSrcEditWindow(\""+row+"\")'>"+value+"</a>"}
       		}
		],
		viewConfig: {
	        forceFit: true
	    }
	});

	new Ext.Viewport({
		layout:'fit',
		items:[panel]
	});

});

function foundSrcEditWindow(row){
	var record=projDS.getAt(row);
	 var srcStore = new Ext.data.Store({
        proxy: "",
        reader: new Ext.data.JsonReader({}, [
        	{name: 'uids', type: 'string'},
        	{name: 'pid', type: 'string'},
        	{name: 'prjName', type: 'string'},
        	{name: 'industryType', type: 'string'},
        	{name: 'buildNature', type: 'string'},
        	{name: 'memoC2', type: 'string'},
        	{name: 'investScale', type: 'string'},
        	{name: 'prjType', type: 'string'},
        	{name: 'prjRespond', type: 'string'},
        	{name: 'fundSrcTotal', type: 'float'},
        	{name: 'zbjjtTotal', type: 'float'},
        	{name: 'zbjzyTotal', type: 'float'},
        	{name: 'zbjqtTotal', type: 'float'},
        	{name: 'dkTotal', type: 'float'},
        	{name: 'qtTotal', type: 'float'}
        ])
    });
	srcStore.add(record);
	var editWin;
	if(!editWin){
		var src_grid = new Ext.grid.GridPanel({
			region:'center',
		    store: srcStore,
		    columns: [
		        {header: "集团出资", align:'center', 
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "自有资金", align:'center', dataIndex: 'zbjzyTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "其它（资本金）", align:'center', dataIndex: 'zbjqtTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "贷款", align:'center', dataIndex: 'dkTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "其它（非资本金）", width:120, align:'center', dataIndex: 'qtTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        }]
		});
		
		eidtWin = new Ext.Window({
			title:"资金来源",			
			width:550,
			height:150,		
			y:100,			
			buttonAlign:"center",
			plain:true,//颜色匹配
			collapsible:false,//折叠
			modal:true,//变灰
			draggable:true,//拖动
			layout:"fit",
			resizable:false,//尺寸变换
			items:[src_grid],
			buttons:[]
		});
	}
	eidtWin.show();
}
