var bean = "com.sgepit.pcmis.zhxx.hbm.PcZhxxQianqPrjInfo"
var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit"
var primaryKey = "uids";
var ofw = "hidden";
//var oldPid=null;  //当是修改项目时，在判断pid唯一性时，要排除新pid与原pid相同的情况。

var array_buildNature=new Array();
var array_industryType=new Array();
var array_prjStage=new Array();
var array_prjType=new Array();
var array_guiMoDw = new Array();//建设规模单位
var appArr = new Array();//接入系统是否审核
var array_prjLevel = new Array(); //项目等级

//各种下拉框定义
	//建设性质
	var dsCombo_buildNature=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});
	//产业类型
	var dsCombo_industryType=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});	
	//项目进度
	var dsCombo_prjStage=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});
	//项目类型
	var dsCombo_prjType=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});
	
	//项目等级
	var dsCombo_prjLevel=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: ['','']
	});
	
	//建设规模单位
	var dsCombo_guiMoDw=new Ext.data.SimpleStore(
		{fields: ['k', 'v'],
		data:['','']
	});
	
//---------页面权限判断----------
if(ModuleLVL<3){
	editAble=true;
}else{
	editAble=false;
}
if(dydaView)editAble=false;
//---------页面权限判断----------
Ext.onReady(function(){
	Ext.QuickTips.init();
		
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
	appMgm.getCodeValue('项目阶段',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_prjStage.push(temp);			
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
	appMgm.getCodeValue('接入系统批复类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			appArr.push(temp);			
		}
    }); 
    appMgm.getCodeValue('建设规模单位',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_guiMoDw.push(temp);			
		}
    }); 
    appMgm.getCodeValue('项目级别',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_prjLevel.push(temp);			
		}
    });
	DWREngine.endBatch();
  	DWREngine.setAsync(true);
  	
	var appComStore = new Ext.data.SimpleStore({
    fields : ['k','v'],
    data : appArr
    })
    
  	dsCombo_buildNature.loadData(array_buildNature);
  	dsCombo_industryType.loadData(array_industryType);
  	dsCombo_prjStage.loadData(array_prjStage);
  	dsCombo_prjType.loadData(array_prjType);
  	dsCombo_guiMoDw.loadData(array_guiMoDw);//建设规模单位
  	dsCombo_prjLevel.loadData(array_prjLevel);
    
    var BUTTON_CONFIG = {
    	'BACK': {text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		},'SAVE': {
			id: 'save',
	        text: '保存',
	        disabled: false,
	        hidden:!editAble,
	        handler:formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        hidden:!editAble,
	        handler: function(){
	        	history.back();
	        }
	    },'PRJSWITCH': {
	    	id: 'switch',
	    	text: '项目转换',
	    	hidden: edit=='true'?false:true,
	        handler: function(){
	        	//先判断数据是否被更改, 如果被用户更改了提示用户先保存数据
				showDailog();
	        }
	    }
    };		
    
