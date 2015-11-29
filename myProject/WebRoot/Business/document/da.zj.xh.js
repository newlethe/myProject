var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.document.hbm.DaZl"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "daid"
var orderColumn = "gdrq"
var gridPanelTitle ="案卷列表"
var formPanelTitle = "档案组卷"
var pageSize = PAGE_SIZE;
var SPLITB = "`"
var treeData = new Array();
var BillState = new Array();
var datazy=new Array();
var damj=new Array();
var treePanel
var data;
var win;
var viewport;
var formWindow;
var partBs = new Array();
var uploadWin
var formPanel
var propertyName = "indexid";
var selectedTreeData = "";
var rootText = "档案分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var formWin;
var selectorgid;
var flag = true;
var dazjWin;
var operate;
var bb=true;
var ss=true;
var currentPid = CURRENTAPPID;
var ds_pid="pid='"+currentPid+"' and ";
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
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
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
		baseParams.parent = parent;

		})


	var btnDaQuery=new Ext.Button({
		id : 'DaQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler :QueryDaWinwdow
	});
	var dazl = new Ext.Button({
		id : 'dazl',
		text : '销毁档案组卷中资料',
		tooltip : '销毁档案组卷中资料',
		iconCls : 'btn',
		handler : dazlwin
	});
	
	// /////////////////////////////////////////////////////////////////////////
	DWREngine.setAsync(false);
    appMgm.getCodeValue('档案密级',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			damj.push(temp);			
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
	DWREngine.setAsync(true);
	var damjStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : damj
    });
    var zyStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : datazy
    });
    
	var dsindexid = new Ext.data.SimpleStore({fields: [], data: [[]]});
	sm = new Ext.grid.CheckboxSelectionModel()
	var fm = Ext.form; // 包名简写（缩写）
	
	var fc = { // 创建编辑域配置
		'pid' : {name : 'pid',fieldLabel : '工程项目编号',hidden : true,hideLabel : true,anchor : '95%'},
		'daid' : {name : 'daid',fieldLabel : '主键',readOnly : true,hidden : true,hideLabel : true,anchor : '95%'},
		'indexid' : {name : 'indexid',fieldLabel : '分类条件',readOnly : true,hidden : true,hideLabel : true,anchor : '95%'},
		'mc' : {name : 'mc',fieldLabel : '案卷题名',width: 600,anchor:'95%'},
		'gdrq' : {name : 'gdrq',fieldLabel : '归档日期',width : 45,allowBlank: false,format : 'Y-m-d',minValue : '2000-01-01',anchor : '95%'},
		'dagh' : {name : 'dagh',fieldLabel : '档案馆号',anchor : '95%'},
		'swh' : {name : 'swh',fieldLabel : '缩微号',anchor : '95%'},
		'bzdw' : {name : 'bzdw',fieldLabel : '立卷单位',anchor:'95%'},
		'bgqx' : {name : 'bgqx',fieldLabel : '保管期限',anchor : '95%'},
		'mj' : {
			name : 'mj',
			fieldLabel : '密级',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选密级...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: damjStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			anchor : '95%'
		},
		'bzrq' : {name : 'bzrq',fieldLabel : '起止日期',anchor : '95%'},
		'sl' : {name : 'sl',fieldLabel : '数量',hidden : true,hideLabel : true,anchor : '95%'},
		'ztc' : {name : 'ztc',fieldLabel : '主题词',hidden : true,hideLabel : true,width: 600,anchor:'95%'},
		'flmc' : {name : 'flmc',fieldLabel : '分类名称',anchor : '95%'},
		'bfjs':{name : 'bfjs',fieldLabel : '件数',anchor : '95%'},
		'bfys':{name : 'bfys',fieldLabel : '每份页数',hidden : true,hideLabel : true,anchor : '95%'},
		'kwh':{name : 'kwh',fieldLabel : '库位号',anchor : '95%'},
		'bz' :{name : 'bz',fieldLabel : '备注',height: 120,width: 600,xtype: 'htmleditor',anchor:'95%'},
		'jnsm':{name : 'jnsm',fieldLabel : '卷内说明',width: 600,anchor:'95%'},
		'ljr':{name : 'ljr',fieldLabel : '立卷人',anchor : '95%'},
		'ljrq' : {name : 'ljrq',fieldLabel : '立卷日期',width : 45,allowBlank: false,format : 'Y-m-d',minValue : '2000-01-01',anchor : '95%'},
		'jcr':{name : 'jcr',fieldLabel : '检查人',anchor : '95%'},
		'jcrq' : {name : 'jcrq',fieldLabel : '检查日期',width : 45,allowBlank: false,format : 'Y-m-d',minValue : '2000-01-01',anchor : '95%'},
		'daState':{name : 'daState',fieldLabel : '档案状态',anchor : '95%'},
		'dabh':{name : 'dabh',fieldLabel : '档案号',anchor : '95%'},
		'hjh':{name : 'hjh',fieldLabel : '互见号',anchor : '95%'},
		'dh':{name : 'dh',fieldLabel : '档号',anchor : '95%'},
		'orgid':{name : 'orgid',fieldLabel : '部门ID',hidden : true,hideLabel : true,anchor : '95%'},
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
		'wbxs':{name : 'wbxs',fieldLabel : '文本形式',anchor : '95%'},
		'filelsh':{name : 'filelsh',fieldLabel : '电子文档',anchor : '95%'},
		'filename':{name : 'filename',fieldLabel : '文件名称',anchor : '95%'},
		'jcjsh':{name : 'jcjsh',fieldLabel : '卷册检索号',anchor : '95%'},
		'zys':{name : 'zys',fieldLabel : '总页数',anchor : '95%'}
		
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, // 第0列，checkbox,行选择器
			new Ext.grid.RowNumberer({
			header : '序号',
			 width : 38
			 }),// 计算行数
			{
				id : 'daid',
				header : fc['daid'].fieldLabel,
				dataIndex : fc['daid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'dh',
				header : fc['dh'].fieldLabel,
				dataIndex : fc['dh'].name,
				width : 200
			},{
				id :'zys',
				header : fc['zys'].fieldLabel,
				dataIndex : fc['zys'].name,
				width : 100
			},
			{
				id : 'jcjsh',
				header : fc['jcjsh'].fieldLabel,
				dataIndex : fc['jcjsh'].name,
				width : 200
			},
			{
				id : 'bzrq',
				header : fc['bzrq'].fieldLabel,
				dataIndex : fc['bzrq'].name,
				width : 150
			},
			{
				id : 'mc',
				header : fc['mc'].fieldLabel,
				dataIndex : fc['mc'].name,
				width : 300
			}, {
				id : 'bzdw',
				header : fc['bzdw'].fieldLabel,
				dataIndex : fc['bzdw'].name,
				width : 200
			},{
				id : 'gdrq',
				header : fc['gdrq'].fieldLabel,
				dataIndex : fc['gdrq'].name,
				width : 150,
				renderer : formatDate
			}, {
				id : 'bgqx',
				header : fc['bgqx'].fieldLabel,
				dataIndex : fc['bgqx'].name,
				width : 150,
				renderer : function(Value) {
					if (Value == 1) {
						return '短期'
					}
					if (Value == 2) {
						return '长期'
					}
					if (Value == 3) {
						return '永久'
					}
				}
			}, {
				id : 'mj',
				header : fc['mj'].fieldLabel,
				dataIndex : fc['mj'].name,
				width : 100
			}, 
			{
				id : 'zy',
				header : fc['zy'].fieldLabel,
				dataIndex : fc['zy'].name,
				width : 150
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
				width : 150
			}, {
				id : 'ljr',
				header : fc['ljr'].fieldLabel,
				dataIndex : fc['ljr'].name,
				width : 150
			}, {
				id : 'ljrq',
				header : fc['ljrq'].fieldLabel,
				dataIndex : fc['ljrq'].name,
				width : 150,
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
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
		name : 'daid',
		type : 'string'
	}, // Grid显示的列，必须包括主键(可隐藏)
			{name : 'pid',type : 'string'},
			{name : 'indexid',type : 'string'},
			{name : 'mc',type : 'string'}, 
			{name : 'gdrq',type : 'date',dateFormat : 'Y-m-d H:i:s'}, 
			{name : 'dagh',type : 'string'}, 
			{name : 'swh',type : 'string'
			}, {name : 'bzdw',type : 'string'
			}, {name : 'bgqx',type : 'string'
			}, {name : 'mj',type : 'string'
			}, {name : 'bzrq',type : 'string'
			},{name : 'sl',type : 'float'
			},{name : 'ztc',type : 'string'
			}, {name : 'flmc',type : 'string'
			}, {name : 'bfjs',type : 'float'
			}, {name : 'bfys',type : 'float'
			},{name : 'kwh',type : 'string'
			},{name : 'bz',type : 'string'
			},{name : 'jnsm',type : 'string'
			},{name : 'ljr',type : 'string'
			},{name : 'ljrq',type : 'date',dateFormat : 'Y-m-d H:i:s'
			},{name : 'jcr',type : 'string'
			},{name : 'jcrq',type : 'date',dateFormat : 'Y-m-d H:i:s'
			},{name : 'daState',type : 'float'
			},{name : 'dabh',type : 'string'
			},{name : 'hjh',type : 'string'
			},{name : 'dh',type : 'string'
			},
			{name : 'orgid',type : 'string'
			},
			{name : 'zy',type : 'string'
			},
			{name : 'wbxs',type : 'float'
			},
			{name : 'filelsh',type : 'string'
			},
			{name : 'filename',type : 'string'
			},
			{name : 'jcjsh',type : 'string'
			},{name : 'zys',type : 'string'
			}
			
			];
	var Fields = Columns.concat([ // 表单增加的列
	      
			])

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	PlantInt = {
		daState:0,
		ljr:username,
		mc: '',
		jcrq:new Date,
		zys :0
	}; // 初始值
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
		jcrq: new Date
	});

	// 4. 创建数据源

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params :ds_pid+" indexid like '%"+selectedTreeData+"%'  "
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : ServletUrl
		}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),

		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
	// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
	});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
	
	// 5. 创建可编辑的grid: grid-panel
	grid = new Ext.grid.EditorGridTbarPanel({
		// basic properties
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		// renderTo: 'editorgrid', //所依附的DOM对象，可选
		tbar : ['-',dazl,'-',btnDaQuery,'-'], // 顶部工具栏，可选
		// width : 800, //宽
		title : gridPanelTitle, // 面板标题
		// iconCls: 'icon-show-all', //面板样式
		border : false, // 
		region : 'center',
		clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
		header : true, //
		// frame: false, //是否显示圆角边框
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
//			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),

		// expend properties
		plant : Plant, // 初始化记录集，必须
		plantInt : PlantInt, // 初始化记录集配置，必须
		servletUrl : ServletUrl, // 服务器地址，必须
		bean : bean, // bean名称，必须
		business : "baseMgm", // business名称，可选
		primaryKey : primaryKey,
		addBtn:false,
		saveBtn:false,
		delBtn:false
	});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE,
			params : "pid="+currentPid//+ " indexid in"+getStr(selectedTreeData)
		}
	});

	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [grid]
	});

	viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});

	// /////////////////////////////////////////////////////
	root.select();
