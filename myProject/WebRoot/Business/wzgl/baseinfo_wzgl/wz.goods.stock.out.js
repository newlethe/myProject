var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsStock";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var beanOut = "com.sgepit.pmis.wzgl.hbm.WzGoodsStockOut";
var businessOut = "baseMgm";
var listMethodOut = "findWhereOrderby";
var primaryKeyOut = "uids";
var orderColumnOut = "uids";
var quryButton;
var beanOutSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsStockOutSub";
var businessOutSub = "baseMgm";
var listMethodOutSub = "findWhereOrderby";
var primaryKeyOutSub = "uids";
var orderColumnOutSub = "uids";

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";

var selectUuid = "";
var selectConid = edit_conid?edit_conid:'';
var selectTreeid = edit_treeUids?edit_treeUids:'';
var selectParentid = edit_partUids?edit_partUids:'';
var fileWin;
var selectWin;
var businessType='zlMaterial';

var equTypeArr = new Array();
var unitArr = new Array();
var useUnitArr = new Array();
var qcArr = new Array();
var ds;
var dsOut;
var smOut;
var tabPanel;
var dsOutSub;
var smOutSub;
var changeRecord;//更改部件时选中的出库单
var ckStockIds="";//材料主键   用于在库存中过滤出库单已选中的材料
var loadFormRecord = null;//新增出库单  用于选中新增的出库单

var flagaddorupdate=true;
var selTreeuids=new Array();
var equWareArr = new Array();
var userPartArray = new Array();
var pid = CURRENTAPPID;
var allowedDocTypes = "xls,xlsx,doc,docx";

var bdgArr = new Array();
var bodyArr = new Array();
var conPartybNoArr = new Array();
var proacmArr = new Array();//工程量数组

var thisAssetTreeid;
var thisAssetIsleaf;
var assetWin;
var whereSql = "";
//判断当前用户是否是财务部
//var isFinance = (USERDEPTID == '102010105') ? true : false;

