var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkInspectionBatInfo";
var bean2 = "com.sgepit.pcmis.aqgk.hbm.PcAqgkHiddenDangerInfo";
var inspectionBatGrid=null;

var insUids = null  //被删除安全隐患所属检验批次主键

var editFlag = ModuleLVL<3 ? true:false;  //读写控制标志位

/*用户分类: 
 * 0--集团用户,二级公司只读用户,三级公司只读用户，项目单位只读用户
 * 1--二级公司可编辑用户; 
 * 2--三级公司和项目单位可编辑用户;
 */
var userRoleType = '0';
if(USERBELONGUNITTYPEID=='2'){
	userRoleType = editFlag?'1':'0';
}else if(USERBELONGUNITTYPEID=='A' || USERBELONGUNITTYPEID=='3'){
	userRoleType = editFlag?'2':'0';
}	

Ext.onReady(function() {
    Ext.QuickTips.init();

	var inspectionBatSm = new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
	inspectionBatSm.on('rowdeselect', function(){Ext.getCmp('import').disable()})
	
	var fm = Ext.form;
	var fc = { 
		// 检验批次可以编辑配置内容
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
		'jypc' : {
			name : 'jypc',
			fieldLabel : '检查批次',
			allowBlank : false,
			anchor : '95%'
		},
		'jysj' : {
			name : 'jysj',
			fieldLabel : '检查时间',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'mainPerson' : {
			name : 'mainPerson',
			fieldLabel : '主要检查人',
			anchor : '95%'
		},
		'inputPerson' : {
			name : 'inputPerson',
			fieldLabel : '录入人',
			anchor : '95%'
		},
		'inputDate' : {
			name : 'inputDate',
			fieldLabel : '录入时间',
			format : 'Y-m-d',
			anchor : '95%'
		},
		
		//安全隐患可编辑配置区域
		'yhbh': {
			name: 'yhbh',
			fieldLabel: '隐患编号',
			allowBlank: false,
			anchor: '95%'
		},
		'yhnr': {
			name: 'yhnr',
			fieldLabel: '隐患内容',
			anchor: '95%'
		},
		'overDate':{
			name : 'overDate',
			fieldLabel : '实际整改完成时间',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'state': {
			name : 'state',
			fieldLabel : '整改状态',
			displayField : 'v',
			valueField : 'k',
			xtype:'combo',
			editable:false,
			store : new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : [['0', '未整改'], ['1', '长期坚持'], ['2', '已整改']]
					}),
			mode : 'local',
			triggerAction : 'all',
			lazyRender : false,
			listClass : 'x-combo-list-small',
			anchor : '95%',
			listeners: {
				'select': function(combo) {
					if(userRoleType == '1') {
						var rec = hiddenDangerGrid.getSelectionModel().getSelected();
						var feedBackInfo = rec.get('feedBack');
						var oldValue = rec.get('state');
						var currValue = combo.getValue();
						if(oldValue != currValue && feedBackInfo ==  '') {
							rec.set('feedBack', "请填写反馈信息！");
						}
					}
				}
			
			}
		},
		'memo': {
			name: 'memo',
			fieldLabel: '整改情况说明',
			anchor: '95%' 
		}
	}
	
	var summary = new Ext.ux.grid.GridSummary();
	
	var inspectionBatCm = new Ext.grid.ColumnModel([ // 创建列模型
			inspectionBatSm, 
			{
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'jypc',
				header : fc['jypc'].fieldLabel,
				dataIndex : fc['jypc'].name,
				width :120,
				editor : (userRoleType=='1')?new fm.TextField(fc['jypc']):null,
				renderer: function(value){
					if(value!='')
					{
						return "<a title="+value+">"+value+"</a>";
					}
				},
				summaryType:'count',
				summaryRenderer:function(v){return "<b>共 "+v+" 个检查批次</b>"}
			}, {
				id : 'jysj',
				header : fc['jysj'].fieldLabel,
				dataIndex : fc['jysj'].name,
				align : 'center',
				sortable : true,
				width : 40,
				renderer : formatDate,
				editor : (userRoleType=='1')?new fm.DateField(fc['jysj']):null 
			}, {
				id : 'dangerCount',
				align : 'center',
				header : '发现隐患',
				dataIndex : 'dangerCount',
				width : 50,
				summaryType:'custom',
				calculateFn: caculateHandler,
				summaryRenderer: SumRenderFun
			}, {
				id : 'zgwcl',
				header : '整改完成率',
				dataIndex : 'zgwcl',
				width : 55,
				align : 'center',
				renderer : function(value,meta, record){
					var dCount = parseFloat(record.get('dangerCount')).toFixed(1);
					if(dCount==0.0) {
						return "0%";
					} else {
						var zCount = parseFloat(record.get('zgCount'));
						var cCount = parseFloat(record.get('cqjcCount'));
						var rate = (zCount+cCount)/dCount;
//						return rate==1? "100%" : (rate*100).toFixed(2) + "%";
						return rate==0 ? "0%" : (rate==1 ? "100%" : (rate*100).toFixed(2) + "%");
					}

					
				},
				summaryType:'custom',
				calculateFn:function(name,r,rs){
					var totalDangerCount = 0.0;
					var totalZgCount = 0.0;
					var totalCqjcCount = 0.0;
					for(var i=0; i<rs.length; i++)
					{
						totalDangerCount += parseFloat(rs[i].get('dangerCount'));
						totalZgCount += parseFloat(rs[i].get('zgCount'));
						totalCqjcCount += parseFloat(rs[i].get('cqjcCount'));
					}
					var srate = (totalZgCount+totalCqjcCount)/totalDangerCount;
					if(totalDangerCount == 0.0 ) {
						return 0;
					} else {
						return srate==1 ? 1 : srate;
					}
				},
				summaryRenderer: function(v){
					if(v==undefined || v==null || v==0 || v=='0')
						return "0%".fontsize(2);
					else	
						return v==1 ? "100%".fontsize(2) :((new Number(v*100)).toFixed(2)+'%').fontsize(2);
				}
			}, {
				id : 'wzgCount',
				header : '<div style="background:#FF6060;height:20px;line-height:20px;">'
																								+'未整改'+'</div>',
				dataIndex : 'wzgCount',
				align : 'center',
				width : 30,
				summaryType:'custom',
				calculateFn:caculateHandler,
				summaryRenderer: SumRenderFun
			},{
				id : 'cqjcCount',
				header : '<div style="background:#FCD20A;position:re-lative;height:20px;line-height:20px;">'
																						+'长期坚持'+'</div>',
				dataIndex : 'cqjcCount',
				align : 'center',
				width : 35,
				summaryType:'custom',
				calculateFn: caculateHandler
			},{
				id : 'zgCount',
				header : '<div style="background:#92D050;height:20px;line-height:20px;">'
																						+'整改完成'+'</div>',
				dataIndex : 'zgCount',
				align : 'center',
				width : 35,
				summaryType:'custom',
				calculateFn: caculateHandler,
				summaryRenderer: SumRenderFun
			},{
				id : 'mainPerson',
				header : fc['mainPerson'].fieldLabel,
				dataIndex : fc['mainPerson'].name,
				align : 'center',
				width : 90,
				editor : (userRoleType=='1')? new fm.TextField(fc['mainPerson']):null,
				renderer: tipRenderFun 
			},{
				id: 'inputPerson',
				header : fc['inputPerson'].fieldLabel,
				dataIndex : fc['inputPerson'].name,
				align : 'center',
				width : 45,
				editor : (userRoleType=='1')? new fm.TextField(fc['inputPerson']):null
			},{
				id: 'inputDate',
				header : fc['inputDate'].fieldLabel,
				dataIndex : fc['inputDate'].name,
				align : 'center',
				width : 40,
				renderer : formatDate,
				editor : (userRoleType=='1')? new fm.DateField(fc['inputDate']):null
			}
	]);
	
//	inspectionBatCm.defaultSortable = false;
	var Columns = [{
			name : 'uids',type : 'string'
		},{
			name : 'pid',type : 'string'
		}, {
			name : 'jypc',type : 'string'
		}, {
			name : 'jysj',type : 'date',dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'dangerCount',type : 'string'
		}, {
			name : 'zgwcl',type : 'float'
		}, {
			name : 'wzgCount',type : 'string'
		}, {
			name : 'cqjcCount',type : 'string'
		}, {
			name : 'zgCount',type : 'string'
		}, {
			name : 'mainPerson',type : 'string'
		},{
			name : 'inputPerson',type : 'string'
		},{
			name : 'inputDate',type : 'date', dateFormat: 'Y-m-d H:i:s'
		}];
		
	var inspectionBatDs= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "pid="+pid
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
			'load': function(){
				if(userRoleType=='1')
				{
					inspectionBatGrid.getTopToolbar().items.get('add').enable();
				}
			}
		}
	});
	
	inspectionBatDs.sort('jysj','desc'); //默认按照检查时间倒序排列
	inspectionBatDs.load();  //不用分页机制

	var Plant = Ext.data.Record.create(Columns);
	var PlantInt= { 
					uids:"",
					pid: CURRENTAPPID,
					accidentunit:"",
					jypc:"",
					jysj:"",
					dangerCount: 0,
					zgwcl:"0.0",
					wzgCount:0,
					cqjcCount:0,
					zgCount:0,
					mainPerson:"",
					inputPerson:"",
					inputDate: new Date()
				 };
	
	var btnFlag = userRoleType=='1'?true:false;	
	var title = pname + '－检查批次';
	inspectionBatGrid = new Ext.grid.EditorGridTbarPanel({
		store : inspectionBatDs,
		cm : inspectionBatCm,
		sm : inspectionBatSm,
		plugins: [summary],
		title: title,
		tbar : userRoleType=='1'?[]:null,
		autoScroll : true, // 自动出现滚动条
		autoExpandColumn : 3, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, 
		stripeRows : true,
		trackMouseOver : true,
		enableHdMenu:false,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		addBtn : btnFlag, 
		saveBtn : btnFlag, 
		delBtn : btnFlag, 
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : "baseMgm",
		primaryKey : "uids",
		insertHandler: function(){
			if(userRoleType=='1') {
				hiddenDangerGrid.getTopToolbar().items.get('add').disable();
				Ext.getCmp('import').disable();
			}
			this.defaultInsertHandler();
		},
		deleteHandler: function(){
			var record = this.getSelectionModel().getSelected();
			if(record == null) {
				 Ext.Msg.alert('提示信息','请选择一个检验批次!');
				 return;
			}
			
			Ext.MessageBox.confirm("确认","确定要删除检验批次"+record.get('jypc').fontcolor('blue')+"吗?",
																					function(btn,text){
				if(btn=='yes') {
					if(isBatDeleteable(record.get('uids'))) {
						DWREngine.setAsync(false);
						pcAqgkService.deleteInspectionInfo(record.get('uids'));
						//二级公司数据交互到项目单位
						if(userRoleType=='1') {
							pcAqgkService.excDataInspectionForDelete(record.get('uids'), 
																		CURRENTAPPID, USERBELONGUNITID);
						}
						DWREngine.setAsync(true);
						
						inspectionBatDs.reload();
						hiddenDangerDS.reload({params:{start:0, limit:15}});
					} else {
						Ext.Msg.alert('提示信息','该批次下已有隐患问题在整改中，不允许删除!');
						return;					
					} 
				}
			})
		},
		saveHandler: function(){
			this.defaultSaveHandler();
		},
		listeners: {
			'rowclick': function(){
				stateCombo.setValue('all');
				var record = inspectionBatGrid.getSelectionModel().getSelected();
				if(record != null) {
					if(userRoleType=='1')
					{
						var items = inspectionBatGrid.getTopToolbar().items;
						items.get('del').enable();
						items.get('save').enable();
						
						if(record.get('uids')!='') {
							Ext.getCmp('import').enable();  
						}
						else {
							Ext.getCmp('import').disable();  
						}
					}
					hiddenDangerGrid.setTitle("["+record.get('jypc')+']发现隐患问题');
					hiddenDangerDS.baseParams.params = "pid='" + record.get('pid') + "' and batUids='" + 
														record.get('uids')+"' order by gxsj desc, state, uids";
														record.get('uids')+"'";
					hiddenDangerDS.load({params:{start:0, limit:15}})
				}
				else {
					//do nothing
				}
			},
			'aftersave': function(grid, idsOfInsert, idsOfUpdate){
				if(userRoleType=='1'){
					var insertUids = idsOfInsert.split(",");
					var updateUids = idsOfUpdate.split(",");
					var batUids = (idsOfInsert.length==0 ? (idsOfUpdate.length==0 ? [] : updateUids):
														 (idsOfUpdate.length==0 ? insertUids : insertUids.concat(updateUids)))
					DWREngine.setAsync(false);									 
						pcAqgkService.excDataInspectionForSaveOrUpdate(batUids, CURRENTAPPID, USERBELONGUNITID);
					DWREngine.setAsync(false);
				}
			},
			'afterdelete': function(){
				hiddenDangerDS.baseParams.params = "pid="+CURRENTAPPID;
				hiddenDangerDS.load({params:{start: 0, limit: 15}});
			},
			'render': function(){
				if(userRoleType=='1')
				{
					this.getTopToolbar().items.get('save').disable();
					this.getTopToolbar().items.get('del').disable();
				}	
			}
		}
	});
	
	var northPanel = new Ext.Panel({
		region: 'north',
		collapseMode : 'mini',
		split : true,
		layout: 'fit',
		height: 170,
		items:[inspectionBatGrid]
	})
	
