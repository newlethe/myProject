var bean = "com.sgepit.pcmis.zhxx.hbm.PcZhxxQianqPrjInfo"
var bean2 = "com.sgepit.frame.sysman.hbm.RockUser"

//判断前期项目是否有批文初始化以及批文办理
var bean3 = "com.sgepit.pcmis.approvl.hbm.PcPwSortTreeSub";
var bean4 = "com.sgepit.pcmis.approvl.hbm.PcPwApprovalMgm";

var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"

var prjLevel = [];
var businessType="PcZhxxQianqPrjAffix"
var grid=null;

var array_buildNature=new Array();
var array_industryType=new Array();
var array_prjType=new Array();
var array_prjLevel = new Array(); //项目级别

//---------页面权限判断----------
var editAble=null;
if(ModuleLVL<3){
	editAble=true;
}else{
	editAble=false;
}
//---------页面权限判断----------	

//根据用户所在公司级别生成数据源初始化参数
var dsIniParam = "";
DWREngine.setAsync(false);
	if (USERBELONGUNITTYPEID == "0") {// 目前登录用户是集团用户
		dsIniParam = "1=1";
	} else if (USERBELONGUNITTYPEID == "2") {// 目前登录用户是二级企业用户, 找到所有的二级和三级单位负责的前期项目
		dsIniParam = "memo_c1=" + USERBELONGUNITID;
		var _sql2 = "select unitid from sgcc_ini_unit where unit_type_id in ('2','3') connect by " +
							"prior unitid=upunit start with unitid='" + USERBELONGUNITID + "'"
		baseMgm.getData(_sql2, function(list) {
					var tempStr = "";
					for (var i = 0; i < list.length; i++) {
							tempStr += "'" + list[i] + "',";
						}
					dsIniParam = "memo_c1 in" + "(" + tempStr.substring(0, tempStr.length-1) + ")"
				});					
	} else if(USERBELONGUNITTYPEID == "3"){  //三级公司登陆用户, 找到所有的子三级公司
		var _sql3 = "select unitid from sgcc_ini_unit where unit_type_id='3' connect by " +
							"prior unitid=upunit start with unitid='" + USERBELONGUNITID + "'"
		baseMgm.getData(_sql3, function(list) {
					var tempStr = "";
					for (var i = 0; i < list.length; i++) {
							tempStr += "'" + list[i] + "',";
						}
					dsIniParam = "memo_c1 in" + "(" + tempStr.substring(0, tempStr.length-1) + ")"
				});
	} else{
		dsIniParam = "1=2";
	}
DWREngine.setAsync(true);
	
Ext.onReady(function() {
	
	DWREngine.setAsync(false);  
	DWREngine.beginBatch(); 
	
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
    appMgm.getCodeValue('项目级别',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_prjLevel.push(temp);			
		}
		array_prjLevel.push(['0','所有项目']);
    });
	DWREngine.endBatch();
  	DWREngine.setAsync(true);
  	
  	var comboStore = new Ext.data.SimpleStore({   
        fields: ['k', 'v'],   
        data: [['','']]   
    }); 
    comboStore.loadData(array_prjLevel);
