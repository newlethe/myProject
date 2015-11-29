var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetymonthInfo"
var bean2 = "com.sgepit.pcmis.aqgk.hbm.PcAqgkFeedbackInfo"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var businessType="PCAqgkSafetymonthAffix"
var safetymonth_uids=''
edit_pid=CURRENTAPPID;
var grid=null;

var curr_date=new Date();
//---------页面权限判断----------
var edit_hide1=null;
if(ModuleLVL<3){
	edit_hide1=false;
}else{
	edit_hide1=true;
}
//---------页面权限判断----------
	
Ext.onReady(function() {
	var array_yearMonth=getYearMonthBySjType(null,null);
	
	var dsCombo_yearMonth=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: array_yearMonth
	});
	var yearMonthCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store :dsCombo_yearMonth,
				valueField : 'k',
				displayField : 'v',
				emptyText:"请选择",
				editable:false,
				allowBlank : false,
				maxHeight:107,
				forceSelection:true,
				hiddenValue:true,
				listeners:{
	       			'expand':function(){
	       				pcTzglService.sjTypeFilter(edit_pid,bean,function(arr){
	       					if(arr.length>0){
		       				  dsCombo_yearMonth.filterBy(sjTypeFilter);
		       				  function sjTypeFilter(record,id){
		       				  	for(var i=0; i<arr.length; i++){
									if(record.get("k")==arr[i]) return false;
								}
		       				  	return true;
		       				  } 
		       				}
	       				});
	       			}
	       		}
			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				header: '',
				singleSelect : true
			})
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
			hidden : true,
			hideLabel : true,
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
				type : 'string',
				align : 'center',
				width:40,
				header : fc['sjType'].fieldLabel,
				dataIndex : fc['sjType'].name,
				editor:yearMonthCombo,
				renderer:function(k){
					for(var i = 0;i<array_yearMonth.length;i++){
						if(k == array_yearMonth[i][0]){
							return array_yearMonth[i][1];
						}
					}
				}
			
			}, {
				id : 'infoTime',
				type : 'date',
				width:50,
				header : fc['infoTime'].fieldLabel,
				dataIndex : fc['infoTime'].name,
				hidden:true,
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
				renderer:function(v,m,r){
					if(r.isNew===true) return "";
					return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>附件</a>";
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
					else if(value=="2") return "<font color=red>退回重报</font>";
					else return "<font color=gray>未上报</font>";
				}
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序
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
			business : business,
			method : listMethod,
			params : "pid='"+edit_pid+"' order by sj_type desc" 
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

	var btnRep = new Ext.Button({
		id: 'report',
		text: '上报',
		disabled:true,
		hidden:edit_hide1,
		iconCls: 'upload',
		hidden : !haveReport,
		handler: reportFn
	});

	var btnReRep = new Ext.Button({
		id: 'rereport',
		text: '重新上报',
		hidden:edit_hide1,
		iconCls: 'download',
		handler: reEditHandler
	});

	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt= {uids:'',
					pid:edit_pid,
					title:'',
					infoTime:'',
					sjType:'',
					reportperson:'',
					state:'0'}
	
	grid = new Ext.grid.EditorGridTbarPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar :['-'],
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
        	'rowclick' : function(grid, rowIndex, e){
        		var rowRecord = grid.getStore().getAt(rowIndex);
        		if(rowRecord){
        			safetymonth_uids = rowRecord.get("uids");
        			feedBackGrid.setTitle("【"+rowRecord.get('title')+"】反馈意见") 
					var state = rowRecord.get('state');
					if(!edit_hide1){
						if('1'==state||1==state)
						{   
							grid.getTopToolbar().items.get('report').disable();
							grid.getTopToolbar().items.get('save').disable();
							grid.getTopToolbar().items.get('del').disable();
						}else {
							grid.getTopToolbar().items.get('report').enable();
							grid.getTopToolbar().items.get('save').enable();
							grid.getTopToolbar().items.get('del').enable();
						}
						if(rowRecord.isNew===true) grid.getTopToolbar().items.get('report').disable();
					}
					feedBackDS.baseParams.params = "infoId='" + rowRecord.get('uids') + "'";
					safetymonth_uids=rowRecord.get('uids');
					feedBackDS.reload();
	        		//新增数据时【上报】按钮失效
        		}
        		var selectRecords = grid.getSelectionModel().getSelections();
        		//没有选中行时【上报】按钮失效
        		if(!edit_hide1){
        			if(selectRecords.length==0) grid.getTopToolbar().items.get('report').disable();
        		}
        	},
        	
        	'beforeinsert':function(grid){
        		curr_date=new Date();
        		grid.plantInt.infoTime=curr_date;
        	},
        	
        	'beforeedit':function(e){
        		if(e.record.get('state')=="1")return false;
        	},
        	
        	'render':function(grid){
        		
        	}
        },
		addBtn : true, 
		saveBtn : true, 
		delBtn : true, 
		insertHandler :insertFn,
		deleteHandler:deleteFn,
		crudText : {},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
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
		items : [grid,feedBackGrid]
	});
	
		grid.getTopToolbar().add(btnRep);
	
	
