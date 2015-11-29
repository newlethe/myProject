var beanFormal = "com.sgepit.pmis.equipment.hbm.EquGoodsStock";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var beanOut = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOut";
var businessOut = "baseMgm";
var listMethodOut = "findWhereOrderby";
var primaryKeyOut = "uids";
var orderColumnOut = "uids";

var beanOutSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub";
var businessOutSub = "baseMgm";
var listMethodOutSub = "findWhereOrderby";
var primaryKeyOutSub = "uids";
var orderColumnOutSub = "uids";

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";

var selectTreeid = "";
var selectUuid = "";
var selectParentid = "";
var fileWin;
var selectWin;
var outContentPanel3;

var equTypeArr = new Array();
var unitArrS = new Array();
var useUnitArr = new Array();
var qcArr = new Array();
var dsFormal;
var dsOutFormal;
var smOut;
var tabPanelFormal;
var dsOutSubFormal;
var smOutSub;
var changeRecord;//更改部件时选中的出库单
var ckStockIds="";//设备主键   用于在库存中过滤出库单已选中的设备
var loadFormRecord = null;//新增出库单  用于选中新增的出库单

var flagaddorupdate=true;
var selTreeuids=new Array();
var equWareArr = new Array();
var subjectAllnameArr = new Array();
var pid = CURRENTAPPID;
var allowedDocTypes = "xls,xlsx,doc,docx";

var bdgArr = new Array();
var conPartybNoArr = new Array();
var qcWin;
var quryButton;
var treeIds = ""
var fm = Ext.form;
var businessType='zlMaterial';
//判断当前用户是否是财务部
//var isFinance = (USERDEPTID == '102010105') ? true : false;