//----------------------------------------隐患信息grid---------------------------------------------
	var hiddenDangerSm =new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
	
	var hiddenDangerCm = new Ext.grid.ColumnModel([		
    	 hiddenDangerSm,
    	{
    		id : 'uids',
    		header : "主键",
    		dataIndex : "uids",
    		hidden : true
        },{
        	id :'pid',
        	header : "项目编号",
        	dataIndex : "pid",
        	hidden : true
        },{
        	id :'batUids',
        	header : "检验批次主键",
        	dataIndex : "batUids", 
        	hidden : true
        },{
        	id : 'yhbh',
        	header : fc['yhbh'].fieldLabel,
        	dataIndex : fc['yhbh'].name,
        	width : 30,
        	editor : (userRoleType=='1')? new fm.TextField(fc['yhbh']):null,
        	renderer : function(value, meta, record){    //根据整改状态,检验批次列显示不同背景色
					switch(record.get('state')){
						case '0':
							return '<div style="background:#FF6060;position:re-lative;height:20px;line-height:20px;">' 
																											+ value + '</div>';
						case '1':
						    return '<div style="background:#FCD20A;position:re-lative;height:20px;line-height:20px;">'
						    																				+ value + '</div>';
						case '2':
						  	return '<div style="background:#92D050;position:re-lative;height:20px;line-height:20px;">'
						  																					+ value + '</div>';
						default:
							return '<div style="background:#FF6060;position:re-lative;height:20px;line-height:20px;">' 
																											+ value + '</div>';											
					}						
				}
        },{
        	id : 'yhnr',
        	header : fc['yhnr'].fieldLabel,
        	dataIndex : fc['yhnr'].name,
        	editor : (userRoleType=='1')?new fm.TextField(fc['yhnr']):null,
        	renderer: tipRenderFun
        },{
        	id : 'gxsj',
        	header : "更新时间",
        	dataIndex : "gxsj",
        	width :25,
        	align : 'center',
        	renderer : formatDate
        },{
        	id : 'state',
        	header : "是否整改完成",
        	dataIndex : 'state',
        	width : 30,
        	align : 'center',
        	editor : (userRoleType!='0')?new fm.ComboBox(fc['state']):null,
        	renderer : stateShow
        },{
        	id : 'overDate',
        	header : fc['overDate'].fieldLabel,
        	dataIndex : fc['overDate'].name ,
        	width : 35,
        	align : 'center',
        	renderer : formatDate,
        	editor : (userRoleType=='2')?new fm.DateField(fc['overDate']):null
        },{
        	id : 'memo',
        	header : fc['memo'].fieldLabel,
        	dataIndex : fc['memo'].name,
        	width : 60,
        	editor: (userRoleType=='2')?new fm.TextField(fc['memo']):null,
        	renderer: tipRenderFun
        },{
        	id : 'feedBack',
        	hidden: false,
        	header : "上级单位反馈",
        	dataIndex : 'feedBack',
        	width : 26,
        	align : 'center',
        	renderer : function(v, m, rec) {
        		if(userRoleType != '1') {
					if( v == '' || v == null )
						return "查看";
					else 
						return "<a href='javascript:showOverview(\"" +v+ "\")'><font color=blue>查看</font></a>";
        		} else {
        			if( v == '' || v == null )
						return "";
					else 
						return "<a href='javascript:showOverview(\"" +v+ "\")'>反馈</a>";
        	    }
           }
        }
    ])
    
	var hiddenDangerColumns = [
    	{name: 'uids', type: 'string'},			
    	{name: 'pid', type: 'string'},	
    	{name: 'batUids', type: 'string'},	
    	{name: 'yhbh', type: 'string'},	
    	{name: 'yhnr', type: 'string'}, 	
    	{name: 'gxsj', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'state', type: 'string'},
    	{name: 'feedBack', type: 'string'},
    	{name: 'overDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'memo', type: 'string'}
	]
	
	var hiddenDangerDS = new Ext.data.Store({
		id: 'hd_ds',
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean2,				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params: "pid="+pid+" order by state, gxsj desc, uids"
		},
        proxy: new Ext.data.HttpProxy({
	        method: 'GET', 
	        url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "uids"
        }, hiddenDangerColumns),
        remoteSort: true,
        pruneModifiedRecords: true,	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
        listeners: {
        	'load': function(){
        		if(userRoleType=='1')
        		{
        			var record = inspectionBatSm.getSelected();
					if(record==undefined||record==null||record.get('uids')=='')
					{
						// do nothing '新增'按钮保持disable()状态
					}
					else
					{
						hiddenDangerGrid.getTopToolbar().items.get('add').enable();
					}
        			hiddenDangerGrid.getTopToolbar().items.get('save').disable();
        			hiddenDangerGrid.getTopToolbar().items.get('del').disable();
        		}
        		else if(userRoleType=='2')
        		{
        			hiddenDangerGrid.getTopToolbar().items.get('save').disable();
        		}
        	}
        }
    });
    
    hiddenDangerDS.load({params:{start: 0, limit: 15}});
    
    var hiddenDanger_Plant = Ext.data.Record.create(hiddenDangerColumns);
    
	var hiddenDanger_PlantInt= {
			uids: "",
			pid: CURRENTAPPID,
			batUids: "",
			yhbh: "",
			yhnr: "",
			gxsj: new Date(),
			state: "0",
			overDate: "",
			memo: ""
	};
								
	var btnAllBat = new Ext.Button({
		id: 'allBat',
		text: '显示所有批次',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/shared/icons/application_go.png',
		handler: showAllFun
	});
	
	//整改状态选择下拉框
	var stateCombo = new Ext.form.ComboBox({
						id:'state-combo',
						readOnly : true,
						valueField : 'k',
						displayField : 'v',
						mode : 'local',
						triggerAction : 'all',
						store : [['all','所有状态'],['0','未整改'],['1','长期坚持'],['2','整改完成']],
						lazyRender : true,
						allowBlank : true,
						listClass : 'x-combo-list-small',
						width : 100,
						value:'all',
						listeners : {
							select : function(combo) {
								hiddenDangerSm.clearSelections();
								if(userRoleType=='1'){
									hiddenDangerGrid.getTopToolbar().items.get('add').disable();
									hiddenDangerGrid.getTopToolbar().items.get('save').disable();
									hiddenDangerGrid.getTopToolbar().items.get('del').disable();
								}
								var rec = inspectionBatGrid.getSelectionModel().getSelected();
								var filter = "";
								filter += ((rec==undefined||rec==null)?'1=1':"bat_uids='" + rec.get('uids')+"'");
								
								if(combo.getValue()=='0'||combo.getValue()=='1'||combo.getValue()=='2')
								{
									filter += " and state='" + combo.getValue() + "'"; 
								}
								filter += " and pid="+CURRENTAPPID;
								hiddenDangerDS.baseParams.params = filter;
								hiddenDangerDS.load({params:{start: 0, limit: 15}})
						   }
				}
			});
	//导出页面方式选择下拉框
	var exportType = new Ext.form.ComboBox({
						id:'export_type_combo',
						readOnly : true,
						valueField : 'k',
						displayField : 'v',
						mode : 'local',
						triggerAction : 'all',
						store : [['0','导出当前页'],['1','导出所有页面']],
						lazyRender : true,
						allowBlank : true,
						listClass : 'x-combo-list-small',
						emptyText: '选择导出方式',
						value: '1',
						width : 100,
						listeners: {
							'select': function(combo){
								if(combo.getValue==0)
								{
									var start = hiddenDangerDS.lastOptions.params.start;
									var limit = hiddenDangerDS.lastOptions.params.limit;
								}
							} 
						}
			});
			
	//导出为excel文档按钮
	var exportExcelBtn = new Ext.Button({
			id : 'export',
			text : '导出数据',
			tooltip : '导出安全隐患到Excel',
			cls : 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/page_excel.png',
			handler : function() {
				exportDataFile();
			}
		});
	
	//从excel文件导入安全隐患, 必须选择某个检查批次之后该按钮才被激活
	var importExcelBtn = new Ext.Button({
			id : 'import',
			text : '导入数据',
			tooltip : '从excel文件导入安全隐患',
			cls : 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/page_excel.png',
			disabled: true,  //选择检查批次后被激活
			handler : function() {
				importDataFile();
			}
		});	
		
	hiddenDangerGrid = new Ext.grid.EditorGridTbarPanel({
		id: 'HD_Grid',
		height:240,
		tbar: [],
		region:'center',
        ds: hiddenDangerDS,						//数据源
        cm:hiddenDangerCm,
        sm:hiddenDangerSm,
        title: '所有发现隐患问题',				//面板标题
        border: false,				// 
        autoScroll: true,			//自动出现滚动条
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 5,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        enableHdMenu:false,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: hiddenDangerDS,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        addBtn : btnFlag, 
		saveBtn : userRoleType=='0'?false:true, 
		delBtn : btnFlag, 
		plant : hiddenDanger_Plant,
		plantInt : hiddenDanger_PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean2,
		business : "baseMgm",
		primaryKey : "uids",
		insertHandler: function(){
			var batRecord = inspectionBatGrid.getSelectionModel().getSelected();
			if(batRecord==null) {
				 Ext.Msg.alert('提示信息','请选择一个检验批次!');
				 return;
			}
			var batUids = batRecord.get('uids');
			this.plantInt.batUids = batUids;
			this.defaultInsertHandler();
		},
		saveHandler: function(){
			var curDate = new Date();
			var record = this.getSelectionModel().getSelected(); 
			//记录被修改后判断当前日期是否与记录日期相等,不相等就设置新的更新日期
			if(curDate.toLocaleString().substr(0,10) != record.get('gxsj').toLocaleString().substr(0,10)){
				record.set('gxsj', curDate);
			}
			this.defaultSaveHandler();
		},
		deleteHandler: function(){
			var record = this.getSelectionModel().getSelected();
			if(record == null) {
				 Ext.Msg.alert('提示信息','请选择一条安全隐患!');
				 return;
			}
			insUids = record.get('batUids');
			var zgState = record.get('state');
			var wcDate = record.get('overDate');
			if(zgState!='0' || wcDate!='')
			{
				Ext.Msg.alert('提示信息','该隐患问题已在整改中，不允许删除!');
				return;
			}
			this.defaultDeleteHandler();
		},
		listeners: {
			'rowclick':　function(){
				if(userRoleType=='1')
				{
					var record = inspectionBatSm.getSelected();
					if(record==undefined||record==null)
					{
						// do nothing '新增'按钮保持disable()状态
					}
					else
					{
						this.getTopToolbar().items.get('add').enable();
					}
					
					this.getTopToolbar().items.get('del').enable();
					this.getTopToolbar().items.get('save').enable();
				}
				else if(userRoleType=='2')
				{
					this.getTopToolbar().items.get('save').enable();
				}
			},		
			'aftersave': function(grid, idsOfInsert, idsOfUpdate){
				var insertUids = idsOfInsert.split(",");
				var updateUids = idsOfUpdate.split(",");
				var batUids = (idsOfInsert.length==0 ? (idsOfUpdate.length==0 ? [] : updateUids):
													 (idsOfUpdate.length==0 ? insertUids : insertUids.concat(updateUids)))
				DWREngine.setAsync(false);									 
					pcAqgkService.InspectionsInfoUpdate(batUids, null);  //更新本地数据库检验批次的信息
				DWREngine.setAsync(true);	
				if(userRoleType=='1')//二级公司发送到项目单位
				{   
					DWREngine.setAsync(false);
						pcAqgkService.excDataHDForSaveOrUpdate(batUids, CURRENTAPPID, USERBELONGUNITID);
					DWREngine.setAsync(true);
					
				}
				else if(userRoleType=='2')//项目单位发送到二级公司
				{  
					var unit2id = USERBELONGUNITID; //默认为新兴能源
					var sql = "select unitid from sgcc_ini_unit where unit_type_id='2' " +
										"connect by prior upunit=unitid start with unitid='" + CURRENTAPPID +"'";
					DWREngine.setAsync(false);					
					baseDao.getDataAutoCloseSes(sql, function(list){
						if(list.length>=0)
						{
							 unit2id = list[0];
						} 
						pcAqgkService.excDataHDForSaveOrUpdate(batUids, unit2id, CURRENTAPPID);	 
					})
					DWREngine.setAsync(true);
						
				}
				else
				{}// do nothing
				inspectionBatGrid.getStore().reload();
			},
			'afterdelete': function(grid,ids){
				DWREngine.setAsync(false)	
					pcAqgkService.InspectionsInfoUpdate(null,insUids);  //更新本地数据库检验批次的信息
					if(userRoleType=='1'){
						pcAqgkService.excDataHDForDelete(ids, insUids, CURRENTAPPID, USERBELONGUNITID);
					}
				DWREngine.setAsync(true)
				
				inspectionBatGrid.getStore().load();
			},
			'render': function(){
				this.getTopToolbar().add('&nbsp;&nbsp;隐患整改状态:&nbsp;&nbsp',stateCombo);
				if(userRoleType=='1')
				{
					this.getTopToolbar().add('->', btnAllBat,'|',importExcelBtn,'|',exportExcelBtn);
					this.getTopToolbar().items.get('add').disable();
					this.getTopToolbar().items.get('save').disable();
					this.getTopToolbar().items.get('del').disable();
				}
				else if(userRoleType=='2')
				{	
					this.getTopToolbar().add('->', btnAllBat,'|',exportExcelBtn);
					this.getTopToolbar().items.get('save').disable();
				}
				else
				{
					this.getTopToolbar().add('->', btnAllBat,'|',exportExcelBtn);
				}
			}
		}
	});
	
	var centerPanel = new Ext.Panel({
		border: false,
		region: 'center',
		layout: 'fit',
		items:[hiddenDangerGrid]
	})
	
