var projectBean = "com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostProjectView"
var listMethodp = "findWhereOrderby";
var primaryKeyp = "proappid";
var businessp = "baseMgm";
var orderColumnp = "conid";
var SPLITB = "`";
var unit = new Array();
var currentPid = CURRENTAPPID;
var bdgid;//设置选择关联工程连
var rootText = "工程量分摊";

var selectedBdgid;
var selectedPath;
var selectTreeNodePath;
var selectedModuleNode;
var treeGridPanel;
var store
// 合同类型‘QT’、‘SG’
var conOveArr = new Array();
var investmentFinishMoneyBtn;
var selectRecord;
//为了翻页保持选中
var selectRowsCollection=new Ext.util.MixedCollection();
//初始化默认选中的工程量
var initSelectRowsFlag=false;
Ext.onReady(function (){
	 var conUnit = new Array();
    var gcType = new Array();
    var bdgArr = new Array();
    DWREngine.setAsync(false);
    appMgm.getCodeValue('工程量施工单位',function(list){
        for(i = 0; i<list.length; i++){
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);                
            conUnit.push(temp)
        }
    })
	baseMgm.findAll('com.sgepit.pmis.contract.hbm.ConOveView',function(list){ 
			for(i = 0; i < list.length; i++) {
                if(list[i].condivno != 'QT'&&list[i].condivno != 'SG'&&list[i].condivno != 'FW')
                    continue;
				var temp = new Array();	
				temp.push(list[i].conid);		
				temp.push(list[i].conname);	
				conOveArr.push(temp);			
			}
	    }); 
	DWREngine.setAsync(true);
	//--------------------------------------------------------------------------
	var fcp={
		'proappid':{name:'proappid',fieldLabel:'工程量主键'},
        'pid':{name:'pid',fieldLabel:'pid'},
		'conid':{name:'conid',fieldLabel:'合同名称'},
        'bdgid':{name:'bdgid',fieldLabel:'概算主键'},
        'prono':{name:'prono',fieldLabel:'工程量编码',anchor:'95%'},
        'proname':{name:'proname',fieldLabel:'工程量名称',anchor:'95%'},
        'uids':{name:'uids',fieldLabel:'参与其他费用分摊工程量明细主键'},
        'masterid':{name:'masterid',fieldLabel:'参与其他费用分摊合同主键'},
        'investmentFinishMoney':{name:'investmentFinishMoney',fieldLabel:'投资完成金额'},
        'ischeck':{name:'ischeck',fieldLabel:'是否选中'},
        'remark':{name:'remark',fieldLabel:'备注',anchor:'95%'}
        ,'constructionUnit':{name:'constructionUnit',fieldLabel:'施工单位',anchor:'95%'
        }
        ,'financialAccount':{name:'financialAccount',fieldLabel:'财务科目',anchor:'95%'}
	}
	
    var Columnsp = [
    	{name: 'proappid', type: 'string'},
    	{name: 'pid', type : 'string'},
		{name: 'conid', type: 'string'},
		{name: 'bdgid', type: 'string'},    	
		{name: 'prono', type: 'string'},
    	{name: 'proname', type: 'string'},
		{name: 'uids', type: 'string'},
		{name: 'masterid', type: 'float'},
		{name: 'investmentFinishMoney', type: 'float'},
		{name: 'ischeck', type: 'string'},
		{name: 'remark', type: 'string'}
		,{name: 'constructionUnit', type: 'string'}
		,{name: 'financialAccount', type: 'string'}
		];
    var smp =  new Ext.grid.CheckboxSelectionModel()
    
    var cmp = new Ext.grid.ColumnModel([
    smp,
    	{
           id:'proappid',
           header: fcp['proappid'].fieldLabel,
           dataIndex: fcp['proappid'].name,
		   hidden:true
        }, {
        	id : 'pid',
        	header : fcp['pid'].fieldLabel,
        	dataIndex : fcp['pid'].name,
        	hidden : true
        }, {
           id:'bdgid',
           header: fcp['bdgid'].fieldLabel,
           dataIndex: fcp['bdgid'].name,
           hidden:true
        }, {
           id:'ischeck',
           header: fcp['ischeck'].fieldLabel,
           dataIndex: fcp['ischeck'].name,
           hidden:true
//           ,
//           renderer : function(v,m,r){
//				var str = "<input type='checkbox' "+(v==1?"disabled":"")+" "+(v==1?"checked":"")+" onclick='checkSelectFun(\""+r.get("uids")+"\",this)'>"
//				return str;
//			}
        },{
           id:'prono',
           header : fcp['prono'].fieldLabel,
           dataIndex : fcp['prono'].name,
            renderer : function(value, cell, record) {
				var qtip = "qtip=" + value;
				return '<span ' + qtip + '>' + value + '</span>';
			},
           width :140
        },{
           id:'proname',
           header: fcp['proname'].fieldLabel,
           dataIndex: fcp['proname'].name,
            renderer : function(value, cell, record) {
				var qtip = "qtip=" + value;
				return '<span ' + qtip + '>' + value + '</span>';
			},
           width: 140
        },{
           id:'conid',
           header: fcp['conid'].fieldLabel,
           dataIndex: fcp['conid'].name,
           renderer : function(value, cell, record) {
				var str = '';
				for (var i = 0; i < conOveArr.length; i++) {
					if (conOveArr[i][0] == record.data.conid) {
						str = conOveArr[i][1]
						break;
					}
				}
				var qtip = "qtip=" + str;
				return '<span ' + qtip + '>' + str + '</span>';
			},
			width: 160
        },{
           id:'financialAccount',
           header: fcp['financialAccount'].fieldLabel,
           dataIndex: fcp['financialAccount'].name,
           width :120
       },{
           id:'constructionUnit',
           header: fcp['constructionUnit'].fieldLabel,
           dataIndex: fcp['constructionUnit'].name,
           renderer : function(v){
                for (var i = 0; i < conUnit.length; i++) {
                    if(conUnit[i][0] == v){
                        return conUnit[i][1];
                    }
                }
           },
           width :120
       }, {
           id:'uids',
           header: fcp['uids'].fieldLabel,
           dataIndex: fcp['uids'].name,
           hidden:true
        }, {
           id:'masterid',
           header: fcp['masterid'].fieldLabel,
           dataIndex: fcp['masterid'].name,
           hidden:true
        }, {
           id:'investmentFinishMoney',
           header: fcp['investmentFinishMoney'].fieldLabel,
           dataIndex: fcp['investmentFinishMoney'].name,
           width: 120,
           align: 'right'
        },{
           id:'remark',
           header: fcp['remark'].fieldLabel,
           dataIndex: fcp['remark'].name,
           width :100
        }
    ]);
	smp.on('rowselect',function(thisModel,rowIndex,rec){
			rec.set('ischeck',1)
	})
    store= new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: projectBean,				
	    	business: businessp,
	    	method: listMethodp
	    	//params: propertyName+SPLITB+propertyValue   // where 子句
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyp
        }, Columnsp),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    store.setDefaultSort(orderColumnp, 'asc');
    var storeTotal= new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: projectBean,				
	    	business: businessp,
	    	method: listMethodp
	    	//params: propertyName+SPLITB+propertyValue   // where 子句
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyp
        }, Columnsp),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    store.on('load', function(s, r,o) {
    	smp.clearSelections();
    	if(initSelectRowsFlag){
    		initSelectRowsFlag=false;
			storeTotal.baseParams.params =store.baseParams.params;
			storeTotal.load();
    	}else{
	    	s.each(function(rec) {
				if (selectRowsCollection.get(rec.get("proappid"))!=null) {
					smp.selectRecords([rec], true);
				}
			});
    	}
	})
	storeTotal.on('load', function(s, r,o) {
		s.each(function(rec) {
			if (rec.get("ischeck")==1) {
				selectRowsCollection.add(rec.get("proappid"),rec)
			}
		});
		store.each(function(rec) {
			if (selectRowsCollection.get(rec.get("proappid"))!=null) {
				smp.selectRecords([rec], true);
			}
		});
	})
	smp.on('rowselect',function(t,i,r){
		if(!selectRowsCollection.containsKey(r.get("proappid"))) selectRowsCollection.add(r.get("proappid"),r);
	})
	smp.on('rowdeselect',function(t,i,r){
		selectRowsCollection.removeKey(r.get("proappid"));
	})
	//TODO:将gridpanel修改为treegrid
    var selectBtn = new Ext.Button({
        id : 'select',
        text : '确认选择',
        iconCls : 'btn',
        handler : selectFun
    });
    investmentFinishMoneyBtn = new Ext.Button({
        id : 'investmentFinishMoneyTotal',
        width:100,
        text:'0'
    });
    
    treeGridPanel = new Ext.grid.EditorGridTbarPanel({
        ds : store,
        autoScroll : true,
        tbar : ['<font color=#15428b><B>工程量清单详细信息<B></font>','-','->','参与分摊投资完成总金额：',investmentFinishMoneyBtn,'-',selectBtn],
        region: 'center',
        split: true,
        addBtn : false, // 是否显示新增按钮
		saveBtn : false, // 是否显示保存按钮
		delBtn : false, // 是否显示删除按钮
        width: 850,
        viewConfig : {
            forceFit : false,
            ignoreAdd : true
        },
        frame : false,
        collapsible : false,
        animCollapse : false,
        border : true,
        cm : cmp,
        sm:smp,
        stripeRows : true,
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: store,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
    });

	//--------------------------------------------------------------------------
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form'
    })
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"bdgMoneyProjectTree", 
			businessName:"faCostManageService", 
			conid:conid, 
			parent:0
		},
		clearOnLoad: false,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 300,
        minSize: 100,
        maxSize: 700,
        frame: false,
        header: false,
        border: false,
        split : true,
        collapsible : true,
        collapseMode : 'mini',
        lines: true,
        autoScroll: true,
		tbar:[{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ rootNew.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ rootNew.collapse(true); }
            }],       
		columns:[{
            header: '概算名称',
            width: 700,	
            dataIndex: 'bdgname'
        },{
            header: '概算编码',
            width: 0,
            dataIndex: 'bdgno',
            hidden:true
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid',
            renderer: function(value){
            	return "<div id='pid'>"+value+"</div>";
            }
        },{
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
            header: '本合同分摊总金额',
            width: 0,
            hidden:true,
            dataIndex: 'conappmoney',
            renderer: function(value){
            	return "<div id='conappmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
        },{
            header: '本合同签订分摊金额',
            width: 0,
            hidden:true,
            dataIndex: 'initappmoney',
            renderer: function(value){
            	return "<div id='initappmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
        },
        	{
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
            width:0,
            dataIndex:'remark'
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	
	
	treePanelNew.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = conid;
		baseParams.parent = bdgid;	
			
	});
    treePanelNew.on('click', function (node, e ){  
        selectTreeNodePath=node.getPath();
    	selectedModuleNode=node;
		var elNode = node.getUI().elNode;
		bdgid =  elNode.all("bdgid").innerText;
        selectedBdgid = elNode.all("bdgid").innerText;
        var isIeaf = elNode.all("isleaf").innerText;
        initSelectRowsFlag=true;
        selectRowsCollection.clear();
		if(isIeaf!=1){
			var bdgids="";
			DWREngine.setAsync(false);
       		db2Json.selectData("select bdgid,bdgno from bdg_info where pid='"+currentPid+"' start with parent='"+bdgid+"' connect by prior bdgid=parent",
        		function (jsonData) {
			    	var list = eval(jsonData);
		            var money=0;
			    	if(list!=null){
			            for(var i=0;i<list.length;i++){
			            	var bdgid=list[i].bdgid;
			            	bdgids+="'"+bdgid+"'"+",";
			            }
			            bdgids=bdgids.substring(0,bdgids.length-1);
			    	}
	  	 });
	    DWREngine.setAsync(true);
	          store.baseParams.params = "bdgid in ("+bdgids+") and conid='" + conid + "'";	
		}else{
			  store.baseParams.params = "bdgid='" + bdgid + "' and conid='" + conid + "'";	
		}
		store.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	});
	var contentPanle= new Ext.Panel({
		layout : 'border',
		region : 'south',
		height : document.body.clientHeight * 0.5,
		border : false,
		items : [treePanelNew,treeGridPanel]
	});
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [conGrid,contentPanle]
			});
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
});
//刷新树
	function refreshBgdTree(){
//		rootNew.reload();
		rootNew.reload(function(){
				if(rootNew.hasChildNodes()){
					rootNew.childNodes[0].expand(false,false,null)
				}
			});
		if(selectTreeNodePath){
			treePanelNew.expandPath(selectTreeNodePath,null,function(){
				var node = treePanelNew.getNodeById(selectedModuleNode.id);
				if(node&&node!=null) node.select();
				initSelectRowsFlag=true;
				selectRowsCollection.clear();
				store.reload();
			})
		}
//		else{
//			treePanelNew.render();
//			treePanelNew.expand();
//			rootNew.expand();
//		    if(rootNew.firstChild){
//		    	rootNew.expand(false,true,function(){rootNew.firstChild.expand()});//自动展开第一次子节点	
//		    }
//		}
//		treePanelNew.expandAll()
	}
function selectFun(){
	treeGridPanel.getEl().mask('laoding....');
	var nodesArray=new Array();
	if(selectRowsCollection.length){
		selectRecord=sm.getSelected();
		selectRowsCollection.eachKey(function(key,rec){
				nodesArray.push(key)
		})
		DWREngine.setAsync(false);   // 合同执行概算
		faCostManageService.saveSelectProjectTree(conid,costType,nodesArray, function(){
			ds.reload();
			store.reload();
		treeGridPanel.getEl().unmask();                                       
		});                                
		DWREngine.setAsync(true);
	}
	else{
		Ext.Msg.alert("提示","请选择需要参与分摊的工程量");
		treeGridPanel.getEl().unmask();
	}
}