//根据前期项目级别对前期项目进行过滤下拉框
  	var prjLevelCombo = new Ext.form.ComboBox({
						name : 'levelCombo',
						readOnly : true,
						valueField : 'k',
						displayField : 'v',
						mode : 'local',       //必须指定数据是local还是remote(默认值)
						triggerAction : 'all',
						store : comboStore,
						lazyRender : true,
						allowBlank : true,
						listClass : 'x-combo-list-small',
						value : '0',
						width : 200,
						listeners: {
							select: function(combo){
								var value = combo.getValue();
								if('0'==value)
								{
									grid.store.baseParams.params = dsIniParam;
								}
								else
								{
									grid.store.baseParams.params = dsIniParam + " and backupC1='" + value + "'";
								}
								grid.store.load({params:{start:0,limit:20}});
							}
						}
  	});
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
		'backupC1' : {
			name : 'backupC1',
			fieldLabel : '项目级别(关注程度)',
			anchor : '95%'
		},
		'backupC2' : {
			name : 'backupC2',
			fieldLabel : '项目进展情况',
			anchor : '95%'
		},
		'backupC3' : {
			name : 'backupC3',
			fieldLabel : '备用字段',
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
	
	// 创建列模型
	var cm = new Ext.grid.ColumnModel([ 
			sm, 
			{
				id : 'prj_name',
				type : 'string',
				header : fc['prj_name'].fieldLabel,
				width:150,
				dataIndex : fc['prj_name'].name
//				renderer: function(v,meta,record){
//					var colorValue = record.get('bak1');
//					switch(colorValue){
//						case '1':
//							return '<div style="background:#FF0000;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//						case '2':
//							return '<div style="background:#008000;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//						case "3":
//							return '<div style="background:#FFFF00;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//						case "4":
//							return '<div style="background:#000000;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//						case "5":
//						  	return '<div style="background:#3366FF;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//						case "6":
//						    return '<div style="background:#FF6600;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//						case "7":
//						    return '<div style="background:#F2F2F2;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//						default:
//							return '<div style="background:#FF0000;position:re-lative;height:20px;line-height:20px;">'+v+'</div>';
//							
//					}
//				}
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
				id : 'backupC1',
				align:'center',
				width:70,
				type : 'string',
				header : fc['backupC1'].fieldLabel,
				dataIndex : fc['backupC1'].name,
				renderer: function(v){
					for(i=0; i<array_prjLevel.length; i++)
					{
						if(v==array_prjLevel[i][0])
							return array_prjLevel[i][1];
					}
					return "";
				}
			},{
				id : 'backupC2',
				align:'left',
				width:70,
				type : 'string',
				header : fc['backupC2'].fieldLabel,
				dataIndex : fc['backupC2'].name
			},{
				id : 'fund_src',
				type : 'string',
				align:'center',
				hideLabel : true,
				hidden: true,
				header : fc['fund_src'].fieldLabel,
				dataIndex : 'pid',
				renderer:function(v){return "<a href='javascript:foundSrcEditWindow(\""+v+"\")'>资金来源维护</a>"}
			}, {
				id : 'prj_intro',
				align:'center',
				hidden: true,
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
				name : 'backupC1',
				type : 'string'
			},{
				name : 'backupC2',
				type : 'string'
			},{
				name : 'backupC3',
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
			params: dsIniParam
//			params : "pid in"+_sqlPid
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

	ds.load({params:{start:0,limit:20}});
		
	var btnAdd = new Ext.Button({
		id: 'add',
		text: '新增',
		hidden:!editAble,
		iconCls: 'add',
		handler: function(){
			var url = BASE_PATH+"PCBusiness/zhxx/baseInfoInput/pc.zhxx.pre.projMgm.baseinfo.addOrUpdate.jsp?add=true";
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
		handler: function(){
			var rec = grid.getSelectionModel().getSelected();
			var prePid = rec.get('pid');
			var url = BASE_PATH+"PCBusiness/zhxx/baseInfoInput/pc.zhxx.pre.projMgm.baseinfo.addOrUpdate.jsp?edit=true&prePid="+prePid;
			window.location.href = url;
		}
	});
	
	var Plant = Ext.data.Record.create(Columns);

	grid = new Ext.grid.EditorGridTbarPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar : [btnAdd,'-',btnAlter,'-',btnDel,
					'&nbsp;&nbsp;&nbsp','-','请选择项目级别:&nbsp;&nbsp',prjLevelCombo,
					'->','单位：元'],
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
			pageSize : 20,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		addBtn : false, 
		saveBtn : false, 
		delBtn : false,
		plant : Plant,
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
			var pid = record.get('pid');
			var uids = record.get('uids');
			//flag='1' 项目可以删除; flag = '0' 该项目已经有用户; flag = '-1' 该项目有初始化批文; flag='-2' 该项目有可以办理的批文
			var flag = '1';                      
			DWREngine.setAsync(false);
			baseDao.findByWhere2(bean2, "unitid='"+pid+"'",function(list){
				if(list.length>0){
					flag = '0';
				}
			});
			
			baseDao.findByWhere2(bean3, "pid='"+pid+"'",function(list){
				if(list.length>0){
					flag = '-1'
				}
			});
			
			baseDao.findByWhere2(bean4, "pid='"+pid+"'",function(list){
				if(list.length>0){
					flag = '-2'
				}
			});
			
			if(flag=='1')
			{
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
						var sql="delete from pc_zhxx_qianq_prj_info where uids='"+pid+"'";
						baseDao.updateBySQL(sql);
						grid.doDelete(1,record.get(grid.primaryKey))
					}
				})
			}
			else if(flag=='0')
			{
				Ext.Msg.alert('提示信息','项目已启动，暂不能删除！');
				return;
			}
			else if(flag=='-1')
			{
				Ext.Msg.alert('提示信息','项目有初始化批文，暂不能删除！');
				return;
			}
			else
			{
				Ext.Msg.alert('提示信息','项目有可办理批文，暂不能删除！');
				return;
			}
			
			DWREngine.setAsync(true);
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