var treePanel, gridPanel;
var ServletUrl = MAIN_SERVLET
var formPanelTitle = "安监检查项目维护";
var rootText = "安全检查表项目分类";
var nodes = new Array();
var roleTypeSt;
var bean = "com.sgepit.pmis.safeManage.hbm.SafeCheckStandard";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = "id";
var orderColumn = "id";
var root;
var formWin;
var formWindow;
var formPanel;
var selectedTreeData;
var sextype = new Array();

Ext.onReady(function() {

	var fm = Ext.form; // 包名简写（缩写）

	root = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form'

			})
			
	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "safeTypeTree",
					businessName : "safeManageMgmImpl",
					parent : 0
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
				split : true,
				frame : false,
				header : false,
				border : false,
				lines : true,
				autoScroll : true,
				animate : false,
				tbar : [{
							iconCls : 'icon-expand-all',
							tooltip : '全部展开',
							handler : function() {
								root.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : '全部折叠',
							handler : function() {
								root.collapse(true);
							}
						}],
				columns : [{
							header : '名称',
							width : 260,
							hidden : true,
							dataIndex : 'mc'
						}, {
							header : '主键',
							width : 0,
							dataIndex : 'treeid',
							hidden : true,
							renderer : function(value) {
								return "<div id='treeid'>" + value
										+ "</div>";
							}
						}],
				loader : treeLoader,
				root : root,
				rootVisible : false
			});

	treePanel.on('beforeload', function(node) {
				var treenode = node.attributes.treeid;
				if (treenode == null)
					treenode = 'root';
				var baseParams = treePanel.loader.baseParams
				baseParams.parent = treenode;

			})

	treePanel.on('click', function(node) {
				var elNode = node.getUI().elNode;
				selectedTreeData = node.id;
				PlantInt.subjection_id = selectedTreeData;
				ds.baseParams.params = "  subjection_id = '"
						+ selectedTreeData + "'"
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});

	var fc = { // 创建编辑域配置
		'id' : {
			name : 'id',
			fieldLabel : '主键',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'content_data' : {
			name : 'content_data',
			fieldLabel : '检查内容',
			allowBlank : false,
			anchor : '95%'
		},
		'standard_num' : {
			name : 'standard_num',
			fieldLabel : '标准分',
			allowBlank : false,
			anchor : '95%'
		},
		'subjection_id' : {
			name : 'subjection_id',
			fieldLabel : '类型编号',
			anchor : '95%'
		}
	};

	var Columns = [{
				name : 'id',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'content_data',
				type : 'string'
			}, {
				name : 'standard_num',
				type : 'float'
			}, {
				name : 'subjection_id',
				type : 'string'
			}];

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantInt = {
		id : '',
		content_data : '',
		standard_num : null,
		subjection_id : selectedTreeData
	};

	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, {
				id : 'id',
				header : fc['id'].fieldLabel,
				dataIndex : fc['id'].name,
				hidden : true,
				width : 150
			}, {
				id : 'content_data',
				header : fc['content_data'].fieldLabel,
				dataIndex : fc['content_data'].name,
				width : 300,
				editor : new fm.TextField(fc['content_data'])
			}, {
				id : 'standard_num',
				header : fc['standard_num'].fieldLabel,
				dataIndex : fc['standard_num'].name,
				width : 100,
				editor : new fm.NumberField(fc['standard_num'])
			}, {
				id : 'subjection_id',
				header : fc['subjection_id'].fieldLabel,
				dataIndex : fc['subjection_id'].name,
				//hidden : true,
				width : 200,
				editor : new fm.TextField(fc['subjection_id'])
			}]);
	cm.defaultSortable = true; // 设置是否可排序

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : " 1=1"
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

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		tbar : [], // 顶部工具栏，可选
		title : formPanelTitle, // 面板标题
		border : false, // 
		region : 'center',
		clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
		header : true, //
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
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
		business : business, // business名称，可选
		primaryKey : primaryKey,// 主键列名称，必须	
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		deleteHandler : deleteFun,
		saveHandler : saveFun
		});

	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, gridPanel]
	});
					
	function insertFun(){
    	
    	if (selectedTreeData == null) {
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择左边的安全项目分类！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}else{
			gridPanel.defaultInsertHandler(); 
		}

    }
    
    function deleteFun(){
    	if (sm.getCount() > 0) {
    		gridPanel.defaultDeleteHandler(); 
    	}
    }    
	
    function saveFun(){
    	gridPanel.defaultSaveHandler();
    }      

});
