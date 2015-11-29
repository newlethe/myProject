var bean = 'com.sgepit.pmis.budget.hbm.BdgMoneyPlanMain'
var business = 'baseMgm'
var listMethod = 'findWhereOrderby'
var primaryKey = 'planmainid'
var orderColumns = 'planYear,planMonth'
var PAGE_SIZE = 6
var yearArray = new Array()
var monthArray = new Array()
var rootText = '工程量投资计划明细'
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var mainid = ''
var bdgid = ''
var subTreePanel,subTreeLoader,subRoot
var menu_id,menu_bdgid,menu_conids,menu_isLeaf //node click事件和menu click时间的变量


Ext.onReady(function(){
	
	//工程量投资计划管理主表 相关
	//初始化年度的combo，上下五年，数组一个10个元素
	var beginYear = new Date().getFullYear() - 5
	for(var i = beginYear;i<beginYear+10;i++){
		var temp = new Array()
		temp.push(i)
		temp.push(i+'年')
		yearArray.push(temp)
	}
	
	var dsYear = new Ext.data.SimpleStore({
		fields:['k','v'],
		data:yearArray
	})
	//初始化月份combo的数据
	for(var i = 1;i<=12;i++){
		var temp = new Array()
		temp.push(i)
		temp.push(i+'月份')
		monthArray.push(temp)
	}
	
	var dsMonth = new Ext.data.SimpleStore({
		fields:['k','v'],
		data:monthArray
	})
	
	var mainFc = {
		'planmainid':{
			name:'planmainid',
			fieldLabel:'主键',
			hidden:true,
			hideLabel:true
		},'pid':{
			name:'pid',
			fieldLabel:'工程项目编号'	,
			hidden:true,
			hideLabel:true
		},'planYear':{
			name:'planYear',
			fieldLabel:'计划年度'	,
			store:dsYear,
			displayField:'v',
			valueField:'k',
			typeAhead:true,
			mode:'local',
			triggerAction:'all',
			emptyText:'请选择年度...',
			selectOnFocus:true,		
			width:125,			
			readOnly:true,
			anchor:'95%'
		},'planMonth':{
			name:'planMonth',
			fieldLabel:'计划月份'	,
			store:dsMonth,
			displayField:'v',
			valueField:'k',
			typeAhead:true,
			mode:'local',
			triggerAction:'all',
			emptyText:'请选择月份...',
			selectOnFocus:true,		
			readOnly:true,
			allowBlank:false,
			anchor:'95%'
		},'planMaker':{
			name:'planMaker',
			fieldLabel:'填报人',
			readOnly:true,
			anchor:'95%'
		},'makeDate':{
			name:'makeDate',
			fieldLabel:'填报日期',
			readOnly:true,
			format:'Y-m-d',
			anchor:'95%'
		},'planTotal':{
			name:'planTotal',
			fieldLabel:'本月计划投资总金额',
			readOnly:true,
			anchor:'95%'
		},'planRemark':{
			name:'planRemark',
			fieldLabel:'备注',			
			anchor:'95%'
		},'planType':{
			name:'planType',
			fieldLabel:'投资类型'	,
			readOnly:true		
		}
	}
	
	var MainColumns = [
		{name:'planmainid',type:'string'},
		{name:'pid',type:'string'},
		{name:'planYear',type:'int'},
		{name:'planMonth',type:'int'},
		{name:'planMaker',type:'string'},
		{name:'planTotal',type:'float'},
		{name:'planRemark',type:'string'},
		{name:'makeDate',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'planType',type:'string'}
	]
	
	var MainPlant = Ext.data.Record.create(MainColumns)
	var MainPlantInt = {
			planmainid:'',
			pid:CURRENTAPPID,
			planYear:new Date().getFullYear(),
			planMonth:'',
			planMaker:USERNAME,
			planTotal:0,
			planRemark:'',
			makeDate:new Date(),
			planType:'月度投资计划'
		}
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),sm,{
			id:'planmainid',
			header:mainFc['planmainid'].fieldLabel,
			dataIndex:mainFc['planmainid'].name,
			hidden:true
		},{
			id:'pid',
			header:mainFc['pid'].fieldLabel,
			dataIndex:mainFc['pid'].name,
			hidden:true
		},{
			id:'planYear',
			type:'combo',
			header:mainFc['planYear'].fieldLabel,
			dataIndex:mainFc['planYear'].name,
			editor:new Ext.form.ComboBox(mainFc['planYear']),
			width:75
		},{
			id:'planMonth',
			header:mainFc['planMonth'].fieldLabel,
			dataIndex:mainFc['planMonth'].name,
			editor:new Ext.form.ComboBox(mainFc['planMonth']),
			width:75
		},{
			id:'planMaker',
			header:mainFc['planMaker'].fieldLabel,
			dataIndex:mainFc['planMaker'].name,
			editor:new Ext.form.TextField(mainFc['planMaker']),
			width:100
		},{
			id:'planTotal',
			header:mainFc['planTotal'].fieldLabel,
			dataIndex:mainFc['planTotal'].name,
			editor:new Ext.form.NumberField(mainFc['planTotal']),
			renderer:cnMoney,
			width:125
		},{
			id:'makeDate',
			header:mainFc['makeDate'].fieldLabel,
			dataIndex:mainFc['makeDate'].name,
			renderer:formatDate,
			editor:new Ext.form.DateField(mainFc['makeDate']),
			width:100
		},{
			id:'planType',
			header:mainFc['planType'].fieldLabel,
			dataIndex:mainFc['planType'].name,
			editor:new Ext.form.TextField(mainFc['planType']),
//			hidden:true
			width:200
		},{
			id:'planRemark',
			header:mainFc['planRemark'].fieldLabel,
			dataIndex:mainFc['planRemark'].name,
			editor:new Ext.form.TextArea(mainFc['planRemark']),		
			width:240
		}
	])
	cm.defaultSortable = true
	
	var mainDs = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method:listMethod,
			params:''
		},
		proxy:new Ext.data.HttpProxy({
			method:'GET',
			url:MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root:'topics',
			totalProperty:'totalCount',
			id:primaryKey
		},MainColumns),
		remoteSort:true,
		pruneModifiedRecords:true
	})
	mainDs.setDefaultSort(orderColumns,'asc')
	
	var mainGrid = new Ext.grid.EditorGridTbarPanel({
		id:'plan-money-main',
		title:'工程量投资计划主表',
		ds:mainDs,
		cm:cm,
		sm:sm,
		width:400,
//		height:230,
		border:false,
		region:'center',
		clicksToEditor:2,
		border:false,
		frame:false,
		autoScroll:true,
		collapsible:false,
		animaCollapse:false,
		loadMask:true,
		stripeRows:true,
		saveHandler:checkSaveHandler,
		deleteHandler:checkDeleteHandler,
//		addBtn:false,checkMaintoSub
//		delBtn:false,
		viewConfig:{
			ignoreAadd:true
		},
		tbar:[{	
				id:'initplan',
				text:'初始化投资计划',
				pressed:true,
				iconCls:'form',
				handler:onClickInit
		},'-'],
		bbar:new Ext.PagingToolbar({
			pageSize:PAGE_SIZE,
			store:mainDs,
			displayInfo:true,
			displayMsg:'{0}-{1}/{2}',
			emptyMsg:'无记录。'
		}),
		plant:MainPlant,
		plantInt:MainPlantInt,
		servletUrl:MAIN_SERVLET,
		bean:bean,
		business:business,
		primaryKey:primaryKey
	})

	mainDs.load({
		params:{start:0,limit:PAGE_SIZE},
		callback:function(){
			sm.selectFirstRow()
		}
	})	
	
	function checkSaveHandler(){
		var mainStore = this.getStore()
		var mainRecords = mainStore.getModifiedRecords()	
		for(var i = 0;i<mainRecords.length;i++){
			var yearmodify = mainRecords[i].get('planYear')
			var monthmodify = mainRecords[i].get('planMonth')
			if(yearmodify != null && monthmodify !=null){
				DWREngine.setAsync(false)
				bdgMoneyPlanMainMgm.checkPlanMain(yearmodify,monthmodify,function(flag){
					if(flag == '1'&&mainRecords[i].isInsert){
						Ext.Msg.alert('提示',yearmodify+'年'+monthmodify+'月份的投资计划已经存在!')
						mainStore.remove(mainRecords[i])
					}else{
						mainGrid.defaultSaveHandler()
					}
				})
				DWREngine.setAsync(true);
			}else{
				mainGrid.defaultSaveHandler()
			}		
		}
	}
	
	function checkDeleteHandler(){
		var sm = mainGrid.getSelectionModel()
		if(sm.getCount() == 0){
			Ext.Msg.alert('提示!','您尚未选择一条记录!')
			return
		}
		mainId = sm.getSelected().get('planmainid')
		bdgMoneyPlanSubMgm.checkMaintoSub(mainId,function(flag){
			if(flag == '0'){
//				Ext.example.msg('删除成功!','您成功删除了一条记录!')
				mainGrid.defaultDeleteHandler()
			}else{
				Ext.Msg.alert('不能删除!','该记录存在子记录!')
			}
		})
	}
	
	//增加新增的记录集的标志符,用兩個事件和checkSaveHandler来限制新增
	//和修改的时候不产生年度和月度都相同的记录
	mainGrid.on('afterinsert',function(){
		Ext.apply(mainGrid.getStore().getAt(0),{isInsert:true})
	})	
	
	mainGrid.on('beforeedit',function(obj){
		if(!obj.record.isInsert){
			if(obj.field == 'planMonth'||obj.field == 'planYear'){
				Ext.Msg.alert('提示','年度和月份不能修改')
				obj.cancel = true
			}			
		}

	})
	
	function onClickInit(){
		var sm = mainGrid.getSelectionModel()
		if(sm.getCount() == 0){
			Ext.Msg.alert('提示','请选择一条主记录再进行操作!')
			return
		}
		mainId = sm.getSelected().get('planmainid')
		window.location.href = BASE_PATH +"Business/budget/money.plan.choose.bdgtree.jsp?mainid="+mainId
//		mainGrid.getTopToolbar().items.get('initplan').setDisabled(true)
	}	
		
	//工程量投资计划管理从表树相关
	subRoot = new Ext.tree.AsyncTreeNode({
		text:rootText,
		iconCls:'form',
		id:'0'
	})
	
	subTreeLoader = new Ext.tree.TreeLoader({
		url:MAIN_SERVLET,
		baseParams:{
			ac:'columntree',
			treeName:'planSubTree',
			businessName:'bdgMoneyPlanSubMgm',
			mainid:mainid,
			parent:0
		},
		clearOnLoad:true,
		uiProviders:{
			'col':Ext.tree.ColumnNodeUI
		}
	})
	
	subTreePanel = new Ext.tree.ColumnTree({
		id:'money-plan-tree',
		iconCls:'icon-by-category',
		region:'center',
		width : 800,
		minSize : 275,
		maxSize : 600,
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		columns:[{
			header:'概算名称',
			width:225,
			dataIndex:'bdgname'
		},{
			header:'财务编码',
			width:0,
			dataIndex:'bdgno',
            renderer: function(value){
            	return "<div id='bdgno'>"+value+"</div>";
            }			
		},{
			header:'工程项目编号',
			width:0,
			dataIndex:'pid'			
		},{
			header:'投资计划主键',
			width:0,
			dataIndex:'id',
            renderer: function(value){
            	return "<div id='id'>"+value+"</div>";
            }			
		},{
			header:'投资计划主表主键',
			width:0,
			dataIndex:'mainid',
            renderer: function(value){
            	return "<div id='mainid'>"+value+"</div>";
            }			
		},{
			header:'概算主键',
			width:0,
			dataIndex:'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
		},{
			header:'概算金额',
			width:110,
			dataIndex:'bdgmoney',
			renderer: cnMoney
		},{
			header:'分摊总金额',
			width:110,
			dataIndex:'totalappmoney',
			renderer: cnMoney
		},{
			header:'本月计划投资金额',
			width:110,
			dataIndex:'planmoney',
			renderer: cnMoney
		},{
			header:'概算合同名称',
			width:270,
			dataIndex:'connames'			
		},{
			header:'概算合同主键集',
			width:0,
			dataIndex:'bdgconids',
            renderer: function(value){
            	return "<div id='bdgconids'>"+value+"</div>";
            }			
		},{
			header:'是否子节点',
			width:0,
			dataIndex:'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }			
		},{
			header:'父节点',
			width:0,
			dataIndex:'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }			
		},{
			header:'备注',
			width:0,
			dataIndex:'remark'			
		}],
		loader:subTreeLoader,
		root:subRoot,
		rootVisible:false
	})
	
	subTreePanel.on('beforeload',function(node){
		bdgid = node.attributes.bdgid
		if(bdgid == null)
			bdgid = '0'
		var baseParams = subTreePanel.loader.baseParams   
		baseParams.mainid = mainid
		baseParams.parent = bdgid
	})
	
	
	var contentPanel = new Ext.Panel({
		id:'main-panel',
		title:'工程量投资明细树',		
		border:false,
		region:'south',
		height:330,
		layout:'border',
		autoScroll:true,
		collapsible:true,
		items:[subTreePanel,formPanel]
	})
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[mainGrid,contentPanel]
	})
	
	
	sm.on('rowselect',function(sm,index,r){
		mainid = r.get('planmainid')
		if(mainid == ''||mainid == null) //解决点击表头的checkbox刷出树的问题
			return
		var baseParams = subTreePanel.loader.baseParams
		baseParams.mainid = mainid
		baseParams.parent = '0'
		subTreeLoader.load(subRoot);
		subRoot.expand();
	},this,{
		buffer:500    //设置点击缓冲时间，防止两次连续点击 连续触发事件出现重复的树
	})		
	
	var treeMenu = new Ext.menu.Menu({
		id:'subtree-menu',
		width:100,
		items:[{
			id:'menu-update',
			text:' 修改',
			iconCls:'btn',
			handler:onClickMenu
		},{
			id:'menu-delete',
			text:' 删除',
			iconCls:'remove',
			handler:onClickMenu
		}]
	})
	
	subTreePanel.on('contextmenu',contextmenu,this)
	function contextmenu(node,e){
		node.fireEvent('click',node,e)
		var name = e.getTarget().innerText
		var isRoot = rootText == name
		for(var i = 0;i<treeMenu.items.length;i++)
			treeMenu.items.get(i).value = node
		if(isRoot)
			return
		treeMenu.showAt(e.getXY())
	}
	
	subTreePanel.on('click',onClick)
	function onClick(node,e){
		var elNode = node.getUI().elNode
		var isRoot = node == subRoot
		menu_id = isRoot ?'0':elNode.all('id').innerText
		menu_bdgid = isRoot?'0':elNode.all('bdgid').innerText
		menu_conids = isRoot?null:elNode.all('bdgconids').innerText
		menu_isLeaf = isRoot?'false':elNode.all('isleaf').innerText
		var formRecord = Ext.data.Record.create(SubColumns)
		var loadFormRecord = null
		var loadFormBdgInfo = null
		var connames = ''
		DWREngine.setAsync(false)
		baseMgm.findById(beanNameTree,menu_id,function(obj){
			loadFormRecord = new formRecord(obj)
		})
		baseMgm.findById(beanNameBdg,menu_bdgid,function(obj){
			loadFormBdgInfo = new formRecord({
				bdgname:obj.bdgname,
				bdgno:obj.bdgno,
				bdgmoney:obj.bdgmoney,
				totalappmoney:obj.contmoney 
			})
		})
		bdgMoneyPlanSubMgm.getBdgAppConnames(menu_conids,function(str){
			connames = str
		})
		DWREngine.setAsync(true)
		tmpNode = node
		tmpLeaf = menu_isLeaf
		formPanel.getForm().loadRecord(loadFormRecord)
		formPanel.getForm().loadRecord(loadFormBdgInfo)
		formPanel.findById('connames').setValue(connames)
		formPanel.expand()
	}
	
	function onClickMenu(){
		var node = tmpNode
		var state = this.text
		var elNode = node.getUI().elNode
		var isRoot = rootText == node.text
		menu_id = isRoot?'0':elNode.all('id').innerText
		menu_parent = isRoot?'0':elNode.all('parent').innerText
		menu_isLeaf = isRoot?'false':elNode.all('isleaf').innerText
		
		if(state == ' 删除'){
			delHandler(menu_isLeaf,menu_id,menu_parent,node)
		}else{
			formPanel.isNew = false
			saveBtn.setDisabled(false)
		}
	}
	
	function delHandler(isleaf,id,parentid,node){
		if(isleaf == '0'){
			Ext.Msg.alert('提示','父节点不能直接删除!')
		}else{
			Ext.Msg.confirm('提示','是否确定删除?',function(value){
				if(value == 'yes'){
					subTreePanel.getEl().mask("loading...")
					bdgMoneyPlanSubMgm.deleteChildNodePlanSub(id,function(flag){
						if(flag == '0'){
							var isOnly = node.parentNode.childNodes.length == 1
							var pNode = isOnly?node.parentNode.parentNode:node.parentNode
							var formRecord = Ext.data.Record.create(SubColumns)
//							var emptyRecord = new formRecord(subInt)
//							formPanel.getForm().loadRecord(emptyRecord)
//							formPanel.getForm().clearInvalid()
//							formPanel.expand()
							subTreeLoader.load(pNode)
							pNode.expand()
							Ext.example.msg('删除成功!','您成功删除了一条记录!')
						}else{
							Ext.Msg.alert('提示!','数据删除失败!')
						}
					})
					subTreePanel.getEl().unmask()
				}
			})
		}
	}
	
	function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : ''
    }	
	
})