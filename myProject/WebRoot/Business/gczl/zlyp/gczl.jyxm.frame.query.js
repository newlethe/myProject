var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "检验项目结构维护";
var rootText = "验评标准树";
var tempNode = null; // 两个js之间树Node临时变量

var bean = "com.sgepit.frame.flow.hbm.TaskView";

//选中节点后的相关参数
var thisNodeBh = 0;			//当前节点编号
var thisHasChild = true;	//当前节点是否有子节点
var isRootNode = true;		//当前节点是否是跟节点

//fixedFilterPart = "isyp='1' and ftype='7A' ";
Ext.onReady(function(){
	
	var thisRootUids;
	//判断当前登陆项目是否有质量验评树的更节点，没有则自动添加
	DWREngine.setAsync(false);
	gczlJyxmImpl.isHaveTreeRoot(CURRENTAPPID,rootText,function(str){
		thisRootUids = str;
	});
	DWREngine.setAsync(true);
	
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : thisRootUids // 重要 : 展开第一个节点 !!
	});
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "gczlJyxmTree",
			businessName : "gczlMgmImpl",
			parent : CURRENTAPPID,
			pid : CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});
	treePanel = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'west',
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		width : 240,
		split : true,
		collapseMode : 'mini',
		collapsible : true,		//滑动展开，左右展开
		maxSize : 280,
		minSize : 200,
		columns : [{
			header : '检验项目名称',
			width : 450,
			dataIndex : 'xmmc'
		}],
		loader : treeLoader,
		root : root,
		rootVisible : true
	});
	treePanel.on('beforeload', function(node) {
		var uids = node.attributes.uids;
		if (uids == null)
			uids = thisRootUids;
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = uids;
		baseParams.pid = CURRENTAPPID;
	});
	treePanel.on('click', function(node, e) {
		tempNode = node
		isRootNode = (rootText == tempNode.text);
		thisNodeBh= isRootNode	? "0" : tempNode.attributes.xmbh;
		
		if(isRootNode){
//			dsZlypIns.baseParams.params = fixedFilterPart;
			dsZlypIns.baseParams.params = "pid`"+CURRENTAPPID+";xmid`1";
			dsZlypIns.load({params : {	start : 0,limit : PAGE_SIZE}});
		}else{
//			dsZlypIns.baseParams.params = fixedFilterPart + " and xmbh = '"+thisNodeBh+"%'";
			dsZlypIns.baseParams.params = "pid`"+CURRENTAPPID+";xmid`"+thisNodeBh;
			dsZlypIns.load({params : {	start : 0,limit : PAGE_SIZE}});
		}
	});
	//质量验评树END
	
	//----------流程实例----------
	var viewWordBtn = new Ext.Button({
		id : 'viewWord',
		text : '查看文档',
		iconCls : 'word',
		handler : toHandler
	})
	var viewFlowBtn = new Ext.Button({
		id : 'viewFlow',
		text : '流转日志',
		iconCls : 'btn',
		handler : toHandler
	})
	var adjFlowBtn = new Ext.Button({
		id : 'adjFlow',
		text : '查看附件',
		iconCls : 'btn',
		handler : toHandler
	})
	
	var statusArr = [['0','处理中...'],['2','处理完毕！']]
	var dsStatus = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: statusArr
    });
	
	var smZlypIns = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cmZlypIns = new Ext.grid.ColumnModel([smZlypIns,
		{id: 'title',header: '主题',dataIndex: 'title',width:180,type:'string'},		
		{id: 'flowtitle',header: '流程',dataIndex: 'flowtitle',type:'string'},
		{id: 'ftime',header: '时间',dataIndex: 'ftime',width:60,type:'date',renderer: formatDate},
		{id: 'status',header: '流程状态',dataIndex: 'status',	width:40,type:'combo',store:dsStatus,renderer: function(value){ return ('2'==value?'处理完毕！':'处理中...');}}
	]);
	cmZlypIns.defaultSortable = true;
	
	var ColumnsZlypIns = [
		{name: 'logid', type: 'string'},
		{name: 'flowid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromnode', type: 'string'},
		{name: 'tonode', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'flag', type: 'string'},
		{name: 'nodename', type: 'string'},
		{name: 'fromname', type: 'string'},
		{name: 'toname', type: 'string'},
		{name: 'status', type: 'string'},
		{name: 'removeinfo', type: 'string'},
		{name: 'flowno', type: 'string'}
	];
	var primaryKey = "insid";
	var orderColumn = "insid";
	var dsZlypIns = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : "gczlMgmImpl",
			method : "queryJyxmByPid",
			params : "pid`"+CURRENTAPPID
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, ColumnsZlypIns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsZlypIns.setDefaultSort(orderColumn, 'desc');	
	cmZlypIns.defaultSortable = true;//可排序
	
	var gridZlypIns = new Ext.grid.QueryExcelGridPanel({
		ds:dsZlypIns,
		cm:cmZlypIns,
		sm:smZlypIns,
		border:false,
		region:'center',
		height:286,
		tbar:['<font color=#15428b><b>流程实例查询</b></font>','-',viewWordBtn,'-',viewFlowBtn,'-',adjFlowBtn,'-'],
		header:false,
		autoScroll:true, // 自动出现滚动条
		collapsible:false, // 是否可折叠
		animCollapse:false, // 折叠时显示动画
		loadMask:true, // 加载时是否显示进度
		stripeRows:true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar:new Ext.PagingToolbar({   
            pageSize: PAGE_SIZE,   
            store: dsZlypIns,   
            displayInfo: true,   
            displayMsg : ' {0} - {1} / {2}',     
            emptyMsg : "无记录。"   
        })
	});
	dsZlypIns.load({params:{start:0,limit:PAGE_SIZE}});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel,gridZlypIns]
	});
	
	function toHandler(){
		selectWordRecord = smZlypIns.getSelected();
		if(selectWordRecord == null || selectWordRecord==""){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择一条流程实例!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}else{
			var insid = selectWordRecord.data.insid;
			var title = selectWordRecord.data.title ;
			if(this.id=='viewWord'){
				showFlowFile(insid,title);
			}else if(this.id=='viewFlow'){
				showLogWin(insid,title);
			}else if(this.id=='adjFlow'){
				showFlowAdjunct(insid,title);
			}
		}
	}
	//查看流程文档
	var fileWindow,printDocBtn,menuBtn,docMenu
	var insfileBean = "com.sgepit.frame.flow.hbm.InsFileInfoView";
	function displayOCX(flag){
		var ocxDom = document.getElementById('TANGER_OCX');
		flag ? ocxDom.style.display = 'block' : ocxDom.style.display = 'none'
	}
	function showFlowFile(_insid, _title){
		if(!fileWindow){
			docMenu = new Ext.menu.Menu({
			    id: 'mainMenu',
			    items: ['-'],
				listeners: {
					beforeshow: function(menu){displayOCX(true);},
					beforehide: function(menu){displayOCX(true);}
				}
			});
			
			menuBtn = new Ext.Button({
				text: '打开本流程文档',
				iconCls: 'bmenu',
				menu: docMenu
			});
			
			printDocBtn = new Ext.Button({
				text: '打印',
				iconCls: 'print',
				handler: function(){
					if (TANGER_OCX_bDocOpen){
						TANGER_OCX_OBJ.PrintOut();
					} else {
						Ext.example.msg('提示', '请先打开文档！');
					}
				}
			});
			
			fileWindow = new Ext.Window({	               
				title: '查看流程实例文档',
				iconCls: 'form',
				tbar: [menuBtn,'-',printDocBtn],
				width: document.body.clientWidth*0.9,
				height: document.body.clientHeight*0.9,
				modal: true,
				closeAction: 'hide',
				maximizable: false,
				resizable: false,
				plain: true,	                
				contentEl: TANGER_OCX,
				listeners:{'hide':function(){displayOCX(false);}}
			});
		}
		
		fileWindow.setTitle('查看['+_title+'] - 流程实例文档');
		
		var filterFile=" filedate in( select filedate from com.sgepit.frame.flow.hbm.InsFileInfoMaxView where insid='"+_insid+"')"
		baseDao.findByWhere2(insfileBean, "insid='"+_insid+"' and "+filterFile, function(list){
			if (list.length > 0){
				docMenu.removeAll();
				for (var i = 0; i < list.length; i++) {
					docMenu.addItem(
						new Ext.menu.Item({
							text: list[i].filename,
							iconCls: 'word',
							value: list[i],
							handler: function(){
								var _file = this.value;
								displayOCX(true);
								TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
								document.getElementById('TANGER_OCX').height='519'
							}
						})
					);
				}
				menuBtn.setDisabled(false);
			} else { 
				menuBtn.setDisabled(true);
			}
		});
		document.getElementById('TANGER_OCX').height=1
		fileWindow.show();
	};
	
	//流程流转日志
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}),{
			id: 'ftime',
			header: '发送时间',
			dataIndex: 'ftime',
			width: 120,
			renderer: formatDate
		},{
			id: 'ftype',
			header: '处理类型',
			dataIndex: 'ftype',
			hidden: true,
			renderer: function(value){
				for (var i = 0; i < F_TYPE.length; i++) {
					if (F_TYPE[i][0] == value) return F_TYPE[i][1];
				}
			}
		},{
			id: 'fromname',
			header: '发送人',
			dataIndex: 'fromname',
			width: 80
		},{
			id: 'notes',
			header: '签署意见',
			dataIndex: 'notes',
			width: 300,
			renderer: function(value){
				if (value.length > 50) return value.substring(0, 50)+'.....详细'
				return value;
			}
		},{
			id: 'tonode',
			header: '受理人',
			dataIndex: 'toname',
			width: 80
		},{
			id: 'nodename',
			header: '处理说明',
			dataIndex: 'nodename',
			width: 150
		},{
			id: 'flag',
			header: '状态',
			dataIndex: 'flag',
			width: 80,
			renderer: function(value){ return ('0' == value ? '未完成' : '完成'); }
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'logid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromname', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'toname', type: 'string'},
		{name: 'flag', type: 'string'},
		{name: 'nodename', type: 'string'}
	];
	
	var ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: 'com.sgepit.frame.flow.hbm.TaskView',
			business: 'baseMgm',
			method: 'findWhereOrderBy'
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'logid'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('ftime', 'asc');
	
	var logGrid = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		border: false,
		header: false, stripeRows: true,
		autoScroll: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
	        pageSize: PAGE_SIZE,
	        store: ds,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    })
	});
	
	logGrid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("7" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('notes')
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	
	});
	
	//查看流转日志
	var logWin,notesTip
	var showLogWin = function(_insid, _insTitle){
		if (!logWin) {
			logWin = new Ext.Window({
				title: '流转日志',
				iconCls: 'refresh',
				layout: 'fit',
				width: document.body.clientWidth*0.9,
				height: document.body.clientHeight*0.9,
				modal: true,
				closeAction: 'hide', resizable: false,
				maximizable: false, plain: true,
				items: [logGrid]
			});
		}
		logWin.setTitle('主题为：【'+_insTitle+'】 - 流转日志');
		ds.baseParams.params = "insid = '" + _insid + "'";
		ds.load({params:{start:0,limit:PAGE_SIZE}});
		logWin.show();
		notesTip = new Ext.ToolTip({
			title: '签署意见',
			width: 200,
			target: logGrid.getEl()
		});
	};
	
	// 查看流程附件
	var adjunctWindow
	var cmAdjunct = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}), {
			id: 'insid',
			header: '实例ID',
			dataIndex: 'insid',
			hidden: true
		},{
			id: 'ismove',
			header: '是否移交',
			dataIndex: 'ismove',
			hidden: true
		},{
			id: 'filename',
			header: '文件名称',
			dataIndex: 'filename',
			width: 150
		},{
			id: 'filedate',
			header: '创建时间',
			dataIndex: 'filedate',
			width: 80,
			renderer: function(value){
				return value ? value.dateFormat('Y-m-d H:i:s') : '';
			}
		}, {
			id: 'fileid',
			header: '下载',
			align: 'center',
			dataIndex: 'fileid',
			width: 50,
			renderer: function(value){
				return "<center><a href='"+BASE_PATH+"servlet/FlwServlet?ac=loadAdjunct&fileid="+value+"'>"
						+"<img src='"+BASE_PATH+"jsp/res/images/shared/icons/page_copy.png'></img></a></center>";
			}
		}
	]);
	
	var ColumnsAdjunct = [
		{name: 'fileid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'ismove', type: 'string'},
		{name: 'filename', type: 'string'},
		{name: 'filedate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	
	var dsAdjunct = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: adjunctBean,
			business: 'baseMgm',
			method: 'findWhereOrderBy'
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'fileid'
		}, ColumnsAdjunct),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	
	var gridAdjunct = new Ext.grid.GridPanel({
		ds: dsAdjunct,
		cm: cmAdjunct,
		border: false,
		header: false, stripeRows: true,
		autoScroll: true,
		loadMask: true,
		collapsible: true,
		animCollapse: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	function showFlowAdjunct(_insid, _title){
		if (!adjunctWindow){
			adjunctWindow = new Ext.Window({	               
				title: '查看流程附件',
				iconCls: 'copyUser',
				width: document.body.clientWidth*0.9,
				height: document.body.clientHeight*0.9,
				modal: true, layout: 'fit',
				closeAction: 'hide',
				maximizable: false,
				resizable: false,
				plain: true,
				items: [gridAdjunct]
			});
		}
		
		adjunctWindow.setTitle('查看['+_title+'] - 流程附件');
		
		adjunctWindow.show();
		
		//流程实例【附件】加载
		dsAdjunct.baseParams.params = "insid='"+_insid+"'";
		dsAdjunct.load();
	}
	
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d H:i:s') : '';
	};
})