//    grid.showHideTopToolbarItems("save", false);
//    grid.showHideTopToolbarItems("refresh", false);
//	var gridTopBar = grid.getTopToolbar()
//	with (gridTopBar) {
//		add('-',dazl,'-',btnDaQuery,'-');
//	}
	// 11. 事件绑定
	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					tb.items.get("dazl").enable();
				} else {
					tb.items.get("dazl").disable();
				}
				if (formWindow != null && !formWindow.hidden) {
					
				}
			});
	treePanel.render();
	treePanel.expand();

	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};
	
	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
	
    ////////////////////////////////////////////////////
	function QueryDaWinwdow() {
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
				items : [QueryDAPanel]
			});
		}
		QueryDAPanel.getForm().reset();
		formWin.show();
	}
   function dazlwin(){
	     if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要销毁组卷的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
        var record = sm.getSelected();
		var id = record.get('daid');
		if (!dazjWin) {
			dazjWin = new Ext.Window({
				title : '组卷信息',
				layout : 'fit',
				border : false,
      			modal : true,
				width : document.body.clientWidth,
				height : document.body.clientHeight,
				closeAction : 'hide',
				items : [new Ext.Panel({
							contentEl : 'dazjDiv'
						})]
		});
	}
		
	dazjWin.show();
    
	if (dazjWin) {
		document.all('dazjIFrame').src = "Business/document/da.zl.info.xh.jsp?id="+id
	}
   }
   
	
	
	
	

	function fileicon(value) {
		if (value != '') {
			return "<center><a href='" + BASE_PATH
					+ "servlet/MainServlet?ac=downloadfile&fileid="
					+ value + "'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>"
		} else {

		}
	}

	
	treePanel.on('click', function(node) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("treeid").innerText;
		selectedBM = elNode.all("bm").innerText;
		PlantInt.indexid = elNode.all("indexid").innerText;
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
		ds.baseParams.params = ds_pid+ " indexid in"+getStr(selectedTreeData);
		ds.load({
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
/*移除html标签和空格
		*/
	 function   Del(Word)   {   
		  a =Word.indexOf("<");   
		  b =Word.indexOf(">");   
		  len =Word.length;   
		  c  =Word.substring(0,   a);   
		  if(b ==-1)   
		  b  =a;   
		  d  =Word.substring((b   +   1),   len);   
		  Word  =c+d;   
		  tagCheck =Word.indexOf("<");   
		  if(tagCheck!=-1)   
		  Word =Del(Word);  
	  	  re=new   RegExp("&nbsp;","ig");   
	      var ss =Word.replace(re,"");        
		  return   ss;   
	  }   
