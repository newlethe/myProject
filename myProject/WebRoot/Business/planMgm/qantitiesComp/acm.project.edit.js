var bean = "com.sgepit.pmis.investmentComp.hbm.ProAcmInfo";
var primaryKey = "acmId";
var orderColumn = "proname";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var title = "<font color=#15428b><b>工程量投资完成明细</b></font>" 	
var rootText = "所有概算项"
var filterStr = "";
var gsFilterStr = "";

Ext.onReady(function (){
	
	var filterBtn = new Ext.Button({
		id: 'filter',
        text: '显示不为0的工程量',
        iconCls: 'btn',
        handler : filterFun
	});
	
	var btnInit = new Ext.Button({
		id: 'init',
		name: 'initial',
        text: '初始化',
        iconCls: 'btn',
        handler : initial
	});
	
	var btnLookup = new Ext.Button({
		name: 'lookuop',
        text: '展开概算项',
        iconCls: 'btn',
        handler : lookup
	});
	
	var exportExcelBtn = new Ext.Button({
		id: 'export',
		text: '导出数据',
		tooltip: '导出数据到Excel',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler: function() {
			exportDataFile();
		}
	});
	
	//---------------------------------------------------------------------------------------------------------------------------
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'     
    })
  
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"ProAcmTree", 
			businessName:"bdgMgm", 
			conid:conid, 
			monId: masterId,
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
        region: 'west',
        width: 450,
        split: true,
        collapsible : true,
        collapsed: true,
        collapseMode : 'mini',
        trackMouseOver:true,
        minSize: 300,
        maxSize: 800,
        frame: false,
        header: false,
        tbar:[
			'<font color=#15428b><b>&nbsp;合同分摊概算</b></font>','-',
			{
                iconCls: 'icon-expand-all',
				tooltip: '展开概算树',
                handler: function(){ rootNew.expand(true); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: '收起概算树',
                handler: function(){ rootNew.collapse(true); }
            },'->'
		],
        border: false,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '概算名称',
            width: 300,	
            dataIndex: 'bdgname'
        },{
            header: '概算主键',	
            width: 0,				
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '本月总额',
            width: 100,
            dataIndex: 'proMoney',
//            renderer: function(value){
//            	return "<div id='proMoney' align='right'>￥"+value+"</div>";
//            }
			renderer: cnMoneyToPrec
        },{
            header: '累计总额',
            width: 100,
            dataIndex: 'sumMoney',
//            renderer: function(value){
//            	return "<div id='sumMoney' align='right'>￥"+value+"</div>";
//            }
			renderer: cnMoneyToPrec
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
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	treePanelNew.on("click",function(node){
		gsFilterStr = " and bdgid like '" +　node.id + "%'";
		ds.load({params:{start: 0,limit: 25}});
	})
	treePanelNew.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = conid;
		baseParams.monId = masterId;
		baseParams.parent = bdgid;	
	});
	
	treePanelNew.on('contextmenu', contextmenu, this);
	function contextmenu(node, e) {
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (node.childNodes.length > 0) return;
		var elNode = node.getUI().elNode;
		var bdgid = isRoot ? "0" : elNode.all("bdgid").innerText;	
		var treeMenu = new Ext.menu.Menu({
			id : 'treeMenu',
			width : 100,
			items : [{
				id : 'menu_add',
				text : '查看工程量',
				value : node,
				iconCls : 'add',
				handler : function(){
					ds.baseParams.params = " conid = '"+ conid + "'  and monId = '" + masterId + "' and bdgid ='" +　bdgid + "'";
					ds.load({params:{start: 0,limit: 25}});
				}
			}]
		});
		treeMenu.showAt(e.getXY());
	}
	
    //---------------------------------------------------------------------------------------------------------------------------
	var fm = Ext.form; 
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true})
	
    var fc = {		
    	'acmId': {
			name: 'acmId',
			fieldLabel: '工程投资完成主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        },'pid': {
			name: 'pid',
			fieldLabel: '项目编号',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        },'monId': {
			name: 'monId',
			fieldLabel: '月份主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        }, 'proid': {
			name: 'proid',
			fieldLabel: '分摊的工程量主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
        },'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
        },'proname': {
			name: 'proname',
			fieldLabel: '工程量名称',
			anchor:'95%'
        },'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
        },'price': {
			name: 'price',
			fieldLabel: '单价',
			anchor:'95%'
        },'amount': {
			name: 'amount',
			fieldLabel: '总工程量',
			anchor:'95%'
        },'money': {
			name: 'money',
			fieldLabel: '总金额',
			anchor:'95%'
        }, 'totalpro': {
			name: 'totalpro',
			fieldLabel: '累计量',
			anchor:'95%'
		}, 'totalpercent': {
			name: 'totalpercent',
			fieldLabel: '累计%',
			anchor:'95%'
        }, 'declpro': {
			name: 'declpro',
			fieldLabel: '申报工程量',
			anchor:'95%'
        }, 'checkpro': {
			name: 'checkpro',
			fieldLabel: '核定工程量',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'ratiftpro': {
			name: 'ratiftpro',
			fieldLabel: '批准工程量',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'decmoney': {
			name: 'decmoney',
			fieldLabel: '申报金额',
			anchor:'95%'
		}, 'checkmoney': {
			name: 'checkmoney',
			fieldLabel: '核定金额',
			anchor:'95%'
		}, 'ratiftmoney': {
			name: 'ratiftmoney',
			fieldLabel: '批准金额',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}
	}

    var Columns = [
    	{name: 'acmId', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'monId', type: 'string'},
		{name: 'proid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'proname', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'amount', type: 'float'},
		{name: 'money', type: 'float'},
		{name: 'totalpro', type: 'string'},
		{name: 'totalpercent', type: 'float'},
		{name: 'declpro', type: 'float'},
		{name: 'checkpro', type: 'float'},
		{name: 'ratiftpro', type: 'float'},
		{name: 'decmoney', type: 'float'},
		{name: 'checkmoney', type: 'float'},
		{name: 'ratiftmoney', type: 'float'},
		{name: 'remark', type: 'string'}];
			
    var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	acmId: null, 
    	pid: CURRENTAPPID,
    	monId:'',
    	proid: '',
    	conid: '',
    	proname: '',
    	bdgid: '',
    	unit: '',
    	price: null,
    	amount: null,
    	money: null,
    	totalpro: '',
    	totalpercent: '',
    	declpro: null,
    	checkpro: null,
    	ratiftpro: null,
    	decmoney: null,
    	checkmoney: null,
    	ratiftmoney: null,
    	remark: ''
    } 

    var cm = new Ext.grid.ColumnModel([
    	sm,{
           id:'acmId',
           header: fc['acmId'].fieldLabel,
           dataIndex: fc['acmId'].name,
		   hidden:true,
		   hideLabel:true
        }, {
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'monId',
           header: fc['monId'].fieldLabel,
           dataIndex: fc['monId'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'proid',
           header: fc['proid'].fieldLabel,
           dataIndex: fc['proid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'bdgid',
           header: fc['bdgid'].fieldLabel,
           dataIndex: fc['bdgid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'proname',
           header: fc['proname'].fieldLabel,
           dataIndex: fc['proname'].name,
           align : 'center',
           width: 170
           
        },{
           id:'amount',
           header: fc['amount'].fieldLabel,
           dataIndex: fc['amount'].name,
           align: 'right',
           width: 60
        }, {
           id:'money',
           header: fc['money'].fieldLabel,
           dataIndex: fc['money'].name,
           renderer: cnMoneyToPrec,
           align: 'right',
           width: 60
        }, {
           id:'totalpro',
           header: fc['totalpro'].fieldLabel,
           dataIndex: fc['totalpro'].name,
           width: 60,
           align: 'right',
           renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
           	var conid = record.data.conid;
           	var proid = record.data.proid;
           	var re=0;
		 	DWREngine.setAsync(false);
           	baseMgm.getData("select sum(ratiftpro)sumv from pro_acm_info where conid='"+conid+"' and proid='"+proid+"'",function(list){
				re=list[0]
		    });
		 	DWREngine.setAsync(true);
           	return re;
           }
        }, {
           id:'totalpercent',
           header: fc['totalpercent'].fieldLabel,
           dataIndex: fc['totalpercent'].name,
           align: 'right',
           /*
           renderer: function (value){
           		return value + "%" ;
           },
           */
           renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
           	var conid = record.data.conid;
           	var proid = record.data.proid;
           	var re=0;
		 	DWREngine.setAsync(false);
           	baseMgm.getData("select sum(ratiftpro)sumv from pro_acm_info where conid='"+conid+"' and proid='"+proid+"'",function(list){  
				re=list[0]
		    });
		 	DWREngine.setAsync(true);
           	return (re/record.data.amount * 100).toFixed(2) + "%";
           },
           width: 50
        }, {
           id:'declpro',
           header: fc['declpro'].fieldLabel,
           dataIndex: fc['declpro'].name,
           width: 80,
           align: 'right',
           editor: new fm.NumberField(fc['declpro'])
        }, {
           id:'checkpro',
           header: fc['checkpro'].fieldLabel,
           dataIndex: fc['checkpro'].name,
           width: 80,
           align: 'right',
           editor: new fm.NumberField(fc['checkpro'])
        }, {
           id:'ratiftpro',
           header: fc['ratiftpro'].fieldLabel,
           dataIndex: fc['ratiftpro'].name,
           width: 80,
           align: 'right',
           editor: new fm.NumberField(fc['ratiftpro'])
        }, {
           id:'decmoney',
           header: fc['decmoney'].fieldLabel,
           dataIndex: fc['decmoney'].name,
           renderer : cnMoneyToPrec,
           align : 'right',
           width: 80//,
           //editor: new fm.NumberField(fc['decmoney'])
        }, {
           id:'checkmoney',
           header: fc['checkmoney'].fieldLabel,
           dataIndex: fc['checkmoney'].name,
           renderer : cnMoneyToPrec,
           align : 'right',
           width: 80//,
          // editor: new fm.NumberField(fc['checkmoney'])
        }, {
           id:'ratiftmoney',
           header: fc['ratiftmoney'].fieldLabel,
           dataIndex: fc['ratiftmoney'].name,
           renderer : cnMoneyToPrec,
           align : 'right',
           width: 80//,
          // editor: new fm.NumberField(fc['ratiftpro'])
        },{
           id:'unit',
           header: fc['unit'].fieldLabel,
           dataIndex: fc['unit'].name,
           align : 'center',
           width: 40
        }, {
           id:'price',
           header: fc['price'].fieldLabel,
           dataIndex: fc['price'].name,
           renderer: cnMoney,
           align: 'right',
           width: 60,
           editor : new Ext.form.NumberField(fc['price'])
        },{
           id:'remark',
           header: fc['remark'].fieldLabel,
           dataIndex: fc['remark'].name,
           width: 80,
           hidden:true,
		   hideLabel:true,
		   align : 'center',
           editor: new fm.TextField(fc['remark'])
        }
	])
    cm.defaultSortable = true;

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: " conid = '"+ conid + "' and monId = '" + masterId + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "acmId"
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');


	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'code-grid-panelsub',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [{text:title}],
        iconCls: 'icon-by-category',
        border: false, 
        minSize: 2,
        region: 'center',
        clicksToEdit: 2,
        header: false,
        autoScroll: true,
        split: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey:primaryKey,		
      	saveHandler: saveFun
	});	
	ds.load({params:{start: 0,limit: 25}});
	
	ds.on('beforeload', function(ds1){
		var baseParams = ds1.baseParams
    	if(isFlwView){
			baseParams.params = " conid = '"+ conid + "' and monId = '" + masterId + "' and declpro is not null and declpro<>0";
		} else {
			baseParams.params = " conid = '"+ conid + "' and monId = '" + masterId + "' " + filterStr;
		}
		baseParams.params += gsFilterStr;
	});
	
	if(step_flow=="sgf"){
		cm.setEditable(cm.getIndexById('checkpro'), false);
		cm.setEditable(cm.getIndexById('ratiftpro'), false);
	}
	if(step_flow=="jl"){
		cm.setEditable(cm.getIndexById('declpro'), false);
		cm.setEditable(cm.getIndexById('ratiftpro'), false);
	}
	if(step_flow=="yz"){
		cm.setEditable(cm.getIndexById('declpro'), false);
		cm.setEditable(cm.getIndexById('checkpro'), false);
	}

	if(isFlwView){
		cm.setEditable(cm.getIndexById('declpro'), false);
		cm.setEditable(cm.getIndexById('checkpro'), false);
		cm.setEditable(cm.getIndexById('ratiftpro'), false);
	}
	
	
   //---------------------------------------------------------------------------------------------------------------------------------- 
   // 9. 创建viewport，加入面板action和content
	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		items : [gridPanel, treePanelNew]	
	})
	
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [contentPanel]
    });
    var gridTopBar = gridPanel.getTopToolbar()
	with(gridTopBar){
		if(gridTopBar.items.get('add')){
			gridTopBar.items.get('add').setVisible(false);
		}
		if(gridTopBar.items.get('del')){
			gridTopBar.items.get('del').setVisible(false);
		}
		if(gridTopBar.items.get('refresh')){
			gridTopBar.items.get('refresh').setVisible(false);
		}
		gridTopBar.add(filterBtn, '->', btnInit,'-',btnLookup, '-', exportExcelBtn);
		if(isFlwView){
			if(gridTopBar.items.get('filter')){
				gridTopBar.items.get('filter').setVisible(false);
			}
			if(gridTopBar.items.get('save')){
				gridTopBar.items.get('save').setVisible(false);
			}
			if(gridTopBar.items.get('init')){
				gridTopBar.items.get('init').setVisible(false);
			}
		}
	}
    sm.on('beforerowselect', function(sm, rowIndex, keepExisting, record){
		var checkpro = record.get('checkpro');
    	var ratiftpro = record.get('ratiftpro');
    })
   // ------------ 函数 ---------------------------------------------------------------------- 
   function formatDate(value){
     return value ? value.dateFormat('Y-m') : '';
    };
    
    function initial(){
    	Ext.MessageBox.show({
    		title: '提示',
    		msg: '是否初始化?　　　　',
    		icon: Ext.MessageBox.QUESTION,
    		buttons: Ext.Msg.YESNO,
    		fn: function(value){
    			if ('yes' == value){
    				//----------------progress-----------------
    				var processbar = Ext.MessageBox.show({
						title: '请稍候',
						msg: '正在初始化...',
						width:240,
						progress:true,
						closable:false
					});
					var t = 0;
					var f = function(){
						t = (t == 100) ? 0 : t+1;
						Ext.MessageBox.updateProgress(t/100, '');
					};
				    var timer = setInterval(f, 10);
    				//----------------progress-----------------
			    	DWREngine.setAsync(false);  
			    	proAcmMgm.initialProAcmInfo(conid, masterId, CURRENTAPPID, function(){
						processbar.updateProgress(0, '');
						processbar.hide();
			    		//-----------------progress---------------------
			    		ds.baseParams.params = " conid = '"+ conid + "'  and monId = '" + masterId + "'"
						ds.load({params:{start: 0,limit: 25}});
			    	});
			    	DWREngine.setAsync(true);  	
			    	
    			}
    		}
    	});
    	
	    }
	
	// 查找概算项
	function lookup(){
		if (sm.hasSelection()){
			treePanelNew.expand();
			treePanelNew.getEl().mask("loading...");
			var bdgid = sm.getSelected().get('bdgid');
			var monId = sm.getSelected().get('monId');
			proAcmMgm.getPath(bdgid, masterId,  function(path){
				var baseParams = treePanelNew.loader.baseParams
					baseParams.conid = conid;
					baseParams.monId = masterId;
					baseParams.parent = '0';
				treePanelNew.render();
				treePanelNew.expandPath(path);
   				treePanelNew.selectPath(path);
			    treePanelNew.getEl().unmask();
			})
		}else{
			treePanelNew.expand();
			treePanelNew.getEl().mask("loading...");
			var baseParams = treePanelNew.loader.baseParams
			baseParams.conid = conid;
			baseParams.monId = masterId;
			baseParams.parent = '0';
			treePanelNew.render();
			treePanelNew.getEl().unmask();
			/*
			Ext.MessageBox.show({
	    		title: '提示',
	    		msg: '选择一个工程量　　　　 ',
	    		icon: Ext.MessageBox.INFO ,
	    		buttons: Ext.Msg.OK
    		});*/
		}
		
    }
        
    function saveFun(){
    	proAcmMgm.hasNextMonth(masterId, conid, function(list){
    		if (list.length == 0){
    			var records = ds.getModifiedRecords();
		    	var bdgids = new Array();
		    	var proIds = new Array();
		    	var defference = new Array();
		    	for (var i=0; i<records.length; i++){
		    		var price = records[i].get('price');
		    		var declpro = records[i].get('declpro');
		    		var checkpro = records[i].get('checkpro');
		    		var ratiftpro = records[i].get('ratiftpro');
		    		bdgids.push(records[i].get('bdgid'))
		    		proIds.push(records[i].get('proid'))
		    		defference.push(records[i].get('ratiftpro')-records[i].modified.ratiftpro);
		    		if (!price&&!declpro&&!checkpro&&!ratiftpro){
		    			Ext.example.msg('填写不完全！');
		    			return;
		    		}else{
		    			records[i].set('decmoney', price*declpro);
			    		records[i].set('checkmoney', price*checkpro);
			    		records[i].set('ratiftmoney', price*ratiftpro);
		    		}
		    	}
		    	gridPanel.defaultSaveHandler();
		    	
		    	if(isFlwTask){
		    		Ext.Msg.confirm('保存成功！',
						   '您成功新增了一条工程量付款信息，是否处理流程！　　　<br>点击【是】可以发送流程到下一步操作，点击【否】继续填写其他工程量付款信息！',
						  function(btn){
						   		if (btn=="yes"){
						   			reloadDetailDataFun(bdgids, masterId, conid, proIds, defference);
						   			parent.parent.IS_FINISHED_TASK = true;
									parent.parent.mainTabPanel.setActiveTab('common');
						   		}
						   }
						);
		    	} else {
		    		reloadDetailDataFun(bdgids, masterId, conid, proIds, defference);
		    	}
    		}else{
    			Ext.MessageBox.show({
		    		title: '提示',
		    		msg: '已审核不能修改　　　　',
		    		icon: Ext.MessageBox.QUESTION,
		    		buttons: Ext.Msg.OK
    			})
    			gridPanel.getStore().rejectChanges();
    		}
    	})
    	
    	
    }
    
    function reloadDetailDataFun(bdgids, masterId, conid, proIds, defference){
    	treePanelNew.getEl().mask("loading...");
		proAcmMgm.UpdateTree(bdgids, masterId, conid,  function(){
			treePanelNew.getEl().unmask();
			var baseParams = treePanelNew.loader.baseParams
			baseParams.conid = conid;
			baseParams.monId = masterId;
			baseParams.parent = '0';
			treeLoaderNew.load(rootNew);
			rootNew.expand();
		    treePanelNew.expand();
		    lookup();
		});
		if(parent.reloadMasterFun){
			parent.reloadMasterFun();
		}
		proAcmMgm.laterMonthInfo(masterId,conid, proIds, defference);
    }
});

function filterFun(b, e){
	if(b.text=="显示不为0的工程量") {
		filterStr = "and declpro is not null and declpro<>0";
		gridPanel.getStore().load({params:{start: 0,limit: 25}});
		b.setText("显示全部");
	} else if(b.text=="显示全部") {
		filterStr = "";
		gridPanel.getStore().load({params:{start: 0,limit: 25}});
		b.setText("显示不为0的工程量");
	}
}

function exportDataFile(){
	var openUrl = CONTEXT_PATH + "/servlet/InvestmentPlanServlet?ac=exportData&monId=" + masterId + "&businessType=Qantities_F_M&unitId=" + USERDEPTID + "&contractId=" + conid + "&sjType=" + sjType;
	document.all.formAc.action =openUrl
	document.all.formAc.submit();
}