//    var fm = Ext.form;

	var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			id:'pid',
			name : 'pid',
			fieldLabel : '项目编码',
			readOnly :true,
			anchor : '95%',
			allowBlank:false,
			listeners:{
				
			}
		},
		'industryType' : {
			name : 'industryType',
			fieldLabel : '产业类型',
			readOnly :!editAble,
			anchor : '95%',
			store:dsCombo_industryType,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
        	selectOnFocus:true
		},
		'buildNature' : {
			name : 'buildNature',
			fieldLabel : '建设性质',
			readOnly :!editAble,
			anchor : '95%',
			store:dsCombo_buildNature,
        	displayField:'v',
       		valueField:'k',
        	typeAhead: true,
       		mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
       		selectOnFocus:true
		},
		'prjStage' : {
			name : 'prjStage',
			fieldLabel : '项目阶段',
			readOnly :!editAble,
			anchor : '95%',
			store:dsCombo_prjStage,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
        	selectOnFocus:true
		},
		'prjType' : {
			name : 'prjType',
			fieldLabel : '项目类型',
			readOnly :!editAble,
			anchor : '95%',
			store:dsCombo_prjType,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
        	selectOnFocus:true
		},		
		'prjLevel' : {
			name : 'prjLevel',
			fieldLabel : '项目级别',
			readOnly :!editAble,
			anchor : '95%',
			store:dsCombo_prjLevel,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
        	selectOnFocus:true
		},
		'prj_name' : {
			name : 'prjName',
			fieldLabel : '项目名称',
			readOnly :!editAble,
			allowBlank:false,
			anchor : '95%'
		},
		'prj_respond' : {
			name : 'prjRespond',
			fieldLabel : '项目负责人',
			readOnly :!editAble,
			anchor : '95%'
		},
		'invest_scale' : {
			id:'invest_scale',
			name : 'investScale',
			fieldLabel : '投资规模(元)',
			readOnly :!editAble,
			nanText:'请输入有效数字', 
			msgTarget:'qtip', 
//			maxValue:999999999,
//			maxLength:9,
			anchor : '95%',
			align: 'right'
		},
		'build_limit' : {
			name : 'buildLimit',
			fieldLabel : '建设年限',
			readOnly :!editAble,
			anchor : '95%'
		},
		'fund_src' : {
			name : 'fundSrc',
			fieldLabel : '资金来源',
			readOnly :!editAble,
			anchor : '95%'
		},
		'prj_address' : {
			name : 'prjAddress',
			id : 'prjAddress',
			fieldLabel : '项目地址',
			readOnly :!editAble,
			anchor : '80%'
		},
		'guiMoDw' : {
			name : 'guiMoDw',
			fieldLabel : '规模单位',
			hideLabel :true,
			anchor : '98%',
			readOnly :!editAble,
			store:dsCombo_guiMoDw,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	emptyText:'请选择规模单位',
        	lazyRender:true,
        	triggerAction: 'all',
        	editable:false,
        	selectOnFocus:true
		},
		'prj_summary' : {
			name : 'prjSummary',
			fieldLabel : '项目概述',
			readOnly :!editAble,
			anchor : '95%'
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注',
			readOnly :!editAble,
			height:100,
			anchor : '95%'
		},
		'build_start' : {
			name : 'buildStart',
			fieldLabel : '开建日期',
			readOnly :!editAble,
			format : 'Y-m-d',
			anchor : '95%'
		},
		'build_end' : {
			name : 'buildEnd',
			fieldLabel : '结束日期',
			readOnly :!editAble,
			format : 'Y-m-d',
			anchor : '95%'
		},
		'memo_c1' : {
			name : 'memoC1',
			fieldLabel : '所属单位',
			editable : false,
			allowBlank: false,
			anchor : '95%'
		},
		'memo_c2' : {
			name : 'memoC2',
			id:'memoC2',
			fieldLabel : '建设规模',
			allowDecimals:false,
			readOnly :!editAble,
			anchor : '85%'
		},
		'memo_c3' : {
			name : 'memoC3',
			id : 'memoC3',
			fieldLabel : '项目地址-地级市县',
			anchor : '70%',
			readOnly :!editAble,
			hideLabel : true
		},
		'memo_c4' : {
			name : 'memoC4',
			id : 'memoC4',
			fieldLabel : '建设规模-容量',
			anchor : '100%',
			readOnly :!editAble,
			hideLabel : true
		},
		'prj_intro':{
			name : 'prj_intro',
			fieldLabel:'项目简介',
			anchor : '95%'
		},
		'backupC1':{
			name : 'backupC1',
			fieldLabel:'项目级别(关注度)',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',       //必须指定数据是local还是remote(默认值)
			triggerAction : 'all',
			store : dsCombo_prjLevel,
			lazyRender : true,
			allowBlank : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'backupC2':{
			name: 'backupC2',
			fieldLabel:'项目进展情况',
			anchor : '95%'
		},'isapproved':{
		    fieldLabel : '是否核准',
		    name : 'isapproved',
		    readOnly :!editAble,
			anchor : '95%',
			store:new Ext.data.SimpleStore({
			    fields:['k','v'],
			    data : [['是','是'],['否','否']]
			}),
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
        	selectOnFocus:true		   
		},'isapproval':{
		    fieldLabel : '接入系统是否批复',
		    name : 'isapproval',
			readOnly :!editAble,
			anchor : '95%',
			store:appComStore,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
        	selectOnFocus:true		
		},'totalinvestment':{
		   fieldLabel : '总投资(核准)(元)',
		   name : 'totalinvestment',
		   readOnly :!editAble,
		   anchor : '95%'
		},'jianCheng' : {
			name : 'jianCheng',
			fieldLabel : '简称',
			readOnly :!editAble,
			anchor : '100%'
		}
		
	}
	
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
				name : 'memoC1',//项目所属单位
				type : 'string'
			},{
				name : 'memoC2',   
				type : 'string'
			},{
				name : 'jianCheng',   
				type : 'string'
			},{
				name : 'memoC5',
				type : 'string'
			},{
				name : 'memoC4',
				type : 'string'
			},{
			    name : 'isapproved',
			    type : 'string'
			},{
			    name : 'isapproval',
			    type : 'string'
			},{
			    name : 'totalinvestment',
			    type : 'float'
			},{
				name: 'backupC1',
				type: 'string'
			},{
				name: 'backupC2',
				type: 'string'
			},{
				name: 'guiMoDw',
				type: 'string'
			}];
	
