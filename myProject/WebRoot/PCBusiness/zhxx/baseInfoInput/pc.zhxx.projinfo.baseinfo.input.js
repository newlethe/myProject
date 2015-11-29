var bean = "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo"
var bean2="com.sgepit.frame.sysman.hbm.RockUser"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var businessType="PCZhxxPrjAffix"
var grid=null;

//var _reg=/,/g    //正则表达式
//var sqlPid=USERPIDS.replace(_reg,"','");
//	sqlPid="('"+sqlPid+"')";
var array_buildNature=new Array();
var array_industryType=new Array();
var array_prjType=new Array();
//---------页面权限判断----------
var editAble=null;
if(ModuleLVL<3){
	editAble=true;
}else{
	editAble=false;
}
//---------页面权限判断----------	
	
	
Ext.onReady(function() {
	
	DWREngine.setAsync(false);  
	DWREngine.beginBatch(); 
	
		var _sqlPid="('";
		systemMgm.getPidsByUnitid(USERBELONGUNITID,function(list){
			for(var i = 0;i<list.length-1;i++){
				_sqlPid+=list[i].unitid+"','";
			}
			_sqlPid+=list[list.length-1].unitid+"')";
		});
	
	appMgm.getCodeValue('建设性质',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_buildNature.push(temp);			
		}
    }); 
	appMgm.getCodeValue('产业类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_industryType.push(temp);			
		}
    });  
	appMgm.getCodeValue('项目类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_prjType.push(temp);			
		}
    }); 
	
	DWREngine.endBatch();
  	DWREngine.setAsync(true);
