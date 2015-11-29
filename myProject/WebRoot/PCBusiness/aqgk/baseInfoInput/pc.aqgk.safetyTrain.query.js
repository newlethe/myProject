/**
 * description:此功能页面用于安全培训查询和带权限控制的反馈信息录入,对于安全培训的记录不能进行增删改
 * author：liangwj
 * since：2010-9-14
 */
var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetytrainInfo"
var bean2 = "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo"
var businessType="PCAqgkSafetyTrainAffix"
var safetyTrain_uids='';
var grid=null;
//var edit_hide2=(ModuleLVL<3?false:true);
	
Ext.onReady(function() {
	//1. 创建选择模式
	var sm = new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
	//2. 创建列模型
	var fm = Ext.form;
	// 创建编辑域配置
	var fc = { 
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
		'traintime' : {
			name : 'traintime',
			fieldLabel : '培训时间',
			anchor : '95%'
		},
		'trainaddr' : {
			name : 'trainaddr',
			fieldLabel : '培训地点',
			anchor : '95%'
		},
		'traintitle' : {
			name : 'traintitle',
			fieldLabel : '培训主题',
			anchor : '95%'
		},
		'trainnumber' : {
			name : 'trainnumber',
			fieldLabel : '培训人数',
			anchor : '95%'
		},
		'trainStatus' : {
			name : 'trainStatus',
			fieldLabel : '状态',
			anchor : '95%'
		}
		
	}
	// 创建列模型
	var cm = new Ext.grid.ColumnModel([ 
			sm, 
			{
				id : 'traintime',
				type : 'string',
				align : 'center',
				width:60,
				header : fc['traintime'].fieldLabel,
				dataIndex : fc['traintime'].name
			}, {
				id : 'trainaddr',
				type : 'string',
				width:160,
				header : fc['trainaddr'].fieldLabel,
				dataIndex : fc['trainaddr'].name
			
			}, {
				id : 'traintitle',
				type : 'string',
				width:160,
				header : fc['traintitle'].fieldLabel,
				dataIndex : fc['traintitle'].name,
				renderer:function(v){
					return "<a href='javascript:jumpTo()' title='"+v+"'>"+v+"</a>"}
			}, {
				id : 'trainnumber',
				type : 'string',
				align : 'right',
				width:50,
				header : fc['trainnumber'].fieldLabel,
				dataIndex : fc['trainnumber'].name
			}, {
				id : 'upload',
				type : 'string',
				header : "附件",
				dataIndex :"uids",
				align : 'center',
				width:50,
				renderer:function(v){
					return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>查看</a>";
				}
			}, {
				id : 'trainStatus',
				type : 'float',
				align : 'center',
				width:40,
				header : fc['trainStatus'].fieldLabel,
				dataIndex : fc['trainStatus'].name,
				renderer:function(value){
					if(value==0) return "<font color=gray>未上报</font>";
					else if(value==1) return "<font color=blue>已上报</font>";
					else if(value==2) return "<font color=red>修改后未上报</font>";
					else return "<font color=blue>修改后已上报</font>";
				}
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序
	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			},
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'traintime',
				type : 'string'
			}, {
				name : 'trainaddr',
				type : 'string'
			}, {
				name : 'trainunit',
				type : 'string'
			}, {
				name : 'traintitle',
				type : 'string'
			}, {
				name : 'trainnumber',
				type : 'string'
			}, {
				name : 'traincontent',
				type : 'string'
			}, {
				name : 'remarks',
				type : 'string'
			},{
				name : 'trainStatus',
				type : 'float'
			}];
 	//创建数据源
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "pid='"+edit_pid+"' order by traintime desc",
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
		store.baseParams.params = "pid='" + edit_pid + "' and TRAIN_STATUS in (1,3)";
	});
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	grid = new Ext.grid.GridPanel({
		store : ds,
		cm : cm,
		sm : sm,
		border : false,
		tbar:dydaView!=true?["->",{text: '返回',iconCls: 'returnTo',handler: function(){history.back();}}]:[],
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
        	'rowclick' : trainGridRowClickEvent
        }
	});
	//安全培训grid行选中或取消选中事件
	function trainGridRowClickEvent(){
		var rowRecord=grid.getSelectionModel().getSelected();
		if(rowRecord){//有行被选中
				feedBackGrid.setTitle("【"+rowRecord.get('traintitle')+"】反馈意见") 
				feedBackDS.baseParams.params = "infoId='" + rowRecord.get('uids') + "'";
				safetyTrain_uids=rowRecord.get('uids');
				if (feedBackGrid.getTopToolbar().items.get('add'))
					feedBackGrid.getTopToolbar().items.get('add').enable();
				if (feedBackGrid.getTopToolbar().items.get('save'))
					feedBackGrid.getTopToolbar().items.get('save').enable();
				if (feedBackGrid.getTopToolbar().items.get('del'))
					feedBackGrid.getTopToolbar().items.get('del').enable();
				feedBackDS.reload();
		}else{//没有被选中的记录
				feedBackGrid.setTitle("反馈意见列表") ;
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
        		grid.plantInt.infoId=safetyTrain_uids;
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

function jumpTo(){
	var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetyTrain.addOrUpdate.jsp?edit=false&edit_uids="+safetyTrain_uids+"&edit_pid="+edit_pid;
	window.location.href = url;
};