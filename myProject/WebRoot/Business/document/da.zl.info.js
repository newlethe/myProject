var ServletUrl = MAIN_SERVLET
var beanA = "com.sgepit.frame.flow.hbm.ZlInfo"
var bean = "com.sgepit.pmis.document.hbm.DaDaml"
var business = "zlMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "dzid"
var orderColumn = "xh"
var gridPanelTitle = "组卷信息"
var pageSize = PAGE_SIZE;
var formPanelTitle = "修改组卷信息"
var SPLITB = "`"
var data;
var win;
var viewport;
var formWindowA;
var inputWindow
var partBs = new Array();
var BillState = new Array();
var zjinfoWin
var formPanel
var propertyName = "xh";
var selectedTreeData = "";
var selectedIndexid = "";
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
var indexidStr = new Array();
var jzhType = [[0, '未移交'], [1, '申请移交'], [2, '已入库'], [3, '已归档'], [4, '新增']];
var currentPid = CURRENTAPPID;
var chooseFlag='';
var businessId = "";
var editable1 = true;
var businessType = "zlMaterial";
var winTitle ="资料附件上传";
var ys=0;//页数
var dzidNo;//档案主键
var daidNo;//档案流水
var firstPxh;
var reSort = null
var weavArr = new Array();
var isInsertInitYhFlag=false;//用于添加页号中间的"-"
var isUpdateInitYhFlag=false;//用于添加页号中间的"-"
Ext.onReady(function() {
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
//后期加的电子文档等	
	DWREngine.setAsync(false);
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
	appMgm.getCodeValue('责任者',function(list){ 
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			weavArr.push(temp);			
		}
    });
	DWREngine.setAsync(true);
	var dsdeptname = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : BillState
	});
	var zltypeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : zltypelist
			});
	var weavStore = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data :  weavArr
		});
	//记录前一条记录的值;
	var cookprovider = new Ext.state.CookieProvider()
	Ext.state.Manager.setProvider(cookprovider)
	currentRowIndex = Ext.state.Manager.get("zlRow")
	var dsJzhType = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : jzhType
			});
	function popWinwdow() {
		var id = selectdaid;
		/**if (!zjinfoWin) {
			zjinfoWin = new Ext.Window({
						title : '资料信息',
						layout : 'fit',
						border : false,
						modal : true,
						width : document.body.clientWidth*0.75,
						height : document.body.clientHeight*0.5,
						closeAction : 'hide',
						html : '<iframe id="zjinfoIFrame" name="zjinfoIFrame" style="width:100%; height:100%" src=""></iframe>',
						listeners : {
							show : function(){
								document.all('zjinfoIFrame').src = "Business/document/choose.zl.jsp?selectdaid=" + id
							}
						}
					});
		}*/
		var doUrl = CONTEXT_PATH +"/Business/document/choose.zl.jsp?selectdaid=" + id
		window.showModalDialog(
							doUrl,
							"",
							"dialogWidth:"
									+ screen.availWidth*.8
									+ "px;dialogHeight:"
									+ screen.availHeight*.6
									+ "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
		ds.reload();
		//zjinfoWin.show();
	}

	var up = new Ext.Button({
				id : 'up',
				text : '上移',
				tooltip : '上移',
				iconCls : 'btn',
				handler : up
			});

	var down = new Ext.Button({
				id : 'down',
				text : '下移',
				tooltip : '下移',
				iconCls : 'btn',
				handler : down
			});

	var edit = new Ext.Button({
				id : 'edit',
				text : '修改',
				tooltip : '修改',
				iconCls : 'btn',
				handler : edit
			});
	var zlinput = new Ext.Button({
				id : 'zlinput',
				text : '录入',
				tooltip : '录入',
				iconCls : 'btn',
				handler : zlinput
			});
	var excelInput = new Ext.Button({
				id : 'Excel',
				text : 'excel导入',
				tooltip : 'excel导入',
				iconCls : 'upload',
				pressed : true,
				handler : showExcelWin

			});
	var downloadBtn = new Ext.Button({
				id : 'download',
				text : '下载导入模板',
				iconCls : 'download',
				tooltip : '下载已上传的Excel模板',
				handler : downLoadTemple
			})
	var btnlcfj = new Ext.Button({
				id : 'lcyj',
				text : '查看流程附件',
				tooltip : '查看流程附件',
				iconCls : 'btn',
				disabled : true,
				handler : showFlowAdjunct
			});
  var refreshBtn = new Ext.Button({
				id : 'refresh',
				text : '刷新',
				tooltip : '刷新',
				iconCls : 'btn',
				handler : refreshFn
			});		
	var dsindexid = new Ext.data.SimpleStore({
	       fields: ['k','v'],
	       data: indexidStr
	});			
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
		'dzid' : {
			id : 'dzid1',
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
			hidden : true,
			anchor : '95%'
		},
		'daid' : {
			name : 'daid',
			fieldLabel : '档号',
			// allowBlank: false,
			hidden : true,
			anchor : '95%'
		},
		'sl' : {
			name : 'sl',
			fieldLabel : '归档数量',
			anchor : '95%'
		},
		'xh' : {
			id : 'xh',
			name : 'xh',
			fieldLabel : '排序号',
			anchor : '95%',
			allowNegative: false,
			listeners : {
               blur : savePxh
            }
		},
		'yc' : {
			name : 'yc',
			fieldLabel : '页数',
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
			format : 'Y-m-d'
			//minValue : '2000-01-01'
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
			//minValue : '2000-01-01',
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

	var fc_zlinfo = {
		'infoid' : {
			name : 'infoid',
			fieldLabel : '主键',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'fileno' : {
			name : 'fileno',
			fieldLabel : '文件编号',
//			allowBlank : false,
			anchor : '95%'
		},
		'materialname' : {
			name : 'materialname',
			fieldLabel : '文件名称',
			allowBlank : false,
			anchor : '95%'
		},
		'responpeople' : {
			name : 'responpeople',
			fieldLabel : '录入人',
			allowBlank : false,
			anchor : '95%'
		},
		'book' : {
			name : 'book',
			fieldLabel : '单位',
			anchor : '95%'
		},
		'filelsh' : {
			name : 'filelsh',
			fieldLabel : '附件流水号',
//			allowBlank : false,
			anchor : '95%'
		},
		'dzwd' : {
			name : 'dzwd',
			fieldLabel : '电子文档',
			anchor : '95%'
		},
		'stockdate' : {
			name : 'stockdate',
			fieldLabel : '文件日期',
			width : 45,
			format : 'Y-m-d',
			//minValue : '2000-01-01',
			allowBlank : false,
			anchor : '95%'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			height : 100,
			width : 600,
//			xtype : 'htmleditor',
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
		'pid' : {
			name : 'pid',
			fieldLabel : '项目别',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'quantity' : {
			name : 'quantity',
			fieldLabel : '页数',
			//allowBlank : false,
			//hideLabel : true,
			anchor : '95%'
		},
		'portion' : {
			name : 'portion',
			fieldLabel : '份',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'filename' : {
			name : 'filename',
			fieldLabel : '附件文件名称',
//			allowBlank : false,
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
			// allowNegative: false,
			// maxValue: 100000000,
			anchor : '95%'
		},
		'indexid' : {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			editable:false,
//			allowBlank : false,
            listWidth: 200,
            maxHeight: 200,
            triggerAction: 'all',
            store: dsindexid,
			tpl: "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor : '95%'
		},
		'weavecompany' : {
			name : 'weavecompany',
			fieldLabel : '责任者',
			allowBlank : false,
			//hideLabel : true,
			anchor : '95%'
		},

		'billstate' : {
			name : 'billstate',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsJzhType,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'rkrq' : {
			name : 'rkrq',
			fieldLabel : '入库日期',
			//hidden : true,
			//hideLabel : true,
			width : 45,
			format : 'Y-m-d',
			//minValue : '2000-01-01',
			anchor : '95%'
		},
		'zltype' : {
			name : 'zltype',
			fieldLabel : '资料类型',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'infgrade' : {
			name : 'infgrade',
			fieldLabel : '资料电子文档密级',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'zldaid' : {
			name : 'zldaid',
			fieldLabel : '资料档案id',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'flwinsid' : {
			name : 'flwinsid',
			fieldLabel : '流程实例',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'yh' : {
			name : 'yh',
			fieldLabel : '页号',
			anchor : '95%'		
		}

	};

	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm,	// 第0列，checkbox,行选择器
			new Ext.grid.RowNumberer({
			header : '序号',
			 width : 40
			 }),// 计算行数
			 {
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
				width : 200,
				renderer:function(value){
					if(weavArr .length > 0){
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
				header : fc['dafilename'].fieldLabel,
				dataIndex : fc['dafilename'].name,
				width : 100,
				renderer:function(data, metadata, record, rowIndex,
                        columnIndex, store){
                          var data1=data;
//                          var getFileLsh = record.get('zlid');
//                          alert("getFileLsh="+getFileLsh)
//                          if(getFileLsh == null || getFileLsh == ""){
//                             return data1;
//                          }else{
//	                          var index=data.lastIndexOf(".");
//	                          if(index>0){
//	                            data1=data.substring(0,index);
//	                          }
//	                        	return data1;
                          	   var FileName = data1.substring(data1.lastIndexOf('.')+1, data1.length).toLowerCase();
	                           var reg = /\.\w+$/; //文件后缀名称不确定
                               return data1.replace(reg,'');
//                          	  }
                        }
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
			},  {
				id : 'yh',
				header : fc_zlinfo['yh'].fieldLabel,
				dataIndex : fc_zlinfo['yh'].name,
				width : 100			
			}, {
				id : 'dzwd',
				header : fc_zlinfo['dzwd'].fieldLabel,
				dataIndex : fc_zlinfo['dzwd'].name,
				width : 100,
				align : 'center',
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
			}, {
				id : 'xh',
				header : fc['xh'].fieldLabel,
				dataIndex : fc['xh'].name,
				width : 100,
				editor : new fm.NumberField(fc['xh']),
	            renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				}
			}

	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
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
				name : 'yh',
				type : 'string'
			},  {
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
			}, {
			    name : 'pxh',
			    type : 'float'
			}

	];

	var Fields = ([{
				name : 'infoid',
				type : 'string'
			}, {
				name : 'fileno',
				type : 'string'
			}, {
				name : 'materialname',
				type : 'string'
			}, {
				name : 'responpeople',
				type : 'string'
			}, {
				name : 'book',
				type : 'float'
			}, {
				name : 'filelsh',
				type : 'string'
			}, {
				name : 'stockdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'yjr',
				type : 'string'
			}, {
				name : 'jsr',
				type : 'string'
			}, {
			    name : 'dzwd',
			    type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'quantity',
				type : 'float'
			}, {
				name : 'portion',
				type : 'float'
			}, {
				name : 'filename',
				type : 'string'
			}, {
				name : 'orgid',
				type : 'string'
			}, {
				name : 'indexid',
				type : 'string'
			}, {
				name : 'weavecompany',
				type : 'string'
			}, {
				name : 'billstate',
				type : 'float'
			}, {
				name : 'zltype',
				type : 'float'
			}, {
				name : 'rkrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'infgrade',
				type : 'float'
			}, {
				name : 'zldaid',
				type : 'string'
			}, {
				name : 'flwinsid',
				type : 'string'
			},{
			    name : 'yh',
			    type : 'string'
			}

	]);

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	PlantInt = {
		fileno : '',
		pid : currentPid,
		materialname : '',
		indexid : '',
		quantity : 0,
		billstate : '3',
		responpeople : username,
		filename : '',
		remark : '',
		weavecompany : '',
		book : '',
		portion : '',
		orgid : USERORGID,
		stockdate : new Date,
		filelsh : '',
		yh : ''
	}; // 初始值
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
				pid : currentPid
			});

	// 4. 创建数据源
	
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			//params :"daid"+selectdaid+";"
			params : " daid like '%" + selectdaid + "%'"
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
	ds.setDefaultSort(orderColumn, 'DESC'); // 设置默认排序列

	// 5. 创建可编辑的grid: grid-panel
	grid = new Ext.grid.EditorGridTbarPanel({
		// basic properties
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		saveBtn:false,
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		// renderTo: 'editorgrid', //所依附的DOM对象，可选
		tbar : [], // 顶部工具栏，可选
		// width : 800, //宽
		//title : gridPanelTitle, // 面板标题
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
		/*bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),*/

		// expend properties
		plant : Plant, // 初始化记录集，必须
		plantInt : PlantInt, // 初始化记录集配置，必须
		servletUrl : ServletUrl, // 服务器地址，必须
		bean : bean, // bean名称，必须
		business : "baseMgm", // business名称，可选
		primaryKey : primaryKey, // 主键列名称，必须
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		deleteHandler : deleteFun
			//,
			//insertMethod : 'saveDeptInfo',// 自定义增删改的方法名，可选，可部分设置insertMethod/saveMethod/deleteMethod中的一个或几个
			//saveMethod : 'saveDeptInfo'
		});

	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE,
					//params :"daid`"+selectdaid+";"
					params : "daid='" + selectdaid + "'"
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
	//grid.showHideTopToolbarItems("save", false);
	var gridTopBar = grid.getTopToolbar()
	with (gridTopBar) {
		add(edit, '-', up, '-', down, '-', zlinput,'-', excelInput,'-',downloadBtn,'->',refreshBtn);
	}
	function insertFun() {
		popWinwdow();

	};

	// 11. 事件绑定
	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					tb.items.get("edit").enable();
					tb.items.get("zlinput").enable();
					//tb.items.get("lcyj").enable();
				} else {
					tb.items.get("edit").disable();
					//tb.items.get("zlinput").disable();
					//tb.items.get("lcyj").disable();
				}
			});
	sm.on('rowselect', function(sm, rowIndex, record) {
		        ys = record.get("yc");
		        dzidNo = record.get("dzid");//档案主键
                daidNo = record.get("daid");//档案流水
				zlno = record.get('dafileno');
				zrz = record.get('company');
				firstPxh = record.get("xh");
				Ext.state.Manager.set("zlRow", rowIndex)
			})
	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};

	var formDialogWin;

   var comboxWithTree = new fm.ComboBox(fc_zlinfo['indexid']);
   comboxWithTree.on('expand', function(){
		newtreePanel.render('tree');
	});
    
   newtreePanel.on('click', function(node){
		if ("" != node.attributes.mc && "1" == node.attributes.isleaf){
			selectedIndexid = node.attributes.indexid
			comboxWithTree.setValue(node.attributes.text);
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
			});
	var weavCombo1 = new Ext.form.ComboBox({
				name : 'weavecompany',
				fieldLabel : '责任人',
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : weavStore,
				value:weavArr.length>0?weavArr[0][0]:'',
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			})
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	//修改form
	var formPanelinsert = new Ext.FormPanel({
				id : 'form-panel',
			    header: false,
				border: false,
				autoScroll:true,
				region : "center",
				labelAlign : 'right',
				iconCls: 'icon-detail-form',
				items : [
						new fm.Hidden(fc_zlinfo['orgid']),
		                new fm.Hidden(fc_zlinfo['zldaid']),
		                new fm.Hidden(fc_zlinfo['pid']),
				        new fm.Hidden(fc_zlinfo['portion']),
				        new fm.Hidden(fc_zlinfo['infoid']),
				        new fm.Hidden(fc_zlinfo['filelsh']),
				        new fm.Hidden(fc_zlinfo['filename']),
				        new fm.Hidden(fc_zlinfo['flwinsid']),
				        new fm.Hidden(fc_zlinfo['zltype']),
				        new fm.Hidden(fc['dzid']),
				        new fm.Hidden(fc_zlinfo['infoid']),
				        new fm.Hidden(fc_zlinfo['indexid']),
						new fm.Hidden(fc_zlinfo['yjTableAndId']),
						new fm.Hidden(fc_zlinfo['billstate']),
				        new Ext.form.FieldSet({
				        	    title : '基本信息',
				                layout: 'column',
				                items:[{
					   					layout: 'form', columnWidth: .35,
					   					bodyStyle: 'border: 0px;',
					   					items:[
						                		 new fm.TextField(fc_zlinfo['fileno']),
						                		 new fm.TextField(fc_zlinfo['yjr']),
						                		 weavArr.length>0?weavCombo1:new fm.TextField(fc_zlinfo['weavecompany']),
						                		 new fm.TextField(fc_zlinfo['indexid'])
		
					   						   ]
				    				},{
				    					layout: 'form', columnWidth: .33,
				    					bodyStyle: 'border: 0px;',
				    					items:[
								                new fm.TextField(fc_zlinfo['materialname']),
								                new fm.TextField(fc_zlinfo['responpeople']),
								                new fm.DateField(fc_zlinfo['rkrq']),
								                new fm.TextField(fc_zlinfo['quantity'])
				    						   ]
				    				},{
				    					layout: 'form', columnWidth: .3,
				    					bodyStyle: 'border: 0px;',
				    					items:[
				    					       billstateCombo,
								               new fm.TextField(fc_zlinfo['jsr']),
								               new fm.DateField(fc_zlinfo['stockdate']),
								               new fm.Hidden(fc_zlinfo['yh']),
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
					                                        id : 'yhFirst1'
					                                        ,name : 'yhFirst1'
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
					                                        id : 'yhLast1'
					                                        ,name : 'yhLast1'
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
				    				      }    				
				    			 ]
				    		}),
							new Ext.form.FieldSet({
								layout : 'column',
								border : true,
								title : '备注',
								height : 150,
								cls : 'x-plain',
								items : [
								         {
											layout : 'form',
											columnWidth : .99,
											bodyStyle : 'border: 0px;',
							                items: [
							   					new fm.TextArea(fc_zlinfo['remark'])
							                   	
											]
										}	
								]
						})],
				buttons : [{
							id : 'save',
							text : '保存',
							handler : formSave
						}, {
							id : 'cancel',
							text : '取消',
							handler : function() {
								//history.back();
								formWindowA.hide();
							}
						}]
			});

	////////////////////////////////////////////////////
	//状态列表
	var billstateCombo1 = new Ext.form.ComboBox({
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
			});
	//资料类型列表
	var zltypeCombo1 = new Ext.form.ComboBox({
				name : 'zltype',
				fieldLabel : '资料类型',
				allowBlank : false,
				emptyText : '请选择...',
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : zltypeStore,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			});
	var weavCombo2 = new Ext.form.ComboBox({
				name : 'weavecompany',
				fieldLabel : '责任人',
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : weavStore,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			})
	//录入form		
	var formPanelinput = new Ext.FormPanel({
		id : 'inputpanel',
        header: false,
		border: false,
		autoScroll:true,
		region : "center",
		labelAlign : 'right',
		iconCls: 'icon-detail-form',
		items : [
				  new Ext.form.FieldSet({
				              title : '基本信息',
				              border : true,
				              layout :'column',
				              items :[
				              	{
				                    layout : 'form',
				                    columnWidth : .35,
				                    bodyStyle : 'border: 0px',
				                    items : [
				                             new fm.Hidden(fc['pid']),
				                             new fm.Hidden(fc_zlinfo['orgid']),
				                             new fm.TextField(fc_zlinfo['fileno']),
				                             new fm.DateField(fc_zlinfo['stockdate']),
				                              new fm.Hidden(fc_zlinfo['yh']),
				                             new fm.TextField(fc_zlinfo['materialname']),
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
				                    layout : 'form',
				                    columnWidth : .33,
				                    bodyStyle : 'border: 0px',
				                    items : [
				                        zltypeCombo1,
				                        new fm.TextField(fc_zlinfo['responpeople']),
				                        billstateCombo1
				                    ]
				              
				                      
				              },{
				                    layout : 'form',
				                    columnWidth : .32,
				                    bodyStyle : 'border: 0px',
				                    items : [   
				                      new fm.NumberField(fc_zlinfo['quantity']),
				                      weavArr.length>0?weavCombo2:new fm.TextField(fc_zlinfo['weavecompany']),
				                      comboxWithTree
				                      
				              ]
						}]}),
					  new Ext.form.FieldSet({
								layout : 'column',
								border : true,
								title : '备注',
								height : 150,
								cls : 'x-plain',
								items : [
								         {
											layout : 'form',
											columnWidth : .99,
											bodyStyle : 'border: 0px;',
							                items: [
							   					new fm.TextArea(fc_zlinfo['remark'])
							                   	
											]
										}	
								]
						})
				],
		buttons : [{
					id : 'saveBtn',
					text : '保存',
					handler : formSaveW
				},{
					id: 'nestBtn',
		            text: '继续录入',
		            handler: newFormFn
		        }, {
					id : 'cancel',
					text : '取消',
					handler : function() {
						//history.back();
						inputWindow.hide();
					}
				}]
	});
	//////////////////////////////////////////////////////
	function up() {
		if (!sm.hasSelection()) {
			Ext.MessageBox.show({
						title : '警告',
						msg : '请选择将要上移的记录！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
			return;
		}
		var record = sm.getSelected();
		var id = record.get('dzid');
		DWREngine.setAsync(false);
		zlMgm.upzjinfo(id)
		DWREngine.setAsync(true);
		Ext.example.msg('上移成功！', '您成功上移了资料信息！');
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE,
						//params :"daid`"+selectdaid+";"
						params : "daid=" + selectdaid
					}
				});

	}
	function down() {
		if (!sm.hasSelection()) {
			Ext.MessageBox.show({
						title : '警告',
						msg : '请选择将要下移的记录！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
			return;
		}
		var record = sm.getSelected();
		var id = record.get('dzid');
		DWREngine.setAsync(false);
		zlMgm.downzjinfo(id)
		DWREngine.setAsync(true);
		Ext.example.msg('下移成功！', '您成功下移了资料信息！');
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE,
						//params :"daid`"+selectdaid+";"
						params : "daid=" + selectdaid
					}
				});
	}
	function edit() {
		chooseFlag = 'updata';
		var record = sm.getSelected();
		if (!sm.hasSelection()) {
			Ext.MessageBox.show({
						title : '警告',
						msg : '请选择将要修改的记录！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
			return;
		}
		var record = sm.getSelected();
		var infoid = record.get('zlid');
		var checkFlag = false;
		if(record.get('billstate')== 0 || record.get('billstate') == '' || record.get('billstate') == null)
			checkFlag = true;
		var  fileUploadUrl = CONTEXT_PATH
								+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable="
								+ checkFlag + "&businessId=" + infoid;
	    var  filePanel1 = new Ext.Panel({
	    			layout : 'fit',
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
		var formPanel1 = new Ext.Panel({
             region : "center", 
             items : [formPanelinsert,filePanel1]

		})
		if (!formWindowA) {
			formWindowA = new Ext.Window({
						title : formPanelTitle,	               
		                width:document.body.clientWidth*0.8,
		                height:document.body.clientHeight*0.8,
		                closeAction:'hide',
		                maximizable : true,
		                plain: true,
		                autoScroll:true,
		                bodyStyle:'overflow-y:auto;overflow-x:hidden;',
		                items: [formPanelinsert,filePanel1],
		                animEl:'action-new',
		                listeners: {
						    'hide' : function(){
						        formWindowA.hide();
						        formWindowA = null;
						        ds.load({
									params : {
										start : 0,
										limit : PAGE_SIZE,
										params : "daid=" + selectdaid
									},
									callback : function() {
										grid.getSelectionModel().selectRow(currentRowIndex)
									}
								});
						    }
						}
					});
		}
		loadForm();
		formWindowA.show();
		if(!isUpdateInitYhFlag){
	       	var yhFirst1 = Ext.getCmp('yhFirst1');
		    if(typeof yhFirst1 != "undefined" && yhFirst1 != null ){
		        yhFirst1.getEl().insertHtml('afterEnd','&nbsp;-')
		    }
		    isUpdateInitYhFlag=true;
       	}
		var form = formPanelinsert.getForm();
		var id = record.get('daid');
	}
	//资料录入
	///////////////////////////////////////////////////////////////////////////////////////

	function zlinput() {
		chooseFlag = 'input';
		Ext.getCmp("nestBtn").setVisible(false);
		Ext.getCmp('saveBtn').show();
		formPanelinput.getForm().setValues('');
		var  fileUploadUrl1 = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable="
			+ false + "&businessId=" + null;
        var  filePanel2 = new Ext.Panel({
	            frame:false,
				border : true,
				region : "south",
				height : 200,
				split : true,
				title : "附件",
				html : "<iframe id='fileFrame' name='fileFrame' src='"
						+ fileUploadUrl1
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
		var formPanel2 = new Ext.Panel({
             region : "center", 
             items : [formPanelinput,filePanel2]

		})
		if (!inputWindow) {
			inputWindow = new Ext.Window({	               
                title:'资料录入',
                width:document.body.clientWidth*0.8,
                height:document.body.clientHeight*0.8,
                closeAction:'hide',
                maximizable : true,
                plain: true,
                autoScroll:true,
                bodyStyle:'overflow-y:auto;overflow-x:hidden;',
                items: [formPanelinput,filePanel2],
                animEl:'action-new',
                listeners: {
				    'hide' : function(){
				        inputWindow.hide();
				        inputWindow = null;
				        ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE,
								params : "daid='" + selectdaid + "'"
							},
							callback : function() {
								grid.getSelectionModel().selectRow(currentRowIndex)
							}
						});
				   }
				 }
                });
		}
		inputWindow.show();
		loadFormwin();
		if(!isInsertInitYhFlag){
	       	var yhFirst = Ext.getCmp('yhFirst');
		    if(typeof yhFirst != "undefined" && yhFirst != null ){
		        yhFirst.getEl().insertHtml('afterEnd','&nbsp;-')
		    }
		    isInsertInitYhFlag=true;
       	}
		var form = formPanelinput.getForm();
		form.findField("fileno").setValue(zlno);
		form.findField("pid").setValue(currentPid);
		form.findField("weavecompany").setValue(zrz);
		form.findField("orgid").setValue(USERORGID);
	}
	function loadFormwin() {
		//////////
		var form = formPanelinput.getForm();
		form.loadRecord(new PlantFields(PlantFieldsInt))
		formPanelinput.buttons[0].enable()
	}
	function formSaveW() {
		var form = formPanelinput.getForm()
		if(selectedIndexid == null || selectedIndexid == ""){
		   selectedIndexid = selectedTreeData;
		}
		form.findField('indexid').setValue(selectedIndexid);
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
			doFormSaveW(true)
		}
	}

	function doFormSaveW(dataArr) {
		var form = formPanelinput.getForm()
		var obj = form.getValues()
		for (var i = 0; i < Fields.length; i++) {
			var n = Fields[i].name;
			var field = form.findField(n);
			if (field) {
				obj[n] = field.getValue();
			}
		}
		DWREngine.setAsync(false);
		zlMgm.zlrk(obj, selectdaid, function(str) {
	   				Ext.Msg.show({
					   title: '保存成功提示',
					   msg: '是否上传附件?',
					   buttons: Ext.Msg.YESNO,
					   fn: function(btn){
					      if(btn == 'yes'){
                            checkFlag = true;
                            Ext.getCmp('saveBtn').setVisible(false);
                            Ext.getCmp('nestBtn').show();
                            var  fileUploadUrl = CONTEXT_PATH
										+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable="
										+ true + "&businessId=" + str;
							fileFrame.location.href = fileUploadUrl;
					      }else{
					          Ext.Msg.show({
								   title: '提示',
								   msg: '是否继续录入?',
								   buttons: Ext.Msg.YESNO,
								   fn: processResult,
								   icon: Ext.MessageBox.QUESTION
							 });
					      }
					   },
					   icon: Ext.MessageBox.QUESTION
					});

	   		});
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE,
						//params :"daid`"+selectdaid+";"
						params : "daid=" + selectdaid
					}
				});
		parent.ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
		DWREngine.setAsync(true);
	}
    function newFormFn(){
        var value = 'yes';
        Ext.getCmp("nestBtn").setVisible(false);
        Ext.getCmp('saveBtn').show();
	    var  fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable="
			+ false + "&businessId=" + null;
		fileFrame.location.href = fileUploadUrl;
        processResultw(value)
    }
	function processResultw(value) {
		if ("yes" == value) {
			formPanelinput.getForm().reset();
			var form = formPanelinput.getForm();
			form.findField("pid").setValue(currentPid);
			form.findField("responpeople").setValue(username);
			form.findField("billstate").setValue(3);
			form.findField("stockdate").setValue(new Date);
			form.findField("orgid").setValue(USERORGID);
			form.findField("quantity").setValue(0);
			form.findField("fileno").setValue(zlno);
			form.findField("weavecompany").setValue(zrz);
		} else {
			inputWindow.hide();
			ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE,
							//params :"daid`"+selectdaid+";"
							params : "daid=" + selectdaid
						}
					});
		}
	}
	//////////////////////////////////////////////////////////////////
	function loadForm() {
		//////////
		var form = formPanelinsert.getForm();
		if (sm.getSelected() != null) {
			var gridRecod = sm.getSelected()
			if (gridRecod.isNew) {
				if (gridRecod.dirty) {
					var temp = new Object()
					Ext.applyIf(temp, PlantFieldsInt);
					for (var i = 0; i < Columns.length; i++) {
						if (typeof(temp[Columns[i].name]) != "undefined") {
							temp[Columns[i].name] = gridRecod
									.get(Columns[i].name)
						}
					}
					form.loadRecord(new PlantFields(temp))
				} else
					form.loadRecord(new PlantFields(PlantFieldsInt))
				//form.reset()
				formPanelinsert.buttons[0].enable()

				formPanelinsert.isNew = true
			} else {
				var id = sm.getSelected().get('zlid')
				baseMgm.findById(beanA, id, function(rtn) {
							if (rtn == null) {
								Ext.MessageBox.show({
											title : '记录不存在！',
											msg : '未找到需要修改的记录，请刷新后再试！',
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.WARNING
										});
								return;
							}
							var obj = new Object();
							for (var i = 0; i < Fields.length; i++) {
								var n = Fields[i].name;
								if(n == 'indexid'){
									for(var j = 0;j<indexidStr.length;j++){
										  if(indexidStr[j][1] == 'undefined' ||indexidStr[j][1] == null || indexidStr[j][1]== '')
										          continue;
										  if(rtn[n] == indexidStr[j][0])
									         obj[n] = indexidStr[j][1];
							       	}
							       	continue;
								}
								obj[n] = rtn[n];
							}
							var record = new PlantFields(obj);
							form.loadRecord(record);
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
								}else if(yhArr.length==1){
									yhFirstValue=yhArr[0];
								}
							}
							form.findField("yhFirst1").setValue(yhFirstValue);
							form.findField("yhLast1").setValue(yhLastValue);
						})
			}
		} else {
			form.loadRecord(new PlantFields(PlantFieldsInt))
			formPanelinsert.buttons[0].disable()
		}
	}
	
	function formSave() {
		var form = formPanelinsert.getForm();
		var indexid = form.findField('indexid').getValue();
		for(var i=0;i<indexidStr.length;i++){
		  if(indexid  == indexidStr[i][1]){
		    form.findField('indexid').setValue(indexidStr[i][0])
		  }
		}
		if (form.isValid()) {
			var yhFirstValue=form.findField("yhFirst1").getValue();
			var yhLastValue=form.findField("yhLast1").getValue();
			var quantityValue=form.findField("quantity").getValue();
			var yhValue="";
			if((quantityValue!=0&&quantityValue!='')&&((yhFirstValue!=0&&yhFirstValue!='')||(yhLastValue!=0&&yhLastValue!=''))){
				Ext.example.msg('系统提示', '页数和页号只能填一个！');
				return;
			}else{
				if((quantityValue==0||quantityValue=='')&&(yhFirstValue!=0&&yhFirstValue!='')&&(yhLastValue!=0&&yhLastValue!='')){
					yhValue=yhFirstValue+"-"+yhLastValue;
				}else if((quantityValue==0||quantityValue=='')&&(yhFirstValue!=0&&yhFirstValue!='')&&(yhLastValue==0&&yhLastValue=='')){
					yhValue=yhFirstValue;
				}else if((quantityValue==0||quantityValue=='')&&(yhFirstValue==0&&yhFirstValue=='')&&(yhLastValue!=0&&yhLastValue!='')){
					yhValue=yhLastValue;
				}
			}
			form.findField("yh").setValue(yhValue);
			doFormSave(true)
		}
	}

	function doFormSave(dataArr) {
		var form = formPanelinsert.getForm()
		var quantity = form.findField('quantity').getValue();
		var yhValue = form.findField('yh').getValue();
		var obj = form.getValues()
		for (var i = 0; i < Fields.length; i++) {
			var n = Fields[i].name;
			var field = form.findField(n);
			if (field) {
				obj[n] = field.getValue();
			}
		}
		
		DWREngine.setAsync(false);
		zlMgm.editzlda(obj, function() {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					formWindowA.hide();
					//if(ys != quantity){
			  		DWREngine.setAsync(false);
					zlMgm.editUpdata(dzidNo,daidNo ,quantity,yhValue);
					DWREngine.setAsync(true);
					//}
					ds.load({
								params : {
									start : 0,
									limit : PAGE_SIZE,
									//params :"daid`"+selectdaid+";"
									params : "daid=" + selectdaid
								}
							});
				});
		DWREngine.setAsync(true);
		parent.ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});


	}

	function processResult(value) {
		if ("yes" == value) {
			formPanelinsert.getForm().reset();
			/*var url = BASE_PATH+"jsp/zlgl/da.zl.info.jsp?selectdaid="+id
			window.location.href = url;*/

		} else {
			inputWindow.hide();
			ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE,
							//params :"daid`"+selectdaid+";"
							params : "daid=" + selectdaid
						}
					});
		}
	}
	function deleteFun() {
		if (!sm.hasSelection()) {
			Ext.MessageBox.show({
						title : '警告',
						msg : '请选中将要删除的记录！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
			return;
		}
		var record = sm.getSelected();
		var id = record.get('dzid');
		record = sm.getSelections();// 得到选择的记录
		var ids = new Array();
		if (record != null) {
			DWREngine.setAsync(false);
			for (var i = 0; i < record.length; i++) {
				ids.push(record[i].get('dzid'));
				//zlMgm.ZlGdDel(record[i].get('dzid'))
			}

			zlMgm.ZlGdDel(ids,selectdaid)
			DWREngine.setAsync(true);
			Ext.example.msg('删除成功！', '您成功删除了' + ids.length + '条资料信息！');
			ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE,
							//params :"daid`"+selectdaid+";"
							params : "daid=" + selectdaid 
						}
					});
			parent.ds.load({
						params : {
							
							start : 0,
							limit : PAGE_SIZE
						}
					});

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
	// 下载数据上传模板
	function downLoadTemple() {
		var businessType="ZLDAIMPORT"
		DWREngine.setAsync(false);
		zlMgm.getFileidByBusinessType(businessType, function(
						fileid) {
					if (fileid && fileid.length > 0) {
						window.location.href = MAIN_SERVLET
								+ "?ac=downloadFile&fileid=" + fileid;
					} else {
						alert("请先联系管理员，在系统管理中上传模板")
					}
				})
		DWREngine.setAsync(true);
	}
	/////  //////////execel 导入功能 //////////////////////////////////////////////////////////////////////
	var fileForm;
	var fileWin;
	function showExcelWin() {
		fileForm = new Ext.form.FormPanel({
			fileUpload : true,
			labelWidth : 30,
			layout : 'form',
			url : CONTEXT_PATH + "/servlet/ZlDAExcelServlet?ac=importExcelData&pid=" + CURRENTAPPID+"&selectdaid="+selectdaid,
			baseCls : 'x-plain',
			items : [{
				id : 'excelfile',
				xtype : 'fileuploadfield',
				fieldLabel : 'excel',
				buttonText : 'excel上传',
				width : 390,
				border : false,
				listeners : {
					'fileselected' : function(field, value) {
						var _value = value.split('\\')[value.split('\\').length
								- 1]
						if ((_value.indexOf('.xls') != -1)  || (_value.indexOf('.xlsx') != -1)) {
							//this.ownerCt.buttons[0].enable()
						} else {
							field.setValue('')
							//this.ownerCt.buttons[0].disable()
							Ext.example.msg('警告', '请上传excel格式的文件')
						}
					}
				}
			}]
		})
		fileWin = new Ext.Window({
					id : 'excelWin',
					title : 'excel导入',
					modal : true,
					width : 450,
					height : 100,
					buttonAlign:'center',
					items : [fileForm],
					buttons : [{
						text : '确定',
						iconCls : 'upload',
						handler : doExcelUpLoad
					}]
				})
		fileWin.show()
	}

	function doExcelUpLoad() {
		var file = fileForm.getForm().findField("excelfile").getValue();
		fileForm.getForm().submit({
			waitTitle : '请稍候...',
			waitMsg : '数据上传中...',
			method:'POST',
			params:{
					 ac:'importExcelData'
			},
			success : function(form, action) {
				Ext.Msg.alert('恭喜', action.result.msg, function(v) {
							fileWin.close();
							refreshds();
							parent.ds.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
						})
			},
			failure : function(form, action) {
				Ext.Msg.alert('提示', action.result.msg, function(v) {
							fileWin.close();
							refreshds();
						})
			}
		})
	}

	function refreshds() {
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE,
						params : "daid=" + selectdaid
					}
				});
	}
	///////////////////////////////////////////////////////////////////
	function assignUploadInfo() {

		var frame = window.frames["uploadIFrame"];
		uploadFileInfo = frame.document.body.innerText;
		if (uploadFileInfo.substring(0, 9) == "fieldname") {
			var c = (uploadFileInfo.substring(0, uploadFileInfo.length - 1))
					.split(SPLITA)
			var msg = c[3].split(SPLITB)[1];
			var fieldName;
			var fileid;
			var filename;
			if (msg.split(SPLITC)[0] == SUCCESS) {
				fieldName = c[0].split(SPLITB)[1];
				fileid = c[1].split(SPLITB)[1];
				filename = c[2].split(SPLITB)[1];
			}
			var form = formPanelinsert.getForm();
			form.findField("filename").setValue(filename)
			form.findField("filelsh").setValue(fileid)

		}
	}
	function showFlowAdjunct() {
		var record = sm.getSelected();
		var _insid = record.get('insid');
		adjunctWindow = new Ext.Window({
					title : '查看流程附件',
					iconCls : 'copyUser',
					width : 650,
					height : 300,
					modal : true,
					layout : 'fit',
					closeAction : 'hide',
					maximizable : false,
					resizable : false,
					plain : true,
					items : [gridAdjunct]
				});
		adjunctWindow.show();
		dsAdjunct.baseParams.params = "insid='" + _insid + "'";
		dsAdjunct.load();
	}
	///////////////////////////////////////////////////////////////////////
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
			return "<center><a href='" + url + "'><span style='color:blue; '>" +"附件[1"+"]</span></a></center>"
		} else {
			var downloadStr="";
			var infoid = record.get('zlid');
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
			   editable1 = true;
			}else{
			   downloadStr="附件["+count+"]";
			   editable1 = true;
			}	
			return '<div id="sidebar"><a href="javascript:showUploadWin(\''
						+ businessType + '\', ' + editable1 + ', \''
						+ infoid
						+ '\', \''+winTitle+'\')">' + downloadStr +'</a></div>'
		
		
		}
	}
