var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenbox"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "openDate"

var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var beanPart = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSubPart"
var businessPart = "baseMgm"
var listMethodPart = "findWhereOrderby"
var primaryKeyPart = "uids"
var orderColumnPart = "uids"

var beanResult = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxResult"
var businessResult = "baseMgm"
var listMethodResult = "findWhereOrderby"
var primaryKeyResult = "uids"
var orderColumnResult = "uids"

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"

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
var equTypeArr = new Array();
var treeArr = new Array();
var exceTypeArr = new Array();
var storageArr = new Array();

//复制粘贴使用
var partDataArr = new Array();

var ds;
var dsSub;
var partWin;

var conno;
var conname;
var moduleFlowType = '';

Ext.onReady(function(){
    
    DWREngine.setAsync(false);
    //通过配置信息判断该流程是否走审批流程
    systemMgm.getFlowType(USERUNITID,MODID,function (rtn){
        moduleFlowType=rtn;
    });
    DWREngine.setAsync(true);
    
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
	
	//设备仓库storageArr
	var sql = "select t.uids,t.detailed from equ_warehouse t";
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
	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : storageArr
	});
	// TODO : ======开箱主表======
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isStorein' : {name : 'isStorein',fieldLabel : '是否入库'},
		'openNo' : {name : 'openNo',fieldLabel : '开箱单号'},
		'openDate' : {name : 'openDate',fieldLabel : '开箱日期'},
		'noticeId' : {name : 'noticeId',fieldLabel : '通知单主键'},
		'noticeNo' : {name : 'noticeNo',fieldLabel : '通知单号'},
		'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点'},
		'openUser' : {name : 'openUser',fieldLabel : '开箱参加人员'},
		'ownerNo' : {name : 'ownerNo',fieldLabel : '业主单号'},
		'openDesc' : {name : 'openDesc',fieldLabel : '验收描述'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
		'fileid' : {name : 'fileid',fieldLabel : '单据文档'},

        'factoryNo' : {name : 'factoryNo',fieldLabel : '出厂编号'},
        'packingNo' : {name : 'packingNo',fieldLabel : '装箱单号'},
        'factory' : {name : 'factory',fieldLabel : '制造厂家'},
        'sysName' : {name : 'sysName',fieldLabel : '系统名称'},
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
			id:'finished',
			header: fc['finished'].fieldLabel,
			dataIndex: fc['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isStorein");
				var str = "<input type='checkbox' "+(o==1?"disabled title='已入库，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishOpenbox(\""+r.get("uids")+"\",this)'>"
				return str;
			},
			width : 40
		},{
			id:'isStorein',
			header:fc['isStorein'].fieldLabel,
			dataIndex: fc['isStorein'].name,
			hidden: true
		},{
			id:'openNo',
			header: fc['openNo'].fieldLabel,
			dataIndex: fc['openNo'].name,
			width : 180,
			type : 'string'
		},{
			id:'openDate',
			header: fc['openDate'].fieldLabel,
			dataIndex: fc['openDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'noticeId',
			header: fc['noticeId'].fieldLabel,
			dataIndex: fc['noticeId'].name,
			hidden: true
		},{
			id:'noticeNo',
			header: fc['noticeNo'].fieldLabel,
			dataIndex: fc['noticeNo'].name,
			width : 180,
			type : 'string'
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
			id:'openPlace',
			header: fc['openPlace'].fieldLabel,
			dataIndex: fc['openPlace'].name,
			width : 180,
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
			id:'openUser',
			header: fc['openUser'].fieldLabel,
			dataIndex: fc['openUser'].name,
//			renderer : function(v){
//				var unit = "";
//				for(var i=0;i<unitArr.length;i++){
//					if(v == unitArr[i][0])
//						unit = unitArr[i][1];
//				}
//				return unit;
//			},
			width : 180,
			type : 'string'
		},{
			id:'openDesc',
			header: fc['openDesc'].fieldLabel,
			dataIndex: fc['openDesc'].name,
			width : 180
		},{
			id:'ownerNo',
			header: fc['ownerNo'].fieldLabel,
			dataIndex: fc['ownerNo'].name,
			width : 160
		},{
            id:'factoryNo',
            header: fc['factoryNo'].fieldLabel,
            dataIndex: fc['factoryNo'].name,
            width : 160
        },{
            id:'packingNo',
            header: fc['packingNo'].fieldLabel,
            dataIndex: fc['packingNo'].name,
            width : 160    
        },{
            id:'factory',
            header: fc['factory'].fieldLabel,
            dataIndex: fc['factory'].name,
            width : 160
        },{
            id:'sysName',
            header: fc['sysName'].fieldLabel,
            dataIndex: fc['sysName'].name,
            width : 160
        },{
			id:'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width : 180
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isStorein', type : 'float'},
		{name : 'openNo', type : 'string'},
		{name : 'openDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'noticeId', type : 'string'},
		{name : 'noticeNo', type : 'string'},
		{name : 'openPlace', type : 'string'},
		{name : 'openUser', type : 'string'},
		{name : 'openDesc', type : 'string'},
		{name : 'ownerNo', type : 'string'},
		{name : 'remark', type : 'string'},
        
        {name : 'factoryNo', type : 'string'},
        {name : 'packingNo', type : 'string'},
        {name : 'factory', type : 'string'},
        {name : 'sysName', type : 'string'},
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
	
    var addBtn = new Ext.Button({
		id : 'addBtn',
		text : '新增',
		iconCls : 'add',
		handler : addOrEditOpenbox
	});
	var editBtn = new Ext.Button({
		id : 'editBtn',
		text : '修改',
		iconCls : 'btn',
		handler : addOrEditOpenbox
	});
	var delBtn = new Ext.Button({
		text : '删除',
		iconCls : 'remove',
		handler : deleteOpenbox
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
	})
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		title : '开箱检验单',
		tbar : ['<font color=#15428b><B>开箱检验单<B></font>','-',addBtn,'-',editBtn,'-',delBtn],
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
	
	
	newtreePanel.on('click', function(node,e){
		var elNode = node.getUI().elNode;
		var treename = node.attributes.treename;
		var treeuids = elNode.all("uuid").innerText;
		var treeid = elNode.all("treeid").innerText;
			treeuidsComboTree.setValue(treeuids)
			treeuidsComboTree.collapse();
	});
	newtreePanelPart.on('click', function(node,e){
		var elNode = node.getUI().elNode;
		var treename = node.attributes.treename;
		var treeuids = elNode.all("uuid").innerText;
		var treeid = elNode.all("treeid").innerText;
			partComboTree.setValue(treeuids)
			partComboTree.collapse();
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
	// TODO : ======开箱检验单明细======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'openboxId' : {name : 'openboxId',fieldLabel : '到货单主键'},
		'openboxNo' : {name : 'openboxNo',fieldLabel : '到货单批次号'},

		'havePart' : {name : 'havePart',fieldLabel : '有部件'},
		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '设备合同分类树',
			mode : 'local',
			editable:false,
			valueField: 'k',
			displayField: 'v',
			readOnly:true,
            listWidth: 180,
            lazyRender:true,
            maxHeight: 180,
            triggerAction: 'all',
            store: treeuidsDs,
			tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor : '95%'	
		},
		'equType' : {
			name : 'equType',
			fieldLabel : '设备类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: equTypeDs
		},
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
		'remark' : {name : 'remark',fieldLabel : '备注'},
        
        'bsize' : {name : 'bsize',fieldLabel : '尺寸'}
	};
	
	var treeuidsComboTree = new fm.ComboBox(fcSub['treeuids']);
		treeuidsComboTree.on('beforequery', function(){
		newtreePanel.render('tree');
		newtreePanel.getRootNode().reload();
	});
	
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
			id : 'openboxId',
			header : fcSub['openboxId'].fieldLabel,
			dataIndex : fcSub['openboxId'].name,
			hidden : true
		},{
			id : 'openboxNo',
			header : fcSub['openboxNo'].fieldLabel,
			dataIndex : fcSub['openboxNo'].name,
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
			id : 'havePart',
			header : fcSub['havePart'].fieldLabel,
			dataIndex : fcSub['havePart'].name,
			renderer : function(v,m,r){
				var p = r.get("boxType");
				//02为裸件
				return "<input type='checkbox' "+(v=="1"?"checked":"")+" "+(p=="02"?"disabled":"")+" onclick='havePartFun(this)' >"
			},
			align : 'center',
			width : 50
		},{
			id : 'treeuids',
			header : fcSub['treeuids'].fieldLabel,
			dataIndex : fcSub['treeuids'].name,
			renderer : function(v,m,r){
				if(r.get("boxType")=='02'){
					m.attr = "style=background-color:#FBF8BF";
				}
				var tree = "";
				for(var i=0;i<treeArr.length;i++){
					if(v == treeArr[i][0]){
						tree = treeArr[i][1];
					}
				}
				for(var i=0;i<equTypeArr.length;i++){
					if(tree == equTypeArr[i][0])
						tree = equTypeArr[i][1];
				}
				return tree;
			},
			editor : treeuidsComboTree,
			align : 'center',
			width : 180
		},{
			id : 'equType',
			header : fcSub['equType'].fieldLabel,
			dataIndex : fcSub['equType'].name,
			editor : new fm.ComboBox(fcSub['equType']),
			renderer : function(v,m,r){
				if(r.get("boxType")=='02'){
					m.attr = "style=background-color:#FBF8BF";
				}
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
            id : 'bsize',
            header : fcSub['bsize'].fieldLabel,
            dataIndex : fcSub['bsize'].name,
            editor : new fm.TextField(fcSub['bsize']),
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
			header : fcSub['exception'].fieldLabel,
			dataIndex : fcSub['exception'].name,
			renderer : function(v,m,r){
				return "<input type='checkbox'  "+(v=="1"?"checked":"")+" disabled >"
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
		{name:'openboxId', type:'string'},
		{name:'openboxNo', type:'string'},
		{name:'havePart', type:'string'},
		{name:'treeuids', type:'string'},
		{name:'equType', type:'string'},
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
		{name:'remark', type:'string'},
        {name:'bsize', type:'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		openboxId : '',
		openboxNo : '',
		havePart : 0,
		treeuids : '',
		equType : '',
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
		storage : '',
		exception : '',
		exceptionDesc : '',
		remark : '',
        bsize : ''
	}
	
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
    
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '部件明细录入',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>部件明细录入<B></font>','-'],
		addBtn : false,
		saveBtn : true,
		delBtn : false,
		header: false,
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
        ,listeners: {
			beforeedit:function(e){
	            var currRecord = e.record;
	            if (currRecord.get("boxType")!='02'&& (e.column=="7"||e.column=="8"))   
	                e.cancel = true;   
	        }
		}
	});
	
	// TODO : ======箱件内明细======
	var fcPart = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'openboxSubId' : {name : 'openboxSubId',fieldLabel : '到货单部件主键'},
		'openboxId' : {name : 'openboxId',fieldLabel : '到货单主键'},
		'openboxNo' : {name : 'openboxNo',fieldLabel : '到货单批次号'},

		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '设备合同分类树',
			mode : 'local',
			editable:false,
			valueField: 'k',
			displayField: 'v',
			readOnly:true,
            listWidth: 180,
            lazyRender:true,
            maxHeight: 180,
            triggerAction: 'all',
            store: treeuidsDs,
			tpl: "<tpl for='.'><div style='height:200px'><div id='treePart'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor : '95%'	
		},
		'equType' : {
			name : 'equType',
			fieldLabel : '设备类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: equTypeDs
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
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'boxinNum' : {name : 'boxinNum',fieldLabel : '装箱单数量', decimalPrecision : 4},
		'weight' : {name : 'weight',fieldLabel : '重量（kg）',decimalPrecision : 3},
		'storage' : {name : 'storage',fieldLabel : '存放库位',
		                mode : 'local',
		                allowBlank : false,
						editable:false,
						valueField: 'k',
						displayField: 'v',
						readOnly:true,
			            listWidth: 220,
			            lazyRender:true,
			            triggerAction: 'all',
			            store : getEquid,
						tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
			            listClass: 'x-combo-list-small'
	     }
	};
	
	var partComboTree = new fm.ComboBox(fcPart['treeuids']);
	partComboTree.on('beforequery', function(){
		newtreePanelPart.render('treePart');
		newtreePanelPart.getRootNode().reload();
	});
	var equnoComboBox  = new fm.ComboBox(fcPart['storage']);
	equnoComboBox.on('beforequery',function(){
				storageTreePanel.on('beforeload', function(node) {
					var parent = node.attributes.equid;

					if (parent == null || parent == "")
						parent = '01';
					var baseParams = storageTreePanel.loader.baseParams
					baseParams.orgid = '0';
					baseParams.parent = parent;
				})
				storageTreePanel.render('tree');
				storagRoot.reload();
			
		})
		storageTreePanel.on('click',function(node,e){
				var elNode = node.getUI().elNode;
				var treename = node.attributes.treename;
				var uids = elNode.all("uids").innerText;
				equnoComboBox.setValue(uids)
				equnoComboBox.collapse();
		})	
	var smPart = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var cmPart = new Ext.grid.ColumnModel([
		smPart,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcPart['uids'].fieldLabel,
			dataIndex : fcPart['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcPart['pid'].fieldLabel,
			dataIndex : fcPart['pid'].name,
			hidden : true
		},{
			id : 'openboxSubId',
			header : fcPart['openboxSubId'].fieldLabel,
			dataIndex : fcPart['openboxSubId'].name,
			hidden : true
		},{
			id : 'openboxId',
			header : fcPart['openboxId'].fieldLabel,
			dataIndex : fcPart['openboxId'].name,
			hidden : true
		},{
			id : 'openboxNo',
			header : fcPart['openboxNo'].fieldLabel,
			dataIndex : fcPart['openboxNo'].name,
			hidden : true
		},{
			id : 'treeuids',
			header : fcPart['treeuids'].fieldLabel,
			dataIndex : fcPart['treeuids'].name,
			renderer : function(v,m,r){
				var tree = "";
				for(var i=0;i<treeArr.length;i++){
					if(v == treeArr[i][0]){
						tree = treeArr[i][1];
					}
				}
				for(var i=0;i<equTypeArr.length;i++){
					if(tree == equTypeArr[i][0])
						tree = equTypeArr[i][1];
				}
				return tree;
			},
			editor : partComboTree,
			align : 'center',
			width : 180
		},{
			id : 'equType',
			header : fcPart['equType'].fieldLabel,
			dataIndex : fcPart['equType'].name,
			editor : new fm.ComboBox(fcPart['equType']),
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
			header : fcPart['jzNo'].fieldLabel,
			dataIndex : fcPart['jzNo'].name,
			editor : new fm.ComboBox(fcPart['jzNo']),
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
			header : fcPart['boxNo'].fieldLabel,
			dataIndex : fcPart['boxNo'].name,
			editor : new fm.TextField(fcPart['boxNo']),
			align : 'center',
			width : 100
		},{
			id : 'equPartName',
			header : fcPart['equPartName'].fieldLabel,
			dataIndex : fcPart['equPartName'].name,
			editor : new fm.TextField(fcPart['equPartName']),
			width : 180
		},{
			id : 'ggxh',
			header : fcPart['ggxh'].fieldLabel,
			dataIndex : fcPart['ggxh'].name,
			editor : new fm.TextField(fcPart['ggxh']),
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcPart['graphNo'].fieldLabel,
			dataIndex : fcPart['graphNo'].name,
			editor : new fm.TextField(fcPart['graohNo']),
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcPart['unit'].fieldLabel,
			dataIndex : fcPart['unit'].name,
			editor : new fm.TextField(fcPart['unit']),
			align : 'center',
			width : 60
		},{
			id : 'boxinNum',
			header : fcPart['boxinNum'].fieldLabel,
			dataIndex : fcPart['boxinNum'].name,
			editor : new fm.NumberField(fcPart['boxinNum']),
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fcPart['weight'].fieldLabel,
			dataIndex : fcPart['weight'].name,
			editor : new fm.NumberField(fcPart['weight']),
			align : 'center',
			width : 80
		},{
			id : 'storage',
			header : fcPart['storage'].fieldLabel,
			dataIndex : fcPart['storage'].name,
			editor : equnoComboBox,
			renderer : function(v){
				var storage = "";
				for(var i=0;i<storageArr.length;i++){
					if(v == storageArr[i][0]){
						storage = storageArr[i][1];
						break;
					}
				}
				return storage;
			}
		}
	]);
	var ColumnsPart = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'openboxSubId', type:'string'},
		{name:'openboxId', type:'string'},
		{name:'openboxNo', type:'string'},
		{name:'treeuids', type:'string'},
		{name:'equType', type:'string'},
		{name:'jzNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'boxinNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'storage',type:'string'}
	];
	var PlantPart = Ext.data.Record.create(ColumnsPart);
    var PlantIntPart = {
		uids : '',
		pid : CURRENTAPPID,
		openboxSubId : '',
		openboxId : '',
		openboxNo : '',
		treeuids : '',
		equType : '',
		jzNo : '',
		boxNo : '',
		equPartName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		boxinNum : 0,
		weight : '',
		storage : ''
	}
	
	var dsPart = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanPart,
	    	business: businessPart,
	    	method: listMethodPart,
	    	params: "1=2"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyPart
        }, ColumnsPart),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsPart.setDefaultSort(orderColumnPart, 'desc');	//设置默认排序列
    var partBoxName = new Ext.Button({
    	id : 'partBoxName',
    	text : ''
    });
    var copyBtn = new Ext.Button({
        text : '复制',
        iconCls : 'copy',
        handler : copyFun
    });
    var pasteBtn = new Ext.Button({
        text: '粘贴',
        iconCls: 'paste',
        disabled : true,
        handler : pasteFun
    });
    function copyFun(){
        var records = smPart.getSelections();
        if(records.length == 0){
            Ext.example.msg('提示信息','请先选择需要复制的部件明细！');
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
            copyBtn.setText("复制("+partDataArr.length+")");
	        pasteBtn.setDisabled(false);
            //Ext.example.msg('提示信息','复制成功，已经复制'+partDataArr.length+'条部件明细！');
        }
    }
    function pasteFun(){
        if(partDataArr.length == 0){
            return ;
        }
        DWREngine.setAsync(false);
        equMgm.pasteEquOpenboxPart(partDataArr,function(str){
           if(str == "1"){
                Ext.example.msg('提示信息','部件明细粘贴成功！');
                dsPart.reload();
            }else if(str == "0"){
                Ext.example.msg('提示信息','部件明细粘贴失败！');
            }
        });
        DWREngine.setAsync(true);
    }
    
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
            var filePrintType = "EquOpenboxSubPart";
            downloadExcelTemp(filePrintType);
        }
    })
    
    var gridPanelPart = new Ext.grid.EditorGridTbarPanel({
		ds : dsPart,
		cm : cmPart,
		sm : smPart,
		title : '部件明细录入',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>部件明细录入<B></font>', '-',
				'箱件名称：', partBoxName, '-', copyBtn, '-', pasteBtn, '-',
				impBtn, '-', downBtn, '-'],
		header : false,
		height : document.body.clientHeight * 0.5,
		border : false,
		// layout: 'fit',
		region : 'center',
		stripeRows : true,
		loadMask : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsPart,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : PlantPart,
		plantInt : PlantIntPart,
		servletUrl : MAIN_SERVLET,
		bean : beanPart,
		business : businessPart,
		primaryKey : primaryKeyPart
	});
	
	//填写详细部件窗口
	partWin = new Ext.Window({
		width : 900,
		height : 450,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [gridPanelPart],
		listeners : {
			"show" : function(){
					var uids = smSub.getSelected().get("uids")
					partBoxName.setText("<b>"+smSub.getSelected().get("boxName")+"</b>");
					var openboxId = sm.getSelected().get("uids");  
					var openboxNo = sm.getSelected().get("openNo");
					var storage  = smSub.getSelected().get("storage");
					PlantIntPart.openboxSubId = uids;
					PlantIntPart.openboxId = openboxId;
					PlantIntPart.openboxNo = openboxNo;
					PlantIntPart.storage = storage;
					dsPart.baseParams.params = "openboxSubId='"+uids+"'";
					dsPart.load({params:{start:0,limit:PAGE_SIZE}});
					if(sm.getSelected().get('finished') == 1){
						//gridPanelPart.getTopToolbar().setDisabled(true);
						with(gridPanelPart.getTopToolbar().items){
							get('add').setDisabled(true);
							get('save').setDisabled(true);
							get('del').setDisabled(true);
                            copyBtn.setDisabled(true);
						}
					}else{
						//gridPanelPart.getTopToolbar().setDisabled(false);
						with(gridPanelPart.getTopToolbar().items){
							get('add').setDisabled(false);
							get('save').setDisabled(false);
							get('del').setDisabled(false);
                            copyBtn.setDisabled(false);
						}
					}
			},
			"hide" :function(){
				var num = dsPart.getTotalCount();
				var have = 0;
				if(num > 0)
					have = 1;
				DWREngine.setAsync(false);
				var sql = "update Equ_Goods_Openbox_Sub set have_part='"+have+"' " +
						" where uids = '"+smSub.getSelected().get("uids")+"'";
				baseDao.updateBySQL(sql);
				DWREngine.setAsync(true);
                copyBtn.setText("复制");
                pasteBtn.setDisabled(true);
                smPart.deselectRange(0,20);
				dsSub.reload();
			}
		}
	});
	
	
	// TODO : ======开箱检验结果明细======
	var fcResult = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'openboxId' : {name : 'openboxId',fieldLabel : '到货单主键'},
		'openboxNo' : {name : 'openboxNo',fieldLabel : '到货单批次号'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'jzNo' : {name : 'jzNo',fieldLabel : '机组号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'weight' : {name : 'weight',fieldLabel : '重量（kg）',decimalPrecision : 3},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'boxinNum' : {name : 'boxinNum',fieldLabel : '装箱单数量'},
		'realNum' : {name : 'realNum',fieldLabel : '实到数量', decimalPrecision : 4},
		'passNum' : {name : 'passNum',fieldLabel : '合格数量', decimalPrecision : 4},
		'exceNum' : {name : 'exceNum',fieldLabel : '异常数量', decimalPrecision : 4},
		'exception' : {name : 'exception',fieldLabel : '异常'},
		'exceType' : {
			name : 'exceType',
			fieldLabel : '异常类型',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: exceTypeDs
			},
		'exceptionDesc' : {name : 'exceptionDesc',fieldLabel : '异常描述'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
		'storage' : {name : 'storage',fieldLabel : '存放库位'}
	};
	var smResult = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cmResult = new Ext.grid.ColumnModel([
		//smResult,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcResult['uids'].fieldLabel,
			dataIndex : fcResult['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcResult['pid'].fieldLabel,
			dataIndex : fcResult['pid'].name,
			hidden : true
		},{
			id : 'openboxId',
			header : fcResult['openboxId'].fieldLabel,
			dataIndex : fcResult['openboxId'].name,
			hidden : true
		},{
			id : 'openboxNo',
			header : fcResult['openboxNo'].fieldLabel,
			dataIndex : fcResult['openboxNo'].name,
			hidden : true
		},{
			id : 'treeuids',
			header : fcResult['treeuids'].fieldLabel,
			dataIndex : fcResult['treeuids'].name,
			renderer : function(v,m,r){
				var tree = "";
				for(var i=0;i<treeArr.length;i++){
					if(v == treeArr[i][0]){
						tree = treeArr[i][1];
					}
				}
				for(var i=0;i<equTypeArr.length;i++){
					if(tree == equTypeArr[i][0])
						tree = equTypeArr[i][1];
				}
				return tree;
			},
			//editor : treeuidsComboTree,
			align : 'center',
			width : 180
		},{
			id : 'equType',
			header : fcResult['equType'].fieldLabel,
			dataIndex : fcResult['equType'].name,
			renderer : function(v){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			//editor : new fm.ComboBox(fcResult['equType']),
			align : 'center',
			width : 100
		},{
			id : 'jzNo',
			header : fcResult['jzNo'].fieldLabel,
			dataIndex : fcResult['jzNo'].name,
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
			header : fcResult['boxNo'].fieldLabel,
			dataIndex : fcResult['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'equPartName',
			header : fcResult['equPartName'].fieldLabel,
			dataIndex : fcResult['equPartName'].name,
			width : 180
		},{
			id : 'ggxh',
			header : fcResult['ggxh'].fieldLabel,
			dataIndex : fcResult['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcResult['unit'].fieldLabel,
			dataIndex : fcResult['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'weight',
			header : fcResult['weight'].fieldLabel,
			dataIndex : fcResult['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'graphNo',
			header : fcResult['graphNo'].fieldLabel,
			dataIndex : fcResult['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'boxinNum',
			header : fcResult['boxinNum'].fieldLabel,
			dataIndex : fcResult['boxinNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'realNum',
			header : fcResult['realNum'].fieldLabel,
			dataIndex : fcResult['realNum'].name,
			editor : new fm.NumberField(fcResult['realNum']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'right',
			width : 80
		},{
			id : 'passNum',
			header : fcResult['passNum'].fieldLabel,
			dataIndex : fcResult['passNum'].name,
			editor : new fm.NumberField(fcResult['passNum']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'right',
			width : 80
		},{
			id : 'exceNum',
			header : fcResult['exceNum'].fieldLabel,
			dataIndex : fcResult['exceNum'].name,
			editor : new fm.NumberField(fcResult['exceNum']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			align : 'right',
			width : 80
		},{
			id : 'exception',
			header : fcResult['exception'].fieldLabel,
			dataIndex : fcResult['exception'].name,
			//editor : new fm.Checkbox(fcResult['exception']),
			renderer : function(v,m,r){
				//m.attr = "style=background-color:#FBF8BF";
				if(r.get('exceNum')!="0" && r.get('exceNum')!=""){
					v = 1;
				}
				//return "<input type='checkbox' title='双击可编辑' "+(v==1?"checked":"")+" disabled>"
				return "<input type='checkbox' "+(v==1?"checked":"")+" disabled>"
			},
			align : 'center',
			width : 80
		},{
			id : 'exceType',
			header : fcResult['exceType'].fieldLabel,
			dataIndex : fcResult['exceType'].name,
			editor : new fm.ComboBox(fcResult['exceType']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				var exce = "";
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
			header : fcResult['exceptionDesc'].fieldLabel,
			dataIndex : fcResult['exceptionDesc'].name,
			editor : new fm.TextField(fcResult['exceptionDesc']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			width : 180
		},{
			id : 'remark',
			header : fcResult['remark'].fieldLabel,
			dataIndex : fcResult['remark'].name,
			editor : new fm.TextField(fcResult['remark']),
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				return v;
			},
			width : 180
		},{
			id: 'storage',
			header : fcResult['storage'].fieldLabel,
			dataIndex : fcResult['storage'].name,
			hidden : true
		}
	]);
	var ColumnsResult = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'openboxId', type:'string'},
		{name:'openboxNo', type:'string'},
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
		{name:'remark', type:'string'},
		{name:'storage', type:'string'}
	];
	var PlantResult = Ext.data.Record.create(ColumnsResult);
    var PlantIntResult = {
		uids : '',
		pid : CURRENTAPPID,
		openboxId : '',
		openboxNo : '',
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
		remark : ''
	}
	
	var dsResult = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanResult,
	    	business: businessResult,
	    	method: listMethodResult,
	    	params: "1=2"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyResult
        }, ColumnsResult),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsResult.setDefaultSort(orderColumnResult, 'desc');	//设置默认排序列
    
    var initBtn = new Ext.Button({
    	id : "initBtn",
    	iconCls : 'btn',
    	text : '初始化',
    	handler : function(){
    		var record = sm.getSelected();
    		if(record == null || record == ""){
				Ext.example.msg('提示信息','请先选择一条开箱验收单！');
		    	return ;
			}
		    DWREngine.setAsync(false);
		    equMgm.initEquOpenboxResult(record.get("uids"),function(str){
	    		if(str == "1"){
					Ext.example.msg('提示信息','初始化成功！');
					dsResult.reload();
				}else if(str == "0"){
					Ext.example.msg('提示信息','初始化失败！');
				}else{
					var errMsg = "";
					var strArr = str.split("|");
					//没有部件明细的箱件
					if(strArr[0].length>0){
						errMsg +="以下箱件没有详细部件信息：<br>" 
						errMsg += strArr[0];
					}	
					//没有设备合同分类树的裸件
					if(strArr[1].length>0){
						errMsg +="以下裸件没有设备合同分类树：<br>" 
						errMsg += strArr[1];
					}
					errMsg+="<br>请补充完整数据后重新初始化！";
					Ext.Msg.alert('初始化失败',errMsg);
				}	
		    });
    	    DWREngine.setAsync(true);
    	}
    });
    var saveBtb = new Ext.Button({
       id : 'save',
       text　:'保存',
       tooltip : '保存',
       iconCls : 'save',
       handler : saveOpenboxResult
    })
    var delBtb = new Ext.Button({
       id : 'del',
       text　:'删除',
       tooltip : '删除',
       iconCls : 'remove',
       handler : deletFn
    })
    var fileBtn = new Ext.Button({
       id : 'fileBtn',
       text　:'附件',
       tooltip : '附件',
       icon : CONTEXT_PATH
			  + "/jsp/res/images/icons/attach.png",
			  cls : "x-btn-text-icon",
       handler : excelFn
    })
    
   var yjBtn = new Ext.Toolbar.Button({
			id: 'send',
			icon: CONTEXT_PATH + "/jsp/res/images/icons/back.png",
			cls: "x-btn-text-icon",
			text : '移交文件',
			tooltip : '移交',
			handler: yjzlFun
	});
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
			var filePrintType = "EquGoodsOpenboxVGj";
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
				docUrl += "&fileName=设备开箱验收单-设备.doc";
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
	var tbar = ['<font color=#15428b><B>开箱检验结果<B></font>','-',initBtn,'-',saveBtb,'-',delBtb,'-']
	var gridPanelResult = new Ext.grid.EditorGridTbarPanel({
		ds : dsResult,
		cm : cmResult,
		sm : smResult,
		title : '开箱检验结果',
		clicksToEdit : 1,
		tbar : tbar,
		addBtn : false,
		saveBtn : false,
		delBtn : false,
		header: true,
		height : document.body.clientHeight*0.5,
	    border: false,
		saveHandler : saveOpenboxResult,//gridPanelResult.defaultDeleteHandler
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
            store: dsResult,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : PlantResult,
		plantInt : PlantIntResult,
		servletUrl : MAIN_SERVLET,
		bean : beanResult,
		business : businessResult,
		primaryKey : primaryKeyResult,
		listeners:{
			afteredit:function(e){
				if(e.field == 'realNum'){
					var record = e.record;
					var realOld=e.originalValue ;
			    	var realNew = e.value;
			    	if(realNew<0){
			    		record.set('realNum',realOld);
			    		return false;
			    	}
				 }
				 //根据需求由于明细表数据太多，故合格数量=实到数量 yanglh 2013-8-21
				 if(e.field == 'exceNum'){
				     var record = e.record;
				     var realName = record.get("realNum");
//				      var passNum = record.get("passNum");
				      var passNum = record.get("exceNum");
				      if(passNum<realName){
				           record.set('passNum',realName-passNum);
				           return true;
				      }else{
				      	   record.set('exceNum',0);
				           Ext.example.msg('提示信息','异常数量不能大于实到数量！');
				           return true;
				      }
				 }
			}
		}
	});
	
	function saveOpenboxResult(){
		var flag=0;
		
		var records = dsResult.getModifiedRecords();
		for (var i = 0; i < records.length; i++) {
			var exceNum = records[i].get("exceNum");
			if(exceNum == 0){
				records[i].set("exception","0");
			}else{
				flag ++;
				records[i].set("exception","1");
			}	
		}
		var  openboxId
		if(flag == 0){
		  for (var i = 0; i < records.length; i++) {
			   var  openboxId =  records[i].get("openboxId");
			   var upsql = "update equ_goods_openbox set finished = '1' where uids='"+openboxId+"'";
		       if(openboxId !=  null || openboxId != ''){
		           DWREngine.setAsync(true);
		              baseDao.updateBySQL(upsql,function(str){
                        if(str == 1){
                            ds.load({params:{start:0,limit:PAGE_SIZE}});
                        }
                      });
		           DWREngine.setAsync(false);
		          break;
		       }
		  }
		}
		
		gridPanelResult.defaultSaveHandler();
	}
	
	var tabPanel = new Ext.TabPanel({
		activeTab : 0,
        border: false,
        region: 'south',
		items : [gridPanelSub,gridPanelResult]
	});
	
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanel,tabPanel]
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
	},'-',excelBtn,'-',yjBtn,'-',printBtn);
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
	ds.baseParams.params = " pid = '"+CURRENTAPPID +"' "
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	
	tabPanel.on('tabchange',function(t,tab){
		var record = sm.getSelected();
		if(record == null || record == '')return;
		if(record.get('finished') == 1){
			tab.getTopToolbar().setDisabled(true);
		}else{
			tab.getTopToolbar().setDisabled(false);
		}
	});
	ds.on("load",function(){
    	setPermission();
    });
	sm.on('rowselect',function(){
		var record = sm.getSelected();
		if(record.get('finished') == 1){
			editBtn.setDisabled(true);
			delBtn.setDisabled(true);
			tabPanel.getActiveTab().getTopToolbar().setDisabled(true);
			saveBtb.setDisabled(true);
            delBtb.setDisabled(true);
            impBtn.setDisabled(true);
		}else{
			if(ModuleLVL == '1' || ModuleLVL== '2'){
				editBtn.setDisabled(false);
				delBtn.setDisabled(false);
				tabPanel.getActiveTab().getTopToolbar().setDisabled(false);
				saveBtb.setDisabled(false);
           		delBtb.setDisabled(false);
            	impBtn.setDisabled(false);
			}
			
		}
	    DWREngine.setAsync(false);
	    if(edit_conid == null || edit_conid == "")
	    	edit_conid = record.get('conid');
		baseMgm.findById(beanCon, edit_conid,function(obj){
			conno = obj.conno;
			conname = obj.conname;
		});
		DWREngine.setAsync(true);
		dsSub.baseParams.params = "openboxId = '"+record.get('uids')+"'";
		dsSub.load({params:{start:0,limit:PAGE_SIZE}});
		
		dsResult.baseParams.params = "openboxId = '"+record.get('uids')+"'";
		dsResult.load({params:{start:0,limit:PAGE_SIZE}});
	});
    
    
	function addOrEditOpenbox(){
		var btnId = this.id;
		var record = sm.getSelected();
		var url = BASE_PATH+"Business/equipment/equMgm/equ.goods.openbox.addorupdate.jsp"
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
				Ext.example.msg('提示信息','技术资料分类下不能添加开箱检验单！');
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
        
        url += "&moduleFlowType="+moduleFlowType;
        
		selectWin = new Ext.Window({
			width: 950,
			height: 500,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			html:"<iframe id='equOpenbox' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(){
					ds.reload();
				},
				'show' : function(){
					equOpenbox.location.href  = url;
				}
			}
	    });
		selectWin.show();
	}
	
	function deleteOpenbox(){
		var record = sm.getSelected();
		if(record == null){
			Ext.example.msg('提示信息','请先选择一条开箱检验单！');
	    	return ;
		}
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes") {
				var uids = record.get("uids");
				equMgm.deleteOpenbox(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','开箱检验单删除成功！');
						ds.reload();
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
		                    + "/servlet/EquServlet?ac=exportData&businessType=equOpenboxResultList&pid="+CURRENTAPPID+"&uidS="+uidsS;
                   document.all.formAc.action = openUrl;       
			       document.all.formAc.submit();
			       return;
		}
    	//点击合同分类树是导出该节点及节点下的到货单记录明细
    	if((selectParentid == null  || selectParentid == '') && (selectTreeid == null || selectTreeid == '')){
    	     openUrl = CONTEXT_PATH    
				+ "/servlet/EquServlet?ac=exportData&businessType=equOpenboxResultList&pid="+CURRENTAPPID;	
    	}else{
    	     if(selectParentid == '0'){
    	     	 sqlS =  "select uids from equ_goods_openbox where conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"')";
    	     }else{
    	     	if(selectTreeid.indexOf("04")== 0){
    	     	    return;
    	     	}else{
    	     		sqlS  = "select uids from equ_goods_openbox where treeuids in (select a.uids from ( select t.* from equ_con_ove_tree_view t " +
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
				    + "/servlet/EquServlet?ac=exportData&businessType=equOpenboxResultList&pid="+CURRENTAPPID+"&uidS="+uidsS;
			}else{
			    Ext.example.msg("信息提示","该分类下没有数据,无法导出！");
			    return;
			}
    	}
		document.all.formAc.action = openUrl;       
		document.all.formAc.submit();

	}
	
	function deletFn(){//开箱检验结果删除记录
	    gridPanelResult.defaultDeleteHandler();
	}

	function excelFn(){
		var record = sm.getSelected();
		if(record == null || record == "")return;
		var filePk = record.get("uids");
		var fileUploadUrl = CONTEXT_PATH
				+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=zlMaterial&editable=true&businessId="
				+ filePk;
		var ext
		try {
			ext = parent.Ext
		} catch (e) {
			ext = Ext
		}
		templateWin = new ext.Window({
					title : "发布附件",
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
	  
	  //文件移交
	  function yjzlFun(){
	    var record = sm.getSelected();
	    if(record == null || record == "")return;
	    var filePk = record.get("uids");
	    window.showModalDialog(
					CONTEXT_PATH
							+ "/Business/equipment/equMgm/equ.goods.openbox.filePk.jsp?fileId="
							+ filePk+"&conid="+edit_conid+"&type=zlMaterial",null,
					"dialogWidth:900px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	  }
      
      function importDataFile(){
        var allowedDocTypes = "xls,xlsx";
        var uids = smSub.getSelected().get('uids');
        var impUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=importData&pid="+CURRENTAPPID+"&uids="+uids+"&bean="+beanPart
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
                                        dsPart.load({params:{start:0,limit:10}});
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

function finishOpenbox(uids,finished){
	if(ModuleLVL != '1' && ModuleLVL !='2' ){
		finished.checked = !finished.checked;
		Ext.example.msg('提示信息', '此用户没有权限进行完结操作！');
		return;
	}
	DWREngine.setAsync(false);
	equMgm.equOpenboxFinished(uids,function(str){
		if(str == "1"){
			Ext.example.msg('提示信息','开箱检验单完结操作成功！');
			finished.checked = true;
			ds.reload();
		}else if(str == "2"){
			Ext.example.msg('提示信息','该开箱检验单已经开始入库，不能取消完结！');
			finished.checked = false;
		}else if(str == "3"){
			Ext.example.msg('提示信息','检验结果合格数量不完整，不能完结操作！');
			finished.checked = false;
		}else{
			Ext.example.msg('提示信息','操作出错！');
			finished.checked = false;
		}
	});
	DWREngine.setAsync(true);
}

function havePartFun(c){
	partWin.show();
	c.checked = c.checked == true ? false : true;
	return false;
}

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
					title : "设备开箱检验单附件",
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