//-------------------------------------------------------------------------------
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [northPanel,centerPanel]
	});
    
	
	function showAllFun(){
			stateCombo.setValue('all');
			
			inspectionBatSm.clearSelections();
			hiddenDangerSm.clearSelections();
			
			hiddenDangerGrid.setTitle('所有发现隐患问题');
			if(userRoleType=='1'){
				hiddenDangerGrid.getTopToolbar().items.get('add').disable();
				hiddenDangerGrid.getTopToolbar().items.get('save').disable();
				hiddenDangerGrid.getTopToolbar().items.get('del').disable();
				
				Ext.getCmp('import').disable();  //导入按钮不可用
			}
			hiddenDangerDS.baseParams.params = "pid="+CURRENTAPPID+" order by state, gxsj desc, uids";
			hiddenDangerDS.load({params:{start: 0, limit: 15}});
	}
	
	//导出为excel文档方法
	function exportDataFile() {
		//rec判断是导出所有批次还是导出某个批次下的安全隐患信息
		var rec = inspectionBatGrid.getSelectionModel().getSelected();
		var openUrl = CONTEXT_PATH + "/servlet/AqgkServlet?ac=exportData&businessType=HiddenDangerInfo" + 
					  "&pid="+CURRENTAPPID + "&state="+stateCombo.getValue();
		if(exportType.getValue()==0)
		{
			var start = hiddenDangerDS.lastOptions.params.start;
			var limit = hiddenDangerDS.lastOptions.params.limit;
			openUrl += "&start=" + start +"&limit="+limit;
		}
		if(!(rec==undefined)){
			openUrl += "&batUids="+rec.get('uids');
			document.all.formAc.action = openUrl;       
			document.all.formAc.submit();
		}
		else
		{
			 Ext.Msg.alert('提示信息','请选中一个检验批次!');
		}
	}
	
	//从excel文档导入安全隐患的方法
	function importDataFile() {
		var allowedDocTypes = "xls,xlsx";
		var batUids = inspectionBatGrid.getSelectionModel().getSelected().get('uids');
		var impUrl = CONTEXT_PATH + "/servlet/AqgkServlet?ac=importData&pid=" + CURRENTAPPID + "&batUids=" + batUids
		var uploadForm = new Ext.form.FormPanel({
			baseCls:'x-plain',
			labelWidth:80,
			url:impUrl,
			fileUpload:true,
			defaultType:'textfield',
			items:[{
				xtype:'textfield',
				fieldLabel:'请选择文件',
				name:'filename1',
				inputType:'file',
				anchor:'90%'
			}]
		});

		var uploadWin=new Ext.Window({
			title:'上传',
			width:450,
			height:120,
			minWidth:300,
			minHeight:100,
			layout:'fit',
			plain:true,
			bodyStyle:'padding:5px;',
			buttonAlign:'center',
			items:uploadForm,
			buttons:[{
				text:'上传',
				handler:function(){
					var filename=uploadForm.form.findField("filename1").getValue()
					if(filename!=""){
						var fileExt=filename.substring(filename.lastIndexOf(".")+1,filename.length).toLowerCase();
						if(allowedDocTypes.indexOf(fileExt)==-1){
							Ext.MessageBox.alert("提示","请选择Excel文档！");
							return;
						}else{
							uploadWin.hide();
							if(uploadForm.form.isValid()){
								uploadForm.getForm().submit({
									method:'POST',
									params:{
										ac:'importData'
									},
									success:function(form,action){
										DWREngine.setAsync(false);
										pcAqgkService.updateInspectionSingle(batUids);//更新本地信息
										pcAqgkService.exchangeDateForImport(batUids, CURRENTAPPID, USERBELONGUNITID);//数据交互
										DWREngine.setAsync(true);
										Ext.Msg.show({
											title : '导入成功',
											msg : "报表数据导入成功！",
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.INFO
										});
										inspectionBatDs.reload();
										hiddenDangerDS.reload();
									},
									failure:function(form,action){
										Ext.Msg.show({
											title : '导入失败',
											msg : "报表数据导入错误！",
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.ERROR
										});
									}
								});
							}
						}
					}
				}
			}, {
				text:'关闭',
				handler:function(){uploadWin.hide();}
			}]
		});
		uploadWin.show();
	}
	
	//上级反馈信息编辑窗口
	editWindow=Ext.extend(Ext.Window ,{
		title:"反馈信息",
		width:380,
		height:232,
		layout:"border",
		modal : true,
		initComponent: function(){
			this.items=[{
				region:"center",
				xtype:"textarea",
				border:false,
				hideBorders :false,
				bodyBorder  :false,
				maxLength : 400,
				value:this.value
			},{
				region:"south",
				border:false,
				hideBorders :false,
				frame:false,
				plain:true,
				bodyBorder :true,
				bodyStyle:'background-color:#EBEBEB;color:green;'
			}
		];
		this.tpl = new Ext.XTemplate(
		    "<div style='float:right;padding-right:20px;'>",
		    "可以输入200汉字  ，",
		    "剩余字数：{num}{warn}",
		    '</div>'
		);
		this.buttons = [{
				text:'确定',
				scope:this,
				handler:function(){
					var overView = this.items.get(0).getValue();
					
					if(overView.length>200){
						Ext.example.msg('提示','退回原因超过200汉字');
						return;
					}else if(overView==""){
						Ext.example.msg('提示','请先输入文件概述');
						return;
					}
					
					var record = hiddenDangerGrid.getSelectionModel().getSelected();
					record.set('feedBack', overView);
					this.hide();
				}
			},{
				text:'取消',
				scope:this,
				handler:function(){
					this.items.get(0).setValue("");
					this.hide();
				}
		}]
		
		editWindow.superclass.initComponent.call(this);
	},
	listeners:{
		render:function(win){
			win.items.get(0).on('render',function(cmp){
				cmp.el.on("keyup", this.displayInfo,this);
				cmp.el.dom.style.fontSize="14px";
				cmp.el.dom.style.lineHeight= "15pt";
				cmp.el.dom.style.letterSpacing = "1pt";
			},this)	
		},
		show:function(){
				this.displayInfo();
			}
	},
	displayInfo:function(){
			var txt = this.items.get(0);
			var info = this.items.get(1);
			var data = {
				num:(400-bytesOfString(txt.getValue())<0)?0:(Math.floor((parseInt(400-bytesOfString(txt.getValue()))/2))),
				warn:(400-bytesOfString(txt.getValue())<0)?("，<font color=red>超出"+(Math.ceil((parseInt(400-bytesOfString(txt.getValue()))/2))-100)+"个字</font>"):""
			};
			this.tpl.overwrite(info.body, data);
			},
	buttonAlign:'center'
	})
	
	
	//上级反馈信息查询窗口
	queryWindow=Ext.extend(Ext.Window ,{
		title:"反馈信息",
		width:380,
		height:232,
		layout:"border",
		modal : true,
		initComponent: function(){
			this.items=[{
				region:"center",
				xtype:"textarea",
				border:false,
				hideBorders :false,
				bodyBorder  :false,
				maxLength : 400,
				value:this.value
			}];
		queryWindow.superclass.initComponent.call(this);
	},
	listeners:{
		render:function(win){
			win.items.get(0).on('render',function(cmp){
				cmp.el.on("keyup", this.displayInfo,this);
				cmp.el.dom.style.fontSize="14px";
				cmp.el.dom.style.lineHeight= "15pt";
				cmp.el.dom.style.letterSpacing = "1pt";
			},this)	
		}	
	},
	displayInfo: function() {
		var txt = this.items.get(0);
	}
	})
	
});//--EOF Ext.onReady