//修改排序号保存
	function savePxh(){
		   var str =  /^\+?[1-9][0-9]*$/;    
           var getPxh = Ext.getCmp('xh').getValue();
           if(getPxh == null || getPxh == ""){
                return;
           }else  if(!str.test(getPxh)){
			         	 Ext.example.msg('警告', '请输入小于99999的整数！');
			         	 return;
		        }else if(firstPxh != getPxh){
		        	var maxXh = 0;
		        	   DWREngine.setAsync(false);
		        	   baseDao.getData("select max(xh) from da_daml where daid='"+selectdaid+"' order by xh asc",function(num){
                                maxXh = num;
		        	   })
		        	   DWREngine.setAsync(true);
		        	   if(getPxh >maxXh){
		        	       	   Ext.example.msg('警告', '您输入的值大于存在的序号的最大值，请重新输入！');
		        	       	   return;
		        	       }else{
				           	   zlMgm.updateXH(dzidNo,selectdaid,getPxh,firstPxh,function(){
				           	              
				           	   });	
		        	       }
		        }else{
		            return;
		        }
           }
//点击排序按排序号刷新
      function refreshFn(){
       		ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE,
					params : "daid=" + selectdaid
				}
			});
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

//显示多附件的文件列表
function showUploadWin(businessType, editable1, businessId, winTitle) {
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
			+ businessType + "&editable=" + editable1 + "&businessId="
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
