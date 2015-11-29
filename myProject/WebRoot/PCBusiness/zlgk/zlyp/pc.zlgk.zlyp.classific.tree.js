var bean = 'com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypTree';
var treeGrid;
var columns;
var store;
var btnexpendAll;
var btnexpendClose;

var selectedPath = "";
var selectNode = "";

var gcTypes = new Array();

Ext.onReady(function(){
    Ext.QuickTips.init();
    
   DWREngine.setAsync(false);
	appMgm.getCodeValue('质量验评工程类型',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			gcTypes.push(temp);			
		}
    });
	DWREngine.setAsync(true);
    
    columns = [
           {
				id : 'uuid',
				header : "质量验评分类主键",
				width : 100,
				sortable : true,
				dataIndex : 'uuid',
				hidden : true, 
				locked : true
			}, {
				id : 'engineerName',
				header : "工程名称",
				width : 300,
				sortable : true,
				renderer :function(value) {
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>';
				},
				dataIndex : 'engineerName'
			},  {
				id : 'engineerNo',
				header : "工程编号",
				width : 100,
				sortable : true,
				renderer :function(value) {
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>';
				},
				dataIndex : 'engineerNo'
			}, {
				id : 'engineerType',
				header : "工程类别",
				width : 80,
				sortable : true,
				align : 'center',
				renderer :function(value) {
                         for(var i = 0; i < gcTypes.length; i ++){
                            if(value == gcTypes[i][0]){
                              return gcTypes[i][1]
                            }
                         }
				},
				dataIndex : 'engineerType'
			}, {
				id : 'parentNo',
				header : "父节点",
				width : 100,
				sortable : true,
				dataIndex : 'parentNo',
				hidden : true, 
				locked : true
			}, {
				id : 'memo',
				header : "备注",
				width : 100,
				sortable : true,
				renderer :function(value) {
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>';
				},
				dataIndex : 'memo',
				hidden : true, 
				locked : true
			}, {
				id : 'pid',
				header : "PID",
				width : 100,
				sortable : true,
				dataIndex : 'pid',
				hidden : true, 
				locked : true
			}, {
				id : 'isleaf',
				header : "子节点",
				width : 100,
				sortable : true,
				dataIndex : 'isleaf',
				hidden : true, 
				locked : true
			}, {
				id : 'treeId',
				header : "树节点ID",
				width : 100,
				sortable : true,
				dataIndex : 'treeId',
				hidden : true, 
				locked : true
			}, {
				id : 'parentId',
				header : "父节点ID",
				width : 100,
				sortable : true,
				dataIndex : 'parentId',
				hidden : true, 
				locked : true
			}
    ];
    
    store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parentId',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'pcZlgkZlypTree',// 后台java代码的业务逻辑方法定义
					business : 'zlgkImpl',// spring 管理的bean定义
					bean : bean,// gridtree展示的bean
					params : 'pid' + SPLITB +  PID +SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'treeId',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["uuid", "engineerName", "engineerNo", 
							          "engineerType","parentNo","isleaf",
							          "memo","pid","treeId","parentId"]
						}),
				listeners : {
					'beforeload' : function(ds, options) {
						var parent = null;
						if (options.params[ds.paramNames.active_node] == null) {
							options.params[ds.paramNames.active_node] = '0';
							parent = "0"; // 此处设置第一次加载时的parent参数
						} else {
							parent = options.params[ds.paramNames.active_node];
						}
						ds.baseParams.params = 'pid' + SPLITB + PID
								+ ";parent" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});  
  
//    btnexpendAll = new Ext.Button({
//	    	text : '展开',
//	        iconCls : 'icon-expand-all',
//	        tooltip : '全部展开',
//	        handler : function() {
//	           store.expandAllNode();
//	        }
//        }) ;
//    btnexpendClose = new Ext.Button({
//	        text : '折叠',
//	        iconCls : 'icon-collapse-all',
//	        tooltip : '全部收起',
//	        handler : function() {
//	            store.collapseAllNode();
//	        }
//	    }) ; 
	
    treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'engineerName',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				columns : columns,
				stripeRows : true
			});   
			
	store.on("load", function(ds1, recs) {
		if(selectedPath && selectedPath!="") {
			store.expandPath(selectedPath, "treeId");
		} else {
			if (ds1.getCount() > 0) {
				var rec1 = ds1.getAt(0);
				if (!ds1.isExpandedNode(rec1)) {
					var ChildrenRec = this.getNodeChildren(rec1);
					ds1.expandNode(rec1);
					if(ChildrenRec!= null){
						var len = ChildrenRec.length;
					   if(len>0){
				        	this.expandNode(ChildrenRec[0]);
				        }
					}
				}
			}
		}
	});
	
	
	store.on('expandnode', function(ds, rc) {
				if (selectedPath && selectedPath != "") {
					var equidArr = selectedPath.split("/");
					if (rc.get("treeId") == equidArr.pop()) {
						treeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
					}
				}
	});
})