//	unitTree=_createUniteTree((editAble==false?Ext.apply(fc['memo_c1'],{onTriggerClick:Ext.emptyFn}):fc['memo_c1']));
	unitTree=_createUniteTree((editAble==false?Ext.apply(fc['memo_c1'],{onTriggerClick:Ext.emptyFn}):(edit=='true'?Ext.apply(fc['memo_c1'],{onTriggerClick:Ext.emptyFn}):fc['memo_c1'])));
	unitTree.on('select',function(combo){
			DWREngine.setAsync(false);
			var selectId = "Q-"+combo.getValue();
			pcPrjService.getPreUnumber(selectId,function(pid_value){
				formPanel.findById('pid').setValue(pid_value);
			});
			DWREngine.setAsync(false);
		
	});
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = new formRecord({
			uids : '',
			pid : '',
			industryType : '',
			buildNature : '',
			prjStage : 'QQ',
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
			memoC1 : USERBELONGUNITID,
			memoC2 : '',
			memoC3 : '',
			memoC4 : '',
			guiMoDw: '',
			isapproved : '否',
			isapproval : '',
			totalinvestment : ''
		});
	
//-----------------------------------------
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
		var bean3="com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjFundsrc";
		var fund_sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
		});
		var fund_cm = new Ext.grid.ColumnModel([		
	    	fund_sm,{id:'uids',header: "主键",dataIndex: "uids",hidden: true,type:'string'
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
				       				var records=grid.getStore().getRange();
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
	        	}),renderer:function(v){return cnMoneyToPrec(v, 0);}
	        },{id:'memo',header: "说明",dataIndex: "memo",type :'string',
	        	editor: new Ext.form.TextField()
	        }
	    ])
		var fund_Columns = [{
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
				business : "baseMgm",
				method : "findWhereOrderby",
				params : "pid='"+edit_pid+"'" 
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : 'uids'
					}, fund_Columns),
			remoteSort : true,
			pruneModifiedRecords : true
		});

		var PlantInt= {uids:'',
						pid:edit_pid,
						srcType:'',
						amount:'',
						memo:''
			};
			
		var grid = new Ext.grid.EditorGridTbarPanel({
			id:"grid",
			store : ds,
			cm : fund_cm,
			sm : fund_sm,
			//autoHeight:true,
			width:587,
			tbar : [],
			border : false,
			layout : 'fit',
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
						pcPrjService.sendFundsrcToJT(idsOfInsert,idsOfUpdate,edit_pid,function(){
						})
					},
					'afterdelete':function( grid,ids,primaryKey,gridBean){
						pcPrjService.sendFundsrcToJTDEL(ids,edit_pid,function(){
						})
					}
				},
			saveHandler:function(){
					var total = formPanel.findById("invest_scale").value;//投资规模
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
			},
			plantInt : PlantInt,
			servletUrl : MAIN_SERVLET,
			bean : bean3,
			business : "baseMgm",
			primaryKey :"uids"
		});
		ds.load();
		
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
				if(grid.getTopToolbar().items.get("add") !=undefined)
				grid.getTopToolbar().items.get("add").disable();
			}else{
				if(grid.getTopToolbar().items.get("add") !=undefined)
				grid.getTopToolbar().items.get("add").enable();
			}
		});
		
	var srcGrid=new Ext.Panel({
		title:"资金来源表",
		region : 'east',
		layout : 'fit',
		collapsible :true,
		collapsed : true,
		width:420,
		items:[grid]
	});
	