Ext.onReady(function(){
	qcWin = new Ext.Window({
        id:'selectqcwin',
        title:'设备清册明细',
        width: 800,
        height: document.body.clientHeight*0.7,
        layout : 'fit',
        border: false, 
        resizable: false,
        closeAction :"hide",
        items : [grid]
    });

	//处理设备仓库下拉框
    DWREngine.setAsync(false);
	DWREngine.beginBatch();
    baseMgm.getData("select e.equ_no,e.equ_name,e.kksno,e.ggxh,e.equ_make,e.remark from equ_goods_qc e where pid='"+CURRENTAPPID+"'",function(list){
	     	for (var i = 0; i < list.length; i++) {
		            var temp = new Array();
		            temp.push(list[i][0]);
		            temp.push(list[i][1]);
		            temp.push(list[i][2]);
		            temp.push(list[i][3]);
		            temp.push(list[i][4]);
		            temp.push(list[i][5]);
		            qcArr.push(temp);
	           }
	     });
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
//			if (list[i][3] == "SBCK")
//				temp.push("设备仓库");
//			else if (list[i][3] == "CLCK")
//				temp.push("材料仓库")
//			else if (list[i][3] == "JGCK")
//				temp.push("建管仓库")
	          equWareArr.push(temp);
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
	if(equTypeArr.length==0){
	    equTypeArr = [['1','主体设备'],['2','备品备件'],['3','专用工具']]
	}
	//出库单位
    appMgm.getCodeValue("主体设备参与单位",function(list){
    	var allDw = ['','全部单位'];
        unitArr.push(allDw);
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode); 
            temp.push(list[i].detailType);           
            unitArr.push(temp);         
        }
    });
    baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    });
	// 把损坏赔偿加入到领料用途中去  yanglh 2013-11-22
	appMgm.getCodeValue("损坏赔偿",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
	        temp.push(list[i].propertyCode);
	        temp.push(list[i].propertyName+"-"+list[i].propertyCode);			
			bdgArr.push(temp);			
		}
	});
    baseMgm.getData("select  treeid,name,isleaf from wz_con_body_tree_view  " +
	 		   "start with  parentid='0' connect by prior treeid=parentid", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            temp.push(list[i][2]);
            bodyArr.push(temp);
        }
    });
	var subjectArr = new Array();//财务科目
	baseDao.getData("select TREEID,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='" + CURRENTAPPID
					+ "'", function(list){
	    for(i = 0; i < list.length; i++) {
	        var temp = new Array();
	        temp.push(list[i][0]);
	        temp.push(list[i][1]);
	        subjectArr.push(temp);
	    }
	});
    baseMgm.getData("select distinct q.cpid,q.partyb,t.conid from con_ove t,CON_PARTYB q " +
    		" where t.partybno= q.cpid", function(list){
	           for (var i = 0; i < list.length; i++) {
		            var temp = new Array();
		            temp.push(list[i][0]);
		            temp.push(list[i][1]);
		            temp.push(list[i][2]);
		            conPartybNoArr.push(temp);
	           }
	    });
	//领用单位  yanglh 2013-09-28 
    appMgm.getCodeValue("领用单位",function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode); 
            temp.push(list[i].propertyName);            
            useUnitArr.push(temp);         
        }
    });
    //安装部位
	baseMgm.getData("select t.treeid,t.fixedname from FACOMP_FIXED_ASSET_LIST t where pid='" + CURRENTAPPID
                    + "' order by treeid ", function(list){
         for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            userPartArray.push(temp);
        }
    });
    baseMgm.getData("select t.PROAPPID,t.PRONO,t.proname from BDG_PROJECT t where pid='" + CURRENTAPPID
                    + "' and prono is not null order by PROAPPID", function(list){
         for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+"-"+list[i][2]);
            proacmArr.push(temp);
        }
    });
	var specialArr = new Array();
	appMgm.getCodeValue("设备专业分类", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					specialArr.push(temp);
				}
			});
	var jzNoArr = new Array();
	appMgm.getCodeValue("机组号", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					jzNoArr.push(temp);
				}
			});
    DWREngine.endBatch();
	DWREngine.setAsync(true);

	var qcStore = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : qcArr
    });
    // 设备仓库系统编码下来框
    var getEquid = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : equWareArr
    });
    //新增参与单位查询
    var unitDs = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : unitArr
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
	var doSelect = new Ext.Button({
		id:"doSelect",
		text: '选择',
		iconCls: 'btn',
        hidden: edit_flagLayout == '' ? false : true,
		handler: EditHandler
	});
	
	var doChooise = new Ext.Button({
		id:"doChoose",
		text: '从暂估出库选择',
		iconCls: 'add',
		disabled: true,
		handler: EditHandler
	});
    var addBtn = new Ext.Button({
        id : 'addBtn',
        text : '新增',
        iconCls : 'add',
        hidden: edit_flagLayout == '' ? true : false,
        handler : addHandler
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

	/*******************************库存start************************************************/
    var fc = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树主键'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号'},
		'equType' : {name : 'equType',fieldLabel : '物资类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '存货名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'stockNum' : {name : 'stockNum',fieldLabel : '库存数量',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）',decimalPrecision:4},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'stockNo' : {name : 'stockNo',fieldLabel : '存货编码'},
		'intoMoney' : {name : 'intoMoney',fieldLabel : '入库单价'},
		'kcMoney' : {name : 'kcMoney',fieldLabel : '库存金额'},
		'joinUnit' : {name : 'joinUnit',fieldLabel: '参与单位'},
		'special' : {name : 'special',fieldLabel : '专业类别'},
        'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
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
			id : 'conid',
			header : fc['conid'].fieldLabel,
			dataIndex : fc['conid'].name,
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
			hidden : true,
			width : 100
		},{
			id : 'stockNo',
			header : fc['stockNo'].fieldLabel,
			dataIndex : fc['stockNo'].name,
			align : 'center',
			width : 140
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
		}, {
			id : 'joinUnit',
			header : fc['joinUnit'].fieldLabel,
			dataIndex : fc['joinUnit'].name,
			align : 'center',
			width : 120,
			renderer : function(v,m,r){
				for(var i = 0; i < unitArr.length; i ++){
                    if(v == ''){
                        return '';
                    }else if(v == unitArr[i][0]){
						return unitArr[i][1];
					}
				}
			},
			hidden : edit_flagLayout !=''?false:true
		},{
			id : 'equPartName',
			header : fc['equPartName'].fieldLabel,
			dataIndex : fc['equPartName'].name,
			align : 'center',
			width : 180
		},{
			id : 'ggxh',
			header : fc['ggxh'].fieldLabel,
			dataIndex : fc['ggxh'].name,
			align : 'center',
			width : 100
		}, {
			id : 'special',
			header : fc['special'].fieldLabel,
			dataIndex : fc['special'].name,
			align : 'center',
			width : 80,
			renderer : function(v){
				for (var i=0; i<specialArr.length; i++){
					if (v == specialArr[i][0]){
						return specialArr[i][1];
					}
				}
			}
		}, {
			id : 'jzNo',
			header : fc['jzNo'].fieldLabel,
			dataIndex : fc['jzNo'].name,
			align : 'center',
			width : 80,
			renderer : function(v){
				for (var i=0; i<jzNoArr.length; i++){
					if (v == jzNoArr[i][0]){
						return jzNoArr[i][1];
					}
				}
			}
		},{
			id : 'graphNo',
			header : fc['graphNo'].fieldLabel,
			dataIndex : fc['graphNo'].name,
			align : 'center',
            hidden : true,
			width : 100
		},{
			id : 'unit',
			header : fc['unit'].fieldLabel,
			dataIndex : fc['unit'].name,
			align : 'center',
			width : 80
		},{
			id : 'intoMoney',
			header : fc['intoMoney'].fieldLabel,
			dataIndex : fc['intoMoney'].name,
			align : 'right',
			renderer : function(v) {
				return isNaN(v) ? parseFloat(v, 10).toFixed(2) : v.toFixed(2);
			},
			hidden : true,
			width : 80
		},{
			id : 'kcMoney',
			header : fc['kcMoney'].fieldLabel,
			dataIndex : fc['kcMoney'].name,
			align : 'right',
			hidden : edit_flagLayout !=''?false:true,
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
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<equWareArr.length;i++){
					if(v == equWareArr[i][0])
						storage = equWareArr[i][3]+"-"+ equWareArr[i][2];
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
		{name:'storage', type:'string'},
		{name:'stockNo',type:'string'},
		{name:'intoMoney',type:'float'},
		{name:'kcMoney',type:'float'},
		{name:'joinUnit',type:'string'},
		{name:'special',type:'string'},
		{name:'jzNo',type:'string'}
	];
	if(edit_flagLayout==''){
	   whereSql = " and judgmentFlag ='noBody'";
//	   doChooise.hide ();
	   doChooise.setDisabled(true);
	}else{
	   whereSql = " and judgmentFlag ='body' and conid='"+selectConid+"'";
	   //doChooise.show();
//	   doChooise.hide ();
	   doChooise.setDisabled(true);
	}
	
	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: "stockNum<>0 and pid='"+CURRENTAPPID+"'" + whereSql// +" and makeType='正式入库'"
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
    cm.defaultSortable = true;
//    ds.on('load', function(s, r, o) {
//		s.each(function(rec) {
//			if (collection.get(rec.get("uids"))!=null) {
//				sm.selectRecords([rec], true);
//			}
//		});
//		collection.clear();
//	})
    ds.on("beforeload",function(){
    	if(ckStockIds!=""){//过滤出库单已经选中的材料
    		ds.baseParams.params+=ckStockIds;
    	}
    })

    // 新增参与单位查询 yanglh 2013-11-20
    var unitBoxNo = new Ext.form.ComboBox({
		id: 'joinUnit', name: 'joinUnit',width : 80,
		fieldLabel : '参与单位', 
		valueField: 'k',
		displayField: 'v',
		mode: 'local',
		editable : true,
		emptyText : '请输入或者下拉选择....',
		typeAhead: true,
		triggerAction: 'all', 
		store: unitDs,
		width : 160
	});
	var unitDoQuery = new Ext.Button({
		text: '查询',
		iconCls: 'btn',
		handler: queryHandler
	});
	var tbars = '';
	if(edit_flagLayout != ''){
		tbars = ['<font color=#15428b><B>库存信息<B></font>','-',
					'<font color=#15428b>规格型号：</font>', ggxh, '-', 
					doQuery, /*'-',doSelect,*/'-',doChooise,'-',
					'<font color=#15428b>参与单位：</font>', unitBoxNo, '-',unitDoQuery
					]
	}else{
		tbars = ['<font color=#15428b><B>库存信息<B></font>','-',
					'<font color=#15428b>规格型号：</font>', ggxh, '-', 
					doQuery,'-',doSelect,'-'//,doChooise
					]	
	}
    var gridPanel = new Ext.grid.GridPanel({
    	id:"stock",
		ds: ds,
		cm: cm,
		sm:sm,
		title:"库存",
		border: false,
		tbar: tbars,
		ebableHdMenu : false,	
		region: 'center',
		header: false, 
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: edit_flagLayout==''?false:true,
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
    
    storeSelects(ds,sm);
	/*******************************库存end************************************************/
	/*******************************出库单基础信息start************************************************/
	var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '材料合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isInstallation' : {name : 'isInstallation',fieldLabel : '已安装'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'outDate' : {name : 'outDate',fieldLabel : '出库日期'},
		'recipientsUnit' : {name : 'recipientsUnit',fieldLabel : '出库单位'},
		'grantDesc' : {name : 'grantDesc',fieldLabel : '发放描述'},
		'recipientsUser' : {name : 'recipientsUser',fieldLabel : '领用人'},
		'recipientsUnitManager' : {name : 'recipientsUnitManager',fieldLabel : '领用单位负责人'},
		'handPerson' : {name : 'handPerson',fieldLabel : '经手人'},
		'shipperNo' : {name : 'shipperNo',fieldLabel : '出门证编号'},
		'proUse' : {name : 'proUse',fieldLabel : '工程部位（工程项目或用途）'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
        
        'equid' : {name : 'equid', fieldLabel : '仓库号'},
        'fileid' : {name : 'fileid',fieldLabel : '出库单'},
        'using' : {name : 'using',fieldLabel : '领料用途'},
        'equname' : {name : 'equname',fieldLabel : '材料名称'},
        'outBackNo' : {name : 'outBackNo',fieldLabel : '冲回出库单据号'},
        'outEstimateNo' : {name : 'outEstimateNo',fieldLabel : '暂估出库单据号'},
        'type' :  {name : 'type',fieldLabel : '出库类型'},
        'judgmentFlag' : {name : 'judgmentFlag', fieldLabel : '设备出入库类型' },
        'kks' : {name : 'kks',fieldLabel : 'KKS编码'},
        'userPart' : {name : 'userPart',fieldLabel : '安装部位'}
        
        ,'createMan':{name : 'createMan',fieldLabel : '创建人'}
        ,'createUnit':{name : 'createUnit',fieldLabel : '创建单位'}
        ,'installationBody' : {name : 'installationBody',fieldLabel : '安装主体设备（建筑物）'}
        ,'financialSubjects' : {name : 'financialSubjects' ,fieldLabel : '对应财务科目'}
        ,'subjectAllname' : {name : 'subjectAllname' ,fieldLabel : '凭证财务科目'}
        ,'conPartybNo' : {name : 'conPartybNo' ,fieldLabel : '供货单位'}
        ,'useUnit' : { name : 'useUnit', fieldLabel : '领用单位'}
		,'finishMark' : { name : 'finishMark', fieldLabel : '暂估冲回完结'}
		,'relateProacm' : { name : 'relateProacm', fieldLabel : '关联工程量清单'}
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
			id:'conid',
			header: fcOut['conid'].fieldLabel,
			dataIndex: fcOut['conid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fcOut['treeuids'].fieldLabel,
			dataIndex: fcOut['treeuids'].name,
			hidden: true
		},{
			id:'finished',
			header: fcOut['finished'].fieldLabel,
			dataIndex: fcOut['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isInstallation");
                var c = r.get("createMan")
                if(c != USERID && edit_flagLayout == ''){
                    return "<input type='checkbox' "+(o==1?"disabled title='已检验，不能取消完结' ":"")+" "+(v==1?"checked title='已完结' ":"title='未完结，但该单据不是您录入，您无权操作！'")+" disabled >";
                }else{
					var str = "<input type='checkbox' "+(v==1?" disabled checked title='已完结' ":"title='未完结'")+" onclick='finishOut(\""+r.get("uids")+ "\",\""+ r.get("using") +"\",this)'>"
					return str;
                }
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
			width : 220
		},{
			id:'outBackNo',
			header: fcOut['outBackNo'].fieldLabel,
			dataIndex: fcOut['outBackNo'].name,
			hidden: true,
			width : 180
		},{
			id:'outEstimateNo',
			header: fcOut['outEstimateNo'].fieldLabel,
			dataIndex: fcOut['outEstimateNo'].name,
			hidden: true,
			width : 180
		},{
			id:'outDate',
			header: fcOut['outDate'].fieldLabel,
			dataIndex: fcOut['outDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'recipientsUnit',
			header: fcOut['recipientsUnit'].fieldLabel,
			dataIndex: fcOut['recipientsUnit'].name,
			renderer : function(v){
				for(var i=0;i<unitArr.length;i++){
					if(v == ''){
                        return '';
                    }else if(v == unitArr[i][0]){
						return unitArr[i][1];
                    }
				}
			},
			hidden: edit_flagLayout == '' ? true : false,
			align : 'center',
			width : 180
        },{
			id:'useUnit',
			header: fcOut['useUnit'].fieldLabel,
			dataIndex: fcOut['useUnit'].name,
			renderer : function(v){
				var unit = "";
				for(var i=0;i<useUnitArr.length;i++){
					if(v == useUnitArr[i][0])
						unit = useUnitArr[i][1];
				}
				return unit;
			},
			hidden: edit_flagLayout == '' ? false : true,
			align : 'center',
			width : 180
        }, {
            id : 'equname',
            header : fcOut['equname'].fieldLabel,
            dataIndex : fcOut['equname'].name,
            hidden: true,
            width : 180
        }, {
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
            align : 'center',
            width : 220
		},{
	        id : 'equid',
	        header : fcOut['equid'].fieldLabel,
	        dataIndex : fcOut['equid'].name,
	        renderer : function(v){
	            var equid = "";
	            for (var i = 0; i < equWareArr.length; i++) {
	                if (v == equWareArr[i][1])
	                    equid = equWareArr[i][3]+" - "+equWareArr[i][2];
	            }
	            return equid;
	        },
	        align : 'center',
	        width : 180
        },{
            id : 'installationBody',
            header : fcOut['installationBody'].fieldLabel,
            dataIndex : fcOut['installationBody'].name,
            hidden: edit_flagLayout ==''?true:false,
            renderer : function(v){
            	for(var i=0;i<bodyArr.length;i++){
            	   if(v==bodyArr[i][0]){
            	   	   var qtip = "qtip=" + bodyArr[i][1];
		               return '<span ' + qtip + '>' + bodyArr[i][1] + '</span>';
            	   }
            	}
            },
            align : 'center',
            width : 200
        },{
            id : 'financialSubjects',
            header : fcOut['financialSubjects'].fieldLabel,
            dataIndex : fcOut['financialSubjects'].name,
            hidden: edit_flagLayout ==''?true:false,
            align : 'center',
            width : 180,
			renderer : function(v){
				for (var i=0;i<subjectArr.length;i++){
					if(subjectArr[i][0] == v){
						return subjectArr[i][1];
					}
				}
				return v;
			}
        },{
			id:'subjectAllname',
			header: fcOut['subjectAllname'].fieldLabel,
			dataIndex: fcOut['subjectAllname'].name,
			align : 'center',
			width : 180,
			hidden: edit_flagLayout ==''?true:false,
			renderer : function(v){
				if(v == '01') return '';
				for (var i=0;i<subjectArr.length;i++){
					if(subjectArr[i][0] == v){
						  var qtip = "qtip=" + subjectArr[i][1];
		                  return '<span ' + qtip + '>' + subjectArr[i][1] + '</span>';
					}
				}
			}
		},{
			id:'conPartybNo',
			header: fcOut['conPartybNo'].fieldLabel,
			dataIndex: fcOut['conPartybNo'].name,
			align : 'center',
			width : 180,
//			hidden: edit_flagLayout ==''?false:true,
			renderer : function(v){
                if(v.length == 32){
					for (var i=0;i<conPartybNoArr.length;i++){
						if(v==conPartybNoArr[i][0]){
							  return conPartybNoArr[i][1];
						}
					}
                }else{
                    return v;
                }
			}
		},{
            id:'fileid',
            header:fcOut['fileid'].fieldLabel,
            dataIndex:fcOut['fileid'].name,
            renderer : function(v,m,r){
                if(v!=''){
                    return "<center><a href='" + BASE_PATH
                            + "servlet/MainServlet?ac=downloadfile&fileid="
                            + v +"'><img src='" + BASE_PATH
                            + "jsp/res/images/word.gif'></img></a></center>"
                }else{
                    return "<img src='"+BASE_PATH+"jsp/res/images/word_bw.gif'></img>";
                }
            },
            align : 'center',
            hidden: edit_flagLayout ==''?true:false,
            width : 90
	    },{
	        id : 'fileid',
	        header : '附件',
	        dataIndex : fcOut['fileid'].name,
	        renderer : filelistFn,
	        align : 'center',
	        width : 100
	    },{
	        id : 'relateProacm',
			header : fcOut['relateProacm'].fieldLabel,
			dataIndex : fcOut['relateProacm'].name,
			align : 'center',
			width : 300,
			renderer : function(v) {
				var relateStr = "";
				if (v) {
					var relateArr = v.split(',');
					for (var i = 0; i < relateArr.length; i++) {
						for (var j = 0; j < proacmArr.length; j++) {
							if (relateArr[i] == proacmArr[j][0]) {
								relateStr += proacmArr[j][1] + ",";
								break;
							}
						}
					}
				}
				return relateStr ? relateStr.substr(0, relateStr.length-1) : "";
			}
	    }, {
			id:'grantDesc',
			header: fcOut['grantDesc'].fieldLabel,
			dataIndex: fcOut['grantDesc'].name,
            hidden: true,
			width : 180
		},{
			id:'recipientsUser',
			header: fcOut['recipientsUser'].fieldLabel,
			dataIndex: fcOut['recipientsUser'].name,
            hidden: true,
			width : 160
		},{
			id:'recipientsUnitManager',
			header: fcOut['recipientsUnitManager'].fieldLabel,
			dataIndex: fcOut['recipientsUnitManager'].name,
            hidden: true,
			width : 160
		},{
			id:'type',
			header: fcOut['type'].fieldLabel,
			dataIndex: fcOut['type'].name,
            hidden: edit_flagLayout ==''?true:false,
			width : 80
		},{
			id:'handPerson',
			header: fcOut['handPerson'].fieldLabel,
			dataIndex: fcOut['handPerson'].name,
            hidden: true,
			width : 160
		},{
			id:'shipperNo',
			header: fcOut['shipperNo'].fieldLabel,
			dataIndex: fcOut['shipperNo'].name,
            hidden: true,
			width : 160
		},{
			id:'proUse',
			header: fcOut['proUse'].fieldLabel,
			dataIndex: fcOut['proUse'].name,
            hidden: true,
			width : 160
		},{
			id:'remark',
			header: fcOut['remark'].fieldLabel,
			dataIndex: fcOut['remark'].name,
            hidden: true,
			width : 180
		}, {
			id:'finishMark',
			header: fcOut['finishMark'].fieldLabel,
			dataIndex: fcOut['finishMark'].name,
            hidden: true,
			width : 180
		
		}
/*		, {
			id:'kks',
			header: fcOut['kks'].fieldLabel,
			dataIndex: fcOut['kks'].name,
			align : 'center',
            hidden: edit_flagLayout ==''?true:false,
			width : 180
		}, {
			id:'userPart',
			header: fcOut['userPart'].fieldLabel,
			dataIndex: fcOut['userPart'].name,
			align : 'center',
            hidden: edit_flagLayout ==''?true:false,
			width : 180
		}*/
	]);
	
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
		{name : 'outEstimateNo' ,type : 'string'},
		{name : 'outBackNo' ,type : 'string'},
		{name : 'grantDesc', type : 'string'},
		{name : 'recipientsUser', type : 'string'},
		{name : 'recipientsUnitManager', type : 'string'},
		{name : 'handPerson', type : 'string'},
		{name : 'shipperNo', type : 'string'},
		{name : 'proUse', type : 'string'},
		{name : 'remark', type : 'string'}, 
        {name : 'equid', type : 'string'},
        {name : 'fileid', type : 'string'},
        {name : 'type' , type : 'string'},
        {name : 'using', type : 'string'},
        {name : 'equname', type : 'string'},
        {name : 'judgmentFlag',type : 'string'},
        {name : 'kks',type : 'string'},
        {name : 'userPart',type : 'string'}
        
        ,{name : 'createMan',type : 'string'}
        ,{name : 'createUnit',type : 'string'}
        ,{name : 'installationBody' ,type : 'string'}
        ,{name : 'financialSubjects' ,type : 'string'}
        ,{name : 'subjectAllname' , type : 'string'}
        ,{name : 'conPartybNo' , type : 'string'}
        ,{name : 'useUnit' , type : 'string'}
        ,{name : 'finishMark' , type : 'string'}
        ,{name : 'relateProacm' , type : 'string'}
	];

	dsOut = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOut,				
	    	business: businessOut,
	    	method: listMethodOut,
	    	//params: "conid='"+edit_conid+"'"
	    	params: "pid='"+CURRENTAPPID+"'" + whereSql +" and " +viewSql2   //默认根据电建公司过滤数据，条件在wz.cont.tree.js中获取
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
    dsOut.setDefaultSort(orderColumnOut, 'asc');
    
    var printBtn = new Ext.Button({
        text : '打印',
        iconCls : 'print',
        handler : doPrint
    });
    
    function doPrint(){
        var fileid = "";
        var fileName = "";
        var finished = "";
        var uids = "";
        var modetype = "NewCL";
        var record = smOut.getSelected();
        if(record != null && record != ""){
            uids = record.get("uids");
            fileid = record.get("fileid");
            fileName = record.get("outNo");
            finished = record.get('finished')
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        var filePrintType = "";
        if(edit_flagLayout&&edit_flagLayout=="WZBODY"){
            //filePrintType = "WzGoodsBodyOutView";
            filePrintType = "WzBodysOutPrintView";
        }else{
        	filePrintType = "WzGoodsStockOutView";
        }
        var hasfile = false;
        //fileid为空，则打开模板，否则直接打开已经打印保存过的文件
        if(fileid == null || fileid == ""){
            var sql = "select t.fileid,t.filename from APP_TEMPLATE  t where t.templatecode='"+filePrintType+"'";
            DWREngine.setAsync(false);
            baseMgm.getData(sql,function(str){
            	if(str != null && str != ""){
            	    fileid = str[0][0];
                    fileName = fileName +"-"+ str[0][1] 
            	}
            });
            DWREngine.setAsync(true);
        }else{
            hasfile = true;
        }
        if(fileid == null || fileid == ""){
            Ext.MessageBox.alert("文档打印错误","文档打印模板不存在，请先在系统管理中添加！");
            return;
        }else{
            var docUrl = BASE_PATH + "Business/equipment/equMgm/equ.file.print.jsp?fileid="+fileid;
            docUrl += "&filetype="+filePrintType;
            docUrl += "&uids="+uids;
            docUrl += "&modetype="+modetype;
            docUrl += "&beanname="+beanOut;
            docUrl += "&fileid="+fileid;
            docUrl += "&save="+((finished=="1")?false:true);
            docUrl += "&hasfile="+hasfile;
            docUrl += "&fileName="+fileName;
            docUrl = encodeURI(docUrl);
            window.showModalDialog(docUrl,"","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
            dsOut.reload();
        }
    }
   var cmArraySub = [['selectAll','全部']];
    var cmHideSub = new Array();
    
   	var store1Sub = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArraySub
	}); 
	
    var  chooseRowSub = new Ext.form.MultiSelect({
         id:   'chooserow1',
         width:  150,
         store : store1Sub,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(rr,ii){
         	var colModel = gridPanelOutSub.getColumnModel();
	    	if(ii==0){
		        if(rr.get(this.checkField)){
		            chooseRowSub.setValue(cmHideSub);
		            cmSelectByIdSub(colModel,cmHideSub);
		        }else{
		            this.selectAll();
		            cmSelectByIdSub(colModel,this.getCheckedValue());
		        }
		    }else{
		        rr.set(this.checkField, !rr.get(this.checkField));
                chooseRowSub.setValue(this.getCheckedValue());
                cmSelectByIdSub(colModel,this.getCheckedValue());
		    }
		}
  });
 
	function cmSelectByIdSub(cmSub,str){
    	var cmHideSub = str.toString().split(',');
    	var lockedCol = cmSub.getLockedCount()
        for(var i=lockedCol+1; i<cmSub.getColumnCount();i++){
            for(var j=0;j<cmHideSub.length;j++){
                if(cmOutSub.getDataIndex(i) == cmHideSub[j]){
                    cmOutSub.setHidden(i,false);
                    break;
                }else{
                    cmOutSub.setHidden(i,true);
                }
            }
        }
	}	    			

    var cmArray = [['selectAll','全部']];
    var cmHide = new Array();
    
   	var store1 = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArray
	}); 
   var  chooseRow = new Ext.form.MultiSelect({
         id:   'chooserow',
         width:  150,
         store : store1,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelOut.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRow.setValue(cmHide);
		            cmSelectById(colModel,cmHide);
		        }else{
		            this.selectAll();
		            cmSelectById(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRow.setValue(this.getCheckedValue());
                cmSelectById(colModel,this.getCheckedValue());
		    }
		}
  });
 
	function cmSelectById(colModel,str){
    	var cmHide = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol; i<cmOut.getColumnCount();i++){
            for(var j=0;j<cmHide.length;j++){
                if(cmOut.getDataIndex(i) == cmHide[j]){
                    cmOut.setHidden(i,false);
                    break;
                }else{
                    cmOut.setHidden(i,true);
                }
            }
        }
	}      
	cmOut.defaultSortable = true;

	// 冲回出库功能及查询功能
	var CKBackBtn = new Ext.Button({
		id : 'CKback',
		text : '冲回出库',
		iconCls : 'btn',
		handler : CKBackFn
	})
    //查询功能菜单
	var CKfileMenu = new Ext.menu.Menu({
			id : 'CKBtn',
			shadow : "drop",
			allowOtherMenus : true,
			items : [
				new Ext.menu.Item({
					id : 'queryAll',
					text : "查询所有",
					iconCls : 'btn',
					handler : CKonMunuItem
				}),
				new Ext.menu.Item({
					id : 'ZGCK',
					text : "暂估出库",
					iconCls : 'btn',
					handler : CKonMunuItem
				}), new Ext.menu.Item({
					id : 'CHZG',
					text : "冲回出库",
					iconCls : 'btn',
					handler : CKonMunuItem
				}), new Ext.menu.Item({
					id : 'CK',
					text : "正式出库",
					iconCls : 'btn',
					handler : CKonMunuItem
				})]
		});

	function CKonMunuItem(btn){
		var where = '';
		if(btn.id == "ZGCK"){
			where = " type='暂估出库' ";
		}else if(btn.id == "CHZG"){
			where = " type='冲回出库'";
		}else if(btn.id == "CK"){
			where = " type='正式出库'";
		}else{
		   where = " 1=1 ";
		}
		dsOut.baseParams.params = where + " and pid='"+CURRENTAPPID+"'" + whereSql +" and " +viewSql2;
		dsOut.load({params : {start : 0,limit : PAGE_SIZE}})
	}
		//新增冲回入库功能
	var CKQqueryBtn = new Ext.Button({
		id : 'CKquery',
		text : '查询',
		iconCls : 'btn',
		menu : CKfileMenu
	});
    // 非主体材料加入冲回按钮
    var backWzBtn = new Ext.Button({
        text : '冲回出库',
        iconCls : 'btn',
        handler : backWzFn
    });
	var tabArr = "";
	if(edit_flagLayout == ""){
		tabArr = ['<font color=#15428b><B>出库单信息<B></font>',addBtn,'-',editBtn,'-',delBtn,'-',printBtn,'-',backWzBtn,'->',chooseRow];
	}else{
		tabArr = ['<font color=#15428b><B>出库单信息<B></font>',addBtn,'-',editBtn,'-',delBtn,'-',printBtn,'-',CKBackBtn,'-',CKQqueryBtn,'->',chooseRow];
	}
	var gridPanelOut = new Ext.grid.GridPanel({
		ds : dsOut,
		cm : cmOut,
		sm : smOut,
		title : '出库单信息',
		tbar : tabArr,
		header: false,
	    border: false,
	    enableHdMenu : false,
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
	/*******************************出库单基础信息end************************************************/
	/*******************************出库单明细信息start************************************************/
	var fcOutSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '材料库存主键'},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '物资编码'},
		'equType' : {name : 'equType',fieldLabel : '物资类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '物资名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'outNum' : {name : 'outNum',fieldLabel : '出库数量', decimalPrecision : 4},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
        'price' : {name : 'price', fieldLabel : '入库单价', allowBlank : false},
        'amount' : {name : 'amount', fieldLabel : '出库金额', allowBlank : false},
        'kcMoney' : {name : 'kcMoney', fieldLabel : '库存余额'},
        'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码',  width : 160},
        'qcId' : {
        			name : 'qcId', 
		            fieldLabel : 'KKS编码(生产)',
		            width : 200
        		},
        'useParts' : {name : 'useParts',fieldLabel : '安装部位',  width : 160},
        'memo' : {name:'memo',fieldLabel : '备注'},
        'inSubUids' : {name:'inSubUids',fieldLabel : '入库单明细主键'},
        'inNum' : {name : 'inNum',fieldLabel : '入库数量'},
        'equBoxNo' : {name: 'equBoxNo' ,fieldLabel : '箱件号',width : 100},
		'relateAsset' : {name: 'relateAsset' ,fieldLabel : '关联资产',width : 100},
        'special' : {name : 'special',fieldLabel : '专业类别'},
        'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
	};

	smOutSub = new Ext.grid.CheckboxSelectionModel();

	/**
	 * 固定资产清单树，只有土建节点（0101，0102）
	 * pengy 2014-01-20
	 */
	var rootNode = new Ext.tree.AsyncTreeNode({
				id : "01",
				text : "固定资产分类",
				iconCls : 'folder',
				expanded : true
			});
	var assetTreeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "getFACompFixedAssetList",
					businessName : "faFixedAssetService",
					parentid : "01",
					pid : CURRENTAPPID,
					relateAsset : "0101,0102,0104,0105"		//此处可取除设备（需安装及不需安装设备）外的资产节点，包括设备基座及管线 pengy 2014-03-11
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});
	var selectAssetBtn = new Ext.Button({
				id : "selectAssetBtn",
				text : '选择',
				iconCls : 'option',
				handler : function() {
					var treeid = thisAssetTreeid;
					var isleaf = thisAssetIsleaf;
					if (typeof treeid == 'undefined' || treeid=='0101' || treeid=='0102' || isleaf=='0'){
						Ext.example.msg('提示', '请选择房屋建筑物或构筑物下的叶子节点！');
						return;
					}
					var rec = smOutSub.getSelected();
					rec.set('relateAsset', treeid);
					rec.commit();
					faCostManageService.updateRelateAsset(rec.get('uids'), rec.get('amount'), treeid, function(){});
					assetWin.hide();
				}
			});
	var clearAssetBtn = new Ext.Button({
				id : "clearAssetBtn",
				text : '清空关联资产',
				iconCls : 'remove',
				handler : function() {
					var rec = smOutSub.getSelected();
					rec.set('relateAsset', '');
					rec.commit();
					faCostManageService.updateRelateAsset(rec.get('uids'), rec.get('amount'), "", function(){});
					assetWin.hide();
				}
			});

	var assetTree = new Ext.tree.ColumnTree({
			id : 'assetTree',
			region : 'center',
			width : 240,
			minSize : 240,
			maxSize : 550,
			frame : false,
			header : false,
			border : false,
			collapsible : true,
			collapseMode : 'mini',
			rootVisible : true,
			split : true,
			lines : true,
			autoScroll : true,
			animate : false,
			tbar : ['<font color=#15428b><b>固定资产清单</b></font>', '-', {
						iconCls : 'icon-expand-all',
						tooltip : '全部展开',
						handler : function() {
							rootNode.expand(true);
						}
					}, '-', {
						iconCls : 'icon-collapse-all',
						tooltip : '全部折叠',
						handler : function() {
							rootNode.collapse(true);
						}
					}, '-', selectAssetBtn, '-', clearAssetBtn],
			columns : [{
						header : '固定资产名称',
						dataIndex : 'fixedname',
						width : 270
					}, {
						header : '固定资产编码',
						dataIndex : 'fixedno',
						width : 140
					}, {
						header : '主键',
						dataIndex : 'uids',
						width : 0,
						renderer : function(value) {
							return "<div id='uids'>" + value + "</div>";
						}
					}, {
						header : '树编码',
						dataIndex : 'treeid',
						width : 0,
						renderer : function(value) {
							return "<div id='treeid'>" + value + "</div>";
						}
					}, {
						header : '是否子节点',
						dataIndex : 'isleaf',
						width : 0,
						renderer : function(value) {
							return "<div id='isleaf'>" + value + "</div>";
						}
					}, {
						header : '父节点',
						dataIndex : 'parentid',
						width : 0,
						renderer : function(value) {
							return "<div id='parentid'>" + value + "</div>";
						}
					}],
			loader : assetTreeLoader,
			root : rootNode
		});
	assetTree.on('beforeload', function(node) {
				var treeid = node.attributes.treeid;
				if (treeid == null) {
					treeid = "01";
				}
				assetTree.loader.baseParams.parentid = treeid;
				assetTree.loader.baseParams.pid = CURRENTAPPID;
			});
	assetTree.on('click', function(node, e) {
				var tempNode = node;
				thisAssetTreeid = tempNode.attributes.treeid;
				thisAssetIsleaf = tempNode.attributes.isleaf;
			});
	assetWin = new Ext.Window({
			id : 'assetWin',
			title : '关联固定资产',
			layout : 'fit',
			border : false,
			width : 450,
			height : 350,
			minWidth : 300,
			minHeight : 200,
			resizable : true,
			closeAction : "hide",
			items : [assetTree]
		});

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
			id : 'equBoxNo',
			header : fcOutSub['equBoxNo'].fieldLabel,
			dataIndex : fcOutSub['equBoxNo'].name,
			align : 'center',
			hidden : edit_flagLayout != ""?true:false,
			width : 100
		},{
			id : 'boxNo',
			header : fcOutSub['boxNo'].fieldLabel,
			dataIndex : fcOutSub['boxNo'].name,
			align : 'center',
			width : 160
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
            hidden : true,
			width : 100
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
		}, {
			id : 'special',
			header : fcOutSub['special'].fieldLabel,
			dataIndex : fcOutSub['special'].name,
			align : 'center',
			width : 80,
			renderer : function(v){
				for (var i=0; i<specialArr.length; i++){
					if (v == specialArr[i][0]){
						return specialArr[i][1];
					}
				}
			}
		}, {
			id : 'jzNo',
			header : fcOutSub['jzNo'].fieldLabel,
			dataIndex : fcOutSub['jzNo'].name,
			align : 'center',
			width : 80,
			renderer : function(v){
				for (var i=0; i<jzNoArr.length; i++){
					if (v == jzNoArr[i][0]){
						return jzNoArr[i][1];
					}
				}
			}
		},{
			id : 'graphNo',
			header : fcOutSub['graphNo'].fieldLabel,
			dataIndex : fcOutSub['graphNo'].name,
			align : 'center',
			width : 100
		}, {
			id : 'inSubUids',
			header : fcOutSub['inSubUids'].fieldLabel,
			dataIndex : fcOutSub['inSubUids'].name,
			width : 80,
            hidden : true
		},{
			id : 'inNum',
			header : fcOutSub['inNum'].fieldLabel,
			dataIndex : fcOutSub['inNum'].name,
			width : 80,
            hidden : true
		}, {
			id : 'unit',
			header : fcOutSub['unit'].fieldLabel,
			dataIndex : fcOutSub['unit'].name,
            align : 'center',
			width : 80
		},{
			id : 'outNum',
			header : fcOutSub['outNum'].fieldLabel,
			dataIndex : fcOutSub['outNum'].name,
			align : 'right',
			width : 80
        },{
            id : 'price',
            header : fcOutSub['price'].fieldLabel,
            dataIndex : fcOutSub['price'].name,
            align : 'right',
			renderer : function(v) {
				if (isNaN(v) == true) {
					return v.toFixed(2);
				} else {
					return parseFloat(v, 10).toFixed(2);
				}
			},
            hidden : edit_flagLayout != ""?false:true,
            width : 80
        },{
            id : 'amount',
            header : fcOutSub['amount'].fieldLabel,
            dataIndex : fcOutSub['amount'].name,
            align : 'right',
            hidden : edit_flagLayout != ""?false:true,
            width : 80
        },{
            id : 'kcMoney',
            header : fcOutSub['kcMoney'].fieldLabel,
            dataIndex : fcOutSub['kcMoney'].name,
            align : 'right',
            hidden : edit_flagLayout !=''?false:true,
            renderer : function(v,m,r){
                var otherOutMoney = 0;
                var sql = " SELECT nvl(SUM(s.amount),0) FROM wz_goods_stock_out t, wz_goods_stock_out_sub s " +
                    " WHERE t.uids = s.out_id AND t.judgment_flag = 'body' AND t.type = '正式出库' " +
                    " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' " +
                    " AND s.uids <> '"+r.get('uids')+"'";
                DWREngine.setAsync(false);
                baseMgm.getData(sql, function(list) {
                    if (list && list.length > 0) {
                        otherOutMoney = list[0];
                    }
                });
                DWREngine.setAsync(true);
                return ( ((r.get('inNum')*r.get('price') - otherOutMoney - r.get('amount')).toFixed(2)));
            },
            width : 120
        },{
			id : 'stockNum',
			header : "库存数量余额",
			dataIndex:'stockNum',
			align : 'right',
            hidden : edit_flagLayout != ""?true:false,
			renderer:function(value,cell,record){
				var stocknum="";
				DWREngine.setAsync(false);
				wzbaseinfoMgm.getWzStockNumFromStock(record.get('stockId'),function(num){
					stocknum=num;
				});
				DWREngine.setAsync(true);
    			return stocknum;
			},
			width : 80
		}
		,{
			id : 'storage',
			header : fcOutSub['storage'].fieldLabel,
			dataIndex : fcOutSub['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<equWareArr.length;i++){
					if(v == equWareArr[i][0])
						storage = equWareArr[i][3]+"-"+equWareArr[i][2];
				}
				return storage;
			},
			align : 'center',
            hidden : true,
			width : 80
		}, {
			id : 'gclName',
			header : "安装工程量",
			align : 'center',
			dataIndex : 'gclName',
            renderer : function(v,m,r){
            	var count = 0;
            	var value  = r.get('inSubUids');
            	DWREngine.setAsync(false);
            	baseDao.getData("select count(*) from bdg_project t where t.fixed_asset_list ='"+value+"'",function(num){
            		count = num;
            	})
            	DWREngine.setAsync(true);
            	if(count == 0){
            		return "无";
            	}else{
            		return "<a title='工程量信息'   style='color:blue;' href='javascript:void(0);' onclick='openWinFun1(\""+value+"\");'>" + 
            				"共有【<span style='color:red;'>"+count+"</span>】个工程量" + "</a>"
            	}
            },
            align : 'right',
            hidden : edit_flagLayout != ""?false:true,
			width : 120
		}, {
			id : 'useParts',
			header : fcOutSub['useParts'].fieldLabel,
			dataIndex : fcOutSub['useParts'].name,
			align : 'center',
			renderer : function(v,m,r){
				var str = '';
				for(var i=0;i<userPartArray.length;i++){
				    if(v == userPartArray[i][0]){
				        str = userPartArray[i][1];
				        break;
				    }
				}
                return (str==''?v:str);
		    },
			//hidden : edit_flagLayout !=''?false:true,
			width : 180
		}, {
			id : 'relateAsset',
			header : fcOutSub['relateAsset'].fieldLabel,
			dataIndex : fcOutSub['relateAsset'].name,
			renderer : function(v,m,r){
				m.attr = "style=background-color:#FBF8BF";
				var str = '';
				for(var i=0;i<userPartArray.length;i++){
				    if(v == userPartArray[i][0]){
				        str = userPartArray[i][1];
				        break;
				    }
				}
                return (str==''?v:str);
		    },
			width : 180
		}, {
			id : 'kksNo',
			header : fcOutSub['kksNo'].fieldLabel,
			dataIndex : fcOutSub['kksNo'].name,
			align : 'center',
			hidden : edit_flagLayout !=''?false:true,
			width : 80
		} ,{
			id : 'qcId',
			header : fcOutSub['qcId'].fieldLabel,
			dataIndex : fcOutSub['qcId'].name,
			//editor : new fm.ComboBox(fcOutSub['qcId']),
			renderer : function(v,m,r){
				var strArr = v.split(",");
			    var strS = "";
			    for(var i=0;i<strArr.length;i++){
			    	if(strArr.length == 1){
			    		strS = "'"+strArr[i]+"'";
			    	}else{
			    		if(i>=0&&i<strArr.length-1){
			    			strS += "'"+strArr[i]+"',";
			    		}else{
			    			strS += "'"+strArr[i]+"'";
			    		}
			    	}
			    }
				var kks='';
				DWREngine.setAsync(false);
				baseMgm.getData("select kksno from equ_goods_qc where uids in ("+strS+")",function(list){
					if(list !=null){
						for(var i=0;i<list.length;i++){
							if(list.length == 1){
								kks =list[i];
							}else{
								if(i>=0&&i<list.length-1){
									kks +=list[i]+",";
								}else{
									kks +=list[i];
								}
								
							}
							
						}
					}
					
				});
				DWREngine.setAsync(true);
				m.attr = "style=background-color:#FBF8BF";
                return kks;
		    },
			align : 'left',
			hidden : edit_flagLayout !=''?false:true,
			width : 130
		},  {
			id : 'memo',
			header : fcOutSub['memo'].fieldLabel,
			dataIndex : fcOutSub['memo'].name,
			align : 'left',
			hidden : edit_flagLayout !=''?false:true,
			renderer : function(v,m,r){
				 var qtip = "qtip=" + v;
		         return '<span ' + qtip + '>' + v + '</span>';
			},			
			width : 180
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
        {name:'amount', type:'float'},
		{name:'storage', type:'string'},
		{name:'kcMoney', type:'float'},
		{name:'useParts',type:'string'},
		{name:'kksNo',type:'string'},
		{name : 'qcId',type : 'string'},
		{name:'memo',type:'string'},
		{name:'inSubUids',type:'string'},
		{name:'inNum',type:'float'},
		{name:'equBoxNo', type:'string'},
		{name:'relateAsset', type:'string'},
		{name:'special',type:'string'},
		{name:'jzNo',type:'string'}
	];

	dsOutSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSub,
	    	business: businessOutSub,
	    	method: listMethodOutSub,
	    	params: "pid='"+CURRENTAPPID+"' and 1=2"
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
	cmOutSub.defaultSortable = true;
    var gridPanelOutSub = new Ext.grid.EditorGridPanel({
		ds: dsOutSub,
		cm: cmOutSub,
		sm: smOutSub,
		title:"出库单详细信息",
		border: false,
		clicksToEdit:2,
		tbar : ['->',chooseRowSub],
		region: 'south',
		enableHdMenu : false,
		header: false, 
		height : document.body.clientHeight*0.5,
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		listeners:{
			"cellclick":function(grid, rowIndex, columnIndex, e){
				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                //kks编码（生产）
                if(fieldName == 'qcId'){
                    showqCWin();
                }
                if (fieldName == 'relateAsset'){
                	showAssetWin();
                }
			}
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
		//activeTab : USERDEPTID == "102010103"?1:0,
        activeTab : edit_flagLayout == ''?0:1,
        border: false,
        region: 'center',
		items : [gridPanel,gridOutPanel]
	});
	
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [tabPanel]
	});
	
	if (edit_flagLayout && edit_flagLayout == "WZBODY") {
		var viewPort = new Ext.Viewport({
					layout : 'border',
					items : [contentPanel]
				});
//		if (USERDEPTID == "102010103") {
//			gridPanel.disable();
//		}
	} else {
		var viewPort = new Ext.Viewport({
					layout : 'border',
					items : [treePanel, contentPanel]
				})
	}
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	dsOut.load({params:{start:0,limit:PAGE_SIZE}});
	
	if(edit_flagLayout !=''){
		for(var o in fcOut){
	        var name = fcOut[o];
	        var temp = new Array();
	        temp.push(fcOut[o].name);
	        temp.push(fcOut[o].fieldLabel);
	        var colModel = gridPanelOut.getColumnModel();
	        //锁定列不在显示更多信息中出现
	        if(colModel.getLockedCount()<=colModel.findColumnIndex(fcOut[o].name)){
		        cmArray.push(temp);
		        if(!colModel.isHidden(colModel.getIndexById(o))){
		            cmHide.push(o)
		        }
	        }
	    }
	    store1.loadData(cmArray)
		chooseRow.setValue(cmHide);
	    chooseRow.setRawValue("显示更多信息"); 
	    for(var o in fcOutSub){
		    var name = fcOutSub[o];
		    var temp = new Array();
		    temp.push(fcOutSub[o].name);
		    temp.push(fcOutSub[o].fieldLabel);
		    var colModel = gridPanelOutSub.getColumnModel();
		    //锁定列不在显示更多信息中出现
		    if(colModel.getLockedCount()<=colModel.findColumnIndex(fcOutSub[o].name)){
		        cmArraySub.push(temp);
		        if(!colModel.isHidden(colModel.getIndexById(o))){
		            cmHideSub.push(o)
		        }
		    }
		}
		store1Sub.loadData(cmArraySub)
				
		chooseRowSub.setValue(cmHideSub);
		chooseRowSub.setRawValue("显示更多信息");		
		
		Ext.get("chooserow1").on("mouseout", function(){
               if(chooseRowSub.getValue()==""||chooseRowSub.getValue()==null){
                          chooseRowSub.setValue(cmHideSub);
                          chooseRowSub.setRawValue("显示更多信息"); 
                    }     
       }, this);
	   Ext.get("chooserow").on("mouseout", function(){
	               if(chooseRow.getValue()==""||chooseRow.getValue()==null){
	                          chooseRow.setValue(cmHide);
	                          chooseRow.setRawValue("显示更多信息"); 
	                    }     
	       }, this);
	}
	       
	tabPanel.on('tabchange',function(t,tab){
		if(t.activeTab.id=="stock"){
			sm.clearSelections();
			collection.clear();
			ds.reload({params:{start:0,limit:PAGE_SIZE}});
		}
		if(t.activeTab.id=="stockOut"){
			 	for(var o in fcOut){
			        var name = fcOut[o];
			        var temp = new Array();
			        temp.push(fcOut[o].name);
			        temp.push(fcOut[o].fieldLabel);
			        var colModel = gridPanelOut.getColumnModel();
			        //锁定列不在显示更多信息中出现
			        if(colModel.getLockedCount()<=colModel.findColumnIndex(fcOut[o].name)){
				        cmArray.push(temp);
				        if(!colModel.isHidden(colModel.getIndexById(o))){
				            cmHide.push(o)
				        }
			        }
			    }
			    store1.loadData(cmArray)
				chooseRow.setValue(cmHide);
			    chooseRow.setRawValue("显示更多信息"); 
			    for(var o in fcOutSub){
				    var name = fcOutSub[o];
				    var temp = new Array();
				    temp.push(fcOutSub[o].name);
				    temp.push(fcOutSub[o].fieldLabel);
				    var colModel = gridPanelOutSub.getColumnModel();
				    //锁定列不在显示更多信息中出现
				    if(colModel.getLockedCount()<=colModel.findColumnIndex(fcOutSub[o].name)){
				        cmArraySub.push(temp);
				        if(!colModel.isHidden(colModel.getIndexById(o))){
				            cmHideSub.push(o)
				        }
				    }
				}
				store1Sub.loadData(cmArraySub)
						
				chooseRowSub.setValue(cmHideSub);
				chooseRowSub.setRawValue("显示更多信息");		
		}
		
		Ext.get("chooserow1").on("mouseout", function(){
               if(chooseRowSub.getValue()==""||chooseRowSub.getValue()==null){
                          chooseRowSub.setValue(cmHideSub);
                          chooseRowSub.setRawValue("显示更多信息"); 
                    }     
       }, this);
	   Ext.get("chooserow").on("mouseout", function(){
	               if(chooseRow.getValue()==""||chooseRow.getValue()==null){
	                          chooseRow.setValue(cmHide);
	                          chooseRow.setRawValue("显示更多信息"); 
	                    }     
	       }, this); 
	});
    treePanel.on('click',function(node){
	    if(node != null || node !=''){
	    	  var elNode = node.getUI().elNode;
	    	  var conid = elNode.all("conid").innerText;
	    	  var sqlWhere  = '';
	    	  var sqlWhere1  = '';
	    	  if(conid == '' || conid == null){
	    	     var sqlIn = "select conid from wz_con_ove_tree_view where parentid='"+elNode.all("treeid").innerText+"'";
	    	     DWREngine.setAsync(false);
	    	     baseMgm.getData(sqlIn,function(list){
	    	         if(list.length>0){
				        	sqlWhere1 +='(';
					        for (var i = 0; i < list.length; i++) {
					             if(list.length == 1){
					                sqlWhere1 +="'"+list[i]+"'";
					                break;
					             }else{
						             if(i>=0 && i<list.length-1){
						                 sqlWhere1 +="'"+list[i]+"',";
						             }else{
						                 sqlWhere1 +="'"+list[i]+"'";
						             }
					             }
					        }
					        sqlWhere1 +=")";
				        }
	    	     })
	    	     DWREngine.setAsync(false);
	    	     sqlWhere1 = "conid in "+sqlWhere1;
	    	     sqlWhere = "conid in ("+sqlIn+")";
	    	  }else{
	    	      sqlWhere1 = "conid='"+elNode.all("conid").innerText+"'";
	    	      sqlWhere = "conid='"+elNode.all("conid").innerText+"'";
	    	  }
              sqlWhere1 = sqlWhere1 + " and " + viewSql2   //默认根据电建公司过滤数据，条件在wz.cont.tree.js中获取
	    	  dsOut.baseParams.params=sqlWhere1+whereSql;
	    	  var wzUids="";
	          DWREngine.setAsync(false);
		      var sql="select t.uids from wz_goods_stock_out t where "+sqlWhere;
		      baseMgm.getData(sql,function(list){
				        if(list.length>0){
				        	wzUids +='(';
					        for (var i = 0; i < list.length; i++) {
					             if(list.length == 1){
					                wzUids +="'"+list[i]+"'";
					                break;
					             }else{
						             if(i>=0 && i<list.length-1){
						                 wzUids +="'"+list[i]+"',";
						             }else{
						                 wzUids +="'"+list[i]+"'";
						             }
					             }
					        }
					        wzUids +=")";
				        }
				    })
		      DWREngine.setAsync(true); 
		      if(wzUids !=""){
		         wzUids = "out_id  in "+wzUids;
		      }else{
		         wzUids = "1=2";
		      }
//		      dsOutSub.baseParams.params=wzUids;
	    }
       	dsOut.load({params:{start:0,limit:PAGE_SIZE}});
		dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
	})
	
	smOut.on('rowselect', function() {
				var record = smOut.getSelected();
				if (record == null || record == '')
					return;
				// 权限控制
				if (ModuleLVL >= 3) {
					doSelect.setDisabled(true);
					doChooise.setDisabled(true);
					editBtn.setDisabled(true);
					delBtn.setDisabled(true);
					addBtn.setDisabled(true);
				} else {
					if (edit_flagLayout == '') {
						if (record.get('createMan') == USERID) {
							if (record.get('finished') == 1) {
								editBtn.setDisabled(true);
								delBtn.setDisabled(true);
								printBtn.setDisabled(false);
							} else {
								editBtn.setDisabled(false);
								delBtn.setDisabled(false);
								printBtn.setDisabled(false);
							}
						} else {
							editBtn.setDisabled(true);
							delBtn.setDisabled(true);
						}
					} else {
						if (record.get('finished') == 1) {
							editBtn.setDisabled(true);
							delBtn.setDisabled(true);
							printBtn.setDisabled(false);
						} else {
							editBtn.setDisabled(false);
							delBtn.setDisabled(false);
							printBtn.setDisabled(false);
						}
					}
				}
				// if (USERDEPTID == "102010103") {
				// delBtn.setDisabled(true);
				// }
				if (record.get("type") == "暂估出库") {
					if ((record.get("finishMark") != 1) && (record.get("finished") == 1)) {
						CKBackBtn.setDisabled(false);
					} else {
						CKBackBtn.setDisabled(true);
					}
				} else {
					CKBackBtn.setDisabled(true);
				}
				dsOutSub.baseParams.params = "outId = '" + record.get('uids') + "'";
				dsOutSub.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});
	if (ModuleLVL >= 3) {
		doSelect.setDisabled(true);
		doChooise.setDisabled(true);
		editBtn.setDisabled(true);
		delBtn.setDisabled(true);
	} else {
		if (edit_flagLayout == '') {
			if (competenceFlag == true) {
				doSelect.setDisabled(false);
				doChooise.setDisabled(false);
			} else {
				doSelect.setDisabled(true);
				doChooise.setDisabled(true);
			}
		}
	}

	// 模糊查询
	function queHandler(){
		var querywheres="";
		var qggxh = ggxh.getValue();
		var qstorage = storage.getValue();
		if (qggxh){
			querywheres = " and ggxh like '%"+qggxh+"%'";
		}
		if(selectParentid!=null&&selectParentid!=""){
			if(selectParentid == "0"){
				ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"'"+querywheres;
				ds.reload();
			}else{
				//查询当前选中节点的所有子节点主键。
				ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids ='"+selectConid+"'"+querywheres;
				ds.reload();
			}
		}else{
			ds.baseParams.params = "pid='"+CURRENTAPPID+"'"+querywheres;
		    ds.reload();
		}
	};
    
    //打开新增主记录窗口 2013-9-25
    /**
     * 变更说明：针对主体材料和主体设备，修改出库物资选择方式，以前从库存中选择，
     * 现在调整为从入库明细中选择，出库明细需要根据出库的出库单位，过滤入库的参与单位
     * 入库明细数据按物资编码分组，出库明细中统一物资可以多次出现
     * 用于体现出不同物资的单价不同的区分
     */
    function addHandler(){
        var url = BASE_PATH+"Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.addorupdate.jsp"
        var obj=new Object();//用于新增出库单
        var formRecord = Ext.data.Record.create(ColumnsOut);//用于新增出库单
        var ckuids = "";
        var prefix = "";
        var conno;
        DWREngine.setAsync(false);
        baseMgm.findById(beanCon, selectConid, function(obj) {
            conno = obj.conno;
        });
        //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
        var sql = "select c.property_name from PROPERTY_CODE c " +
                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
                " and c.property_code = '"+USERDEPTID+"' ";
        baseMgm.getData(sql, function(str){
            prefix = str.toString();
        });
        // 处理出库单号
        var newCkNo = prefix +"-"+conno.replace(/^\n+|\n+$/g,"") + "-CK-";
        equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newCkNo,"out_No","wz_goods_stock_out",null,"judgment_flag='noBody'",function(str){
              newCkNo = str;
          });
        DWREngine.setAsync(true);
        var conPartybNos = "";
        for(var i=0;i<conPartybNoArr.length;i++){
            if(selectConid == conPartybNoArr[i][2]){
                conPartybNos = conPartybNoArr[i][0];
                break;
            }
        }
        obj = {
            uids : '',
            pid : CURRENTAPPID,
            conid : selectConid,
            treeuids : selectConid,
            finished : 0,
            isInstallation : 0,
            outNo : edit_flagLayout==''?newCkNo:'',
            outDate : new Date(),
            recipientsUnit : '',
            grantDesc : '',
            recipientsUser : '',
            recipientsUnitManager : '',
            handPerson : REALNAME,
            shipperNo : '',
            proUse : '',
            remark : '',
            type : '正式出库',
            judgmentFlag : edit_flagLayout==''?'noBody':'body'
            ,createMan : USERID
            ,createUnit : USERDEPTID
            ,installationBody : ''
            ,financialSubjects : ''
            ,useUnit : ''
            ,conPartybNo : conPartybNos
        }
        DWREngine.setAsync(false);
        wzbaseinfoMgm.addOrUpdateWzOut(obj, function(str) {
            ckuids = str;
        });
        DWREngine.setAsync(true);
        obj.uids=ckuids
        url += "?conid="+selectConid+"&treeuids="+selectConid+"&uids="+ckuids+"&flagLayout="+edit_flagLayout;
        selectWinShow(url,obj,formRecord,false);
    }
    
	//修改或选择操作
	function EditHandler(){
		var btnId = this.id;
		var record = smOut.getSelected();
		var url = BASE_PATH+"Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.addorupdate.jsp"
		var obj=new Object();//用于新增出库单
		obj=null;
		var formRecord = Ext.data.Record.create(ColumnsOut);//用于新增出库单
        if(btnId == "doChoose"){
             if(edit_flagLayout == ""){
				if(selectParentid == '0'){
						Ext.example.msg('提示信息','请选择该分类下的合同！');
				    	return ;		
				}
			    if(selectUuid == "" || selectConid == ""){
					Ext.example.msg('提示信息','请先选择左边的合同分类树！');
			    	return ;
				}  
             }
	         url = BASE_PATH+"Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.estimate.list.jsp";
	         url += "?conid="+selectConid+"&treeuids="+selectConid+"&edit_flag=zgrk"+"&flagLayout="+edit_flagLayout;
	         selectWinShow(url,obj,formRecord,true);
	         return;
		
        }
		if(btnId=="doSelect"){
			if(edit_flagLayout == ""){
				if(selectParentid == '0'){
						Ext.example.msg('提示信息','请选择该分类下的合同！');
				    	return ;		
				}
				if(selectUuid == "" || selectConid == ""){
					Ext.example.msg('提示信息','请先选择左边的合同分类树！');
			    	return ;
				}
			}
			//var records = sm.getSelections();
			var records = collectionToRecords();
			if(records == null || records.length == 0){
    			Ext.example.msg('提示信息','请先选择库存中的材料！');
    			return;
    		}            
    		var OutSubUids = new Array()
    		var sbType=records[0].get('equType');
    		for (var i = 0; i < records.length; i++) {
    			if(records[i].get('equType')!=sbType){
    				Ext.example.msg('提示信息','请先选择库存中相同材料类型的材料！');
    			    return;
    			}
    			OutSubUids.push(records[i].get("uids"));
    		}
    		sm.clearSelections();
    		//新增
    		if (changeRecord==null || changeRecord=="") {
				var conno;
				DWREngine.setAsync(false);
				baseMgm.findById(beanCon, selectConid, function(obj) {
					conno = obj.conno;
				});
                //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
		        var prefix = "";
		        var sql = "select c.property_name from PROPERTY_CODE c " +
		                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
		                " and c.property_code = '"+USERDEPTID+"' ";
		        baseMgm.getData(sql, function(str){
		            prefix = str.toString();
		        });
				// 处理出库单号
				var newCkNo = prefix +"-"+conno.replace(/^\n+|\n+$/g,"") + "-CK-";
				var ckuids = "";
//				equMgm.getEquNewDhNo(CURRENTAPPID, newCkNo, "out_No",
//						"wz_goods_stock_out", null, function(str) {
//							newCkNo = str;
//						});
				equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newCkNo,"out_No","wz_goods_stock_out",null,"judgment_flag='noBody'",function(str){
				      newCkNo = str;
		          });
				DWREngine.setAsync(true);
				var conPartybNos = "";
				for(var i=0;i<conPartybNoArr.length;i++){
				    if(selectConid == conPartybNoArr[i][2]){
				        conPartybNos = conPartybNoArr[i][0];
				        break;
				    }
				}
				obj = {
					uids : '',
					pid : CURRENTAPPID,
					conid : selectConid,
					treeuids : selectConid,
					finished : 0,
					isInstallation : 0,
					outNo : edit_flagLayout==''?newCkNo:'',
					outDate : new Date(),
					recipientsUnit : '',
					grantDesc : '',
					recipientsUser : '',
					recipientsUnitManager : '',
					handPerson : REALNAME,
					shipperNo : '',
					proUse : '',
					remark : '',
					type : '正式出库',
					judgmentFlag : edit_flagLayout==''?'noBody':'body'
                    ,createMan : USERID
                    ,createUnit : USERDEPTID
                    ,installationBody : ''
                    ,financialSubjects : ''
                    ,useUnit : ''
                    ,conPartybNo : conPartybNos
                    
				}
				DWREngine.setAsync(false);
				wzbaseinfoMgm.addOrUpdateWzOut(obj, function(str) {
							ckuids = str;
						});
				DWREngine.setAsync(true);
				obj.uids=ckuids
	   			DWREngine.setAsync(false);
	   			wzbaseinfoMgm.insertWzOutSubFromStock(OutSubUids,ckuids,newCkNo,function(str){
	    			if(str == "1"){
	    				Ext.example.msg('提示信息','出库单材料选择成功！');
	    				url += "?conid="+selectConid+"&treeuids="+selectConid+"&uids="+ckuids+"&flagLayout="+edit_flagLayout;
	    			}else{
	    				Ext.example.msg('提示信息','出库单材料选择失败！');
	    			}
	    		});
	    		DWREngine.setAsync(true);
			}else{//修改
				DWREngine.setAsync(false);
	   			wzbaseinfoMgm.insertWzOutSubFromStock(OutSubUids,changeRecord.get('uids'),changeRecord.get('outNo'),function(str){
	    			if(str == "1"){
	    				Ext.example.msg('提示信息','出库单材料选择成功！');
	    				url += "?conid="+selectConid+"&treeuids="+selectConid+"&uids="+changeRecord.get('uids');
	    			}else{
	    				Ext.example.msg('提示信息','出库单材料选择失败！');
	    			}
	    		});
	    		DWREngine.setAsync(true);
			}
			selectWinShow(url,obj,formRecord,false);
		}else {
			var showFlag = 'hide';
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条出库单！');
		    	return ;
			}
			if(record.get('outNo').indexOf("-CHCK-") != -1){
				showFlag = 'show';
			}
			url += "?conid="+record.get("conid")+"&treeuids="+record.get("treeuids")+"&uids="+record.get("uids")+
			      "&flag=edit"+"&flagLayout="+edit_flagLayout+"&showFlag="+showFlag;
		   selectWinShow(url,obj,formRecord,false)
		}
	};
	
	function selectWinShow(url,obj,formRecord,falgs){		
	    if(selectWin){
	    	selectWin.destroy();
	    }
		selectWin = new Ext.Window({
			id:'selectwin',
			width: document.body.clientWidth,
			height: document.body.clientHeight,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			closable : falgs,
			closeAction :"hide",
			html:"<iframe id='equOut' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(p){
					flagaddorupdate=false;
					changeRecord=smOut.getSelected();
					tabPanel.hideTabStripItem(1);
					var subSql="select s.stock_id,s.equ_type from wz_goods_stock_out_sub s where s.out_id='"+changeRecord.get('uids')+"'";
					var tempequtype="";//已经选择的材料类型
					var cktreeuids="";//已经选择的材料主键
					DWREngine.setAsync(false);
					baseDao.getData(subSql,function(list){
						for(i = 0; i < list.length; i++) {
							cktreeuids += ",'"+list[i][0]+"'";		
						    tempequtype=list[i][1];
						}
					});	
					DWREngine.setAsync(true);
					cktreeuids = cktreeuids.substring(1);
					if(cktreeuids!=""){
					    ckStockIds=" and uids not in ("+cktreeuids+") and equ_type='"+tempequtype+"'";
					}
					selectUuid=changeRecord.get('treeuids');//根据出库单获得的材料合同分类树主键
					selectConid=changeRecord.get('conid');//根据出库单获得的材料合同主键
					ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids ='"+selectConid+"'";
					ds.reload();
					dsOut.reload();
					
				},
				'hide':function(t){
					flagaddorupdate=true;
					if(selectTreeid==""){
					   selectUuid="";
					   selectConid="";
					}
					changeRecord=null;
					loadFormRecord=null;
					var templength=selTreeuids.length;
					selTreeuids.splice(0,templength);
					ckStockIds="";
					ds.reload();
					dsOut.reload();
					dsOutSub.reload();
//					queHandler();
				},
				'show' : function(){
					equOut.location.href  = url;
				},
				'beforeshow':function(){
					tabPanel.unhideTabStripItem(1);
					tabPanel.setActiveTab(1);
					if(obj!=null){
					    loadFormRecord = new formRecord(obj);
					}
				    dsOut.reload();
			}
		}
	    });
		selectWin.show();
    }	
	
	function deleHandler(){
		var record = smOut.getSelected();
		if(record == null ||  record == ""){
		   Ext.example.msg('系统提示！','请选择您要删除的出库单信息！');
		   return;
		}
		Ext.Msg.show({
				title : '提示',
				msg : '是否删除该出库单及其出库详细信息？',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						gridPanelOut.getEl().mask("loading...");
						DWREngine.setAsync(false);
						wzbaseinfoMgm.deleteWzOutAndOutSub(record.get('uids'), function(flag) {
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
								equMgm.delEquGoodsFinishedRecord(record.get('uids'));
							} else{
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							DWREngine.setAsync(true);
							gridPanelOut.getEl().unmask();
						});
					}
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
//						if(billstate == 0){
						   downloadStr="附件["+count+"]";
						   editable = true;
//						}else{
//						   downloadStr="附件["+count+"]";
//						    editable = false;
//						}
						if(!(record.get('createMan') == USERID)){
                            editable = false;
                        }   
						return '<div id="sidebar"><a href="javascript:showUploadWin(\'' + businessType + '\', '
									+ editable + ', \'' + uidsStr + '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>';
			}

	// 冲回出入库功能
	function CKBackFn(){
	    var record = smOut.getSelected();
		if(record == null){
			Ext.example.msg("系统提示","请选择暂估出库记录！");
			return;
		}
	    var obj=new Object();//用于新增入库单
	    if(record.get('type') == '暂估出库' && record.get('finished') == 1){
	    	Ext.MessageBox.confirm('系统提示','是否对该记录进行冲回？',function(btn){
	    		if(btn == 'yes'){
					gridPanelOut.getEl().mask("loading...");
	    			var warehouseNos = [record.get('outNo').replace("-ZGCK-","-CHZG-"),record.get('outNo').replace("-ZGCK-","-CK-")];
	    			var typeArrS = ['冲回出库','正式出库'];
	    			obj = {
							uids : '',
							pid : record.get('pid'),
							conid : record.get('conid'),
							treeuids : record.get('treeuids'),
							finished : record.get('finished'),
							isInstallation : record.get('isInstallation'),
							outNo : '',
							outEstimateNo : record.get('outEstimateNo'),
							outBackNo : record.get('outBackNo'),
							outDate : new Date(),
							recipientsUnit : record.get('recipientsUnit'),
							grantDesc : record.get('grantDesc'),
							recipientsUser : record.get('recipientsUser'),
							recipientsUnitManager : record.get('recipientsUnitManager'),
							handPerson : record.get('handPerson'),
							type : record.get('type'),
							createMan : USERID,
							createUnit : USERDEPTID,
							judgmentFlag : record.get('judgmentFlag'),
							shipperNo : record.get('shipperNo'),
							proUse : record.get('proUse'),
							remark : record.get('remark'), 
							equid : record.get('equid'),
							fileid : record.get('fileid'),
							using : record.get('using'),
							dataType : record.get('dataType'),
							equname : record.get('equname'),
							kksNo : record.get('kksNo'),
							usingPart : record.get('usingPart'),
							financialSubjects : record.get('financialSubjects'),
							subjectAllname : record.get('subjectAllname'),
							conPartybNo : record.get('conPartybNo'),
							useUnit : record.get('useUnit'),
							dataSource : record.get('uids')
	    			}
	    			var count = 0;
	    			var newRkNo = "";
			        //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
			        var prefix = "";
			        var sql = "select warenocode from equ_warehouse where EQUID='"+record.get('equid')+"' and  pid='" + CURRENTAPPID+"'";
			        DWREngine.setAsync(false);
			        baseMgm.getData(sql, function(str){
			            prefix = str+"";
			        });
			        DWREngine.setAsync(true);
			        var current_year=(new Date().getFullYear()+"").substring(2);
					var current_month = (new Date().getMonth()+101+"").substring(1);
	    			for (var i = 0; i < typeArrS.length; i++) {
	    				if(typeArrS[i] == '冲回出库'){
	    					newRkNo = prefix+"-"+current_year+"-"+current_month+"-CHCK-";
							DWREngine.setAsync(false);
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"out_no","wz_goods_stock_out",null,"judgment_flag='body'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.outNo = newRkNo;
	    					obj.type = '冲回出库';
	    					obj.finished = 1;
	    				}else if(typeArrS[i] == '正式出库'){
	    					obj.type = '正式出库';
	    					obj.finished = 0;
					        var conno;//财务合同编码
							DWREngine.setAsync(false);
							baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOve", record.get('conid'),function(obj){
							    conno = obj.conno;
							});
							DWREngine.setAsync(true);
	    					newRkNo = prefix+"-"+current_year+"-"+current_month+"-ZSCK-";
							DWREngine.setAsync(false);
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"out_no","wz_goods_stock_out",null,"judgment_flag='body'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.outNo = newRkNo;
	    				}
						DWREngine.setAsync(false);
						wzbaseinfoMgm.zgckInsertChckAndZsckWzOut(record.get('uids'), obj,function(str) {
							if(str == 'success'){
								count ++;
							}
						});
						DWREngine.setAsync(true);
					}
					gridPanelOut.getEl().unmask();
					if(count == 2){
						dsOut.reload();
						var updateSql = "update wz_goods_stock_out set finish_mark='1' , finished_user='"+USERID+"'  where  uids='"+record.get('uids')+"'";
						DWREngine.setAsync(false);
						baseDao.updateBySQL(updateSql);
						DWREngine.setAsync(false);
						Ext.example.msg("系统提示", "冲回操作成功！");
					}
	    		}else{
	    			return;
	    		}
	    	})
	    }
	}

	//新增参与单位查询功能
	function queryHandler(){
		var where = '';
		if(unitBoxNo.getValue() == '' && unitBoxNo.getRawValue() == ''){
			where  = ' and 1=1 ';
		}else if(unitBoxNo.getValue() == '' && unitBoxNo.getRawValue() =='全部单位'){
			where  = ' and 1=1 ';
		} else{
			where = " and joinUnit = (select propertyCode from PropertyCode t where   " +
					" typeName =(select uids from PropertyType where typeName = '主体设备参与单位') " +
					" and detailType like '%"+unitBoxNo.getRawValue().replace(/[ ]/g,"")+"%')";
		}
		ds.baseParams.params = "pid='"+CURRENTAPPID+"'" + whereSql+where;
		ds.load({params:{start:0,limit:PAGE_SIZE}});
	}

	// 非主体材料加入冲回出库功能
	function backWzFn(){
		var record = smOut.getSelected();
		if(record == null){
			Ext.example.msg("系统提示","请选您要冲回入库的记录！");
			return false;
		}
		var str = record.data.outNo;
		if(str.indexOf("-CHCK-") != -1){
			Ext.example.msg("系统提示","该数据是冲回的数据，不能再次冲回！");
			return false;
		}
		var strArr = str.split("-");
		Ext.Msg.confirm("信息提示", "冲回后数据不可恢复，是否要冲回？", function(btn) {
			if(btn == 'yes'){
				var newRkNo = '';
				var value = '-';
				var str = record.data.outNo.replace("-CK-","-CHCK-");
				var strArr = str.split("-");
				for(var i = 1; i < strArr.length-1; i ++){
					value += strArr[i]+"-";
				}
				DWREngine.setAsync(false);
				equMgm.getEquNewDhNoToSb(CURRENTAPPID,value,"out_no","wz_goods_stock_out",null,"judgment_flag='noBody'",function(str){
					newRkNo = strArr[0]+str;
				});
				DWREngine.setAsync(true);
				DWREngine.setAsync(false);
				wzbaseinfoMgm.wzGoodsStockOutBack(record.data.uids,newRkNo,function(str){
					if(str == 'success'){
						Ext.example.msg('信息提示','冲回数据成功！');
						dsOut.reload();
						return true;
					}else{
						Ext.example.msg('信息提示','冲回数据失败！')
						return false;
					}
				});
				DWREngine.setAsync(true);
				return true;
			}else{
				smOut.clearSelections();
				return false;
			}
			
		})
	}
});
function finishOut(uids, getUsing, finished){
	var record = smOut.getSelected();
//	if (edit_flagLayout != "") {
//		if (!isFinance) {
//			Ext.example.msg('提示信息', '当前用户不是财务部用户，不能进行完结操作！');
//			finished.checked = false;
//			return;
//		}
//	}
	
	if(record == null || record == ""){
	    Ext.example.msg('信息提示','请选择您要完结的记录！');
	    return;
	}
	if(record.get("outNo") == null || record.get("outNo") == ""){
	    Ext.example.msg('信息提示','数据不完整，不能完结！');
	    finished.checked = false;
	    return;	
	}
	if((record.get('fileid') == null || record.get('fileid') == "")&&edit_flagLayout != ""){
	    Ext.MessageBox.confirm('确认', '该入库单<span style="color:red;">Word文档</span>打印之后没有保存，是否完结?',function(btn){
	    	if(btn == "yes"){
	    	    finishFn(uids,finished, record.get('equid'),getUsing);
	    	}else{
	    	   finished.checked = false;
	    	   return;
	    	}
	    })
	}else{
	    finishFn(uids,finished, record.get('equid'),getUsing);
	}
}

