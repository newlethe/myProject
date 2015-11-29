var root,saveBtn
var treePanelTitle = '合同付款计划'
var rootText = '所有合同分类'
var conType = '合同划分类型'
var isCon         //是否是具体的合同;type为合同的类型  con则是具体合同

Ext.onReady(function(){
	
	root = new Ext.tree.AsyncTreeNode({
		text:rootText,
		iconCls:'icon-pkg',
		id:''
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url:MAIN_SERVLET,
		baseParams:{
			ac:'columntree',
			treeName:'bdgMoneyPlanCon',
			businessName:'bdgMoneyPlanConMgm',
			parent:''
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	})

	treePanel = new Ext.tree.ColumnTree({
		id:'money-plan-contree',
		iconCls:'icon-by-category',
		region:'west',
        width: 420,
        minSize: 200,
        maxSize: 600,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: true,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
			header:'合同名称',
			width:420,
			dataIndex:'conname',
			renderer:function(value){
				return "<div id='conname'>"+value+"</div>"
			}			
		},{
			header:'pid',
			width:0,
			dataIndex:'pid',
			renderer:function(value){
				return "<div id='pid'>"+value+"</div>"
			}
		},{//column tree 的bug 第一列的值取不到，需要取得就要把其再起一列放到其它地方
			header:'合同名称',
			width:0,
			dataIndex:'conname',
			renderer:function(value){
				return "<div id='conname'>"+value+"</div>"
			}			
		},{
			header:'conno',
			width:0,
			dataIndex:'conno',
			renderer:function(value){
				return "<div id='conno'>"+value+"</div>"
			}
		},{
			header:'condivno',
			width:0,
			dataIndex:'condivno',
			renderer:function(value){
				return "<div id='condivno'>"+value+"</div>"
			}
		},{
			header:'conid',
			width:0,
			dataIndex:'conid',
			renderer:function(value){
				return "<div id='conid'>"+value+"</div>"
			}
		}],
		loader:treeLoader,
		root:root
	})

	treePanel.on('beforeload',function(node){
		var condivno = node.attributes.condivno
		if(condivno == null)
			condivno = ''
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = condivno
	})
	
	treePanel.on('click',onClick)
	
	function onClick(node,e){		
		var elNode = node.getUI().elNode
		var isRoot = node == root
		var baseForm = conFormPanel.getForm()
		var loadFormRecord = null		
		if(isRoot){
			isCon = 'type'
			conid = ''
		}else{
			isCon = elNode.all('pid').innerText == conType?'type':'con'
			conid = elNode.all('pid').innerText == conType?'':elNode.all('conid').innerText
		}
		if(isCon == 'con'){
			PlantInt['conid'] = conid
			conFormSetTitle = elNode.all('conname').innerText
			planDs.baseParams.params = "conid = '"+conid+"' "
			planDs.load({
				params:{start:0,limit:PAGE_SIZE}
			})
			DWREngine.setAsync(false)//加载form的合同信息
			baseMgm.findById(beanCon,conid,function(obj){
				loadFormRecord = new conFormRecord(obj)
			})
			DWREngine.setAsync(true)//得到合同付款的总金额
			bdgMoneyPlanConMgm.getConPayTotal(conid,function(value){
				conFormPanel.findById('totalPay').setValue(value)
			})			
			baseForm.loadRecord(loadFormRecord)		
		}else{
			Ext.Msg.alert('系统提示','请选择一个具体的合同进行操作!')
			baseForm.loadRecord(new conFormRecord(null))
			planDs.baseParams.params = " 1=2 "
			planDs.load({
				params:{start:0,limit:PAGE_SIZE}
			})			
		}
	}
	
	
	

	
	
	
	var contentPanel = new Ext.Panel({
		id:'content-panel',
		border:false,
		region:'center',
		split:true,
		layout:'border',
		layoutConfig:{
			height:'100%'
		},
		items:[conFormPanel,planGrid]
	})

// 7. 创建viewport加入面板content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [treePanel,contentPanel]
    });
    
    treePanel.render(); // 显示树
    treePanel.expand();
	root.expand();	
	
	
	
	
	
})