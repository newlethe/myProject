var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStock";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";
var jzArr = new Array();
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

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";

var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";
var fileWin;
var selectWin;
var treePanelTemp;

var equTypeArr = new Array();
var unitArr = new Array();
var getEquidstore = new Array();
var ds;
var dsOut;
var smOut;
var tabPanel;
var dsOutSub;
var changeRecord;//更改部件时选中的出库单
var ckStockIds="";//设备主键   用于在库存中过滤出库单已选中的设备
var loadFormRecord = null;//新增出库单  用于选中新增的出库单

var flagaddorupdate=true;
var selTreeuids=new Array();

var billStateArr = new Array();
var bdgArr = new Array();
var moduleFlowType = '';
var gridPanel;
//非主体设备标志
var DATA_TYPE = 'EQUOTHER';
var conPartybNoArr = new Array();

Ext.onReady(function(){
    var gridPanelName = CURRENTAPPID == "1031902"? "设备/材料":"设备";
    if(isFlwTask != true && isFlwView != true){
        DWREngine.setAsync(false);
        //通过配置信息判断该流程是否走审批流程
        systemMgm.getFlowType(USERUNITID,MODID,function (rtn){
            moduleFlowType=rtn;
        });
        DWREngine.setAsync(true);
    }
    
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
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='1030902' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    });
			//按需求要求领用单位能在属性代码中进行维护，由于主体设备中已经存在
	 appMgm.getCodeValue('设备出库领用单位',function(list){
	        for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].propertyCode);	
				temp.push(list[i].propertyName);			
				unitArr.push(temp);
	        }
	    });	
	//存放库位
	baseMgm.getData("select uids,detailed from equ_warehouse where pid='" + CURRENTAPPID
					+ "' order by uids ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					getEquidstore.push(temp);
				}
			})
			
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
	baseMgm.getData("select distinct q.cpid,q.partyb,t.conid from con_ove t,CON_PARTYB q "
					+ " where t.partybno=q.cpid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					conPartybNoArr.push(temp);
				}
			});
	DWREngine.setAsync(true);
	var unitDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],   
		data: unitArr
    });
	var jzDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: jzArr
    });
    //查询表单
    var boxNo = new Ext.form.TextField({
		id: 'boxNo', name: 'boxNo',width : 100
	});
	var equPartName = new Ext.form.TextField({
		id: 'equPartName', name: 'equPartName',width : 100
	});
	var ggxh = new Ext.form.TextField({
		id: 'ggxh', name: 'ggxh',width : 100
	});
	var storage = new Ext.form.TextField({
		id: 'storage', name: 'storage',width : 100
	});
	var doQuery = new Ext.Button({
		text: '查询',
		iconCls: 'btn',
		handler: queHandler
	});
	var queryBtn = new Ext.Button({
		id: 'query1',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow2_,
		scope: this
	});
	var doSelect = new Ext.Button({
		id:"doSelect",
		text: '选择',
		iconCls: 'btn',
		handler: EditHandler
	});
	var editBtn = new Ext.Button({
		id : 'editBtn',
		text : '修改',
		iconCls : 'btn',
		handler : EditHandler
	});
	var delBtn = new Ext.Button({
		text : '删除',
		iconCls : 'remove',
		handler : deleHandler
	});
	var exportExcelBtn = new Ext.Button({
		id : 'export',
		text : '导出数据',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			exportDataFile();
		}
	});
	//主设备台账导出按钮
	var zsbStandingBookExcelBtn = new Ext.Button({
		id : 'zsbStandingBookExport',
		text : '台账导出',
		tooltip : '台账导出',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			zsbStandingBookExportFun();
		}
	})
	//主设备台账导出按钮
	var zsbStandingBookExcelBtn = new Ext.Button({
		id : 'zsbStandingBookExport',
		text : '设备台账',
		tooltip : '设备台账',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			zsbStandingBookExportFun();
		}
	})
	//备品备件台账导出按钮
	var bpbjStandingBookExcelBtn = new Ext.Button({
		id : 'bpbjStandingBookExport',
		text : '备件台账',
		tooltip : '备件台账',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			bpbjStandingBookExportFun();
		}
	})
	//专用工具台账导出按钮
	var zygjStandingBookExcelBtn = new Ext.Button({
		id : 'zygjStandingBookExport',
		text : '工具台账',
		tooltip : '工具台账',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			zygjStandingBookExportFun();
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
			var uids = "";
			var finished = "";
			var modetype = "SB";
			var record = smOut.getSelected();
			if (record != null && record != "") {
				uids = record.get("uids");
				finished = record.get("finished");
			} else {
				Ext.example.msg('提示信息', '请先选择要打印的记录！');
				return;
			}
			// 模板参数，固定值，在 系统管理 -> office模板 中配置
			var filePrintType = "EquGoodsStockOutVGj";
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
				docUrl += "&beanname="+beanOut
				docUrl += "&fileName=设备出库单-设备.doc";
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
					dsOut.reload();
				}
			}
	}	
	/*******************************打印***************************************/
    var backBtn = new Ext.Button({
        id : 'back',
        text : '返回',
        iconCls : 'returnTo',
        hidden : true,
        handler : function() {
            tabPanel.unhideTabStripItem(1);
            tabPanel.setActiveTab(1);
	        backBtn.setVisible(false);
        }
    });
	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
					fields : ['k', 'v'],
					data : getEquidstore
				});
    var storageTreeCombo = new Ext.ux.TreeCombo({
        id : 'storage',
        name : 'storage',
        fieldLabel : '存放库位',
        resizable:true,
        width: 183,
        treeWidth : 300,
        allowBlank : false,
        loader:new Ext.tree.TreeLoader({
            url: MAIN_SERVLET,
            requestMethod: "GET",
            baseParams: {
                ac : "tree",
                treeName:"ckxxTreeNewQuery",
                businessName:"equBaseInfo", 
                parent: '01'
            },
            clearOnLoad: true,
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),
        root:  new Ext.tree.AsyncTreeNode({
            id : "01",
            text: "仓库信息",
            iconCls: 'form',
            expanded:true
        })
    })
	storageTreeCombo.getTree().on('beforeload',function(node){
		var uids = node.id;
		var _parent = 0;
		DWREngine.setAsync(false);
		baseMgm.findById("com.sgepit.pmis.equipment.hbm.EquWarehouse",uids,function(obj){
			_parent = (obj.equid)
		});
		DWREngine.setAsync(true);
		storageTreeCombo.getTree().loader.baseParams.parent = _parent; 
    });
	/*******************************库存start************************************************/
    var fc = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号'
		},	
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同名称'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'stockNum' : {name : 'stockNum',fieldLabel : '库存数量'},
		'weight' : {name : 'weight',fieldLabel : '重量（kg）',decimalPrecision : 3},
		'storage' : {name : 'storage',fieldLabel : '存放库位'}
	};
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([
//		new Ext.grid.RowNumberer({
//			header : '序号',
//			width : 35
//		}),
		sm,
		{
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
			id : 'treeuids',
			header : fc['treeuids'].fieldLabel,
			dataIndex : fc['treeuids'].name,
			hidden : true
		},{
			id : 'boxNo',
			header : fc['boxNo'].fieldLabel,
			dataIndex : fc['boxNo'].name,
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id : 'equType',
			header : fc['equType'].fieldLabel,
			dataIndex : fc['equType'].name,
			renderer : function(v,m,r){
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
			id : 'conid',
			header : fc['conid'].fieldLabel,
			dataIndex : fc['conid'].name,
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
		}, {
			id : 'jzNo',
			header : fc['jzNo'].fieldLabel,
			dataIndex : fc['jzNo'].name,
			align : 'center',
			width : 100	,
			type : 'combo',
			store : jzDs,
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
			header : fc['equPartName'].fieldLabel,
			dataIndex : fc['equPartName'].name,
			align : 'center',
			width : 180,
			type : 'string'
		},{
			id : 'ggxh',
			header : fc['ggxh'].fieldLabel,
			dataIndex : fc['ggxh'].name,
			align : 'center',
			width : 100,
			type : 'string'
		},{
			id : 'graphNo',
			header : fc['graphNo'].fieldLabel,
			dataIndex : fc['graphNo'].name,
			align : 'center',
			type : 'string',
			width : 100
		},{
			id : 'unit',
			header : fc['unit'].fieldLabel,
			dataIndex : fc['unit'].name,
			width : 80
		},{
			id : 'stockNum',
			header : fc['stockNum'].fieldLabel,
			dataIndex : fc['stockNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'weight',
			header : fc['weight'].fieldLabel,
			dataIndex : fc['weight'].name,
			align : 'right',
			width : 80
		},{
			id : 'storage',
			header : fc['storage'].fieldLabel,
			dataIndex : fc['storage'].name,
			type : 'comboTree',
			comboTree:storageTreeCombo,
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
	var Columns = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'conid', type:'string'},
		{name:'treeuids', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'stockNum', type:'float'},
		{name:'weight', type:'float'},
		{name:'jzNo', type:'string'},
		{name:'storage', type:'string'}
	];
	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"' and stockNum>0 and (judgment='equ' or judgment is null)"
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
//    ds.on('load', function(s, r, o) {
//		s.each(function(rec) {
//			if (collection.get(rec.get("uids"))!=null) {
//				sm.selectRecords([rec], true);
//			}
//		});
//		collection.clear();
//	})
//    ds.on("beforeload",function(){
//    	if(ds.baseParams.params!="") ds.baseParams.params+=" and "
//    	if(ckStockIds!=""){//过滤出库单已经选中的设备
//    		ds.baseParams.params+=ckStockIds+" and stockNum>0";
//    	}else{
//    		ds.baseParams.params+=" stockNum>0"
//    	}
//    })
    ds.on("beforeload",function(){
        ds.baseParams.params+=" and stockNum>0 and (judgment='equ' or judgment is null)";
    });
    gridPanel = new Ext.grid.GridPanel({
    	id:"stock",
		ds: ds,
		cm: cm,
		sm:sm,
		title:"库存",
		border: false,
//		tbar: ['<font color=#15428b><B>设备库存<B></font>','-',
//			'<font color=#15428b>箱件号/构件号：</font>', boxNo, '-',
//			'<font color=#15428b>设备部件名称：</font>', equPartName, '-', 
//			'<font color=#15428b>规格型号：</font>', ggxh, '-', 
//			'<font color=#15428b>库位：</font>', storage, '-',
//			doQuery, '-',doSelect,'-'],
		tbar:['<font color=#15428b><B>'+gridPanelName+'库存<B></font>','-',doSelect],
		region: 'center',
		header: false, 
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	/*******************************库存end************************************************/
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
		'using' : {name : 'using',fieldLabel : '领料用途'},
		'recipientsUnitManager' : {name : 'recipientsUnitManager',fieldLabel : '领用单位负责人'},
		'handPerson' : {name : 'handPerson',fieldLabel : '经手人'},
		'shipperNo' : {name : 'shipperNo',fieldLabel : '出门证编号'},
		'proUse' : {name : 'proUse',fieldLabel : '工程部位（工程项目或用途）'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
        ,'billState' : {name : 'billState',fieldLabel : '审批状态'}
        ,'flowid' : {name : 'flowid',fieldLabel : '流程编号'},
        'fileid' : {name : 'fileid',fieldLabel : '单据文档'},
        'equAdjust' : {name : 'equAdjust',fieldLabel : '附件',anchor : '95%'}
	}
	
	smOut = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cmOut = new Ext.grid.ColumnModel([
		//sm,
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
			renderer : function(v,m,r){
				var o = r.get("isInstallation");//是否安装，暂未考虑
	            var b = r.get('billState');
	            var abnormalOrNo = r.get('abnormalOrNo');
	            var str = "<input type='checkbox' "
	                    + (b != 1 || v == 1 ? "disabled title='审批完成后才能完结操作' " : "") + " "
	                    + (v == 1 ? "checked title='已完结' " : "title='未完结'")
	                    + " onclick='finishOut(\"" + r.get("uids") + "\",this)'>"
	            return str;
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
        id:'fileid',
        header:fcOut['fileid'].fieldLabel,
        dataIndex:fcOut['fileid'].name,
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
			header : fcOut['equAdjust'].fieldLabel,
			dataIndex : fcOut['equAdjust'].name,
			align : 'center',
			width : 60,
           	//hidden : (DEPLOY_UNITTYPE == "0")
			renderer :renderEquAdjust
		},{
			id:'using',
			header: fcOut['using'].fieldLabel,
			dataIndex: fcOut['using'].name,
			renderer : function(v){
                var using = "";
                for (var i = 0; i < bdgArr.length; i++) {
                    if (v == bdgArr[i][0])
                        using = bdgArr[i][1];
                }
                return using;
            },
			width : 180
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
		{name : 'using', type : 'string'},
		{name : 'grantDesc', type : 'string'},
		{name : 'recipientsUser', type : 'string'},
		{name : 'recipientsUnitManager', type : 'string'},
		{name : 'handPerson', type : 'string'},
		{name : 'shipperNo', type : 'string'},
		{name : 'proUse', type : 'string'},
		{name : 'remark', type : 'string'}
        ,{name : 'billState', type : 'string'}
        ,{name : 'flowid', type : 'string'},
        {name : 'fileid', type : 'string'}
	];
    

	dsOut = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOut,				
	    	business: businessOut,
	    	method: listMethodOut,
	    	//params: "conid='"+edit_conid+"'"
	    	params: "pid='"+CURRENTAPPID+"'"
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
    // 增加非主体设备过滤条件 pengy 2014-05-14
	dsOut.on('beforeload', function() {
		dsOut.baseParams.params += " and (dataType='" + DATA_TYPE + "' or dataType is null)";
	});

	var gridPanelOut = new Ext.grid.GridPanel({
		ds : dsOut,
		cm : cmOut,
		sm : smOut,
		title : '设备出库单',
		tbar : ['<font color=#15428b><B>'+gridPanelName+'出库单<B></font>','-',
		     editBtn,'-',delBtn,'-',queryBtn,'-',exportExcelBtn,'-',printBtn,'-',zsbStandingBookExcelBtn,'-',bpbjStandingBookExcelBtn,'-',zygjStandingBookExcelBtn],
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
            store: dsOut,
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
	/*******************************出库单基础信息end************************************************/
	/*******************************出库单明细信息start************************************************/
	var fcOutSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号'
		},
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
		'price' : {name : 'price',fieldLabel : '单价'},
		'totalPrice' : {name : 'totalPrice',fieldLabel : '总价'},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
	};
	var smOutSub = new Ext.grid.CheckboxSelectionModel();
	var cmOutSub = new Ext.grid.ColumnModel([
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
			width : 100
		}, 
		{
			id : 'jzNo',
			header : fc['jzNo'].fieldLabel,
			dataIndex : fc['jzNo'].name,
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
			align : 'center',
			width : 180
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
			width : 80
		},{
			id : 'outNum',
			header : fcOutSub['outNum'].fieldLabel,
			dataIndex : fcOutSub['outNum'].name,
			align : 'right',
			width : 80
		},{
			id : 'stockNum',
			header : "库存数量",
			dataIndex:'stockNum',
			align : 'right',
			renderer:function(value,cell,record){
				var stocknum="";
				DWREngine.setAsync(false);
				equMgm.getStockNumFromStock(record.get('stockId'),function(num){
					stocknum=num;
				});
				DWREngine.setAsync(true);
    			return stocknum;
			},
			width : 80
		},{
			id : 'price',
			header : fcOutSub['price'].fieldLabel,
			dataIndex : fcOutSub['price'].name,
			align : 'right',
			width : 80
		},{
			id : 'totalPrice',
			header : fcOutSub['totalPrice'].fieldLabel,
			dataIndex : fcOutSub['totalPrice'].name,
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
		},{
			id : 'kksNo',
			header : fcOutSub['kksNo'].fieldLabel,
			dataIndex : fcOutSub['kksNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'remark',
			header : fcOutSub['remark'].fieldLabel,
			dataIndex : fcOutSub['remark'].name,
			align : 'center',
			width : 120
		}
	]);
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
		{name:'price', type:'float'},
		{name:'totalPrice', type:'float'},
		{name:'jzNo',type:'string'},
		{name:'storage', type:'string'},
		{name:'kksNo', type:'string'},
		{name:'remark', type:'string'}
	];
	dsOutSub = new Ext.data.Store({
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
        dsOut.on('load', function(s, r, o) {
		s.each(function(rec) {
			if(loadFormRecord!=null){//选中新增的出库单
				if (rec.get("uids")==loadFormRecord.get('uids')) {
					smOut.selectRecords([rec], true);
				}
		    }
		});
	})
    var gridPanelOutSub = new Ext.grid.GridPanel({
		ds: dsOutSub,
		cm: cmOutSub,
		sm:smOutSub,
		title:"出库单详细信息",
		border: false,
		region: 'south',
		header: false, 
		height : document.body.clientHeight*0.5,
		stripeRows: true,
		loadMask: true,
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
	var gridOutPanel = new Ext.Panel({
		id:"stockOut",
		title:'出库单',
		layout:'border',
		region: 'center',
		items : [gridPanelOut,gridPanelOutSub]
	});
	tabPanel = new Ext.TabPanel({
		activeTab : 0,
        border: false,
        region: 'center',
		items : [gridPanel,gridOutPanel]
	});
	//支持翻页
	storeSelects(ds,sm);
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [tabPanel]
	});
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [treePanel, contentPanel]
	});
	if(CURRENTAPPID == "1030902"){
		cmOutSub.setHidden(15,false);
		cmOutSub.setHidden(16,false);
	}else{
		cmOutSub.setHidden(15,true);
		cmOutSub.setHidden(16,true);
	}
	gridPanel.getTopToolbar().add('-',{
		id: 'query1',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow1_,
		scope: this
	},'-',backBtn);
	function showWindow1_() {
		if(selectParentid == "0"){
			fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
		}else {
			if(selectTreeid != ''){
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
	function showWindow2_() {
		if(selectParentid == "0"){
			fixedFilterPart = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
		}else {
			if(selectTreeid != ''){
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
        
    ds.load({params:{start:0,limit:PAGE_SIZE}});
    dsOut.load({params:{start:0,limit:PAGE_SIZE}});
    var flowEditFirstShow = false;
    dsOut.on("load",function(){
    	setPermission();
        if(isFlwTask == true && dsOut.getCount() > 0 && dsOut.getCount() == 1){
            //addBtn.setDisabled(true);
        //}else if(isFlwTask != true){
        //    addBtn.setDisabled(false);
            if(!flowEditFirstShow){
	            if(isFlwTask = true && (flowid != null && flowid != "")){
			        //流程中根据流程编号判断该业务数据是否存在,存在则直接根据编号打开编辑窗口
			        DWREngine.setAsync(false);
			        var sql = "select uids from equ_goods_stock_out c where out_no = '"+flowid+"'";
			        baseDao.getData(sql,function(str){
			           if(str!=null && str){
	                        tabPanel.setActiveTab(1);
			                smOut.selectFirstRow();
			                editBtn.getEl().dom.click();
	                        flowEditFirstShow = true;
			           }
			        }); 
			        DWREngine.setAsync(true);   
			    }
            }
            
        }
        if(isFlwView == true){
            //addBtn.setDisabled(true);
            editBtn.setDisabled(true);
            delBtn.setDisabled(true);
            queryBtn.setDisabled(true);
            exportExcelBtn.setDisabled(true);
        }
        if(isFlwTask == true){
            queryBtn.setDisabled(true);
            exportExcelBtn.setDisabled(true);
        }
    });
    
	
	tabPanel.on('tabchange',function(t,tab){
		if(t.activeTab.id=="stock"){
			sm.clearSelections();
		}
	});
    
	smOut.on('rowselect',function(){
//		var record = smOut.getSelected();
//		if(record.get('finished') == 1){
//			editBtn.setDisabled(true);
//			delBtn.setDisabled(true);
//		}else{
//			editBtn.setDisabled(false);
//			delBtn.setDisabled(false);
//		}
//		dsOutSub.baseParams.params = "outId = '"+record.get('uids')+"'";
//		dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
        
        var record = smOut.getSelected();
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
                //addBtn.setDisabled(true);
                editBtn.setDisabled(true);
                delBtn.setDisabled(true);
            }
        }
        dsOutSub.baseParams.params = "outId = '"+record.get('uids')+"' and pid='"+record.get("pid")+"'";
        dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
	});
    //按钮权限设置
	function setPermission(){
		if(ModuleLVL != '1' && ModuleLVL != '2'){
			if(editBtn && delBtn &&doSelect){
				editBtn.setDisabled(true);
				delBtn.setDisabled(true);
				doSelect.setDisabled(true);
			}
		}
	}
    
	function exportDataFile() {
    	//yanglh 2013-10-31  对点击合同分类树导出做过来 
    	var uidsS = '';
    	var sqlS = ''
    	var openUrl = "";
    	//选择到货单后导出该记录的明细
    	var record = smOut.getSelected();
    	if(record != null){
            	   uidsS  = " and  uids in ('"+record.get("uids")+"')";
	               openUrl = CONTEXT_PATH    
		                    + "/servlet/EquServlet?ac=exportData&businessType=StockOutSubList&pid="+CURRENTAPPID+"&uidS="+uidsS;
                   document.all.formAc.action = openUrl;       
			       document.all.formAc.submit();
			       return;
		}
    	//点击合同分类树是导出该节点及节点下的到货单记录明细
    	if((selectParentid == null  || selectParentid == '') && (selectTreeid == null || selectTreeid == '')){
    	     openUrl = CONTEXT_PATH    
				+ "/servlet/EquServlet?ac=exportData&businessType=StockOutSubList&pid="+CURRENTAPPID;	
    	}else{
    	     if(selectParentid == '0'){
    	     	 sqlS =  "select uids from equ_goods_stock_out where conid in (select conid from equ_con_ove_tree_view  where parentid = '"+selectTreeid+"')";
    	     }else{
    	     	if(selectTreeid.indexOf("04")== 0){
    	     	    return;
    	     	}else{
    	     		sqlS  = "select uids from equ_goods_stock_out where treeuids in (select a.uids from ( select t.* from equ_con_ove_tree_view t " +
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
				    + "/servlet/EquServlet?ac=exportData&businessType=StockOutSubList&pid="+CURRENTAPPID+"&uidS="+uidsS;
			}else{
			    Ext.example.msg("信息提示","该分类下没有数据,无法导出！");
			    return;
			}
    	}
		document.all.formAc.action = openUrl;       
		document.all.formAc.submit();
	}
	//模糊查询
	function queHandler(){
		var querywheres=" and stockNum>0 ";
		var qboxNo = boxNo.getValue();
		var qequPartName = equPartName.getValue();
		var qggxh = ggxh.getValue();
		var qstorage = storage.getValue();
		if ('' != qboxNo){
			querywheres += " and boxNo like '%"+qboxNo+"%'";
		}
		if ('' != qequPartName){
			querywheres += " and equPartName like '%"+qequPartName+"%'";
		}
		if ('' != qggxh){
			querywheres += " and ggxh like '%"+qggxh+"%'";
		}
		if ('' != qstorage){
			querywheres += " and storage like '%"+qstorage+"%'";
		}
		if(selectParentid!=null&&selectParentid!=""){
			if(selectParentid == "0"){
				ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"'"+querywheres;
				ds.reload();
			}else{
					//查询当前选中节点的所有子节点主键。
					var sql = "select a.uuid from ( select t.* from equ_type_tree t " +
							" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
							" (SELECT t.treeid from equ_type_tree t where t.uuid = '"+selectUuid+"' " +
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
					ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")"+querywheres;
					ds.reload();
			}
		}else{
			ds.baseParams.params = "pid='"+CURRENTAPPID+"'"+querywheres;
		    ds.reload();
		}
	};
	//修改或选择操作
	function EditHandler() {
		var btnId = this.id;
		var record = smOut.getSelected();
		var url = BASE_PATH
				+ "Business/equipment/equMgm/equ.goods.stock.out.addorupdate.jsp";
		var obj = new Object();// 用于新增出库单
		obj = null;
		var formRecord = Ext.data.Record.create(ColumnsOut);// 用于新增出库单

		if (btnId == "doSelect") {
			if (selectUuid == "" && selectConid == "") {
				Ext.example.msg('提示信息', '请先选择左边的合同分类树！');
				return;
			}
			if (selectUuid != "" && selectConid == "") {
				Ext.example.msg('提示信息', '请先选择该专业下的合同分类！');
				return;
			}
			// var records = sm.getSelections();
			// 支持翻页
			var records = collectionToRecords();

			if (records == null || records.length == 0) {
				Ext.example.msg('提示信息', '请先选择库存中的设备！');
				return;
			}
			var OutSubUids = new Array()
			var sbType = records[0].get('equType');
			for (var i = 0; i < records.length; i++) {
				if (records[i].get('equType') != sbType) {
					Ext.example.msg('提示信息', '请先选择库存中相同设备类型的设备！');
					return;
				}
				OutSubUids.push(records[i].get("uids"));
			}
			// 新增
			if (changeRecord == null || changeRecord == "") {
				var conno;
				DWREngine.setAsync(false);
				baseMgm.findById(beanCon, selectConid, function(obj) {
							conno = obj.conno;
						});
				//获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
//		        var prefix = "";
//		        var sql = "select c.property_name from PROPERTY_CODE c " +
//		                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
//		                " and c.property_code = '"+USERDEPTID+"' ";
//		        DWREngine.setAsync(false);
//		        baseMgm.getData(sql, function(str){
//		            prefix = str.toString();
//		        });
//		        DWREngine.setAsync(true);
				// 处理出库单号
				var newCkNo = conno + "-CK-";
				var ckuids = "";
//				equMgm.getEquNewDhNo(CURRENTAPPID, newCkNo, "out_No",
//						"equ_goods_stock_out", null, function(str) {
//							newCkNo = str;
//						});
				equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newCkNo,"out_No","equ_goods_stock_out",null,"data_type='EQUOTHER'",function(str){
						newCkNo = str;
				});
				DWREngine.setAsync(true);
				var conPartybNos =  "";
				for (var i = 0; i < conPartybNoArr.length; i++) {
					if (selectConid == conPartybNoArr[i][2]) {
						conPartybNos = conPartybNoArr[i][0]
						break;
					}
				}
				var bill = "1";
				/*
				 * 1.不设置走流程，状态直接是 已审批(1) 2.设置走流程，但是不在流程中，状态还是为已审批(1)
				 * 3.设置走流程，并且是在流程中，状态为新建(0) 然后控制完结的操作，只能针对已审批的单据进行完结
				 */
				if (isFlwTask == true)
					bill = "0"
				obj = {
					uids : '',
					pid : CURRENTAPPID,
					conid : selectConid,
					treeuids : selectUuid,
					finished : 0,
					isInstallation : 0,
					outNo : isFlwTask == true ? flowid : newCkNo,
					outDate : new Date(),
					recipientsUnit : '',
					using : '',
					grantDesc : '',
					recipientsUser : '',
					recipientsUnitManager : '',
					handPerson : REALNAME,
					shipperNo : '',
					proUse : '',
					remark : '',
					billState : bill,
					flowid : isFlwTask == true ? flowid : newCkNo,
					dataType : DATA_TYPE,
					type : '正式出库',
					createMan : USERID ,
	                createUnit : USERDEPTID,
	                conPartybNo : conPartybNos.toString()
				}
				DWREngine.setAsync(false);
				equMgm.addOrUpdateEquOut(obj, function(str) {
							ckuids = str;
						});
				DWREngine.setAsync(true);
				obj.uids = ckuids;
				DWREngine.setAsync(false);
				equMgm.insertOutSubFromStock(OutSubUids,ckuids,newCkNo,"nobody",function(str){
	    			if(str == "1"){
	    				Ext.example.msg('提示信息','出库单设备选择成功！');
	    				url += "?conid="+selectConid+"&treeuids="+selectUuid+"&uids="+ckuids;
	    			}else{
	    				Ext.example.msg('提示信息','出库单设备选择失败！');
	    			}
	    		});
				DWREngine.setAsync(true);
			} else {// 修改
				DWREngine.setAsync(false);
				equMgm.insertOutSubFromStock(OutSubUids, changeRecord.get('uids'), changeRecord.get('outNo'),
						"nobody", function(str) {
							if (str == "1") {
								Ext.example.msg('提示信息', '出库单设备选择成功！');
								url += "?conid=" + selectConid + "&treeuids=" + selectUuid + "&uids="
										+ changeRecord.get('uids');
							} else {
								Ext.example.msg('提示信息', '出库单设备选择失败！');
							}
						});
				DWREngine.setAsync(true);
			}
		} else {
			if (record == null) {
				Ext.example.msg('提示信息', '请先选择一条出库单！');
				return;
			}
			url += "?conid=" + record.get("conid") + "&treeuids=" + record.get("treeuids") + "&uids=" + record.get("uids");
		}

		if (isFlwTask == true) {
			url += "&isTask=true";
			if (flowid != "")
				url += "&flowid=" + flowid;
		}

		url += "&moduleFlowType=" + moduleFlowType;

		if (selectWin) {
			selectWin.destroy();
		}
		selectWin = new Ext.Window({
			id : 'selectwin',
			width : 950,
			height : document.body.clientHeight - 20,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
			closeAction : "hide",
			closable : false,
			maximizable : true,
			html : "<iframe id='equOut' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(p) {
					flagaddorupdate = false;
					changeRecord = smOut.getSelected();
					tabPanel.hideTabStripItem(1);
					backBtn.setVisible(true);
					var subSql = "select s.stock_id,s.equ_type from equ_goods_stock_out_sub s where s.out_id='"
							+ changeRecord.get('uids') + "'";
					var tempequtype = "";// 已经选择的设备类型
					var cktreeuids = "";// 已经选择的设备主键
					DWREngine.setAsync(false);
					baseDao.getData(subSql, function(list) {
								for (i = 0; i < list.length; i++) {
									cktreeuids += ",'" + list[i][0] + "'";
									tempequtype = list[i][1];
								}
							});
					DWREngine.setAsync(true);
					cktreeuids = cktreeuids.substring(1);
					if (cktreeuids != "") {
						ckStockIds = " uids not in (" + cktreeuids
								+ ") and equ_type='" + tempequtype + "'";
					}
					selectUuid = changeRecord.get('treeuids');// 根据出库单获得的设备合同分类树主键
					selectConid = changeRecord.get('conid');// 根据出库单获得的设备合同主键
					var sql = "select a.uuid from ( select t.* from equ_type_tree t "
							+ " where t.conid = '" + selectConid + "' ) a start with a.treeid = "
							+ " (SELECT t.treeid from equ_type_tree t where t.uuid = '"
							+ selectUuid + "' and a.conid = '" + selectConid
							+ "') connect by PRIOR  a.treeid =  a.parentid";
					var treeuuidstr = "";
					DWREngine.setAsync(false);
					baseDao.getData(sql, function(list) {
								for (i = 0; i < list.length; i++) {
									treeuuidstr += ",'" + list[i] + "'";
									selTreeuids.push(list[i]);
								}
							});
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					ds.baseParams.params = "pid='" + CURRENTAPPID + "' and conid='" + selectConid + "' ";
					if (treeuuidstr != "") {
						ds.baseParams.params += " and treeuids in (" + treeuuidstr + ") and stockNum>0";
					}
					if (ckStockIds != "") {
						ds.baseParams.params += " and " + ckStockIds + " and stockNum>0";
					}
					ds.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
					dsOut.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				},
				'hide' : function(t) {
					flagaddorupdate = true;
					if (selectTreeid == "") {
						selectUuid = "";
						selectConid = "";
					}
					changeRecord = null;
					loadFormRecord = null;
					var templength = selTreeuids.length;
					selTreeuids.splice(0, templength);
					ckStockIds = "";
					ds.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
					dsOut.reload();
					dsOutSub.reload();
					queHandler();
				},
				'show' : function() {
					equOut.location.href = url;
				},
				'beforeshow' : function() {
					tabPanel.unhideTabStripItem(1);
					tabPanel.setActiveTab(1);
					if (obj != null) {
						loadFormRecord = new formRecord(obj);
					}
					dsOut.reload();
				}
			}
		});
		selectWin.show();
	};

	function deleHandler(){
		var record = smOut.getSelected();
		if(!record){
			return Ext.example.msg('提示信息','请先选择要删除的出库单！');
		}
		Ext.Msg.show({
				title : '提示',
				msg : '是否删除该出库单及其出库详细信息？',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						gridPanelOut.getEl().mask("loading...");
						equMgm.deleteOutAndOutSub(record.get('uids'), "EQUOTHER", function(flag) {
							if ("0" == flag) {
								Ext.example.msg('删除成功！',
										'您成功删除了该出库单信息！');
								dsOut.reload();
								ds.reload();
								if((dsOut.getTotalCount()-1)>0){
									smOut.selectRow(0);
								}else{
									dsOutSub.removeAll();
								}
							} else{
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							gridPanelOut.getEl().unmask();
						});
					}
				}
			});
	}
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
});
function finishOut(uids,finished){
	if(ModuleLVL != '1' && ModuleLVL !='2' ){
		finished.checked = !finished.checked;
		Ext.example.msg('提示信息', '此用户没有权限进行完结操作！');
		return;
	}
	Ext.Msg.show({
		title : '提示',
		msg : '完结后不可取消，不可编辑，确认要完结吗？',
		buttons : Ext.Msg.YESNO,
		icon : Ext.MessageBox.QUESTION,
		fn : function(value) {
			if ("yes" == value) {
				DWREngine.setAsync(false);
				equMgm.equOutFinished(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','出库单完结操作成功！');
						//finished.checked = true;
						//dsOut.reload();
                        //if(finished.checked)
                        //   finishTaskEdit();
                        dsOut.load({params:{start:0,limit:PAGE_SIZE}});
					}else if(str == "2"){
						Ext.example.msg('提示信息','该出库单已经开始安装，不能取消完结！');
						finished.checked = false;
					}else{
						Ext.example.msg('提示信息','操作出错！');
						finished.checked = false;
					}
				});
				DWREngine.setAsync(true);
			}else{
				finished.checked = false;
			}
		}
	});
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

function flowToNext(){
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
					title : "设备出库单附件",
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
	//主设备台账
function zsbStandingBookExportFun(){
	standingBookExportFun("01","equStockOutZsbTz")
}
function bpbjStandingBookExportFun(){
	standingBookExportFun("02","equStockOutBpbjTz")
}
function zygjStandingBookExportFun(){
	standingBookExportFun("03","equStockOutZygjTz")
}
function standingBookExportFun(exportType,businessType){
	var exportWhere="";
	var sql="select t.uids from equ_con_ove_tree_view t where  t.treeid like '"+exportType+"%'";
	if((selectParentid == null  || selectParentid == '') && (selectTreeid == null || selectTreeid == '')){
		sql="select t.uids from equ_con_ove_tree_view t where  t.treeid like '"+exportType+"%'";
	}else{
		if(selectParentid == "0"){
	         sql+= " and t.conid in (select conid from Equ_Con_Ove_Tree_View  where parentid = '"+selectTreeid+"' )";
		}else{
			sql+= " and t.conid='"+selectConid+"'";
		}
	}
	exportWhere  = " and  treeuids in ("+sql+")";
	var openUrl = CONTEXT_PATH    
				+ "/servlet/EquServlet?ac=exportData&businessType="+businessType+"&pid="+CURRENTAPPID+"&uidS="+encodeURI(encodeURI(exportWhere));
	document.all.formAc.action = openUrl;       
	document.all.formAc.submit();
}