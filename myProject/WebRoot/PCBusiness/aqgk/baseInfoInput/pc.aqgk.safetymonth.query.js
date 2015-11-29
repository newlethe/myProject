/**
 * description:此功能页面用于安全月报查询和带权限控制的反馈信息录入,对于安全月报的记录不能进行增删改
 * author：liangwj
 * since：2010-9-14
 */
var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetymonthInfo"
var bean2 = "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo"
var businessType="PCAqgkSafetymonthAffix"
var safetymonth_uids='';
var grid=null;
var curr_date=new Date();
var edit_hide2=(ModuleLVL<3?false:true);
Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
	var fm = Ext.form;
	var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '项目编码',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'title':{
			name : 'title',
			fieldLabel : '月报标题',
			anchor : '95%'
		},
		'infoTime' : {
			name : 'infoTime',
			fieldLabel : '上报时间',
			hidden : !isQuery,
			hideLabel : !isQuery,
			anchor : '95%'
		},
		'sjType' : {
			name : 'sjType',
			fieldLabel : '月报月份',
			anchor : '95%'
		},
		'reportperson' : {
			name : 'reportperson',
			fieldLabel : '上报人',
			anchor : '95%'
		},
		'state' : {
			name : 'state',
			fieldLabel : '状态',
			anchor : '95%'
		}
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
		sm, {
				id : 'uids',
				type : 'string',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				type : 'string',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'title',
				type : 'string',
				header : fc['title'].fieldLabel,
				dataIndex : fc['title'].name,
				width:160,
				editor: new fm.TextField(fc['title'])
			}, {
				id : 'sjType',
				type : 'date',
				align : 'center',
				width:50,
				header : fc['sjType'].fieldLabel,
				dataIndex : fc['sjType'].name,
				renderer:function(v){if(v)return v.substr(0,4)+"年"+v.substr(4,6)+"月";}
			
			}, {
				id : 'infoTime',
				type : 'date',
				width:80,
				header : fc['infoTime'].fieldLabel,
				dataIndex : fc['infoTime'].name,
				align:'center',
				hidden:!isQuery,
				renderer:function(v){if(v)return v.format('Y-m-d H:i:s')}
			
			}, {
				id : 'reportperson',
				type : 'string',
				align : 'center',
				width:50,
				header : fc['reportperson'].fieldLabel,
				dataIndex : fc['reportperson'].name,
				editor: new fm.TextField(fc['reportperson'])
			}, {
				id : 'upload',
				type : 'string',
				header : "附件",
				width:50,
				align:'center',
				dataIndex :"uids",
				renderer:function(v){
					return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>查看</a>";
				}
			}, {
				id : 'state',
				type : 'string',
				header : fc['state'].fieldLabel,
				dataIndex : fc['state'].name,
				width:50,
				align:'center',
				renderer:function(value){
					if(value=="0") return "<font color=gray>未上报</font>";
					else if(value=="1") return "<font color=blue>已上报</font>";
					else if(value=="2") return "<font color=green>修改后未上报</font>";
					else return "<font color=green>修改后已上报</font>";
				}
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序
	// 3. 定义记录集
	var Columns = [{
			name : 'uids',
			type : 'string'
		},{
			name : 'pid',
			type : 'string'
		}, {
			name : 'title',
			type : 'string'
		}, {
			name : 'infoTime',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'sjType',
			type : 'string'
		}, {
			name : 'reportperson',
			type : 'string'
		}, {
			name : 'state',
			type : 'string'
	}];
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "pid='"+edit_pid+"' order by infoTime desc" ,
			outFilter:outFilter
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
	ds.on('beforeload',function(store){
		store.baseParams.params = "pid='" + edit_pid + "' and STATE in ('1','3')";
	});
	ds.load();
	grid = new Ext.grid.GridPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar:dydaView!=true?["->",{text: '返回',iconCls: 'returnTo',handler: function(){history.back();}}]:[],
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
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		listeners:{
        	'rowclick' : docGridRowClickEvent
        }
	});
	//安全月报grid行选中或取消选中事件
	function docGridRowClickEvent(){
		var rowRecord=grid.getSelectionModel().getSelected();
		if(rowRecord){//有行被选中
				safetymonth_uids = rowRecord.get("uids");
				feedBackGrid.setTitle("【"+rowRecord.get('title')+"】反馈意见") 
				feedBackDS.baseParams.params = "infoId='" + rowRecord.get('uids') + "'";
				safetymonth_uids=rowRecord.get('uids');
				if (feedBackGrid.getTopToolbar().items.get('add'))
					feedBackGrid.getTopToolbar().items.get('add').enable();
				if (feedBackGrid.getTopToolbar().items.get('save'))
					feedBackGrid.getTopToolbar().items.get('save').enable();
				if (feedBackGrid.getTopToolbar().items.get('del'))
					feedBackGrid.getTopToolbar().items.get('del').enable();
				feedBackDS.reload();
		}else{//没有被选中的记录
				feedBackGrid.setTitle("反馈意见列表");
				if (feedBackGrid.getTopToolbar().items.get('add'))
					feedBackGrid.getTopToolbar().items.get('add').disable();
				if (feedBackGrid.getTopToolbar().items.get('save'))
					feedBackGrid.getTopToolbar().items.get('save').disable();
				if (feedBackGrid.getTopToolbar().items.get('del'))
					feedBackGrid.getTopToolbar().items.get('del').disable();
		}
	}
	//-------------------------------------------------
	var feedBackSm =new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
	var feedBackCm = new Ext.grid.ColumnModel([		
    	 feedBackSm,{id:'uids',header: "主键",dataIndex: "uids",hidden: true
        },{id:'pid',header: "项目编号",dataIndex: "pid",hidden: true
        },{id:'feedbackType',header: "反馈单位",dataIndex: "feedbackType",width:100
        },{id:'feedperson',header: "反馈人",dataIndex: "feedperson",width:40
        },{id:'feedtime',header: "时间",dataIndex: "feedtime",type :'date',width:40,
        	renderer: function(v){if(v)return v.format('Y-m-d');}
        },{id:'feedcontent',header: "反馈内容",dataIndex: "feedcontent",width:300,editor: new fm.TextField()
        }
    ])
	var feedBackColumns = [
    	{name: 'uids', type: 'string'},			
    	{name: 'pid', type: 'string'},	
    	{name: 'feedbackType', type: 'string'},	
    	{name: 'feedperson', type: 'string'},	
    	{name: 'feedtime', type: 'date', dateFormat: 'Y-m-d H:i:s'},	
    	{name: 'feedcontent', type: 'string'},
    	{name: 'infoId', type: 'string'}
	]
	
	var feedBackDS = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params:""
		},
        proxy: new Ext.data.HttpProxy({
	        method: 'GET', 
	        url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "uids"
        }, feedBackColumns),
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    var feedBack_Plant = Ext.data.Record.create(feedBackColumns);
    
	var feedBack_PlantInt= {uids:"",
					pid:"",
					feedbackType:"",
					feedperson:"",
					feedtime:"",
					feedcontent:"",
					infoId:""}

	feedBackGrid=new Ext.grid.EditorGridTbarPanel({
		id:"card_1",
		height:240,
		tbar: [],
		region:'south',
        ds: feedBackDS,						//数据源
        cm:feedBackCm,
        sm:feedBackSm,
        title: "反馈意见列表",				//面板标题
        border: false,				// 
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: feedBackDS,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        listeners:{
        	'beforeinsert':function(grid){
        		curr_date=new Date();
        		grid.plantInt.feedtime=curr_date;
        		grid.plantInt.pid=edit_pid;
        		grid.plantInt.infoId=safetymonth_uids;
        		grid.plantInt.feedperson=REALNAME;
				grid.plantInt.feedbackType=USERBELONGUNITNAME;
        	},
        	'render':function(grid){
        		if (feedBackGrid.getTopToolbar().items.get('add'))
					feedBackGrid.getTopToolbar().items.get('add').disable();
				if (feedBackGrid.getTopToolbar().items.get('save'))
					feedBackGrid.getTopToolbar().items.get('save').disable();
				if (feedBackGrid.getTopToolbar().items.get('del'))
					feedBackGrid.getTopToolbar().items.get('del').disable();
        	},
        	'beforeedit':function(e){
        		if(e.record.get('feedperson')!=REALNAME)return false;
        	},
        	'aftersave':function(grid, idsOfInsert, idsOfUpdate, _primaryKey,  _bean){
        		var uids=idsOfInsert;
        		if(Ext.isEmpty(uids))uids=idsOfUpdate;
        		pcAqgkService.excDataOpinionForSaveOrUpdate( uids, defaultOrgRootID, edit_pid,"安全反馈信息的新增或修改");
        	}
        },
        addBtn : true, 
		saveBtn : true, 
		delBtn : true, 
		plant : feedBack_Plant,
		plantInt : feedBack_PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo",
		business : "baseMgm",
		primaryKey : "uids",
		deleteHandler:function(){
			var record=feedBackGrid.getSelectionModel().getSelected();
			if(!Ext.isEmpty(record)){
				if(record.get('feedperson')==REALNAME){
					feedBackGrid.defaultDeleteHandler();
					record.get('uids');
					pcAqgkService.excDataOpinionForDel(record.get('uids'),defaultOrgRootID, edit_pid,"安全反馈信息删除【"+REALNAME+"】");
				}else{
					alert("您只能删除你的反馈信息！");
				}
			}
		}
	});
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [grid,feedBackGrid]
	});
	
});  

function uploadfile(uids,biztype){
	var param = {
		businessId:uids,
		businessType:biztype,
		editable : false
	};
	showMultiFileWin(param);
}


