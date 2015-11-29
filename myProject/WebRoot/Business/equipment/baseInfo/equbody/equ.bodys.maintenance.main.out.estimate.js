var beanEs = "com.sgepit.pmis.equipment.hbm.EquGoodsStock"
var businessEs = "baseMgm"
var listMethodEs = "findWhereOrderby"
var primaryKeyEs = "uids"
var orderColumn = "uids"

var beanOutEs = "com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimate"
var businessOutEs = "baseMgm"
var listMethodOutEs = "findWhereOrderby"
var primaryKeyOutEs = "uids"
var orderColumnOutEs = "uids"

var beanOutSubEs = "com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimateSub"
var businessOutSubEs = "baseMgm"
var listMethodOutSubEs = "findWhereOrderby"
var primaryKeyOutSubEs = "uids"
var orderColumnOutSubEs = "uids"


var beanConEs = "com.sgepit.pmis.contract.hbm.ConOve"

var selectTreeid = "";
var selectUuid = "";
var selectConid = "";
var selectParentid = "";

var selectWinEs;
var outContentPanel1;
var gridPanelOutSub1;


var equTypeArrEs = new Array();
var unitArrEs = new Array();
var dsEs;
var dsOutEs;
var smOutEs;
var tabPanelEs;
var dsOutSubEs;
var changeRecord;//更改部件时选中的出库单
var ckStockIds="";//设备主键   用于在库存中过滤出库单已选中的设备
var loadFormRecordEs = null;//新增出库单  用于选中新增的出库单

var flagaddorupdateEs=true;
var selTreeuidsEs=new Array();
var equWareArrEs = new Array();
var pid = CURRENTAPPID;
var businessTypeEs = "zlMaterial";
var bdgArrEs = new Array();

var treeIds = ""

//判断当前用户是否是财务部
//var isFinance = (USERDEPTID == '102010105') ? true : false;

Ext.onReady(function(){
	
		//处理设备仓库下拉框
	    DWREngine.setAsync(false);
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
	//设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			equTypeArrEs.push(temp);			
		}
	});
	//领用单位
    appMgm.getCodeValue("领用单位",function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode); 
            temp.push(list[i].propertyName);            
            unitArrEs.push(temp);         
        }
    });

    baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArrEs.push(temp);
        }
    })
    
    //点击树节点时查询树子节点
    var  treeSql = "select a.uids from (select t.* from equ_con_ove_tree_view t" +
    		" where t.conid = '"+edit_conid+"') a start with a.treeid =" +
    		" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+edit_treeUids+"'  " +
    		" and a.conid = '"+edit_conid+"') connect by PRIOR a.treeid = a.parentid"
    baseMgm.getData(treeSql,function(str){
        if(str.length ==1){
          treeIds = " and treeuids='"+str+"'"
        }else if(str.length>1){
              treeIds = " and treeuids in ("
             for(var i=0;i<str.length;i++){
                if(i==0){
                   treeIds +="'"+str[i]+"'";
                }else{
                   treeIds +=",'"+str[i]+"'";
                }
             }
             treeIds += ")"
        }
    });     
	DWREngine.setAsync(true);
    // 设备仓库系统编码下来框
    var getEquid = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : equWareArrEs
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
		'dataType' : {name : 'dataType' ,fieldLabel : '数据类型'},
		'stockNo' : {name : 'stockNo' ,fieldLabel : '存货编码'},
		'intoMoney' : {name : 'intoMoney' ,fieldLabel : '入库单价',decimalPrecision:2},
		'kcMoney' : {name : 'kcMoney' ,fieldLabel : '库存金额',decimalPrecision:2}
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
		   width  : 160
		},{
			id : 'equType',
			header : fc['equType'].fieldLabel,
			dataIndex : fc['equType'].name,
			renderer : function(v,m,r){
				var equ = "";
				for(var i=0;i<equTypeArrEs.length;i++){
					if(v == equTypeArrEs[i][0])
						equ = equTypeArrEs[i][1];
				}
				return equ;
			},
			align : 'center',
			width : 100
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
				for(var i=0;i<equWareArrEs.length;i++){
					if(v == equWareArrEs[i][0])
						storage = equWareArrEs[i][3]+"-"+equWareArrEs[i][2];
				}
				return storage;
			},
			align : 'center',
