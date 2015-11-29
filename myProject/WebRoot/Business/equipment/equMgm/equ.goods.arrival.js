var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsArrival";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "dhDate";

var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsArrivalSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";
var selectWin;

var csnoArr = new Array();
var sendArr = new Array();
var packArr = new Array();
var dumpArr = new Array();
var boxArr = new Array();
var jzArr = new Array();
var storageArr = new Array();
var billStateArr = new Array();

var ds;
var dsSub;
var moduleFlowType = '';

Ext.onReady(function(){
	var gridPanelName = CURRENTAPPID == "1031902"? "设备/材料到货单":"设备到货单";
	DWREngine.setAsync(false);
    //通过配置信息判断该流程是否走审批流程
    systemMgm.getFlowType(USERUNITID,MODID,function (rtn){
        moduleFlowType=rtn;
    });
    DWREngine.setAsync(true);
        
    
	// TODO : ======到货主表======
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
    var storageDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],   
		data: storageArr
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
	
	var addBtn = new Ext.Button({
		id : 'addBtn',
		text : '新增',
		iconCls : 'add',
		handler : addOrEditArrival
	});
	var editBtn = new Ext.Button({
		id : 'editBtn',
		text : '修改',
		iconCls : 'btn',
		handler : addOrEditArrival
	});
	var delBtn = new Ext.Button({
		text : '删除',
		iconCls : 'remove',
		handler : deleteArrival
	});
	var excelBtn = new Ext.Button({
		id : 'export',
		text : '导出数据',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			exportDataFile();
		}
	});
	//台账导出按钮
	var standingBookExcelBtn = new Ext.Button({
		id : 'standingBookExport',
		text : '台账导出',
		tooltip : '台账导出',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			standingBookExportFun();
		}
	})
	/***********************打印start*****************************/
	var printBtn = new Ext.Button({
				text : '打印',
				iconCls : 'print',
				handler : doPrint
			});
	function doPrint() {
		var fileid = "";
		var uids = ""
		var modetype = "SB";
		var finished = "";
		var record = sm.getSelected();
		if (record != null && record != "") {
			uids = record.get("uids");
			finished = record.get("finished");
		} else {
			Ext.example.msg('提示信息', '请先选择要打印的记录！');
			return;
		}
		// 模板参数，固定值，在 系统管理 -> office模板 中配置
		var filePrintType = "EquGoodsArrivalVGj";
		var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"
				+ filePrintType + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(str) {
					fileid = str;
				});
		DWREngine.setAsync(true);
		if (fileid == null || fileid == "") {
			Ext.MessageBox.alert("文档打印错误", "文档打印模板不存在，请先在系统管理中添加！");
			return;
		} else {
			var docUrl = BASE_PATH
					+ "Business/equipment/equMgm/equ.file.print.jsp?fileid="
					+ fileid;
			docUrl += "&filetype=" + filePrintType
			docUrl += "&uids=" + uids
			docUrl += "&modetype=" + modetype
			docUrl += "&finished="+finished
			docUrl += "&beanname="+bean
			docUrl += "&fileName=设备到货单-设备.doc";
			docUrl = encodeURI(docUrl);
			// window.open(docUrl)
			var rtn = window.showModalDialog(
							docUrl,
							"",
							"dialogWidth:"
									+ screen.availWidth
									+ "px;dialogHeight:"
									+ screen.availHeight
									+ "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
			if (rtn !=null){
				ds.reload();
			}
		}
	}	
	/****************************打印end****************************************/		
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isOpen' : {name : 'isOpen',fieldLabel : '是否开箱'},
		'dhNo' : {name : 'dhNo',	fieldLabel : '到货批号'},
		'dhDate' : {name : 'dhDate',fieldLabel : '实际到货日期'},
		'demDhDate' : {name : 'demDhDate',fieldLabel : '要求到货日期'},
		'plaDhDate' : {name : 'plaDhDate',fieldLabel : '计划到货日期'},
		'sendNum' : {name : 'sendNum',fieldLabel : '运输单号'},
		'dhDesc' : {name : 'dhDesc',fieldLabel : '到货描述'},
		'csno' : {name : 'csno',fieldLabel : '供货厂家'},
		'receiveUser' : {name : 'receiveUser',fieldLabel : '接货人'},
		'boxNum' : {name : 'boxNum',fieldLabel : '箱件数量'},
		'totalWeight' : {name : 'totalWeight',fieldLabel : '总重量（kg）',decimalPrecision : 3},
		'sendType' : {name : 'sendType',fieldLabel : '运输方式'},
		'carNo' : {name : 'carNo',fieldLabel : '车牌号'},
		'dumpType' : {name : 'dumpType',fieldLabel : '卸车方式'},
		'dumpUnit' : {name : 'dumpUnit',fieldLabel : '卸车单位'},
		'recordUser' : {name : 'recordUser',fieldLabel : '录单人'},
		'fileid' : {name : 'fileid',fieldLabel : '单据文档'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
        
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号'},
        'joinUnit' : {name : 'joinUnit',fieldLabel : '参与交接单位'},
        'joinPlace' : {name : 'joinPlace',fieldLabel : '交接地点'},
        'equAdjust' : {name : 'equAdjust',fieldLabel : '附件',anchor : '95%'}
	}
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		//sm,
		{
			id:'uids',
			header: fc['uids'].fieldLabel,
			dataIndex: fc['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fc['treeuids'].fieldLabel,
			dataIndex: fc['treeuids'].name,
			hidden: true
		},{
            id:'billState',
            header: fc['billState'].fieldLabel,
            dataIndex: fc['billState'].name,
            renderer : function(v){
                var bill = "";
                for(var i=0;i<billStateArr.length;i++){
                    if(v == billStateArr[i][0])
                        bill = billStateArr[i][1];
                }
                return bill;
            },
            align : 'center',
            hidden : moduleFlowType=="None" ? true : false,
            width : 70
        },{
            id:'flowid',
            header: fc['flowid'].fieldLabel,
            dataIndex: fc['flowid'].name,
            hidden : moduleFlowType=="None" ? true : false,
            width : 180
        },{
			id:'finished',
			header: fc['finished'].fieldLabel,
			dataIndex: fc['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isOpen");
				var str = "<input type='checkbox' "+(o==1?"disabled title='已开箱，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishArrival(\""+r.get("uids")+"\",this)'>"
				return str;
			},
            align : 'center',
			width : 40
		},{
			id:'isOpen',
			header:fc['isOpen'].fieldLabel,
			dataIndex: fc['isOpen'].name,
			hidden: true
		},{
			id:'dhNo',
			header: fc['dhNo'].fieldLabel,
			dataIndex: fc['dhNo'].name,
			sortable:true,
			width : 180,
			type : 'string'
		},{
			id:'dhDate',
			header: fc['dhDate'].fieldLabel,
			dataIndex: fc['dhDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'demDhDate',
			header: fc['demDhDate'].fieldLabel,
			dataIndex: fc['demDhDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'plaDhDate',
			header: fc['plaDhDate'].fieldLabel,
			dataIndex: fc['plaDhDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
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
			id:'dhDesc',
			header: fc['dhDesc'].fieldLabel,
			dataIndex: fc['dhDesc'].name,
			width : 220,
			type : 'string'
		},{
			id:'csno',
			header: fc['csno'].fieldLabel,
			dataIndex: fc['csno'].name,
			store:csnoDs,
			renderer : function(v){
				var csmc = "";
				for(var i=0;i<csnoArr.length;i++){
					if(v == csnoArr[i][0])
						csmc = csnoArr[i][1];
				}
				return csmc;
			},
			width : 220,
			type : 'combo'
		},{
			id:'receiveUser',
			header: fc['receiveUser'].fieldLabel,
			dataIndex: fc['receiveUser'].name,
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id:'boxNum',
			header: fc['boxNum'].fieldLabel,
			dataIndex: fc['boxNum'].name,
			align : 'right',
			width : 80
		},{
			id:'totalWeight',
			header: fc['totalWeight'].fieldLabel,
			dataIndex: fc['totalWeight'].name,
			align : 'right',
			width : 100
		},{
			id:'sendType',
			header: fc['sendType'].fieldLabel,
			dataIndex: fc['sendType'].name,
			renderer : function(v){
				var send = "";
				for(var i=0;i<sendArr.length;i++){
					if(v == sendArr[i][0])
						send = sendArr[i][1];
				}
				return send;
			},
			align : 'center',
			width : 80
		},{
			id: 'sendNum',
			header: fc['sendNum'].fieldLabel, 
			dataIndex: fc['sendNum'].name,
			width : 80
		},
		{
			id:'carNo',
			header: fc['carNo'].fieldLabel,
			dataIndex: fc['carNo'].name,
			width : 100
		},{
			id:'dumpType',
			header: fc['dumpType'].fieldLabel,
			dataIndex: fc['dumpType'].name,
			renderer : function(v){
				var send = "";
				for(var i=0;i<dumpArr.length;i++){
					if(v == dumpArr[i][0])
						send = dumpArr[i][1];
				}
				return send;
			},
			width : 100
		},{
			id:'dumpUnit',
			header: fc['dumpUnit'].fieldLabel,
			dataIndex: fc['dumpUnit'].name,
			width : 160
		},{
        id:'fileid',
        header:fc['fileid'].fieldLabel,
        dataIndex:fc['fileid'].name,
        renderer : function(v,m,r){
            if(v){
                return "<center><a href='" + BASE_PATH
                        + "servlet/MainServlet?ac=downloadfile&fileid="
                        + v +"'><img src='" + BASE_PATH
                        + "jsp/res/images/word.gif'></img></a></center>"
            }else{
                return "<img src='"+BASE_PATH+"jsp/res/images/word_bw.gif'></img>";
            }
        },
        align : 'center',
        width : 90
    },{
			id : 'equAdjust',
			type : 'XXXX',
			header : fc['equAdjust'].fieldLabel,
			dataIndex : fc['equAdjust'].name,
			align : 'center',
			width : 60,
           	//hidden : (DEPLOY_UNITTYPE == "0")
			renderer :renderEquAdjust
		},{
			id:'recordUser',
			header: fc['recordUser'].fieldLabel,
			dataIndex: fc['recordUser'].name,
			align : 'center',
			width : 120,
			type : 'string'
        },{
            id:'joinUnit',
            header: fc['joinUnit'].fieldLabel,
            dataIndex: fc['joinUnit'].name,
            width : 160,
            type : 'string'
        },{
            id:'joinPlace',
            header: fc['joinPlace'].fieldLabel,
            dataIndex: fc['joinPlace'].name,
            width : 160
		},{
			id:'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width : 160
		}
	]);
	
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
        {name : 'joinPlace', type : 'string'},
        {name : 'fileid', type : 'string'},
        {name : 'equAdjust', type : 'string'}
	];

	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	//params: "conid='"+edit_conid+"'"
	    	params: ""
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
    ds.setDefaultSort(orderColumn, 'desc');
	
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		tbar : ['<font color=#15428b><B>'+gridPanelName+'<B></font>','-',addBtn,'-',editBtn,'-',delBtn],
		header: false,
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
        })
	});
	//附件
	function renderEquAdjust(value, metadata, record) {
		var getUids = record.get('uids');
		var getDhno= record.get('dhNo');
		var finished = record.get("finished");
		var count=0;
		DWREngine.setAsync(false);
		db2Json.selectData("select count(transaction_id) transactionid  from sgcc_attach_list t where t.transaction_id='"+getUids+"'", function (jsonData) {
			var list = eval(jsonData);
			if(list!=null){
				count=list[0].transactionid;
			}
		});
		DWREngine.setAsync(true);
		if(count!=0){
			return "<a href='javascript:void(0)'  style='color:blue;' onclick='equAdjustWin(\"" + getUids + "\",\"" + getDhno + "\",\"" + finished + "\")'>附件["+count+"]</a>";
		}else{
			return "<a href='javascript:void(0)' style='color:gray;'onclick='equAdjustWin(\"" + getUids + "\",\"" + getDhno + "\",\"" + finished + "\")'>附件["+count+"]</a>";
		}
	}
	
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
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'boxName' : {name : 'boxName',fieldLabel : '箱件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'mustNum' : {name : 'mustNum',fieldLabel : '应到数'},
		'realNum' : {name : 'realNum',fieldLabel : '实到数'},
		'weight' : {name : 'weight',fieldLabel : '重量（kg）'},
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
	var smSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cmSub = new Ext.grid.ColumnModel([
		//smSub,
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
			type:'combo',
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
			width : 80
		},{
			id : 'boxNo',
			header : fcSub['boxNo'].fieldLabel,
			type:'string',
			dataIndex : fcSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'boxName',
			header : fcSub['boxName'].fieldLabel,
			type:'string',
			dataIndex : fcSub['boxName'].name,
			width : 180
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			type:'string',
			dataIndex : fcSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			type:'string',
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
			id : 'mustNum',
			header : fcSub['mustNum'].fieldLabel,
			dataIndex : fcSub['mustNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'realNum',
			header : fcSub['realNum'].fieldLabel,
			dataIndex : fcSub['realNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'packType',
			header : fcSub['packType'].fieldLabel,
			dataIndex : fcSub['packType'].name,
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
			type:'combo',
			store:storageDs,
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
			renderer : function(v,m,r){
				return "<input type='checkbox'  "+(v==1?"checked":"")+" disabled >"
			},
			align : 'center',
			width : 80
		},{
			id : 'exceptionDesc',
			header : fcSub['exceptionDesc'].fieldLabel,
			dataIndex : fcSub['exceptionDesc'].name,
			width : 180
		},{
			id : 'remark',
			header : fcSub['remark'].fieldLabel,
			dataIndex : fcSub['remark'].name,
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
	
	dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "1=2"
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
    
	var gridPanelSub = new Ext.grid.QueryExcelGridPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '到货单',
		tbar : [],
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    //layout: 'fit',
	    region: 'south',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanel,gridPanelSub]
	});
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [treePanel, contentPanel]
	});
	Ext.getCmp('showQuery').setIconClass("option");
	Ext.getCmp('showQuery').setText("查询");
	gridPanel.getTopToolbar().add('-',{
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow_
	},'-',excelBtn,'-',printBtn,'-',standingBookExcelBtn);
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
    if(isFlwTask == true || isFlwView == true)
        ds.baseParams.params = " flowid = '"+flowid+"' "
    ds.baseParams.params = " pid='"+CURRENTAPPID+"'"
    ds.load({params:{start:0,limit:PAGE_SIZE}});
    ds.on("load",function(){
    	setPermission();
        if(isFlwTask == true && ds.getCount() > 0 && ds.getCount() == 1){
            addBtn.setDisabled(true);
        //}else if(isFlwTask != true){
        //    addBtn.setDisabled(false);
        }
        if(isFlwView == true){
            addBtn.setDisabled(true);
            editBtn.setDisabled(true);
            delBtn.setDisabled(true);
        }
    });
    
	sm.on('rowselect',function(){
		smSub.clearSelections()
		var record = sm.getSelected();
        var billStateBool = record.get('billState')=='0' ? false : true;
       
        if(record.get('finished') == 1 || (!isFlwTask && billStateBool && moduleFlowType!="None")){
			editBtn.setDisabled(true);
			delBtn.setDisabled(true);
		}else{
			 if(ModuleLVL == '1' || ModuleLVL== '2'){
				editBtn.setDisabled(false);
				delBtn.setDisabled(false);
			}
            if(isFlwView == true){
                addBtn.setDisabled(true);
                editBtn.setDisabled(true);
                delBtn.setDisabled(true);
            }
		}
		dsSub.baseParams.params = "arrivalId = '"+record.get('uids')+"'";
		dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	});
	smSub.on('rowselect',function(){
		sm.clearSelections();
		var record = smSub.getSelected();
       	var arrivalId = record.get("arrivalId");
		ds.baseParams.params = " pid='"+CURRENTAPPID+"' and uids ='"+arrivalId+"'";
		ds.load({params:{start:0,limit:PAGE_SIZE}});
	});
	function addOrEditArrival(){
		var btnId = this.id;
		var record = sm.getSelected();
		var url = BASE_PATH+"Business/equipment/equMgm/equ.goods.arrival.addorupdate.jsp"
		if(btnId == "addBtn"){
			if(selectUuid == "" && selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
		    	return ;			    
			}
			if(selectUuid != "" && selectConid == ""){
				Ext.example.msg('提示信息','请先选择该专业下的合同分类！');
		    	return ;
			}
			if(selectTreeid.indexOf("04") == 0){
				Ext.example.msg('提示信息','技术资料分类下不能添加到货单！');
		    	return ;
			}
			url += "?conid="+selectConid+"&treeuids="+selectUuid+"&treeid="+selectTreeid;
		}else if(btnId == "editBtn"){
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条到货信息！');
		    	return ;
			}		
			url += "?conid="+record.get("conid")+"&treeuids="+record.get("treeuids")+"&uids="+record.get("uids");
		}
        if(isFlwTask == true){
            url += "&isTask=true";
            if(flowid!="")
                url += "&flowid="+flowid;
        }
        
        url += "&moduleFlowType="+moduleFlowType;
        
		selectWin = new Ext.Window({
			width: 950,
			height: 500,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			html:"<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(){
					ds.reload();
				},
				'show' : function(){
					equArrival.location.href  = url;
				}
			}
	    });
		selectWin.show();
	}
	
	function deleteArrival(){
		var record = sm.getSelected();
		if(record == null){
			Ext.example.msg('提示信息','请先选择一条到货信息！');
	    	return ;
		}
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes") {
				var uids = record.get("uids");
				equMgm.deleteArrival(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','到货单删除成功！');
						ds.reload();
                        if(isFlwTask == true) addBtn.setDisabled(false);
						dsSub.reload();
					}else{
						Ext.example.msg('提示信息','操作出错！');
					}
				});
			}
		});
	}
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    //导出数据
    function exportDataFile() {
    	//yanglh 2013-10-31  对点击合同分类树导出做过来 
    	var uidsS = '';
    	var sqlS = ''
    	var openUrl = "";
    	//选择到货单后导出该记录的明细
    	var record = sm.getSelected();
    	if(record != null){
               uidsS  = " and  uids in ('"+record.get("uids")+"')";
			   openUrl = CONTEXT_PATH    
				          + "/servlet/EquServlet?ac=exportData&businessType=equArrivalSubList&pid="+CURRENTAPPID+"&uidS="+uidsS;
			   document.all.formAc.action = openUrl;       
	           document.all.formAc.submit();
	           return;
		}
    	//点击合同分类树是导出该节点及节点下的到货单记录明细
    	if((selectParentid == null  || selectParentid == '') && (selectTreeid == null || selectTreeid == '')){
    	    openUrl = CONTEXT_PATH    
				+ "/servlet/EquServlet?ac=exportData&businessType=equArrivalSubList&pid="+CURRENTAPPID;	
    	}else{
		     if(selectParentid == '0'){
		     	 sqlS =  "select uids from equ_goods_arrival where conid in (select conid from Equ_Con_Ove_Tree_View  where parentid = '"+selectTreeid+"')";
		     }else{
		     	if(selectTreeid.indexOf("04")== 0){
		     	    return;
		     	}else{
		     		sqlS  = "select uids from equ_goods_arrival where treeuids in (select a.uids from ( select t.* from equ_con_ove_tree_view t " +
						" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
						" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
						" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid) and conid='"+selectConid+"'";
		     	}
		     }
	     	DWREngine.setAsync(false);
			baseDao.getData(sqlS,function(list){
				if(list.length>0){
					 for(i = 0; i < list.length; i++) {
					    uidsS += ",'"+list[i]+"'";		
				     }
				}
			});	
			DWREngine.setAsync(true);
			uidsS = uidsS.substring(1);
			if(uidsS !=''){
			    uidsS  = " and  uids in ("+sqlS+")";
			    openUrl = CONTEXT_PATH    
				    + "/servlet/EquServlet?ac=exportData&businessType=equArrivalSubList&pid="+CURRENTAPPID+"&uidS="+uidsS;
			}else{
			    Ext.example.msg("信息提示","该分类下没有数据,无法导出！");
			    return;
			}
    	}
		document.all.formAc.action = openUrl;       
		document.all.formAc.submit();
	}
	//按钮权限设置
	function setPermission(){
		if(ModuleLVL != '1' && ModuleLVL != '2'){
			if(addBtn && editBtn && delBtn){
				addBtn.setDisabled(true);
				editBtn.setDisabled(true);
				delBtn.setDisabled(true);
			}
		}
	}
});

