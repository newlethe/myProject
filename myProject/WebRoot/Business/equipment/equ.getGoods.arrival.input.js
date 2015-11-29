var bean = "com.sgepit.pmis.equipment.hbm.EquInfo";
var beanPart = "com.sgepit.pmis.equipment.hbm.EquInfoPart";
var beanGetGoods = "com.sgepit.pmis.equipment.hbm.EquGetGoodsArr";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var primaryKey = "ggid";
var orderColumn = "ggid";
var propertyName = "conid";
var propertyValue = conid;
//var macTypes = [[1,'#1'],[2,'#2'],[3,'公共'],[-1,'  ']];
var macTypes = new Array();
var SPLITB = "`";
var sm;
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 设备到货";
var partWindow;
var gridEqu;
var storeEquSub;
var equids;
var partids;   
var smEqu;
var aouWindow, openBoxWindow,queryWin;

//isFlwView = true
//isFlwTask = true;
//ggno = "fuhx10120010"
Ext.onReady(function(){
	if(isFlwTask){
		DWREngine.setAsync(false);
		baseMgm.getData("select ggid from equ_get_goods_arr where gg_no='"+ggno+"'",function(obj){
			if(obj.length==0){
				addOrUpdateWindow(conid, conname, conno, '');
			}
		})
		DWREngine.setAsync(true);
	}

	var macTypes = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号',function(list){         //获取合同状态
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				macTypes.push(temp);			
			}
	    }); 
	DWREngine.setAsync(true);
	/**
	 * @description 被流程所调用的页面中，按钮的统一化管理
	 * @param BUTTON_CONFIG - 存放当前页面上的所有按钮
	 * @author xiaos
	 */
    var BUTTON_CONFIG = {
    	'ADD': {
	    	id: 'add',
	    	text: '新增',
	    	iconCls: 'add',
	    	disabled: true,
	    	handler: function(){
	    		addOrUpdateWindow(conid, conname, conno, '');
	    	}
	    },'EDIT': {
	    	id: 'edit',
	    	text: '修改',
	    	iconCls: 'btn',
	    	disabled: true,
	    	handler: function(){
	    		if (sm.getSelections().length == 1){
	    			addOrUpdateWindow(conid, conname, conno, selectedGgId);
	    		} else {
	    			Ext.example.msg('提示','请选择一个设备到货批次进行修改！');
	    		}
	    	}
	    },'DEL':{
	    	id: 'del',
	    	text: '删除',
	    	iconCls: 'multiplication',
	    	disabled: true,
	    	handler: function(){
	    		if (sm.getSelections().length == 1){
		    		equGetGoodsArrMgm.checkDelete(selectedGgId, function(flag){
		    			if('不能删除' == flag){
		    				Ext.example.msg('提示','该到货下的设备已经被开箱了，不能删除!')
		    				return;
		    			}
						Ext.Msg.show({
							title: '提示',
							msg: ("" == flag) ? '是否要删除?　　　　' : flag,
							buttons: Ext.Msg.YESNO,
							icon: Ext.MessageBox.QUESTION,
							fn: function(value){
								if ("yes" == value){
									Ext.get('loading-mask').show();
									Ext.get('loading').show();
									equGetGoodsArrMgm.deleteGetGoods(selectedGgId, flag, function(){
										Ext.get('loading-mask').hide();
										Ext.get('loading').hide();
										Ext.example.msg('删除成功！', '您成功删除了一条到货信息！');
										ds.load({
											callback: function(){
												if (ds.getCount() > 0){
													sm.selectRow(0);
												}else{
													dsSub.removeAll();
												}
											}
										});
									});
								}
							}
						});
					})
	    		} else {
	    			Ext.example.msg('提示', '请选择一个设备到货批次进行删除！');
	    		}
	    	}
	    },'BACK': {
			text: '返回',
			iconCls: 'returnTo',
			disabled: true,
			handler: function(){
				window.location.href = CONTEXT_PATH + '/Business/equipment/equ.contInfo.input.jsp';
			}
		},'OPEN': {
	    	id: 'open',
	    	text: '设备开箱',
	    	tooltip: '只有[都是未开箱]或者[已开箱并且开箱单号一样]的才能进行设备开箱',
	    	iconCls: 'btn',
	    	disabled: true,
	    	handler: openBox 
	    },'NOW': {
	    	id: 'now',
	    	text: '<font color=green>当前到货</font>',
			pressed: true,
			disabled: true,
			hidden : true,
			iconCls: 'form',
			handler: getNowData
	    },'ALL': {
	    	id: 'all',
	    	text: '<font color=red>所有到货</font>',
			pressed: true,
			disabled: true,
			hidden : true,
			iconCls: 'form',
			handler: getAllData
	    },'SELECT': {
	    	text: '选择设备或部件',
	    	iconCls: 'add',
	    	disabled: true,
	    	handler: function(){
	    		if (sm.getSelections().length > 0){
	    			if (sm.getSelections().length == 1){
	    				selectWin(conid, conname, conno, selectedGgId);
		    		} else {
		    			Ext.Msg.show({
		    				title: '提示',
				            msg: '<br>请在一个设备到货批次下新增详细信息！',
				            icon: Ext.Msg.WARNING, 
				            width: 300,
				            buttons: Ext.MessageBox.OK
		    			})
		    		}
	    		}
	    	}
	    },'btnQuery':{
		   text: '查询',
		   iconCls: 'option',
		   disabled: true,
		   handler: doQueryAdjunct1
          }
    };
    
    /**
     * @description 本页面一共有3种被调用的状态：
     * 		1、普通应用程序调用；
     * 		2、流程实例在流转中，任务节点调用；
     * 		3、流程实例被查看的时候调用；
     * @param isFlwTask = true 为第2种状态
     * @param isFlwView = true 为第3种状态
     * @param isFlwTask != true && isFlwView != true 为第1种状态
     */
    if (isFlwTask == true){
    	BUTTON_CONFIG['EDIT'].disabled = false;
    	BUTTON_CONFIG['SELECT'].disabled = false;
    } else if (isFlwView == true){
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['EDIT'].disabled = false;
    	BUTTON_CONFIG['DEL'].disabled = false;
    	BUTTON_CONFIG['btnQuery'].disabled = false;
    	BUTTON_CONFIG['SELECT'].disabled = false;
    }
	
    var dsMachine = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: macTypes
	});
    
	var fm = Ext.form;
	
	var fc = {
		'conid': {name: 'conid',fieldLabel: '合同内部流水号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true
		}, 'pid': {name: 'pid',fieldLabel: '工程项目编号',readOnly: true,hidden: true,allowBlank: false,hideLabel: true,anchor: '95%'
		}, 'ggid': {name: 'ggid',fieldLabel: '到货主键',readOnly: true,hidden: true,allowBlank: false,hideLabel: true,nchor: '95%'
		}, 'ggNo': {name: 'ggNo',fieldLabel: '到货批号',anchor:'95%'
		}, 'ggDate': {name: 'ggDate',fieldLabel: '实际到货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'ggNum': {name: 'ggNum',fieldLabel: '到货件数',allowNegative: false,hidden: true,maxValue: 100000000,anchor:'95%'
		}, 'sgNo': {name: 'sgNo',fieldLabel: '发货通知单号',anchor:'95%'
		}, 'sgDate': {name: 'sgDate',fieldLabel: '发货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'sgMan': {name: 'sgMan',fieldLabel: '发运人',anchor:'95%'
		}, 'incasementNo': {name: 'incasementNo',fieldLabel: '装箱号',hidden: true,anchor:'95%'
		}, 'conveyance': {name: 'conveyance',fieldLabel: '运输工具',anchor:'95%'
		}, 'conveyanceNo': {name: 'conveyanceNo',fieldLabel: '运输工具号',hidden: true,anchor:'95%'
		}, 'faceNote': {name: 'faceNote',fieldLabel: '外观记录',hidden: true,anchor:'95%'
		}, 'layPlace': {name: 'layPlace',fieldLabel: '放置位置',anchor:'95%'
		}, 'remark': {name: 'remark',fieldLabel: '备注',hidden: true,anchor:'95%'
		}, 'receivenum': {name: 'receivenum',fieldLabel: '到货单号',hidden: true,anchor:'95%'
		
		},'billstate': {name: 'billstate', fieldLabel: '流程状态', anchor:'95%'
        }, 'yjfhrq': {name: 'yjfhrq',fieldLabel: '预计发货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',hidden: true,anchor:'95%'
		}, 'sjfhrq': {name: 'sjfhrq',fieldLabel: '实际发货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'yjdhrq': {name: 'yjdhrq',fieldLabel: '预计到货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',hidden: true,anchor:'95%'
		}, 'csno': {name: 'csno',fieldLabel: '供货厂商',anchor:'95%'
		}, 'dhph': {name: 'dhph',fieldLabel: '到货批号',anchor:'95%'
		}, 'fhtzd': {name: 'fhtzd',fieldLabel: '发货通知单编号',hidden: true,anchor:'95%'
		}, 'fhgz': {name: 'fhgz',fieldLabel: '发货港站',anchor:'95%'
		}, 'dhgz': {name: 'dhgz',fieldLabel: '到货港站',anchor:'95%'
		}, 'thr': {name: 'thr',fieldLabel: '提货人',anchor:'95%'
		}, 'fph': {name: 'fph',fieldLabel: '发票号',anchor:'95%'
		}, 'fpje': {name: 'fpje',fieldLabel: '发票金额',anchor:'95%'
		}, 'dhzt': {name: 'dhzt',fieldLabel: '到货状态',anchor:'95%'
		}, 'conjh_date': {name: 'conjh_date',fieldLabel: '合同交货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'consj_date': {name: 'consj_date',fieldLabel: '实际交货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'conys': {name: 'conys',fieldLabel: '运输合同',anchor:'95%'
		}, 'dhsb': {name: 'dhsb',fieldLabel: '到货设备概述',anchor:'95%'
		}
	};
	
	var Columns = [
		{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'ggid', type: 'string'},
		{name: 'ggNo', type: 'string'},
		{name: 'ggDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ggNum', type: 'float'},
		{name: 'sgNo', type: 'string'},
		{name: 'sgDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'sgMan', type: 'string'},
		{name: 'incasementNo', type: 'string'},
		{name: 'conveyance', type: 'string'},
		{name: 'conveyanceNo', type: 'string'},
		{name: 'faceNote', type: 'string'},
		{name: 'layPlace', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'receivenum', type: 'string'},
		{name: 'billstate', type: 'float'},
		
		{name:'yjfhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'sjfhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'yjdhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'csno',type:'string'},
		{name:'dhph',type:'string'},
		{name:'fhtzd',type:'string'},
		{name:'fhgz',type:'string'},
		{name:'dhgz',type:'string'},
		{name:'thr',type:'string'},
		{name:'fph',type:'string'},
		{name:'fpje',type:'float'},
		{name:'dhzt',type:'string'},
		{name:'conjh_date',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'consj_date',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'conys',type:'string'},
		{name:'dhsb',type:'string'}
	];
	
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		sm,
		{id: 'conid',header: fc['conid'].fieldLabel,dataIndex: fc['conid'].name,hidden: true,width: 100
		}, {id: 'pid',header: fc['pid'].fieldLabel,dataIndex: fc['pid'].name,hidden: true,width: 100
		}, {id: 'ggid',header: fc['ggid'].fieldLabel,dataIndex: fc['ggid'].name,hidden: true,width: 100
		}, {id: 'ggNo',header: fc['ggNo'].fieldLabel,dataIndex: fc['ggNo'].name,hidden:false,editor: new fm.TextField(fc['ggNo'])
		}, {id: 'receivenum',header: fc['receivenum'].fieldLabel,dataIndex: fc['receivenum'].name,width: 100,hidden: true
		
		
		}, {id: 'dhsb',header: fc['dhsb'].fieldLabel,dataIndex: fc['dhsb'].name,width: 200
		}, {id: 'yjfhrq',header: fc['yjfhrq'].fieldLabel,dataIndex: fc['yjfhrq'].name,width: 120,renderer: formatDate ,hidden: true
		}, {id: 'sjfhrq',header: fc['sjfhrq'].fieldLabel,dataIndex: fc['sjfhrq'].name,width: 120,renderer: formatDate 
		}, {id: 'sgNo',header: fc['sgNo'].fieldLabel,dataIndex: fc['sgNo'].name,hidden: false,width: 100,editor: new fm.TextField(fc['sgNo'])
		}, {id: 'yjdhrq',header: fc['yjdhrq'].fieldLabel,dataIndex: fc['yjdhrq'].name,width: 120,renderer: formatDate,hidden: true
		}, {id: 'sgDate',header: fc['sgDate'].fieldLabel,dataIndex: fc['sgDate'].name,width: 120,hidden: true,renderer: formatDate,editor: new fm.DateField(fc['sgDate'])
		}, {id: 'ggDate',header: fc['ggDate'].fieldLabel,dataIndex: fc['ggDate'].name,width: 120,renderer: formatDate,editor: new fm.DateField(fc['ggDate'])
		}, {id: 'consj_date',header: fc['consj_date'].fieldLabel,dataIndex: fc['consj_date'].name,width: 120,renderer: formatDate ,hidden: true
		
		
		}, {id: 'ggNum',header: fc['ggNum'].fieldLabel,dataIndex: fc['ggNum'].name,hidden:true,hidden: true
		
		
		}, {id: 'sgMan',header: fc['sgMan'].fieldLabel,dataIndex: fc['sgMan'].name,width: 80,hidden: true,editor: new fm.TextField(fc['sgMan'])
		}, {id: 'incasementNo',header: fc['incasementNo'].fieldLabel,dataIndex: fc['incasementNo'].name,width: 80,hidden: true
		}, {id: 'conveyance',header: fc['conveyance'].fieldLabel,dataIndex: fc['conveyance'].name,width: 80,editor: new fm.TextField(fc['conveyance'])
		}, {id: 'conveyanceNo',header: fc['conveyanceNo'].fieldLabel,dataIndex: fc['conveyanceNo'].name,width: 80,hidden: true 
		}, {id: 'faceNote',header: fc['faceNote'].fieldLabel,dataIndex: fc['faceNote'].name,width: 80,hidden:true,editor: new fm.TextField(fc['faceNote'])
		}, {id: 'layPlace',header: fc['layPlace'].fieldLabel,dataIndex: fc['layPlace'].name,width: 80,editor: new fm.TextField(fc['layPlace'])
		}, {id: 'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name,width: 80,hidden: true
		}, {id: 'billstate',header: fc['billstate'].fieldLabel,dataIndex: fc['billstate'].name,width: 80,hidden: true
		
		
		
		
		
		}, {id: 'csno',header: fc['csno'].fieldLabel,dataIndex: fc['csno'].name,width: 120
		}, {id: 'dhph',header: fc['dhph'].fieldLabel,dataIndex: fc['dhph'].name,hidden : true,width: 80
		}, {id: 'fhtzd',header: fc['fhtzd'].fieldLabel,dataIndex: fc['fhtzd'].name,width: 80,hidden: true
		}, {id: 'fhgz',header: fc['fhgz'].fieldLabel,dataIndex: fc['fhgz'].name,width: 80,hidden : true
		}, {id: 'dhgz',header: fc['dhgz'].fieldLabel,dataIndex: fc['dhgz'].name,width: 80,hidden : true
		}, {id: 'thr',header: fc['thr'].fieldLabel,dataIndex: fc['thr'].name,width: 80
		}, {id: 'fph',header: fc['fph'].fieldLabel,dataIndex: fc['fph'].name,width: 80,hidden : true
		}, {id: 'fpje',header: fc['fpje'].fieldLabel,dataIndex: fc['fpje'].name,width: 80,hidden : true
		}, {id: 'dhzt',header: fc['dhzt'].fieldLabel,dataIndex: fc['dhzt'].name,width: 80,hidden : true
		}, {id: 'conjh_date',header: fc['conjh_date'].fieldLabel,dataIndex: fc['conjh_date'].name,width: 120,renderer: formatDate,hidden : true 
		
		}, {id: 'conys',header: fc['conys'].fieldLabel,dataIndex: fc['conys'].name,width: 80
		}
	]);
	cm.defaultSortable = true;
	
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanGetGoods,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName + " = '"+propertyValue+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');
    
	gridPanel = new Ext.grid.GridPanel({
    	id: 'cat-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [
        	BUTTON_CONFIG['ADD'], '-', 
        	BUTTON_CONFIG['EDIT'], '-', 
        	BUTTON_CONFIG['DEL'], '-',
        	BUTTON_CONFIG['btnQuery'] 
        	//BUTTON_CONFIG['NOW'], '-',
        	//BUTTON_CONFIG['ALL'], '->',
        	//BUTTON_CONFIG['BACK']
		],
        border: false,
        region: 'center',
        height: 200,
        title: bodyPanelTitle,
        enableDragDrop: true,          //一旦选中某行，就不能取消选中，除非选中其他行
        //header: false,				//
        frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			//forceFit: true,
			ignoreAdd: true
		}
	});

  var tabs = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: true,
        split: true,
        border: false,
        height:300,
        minHeight:200,
        region: 'south',
        items:[gridSub,gridZlPanel]//去掉单据类型后的
    });	
 
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gridPanel, tabs],
        listeners: {
			afterlayout: function(){
				if (isFlwView == true){
					gridPanel.getTopToolbar().disable();
					gridSub.getTopToolbar().disable();
			    }
			}
		}
    });
    gridSub.getTopToolbar().add(BUTTON_CONFIG['SELECT']);
    //数据加载
    getNowData();
    
    //事件绑定
    sm.on('rowselect', catGridRowSelected);

	ds.on('load',function(_store,_records,_obj){
		DWREngine.setAsync(false);
		for(var i=0;i<_records.length;i++){
			baseMgm.getData("select * from equ_sbdh_arr where dh_id ='"+ _records[i].data.ggid +"'",function(_list){
				if(_list.length == 0) {Ext.DomHelper.applyStyles(gridPanel.getView().getRow(i),"background-color:#99CCFF");}
			})
		}
		DWREngine.setAsync(true);
	})
    
    function catGridRowSelected(){
    	var records = sm.getSelections();
    	
    	//当到货单被入库单选择后，从表不能进行修改和添加
    	DWREngine.setAsync(false);
    	baseMgm.getData("select * from equ_open_box where gg_id ='"+ records[0].data.ggid +"'",function(list){
			if(list.length > 0){
				gridSub.getTopToolbar().disable();
				with(gridPanel.getTopToolbar().items){
					get("del").disable();
					get("edit").disable();
				}
			}else{
				if(!isFlwView)gridSub.getTopToolbar().enable();
				with(gridPanel.getTopToolbar().items){
					if(!isFlwTask && !isFlwView)get("del").enable();
					if(!isFlwView)get("edit").enable();
				}
			}
		})
    	DWREngine.setAsync(true);
    	
    	
    	if (records.length > 0){
    		var _ggids = "";
    		for (var i = 0; i < records.length; i++) {
    			_ggids += "'"+ records[i].get('ggid') + "'";
    			if (i + 1 != records.length) _ggids += ",";
    		}
			if (records.length == 1){
    			selectedGgId = records[0].get('ggid');
    			gridSub.setTitle(records[0].get('ggNo')+" - 到货详细信息");
    		}
    		//在此更新从表
    		dsSub.baseParams.params = "dhId in ("+_ggids+")";
    		dsSub.load({
    			params: {
    				start: 0,
    				limit: PAGE_SIZE2
    			}
    		});
    		dsZl.baseParams.params = "dhId in ("+_ggids+")";
			dsZl.load({params: {start: 0,limit: PAGE_SIZE2}});
    		btnQuery.setDisabled(false);
    	}else{
    		selectedGgId = "";
    	}
    };
    
   	function partWinwdow(){
 		if(!partWindow){
			partWindow = new Ext.Window({	               
				title: '选择到货部件',
				iconCls: 'form',
				layout: 'border',
				border: false,
				width: 660,
				height: 360,
				modal: true,
//				constrain: true,
				maximizable: true,
				closeAction: 'hide',
				items: [treePanel]
			});
     	}
     	partWindow.show();
     	g_storeEqu.load({
     		params: {
		    	start: 0,
		    	params: "conid = " + " = '"+propertyValue+"'",
		    	limit: PAGE_SIZE2
	    	}
     	});
   	}
   	
   	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function equSubSaveData(){
    	var records = storeEquSub.getModifiedRecords();
		var arr_objs = new Array();
		for (var i = 0; i < records.length; i++) {
			if (records[i].get('GG_NUM') > records[i].get('PART_NUM')) {
				Ext.example.msg('错误', '[到货数量] > [部件清单数量]');
				return;
			}
			var temp = new Array();
			temp.push(records[i].get('GETID'));
			temp.push(records[i].get('GG_NUM'));
			temp.push(records[i].get('MACHINE_NO'));
			arr_objs.push(temp);
		}
		if (arr_objs.length > 0){
			equGetGoodsMgm.updateGoodsSub(arr_objs, function(){
		    	loadSubData(selectedGgId);
			});
			Ext.example.msg('保存成功！', '成功保存（'+arr_objs.length+'）信息！');
		}
    }
    
    function equSubDeleteData(){
    	var records = smEquSub.getSelections();
    	var getids = new Array();
    	for (var i = 0; i < records.length; i++) {
    		getids.push(records[i].get('GETID'));
    	}
    	if (getids.length > 0){
    		Ext.Msg.show({
				title: '提示',
				msg: '是否要删除?　　　　',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(value){
					if ("yes" == value){
						Ext.get('loading-mask').show();
						Ext.get('loading').show();
						equGetGoodsMgm.deleteSub(getids, function(){
							Ext.get('loading-mask').hide();
							Ext.get('loading').hide();
							Ext.example.msg('删除成功！', '您成功删除了('+getids.length+')条[到货部件]信息！');
//							storeEquSub.baseParams.method = "findWhereOrderBy";
//							storeEquSub.baseParams.params = "ggid=''";
							if (ds.getCount() > 0)
					    		sm.selectRow(0);
						});
					}
				}
    		});
    	}
    }
    
    function openBox(){
    		var records = smSub.getSelections();
    		
    		var _uuids = "";
    		var _uuid = records[0].get('kxdh');
    		for (var i = 0; i < records.length; i++) {
    			_uuids += records[i].get('uuid');
    			if (i + 1 != records.length) _uuids += ",";
    		}
//    		window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + _uuids 
//		    		+ "&conid=" + conid + "&conname=" + conname + "&partId=" + partyb +"&uuid=" + _uuid;
    		openBoxWin(conid, conname, _uuids, _uuid, partyb);
    }
    
    function openBoxWin(_conid, _conname, _uuids, _uuid, _partId){
    	if (!openBoxWindow){
   			openBoxWindow = new Ext.Window({
				title: '设备开箱',
				iconCls: 'btn',
				layout: 'fit',
				width: 950, height: 500,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners: {
					hide: function(){
						dsSub.load({
			    			params: {
			    				start: 0,
			    				limit: PAGE_SIZE2
			    			}
			    		});
					}
				}
			});
   		}
   		openBoxWindow.show();
   		openBoxWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: "pid="+CURRENTAPPID+"&type=openbox&conid='"+_conid+"'&conname='"+_conname+"'&uuids='"+_uuids+"'&uuid='"+_uuid+"'&partId='"+_partId+"'"
		});
    } 
    
    function addOrUpdateWindow(_conid, _conname, _conno, _ggid){
    	if (!aouWindow){
   			aouWindow = new Ext.Window({
				title: '设备到货',
				iconCls: 'option',
				layout: 'fit',
				width: document.body.clientWidth, height: document.body.clientHeight,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners: {
					hide: function(){
						if(isFlwTask) ds.baseParams.params += " and ggNo='"+ggno+"'";
						ds.load({params:{
						    	start: 0,
						    	limit: PAGE_SIZE2
					    	}
					    });
					}
				}
			});
   		}
   		aouWindow.show();
   		var urlParams = "pid="+CURRENTAPPID+"&type=getgoodsarr&conid="+_conid+"&conname="+_conname+"&conno="+_conno+"&ggid="+_ggid
   		if(isFlwTask){
   			urlParams = "pid="+CURRENTAPPID+"&type=getgoodsarr&conid="+_conid+"&conname="+_conname+"&conno="+_conno+"&ggid="+_ggid+"&ggno="+ggno+"&isTask=true"
   		}
   		aouWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: urlParams
		});
    }    
    
    function getNowData(){
    	var date = new Date();
		var today = date.getYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		var sql = propertyName + " = '"+propertyValue+"'" 
				//+" and ggDate >= to_date('"+today+" 00:00:00','YYYY-MM-DD hh24:mi:ss')"
				//+" and ggDate <= to_date('"+today+" 23:59:59','YYYY-MM-DD hh24:mi:ss')"
		ds.baseParams.params = sql;
		if(isFlwTask || isFlwView) ds.baseParams.params += " and ggNo='"+ggno+"'";
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE2
	    	}
	    });
    }
    
    function getAllData(){
    	ds.baseParams.params = propertyName+" = '"+propertyValue+"'";
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE2
	    	}
	    });
    }
