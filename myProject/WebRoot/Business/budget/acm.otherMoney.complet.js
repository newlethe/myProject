/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
var bean = "com.sgepit.pmis.budget.hbm.BdgMoneyApp"
var pid = CURRENTAPPID;
var rootText = "概算金额分摊";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var beanOther = "com.sgepit.pmis.budget.hbm.OtherCompletion";
var beanOtherSub = "com.sgepit.pmis.budget.hbm.OtherCompletionSub";
var listMethod = "findWhereOrderBy";
var business = "baseMgm";
var primaryKey = "uuid";
var orderColumn = "comDate";

Ext.onReady(function (){
	
	
	var fm = Ext.form;
	var fc = {
		'uuid': {
			name: 'uuid',
			fieldLabel: '其他费用完成主键',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'comDate': {
			name: 'comDate',
			fieldLabel: '年月份',
            format: 'Y-m',
			anchor:'95%'
		}
	};
	var ColumnsOther = [
		{name: 'uuid', type: 'string'},
		{name: 'comDate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		
	];
	
	var Plant = Ext.data.Record.create(ColumnsOther);
	var PlantInt = {
		comDate: ''
	};
	
    sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm, {
			id: 'uuid',
			header: fc['uuid'].fieldLabel,
			dataIndex: fc['uuid'].name,
			hidden: true
		}, {
			id: 'comDate',
			header: fc['comDate'].fieldLabel,
			dataIndex: fc['comDate'].name,
			width: 120,
			renderer: formatDate,
            editor: new fm.DateField(fc['comDate'])
		}
	]);
	cm.defaultSortable = true;
	
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOther,				
	    	business: business,
	    	method: listMethod,
	    	params: null
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsOther),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');
    
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'crrt-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        width:40,
        tbar: [],
        iconCls: 'icon-by-category',
        border: false,
        region: 'west',
        clicksToEdit: 2,
        collapsible:true, 
        collapseMode : 'mini',
        header: false,
        autoScroll: true,
        animCollapse: false,
//        autoExpandColumn: 1,
        loadMask: true,
//		viewConfig:{
//			forceFit: true,
//			ignoreAdd: true
//		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanOther,					
      	business: business,	
      	primaryKey: primaryKey	
	})
	