Ext.onReady(function(){
	qcWin = new Ext.Window({
				id : 'selectqcwin',
				title : '设备清册明细',
				width : 800,
				height : document.body.clientHeight * 0.7,
				layout : 'fit',
				border : false,
				resizable : false,
				closeAction : "hide",
				items : [grid]
			});
	// 设备清册下拉框
	DWREngine.setAsync(false);
    baseMgm.getData("select e.uids,e.kksno from equ_goods_qc e where pid='"+CURRENTAPPID+"'",function(list){
     	for (var i = 0; i < list.length; i++) {
	            var temp = new Array();
	            temp.push(list[i][0]);
	            temp.push(list[i][1]);
	            qcArr.push(temp);
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
	//出库单位
    appMgm.getCodeValue("主体设备参与单位",function(list){
    	var allDw = ['','全部单位'];
    	unitArrS.push(allDw); 
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode); 
            temp.push(list[i].detailType);
            unitArrS.push(temp);         
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
	//TODO 把损坏赔偿加入到领料用途中去  yanglh 2013-11-22
	appMgm.getCodeValue("损坏赔偿",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
	        temp.push(list[i].propertyCode);
	        temp.push(list[i].propertyName+"-"+list[i].propertyCode);			
			bdgArr.push(temp);			
		}
	});
    //点击树节点时查询树子节点
    var  treeSql = "select a.uids from (select t.* from equ_con_ove_tree_view t" +
    		" where t.conid = '"+edit_conid+"') a start with a.treeid =" +
    		" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+edit_treeUids+"'  " +
    		" and a.conid = '"+edit_conid+"') connect by PRIOR a.treeid = a.parentid"
    baseMgm.getData(treeSql,function(str){
        if(str.length ==1){
          treeIds = " and treeuids='"+str+"'";
        }else if(str.length>1){
              treeIds = " and treeuids in ("
             for(var i=0;i<str.length;i++){
                if(i==0){
                   treeIds +="'"+str[i]+"'";
                }else{
                   treeIds +=",'"+str[i]+"'";
                }
             }
             treeIds += ")";
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
	baseMgm.getData("select t.treeid,t.subject_allname from FACOMP_FINANCE_SUBJECT t  where pid='" + CURRENTAPPID
                    + "' order by treeid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            subjectAllnameArr.push(temp);
        }
    });
    baseMgm.getData("select distinct q.cpid,q.partyb,t.conid from con_ove t,CON_PARTYB q " +
    		" where t.partybno= q.cpid ", function(list){
	           for (var i = 0; i < list.length; i++) {
		            var temp = new Array();
		            temp.push(list[i][0]);
		            temp.push(list[i][1]);
		            temp.push(list[i][2]);
		            conPartybNoArr.push(temp);
	           }
	    });
	//领用单位 yanglh 2013-09-28
    appMgm.getCodeValue("领用单位",function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode); 
            temp.push(list[i].propertyName);            
            useUnitArr.push(temp);         
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
    var unitDs = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : unitArrS
    })
    //查询表单
    var boxNo = new Ext.form.TextField({
		id: 'boxNo', name: 'boxNo',width : 80
	});
	var equPartName = new Ext.form.TextField({
		id: 'equPartName', name: 'equPartName',width : 80
	});
	var ggxh = new Ext.form.TextField({
		id: 'ggxh', name: 'ggxh',width : 80
	});
	var storage = new Ext.form.TextField({
		id: 'storage', name: 'storage',width : 80
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
		handler: EditHandler
	});
	var doSelect1 = new Ext.Button({
		id:"doChoose",
		text: '从暂估出库选择',
		iconCls: 'btn',
		disabled: true,
		handler: EditHandler
	});
	var addBtn = new Ext.Button({
		id : 'addBtn',
		text : '新增',
		iconCls : 'add',
		handler : EditHandler
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
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号'},
		'equType' : {name : 'equType',fieldLabel : '物资类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'stockNum' : {name : 'stockNum',fieldLabel : '库存数量',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）',decimalPrecision:4},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'stockNo' : {name : 'stockNo',fieldLabel: '存货编码'},
		'intoMoney' : {name : 'intoMoney',fieldLabel: '入库单价',decimalPrecision:4},
		'kcMoney' : {name : 'kcMoney',fieldLabel: '库存金额',decimalPrecision:4},
		'joinUnit' : {name : 'joinUnit',fieldLabel: '供货单位'},
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
			width : 100,
			hidden : true
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
			width : 80,
			renderer : function(v,m,r){
				for(var i = 0; i < unitArrS.length; i ++){
					if(v == ''){
                        return '';
                    }else if(v == unitArrS[i][0]){
						return unitArrS[i][1];
					}
				}
			},
			hidden : false
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
			width : 80
		},{
			id : 'stockNum',
			header : fc['stockNum'].fieldLabel,
			dataIndex : fc['stockNum'].name,
			align : 'right',
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
						storage = equWareArr[i][3]+"-"+equWareArr[i][2];
				}
				return storage;
			},
			align : 'center',
			hidden : true,
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
		{name:'intoMoney',type:'float'},
		{name:'weight', type:'float'},
		{name:'storage', type:'string'},
		{name:'stockNo',type:'string'},
		{name:'kcMoney',type:'float'},
		{name:'joinUnit',type:'string'},
		{name:'special',type:'string'},
		{name:'jzNo',type:'string'}
	];

	dsFormal = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanFormal,
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"' and judgment ='body' and conid='" + edit_conid + "'"
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
    dsFormal.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    cm.defaultSortable = true;

    dsFormal.on("beforeload",function(){
    	if(ckStockIds!=""){//过滤出库单已经选中的设备
    		dsFormal.baseParams.params+=ckStockIds;
    	}
    	if (dsFormal.baseParams.params.indexOf("stockNum<>0") == -1){
	    	dsFormal.baseParams.params+=" and stockNum<>0";
    	}
    })

	var unitBoxNo = new Ext.form.ComboBox({
		id : 'joinUnit',
		name : 'joinUnit',
		width : 80,
		fieldLabel : '供货单位',
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		editable : true,
		emptyText : '请输入或者下拉选择....',
		typeAhead : true,
		triggerAction : 'all',
		store : unitDs,
		width : 160
	});
	var unitDoQuery = new Ext.Button({
		text: '查询',
		iconCls: 'btn',
		handler: queryHandler
	});
    var gridPanel = new Ext.grid.GridPanel({
    	id:"stock",
		ds: dsFormal,
		cm: cm,
		sm:sm,
		title:"库存",
		border: false,
		tbar: ['<font color=#15428b><B>库存信息<B></font>','-',
			'<font color=#15428b>箱件号：</font>', boxNo, '-',
			'<font color=#15428b>设备名称：</font>', equPartName, '-', 
			'<font color=#15428b>规格型号：</font>', ggxh, '-', 
			//'<font color=#15428b>库位：</font>', storage, '-',
			doQuery, '-',doSelect1
//			'<font color=#15428b>参与单位：</font>', unitBoxNo, '-',unitDoQuery
			], //'-',doSelect,从库存选择物资按钮去掉，现从对应合同，出库单位对应参与单位相同的入库明细中选择物资。
		enableHdMenu : false,
		region: 'center',
		header: false, 
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsFormal,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
    //支持翻页选择
    storeSelects(dsFormal,sm);
	/*******************************库存end************************************************/
	/*******************************出库单基础信息start************************************************/
	var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
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
        'equname' : {name : 'equname',fieldLabel : '设备名称'},
        'outBackNo' : {name : 'outBackNo',fieldLabel : '冲回出库单据号'},
        'outEstimateNo' : {name : 'outEstimateNo',fieldLabel : '暂估出库单据号'},
        'type' :  {name : 'type',fieldLabel : '出库类型'},
        'dataType' :  {name : 'dataType',fieldLabel : '数据类型'},
        'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码'},
        'usingPart' : {name : 'usingPart',fieldLabel : '安装部位'},
        'financialSubjects' : {name : 'financialSubjects',fieldLabel : '对应财务科目'},
        'subjectAllname' : {name : 'subjectAllname', fieldLabel : '凭证财务科目'},
        'conPartybNo' : {name : 'conPartybNo', fieldLabel : '供货商'},
        'useUnit' : {name : 'useUnit',fieldLabel : '领用单位'},
		'finishMark' : {
			name : 'finishMark',
			fieldLabel : '暂估入库冲回',
			width : 160		    	 
	    }
	}
	
	smOut = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
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
				var str = "<input type='checkbox' "+(v==1?" disabled checked title='已完结' ":"title='未完结'")+" " +
						" onclick='finishOutFormal(\""+r.get("uids")+ "\",\""+ r.get("using") +"\",this)'>"
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
			width : 200
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
				for(var i=0;i<unitArrS.length;i++){
					if(v == ''){
                        return '';
                    }else if(v == unitArrS[i][0]){
						return unitArrS[i][1];
                    }
				}
			},
			width : 180
        }, {
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
			hidden: true,
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
			id:'financialSubjects',
			header: fcOut['financialSubjects'].fieldLabel,
			dataIndex: fcOut['financialSubjects'].name,
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
			renderer : function(v){
				if(v == '01') return '';
				for (var i=0;i<subjectAllnameArr.length;i++){
					if(subjectAllnameArr[i][0] == v){
						  var qtip = "qtip=" + subjectAllnameArr[i][1];
		                  return '<span ' + qtip + '>' + subjectAllnameArr[i][1] + '</span>';
					}
				}
			}
		},{
	        id : 'conPartybNo',
	        header : fcOut['conPartybNo'].fieldLabel,
	        dataIndex : fcOut['conPartybNo'].name,
	        renderer : function(v){
	            var conPartybNoss = "";
	            for (var i = 0; i < conPartybNoArr.length; i++) {
	                if (v == conPartybNoArr[i][0]){
	                   conPartybNoss = conPartybNoArr[i][1];
	                   break;
	                }
	                    
	            }
	            return conPartybNoss;
	        },
	        align : 'center',
	        width : 180
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
	        width : 90
	    },{
	        id : 'fileid',
	        header : '附件',
	        dataIndex : fcOut['fileid'].name,
	        renderer : filelistFn,/**function(v,m,r){
	            if(v == null || v =="")
	                return "<a href='javascript:uploadTemplate(\""+r.data.uids+"\")' title='上传'>上传</a>";
	            else
	                return "<a href='javascript:viewTemplate(\""+v+"\")' title='查看'>查看</a>";
	        },**/
	        align : 'center',
	        width : 100
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
			width : 80
		},{
			id:'kksNo',
			header: fcOut['kksNo'].fieldLabel,
			dataIndex: fcOut['kksNo'].name,
			hidden: true
		},{
			id:'usingPart',
			header: fcOut['usingPart'].fieldLabel,
			dataIndex: fcOut['usingPart'].name,
			hidden: true
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
		},{
			id:'dataType',
			header: fcOut['dataType'].fieldLabel,
			dataIndex: fcOut['dataType'].name,
            hidden: true,
			width : 180
		}, {
			id : 'finishMark',
			header : fcInto['finishMark'].fieldLabel,
			dataIndex : fcInto['finishMark'].name,
			align : 'center',
			hidden : true,
			width : 250
		}
	]);
	
	var ColumnsOut = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isInstallation', type : 'float'},
		{name : 'outNo', type : 'string'},
		{name : 'outEstimateNo' ,type : 'string'},
		{name : 'outBackNo' ,type : 'string'},
		{name : 'outDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'recipientsUnit', type : 'string'},
		{name : 'grantDesc', type : 'string'},
		{name : 'recipientsUser', type : 'string'},
		{name : 'recipientsUnitManager', type : 'string'},
		{name : 'handPerson', type : 'string'},
		{name : 'type' , type : 'string'},
		{name : 'shipperNo', type : 'string'},
		{name : 'proUse', type : 'string'},
		{name : 'remark', type : 'string'}, 
        {name : 'equid', type : 'string'},
        {name : 'fileid', type : 'string'},
        {name : 'using', type : 'string'},
        {name : 'dataType', type : 'string'},
        {name : 'equname', type : 'string'},
        {name : 'kksNo' ,type : 'string'},
        {name : 'usingPart' ,type : 'string'},
        {name : 'financialSubjects',type : 'string'},
        {name : 'subjectAllname' ,type : 'string'},
        {name : 'conPartybNo' ,type : 'string'},
        {name : 'useUnit' ,type : 'string'},
        {name : 'finishMark',type : 'string'}
	];

	dsOutFormal = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOut,				
	    	business: businessOut,
	    	method: listMethodOut,
	    	//params: "conid='"+edit_conid+"'"
	    	params: "dataType='"+DATA_TYPE+"' and pid='"+CURRENTAPPID+"' and conid='"+edit_conid+"'"+treeIds
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
    dsOutFormal.setDefaultSort(orderColumnOut, 'asc');
    cmOut.defaultSortable = true;
    
    var printBtn = new Ext.Button({
        text : '打印',
        iconCls : 'print',
        handler : doPrint
    });
    
    function doPrint(){
        var fileid = "";
        var fileName = "";
        var finished = "";
        var uids = ""
        var modetype = "SB";
        var record = smOut.getSelected();
        if(record != null && record != ""){
            uids = record.get("uids");
            fileid = record.get("fileid");
            fileName = record.get("outNo");
            finished = record.get("finished");
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        //var filePrintType =  "EquStockBodyOutView";
        //主体设备出库模板打印
        var filePrintType =  "EquBodysOutPrintView";
        var hasfile = false;
        //fileid为空，则打开模板，否则直接打开已经打印保存过的文件
        if(fileid == null || fileid == ""){
            var sql = "select t.fileid,t.filename from APP_TEMPLATE  t where t.templatecode='"+filePrintType+"'";
            DWREngine.setAsync(false);
            baseMgm.getData(sql,function(str){
            	if(str != null && str != ''){
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
            dsOutFormal.reload();
        }
    }
    treePanel.on('click',function(node){
 		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		selectTreeid = isRoot ? "0" : elNode.all("treeid").innerText;
		selectUuid = isRoot ? "0" : elNode.all("uuid").innerText;
		edit_conid = isRoot ? "0" : elNode.all("conid").innerText;
		selectParentid = isRoot ? "" : elNode.all("parentid").innerText;   
    })	
    
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
	
	//TODO 冲回出库功能及查询功能
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
		dsOutFormal.baseParams.params = where + " and dataType='"+DATA_TYPE+"' and pid='"+CURRENTAPPID+"' and conid='"+edit_conid+"'"+treeIds;
		dsOutFormal.load({params : {start : 0,limit : PAGE_SIZE}})
	}
		//新增冲回入库功能
	var CKQqueryBtn = new Ext.Button({
		id : 'CKquery',
		text : '查询',
		iconCls : 'btn',
		menu : CKfileMenu
	})
	
    var historyBtn = new Ext.Button({
        text : '历史数据出库生成固定资产',
        hidden : !(USERNAME == 'system'),
        handler : function(){
            //删除原始固定资产
            var sql1="DELETE FROM facomp_fixed_asset t WHERE t.treeuids IN (SELECT t.uids FROM facomp_fixed_asset_list t WHERE t.treeid LIKE '0103%' AND t.isleaf = '1')";
            db2Json.execute(sql1);
            //删除原始固定资产清单
            var sql2="DELETE FROM facomp_fixed_asset_list t WHERE t.treeid LIKE '0103%' AND t.treeid != '0103';";
            db2Json.execute(sql2);
            var sql = "SELECT T.EQUID,T.UIDS,T.USING FROM EQU_GOODS_STOCK_OUT T WHERE T.DATA_TYPE = 'EQUBODY' AND T.FINISHED = '1'"
            var bool = '';
            var m = 0;
            DWREngine.setAsync(false);
            gridPanelOut.getEl().mask("loading...");
            baseMgm.getData(sql,function(list){
                for(var i=0;i<list.length;i++){
                    var equid = list[i][0];
                    var uids = list[i][1];
                    var getUsing = list[i][2];
                    if (getUsing.substring(8,12) == "0102"){
                        m++;
		                faFixedAssetService.addFACompFixedAssetList(CURRENTAPPID, equid, uids, getUsing, "SB", function(str){
                            bool = str;
			            });
                    }
                }
            });
            DWREngine.setAsync(true);
            if(bool == 'true'){
                Ext.example.msg('提示信息', '出库单完结操作成功，已经完成'+m+'条出库单数据处理，主设备已添加到固定资产清单树！');
                gridPanelOut.getEl().unmask();
            }else{
                Ext.example.msg('提示信息','ERROR');
                gridPanelOut.getEl().unmask();
            }
        }
    })
    
	var gridPanelOut = new Ext.grid.GridPanel({
		ds : dsOutFormal,
		cm : cmOut,
		sm : smOut,
		title : '出库单信息',
		tbar : ['<font color=#15428b><B>出库单信息<B></font>','-',addBtn,'-',editBtn,'-',delBtn,'-',printBtn,'-',CKBackBtn,'-',CKQqueryBtn,'->',chooseRow,'-',historyBtn],
		header: false,
	    border: false,
	    //layout: 'fit',
	    height : document.body.clientHeight*0.6,
	    enableHdMenu : false,
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsOutFormal,
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
		'stockId' : {name : 'stockId',fieldLabel : '设备库存主键'},
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
        'kcMoney' : {name : 'kcMoney',fieldLabel: '库存余额',decimalPrecision:4},
        'useParts' : {name : 'useParts',fieldLabel : '安装部位'},
        'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码'},
        'qcId' : {
        			name : 'qcId', 
		            fieldLabel : 'KKS编码(生产)',
		            width : 200
        		},
        'memo' : {name : 'memo',fieldLabel : '备注'},
        'inSubUids' : {name:'inSubUids',fieldLabel : '入库单明细主键'},
        'inNum' : {name : 'inNum',fieldLabel : '入库数量'},
        'special' : {name : 'special',fieldLabel : '专业类别'},
        'jzNo' : {name : 'jzNo',fieldLabel : '机组号'}
	};

	smOutSub = new Ext.grid.CheckboxSelectionModel();
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
			width : 140
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
            hidden : true,
			width : 100
		},{
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
            width : 80
        },{
            id : 'amount',
            header : fcOutSub['amount'].fieldLabel,
            dataIndex : fcOutSub['amount'].name,
            align : 'right',
            width : 80
        },{
            id : 'kcMoney',
            header : fcOutSub['kcMoney'].fieldLabel,
            dataIndex : fcOutSub['kcMoney'].name,
            align : 'right',
            renderer : function(v,m,r){
                var otherOutMoney = 0;
	            var sql = " SELECT nvl(SUM(s.amount),0) FROM equ_goods_stock_out t, equ_goods_stock_out_sub s " +
	                " WHERE t.uids = s.out_id AND t.data_type = 'EQUBODY' AND t.type = (select type from equ_goods_stock_out where uids='"+r.get('outId')+"') " +
	                " AND s.box_no = '"+r.get('boxNo')+"' AND s.in_sub_uids = '"+r.get('inSubUids')+"' " +
	                " AND s.uids <> '"+r.get('uids')+"'";
	            DWREngine.setAsync(false);
	            baseMgm.getData(sql, function(list) {
	                if (list && list.length > 0) {
	                    otherOutMoney = list[0];
	                }
	            });
	            DWREngine.setAsync(true);
				return ( parseFloat((r.get('inNum')*r.get('price') - otherOutMoney - r.get('amount')).toFixed(2)));
			},
            width : 80
        }, {
			id : 'stockNum',
			header : "库存数量余额",
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
			hidden : true,
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
		},{
			id : 'gclName',
			header : "安装工程量",
			align : 'center',
			dataIndex : 'gclName',
            renderer : function(v,m,r){
            	var count = 0;
            	var value  = r.get('inSubUids');
            	DWREngine.setAsync(false);
            	baseDao.getData("select count(*) from bdg_project t where t.fixed_asset_list='"+value+"'",function(num){
            		count = num;
            	})
            	DWREngine.setAsync(true);
            	if(count == 0){
            		return "无";
            	}else{
            		return "<a title='工程量信息' style='color:blue;' href='javascript:void(0);' onclick='openWinFun(\""+value+"\");'>" + 
            				"共有【<span style='color:red;'>"+count+"</span>】个工程量" + "</a>"
            	}
            },
            align : 'right',
			width : 120
		}, {
			id : 'useParts',
			header : fcOutSub['useParts'].fieldLabel,
			dataIndex : fcOutSub['useParts'].name,
            align : 'center',
			width : 80
		}, {
			id : 'kksNo',
			header : fcOutSub['kksNo'].fieldLabel,
			dataIndex : fcOutSub['kksNo'].name,
            align : 'center',
			width : 80
		},{
			id : 'qcId',
			header : fcOutSub['qcId'].fieldLabel,
			dataIndex : fcOutSub['qcId'].name,
			hidden : true,
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
								if(i>=0 && i<list.length-1){
									kks +=list[i]+",";
								}else{
									kks +=list[i]+"";
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
			width : 130
		}, {
			id : 'memo',
			header : fcOutSub['memo'].fieldLabel,
			dataIndex : fcOutSub['memo'].name,
			renderer : function(v,m,r){
				 var qtip = "qtip=" + v;
		         return '<span ' + qtip + '>' + v + '</span>';
			},
			width : 180
		}, {
			id : 'inSubUids',
			header : fcOutSub['inSubUids'].fieldLabel,
			dataIndex : fcOutSub['inSubUids'].name,
			align : 'center',
            hidden : true,
			width : 100
		}, {
			id : 'inNum',
			header : fcOutSub['inNum'].fieldLabel,
			dataIndex : fcOutSub['inNum'].name,
			align : 'center',
            hidden : true,
			width : 100
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
		{name:'kcMoney',type:'float'},
		{name:'useParts',type:'string'},
		{name:'kksNo',type:'string'},
		{name:'qcId',type : 'string'},
		{name:'memo',type:'string'},
		{name:'inSubUids',type:'string'},
		{name:'inNum',type:'float'},
		{name:'special',type:'string'},
		{name:'jzNo',type:'string'}
	];
	dsOutSubFormal = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSub,
	    	business: businessOutSub,
	    	method: listMethodOutSub,
	    	params:  ' 1=2 '// "pid='"+CURRENTAPPID+"' and out_id in (select uids from  EquGoodsStockOut where conid='"+edit_conid+"' and treeuids='"+edit_treeUids+"')"
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
    dsOutSubFormal.setDefaultSort(orderColumnOutSub, 'desc');	//设置默认排序列
    cmOutSub.defaultSortable = true;
   
    dsOutFormal.on('load', function(s, r, o) {
		s.each(function(rec) {
			if(loadFormRecord!=null){//选中新增的出库单
				if (rec.get("uids")==loadFormRecord.get('uids')) {
					smOut.selectRecords([rec], true);
				}
		    }
		});
	})
	
   var cmArraySub = [['selectAll','全部']];
    var cmHideSub = new Array();
    
   	var store1Sub = new Ext.data.SimpleStore({  
          fields : ['k', 'v'],  
          data : cmArraySub
	}); 
   var  chooseRowSub = new Ext.form.MultiSelect({
         id:   'chooserowq',
         width:  150,
         store : store1Sub,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelOutSub.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowSub.setValue(cmHideSub);
		            cmSelectByIdSub(colModel,cmHideSub);
		        }else{
		            this.selectAll();
		            cmSelectByIdSub(colModel,this.getCheckedValue());
		        }
		    }else{
		        r.set(this.checkField, !r.get(this.checkField));
                chooseRowSub.setValue(this.getCheckedValue());
                cmSelectByIdSub(colModel,this.getCheckedValue());
		    }
		}
  });
 
  function cmSelectByIdSub(colModel,str){
    	var cmHide = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+1; i<colModel.getColumnCount();i++){
            for(var j=0;j<cmHide.length;j++){
                if(colModel.getDataIndex(i) == cmHide[j]){
                    colModel.setHidden(i,false);
                    break;
                }else{
                    colModel.setHidden(i,true);
                }
            }
        }
	}  	
    var gridPanelOutSub = new Ext.grid.EditorGridPanel({
		ds: dsOutSubFormal,
		cm: cmOutSub,
		sm:smOutSub,
		title:"出库单详细信息",
		tbar : ['->',chooseRowSub],
		border: false,
		region: 'south',
		header: false, 
		clicksToEdit:2,
		height : document.body.clientHeight*0.4,
		enableHdMenu : false,
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: false
		},
//		listeners:{
//			"cellclick":function(grid, rowIndex, columnIndex, e){
//				var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
//                //kks编码（生产）
//                if(fieldName == 'qcId'){
//                    showqCWin();
//                }
//			}
//		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsOutSubFormal,
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
	tabPanelFormal = new Ext.TabPanel({
		id : 'tabPanelFormal',
		activeTab : 1,//USERDEPTID == "102010103"?1:0
        border: false,
        region: 'center',
		items : [gridPanel,gridOutPanel]
	});
	
	outContentPanel3 = new Ext.Panel({
		id : 'outContentPanel3',
		layout : 'border',
		region : 'center',
		items : [tabPanelFormal]
	});

	dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
	dsOutFormal.load({params:{start:0,limit:PAGE_SIZE}});

	tabPanelFormal.on('tabchange',function(t,tab){
		if (t.activeTab.id=="stock"){
			dsFormal.reload();
			sm.clearSelections();
		} else if (t.activeTab.id=="stockOut"){
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
	});
	if(ModuleLVL>=3){
				   editBtn.setDisabled(true);	
				   delBtn.setDisabled(true);
				   doSelect.setDisabled(true);
				   doSelect1.setDisabled(true);
				}	
	smOut.on('rowselect',function(){
		var record = smOut.getSelected();
		if(record == null || record == "")return;
			if(ModuleLVL>=3){
				   editBtn.setDisabled(true);	
				   delBtn.setDisabled(true);
				   doSelect.setDisabled(true);
				   doSelect1.setDisabled(true);
				}else{
					  if(record.get('finished') == 1){
							editBtn.setDisabled(true);
							delBtn.setDisabled(true);
				            printBtn.setDisabled(false);
						}else{
							editBtn.setDisabled(false);
							delBtn.setDisabled(false);
				            printBtn.setDisabled(false);
						}
				}
		if(USERDEPTID == "102010103"){
		   delBtn.setDisabled(true);
		}else{
			if(record.get('finished') == 1){
				delBtn.setDisabled(true);
			}else{
				delBtn.setDisabled(false);
			}
		}
		if(record.get("type") == "暂估出库"){
			if((record.get("finishMark")!=1)&&(record.get("finished") == 1)){
				CKBackBtn.setDisabled(false);
			}else{
				CKBackBtn.setDisabled(true);
			}
		}else{
			CKBackBtn.setDisabled(true);
		}
		dsOutSubFormal.baseParams.params = "outId = '"+record.get('uids')+"'";
		dsOutSubFormal.load({params:{start:0,limit:PAGE_SIZE}});
	});
	//模糊查询
	function queHandler(){
		var querywheres="";
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
//		if ('' != qstorage){
//			querywheres += " and storage like '%"+qstorage+"%'";
//		}
		if(selectParentid!=null&&selectParentid!=""){
			if(selectParentid == "0"){
				dsFormal.baseParams.params = "pid='"+CURRENTAPPID+"' and judgment ='body' and conid='"+edit_conid+"'"+querywheres;
				dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
			}else{
					//查询当前选中节点的所有子节点主键。
					var sql = "select a.uuid from ( select t.* from equ_type_tree t " +
							" where t.conid = '"+edit_conid+"' ) a start with a.treeid = "+
							" (SELECT t.treeid from equ_type_tree t where t.uuid = '"+selectUuid+"' " +
							" and a.conid = '"+edit_conid+"') connect by PRIOR  a.treeid =  a.parentid";
					var treeuuidstr = "";
					DWREngine.setAsync(false);
					baseDao.getData(sql,function(list){
						for(i = 0; i < list.length; i++) {
							treeuuidstr += ",'"+list[i]+"'";		
						}
					});	
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					dsFormal.baseParams.params = "pid='"+CURRENTAPPID+"' and judgment ='body' and conid='"+edit_conid+"' and treeuids in ("+treeuuidstr+")"+querywheres;
					dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
			}
		}else{
			dsFormal.baseParams.params = "dataType='"+DATA_TYPE+"' and judgment ='body' and pid='"+CURRENTAPPID+"'"+querywheres;
		    dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
		}
	};
	//修改或选择操作
	function EditHandler(){
		var btnId = this.id;
		var record = smOut.getSelected();
		var url = BASE_PATH+"Business/equipment/baseInfo/equbody/equ.goods.stock.out.addorupdate.jsp";
		var obj=new Object();//用于新增出库单
		obj=null;
		var formRecord = Ext.data.Record.create(ColumnsOut);//用于新增出库单
		if(btnId=="doChoose"){
	         url = BASE_PATH+"Business/equipment/baseInfo/equbody/equ.goods.stock.out.estimate.list.jsp";
	         url += "?conid="+edit_conid+"&treeuids="+edit_treeUids+"&edit_flag=zgrk&dataType="+DATA_TYPE;
	         selectWinShow(url,obj,formRecord);
	         return;
		}

		if(btnId=="addBtn"){
    		var OutSubUids = new Array()
//    		var records = sm.getSelections();
//			var records = collectionToRecords();
//			if (records == null || records == "") {
//				Ext.example.msg('提示信息', '请先选择库存记录！');
//				return;
//			}
//			var sbType = records[0].get('equType');
//			for (var i = 0; i < records.length; i++) {
//				if (records[i].get('equType') != sbType) {
//					Ext.example.msg('提示信息', '请先选择库存中相同设备类型的设备！');
//					return;
//				}
//				OutSubUids.push(records[i].get("uids"));
//			}
    		
    		// 新增
    		if (changeRecord==null || changeRecord=="") {
				var conno;
				DWREngine.setAsync(false);
				baseMgm.findById(beanCon, edit_conid, function(obj) {
					conno = obj.conno;
				});
//                //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
//		        var prefix = "";
//		        var sql = "select c.property_name from PROPERTY_CODE c " +
//		                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
//		                " and c.property_code = '"+USERDEPTID+"' ";
//		        baseMgm.getData(sql, function(str){
//		            prefix = str.toString();
//		        });
				// 处理出库单号
				var newCkNo = "-" + conno.replace(/^\n+|\n+$/g,"") + "-CK-";
				var ckuids = "";
//				equMgm.getEquNewDhNo(CURRENTAPPID, newCkNo, "out_No",
//						"equ_goods_stock_out", null, function(str) {
//							newCkNo = str;
//						});
				equMgm.getEquNewDhNoToSb(CURRENTAPPID,newCkNo,"out_No","equ_goods_stock_out",null,"data_type='EQUBODY'",function(str){
					newCkNo = str;
				});
				DWREngine.setAsync(true);
				var conPartybCode = "";
				var conPartybId = "";
				var conPartybName = "";
				for(var i=0;i<conPartybNoArr.length;i++){
				    if(edit_conid == conPartybNoArr[i][2]){
				       conPartybId = conPartybNoArr[i][0];
				       conPartybName = conPartybNoArr[i][1];
				       conPartybCode = conPartybId;
				       break;
				    }
				}
				// 出库单位默认乙方单位
				for (var j = 0; j < unitArrS.length; j++) {
					if (conPartybName == unitArrS[j][1]) {
						conPartybCode = unitArrS[j][0];
						break;
					}
				}
				
				obj = {
					uids : '',
					pid : CURRENTAPPID,
					conid : edit_conid,
					treeuids : edit_treeUids,
					finished : 0,
					isInstallation : 0,
					outNo : '',//newCkNo,
					outDate : new Date(),
					recipientsUnit : conPartybCode,
					useUnit : '',
					grantDesc : '',
					recipientsUser : '',
					recipientsUnitManager : '',
					handPerson : REALNAME,
					shipperNo : '',
					dataType : DATA_TYPE,
					proUse : '',
					kksNo:'',
					qcId:'',
					usingPart:'',
					equid : '',
					remark : '',
					type : '正式出库',
                    createMan : USERID,
                    createUnit : USERDEPTID,
                    conPartybNo : conPartybId.toString()
				}
				DWREngine.setAsync(false);
				equMgm.addOrUpdateEquOut(obj, function(str) {
							ckuids = str;
						});
				DWREngine.setAsync(true);
				obj.uids=ckuids;
				url += "?conid="+edit_conid+"&treeuids="+selectUuid+"&uids="+ckuids+"&editBody=body";
//	   			DWREngine.setAsync(false);
//	   			equMgm.insertOutSubFromStock(OutSubUids,ckuids,newCkNo,function(str){
//	    			if(str == "1"){
//	    				Ext.example.msg('提示信息','出库单设备选择成功！');
//	    				url += "?conid="+edit_conid+"&treeuids="+selectUuid+"&uids="+ckuids+"&editBody=body";
//	    			}else{
//	    				Ext.example.msg('提示信息','出库单设备选择失败！');
//	    			}
//	    		});
//	    		DWREngine.setAsync(true);
			}else{
				//修改
				DWREngine.setAsync(false);
	   			equMgm.insertOutSubFromStock(OutSubUids,changeRecord.get('uids'),changeRecord.get('outNo'),"body",function(str){
	    			if(str == "1"){
	    				Ext.example.msg('提示信息','出库单设备选择成功！');
	    				url += "?conid="+edit_conid+"&treeuids="+selectUuid+"&uids="+changeRecord.get('uids')+"&editBody=body";
	    			}else{
	    				Ext.example.msg('提示信息','出库单设备选择失败！');
	    			}
	    		});
	    		DWREngine.setAsync(true);
			}
		}else {
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条出库单！');
		    	return ;
			}		
			url += "?conid="+record.get("conid")+"&treeuids="+record.get("treeuids")+"&uids="+record.get("uids")+"&flag=edit"+"&editBody=body";
		}
		url=url+"&mark=markTrue"
		selectWinShow(url,obj,formRecord);
	};
	function selectWinShow(url,obj,formRecord){
			if(selectWin){
	    	selectWin.destroy();
	    }
		selectWin = new Ext.Window({
			id:'selectwin',
			width: document.body.clientWidth,
			height: document.body.clientHeight*0.9,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			closable:false,
			closeAction :"hide",
			html:"<iframe id='equOut' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(p){
					flagaddorupdate=false;
					changeRecord=smOut.getSelected();
					tabPanelFormal.hideTabStripItem(1);
					var subSql="select s.stock_id,s.equ_type from equ_goods_stock_out_sub s where s.out_id='"+changeRecord.get('uids')+"'";
					var tempequtype="";//已经选择的设备类型
					var cktreeuids="";//已经选择的设备主键
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
					selectUuid=changeRecord.get('treeuids');//根据出库单获得的设备合同分类树主键
					selectConid=changeRecord.get('conid');//根据出库单获得的设备合同主键
					var sql = "select a.uuid from ( select t.* from equ_type_tree t " +
						" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
						" (SELECT t.treeid from equ_type_tree t where t.uuid = '"+selectUuid+"' " +
						" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
					var treeuuidstr = "";
					DWREngine.setAsync(false);
					baseDao.getData(sql,function(list){
						for(i = 0; i < list.length; i++) {
							if(list.length ==1){
							     treeuuidstr =  "'"+list[i]+"'";
							     selTreeuids.push(list[i]);
							     break;
							}else{
							    if(i>=0&&i<list.length-1){
							        treeuuidstr += ",'"+list[i]+"'";
							    }else{
							        treeuuidstr += "'"+list[i]+"'";
							    }
							}
							selTreeuids.push(list[i]);
						}
					});	
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					dsFormal.baseParams.params = "pid='"+CURRENTAPPID+"' and judgment ='body' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
					dsOutFormal.baseParams.params="dataType='"+DATA_TYPE+"'  and pid='"+CURRENTAPPID+"' and outId in (select uids from EquGoodsStockOut where conid='"+selectConid+"' and treeuids ("+treeuuidstr+")"
					dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
					dsOutFormal.load();
					
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
					dsFormal.reload();
					dsOutFormal.reload();
					dsOutSubFormal.reload();
//					queHandler();
				},
				'show' : function(){
					equOut.location.href  = url;
				},
				'beforeshow':function(){
					tabPanelFormal.unhideTabStripItem(1);
					tabPanelFormal.setActiveTab(1);
					if(obj!=null){
					    loadFormRecord = new formRecord(obj);
					}
				    dsOutFormal.reload();
			}
		}
	    });
		selectWin.show();
	}
	function deleHandler(){
		var record = smOut.getSelected();
		if(record == null || record == ""){
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
						equMgm.deleteOutAndOutSub(record.get('uids'),"EQUBODY", function(flag) {
							if ("0" == flag) {
								Ext.example.msg('删除成功！', '您成功删除了该出库单信息！');
								dsOutFormal.reload();
								dsFormal.reload();
								if((dsOutFormal.getTotalCount()-1)>0){
									smOut.selectRow(0);
								}else{
									dsOutSubFormal.removeAll();
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
    
//TODO 冲回入库功能
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
					gridPanelInto.getEl().mask("loading...");
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
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"out_no","equ_goods_stock_out",null,"data_type='EQUBODY'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.outNo = newRkNo;
	    					obj.type = '冲回出库';
	    					obj.finished = 1;
	    				}else if(typeArrS[i] == '正式出库'){
	    					obj.type = '正式出库';
	    					obj.finished = 0;
					        var conno; //合同编码
							DWREngine.setAsync(false);
							baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOve", record.get('conid'),function(obj){
							    conno = obj.conno;
							});
							DWREngine.setAsync(true);
	    					newRkNo = prefix+"-"+current_year+"-"+current_month+"-ZSCK-";
							DWREngine.setAsync(false);
							equMgm.getEquNewDhNoToSbCG(CURRENTAPPID,newRkNo,"out_no","equ_goods_stock_out",null,"data_type='EQUBODY'",function(str){
								newRkNo = str;
							});
							DWREngine.setAsync(true);
							obj.outNo = newRkNo;
	    				}
						DWREngine.setAsync(false);
						equMgm.zgckInsertChckAndZsck(record.get('uids'), obj,function(str) {
							if(str == 'success'){
								count ++;
							}
						});
						DWREngine.setAsync(true);
					}
					gridPanelInto.getEl().unmask();
					if(count == 2){
						dsOutFormal.reload();
						var updateSql = "update equ_goods_stock_out set finish_mark='1' , finished_user='"+USERID+"'  where  uids='"+record.get('uids')+"'";
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
	
	//TODO 按参与单位查询
	function queryHandler(){
		var where = '';
		if(unitBoxNo.getValue() == '' && unitBoxNo.getRawValue() == ''){
			where  = ' and 1=1 ';
		}else if(unitBoxNo.getValue() == '' && unitBoxNo.getRawValue() == '全部单位'){
			where  = ' and 1=1 ';
		}else{
			where = " and joinUnit = (select propertyCode from PropertyCode t where   " +
					" typeName =(select uids from PropertyType where typeName = '主体设备参与单位') " +
					" and detailType like '%"+unitBoxNo.getRawValue().replace(/[ ]/g,"")+"%')"
		}
		dsFormal.baseParams.params = "pid='"+CURRENTAPPID+"' and judgment ='body' and  conid='" + edit_conid + "'"+where;
		dsFormal.load({params:{start:0,limit:PAGE_SIZE}});
	}
    
    
});
function finishOutFormal(uids,getUsing,finished){
	var record = smOut.getSelected();
//	if (!isFinance) {
//		Ext.example.msg('提示信息', '当前用户不是财务部用户，不能进行完结操作！');
//		finished.checked = false;
//		return;
//	}
	if(record == null || record == ''){
	   Ext.example.msg('提示信息','请选择您要完结的出库单！');
	   return;
	}else{
		 if(record.get('outNo')==null || record.get('outNo') == ""){
		      Ext.example.msg('提示信息','出库单数据不完整，请填写完整在完结！');
		      finished.checked = false;
	          return;
		 }
		 if(record.get('fileid') == null || record.get('fileid') == ""){
		        Ext.MessageBox.confirm('确认', '该入库单<span style="color:red;">Word文档</span>打印之后没有保存，是否完结?',function(btn){
		           if(btn == 'yes'){
		               finisheds(uids,finished, record.get('equid'),getUsing);
		           }else{
					   finished.checked = false;
					   return;		           
		           }
		        })
		 }else{
		    Ext.MessageBox.confirm('提示', '请确保数据无误和打印后再进行完结，确认要完结？',function(btn){
		    	if(btn == 'yes'){
		    		finisheds(uids,finished, record.get('equid'),getUsing);
		    	}else{
		    		finished.checked = false;
					return;	
		    	}
		    });
		 }
	}
}

//完结操作
function finisheds(uids,finished, equid,getUsing) {
	Ext.Msg.show({
				title : '提示',
				msg : '完结后不可取消，不可编辑，确认要完结吗？',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						DWREngine.setAsync(false);
						equMgm.equOutFinished(uids, function(str) {
									if (str == "1") {
										var rec = dsOutFormal.getById(uids);
										//如果领用用途是损坏赔偿，不加入固定资产中去 yanglh 2013-11-22
										if(getUsing.substring(0, 2) == '02'){
											Ext.example.msg('提示信息', '出库单完结操作成功！');
										}else if (rec.get('dataType') == 'EQUBODY' && rec.get('type') == '正式出库'){
											//必须是主体设备正式出库 pengy 2014-01-17
											faFixedAssetService.addFACompFixedAssetList(pid, equid, uids, getUsing, "SB", function(str){
												if (str == 'true'){
													Ext.example.msg('提示信息', '出库单完结操作成功,主设备已添加到固定资产清单树！');
												}else {
													Ext.example.msg('提示信息', '出库单完结操作成功！');
												}
											});
										} else {
											Ext.example.msg('提示信息', '出库单完结操作成功！');
										}
										finished.checked = true;
										dsOutFormal.reload();
									} else if (str == "2") {
										Ext.example.msg('提示信息',
												'该出库单已经开始安装，不能取消完结！');
										finished.checked = false;
									} else {
										Ext.example.msg('提示信息', '操作出错！');
										finished.checked = false;
									}
								});
						DWREngine.setAsync(true);
					} else {
						finished.checked = false;
					}
				}
			});
}

