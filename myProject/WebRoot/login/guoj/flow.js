var bean = "com.sgepit.frame.flow.hbm.TaskView";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var params = " tonode='"+USERID+"' and flag=0";
var ds, grid;
var flowCount=0;
//encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递，注意对所有有可能包含此类符号的参数进行一次编码
Ext.onReady(function(){

	var dsFtype = new Ext.data.SimpleStore(
		{
		id: 'my001',
        fields: ['k', 'v'],   
        data: F_TYPE
    });
    
    var goToFlowPageBtn = new Ext.Toolbar.Button({
						id : 'flow-page',
						icon : CONTEXT_PATH + "/jsp/res/images/icons/table_go.png",
						cls : "x-btn-text-icon",
						tooltip : '转到待办事项列表页面',
						handler : sendFlowURL
					});
	var countLabel = new Ext.form.Label({html : '<span style="font-weight:bold;font-size:13px;color:#708090;">待办提醒(0条)</span>'});
					
	var sm = new Ext.grid.CheckboxSelectionModel({id: 'my002',singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({

		
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
			width: 220,
			renderer:function(value, metadata, record, rowIndex,
								columnIndex, store){
									var insId = record.get('insid');
				var qtip = " qtip= \"" + value + "\" ";
				return '<a href="javascript:doFlow(\'' + insId + '\')" ' + qtip + ' >'+value+'</a>';
				
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
	ds.on("load", function(store, records, opt){
		flowCount=store.getTotalCount();
		if ( countLabel )
		Ext.get(countLabel.getEl()).update('<span style="font-weight:bold;font-size:13px;color:#708090;">待办提醒(' + store.getTotalCount() +'条)</span>');
		
	});
	
//alert(ds.getCount())
	ds.setDefaultSort('ftime', 'desc');
	grid = new Ext.grid.GridPanel({
		id: 'my2',
		ds: ds,
		cm: cm,
		sm: sm,
		hideHeaders: true,	//去掉标题拦
		rowHeight: .5,
		
		tbar: [countLabel, '->' , goToFlowPageBtn],
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
			ignoreAdd: true,
			emptyText : '当前没有待办事项'
		},
		bbar: new Ext.PagingToolbar({
			id: 'my008',
            pageSize: 8,
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
	    	limit: 8
		}
	});
}
function sendFlowURL(){
	window.location.href = CONTEXT_PATH+"/jsp/flow/flw.main.frame.jsp";
	if ( Ext.getCmp('east')  )
							Ext.getCmp('east').collapse();
	DWREngine.setAsync(false);
	baseMgm.getData("select powerpk from rock_power where powername = '流程管理'",function(str){
		if(str !=null && str !=""){
			loadSecondNavi(str[0]);
		}
	})
	DWREngine.setAsync(true);
}

function doFlow(flowInstantId) {
	
	window.location.href = CONTEXT_PATH
			+ "/jsp/flow/flw.main.frame.jsp?flowInstantId=" + flowInstantId;

}