/**
 * 1. 创建选择模式
 */
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	
/**
 * 2. 创建列模型
 */
	
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
		'industry_type' : {
			name : 'industryType',
			fieldLabel : '产业类型',
			anchor : '95%'
		},
		'build_nature' : {
			name : 'buildNature',
			fieldLabel : '建设性质',
			anchor : '95%'
		},
		'prj_stage' : {
			name : 'prjStage',
			fieldLabel : '项目阶段',
			anchor : '95%'
		},
		'prj_type' : {
			name : 'prjType',
			fieldLabel : '项目类型',
			anchor : '95%'
		},
		'prj_name' : {
			name : 'prjName',
			fieldLabel : '项目名称',
			anchor : '95%'
		},
		'prj_respond' : {
			name : 'prjRespond',
			fieldLabel : '项目负责人',
			anchor : '95%'
		},
		'invest_scale' : {
			name : 'investScale',
			fieldLabel : '投资规模',
			anchor : '95%'
		},
		'build_limit' : {
			name : 'buildLimit',
			fieldLabel : '建设年限',
			anchor : '95%'
		},
		'fund_src' : {
			name : 'fundSrc',
			fieldLabel : '资金来源',
			anchor : '95%'
		},
		'prj_address' : {
			name : 'prjAddress',
			fieldLabel : '项目地址',
			anchor : '95%'
		},
		'prj_summary' : {
			name : 'prjSummary',
			fieldLabel : '项目概述',
			anchor : '95%'
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注',
			anchor : '95%'
		},
		'build_start' : {
			name : 'buildStart',
			fieldLabel : '开建日期',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'build_end' : {
			name : 'buildEnd',
			fieldLabel : '结束日期',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'memo_c1' : {
			name : 'memoC1',
			fieldLabel : '备用字段1',
			anchor : '95%'
		},
		'memo_c2' : {
			name : 'memoC2',
			fieldLabel : '备用字段2',
			anchor : '95%'
		},
		'memo_c3' : {
			name : 'memoC3',
			fieldLabel : '备用字段3',
			anchor : '95%'
		},
		'memo_c4' : {
			name : 'memoC4',
			fieldLabel : '备用字段4',
			anchor : '95%'
		},
		'prj_intro':{
			name : 'prj_intro',
			fieldLabel:'项目简介',
			anchor : '95%'
		},
		'prj_perf':{
			name: 'prj_perf',
			fieldLabel:'项目执行情况',
			anchor : '95%'
		}
		
	}

	var cm = new Ext.grid.ColumnModel([ // 创建列模型
			sm, 
			{
				id : 'prj_name',
				type : 'string',
				header : fc['prj_name'].fieldLabel,
				width:150,
				dataIndex : fc['prj_name'].name
			}, {
				id : 'industry_type',
				type : 'string',
				align:'center',
				width:60,
				header : fc['industry_type'].fieldLabel,
				dataIndex : fc['industry_type'].name,
				renderer:function(k){
					for(var i = 0;i<array_industryType.length;i++){
						if(k == array_industryType[i][0]){
							return array_industryType[i][1];
						}
					}
				}
			}, {
				id : 'build_nature',
				type : 'string',
				align:'center',
				width:60,
				header : fc['build_nature'].fieldLabel,
				dataIndex : fc['build_nature'].name,
				renderer:function(k){
					for(var i = 0;i<array_buildNature.length;i++){
						if(k == array_buildNature[i][0]){
							return array_buildNature[i][1];
						}
					}
				}
			}, {
				id : 'invest_scale',
				type : 'string',
				header : fc['invest_scale'].fieldLabel,
				align:'right',
				dataIndex : fc['invest_scale'].name,
				renderer:function(v){
					return cnMoneyToPrec(v, 0);
				}
			}, {
				id : 'prj_type',
				type : 'string',
				header : fc['prj_type'].fieldLabel,
				align:'center',width:60,
				dataIndex : fc['prj_type'].name,
				renderer:function(k){
					for(var i = 0;i<array_prjType.length;i++){
						if(k == array_prjType[i][0]){
							return array_prjType[i][1];
						}
					}
				}
			}, {
				id : 'prj_respond',
				align:'center',width:70,
				type : 'string',
				header : fc['prj_respond'].fieldLabel,
				dataIndex : fc['prj_respond'].name
			}, {
				id : 'fund_src',
				type : 'string',
				align:'center',
				header : fc['fund_src'].fieldLabel,
				dataIndex : 'pid',
				renderer:function(v){return "<a href='javascript:foundSrcEditWindow(\""+v+"\")'>资金来源维护</a>"}
			}, {
				id : 'prj_intro',
				align:'center',
				type : 'string',width:70,
				header : fc['prj_intro'].fieldLabel,
				dataIndex : 'uids',
				renderer:function(v,m,r){
					return "<a href='javascript:uploadfile(\""+r.get('pid')+"\",\""+businessType+"\")'>附件</a>"
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
				name : 'industryType',
				type : 'string'
			}, {
				name : 'buildNature',
				type : 'string'
			}, {
				name : 'prjStage',
				type : 'string'
			}, {
				name : 'prjType',
				type : 'string'
			}, {
				name : 'prjName',
				type : 'string'
			}, {
				name : 'prjRespond',
				type : 'string'
			}, {
				name : 'investScale',
				type : 'string'
			}, {
				name : 'buildLimit',
				type : 'string'
			},{
				name : 'fundSrc',
				type : 'string'
			},{
				name : 'prjAddress',
				type : 'string'
			},{
				name : 'prjSummary',
				type : 'string'
			},{
				name : 'memo',
				type : 'string'
			},{
				name : 'buildStart',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'buildEnd',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'memoC1',
				type : 'string'
			},{
				name : 'memoC2',
				type : 'string'
			},{
				name : 'memoC3',
				type : 'string'
			},{
				name : 'memoC4',
				type : 'string'
			}];
/**
 * 创建数据源
 */
	var ds= new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : "pid in"+_sqlPid
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
		
	var btnAdd = new Ext.Button({
		id: 'add',
		text: '新增',
		hidden:!editAble,
		iconCls: 'add',
		handler: function(){
			var url = BASE_PATH+"PCBusiness/zhxx/baseInfoInput/pc.zhxx.projinfo.baseinfo.addOrUpdate.jsp?edit_add=true";
			window.location.href = url;
		}
	});
	var btnDel = new Ext.Button({
		id: 'mydel',
		text: '删除',
		hidden:!editAble,
		disabled:true,
		iconCls: 'remove',
		handler: delProjFn
	});
	var btnAlter = new Ext.Button({
		id: 'alter',
		text: '修改',
		hidden:!editAble,
		disabled:true,
		iconCls: 'option',
		handler:toEditHandler
	});
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt= {
				uids : '',
				pid : '',
				industryType : '',
				buildNature : '',
				prjStage : '',
				prjType : '',
				prjName : '',
				prjRespond : '',
				investScale : '',
				buildLimit : '',
				fundSrc : '',
				prjAddress : '',
				prjSummary : '',
				memo : '',
				buildStart : '',
				buildEnd : '',
				memoC1 : '',
				memoC2 : '',
				memoC3 : '',
				memoC4 : ''
			}
	
	grid = new Ext.grid.EditorGridTbarPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar : [btnAdd,'-',btnAlter,'-',btnDel,'->','单位：元'],
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
		addBtn : false, 
		saveBtn : false, 
		delBtn : false, 
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [grid]
	});
	
	
	sm.on('selectionchange', function(sm) { // grid 行选择事件
			var record = sm.getSelected();
			var tb = grid.getTopToolbar();
			if (record != null) {
				tb.items.get("mydel").enable();
				tb.items.get("alter").enable();	
			} else {
				tb.items.get("mydel").disable();
				tb.items.get("alter").disable();
			}
		});
	function delProjFn(){
		var record = grid.getSelectionModel().getSelected();
		if(record){
			var pid=record.get('pid');
			var flag=true;
			DWREngine.setAsync(false);
			baseDao.findByWhere2(bean2, "unitid='"+pid+"'",function(list){
				if(list.length>0){
					flag=false;
				}
			});
			if(flag){
				Ext.Msg.confirm('提示信息','删除后不可恢复，是否继续？',function(txt){
					if(txt=='yes'){
						var whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID='"+record.get('pid')+"'";
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
						var sql="delete from sgcc_ini_unit where unitid='"+pid+"'";
						baseDao.updateBySQL(sql);
						grid.doDelete(1,record.get(grid.primaryKey))
					}
				})
			}else{
				Ext.Msg.alert('提示信息','项目已启动，暂不能删除！')
			}
			DWREngine.setAsync(true);
		}	
	}

	function toEditHandler(){
        var record = grid.getSelectionModel().getSelected();
    	if(record){
    		switchoverProj(record.get('pid'), record.get('prjName'));//编辑前先切换项目
    		var url = BASE_PATH+"PCBusiness/zhxx/baseInfoInput/pc.zhxx.projinfo.baseinfo.addOrUpdate.jsp";
			window.location.href = url;
    	}
    }
});

