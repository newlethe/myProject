var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "概算结构树";
var rootText = "所有概算单";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量

Ext.onReady(function() {

	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : '0'  // 重要 : 展开第一个节点 !!
	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "BudgetInfoTree",
			businessName : "bdgMgm",
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'center',
		width : 800,
		minSize : 275,
		maxSize : 600,
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		columns : [{
			header : '概算名称',
			width : 370,
			dataIndex : 'bdgname'
		}, {
			header : '概算主键',
			width : 0, // 隐藏字段
			dataIndex : 'bdgid',
			renderer : function(value) {
				return "<div id='bdgid'>" + value + "</div>";
			}
		}, {
			header : '项目工程编号',
			width : 0, // 隐藏字段
			dataIndex : 'pid'
		}, {
			header : '概算编码',
			width : 0,
			dataIndex : 'bdgno',
			renderer:function(value){
				return "<div id='bdgno'>"+value+"</div>";
			}
		}, {
			header : '是否工程量',
			width : 0,
			dataIndex : 'bdgflag',
			renderer : function(value) {
				return value > 0 ? '概算' : '工程量';
			}
		}, {
			header : '概算金额',
			width : 0,
			dataIndex : 'bdgmoney',
			renderer : function(value) {
				return '<div id="bdgmoney" align=right>' + cnMoney(value) + '</div>';
			}			
		}, {
			header : '分摊总金额',
			width : 0,
			dataIndex : 'contmoney',
			align : 'right',
			renderer : function(value) {
				return '<div align=right>' + cnMoney(value) + '</div>';
			}
		}, {
			header : '差值',
			width : 0,
			dataIndex : 'remainder',
			align : 'right',
			renderer : function(value) {
				var str;
				if (value.toString().charAt(0) == "-") {
					str = '<div align=right style="color:red">'
							+ cnMoney(value) + '</div>';
				} else {
					str = '<div align=right >' + cnMoney(value) + '</div>';
				}
				return str;
			}
		}, {
			header : '材料金额',
			width : 0,
			dataIndex : 'matrmoney'
		}, {
			header : '建筑金额',
			width : 0,
			dataIndex : 'buildmoney'
		}, {
			header : '设备安装金额',
			width : 0,
			dataIndex : 'equmoney'
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf',
			renderer : function(value) {
				return "<div id='isleaf'>" + value + "</div>";
			}
		}, {
			header : '父节点',
			width : 0,
			dataIndex : 'parent',
			renderer : function(value) {
				return "<div id='parent'>" + value + "</div>";
			}
		}, {
			header : '概算金额Cal1',
			width : 0,			
			dataIndex : 'bdgmoneyCal',
			renderer : function(value) {
				return '<div id="bdgmoneyCal" align=right style="display:none"> ' + cnMoney(value) + '</div>';
			}			
		}],
		loader : treeLoader,
		root : root,
		rootVisible : false
	});

	treePanel.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = bdgid;
	})


	treePanel.on('click', onClick);
	function onClick(node, e) {
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		var bdgid = isRoot ? "0" : elNode.all("bdgno").innerText;
		
		bgdid_Combo.setValue(bdgid);
	    bgdid_Combo.setRawValue(node.text);
		
		partbWindow.hide()
	}
	

	
	partbWindow = new Ext.Window({	               
         title: '<font color=#15428b><b>&nbsp;概算结构树</b></font>',
         layout: 'fit',
         width: 430,
         height: 460,
         modal: true,
         closeAction: 'hide',
         constrain:true,
         maximizable: true,
         plain: true,	                
         items: treePanel
     });
});