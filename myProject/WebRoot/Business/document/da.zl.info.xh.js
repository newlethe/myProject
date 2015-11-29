var ServletUrl = MAIN_SERVLET
var beanA = "com.sgepit.frame.flow.hbm.ZlInfo"
var bean = "com.sgepit.pmis.document.hbm.DaDaml"
var business = "zlMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "dzid"
var orderColumn = "xh"
var gridPanelTitle = "组卷信息"
var pageSize = PAGE_SIZE;
var SPLITB = "`"
var data;
var win;
var viewport;
var formWindowA;
var inputWindow
var partBs = new Array();
var zjinfoWin
var formPanel
var propertyName = "xh";
var selectedTreeData = "";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var formWin;
var selectorgid;
var flag = true;
var currentRowIndex = 0
var uploadWin;
var zlno;
var zrz;
var zltypelist = new Array();
var jzhType = [[0, '未移交'], [1, '申请移交'], [2, '已入库'], [3, '已归档'], [4, '新增'], [8, '档案销毁']];//8档案中资料销毁
var xhArray = [[2,'未销毁'],[8,'已销毁']];//8标识销毁
Ext.onReady(function() {
	var xhStr = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : xhArray
	});
	DWREngine.setAsync(false);
	appMgm.getCodeValue('资料类型', function(list) { //获取编制单位类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					zltypelist.push(temp);
				}
			});
	DWREngine.setAsync(true);
	var zltypeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : zltypelist
			});
	//记录前一条记录的值;
	var cookprovider = new Ext.state.CookieProvider()
	Ext.state.Manager.setProvider(cookprovider)
	currentRowIndex = Ext.state.Manager.get("zlRow")
	var dsJzhType = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : jzhType
			});


	var xhBtn = new Ext.Button({
				id : 'xh_id',
				text : '销毁',
				tooltip : '销毁',
				iconCls : 'btn',
				handler : xhFun
			});
	var btnQuery = new Ext.Button({
		id : 'showQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler : queryFun
	});	
	
    var xhCombo = new Ext.form.ComboBox({
		id : 'xh_combo',
		fieldLabel : '是否销毁',
		readOnly : true,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		typeAhead : true,
		triggerAction : 'all',
		store : xhStr,
		lazyRender : true,
		listClass : 'x-combo-list-small',
		anchor : '95%',
		listeners:{'collapse':function(com){
			if(com.value==8){
				 xhBtn.setDisabled(true);
				 ds.baseParams.params = " zlid in(select infoid  from com.sgepit.frame.flow.hbm.ZlInfo where  billstate='8') and daid like '%" + selectdaid + "%'";
				 ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
			}else{xhBtn.setDisabled(false);
				ds.baseParams.params = "  zlid in(select infoid from com.sgepit.frame.flow.hbm.ZlInfo where billstate='3') and  daid like '%" + selectdaid + "%'"
				 ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
			}
        }}
	})	
	sm = new Ext.grid.CheckboxSelectionModel()
	var fm = Ext.form; // 包名简写（缩写）

	var fc = { // 创建编辑域配置
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '状态',
			anchor : '95%'
		},
		'dzid' : {
			name : 'dzid',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
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


	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm,	// 第0列，checkbox,行选择器
			//new Ext.grid.RowNumberer({
			//header : '序号',
			// width : 40
			// }),// 计算行数
			{
				id : 'xh',
				header : fc['xh'].fieldLabel,
				dataIndex : fc['xh'].name,
				width : 100,
				editor : new fm.NumberField(fc['xh'])
			}, {
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				renderer : function(Value,cellmeta,record,rowIndex,columnIndex,store) {
					var revalue="";
					DWREngine.setAsync(false);
				 	baseMgm.getData("select billstate from zl_info where infoid='"+record.data.zlid+"'",function(list){  
				 		if(list){
				 			if(list[0]=="3"){
				 				revalue= "已归档"
				 			}else if(list[0]=="8"){
				 				revalue= "档案销毁"
				 			}
				 		}
				    });
				 	DWREngine.setAsync(true);
				 	return revalue;
				}
			},  {
				id : 'dzid',
				header : fc['dzid'].fieldLabel,
				dataIndex : fc['dzid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
				// editor: new fm.TextField(fc['pid'])
		}	, {
				id : 'zlid',
				header : fc['zlid'].fieldLabel,
				dataIndex : fc['zlid'].name,
				hidden : true
			}, {
				id : 'daid',
				header : fc['daid'].fieldLabel,
				dataIndex : fc['daid'].name,
				hidden : true
			}, {
				id : 'dafileno',
				header : fc['dafileno'].fieldLabel,
				dataIndex : fc['dafileno'].name,
				width : 100
			}, {
				id : 'company',
				header : fc['company'].fieldLabel,
				dataIndex : fc['company'].name,
				width : 200
			}, {
				id : 'dafilename',
				header : fc['dafilename'].fieldLabel,
				dataIndex : fc['dafilename'].name,
				width : 100
			}, {
				id : 'stockdate',
				header : fc['stockdate'].fieldLabel,
				dataIndex : fc['stockdate'].name,
				width : 100,
				renderer : formatDate
			}, {
				id : 'dazrz',
				header : fc['dazrz'].fieldLabel,
				dataIndex : fc['dazrz'].name,
				width : 100
			}, {
				id : 'sl',
				header : fc['sl'].fieldLabel,
				dataIndex : fc['sl'].name,
				width : 100
			}, {
				id : 'yc',
				header : fc['yc'].fieldLabel,
				dataIndex : fc['yc'].name,
				width : 100
			}, {
				id : 'dzwd',
				header : fc['dzwd'].fieldLabel,
				dataIndex : fc['dzwd'].name,
				width : 100,
				renderer : fileicon
			}, {
				id : 'rkrq',
				header : fc['rkrq'].fieldLabel,
				dataIndex : fc['rkrq'].name,
				width : 100,
				renderer : formatDate
			}, {
				id : 'yjr',
				header : fc['yjr'].fieldLabel,
				dataIndex : fc['yjr'].name,
				width : 100
			}, {
				id : 'jsr',
				header : fc['jsr'].fieldLabel,
				dataIndex : fc['jsr'].name,
				width : 100
			}, {
				id : 'bz',
				header : fc['bz'].fieldLabel,
				dataIndex : fc['bz'].name,
				width : 100
			}

	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'infoid',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'billstate',
				type : 'string'
			},
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


	// 4. 创建数据源
	
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			//params :"daid"+selectdaid+";"
			params : "zlid in(select infoid  from com.sgepit.frame.flow.hbm.ZlInfo where  billstate='8' or billstate='3') and  daid like '%" + selectdaid + "%' "
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
		saveBtn:false,
		addBtn:false,delBtn:false,
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		//tbar : [], // 顶部工具栏，可选
		border : false, // 
		region : 'center',
		clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
		header : true, //
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			//			forceFit : true,
			ignoreAdd : true
		},
		tbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),

		// expend properties
		servletUrl : ServletUrl, // 服务器地址，必须
		bean : bean, // bean名称，必须
		business : "baseMgm", // business名称，可选
		primaryKey : primaryKey // 主键列名称，必须
		});

	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE,
					//params :"daid`"+selectdaid+";"
					params :  "zlid in(select infoid  from com.sgepit.frame.flow.hbm.ZlInfo where  billstate='8' or billstate='3') and  daid like '%" + selectdaid + "%' "
				},
				callback : function() {
					grid.getSelectionModel().selectRow(currentRowIndex)
				}
			});

	////////////////////////////////////////////////////////////	// //////////////////////////////////////////
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
				items : [contentPanel]
			});

	grid.showHideTopToolbarItems("refresh", false);
	var gridTopBar = grid.getTopToolbar()
	with (gridTopBar) {
		add("是否销毁:",xhCombo,xhBtn);//,'-','文件材料题名:',new Ext.form.TextField({id:'searchText',emptyText:'输入文件名'}),'-', btnQuery,'->');
		
	}

	// 11. 事件绑定
