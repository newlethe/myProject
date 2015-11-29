var beanOut = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOut";
var businessOut = "baseMgm";
var listMethodOut = "findWhereOrderby";
var primaryKeyOut = "uids";
var orderColumnOut = "outDate";

var beanOutSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub";
var businessOutSub = "baseMgm";
var listMethodOutSub = "findWhereOrderby";
var primaryKeyOutSub = "uids";
var orderColumnOutSub = "uids";

var beanIns = "com.sgepit.pmis.equipment.hbm.EquGoodsInstallInfo";
var businessIns = "baseMgm";
var listMethodIns = "findWhereOrderby";
var primaryKeyIns = "uids";
var orderColumnIns = "uids";

var root;
var treeLoader;
var treePanel;
var selectTreeid = '';
var selectParentid = '';
var selectConid = '';
var treeuuidstr;
var selectUuid = '';

var jzArr = new Array();
var equTypeArr = new Array();
var unitArr = new Array();
var getEquidstore = new Array();
var conArr=new Array();
var insTotal='';

Ext.onReady(function(){
	/*******************************设备合同分类树start************************************************/
	root = new Ext.tree.AsyncTreeNode({
        id : "0",
        text: "设备合同分类树",
        iconCls: 'form'
    })
    var roothide = false;
    
    //流程中，根据选择的合同编号显示合同树
    var flowsort,flowsortname,flowconid,flowconname;
    if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && (flowconno != null && flowconno != "")){
        DWREngine.setAsync(false);
        baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conno='"+flowconno+"'", function(conList){
            flowsort = conList[0].sort;
            flowconid = conList[0].conid;
            flowconname = conList[0].conname;
        });
        roothide = true;
        //流程中，当前合同二级分类为根节点
        var sql = "SELECT C.Property_Name FROM PROPERTY_CODE C " +
                "WHERE C.TYPE_NAME = (SELECT T.UIDS FROM PROPERTY_TYPE T WHERE T.TYPE_NAME = '设备合同') " +
                "AND C.PROPERTY_CODE = '"+flowsort+"'";
        baseDao.getData(sql,function(str){
            flowsortname = str;
        })
        DWREngine.setAsync(true);
		root = new Ext.tree.AsyncTreeNode({
			id : flowsort,
			text: flowsortname,
			treeid : flowsort,
			conid : flowconid,
			expanded : true,
			iconCls: 'form'
		});
    }
    
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"newEquTypeTreeList", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanel = new Ext.tree.ColumnTree({
        region: 'west',
        width: 240,
        minSize: 240,
        maxSize: 550,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: roothide,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }],
		columns:[{
            header: '设备合同分类树',
            width: 540,
            dataIndex: 'treename'
        },{
            header: '设备合同分类树主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: treeLoader,
        root: root
	});

	treePanel.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid=node.attributes.conid;
		if (treeid == null){
			treeid = "0";
			conid="";
		}
		treePanel.loader.baseParams.parent = treeid+SPLITB+"04";
		treePanel.loader.baseParams.conid = conid;
	});
	
	treePanel.on('click', onClick);

	function onClick(node, e){
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
        if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true)){
            isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
            selectTreeid = isRoot ? flowconno : elNode.all("treeid").innerText;
            selectUuid = isRoot ? "0" : elNode.all("uids").innerText;
            selectConid = isRoot ? flowconid : elNode.all("conid").innerText;
            selectParentid = isRoot ? "0" : elNode.all("parentid").innerText;
        }else{
            isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
            selectTreeid = isRoot ? "0" : elNode.all("treeid").innerText;
            selectUuid = isRoot ? "0" : elNode.all("uids").innerText;
            selectConid = isRoot ? "0" : elNode.all("conid").innerText;
            selectParentid = isRoot ? "" : elNode.all("parentid").innerText;
        }
		if(selectParentid == "0"){
            if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )"+" and flowid='"+flowid+"'  and finished = '1'";
            }else{
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' ) and finished = '1'";
            }
            dsOut.load({params:{start:0,limit:PAGE_SIZE}});
            if(dsOutSub)dsOutSub.removeAll();
		}else{			//查询当前选中节点的所有子节点主键。
			var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
					" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
					" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
					" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
			treeuuidstr = "";
			DWREngine.setAsync(false);
			baseDao.getData(sql,function(list){
				for(i = 0; i < list.length; i++) {
					treeuuidstr += ",'"+list[i]+"'";		
				}
			});	
			DWREngine.setAsync(true);
			treeuuidstr = treeuuidstr.substring(1);
            if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")"+" and flowid='"+flowid+"' and finished = '1'";
            }else{
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+") and finished = '1'";
            }
			dsOut.load({params:{start:0,limit:PAGE_SIZE}});
			if(dsOutSub)dsOutSub.removeAll();
		}
	}
	/*******************************设备合同分类树end************************************************/
	DWREngine.setAsync(false);
	//机组号
	appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			jzArr.push(temp);			
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
	//领用单位
	var sql = "select unitid,unitname from sgcc_ini_unit t where t.unit_type_id ='7'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			unitArr.push(temp);			
		}
	});
	//存放库位
	baseMgm.getData("select uids,equno from equ_warehouse where pid='"+CURRENTAPPID+"' order by uids",function(list){
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			getEquidstore.push(temp);
		}
	});
	//合同列表
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
	
	var unitDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],   
		data: unitArr
    });
	var queryBtn = new Ext.Button({
		id: 'query1',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow2_,
		scope: this
	});
	var exportExcelBtn = new Ext.Button({
		id : 'export',
		text : '导出数据',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : exportDataFile
	});

	/*******************************出库单基础信息start************************************************/
	var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isInstallation' : {name : 'isInstallation',fieldLabel : '已安装'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'outDate' : {name : 'outDate',fieldLabel : '出库日期'},
		'recipientsUnit' : {name : 'recipientsUnit',fieldLabel : '领用单位'},
		'grantDesc' : {name : 'grantDesc',fieldLabel : '发放描述'},
		'recipientsUser' : {name : 'recipientsUser',fieldLabel : '领用人'},
		'recipientsUnitManager' : {name : 'recipientsUnitManager',fieldLabel : '领用单位负责人'},
		'handPerson' : {name : 'handPerson',fieldLabel : '经手人'},
		'shipperNo' : {name : 'shipperNo',fieldLabel : '出门证编号'},
		'proUse' : {name : 'proUse',fieldLabel : '工程部位（工程项目或用途）'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
		'billState' : {name : 'billState',fieldLabel : '审批状态'},
		'flowid' : {name : 'flowid',fieldLabel : '流程编号'}
	}
	
	var smOut = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cmOut = new Ext.grid.ColumnModel([
		{
			id:'uids',
			header: fcOut['uids'].fieldLabel,
			dataIndex: fcOut['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fcOut['pid'].fieldLabel,
			dataIndex: fcOut['pid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fcOut['treeuids'].fieldLabel,
			dataIndex: fcOut['treeuids'].name,
			hidden: true
        },{
			id:'billState',
			header: fcOut['billState'].fieldLabel,
			dataIndex: fcOut['billState'].name,
			renderer : function(v){
				return "已审批";
			},
			align : 'center',
			hidden : true,
			width : 70
	    },{
			//隐藏，目前与出库单据号相同，点击合同树节点后会使用此字段过滤
			id:'flowid',
			header: fcOut['flowid'].fieldLabel,
			dataIndex: fcOut['flowid'].name,
			hidden : true,
			width : 180
		},{
			id:'finished',
			header: fcOut['finished'].fieldLabel,
			dataIndex: fcOut['finished'].name,
			renderer : function(v){
	            return "<input type='checkbox' title='已完结' checked disabled>";
			},
			width : 40
		},{
			id:'isInstallation',
			header:fcOut['isInstallation'].fieldLabel,
			dataIndex: fcOut['isInstallation'].name,
			hidden: true
		},{
			id:'outNo',
			header: fcOut['outNo'].fieldLabel,
			dataIndex: fcOut['outNo'].name,
			width : 180,
			type : 'string'
		},{
			id:'outDate',
			header: fcOut['outDate'].fieldLabel,
			dataIndex: fcOut['outDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'conid',
			header: fcOut['conid'].fieldLabel,
			dataIndex: fcOut['conid'].name,
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
			id:'recipientsUnit',
			header: fcOut['recipientsUnit'].fieldLabel,
			dataIndex: fcOut['recipientsUnit'].name,
			store:unitDs,
			renderer : function(v){
				var unit = "";
				for(var i=0;i<unitArr.length;i++){
					if(v == unitArr[i][0])
						unit = unitArr[i][1];
				}
				return unit;
			},
			width : 180,
			type : 'combo'
		},{
			id:'grantDesc',
			header: fcOut['grantDesc'].fieldLabel,
			dataIndex: fcOut['grantDesc'].name,
			width : 180
		},{
			id:'recipientsUser',
			header: fcOut['recipientsUser'].fieldLabel,
			dataIndex: fcOut['recipientsUser'].name,
			width : 160,
			type : 'string'
		},{
			id:'recipientsUnitManager',
			header: fcOut['recipientsUnitManager'].fieldLabel,
			dataIndex: fcOut['recipientsUnitManager'].name,
			width : 160
		},{
			id:'handPerson',
			header: fcOut['handPerson'].fieldLabel,
			dataIndex: fcOut['handPerson'].name,
			width : 160,
			type : 'string'
		},{
			id:'shipperNo',
			header: fcOut['shipperNo'].fieldLabel,
			dataIndex: fcOut['shipperNo'].name,
			width : 160
		},{
			id:'proUse',
			header: fcOut['proUse'].fieldLabel,
			dataIndex: fcOut['proUse'].name,
			width : 160
		},{
			id:'remark',
			header: fcOut['remark'].fieldLabel,
			dataIndex: fcOut['remark'].name,
			width : 180
		}
	]);

	cmOut.defaultSortable = true; // 设置是否可排序

	var ColumnsOut = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isInstallation', type : 'float'},
		{name : 'outNo', type : 'string'},
		{name : 'outDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'recipientsUnit', type : 'string'},
		{name : 'grantDesc', type : 'string'},
		{name : 'recipientsUser', type : 'string'},
		{name : 'recipientsUnitManager', type : 'string'},
		{name : 'handPerson', type : 'string'},
		{name : 'shipperNo', type : 'string'},
		{name : 'proUse', type : 'string'},
		{name : 'remark', type : 'string'},
		{name : 'billState', type : 'string'},
		{name : 'flowid', type : 'string'}
	];

	var dsOut = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: beanOut,				
			business: businessOut,
			method: listMethodOut,
			params: "pid='"+CURRENTAPPID+"' and finished = '1'"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: primaryKeyOut
		}, ColumnsOut),
		remoteSort: true,
		pruneModifiedRecords: true	
	});
    dsOut.setDefaultSort(orderColumnOut, 'desc');

	var gridPanelOut = new Ext.grid.GridPanel({
		ds : dsOut,
		cm : cmOut,
		sm : smOut,
		title : '设备出库单',
		tbar : ['<font color=#15428b><B>设备出库单<B></font>','-',queryBtn,'-',exportExcelBtn],
		header: false,
	    border: false,
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsOut,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	/*******************************出库单基础信息end************************************************/
	/*******************************出库单明细信息start************************************************/
	var fcOutSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'jzNo' : {name : 'jzNo',fieldLabel : '机组号'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '设备库存主键'},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'outNum' : {name : 'outNum',fieldLabel : '出库数量'},
		'storage' : {name : 'storage',fieldLabel : '存放库位'}
	};
	var smOutSub = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	var cmOutSub = new Ext.grid.ColumnModel([
		smOutSub,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
			{
			id : 'uids',
			header : fcOutSub['uids'].fieldLabel,
			dataIndex : fcOutSub['uids'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcOutSub['pid'].fieldLabel,
			dataIndex : fcOutSub['pid'].name,
			hidden : true
		},{
			id : 'stockId',
			header : fcOutSub['stockId'].fieldLabel,
			dataIndex : fcOutSub['stockId'].name,
			hidden : true
		},{
			id : 'outId',
			header : fcOutSub['outId'].fieldLabel,
			dataIndex : fcOutSub['outId'].name,
			hidden : true
		},{
			id : 'outNo',
			header : fcOutSub['outNo'].fieldLabel,
			dataIndex : fcOutSub['outNo'].name,
			hidden : true
		},{
			id : 'boxNo',
			header : fcOutSub['boxNo'].fieldLabel,
			dataIndex : fcOutSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'equType',
			header : fcOutSub['equType'].fieldLabel,
			dataIndex : fcOutSub['equType'].name,
			renderer : function(v,m,r){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			align : 'center',
			width : 80
		},{
			id : 'jzNo',
			header : fcOutSub['jzNo'].fieldLabel,
			dataIndex : fcOutSub['jzNo'].name,
			align : 'center',
			width : 100	,
			renderer : function(v){
				var jz = "";
				for(var i=0;i<jzArr.length;i++){
					if(v == jzArr[i][0])
						jz = jzArr[i][1];
				}
				return jz;
			}
		},{
			id : 'equPartName',
			header : fcOutSub['equPartName'].fieldLabel,
			dataIndex : fcOutSub['equPartName'].name,
			align : 'center'
		},{
			id : 'ggxh',
			header : fcOutSub['ggxh'].fieldLabel,
			dataIndex : fcOutSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcOutSub['graphNo'].fieldLabel,
			dataIndex : fcOutSub['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcOutSub['unit'].fieldLabel,
			dataIndex : fcOutSub['unit'].name,
			align : 'center',
			width : 60
		},{
			id : 'outNum',
			header : fcOutSub['outNum'].fieldLabel,
			dataIndex : fcOutSub['outNum'].name,
			align : 'right',
			width : 70
		},{
			id : 'insTotal',
			header : "已安装数量",
			dataIndex : 'insTotal',
			renderer:function(value,cell,record){
				var insTotals =0;
				DWREngine.setAsync(false);
				var sql = "select NVL(SUM(t.INSNUMBER),0) from EQU_GOODS_INSTALL_INFO t where t.PID ='"+CURRENTAPPID+"' and t.STOCKOUTSUB='"+record.data.uids+"'";
				baseDao.getData(sql,function(list){
					if(list.length ==1)
						insTotals = list[0];	
				});
				DWREngine.setAsync(true);
				if(insTotals == 0){
					return '<span style="color:#000000;"><b>'+insTotals+'</b></span>';
				}else if(insTotals == record.data.outNum){
					return '<span style="color:#00ff00;"><b>'+insTotals+'</b></span>';
				}else{
					return '<span style="color:#FF8800;"><b>'+insTotals+'</b></span>';
				}
				return insTotals;
			},
			align : 'right',
			width : 80
		},{
			id : 'storage',
			header : fcOutSub['storage'].fieldLabel,
			dataIndex : fcOutSub['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
			align : 'center',
			width : 80
		}
	]);
	cmOutSub.defaultSortable = true; // 设置是否可排序
	var ColumnsOutSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'stockId', type:'string'},
		{name:'outId', type:'string'},
		{name:'outNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'outNum', type:'float'},
		{name:'jzNo',type:'string'},
		{name:'storage', type:'string'}
	];
	var dsOutSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSub,
	    	business: businessOutSub,
	    	method: listMethodOutSub,
	    	params: "pid='"+CURRENTAPPID+"'"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: primaryKeyOutSub
		}, ColumnsOutSub),
		remoteSort: true,
		pruneModifiedRecords: true	
	});
	dsOutSub.setDefaultSort(orderColumnOutSub, 'desc');	//设置默认排序列
    
	var gridPanelOutSub = new Ext.grid.GridPanel({
		ds: dsOutSub,
		cm: cmOutSub,
		sm: smOutSub,
		title: "出库单详细信息",
		border: false,
		region: 'south',
		header: false, 
		height: document.body.clientHeight*0.5,
		stripeRows: true,
		loadMask: true,
		tbar: ['<font color=#15428b><b>出库单详细信息</b></font>',
			'-',
			new Ext.Button({
				text: '增加安装信息',
				tooltip: '增加安装信息',
				iconCls: 'add',
				handler: toInstallInfo,
				scope: this
			})],
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
			store: dsOutSub,
			displayInfo: true,
			displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		})
	});
	/*******************************出库单明细信息end************************************************/
	/*******************************设备安装信息start************************************************/
	function toInstallInfo(){
		var record = smOutSub.getSelected();
		if(record){
			var fm = Ext.form;
			var sm = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
			var fc = {
				'uids' : {name : 'uids', fieldLabel : '主键'},
				'kks' : {name : 'kks', fieldLabel : '设备KKS编码', allowBlank : false},
				'pid' : {name : 'pid', fieldLabel : 'PID'},
				'insDate' : {name : 'insDate', fieldLabel : '安装日期', format: 'Y-m-d', readOnly : true},
				'insSite' : {name : 'insSite', fieldLabel : '安装位置'},
				'insNumber' : {name : 'insNumber', fieldLabel : '安装数量'},
				'insCompany' : {name : 'insCompany', fieldLabel : '安装单位'},
				'insPrincipal' : {name : 'insPrincipal', fieldLabel : '安装责任人'},
				'remark' : {name : 'remark', fieldLabel : '备注'},
				'stockOut' : {name : 'stockOut', fieldLabel : '出库单主键'},
				'stockOutSub' : {name : 'stockOutSub', fieldLabel : '出库单明细主键'}
			};
		
			var cm = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer({
					header : '序号',
					width : 35
				}),{
					id : 'uids',
					header : fc['uids'].fieldLabel,
					dataIndex : fc['uids'].name,
					hidden : true
				}, {
					id : 'pid',
					header : fc['pid'].fieldLabel,
					dataIndex : fc['pid'].name,
					hidden : true
				}, {
					id : 'kks',
					header : fc['kks'].fieldLabel,
					dataIndex : fc['kks'].name,
					editor : new fm.TextField(fc['kks']),
					width : 180
				},{
					id : 'insDate',
					header : fc['insDate'].fieldLabel,
					dataIndex : fc['insDate'].name,
					renderer : formatDate,
					align: 'center',
					editor : new fm.DateField(fc['insDate'])
				},{
					id : 'insSite',
					header : fc['insSite'].fieldLabel,
					dataIndex : fc['insSite'].name,
					editor : new fm.TextField(fc['insSite']),
					align: 'center',
					width : 180
				},{
					id : 'insNumber',
					header : fc['insNumber'].fieldLabel,
					dataIndex : fc['insNumber'].name,
					align: 'center'
				},{
					id : 'insCompany',
					header : fc['insCompany'].fieldLabel,
					dataIndex : fc['insCompany'].name,
					editor : new fm.TextField(fc['insCompany']),
					align: 'center',
					width : 200
				},{
					id : 'insPrincipal',
					header : fc['insPrincipal'].fieldLabel,
					dataIndex : fc['insPrincipal'].name,
					editor : new fm.TextField(fc['insPrincipal']),
					align: 'center'
				},{
					id : 'remark',
					header : fc['remark'].fieldLabel,
					dataIndex : fc['remark'].name,
					editor : new fm.TextField(fc['remark']),
					width : 220
				},{
					id : 'stockOut',
					header : fc['stockOut'].fieldLabel,
					dataIndex : fc['stockOut'].name,
					hidden : true
				},{
					id : 'stockOutSub',
					header : fc['stockOutSub'].fieldLabel,
					dataIndex : fc['stockOutSub'].name,
					hidden : true
				}
			]);
			var Columns = [
				{name: 'uids', type: 'string'},
				{name: 'pid', type: 'string'},
				{name: 'kks', type: 'string'},
				{name: 'insDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
				{name: 'insSite', type: 'string'},
				{name: 'insNumber', type: 'float'},
				{name: 'insCompany', type: 'string'},
		    	{name: 'insPrincipal', type: 'string'},
		    	{name: 'remark', type: 'string'},
		    	{name: 'stockOut', type: 'string'},
		    	{name: 'stockOutSub', type: 'string'}
			];
			var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanIns,
					business : businessIns,
					method : listMethodIns,
					params : "pid='"+CURRENTAPPID+"' and stockOutSub ='"+record.data.uids+"'"
				},
				proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
				reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : primaryKeyIns
				}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
			ds.setDefaultSort(orderColumnIns, 'desc');
			ds.load({params:{start:0,limit:PAGE_SIZE}});
			
			ds.on('load',function(){
				DWREngine.setAsync(false);
				var sql = "select NVL(SUM(t.INSNUMBER),0) from EQU_GOODS_INSTALL_INFO t where t.PID ='"+CURRENTAPPID+"' and t.STOCKOUTSUB='"+record.data.uids+"'";
				baseDao.getData(sql,function(list){
					if(list.length ==1)
						insTotal = list[0];	
				});
				DWREngine.setAsync(true);
				document.getElementById('total').innerHTML = "<B>"+insTotal+"</B>";
				if(insTotal == record.data.outNum){
					Ext.getCmp('add').setDisabled(true);
				}else{
					Ext.getCmp('add').setDisabled(false);
				}
			});
			
			var Plant = Ext.data.Record.create(Columns);
		    var PlantInt = {
				uids : '',
				pid : CURRENTAPPID,
				kks : '',
				insDate : new Date(),
				insSite : '',
				insNumber : 1,
				insCompany : '',
				insPrincipal : '',
				remark : '',
				stockOut : record.data.outId,
				stockOutSub : record.data.uids
			}
			
			var installPanel = new Ext.grid.EditorGridTbarPanel({
				ds : ds,
				cm : cm,
				sm : sm,
				id : 'installPanel',
				title : '设备安装信息',
				clicksToEdit : 2,
				tbar : ['<font color=#15428b><b>设备安装信息</b></font>',
				'-',
				'<font color=#15428b><b>出库数量:&nbsp'+record.data.outNum+'</b></font>',
				'-',
				'<font color=#15428b><b>已安装数量:&nbsp<span id="total">'+insTotal+'</span></b></font>',
				'-'
				],
				saveHandler : function(){
					var records = ds.getModifiedRecords();
					saveInstall(records);
				},
				header: false,
				border: false,
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
				bean : beanIns,
				business : businessIns,
				primaryKey : primaryKeyIns
			});
				
			var selectWin = new Ext.Window({
				width: 1100,
				height: 550,
				modal: true, 
				plain: true, 
				border: false, 
				resizable: false,
				layout: 'fit',
				items:[installPanel],
				html:"<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
				listeners : {
					'close' : function(){
						dsOutSub.reload();
					}
				}
	    	});
			selectWin.show();
		}else {
			Ext.example.msg('提示信息','请先选择出库单详细信息！');
		    return ;
		}
	}
	/*******************************设备安装信息end**************************************************/
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanelOut,gridPanelOutSub]
	});

	var view = new Ext.Viewport({
		layout:'border',
		items: [treePanel, contentPanel]
	});

	function showWindow2_() {
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
		showWindow(gridPanelOut)
	};

    if(isFlwTask == true || isFlwView == true)
		dsOut.baseParams.params = " outNo = '"+flowid+"' "

	dsOut.load({params:{start:0,limit:PAGE_SIZE}});

	smOut.on('rowselect',function(){
		var record = smOut.getSelected();
		var billStateBool = record.get('billState')=='0' ? false : true;
		dsOutSub.baseParams.params = "outId = '"+record.get('uids')+"' and pid='"+record.get("pid")+"'";
		dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
	});
	
	function exportDataFile() {
		var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=StockOutList&pid="+CURRENTAPPID+"&contreeid=";	
		if(selectParentid){
			if(selectParentid == "0"){
				if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
					openUrl += "and conid in (select conid from Equ_Con_Ove_Tree_View where parentid = '"+selectTreeid+"')"+" and flowid='"+flowid+"'";
				}else{
					openUrl += "and conid in (select conid from Equ_Con_Ove_Tree_View where parentid = '"+selectTreeid+"')";
				}
			}else{
				var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
					" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
					" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
					" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
				if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
					openUrl += "and conid='"+selectConid+"' and treeuids in ("+sql+")"+" and flowid='"+flowid+"'";
				}else{
					openUrl += "and conid='"+selectConid+"' and treeuids in ("+sql+")";
				}
			}
		}
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

	function formatDate(value){
		return value ? value.dateFormat('Y-m-d') : '';
	}
	
	function saveInstall(records){
		var sosRec = smOutSub.getSelected();
		var outNum = parseFloat(sosRec.data.outNum);
		var flag = 0;
		//所有修改数据的安装数量之和
		var totalNum = 0;
		//验证一次添加多条数据时，这多条数据之间KKS编码有无重复
		if(records.length >2){
			for (var i = 0; i < records.length; i++) {
				var kksname = records[i].data.kks;
				for (var j = i+1; j < records.length; j++) {
					if(kksname == records[j].data.kks){
						return Ext.example.msg('提示信息','KKS编码重复，请修改！');
					}
				}
			}
		}
		//再将KKS编码和安装数量与数据库数据比较
		for (var i = 0; i < records.length; i++) {
			var kks = records[i].get("kks");
			var num = records[i].get("insNumber");
			totalNum = totalNum + parseFloat(num);
			DWREngine.setAsync(false);
			if(records[i].get("uids")==''){		//新增则判断KKS是否已存在
				var sql = "select t.kks from EQU_GOODS_INSTALL_INFO t where t.kks='"+kks+"'";
				baseDao.getData(sql,function(list){
					if(list.length ==1){
						flag = 1;
					}
				});
			}else{		//修改则要将安装数量之和减去数据原始的安装数量，避免重复计算
				var sql = "select t.insnumber from EQU_GOODS_INSTALL_INFO t where t.uids='"+records[i].get("uids")+"'";
				baseDao.getData(sql,function(list){
					var insnumberOld = list[0];
					totalNum = totalNum - parseFloat(insnumberOld);
				});
			}
			DWREngine.setAsync(true);
			if(flag == 1)
				return Ext.example.msg('提示信息','KKS编码已被使用，请修改！');
			if(totalNum > outNum - insTotal)
				return Ext.example.msg('提示信息','安装数量超出出库数量，请修改！');
		}
		Ext.getCmp('installPanel').defaultSaveHandler();
	}
});

//根据合同号展开树
function expandTreePanelPath(conid){
	var path = "";
	var nodeid = "";
	var sql = "SELECT c.sort,t.treeid FROM EQU_TYPE_TREE T,con_ove c "+
		" WHERE T.CONID = '"+conid+"' AND t.parentid = '0' AND t.conid = c.conid ";
	DWREngine.setAsync(false);
	baseDao.getData(sql,function(list){
		if(list.length > 0){
			nodeie = conid+"-"+list[0][1];
			path ="/0/sort-"+list[0][0]+"/"+conid+"-"+list[0][1]+"/";
			if(isFlwTask == true) path="/"+list[0][0]+"/"+conid+"-"+list[0][1]+"/";
		}
	});
	DWREngine.setAsync(true);
	treePanel.expandPath(path);
	var node = treePanel.getNodeById(nodeid);
		treePanel.on('expand',function(){
			node.firstChild.getPath();
		});
}