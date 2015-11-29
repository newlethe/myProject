var accBean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkAccidenrInfo"
var businessType="PCAqgkAccidentAffix"
var accident_uids='',edit_pid=CURRENTAPPID;
var accGrid=null,feedBackGrid=null,content_panel=null;
var array_accidentType=new Array();
//---------页面权限判断----------
if(ModuleLVL<3){
	edit_hide1=false;
}else{
	edit_hide1=true;
}
//---------页面权限判断----------
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
							return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>附件</a>";
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
			bean : accBean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "pid='"+edit_pid+"' order by accidenttime desc" 
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
	//accDs.setDefaultSort("accidenttime", 'desc');
	accDs.on('beforeload',function(store){
		store.baseParams.params = "pid='" + edit_pid + "'";
		if(edit_accidentType !="")
			store.baseParams.params  += " and accidentType='"+edit_accidentType+"'";
		store.baseParams.params += " order by accidenttime desc";	
	});
	accDs.load({params:{start:0,limit:PAGE_SIZE}});
		
	var btnAdd = new Ext.Button({
		id: 'add',
		text: '新增',
		hidden:edit_hide1,
		iconCls: 'add',
		handler: function(){
			var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.accident.addOrUpdate.jsp?edit_pid="+edit_pid;
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
		iconCls: 'option',
		disabled:true,
		handler: toEditHandler
	});
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
		crudText : {add:'新增项目'},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : accBean,
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
        		//上报状态如果为"已上报"上报及其他按钮变为灰色
        		var status = rowRecord.get('reportStatus');
        		if(!edit_hide1){
	        		if('1'==status||1==status){
						accGrid.getTopToolbar().items.get('mydel').disable();
						accGrid.getTopToolbar().items.get('alter').disable();
						accGrid.getTopToolbar().items.get('report').disable();
	        		}else {
        				accGrid.getTopToolbar().items.get('report').enable();
						accGrid.getTopToolbar().items.get('alter').enable();
						accGrid.getTopToolbar().items.get('mydel').enable();
	    			}
    			}
				feedBackGrid.store.baseParams.params = "infoId='" + rowRecord.get('uids') + "'";
				accident_uids=rowRecord.get('uids');
				feedBackGrid.store.reload();
       	}else{
       		if(!edit_hide1){
	       		accGrid.getTopToolbar().items.get('mydel').disable();
				accGrid.getTopToolbar().items.get('alter').disable();
				accGrid.getTopToolbar().items.get('report').disable();
			}
       	}
    }
	//上报安全事故信息
	function reportFn(){
		var selRecord = accGrid.getSelectionModel().getSelected();
		if(selRecord){
			Ext.Msg.confirm('确认', '上报后将不可修改，确认要上报吗？', 
				function(btn,	text) {
					if (btn == "yes") {
						var reportStatus = selRecord.get('reportStatus');//上报状态
						if((reportStatus+"")!="1"){
								var uids=selRecord.get('uids');
								//安全事故报送,参数说明：主键,附件类型,发送单位,接收单位
								Ext.getBody().mask("发送中......");
								pcAqgkService.excDataAqsg(uids,businessType,edit_pid,defaultOrgRootID,function(flag){
									Ext.getBody().unmask();
									if(flag=="1"){
										accGrid.getStore().reload();
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
	//修改安全事故信息
	function toEditHandler(){
        var record = accGrid.getSelectionModel().getSelected();
    	if(record){
    		if(record.get('reportStatus')){
        		Ext.MessageBox.alert('确认',"此安全事故已上报，不可修改？");
        	}else{
	    		var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.accident.addOrUpdate.jsp?" +
	    				"edit_uids="+record.get('uids')+"&edit_pid="+edit_pid;
				window.location.href = url;
        	}
    	}
    }
    //删除安全事故信息记录
    function deleteFn(){
    	var selRecord = accGrid.getSelectionModel().getSelected();
    	if(selRecord){
    		var reportStatus = selRecord.get('reportStatus');//报送状态
    		if(reportStatus ==1||reportStatus =="1"){//已上报
				var flag=false;
				var ac_mssage=null;
				Ext.example.msg('提示','操作失败，事故已上报!',2);
    		}else{//未上报，可以进行删除操作
    			Ext.Msg.confirm('确认', '删除操作将不可恢复，确认要删除吗？', 
    				function(btn,	text) {
						if (btn == "yes") {
								DWREngine.setAsync(false);
								var whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID='"+selRecord.get('uids')+"'";
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
								var sql="delete from PC_AQGK_ACCIDENR_INFO where uids='"+selRecord.get('uids')+"'";
								baseDao.updateBySQL(sql,function(flag){
									if(flag==1){
										accGrid.getStore().reload();
										Ext.example.msg('提示','操作成功!');
									}else{
										Ext.example.msg('提示','操作失败!',2);
									}
								});
								DWREngine.setAsync(true);
							}
				}, this);
    		}
    	}
    }
    
});

function uploadfile(uids,biztype){
	var status = accGrid.getSelectionModel().getSelected().get('reportStatus');
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
	var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.accident.addOrUpdate.jsp?edit=false&edit_uids="+accident_uids+"&edit_pid="+edit_pid;
	window.location.href = url;
};
		           	
	           		