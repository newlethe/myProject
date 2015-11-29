
var bean = "com.sgepit.pmis.budget.hbm.BdgMoneyApp"
var gridPanelTitle = "合同:" +　conname
var pid = CURRENTAPPID;
var rootText = "概算金额分摊";
var bdgid;
var menu_mc,menu_no,menu_appid,menu_bdgid,menu_isLeaf
Ext.onReady(function (){
	
    var BUTTON_CONFIG = {
    	'SELECT': {
			text: '选择',
			iconCls: 'btn',
			handler:selectBdg
		}
    };
	
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'
    })
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"bdgMoneyTree", 
			businessName:"bdgMgm", 
			conid:conid, 
			conmoney: "",
			parent:0
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '概算名称',
            width: 370,				//隐藏字段
            dataIndex: 'bdgname'
        },{
            header: '财务编码',
            width: 0,
            dataIndex: 'bdgno'
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid',
            renderer: function(value){
            	return "<div id='pid'>"+value+"</div>";
            }
        },
        {width: 0, dataIndex: 'bdgname',
            renderer: function(value){
            	return "<div id='bdgname'>"+value+"</div>";
            }},	
         {
            header: '财务编码',width: 0,dataIndex: 'bdgno',
            renderer: function(value){
            	return "<div id='bdgno'>"+value+"</div>";
            }
        },
        {
            header: '概算金额主键',	
            width: 0,				
            dataIndex: 'appid',
            renderer: function(value){
            	return "<div id='appid' >"+value+"</div>";
            }
        },{
            header: '概算主键',	
            width: 0,				
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '内部流水号',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        },{
            header: '概算金额',
            width: 120,width: 0,
            dataIndex: 'bdgmoney',
            renderer: cnMoney
        },{
            header: '合同分摊总金额',
            width: 120,width: 0,
            dataIndex: 'sumrealmoney',
             renderer: function(value){
            	return "<div id='sumrealmoney' align='right'>￥"+value+"</div>";
            }
            //renderer: cnMoney	
        },{
            header: '本合同分摊',
            width: 120,width: 0,
            dataIndex: 'realmoney',
             renderer: function(value){
            	return "<div id='realmoney' align='right'>￥"+value+"</div>";
            }
            //renderer: cnMoney	
        },{
            header: '项目标示',
            width: 0,
            dataIndex: 'prosign',
            renderer: function(value){
            	return "<div id='prosign'>"+value+"</div>";
            }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        },{
            header:'备注',
            width:0
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	
	treePanelNew.on('beforeload', function(node) {
		bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = conid;
		baseParams.conmoney = "" ;
		baseParams.parent = bdgid;	
	})
	
    treePanelNew.on('click', onClick);
		function onClick(node, e ){
			var elNode = node.getUI().elNode;
			var isRoot = node == rootNew;
			menu_appid = isRoot ? "0" : elNode.all("appid").innerText;
			menu_bdgid = isRoot ? "0" : elNode.all("bdgid").innerText;
			menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
			menu_mc = isRoot ? "0" : elNode.all("bdgname").innerText;
			menu_no = isRoot ? "0" : elNode.all("bdgno").innerText;
		}
		
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		tbar:[
			'<font color=#15428b><b>&nbsp;'+ gridPanelTitle + '</b></font>','-',
			{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ rootNew.expand(true); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ rootNew.collapse(true); }
            },'->',
            BUTTON_CONFIG['SELECT'],'-'
		],
		items: [treePanelNew]
		
	}) 
			
	// 7. 创建viewport加入面板content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [contentPanel]
    });
	treePanelNew.render();
	treePanelNew.expand();
	rootNew.expand();

	function formatDate(value){
			return value ? value.dateFormat('Y-m-d') : '';
	};

	
	function selectBdg(){
		if(menu_isLeaf==1){
			window.returnValue=menu_mc+"||"+menu_no
			window.close()
		}else{
			Ext.MessageBox.alert("提示","请选择最底层概算项！")
		}
	}
});

	
 




