var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "概算结构维护";
var rootText = "所有概算单";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var allRealmoney = 0;
var queryBdgid;
var checkBgdWin;
var checkRtn='';
if(PID!=''&&PRONAME!=""){

switchoverProj(PID,PRONAME)
}
Ext.onReady(function() {
	DWREngine.setAsync(false);
	bdgInfoMgm.sumAllRealmoney(CURRENTAPPID, function(total) {
				if (total) {
					allRealmoney = cnMoneyToPrec(total);
				}
			})
	DWREngine.setAsync(true);
	root = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0', // 重要 : 展开第一个节点 !!
				leaf : false,
				expanded :true
			})
	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "bdgDynamicTree",
					businessName : "pcDynamicDataService",
					pid :CURRENTAPPID,
					parent : 0,
					time : TIME
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
		// header : true,
		// headerAsText:true,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		collapsible : true,
		columns : [{
					header : '概算名称',
					width : 300,
					dataIndex : 'bdgname'
				}
				, {
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
					width : 100,
					dataIndex : 'bdgno'
				}, {
					header : '是否工程量',
					width : 0,
					dataIndex : 'bdgflag',
					renderer : function(value) {
						return value > 0 ? '概算' : '工程量';
					}
				}, {
					header : '概算金额',
					width : 120,
					dataIndex : 'bdgmoney',
					renderer : function(value) {
						return '<div id="bdgmoney" align=right>'
								+ cnMoneyToPrec(value) + '</div>';
					}
				}, {
					header : '分摊总金额',
					width : 80,
					dataIndex : 'contmoney',
					align : 'right',
					renderer : function(value) {
						return '<div align=right>' + cnMoneyToPrec(value)
								+ '</div>';
					}
				}, {
					header : '差值',
					width : 80,
					dataIndex : 'remainder',
					align : 'right',
					renderer : function(value) {
						var str;
						if (value.toString().charAt(0) == "-") {
							str = '<div align=right style="color:red">'
									+ cnMoneyToPrec(value) + '</div>';
						} else {
							str = '<div align=right >' + cnMoneyToPrec(value)
									+ '</div>';
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
						return '<div id="bdgmoneyCal" align=right style="display:none"> '
								+ cnMoneyToPrec(value) + '</div>';
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
	root.expand(false,false,function(n){
		var firstNode = n.firstChild;
		if (firstNode){
			firstNode.expand();
		}
	});


  var tbarArr = [
						{
							iconCls : 'icon-expand-all',
							tooltip : 'Expand All',
							handler : function() {
								root.expand(true);
							}
						},
						'-',
						{
							iconCls : 'icon-collapse-all',
							tooltip : 'Collapse All',
							handler : function() {
								root.collapse(true);
							}
						},
						'<font color=#15428b><b>&nbsp;' + treePanelTitle
								+ '</b></font>', '-',
						'->', '所有合同分摊总金额：' + allRealmoney];
    
	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				tbar : tbarArr,
				items : [treePanel]
			})
	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
					layout : 'border',
					items : [contentPanel],
					title : 'Simple Tasks',
					iconCls : 'icon-show-all'
				}).render();
	} else {
		var viewport = new Ext.Viewport({
					layout : 'border',
					items : [contentPanel]
				});
	}
	treePanel.render(); // 显示树
	root.expand();
	treePanel.expand();
});