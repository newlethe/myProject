var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkAccidenrInfo"
var bean2 = "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo"
var businessType="PCAqgkAccidentAffix"
var accident_uids='';
var accGrid=null,feedBackGrid=null;
var array_accidentType=new Array();

Ext.onReady(function() {
	DWREngine.setAsync(false);  
	DWREngine.beginBatch();
	appMgm.getCodeValue('事故类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_accidentType.push(temp);	
		}
    });
	DWREngine.endBatch();
  	DWREngine.setAsync(true);
	
	var accSm = new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
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
		'accidenttime' : {
			name : 'accidenttime',
			fieldLabel : '事故时间',
			anchor : '95%'
		},
		'accidentaddr' : {
			name : 'accidentaddr',
			fieldLabel : '事故地点',
			anchor : '95%'
		},
		'accidentreason' : {
			name : 'accidentreason',
			fieldLabel : '事故经过及原因',
			anchor : '95%'
		},
		'accidentType' : {
			name : 'accidentType',
			fieldLabel : '事故类型',
			anchor : '95%'
		},
		'dutyperson' : {
			name : 'dutyperson',
			fieldLabel : '责任人',
			anchor : '95%'
		},
		'reportStatus' : {
			name : 'reportStatus',
			fieldLabel : '状态',
			anchor : '95%'
		}
		
	}
	var accCm = new Ext.grid.ColumnModel([ // 创建列模型
			accSm, 
			{
				id : 'accidenttime',
				type : 'date',
				header : fc['accidenttime'].fieldLabel,
				dataIndex : fc['accidenttime'].name,
				align : 'center',
				width:80,
				renderer:function(value){if(value)return value.format('Y-m-d')}
			}, {
				id : 'accidentaddr',
				type : 'string',
				header : fc['accidentaddr'].fieldLabel,
				width:160,
				dataIndex : fc['accidentaddr'].name
			
			}, {
				id : 'accidentreason',
				type : 'string',
				width:300,
				header : fc['accidentreason'].fieldLabel,
				dataIndex : fc['accidentreason'].name,
				renderer:function(v){
					return "<a href='javascript:jumpTo()' title='"+v+"'>"+v+"</a>"}
			}, {
				id : 'accidentType',
				type : 'string',
				header : fc['accidentType'].fieldLabel,
				dataIndex : fc['accidentType'].name,
				align : 'center',
				width:90,
				renderer:function(k){
					for(var i = 0;i<array_accidentType.length;i++){
						if(k == array_accidentType[i][0]){
							return array_accidentType[i][1];
						}
					}
				}
			}, {
				id : 'dutyperson',
				type : 'string',
				width:70,
				align: 'center',
				header : fc['dutyperson'].fieldLabel,
				dataIndex : fc['dutyperson'].name
			}, {
				id : 'upload',
				type : 'string',
				header : "附件",
				dataIndex :"uids",
				width:50,
				align:'center',
				renderer:function(v){
							return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>查看</a>";
						}
			}, {
				id : 'reportStatus',
				type : 'float',
				header : fc['reportStatus'].fieldLabel,
				dataIndex : fc['reportStatus'].name,
				align : 'center',
				width:50,
				renderer:function(value){
					if(value==0) return "<font color='gray'>未上报</font>";
					else if(value==1) return "<font color='blue'>已上报</font>";
					else if(value==2) return "<font color='red'>修改后未上报</font>";
					else return "<font color=blue>修改后已上报</font>";
				}
			}
	]);
	accCm.defaultSortable = true; // 设置是否可排序
	var Columns = [{
			name : 'uids',type : 'string'
		},
		{
			name : 'pid',type : 'string'
		}, {
			name : 'accidentunit',type : 'string'
		}, {
			name : 'accidentType',type : 'string'
		}, {
			name : 'accidenttime',type : 'date',dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'accidentaddr',type : 'string'
		}, {
			name : 'parties',type : 'string'
		}, {
			name : 'accidentno',type : 'string'
		}, {
			name : 'accidentreason',type : 'string'
		}, {
			name : 'measure',type : 'string'
		},{
			name : 'recunit',type : 'string'
		},{
			name : 'dutyperson',type : 'string'
		},{
			name : 'reportStatus',type : 'float'
	}];
	var accDs= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "pid='"+edit_pid+"' order by accidenttime desc",
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
	accDs.on('beforeload',function(store){
		store.baseParams.params = "pid='" + edit_pid + "'";
		store.baseParams.params += " and REPORT_STATUS in (1,3)";
		if(edit_accidentType !="")
			store.baseParams.params  += " and accidentType='"+edit_accidentType+"'";
		store.baseParams.params += " order by accidenttime desc";	
	});
	accDs.load({params:{start:0,limit:PAGE_SIZE}});

	var Plant = Ext.data.Record.create(Columns);
	var PlantInt= {uids:"",
					pid:"",
					accidentunit:"",
					accidentType:"",
					accidenttime:"",
					accidentaddr:"",
					parties:"",
					accidentno:"",
					accidentreason:"",
					measure:"",
					recunit:"",
					dutyperson:"",
					reportStatus:""}
	
	accGrid = new Ext.grid.EditorGridTbarPanel({
		store : accDs,
		cm : accCm,
		sm : accSm,
		tbar : dydaView==false?["->",{text: '返回',iconCls: 'returnTo',handler: function(){history.back();}}]:[],
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
			store : accDs,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		listeners:{
        	'rowclick' : accGridRowClickEvent
        },
		addBtn : false, 
		saveBtn : false, 
		delBtn : false, 
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : "baseMgm",
		primaryKey : "uids"
	});
