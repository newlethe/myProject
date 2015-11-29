var beanDh = "com.sgepit.pmis.equipment.hbm.EquGoodsArrival"
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"
var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsArrivalSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"


var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var storageArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var billStateArr = new Array();

//复制粘贴使用
var partDataArr;

var gridPanelFj;
var formPanel;

Ext.onReady(function(){
	var formPanelName = CURRENTAPPID == "1031902"? "设备/材料到货单":"设备到货单";
	var currentPid = CURRENTAPPID;
	DWREngine.setAsync(false);
	systemMgm.getUnitById(CURRENTAPPID, function(u) {
		if(u && u!=null && u!='null') {
			currentPid = u.upunit;
		}
	});
	
	//设备供货厂家，合同管理中乙方单位
	var sql = "select uids,csmc from sb_csb where isused = '1' union all " +
			" select t.cpid uids,t.partyb csmc from CON_PARTYB t where t.PID='"+currentPid+"'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);		
			csnoArr.push(temp);			
		}
	});
	
	//运输方式
	appMgm.getCodeValue("运输方式",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			sendArr.push(temp);			
		}
	});
	//包装方式
	var sql = "select puuid,packstyle from Equ_Pack_Style";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			packArr.push(temp);			
		}
	});
	//卸车方式
	appMgm.getCodeValue("卸车方式",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			dumpArr.push(temp);			
		}
	});
	//箱件类别
	appMgm.getCodeValue("箱件类别",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			boxArr.push(temp);			
		}
	});
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
		}
	});
	//设备仓库storageArr
	var sql = "select t.uids,t.detailed  from equ_warehouse t";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			storageArr.push(temp);			
		}
	});
    //流程审批状态
    appMgm.getCodeValue('流程状态',function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            billStateArr.push(temp);   
        }
    });
    DWREngine.setAsync(true);
	var csnoDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],  
		data: csnoArr
    });
    var sendDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: sendArr
    });
    var packDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: packArr
    });
    var storageDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: storageArr
    });
    var dumpDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: dumpArr
    });
    var boxDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: boxArr
    });
    var jzDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: jzArr
    });
	var fm = Ext.form;
	var fc = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isOpen' : {name : 'isOpen',fieldLabel : '是否开箱'},
		'dhNo' : {
			name : 'dhNo',
			fieldLabel : '到货批号', 
			readOnly : CURRENTAPPID == "1030902"?false:true,//国金要求可以修改到货批号
			width : 160
		},
		'dhDate' : {
			name : 'dhDate',
			fieldLabel : '实际到货日期', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'demDhDate' : {
			name : 'demDhDate',
			fieldLabel : '要求到货日期', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'plaDhDate' : {
			name : 'plaDhDate',
			fieldLabel : '计划到货日期', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'sendNum' : {
			name : 'sendNum',
			fieldLabel : '运输单号', 
			width : 160
		},
		'dhDesc' : {name : 'dhDesc',fieldLabel : '到货描述', allowBlank : false, width : 160},
		'csno' : {name : 'csno',fieldLabel : '供货厂家',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	listWidth : 215,
           	store: csnoDs,
           	width : 160
		},
		'receiveUser' : {name : 'receiveUser',fieldLabel : '接货人', width : 160},
		'boxNum' : {name : 'boxNum',fieldLabel : '箱件数量', width : 160},
		'totalWeight' : {name : 'totalWeight',fieldLabel : '总重量(kg)', width : 160},
		'sendType' : {
			name : 'sendType',
			fieldLabel : '运输方式', 
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: sendDs,
			width : 160
		},
		'carNo' : {name : 'carNo',fieldLabel : '车牌号', width : 160},
		'dumpType' : {
			name : 'dumpType',
			fieldLabel : '卸车方式', 
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: dumpDs,
			width : 160
		},
		'dumpUnit' : {name : 'dumpUnit',fieldLabel : '卸车单位', width : 160},
		'recordUser' : {name : 'recordUser',fieldLabel : '录单人', width : 160},
		'remark' : {name : 'remark',fieldLabel : '备注', width : 160},
        
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号', width : 160, readOnly : isFlwTask},
        'joinUnit' : {name : 'joinUnit',fieldLabel : '参与交接单位', allowBlank : false, width : 160},
        'joinPlace' : {name : 'joinPlace',fieldLabel : '交接地点', allowBlank : false, width : 160}
	}
	
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveArrival
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			parent.selectWin.close();
		}
	})