function formatDate(value) {
		return value ? value.dateFormat('Y-m-d'):null;
} 		           	

function stateShow(value, meta, record){
	    if(value=='0')
	    	return '未整改'
	    else if(value=='1')
	    	return '长期坚持'
	    else
	    	return '已整改'
}

function caculateHandler(name, r, rs){
	var v=0;
	for(var i=0;i<rs.length;i++){
		var count = rs[i].get(name);
		v += parseInt(count);
	}
	return (v.toString().fontsize(2))
}

function SumRenderFun(v){
	if(v==undefined||v==null)
		return '0'.fontsize(2);
	else
		return v.toString().fontsize(2);
}

function tipRenderFun(value){
	return "<a title="+value+">"+value+"</a>";
}

//显示上级单位反馈信息
function showOverview(v)
{		
	if(userRoleType=='1') {
		var win = new editWindow({value:v});
	} else {
		var win = new queryWindow({value:v});
	}
	win.show();
}

//判断字符串占用多少字节数的方法
function bytesOfString(str)
{
	var bytesCount = 0;
	if(null==str||str.length==0)
	{
		return 0;
	}
	
	for(var i=0; i<str.length; i++)
	{
		var c = str.charAt(i);
		if (/^[\u0000-\u00ff]$/.test(c))   //
		{
			//非双字节的编码字节数只+1
			bytesCount += 1;
		}
		else
		{   
			//双字节的编码(比如汉字)字节数+2
			bytesCount += 2;
		}
	}
	return bytesCount;
}

//判断一个检验批次是否可以被删除掉,接收参数为检验批次主键
function isBatDeleteable(batUids) {
	var flag = false;
	var sql = "select count(*) from pc_aqgk_hiddendanger_info where pid='" + CURRENTAPPID 
	  + "' and bat_uids='"+batUids+"' and (state<>'0' or over_date is not null)";
	DWREngine.setAsync(false);          
		baseDao.getDataAutoCloseSes(sql, function(count){
			if(count==0 || count=='0')
			{
				flag = true;
			}
		})
	DWREngine.setAsync(true);
	return flag;
}