//----------------------------------------feedbackGrid---------------------------------------------
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
        		grid.plantInt.infoId=accident_uids;
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
	
//-------------------------------------------------------------------------------
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [accGrid,feedBackGrid]
	});
	//安全事故信息Grid行选择事件
	function accGridRowClickEvent(){
		var rowRecord = accGrid.getSelectionModel().getSelected();
        if(rowRecord){//行被选中
        		accident_uids = rowRecord.get("uids");
        		var ac_time=null;
        		if(rowRecord.get('accidenttime')) ac_time=rowRecord.get('accidenttime').format('Y-m-d')+",";
        		feedBackGrid.setTitle("【"+ac_time+rowRecord.get('accidentaddr')+"】反馈意见") 
        		if (feedBackGrid.getTopToolbar().items.get('add'))
					feedBackGrid.getTopToolbar().items.get('add').enable();
				if (feedBackGrid.getTopToolbar().items.get('save'))
					feedBackGrid.getTopToolbar().items.get('save').enable();
				if (feedBackGrid.getTopToolbar().items.get('del'))
					feedBackGrid.getTopToolbar().items.get('del').enable();
				feedBackGrid.store.baseParams.params = "infoId='" + rowRecord.get('uids') + "'";
				accident_uids=rowRecord.get('uids');
				feedBackGrid.store.reload();
       	}else{
			if (feedBackGrid.getTopToolbar().items.get('add'))
				feedBackGrid.getTopToolbar().items.get('add').disable();
			if (feedBackGrid.getTopToolbar().items.get('save'))
				feedBackGrid.getTopToolbar().items.get('save').disable();
			if (feedBackGrid.getTopToolbar().items.get('del'))
				feedBackGrid.getTopToolbar().items.get('del').disable();
       	}
    }
    
});

function uploadfile(uids,biztype){
	param = {
		businessId:uids,
		businessType:biztype
	};
	showMultiFileWin(param);
	
}
function jumpTo(){
	var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.accident.addOrUpdate.jsp?edit=false&edit_uids="+accident_uids+"&edit_pid="+edit_pid;
	window.location.href = url;
};
		           	
	           		