//	var finishCheck = new Ext.form.Checkbox({
//		id : 'finished',
//		name : 'finished',
//		fieldLabel : '完结',
//		//checked : true,
//		listeners : {
//			'check' : finishArrival
//		}
//	});
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isOpen', type : 'float'},
		{name : 'dhNo', type : 'string'},
		{name : 'dhDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'demDhDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'plaDhDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'sendNum', type : 'string'},
		{name : 'dhDesc', type : 'string'},
		{name : 'csno', type : 'string'},
		{name : 'receiveUser', type : 'string'},
		{name : 'boxNum', type : 'float'},
		{name : 'totalWeight', type : 'float'},
		{name : 'sendType', type : 'string'},
		{name : 'carNo', type : 'string'},
		{name : 'dumpType', type : 'string'},
		{name : 'dumpUnit', type : 'string'},
		{name : 'recordUser', type : 'string'},
		{name : 'remark', type : 'string'},

        {name : 'billState', type : 'string'},
        {name : 'flowid', type : 'string'},
        {name : 'joinUnit', type : 'string'},
        {name : 'joinPlace', type : 'string'}
	];
	
	
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    
    var conno;
    var conname;
    var partybno
	DWREngine.setAsync(false);
	baseMgm.findById(beanCon, edit_conid,function(obj){
		conno = obj.conno;
		conname = obj.conname;
		partybno = obj.partybno;
	});
	//处理到货批号
	var newDhNo = conno+"-DH-"
	equMgm.getEquNewDhNo(CURRENTAPPID,newDhNo,"dh_no","equ_goods_arrival",null,function(str){
		newDhNo = str;
	});
	DWREngine.setAsync(true);
    
    if(edit_uids == null || edit_uids == ""){
		loadFormRecord = new formRecord({
			uids : '',
			pid : CURRENTAPPID,
			conid : edit_conid,
			treeuids : edit_treeuids,
			finished : 0,
			isOpen : 0,
			dhNo : newDhNo,
			dhDate : '',
			demDhDate:'',
			plaDhDate:'',
			sendNum:'',
			dhDesc : '',
			csno : partybno,
			receiveUser : '',
			boxNum : 0,
			totalWeight : 0,
			sendType : '',
			carNo : '',
			dumpType : '',
			dumpUnit : '',
			recordUser : REALNAME,
			remark : '',

            billState : moduleFlowType == "None" ? '1':'0',
            flowid : flowid,
            joinUnit : '',
            joinPlace : ''
   		});
    }else{
	    DWREngine.setAsync(false);
		baseMgm.findById(beanDh, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
    }
  
    
    
	
	formPanel = new Ext.FormPanel({
		region : 'north',
		height : 210,
		border : false,
		labelAlign : 'right',
		bodyStyle : 'padding:5px 10px;',
//		labelWidth : 80,
		//tbar : ['->','完结：',finishCheck,'-',saveBtn,'-',cancelBtn,'-'],
		tbar : ['<font color=#15428b><B>'+formPanelName+'<B></font>','->',saveBtn,'-',cancelBtn,'-'],
		items : [
			{
				layout : 'column',
				border : false,
				items : [
					{
					layout : 'form',
					columnWidth : .33,
					border : false,
					items : [
						new fm.Hidden(fc['uids']),
						new fm.Hidden(fc['pid']),
						new fm.Hidden(fc['conid']),
						new fm.Hidden(fc['treeuids']),
						new fm.Hidden(fc['finished']),
						new fm.Hidden(fc['isOpen']),
                        new fm.Hidden(fc['billState']),
                        new fm.TextField(fc['dhNo']),
                        new fm.DateField(fc['dhDate']),
                        new fm.TextField(fc['flowid']),
                        new fm.TextField(fc['sendNum']),
                        new fm.ComboBox(fc['sendType']),
						{
							id : 'conno',
							xtype : 'textfield',
							fieldLabel : '合同编号',
							value : conno,
							width : 160,
							readOnly : true
						},
						new fm.TextField(fc['receiveUser']),
						new fm.TextField(fc['dumpUnit'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						new fm.TextField(fc['joinUnit']),
						new fm.DateField(fc['demDhDate']),
						{
							id : 'conname',
							xtype : 'textfield',
							fieldLabel : '合同名称',
							value : conname,
							width : 160,
							readOnly : true
						},
						new fm.NumberField(fc['boxNum']),
						new fm.TextField(fc['carNo']),
						new fm.TextField(fc['recordUser'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						new fm.TextField(fc['dhDesc']),
						new fm.DateField(fc['plaDhDate']),
						new fm.ComboBox(fc['csno']),
                        new fm.TextField(fc['joinPlace']),
//						new Ext.form.TriggerField({
//                			name:'csno',
//                			id:'getCsFromList',
//                			fieldLabel:'供货厂家',
//                			triggerClass: 'x-form-date-trigger',
//	    					readOnly: true, selectOnFocus: true,
//	    					anchor:'95%',
//	    					onTriggerClick:getParamsFromList
//                		}),
						new fm.NumberField(fc['totalWeight']),
						new fm.ComboBox(fc['dumpType']),
						new fm.TextField(fc['remark'])
					]
				}]
			}
		]
	});
	
	
	
	
	// TODO : ======到货详细信息======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'arrivalId' : {name : 'arrivalId',fieldLabel : '到货单主键'},
		'arrivalNo' : {name : 'arrivalNo',fieldLabel : '到货单批次号'},
		'boxType' : {
			name : 'boxType',
			fieldLabel : '箱件类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: boxDs
			},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: jzDs
		},
        'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号',allowBlank : false},
        'boxName' : {name : 'boxName',fieldLabel : '箱件名称',allowBlank : false},
        'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
        'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
        'unit' : {name : 'unit',fieldLabel : '单位'},
        'mustNum' : {name : 'mustNum',fieldLabel : '应到数',allowBlank : false, decimalPrecision : 4},
        'realNum' : {name : 'realNum',fieldLabel : '实到数',allowBlank : false, decimalPrecision : 4},
        'weight' : {name : 'weight',fieldLabel : '重量（kg）',decimalPrecision : 3},
		'packType' : {
			name : 'packType',
			fieldLabel : '包装方式',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: packDs
		},
		'storage' : {
			name : 'storage',
			fieldLabel : '存放库位',
			mode : 'local',
			editable:false,
			allowBlank : CURRENTAPPID == "1030902"?false:true,
			valueField: 'k',
			displayField: 'v',
			readOnly:true,
            listWidth: 220,
            lazyRender:true,
            triggerAction: 'all',
            store : storageDs,
			tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small'
		},
		'exception' : {name : 'exception',fieldLabel : '异常'},
		'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
	};
	
	var storageComboTree = new fm.ComboBox(fcSub['storage']);
	storageComboTree.on('beforequery', function(){
		storTreePanel.render('tree');
		storTreePanel.getRootNode().reload();
	});
	
	storTreePanel.on('click', function(node,e){
		var elNode = node.getUI().elNode;
		var treename = node.attributes.treename;
		var uids = elNode.all("uids").innerText;
		storageComboTree.setValue(uids)
		storageComboTree.collapse();
	});
	
	var smSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	
	var cmSub = new Ext.grid.ColumnModel([
		smSub,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcSub['uids'].fieldLabel,
			dataIndex : fcSub['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcSub['pid'].fieldLabel,
			dataIndex : fcSub['pid'].name,
			hidden : true
		},{
			id : 'arrivalId',
			header : fcSub['arrivalId'].fieldLabel,
			dataIndex : fcSub['arrivalId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcSub['arrivalNo'].fieldLabel,
			dataIndex : fcSub['arrivalNo'].name,
			hidden : true
		},{
			id : 'boxType',
			header : fcSub['boxType'].fieldLabel,
			dataIndex : fcSub['boxType'].name,
			editor : new fm.ComboBox(fcSub['boxType']),
			renderer : function(v){
				var box = "";
				for(var i=0;i<boxArr.length;i++){
					if(v == boxArr[i][0])
						box = boxArr[i][1];
				}
				return box;
			},
			align : 'center',
			width : 80
		},{
			id : 'jzNo',
			header : fcSub['jzNo'].fieldLabel,
			dataIndex : fcSub['jzNo'].name,
			editor : new fm.ComboBox(fcSub['jzNo']),
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			},
			align : 'center',
			width : 80
		},{
			id : 'boxNo',
			header : fcSub['boxNo'].fieldLabel,
			dataIndex : fcSub['boxNo'].name,
			editor : new fm.TextField(fcSub['boxNo']),
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			header : fcSub['boxName'].fieldLabel,
			dataIndex : fcSub['boxName'].name,
			editor : new fm.TextField(fcSub['boxName']),
			width : 180
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			dataIndex : fcSub['ggxh'].name,
			editor : new fm.TextField(fcSub['ggxh']),
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			dataIndex : fcSub['graphNo'].name,
			editor : new fm.TextField(fcSub['graphNo']),
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcSub['unit'].fieldLabel,
			dataIndex : fcSub['unit'].name,
			editor : new fm.TextField(fcSub['unit']),
			align : 'center',
			width : 60
		},{
			id : 'mustNum',
			header : fcSub['mustNum'].fieldLabel,
			dataIndex : fcSub['mustNum'].name,
			editor : new fm.NumberField(fcSub['mustNum']),
			align : 'center',
			width : 80
		},{
			id : 'realNum',
			header : fcSub['realNum'].fieldLabel,
			dataIndex : fcSub['realNum'].name,
			editor : new fm.NumberField(fcSub['realNum']),
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			editor : new fm.NumberField(fcSub['weight']),
			align : 'center',
			width : 80
			//renderer:function(value){
			//	return cnMoneyToPrec(value,3);
			//}
		},{
			id : 'packType',
			header : fcSub['packType'].fieldLabel,
			dataIndex : fcSub['packType'].name,
			editor : new fm.ComboBox(fcSub['packType']),
			renderer : function(v){
				var pack = "";
				for(var i=0;i<packArr.length;i++){
					if(v == packArr[i][0])
						pack = packArr[i][1];
				}
				return pack;
			},
			align : 'center',
			width : 80
		},{
			id : 'storage',
			header : fcSub['storage'].fieldLabel,
			dataIndex : fcSub['storage'].name,
			align : 'center',
			editor : storageComboTree,
			renderer : function(v){
				var storage = "";
				for(var i=0;i<storageArr.length;i++){
					if(v == storageArr[i][0])
						storage = storageArr[i][1];
				}
				return storage;
			},
			width : 160
		},{
			id : 'exception',
			header : fcSub['exception'].fieldLabel,
			dataIndex : fcSub['exception'].name,
			editor : new fm.Checkbox(fcSub['exception']),
//			editor : new fm.Hidden(fcSub['exception']),
			renderer : function(v,m,r){
				return "<input type='checkbox' title='双击可编辑' "+(v==1?"checked":"")+" disabled>"
			},
			align : 'center',
			width : 80
		},{
			id : 'exceptionDesc',
			header : fcSub['exceptionDesc'].fieldLabel,
			dataIndex : fcSub['exceptionDesc'].name,
			editor : new fm.TextField(fcSub['exceptionDesc']),
			width : 180
		},{
			id : 'remark',
			header : fcSub['remark'].fieldLabel,
			dataIndex : fcSub['remark'].name,
			editor : new fm.TextField(fcSub['remark']),
			width : 180
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'arrivalId', type:'string'},
		{name:'arrivalNo', type:'string'},
		{name:'boxType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'boxName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'mustNum', type:'float'},
		{name:'realNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'packType', type:'string'},
		{name:'storage', type:'string'},
		{name:'exception', type:'float'},
		{name:'exceptionDesc', type:'string'},
		{name:'remark', type:'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		arrivalId : '',
		arrivalNo : '',
		boxType : '',
		jzNo : '',
		boxNo : '',
		boxName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		mustNum : '',
		realNum : '',
		weight : '',
		packType : '',
		storage  : '',
		exception : 0,
		exceptionDesc : '',
		remark : ''
	}	
	
	var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "pid='"+CURRENTAPPID+"' and arrivalId='"+edit_uids+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeySub
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort(orderColumnSub, 'desc');	//设置默认排序列
    
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '到货单明细',
		tbar : ['<font color=#15428b><B>到货单明细<B></font>','-'],
		insertHandler : addArrivalSub,
		saveHandler : saveArrivalSub,
		header: false,
	    border: false,
	    layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 10,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSub,
		business : businessSub,
		primaryKey : primaryKeySub
	});
	
	
	var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
				"?uids="+edit_uids+"&uuid="+edit_treeuids+"&conid="+edit_conid+"&edit=true&type=DH";
	var filePanel = new Ext.Panel({
		id : 'filePanel',
		title : '附件',
		layout: 'fit',
		html:"<iframe id='fileWinFrame' src='"+url+"' width='100%' height='100%' frameborder='0'></iframe>"
	});
	
	
	var tabPanel = new Ext.TabPanel({
		activeTab : 0,
        border: false,
        region: 'center',
    	items: [gridPanelSub]
	})
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [formPanel, tabPanel]
	});
	formPanel.getForm().loadRecord(loadFormRecord);
	dsSub.load({params:{start:0,limit:10}});
	
	function saveArrival(){
		var form = formPanel.getForm();
		if(CURRENTAPPID == "1030902"){
			var getUids = '';
			//国金允许修改到货单号，修改后判断是否修该的单号是否存在 yanglh 2013-12-03
			DWREngine.setAsync(false);
			baseDao.getData("select uids from EQU_GOODS_ARRIVAL where dh_no='"+form.findField("dhNo").getValue()+"'",function(list){
				if(list.length>0){
					getUids = list;
				}
			});
			DWREngine.setAsync(false);
			if((getUids != '')&& (getUids != form.findField("uids").getValue())){
				Ext.example.msg('系统提示','该到货批号已存在！请修改！');
				return;
			}
		}
        var dhDesc = form.findField("dhDesc").getValue();
        var joinUnit = form.findField("joinUnit").getValue();
        var joinPlace = form.findField("joinPlace").getValue();
        if(dhDesc == null || dhDesc.length == 0){
            Ext.example.msg('提示信息','到货描述必须填写！');
            return false;
        }
        if(joinUnit == null || joinUnit.length == 0){
            Ext.example.msg('提示信息','交接单位必须填写！');
            return false;
        }
        if(joinPlace == null || joinPlace.length == 0){
            Ext.example.msg('提示信息','交接地点必须填写！');
            return false;
        }
    	var obj = form.getValues();
		for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	equMgm.addOrUpdateEquArrival(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','设备到货保存失败！');
    		}else{
    			Ext.example.msg('提示信息','设备到货保存成功！');
    			form.findField("uids").setValue(str);
    			dsSub.baseParams.params = "pid='"+CURRENTAPPID+"' and arrivalId='"+str+"'"
    		}
    	});
    	DWREngine.setAsync(true);
	}
	
	function addArrivalSub(){
		var uids = formPanel.getForm().findField("uids").getValue();
		var no = formPanel.getForm().findField("dhNo").getValue();
		if(uids == null || uids == ""){
			Ext.example.msg('提示信息','请先保存到货单基本信息！');
			return;
		}
		PlantIntSub.arrivalId = uids;
		PlantIntSub.arrivalNo = no;
		gridPanelSub.defaultInsertHandler();
	}
	
	function saveArrivalSub(){
		var records = dsSub.getModifiedRecords();
		for (var i = 0; i < records.length; i++) {
			var exc = records[i].get("exception");
			if(exc == true){
				records[i].set("exception","1");
			}else{
				records[i].set("exception","0");
			}	
		}
		gridPanelSub.defaultSaveHandler();
	}
	
	//--------------------------增加复制，粘贴两个按钮------------------------------
	var copyBtn = new Ext.Button({
		id : 'copy',
        text : '复制',
        iconCls : 'copy',
        handler : copyFun
    });
    
    var pasteBtn = new Ext.Button({
        id : 'paste',
        text: '粘贴',
        iconCls: 'paste',
        disabled : true,
        handler : pasteFun
    });
    
    var impBtn = new Ext.Button({
        id : 'import',
        text : '导入数据',
        tooltip : '如果需要通过Excel导入数据，请先下载模板',
        cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icons/page_excel.png',
        handler : importDataFile
    })
    var downBtn = new Ext.Button({
        id : 'down',
        text : '下载模板',
        tooltip : '如果需要通过Excel导入数据，请先下载模板',
        cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icons/page_excel.png',
        handler : function(){
            var filePrintType = "EquArrivalSub";
	        downloadExcelTemp(filePrintType);
        }
    })
        
    var gridTbar = gridPanelSub.getTopToolbar();
	if (gridTbar) {
		gridTbar.addButton(copyBtn);
		gridTbar.add('-');
		gridTbar.addButton(pasteBtn);
		gridTbar.add('-');
		gridTbar.addButton(impBtn);
		gridTbar.add('-');
		gridTbar.addButton(downBtn);
	}
	
	function copyFun(){
		var records = smSub.getSelections();
		if(records.length == 0){
			Ext.example.msg('提示信息','请先选择需要复制的到货明细！');
			return;
		}else{
			partDataArr = new Array();
			for (var i = 0; i < records.length; i++) {
				if(records[i].get('uids') == ""){
					Ext.example.msg('提示信息','请选择已保存数据！');
					return;
				};
				partDataArr.push(records[i].data);
			}
			Ext.getCmp('copy').setText("复制("+partDataArr.length+")");
			Ext.getCmp('paste').setDisabled(false);
		}
	}
    
	function pasteFun(){
		if(partDataArr.length == 0){
			return ;
		}
		DWREngine.setAsync(false);
		equMgm.pasteEquArrivalSubPart(partDataArr,function(str){
			if(str == "1"){
				Ext.example.msg('提示信息','到货单明细粘贴成功！');
				dsSub.reload();
			}else if(str == "0"){
				Ext.example.msg('提示信息','到货单明细粘贴失败！');
			}
		});
		DWREngine.setAsync(true);
	}
	
    
    function importDataFile(){
        var allowedDocTypes = "xls,xlsx";
        var uids = formPanel.getForm().findField("uids").getValue();
        
        var impUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=importData&pid="+CURRENTAPPID+"&uids="+uids+"&bean="+beanSub
        var uploadForm = new Ext.form.FormPanel({
            baseCls:'x-plain',
            labelWidth:80,
            url:impUrl,
            fileUpload:true,
            defaultType:'textfield',
            items:[{
                xtype:'textfield',
                fieldLabel:'请选择文件',
                name:'filename1',
                inputType:'file',
                anchor:'90%'
            }]
        });

        var uploadWin=new Ext.Window({
            title:'上传',
            width:450,
            height:120,
            minWidth:300,
            minHeight:100,
            layout:'fit',
            plain:true,
            bodyStyle:'padding:5px;',
            buttonAlign:'center',
            items:uploadForm,
            buttons:[{
                text:'上传',
                handler:function(){
                    var filename=uploadForm.form.findField("filename1").getValue()
                    if(filename!=""){
                        var fileExt=filename.substring(filename.lastIndexOf(".")+1,filename.length).toLowerCase();
                        if(allowedDocTypes.indexOf(fileExt)==-1){
                            Ext.MessageBox.alert("提示","请选择Excel文档！");
                            return;
                        }else{
                            uploadWin.hide();
                            var msg = '';
                            if(uploadForm.form.isValid()){
                                uploadForm.getForm().submit({
                                    method:'POST',
                                    params:{
                                        ac:'importData'
                                    },
                                    success:function(form,action){
                                        var obj = action.result.msg;
                                        msg = (!!obj&&obj.length > 0) ? obj[0].result : "报表数据导入成功！";
                                        Ext.Msg.show({
                                            title : '导入成功',
                                            msg : msg,
                                            buttons : Ext.Msg.OK,
                                            icon : Ext.MessageBox.INFO
                                        });
                                        dsSub.load({params:{start:0,limit:10}});
                                    },
                                    failure:function(form,action){
                                        var obj = action.result.msg;
                                        msg = (!!obj&&obj.length > 0) ? obj[0].result : "报表数据导入错误！";
                                        Ext.Msg.show({
                                            title : '导入失败',
                                            msg : msg,
                                            buttons : Ext.Msg.OK,
                                            icon : Ext.MessageBox.ERROR
                                        });
                                    }
                                });
                            }
                        }
                    }
                }
            }, {
                text:'关闭',
                handler:function(){uploadWin.hide();}
            }]
        });
        uploadWin.show();
    }
});

//下载需要导入数据的excel模板
function downloadExcelTemp(filePrintType) {
	var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"
			+ filePrintType + "'";
	DWREngine.setAsync(false);
	baseMgm.getData(sql, function(str) {
				fileid = str;
			});
	DWREngine.setAsync(true);
	var openUrl = CONTEXT_PATH
			+ "/servlet/BlobCrossDomainServlet?ac=appfile&fileid=" + fileid
			+ "&pid=" + CURRENTAPPID;
	document.all.formAc.action = openUrl;
	document.all.formAc.submit();
}