function finishArrival(uids,finished){
	if(ModuleLVL != '1' && ModuleLVL !='2' ){
		finished.checked = !finished.checked;
		Ext.example.msg('提示信息', '此用户没有权限进行完结操作！');
		return;
	}
    if(isFlwView == true){
        finished.checked = !finished.checked;
        return;
    }
	//后台处理，需要判断到货是否已经开箱验收
    if(finished.checked == true){
        Ext.MessageBox.confirm('提示', '请确保数据无误和打印后再进行完结，确认要完结？', function(btn, text) {
    		if (btn == 'yes') {
    			DWREngine.setAsync(false);
    			equMgm.equArrivalFinished(uids,function(str){
    				if(str == "1"){
    					Ext.example.msg('提示信息','到货单完结操作成功！');
    					//finished.checked = true;
    					ds.reload();
    		            if(finished.checked)
    		                finishTaskEdit();
    				}else if(str == "2"){
    					Ext.example.msg('提示信息','该到货单已经开箱，不能取消完结！');
    					finished.checked = false;
    				}else{
    					Ext.example.msg('提示信息','操作出错！');
    					finished.checked = false;
    				}
    			});
    			DWREngine.setAsync(true);
    		} else {
    			finished.checked = false;
    			return;
    		}
    	})
    }else{
    	DWREngine.setAsync(false);
		equMgm.equArrivalFinished(uids,function(str){
			if(str == "1"){
				Ext.example.msg('提示信息','到货单完结操作成功！');
				//finished.checked = true;
				ds.reload();
	            if(finished.checked)
	                finishTaskEdit();
			}else if(str == "2"){
				Ext.example.msg('提示信息','该到货单已经开箱，不能取消完结！');
				finished.checked = false;
			}else{
				Ext.example.msg('提示信息','操作出错！');
				finished.checked = false;
			}
		});
		DWREngine.setAsync(true);
    }
}