/**
 * 方法 
 */
 	function insertFn(){
 		grid.defaultInsertHandler();
 	}
 	function saveFn(){
 		var selectRecords = grid.getSelectionModel().getSelections();
 		if(selectRecords.length > 0){
 			var flag=true;
			for(var i=0;i<selectRecords.length;i++){
				var record=selectRecords[i];
				var reportStatus = record.get('state');
				if(reportStatus =="1"){
					var flag=false;
					Ext.MessageBox.alert('确认',"\""+record.get('title')+"\"已上报，不能修改！");
					grid.getStore().reload();
					break;
				}
			}
			if(flag)grid.defaultSaveHandler();
		}
 	}
 	function deleteFn(){
    	var selectRecords = grid.getSelectionModel().getSelections();
		DWREngine.setAsync(false);
		if(selectRecords.length > 0){
			for(var i=0;i<selectRecords.length;i++){
				var record=selectRecords[i];
				var reportStatus = record.get('state');
				if(reportStatus =="1"){
					var flag=false;
					Ext.MessageBox.alert('确认',"\""+record.get('title')+"\"已上报，不能删除！");

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
								var sql="delete from PC_AQGK_SAFETYMONTH_INFO where uids='"+record.get('uids')+"'";
								baseDao.updateBySQL(sql);
							}
							grid.getStore().reload();
						}, this);
				}
			}
		}			
		DWREngine.setAsync(true);
		grid.getStore().load();
    }
    
	function reportFn(){
		var selRecord = grid.getSelectionModel().getSelected();
		if(selRecord){
			Ext.Msg.confirm('确认', '上报后将不可修改，确认要上报吗？', 
				function(btn,	text) {
					if (btn == "yes") {
						var reportStatus = selRecord.get('state');//上报状态
						if((reportStatus+"")!="1"){
								var uids=selRecord.get('uids');
								//安全月报报送,参数说明：主键,附件类型,发送单位,接收单位
								Ext.getBody().mask("发送中......");
								pcAqgkService.excDataAqyb(uids,businessType,edit_pid,defaultOrgRootID,function(flag){
									Ext.getBody().unmask();
									if(flag=="1"){
										grid.getStore().reload();
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


    
	function reEditHandler(){
        var record = grid.getSelectionModel().getSelected();
    	if(record){
	    		var url = BASE_PATH+"PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetyTrain.addOrUpdate.jsp?re_edit=true&edit_uids="+record.get('uids')+"&edit_pid="+edit_pid;
				window.location.href = url;
    	}
    }
  
});  


function uploadfile(uids,biztype){
	var state = grid.getSelectionModel().getSelected().get('state');
	if(state=="1")state=true;
	else state=false;
	var val="true";
	if(uids==''||uids==null||edit_hide1||state)val="";
	var param = {
		businessId:uids,
		businessType:biztype,
		editable : val
	};

	showMultiFileWin(param);
	
}