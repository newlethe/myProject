var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenbox"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"

var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var beanPart = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxSubPart"
var businessPart = "baseMgm"
var listMethodPart = "findWhereOrderby"
var primaryKeyPart = "uids"
var orderColumnPart = "uids"

var beanResult = "com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxResult"
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
var businessType = "zlMaterial";

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
var chooseSystemArray = new Array();
var equWareArr =  new Array();
//复制粘贴使用
var partDataArr = new Array();

var ds;
var dsSub;
var partWin;
var fileWin;
var fileForm;

var conno;
var conname;

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

    //处理设备仓库下拉框
    var typeArr = new Array();
    baseMgm.getData("select wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
                    + "' and parent='01' order by equid ", function(list){
         for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            typeArr.push(temp);
        }
    }); 
    baseMgm.getData("select uids,equid,wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
                    + "' order by equid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            temp.push(list[i][2]);
            for(var j=0;j<typeArr.length;j++){
                if(list[i][3] == typeArr[j][1]){
                    temp.push(typeArr[j][0]);
                }
            }
//            if(list[i][3]=="SBCK")
//                temp.push("设备仓库");
//            else if(list[i][3]=="CLCK")
//                temp.push("材料仓库")
//            else if(list[i][3]=="JGCK")
//                temp.push("建管仓库")
	          equWareArr.push(temp);
           
        }
    });
	
	
		//设备所属系统类型
	appMgm.getCodeValue("所属系统(设备)",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyName);	
			temp.push(list[i].propertyName);		
			chooseSystemArray.push(temp);			
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

	// TODO : ======开箱主表======
	var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树'},
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
		'fileList' : {name : 'fileList',fieldLabel : '附件'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
		'factoryNo' : {name : 'factoryNo',fieldLabel : '出厂编号'},
		'packingNo' : {name : 'packingNo',fieldLabel : '装箱单号'},
		'factory' : {name : 'factory',fieldLabel : '制造厂家'}
        
        ,'createMan':{name : 'createMan',fieldLabel : '创建人'}
        ,'createUnit':{name : 'createUnit',fieldLabel : '创建单位'}
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
			id:'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
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
                var c = r.get("createMan")
                if(c != USERID){
                    return "<input type='checkbox' "+(o==1?"disabled title='已入库，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结，但该单据不是您录入，您无权操作！'")+" disabled >";
                }else{
				    var str = "<input type='checkbox' "+(o==1?"disabled title='已入库，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结'")+" onclick='finishOpenbox(\""+r.get("uids")+"\",this)'>"
				    return str;
                }
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
			width : 180
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
			width : 180
		},{
			id:'openPlace',
			header: fc['openPlace'].fieldLabel,
			dataIndex: fc['openPlace'].name,
			width : 180
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
			width : 180
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
 			id:'fileList',
			header: fc['fileList'].fieldLabel,
			dataIndex: fc['fileList'].name,
			width : 80,  
			align : 'center',
			renderer : filelistFn
           
        } ,{
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
		{name : 'factory', type : 'string'}
        
        ,{name : 'createMan', type : 'string'}
        ,{name : 'createUnit', type : 'string'}
	];

	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	//params: "conid='"+edit_conid+"'"
	    	params: viewSql   //默认根据电建公司过滤数据，条件在wz.cont.tree.js中获取
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
    
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		title : '开箱检验单',
		tbar : ['<font color=#15428b><B>开箱检验单<B></font>','-',addBtn,'-',editBtn,'-',delBtn],
		enableHdMenu : false,
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
	
	// TODO : ======开箱检验单明细======
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'openboxId' : {name : 'openboxId',fieldLabel : '到货单主键'},
		'openboxNo' : {name : 'openboxNo',fieldLabel : '到货单批次号'},

		'havePart' : {name : 'havePart',fieldLabel : '开箱明细'},
		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '合同分类树',
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
		'boxNo' : {name : 'boxNo',fieldLabel : '存货编码'},
		'boxName' : {name : 'boxName',fieldLabel : '存货名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'mustNum' : {name : 'mustNum',fieldLabel : '应到数',decimalPrecision:4},
		'realNum' : {name : 'realNum',fieldLabel : '实到数',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）',decimalPrecision:4},
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
		'storage' : {name : 'storage',fieldLabel : '仓库'},
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
			hidden : true,
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
			width : 60
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
			hidden : true,
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
			hidden : true,
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
			hidden : true,
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
            renderer : rendererColumnColorFun,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcSub['graphNo'].fieldLabel,
			dataIndex : fcSub['graphNo'].name,
			align : 'center',
            hidden : true,
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
			hidden : true,
			width : 80
		},{
			id : 'storage',
			header : fcSub['storage'].fieldLabel,
			dataIndex : fcSub['storage'].name,
			renderer : function(v){
				var storage = "";
				for(var i=0;i<storageArr.length;i++){
					if(v == storageArr[i][0])
						storage = storageArr[i][3]+"-"+storageArr[i][2];
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
			hidden : true,
			width : 80
		},{
			id : 'exceptionDesc',
			header : fcSub['exceptionDesc'].fieldLabel,
			dataIndex : fcSub['exceptionDesc'].name,
			hidden : true,
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
    cmSub.defaultSortable = true;
    
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '箱件明细',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>箱件明细<B></font>','-'],
		enableHdMenu : false,
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
	var havePart = [['0','正常'],['1','异常']];
	
	var havePartDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: havePart
    });
    
    	var storeSystem = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : chooseSystemArray
	});
	
    var  chooseSystem = new Ext.form.MultiSelect({
         id:   'belongSystem',
         width:  160,
         store : storeSystem,
         fieldLabel:'所属系统',
         readOnly : true,
         displayField:'v',
         separator : '、',
         valueField:'k',
         emptyText: '请选择.....',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	r.set(this.checkField, !r.get(this.checkField))
         	 chooseSystem.setValue(this.getCheckedValue());
               chooseSystem.setValue(this.getCheckedValue());
		}
  })         
    
	var fcPart = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'openboxSubId' : {name : 'openboxSubId',fieldLabel : '到货单部件主键'},
		'openboxId' : {name : 'openboxId',fieldLabel : '到货单主键'},
		'openboxNo' : {name : 'openboxNo',fieldLabel : '到货单批次号'},

		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '合同分类树',
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
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号'},
		'equPartName' : {name : 'equPartName',fieldLabel : '部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'boxinNum' : {name : 'boxinNum',fieldLabel : '装箱单数量',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）'},
		'userPosition' : {name : 'userPosition' ,fieldLabel :'使用部位'},
		'belongSystem' : {name : 'belongSystem' ,fieldLabel : '所属系统'},
		'openCondition' : {
		        name : 'openCondition',
		        fieldLabel : '开箱情况',
				readOnly: true,
				valueField: 'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	           	triggerAction: 'all', 
	           	store: havePartDs
	           	},
		'defectDescription' : {name : 'defectDescription',fieldLabel : '缺陷描述'}
	};
	
	var partComboTree = new fm.ComboBox(fcPart['treeuids']);
	partComboTree.on('beforequery', function(){
		newtreePanelPart.render('treePart');
		newtreePanelPart.getRootNode().reload();
	});
	
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
			hidden : true,
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
			id : 'belongSystem',
			header : fcPart['belongSystem'].fieldLabel,
			dataIndex : fcPart['belongSystem'].name,
			editor : chooseSystem,
			width : 180
		},{
			id : 'userPosition',
			header : fcPart['userPosition'].fieldLabel,
			dataIndex : fcPart['userPosition'].name,
			editor : new fm.TextField(fcPart['userPosition']),
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
			id : 'openCondition',
			header : fcPart['openCondition'].fieldLabel,
			dataIndex : fcPart['openCondition'].name,
			editor : new fm.ComboBox(fcPart['openCondition']),
			renderer : function(v){
			  for(var i=0;i<havePart.length;i++){
			      if(v==havePart[i][0]){
			        return havePart[i][1];
			      }
			  }
			},
			align : 'center',
			width : 80
		},{
			id : 'defectDescription',
			header : fcPart['defectDescription'].fieldLabel,
			dataIndex : fcPart['defectDescription'].name,
			editor : new fm.TextField(fcPart['defectDescription']),
			align : 'center',
			width : 80
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
		{name: 'userPosition',type: 'string'},
		{name: 'belongSystem',type: 'string'},
		{name: 'openCondition',type: 'string'},
		{name: 'defectDescription',type: 'string'}
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
		userPosition : '',
		belongSystem : '',
		openCondition : '',
		defectDescription : ''
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
    var excelInput= new Ext.Button({
		id : 'Excel',
		text : 'excel导入',
		tooltip : 'excel导入',
		iconCls : 'upload',
		pressed:true,
		handler : showExcelWin
		
	}); 
	
	var downloadBtn = new Ext.Toolbar.Button({
			id : 'download',
			text : '模板下载',
			icon : CONTEXT_PATH
					+ "/jsp/res/images/file-download.gif",
			cls : "x-btn-text-icon",
			handler : onItemClick
		});
    function copyFun(){
        var records = smPart.getSelections();
        if(records.length == 0){
            Ext.example.msg('提示信息','请先选择需要复制的部件明细！');
            return;
        }else{
            partDataArr = new Array();
	        for (var i = 0; i < records.length; i++) {
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
        wzbaseinfoMgm.pasteWzOpenboxPart(partDataArr,function(str){
           if(str == "1"){
                Ext.example.msg('提示信息','部件明细粘贴成功！');
                dsPart.reload();
            }else if(str == "0"){
                Ext.example.msg('提示信息','部件明细粘贴失败！');
            }
        });
        DWREngine.setAsync(true);
    }
    cmPart.defaultSortable = true;
    
	var gridPanelPart = new Ext.grid.EditorGridTbarPanel({
		ds : dsPart,
		cm : cmPart,
		sm : smPart,
		title : '箱件明细',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>箱件明细<B></font>','-','箱件名称：',partBoxName],
//		                               ,'-',copyBtn,'-', pasteBtn,'-',downloadBtn,'-',excelInput,'-'
		header: false,
		addBtn : false, // 是否显示新增按钮
		saveBtn : false, // 是否显示保存按钮
		delBtn : false, // 是否显示删除按钮
		enableHdMenu : false,
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
            store: dsPart,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
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
					PlantIntPart.openboxSubId = uids;
					PlantIntPart.openboxId = openboxId;
					PlantIntPart.openboxNo = openboxNo;
					dsPart.baseParams.params = "openboxSubId='"+uids+"'";
					dsPart.load({params:{start:0,limit:PAGE_SIZE}});
					if(sm.getSelected().get('finished') == 1){
						//gridPanelPart.getTopToolbar().setDisabled(true);
						with(gridPanelPart.getTopToolbar().items){
							get('add').setDisabled(true);
							get('save').setDisabled(true);
							get('del').setDisabled(true);
						}
					}else{
						//gridPanelPart.getTopToolbar().setDisabled(false);
						with(gridPanelPart.getTopToolbar().items){
							get('add').setDisabled(false);
							get('save').setDisabled(false);
							get('del').setDisabled(false);
						}
					}
			},
			"hide" :function(){
				var num = dsPart.getTotalCount();
				var have = 0;
				if(num > 0)
					have = 1;
				DWREngine.setAsync(false);
				var sql = "update Wz_Goods_Openbox_Sub set have_part='"+have+"' " +
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
		'treeuids' : {name : 'treeuids',fieldLabel : '合同分类树'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'jzNo' : {name : 'jzNo',fieldLabel : '机组号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '存货编码'},
		'equPartName' : {name : 'equPartName',fieldLabel : '存货名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'boxinNum' : {name : 'boxinNum',fieldLabel : '装箱单数量',decimalPrecision:4},
		'realNum' : {name : 'realNum',fieldLabel : '实到数量',decimalPrecision:4},
		'passNum' : {name : 'passNum',fieldLabel : '合格数量',decimalPrecision:4},
		'exceNum' : {name : 'exceNum',fieldLabel : '异常数量',decimalPrecision:4},
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
		'remark' : {name : 'remark',fieldLabel : '备注'}
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
			hidden : true,
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
			hidden : true,
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
			hidden : true,
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
            hidden : true,
			width : 100
		},{
			id : 'boxinNum',
			header : fcResult['boxinNum'].fieldLabel,
			dataIndex : fcResult['boxinNum'].name,
			align : 'right',
            hidden : true,
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
			hidden : true,
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
			hidden : true,
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
			hidden : true,
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
			hidden : true,
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
		{name:'remark', type:'string'}
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
		    wzbaseinfoMgm.initWzOpenboxResult(record.get("uids"),function(str){
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
//					if(strArr[1].length>0){
//						errMsg +="以下裸件没有材料合同分类树：<br>" 
//						errMsg += strArr[1];
//					}
					errMsg+="<br>请补充完整数据后重新初始化！";
					Ext.Msg.alert('初始化失败',errMsg);
				}	
		    });
    	    DWREngine.setAsync(true);
    	}
    });
    cmResult.defaultSortable = true;
    
	var gridPanelResult = new Ext.grid.EditorGridTbarPanel({
		ds : dsResult,
		cm : cmResult,
		sm : smResult,
		title : '开箱检验结果',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><B>开箱检验结果<B></font>','-',initBtn,'-'],
		addBtn : false,
		saveBtn : true,
		delBtn : false,
		header: true,
		height : document.body.clientHeight*0.5,
		enableHdMenu : false,
	    border: false,
		saveHandler : saveOpenboxResult,	    
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
			}
		}
	});
	
	function saveOpenboxResult(){
		var records = dsResult.getModifiedRecords();
		for (var i = 0; i < records.length; i++) {
			var exceNum = records[i].get("exceNum");
			if(exceNum == 0){
				records[i].set("exception","0");
			}else{
				records[i].set("exception","1");
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
	
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	
	tabPanel.on('tabchange',function(t,tab){
		var record = sm.getSelected();
		if(record == null) return;
		if(record.get('finished') == 1){
			tab.getTopToolbar().setDisabled(true);
		}else{
			tab.getTopToolbar().setDisabled(false);
		}
	});
	
	sm.on('rowselect',function(){
		var record = sm.getSelected();
        if (record == null || record == '') return;
        if(record.get('createMan') == USERID){
			if(record.get('finished') == 1){
				editBtn.setDisabled(true);
				delBtn.setDisabled(true);
				tabPanel.getActiveTab().getTopToolbar().setDisabled(true);
			}else{
				editBtn.setDisabled(false);
				delBtn.setDisabled(false);
				tabPanel.getActiveTab().getTopToolbar().setDisabled(false);
			}
        }else{
            editBtn.setDisabled(true);
            delBtn.setDisabled(true)
        }
        if(competenceFlag==true){
	        addBtn.setDisabled(false);
	    }else{
	        addBtn.setDisabled(true);
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
    if(competenceFlag==true){
        addBtn.setDisabled(false);
    }else{
        addBtn.setDisabled(true);
    }
    
	function addOrEditOpenbox(){
		if(selectParentid == '0'){
				Ext.example.msg('提示信息','请选择该分类下的合同！');
		    	return ;		
		}		
		var btnId = this.id;
		var record = sm.getSelected();
		var url = BASE_PATH+"Business/wzgl/baseinfo_wzgl/wz.goods.openbox.addorupdate.jsp"
		if(btnId == "addBtn"){
			if(selectUuid == "" || selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
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
				wzbaseinfoMgm.deleteWzOpenbox(uids,function(str){
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
        //附件 
    function filelistFn(value, metadata, record){
		    	        var uidsStr = record.get('uids')
						var downloadStr="";
						var billstate = record.get('finished');
						var count=0;
						var editable = true;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+uidsStr+
				                           "' and transaction_type='"+businessType+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
						if(billstate == 0){
						   downloadStr="附件["+count+"]";
						   editable = true;
						}else{
						   downloadStr="附件["+count+"]";
						   editable = false;
						}	
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessType + '\', ' + editable + ', \''
									+ uidsStr
									+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
					
			}
 ///////////////execel 导入功能 //////////////////////////////////////////////////////////////////////
    function showExcelWin(){
		   fileForm = new Ext.form.FormPanel({
				fileUpload:true,
				labelWidth:30,
				layout:'form',
				baseCls:'x-plain',
				items:[{
					id:'excelfile',
					xtype:'fileuploadfield',
					fieldLabel:'excel',
					buttonText:'excel上传',
					width: 390,
					border:false,
					listeners:{
						'fileselected':function(field,value){
							var _value = value.split('\\')[value.split('\\').length-1]
							if(_value.indexOf('.xls') != -1){
								this.ownerCt.buttons[0].enable()
							}else{
								field.setValue('')
								this.ownerCt.buttons[0].disable()
								Ext.example.msg('警告','请上传excel格式的文件')
							}
						}
					}
				}],
				buttons:[{
					text:'确定',
					iconCls:'upload',
					disabled:true,
					handler:doExcelUpLoad
				}]
			})
		fileWin = new Ext.Window({
				id:'excelWin',
				title:'excel导入',
//				closeAction:'hide',
				modal:true,
				width:460,
				height:100,
				items:[fileForm]
			})
		fileWin.show()
	}
	    
 	function doExcelUpLoad(){
		var win = this.ownerCt.ownerCt;
		var file = this.ownerCt.getForm().findField("excelfile").getValue();
		var selectConid1 = '';
		var uids = smSub.getSelected().get("uids");
 		var openboxId = smSub.getSelected().get("openboxId");
 		if(selectConid == '' || selectConid == null){
 		   selectConid1 = sm.getSelected().get("conid");
 		}else{
 		   selectConid1 = selectConid;
 		}
		this.ownerCt.getForm().submit({
			waitTitle : '请稍候...',
			waitMsg : '数据上传中...',
			url : CONTEXT_PATH + "/servlet/equExcelServlet?ac=equImportExcelData&pid="
			    + CURRENTAPPID+"&subUids="+uids+"&mainUids="+openboxId+"&selectConnid="+selectConid1+"&equOrWz=wzExcel",
			method:'POST',
			params:{
					 ac:'equImportExcelData'
			},
			success : function(form, action) {
				Ext.Msg.alert('恭喜', action.result.msg, function(v) {
							win.close();
							refreshds(uids);
						})
			},
			failure : function(form, action) {
				Ext.Msg.alert('提示', action.result.msg, function(v) {
							win.close();
							refreshds(uids);
						})
			}
		})

		dsPart.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}   
 	function refreshds(uids) {
		dsPart.load({
					params : {
						start : 0,
						limit : PAGE_SIZE,
						params : "openboxSubIs='" + uids+"'"
					}
				});
	}  
	
	function onItemClick(){
		    var sql = "select fileid from APP_FILEINFO where fileid =(select t.fileid from " +
		    		" APP_TEMPLATE t where  t.templatecode='equPartExcelInport' and t.filename like '设备(材料)部件excel导入%')"
		    DWREngine.setAsync(false);
			baseDao.getData(sql,function(list){
			   if(list.length>0){	
			   	     window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+list)
			   }else{
			   	   Ext.Msg.alert('信息提示',"Excel导入模板不存在，请与管理员联系");
			   	   return ;			   	
//			       Ext.Msg.confirm('信息提示',"Excel导入模板不存在，是否上传",function(btn){
//			            if(btn=='yes'){
//			                 uploadTemplate(true);
//			            }else{
//			               return;
//			            }
//			       })
			   }
			})
			 DWREngine.setAsync(false);
	}   
});

function finishOpenbox(uids,finished){
	DWREngine.setAsync(false);
	wzbaseinfoMgm.wzOpenboxFinished(uids,function(str){
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


//显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	fileWin.on("close",function(){
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}


function uploadTemplate(flag) {
	var uploadForm = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 80,
		url : MAIN_SERVLET + "?ac=upload",
		fileUpload : true,
		defaultType : 'textfield',

		items : [{
			xtype : 'textfield',
			fieldLabel : '流水号',
			name : 'fileid1',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '90%' // anchor width by percentage
		}, {
			xtype : 'textfield',
			fieldLabel : '请选择文件',
			name : 'filename1',
			inputType : 'file',
			allowBlank : false,
			// blankText: 'File can\'t not empty.',
			anchor : '90%' // anchor width by percentage
		}]
	});

	var uploadWin = new Ext.Window({
		title : '上传',
		width : 450,
		height : 140,
		minWidth : 300,
		minHeight : 100,
		layout : 'fit',
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		items : uploadForm,
		buttons : [{
			text : '上传',
			handler : function() {
				var filename = uploadForm.form.findField("filename1").getValue()
				if (filename != "") {
					var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
					var fileExt1 = filename.substring(filename.lastIndexOf("\\") + 1,filename.lastIndexOf(".")).toLowerCase();
                    if(fileExt1 != "设备(材料)部件excel导入"){
                        Ext.MessageBox.alert("提示", "请修改上传的Excel文档名称为【<span style='color:red;'>设备(材料)excel导入."+fileExt+"</span>】！");
						return;                   
                    }
					if (allowedDocTypes.indexOf(fileExt) == -1) {
						Ext.MessageBox.alert("提示", "请选择Excel文档！");
						return;
					} else {
						currentFileExt = fileExt
					}
				}
				if (uploadForm.form.isValid()) {
					Ext.MessageBox.show({
						title : '请等待',
						msg : '上传中...',
						progressText : '',
						width : 300,
						progress : true,
						closable : false,
						animEl : 'loading'
					});
					uploadForm.getForm().submit({
						method : 'POST',
						params : {
							ac : 'upload'
						},
						success : function(form, action) {
							tip = Ext.QuickTips.getQuickTip();
							tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;上传成功!','icon-success')
							tip.show();
							Ext.MessageBox.hide();
							uploadWin.hide();
							var rtn = action.result.msg;
							var fileid = rtn[0].fileid;
							var filename = rtn[0].filename;
//							//保存上传后的文档fileid
//                            DWREngine.setAsync(false);
//                            equMgm.saveFile(fileid,uids,bean,function(str){
//                            });
//                            DWREngine.setAsync(true);
							 Ext.example.msg('信息提示','模板上传成功！')
						},
						failure : function() {
							Ext.example.msg('Error', 'File upload failure.');
						}
					})
				}
			}
		}, {
			text : '关闭',
			handler : function() {
				uploadWin.hide();
			}
		}]
	});

	uploadWin.show();
}