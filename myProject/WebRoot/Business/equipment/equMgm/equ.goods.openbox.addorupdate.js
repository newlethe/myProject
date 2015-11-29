var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenbox"
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"
var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var beanNotice = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNotice"
var businessNotice = "baseMgm"
var listMethodNotice = "findWhereOrderby"
var primaryKeyNotice = "uids"
var orderColumnNotice = "uids"

var beanPart = "com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSubPart"
var businessPart = "baseMgm"
var listMethodPart = "findWhereOrderby"
var primaryKeyPart = "uids"
var orderColumnPart = "uids"

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
var storageArr = new Array();
var billStateArr = new Array();

var partWin;
var conno;
var conname;

var gridPanelFj;
var formPanel;

Ext.onReady(function(){
	var formPanelName = CURRENTAPPID == "1031902"? "设备/材料开箱检验单":"设备开箱检验单";
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
	var sql = "select uuid,treename from equ_type_tree t where t.conid = '"+edit_conid+"'";
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
    //获取乙方单位
    var sqlb = "select t.partyb  from con_ove_view t where t.conid = '"+edit_conid+"'";
    var partbName;
    baseDao.getData(sqlb,function(list){
        partbName = list;
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
    
	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : storageArr
	});    
    DWREngine.setAsync(false);
	baseMgm.findById(beanCon, edit_conid,function(obj){
		conno = obj.conno;
		conname = obj.conname;
	});
	//处理到货批号
	var newOpenNo = conno+"-KX-"
	equMgm.getEquNewDhNo(CURRENTAPPID,newOpenNo,"open_no","equ_goods_openbox",null,function(str){
		newOpenNo = str;
	});
	DWREngine.setAsync(true);

	var fm = Ext.form;
	//TODO : ======开箱主表======
	var fc = {
		'uids' : {name : 'uids',	fieldLabel : '主键'},
		'pid' : {name : 'pid',	fieldLabel : 'PID'},
		'conid' : {name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isStorein' : {name : 'isStorein',fieldLabel : '是否入库'},
		
		'openNo' : {name : 'openNo',fieldLabel : '开箱单号',width : 160,readOnly : CURRENTAPPID == "1030902"?false:true},//国金项目要求可以手动修改 yanglh 2013-12-03
		'openDate' : {name : 'openDate',fieldLabel : '开箱日期',width : 160,format: 'Y-m-d'},
		'noticeId' : {name : 'noticeId',fieldLabel : '通知单主键'},
		'noticeNo' : {
			name : 'noticeNo',
			fieldLabel : '通知单号',
			triggerClass: 'x-form-date-trigger',
			onTriggerClick: showNoticeWin,
			width : 160
			},
		'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点',width : 160},
		'openUser' : {name : 'openUser',fieldLabel : '开箱参加人员',width : 160},
		'ownerNo' : {name : 'ownerNo',fieldLabel : '业主单号',width : 160},
		'openDesc' : {name : 'openDesc',fieldLabel : '验收描述',width : 160},
		'remark' : {name : 'remark',fieldLabel : '备注',width : 160},
        
        'factoryNo' : {name : 'factoryNo',fieldLabel : '出厂编号' ,width : 160},
        'packingNo' : {name : 'packingNo',fieldLabel : '装箱单号' ,width : 160},
        'factory' : {name : 'factory',fieldLabel : '制造厂家' ,width : 160},
        'sysName' : {name : 'sysName',fieldLabel : '系统名称' ,width : 160}
	}
	
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveOpenbox
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			parent.selectWin.close();
		}
	});
	
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
        {name : 'sysName', type : 'string'}
	];
	
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    
    if(edit_uids == null || edit_uids == ""){
		loadFormRecord = new formRecord({
			uids : '',
			pid : CURRENTAPPID,
			conid : edit_conid,
			treeuids : edit_treeuids,
			finished : 0,
			isStorein : 0,
			openNo : newOpenNo,
			openDate : new Date(),
			openDesc : '',
			noticeId : '',
			noticeNo : '',
			openPlace : '',
			openUser : '',
			ownerNo : '',
			remark : '',
            
            factoryNo : '',
            packingNo : '',
            factory : partbName,
            sysName:''
   		});
    }else{
	    DWREngine.setAsync(false);
		baseMgm.findById(bean, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
    }
    
    formPanel = new Ext.FormPanel({
		region : 'north',
		height : 135,
		border : false,
		labelAlign : 'right',
		bodyStyle : 'padding:5px 10px;',
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
						new fm.Hidden(fc['isStorein']),
						
						new fm.TextField(fc['openNo']),
						new fm.TextField(fc['openPlace']),
                        new fm.TextField(fc['factoryNo']),
						new fm.TextField(fc['ownerNo'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						new fm.DateField(fc['openDate']),
						new fm.TextField(fc['openUser']),
                        new fm.TextField(fc['packingNo']),
						new fm.TextField(fc['remark'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						new fm.Hidden(fc['noticeId']),
						new fm.TriggerField(fc['noticeNo']),
                        new fm.TextField(fc['openDesc']),
                        new fm.TextField(fc['factory']),
                         new fm.TextField(fc['sysName'])
					]
				}]
			}
		]
	});
	
	//打开通知单选择窗口
	function showNoticeWin(){
		var uids = formPanel.getForm().findField("uids").getValue();
		if(uids == null || uids == ""){
			Ext.example.msg('提示信息','请先保存开箱检验单详细信息！');
			return;
		}
		noticeWin.show();
		var noticeId = formPanel.getForm().findField("noticeId").getValue();
        var state = moduleFlowType == "None" ? 'finished':'billState';
		if(noticeId == ""){
			dsNotice.baseParams.params = " "+state+"='1' and noticeNo not in (select noticeNo from EquGoodsOpenbox where noticeNo is not null)";
		}else{
			dsNotice.baseParams.params = " "+state+"='1' and noticeNo not in (select noticeNo from EquGoodsOpenbox where noticeNo is not null) and uids <>'"+noticeId+"' ";
		}
		dsNotice.load({params:{start:0,limit:PAGE_SIZE}});
	}
	
	//TODO : ======选择开箱通知单======
	var fcNotice = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isCheck' : {name : 'isCheck',fieldLabel : '已检验'},
		'noticeNo' : {name : 'noticeNo',fieldLabel : '通知单号'},
		'noticeDate' : {name : 'noticeDate',fieldLabel : '下单日期'},
		'openDate' : {name : 'openDate',fieldLabel : '开箱时间'},
		'openPlace' : {name : 'openPlace',fieldLabel : '开箱地点'},
		'openUnit' : {name : 'openUnit',fieldLabel : '参与单位'},
		'equDesc' : {name : 'equDesc',fieldLabel : '检验主要设备描述'},
		'ownerNo' : {name : 'ownerNo',fieldLabel : '业主单号'},
		'professinal' : {name : 'professinal',fieldLabel : '所属专业'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
        'billState' : {name : 'billState',fieldLabel : '审批状态'}
	}
	
	var smNotice = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cmNotice = new Ext.grid.ColumnModel([
		smNotice,
		{
			id:'uids',
			header: fcNotice['uids'].fieldLabel,
			dataIndex: fcNotice['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fcNotice['pid'].fieldLabel,
			dataIndex: fcNotice['pid'].name,
			hidden: true
		},{
			id:'conid',
			header: fcNotice['conid'].fieldLabel,
			dataIndex: fcNotice['conid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fcNotice['treeuids'].fieldLabel,
			dataIndex: fcNotice['treeuids'].name,
			hidden: true
		},{
			id:'finished',
			header: fcNotice['finished'].fieldLabel,
			dataIndex: fcNotice['finished'].name,
//			renderer : function(v,m,r){
//				var o = r.get("isCheck");
//				var str = "<input type='checkbox' "+(o==1?"disabled title='已检验，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishNotice(\""+r.get("uids")+"\",\""+v+"\")'>"
//				return str;
//			},
			hidden : true
		},{
			id:'isCheck',
			header:fcNotice['isCheck'].fieldLabel,
			dataIndex: fcNotice['isCheck'].name,
			hidden: true
		},{
			id:'noticeNo',
			header: fcNotice['noticeNo'].fieldLabel,
			dataIndex: fcNotice['noticeNo'].name,
			width : 180
		},{
			id:'noticeDate',
			header: fcNotice['noticeDate'].fieldLabel,
			dataIndex: fcNotice['noticeDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'openDate',
			header: fcNotice['openDate'].fieldLabel,
			dataIndex: fcNotice['openDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'openPlace',
			header: fcNotice['openPlace'].fieldLabel,
			dataIndex: fcNotice['openPlace'].name,
			width : 180
		},{
			id:'openUnit',
			header: fcNotice['openUnit'].fieldLabel,
			dataIndex: fcNotice['openUnit'].name,
			renderer : function(v){
				var unit = "";
				for(var i=0;i<unitArr.length;i++){
					if(v == unitArr[i][0]){
						unit = unitArr[i][1];
						break;
					}
				}
				return unit;
			},
			width : 180
		},{
			id:'equDesc',
			header: fcNotice['equDesc'].fieldLabel,
			dataIndex: fcNotice['equDesc'].name,
			width : 180
		},{
			id:'ownerNo',
			header: fcNotice['ownerNo'].fieldLabel,
			dataIndex: fcNotice['ownerNo'].name,
			width : 160
		},{
			id:'professinal',
			header: fcNotice['professinal'].fieldLabel,
			dataIndex: fcNotice['professinal'].name,
			renderer : function(v){
				var prof = "";
				for(var i=0;i<profArr.length;i++){
					if(v == profArr[i][0]){
						prof = profArr[i][1];
						break;
					}
				}
				return prof;
			},
			width : 80
		},{
			id:'remark',
			header: fcNotice['remark'].fieldLabel,
			dataIndex: fcNotice['remark'].name,
			width : 180
        },{
            id:'billState',
            header: fcNotice['billState'].fieldLabel,
            dataIndex: fcNotice['billState'].name,
            renderer : function(v){
                var bill = "";
                for(var i=0;i<billStateArr.length;i++){
                    if(v == billStateArr[i][0]){
                        bill = billStateArr[i][1];
                        break;
                    }
                }
                return bill;
            },
            align : 'center',
            hidden : moduleFlowType=="None" ? true : false,
            width : 70
        }
	]);
	
	var ColumnsNotice = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isCheck', type : 'float'},
		{name : 'noticeNo', type : 'string'},
		{name : 'noticeDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'openDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'openPlace', type : 'string'},
		{name : 'openUnit', type : 'string'},
		{name : 'equDesc', type : 'string'},
		{name : 'ownerNo', type : 'string'},
		{name : 'professinal', type : 'string'},
		{name : 'remark', type : 'string'},
        
        {name : 'billState', type : 'string'}
	];

	var dsNotice = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanNotice,				
	    	business: businessNotice,
	    	method: listMethodNotice,
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
            id: primaryKeyNotice
        }, ColumnsNotice),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsNotice.setDefaultSort(orderColumnNotice, 'asc');

    var selectNoticeBtn = new Ext.Button({
    	text : '选择',
    	iconCls : 'btn',
    	handler : function(){
    		var record = smNotice.getSelected();
    		if(record == null || record.length == 0){
				Ext.example.msg('提示信息','请先选择开箱检验通知单！');
				return;
    		}
    		DWREngine.setAsync(false);
    		var openboxUids = formPanel.getForm().findField("uids").getValue();
    		var noticeUids = record.get("uids");
    		var noticeNo = record.get("noticeNo");
    		equMgm.getOpenboxSubFromNotice(openboxUids,noticeUids,function(str){
    			if(str == "1"){
    				Ext.example.msg('提示信息','通知单选择成功！');
    				noticeWin.hide();
    				dsSub.reload();
    				formPanel.getForm().findField("noticeId").setValue(noticeUids);
    				formPanel.getForm().findField("noticeNo").setValue(noticeNo);
    			}else{
    				Ext.example.msg('提示信息','通知单选择失败！');
    			}
    		});
    		DWREngine.setAsync(true);
    	}
    });
    
    var noticePanel = new Ext.grid.GridPanel({
		ds : dsNotice,
		sm : smNotice,
		cm : cmNotice,
		title : '开箱检验通知单',
		tbar : ['<font color=#15428b><B>开箱检验通知单<B></font>','->',selectNoticeBtn],
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
            store: dsNotice,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});

	//通知单选择窗口
	var noticeWin = new Ext.Window({
		width : 900,
		height : 450,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [noticePanel]
	});
	
	newtreePanel.on('click', function(node,e){
		var elNode = node.getUI().elNode;
		var treename = node.attributes.treename;
		var treeuids = elNode.all("uuid").innerText;
		var treeid = elNode.all("treeid").innerText;
		treeuidsComboTree.setValue(treeuids);
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
	
	
	
	//TODO : ======开箱检验单明细======
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
					if(v == boxArr[i][0]){
						box = boxArr[i][1];
						break;
					}
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
				var tree = "";
				for(var i=0;i<treeArr.length;i++){
					if(v == treeArr[i][0]){
						tree = treeArr[i][1];
						break;
					}
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
			renderer : function(v){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0]){
						equ = equTypeArr[i][1];
						break;
					}
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
					if(v == jzArr[i][0]){
						jz = jzArr[i][1];
						break;
					}
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
			align : 'center',
			width : 80
		},{
			id : 'realNum',
			header : fcSub['realNum'].fieldLabel,
			dataIndex : fcSub['realNum'].name,
			align : 'center',
			width : 80
		},{
			id : 'weight',
			header : fcSub['weight'].fieldLabel,
			dataIndex : fcSub['weight'].name,
			align : 'center',
			width : 80
		},{
			id : 'packType',
			header : fcSub['packType'].fieldLabel,
			dataIndex : fcSub['packType'].name,
			renderer : function(v){
				var pack = "";
				for(var i=0;i<packArr.length;i++){
					if(v == packArr[i][0]){
						pack = packArr[i][1];
						break;
					}
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
	
	var dsSub = new Ext.data.Store({
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
		title : '开箱检验单明细',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>开箱检验单明细<B></font>','-'],
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
		primaryKey : primaryKeySub,
		listeners: {
			beforeedit:function(e){
				var currRecord = e.record;
				if (currRecord.get("boxType")!='02'&& (e.column=="7"||e.column=="8"))
					e.cancel = true;
	        }
		}
	});
	
	//TODO : ======箱件内明细======
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
						break;
					}
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
					if(v == equTypeArr[i][0]){
						equ = equTypeArr[i][1];
						break;
					}
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
					if(v == jzArr[i][0]){
						jz = jzArr[i][1];
						break;
					}
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
//			,
//			hidden : true
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
					var uids = smSub.getSelected().get("uids");
					partBoxName.setText("<b>"+smSub.getSelected().get("boxName")+"</b>");
					var openboxId = formPanel.getForm().findField("uids").getValue();  
					var openboxNo = formPanel.getForm().findField("openNo").getValue();
					var storage = smSub.getSelected().get("storage");
					PlantIntPart.openboxSubId = uids;
					PlantIntPart.openboxId = openboxId;
					PlantIntPart.openboxNo = openboxNo;
					PlantIntPart.storage = storage;
					dsPart.baseParams.params = "openboxSubId='"+uids+"'";
					dsPart.load({params:{start:0,limit:PAGE_SIZE}});
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
    
    var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
                "?uids="+edit_uids+"&uuid="+edit_treeuids+"&conid="+edit_conid+"&edit=true&type=KX";
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
	var uids = formPanel.getForm().findField("uids").getValue();
	if(uids!=null && uids!=""){
		dsSub.baseParams.params = "openboxId = '"+uids+"'";
		dsSub.load({params:{start:0,limit:10}});
	}
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
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
	
	function saveOpenbox(){
		var form = formPanel.getForm();
		if(CURRENTAPPID == "1030902"){
			//允许修改开箱检验单号，修改后判断是否修该的单号是否存在 yanglh 2013-12-03
			var getUids = '';
			DWREngine.setAsync(false);
			baseDao.getData("select uids from EQU_GOODS_OPENBOX where open_no='"+form.findField("openNo").getValue()+"'",function(list){
				if(list.length>0){
					getUids = list;
				}
			});
			DWREngine.setAsync(false);
			if((getUids != '')&& (getUids != form.findField("uids").getValue())){
				Ext.example.msg('系统提示','该开箱单号已存在！请修改！');
				return;
			}		
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
    	equMgm.addOrUpdateEquOpenbox(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','开箱管理保存失败！');
    		}else{
    			Ext.example.msg('提示信息','开箱管理保存成功！');
    			form.findField("uids").setValue(str);
    			dsSub.baseParams.params = "pid='"+CURRENTAPPID+"' and openboxId='"+str+"'"
    		}
    	});
    	DWREngine.setAsync(true);
	}
	
});

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