//-----------------------------------------	
	//定义formPanel为页面属性, 供子窗口调用
     formPanel = new Ext.FormPanel({
        id: 'form-panel',
        bodyStyle: 'padding:10px 10px 0px 10px;overflow-y:auto;overflow-x:'+ofw+';',
    	autoScroll:true,
    	plain:true,
    	baseCls:"x-plain",
    	labelAlign: 'left',
    	frame: false,
    	items: [{
    			xtype:'fieldset',
    			autoWidth:true,
    			autoHeight:true,
                border: false,
                width:600,
                layout: 'form',
                items:[{
                		layout:'form',width:620,baseCls:'x-plain',
                		items:new Ext.form.TextField(fc['prj_name'])
                	},
                	{
	                	layout:'column',
		                border: false,
		                frame:false,
		                plain:true,
		                baseCls:"x-plain",
	                	items:[{
		   					layout: 'form', width:300,
		   					baseCls:"x-plain",
		   					bodyStyle: 'border: 0px;',
		   					items:[
		   						unitTree,
		   						new Ext.form.TextField(fc['pid']),
		   						new Ext.form.TextField(fc['prj_respond']),
		   						new Ext.form.TextField(fc['build_limit']),
		   						new Ext.form.NumberField(fc['invest_scale']),
		   						new Ext.form.NumberField(fc['totalinvestment']),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['backupC1'],{onTriggerClick:Ext.emptyFn}):fc['backupC1'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['isapproved'],{onTriggerClick:Ext.emptyFn}):fc['isapproved']))
		   					]
	    				},{
		   					layout: 'form', width:300,
		   					baseCls:"x-plain",
		   					bodyStyle: 'border: 0px;',
		   					items:[
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['industryType'],{onTriggerClick:Ext.emptyFn}):fc['industryType'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['prjStage'],{onTriggerClick:Ext.emptyFn}):fc['prjStage'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['buildNature'],{onTriggerClick:Ext.emptyFn}):fc['buildNature'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['prjType'],{onTriggerClick:Ext.emptyFn}):fc['prjType'])),
		   						new Ext.form.DateField((editAble==false?Ext.apply(fc['build_start'],{onTriggerClick:Ext.emptyFn}):fc['build_start'])),
		   						new Ext.form.DateField((editAble==false?Ext.apply(fc['build_end'],{onTriggerClick:Ext.emptyFn}):fc['build_end'])),
		   						new Ext.form.TextField((editAble==false?Ext.apply(fc['backupC2'],{onTriggerClick:Ext.emptyFn}):fc['backupC2'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['isapproval'],{onTriggerClick:Ext.emptyFn}):fc['isapproval']))
		   					]
	    				}]
	                },{
						layout:'column',baseCls:"x-plain",
						bodyStyle: 'border: 0px;',
						items:[{
							layout:'form',baseCls:"x-plain",width:200,
							items:new Ext.form.NumberField(fc['memo_c2'])
						},{
							layout:'form',baseCls:"x-plain",width:80,
							items:new Ext.form.NumberField(fc['memo_c4'])
						},{
							layout:'form',baseCls:"x-plain",width:130,
							items:new Ext.form.ComboBox((editAble==false?Ext.apply(fc['guiMoDw'],{onTriggerClick:Ext.emptyFn}):fc['guiMoDw']))
						},{
							layout:'form',baseCls:"x-plain",labelWidth:40,width:180,
							items:new Ext.form.TextField(fc['jianCheng'])
						}]
					}
                ]
    		},{
    			xtype:'panel',
    			baseCls:"x-plain",
    			height:10
    		},{
    			xtype: 'fieldset',
    			layout: 'form',
    			width:620,
    			autoHeight:true,
                border:false, 
                cls:'x-plain',  
                items: [{
                		layout:'column',
						bodyStyle: 'border: 0px;',
						items:[
							{
								layout:'form',width:200,
								bodyStyle: 'border: 0px;',
								items:[new Ext.form.TextField(fc['prj_address'])]
							},
							{
								layout:'form',width:400,
								bodyStyle: 'border: 0px;',
								items:[new Ext.form.TextField(fc['memo_c3'])]
							}
						]
                	},
                	new Ext.form.TextArea(fc['prj_summary']),
                	new Ext.form.TextArea(fc['memo']),
                	new Ext.form.Hidden(fc['uids'])
				]
    		}
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET'],BUTTON_CONFIG['PRJSWITCH']]
    });
	
    var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar:dydaView==true?['->',BUTTON_CONFIG['BACK']]:[],
    	title: ['<font color=#15428b><b>&nbsp;项目基本信息</b></font>'],
    	items: [formPanel]
    });
    
    // 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
            layout: 'border',
            autoWidth:true,
            items: [contentPanel,srcGrid],
            listeners:{
	    		"beforerender":function(){
	    			if(edit||add)srcGrid.hide();
	    			if(dydaView)srcGrid.hide();
	    		}
	    	}
    });
    
    //点击"修改"按钮时加载的数据
    if(edit){
    	//修改页面显示"项目切换"按钮
	    DWREngine.setAsync(false);
		baseDao.findByWhere2(bean, "pid='"+prePid+"'",function(list){
			if(list.length>0){
				loadFormRecord = new formRecord(list[0]);
			}
		});
		
		unitId=loadFormRecord.get("memoC1");
		var unitText="";
		baseDao.findByWhere2(bean2, "unitid='"+unitId+"'",function(list){
			if(list.length>0){
				unitText=list[0].unitname;
				unitTree.setRawValue(unitText);
			}
		});
		unitTree.value=unitId;
		formPanel.getForm().loadRecord(loadFormRecord);
		
		DWREngine.setAsync(true);
	}
	
    //点击"新增"按钮时加载空白数据
	else if(add)   
	{
		formPanel.getForm().loadRecord(loadFormRecord);
	}
	
	var investEl = Ext.getCmp('memoC2').el;
	investEl.insertHtml("afterEnd", "&nbsp;台") 
	investEl = Ext.getCmp('memoC4').el;
	investEl.insertHtml("afterEnd", "&nbsp;&nbsp;MW") 
	investEl = Ext.getCmp('prjAddress').el;
	investEl.insertHtml("afterEnd", "&nbsp;省份") 
	investEl = Ext.getCmp('memoC3').el;
	investEl.insertHtml("afterEnd", "&nbsp;地级市县") 
	
	//保存
	function formSave(){
    	var form = formPanel.getForm();
    	var pid = form.findField('pid').getValue();
    	var prj_name = form.findField('prjName').getValue();
    	var   unitId = form.findField('memoC1').getValue();
    	if(pid==null || pid ==""){
    		alert("项目编码不能为空");
    	}else if(prj_name==null || prj_name ==""){
    		alert("项目名称不能为空");
    	}else if(unitId==null || unitId ==""){
    		alert("所属单位不能为空");
    	}else{
    		doFormSave();
    	}
	}

	function doFormSave(){
		//点击"保存"之后就返回到前面一个页面所以, 该方法只执行一次, 方法执行过程中"保存"按钮不可以使用
    	var form = formPanel.getForm()
    	var obj = form.getValues();
    	
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	if(form.findField('buildStart').getValue()=="")obj.buildStart=null;
    	if(form.findField('buildEnd').getValue()=="")obj.buildEnd=null;
    	DWREngine.setAsync(false);
    	Ext.getBody().mask();
			pcPrjService.addOrUpdatePre(obj, function(state){
	   			if ("1" == state){
	   				window.setTimeout('Ext.getBody().unmask()', 1500);
	   				window.setTimeout("Ext.example.msg('保存成功！', '您成功新增了一个项目！')",1600);
	   				window.setTimeout("history.back()",2000);
	   			}else if("0"==state){
	   				Ext.getBody().unmask();
	   				alert('编号已被使用, 请使用其他项目编号!');
	   				form.findField('pid').setValue('');
	   			}else if("2"==state){
	   				window.setTimeout('Ext.getBody().unmask()', 1500);
	   				window.setTimeout("Ext.example.msg('保存成功！', '您成功修改了一个项目！')",1600);
   					window.setTimeout("history.back()",2000);
	   			}
	   			else{
	   				Ext.getBody().unmask();
	   				Ext.Msg.show({
						title: '提示',
						msg: "操作失败!",
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
			});
   		DWREngine.setAsync(true);
    }
    
    //创建单位树函数
    function _createUniteTree(config){    
    	var loader = new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:USERBELONGUNITID,
				ac:"buildingUnitTree",
//				baseWhere:"unitTypeId in ('0','2','3','4')"
				baseWhere:"unitTypeId in ('2','3')"   
			}
		});
		var treeCombo = new Ext.ux.TreeCombo({
			resizable:true,
			id:'unitTree',
			loader:loader,
			root:  new Ext.tree.AsyncTreeNode({
			   text: USERBELONGUNITNAME,
			   id: USERBELONGUNITID,
		       expanded:true
		    })
		});
		Ext.apply(treeCombo,config);
		
		treeCombo.getTree().on('beforeload',function(node){
			loader.baseParams.parentId = node.id; 
		});
		
		return treeCombo;
	}    
	
		//显示项目切换对话框
	function showDailog()
	{
		var dailogURL = CONTEXT_PATH+ "/PCBusiness/zhxx/baseInfoInput/pc.zhxx.pre.projSwitch.jsp";
	    dailogWin = new Ext.Window({
			id: 'dailogWin',
			title: '项目转换',
			width: 450,
			height: 250,
			modal :true,
			resizable: false,
			html: '<iframe name="fileFrm" src="'+dailogURL+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
		});
		
		dailogWin.show()
	}
})