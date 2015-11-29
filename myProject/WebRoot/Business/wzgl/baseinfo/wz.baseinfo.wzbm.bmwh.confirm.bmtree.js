var root,treeLoader,treePanel,selectedTreeData,selectedTreeData_text
var rootText='物资分类'
var f_bmArr = new Array;

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
Ext.onReady(function(){
	
	//--------------物资编码Tree---------------------
   root = new Ext.tree.AsyncTreeNode({
		text:rootText,
		inconCls:'form',
		id : '0'
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "wzBmTypeTree",
			businessName : "wzglMgmImpl",
			parent : 0,
			pid : CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	})
	
	treePanel = new Ext.tree.ColumnTree({
		id : 'zl-tree-panel',
		region : 'center',
		split : true,
		width : 205,
		minSize : 175,
		maxSize : 300,
		tbar:[{
            iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ root.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ root.collapse(true); }
            }],
		frame : false,
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		columns : [{
			header : '名称',
			width : 280,
			dataIndex : 'pm',
			renderer: function(value){
            	return "<div id='pm'>"+value+"</div>";
            }
		}, {
            header: '主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '编码',
            width:   120,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";
            }
        },{
            header: '层数',
            width:  0,
            dataIndex: 'lvl'
        },{
            header: '叶子',
            width:  0,
            dataIndex: 'isleaf'
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent'
        }
        ],
        tbar:[
        	{	text:'选择',
        		iconCls:'btn',
        		handler:function(node,e){
        			flbm_Combo.setValue(selectedTreeData);
					flbm_Combo.setRawValue(selectedTreeData_text);
					//-----生成物资编码
					var flbm = selectedTreeData;
					var max_random_bm="";
					DWREngine.setAsync(false);
				 	wzbaseinfoMgm.getStockWzBm(flbm,CURRENTAPPID,function(value){
							max_random_bm = value
				    });
				 	DWREngine.setAsync(true);
					formPanel.getForm().findField('wzbm').setValue(max_random_bm);
					partbWindow.hide();
			}
        	},
        	{	text:'取消',
        		iconCls:'btn',
        		handler:function(){partbWindow.hide()}
        	}],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;
	})	

	treePanel.on('click',onClick);
	function onClick(node,e){
		tmpNode=node
		selectedTreeData = node.id;
		selectedTreeData_text = node.text;
		}
});