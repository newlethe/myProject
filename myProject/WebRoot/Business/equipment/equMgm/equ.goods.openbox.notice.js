var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNotice"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "noticeDate"

var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNoticeSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"


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
var profArr = new Array();
var unitArr = new Array();
var billStateArr = new Array();

var ds;
var dsSub;
var moduleFlowType = '';

Ext.onReady(function(){
    DWREngine.setAsync(false);
    //通过配置信息判断该流程是否走审批流程
    systemMgm.getFlowType(USERUNITID,MODID,function (rtn){
        moduleFlowType=rtn;
    });
    DWREngine.setAsync(true);
	
	// TODO : ======开箱通知单主表======
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
    //流程审批状态
    appMgm.getCodeValue('流程状态',function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            billStateArr.push(temp);   
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
    var profDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: profArr
    });
	
	var addBtn = new Ext.Button({
		id : 'addBtn',
		text : '新增',
		iconCls : 'add',
		handler : addOrEditOpenboxNotice
	});
	var editBtn = new Ext.Button({
		id : 'editBtn',
		text : '修改',
		iconCls : 'btn',
		handler : addOrEditOpenboxNotice
	});
	var delBtn = new Ext.Button({
		text : '删除',
		iconCls : 'remove',
		handler : deleteOpenboxNotice
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
	/****************************打印***************************************/
	var printBtn = new Ext.Button({
				text : '打印',
				iconCls : 'print',
				handler : doPrint
			});
		function doPrint() {
			var fileid = "";
			var uids = ""
			var finished = "";
			var modetype = "SB";
			var record = sm.getSelected();
			if (record != null && record != "") {
				uids = record.get("uids");
				finished = record.get("finished");
			} else {
				Ext.example.msg('提示信息', '请先选择要打印的记录！');
				return;
			}
			// 模板参数，固定值，在 系统管理 -> office模板 中配置
			var filePrintType = "EquGoodsOpenNotVGj";
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
				docUrl += "&fileName=设备开箱通知单-设备.doc";
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
	/*******************************打印***************************************/
	
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isCheck' : {name : 'isCheck',fieldLabel : '已检验'},
		'noticeNo' : {name : 'noticeNo',fieldLabel : '通知单号'},
		'fileid' : {name : 'fileid',fieldLabel : '单据文档'},
		'noticeDate' : {name : 'noticeDate',fieldLabel : '下单日期'},
		'openDate' : {name : 'openDate',fieldLabel : '开箱时间'},
		'equArriveDate' : {name : 'equArriveDate',fieldLabel : '设备到货日期'},
		'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点'},
		'openUnit' : {name : 'openUnit',fieldLabel : '参与单位'},
		'equDesc' : {name : 'equDesc',fieldLabel : '检验主要设备描述'},
		'ownerNo' : {name : 'ownerNo',fieldLabel : '业主单号'},
		'professinal' : {name : 'professinal',fieldLabel : '所属专业'},
		'remark' : {name : 'remark',fieldLabel : '事项'},
        
        'billState' : {name : 'billState',fieldLabel : '审批状态'},
        'flowid' : {name : 'flowid',fieldLabel : '流程编号'},
        'projectName' : {name : 'projectName',fieldLabel : '工程名称'},
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
				var o = r.get("isCheck");
				var str = "<input type='checkbox' "+(o==1?"disabled title='已检验，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishNotice(\""+r.get("uids")+"\",this)'>"
				return str;
			},
            align : 'center',
			width : 40
		},{
			id:'isCheck',
			header:fc['isCheck'].fieldLabel,
			dataIndex: fc['isCheck'].name,
			hidden: true
		},{
			id:'noticeNo',
			header: fc['noticeNo'].fieldLabel,
			dataIndex: fc['noticeNo'].name,
			sortable:true,
			width : 180,
			type : 'string'
		},{
			id:'noticeDate',
			header: fc['noticeDate'].fieldLabel,
			dataIndex: fc['noticeDate'].name,
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
			id:'equArriveDate',
			header: fc['equArriveDate'].fieldLabel,
			dataIndex: fc['equArriveDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 180,
			type : 'date'
		},{
			id:'openDate',
			header: fc['openDate'].fieldLabel,
			dataIndex: fc['openDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 180,
			type : 'date'
		},{
			id:'openPlace',
			header: fc['openPlace'].fieldLabel,
			dataIndex: fc['openPlace'].name,
			width : 180,
			type : 'string'
		},{
			id:'openUnit',
			header: fc['openUnit'].fieldLabel,
			dataIndex: fc['openUnit'].name,
			renderer : function(v){
				//var unit = "";
				//for(var i=0;i<unitArr.length;i++){
				//	if(v == unitArr[i][0])
				//		unit = unitArr[i][1];
				//}
				//return unit;
                return "<div title='"+v+"'>"+v+"</div>"
			},
			width : 280,
			type : 'string'
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
			id:'equDesc',
			header: fc['equDesc'].fieldLabel,
			dataIndex: fc['equDesc'].name,
			width : 180
		},{
			id:'ownerNo',
			header: fc['ownerNo'].fieldLabel,
			dataIndex: fc['ownerNo'].name,
			width : 160
		},{
			id:'professinal',
			header: fc['professinal'].fieldLabel,
			dataIndex: fc['professinal'].name,
			store:profDs,
			renderer : function(v){
				var prof = "";
				for(var i=0;i<profArr.length;i++){
					if(v == profArr[i][0])
						prof = profArr[i][1];
				}
				return prof;
			},
			width : 80,
			type : 'combo'
        },{
            id:'projectName',
            header: fc['projectName'].fieldLabel,
            dataIndex: fc['projectName'].name,
            width : 160,
            type : 'string'
		},{
			id:'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width : 180
		}
	]);
	
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
        {name : 'projectName', type : 'string'},
        {name : 'fileid', type : 'string'}
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
		title : '开箱检验通知单',
		tbar : ['<font color=#15428b><B>开箱检验通知单<B></font>','-',addBtn,'-',editBtn,'-',delBtn],
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
    
	var gridPanelSub = new Ext.grid.GridPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '开箱检验通知单详细信息',
		//tbar : [],
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
	gridPanel.getTopToolbar().add('-',{
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow_
	},'-',printBtn,'-',standingBookExcelBtn);
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
    ds.baseParams.params = " pid = '"+CURRENTAPPID +"' "
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
		dsSub.baseParams.params = "noticeId = '"+record.get('uids')+"'";
		dsSub.load({params:{start:0,limit:PAGE_SIZE}});
	});
	
	function addOrEditOpenboxNotice(){
		var btnId = this.id;
		var record = sm.getSelected();
		var url = BASE_PATH+"Business/equipment/equMgm/equ.goods.openbox.notice.addorupdate.jsp"
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
				Ext.example.msg('提示信息','技术资料分类下不能添加开箱通知单！');
		    	return ;
			}
			url += "?conid="+selectConid+"&treeuids="+selectUuid+"&treeid="+selectTreeid;
		}else if(btnId == "editBtn"){
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条通知单！');
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
	
	function deleteOpenboxNotice(){
		var record = sm.getSelected();
		if(record == null){
			Ext.example.msg('提示信息','请先选择一条开箱通知单！');
	    	return ;
		}
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes") {
				var uids = record.get("uids");
				equMgm.deleteOpenboxNotice(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','开箱通知单删除成功！');
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
    
    	//增删改按钮权限设置
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

function finishNotice(uids,finished){
	if(ModuleLVL != '1' && ModuleLVL !='2' ){
		finished.checked = !finished.checked;
		Ext.example.msg('提示信息', '此用户没有权限进行完结操作！');
		return;
	}
    if(isFlwView == true){
        finished.checked = !finished.checked;
        return;
    }
	DWREngine.setAsync(false);
	equMgm.equNoticeFinished(uids,function(str){
		if(str == "1"){
			Ext.example.msg('提示信息','开箱检验通知单完结操作成功！');
			//finished.checked = true;
			ds.reload();
            if(finished.checked)
                finishTaskEdit();
		}else if(str == "2"){
			Ext.example.msg('提示信息','该开箱检验通知单已经开始检验，不能取消完结！');
			finished.checked = false;
		}else{
			Ext.example.msg('提示信息','操作出错！');
			finished.checked = false;
		}
	});
	DWREngine.setAsync(true);
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
					title : "设备开箱通知单附件",
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
				+ "/servlet/EquServlet?ac=exportData&businessType=equOpenboxNoticeTz&pid="+CURRENTAPPID+"&uidS="+exportWhere;
	document.all.formAc.action = openUrl;       
	document.all.formAc.submit();
}