//			hidden : true,
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
		{name:'dataType', type:'string'},
		{name:'stockNo',type:'string'},
		{name:'kcMoney',type:'float'}
	];
	dsEs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanEs,
	    	business: businessEs,
	    	method: listMethodEs,
	    	params: "pid='"+CURRENTAPPID+"' and judgment ='body' and makeType='暂估入库' and conid='" + edit_conid + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyEs
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsEs.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    cm.defaultSortable = true;
//    ds.on('load', function(s, r, o) {
//		s.each(function(rec) {
//			if (collection.get(rec.get("uids"))!=null) {
//				sm.selectRecords([rec], true);
//			}
//		});
//		collection.clear();
//	})
    dsEs.on("beforeload",function(){
    	if(ckStockIds!=""){//过滤出库单已经选中的设备
    		dsEs.baseParams.params+=ckStockIds;
    	}
    	dsEs.baseParams.params+=" and stockNum>0"
    })
  var  gridPanelEs = new Ext.grid.GridPanel({
    	id:"stockEs",
		ds: dsEs,
		cm: cm,
		sm:sm,
		title:"库存",
		border: false,
		tbar: ['<font color=#15428b><B>库存信息<B></font>','-',
			'<font color=#15428b>箱件号：</font>', boxNo, '-',
			'<font color=#15428b>设备名称：</font>', equPartName, '-', 
			'<font color=#15428b>规格型号：</font>', ggxh, '-', 
			//'<font color=#15428b>库位：</font>', storage, '-',
			doQuery, '-',doSelect,'-'],
		region: 'center',
		enableHdMenu : false,
		header: false, 
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsEs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	/*******************************库存end************************************************/
	/*******************************暂估出库单基础信息start************************************************/
	var fcOutEs = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
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
        
        'equid' : {name : 'equid', fieldLabel : '仓库号'},
        'fileid' : {name : 'fileid',fieldLabel : '附件'},
        'using' : {name : 'using',fieldLabel : '领料用途'},
        'equname' : {name : 'equname',fieldLabel : '设备名称'},
        'type' : {name : 'type',fieldLabel : '出库类型'},
        'kks' : {name : 'kks',fieldLabel : 'KKS编码'},
        'dataType' : {name : 'dataType',fieldLabel : '数据类型'},
        'usingPart' : {name : 'usingPart',fieldLabel : '安装部位'}
 	}
	
	smOutEs = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cmOut = new Ext.grid.ColumnModel([
		//sm,
		{
			id:'uids',
			header: fcOutEs['uids'].fieldLabel,
			dataIndex: fcOutEs['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fcOutEs['pid'].fieldLabel,
			dataIndex: fcOutEs['pid'].name,
			hidden: true
		},{
			id:'conid',
			header: fcOutEs['conid'].fieldLabel,
			dataIndex: fcOutEs['conid'].name,
			hidden: true
		},{
			id:'treeuids',
			header: fcOutEs['treeuids'].fieldLabel,
			dataIndex: fcOutEs['treeuids'].name,
			hidden: true
		},{
			id:'finished',
			header: fcOutEs['finished'].fieldLabel,
			dataIndex: fcOutEs['finished'].name,
			renderer : function(v,m,r){
				var o = r.get("isInstallation");
				var str = "<input type='checkbox' "+(v==1?" disabled checked title='已完结' ":"title='未完结'")+" onclick='finishOutEs(\""+r.get("uids")+"\",this)'>"
				return str;
			},
			width : 40
		},{
			id:'isInstallation',
			header:fcOutEs['isInstallation'].fieldLabel,
			dataIndex: fcOutEs['isInstallation'].name,
			hidden: true
		},{
			id:'type',
			header: fcOutEs['type'].fieldLabel,
			dataIndex: fcOutEs['type'].name,
			hidden: true
		},{
			id:'outNo',
			header: fcOutEs['outNo'].fieldLabel,
			dataIndex: fcOutEs['outNo'].name,
			width : 230
		},{
			id:'outDate',
			header: fcOutEs['outDate'].fieldLabel,
			dataIndex: fcOutEs['outDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 80
		},{
			id:'recipientsUnit',
			header: fcOutEs['recipientsUnit'].fieldLabel,
			dataIndex: fcOutEs['recipientsUnit'].name,
			renderer : function(v){
				var unit = "";
				for(var i=0;i<unitArrEs.length;i++){
					if(v == unitArrEs[i][0])
						unit = unitArrEs[i][1];
				}
				return unit;
			},
			width : 180
        },{
            id : 'equname',
            header : fcOutEs['equname'].fieldLabel,
            dataIndex : fcOutEs['equname'].name,
            hidden: true,
            width : 180
        }, {
            id:'using',
            header: fcOutEs['using'].fieldLabel,
            dataIndex: fcOutEs['using'].name,
            renderer : function(v){
                var using = "";
                for (var i = 0; i < bdgArrEs.length; i++) {
                    if (v == bdgArrEs[i][0])
                        using = bdgArrEs[i][1];
                }
                return using;
            },
            align : 'center',
            width : 220
		},{
	        id : 'equid',
	        header : fcOutEs['equid'].fieldLabel,
	        dataIndex : fcOutEs['equid'].name,
	        renderer : function(v){
	            var equid = "";
	            for (var i = 0; i < equWareArrEs.length; i++) {
	                if (v == equWareArrEs[i][1])
	                    equid = equWareArrEs[i][3]+" - "+equWareArrEs[i][2];
	            }
	            return equid;
	        },
	        align : 'center',
	        width : 180
	    },{
	        id : 'fileid',
	        header : fcOutEs['fileid'].fieldLabel,
	        dataIndex : fcOutEs['fileid'].name,
	        renderer : filelistFn,
	        align : 'center',
	        width : 100
	    }, {
			id:'grantDesc',
			header: fcOutEs['grantDesc'].fieldLabel,
			dataIndex: fcOutEs['grantDesc'].name,
            hidden: true,
			width : 180
		},{
			id:'recipientsUser',
			header: fcOutEs['recipientsUser'].fieldLabel,
			dataIndex: fcOutEs['recipientsUser'].name,
            hidden: true,
			width : 160
		},{
			id:'recipientsUnitManager',
			header: fcOutEs['recipientsUnitManager'].fieldLabel,
			dataIndex: fcOutEs['recipientsUnitManager'].name,
            hidden: true,
			width : 160
		},{
			id:'handPerson',
			header: fcOutEs['handPerson'].fieldLabel,
			dataIndex: fcOutEs['handPerson'].name,
            hidden: true,
			width : 160
		},{
			id:'shipperNo',
			header: fcOutEs['shipperNo'].fieldLabel,
			dataIndex: fcOutEs['shipperNo'].name,
            hidden: true,
			width : 160
		},{
			id:'proUse',
			header: fcOutEs['proUse'].fieldLabel,
			dataIndex: fcOutEs['proUse'].name,
            hidden: true,
			width : 160
		},{
			id:'kks',
			header: fcOutEs['kks'].fieldLabel,
			dataIndex: fcOutEs['kks'].name,
            hidden: true,
			width : 160
		},{
			id:'usingPart',
			header: fcOutEs['usingPart'].fieldLabel,
			dataIndex: fcOutEs['usingPart'].name,
            hidden: true,
			width : 160
		
		},{
			id:'remark',
			header: fcOutEs['remark'].fieldLabel,
			dataIndex: fcOutEs['remark'].name,
            hidden: true,
			width : 180
		},{
			id:'dataType',
			header: fcOutEs['dataType'].fieldLabel,
			dataIndex: fcOutEs['dataType'].name,
            hidden: true,
			width : 180
		}
	]);
	
	var ColumnsOut = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isInstallation', type : 'float'},
		{name : 'type' ,type: 'string'},
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
        {name : 'equid', type : 'string'},
        {name : 'fileid', type : 'string'},
        {name : 'using', type : 'string'},
        {name : 'dataType', type : 'string'},
        {name : 'equname', type : 'string'}
	];

	dsOutEs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutEs,				
	    	business: businessOutEs,
	    	method: listMethodOutEs,
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
            id: primaryKeyOutEs
        }, ColumnsOut),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsOutEs.setDefaultSort(orderColumnOutEs, 'asc');
    cmOut.defaultSortable = true;
    
    var printBtn = new Ext.Button({
        text : '打印',
        iconCls : 'print',
        handler : doPrint
    });
    
    function doPrint(){
        var fileid = "";
        var uids = ""
        var modetype = "SB";
        var record = smOutEs.getSelected();
        if(record != null && record != ""){
            uids = record.get("uids");
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        var filePrintType = "EquStockOutEsView";
        var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"+filePrintType+"'";
        DWREngine.setAsync(false);
        baseMgm.getData(sql,function(str){
            fileid = str;
        });
        DWREngine.setAsync(true);
        if(fileid == null || fileid == ""){
            Ext.MessageBox.alert("文档打印错误","文档打印模板不存在，请先在系统管理中添加！");
            return;
        }else{
            var docUrl = BASE_PATH + "Business/equipment/equMgm/equ.file.print.jsp?fileid="+fileid;
            docUrl += "&filetype="+filePrintType
            docUrl += "&uids="+uids
            docUrl += "&modetype="+modetype
//            window.open(docUrl)
            window.showModalDialog(docUrl,"","dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
        }
    }
	
    var estimateBtn = new Ext.Button({
		text : '冲回出库',
		iconCls : 'btn',
		handler : estimateHandler
	});
	
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
         	var colModel = gridPanelOut1.getColumnModel();
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
		
	var gridPanelOut1 = new Ext.grid.GridPanel({
		ds : dsOutEs,
		cm : cmOut,
		sm : smOutEs,
		title : '暂估出库单信息',
		tbar : ['<font color=#15428b><B>暂估出库单信息<B></font>','-',editBtn,'-',delBtn,'-',printBtn,'->',chooseRow],//'-',estimateBtn
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
            store: dsOutEs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	/******************************暂估出库单基础信息end************************************************/
	/******************************暂估出库单明细信息start************************************************/
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
        'kcMoney' : {name : 'kcMoney', fieldLabel : '库存金额', decimalPrecision : 4},
        'useParts' : {name : 'useParts',fieldLabel : '安装部位'},
        'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码'}
        
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
			width : 200
		},{
			id : 'equType',
			header : fcOutSub['equType'].fieldLabel,
			dataIndex : fcOutSub['equType'].name,
			renderer : function(v,m,r){
				var equ = "";
				for(var i=0;i<equTypeArrEs.length;i++){
					if(v == equTypeArrEs[i][0])
						equ = equTypeArrEs[i][1];
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
			width : 200
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
            width : 100
        },{
            id : 'amount',
            header : fcOutSub['amount'].fieldLabel,
            dataIndex : fcOutSub['amount'].name,
            align : 'right',
            width : 100
        },{
            id : 'kcMoney',
            header : fcOutSub['kcMoney'].fieldLabel,
            dataIndex : fcOutSub['kcMoney'].name,
            align : 'right',
            width : 100
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
		}
		,{
			id : 'storage',
			header : fcOutSub['storage'].fieldLabel,
			dataIndex : fcOutSub['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<equWareArrEs.length;i++){
					if(v == equWareArrEs[i][0])
						storage = equWareArrEs[i][3]+'-'+equWareArrEs[i][2];
				}
				return storage;
			},
			align : 'center',
			hidden : true,
			width : 80
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
		{name:'kksNo',type:'string'}
	];
	dsOutSubEs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSubEs,
	    	business: businessOutSubEs,
	    	method: listMethodOutSubEs,
	    	params:  ' 1=2 ' //"pid='"+CURRENTAPPID+"' and out_id in (select uids from  EquGoodsStockOut where conid='"+edit_conid+"' and treeuids='"+edit_treeUids+"')"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyOutSubEs
        }, ColumnsOutSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsOutSubEs.setDefaultSort(orderColumnOutSubEs, 'desc');	//设置默认排序列
    cmOutSub.defaultSortable = true;
    dsOutEs.on('load', function(s, r, o) {
		s.each(function(rec) {
			if(loadFormRecordEs!=null){//选中新增的出库单
				if (rec.get("uids")==loadFormRecordEs.get('uids')) {
					smOutEs.selectRecords([rec], true);
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
         id:   'chooserow1',
         width:  150,
         store : store1Sub,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示更多信息',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
         	var colModel = gridPanelOutSub1.getColumnModel();
	    	if(i==0){
		        if(r.get(this.checkField)){
		            chooseRowSub.setValue(cmHide);
		            cmSelectByIdSub(colModel,cmHide);
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
		
    gridPanelOutSub1 = new Ext.grid.GridPanel({
		ds: dsOutSubEs,
		cm: cmOutSub,
		sm:smOutSub,
		title:"出库单详细信息",
		tbar : ['->',chooseRowSub],
		enableHdMenu : false,
		border: false,
		region: 'south',
		header: false, 
		height : document.body.clientHeight*0.4,
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsOutSubEs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	/*******************************暂估出库单明细信息end************************************************/
	var gridOutPanel1 = new Ext.Panel({
		id:"stockOutEs",
		title:'暂估出库单',
		layout:'border',
		region: 'center',
		items : [gridPanelOut1,gridPanelOutSub1]
	});
	tabPanelEs = new Ext.TabPanel({
		id:"tabPanelEs",
		activeTab : 0,
        border: false,
        region: 'center',
		items : [gridPanelEs,gridOutPanel1]
	});
	
   outContentPanel1 = new Ext.Panel({
		layout:'border',
		region: 'center',
		title:'暂估出库',
		items : [tabPanelEs]
	});
	if(USERDEPTID == "102010103"){
		outContentPanel1.disable();
	}		
//	ds.load({params:{start:0,limit:PAGE_SIZE}});
//	dsOutEs.load({params:{start:0,limit:PAGE_SIZE}});
	
	tabPanelEs.on('tabchange',function(t,tab){
		if(t.activeTab.id=="stockEs"){
			sm.clearSelections();
			dsEs.reload();
		}
		if(t.activeTab.id=="stockOutEs"){
				for(var o in fcOutEs){
			        var name = fcOutEs[o];
			        var temp = new Array();
			        temp.push(fcOutEs[o].name);
			        temp.push(fcOutEs[o].fieldLabel);
			        var colModel = gridPanelOut1.getColumnModel();
			        //锁定列不在显示更多信息中出现
			        if(colModel.getLockedCount()<=colModel.findColumnIndex(fcOutEs[o].name)){
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
			        var colModel = gridPanelOutSub1.getColumnModel();
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
				Ext.get("chooserow1").on("expand", function(){
		                     if(chooseRowSub.getValue()==""||chooseRowSub.getValue()==null){
		                          chooseRowSub.setValue(cmHideSub);
		                          chooseRowSub.setRawValue("显示更多信息"); 
		                    }     
					       }, this);
				Ext.get("chooserow").on("expand", function(){
					               if(chooseRow.getValue()==""||chooseRow.getValue()==null){
					                          chooseRow.setValue(cmHide);
					                          chooseRow.setRawValue("显示更多信息"); 
					                    }     
					       }, this); 				    
		 }
		 

	});
	if(ModuleLVL>=3){
				   doSelect.setDisabled(true);	
				   editBtn.setDisabled(true);
				   delBtn.setDisabled(true);	
				}
	smOutEs.on('rowselect',function(){
		var record = smOutEs.getSelected();
		if(ModuleLVL>=3){
			   doSelect.setDisabled(true);	
			   editBtn.setDisabled(true);
			   delBtn.setDisabled(true);	
			}else{
				if(record.get('finished') == 1){
					editBtn.setDisabled(true);
					delBtn.setDisabled(true);
					estimateBtn.setDisabled(true);
		            printBtn.setDisabled(false);
				}else{
					editBtn.setDisabled(false);
					delBtn.setDisabled(false);
					estimateBtn.setDisabled(false);
		            printBtn.setDisabled(false);
				}				
			}

		dsOutSubEs.baseParams.params = "outId = '"+record.get('uids')+"'";
		dsOutSubEs.load({params:{start:0,limit:PAGE_SIZE}});
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
				dsEs.baseParams.params = "pid='"+CURRENTAPPID+"' and judgment ='body' and conid='"+edit_conid+"'"+querywheres;
				dsEs.reload();
			}else{
					//查询当前选中节点的所有子节点主键。
					var sql = "select a.uuid from ( select t.* from equ_type_tree t " +
							" where t.conid = '"+edit_conid+"' ) a start with a.treeid = "+
							" (SELECT t.treeid from equ_type_tree t where t.uuid = '"+edit_treeUids+"' " +
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
					dsEs.baseParams.params = "pid='"+CURRENTAPPID+"' and judgment ='body' and conid='"+edit_conid+"' and treeuids in ("+treeuuidstr+")"+querywheres;
					dsEs.reload();
			}
		}else{
			dsEs.baseParams.params = "dataType='"+DATA_TYPE+"' and judgment ='body'  and pid='"+CURRENTAPPID+"'"+querywheres;
		    dsEs.reload();
		}
	};
	//修改或选择操作
	function EditHandler(){
		var btnId = this.id;
		var record = smOutEs.getSelected();
		var url = BASE_PATH+"Business/equipment/equMgm/equ.goods.stock.out.estimate.addorupdate.jsp"
		var obj=new Object();//用于新增出库单
		obj=null;
		var formRecord = Ext.data.Record.create(ColumnsOut);//用于新增出库单
        
		if(btnId=="doSelect"){
    		var OutSubUids = new Array()
    		var records = sm.getSelections();
    		if(records == null || records == ""){
    				Ext.example.msg('提示信息','请先选择库存记录！');
    			    return;    		
    		}
    		var sbType=records[0].get('equType');
    		for (var i = 0; i < records.length; i++) {
    			if(records[i].get('equType')!=sbType){
    				Ext.example.msg('提示信息','请先选择库存中相同设备类型的设备！');
    			    return;
    			}
    			OutSubUids.push(records[i].get("uids"));
    		}
    		//新增
    		if (changeRecord==null || changeRecord=="") {
				var conno='';
                var conmoneyno;//财务合同编码
				DWREngine.setAsync(false);
				baseMgm.findById(beanConEs, edit_conid, function(obj) {
					conno = obj.conno;
                    conmoneyno = obj.conmoneyno;
                    
				});
				DWREngine.setAsync(true);
				var newCkNo = "";
//				DWREngine.setAsync(false);
                //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
//		        var prefix = "";
//		        var sql = "select c.property_name from PROPERTY_CODE c " +
//		                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
//		                " and c.property_code = '"+USERDEPTID+"' ";
//		        baseMgm.getData(sql, function(str){
//		            prefix = str.toString();
//		        });
//		        DWREngine.setAsync(true);
				// 处理出库单号
				newCkNo = conmoneyno.replace(/^\n+|\n+$/g,"")+ "-暂估出库-";//prefix +"-"+
				var ckuids = "";
				DWREngine.setAsync(false);
				equMgm.getEquNewDhNoToSb(CURRENTAPPID, newCkNo, "out_No",
						"equ_goods_out_estimate", null,"data_type='EQUBODY'", function(str) {
							newCkNo = str;
						});
				DWREngine.setAsync(true);
				obj = {
					uids : '',
					pid : CURRENTAPPID,
					conid : edit_conid,
					treeuids : edit_treeUids,
					finished : 0,
					isInstallation : 0,
					outNo : '',//newCkNo,
					type : '暂估出库',
					outDate : new Date(),
					recipientsUnit : '',
					grantDesc : '',
					recipientsUser : '',
					recipientsUnitManager : '',
					handPerson : REALNAME,
					shipperNo : '',
					dataType : DATA_TYPE,
					equid : '',
					proUse : '',
					remark : ''
				}
				DWREngine.setAsync(false);
				equMgm.addOrUpdateEquOutEstimate(obj, function(str) {
							ckuids = str;
						});
				DWREngine.setAsync(true);
				obj.uids=ckuids
	   			DWREngine.setAsync(false);
	   			equMgm.insertEstimateOutSubFromStock(OutSubUids,ckuids,newCkNo,function(str){
	    			if(str == "1"){
	    				Ext.example.msg('提示信息','暂估出库单设备选择成功！');
	    				url += "?conid="+edit_conid+"&treeuids="+edit_treeUids+"&uids="+ckuids+"&editBody=body";
	    			}else{
	    				Ext.example.msg('提示信息','暂估出库单设备选择失败！');
	    			}
	    		});
	    		DWREngine.setAsync(true);
			}else{//修改
				DWREngine.setAsync(false);
	   			equMgm.insertOutEsSubFromStock(OutSubUids,changeRecord.get('uids'),changeRecord.get('outNo'),function(str){
	    			if(str == "1"){
	    				Ext.example.msg('提示信息','暂估出库单设备选择成功！');
	    				url += "?conid="+edit_conid+"&treeuids="+edit_treeUids+"&uids="+changeRecord.get('uids')+"&editBody=body";
	    			}else{
	    				Ext.example.msg('提示信息','暂估出库单设备选择失败！');
	    			}
	    		});
	    		DWREngine.setAsync(true);
			}
		}else {
			if(record == null){
				Ext.example.msg('提示信息','请先选择一条出库单！');
		    	return ;
			}		
			url += "?conid="+record.get("conid")+"&treeuids="+record.get("treeuids")+"&uids="+record.get("uids")+"&flag=edit"+"&editBody=body";;;
		}
		url +="&mark=markTrue"
		if(selectWinEs){
	    	selectWinEs.destroy();
	    }
		selectWinEs = new Ext.Window({
			id:'selectWinEs',
			width: 950,
			height: 500,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			closable:false,
			closeAction :"hide",
			html:"<iframe id='equOut' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(p){
					flagaddorupdateEs=false;
					changeRecord=smOutEs.getSelected();
					tabPanelEs.hideTabStripItem(1);
					var subSql="select s.stock_id,s.equ_type from equ_goods_out_estimate_sub s where s.out_id='"+changeRecord.get('uids')+"'";
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
							treeuuidstr += ",'"+list[i]+"'";
							selTreeuidsEs.push(list[i]);
						}
					});	
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					dsEs.baseParams.params = "pid='"+CURRENTAPPID+"' and judgment ='body' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
					dsEs.reload();
					dsOutEs.reload();
					
				},
				'hide':function(t){
					flagaddorupdateEs=true;
					if(selectTreeid==""){
					   selectUuid="";
					   selectConid="";
					}
					changeRecord=null;
					loadFormRecordEs=null;
					var templength=selTreeuidsEs.length;
					selTreeuidsEs.splice(0,templength);
					ckStockIds="";
					dsEs.reload();
					dsOutEs.reload();
					dsOutSubEs.reload();
					queHandler();
				},
				'show' : function(){
					equOut.location.href  = url;
				},
				'beforeshow':function(){
					tabPanelEs.unhideTabStripItem(1);
					tabPanelEs.setActiveTab(1);
					if(obj!=null){
					    loadFormRecordEs = new formRecord(obj);
					}
				    dsOutEs.reload();
			}
		}
	    });
		selectWinEs.show();

	};
	function deleHandler(){
		var record = smOutEs.getSelected();
		Ext.Msg.show({
				title : '提示',
				msg : '是否删除该暂估出库单及其暂估出库详细信息？',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						gridPanelOut1.getEl().mask("loading...");
						equMgm.deleteEstimateOutAndOutSub(record.get('uids'), function(flag) {
							if ("0" == flag) {
								Ext.example.msg('删除成功！',
										'您成功删除了该暂估出库单信息！');
								dsOutEs.reload();
								dsEs.reload();
								if((dsOutEs.getTotalCount()-1)>0){
									smOutEs.selectRow(0);
								}else{
									dsOutSubEs.removeAll();
								}
							} else{
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							gridPanelOut1.getEl().unmask();
						});
					}
				}
			});
	}
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    //冲回出库
	function  estimateHandler(){
	    var rec = smOutEs.getSelected();
	    if(rec == null || rec == ""){
	        Ext.Msg.alert("信息提示","请选择您所要选择的记录！");
	        return;
	    }else{
	    	var url = BASE_PATH
				+ "Business/equipment/equMgm/equ.goods.stock.out.estimate.list.jsp";
	    	var uidsStr = rec.get("uids");
	    	url  +="?uidsStr="+uidsStr;
			selectWinEs = new Ext.Window({
				width : 950,
				height : 500,
				modal : true,
				plain : true,
				border : false,
				resizable : false,
				html : "<iframe id='equArrival' src='' width='100%' height='100%' frameborder='0'></iframe>",
				listeners : {
					'close' : function() {
						dsOutEs.reload();
						dsOutSubEs.reload();
					},
					'show' : function() {
						equArrival.location.href = url;
					}
				}
			});
			selectWinEs.show();
	    }
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
				                           "' and transaction_type='"+businessTypeEs+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
						if(billstate == 1){
						   downloadStr="附件["+count+"]";
						   editable = false;
						}else{
						   downloadStr="附件["+count+"]";
						   editable = true;
						}	
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessTypeEs + '\', ' + editable + ', \''
									+ uidsStr
									+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
					
			}
});
function finishOutEs(uids,finished){
	var record = smOutEs.getSelected();
    if(!isFinance){
        Ext.example.msg('提示信息','当前用户不是财务部用户，不能进行完结操作！');
        finished.checked = false;
        return;
    }	
	
	if(record == null || record == ''){
	   Ext.example.msg('提示信息','请选择您要完结的出库单！');
	   return;
	}else{
		 if(record.get('outNo')==null || record.get('outNo') == ""){
		      Ext.example.msg('提示信息','出库单数据不完整，请填写完整在完结！');
		      finished.checked = false;
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
						equMgm.equOutEstimateFinished(uids,function(str){
							if(str == "1"){
								Ext.example.msg('提示信息','出库单完结操作成功！');
								finished.checked = true;
								dsOutEs.reload();
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

}
//显示多附件的文件列表
function showUploadWin(businessTypeEs, editable, businessId, winTitle) {
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
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessTypeEs="
			+ businessTypeEs + "&editable=" + editable + "&businessId="
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
    dsEs.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and judgment ='body'  and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}