//------------------------------------------------------------------------------------------------------------------------------------------
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'btn',
		handler: function(){
			if (sm.hasSelection()){
				window.location.href = BASE_PATH  + "Business/budget/acm.otherMoney.tree.jsp?otherId=" + otherId ;
			}else{
				Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条月份记录',
		            icon: Ext.Msg.WARNING, 
		            width:300,
		            buttons: Ext.MessageBox.OK
				})
			}
		}
	});
	
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'
    })
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"otherCompTree", 
			businessName:"bdgMgm", 
			otherId:otherId, 
			parent:'0104'
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
        width: 1000,
        minSize: 275,
        maxSize: 1000,
        frame: false,
        header: false,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '概算名称',
            width: 270,				
            dataIndex: 'bdgname'
        },{
            header: '主键',	
            width: 0,				
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid' >"+value+"</div>";
            }
        },{
            header: '主表主键',	
            width: 0,				
            dataIndex: 'otherUuid',
            renderer: function(value){
            	return "<div id='otherUuid' >"+value+"</div>";
            }
        },{
            header: '概算主键',	
            width: 0,				
            dataIndex: 'bdgUuid',
            renderer: function(value){
            	return "<div id='bdgUuid' >"+value+"</div>";
            }
        },{
            header: '财务编码',
            width: 0,
            dataIndex: 'bdgno',
            renderer: function(value){
            	return "<div id='bdgno'>"+value+"</div>";
            }
        },{
            header: '概算金额',	
            width: 110,				
            dataIndex: 'bdgmoney',
            renderer: cnMoney	
        },{
            header: '累计完成金额',
            width: 90,
            dataIndex: 'sumMoney',
            renderer: cnMoney	
        },{
            header: '百分比',
            width: 60,				
            dataIndex: 'sumPercent',
            renderer: function(value){
            	return value.toFixed(4) + "%" ;hege 
            }
        },{
            header: '差值',
            width: 0,				
            dataIndex: 'remainder'
        },{
            header: '本月完成金额',
            width: 120,
            dataIndex: 'monthMoney',
            renderer: cnMoney	
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
	
	treePanelNew.on('beforeload', function(node) {
		var bdgUuid = node.attributes.bdgUuid;
		if (bdgUuid == null)
			bdgUuid = '0104';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.otherId = otherId;
		baseParams.parent = bdgUuid;	
	})
	
	//右键菜单
	treePanelNew.on('contextmenu', contextmenu, this);
	var treeMenu
	function contextmenu(node, e){
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
	    treeMenu = new Ext.menu.Menu({
	        id: 'treeMenu',
	        width: 100,
	        items: [{
						id : 'menu_update',
						text : '　修改',
						value : node,
						iconCls : 'btn',
						handler : toHandler
					}, '-', {
                    	id: 'menu_del',
		                text: '　删除',
		                value: node,
		                iconCls: 'remove',
		                handler : toHandler
                	}]
	    });
	    treeMenu.showAt(e.getXY());
	    
		if (isRoot) {
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}
	}
	
	function toHandler(){
		var node = tmpNode;
		var state = this.text;
		var elNode = node.getUI().elNode;
		var isRoot = (rootText == node.text);
		var menu_appid = isRoot ? "0" : elNode.all("uuid").innerText;
		var menu_parent = isRoot ? "0" : elNode.all("parent").innerText;
		var menu_isLeaf = isRoot ? "false" :elNode.all("isleaf").innerText;

		if ("　删除" == state){
				delHandler(menu_isLeaf, menu_appid, menu_parent,node);
			}else{
				formPanel.expand();
				formPanel.isNew = false
				if (menu_isLeaf == 1) {
					saveBtn.setDisabled(false);
				}	
			}
		}
	
	function delHandler(isleaf, appid, parentid, node){
		if (0 == isleaf){
			Ext.Msg.show({
			   title: '提示',
			   msg: '父节点不能进行删除操作！',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
		}else{
			Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							treePanelNew.getEl().mask("loading...");
				    		othCompletionMgm.deleteChildNodeBdgMoneyApp(appid, function(flag){
				    			if ("0" == flag){
				    				var formDelRecord = Ext.data.Record.create(Columns);
									var flag = (node.parentNode.childNodes.length == 1)
									var pNode = flag? node.parentNode.parentNode: node.parentNode
									var formRecord = Ext.data.Record.create(Columns);
									var emptyRecord = new formRecord({
										appid: null,
										pid : CURRENTAPPID,
										bdgUuid : '',
										conid: '',
										realmoney: 0,
										prosign:0,
										remark:'',
										bdgmoney:0,
										bdgno : '',
										bdgname : '',
										isleaf : 1,
										parent : ""
									});
									formPanel.getForm().loadRecord(emptyRecord);
									formPanel.getForm().clearInvalid();
									if (flag) {
										node.remove();
									}else{
										treeLoaderNew.load(pNode);
										pNode.expand();
									}
									
									Ext.example.msg('删除成功！', '您成功删除了一条概算信息！');
					   			}else{
					   				Ext.Msg.show({
										title: '提示',
										msg: '数据删除失败！',
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
					   			}
					   			treePanelNew.getEl().unmask();
				    		});
    					}
					}
				});
		}
	}
    
    treePanelNew.on('click', onClick);
		function onClick(node, e ){
			var elNode = node.getUI().elNode;
			var isRoot = node == rootNew;
			menu_appid = isRoot ? "0" : elNode.all("Uuid").innerText;
			menu_bdgid = isRoot ? "0" : elNode.all("bdgUuid").innerText;
			menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		    var formRecord = Ext.data.Record.create(Columns);
		    var loadFormRecord = null;
		    
		    saveBtn.setDisabled(true);
	    	DWREngine.setAsync(false);
	    	baseMgm.findById(beanOtherSub, menu_appid, function(obj){
		    	loadFormRecord = new formRecord(obj);
		    });
			baseMgm.findById(beanNameInfo, menu_bdgid, function(obj){
				loadFormBdgInfo = new formRecord({
					bdgname : obj.bdgname,
					bdgno: obj.bdgno,
					bdgmoney : obj.bdgmoney
				}); 
			});
			DWREngine.setAsync(true);
			
			tmpNode = node;    
			tmpLeaf = menu_isLeaf;     
			
		    formPanel.getForm().loadRecord(loadFormRecord);
			formPanel.getForm().loadRecord(loadFormBdgInfo);	    
		}
		
	var contentPanel = new Ext.Panel({
			layout: 'border',
			region: 'center',
			border: false,
			header: false,
			viewConfig:{
			forceFit: true,
			ignoreAdd: true
			},
			tbar:['<font color=#15428b><b>&nbsp;其他费用投资完成</b></font>','-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ rootNew.expand(true); }
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ rootNew.collapse(true); }
		            },'->',btnSelect],
			items: [gridPanel, treePanelNew, formPanel]
			
		}) 
			
	// 7. 创建viewport加入面板content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [contentPanel]
    });
    ds.load({
    	params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });
	treePanelNew.render();
	treePanelNew.expand();
	rootNew.expand();

	function formatDate(value){
			return value ? value.dateFormat('Y-m-d') : '';
	};
	
	sm.on('rowselect', function(Thesm, rowIndex, record){
		otherId = record.get('uuid');
		var baseParams = treePanelNew.loader.baseParams
		baseParams.otherId = otherId;
		baseParams.parent = '0104';
		treeLoaderNew.load(rootNew);
	});
	
});

	
 