//文档上传
function viewTemplate(fileid){
    window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid)
}

function uploadTemplate(uids) {
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
                    if (allowedDocTypes.indexOf(fileExt) == -1) {
                        Ext.MessageBox.alert("提示", "请选择Office文档！");
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
                            //保存上传后的文档fileid
                            DWREngine.setAsync(false);
                            equMgm.saveFile(fileid,uids,beanFormal,function(str){
                            });
                            DWREngine.setAsync(true);
                            dsFormal.reload();
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
		ds.baseParams.params = "pid='" + CURRENTAPPID + "'"+str+"";
		ds.load({params:{start: 0,limit: PAGE_SIZE}});
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
    var ds = new Ext.data.Store({
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
    ds.setDefaultSort("equNo", 'asc');	//设置默认排序列
    ds.load({params : {start : 0,limit : PAGE_SIZE}});
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
				equMgm.updateQc(uids,qcid,function(str){
					if(str == 0){
						dsOutSubFormal.reload();
						ds.reload();
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
        ds: ds,						//数据源
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
            store: ds,
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
		ds.baseParams.params = "pid='" + CURRENTAPPID + "'";
		ds.load({params : {start : 0,limit : PAGE_SIZE}});
	}
	//TODO 显示工程量信息
function openWinFun(inSubUids){
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
	   downloadStr="附件["+count+"]";
	    editable = true;
	//}
	return '<div id="sidebar"><a href="javascript:showUploadWin(\''
				+ businessType + '\', ' + editable + ', \''
				+ uidsStr
				+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
		
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
		dsOutFormal.reload();
	});
}