//完结操作
function finishFn(uids,finished, equid,getUsing) {
	Ext.Msg.show({
		title : '提示',
		msg : '完结后不可取消，不可编辑，确认要完结吗？',
		buttons : Ext.Msg.YESNO,
		icon : Ext.MessageBox.QUESTION,
		fn : function(value) {
			if ("yes" == value) {
				DWREngine.setAsync(false);
				wzbaseinfoMgm.wzOutFinished(uids,function(str){
					if(str == "1"){
						var rec = dsOut.getById(uids);
						//必须是主体材料正式出库 pengy 2014-01-17)
						if (rec.get('judgmentFlag') == 'body' && rec.get('type') == '正式出库'){
							faFixedAssetService.addFACompFixedAssetList(pid, equid, uids, getUsing, "CL", function(str) {
								if (str == 'true') {
									Ext.example.msg('提示信息', '出库单完结操作成功,主设备已添加到固定资产清单树！');
								} else {
									Ext.example.msg('提示信息', '出库单完结操作成功！');
								}
							});
						} else {
							Ext.example.msg('提示信息', '出库单完结操作成功！');
						}
						finished.checked = true;
						dsOut.reload();
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
    dsOut.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			} 
		});
	});
}
//TODO安装工程量
function openWinFun1(inSubUids){
	gclDs.baseParams.params = "pid='"+CURRENTAPPID+"' and fixedAssetList='"+inSubUids+"'";
	gclDs.load({params:{start:0,limit:PAGE_SIZE}});
	var openWin = new Ext.Window({
        title:'工程量信息',
        width : 800,
        height : 300,
        modal: true, 
        plain: true, 
        border: false, 
        layout: 'fit',
        resizable: false,
        closeAction :"hide",
        items : [gclGridPanel]
    });
    openWin.show();
}
	//设备清册
	quryButton = new Ext.Button({
		id:"quryButton",
		text:"查询",
		iconCls : 'option',
		handler:qury
	});
	//查询
		var gridColumns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
		{name:'treeId',type:'string'},
		{name:'equNo',type:'string'},
		{name:'equName',type:'string'},
		{name:'kksNo',type:'string'},
		{name:'ggxh',type:'string'},
		{name:'equMake',type:'string'},
		{name:'remark',type:'string'}
		]
		var equNo_q = new Ext.form.TextField({fieldLabel: '序号',name: 'equNo',anchor:'95%'});
		var equName_q = new Ext.form.TextField({fieldLabel: '设备名称',name: 'equName',anchor:'95%'});
		var kksNo_q = new Ext.form.TextField({fieldLabel: 'KKS编码',name: 'kksNo',anchor:'95%'});
		var ggxh_q = new Ext.form.TextField({fieldLabel: '设备型号规格',name: 'ggxh',anchor:'95%'});
		var equMake_q = new Ext.form.TextField({fieldLabel: '生产厂家',name: 'equMake',anchor:'95%'});
		var quryForm = new Ext.FormPanel({
			id: 'form-panel',
		  	header: false,
		 	width : 500,
		  	height: 250,
		  	split: true,
		  	collapsible : true,
		  	collapseMode : 'mini',
		  	border: false,
		  	bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
			iconCls: 'icon-detail-form',
			labelAlign: 'left',
		  	items:[
		   		 equNo_q,equName_q,kksNo_q,ggxh_q,equMake_q
		  ]
		});
		function qury(){
			quryWin = new Ext.Window({
				title:'设备清册查询',
				buttonAlign:'center',
				closable:false,
				layout:'fit',
				modal:'true',
				width:500,
				height:260,
				autoScroll:true,
				items:quryForm,
				buttons:[{id:'btnQury',text:'查询' ,handler:quryEquGoodsQc},{id:'btnClose',text:'关闭' ,handler:function(){quryWin.hide()}}]
			});
			quryWin.show();
		}
		function quryEquGoodsQc(){
	var obj = quryForm.getForm().getValues();
	var equNo = obj.equNo;
	var equName = obj.equName;
   	var kksNo = obj.kksNo;
   	var ggxh = obj.ggxh;
   	var equMake = obj.equMake;
	var str = "";
		if(equNo !=""){
			str += " and equNo like '%"+equNo+"%'";
		}
		if(equName != ""){
			str +=" and equName like '%"+equName+"%'";
		}
		if(kksNo !=""){
			str +=" and kksNo like '%"+kksNo+"%'";
		}
		if(ggxh !=""){
			str +=" and ggxh like '%"+ggxh+"%'";
		}
		if(equMake !=""){
			str +=" and equMake like '%"+equMake+"%'";
		}
		dsQc.baseParams.params = "pid='" + CURRENTAPPID + "'"+str+"";
		dsQc.load({params:{start: 0,limit: PAGE_SIZE}});
		quryForm.getForm().reset();
		quryWin.hide();	
}
    var sm =  new Ext.grid.CheckboxSelectionModel({})   //  创建选择模式
    
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	 'uids': {name: 'uids',fieldLabel: '设备主键',hidden:true,hideLabel:true}, 
    	 'pid': {name: 'pid',fieldLabel: '工程项目编号',hidden:true,hideLabel:true},
    	 'treeId': {name: 'treeId',fieldLabel: '设备清册树ID' ,hidden:true,hideLabel:true,anchor:'95%'},
    	 'equNo': {name: 'equNo',fieldLabel: '序号', anchor:'95%', allowBlank:false}, 
    	 'equName': {name: 'equName',fieldLabel: '设备名称',anchor:'95%',allowBlank:false}, 
    	 'kksNo': {name: 'kksNo',fieldLabel: 'KKS编码', anchor:'95%', allowBlank:false},
    	 'ggxh': {name: 'ggxh',fieldLabel: '设备型号规格',anchor:'95%',allowBlank:false}, 
    	 'equMake': {name: 'equMake',fieldLabel: '生产厂家', anchor:'95%'}, 
    	 'remark': {name: 'remark',fieldLabel: '备注',anchor:'95%'}
    }

     // 3. 定义记录集
    var Columns = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'treeId', type: 'string'},
    	{name: 'equNo', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'equName', type: 'string'},    	
		{name: 'kksNo', type: 'string' },
		{name: 'ggxh', type: 'string'},
		{name: 'equMake', type: 'string'},
		{name: 'remark', type: 'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集   	
    var PlantInt = {uids:'',pid:CURRENTAPPID, treeId: '', equNo:'', equName:'', kksNo:'', ggxh:'',  equMake:'',remark:''}	//设置初始值 
        
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{	id:"equNo",
    		header:fc['equNo'].fieldLabel,
    		dataIndex: fc['equNo'].name
    	},
    	{	id:'pid',
    		header: fc['pid'].fieldLabel,
    		dataIndex: fc['pid'].name,
    		hidden: true
    	},
        {	id:'uids',
        	header: fc['uids'].fieldLabel,
        	dataIndex: fc['uids'].name,
        	hidden: true
        },
        {	id:'treeId', 
        	header: fc['treeId'].fieldLabel, 
        	dataIndex: fc['treeId'].name, 
        	hidden: true
        },
        {	id:'equName',
        	header: fc['equName'].fieldLabel,
        	width:120,
        	dataIndex: fc['equName'].name
        },
        {	id:'kksNo', 
        	header: fc['kksNo'].fieldLabel,
        	width:120,
        	dataIndex: fc['kksNo'].name
        },
        {
         	id:'ggxh',
           	header: fc['ggxh'].fieldLabel,
           	dataIndex: fc['ggxh'].name
        },
        {
        	id:'equMake',header: fc['equMake'].fieldLabel,
        	width:150,
        	dataIndex: fc['equMake'].name
        },
        {
           id:'remark',
           header: fc['remark'].fieldLabel,
           width:200,
           dataIndex: fc['remark'].name
        }
    ]);

    cm.defaultSortable = true;						//设置是否可排序
      
    // 4. 创建数据源
    var dsQc = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: "com.sgepit.pmis.equipment.hbm.EquGoodsQc",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params: "pid='" + CURRENTAPPID + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uids'
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsQc.setDefaultSort("equNo", 'asc');	//设置默认排序列
    dsQc.load({params : {start : 0,limit : PAGE_SIZE}});
    // 5. 创建可编辑的grid: grid-panel
    var selectBtn = new Ext.Button({
		id:"selectBtn",
		text:'选择',
		iconCls:'option',
		handler:function(){
			var list =  sm.getSelections();
			var qcid = "";
			var uids;
			if(list != ""){
				for(var i=0;i<list.length;i++){
					var rec = list[i];
					qcid +=rec.get("uids")+","; 
				}
				if(smOutSub.getSelected()!=''){
					uids = smOutSub.getSelected().get("uids");
				}
				DWREngine.setAsync(false);
				wzbaseinfoMgm.updateQc(uids,qcid,function(str){
					if(str == 0){
						dsOutSub.reload();
						dsQc.reload();
						qcWin.hide();
					}else{
						Ext.example.msg("提示","请重新选择！");
					}
				});
				DWREngine.setAsync(true);
			}else{
				Ext.example.msg("提示","请选择您需要的数据！");
			}
		}
	});
    var grid = new Ext.grid.EditorGridPanel({
        // basic properties
    	id: 'grffid-panel',			//id,可选
        ds: dsQc,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			ignoreAdd: true
		},
		tbar:['->',quryButton,'-',selectBtn],
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsQc,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean:"com.sgepit.pmis.equipment.hbm.EquGoodsQc",					
      	business: "baseMgm",
      	primaryKey:"uids"
   }); 
   
	function showqCWin(){
		qcWin.show();
		dsQc.baseParams.params = "pid='" + CURRENTAPPID + "'";
		dsQc.load({params : {start : 0,limit : PAGE_SIZE}});
	}

	function showAssetWin(){
		assetWin.show();
	}