function viewTemplate(fileid){
	window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid)
}

function finishTaskEdit(){
    if(isFlwTask == true){
        Ext.MessageBox.confirm(
            '操作完成！','点击“是”可以发送到流程下一步操作！<br><br>点击“否”继续在本页编辑内容！',
            function(value){
                if ('yes' == value){
                    parent.IS_FINISHED_TASK = true;
                    parent.mainTabPanel.setActiveTab('common');
                }
            }
        );
    }
}
//查看设备附件函数
	function equAdjustWin(uids,dhno,finished){
		var editable = true;
		//var ModuleLVL = "1";	//模块的权限级别(1完全控制 > 2写、运行 > 3读 > 4禁止访问)
		if(finished == '1' && ModuleLVL < '3'){
			editable = false;
		}
		if(finished == '1' || ModuleLVL >= '3'){
			editable = false;
		}
		var fileUploadUrl = CONTEXT_PATH
				+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable="+editable+"&businessId="
				+ uids;
		var ext
		try {
			ext = parent.Ext
		} catch (e) {
			ext = Ext
		}
		templateWin = new ext.Window({
					title : "设备到货单附件",
					width : 600,
					height : 400,
					minWidth : 300,
					minHeight : 200,
					layout : 'fit',
					plain : true,
					closeAction : 'hide',
					modal : true,
					html : "<iframe name='frmAttachPanel' src='" + fileUploadUrl
							+ "' frameborder=0 width=100% height=100%></iframe>"
				});
		templateWin.show();
	}
function standingBookExportFun(){
	var exportWhere="";
	if((selectParentid == null  || selectParentid == '') && (selectTreeid == null || selectTreeid == '')){
		exportWhere="";
	}else{
		if(selectParentid == "0"){
	         exportWhere= " and conid in (select conid from Equ_Con_Ove_Tree_View  where parentid = '"+selectTreeid+"' )";
		}else{
			exportWhere = " and conid='"+selectConid+"'";
		}
	}
	var openUrl = CONTEXT_PATH    
				+ "/servlet/EquServlet?ac=exportData&businessType=equArriveTz&pid="+CURRENTAPPID+"&uidS="+exportWhere;
	document.all.formAc.action = openUrl;       
	document.all.formAc.submit();
}
