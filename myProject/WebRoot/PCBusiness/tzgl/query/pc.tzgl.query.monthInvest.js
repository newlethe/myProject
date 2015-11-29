
var edit_pid=CURRENTAPPID
Ext.onReady(function(){
	
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
			new Ext.grid.RowNumberer(),
			{
				id : 'yearMonth',
				type : 'string',
				header : "月度",
				dataIndex : 'yearMonth',
				align : 'center',
				renderer:function(v){
					return v.substr(0,4)+"年"+v.substr(4,2)+"月";
				}
			}, {
				id : 'title',
				type : 'string',
				header : '月度投资完成报表',
				align:'center',
				width:120,
				dataIndex :'title'
			
			}, {
				id : 'totalInvest',
				type : 'float',
				header : '项目总投资',
				align:'center',
				dataIndex : 'totalInvest'
			}, {
				id : 'untilLastYearInvest',
				type : 'float',
				header : '截止上年累计完成投资',
				align:'center',
				width:140,
				dataIndex : 'untilLastYearInvest'
			}, {
				id : 'thisYearPlan',
				type : 'float',
				header : '本年计划',
				align:'center',
				dataIndex : 'thisYearPlan'
			}, {
				id : 'thisMonthComp',
				type : 'float',
				header : "本月投资完成",
				align:'center',
				dataIndex :"thisMonthComp"
			}, {
				id : 'thisYearComp',
				type : 'float',
				header : '本年累计投资完成',
				align:'center',
				width:120,
				dataIndex : 'thisYearComp'
			}, {
				id : 'progressObjective',
				type : 'string',
				header : '形象进度目标',
				align:'center',
				dataIndex : 'progressObjective'
			}, {
				id : 'memo',
				type : 'string',
				header : '备注',
				align:'center',
				dataIndex : 'memo'
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序
	
	// 3. 定义记录集
	var Columns = [{name:'yearMonth',type:'string'},{name:'title',type:'string'},
					{name:'totalInvest',type:'float'},
					{name:'untilLastYearInvest',type:'float'},{name:'thisYearPlan',type:'float'},
					{name:'thisMonthComp',type:'float'},{name:'thisYearComp',type:'float'},
					{name:'progressObjective',type:'string'},{name:'memo',type:'string'}];
/**
 * 创建数据源
 */
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : "",
			business : "PCTzglServiceImpl",
			method : "indexOfMonthCompQuery",
			params : "pid"+SPLITB+edit_pid
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
		pruneModifiedRecords : true
		});
		ds.load();
//		ds.load({callback:function(){
//			alert(ds.getTotalCount());
//		}});
	grid = new Ext.grid.EditorGridTbarPanel({
		store : ds,
		cm : cm,
		sm : '',
		tbar : '',
		border : false,
		layout : 'fit',
		region : 'center',
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		// expend properties
		addBtn : false, 
		saveBtn : false, 
		delBtn : false, 
		plant : '',
		plantInt : '',
		servletUrl : MAIN_SERVLET,
		bean : "",
		business : "",
		primaryKey : ""
	});
	
	new Ext.Viewport({
		layout:'fit',
		items:[grid]
	})
});