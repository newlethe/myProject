var bean = "com.sgepit.frame.flow.hbm.TaskView";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var params = " tonode='"+USERID+"' and flag=0";
var ds, grid;

//encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递，注意对所有有可能包含此类符号的参数进行一次编码
Ext.onReady(function(){

	var dsFtype = new Ext.data.SimpleStore(
		{
		id: 'my001',
        fields: ['k', 'v'],   
        data: F_TYPE
    });
	
	var sm = new Ext.grid.CheckboxSelectionModel({id: 'my002',singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			id: 'my004',
			width: 20
		}), {
			id: 'insid',
			type: 'string',
			header: '流程实例ID',
			dataIndex: 'insid',
			hidden: true
		},{
			id: 'flowid',
			type: 'string',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true
		},{
			id: 'flowtitle',
			type: 'string',
			header: '流程类型',
			dataIndex: 'flowtitle',
			width: 120,
			hidden: true
		},{
			id: 'title',
			type: 'string',
			header: '主题',
			dataIndex: 'title',
			width: 120,
			renderer:function(value){
				return "<A href='javascript:sendFlowURL()'>"+value+"</A>";
			}
		},{
			id: 'ftime',
			type: 'date',
			header: '发送时间',
			dataIndex: 'ftime',
			width: 100,
			hidden: true,
			renderer: function(value){
		        return value ? value.dateFormat('Y-m-d H:i:s') : '';
		    }
		},{
			id: 'fromname',
			type: 'string',
			type: 'string',
			header: '发送人',
			dataIndex: 'fromname',
			width: 80,
			hidden: true
		},{
			id: 'ftype',
			type: 'combo',
			header: '处理类型',
			dataIndex: 'ftype',
			hidden: true,
			renderer: function(value){
				for (var i = 0; i < F_TYPE.length; i++) {
					if (F_TYPE[i][0] == value) return F_TYPE[i][1];
				}
			},
			store: dsFtype
		},{
			id: 'nodename',
			type: 'string',
			header: '处理说明',
			dataIndex: 'nodename',
			width: 60,
			hidden: true
		},{
			id: 'fromnode',
			type: 'string',
			header: '发送人ID',
			dataIndex: 'fromnode',
			hidden: true
		},{
			id: 'toname',
			type: 'string',
			header: '接收人',
			dataIndex: 'toname',
			hidden: true
		},{
			id: 'tonode',
			type: 'string',
			header: '接受人ID',
			dataIndex: 'tonode',
			hidden: true
		},{
			id: 'notes',
			type: 'string',
			header: '签署意见',
			dataIndex: 'notes',
			hidden: true
		},{
			id: 'flag',
			type: 'string',
			header: '是否完成',
			dataIndex: 'flag',
			hidden: true
		},{
			id: 'nodeid',
			type: 'string',
			header: '节点ID',
			dataIndex: 'nodeid',
			hidden: true
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'logid', type: 'string'},
		{name: 'flowid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromnode', type: 'string'},
		{name: 'tonode', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'flag', type: 'string'},
		{name: 'nodename', type: 'string'},
		{name: 'fromname', type: 'string'},
		{name: 'toname', type: 'string'},
		{name: 'nodeid', type: 'string'}
	];
		
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: bean,
			business: business,
			method: listMethod,
			params: "tonode='"+USERID+"' and flag=0"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'logid'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
//alert(ds.getCount())
	ds.setDefaultSort('ftime', 'desc');
	grid = new Ext.grid.QueryExcelGridPanel({
		id: 'my2',
		ds: ds,
		cm: cm,
		sm: sm,
		title:'待办事项',
		tbar: [],
		split: true, 
		stripeRows: true,
		collapsible: true,
    	animCollapse: true,
		border: false,
		header: false,
		autoScroll: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
			id: 'my008',
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});

/*	if(Ext.getCmp('my2').getStore().getCount()>0) {
		Ext.getCmp('east').expand()
		Ext.getCmp('tabPan').setActiveTab('flowGrid')
	}
	
	alert(ds.getCount()+ds.baseParams.params)*/
});


function loadInfoGrid(){
	ds.load({
		params: {
	    	start: 0,
	    	limit: PAGE_SIZE
		},
		callback : function(){
			if(ds.getCount()>0){
				Ext.getCmp('east').expand()
				Ext.getCmp('tabPan').setActiveTab('my2')
			};
		}
	});
}
function sendFlowURL(){
	window.frames["contentFrame"].location.href = CONTEXT_PATH+"/jsp/flow/flw.main.frame.jsp"
}