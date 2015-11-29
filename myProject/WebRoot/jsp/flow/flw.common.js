Ext.namespace('Flw');
/**
 * 流程资料移交
 * @class Flw.FlwFilesWindow
 * @extends Ext.Window
 * eg: var fileremoveWin = new Flw.FlwFilesWindow({});
 * 	   fileremoveWin.show();
 */
Flw.FlwFilesWindow = Ext.extend(Ext.Window,{
	SEL_INDEX_ID : "-1",
	SEL_ORG_ID : "-1",
	treeId : this.treeId || (this.treeId = "ext-comp-" + (++Ext.Component.AUTO_ID)),
	insid : null,
	orgInZlTree : true,
	closeAction:'hide',
	business : 'baseMgm', // business在context中的注册名称
	title: '流程资料移交【文档|附件】',
	iconCls: 'print',
	width: 800, 
	height: 400,
	modal: true, 
	closeAction: 'hide',
	maximizable: false, 
	resizable: false,
	plain: true, layout: 'fit',
	currentinsid:null,
	initComponent: function(){
		var _self = this;
		if(!this.servletUrl){this.servletUrl = MAIN_SERVLET}; //服务器地址
		if(!this.bean){	this.bean = "com.sgepit.frame.flow.hbm.InsFileAdjunctInfoView";};// bean类的名称，含包名
		if(!this.listMethod){this.listMethod = "findWhereOrderBy";};
		if(!this.zlTreeBean){this.zlTreeBean = "com.sgepit.pmis.document.hbm.ZlTree";};
		if(!this.orgid){this.orgid = USERORGID?USERORGID:"";};
		//资料分类树
		this.treePanel = new Ext.tree.ColumnTree({
			border: false, 	    rootVisible:false,   lines : true,
			animCollapse:true,	animate:true,        autoScroll: true,
			columns: [
				{header: '资料分类', width: 260, dataIndex: 'mc'}, 
				{header: '主键', width: 0, dataIndex: 'treeid', renderer: function(value){ return "<div id='treeid'>"+value+"</div>";}},
				{header: '编码', width: 0, dataIndex: 'bm',renderer: function(value){ return "<div id='bm'>"+value+"</div>";}},
		    	{header: '是否子节点', width: 0, dataIndex: 'isleaf',renderer: function(value){ return "<div id='isleaf'>"+value+"</div>";}},
		    	{header: '系统自动存储编码', width: 0, dataIndex: 'indexid',renderer: function(value){ return "<div id='indexid'>"+value+"</div>"; }},
		    	{header: '部门id', width: 0, dataIndex: 'orgid',renderer: function(value){ return "<div id='orgid'>"+value+"</div>"; }},
		    	{header: '父节点', width: 0, dataIndex: 'parent',renderer: function(value){ return "<div id='parent'>"+value+"</div>"; }}
		    ],
			loader : new Ext.tree.TreeLoader({
				url : this.servletUrl,
				baseParams : {
					ac: "columntree",
					treeName: "zlTree",
					businessName: "zldaMgm",
					orgid: this.orgid,
					parent: "root",
					pid : CURRENTAPPID
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			}),
			root : new Ext.tree.AsyncTreeNode({
				text : '资料分类',
				iconCls : 'form'
			}),
			listeners:{
				click:function(node){
					if("" != node.attributes.mc){
						_self.comboxWithTree.setValue(node.attributes.mc);
						_self.SEL_INDEX_ID = node.attributes.indexid;
						_self.SEL_ORG_ID = node.attributes.orgid;
						_self.comboxWithTree.collapse();
					}
				},
				beforeload:function(node){
					if("" != node.attributes.mc){
						var parent = node.attributes.treeid;
						if (parent == null) parent = 'root';
						var baseParams = _self.treePanel.loader.baseParams
						baseParams.parent = parent;
					}
				}
			}
		});
		//资料选择combobox
		this.comboxWithTree = new Ext.form.ComboBox({
			mode: 'local',
			editable: false,
			width :200,
		    listWidth: 280,
		    maxHeight: 200,
		    triggerAction: 'all',
		    store: new Ext.data.SimpleStore({fields: [], data: [[]]}),
		    tpl: "<tpl for='.'><div style='height: 200px'><div id='"+this.treeId+"'></div></div></tpl>",
		    listClass: 'x-combo-list-small',
		    listeners:{	expand:function(){_self.treePanel.render(_self.treeId)}}
		});
		//移交类型combobox
		this.comboboxRemoveType = new Ext.form.ComboBox({
			mode: 'local',	editable: false,	width : 80,
		    triggerAction: 'all',    value:'0',
		    store: new Ext.data.SimpleStore({
		    	fields: ['val','txt'], 
		    	data: [['%','全部'],['0','未移交'],['-1','不移交'],['1','已移交']]
		    }),
		    valueField : 'val', displayField : 'txt',
            listeners:{select:function(){_self.loadStore()}}
		});
		//文件grid
		this.filesSm = new Ext.grid.CheckboxSelectionModel({
	        renderer: function(value, metaData, record){
				if(record.get('ismove')==0){
				     return Ext.grid.CheckboxSelectionModel.prototype.renderer.apply(this, arguments);
				}else{
				 	return;
				} 
			},
			listeners:{
				"beforerowselect" : function(sm,rowIndex,keepExisting,record ) { // grid 行选择事件
					if(record.get('ismove') ==1){return false;}else{return true;}
				}
			}
		});
		this.filesStore = new Ext.data.GroupingStore({
			baseParams: {
				ac : 'list',
				bean : this.bean,
				business : this.business,
				method : this.listMethod,
				params : "ISMOVE=0"
			},
			proxy: new Ext.data.HttpProxy({
				method: 'GET',
				url: this.servletUrl
			}),
			remoteSort: true,
			pruneModifiedRecords: true,
			reader : new Ext.data.JsonReader({
				root: 'topics',	totalProperty: 'totalCount',id: 'logid'
			}, [
				{mapping : "fileid",type : "string",name : "fileid"	},
				{mapping : "flowno",type : "string",name : "flowno"	},
				{mapping : "insid",	type : "string",name : "insid"	},
				{mapping : "title",type : "string",name : "title"	},
				{mapping : "ismove",type : "string",name : "ismove"}, 
				{mapping : "filename",type : "string",name : "filename"}, 
				{mapping : "filedate",type : "date",name : "filedate",dateFormat: 'Y-m-d H:i:s'}, 
				{mapping : "filetype",type : "string",name : "filetype"}
			]),
			sortInfo: {field: 'filetype', direction: "DESC"},	// 分组
			groupField: 'filetype'	// 分组
		});
		this.gridPanel = new Ext.grid.GridPanel({
			border: false,
			header: false, 
			stripeRows: true,
			autoScroll: true,
			enableColumnResize :false,
			enableColumnMove :false,
			enableColumnHide :false,
			//enableHdMenu : false,
			allowDomMove : false,
			loadMask: true,
			collapsible: true,
			animCollapse: true,
			store : this.filesStore,
			selModel : this.filesSm,
			columns : [this.filesSm,{
				id: 'fileid',
				header: '文件ID',
				dataIndex: 'fileid',
				hidden: true
			},{
				id: 'insid',
				header: '实例ID',
				dataIndex: 'insid',
				hidden: true
			},{
				id: 'title',
				header: '流程标题',
				dataIndex: 'title',
				width: 260
			},{
				id: 'ismove',
				header: '是否移交',
				dataIndex: 'ismove',
				hidden:true,
				renderer:function(value){
					if(value==0){return "<font color='green'>未移交</font>"}
					else if(value==1){return "<font color='red'>已移交</font>"}
				}
			},{
				id: 'filename',
				header: '文件名称',
				dataIndex: 'filename',
				width: 260
			},{
				id: 'filedate',
				header: '创建时间',
				dataIndex: 'filedate',
				width: 100,
				renderer: function(value){
					return value ? value.dateFormat('Y-m-d') : '';
				}
			}, {
				width : 60,
				//hidden : true,
				header : "类别",
				dataIndex : "filetype",
				sortable : false,
				renderer: function(value){
					if(value=='WORD'){
						return "流程文档"
					}else{
						return "附件"
					}
				}
			}, {
				width : 70,
				header : "移交状态",
				dataIndex : "ismove",
				sortable : false,
				renderer: function(value,metadata ,record){
					var fileId=record.get("fileid");
					var filetype=record.get("filetype"); 
					if(value=="0"){
						return "<button class=pageBtn title='设置为不移交' " +
							   "onclick=\"Ext.getCmp('"+_self.id+"')." +
							   "setRemove('"+fileId+"','"+filetype+"','-1')\">" +
							   "<font color='red'><b>未移交</b></font></button>";
					}else if(value=="-1"){
						return "<button class=pageBtn title='设置为移交' " +
							   "onclick=\"Ext.getCmp('"+_self.id+"')." +
							   "setRemove('"+fileId+"','"+filetype+"','0')\">" +
							   "<font color='gray'><b>不移交</b></font></button>";
					}else{
						return "<font color='green'><b>已移交</b></font>";
					}
				}
			}],
			view: new Ext.grid.GroupingView({	// 分组
	            forceFit: true,
	            groupTextTpl: '{text}(共{[values.rs.length]}项)'
	        }),
			bbar: new Ext.PagingToolbar({
	            pageSize: PAGE_SIZE>15?15:PAGE_SIZE,
	            store: this.filesStore,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        })
		});
		//end of grid
		//模糊查询
		this.searchField = new Ext.form.TwinTriggerField({
		    trigger1Class:'x-form-clear-trigger',
			trigger2Class:'x-form-search-trigger',
		    hideTrigger1:true,
		    hasSearch : false,
		    paramName : 'query',
			onTrigger1Click : function(){
	        	var v = this.getRawValue();
			    if(v.length > 0){
		            this.el.dom.value = '';
			    }
	            this.triggers[0].hide();
	            _self.loadStore();
		    },
		    onTrigger2Click : function(){
		        var v = this.getRawValue();
		        if(v.length > 0){
			        this.triggers[0].show();
		         	_self.loadStore();
		        }
		    },
		    listeners:{
		    	'specialkey':function(f, e){
		            if(e.getKey() == e.ENTER){
		            	var v = f.getRawValue();
			        	if(v.length < 1){
				            f.triggers[0].hide();
			        	}else{
				            f.triggers[0].show();
			        	}
			        	_self.loadStore();
		            }
		        },
		        render:function(cmp){
			     	new Ext.ToolTip({   
			        	target: cmp.el.dom.id,   
			        	html: '输入【流程标题】关键字后按【Enter】键即可查询'
			   		}); 
		        }
		    }
		});
		//移交按钮		
		this.doRemoveBtn = new Ext.Toolbar.Button( {
			text : "移交资料室",
			iconCls: "refresh",
			scope:_self,
			handler:_self.removeToZl
		});
		this.tbar =[
			{text:'查询: ',xtype:'tbtext'},
			this.searchField,
			{text : "移交状态：",xtype : "tbtext"},
			this.comboboxRemoveType,
			{text : "资料分类：",xtype : "tbtext"},
			this.comboxWithTree, "->" ,
			this.doRemoveBtn
		];
		this.items=[this.gridPanel];
		this.on("beforeshow",function(){
			this.filesStore.removeAll();
			this.searchField.setValue("");
			this.comboxWithTree.setValue("");
			this.comboxWithTree.setRawValue("");
			if(!this.orgInZlTree){
				Ext.example.msg('提示', '部门['+(USERORG?USERORG:"")+']，不在资料树中！');
				return this.orgInZlTree;
			}
		},this);
		Flw.FlwFilesWindow.superclass.initComponent.call(this);
	},
	setRemove:function(fId,filetype,ismove){
		var _self = this;
		flwFileMgm.setRemove(fId,filetype,ismove,function(flag){
			_self.filesStore.reload();
		});
	},
	showFlwFilesWin : function(_insid,_title){
		this.show(_insid,_title);
	},
	show:function(){
		var  FLW_INS_TITLE = "全部流程";
		if(arguments.length>0){
			this.actionStore = arguments[0]?arguments[0]:null;
		}else{
			this.actionStore = null;
		};
		if(arguments.length>1){
			this.currentinsid = arguments[1]?arguments[1]:null;
		}else{
			this.currentinsid = null;
		};
		if(arguments.length>2){
			FLW_INS_TITLE = arguments[2]?arguments[2]:"全部流程";
		};
		this.setTitle('【'+FLW_INS_TITLE+'】 - 流程文档|附件');
		this.loadStore();
		Flw.FlwFilesWindow.superclass.show.call(this);
	},
	loadStore : function(){
		var v = this.searchField.getValue()?this.searchField.getValue():"%";
		var ismove = this.comboboxRemoveType.getValue()?this.comboboxRemoveType.getValue():"%";
		var _insid,ismove;
		if(this.currentinsid&&this.currentinsid!=""){
			_insid = "insid='"+this.currentinsid+"' AND ";
		}else{
			_insid = "1=1 AND "
		}
		if(v==""){
			this.filesStore.baseParams.params = _insid+ " ismove like '"+ismove+"' AND STATUS='2' AND FROMNODE = '"+USERID+"'";
		}else{
			this.filesStore.baseParams.params = _insid+ " ismove like '"+ismove+"' AND STATUS='2' AND FROMNODE = '"+USERID+"' AND TITLE like '%"+v+"%'";
		}
        this.filesStore.load({
        	params: {
		    	start: 0,
		    	limit: PAGE_SIZE>15?15:PAGE_SIZE
	    	}
        });
	},
	removeToZl : function(){
		if (this.filesSm.getSelections().length < 1){
			Ext.example.msg('提示', '请先选择数据！');
			return;
		} else if (this.comboxWithTree.getValue() == ''){
			Ext.example.msg('提示', '请先选择移交到哪个部门资料！');
			return;
		}
		if (this.SEL_INDEX_ID == "-1" || this.SEL_ORG_ID == "-1"){
			Ext.example.msg('提示', '参数错误，无法移交！');
			return;
		}
		var THIS = this;
		Ext.Msg.show({
			title: '提示',
			msg: '您确定要移交吗？',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING,
			fn: function(v){
				if(v=='yes'){
					var zlInfo_objs = new Array();
					var records = THIS.filesSm.getSelections();
					var ZlInfoObject =  THIS.ZlInfo;
					for (var i=0; i<records.length; i++){
						var _fileid = records[i].get('fileid');
						var zlInfo = new ZlInfoObject({
							pid:CURRENTAPPID,			//项目别
							indexid : THIS.SEL_INDEX_ID,	//分类条件
							orgid : THIS.SEL_ORG_ID,		//部门id
							filelsh:_fileid,
							billstate : 0,					//单据状态
							weavecompany:REALNAME,          //责任人
							portion:1,                      //份数
							book:3                         //单位
						});
						zlInfo_objs.push(zlInfo);
					}
					if(zlInfo_objs.length==0) return;
					flwFileMgm.removeToZlListJSON(Ext.encode(zlInfo_objs), function(log){
						var _msg = "资料移交成功！";
						if(log.success!==true){
							_msg = "移交失败！\n"+log.errormsg
						}else if(log.flag!==true){
							_msg = log.message
						}
						Ext.Msg.show({
							title: '提示',
							msg: _msg,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.INFO,
							fn: function(value){
								THIS.searchField.setValue("");
								THIS.comboxWithTree.setValue("");
								THIS.comboxWithTree.setRawValue("");
								THIS.loadStore();
								if(THIS.actionStore&&THIS.actionStore.reload){
									THIS.actionStore.reload();
								}
							}
						});
					});
				}
			}
		});
	},
	ZlInfo : function(config){
		this.infoid,			//主键
		this.pid,				//项目别
		this.indexid,			//分类条件
		this.fileno,			//文件编号
		this.materialname,		//材料名称（流程主题）
		this.responpeople,		//录入人（发起人）
		this.responpeople=REALNAME?REALNAME:"",//录入人（发起人）
		this.stockdate,			//文件形成日期
		this.quantity,			//每份数量
		this.book,				//单位
		this.portion,			//份
		this.filelsh,			//附件流水号
		this.billstate,			//单据状态
		this.orgid,				//部门id
		this.weavecompany,		//责任者
		this.infgrade,			//资料电子文档密级
		this.filename,			//附件文件名称（文件名称）
		this.remark,			//备注
		this.yjr=REALNAME?REALNAME:"",			//移交人（发起人）
		this.jsr,				//经手人
		this.zltype,			//资料类型（8定为流程文件、9定为流程附件）
		this.rkrq,				//入库日期
		this.modtabid,
		this.flwinsid,
		this.zldaid,
		Ext.apply(this,config);
	}
});
Ext.reg('flwFiles',Flw.FlwFilesWindow);
/**
 * 流程的删除，慎用，删除会删除相关的所有资料
 * @class Flw.FlwUtilWindow
 * @extends Ext.Window
 */
Flw.FlwUtilWindow=Ext.extend(Ext.Window ,{
	xtype:"window",
	title:"流程数据维护",
	width:600,
	height:450,
	layout: 'border',
	plain :true,
	resizable :false,
	//modal :true,
	initComponent: function(){
		var _self = this;
		this.flwDS = new Ext.data.Store({
			baseParams: {
				ac: 'list',
				bean: "com.sgepit.frame.flow.hbm.FlwDefinitionView",
				business: 'baseMgm',
				method: 'findWhereOrderBy',
				params: '1=1'
			},
			proxy: new Ext.data.HttpProxy({
				method: 'GET',
				url: MAIN_SERVLET
			}),
			reader: new Ext.data.JsonReader({
				root: 'topics',
				totalProperty: 'totalCount',
				id: 'flowid'
			}, [
				{name: 'flowid', type: 'string'},
				{name: 'flowtitle', type: 'string'},
				{name: 'xmlname', type: 'string'},
				{name: 'state', type: 'string'}
			]),
			remoteSort: true,
			pruneModifiedRecords: true
		});
		this.insDS = new Ext.data.Store({
			baseParams: {
				ac: 'list',
				bean: "com.sgepit.frame.flow.hbm.FlwInstanceView",
				business: 'baseMgm',
				method: 'findWhereOrderBy',
				params: '1=1'
			},
			proxy: new Ext.data.HttpProxy({
				method: 'GET',
				url: MAIN_SERVLET
			}),
			reader: new Ext.data.JsonReader({
				root: 'topics',
				totalProperty: 'totalCount',
				id: 'insid'
			}, [
				{name: 'insid', type: 'string'},
				{name: 'flowid', type: 'string'},
				{name: 'title', type: 'string'},
				{name: 'status', type: 'string'}
			]),
			remoteSort: true,
			pruneModifiedRecords: true
		});
		this.flwSM = new Ext.grid.CheckboxSelectionModel({
			singleSelect:true,
			listeners :{
				'rowdeselect':function(){
					_self.loadInsData(_self)
				},
				'rowselect':function(){
					_self.loadInsData(_self)
				}
			}
		});
		this.flwCM = new Ext.grid.ColumnModel([_self.flwSM, 
			{
				id: 'flowid',
				header: '流程ID',
				dataIndex: 'flowid',
				hidden: true
			},{
				id: 'flowtitle',
				header: '流程标题',
				dataIndex: 'flowtitle',
				width: 120
			},{
				id: 'xmlname',
				header: '流程图',
				dataIndex: 'xmlname',
				width: 120,
				renderer: function(value){
					return '%服务器地址%\\frame\\temp\\'+value+'.xml';
				}
			}
		]),
		this.insSM = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
		this.insCM = new Ext.grid.ColumnModel([_self.insSM, 
			{
				id: 'insid',
				header: '流程实例ID',
				dataIndex: 'insid',
				hidden: true
			},{
				id: 'flowid',
				header: '流程ID',
				dataIndex: 'flowid',
				hidden: true
			},{
				id: 'title',
				header: '标题',
				dataIndex: 'title'
			},{
				id: 'status',
				header: '处理状态',
				dataIndex: 'flowtitle',
				width: 120,
				renderer: function(value, meta, record){
					if(value=='0')	return '开始';
					else if(value=='1') return '处理中';
					else if(value=='2') return '结束';
					else if(value=='3') return '终止';
					else  return value;
				}
			}
		]);
		this.items=[{
				xtype:"grid",
				region:"center",
				title:"流程定义",
				cm : _self.flwCM,
				ds : _self.flwDS,
				sm : _self.flwSM, 
				tbar: ["<b>流程定义<b>",'->',
					{text: "<font color=#15428b>删除1</font>",scope:_self, iconCls: 'remove',   handler:_self.delFlwDef},
					{text: "<font color=#15428b>全部删除</font>",scope:_self, iconCls: 'remove',handler:_self.delAllFlwDef}
				],
				border: false,header: false,stripeRows: true,clicksToEdit: 1,split: true,
				autoScroll: true,loadMask: true,collapsible: true,animCollapse: true,
				viewConfig: {
					forceFit: true,
					ignoreAdd: true
				},
				bbar: new Ext.PagingToolbar({
		            pageSize: PAGE_SIZE,
		            store: _self.flwDS,
		            displayInfo: true,
		            displayMsg: ' {0} - {1} / {2}',
		            emptyMsg: "无记录。"
		        })
		},{
				xtype:"grid",
				title:"流程实例",
				region:"south",
				height:200,
				cm : _self.insCM,
				ds : _self.insDS,
				sm : _self.insSM,
				tbar: ['<b>流程实例</b>','-',{text: "<font color=#15428b>删除</font>",scope:_self, iconCls: 'remove',handler:_self.delInsDef}],
				border: false,header: false,stripeRows: true,clicksToEdit: 1,split: true,
				autoScroll: true,loadMask: true,collapsible: true,animCollapse: true,
				viewConfig: {
					forceFit: true,
					ignoreAdd: true
				},
				bbar: new Ext.PagingToolbar({
		            pageSize: PAGE_SIZE,
		            store: _self.insDS,
		            displayInfo: true,
		            displayMsg: ' {0} - {1} / {2}',
		            emptyMsg: "无记录。"
		        })
		}];
		this.on('show',function(){
			this.getFlwGrid().getStore().removeAll();
			this.getInsGrid().getStore().removeAll();
			this.getInsGrid().getStore().load();
			this.getFlwGrid().getStore().load();		
		});
		Flw.FlwUtilWindow.superclass.initComponent.call(this);
	},
	/**
	 * 获取流程定义GRID
	 * @return {}
	 */
	getFlwGrid: function(){
		return this.items.get(0);
	},
	/**
	 * 获取流程实例定义GRID
	 * @return {}
	 */
	getInsGrid: function(){
		return this.items.get(1);
	},
	getFlwSelectionModel : function(){
		return this.getFlwGrid().getSelectionModel()
	},
	getInsSelectionModel : function(){
		return this.getInsGrid().getSelectionModel()
	},
	loadInsData : function(_scope){
		var flwArr = _scope.getFlwSelectionModel().getSelections();
		if(flwArr.length==1){
			_scope.getInsGrid().getStore().baseParams.params = "flowid = '"+flwArr[0].get('flowid')+"'";
		}else{
			_scope.getInsGrid().getStore().baseParams.params = "1=2";
		};
		_scope.getInsGrid().getStore().load();
	},
	/**
	 * 删除流程定义
	 */
	delFlwDef: function(){
		var recode = this.getFlwSelectionModel().getSelected();
		var THIS = this;
		if(recode){
			DWREngine.setAsync(false);
			var flowtitle = recode.get('flowtitle');
			var flowid = recode.get('flowid');
			Ext.Msg.confirm('提示','删除【'+flowtitle+'】流程后不可恢复,是否继续？',function(txt){
				if(txt=='yes'){
					Ext.Msg.confirm('提示','再次确认是否删除，操作不可恢复，提醒您慎用！',function(txt1){
						if(txt1=='yes'){
							Ext.Msg.confirm('提示','<font color="red"><b>太危险了</b></font>，你是真的真的要删除吗？',function(txt2){
								if(txt2=='yes'){
									flwInstanceMgm.DEL_FLOW(flowid, function(message){
										Ext.example.msg('提示',message);
										THIS.getFlwGrid().getStore().load();
										THIS.getInsGrid().getStore().removeAll();
									});					
								}
							});	
						};
					});					
				}
			});
			DWREngine.setAsync(true);
		}
	},
	/**
	 * 删除全部流程定义
	 */
	delAllFlwDef: function(){
		var THIS = this;
		var ds = this.getFlwGrid().getStore();
		var count = ds.getCount();
		for(var i=0;i<count;i++){
			var recode = ds.getAt(i);
			var flowtitle = recode.get('flowtitle');
			var flowid = recode.get('flowid');
			flwInstanceMgm.DEL_FLOW(flowid, function(message){});					
		}
		THIS.getFlwGrid().getStore().load();
		THIS.getInsGrid().getStore().removeAll();
	},
	/**
	 * 删除流程实例
	 */
	delInsDef: function(){
		var selections = this.getInsSelectionModel().getSelections();
		var THIS = this;
		for(var i=0;i<selections.length;i++){
			var recode= selections[i];
			var insid = recode.get('insid');
			var title = recode.get('title');
			flwInstanceMgm.DEL_INS(insid, function(message){
				Ext.example.msg('提示',message);
				THIS.getInsGrid().getStore().load();
			});				
			/*Ext.Msg.confirm('提示','<font color="red"><b>太危险了</b></font>，你是真的真的要删除【'+title+'】吗？',function(txt2){
				if(txt2=='yes'){
					flwInstanceMgm.DEL_INS(insid, function(message){
						Ext.example.msg('提示',message);
						THIS.getInsGrid().getStore().load();
					});				
				}
			});	*/
		}
	},
	onRender: function(ct, position){
		Flw.FlwUtilWindow.superclass.onRender.call(this, ct,
				position);
		this.getFlwGrid().getStore().load();		
		this.getInsGrid().getStore().removeAll();
	}
})
Ext.reg("flwutilwindow",Flw.FlwUtilWindow);
/**
 * 流程定义和流程实例删除
 * @class Flw.FlwDelBtn
 * @extends Ext.Toolbar.Spacer
 */
Flw.FlwDelBtn=Ext.extend(Ext.Toolbar.Button ,{
	win:null,
	initComponent: function(){
		this.win = new Flw.FlwUtilWindow({
			closeAction:'hide',
			height: document.body.clientHeight,
			width:  document.body.clientWidth,
			resizable:false,
			draggable:false,
			modal:true
		});
		this.text = "<font color=red>流程定义和实例删除";
		this.handler = function(){
			this.win.show();
		}
		Flw.FlwDelBtn.superclass.initComponent.call(this);
	}
});
Ext.reg('flwdelbtn',Flw.FlwDelBtn);
/**
 * 业务工作流程树
 * @class Flw.FlwBizTree
 * @extends Ext.tree.TreePanel
 */
Flw.FlwBizTree=Ext.extend(Ext.tree.TreePanel ,{
	width: 175,
	minSize: 175,
	maxSize: 500,
	frame: false,
	margins: '5 0 5 5',
	cmargins: '0 0 0 0',
	rootVisible: true,
	lines: true,
	animate: false,
	animCollapse : false,
	autoScroll: true,
	animCollapse : false,
	collapsible: false,
	collapseMode: 'mini',
	collapseFirst: false,
	tbar: null,
    loader:null,
    root:null,
	initComponent: function(){
		if(!this.root){
			this.root = new Ext.tree.TreeNode({
		    	text: '业务工作流程树',
		    	id: 'root',
		    	type: 'root'
		    });
		};
		if(!this.tbar){
			this.tbar = ['<font color=#15428b>&nbsp;流程结构树</font>']
		};
		if(!this.loader){
			this.loader = new Ext.tree.TreeLoader();
			this.on('render',this.buildFrameTree,this)
		};
		Flw.FlwBizTree.superclass.initComponent.call(this);
	},
	clearChildNodes : function(node){
		if (node.childNodes.length > 0){
			node.childNodes[0].remove();
			this.clearChildNodes(node);
		}
	},
	buildFrameTree : function(){
		var root = this.root;
		var treePanel = this;
		this.getEl().mask("Loading...");
		this.clearChildNodes(root);
		baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwFrame", 
			"unitid='"+USERBELONGUNITID+"'", function(frame_list){
			for (var i = 0; i < frame_list.length; i++) {
				var treeNode = new Ext.tree.TreeNode({
					id: frame_list[i].frameid,
					text: frame_list[i].framename,
					type: 'document'
				});
				DWREngine.setAsync(false);
				flwFrameMgm.getFlowTreeByFrameid(frame_list[i].frameid,function(data){
					var nodes = eval(data);
					for(var i=0,l=nodes.length;i<l;i++){
						treeNode.appendChild(new Ext.tree.TreeNode(nodes[i]));
					}
				})
				DWREngine.setAsync(true);
				root.appendChild(treeNode);
			}
			root.expand();
			root.expandChildNodes(true);
			treePanel.getEl().unmask();
		});
	}
});
Ext.reg('flwBizTree',Flw.FlwBizTree);