﻿var bean = "com.sgepit.pmis.equipment.hbm.EquInfo";
var beanPart = "com.sgepit.pmis.equipment.hbm.EquInfoPart";
var beanTkGoods = "com.sgepit.pmis.equipment.hbm.EquTkGoods";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var primaryKey = "ggid";
var orderColumn = "ggid";
var propertyName = "conid";
var propertyValue = conid;
var macTypes = [[1,'#1'],[2,'#2'],[3,'公共'],[-1,'  ']];
var SPLITB = "`";
var sm;
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 设备退库";
var partWindow;
var gridEqu;
var storeEquSub;
var equids;
var partids;   
var smEqu;
var aouWindow, openBoxWindow;

Ext.onReady(function(){
	
    var partybName = ''
    DWREngine.setAsync(false);
    	conpartybMgm.getPartyBBean(partyb,function(obj){
    		partybName = obj['partyb']
    	})
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
		    		equTkGoodsMgm.checkDelete(selectedGgId, function(flag){
						Ext.Msg.show({
							title: '提示',
							msg: ("" == flag) ? '是否要删除?　　　　' : flag,
							buttons: Ext.Msg.YESNO,
							icon: Ext.MessageBox.QUESTION,
							fn: function(value){
								if ("yes" == value){
									Ext.get('loading-mask').show();
									Ext.get('loading').show();
									equTkGoodsMgm.deleteTkGoods(selectedGgId, flag, function(){
										Ext.get('loading-mask').hide();
										Ext.get('loading').hide();
										Ext.example.msg('删除成功！', '您成功删除了一条到货信息！');
										ds.load({
											callback: function(){
												if (ds.getCount() > 0){
													sm.selectRow(0);
												}else{
													storeEquSub.loadData(new Array());
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
				window.location.href = CONTEXT_PATH + 'Business/equipment/equ.contInfo.input.jsp';
			}
		},'OPEN': {
	    	id: 'open',
	    	text: '设备开箱',
	    	tooltip: '只有[都是未开箱]或者[已开箱并且开箱单号一样]的才能进行设备开箱',
	    	iconCls: 'btn',
	    	disabled: true,
	    	handler: openBox 
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
    	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['EDIT'].disabled = false;
    	BUTTON_CONFIG['DEL'].disabled = false;
    	BUTTON_CONFIG['OPEN'].disabled = false;
    } else if (isFlwView == true){
    	
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['EDIT'].disabled = false;
    	BUTTON_CONFIG['DEL'].disabled = false;
    	BUTTON_CONFIG['OPEN'].disabled = false;
    	BUTTON_CONFIG['BACK'].disabled = false;
    }
	
    var dsMachine = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: macTypes
	});
    /*
	var equSubSave = new Ext.Button({
    	text: '保存',
    	iconCls: 'save',
    	handler: equSubSaveData
    });
    
    var equSubDel = new Ext.Button({
    	text: '删除',
    	iconCls: 'multiplication',
    	handler: equSubDeleteData
    });
    */
	var fm = Ext.form;
	
	var fc = {
		'conid': {
			name: 'conid',
			fieldLabel: '合同内部流水号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'ggid': {
			name: 'ggid',
			fieldLabel: '到货主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'ggNo': {
			name: 'ggNo',
			fieldLabel: '编号',
			anchor:'95%'
		}, 'ggDate': {
			name: 'ggDate',
			fieldLabel: '到货日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
		}, 'ggNum': {
			name: 'ggNum',
			fieldLabel: '数量',
			allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
		}, 'sgNo': {
			name: 'sgNo',
			fieldLabel: '发货通知单号',
			anchor:'95%'
		}, 'sgDate': {
			name: 'sgDate',
			fieldLabel: '发货日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
			anchor:'95%'
		}, 'sgMan': {
			name: 'sgMan',
			fieldLabel: '发运人',
			anchor:'95%'
		}, 'incasementNo': {
			name: 'incasementNo',
			fieldLabel: '装箱号',
			anchor:'95%'
		}, 'conveyance': {
			name: 'conveyance',
			fieldLabel: '运输工具',
			anchor:'95%'
		}, 'conveyanceNo': {
			name: 'conveyanceNo',
			fieldLabel: '运输工具号',
			anchor:'95%'
		}, 'faceNote': {
			name: 'faceNote',
			fieldLabel: '外观记录',
			anchor:'95%'
		}, 'layPlace': {
			name: 'layPlace',
			fieldLabel: '放置位置',
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
		},'tkrq':{
			name:'tkrq',
			fieldLabel:'退库日期',
			format: 'Y-m-d',
			readOnly:true,
			anchor:'95%'
		},'conmoney':{
			id:'conmoney',
			name:'conmoney',
			fieldLabel:'合同总金额',
			readOnly:true,
			anchor:'95%'
		},'partb':{
			id:'partb',
			name:'partb',
			fieldLabel:'乙方单位',
			readOnly:true,
			anchor:'95%'
		},'sbmc':{
			name:'sbmc',
			fieldLabel:'设备名称',
			anchor:'95%'
		},'dw':{
			name:'dw',
			fieldLabel:'单位',
			anchor:'95%'
		},'equipfee':{
			id:'equipfee',
			name:'equipfee',
			fieldLabel:'到货设备总金额',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'carryfee':{
			id:'carryfee',
			name:'carryfee',
			fieldLabel:'运保费',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'otherfee':{
			id:'otherfee',
			name:'otherfee',
			fieldLabel:'其它费用',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'toolfee':{
			id:'toolfee',
			name:'toolfee',
			fieldLabel:'专用工具金额 ',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'partfee':{
			id:'partfee',
			name:'partfee',
			fieldLabel:'备品备件金额',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},
			anchor:'95%'
		},'totalfee':{
			id:'totalfee',
			name:'totalfee',
			fieldLabel:'合计总金额',
			readOnly:true,
			anchor:'95%'
		},'sysbh':{
			name:'sysbh',
			fieldLabel:'所属于安装系统编号',
			anchor:'95%'
		},'sysmc':{
			name:'sysmc',
			fieldLabel:'所属安装系统名称',
			anchor:'95%'
		},'invoicebh':{
			name:'invoicebh',
			fieldLabel:'供货发票号',
			anchor:'95%'
		},'checkbh':{
			name:'checkbh',
			fieldLabel:'验收单号',
			anchor:'95%'
		},'conno':{
			id:'conno',
			name:'conno',
			fieldLabel:'合同号',
			anchor:'95%',
			readOnly:true
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
		
		{name:'conno',type:'string'},
		{name:'partb',type:'string'},
		{name:'conmoney',type:'float'},
		{name:'sbmc',type:'string'},
		{name:'dw',type:'string'},
		{name:'equipfee',type:'float'},
		{name:'carryfee',type:'float'},
		{name:'otherfee',type:'float'},
		{name:'toolfee',type:'float'},
		{name:'partfee',type:'float'},
		{name:'totalfee',type:'float'},
		{name:'sysbh',type:'string'},
		{name:'sysmc',type:'string'},
		{name:'invoicebh',type:'string'},
		{name:'checkbh',type:'string'},
		{name:'tkrq', type: 'date', dateFormat: 'Y-m-d H:i:s'}		
	];
	
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm,{
			id: 'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'ggid',
			header: fc['ggid'].fieldLabel,
			dataIndex: fc['ggid'].name,
			hidden: true,
			width: 100
		},  {
			id: 'ggNo',
			header: fc['ggNo'].fieldLabel,
			dataIndex: fc['ggNo'].name,
			width: 120,
			editor: new fm.DateField(fc['ggDate'])
		}, {
			id: 'tkrq',
			header: fc['tkrq'].fieldLabel,
			dataIndex: fc['tkrq'].name,
			width: 100,
			renderer:formatDate,
			editor: new fm.TextField(fc['tkrq'])
		}, {
			id: 'conno',
			header: fc['conno'].fieldLabel,
			dataIndex: fc['conno'].name,
			width: 80,
			hidden: true,
			renderer:function(){return conno},
			editor: new fm.DateField(fc['conno'])
		}, {
			id: 'conmoney',
			header: fc['conmoney'].fieldLabel,
			dataIndex: fc['conmoney'].name,
			width: 80,
			hidden: true,
			renderer:function(){return parent.conmoney},
			editor: new fm.NumberField(fc['conmoney'])
		}, {
			id: 'partb',
			header: fc['partb'].fieldLabel,
			dataIndex: fc['partb'].name,
			width: 180,
			renderer:function(){return partybName},
			editor: new fm.TextField(fc['partb'])
		}, {
			id: 'sbmc',
			header: fc['sbmc'].fieldLabel,
			dataIndex: fc['sbmc'].name,
			width: 80,
			hidden: true,
			editor: new fm.DateField(fc['sbmc'])
		}, {
			id: 'dw',
			header: fc['dw'].fieldLabel,
			dataIndex: fc['dw'].name,
			width: 80,
			hidden: true,
			editor: new fm.TextField(fc['dw'])
		}, {
			id: 'ggNum',
			header: fc['ggNum'].fieldLabel,
			dataIndex: fc['ggNum'].name,
			width: 80,
			hidden: true,
			editor: new fm.TextField(fc['ggNum'])
		}, {
			id: 'equipfee',
			header: fc['equipfee'].fieldLabel,
			dataIndex: fc['equipfee'].name,
			width: 100,
			editor: new fm.TextField(fc['equipfee'])
		}, {
			id: 'carryfee',
			header: fc['carryfee'].fieldLabel,
			dataIndex: fc['carryfee'].name,
			width: 80,
			editor: new fm.TextField(fc['carryfee'])
		}, {
			id: 'otherfee',
			header: fc['otherfee'].fieldLabel,
			dataIndex: fc['otherfee'].name,
			width: 80,
			editor: new fm.TextField(fc['otherfee'])
		}, {
			id: 'toolfee',
			header: fc['toolfee'].fieldLabel,
			dataIndex: fc['toolfee'].name,
			width: 80,
			editor: new fm.TextField(fc['toolfee'])
		}, {
			id: 'partfee',
			header: fc['partfee'].fieldLabel,
			dataIndex: fc['partfee'].name,
			width: 80,
			editor: new fm.TextField(fc['partfee'])
		}, {
			id: 'totalfee',
			header: fc['totalfee'].fieldLabel,
			dataIndex: fc['totalfee'].name,
			width: 80,
			editor: new fm.TextField(fc['totalfee'])
		}, {
			id: 'sysbh',
			header: fc['sysbh'].fieldLabel,
			dataIndex: fc['sysbh'].name,
			width: 120,
			editor: new fm.TextField(fc['sysbh'])
		}, {
			id: 'sysmc',
			header: fc['sysmc'].fieldLabel,
			dataIndex: fc['sysmc'].name,
			width: 120,
			editor: new fm.TextField(fc['sysmc'])
		}, {
			id: 'invoicebh',
			header: fc['invoicebh'].fieldLabel,
			dataIndex: fc['invoicebh'].name,
			width: 80,
			editor: new fm.TextField(fc['invoicebh'])
		},  {
			id: 'checkbh',
			header: fc['checkbh'].fieldLabel,
			dataIndex: fc['checkbh'].name,
			width: 80,
			editor: new fm.TextField(fc['checkbh'])
		},{
			id: 'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width: 80,
			editor: new fm.TextField(fc['remark'])
		}
	]);
	cm.defaultSortable = true;

    ds = new Ext.data.Store({
       
		baseParams: {
	    	ac: 'list',
	    	bean: beanTkGoods,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName + "='" +propertyValue +"'"
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
        tbar: [BUTTON_CONFIG['ADD'], '-', BUTTON_CONFIG['EDIT'], '-', BUTTON_CONFIG['DEL'],'->',BUTTON_CONFIG['BACK']],
        region: 'center',
        title: bodyPanelTitle,
        loadMask: true,
        autoScroll:true,border: false,
		viewConfig:{
//			forceFit: true,
			ignoreAdd: true
		}
	});
	
 
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gridPanel, gridSub],
        listeners: {
			afterlayout: function(){
				if (isFlwView == true){
					gridPanel.getTopToolbar().disable();
					gridSub.getTopToolbar().disable();
			    }
			}
		}
    });
    
    gridSub.getTopToolbar().items.get('add').setVisible(false);

	
    var sbMoney = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
    var bpMoney = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
    var toolMoney = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
    var totalMoney = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
    
	var excelExp = new Ext.Toolbar({
		renderTo: gridSub.tbar,
		items: ['设备总价累计：',sbMoney,'-','备品备件总价累计：',bpMoney,'-','专用工具总价累计：',toolMoney,'-','入库总价累计:',totalMoney]
	});    
	
	var sbAmount = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
	var bpAmount = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
	var toolAmount = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
	var totalAmount = new Ext.form.TextField({readOnly:true,style:'color:red',width:50});
	
	var MoneyBtn = new Ext.Button()
	
	gridSub.getTopToolbar().add('-','设备数量累计：',sbAmount,'-','备品备件数量累计：',bpAmount,'-','专用工具数量累计：',toolAmount,'-','总数量累计：',totalAmount)
	
    gridSub.getTopToolbar().add('->');
//	gridSub.getTopToolbar().add(BUTTON_CONFIG['OPEN']);	
	
    //数据加载
    ds.load({
    	params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });
    
    dsSub.on('load',function(){
		var sbAmountValue = 0 ,sbMoneyValue=0;
		var bpAmountValue = 0 ,bpMoneyValue=0;
		var toolAmountValue = 0 ,toolMoneyValue=0;
		var totalAmountValue = 0 ,totalMoneyValue=0;
		for(var i=0;i<dsSub.getCount();i++){
			var record = dsSub.getAt(i)
			if(record.get('wztype') == '2'){sbAmountValue += record.get('zs')*1;sbMoneyValue += record.get('dj')*record.get('zs');}
			else if(record.get('wztype') == '3'){bpAmountValue += record.get('zs')*1;bpMoneyValue += record.get('dj')*record.get('zs');}
			else if(record.get('wztype') == '4'){toolAmountValue += record.get('zs')*1;toolMoneyValue += record.get('dj')*record.get('zs');}
			totalAmountValue += record.get('zs')*1;
			totalMoneyValue += record.get('dj')*record.get('zs');
		}
    	sbMoney.setValue(sbMoneyValue);sbAmount.setValue(sbAmountValue)
    	bpMoney.setValue(bpMoneyValue);bpAmount.setValue(bpAmountValue)
    	toolMoney.setValue(toolMoneyValue);toolAmount.setValue(toolAmountValue)
    	totalMoney.setValue(totalMoneyValue);totalAmount.setValue(totalAmountValue)
    })    
    
    //事件绑定
    sm.on('rowselect', catGridRowSelected);
    
    function catGridRowSelected(){
    	var records = sm.getSelections();
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
    		dsSub.baseParams.params = "dhId in ("+_ggids+")";
    		dsSub.load({
    			params: {
    				start: 0,
    				limit: PAGE_SIZE
    			}
    		});
    	}else{
    		selectedGgId = "";
    	}
    	if (isFlwView != true){
	    	var tb = gridPanel.getTopToolbar();
	   		if (records && records.length > 0) {
	   			tb.items.get("edit").enable();
	   			tb.items.get("del").enable();
	    	}else{
	   			tb.items.get("edit").disable();
	   			tb.items.get("del").disable();  
	    	}
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
		    	params: "conid = '" + propertyValue + "'",
		    	limit: PAGE_SIZE
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
			equTkGoodsMgm.updateGoodsSub(arr_objs, function(){
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
						equTkGoodsMgm.deleteSub(getids, function(){
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
    
    function addOrUpdateWindow(_conid, _conname, _conno, _ggid){
    	if (!aouWindow){
   			aouWindow = new Ext.Window({
				title: '设备退库',
				iconCls: 'option',
				layout: 'fit',
				width: 850, height: 500,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners: {
					hide: function(){
						ds.load({params:{
						    	start: 0,
						    	limit: PAGE_SIZE
					    	}
					    });
					}
				}
			});
   		}
   		aouWindow.show();
   		aouWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: 'pid='+CURRENTAPPID+'&type=tkgoods&conid='+_conid+'&conname='+_conname+'&conno='+_conno+'&ggid='+_ggid
		});
    }
    
    function openBoxWin(_conid, _conname, _uuids, _uuid, _partId){
    	if (!openBoxWindow){
   			openBoxWindow = new Ext.Window({
				title: '设备开箱',
				iconCls: 'btn',
				layout: 'fit',
				width: 850, height: 500,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners: {
					hide: function(){
						dsSub.load({
			    			params: {
			    				start: 0,
			    				limit: PAGE_SIZE
			    			}
			    		});
					}
				}
			});
   		}
   		openBoxWindow.show();
   		openBoxWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: 'pid='+CURRENTAPPID+'&type=openbox&conid='+_conid+'&conname='+_conname+'&uuids='+_uuids+'&uuid='+_uuid+'&partId='+_partId
		});
    }
    
});


