var beanExce = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxExce"
var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxExceView"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uuid"
var orderColumn = "excePassDate"


var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var profArr = new Array();
var unitArr = new Array();
var equTypeArr = new Array();
var treeArr = new Array();
var exceTypeArr = new Array();

var ds;
var dsSub;
var selectParentid = "";
var selectConid = "";
var selectUuid = "";
Ext.onReady(function(){
	
	var fm = Ext.form;
	DWREngine.setAsync(false);
	//供货厂家
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
	
	//设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			equTypeArr.push(temp);			
		}
	});
	
	//设备合同分类树
	var sql = "select uuid,treename from equ_type_tree t ";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
				if(list[i][1]=="1"||list[i][1]=="2"||list[i][1]=="3"){
					for(var j=0;j<equTypeArr.length;j++){
						if(list[i][1] == equTypeArr[j][0])
							temp.push(equTypeArr[j][1]);
					}	
				}else{
					temp.push(list[i][1]);
				}
				
			treeArr.push(temp);			
		}
	});
	
	//异常类型exceTypeArr
	appMgm.getCodeValue("异常类型",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			exceTypeArr.push(temp);			
		}
	});
	//合同列表
	var conArr=new Array();
	var sql = "select c.conid,c.conname  from Equ_Cont_View c";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			conArr.push(temp);			
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
    
    var equTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: equTypeArr
    });
    
    var treeuidsDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: treeArr
    });
    
    var exceTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: exceTypeArr
    });
	
	
	// TODO : ======开箱检验结果明细======
	var fc = {
		'uuid' : {name : 'uuid',fieldLabel : '检验结果主键'},
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同名称'},
		'openboxId' : {name : 'openboxId',fieldLabel : '到货单主键'},
		'openboxNo' : {name : 'openboxNo',fieldLabel : '到货单批次号'},
		'resultId' : {name : 'resultId',fieldLabel : '检验结果主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isStorein' : {name : 'isStorein',fieldLabel : '是否入库'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'jzNo' : {name : 'jzNo',fieldLabel : '机组号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'weight' : {name : 'weight',fieldLabel : '重量（kg）',decimalPrecision : 3},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'boxinNum' : {name : 'boxinNum',fieldLabel : '装箱单数量'},
		'realNum' : {name : 'realNum',fieldLabel : '实到数量'},
		'passNum' : {name : 'passNum',fieldLabel : '合格数量'},
		'exceNum' : {name : 'exceNum',fieldLabel : '异常数量'},
		'exception' : {name : 'exception',fieldLabel : '异常'},
		'exceType' : {name : 'exceType',fieldLabel : '异常类型'},
		'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
		
		'excePassNum' : {name : 'excePassNum',fieldLabel : '异常处理数量', decimalPrecision : 4},
		'applyInNum' : {name : 'applyInNum',fieldLabel : '申请入库数量', decimalPrecision : 4},
		'excePassDate' : {
			name : 'excePassDate',
			fieldLabel : '异常处理日期',
			format: 'Y-m-d',
			width : 125
			},
		'handleUser' : {name : 'handleUser',fieldLabel : '异常处理人'},
		'handleProcess' : {
			name : 'handleProcess',
			fieldLabel : '异常处理过程',
			width : 380
			},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			width :380
			}
	};
	
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.ColumnModel([
		//sm,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uuid',
			header : fc['uuid'].fieldLabel,
			dataIndex : fc['uuid'].name,
			hidden : true
		},{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		},{
			id : 'openboxId',
			header : fc['openboxId'].fieldLabel,
			dataIndex : fc['openboxId'].name,
			hidden : true
		},{
			id : 'openboxNo',
			header : fc['openboxNo'].fieldLabel,
			dataIndex : fc['openboxNo'].name,
			hidden : true
		},{
			id : 'resultId',
			header : fc['resultId'].fieldLabel,
			dataIndex : fc['resultId'].name,
			hidden : true
		},{
			id : 'treeuids',
			header : fc['treeuids'].fieldLabel,
			dataIndex : fc['treeuids'].name,
			hidden : true
		},{
			id:'finished',
			header: fc['finished'].fieldLabel,
			dataIndex: fc['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isStorein");
				var str = "<input type='checkbox' "+(o==1?"disabled title='已入库，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishOpenboxExce(\""+r.get("uids")+"\",this)'>"
				return str;
			},
			width : 40
		},{
			id:'isStorein',
			header:fc['isStorein'].fieldLabel,
			dataIndex: fc['isStorein'].name,
			hidden: true
		},{
			id : 'equType',
			header : fc['equType'].fieldLabel,
			dataIndex : fc['equType'].name,
			renderer : function(v){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			align : 'center',
			width : 100
		},{
			id : 'jzNo',
			header : fc['jzNo'].fieldLabel,
			dataIndex : fc['jzNo'].name,
			store:jzDs,
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			},
			align : 'center',
			width : 80,
			type:"combo"
		},{
			id:'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			width : 180,
			renderer : function(v,m,r){
				var conid = r.get('conid');
			    var conname;
				for(var i=0;i<conArr.length;i++){
					if(conid == conArr[i][0]){
						conname = conArr[i][1];
						break;
					}
				}
				var qtip = "qtip=" + conname;
  				return'<span ' + qtip + '>' + conname + '</span>';
//				var output ="<a title='"+conname+"' style='color:blue;' " +
//						"href=Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true\>"+conname+"</a>"		
//				return output;           
           },
           type : 'string',
           tab_col : 'ConOve|conid|conname'
		},{
			id : 'boxNo',
			header : fc['boxNo'].fieldLabel,
			dataIndex : fc['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'equPartName',
			header : fc['equPartName'].fieldLabel,
			dataIndex : fc['equPartName'].name,
			width : 180,
			type : 'string'
		},{
			id : 'ggxh',
			header : fc['ggxh'].fieldLabel,
			dataIndex : fc['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fc['unit'].fieldLabel,
			dataIndex : fc['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'weight',
			header : fc['weight'].fieldLabel,
			dataIndex : fc['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'graphNo',
			header : fc['graphNo'].fieldLabel,
			dataIndex : fc['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'boxinNum',
			header : fc['boxinNum'].fieldLabel,
			dataIndex : fc['boxinNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'realNum',
			header : fc['realNum'].fieldLabel,
			dataIndex : fc['realNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'passNum',
			header : fc['passNum'].fieldLabel,
			dataIndex : fc['passNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'exceNum',
			header : fc['exceNum'].fieldLabel,
			dataIndex : fc['exceNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'exception',
			header : fc['exception'].fieldLabel,
			dataIndex : fc['exception'].name,
			renderer : function(v,m,r){
				return "<input type='checkbox' "+(v==1?"checked":"")+" disabled>"
			},
			align : 'center',
			width : 80
		},{
			id : 'exceType',
			header : fc['exceType'].fieldLabel,
			dataIndex : fc['exceType'].name,
			renderer : function(v,m,r){
				var  exce = "";
				for(var i=0;i<exceTypeArr.length;i++){
					if(v == exceTypeArr[i][0])
						exce = exceTypeArr[i][1];
				}
				return exce;
			},
			align : 'center',
			width : 100
		},{
			id : 'exceptionDesc',
			header : fc['exceptionDesc'].fieldLabel,
			dataIndex : fc['exceptionDesc'].name,
			width : 180
		},{	
			id : 'excePassNum',
			header : fc['excePassNum'].fieldLabel,
			dataIndex : fc['excePassNum'].name,
			editor : new fm.NumberField(fc['excePassNum']),
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'right',
			width : 100
		},{
			id : 'applyInNum',
			header : fc['applyInNum'].fieldLabel,
			dataIndex : fc['applyInNum'].name,
			editor : new fm.NumberField(fc['applyInNum']),
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'right',
			width : 100
		},{
			id : 'excePassDate',
			header : fc['excePassDate'].fieldLabel,
			dataIndex : fc['excePassDate'].name,
			editor : new fm.DateField(fc['excePassDate']),
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				return v ? v.dateFormat('Y-m-d') : '';
			},
			align : 'center',
			width : 100
		},{
			id : 'handleUser',
			header : fc['handleUser'].fieldLabel,
			dataIndex : fc['handleUser'].name,
			editor : new fm.TextField(fc['handleUser']),
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				return v == "" ? REALNAME : v;
			},
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id : 'handleProcess',
			header : fc['handleProcess'].fieldLabel,
			dataIndex : fc['handleProcess'].name,
			editor : new fm.TextField(fc['handleProcess']),
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			width : 180
		},{
			id : 'remark',
			header : fc['remark'].fieldLabel,
			dataIndex : fc['remark'].name,
			editor : new fm.TextField(fc['remark']),
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			width : 180
		}
	]);
	var Columns = [
		{name:'uuid', type:'string'},
		{name:'uids', type:'string'},
		{name:'conid', type:'string'},
		{name:'pid', type:'string'},
		{name:'openboxId', type:'string'},
		{name:'openboxNo', type:'string'},
		{name:'resultId', type:'string'},
		{name:'finished', type:'float'},
		{name:'isStorein', type:'float'},
		{name:'treeuids', type:'string'},
		{name:'equType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'unit', type:'string'},
		{name:'weight', type:'float'},
		{name:'graphNo', type:'string'},
		{name:'boxinNum', type:'float'},
		{name:'realNum', type:'float'},
		{name:'passNum', type:'float'},
		{name:'exceNum', type:'float'},
		{name:'exception', type:'float'},
		{name:'exceType', type:'string'},
		{name:'exceptionDesc', type:'string'},
		{name:'excePassNum', type:'float'},
		{name:'applyInNum', type:'float'},
		{name:'excePassDate', type:'date',dateFormat: 'Y-m-d H:i:s'},
		{name:'handleUser', type:'string'},
		{name:'handleProcess', type:'string'},
		{name:'remark', type:'string'}
	];
	var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
		uuid : '',
		uids : '',
		pid : CURRENTAPPID,
		conid : '',
		openboxId : '',
		openboxNo : '',
		resultId : '',
		finished : '',
		isStorein : '',
		treeuids : '',
		equType : '',
		jzNo : '',
		boxNo : '',
		equPartName : '',
		ggxh : '',
		unit : '',
		weight : '',
		graphNo : '',
		boxinNum : 0,
		realNum : 0,
		passNum : 0,
		exceNum : 0,
		exception : '',
		exceType : '',
		exceptionDesc : '',
		excePassNum : '',
		applyInNum : '',
		excePassDate : new Date(),
		handleUser : '',
		handleProcess : '',
		remark : ''
	}
	
	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: " exception='1' "
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
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    
    var dowithBtn = new Ext.Button({
    	id : "dowithBtn",
    	iconCls : 'btn',
    	text : '处理',
    	handler : function(){
			var record = sm.getSelected();
			if(record == null || record.length == 0){
				Ext.example.msg('提示信息','请先选择一条异常数据！');
				return;
			}
			doWithWin.show();
    	}
    });
    
    var saveBtn = new Ext.Button({
    	id : 'saveBtn',
    	iconCls : 'save',
    	text : '保存',
    	handler : saveExceFun
    })
    
	var gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		title : '设备异常处理',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>异常处理结果</b></font>','-',dowithBtn,'-',saveBtn,'-'],
		addBtn : false,
		saveBtn : false,
		delBtn : false,
		header: true,
		height : document.body.clientHeight*0.5,
	    border: false,
	    //layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
		,listeners: {
			beforeedit:function(e){
	            var currRecord = e.record;
	            if (currRecord.get("finished")=='1')   
	                e.cancel = true;   
	        }
		}
	});
	
	// TODO : 处理窗口
	
	
	var saveDoWithBtn = new Ext.Button({
		id : 'saveDoWithBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveExceFun
	});
	
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '取消',
		iconCls : 'remove',
		handler : function(){
			doWithWin.hide();
		}
	});
	
	
	
	var formPanel = new Ext.FormPanel({
		region : 'center',
		border : false,
		height : 125,
		labelAlign : 'right',
		bodyStyle : 'padding:5px 10px;',
		tbar : ['<font color=#15428b><b>异常处理过程</b></font>','->',saveDoWithBtn,'-',cancelBtn,'-'],
		items : [
			{
				layout : 'column',
				border : false,
				items : [
					{
					layout : 'form',
					columnWidth : .5,
					border : false,
					items : [
						new fm.Hidden(fc['uids']),
						new fm.Hidden(fc['pid']),
						new fm.Hidden(fc['openboxId']),
						new fm.Hidden(fc['openboxNo']),
						new fm.Hidden(fc['resultId']),
						new fm.NumberField(fc['excePassNum']),
						new fm.NumberField(fc['applyInNum'])
					]
				},{
					layout : 'form',
					columnWidth: .5,
					border : false,
					items : [
						new fm.DateField(fc['excePassDate']),
						new fm.TextField(fc['handleUser'])
						
					]
				}]
			},{
					layout : 'form',
					border : false,
					items : [
						new fm.TextArea(fc['handleProcess']),
						new fm.TextArea(fc['remark'])
					]
				}
		]
	});
	
	var doWithWin = new Ext.Window({
		width : 550,
		height : 230,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [formPanel],
		listeners : {
			"show" : function(){
				var record = sm.getSelected();
				var edit_uids = record.get("uids");
				var formRecord = Ext.data.Record.create(Columns);
			    var loadFormRecord = null;
			    if(edit_uids == null || edit_uids == ""){
					loadFormRecord = new formRecord({
						uids : '',
						pid : CURRENTAPPID,
						openboxId : record.get("openboxId"),
						openboxNo : record.get("openboxNo"),
						resultId : record.get("resultId"),
						finished : 0,
						isStorein : 0,
						excePassNum : '',
						applyInNum : '',
						excePassDate : new Date(),
						handleUser : REALNAME,
						handleProcess : '',
						remark : ''
			   		});
			    }else{
				    DWREngine.setAsync(false);
					baseMgm.findById(beanExce, edit_uids,function(obj){
						loadFormRecord = new formRecord(obj);
					});
					DWREngine.setAsync(true);
			    }
				formPanel.getForm().loadRecord(loadFormRecord);
			},
			"hide" :function(){
				ds.reload();
				formPanel.getForm().reset();
			}
		}
	});
	
	var view = new Ext.Viewport({
		layout : 'border',
		items : [treePanel,gridPanel]
	});
	gridPanel.getTopToolbar().add('-',{
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow_
	});
	function showWindow_() {
		if(selectParentid == "0"){
		     fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
		}else{
			if(selectUuid != '' && selectConid != ''){
				//查询当前选中节点的所有子节点主键。
				var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
						" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
						" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
						" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
				var treeuuidstr = "";
				DWREngine.setAsync(false);
				baseDao.getData(sql,function(list){
					for(i = 0; i < list.length; i++) {
						treeuuidstr += ",'"+list[i]+"'";		
					}
				});	
				DWREngine.setAsync(true);
				treeuuidstr = treeuuidstr.substring(1);
	            fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
			}
		}
		showWindow(gridPanel)
	};
	function checkNum(exceNum,excePassNum,applyInNum){
		if(exceNum < excePassNum){
			Ext.Msg.alert('提示信息','异常数量为 <b style="color:red;">'+exceNum+'</b>，异常处理数量不能大于 <b style="color:red;">'+exceNum+'</b>');
			return false;
		}
		if(excePassNum < applyInNum){
			Ext.Msg.alert('提示信息','异常处理数量为 <b style="color:red;">'+excePassNum+'</b>，申请入库数量不能大于 <b style="color:red;">'+excePassNum+'</b>');
			return false;
		}
		return true;
	}
	
	function saveExceFun(){
		var saveObjArr = new Array();
		var btnId = this.id;
		if(btnId == 'saveBtn'){
			//grid保存
			var records = ds.getModifiedRecords();
			if(records == null || records.length == 0)
				return;
			for (var i = 0; i < records.length; i++) {
				var exceNum = records[i].get("exceNum");
				var excePassNum = records[i].get("excePassNum");
				var applyInNum = records[i].get("applyInNum");
				if(!checkNum(exceNum,excePassNum,applyInNum)) return;
				saveObjArr.push(records[i].data)
			}
		}else{
			//from保存
			var form = formPanel.getForm();
			var exceNum = sm.getSelected().get("exceNum");
			var excePassNum = form.findField("excePassNum").getValue();
			var applyInNum = form.findField("applyInNum").getValue();
			if(!checkNum(exceNum,excePassNum,applyInNum)) return;
	    	var obj = form.getValues();
			for(var i=0; i<Columns.length; i++) {
	    		var n = Columns[i].name;
	    		var field = form.findField(n);
	    		if (field) {
	    			obj[n] = field.getValue();
	    		}
	    	}
	    	saveObjArr.push(obj);
		}
		
		if(saveObjArr.length > 0){
		    DWREngine.setAsync(false);
			equMgm.saveEquOpenboxException(saveObjArr,function(str){
				if(str == "1"){
	    			Ext.example.msg('提示信息','异常处理保存成功！');
	    			if(btnId == 'saveBtn'){
		    			ds.reload();
	    			}else{
	    				doWithWin.hide();
	    			}
	    		}else{
    				Ext.example.msg('提示信息','异常处理保存失败！');
	    		}
			});
		    DWREngine.setAsync(true);
		}
	}
	
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	ds.on("load",function(){
    	setPermission();
    });
	sm.on('rowselect',function(){
		var record = sm.getSelected();
		if(record.get('finished') == 1){
			saveBtn.setDisabled(true);
			dowithBtn.setDisabled(true);
		}else{
			if(ModuleLVL == '1' || ModuleLVL== '2'){
				saveBtn.setDisabled(false);
				dowithBtn.setDisabled(false);
			}
		}
	});
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    //按钮权限设置
	function setPermission(){
		if(ModuleLVL != '1' && ModuleLVL != '2'){
			if(dowithBtn && saveBtn){
				dowithBtn.setDisabled(true);
				saveBtn.setDisabled(true);
			}
		}
	}
});

function finishOpenboxExce(uids,finished){
	if(ModuleLVL != '1' && ModuleLVL !='2' ){
		finished.checked = !finished.checked;
		Ext.example.msg('提示信息', '此用户没有权限进行完结操作！');
		return;
	}
	DWREngine.setAsync(false);
	equMgm.equOpenboxExceFinished(uids,function(str){
		if(str == "1"){
			Ext.example.msg('提示信息','异常处理完结操作成功！');
			finished.checked = true;
			ds.reload();
		}else if(str == "2"){
			Ext.example.msg('提示信息','该异常处理已经开始入库，不能取消完结！');
			finished.checked = false;
		}else if(str == "3"){
			Ext.example.msg('提示信息','异常还没有处理，不能完结！');
			finished.checked = false;
		}else{
			Ext.example.msg('提示信息','操作出错！');
			finished.checked = false;
		}
	});
	DWREngine.setAsync(true);
}