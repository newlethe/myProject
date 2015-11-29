var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetytrainInfo"
var bean2 = "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo"
var businessType="PCAqgkSafetyTrainAffix"
var accident_uids=''
edit_pid=CURRENTAPPID;
var trainGrid=null,feedBackGrid=null;
//---------页面权限判断----------
var edit_hide1=null;
if(ModuleLVL<3){
	edit_hide1=false;
}else{
	edit_hide1=true;
}
//---------页面权限判断----------
	
Ext.onReady(function() {
	//配置安全培训记录Grid
	var trainSm = new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
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
		
	};
	var trainCm = new Ext.grid.ColumnModel([ 
			trainSm, 
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
					return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>附件</a>";
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
	trainCm.defaultSortable = true; // 设置是否可排序
	var Columns = [{
				name : 'uids',type : 'string'
			},{
				name : 'pid',type : 'string'
			}, {
				name : 'traintime',	type : 'string'
			}, {
				name : 'trainaddr',	type : 'string'
			}, {
				name : 'trainunit',	type : 'string'
			}, {
				name : 'traintitle',type : 'string'
			}, {
				name : 'trainnumber',type : 'string'
			}, {
				name : 'traincontent',	type : 'string'
			}, {
				name : 'remarks',type : 'string'
			},{
				name : 'trainStatus',type : 'float'
			}];
	var trainDs= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "pid='"+edit_pid+"' order by traintime desc" 
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
	//trainDs.setDefaultSort("traintime", 'desc');
	trainDs.load({params:{start:0,limit:PAGE_SIZE}});
		
	var btnAdd = new Ext.Button({
		id: 'add',
		text: '新增',
		iconCls: 'add',
		handler: function(){
			var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetyTrain.addOrUpdate.jsp?edit_pid="+edit_pid;
			window.location.href = url;
		}
	});
	var btnDel = new Ext.Button({
		id: 'mydel',
		text: '删除',
		iconCls: 'remove',
		disabled:true,
		handler: deleteFn
	});
	var btnRep = new Ext.Button({
		id: 'report',
		text: '上报',
		iconCls: 'upload',
		disabled:true,
		hidden : !haveReport,
		handler: reportFn
	});
	var btnAlter = new Ext.Button({
		id: 'alter',
		text: '修改',
		disabled:true,
		iconCls: 'option',
		handler: toEditHandler
	});
	
	var btnReRep = new Ext.Button({
		id: 'rereport',
		text: '<font color=red>重新上报</font>',
		iconCls: 'download',
		handler: reEditHandler
	});
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt= {uids:'',
					pid:'',
					traintime:'',
					trainaddr:'',
					trainunit:'',
					traintitle:'',
					trainnumber:'',
					traincontent:'',
					remarks:'',
					trainStatus:''}
	
	trainGrid = new Ext.grid.EditorGridTbarPanel({
		store : trainDs,
		cm : trainCm,
		sm : trainSm,
		tbar : edit_hide1?false:[btnAdd,'-',btnDel,'-',btnAlter,'-',btnRep],
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
			store : trainDs,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		listeners:{
        	'rowclick' : trainGridRowClickEvent
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
        addBtn : false, 
		saveBtn : false, 
		delBtn : false, 
		plant : feedBack_Plant,
		plantInt : feedBack_PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo",
		business : "baseMgm",
		primaryKey : "uids"
	});
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [trainGrid,feedBackGrid]
	});
	
	function reportFn(){
		var selRecord = trainGrid.getSelectionModel().getSelected();
		if(selRecord){
			Ext.Msg.confirm('确认', '上报后将不可修改，确认要上报吗？', 
				function(btn,	text) {
					if (btn == "yes") {
						var reportStatus = selRecord.get('trainStatus');//上报状态
						if((reportStatus+"")!="1"){
								var uids=selRecord.get('uids');
								//安全培训报送,参数说明：主键,附件类型,发送单位,接收单位
								Ext.getBody().mask("发送中......");
								pcAqgkService.excDataAqpx(uids,businessType,edit_pid,defaultOrgRootID,function(flag){
								Ext.getBody().unmask();
									if(flag=="1"){
										trainGrid.getStore().reload();
										Ext.example.msg('提示','操作成功!');
									}else{
										Ext.Msg.show({
											msg:'操作失败!',
											title: '提示',
										    buttons: Ext.MessageBox.OK,
										    icon: Ext.MessageBox.INFO
										});										
									}
								});
						}
					}
			}, this);
		}
	}
	
	function toEditHandler(){
		var grid = trainGrid;
        var record = grid.getSelectionModel().getSelected();
    	if(record){
    		if(record.get('trainStatus')){
        		Ext.MessageBox.alert('确认',"此安全培训已上报，不可修改？");
        	}else{
	    		var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetyTrain.addOrUpdate.jsp?edit_uids="+record.get('uids')+"&edit_pid="+edit_pid;
				window.location.href = url;
        	}
    	}
    }
    
	function reEditHandler(){
        var record = grid.getSelectionModel().getSelected();
    	if(record){
	    		var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetyTrain.addOrUpdate.jsp?re_edit=true&edit_uids="+record.get('uids')+"&edit_pid="+edit_pid;
				window.location.href = url;
    	}
    }
    
    function deleteFn(){
    	var grid = trainGrid;
    	var selectRecords = grid.getSelectionModel().getSelections();
		DWREngine.setAsync(false);
		if(selectRecords.length > 0){
			for(var i=0;i<selectRecords.length;i++){
				var record=selectRecords[i];
				var trainStatus = record.get('trainStatus');
				if(trainStatus ==1){
					var flag=false;
					Ext.MessageBox.alert('确认',"\""+record.get('traintitle')+"\" 已上报,不能删除！");

				}else {
					Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
							text) {
							if (btn == "yes") {
								var whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID='"+record.get('uids')+"'";
								var fileLshs="";
								fileServiceImpl.geAttachListByWhere(whereSql,null,null,function(list){
									if(list.length>0){
										for(var j=0; j<list.length-1; j++){
											fileLshs+="'"+list[j].fileLsh+"',";
										}
										fileLshs+="'"+list[list.length-1].fileLsh+"'";
										fileServiceImpl.deleteAttachList(fileLshs,null);
									}
								});
								var sql="delete from PC_AQGK_SAFETYTRAIN_INFO where uids='"+record.get('uids')+"'";
								baseDao.updateBySQL(sql);
								
							}
							grid.getStore().reload();
						}, this);
				}
			}
		}			
		DWREngine.setAsync(true);
    }
    
    function FBdeleteFn(){
    	var selectRecord = feedBackGrid.getSelectionModel().getSelected();
		if(selectRecord){
			if(selectRecord.get('feedperson')==REALNAME){
				Ext.Msg.confirm('确认', '删除后不可恢复，是否删除？', function(btn,text){
					if(btn=="yes"){
							pcAqgkService.excDataOpinionForDel(selectRecord.get('uids'),defaultOrgRootID, edit_pid,"安全培训信息删除【"+REALNAME+"】",
							function(flag){
							if(flag=="1"){
								feedBackGrid.getStore().reload();
								Ext.example.msg('','删除成功');
							}else{
								Ext.example.msg('','删除失败',2);
							}
						})
					}
				})
			}else{
				alert("此反馈意见不在你的删除权限内！");
			}
		}			
    }
});