function uploadfile(uids,biztype){
	var param = {
		businessId:uids,
		businessType:biztype,
		editable : "true"
	};
	showMultiFileWin(param);
}
//删除项目介绍附件数据交互
function deleteSuccess(fidArr){
	var pid = grid.getSelectionModel().getSelected().get('pid');
   	pcPrjService.fileDeleteDataEx(fidArr,pid,function(){
   	});
}
//上传项目介绍附件数据交互
function uploadSuccess(fileLsh, businessId, businessType, blobTable){
	var pid = grid.getSelectionModel().getSelected().get('pid');
   	pcPrjService.fileUploadDataEx(fileLsh, businessId, businessType, blobTable,pid,function(){
   	});
}

function foundSrcEditWindow(pid){
	var editWin;
	var array_fundSrc=new Array();
	var dsCombo_fundSrc=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});
	DWREngine.setAsync(false);  
	appMgm.getCodeValue('资金类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_fundSrc.push(temp);			
		}
    }); 
    DWREngine.setAsync(true);  
	dsCombo_fundSrc.loadData(array_fundSrc);
	if(!editWin){
//		formPanel = new Ext.form.FormPanel();
		var bean3="com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjFundsrc";
		var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
		});
		var cm = new Ext.grid.ColumnModel([		
	    	sm,{id:'uids',header: "主键",dataIndex: "uids",hidden: true,type:'string'
	        },{id:'pid',header: "项目编号",dataIndex: "pid",hidden: true,type:'string'
	        },{id:'srcType',header: "资金类型",dataIndex: "srcType",type:'string',
	        	renderer:function(k){
					for(var i = 0;i<array_fundSrc.length;i++){
						if(k == array_fundSrc[i][0]){
							return array_fundSrc[i][1];
						}
					}
				},
	        	editor:new Ext.form.ComboBox({
			        		name : 'srcType',
							fieldLabel : '资金类型',
							anchor : '95%',
							store:dsCombo_fundSrc,
				        	displayField:'v',
				       		valueField:'k',
				        	typeAhead: true,
				       		mode: 'local',
				        	lazyRender:true,
				        	triggerAction: 'all',
				        	emptyText:"",
				        	allowBlank:false,
				        	editable : false,
				       		selectOnFocus:true,
				       		listeners:{
				       			'expand':function(){
				       				var records=fundsrc_grid.getStore().getRange();
				       				  dsCombo_fundSrc.filterBy(funsrcTypeFilter);
				       				  function funsrcTypeFilter(record,id){
				       				  	for(var i=0; i<records.length; i++){
											if(record.get("k")==records[i].get("srcType")) return false;
										}
				       				  	return true;
				       				  } 
				       			}
				       		}
	        	})
	        	
	        },{id:'amount',header: "金额(元)",dataIndex: "amount",type:'string',align:'right',
	        	editor:new  Ext.form.NumberField({
	        		id:'amount',
					name : 'amount',
					fieldLabel : '金额',
					nanText:'请输入有效数字', 
//					maxValue:999999999,
//					validator:function(v){if(v>999999999)return false; return true;},
//					invalidText:'最大输入值为999,999,,999',
					anchor : '95%'
	        	}),renderer:function(v){return cnMoneyToPrec(v, 0);},summaryType:'custom',
					calculateFn:function(name,r,rs){
						var v=0;
						for(var i=0;i<rs.length;i++){
							var val = rs[i].get("amount");
							var conMoney = parseInt(v);
							if(!isNaN(parseInt(val))){
								v+=parseFloat(parseInt(val));
							}
						}
						return (v)
					}
	        },{id:'memo',header: "说明",dataIndex: "memo",type :'string',width:200,
	        	editor: new Ext.form.TextField()
	        }
	    ])
		var Columns = [{
				name : 'uids',
				type : 'string'
			},{
				name : 'pid',
				type : 'string'
			}, {
				name : 'srcType',
				type : 'string'
			}, {
				name : 'amount',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
		}];
		var ds= new Ext.data.Store({
			baseParams : {
				ac : 'list',
				bean : bean3,
				business : business,
				method : listMethod,
				params : "pid='"+pid+"'" 
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
		var Plant = Ext.data.Record.create(Columns);

		var PlantInt= {uids:'',
						pid:pid,
						srcType:'',
						amount:'',
						memo:''}
		var fundsrc_grid = new Ext.grid.EditorGridTbarPanel({
			store : ds,
			cm : cm,
			sm : sm,
			tbar : [],
			plugins: [new Ext.ux.grid.GridSummary()],				
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
			listeners:{
				'aftersave':function(grid, idsOfInsert, idsOfUpdate, primaryKey,  gridBean){
					var pid = grid.getSelectionModel().getSelected().get('pid');
					pcPrjService.sendFundsrcToJT(idsOfInsert,idsOfUpdate,pid,function(){})
				},
				'afterdelete':function( grid,ids,primaryKey,gridBean){
					var pid = grid.getSelectionModel().getSelected().get('pid');
					pcPrjService.sendFundsrcToJTDEL(ids,pid,function(){
					})
				}
			},
			saveHandler:function(){
				var rec = grid.getSelectionModel().getSelected();
				if(rec){
					var total = rec.get('investScale');//投资规模
					var v=0,rs=this.getStore();
					for(var i=0;i<rs.getCount();i++){
						var val = rs.getAt(i).get('amount');
						var conMoney = parseInt(v);
						if(!isNaN(parseInt(val))){
							v+=parseFloat(parseInt(val));
						}
					}
					if(v>total){
						Ext.example.msg('提示','资金来源总额超过投资规模！')
					}else{
						this.defaultSaveHandler();
					}
				}
			},
			plant : Plant,
			plantInt : PlantInt,
			servletUrl : MAIN_SERVLET,
			bean : bean3,
			business : business,
			primaryKey : primaryKey
		});
		ds.on("load",function(store,records){
			var flag = true;
			for(var j=0; j<array_fundSrc.length; j++){
				var flag2=true;
				for(var i=0; i<records.length; i++){
					if(array_fundSrc[j][0]==records[i].get("srcType")) flag2=false;
				}
				if(flag2){
					flag=false;
					break;
				}
			}
			if(flag){
				fundsrc_grid.getTopToolbar().items.get("add").disable();
			}else{
				fundsrc_grid.getTopToolbar().items.get("add").enable();
			}

		});
		eidtWin = new Ext.Window({
			title:"资金来源",			
			width:600,
			height:400,			
			buttonAlign:"center",
			plain:true,//颜色匹配
			collapsible:true,//折叠
			modal:true,//变灰
			draggable:false,//拖动
			layout:"fit",
			resizable:false,//尺寸变换
			items:[fundsrc_grid],
			buttons:[],
			listeners:{
				show:function(){
					fundsrc_grid.getStore().load();
				},
				beforeclose:function(){
					/*DWREngine.setAsync(false);  
					pcPrjService.checkFundsrcEqual(pid, function(result){
						var msg="资金来源-投资规模="+result+",不相等!";
						if(result!=0) alert(msg);
					})
					DWREngine.setAsync(true);  */
				}
			}
		});
	};
	eidtWin.show();
}