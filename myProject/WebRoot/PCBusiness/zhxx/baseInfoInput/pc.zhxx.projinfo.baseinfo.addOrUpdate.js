var bean = "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo"
var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit"
var primaryKey = "uids";
var oldPid=null;  //当是修改项目时，在判断pid唯一性时，要排除新pid与原pid相同的情况。

var array_buildNature=new Array();
var array_industryType=new Array();
var array_prjStage=new Array();
var array_prjType=new Array();
var appArr = new Array();//接入系统是否审核
var array_guiMoDw = new Array();//建设规模单位
var array_fundSrc=new Array();//资金来源
var array_target =  new Array();//项目质量总目标

var dsCombo_buildNature=new Ext.data.SimpleStore({fields: ['k', 'v']});
var dsCombo_industryType=new Ext.data.SimpleStore({fields: ['k', 'v']});	
var dsCombo_prjStage=new Ext.data.SimpleStore({fields: ['k', 'v']});
var dsCombo_prjType=new Ext.data.SimpleStore({fields: ['k', 'v']});
var dsCombo_guiMoDw=new Ext.data.SimpleStore({fields: ['k', 'v']});
var appComStore = new Ext.data.SimpleStore({fields : ['k','v']});
var dsCombo_fundSrc = new Ext.data.SimpleStore({fields : ['k','v']});//资金来源
var choose_Target = new Ext.data.SimpleStore({fields : ['k','v']});//项目质量总目标
//---------页面权限判断----------
editAble = dydaView?false:((ModuleLVL<3)?true:false);
//---------页面权限判断----------
Ext.override(Ext.form.Field,{
	onFocus : function(){
        this.addClass('form-field');
        if(!Ext.isOpera && this.focusClass){ // don't touch in Opera
            this.el.addClass(this.focusClass);
        }
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    },
    onBlur : function(){
    	this.removeClass('form-field');
        this.beforeBlur();
        if(!Ext.isOpera && this.focusClass){ // don't touch in Opera
            this.el.removeClass(this.focusClass);
        }
        this.hasFocus = false;
        if(this.validationEvent !== false && this.validateOnBlur && this.validationEvent != "blur"){
            this.validate();
        }
        var v = this.getValue();
        if(String(v) !== String(this.startValue)){
            this.fireEvent('change', this, v, this.startValue);
        }
        this.fireEvent("blur", this);
    },
    setValue : function(v){
        this.value = v;
        if(this.rendered){
	        this.el.dom.setAttribute("title",this.value||"");
            this.el.dom.value = (v === null || v === undefined ? '' : v);
            this.validate();
        }
    }
})
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
    appMgm.getCodeValue('资金类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_fundSrc.push(temp);			
		}
    });
    appMgm.getCodeValue('项目质量总目标',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_target.push(temp);			
		}
    }); 
	DWREngine.endBatch();
  	DWREngine.setAsync(true);

  	dsCombo_buildNature.loadData(array_buildNature);//建设性质
  	dsCombo_industryType.loadData(array_industryType);//产业类型
  	dsCombo_prjStage.loadData(array_prjStage);//项目阶段
  	dsCombo_prjType.loadData(array_prjType);//项目类型
  	dsCombo_guiMoDw.loadData(array_guiMoDw);//建设规模单位
  	dsCombo_fundSrc.loadData(array_fundSrc);//资金来源
  	appComStore.loadData(appArr);//接入系统是否批复
  	choose_Target.loadData(array_target);//项目质量总目标
    
    var BUTTON_CONFIG = {
    	'BACK': {text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		},'SAVE': {
			id: 'save',
	        text: '保存',
	        hidden:!editAble,
	        handler:formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        hidden:!editAble,
	        handler: function(){
	        	history.back();
	        }
	    }
    };		
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
				"change":function(){
					value=this.getValue();
					var sign=true;
					if(oldPid==value) sign=false;
					if(value==null || value==""){
						Ext.example.msg('提示',"项目编码不能为空！");
					} else {
						if (sign) {
							DWREngine.setAsync(false);
							pcPrjService.isUnique(value, function(
									state) {
								if ("1" == state) {
									Ext.example.msg('提示',"该项目编码已被使用，请重新编码！");
								}
							});
							DWREngine.setAsync(true);
						}
					}	
				}
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
        	editable:false,
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
        	editable:false,
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
        	editable:false,
        	selectOnFocus:true
		},
		'prjType' : {
			name : 'prjType',
			fieldLabel : '项目类型',
			readOnly :!editAble,
			allowBlank:false,
			anchor : '95%',
			store:dsCombo_prjType,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	editable:false,
        	selectOnFocus:true
		},
		'prj_name' : {
			name : 'prjName',
			fieldLabel : '项目名称',
			readOnly :!editAble,
			allowBlank:false,
			width : 480
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
			anchor : '95%'
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
		'prj_summary' : {
			name : 'prjSummary',
			fieldLabel : '项目概述',
			readOnly :!editAble,
			height:50,
			anchor : '95%'
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注',
			readOnly :!editAble,
			height:60,
			anchor : '95%'
		},
		'build_start' : {
			name : 'buildStart',
			fieldLabel : '开建日期',
			readOnly :true,
			editable:false,
			format : 'Y-m-d',
			anchor : '95%'
		},
		'build_end' : {
			name : 'buildEnd',
			fieldLabel : '结束日期',
			readOnly :true,
			format : 'Y-m-d',
			anchor : '95%'
		},
		'memo_c1' : {
			name : 'memoC1',
			fieldLabel : '所属单位',
			editable :false,
			allowBlank:false,
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
			fieldLabel : '地级市县',
			anchor : '85%',
			readOnly :!editAble,
			hideLabel : true
		},
		'memoC4' : {
			name : 'memoC4',
			id : 'memoC4',
			fieldLabel : '建设规模-容量',
			anchor:'100%',
			hideLabel :true,
			readOnly :!editAble
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
		'prj_intro':{
			name : 'prj_intro',
			fieldLabel:'项目简介',
			anchor : '95%'
		},
		'prj_perf':{
			name: 'prj_perf',
			fieldLabel:'项目执行情况',
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
        	editable:false,
        	triggerAction: 'all',
        	selectOnFocus:true		   
		},'isapproval':{
		    fieldLabel : '接入系统批复',
		    name : 'isapproval',
			readOnly :!editAble,
			anchor : '95%',
			store:appComStore,
        	displayField:'v',
        	valueField:'k',
        	typeAhead: true,
        	mode: 'local',
        	lazyRender:true,
        	editable:false,
        	triggerAction: 'all',
        	selectOnFocus:true		
		},'totalinvestment':{
		   fieldLabel : '总投资(核准)(元)',
		   name : 'totalinvestment',
		   readOnly :!editAble,
		   anchor : '95%'
		},
		'jianCheng' : {
			name : 'jianCheng',
			fieldLabel : '项目缩写',
			readOnly :!editAble,
			anchor : '95%'
		},
		'backupC1' : {
			name : 'backupC1',
			fieldLabel : '项目简称',
			readOnly :!editAble,
			anchor : '95%'
		},
		'prjQualityTarget' : {
			name : 'prjQualityTarget',
			fieldLabel : '项目质量总目标',
			readOnly :!editAble,
			anchor : '95%'
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
				name : 'guiMoDw',
				type : 'string'
			},{
				name : 'jianCheng',
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
				name : 'prjQualityTarget',
				type : 'string'
			}];
	
	unitTree=_createUniteTree((editAble==false?Ext.apply(fc['memo_c1'],{onTriggerClick:Ext.emptyFn}):fc['memo_c1']));
	unitTree.on('select',function(combo){
		if(edit_add){
			DWREngine.setAsync(false);
			pcPrjService.getUnumber(combo.getValue(),function(pid_value){
				formPanel.findById('pid').setValue(pid_value);
			});
			DWREngine.setAsync(false);
		}
		
	});
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = new formRecord({
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
			memoC4 : '',
			isapproved : '否',
			isapproval : '',
			guiMoDw : '',
			totalinvestment : '',
			jianCheng:'',
			backupC1:'',
			backupC2:'',
			backupC3:'',
			prjQualityTarget : ''
		});
	
//-----------------------------------------
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
//					maxValue:999999999999,
//					validator:function(v){if(v>999999999999)return false; return true;},
//					invalidText:'最大输入值为999,999,999,999',
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
		var Plant = Ext.data.Record.create(fund_Columns);

		var PlantInt= {uids:'',
						pid:edit_pid,
						srcType:'',
						amount:'',
						memo:''}
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
//							alert("hhh");
						})
					},
					'afterdelete':function( grid,ids,primaryKey,gridBean){
						pcPrjService.sendFundsrcToJTDEL(ids,edit_pid,function(){
//							alert("delete");
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
			plant : Plant,
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
		split:true,
		width:420,
		items:[grid]
	});
	var ofw = "hidden";
	try{
		if(screen.availWidth<=1024)
			ofw = "auto";
	}catch(ex){
		ofw = "auto";
	}
	
//项目质量总目标
    var  chooseTarget = new Ext.form.MultiSelect({
         id:   'prjQualityTarget',
         width:  490,
         store : choose_Target,
         fieldLabel:'项目质量总目标',
         readOnly : true,
         displayField:'v',
         separator : '、',
         valueField:'k',
         allowBlank : false,
         emptyText: '',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	r.set(this.checkField, !r.get(this.checkField))
				chooseTarget.setValue(this.getCheckedValue());
				chooseTarget.setValue(this.getCheckedValue());
		}
  })
