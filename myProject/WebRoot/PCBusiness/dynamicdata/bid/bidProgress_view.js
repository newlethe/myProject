
Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		{
			id : 'zbName',
			type : 'string',
			header : "招标项目名称",
			dataIndex : 'zbName',
			align : 'left',
			width:100
		},{
			id : 'contentes',
			type : 'string',
			header : "招标内容",
			dataIndex : 'contentes',
			align : 'left',
			width:100
		},{
			id : 'progessName',
			type : 'string',
			header : "招标过程阶段",
			dataIndex : 'contentes',
			align : 'left',
			width:100
		},{
			id : 'startDate',
			type : 'date',
			header : "开始时间",
			dataIndex : 'startDate',
			align : 'center',
			width:80,
			renderer:function(value){if(value)return value.format('Y-m-d')}
		},{
			id : 'endDate',
			type : 'date',
			header : "结束时间",
			dataIndex : 'endDate',
			align : 'center',
			width:80,
			renderer:function(value){if(value)return value.format('Y-m-d')}
		},{
			id : 'rateStatus',
			type : 'float',
			header : "工作进度",
			dataIndex : 'rateStatus',
			align : 'center',
			width:80,
			renderer:function(value){if(value ==0) return value;
			return ""+value+"%"}
		},{
			id : 'respondDept',
			type : 'string',
			header : "负责部门",
			dataIndex : 'respondDept',
			align : 'center',
			width:80
		},{
			id : 'respondUser',
			type : 'string',
			header : "负责人",
			dataIndex : 'respondUser',
			align : 'center',
			width:80
		},{
			id : 'memo',
			type : 'string',
			header : "备注",
			dataIndex : 'memo',
			align : 'left',
			width:80
		}
	]);
	
	var Columns = [{
			name : 'uids',
			type : 'string'
		},
		{
			name : 'pid',
			type : 'string'
		}, {
			name : 'zbName',
			type : 'string'
		}, {
			name : 'contentes',
			type : 'string'
		}, {
			name : 'progessName',
			type : 'string'
		}, {
			name : 'startDate',
			type : 'date'
		}, {
			name : 'endDate',
			type : 'date'
		}, {
			name : 'rateStatus',
			type : 'float'
		}, {
			name : 'respondDept',
			type : 'string'
		}, {
			name : 'respondUser',
			type : 'string'
		}, {
			name : 'isActive',
			type : 'string'
		}, {
			name : 'memo',
			type : 'string'
		}, {
			name : 'kbPrice',
			type : 'float'
		}, {
			name : 'pbWays',
			type : 'string'
		}, {
			name : 'pbWaysAppend',
			type : 'string'
		}];
	 var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "",				
	    	business: "pcDynamicDataService",
	    	method: "indexOfProgess",
	    	params:"uids"+SPLITB+UIDS+SPLITA+"pid"+SPLITB+PID
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "uids"
        }, Columns),

        remoteSort: true,
        pruneModifiedRecords: true
    });

	ds.load();
	var grid = new Ext.grid.GridPanel({
				region : 'center',
				ds : ds, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar :['->',new Ext.Button({
					text: '返回',
					iconCls: 'returnTo',
					handler: function(){
						history.back();
					}
				})],
				border : false,
				layout : 'fit',
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				}
			});
				
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [grid]
	});
});


