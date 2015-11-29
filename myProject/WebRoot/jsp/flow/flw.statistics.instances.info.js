var bean = "com.sgepit.frame.flow.hbm.TaskView";;
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var ds, grid;

Ext.onReady(function(){
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}), {
			id: 'logid',
			header: '流转日志ID',
			dataIndex: 'logid',
			hidden: true
		},{
			id: 'insid',
			header: '流程实例ID',
			dataIndex: 'insid',
			hidden: true
		},{
			id: 'flowid',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true
		},{
			id: 'flowtitle',
			header: '流程类型',
			dataIndex: 'flowtitle',
			width: 100
		},{
			id: 'title',
			header: '流程主题',
			dataIndex: 'title',
			width: 100
		},{
			id: 'creator',
			header: '流程起草人',
			width: 70,
			renderer: function(value, meta,record){
				var title = record.get('title');
				var faqiren="";
				DWREngine.setAsync(false);
		        db2Json.selectData("select fromname from Task_View where title='"+title+"' order by ftime asc", function (jsonData) {
			    var list = eval(jsonData);
			    if(list!=null){
			   		faqiren=list[0].fromname;
			     		 }  
			      	 });
			    DWREngine.setAsync(true);
				return faqiren;
			}
		},{
			id: 'fromname',
			header: '上一步骤发送人',
			dataIndex: 'fromname',
			width: 70
		},{
			id: 'ftime',
			header: '上一步骤发送时间',
			dataIndex: 'ftime',
			width: 80,
			renderer: function(value){
		        return value ? value.dateFormat('Y-m-d H:i:s') : '';
		    }
		},{
			id: 'rtime',
			header: '本步骤处理完成时间',
			dataIndex: 'rtime',
			width: 80,
			renderer: function(value,meta,record){
				var id = record.get('logid');
				for(var i=0; i<renderArray.length; i++){
					if(renderArray[i][0]==id){
						return renderArray[i][2];
					}
				}
				return '';
		    }
		},{
			id: 'fromnode',
			header: '发送人ID',
			dataIndex: 'fromnode',
			hidden: true
		},{
			id: 'toname',
			header: '接收人',
			dataIndex: 'toname',
			hidden: true
		},{
			id: 'tonode',
			header: '接受人ID',
			dataIndex: 'tonode',
			hidden: true
		},
//		{
//			id: 'notes',
//			header: '处理操作',
//			dataIndex: 'notes',
//			width: 80
//		},
//		{
//			id: 'flag',
//			header: '处理操作',          //表示流程的其中的一个步骤的处理状态
//			dataIndex: 'flag',
//			width: 60,
//			renderer: function(value){
//				return value == '1' ? '处理完毕！' : '处理中...'
//			}
//		},
		{
			id: 'nodename',
			header: '处理步骤说明',
			dataIndex: 'nodename',
			width: 80
		},{
			id: 'nodeid',
			header: '节点ID',
			dataIndex: 'nodeid',
			hidden: true
		}
	]);
	
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
		{name: 'status', type: 'string'},
		{name: 'removeinfo', type: 'string'},
		{name: 'nodeid', type: 'string'}
	];
	
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: bean,
			business: business,
			method: listMethod,
			params: filterParam
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
	
	ds.load();

	grid = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		border: false, 
		region: 'center',
		header: false, 
		stripeRows: true,
		autoScroll: true,
		loadMask: true,
		enableHdMenu:false,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [grid]
	});
});  //eof Ext.onReady
