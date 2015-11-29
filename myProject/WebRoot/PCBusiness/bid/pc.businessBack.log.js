var bean = "com.sgepit.pcmis.common.hbm.PcBusniessBack";
var m_record = window.dialogArguments;
if(m_record){
	edit_pid=m_record.pid;
	edit_uids=m_record.uids;
}
var grid;
Ext.onReady(function() {
	var cm= new Ext.grid.ColumnModel([ // 创建列模型
			new Ext.grid.RowNumberer(),
			{
				id : 'spareC2',
				type : 'string',
				header :"单位",
				width:160,
				dataIndex :'spareC2'
			}, {
				id : 'backUser',
				type : 'string',
				width:50,
				header :"操作人",
				align:'center',
				dataIndex :'backUser'
			},{
				id:'backDate',
				header:'操作时间',
				dataIndex:'backDate',
				width:120,
				align:'center',
				renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s')
			},{
				id:'spareC1',
				header:'操作',
				type:'string',
				dataIndex:'spareC1',
				width:70,
				align:'center'
			},{
				id:'backReason',
				header:'意见',
				type:'string',
				dataIndex:'backReason',
				width:140
			}
	]);
	var Columns = [{
			name : 'uids',type : 'string'
		},
		{
			name : 'pid',type : 'string'
		}, {
			name : 'busniessId',type : 'string'
		}, {
			name : 'backUser',type : 'string'
		},{
			name : 'backReason',type : 'string'
		}, {
			name : 'busniessType',type : 'string'
		}, {
			name : 'spareC1',type : 'string'
		}, {
			name : 'spareC2',type : 'string'
		},{
			name : 'spareC3',type : 'string'
		},{
			name : 'spareC4',type : 'string'
		},{
			name : 'backDate',type : 'date', dateFormat : 'Y-m-d H:i:s'
		}];
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "busniessId='"+edit_uids+"' and pid='"+edit_pid+"' order by backDate asc"
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true,
		listeners:{
			
		}
	});
	grid = new Ext.grid.GridPanel({
		store : ds,
		cm : cm,
		sm : "",
		border : false,
		layout : 'fit',
		region : 'center',
		width:800,
		autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true
		}
	});

	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [grid]
	});
	ds.load({callback:function(){}});
});
	           	
	           		