function uploadfile(uids,biztype){
	var status = trainGrid.getSelectionModel().getSelected().get('trainStatus');
	if(status==1)status=true;
	else status=false;
	var param = {
		businessId:uids,
		businessType:biztype,
		editable : "true"
	};
	if(status||edit_hide1){
		param = {
			businessId:uids,
			businessType:biztype
		};
	}
	showMultiFileWin(param);
	
}

function jumpTo(){
	var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetyTrain.addOrUpdate.jsp?edit=false&edit_uids="+accident_uids+"&edit_pid="+edit_pid;
	window.location.href = url;
};
//培训记录选中或取消选择时事件处理函数
function trainGridRowClickEvent(){
	var rowRecord = trainGrid.getSelectionModel().getSelected();
	if(rowRecord){//培训grid中有记录被选中
		accident_uids=rowRecord.get('uids');
		feedBackGrid.setTitle("【"+rowRecord.get('traintitle')+"】反馈意见") 
		var status = rowRecord.get('trainStatus');//报送状态
		if(!edit_hide1){
			if(status==1||status=="1"){//已上报
				trainGrid.getTopToolbar().items.get('mydel').disable();
				trainGrid.getTopToolbar().items.get('report').disable();
				trainGrid.getTopToolbar().items.get('alter').disable();
			}else{
			//填报
				trainGrid.getTopToolbar().items.get('mydel').enable();
				trainGrid.getTopToolbar().items.get('report').enable();
				trainGrid.getTopToolbar().items.get('alter').enable();
			}
		}
		feedBackGrid.store.baseParams.params = "infoId='" + rowRecord.get('uids') + "'";
		feedBackGrid.store.reload();
	}else{//未选中行时【删除】【修改】【上报】按钮失效
		if(!edit_hide1){
			trainGrid.getTopToolbar().items.get('mydel').disable();
			trainGrid.getTopToolbar().items.get('report').disable();
			trainGrid.getTopToolbar().items.get('alter').disable();
		}
		feedBackGrid.setTitle("反馈意见列表") 
		feedBackGrid.store.removeAll();
	}
}