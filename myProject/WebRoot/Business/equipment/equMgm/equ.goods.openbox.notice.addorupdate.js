var beanNotice = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNotice"
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"
var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNoticeSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var beanArrSub = "com.sgepit.pmis.equipment.hbm.EquGoodsArrivalSub"
var businessArrSub = "baseMgm"
var listMethodArrSub = "findWhereOrderby"
var primaryKeyArrSub = "uids"
var orderColumnArrSub = "arrivalNo"

var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var profArr = new Array();
var unitArr = new Array();

var gridPanelFj;
var formPanel;

Ext.onReady(function(){
	var formPanelName = CURRENTAPPID == "1031902"? "设备/材料开箱通知单":"设备开箱通知单";
	DWREngine.setAsync(false);
	//设备供货厂家
	var sql = "select uids,csmc from sb_csb";
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
	//所属专业
	appMgm.getCodeValue("所属专业",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			profArr.push(temp);			
		}
	});
	//参加单位
	var sql = "select unitid,unitname from sgcc_ini_unit t where t.unit_type_id ='7'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			unitArr.push(temp);			
		}
	});
	
	//设备仓库storageArr
	var storageArr = new Array();
	var sql = "select t.uids,t.detailed  from equ_warehouse t";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			storageArr.push(temp);			
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
    var profDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: profArr
    });
    var unitDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: unitArr
    });
    
	var fm = Ext.form;
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isCheck' : {name : 'isCheck',fieldLabel : '已检验'},
		'noticeNo' : {
			name : 'noticeNo',
			fieldLabel : '通知单号', 
			readOnly : CURRENTAPPID == "1030902"?false:true,//国金项目要求可以手动修改 yanglh 2013-12-03
			width : 160
		},
		'noticeDate' : {
			name : 'noticeDate',
			fieldLabel : '下单日期', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'openDate' : {
			name : 'openDate',
			fieldLabel : '开箱时间', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'equArriveDate' : {
			name : 'equArriveDate',
			fieldLabel : '设备到货日期', 
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
        'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点', allowBlank : false, width : 160},
		'openUnit' : {
			name : 'openUnit',
			fieldLabel : '参与单位',
            allowBlank : false,
			//readOnly: true,
			//valueField: 'k',
			//displayField: 'v',
			//mode: 'local',
			//typeAhead: true,
			//triggerAction: 'all', 
			//store: unitDs,
			width : 160
		},
		'equDesc' : {name : 'equDesc',fieldLabel : '检验主设备描述', allowBlank : false, width : 160},
		'ownerNo' : {name : 'ownerNo',fieldLabel : '业主单号', width : 160},
		'professinal' : {
			name : 'professinal',
			fieldLabel : '所属专业',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: profDs,
			width : 160
		},
		'remark' : {name : 'remark',fieldLabel : '事项', width : 160},
        
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号', width : 160, readOnly : isFlwTask},
        'projectName' : {name : 'projectName',fieldLabel : '工程名称', allowBlank : false, width : 160}
	}
	
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveNotice
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
//			'check' : finishNotice
//		}
//	});
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isCheck', type : 'float'},
		{name : 'noticeNo', type : 'string'},
		{name : 'noticeDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'equArriveDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'openDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'openPlace', type : 'string'},
		{name : 'openUnit', type : 'string'},
		{name : 'equDesc', type : 'string'},
		{name : 'ownerNo', type : 'string'},
		{name : 'professinal', type : 'string'},
		{name : 'remark', type : 'string'},
        
        {name : 'billState', type : 'string'},
        {name : 'flowid', type : 'string'},
        {name : 'projectName', type : 'string'}
	];
	
	
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    
    var conno;
    var conname;
	DWREngine.setAsync(false);
	baseMgm.findById(beanCon, edit_conid,function(obj){
		conno = obj.conno;
		conname = obj.conname;
	});
	//处理到货批号
	var newTzNo = conno+"-TZ-"
	equMgm.getEquNewDhNo(CURRENTAPPID,newTzNo,"notice_no","equ_goods_openbox_notice",null,function(str){
		newTzNo = str;
	});
	DWREngine.setAsync(true);
    if(edit_uids == null || edit_uids == ""){
		loadFormRecord = new formRecord({
			uids : '',
			pid : CURRENTAPPID,
			conid : edit_conid,
			treeuids : edit_treeuids,
			finished : 0,
			isCheck : 0,
			noticeNo : newTzNo,
			noticeDate : new Date(),
			equArriveDate:'',
			openDate : new Date(),
			openPlace : '',
			equDesc : '',
			ownerNo : '',
			professinal : '',
			remark : '',
            openUnit : '',
            billState : moduleFlowType == "None" ? '1':'0',
            flowid : flowid,
            projectName : ''
   		});
    }else{
	    DWREngine.setAsync(false);
		baseMgm.findById(beanNotice, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
    }

    
	formPanel = new Ext.FormPanel({
		region : 'north',
		height : 160,
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
						new fm.Hidden(fc['isCheck']),
                        new fm.Hidden(fc['billState']),
						
						new fm.TextField(fc['noticeNo']),
						new fm.DateField(fc['noticeDate']),
//						{
//							id : 'conno',
//							xtype : 'textfield',
//							fieldLabel : '合同编号',
//							value : conno,
//							width : 160,
//							readOnly : true
//						}					
						new fm.TextField(fc['ownerNo']),
                        new fm.TextField(fc['flowid']),
                        new fm.DateField(fc['equArriveDate'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						{
							id : 'conname',
							xtype : 'textfield',
							fieldLabel : '合同名称',
							value : conname,
							width : 160,
							readOnly : true
						},
						new fm.DateField(fc['openDate']),
						new fm.ComboBox(fc['professinal']),
                        new fm.TextField(fc['remark'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
                        new fm.TextField(fc['equDesc']),
						new fm.TextField(fc['openPlace']),
						 new fm.TextField(fc['projectName']),
                        new fm.TextField(fc['openUnit'])
					]
				}]
            }
		]
	});
	
	
	
	
	// TODO : ======开箱通知单明细======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'noticeId' : {name : 'noticeId',fieldLabel : '开箱通知单主键'},
		'noticeNo' : {name : 'noticeNo',fieldLabel : '开箱通知单批次号'},
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
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'boxName' : {name : 'boxName',fieldLabel : '箱件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'openNum' : {name : 'openNum',fieldLabel : '数量'},
		'weight' : {name : 'weight',fieldLabel : '重量（kg）',decimalPrecision : 3},
		'arrivalSubId' : {name : 'arrivalSubId',fieldLabel : '到货明细设备主键'},
		'arrivalNo' : {name : 'arrivalNo',fieldLabel : '到货单批次号'}
	};
	var smSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cmSub = new Ext.grid.ColumnModel([
		smSub,
//		new Ext.grid.RowNumberer({
//			header : '序号',
//			width : 35
//		}),
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
			id : 'noticeId',
			header : fcSub['noticeId'].fieldLabel,
			dataIndex : fcSub['noticeId'].name,
			hidden : true
		},{
			id : 'noticeNo',
			header : fcSub['noticeNo'].fieldLabel,
			dataIndex : fcSub['noticeNo'].name,
			hidden : true
		},{
			id : 'boxType',
			header : fcSub['boxType'].fieldLabel,
			dataIndex : fcSub['boxType'].name,
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
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			header : fcSub['boxName'].fieldLabel,
			dataIndex : fcSub['boxName'].name,
			width : 180
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			dataIndex : fcSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			dataIndex : fcSub['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcSub['unit'].fieldLabel,
			dataIndex : fcSub['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'openNum',
			header : fcSub['openNum'].fieldLabel,
			dataIndex : fcSub['openNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'arrivalSubId',
			header : fcSub['arrivalSubId'].fieldLabel,
			dataIndex : fcSub['arrivalSubId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcSub['arrivalNo'].fieldLabel,
			dataIndex : fcSub['arrivalNo'].name,
			hidden : true
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'noticeId', type:'string'},
		{name:'noticeNo', type:'string'},
		{name:'boxType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'boxName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'openNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'arrivalSubId', type:'string'},
		{name:'arrivalNo', type:'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		noticeId : '',
		noticeNo : '',
		boxType : '',
		jzNo : '',
		boxNo : '',
		boxName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		openNum : '',
		weight : '',
		arrivalSubId : '',
		arrivalNo : ''
	}	
	
	var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "pid='"+CURRENTAPPID+"' and noticeId='"+edit_uids+"'"
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
		title : '通知单明细',
		tbar : ['<font color=#15428b><B>通知单明细<B></font>','-'],
		insertHandler : addNoticeSub,
		//saveHandler : saveNoticeSub,
		saveBtn : false,
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
	
	
	// TODO : ======通知单明细中从到货单选择设备
	var fcArrSub = {
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
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'boxName' : {name : 'boxName',fieldLabel : '箱件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'mustNum' : {name : 'mustNum',fieldLabel : '应到数'},
		'realNum' : {name : 'mustNum',fieldLabel : '实到数'},
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
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'exception' : {name : 'exception',fieldLabel : '异常'},
		'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
	};
	var smArrSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var cmArrSub = new Ext.grid.ColumnModel([
		smArrSub,
//		new Ext.grid.RowNumberer({
//			header : '序号',
//			width : 35
//		}),
		{
			id : 'uids',
			header : fcArrSub['uids'].fieldLabel,
			dataIndex : fcArrSub['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcArrSub['pid'].fieldLabel,
			dataIndex : fcArrSub['pid'].name,
			hidden : true
		},{
			id : 'arrivalId',
			header : fcArrSub['arrivalId'].fieldLabel,
			dataIndex : fcArrSub['arrivalId'].name,
			hidden : true
		},{
			id : 'arrivalNo',
			header : fcArrSub['arrivalNo'].fieldLabel,
			dataIndex : fcArrSub['arrivalNo'].name,
			hidden : true
		},{
			id : 'boxType',
			header : fcArrSub['boxType'].fieldLabel,
			dataIndex : fcArrSub['boxType'].name,
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
			header : fcArrSub['jzNo'].fieldLabel,
			dataIndex : fcArrSub['jzNo'].name,
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
			header : fcArrSub['boxNo'].fieldLabel,
			dataIndex : fcArrSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			header : fcArrSub['boxName'].fieldLabel,
			dataIndex : fcArrSub['boxName'].name,
			width : 180
		},{
			id : 'ggxh',
			header : fcArrSub['ggxh'].fieldLabel,
			dataIndex : fcArrSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcArrSub['graphNo'].fieldLabel,
			dataIndex : fcArrSub['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcArrSub['unit'].fieldLabel,
			dataIndex : fcArrSub['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'mustNum',
			header : fcArrSub['mustNum'].fieldLabel,
			dataIndex : fcArrSub['mustNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'realNum',
			header : fcArrSub['realNum'].fieldLabel,
			dataIndex : fcArrSub['realNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fcArrSub['weight'].fieldLabel,
			dataIndex : fcArrSub['weight'].name,
			align : 'center',
			width : 80
		},{
			id : 'packType',
			header : fcArrSub['packType'].fieldLabel,
			dataIndex : fcArrSub['packType'].name,
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
			header : fcArrSub['storage'].fieldLabel,
			dataIndex : fcArrSub['storage'].name,
			renderer : function(v){
				var storage = "";
				for(var i=0;i<storageArr.length;i++){
					if(v == storageArr[i][0]){
						storage = storageArr[i][1];
						break;
					}
				}
				return storage;
			},
			align : 'center',
			width : 80
		},{
			id : 'exception',
			header : fcArrSub['exception'].fieldLabel,
			dataIndex : fcArrSub['exception'].name,
			renderer : function(v,m,r){
				return "<input type='checkbox' "+(v==1?"checked":"")+" disabled >"
			},
			align : 'center',
			width : 80
		},{
			id : 'exceptionDesc',
			header : fcArrSub['exceptionDesc'].fieldLabel,
			dataIndex : fcArrSub['exceptionDesc'].name,
			width : 180
		},{
			id : 'remark',
			header : fcArrSub['remark'].fieldLabel,
			dataIndex : fcArrSub['remark'].name,
			width : 180
		}
	]);
	var ColumnsArrSub = [
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
	
	var dsArrSub = new Ext.data.GroupingStore({
		baseParams: {
	    	ac: 'list',
	    	bean: beanArrSub,
	    	business: businessArrSub,
	    	method: listMethodArrSub,
	    	params: "1=2"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyArrSub
        }, ColumnsArrSub),
        remoteSort: true,
        pruneModifiedRecords: true,
        
        remoteGroup : false,
		sortInfo : {
			field : orderColumnArrSub,
			direction : "ASC"
		}, // 分组
		groupField : orderColumnArrSub // 分组
    });
    dsArrSub.setDefaultSort(orderColumnArrSub, 'desc');	//设置默认排序列
    
    var selectArrSubEquBtn = new Ext.Button({
    	text : '选择',
    	iconCls : 'btn',
    	handler : function(){
    		var records = smArrSub.getSelections();
    		if(records == null || records.length == 0){
    			Ext.example.msg('提示信息','请先选择到货单中的设备！');
    			return;
    		}
    		var arrivalSubUids = new Array()
    		for (var i = 0; i < records.length; i++) {
    			arrivalSubUids.push(records[i].get("uids"));
    		}
    		var id = formPanel.getForm().findField('uids').getValue();
    		var no = formPanel.getForm().findField('noticeNo').getValue();
    		DWREngine.setAsync(false);
    		equMgm.insertNoticeSubFromArrivalSub(arrivalSubUids,id,no,function(str){
    			if(str == "1"){
    				Ext.example.msg('提示信息','通知单设备选择成功！');
    				selectArrSubWin.hide();
    				dsSub.reload();
    			}else{
    				Ext.example.msg('提示信息','通知单设备选择失败！');
    			}
    		});
    		DWREngine.setAsync(true);
    	}
    });
    
	var gridPanelArrSub = new Ext.grid.GridPanel({
		ds : dsArrSub,
		cm : cmArrSub,
		sm : smArrSub,
		title : '到货单明细',
		tbar : ['<font color=#15428b><B>到货单明细<B></font>','->',selectArrSubEquBtn],
		header: false,
		//height : document.body.clientHeight*0.5,
	    border: false,
	    //region: 'south',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    view : new Ext.grid.CheckboxGroupingView({ // 分组
			forceFit : false,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		}),
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsArrSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var selectArrSubWin = new Ext.Window({
		width: 900,
		height: 450,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [gridPanelArrSub]
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
	
	function saveNotice(){
		var form = formPanel.getForm();
        var openPlace = form.findField("openPlace").getValue();
        var equDesc = form.findField("equDesc").getValue();
        var projectName = form.findField("projectName").getValue();
        var openUnit = form.findField("openUnit").getValue();
        //国金判断到货单号手动修改后是否存在相同的 yanglh 2013-12-03
        if(CURRENTAPPID == "1030902"){
			var getUids = '';
			DWREngine.setAsync(false);
			baseDao.getData("select uids from EQU_GOODS_OPENBOX_NOTICE where notice_no='"+form.findField("noticeNo").getValue()+"'",function(list){
				if(list.length>0){
					getUids = list;
				}
			});
			DWREngine.setAsync(false);
			if((getUids != '')&& (getUids != form.findField("uids").getValue())){
				Ext.example.msg('系统提示','该通知单号已存在！请修改！');
				return;
			}       
        }
        
        if(openPlace == null || openPlace.length == 0){
            Ext.example.msg('提示信息','开箱地点必须填写！');
            return false;
        }
        if(equDesc == null || equDesc.length == 0){
            Ext.example.msg('提示信息','检验主设备描述必须填写！');
            return false;
        }
        if(projectName == null || projectName.length == 0){
            Ext.example.msg('提示信息','工程名称必须填写！');
            return false;
        }
        if(openUnit == null || openUnit.length == 0){
            Ext.example.msg('提示信息','参与单位必须填写！');
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
    	equMgm.addOrUpdateEquOpenboxNotice(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','设备开箱检验通知单保存失败！');
    		}else{
    			Ext.example.msg('提示信息','设备开箱检验通知单保存成功！');
    			form.findField("uids").setValue(str);
    			dsSub.baseParams.params = "pid='"+CURRENTAPPID+"' and noticeId='"+str+"'"
    		}
    	});
    	DWREngine.setAsync(true);
	}
	
	function addNoticeSub(){
		var uids = formPanel.getForm().findField("uids").getValue();
		var no = formPanel.getForm().findField("noticeNo").getValue();
		var conid = formPanel.getForm().findField("conid").getValue();
		if(uids == null || uids == ""){
			Ext.example.msg('提示信息','请先保存通知单基本信息！');
			return;
		}
		
		PlantIntSub.noticeId = uids;
		PlantIntSub.noticeNo = no;
		selectArrSubWin.show();
		
		//查询已经完结的到货单，并且没有选择过的设备
        var state = moduleFlowType == "None" ? 'finished':'billState';
        var arrSubWhere = " arrivalId in (select uids from EquGoodsArrival where "+state+"='1' " +
                " and conid='"+conid+"'" +
                " ) " +
				" and uids not in (select arrivalSubId from EquGoodsOpenboxNoticeSub)";
		dsArrSub.baseParams.params = arrSubWhere;
		dsArrSub.load({params:{start:0,limite:PAGE_SIZE}});
	}
	
	function saveNoticeSub(){
		gridPanelSub.defaultSaveHandler();
	}
	
	
});

