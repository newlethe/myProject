var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.frame.flow.hbm.ZlInfo";
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "infoid"
var orderColumn = "stockdate"
var depttitle = USERORG.split(",");
var gridPanelTitle = depttitle[0] + "--部门资料"
var formPanelTitle = "部门资料信息"
var pageSize = PAGE_SIZE;
var SPLITB = "`"
var treeData = new Array();
var BillState = new Array();
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
var selectedIndexid = "";
var selectTreeid =""
var rootText = "资料分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var formWin;
var selectorgid;
var flag = true;
var orgdata='';
var SPLITString= "~"
var Bill = new Array();
var zltypelist=new Array();
var adjunctWindow;
var changeBtn ="";
var businessId = "";
var editable = true;
var businessType = "zlMaterial";
var winTitle ="资料附件上传";
var jzhType = [[0,'未移交'],[1,'申请移交'],[2,'已入库'],[3,'已归档']];
var reportArgs1 = new Object();
var currentPid = CURRENTAPPID;
var indexidStr = new Array();
var weavArr = new Array();
var weavList;
var isInitYhFlag=false;//用于添加页号中间的"-"
Ext.onReady(function() {
	DWREngine.setAsync(false);
	var userid;
	zlMgm.getuserId(USERNAME,function(value){  
			userid=value;
       	});

       	orgdata = USERDEPTID;

	appMgm.getCodeValue('资料类型',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			zltypelist.push(temp);			
		}
    });
     appMgm.getCodeValue('责任者',function(list){ 
    	weavList = list;        //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			weavArr.push(temp);			
		}
    });
	zlMgm.getdeptname(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].orgid);
			temp.push(list[i].orgname);
			BillState.push(temp);

		}
	});
	
	baseMgm.getData("select indexid,mc from zl_tree",function(list){
	    if(list.length>0){
	       for(var i=0;i<list.length;i++){
	          var temp = new Array();
	          temp.push(list[i][0]);
	          temp.push(list[i][1]);
	          indexidStr.push(temp);
	       }
	    }
	})
	DWREngine.setAsync(true);
	var zltypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : zltypelist
    });
	var dsJzhType = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : jzhType
		});
	var weavStore = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data :  weavArr
		});
	weavStore.loadData(weavArr);
	var dsdeptname = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : BillState
	});
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "zlTree",
			businessName : "zldaMgm",
			orgid : orgdata,
			parent : 0,
			pid : currentPid
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'zl-tree-panel',
		region : 'west',
		split : true,
		width : 205,
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
			header : '资料名称',
			width : 260,
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
		baseParams.orgid = orgdata;
		baseParams.parent = parent;

		})


	var btnReturn = new Ext.Button({
		text : '返回',
		tooltip : '返回',
		iconCls : 'returnTo',
		handler : function() {
			history.back();
		}
	});
    
    var btnlcfj = new Ext.Button({
		id : 'lcyj',
		text : '查看流程附件',
		tooltip : '查看流程附件',
		iconCls : 'btn',
		disabled : true,
		handler : showFlowAdjunct
	});
	var btnPayInfo = new Ext.Button({
		id : 'yj',
		text : '申请移交',
		tooltip : '申请移交',
		iconCls : 'btn',
		disabled : true,
		handler : doLoad
	});
	var btnback = new Ext.Button({
		id : 'zluntread',
		text : '收回资料',
		tooltip : '收回资料',
		iconCls : 'btn',
		disabled : true,
		handler : untread
	});
	var btnPrint = new Ext.Button({
		id : 'print',
		text : '打印',
		tooltip : '打印',
		iconCls : 'print',
		//disabled : true,
		handler : PrintWinwdow
	});
	var update = new Ext.Button({
		id : 'update',
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : updatedept
	});
	var reset = new Ext.Button({
		id : 'reset',
		text : '查重',
		tooltip : '查重',
		iconCls : 'btn',
		handler : function reset(){
			ds.sort("fileno","ASC");
		}	
	});
	function PrintWinwdow() {
		if (tmp_parent != true) {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择子节点！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}
		with (document.all.dbnetcell0) {
			code = "inf" // 模块编号
			report_no = "infdaml" // 报表编号
			reportArgs = new Object() // 报表参数，可用变量赋值以对应不同的记录
			onReportOpened = "reportOpened"
			reportArgs.infyj = USERORGID// 报表参数的值 bc	部门编号
			reportArgs.inftitle=selectedTreeData//分类编码
			reportArgs1.infyj = USERORGID// 报表参数的值 bc	部门编号
			reportArgs1.inftitle=selectedTreeData//分类编码
			open() // 调用open方法打开报表，返回流水号
		}
		
		var hd_checker = Ext.getCmp("grid-panel").getEl().select('div.x-grid3-hd-checker');
		var hd = hd_checker.first();   
		//清空表格头的checkBox    
		if(hd.hasClass('x-grid3-hd-checker-on')){  
		   hd.removeClass('x-grid3-hd-checker-on');  
		 }  
		sm.clearSelections(); 

	}
	// /////////////////////////////////////////////////////////////////////////

	var btnQuery = new Ext.Button({
		id : 'showQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler : QueryWinwdow
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
	
	function doLoad() {
		var modName = "资料" + this.text
		var record = sm.getSelections();// 得到选择的记录
		if(record == null || record == ""){
		   Ext.example.msg("信息提示",'请选择您要申请移交的资料！');
		   return;
		}
		if (record != null) {
			 for(var i = 0; i < record.length; i++){
						var id = record[i].get('infoid');
						var state = record[i].get('billstate');
						var ids = new Array();
						if(state==1||state==2||state==3){
									Ext.MessageBox.show({
										title : '警告',
										msg : '该条资料信息已移交或者已入库！请选择其它资料！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.WARNING
									});
									return;
										
								}
							else{
								DWREngine.setAsync(false);
								for (var i = 0; i < record.length; i++) {
									ids.push(record[i].get('infoid'));
					
								}
								zlMgm.ZlHandoverOk(ids,1)
								DWREngine.setAsync(true);
					
								Ext.example.msg('移交成功！', '您成功移交了' + ids.length + '条资料信息！');
								sm.clearSelections();
								ds.reload("no68");
						}
			        }
		} else {
			Ext.MessageBox.show({
				title : '警告',
				msg : '请选择要申请移交的资料！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
	}

	var dsindexid = new Ext.data.SimpleStore({
	      fields: ['k','v'], 
	      data: indexidStr
	 });
	sm = new Ext.grid.CheckboxSelectionModel()
	var fm = Ext.form; // 包名简写（缩写）
	
	var fc = { // 创建编辑域配置
			'billstate' : {
			name : 'billstate',
			fieldLabel : '状态',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsJzhType,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'infoid' : {
			name : 'infoid',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			// allowBlank: false,
			anchor : '95%'
		},
		'indexid' : {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			mode : 'local',
			//hidden : true,
			editable:false,
			allowBlank: false,
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            store: dsindexid,
			tpl: "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor : '95%'
		},
		'fileno' : {
			name : 'fileno',
			fieldLabel : '文件编号',
			// allowBlank: false,
			anchor : '95%'
		},
		'responpeople' : {
			name : 'responpeople',
			fieldLabel : '录入人',
			anchor : '95%'
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
		'materialname' : {
			name : 'materialname',
			fieldLabel : '文件材料题名',
			allowBlank : false,
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
		'quantity' : {
			name : 'quantity',
			fieldLabel : '每份页数',
			anchor : '95%'
		},
		'weavecompany' : {
			name : 'weavecompany',
			fieldLabel : '责任者',
			allowBlank : false,
			anchor : '95%'
		},
		'book' : {
			name : 'book',
			fieldLabel : '单位',
			allowBlank : false,
			anchor : '95%'
		},
		'portion' : {
			name : 'portion',
			fieldLabel : '份数',
			allowBlank : false,
			anchor : '95%'
		},
		'orgid' : {
			name : 'orgid',
			fieldLabel : '部门名称',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsdeptname,
			lazyRender : true,
			hidden : true,
			hideLabel : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'filename' : {
			name : 'filename',
			fieldLabel : '附件文件名称',
			anchor : '95%'
		},
		'filelsh':{
			name : 'filelsh',
			fieldLabel : '电子文档',
			anchor : '95%'
		},
		'infgrade':{
			name : 'infgrade',
			fieldLabel : '资料电子文档密级',
			anchor : '95%'
		},
		'remark' :{
			name : 'remark',
			fieldLabel : '备注',
			height: 120,
			width: 600,
//			xtype: 'htmleditor',
			anchor:'95%'
		},
		'rkrq' : {
			name : 'rkrq',
			fieldLabel : '入库日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'zltype' : {
			name : 'zltype',
			fieldLabel : '资料类型',
			allowBlank : false,
			anchor : '95%'
		},
		'flwinsid' : {
			name : 'flwinsid',
			fieldLabel : '流程实例',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'yjTableAndId' : {
		    name : 'yjTableAndId',
			fieldLabel : '业务模板资料移交表和主键',
			hidden : true,
			hideLabel : true,
			anchor : '95%'		    
		}	,'yh' : {
			name : 'yh',
			fieldLabel : '页号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
			 new Ext.grid.RowNumberer({
			 }),// 计算行数
			sm, 
			{
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				width : 55,
				renderer : function(Value) {
					if (Value == 0) {
						return '未移交'
					}
					if (Value == 1) {
						return '申请移交'
					}
					if (Value == 2) {
						return '已入库'
					}
					if (Value == 3) {
						return '已归档'
					}
				}
			},
			{
				id : 'infoid',
				header : fc['infoid'].fieldLabel,
				dataIndex : fc['infoid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'orgid',
				header : fc['orgid'].fieldLabel,
				dataIndex : fc['orgid'].name,
				hidden : true,
				renderer : partbRender
			}, {
				id : 'fileno',
				header : fc['fileno'].fieldLabel,
				dataIndex : fc['fileno'].name,
				width : 200,
				//align : 'center',
				renderer:function(value,cs,re){
					var str = '';
					var orgid = re.get("orgid");
					DWREngine.setAsync(false);
					baseMgm.getData("select count(*),t.fileno from ZL_INFO t where ORGID='"+orgid+"'group by t.fileno having count(*)>1",function(list){
						if(list.length >0){
							for(var i = 0;i<list.length;i++){
								if(value == list[i][1]){
									str = list[i][1];
								}
							}
						}
						
					});
					DWREngine.setAsync(true);
					if(str == value){
						return "<font color=red>"+str+"</font>";
					}else{
						return value;
					}
				}
			}, {
				id : 'materialname',
				header : fc['materialname'].fieldLabel,
				dataIndex : fc['materialname'].name,
				width : 300,
				renderer:function(data, metadata, record, rowIndex,
                        columnIndex, store){
                          var data1=data;
                          var getFileLsh = record.get('filelsh');
                          if(getFileLsh == null || getFileLsh == ""){
                             return data1;
                          }else{
//	                          var index=data.lastIndexOf(".");
//	                          if(index>0){
//	                            data1=data.substring(0,index);
//	                          }
//	                        	return data1;
                          	   var FileName = data1.substring(data1.lastIndexOf('.')+1, data1.length).toLowerCase();
	                           var reg = /\.\w+$/; //文件后缀名称不确定
                               return data1.replace(reg,'');
                          	  }
                        }
			}, {
				id : 'stockdate',
				header : fc['stockdate'].fieldLabel,
				dataIndex : fc['stockdate'].name,
				width : 80,
				renderer : formatDate
			}, {
				id : 'weavecompany',
				header : fc['weavecompany'].fieldLabel,
				dataIndex : fc['weavecompany'].name,
				width : 160,
				renderer:function(value){
					if(weavList .length > 0){
						var str = '';
						for(var i = 0;i<weavList.length;i++){
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
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				width : 120,
				align : 'center',
				renderer : fileicon
			}, {
				//hidden:true,
				id : 'portion',
				header : fc['portion'].fieldLabel,
				dataIndex : fc['portion'].name,
				width : 50
			},
			{
				hidden:true,
				id : 'quantity',
				header : fc['quantity'].fieldLabel,
				dataIndex : fc['quantity'].name,
				width : 80
			},{
				//hidden:true,
				id : 'book',
				header : fc['book'].fieldLabel,
				dataIndex : fc['book'].name,
				width : 50,
				renderer : bookNumUnitRender
			}, {
				id : 'responpeople',
				header : fc['responpeople'].fieldLabel,
				dataIndex : fc['responpeople'].name,
				align : 'center',
				hidden : true,
				width : 40
			},{
				id : 'indexid',
				header : fc['indexid'].fieldLabel,
				dataIndex : fc['indexid'].name,
				hidden : true,
				//width : 100,
				editor: comboxWithTree,
				renderer : function(v){
				     for(var i=0;i<indexidStr.length;i++){
				         if(v == indexidStr[i][0])
				           return indexidStr[i][1];
				     }
				}
			}, {
				id : 'zltype',
				header : fc['zltype'].fieldLabel,
				dataIndex : fc['zltype'].name,
				renderer:zlTypeName
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				width : 200,
				align : 'center'
			},{
			    id : 'yjTableAndId',
			    header : '业务模板资料移交表和主键',
				dataIndex : 'yjTableAndId',
				width : 0,
				hidden : true
                  			
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序
	
	// 3. 定义记录集
	var Columns = [{
		name : 'infoid',
		type : 'string'
	}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'fileno',
				type : 'string'
			}, {
				name : 'filelsh',
				type : 'string'
			}, {
				name : 'filename',
				type : 'string'
			}, {
				name : 'materialname',
				type : 'string'
			}, {
				name : 'indexid',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'stockdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'quantity',
				type : 'float'
			}, {
				name : 'responpeople',
				type : 'string'
			}, {
				name : 'yjr',
				type : 'string'
			}, {
				name : 'jsr',
				type : 'string'
			}, {
				name : 'weavecompany',
				type : 'string'
			}, {
				name : 'book',
				type : 'float'
			}, {
				name : 'portion',
				type : 'float'
			}, {
				name : 'orgid',
				type : 'string'
			},
			 {
				name : 'zltype',
				type : 'float'
			}, {
				name : 'rkrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},
			{
				name : 'billstate',
				type : 'float'
			},
			{
				name : 'flwinsid',
				type : 'string'
			},{
			    name : 'yjTableAndId',
			    type : 'string'
			},{
				name : 'yh',
				type : 'string'			   
			}];
	var Fields = Columns.concat([ // 表单增加的列
			{
				name : 'filename',
				type : 'string'
			}, {
				name : 'infgrade',
				type : 'float'
			}])

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	PlantInt = {
		fileno : '',
		pid : currentPid,
		materialname : '',
		indexid : '',
		quantity : '',
		billstate : '0',
		responpeople : username,
		filename : '',
		remark : '',
		weavecompany : '',
		book : '',
		portion : '',
		orgid : USERORGID,
		stockdate : '',
		filelsh : '',
		yjr: '',
		jsr: '',
		rkrq: '',
		zltype: '',
		yh: '',
		yjTableAndId : ''
	}; // 初始值
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
		portion : ""
	});

	// 4. 创建数据源

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			  params : " orgid='" + USERORGID + "'and indexid in (select indexid from ZlTree )  and billstate<>'6' and billstate<>'8' "
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
		tbar : [], // 顶部工具栏，可选
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
		business : "zlMgm", // business名称，可选
		primaryKey : primaryKey, // 主键列名称，必须
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		deleteHandler : deleteFun,
		// form: true,
		//formHandler: popForm,
		// formHandler: showEditDialog,
		saveHandler : saveFun,
		insertMethod : 'saveDeptInfo',// 自定义增删改的方法名，可选，可部分设置insertMethod/saveMethod/deleteMethod中的一个或几个
		saveMethod : 'saveDeptInfo'
	});
	   	ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in(select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	// 6. 创建表单form-panel
	formPanel = new Ext.FormPanel({
		id : 'form-panelef',
		header : false,
		border : false,
		iconCls : 'icon-detail-form',
		labelAlign : 'top',
		// listeners: {beforeshow: handleActivate},
		bbar : ['->', {
			id : 'query',
			text : '查询',
			tooltip : '查询',
			iconCls : 'btn'//,
			//handler : execQuery
		}],
		items : [new fm.TextField(fc['fileno']), new fm.TextField(fc['materialname']),
				new fm.TextField(fc['weavecompany']),
				new fm.DateField(fc['stockdate'])]

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
		items : [treePanel, contentPanel]
	});

	// /////////////////////////////////////////////////////
	root.select();
   	grid.showHideTopToolbarItems("save", false);
   	grid.showHideTopToolbarItems("refresh", false);
	var gridTopBar = grid.getTopToolbar()
	with (gridTopBar) {
		add(update,'-', btnPrint, '-', btnQuery,'-',reset,'->','-',btnPayInfo,'-',btnback);
	}
	// 11. 事件绑定
	sm.on('rowselect', function(sm) { // grid 行选择事件
				var record = grid.getSelectionModel().getSelected();				
				var getzltype=record.get('zltype');
				var billstate = record.get('billstate');
				var tb = grid.getTopToolbar();
				if (record != null) {
					 
					tb.items.get("yj").enable();
					tb.items.get("zluntread").enable();
				} else {
					tb.items.get("yj").disable();
					tb.items.get("zluntread").disable();
					tb.items.get("update").enable();
					tb.items.get("del").enable();
				}
				if(billstate==3){
					 	tb.items.get("zluntread").disable();
					 }
				if(billstate=='0'){
						tb.items.get("update").enable();
						tb.items.get("del").enable();
				}else{
					tb.items.get("update").disable();
						tb.items.get("del").disable();
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
	
	function fileicon(value, metadata, record) {
		if (value != '') {
			var zltype = record.get('zltype');
			var url = BASE_PATH;
			if (zltype == 8){ 
				url += "servlet/FlwServlet?ac=loadFile&fileid="+value;
			} else if (zltype == 9){
				url += "servlet/FlwServlet?ac=loadAdjunct&fileid="+value;
			} else if (zltype == 4){
				url += "servlet/MainServlet?ac=downloadBlobFileByFileId&isCompressed=1&fileId="+value+"&fileName="+record.get("filename");
			} else if(zltype == 2){
				var num = 0;
				DWREngine.setAsync(false);
			     baseMgm.getData("select count(infoid) from zl_info where modtabid = (select filelsh from zl_info where infoid='"+record.get("infoid")+"') and billstate in ('1','2','3','4')",function(list){
			          num = list;
			     })
			     DWREngine.setAsync(true);
			     return '<div id="sidebar"><a href="javascript:conAdjustWin(\''
						  + record.get("filelsh") + '\' )">' +"附件["+num+']</a></div>'
			}else{
				url += "servlet/MainServlet?ac=downloadBlobFileByFileId&fileId="+value+"&fileName="+record.get("filename");
			}
			return '<div id="sidebar"><a href="'+ url +'"><span style="color:blue; ">' +"附件[1"+']</span></a></div>'
		} else {
			var yjTableAndId = record.get('yjTableAndId');
			if(yjTableAndId != ''){
						var count=0;
						var infoid = record.get('infoid');
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from zl_info_bloblist where infoid='"+infoid+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });				
	                    DWREngine.setAsync(true);
						return "<div id='sidebar'><a href='javascript:showBlobListWin(\"" + infoid + "\")'>"+"附件["+count+"]"+"</a></div>"
	
			}else{
					var downloadStr="";
					var infoid = record.get('infoid');
					var billstate = record.get('billstate');
					var count=0;
					DWREngine.setAsync(false);
			        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+infoid+
			                           "' and transaction_type='"+businessType+"'", function (jsonData) {
				    var list = eval(jsonData);
				    if(list!=null){
				   	 count=list[0].num;
				     		 }  
				      	 });
				    DWREngine.setAsync(true);
					if(billstate == 0){
					   downloadStr="附件["+count+"]";
					   editable = true;
					}else{
					   downloadStr="附件["+count+"]";
					   editable = false;
					}	
					return '<div id="sidebar"><a href="javascript:showUploadWin(\''
								+ businessType + '\', ' + editable + ', \''
								+ infoid
								+ '\', \''+winTitle+'\')">' + downloadStr +'</a></div>'
				
				}
		}
	}

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
   ////////////////////////////////////////////////////////////
	
    ////////////////////////////////////////////////////
    
    var comboxWithTree = new fm.ComboBox(fc['indexid']);
	
	comboxWithTree.on('expand', function(){
		newtreePanel.render('tree');
	});
	
	newtreePanel.on('click', function(node){
		if ("" != node.attributes.mc && "1" == node.attributes.isleaf){
			selectedIndexid = node.attributes.indexid
			comboxWithTree.setRawValue(node.attributes.text);
			comboxWithTree.setValue(node.attributes.indexid);
			comboxWithTree.collapse();
		}
	});
     var billstateCombo = new Ext.form.ComboBox({
				name : 'billstate',
				fieldLabel : '状态',
				disabled : true,
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : dsJzhType,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			})
	var weavCombo = new Ext.form.ComboBox({
				id:"weav",
				name : 'weavecompany',
				fieldLabel : '责任者',
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : weavStore,
				value:weavArr == ''?'':weavArr[0][0],
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			})
    //////////////////////////////////////////////////
	// 6. 创建表单form-panel
	if(weavList.length == 0){
		var formPanelinsert = new Ext.FormPanel({
			id: 'form-panel',
	        header: false,
			border: false,
			autoScroll:true,
			region : "center",
			labelAlign : 'right',
			iconCls: 'icon-detail-form',
		 	items: [
	 	        new fm.Hidden(fc['infoid']),
	            new fm.Hidden(fc['orgid']),
				new fm.Hidden(fc['pid']),
				new fm.Hidden(fc['flwinsid']),
		        new fm.Hidden(fc['filelsh']),
		        new fm.Hidden(fc['indexid']),
				new fm.Hidden(fc['yjTableAndId']),
				new fm.Hidden(fc['yh']),
				new fm.Hidden(fc['billstate']),
				new fm.Hidden(fc['filename']),
				new Ext.form.FieldSet({
	    			title: '基本信息',
	                border: true,
	                layout: 'column',
	                items:[{
		   					layout: 'form', columnWidth: .35,
		   					bodyStyle: 'border: 0px;',
		   					items:[
			                		 new fm.ComboBox({
					            		name: 'zltype',
										fieldLabel: '资料类型',
										allowBlank : false,
										emptyText : '请选择...',
										valueField: 'k',
										displayField: 'v',
										mode: 'local',
							            typeAhead: true,
							            triggerAction: 'all',
							            store: zltypeStore,/* new Ext.data.SimpleStore({
							            	data: [['1','图纸'],['2','合同'],['3','资料']],
							            	fields: ['k', 'v']
							            }),*/
							            lazyRender: true,
							            listClass: 'x-combo-list-small',
										anchor: '95%'
					            	}),
					            	 new fm.TextField(fc['weavecompany']),
					            	 new fm.DateField(fc['rkrq']),
					            	 new fm.TextField(fc['portion'])
		   						   ]
	    				},{
	    					layout: 'form', columnWidth: .33,
	    					bodyStyle: 'border: 0px;',
	    					items:[
	    					        new fm.TextField(fc['fileno']),
	    					        new fm.NumberField(fc['quantity']),
	    					        new fm.DateField(fc['stockdate']),
	    					        {
			                            layout : 'column',
			                            border : false,
			                            items : [
			                            {
			                                layout : 'form',
			                                columnWidth: .68,
			                                border : false,
			                                items : [
			                                    new fm.NumberField({
			                                        id : 'yhFirst'
			                                        ,name : 'yhFirst'
			//                                        ,width : 60
			                                        ,anchor : '95%'
			                                        ,fieldLabel : '页号'
			//                                        ,labelWidth : '20'
			//                                        ,hideLabel : true
			                                        ,style : 'text-align:right'
			                                    })
			                                ]
			                            },{
			                                layout : 'form',
			                                columnWidth: .30,
			                                border : false,
			                                items : [
			                                    new fm.NumberField({
			                                        id : 'yhLast'
			                                        ,name : 'yhLast'
			//                                        ,width : 60
			                                        ,fieldLabel : '页号'
			//                                        ,labelWidth : '20'
			                                        ,hideLabel : true
			                                         ,anchor : '95%'
			                                        ,style : 'text-align:right'
			                                    })
			                                ]
			                            }
			                            ]
			                        }
	    						   ]
	    				},{
	    					layout: 'form', columnWidth: .32,
	    					bodyStyle: 'border: 0px;',
	    					items:[
	    							new fm.TextField(fc['responpeople']),
	    							bookNumUnitCombo,
					            	comboxWithTree
					            	
	    					      ]
	    				  }    				
	    			]
	    		}),
	    		new Ext.form.FieldSet({
	                layout: 'column',
	                title : '文件材料题名及状态',
	                items:[{
		   					layout: 'form', columnWidth: .7,
		   					bodyStyle: 'border: 0px;',
		   					items:[
			                		 new fm.TextField(fc['materialname'])  
			                		  
		   						   ]
	    				},{
	    					layout: 'form', columnWidth: .3,
	    					bodyStyle: 'border: 0px;',
	    					items:[
					            	 billstateCombo
	    						   ]
	    				}    				
	    			]
	    		}),
	    		/////////////////////////////////////////////////////////////
	   			new Ext.form.FieldSet({
	    			layout: 'form',
	                border:true, 
	                title:'备注',
	                cls:'x-plain',  
	                items: [
	   					new fm.TextArea(fc['remark'])
					]
	    		})
	    	],
	    	buttons: [{
				id: 'save',
	            text: '保存',
	            handler: formSave
	        },{
				id: 'nestBtn',
	            text: '继续新增',
	            handler: newFormFn
	        }, {
				id: 'cancel',
	            text: '取消',
	            handler: function(){
	            	formWindow.hide();
	            	refresh("no68");
	            }
	        }]
	});
	}else{
			var formPanelinsert = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		region : "center",
		labelAlign : 'right',
		iconCls: 'icon-detail-form',
	 	items: [
 	        new fm.Hidden(fc['infoid']),
            new fm.Hidden(fc['orgid']),
			new fm.Hidden(fc['pid']),
			new fm.Hidden(fc['flwinsid']),
	        new fm.Hidden(fc['filelsh']),
	        new fm.Hidden(fc['indexid']),
			new fm.Hidden(fc['yjTableAndId']),
			new fm.Hidden(fc['yjTableAndId']),
			new fm.Hidden(fc['yh']),
			new fm.Hidden(fc['billstate']),
			new fm.Hidden(fc['filename']),
			new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		 new fm.ComboBox({
				            		name: 'zltype',
									fieldLabel: '资料类型',
									allowBlank : false,
									emptyText : '请选择...',
									valueField: 'k',
									displayField: 'v',
									mode: 'local',
						            typeAhead: true,
						            triggerAction: 'all',
						            store: zltypeStore,/* new Ext.data.SimpleStore({
						            	data: [['1','图纸'],['2','合同'],['3','资料']],
						            	fields: ['k', 'v']
						            }),*/
						            lazyRender: true,
						            listClass: 'x-combo-list-small',
									anchor: '95%'
				            	}),
				            	weavCombo,
				            	 new fm.DateField(fc['rkrq']),
				            	 new fm.TextField(fc['portion'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    					        new fm.TextField(fc['fileno']),
    					        new fm.NumberField(fc['quantity']),
    					        new fm.DateField(fc['stockdate']),
    					        	        {
			                            layout : 'column',
			                            border : false,
			                            items : [
			                            {
			                                layout : 'form',
			                                columnWidth: .68,
			                                border : false,
			                                items : [
			                                    new fm.NumberField({
			                                        id : 'yhFirst'
			                                        ,name : 'yhFirst'
			//                                        ,width : 60
			                                        ,anchor : '95%'
			                                        ,fieldLabel : '页号'
			//                                        ,labelWidth : '20'
			//                                        ,hideLabel : true
			                                        ,style : 'text-align:right'
			                                    })
			                                ]
			                            },{
			                                layout : 'form',
			                                columnWidth: .30,
			                                border : false,
			                                items : [
			                                    new fm.NumberField({
			                                        id : 'yhLast'
			                                        ,name : 'yhLast'
			//                                        ,width : 60
			                                        ,fieldLabel : '页号'
			//                                        ,labelWidth : '20'
			                                        ,hideLabel : true
			                                         ,anchor : '95%'
			                                        ,style : 'text-align:right'
			                                    })
			                                ]
			                            }
			                            ]
			                        }
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['responpeople']),
    							bookNumUnitCombo,
				            	comboxWithTree
				            	
    					      ]
    				  }    				
    			]
    		}),
    		new Ext.form.FieldSet({
                layout: 'column',
                title : '文件材料题名及状态',
                items:[{
	   					layout: 'form', columnWidth: .7,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		 new fm.TextField(fc['materialname'])  
		                		  
	   						   ]
    				},{
    					layout: 'form', columnWidth: .3,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	 billstateCombo
    						   ]
    				}    				
    			]
    		}),
    		/////////////////////////////////////////////////////////////
   			new Ext.form.FieldSet({
    			layout: 'form',
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [
   					new fm.TextArea(fc['remark'])
				]
    		})
    	],
    	buttons: [{
			id: 'save',
            text: '保存',
            handler: formSave
        },{
			id: 'nestBtn',
            text: '继续新增',
            handler: newFormFn
        }, {
			id: 'cancel',
            text: '取消',
            handler: function(){
            	formWindow.hide();
            	refresh("no68");
            }
        }]
	});
	}

	
   //////////////////////////////////////////////////////////
	function insertFun() {
		changeBtn = "addFile";
		Ext.getCmp("nestBtn").setVisible(false);
		if (tmp_parent != true) {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择子节点！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}
	var  fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable="
			+ false + "&businessId=" + null;
    var  filePanel3 = new Ext.Panel({
	            frame:true,
				border : true,
				region : "south",
				height : 200,
				split : true,
				title : "附件",
				html : "<iframe id='fileFrame' name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
		var formPanel2 = new Ext.Panel({
             region : "center", 
             items : [formPanelinsert,filePanel3]

		})
		//grid.defaultInsertHandler();
		
		if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                width:document.body.clientWidth*0.8,
                height:document.body.clientHeight*0.8,
                closeAction:'hide',
                maximizable : true,
                plain: true,
                autoScroll:true,
                bodyStyle:'overflow-y:auto;overflow-x:hidden;',
                items: [formPanel2],
                animEl:'action-new',
                listeners: {
				    'hide' : function(){
				        formWindow.hide();
				        formWindow = null;
				        refresh("no68",REALNAME);
				    }
				}
                
                });
       	}
       	formPanelinsert.getForm().reset();
       	formWindow.show();
  		if(!isInitYhFlag){
	       	var yhFirst = Ext.getCmp('yhFirst');
		    if(typeof yhFirst != "undefined" && yhFirst != null ){
		        yhFirst.getEl().insertHtml('afterEnd','&nbsp;-')
		    }
		    isInitYhFlag=true;
       	}
   	    Ext.getCmp("nestBtn").setVisible(true);	
		var form = formPanelinsert.getForm();
		form.findField("indexid").setValue(selectedTreeData);
		form.findField("pid").setValue(currentPid);
		form.findField("responpeople").setValue(username);
        form.findField("billstate").setValue(0);
        form.findField("orgid").setValue(selectorgid);
		form.findField("quantity").setValue(0);
		form.findField("rkrq").setValue(new Date);
		form.findField("portion").setValue(1);
		form.findField("stockdate").setValue(new Date);
		form.findField('fileno').setDisabled(false);
   	    form.findField('zltype').setDisabled(false);
   	    form.findField('materialname').setDisabled(false);
		if(selectedIndexid == '' && selectedTreeData != ''){
			for(var i = 0 ; i < indexidStr.length; i++ ){
				if( indexidStr[i][0] == selectedTreeData ){
					comboxWithTree.setValue(selectedTreeData);
					comboxWithTree.setRawValue(indexidStr[i][1]);
					break;
				}
			}
		}
	};
	//修改部门资料信息
	function loadForm(){
		//////////
		var form = formPanelinsert.getForm();
    	if (sm.getSelected()!=null)
    	{
    		var gridRecod = sm.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsInt);
    				for(var i=0; i<Columns.length; i++){
    					if (typeof(temp[Columns[i].name])!="undefined"){
    						temp[Columns[i].name] = gridRecod.get(Columns[i].name)
    					}
    				}
    				form.loadRecord(new PlantFields(temp))
    			}
    			else
    			    
    				form.loadRecord(new PlantFields(PlantFieldsInt))
    			//form.reset()
    			formPanelinsert.buttons[0].enable()
    	
    			formPanelinsert.isNew = true
    		}
    		else
    		{
	    		var ids = sm.getSelected().get(primaryKey)
	    		baseMgm.findById(bean, ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
		    				return;
			    		}
			    		
			    		var obj = new Object();
			    		for(var i=0; i<Fields.length; i++){
			    			var n = Fields[i].name
			    			obj[n] = rtn[n];
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<Columns.length; i++){
		    					if (typeof(obj[Columns[i].name])!="undefined"){
		    						obj[Columns[i].name] = gridRecod.get(Columns[i].name)
		    					}
		    				}
					    }
			    		var record = new PlantFields(obj)
			    		form.loadRecord(record)
			    		for(var i=0;i<indexidStr.length;i++){
		    			      if(form.findField('indexid').getValue() == indexidStr[i][0]){
		    			         comboxWithTree.setValue(indexidStr[i][0]);
		    			         comboxWithTree.setRawValue(indexidStr[i][1]);
		    			         break;
		    			      }
		    			 }
		    			 for(var i=0;i<jzhType.length;i++){
		    			        if(form.findField('billstate').getValue() ==jzhType[i][0]){
		    			            billstateCombo.setValue(jzhType[i][0]);
		    			            billstateCombo.setRawValue(jzhType[i][1]);
		    			            break;
		    			        }
		    			 }
			    		formPanelinsert.buttons[0].enable();
			    		formPanelinsert.isNew = false;
			    		var yhValue=form.findField("yh").getValue();
						var yhFirstValue="";
						var yhLastValue="";
						if(yhValue&&yhValue!=null&&yhValue.length>0){
							var yhArr=yhValue.split('-');
							if(yhArr.length==2){
								yhFirstValue=yhArr[0];
								yhLastValue=yhArr[1];
							}
						}
						form.findField("yhFirst").setValue(yhFirstValue);
						form.findField("yhLast").setValue(yhLastValue);
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFields(PlantFieldsInt))
    		formPanel.buttons[0].disable()
    	}  
		////////
		
	}
	function updatedept(){
	   	changeBtn = "updateFile";
	    if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要修改的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var record = sm.getSelected();
		var infoid = record.get('infoid');
		var yjTableAndId = record.get('yjTableAndId');
		var checkFlag = false;
		if(record.get('billstate')== 0 || record.get('billstate') == '' || record.get('billstate') == null)
			checkFlag = true;
		var  fileUploadUrl = CONTEXT_PATH
								+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable="
								+ checkFlag + "&businessId=" + infoid;
	    var  filePanel2 = new Ext.Panel({
		            frame:true,
					border : true,
					region : "south",
					height : 200,
					split : true,
					title : "附件",
					html : "<iframe name='fileFrame' src='"
							+ fileUploadUrl
							+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
				});
		var formPanel1 = '';
		var zlType = record.get('zltype');
		var fileLsh = record.get('filelsh');
		if((fileLsh != ''  || yjTableAndId != '')){//(zlType == 2 || zlType == 4) && 
			formPanel1 = new Ext.Panel({
		             region : "center", 
		             items : [formPanelinsert]
				})
		}else{
			formPanel1	= new Ext.Panel({
		             region : "center", 
		             items : [formPanelinsert,filePanel2]
				})		
		}
	   	if(!formWindow){
	            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                width:document.body.clientWidth*0.8,
                height:document.body.clientHeight*0.8,
                closeAction:'hide',
                maximizable : true,
                plain: true,
                autoScroll:true,
                bodyStyle:'overflow-y:auto;overflow-x:hidden;',
                items: [formPanel1],
                animEl:'action-new',
                listeners: {
				    'hide' : function(){
				        formWindow.hide();
				        formWindow = null;
				        refresh("no68",REALNAME);
				    }
				}
                });
	       	}
	       	formWindow.show();
	       	loadForm();
	       	if((zlType == 2 || zlType == 4) && (fileLsh != '' ||  yjTableAndId != '')){
	       		if(zlType == 2){
	       			formPanelinsert.getForm().findField('fileno').setDisabled(true);
	       		}
	       	    formPanelinsert.getForm().findField('zltype').setDisabled(true);
	       	    formPanelinsert.getForm().findField('materialname').setDisabled(true);
	       	    Ext.getCmp("nestBtn").setVisible(false);
	       	}else{
	       	    formPanelinsert.getForm().findField('fileno').setDisabled(false);
	       	    formPanelinsert.getForm().findField('zltype').setDisabled(false);
	       	    formPanelinsert.getForm().findField('materialname').setDisabled(false);
	       	    Ext.getCmp("nestBtn").setVisible(true);	       	
	       	}
	   }
	function saveFun() {
		if (fnValidateForSub()) {
			grid.defaultSaveHandler();

		}

	};

	function deleteFun() {
		var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('infoid'));
			}
			
	///////////////////////////////////////////////////////////////////////
		if (ids.length > 0){
    		Ext.Msg.show({
				title: '提示',
				msg: '是否要删除?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(value){
					if ("yes" == value){
						Ext.get('loading-mask').show();
						Ext.get('loading').show();
						zlMgm.deleteinfo(ids, function(){
							Ext.get('loading-mask').hide();
							Ext.get('loading').hide();
							Ext.example.msg('删除成功！', '您成功删除了'+ids.length+'条部门资料信息！');
							refresh("no68");//no68的意思是在查询的时候billstate<>'6' and billstate<>"8"
							if (ds.getCount() > 0)
					    		sm.selectRow(0);
						});
					}
				}
    		});
    	}
	
	}
}

    function showFlowAdjunct(){
      	var record = sm.getSelected();
		var _insid = record.get('flwinsid');
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
	function untread(){
       var modName = "资料" + this.text
		var record = sm.getSelections();// 得到选择的记录
		if(record == null || record == ""){
		  Ext.example.msg('信息提示', '请选择您要收回的资料！');
		  return;
		}
		var records = sm.getSelected();
		var id = records.get('infoid');
		var ids = new Array();
		if (record != null) {
			DWREngine.setAsync(false);
			for (var i = 0; i < record.length; i++) {
				ids.push(record[i].get('infoid'));
			}
			zlMgm.ZlUntread(ids)
			DWREngine.setAsync(true);

			Ext.example.msg('收回成功！', '您成功收回了' + ids.length + '条资料信息！');
			sm.clearSelections();
            refresh("yes1");//yes1的意思是在查询的时候billstate =1；

		} else {
			Ext.MessageBox.show({
				title : '警告',
				msg : '该条资料信息尚未保存！请保存后重试！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
    
    }
	function formSave() {
		var form = formPanelinsert.getForm()
		if(selectedIndexid == null || selectedIndexid ==''){
		  selectedIndexid = selectedTreeData;
		}
		if((selectedIndexid == null || selectedIndexid =='')&&(selectedTreeData == null || selectedTreeData == "")){
		    var  value = form.findField('indexid').getValue();
		    form.findField('indexid').setValue(value);
		}else{
			form.findField('indexid').setValue(selectedIndexid);
			selectedIndexid = '';
		}
		if (form.isValid()) {
			var yhFirstValue=form.findField("yhFirst").getValue();
			var yhLastValue=form.findField("yhLast").getValue();
			var quantityValue=form.findField("quantity").getValue();
			var yhValue="";
			if((quantityValue!=0&&quantityValue!='')&&((yhFirstValue!=0&&yhFirstValue!='')||(yhLastValue!=0&&yhLastValue!=''))){
				Ext.example.msg('系统提示', '页数和页号只能填一个！');
				return;
			}else{
				if((quantityValue==0||quantityValue=='')&&(yhFirstValue==0||yhFirstValue=='')&&(yhLastValue!=0&&yhLastValue!='')){
					Ext.example.msg('系统提示', '页号前后数字必须都填！');
					return;
				}else if((quantityValue==0||quantityValue=='')&&(yhFirstValue!=0||yhFirstValue!='')&&(yhLastValue==0&&yhLastValue=='')){
					Ext.example.msg('系统提示', '页号前后数字必须都填！');
					return;
				}else if((quantityValue==0||quantityValue=='')&&(yhFirstValue!=0&&yhFirstValue!='')&&(yhLastValue!=0&&yhLastValue!='')){
					yhValue=yhFirstValue+"-"+yhLastValue;
				}
			}
			form.findField("yh").setValue(yhValue);
			doFormSave(true)	
		}
	}

	function doFormSave(dataArr){
    	var form = formPanelinsert.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.infoid == '' || obj.infoid == null){
	   		zlMgm.insertzlinfo(obj, function(str){
	   			   formPanelinsert.getForm().findField('infoid').setValue(str);
	   				Ext.Msg.show({
					   title: '保存成功提示',
					   msg: '是否上传附件?',
					   buttons: Ext.Msg.YESNO,
					   fn: function(btn){
					      if(btn == 'yes'){
                            checkFlag = true;
                            Ext.getCmp("nestBtn").show();
                            var  fileUploadUrl = CONTEXT_PATH
										+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable="
										+ true + "&businessId=" + str;
							fileFrame.location.href = fileUploadUrl;
					      }else{
					          Ext.Msg.show({
								   title: '提示',
								   msg: '是否继续新增?',
								   buttons: Ext.Msg.YESNO,
								   fn: processResult,
								   icon: Ext.MessageBox.QUESTION
							 });
					      }
					   },
					   icon: Ext.MessageBox.QUESTION
					});
					  refresh("no68");
	   		});
   		}else{
   			zlMgm.updatezlinfo(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
                    refresh("no68");//no68的意思是在查询的时候billstate<>'6' and billstate<>"8"
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    function newFormFn(){
        var value = 'yes';
        Ext.getCmp("nestBtn").setVisible(false);
        var  fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable="
			+ false + "&businessId=" + null;
		fileFrame.location.href = fileUploadUrl;
        processResult(value)
    }
    function processResult(value){
    	if ("yes" == value){
    	    refresh("no68");//no68的意思是在查询的时候billstate<>'6' and billstate<>"8"
    		formPanelinsert.getForm().reset();
	    	var form = formPanelinsert.getForm();
			form.findField("indexid").setValue(selectedTreeData);
			form.findField("pid").setValue(currentPid);
			form.findField("responpeople").setValue(username);
	        form.findField("billstate").setValue(0);
	        form.findField("portion").setValue(1);
	        form.findField("orgid").setValue(selectorgid);
    		form.findField("quantity").setValue(0);	
    		form.findField("rkrq").setValue(new Date);
			form.findField("stockdate").setValue(new Date);
    	}else{
    		formWindow.hide();
            refresh("no68");//no68的意思是在查询的时候billstate<>'6' and billstate<>"8"
    	}
    }
    
	function formCancel() {
		// formPanel.getForm().reset();
		formWindow.hide();
	}

	var formDialogWin;

	function fnValidateForSub() {
		var flag = true;
		var subEditRecords = ds.getModifiedRecords();
		for (var i = 0; i < subEditRecords.length; i++) {
			var record = subEditRecords[i];
			var f_wjbh = record.get('wjbh');
			var f_wjcltm = record.get('wjcltm');
			var f_rq = record.get('rq');
			if ("" == f_wjcltm) {
				Ext.example.msg('提示', '必填项：文件材料提名 未填写！');
				flag = false;
			} else if ("" == f_wjbh) {
				Ext.example.msg('提示', '必填项：文件编号 未填写！');
				flag = false;
			} else if ("" == f_rq) {
				Ext.example.msg('提示', '必填项：日期 未填写！');
				flag = false;
			}
		}
		return flag;
	}
	function zlTypeName(value, metadata, record) {
		if (value != '') {
			var str = '';
			for (var i = 0; i < zltypelist.length; i++) {
				if (zltypelist[i][0] == value) {
					str = zltypelist[i][1]
					break;
				}
			}
			return str;			
		}
	}
	function partbRender(value) {
		var str = '';
		for (var i = 0; i < BillState.length; i++) {
			if (BillState[i][0] == value) {
				str = BillState[i][1]
				break;
			}
		}
		return str;
	}
    
	treePanel.on('click', function(node) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("indexid").innerText;
		selectorgid=elNode.all("orgid").innerText;
		selectTreeid = elNode.all("treeid").innerText;
		PlantInt.indexid = selectedTreeData;
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
			selectedTreeData = "";
		}
		refresh("no68");//no68的意思是在查询的时候billstate<>'6' and billstate<>"8"

	});
	
	function refresh(str){
		var where = "treeid" + SPLITB +selectTreeid + SPLITA + "pid"+SPLITB+CURRENTAPPID + SPLITA+
		            "orgid"+SPLITB+selectorgid+SPLITA+"billstate"+SPLITB+str;
		ds.baseParams.business = "zlMgm";
	    ds.baseParams.method  ='newFindwhereorderby';
	    ds.baseParams.params = where;
		ds.reload();
}

});

//显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
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
	fileWin.on("close",function(){
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in(select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}
//显示移交多附件的文件列表
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
//查看合同附件函数
function conAdjustWin(conid){
	fileUrl = CONTEXT_PATH
	+ "/Business/contract/cont.files.view.jsp?select="
	+ conid+"&checkout=check";
	var fileWin = new Ext.Window({
				title : '资料附件上传',
				width : 600,
				tbar : [{}],
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}

function reportOpened(CellWeb) {
	if(reportArgs1 && reportArgs1!=null) {
		 	var BillBj = new Array();
			var sql =" select rownum,dh,mc,gdrq,zltype,billstate,ljr,bz from ("+ "select  a.fileno as dh,  materialname as mc, to_char(a.STOCKDATE, 'YYYY.MM.DD') as gdrq," +
					" (select p.property_name from property_code p where p.type_name = (select uids from property_type where type_name='资料类型') " +
					" and p.property_code=to_char(a.zltype)) as zltype," +
					" decode(a.BILLSTATE, '0', '未移交', '1', '申请移交', '2', '已入库', '3', '已归档') as billstate," +
					"  a.RESPONPEOPLE as ljr,a.REMARK as bz from ZL_INFO a" +
					"    where  a.ORGID ='"+reportArgs1.infyj+"' and  a.INDEXID ='"+reportArgs1.inftitle +"' and a.BILLSTATE <> '6'   and a.BILLSTATE <> '8'  order by stockdate desc, fileno asc,zltype desc)" ;
			DWREngine.setAsync(false);
			zlMgm.getListForCellBySql(sql, function(list){
					for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].ROWNUM);
					temp.push(list[i].DH);
					temp.push(list[i].MC);
					temp.push(list[i].GDRQ);
					temp.push(list[i].ZLTYPE);
					temp.push(list[i].BILLSTATE);
					temp.push(list[i].LJR);
					temp.push(list[i].BZ);
					BillBj.push(temp);
				}
			});
			DWREngine.setAsync(true);
			var sheetx=0;		
			for(i=0;i<BillBj.length;i++){
				var page = parseInt(i/15);
				if(page>0 && page==(sheetx+1)){
					sheetx++;
					CellWeb.InsertSheet(page,1);
					CellWeb.CopySheet(page,0); 
				}
			}
			
			sheetx=0;
			var j=0;
			for(i=0;i<BillBj.length;i++){
				var page = parseInt(i/15);
				if(page>0 && page==(sheetx+1)){
					sheetx++;
					j=0;
				}
			    if(BillBj[i][0]!=null){
		    		CellWeb.S( 2, 6+j, sheetx, BillBj[i][0]);
		    	}
				if(BillBj[i][1]!=null){
					CellWeb.S( 3, 6+j, sheetx, BillBj[i][1]);
				}
				if(BillBj[i][2]!=null){
		    		CellWeb.S( 4, 6+j, sheetx, BillBj[i][2]);
				}
				if(BillBj[i][3]!=null){
					CellWeb.S( 5, 6+j, sheetx, BillBj[i][3]);
				}
		    	if(BillBj[i][4]!=null){
		    		CellWeb.S( 6, 6+j, sheetx, BillBj[i][4]);
		    	}
		    	if(BillBj[i][5]!=null){
		    		CellWeb.S( 7, 6+j, sheetx, BillBj[i][5]);
		    	}
		    	if(BillBj[i][6]!=null){
		    		CellWeb.S( 8, 6+j, sheetx, BillBj[i][6]);
		    	}
		    	if(BillBj[i][7]!=null){
		    		CellWeb.S( 9, 6+j, sheetx, BillBj[i][7]);
		    	}
		    	j++;
			}
		}
	}