var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.document.hbm.DaZl"
var beanA = "com.sgepit.frame.flow.hbm.ZlInfo"
var bean_zl = "com.sgepit.pmis.document.hbm.DaDaml"
var business = "baseMgm"
var business_zl = "zlMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "daid"
var orderColumn = "dh"
var gridPanelTitle ="案卷列表"
var formPanelTitle = "档案组卷"
var pageSize = PAGE_SIZE;
var treeData = new Array();
var databzdw=new Array();
var datazy=new Array();
var partBs=new Array();
var treePanel
var data;
var viewport;
var selectedTreeData = "";
var selectedTreeDataIndexid = ""
var rootText = "档案分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var ds_zlinfo;
var formWin;
var currentPid = CURRENTAPPID;
var strs = "";
var ds_pid="pid='"+currentPid+"' and ";
var weavArr = new Array();
Ext.onReady(function() {
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "daTree",
			businessName : "zldaMgm",
			pid:currentPid,
			//orgid:USERORGID, 
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'da-tree-panel',
		region : 'west',
		split : true,
		width : 260,
		minSize : 175,
		maxSize : 300,
		frame : false,
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : false,
		lines : true,
		autoScroll : true,
		animCollapse : true,
		animate : true,
		collapseMode : 'mini',
		columns : [{
			header : '档案名称',
			width : 400,
			dataIndex : 'mc'
		}, {
            header: '主键',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";  }
        },{
            header: '编码',
            width: 0,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";  }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '系统自动存储编码',
            width: 0,
            dataIndex: 'indexid',
            renderer: function(value){
            	return "<div id='indexid'>"+value+"</div>";
            }
        },{
            header: '部门id',
            width: 0,
            dataIndex: 'orgid',
            renderer: function(value){
            	return "<div id='orgid'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        }],
		loader : treeLoader,
		root : root
	});

	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.treeid;
		if (parent == null)
			parent = 'root';
		var baseParams = treePanel.loader.baseParams
		//baseParams.orgid = USERORGID;
		baseParams.parent = parent;

		})
    
	DWREngine.setAsync(false);
	appMgm.getCodeValue('编制单位',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			databzdw.push(temp);			
		}
    });
    appMgm.getCodeValue('专业',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			datazy.push(temp);			
		}
    });
    appMgm.getCodeValue('责任者',function(list){ 
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			weavArr.push(temp);			
		}
    });
	DWREngine.setAsync(true);
	 var bzdwStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : databzdw
    });
    var zyStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : datazy
    });
	var dsindexid = new Ext.data.SimpleStore({fields: [], data: [[]]});
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	var fm = Ext.form;
	
	/////////////////////////////////////////////////////////////////////////
	
	var btnQuery = new Ext.Button({
		id : 'showQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler : QueryWinwdow
	});
	var btnlcfj = new Ext.Button({
		id : 'lcyj',
		text : '查看流程附件',
		tooltip : '查看流程附件',
		iconCls : 'btn',
		disabled : true,
		handler : showFlowAdjunct
	});
	function QueryWinwdow() {
		if (!formWin) {
			formWin = new Ext.Window({
				title : '查询数据',
				width : 460,
				height : 400,
				layout : 'fit',
				iconCls : 'form',
				closeAction : 'hide',
				border : true,
				constrain : true,
				maximizable : true,
				modal : true,
				items : [QueryPanel]
			});
		}
		QueryPanel.getForm().reset();
		formWin.show();
	}
	////////////////////////////////////////////////////////////////////////
	var fc = {
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}, 'daid' : {
			name : 'daid',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}, 'indexid' : {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}, 'mc' : {
			name : 'mc',
			fieldLabel : '案卷题名',
			anchor : '95%'
		}, 'gdrq' : {
			name : 'gdrq',
			fieldLabel : '归档日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		}, 'dagh' : {
			name : 'dagh',
			fieldLabel : '档案馆号',
			anchor : '95%'
		}, 'swh' : {
			name : 'swh',
			fieldLabel : '缩微号',
			anchor : '95%'
		}, 'bzdw' : {
			name : 'bzdw',
			fieldLabel : '编制单位',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选编制单位...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: bzdwStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            allowBlank: false,
			anchor : '95%'
		}, 'bgqx' : {
			name : 'bgqx',
			fieldLabel : '保管期限',
			anchor : '95%'
		}, 'mj' : {
			name : 'mj',
			fieldLabel : '密级',
		    anchor : '95%'
		}, 'bzrq' : {
			name : 'bzrq',
			fieldLabel : '起止日期',
			anchor : '95%'
		}, 'sl' : {
			name : 'sl',
			fieldLabel : '数量',
			anchor : '95%'
		}, 'ztc' : {
			name : 'ztc',
			fieldLabel : '主题词',
			anchor : '95%'
		}, 'flmc' : {
			name : 'flmc',
			fieldLabel : '分类名称',
			anchor : '95%'
		}, 'bfjs':{
			name : 'bfjs',
			fieldLabel : '件数',
			anchor : '95%'
		}, 'bfys':{
			name : 'bfys',
			fieldLabel : '每份页数',
			anchor : '95%'
		}, 'kwh':{
			name : 'kwh',
			fieldLabel : '库位号',
			anchor : '95%'
		}, 'bz' :{
			name : 'bz',
			fieldLabel : '备注',
			height: 120,
			width: 600,
			xtype: 'htmleditor',
			anchor:'95%'
		}, 'jnsm':{
			name : 'jnsm',
			fieldLabel : '卷内说明',
			height: 120,
			width: 600,
			xtype: 'htmleditor',
			anchor:'95%'
		}, 'ljr':{
			name : 'ljr',
			fieldLabel : '立卷人',
			anchor : '95%'
		}, 'ljrq' : {
			name : 'ljrq',
			fieldLabel : '立卷日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		}, 'jcr':{
			name : 'jcr',
			fieldLabel : '检查人',
			anchor : '95%'
		}, 'jcrq' : {
			name : 'jcrq',
			fieldLabel : '检查日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		}, 'daState':{
			name : 'daState',
			fieldLabel : '档案状态',
			anchor : '95%'
		}, 'dabh':{
			name : 'dabh',
			fieldLabel : '档案号',
			anchor : '95%'
		}, 'hjh':{
			name : 'hjh',
			fieldLabel : '互见号',
			anchor : '95%'
		}, 'dh':{
			name : 'dh',
			fieldLabel : '档号',
			anchor : '95%'
		},
		'orgid':{
			name : 'orgid',
			fieldLabel : '部门ID',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'zy':{
			name : 'zy',
			fieldLabel : '专业',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选专业...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: zyStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			
			anchor : '95%'
		},
		'wbxs':{
			name : 'wbxs',
			fieldLabel : '文本形式',
			anchor : '95%'
		},
		'filelsh':{
			name : 'filelsh',
			fieldLabel : '电子文档',
			anchor : '95%'
		},'filename':{
			name : 'filename',
			fieldLabel : '文件名称',
			anchor : '95%'
		},'jcjsh':{
			name : 'jcjsh',
			fieldLabel : '卷册检索号',
			anchor : '95%'
		},'zys':{
			name : 'zys',
			fieldLabel : '总页数',
			readOnly : true,
			anchor : '95%'
		}
	}
	
	var cm = new Ext.grid.ColumnModel([
		sm, 
		{
			id : 'daid',
			header : fc['daid'].fieldLabel,
			dataIndex : fc['daid'].name,
			hidden : true
		},{
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		},{
			id : 'dh',
			header : fc['dh'].fieldLabel,
			dataIndex : fc['dh'].name,
			type: 'string',
			width : 200
		},{
			id :'zys',
			header : fc['zys'].fieldLabel,
			dataIndex : fc['zys'].name,
			width : 100
		},{
			id : 'jcjsh',
			header : fc['jcjsh'].fieldLabel,
			dataIndex : fc['jcjsh'].name,
			width : 200
		},{
			id : 'bzrq',
			header : fc['bzrq'].fieldLabel,
			dataIndex : fc['bzrq'].name,
			width : 150
		},{
			id : 'mc',
			header : fc['mc'].fieldLabel,
			dataIndex : fc['mc'].name,
			type: 'string',
			width : 300
		}, {
			id : 'bzdw',
			header : fc['bzdw'].fieldLabel,
			dataIndex : fc['bzdw'].name,
			type: 'string',
			width : 200,
			renderer : partbRender
		},{
			id : 'gdrq',
			header : fc['gdrq'].fieldLabel,
			dataIndex : fc['gdrq'].name,
			width : 150,
			type: 'date',
			renderer : formatDate
		}, {
			id : 'bgqx',
			header : fc['bgqx'].fieldLabel,
			dataIndex : fc['bgqx'].name,
			width : 150,
			type: 'string',
			renderer : function(value) {
				if (value == 1) {
					return '短期';
				} else if (value == 2) {
					return '长期';
				} else if (value == 3) {
					return '永久';
				}
			}
		}, {
			id : 'mj',
			header : fc['mj'].fieldLabel,
			dataIndex : fc['mj'].name,
			width : 100,
			type: 'string',
			renderer : function(value) {
				if (value == 1) {
					return '公开';
				} else if (value == 2) {
					return '机密';
				} else if (value == 3) {
					return '秘密';
				} else if (value == 4) {
					return '绝密';
				}
			}
		},
		{
				id : 'zy',
				header : fc['zy'].fieldLabel,
				dataIndex : fc['zy'].name,
				width : 150,
				renderer :partzyRender
			},
			{
				id : 'wbxs',
				header : fc['wbxs'].fieldLabel,
				dataIndex : fc['wbxs'].name,
				width : 150,
				renderer: function(Value){
					if (Value == 1) {
						return '正本'
					}
					if (Value == 2) {
						return '副本'
					}
				}
		},
		{
			id : 'bfjs',
			header : fc['bfjs'].fieldLabel,
			dataIndex : fc['bfjs'].name,
			type: 'string',
			width : 150
		}, {
			id : 'ljr',
			header : fc['ljr'].fieldLabel,
			dataIndex : fc['ljr'].name,
			type: 'string',
			width : 150
		}, {
			id : 'ljrq',
			header : fc['ljrq'].fieldLabel,
			dataIndex : fc['ljrq'].name,
			width : 150,
			type: 'date',
			renderer : formatDate
		}, {
			id : 'indexid',
			header : fc['indexid'].fieldLabel,
			dataIndex : fc['indexid'].name,
			hidden : true
		},
		{
			id : 'orgid',
			header : fc['orgid'].fieldLabel,
			dataIndex : fc['orgid'].name,
			hidden : true
		},
		{
			id : 'filelsh',
			header : fc['filelsh'].fieldLabel,
			dataIndex : fc['filelsh'].name,
			width : 120,
			renderer : fileicon
		}
	]);
	cm.defaultSortable = true;

	var Columns = [
		{name: 'daid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'indexid', type: 'string'}, 
		{name: 'mc', type: 'string'},
		{name: 'gdrq', type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'dagh', type: 'string'}, 
		{name: 'swh', type: 'string'},
		{name: 'bzdw', type: 'string'}, 
		{name: 'bgqx', type: 'string'}, 
		{name: 'mj', type: 'string'}, 
		{name: 'bzrq', type: 'string'},
		{name: 'sl', type: 'float'},
		{name: 'ztc', type: 'string'}, 
		{name: 'flmc', type: 'string'}, 
		{name: 'bfjs', type: 'float'}, 
		{name: 'bfys', type: 'float'},
		{name: 'kwh', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'jnsm', type: 'string'},
		{name: 'ljr', type: 'string'},
		{name: 'ljrq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'jcr', type: 'string'},
		{name: 'jcrq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'daState', type: 'float'},
		{name: 'dabh', type: 'string'},
		{name: 'hjh', type: 'string'},
		{name: 'dh', type: 'string'},
		{name: 'orgid', type: 'string'},
		{name: 'zy', type: 'string'},
		{name: 'wbxs', type: 'float'},
		{name: 'filelsh', type: 'string'},
		{name: 'filename', type: 'string'},
		{name: 'jcjsh', type: 'string'},
		{name: 'zys',type: 'string'}
		
	];
	
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params :ds_pid+" indexid like '%"+selectedTreeData+"%'  "
		},
		proxy : new Ext.data.HttpProxy({
			method: 'GET',
			url: ServletUrl
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort(orderColumn, 'ASC');

	grid = new Ext.grid.QueryExcelGridPanel({
		id: 'grid-panel',
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: ['<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>','->'],
		border: false,
		region: 'center',
		split: true,
		clicksToEdit: 2,
		header: false,
		autoScroll: true,
		collapsible: false,
		animCollapse: false,
		loadMask: true,
		viewConfig: {
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
			store: ds,
			displayInfo: true,
			displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		})
	});

	var sm_zlinfo = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var fc_zlinfo = {
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'dzid' : {
			name : 'dzid',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			// allowBlank: false,
			anchor : '95%'
		},
		'zlid' : {
			name : 'zlid',
			fieldLabel : '资料流水号',
			readOnly : true,
			anchor : '95%'
		},
		'daid' : {
			name : 'daid',
			fieldLabel : '档 号',
			// allowBlank: false,
			anchor : '95%'
		},
		'sl' : {
			name : 'sl',
			fieldLabel : '归档数量',
			anchor : '95%'
		},
		'xh' : {
			name : 'xh',
			fieldLabel : '序号',
			anchor : '95%'
		},
		'yc' : {
			name : 'yc',
			fieldLabel : '页号',
			anchor : '95%'
		},
		'dafileno' : {
			name : 'dafileno',
			fieldLabel : '文件编号',
			anchor : '95%'
		},
		'dafilename' : {
			name : 'dafilename',
			fieldLabel : '文件名称',
			anchor : '95%'
		},
		'dazrz' : {
			name : 'dazrz',
			fieldLabel : '录入人',
			anchor : '95%'
		},
		'uint' : {
			name : 'uint',
			fieldLabel : '单位',
			anchor : '95%'
		},
		'dzwd' : {
			name : 'dzwd',
			fieldLabel : '电子文档',
			anchor : '95%'
		},
		'rkrq' : {
			name : 'rkrq',
			fieldLabel : '入库日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01'
		},
		'yjr' : {
			name : 'yjr',
			fieldLabel : '移交人',
			anchor : '95%'
		},
		'jsr' : {
			name : 'jsr',
			fieldLabel : '经手人',
			anchor : '95%'
		},
		'bz' : {
			name : 'bz',
			fieldLabel : '备注',
			height : 120,
			width : 600,
			xtype : 'htmleditor',
			anchor : '95%'
		},
		'stockdate' : {
			name : 'stockdate',
			fieldLabel : '文件日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'company' : {
			name : 'company',
			fieldLabel : '责任者',
			anchor : '95%'
		},
		'zllx' : {
			name : 'zllx',
			fieldLabel : '资料类型',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'insid' : {
			name : 'insid',
			fieldLabel : '流程实例id',
			anchor : '95%'
		}
	}
	
	var cm_zlinfo = new Ext.grid.ColumnModel([
		sm_zlinfo, 
		{
				id : 'xh',
				header : fc_zlinfo['xh'].fieldLabel,
				dataIndex : fc_zlinfo['xh'].name,
				width : 100,
				editor : new fm.NumberField(fc_zlinfo['xh'])
			}, {
				id : 'dzid',
				header : fc_zlinfo['dzid'].fieldLabel,
				dataIndex : fc_zlinfo['dzid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc_zlinfo['pid'].fieldLabel,
				dataIndex : fc_zlinfo['pid'].name,
				hidden : true
				// editor: new fm.TextField(fc_zlinfo['pid'])
		}	, {
				id : 'zlid',
				header : fc_zlinfo['zlid'].fieldLabel,
				dataIndex : fc_zlinfo['zlid'].name,
				hidden : true
			}, {
				id : 'daid',
				header : fc_zlinfo['daid'].fieldLabel,
				dataIndex : fc_zlinfo['daid'].name,
				renderer : function(v){
					   var text='';
				   	   DWREngine.setAsync(false);
		        	   baseDao.getData("select dh from Da_Zl where daid='"+v+"' order by dh asc",function(text1){
                                text = text1;
		        	   })
		        	   DWREngine.setAsync(true);
		        	   return text;
				}
			}, {
				id : 'dafileno',
				header : fc_zlinfo['dafileno'].fieldLabel,
				dataIndex : fc_zlinfo['dafileno'].name,
				width : 100
			}, {
				id : 'company',
				header : fc_zlinfo['company'].fieldLabel,
				dataIndex : fc_zlinfo['company'].name,
				width : 200,
				renderer:function(value){
					if(weavArr.length > 0){
						var str = '';
						for(var i = 0;i<weavArr.length;i++){
							if (weavArr[i][0] == value) {
								str = weavArr[i][1]
								break;
							}else{
								str = value;
								//break;
							}
						}
						return str;
					}else{
						return value;
					}
				}
			}, {
				id : 'dafilename',
				header : fc_zlinfo['dafilename'].fieldLabel,
				dataIndex : fc_zlinfo['dafilename'].name,
				width : 100
			}, {
				id : 'stockdate',
				header : fc_zlinfo['stockdate'].fieldLabel,
				dataIndex : fc_zlinfo['stockdate'].name,
				width : 100,
				renderer : formatDate
			}, {
				id : 'dazrz',
				header : fc_zlinfo['dazrz'].fieldLabel,
				dataIndex : fc_zlinfo['dazrz'].name,
				width : 100
			}, {
				id : 'sl',
				header : fc_zlinfo['sl'].fieldLabel,
				dataIndex : fc_zlinfo['sl'].name,
				width : 100
			}, {
				id : 'yc',
				header : fc_zlinfo['yc'].fieldLabel,
				dataIndex : fc_zlinfo['yc'].name,
				width : 100
			}, {
				id : 'dzwd',
				header : fc_zlinfo['dzwd'].fieldLabel,
				dataIndex : fc_zlinfo['dzwd'].name,
				width : 100,
				renderer : fileicon
			}, {
				id : 'rkrq',
				header : fc_zlinfo['rkrq'].fieldLabel,
				dataIndex : fc_zlinfo['rkrq'].name,
				width : 100,
				renderer : formatDate
			}, {
				id : 'yjr',
				header : fc_zlinfo['yjr'].fieldLabel,
				dataIndex : fc_zlinfo['yjr'].name,
				width : 100
			}, {
				id : 'jsr',
				header : fc_zlinfo['jsr'].fieldLabel,
				dataIndex : fc_zlinfo['jsr'].name,
				width : 100
			}, {
				id : 'bz',
				header : fc_zlinfo['bz'].fieldLabel,
				dataIndex : fc_zlinfo['bz'].name,
				width : 100
			}
	]);
	cm_zlinfo.defaultSortable = true;

	var Columns_zlinfo = [
		{
				name : 'infoid',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'dzid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'zlid',
				type : 'string'
			}, {
				name : 'daid',
				type : 'string'
			}, {
				name : 'sl',
				type : 'float'
			}, {
				name : 'xh',
				type : 'string'
			}, {
				name : 'yc',
				type : 'string'
			}, {
				name : 'dafileno',
				type : 'string'
			}, {
				name : 'dafilename',
				type : 'string'
			}, {
				name : 'dazrz',
				type : 'string'
			}, {
				name : 'uint',
				type : 'string'
			}, {
				name : 'dzwd',
				type : 'string'
			}, {
				name : 'rkrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'yc',
				type : 'string'
			}, {
				name : 'yjr',
				type : 'string'
			}, {
				name : 'jsr',
				type : 'string'
			}, {
				name : 'bz',
				type : 'string'
			}, {
				name : 'stockdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'company',
				type : 'string'
			}, {
				name : 'insid',
				type : 'string'
			}, {
				name : 'zllx',
				type : 'float'
			}
	];
			
	ds_zlinfo = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: bean_zl,
			business: business_zl,//'zlMgm',
			method: 'findWhereOrderBy'
			//method: 'findwherezlQuery'
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: ServletUrl
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'dzid'
		}, Columns_zlinfo),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds_zlinfo.setDefaultSort("xh", 'asc');

	var grid_zlinfo = new Ext.grid.GridPanel({
		ds: ds_zlinfo,
		cm: cm_zlinfo,
		sm: sm_zlinfo,
		border: false,
		//tbar : [btnQuery,'-',btnlcfj], // 顶部工具栏，可选
		tbar : [btnQuery,'-'], // 顶部工具栏，可选
		title: '<font color=#15428b><b>&nbsp;'+formPanelTitle+'</b></font>',
		region: 'south',
		header: true,
		split: true,
		height: 300,
		maxHeight: 300,
		minHeight: 300,
		autoScroll: true,
		collapsible: false,
		animCollapse: false,
		loadMask: true,
		viewConfig: {
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
			store: ds_zlinfo,
			displayInfo: true,
			displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		})
	});
	function fileicon(value, metadata, record) {
		if (value != '') {
            if(NTKOWAY&&NTKOWAY!=null&&NTKOWAY==1){
                var type="common";
                var filename;
                var suffix;
                var sql="select fileid,mimetype,filename from  APP_FILEINFO where fileid='"+value+"'";
                DWREngine.setAsync(false);
                db2Json.selectData(sql, function (jsonData) {
                var list = eval(jsonData);
                if(list!=null&&list&&list[0]){
                    type=list[0].mimetype;
                    filename=list[0].filename;
                  }  
                 });
                DWREngine.setAsync(true);
                var downloadStr="下载";
                if(filename){
                    var index=filename.lastIndexOf(".");
                    suffix=filename.substring(index+1,filename.length);             
                }
                if(suffix=="doc"||suffix=="docx"||"application/msword"==type||"application/vnd.openxmlformats-officedocument.wordprocessingml.document"==type){
                    //downloadStr="<img src='" + BASE_PATH+ "jsp/res/images/word.gif'></img>";
                    downloadStr = "打开";
                    return '<center><a href="javascript:showUploadWin( \''+ value+ '\')">'
                                                    + downloadStr + '</a></center>';                
                }else{
                    return "<center><a href='" + BASE_PATH
                            + "servlet/BlobCrossDomainServlet?ac=appfile&fileid="
                            + value + "&pid=" + CURRENTAPPID+"'>下载</a></center>";               
                     }                  
            }else{
                //将合同模块附件打开方式修改为跨域文件下载
                return '<center><a href="javascript:downloadFile(\''+value+'\')"><img src="' + BASE_PATH
                        + 'jsp/res/images/word.gif"></img></a></center>';   
            }
        }
	}

	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [grid, grid_zlinfo]
	});

	viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
	grid.getTopToolbar().items.get('exportXls').hide();
	//grid.getTopToolbar().items.get('showQuery').disable();
	root.select();
	treePanel.render();
	treePanel.expand();

	sm.on('selectionchange', function(){
		var record = sm.getSelected();
		if (record){
			grid_zlinfo.setTitle(
				"<font color=#15428b><b>&nbsp;"
				+ record.get('mc') + " - "
				+ formPanelTitle + "</b></font>"
			);
			
			ds_zlinfo.baseParams.params = ds_pid+"daid='"+record.get('daid')+"'";
			//ds_zlinfo.baseParams.params = " infoid in (select zlid from com.sgepit.pmis.document.hbm.DaDaml where daid='"+record.get('daid')+"')";
			ds_zlinfo.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				},
				callback : function() {
				}
			});
		}
		
	});
	sm_zlinfo.on('selectionchange', function(sm_zlinfo) { // grid 行选择事件
	
				var record = sm_zlinfo.getSelected();
				var tb = grid_zlinfo.getTopToolbar();
				if (record != null) {
					//tb.items.get("lcyj").enable();
					
				} else {
				//	tb.items.get("lcyj").disable();
					
				}
			});
	
	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};
	
	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
	function partbRender(value) {
		var str = '';
		for (var i = 0; i < databzdw.length; i++) {
			if (databzdw[i][0] == value) {
				str = databzdw[i][1]
				break;
			}
		}
		return str;
	}
	function partzyRender(value) {
		var str = '';
		for (var i = 0; i < datazy.length; i++) {
			if (datazy[i][0] == value) {
				str = datazy[i][1]
				break;
			}
		}
		return str;
	}
	function showFlowAdjunct(){
      	var record = sm_zlinfo.getSelected();
		var _insid = record.get('insid');
    	adjunctWindow = new Ext.Window({	               
		title: '查看流程附件',
		iconCls: 'copyUser',
		width: 650,
		height: 300,
		modal: true, layout: 'fit',
		closeAction: 'hide',
		maximizable: false,
		resizable: false,
		plain: true,
		items: [gridAdjunct]
		});
		adjunctWindow.show();
		dsAdjunct.baseParams.params = "insid='"+_insid+"'";
		dsAdjunct.load();
    }
	/*function partbRenderzrz(value) {
		var str = '';
		for (var i = 0; i < partBs.length; i++) {
			if (partBs[i][0] == value) {
				str = partBs[i][1]
				break;
			}
		}
		return str;
	}*/
	treePanel.on('click', function(node) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("treeid").innerText;
		selectedTreeDataIndexid = elNode.all("indexid").innerText;
		var titles = [node.text];
		var obj = node.parentNode;
		var isRoot = (rootText == node.text);
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		tmp_parent = menu_isLeaf;

		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		if (selectedTreeData == null) {
			selectedTreeData = "1";
		}
		grid.params = {
			'indexid': selectedTreeDataIndexid
		}
		ds.baseParams.params =ds_pid+ " indexid in"+getStr(selectedTreeData);
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			},
			callback: function(records){
				(records.length > 0) ?
					grid.getTopToolbar().items.get('showQuery').enable() :
					grid.getTopToolbar().items.get('showQuery').disable()
				
			}
		});
		
		grid_zlinfo.setTitle('<font color=#15428b><b>&nbsp;'+formPanelTitle+'</b></font>');
		ds_zlinfo.baseParams.params = "daid=''";
			ds_zlinfo.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
		
	});
	function  getStr(selectedTreeData){
       if(selectedTreeData == null || selectedTreeData == ''){
        selectedTreeData = '1'
	    }
	   if( selectedTreeData != ""){
	        	strs="(";
	        	DWREngine.setAsync(false);
	        	baseMgm.getData("select indexid from da_tree start with treeid='"+selectedTreeData+"' connect by prior   treeid=parent",
						function(list) {
						  if(list.length == 0) return strs +='';
						  for(var i = 0; i < list.length;i++){
						     if(list.length == 1){
						       strs +="'"+list[i]+"'";
					            break;
						     }
						     if(i < list.length -1 ){
						        strs +="'"+list[i]+"',";
						     }else{
						        strs +="'"+list[i]+"'";
						     }
						  }
						})
				DWREngine.setAsync(true);
				strs  +=")"
	        }
	        return strs;
        } 	
});

function showUploadWin(fileid){
    //使用新的统一的在线打开的文件，此处使用appfile  zhangh 2013-11-25
    var docUrl = BASE_PATH + "jsp/common/open.file.online.jsp" +
                    "?fileid="+fileid+"" +
                    "&filetype=appfile" +
                    "&ModuleLVL="+ModuleLVL;
    window.showModalDialog(docUrl,"","dialogWidth:"
        + screen.availWidth + "px;dialogHeight:"
        + screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
}
