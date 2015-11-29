var adjunctBean = "com.sgepit.frame.flow.hbm.FlwAdjunctIns";
var adjunctWindow;
var cmAdjunct;
var ColumnsAdjunct;
var gridAdjunct;
var dsAdjunct;
Ext.onReady(function(){
	
	cmAdjunct = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer({
		width: 20
	}), {
		id: 'insid',
		header: '实例ID',
		dataIndex: 'insid',
		hidden: true
	},{
		id: 'ismove',
		header: '是否移交',
		dataIndex: 'ismove',
		hidden: true
	},{
		id: 'filename',
		header: '文件名称',
		dataIndex: 'filename',
		width: 150
	},{
		id: 'filedate',
		header: '创建时间',
		dataIndex: 'filedate',
		width: 80,
		renderer: function(value){
			return value ? value.dateFormat('Y-m-d H:i:s') : '';
		}
	}, {
		id: 'fileid',
		header: '下载',
		align: 'center',
		dataIndex: 'fileid',
		width: 50,
		renderer: function(value){
			return "<center><a href='"+BASE_PATH+"servlet/FlwServlet?ac=loadAdjunct&fileid="+value+"'>"
					+"<img src='"+BASE_PATH+"jsp/res/images/shared/icons/page_copy.png'></img></a></center>";
		}
	}
]);
	
	ColumnsAdjunct = [
	{name: 'fileid', type: 'string'},
	{name: 'insid', type: 'string'},
	{name: 'ismove', type: 'string'},
	{name: 'filename', type: 'string'},
	{name: 'filedate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	dsAdjunct = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: adjunctBean,
		business: 'baseMgm',
		method: 'findWhereOrderBy'
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'fileid'
	}, ColumnsAdjunct),
	remoteSort: true,
	pruneModifiedRecords: true
});
	gridAdjunct = new Ext.grid.GridPanel({
	ds: dsAdjunct,
	cm: cmAdjunct,
	
	border: false,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	}
});
	
	
});