/*	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					tb.items.get("xh_id").enable();
				} else {
					tb.items.get("xh_id").disable();
				}
			});
	sm.on('rowselect', function(sm, rowIndex, record) {
				zlno = record.get('dafileno');
				zrz = record.get('company');
				Ext.state.Manager.set("zlRow", rowIndex)
			})*/
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

	function fileicon(value, metadata, record) {
		if (value != '') {
			var zltype = record.get('zllx');
			var url = BASE_PATH;
			if (zltype == 8) {
				url += "servlet/FlwServlet?ac=loadFile&fileid=" + value;
			} else if (zltype == 9) {
				url += "servlet/FlwServlet?ac=loadAdjunct&fileid=" + value;
			} else {
				//url += "servlet/MainServlet?ac=attach&action=download&fileid="
				url += "servlet/MainServlet?ac=downloadfile&fileid="
						+ value;
				//alert(zltype+"====="+url);
			}
			return "<center><a href='" + url + "'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>"
		} else {
			var infoid = record.get('infoid');
			return "<center><a href='javascript:showBlobListWin(\"" + infoid + "\")'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>"
		}
	}
	
	function queryFun(){
		
	}
	
	function xhFun(){
	    var records=grid.getSelectionModel().getSelections();
		if(records.length<1||records==""){
			Ext.MessageBox.alert('提示','请选择要销毁的资料记录!')
		}else{
			var infoids="";
			for(var i=0;i<records.length;i++){
				infoids+=records[i].get('zlid')+","
			}
			Ext.MessageBox.confirm('确认销毁','资料销毁不能恢复，请确认操作？',function(btn){
			if('yes'==btn){
				DWREngine.setAsync(false);
		    	zlMgm.updateDaXh(infoids,function(dat){
					if(dat){
						Ext.MessageBox.alert('提示','销毁成功!');
						ds.reload();
					}else{Ext.MessageBox.alert('提示','销毁失败!');}
		    	});
		    	DWREngine.setAsync(true);
			}else{return;}
		})
			
		}
	}
});

//显示多附件的文件列表
function showBlobListWin(infoid){
	var title = '文件列表';
	var whereCondition = ""

	DWREngine.setAsync(false);
    if (infoid != null && infoid!=''){
	   	zlMgm.getZlFileLshs(infoid, function(dat){
	   		whereCondition = dat;
	   	});
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/Business/document/fileUploadSwf_zl.jsp?openType=url&editable=false&whereCondition="+whereCondition;
	fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	DWREngine.setAsync(true);
}