//-----------------------------------------		
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        bodyStyle: 'padding:10px 10px 0px 10px;overflow-y:auto;overflow-x:'+ofw+';',
    	plain:true,
    	baseCls:"x-plain",
    	labelAlign: 'left',
    	items: [{
    			autoWidth:true,
    			autoHeight:true,
                layout: 'form',
                frame:false,
                plain:true,
                baseCls:"x-plain",
                items:[{
                		layout:'form',width:590,baseCls:'x-plain',
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
		   					items:[
		   						new Ext.form.TextField(fc['backupC1']),
		   						unitTree,
		   						new Ext.form.TextField(fc['pid']),
		   						new Ext.form.TextField(fc['prj_respond']),
		   						new Ext.form.TextField(fc['build_limit']),
		   						new Ext.form.NumberField(fc['invest_scale']),
		   						new Ext.form.NumberField(fc['totalinvestment']),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['isapproved'],{onTriggerClick:Ext.emptyFn}):fc['isapproved']))
		   					]
	    				},{
		   					layout: 'form', width:300,
		   					bodyStyle: 'border: 0px;',
		   					items:[
		   						new Ext.form.TextField(fc['jianCheng']),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['industryType'],{onTriggerClick:Ext.emptyFn}):fc['industryType'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['prjStage'],{onTriggerClick:Ext.emptyFn}):fc['prjStage'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['buildNature'],{onTriggerClick:Ext.emptyFn}):fc['buildNature'])),
		   						new Ext.form.ComboBox((editAble==false?Ext.apply(fc['prjType'],{onTriggerClick:Ext.emptyFn}):fc['prjType'])),
		   						new Ext.form.DateField((editAble==false?Ext.apply(fc['build_start'],{onTriggerClick:Ext.emptyFn}):fc['build_start'])),
		   						new Ext.form.DateField((editAble==false?Ext.apply(fc['build_end'],{onTriggerClick:Ext.emptyFn}):fc['build_end'])),
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
							items:new Ext.form.NumberField(fc['memoC4'])
						},{
							layout:'form',baseCls:"x-plain",width:130,
							items:new Ext.form.ComboBox((editAble==false?Ext.apply(fc['guiMoDw'],{onTriggerClick:Ext.emptyFn}):fc['guiMoDw']))
						}]
					}
                ]
    		},{
    			xtype:'panel',
    			baseCls:"x-plain",
    			height:10
    		},{
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
                	chooseTarget,
                	new Ext.form.TextArea(fc['memo']),
                	new Ext.form.Hidden(fc['uids'])
				]
    		}
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
    var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar:dydaView==true?null:['->',BUTTON_CONFIG['BACK']],
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
	    			if(edit_add)srcGrid.hide();
	    			if(dydaView)srcGrid.hide();
	    		}
	    	}
    });
    if(!edit_add){
	    DWREngine.setAsync(false);
		baseDao.findByWhere2(bean, "pid='"+edit_pid+"'",function(list){
			if(list.length>0){
				loadFormRecord = new formRecord(list[0]);
			}
		});
		oldPid=loadFormRecord.get("pid");
		
		unitId=loadFormRecord.get("memoC1");
		var unitText="";
		baseDao.findByWhere2(bean2, "unitid='"+unitId+"'",function(list){
			if(list.length>0){
				unitText=list[0].unitname;
				unitTree.setRawValue(unitText);
			}
		});
		unitTree.value=unitId;
		
		DWREngine.setAsync(true);
	}
    // 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);
	chooseTarget.validate();
	
	var investEl = Ext.getCmp('memoC2').el;
	investEl.insertHtml("afterEnd", "&nbsp;&nbsp;X&nbsp;")
	investEl = Ext.getCmp('prjAddress').el;
	investEl.insertHtml("afterEnd", "&nbsp;省") 
	investEl = Ext.getCmp('memoC3').el;
	investEl.insertHtml("afterEnd", "&nbsp;地级市县") 
	
	//保存
	function formSave(){
    	var form = formPanel.getForm();
    	var pid = form.findField('pid').getValue();
    	var prj_name=form.findField('prjName').getValue();
    	var memo_c1=form.findField('memoC1').getValue();
    	var prjType = form.findField('prjType').getValue();
    	if(pid==null || pid ==""){
    		Ext.example.msg("提示","项目编码不能为空");
    	}else if(prj_name==null || prj_name ==""){
    		Ext.example.msg("提示","项目名称不能为空");
    	}else if(memo_c1==null || memo_c1 ==""){
    		Ext.example.msg("提示","所属单位不能为空");
    	}else if(prjType==null || prjType ==""){
    		Ext.example.msg("提示","项目类型不能为空");
    	}else{
    		doFormSave();
    	}
	}

	function doFormSave(dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues();
        var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据保存中，请稍等'});	
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	obj.buildStart= form.findField('buildStart').getValue();
    	obj.buildEnd= form.findField('buildEnd').getValue();
    	if(form.findField('buildStart').getValue()=="")obj.buildStart=null;
    	if(form.findField('buildEnd').getValue()=="")obj.buildEnd=null;
    	if (obj.uids == '' || obj.uids == null){
    		myMask.show();
	   		pcPrjService.addOrUpdate(obj, function(state){
	   			myMask.hide();
	   			if ("1" == state){
	   				Ext.example.msg('保存成功！', '您成功新增了一个项目！');
	   				window.setTimeout("history.back();",1000);
	   			}else{
	   				Ext.Msg.show({
						title: '提示',
						msg: state,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
	   		});
   		}else{
   			myMask.show();
   			pcPrjService.addOrUpdate(obj, function(state){
   				myMask.hide();
	   			if ("2" == state){
	   				Ext.example.msg('保存成功！', '您成功修改了一个项目！');
	   				window.setTimeout("history.back();",1000);
	   			}else{
	   				Ext.Msg.show({
						title: '提示',
						msg: state,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
	   		});
   		}
    }
    
    //创建单位树函数
    function _createUniteTree(config,treeid,unitname,unitid){

    	var loader = new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:USERBELONGUNITID,
				ac:"buildingUnitTree",
				baseWhere:"unitTypeId in ('0','2','3','4')"
			}
		});
		var treeCombo = new Ext.ux.TreeCombo({
			resizable:true,
			id:(treeid?treeid:Ext.id()),
			loader:loader,
			root:  new Ext.tree.AsyncTreeNode({
		       text: (unitname?unitname:USERBELONGUNITNAME),
		       id: (unitid?unitid:USERBELONGUNITID),
		       expanded:true
		    })
		});
		Ext.apply(treeCombo,config);
		
		treeCombo.getTree().on('beforeload',function(node){
			loader.baseParams.parentId = node.id; 
		});
		return treeCombo;
	}    
})