//////////////////////////////////////////////////////////////////////////////////////////////////主表查询部分
    
      function doQueryAdjunct1(){
		if (!queryWin) {
			queryWin = new Ext.Window({
				title: '查询数据',
				width: 450, height: 230,
				layout: 'fit',
				iconCls: 'option',
				closeAction: 'hide',
				border: true,
				constrain: true,
				maximizable: false,
				resizable: false,
				modal: false,
				items: [queryPanel1]
			});
		}
		queryPanel1.getForm().reset();
		queryWin.show();
	}
	var queryPanel1 = new Ext.form.FormPanel({
        border: false, autoScroll: true,
		bodyStyle: 'padding: 10px 10px; border:0px;',
		labelAlign: 'right', layout: 'form',
	 	items: [
	 		new Ext.form.FieldSet({      
	 			title: '关键字',
	 			layout: 'form',
	 			border: true,
	 			items: [
	 				new Ext.form.TextField(fc['ggNo']),
	 				new Ext.form.TextField(fc['conveyance']),
	 				new Ext.form.TextField(fc['layPlace']),
	 				{
	            		border: false, layout: 'column',
	            		items: [
	            			{
		            			layout: 'form', columnWidth: .6, bodyStyle: 'border: 0px;',
		            			items: [
		            				new Ext.form.DateField({
										id: 'ggDate'+'_begin',
										fieldLabel: '到货日期', width: 120,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
									})
		            			]
		            		},{
		            			layout: 'form', columnWidth: .4, bodyStyle: 'border: 0px; padding: 0px 16px;',
		            			items: [
									new Ext.form.DateField({
										id: 'ggDate'+'_end',
										hideLabel: true, width: 125,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '结束时间'
									})
		            			]
		            		}
	            		]
	            	}
				]
	 		})
	 	],
	 	bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery1
		},'-']
	});
	
	    function execQuery1(){
    	var val = true;
    	var strSql = propertyName +" = '"+propertyValue+"'" ;
    	var form = queryPanel1.getForm();
    	var ggNo = form.findField('ggNo').getValue();
    	var conveyance = form.findField('conveyance').getValue();
    	var layPlace = form.findField('layPlace').getValue();
    	var ggDate_begin = form.findField('ggDate_begin').getValue();
    	var ggDate_end = form.findField('ggDate_end').getValue();
    	if (ggNo != '' && ggNo != null){
    		strSql += " and ggNo like '%"+ggNo+"%'";
    	}
    	if (conveyance != '' && conveyance != null){
    		strSql += " and conveyance like '%"+conveyance+"%'";
    	}
    	if (layPlace != '' && layPlace != null){
    		strSql += " and layPlace like '%"+layPlace+"%'";
    	}
    	if('' == ggDate_begin && '' != ggDate_end){
   			strSql += " and ( ggDate" + " <= to_date('" + formatDate(ggDate_end) + "','YYYY-MM-DD'))";
   		} else if ('' != ggDate_begin && "" == ggDate_end){
	   		strSql += " and ( ggDate" + " >= to_date('" + formatDate(ggDate_begin) + "','YYYY-MM-DD'))";
	   	} else if ('' != ggDate_begin && '' != ggDate_end){
			if (ggDate_begin > ggDate_end){
				Ext.example.msg('提示！','开始时间应该小于等于结束时间！');
				val = false; 
			} else {
				strSql += " and ( ggDate"
						+ " between to_date('" + formatDate(ggDate_begin) + "','YYYY-MM-DD')" 
						+ " and to_date('" + formatDate(ggDate_end)+ "','YYYY-MM-DD'))"; 
				
			}
	    }
	    if (val){
	    	with(ds){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : PAGE_SIZE
					},
   					callback: function(){ queryWin.hide(); }
   				});
	    	}
	    }
    }
    
});


