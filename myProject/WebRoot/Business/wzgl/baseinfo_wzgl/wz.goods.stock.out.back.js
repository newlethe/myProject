var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsStock"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"

var beanOut = "com.sgepit.pmis.wzgl.hbm.WzGoodsOutBack"
var businessOut = "baseMgm"
var listMethodOut = "findWhereOrderby"
var primaryKeyOut = "uids"
var orderColumnOut = "uids"

var beanOutSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsOutBackSub"
var businessOutSub = "baseMgm"
var listMethodOutSub = "findWhereOrderby"
var primaryKeyOutSub = "uids"
var orderColumnOutSub = "uids"

var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"

var selectUuid = "";
var selectConid = edit_conid?edit_conid:'';
var selectTreeid = edit_treeUids?edit_treeUids:'';
var selectParentid = edit_partUids?edit_partUids:'';
var fileWin;
var selectWin;

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
var equWareArr = new Array();
var pid = CURRENTAPPID;
var businessType = "zlMaterial";

var bdgArr = new Array();
var whereSql = "";

//判断当前用户是否是财务部
var isFinance = (USERDEPTID == '102010105') ? true : false;

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
    baseMgm.getData("select uids,equid,equno,wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
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
			equTypeArr.push(temp);			
		}
	});
	//领用单位
    appMgm.getCodeValue("领用单位",function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode); 
            temp.push(list[i].propertyName);            
            unitArr.push(temp);         
        }
    });
	//存放库位
	baseMgm.getData("select uids,equno from equ_warehouse where pid='" + CURRENTAPPID
					+ "' order by uids ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					getEquidstore.push(temp);
				}
			})
    baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    })
	DWREngine.setAsync(true);
    // 设备仓库系统编码下来框
    var getEquid = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : equWareArr
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
		text: '新增',
		iconCls: 'add',
		handler: EditHandler
	});
//	var editBtn = new Ext.Button({
//		id : 'editBtn',
//		text : '修改',
//		iconCls : 'btn',
//		handler : EditHandler
//	});
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
		'equPartName' : {name : 'equPartName',fieldLabel : '部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'stockNum' : {name : 'stockNum',fieldLabel : '库存数量',decimalPrecision:4},
		'weight' : {name : 'weight',fieldLabel : '重量（KG）',decimalPrecision:4},
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
			width : 100
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
					if(v == equWareArr[i][0]){
					   storage = equWareArr[i][2]+"-"+equWareArr[i][1];
					   break;
					}
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
		{name:'storage', type:'string'}
	];

	if(edit_flagLayout==''){
	    whereSql  = " and judgmentFlag='noBody'";
	}else{
	    whereSql = "  and judgmentFlag ='body' and conid='"+selectConid+"'";
	}
	
	ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"'" + whereSql
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
    ds.on("beforeload",function(){
    	if(ckStockIds!=""){//过滤出库单已经选中的设备
    		ds.baseParams.params+=ckStockIds;
    	}
    	ds.baseParams.params+=" and stockNum>=0"
    })
    var gridPanel = new Ext.grid.GridPanel({
    	id:"stock",
		ds: ds,
		cm: cm,
		sm:sm,
		title:"库存",
		border: false,
		tbar: ['<font color=#15428b><B>库存信息<B></font>','-',
			'<font color=#15428b>箱件号：</font>', boxNo, '-',
			'<font color=#15428b>部件名称：</font>', equPartName, '-', 
			'<font color=#15428b>规格型号：</font>', ggxh, '-', 
			//'<font color=#15428b>库位：</font>', storage, '-',
			doQuery, '-'],//,doSelect,'-'
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
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isInstallation' : {name : 'isInstallation',fieldLabel : '已安装'},
		'outNo' : {name : 'outNo',fieldLabel : '暂估出库单号'},
		'outOutNo' : {name : 'outOutNo',fieldLabel : '冲回出库单号'},
		'type' : {name : 'type',fieldLabel : '出库类型'},
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
        'judgmentFlag' : {name : 'judgmentFlag', fieldLabel : '设备出入库类型' },
        'kks' : {name : 'kks',fieldLabel : 'KKS编码'},
        'userPart' : {name : 'userPart',fieldLabel : '安装部位'}
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
				var str = "<input type='checkbox' "+(v==1?" disabled checked title='已完结' ":"title='未完结'")+" onclick='finishOut(\""+r.get("uids")+"\",this)'>"
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
			hidden: true,
			width : 180
		}, {
			id:'outOutNo',
			header: fcOut['outOutNo'].fieldLabel,
			dataIndex: fcOut['outOutNo'].name,
			width : 250
		}, {
			id:'type',
			header: fcOut['type'].fieldLabel,
			dataIndex: fcOut['type'].name,
			hidden: true,
			width : 180		
		}, {
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
				var unit = "";
				for(var i=0;i<unitArr.length;i++){
					if(v == unitArr[i][0])
						unit = unitArr[i][1];
				}
				return unit;
			},
			width : 180
        },{
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
	                if (v == equWareArr[i][1]){
	                     equid = equWareArr[i][2]+" - "+equWareArr[i][1];
	                     break;
	                }
	            }
	            return equid;
	        },
	        align : 'center',
	        width : 180
	    },{
	        id : 'fileid',
	        header : fcOut['fileid'].fieldLabel,
	        dataIndex : fcOut['fileid'].name,
	         renderer : filelistFn,
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
			id:'kks',
			header: fcOut['kks'].fieldLabel,
			dataIndex: fcOut['kks'].name,
            hidden: edit_flagLayout ==''?true:false,
			width : 180
		}, {
			id:'userPart',
			header: fcOut['userPart'].fieldLabel,
			dataIndex: fcOut['userPart'].name,
            hidden: edit_flagLayout ==''?true:false,
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
		{name : 'outNo', type : 'string'},
		{name : 'outOutNo', type : 'string'},
		{name : 'type', type : 'string'},
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
        {name : 'equname', type : 'string'},
        {name : 'judgmentFlag',type : 'string'},
        {name : 'kks',type : 'string'},
        {name : 'userPart',type : 'string'}
	];

	dsOut = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOut,				
	    	business: businessOut,
	    	method: listMethodOut,
	    	//params: "conid='"+edit_conid+"'"
	    	params: "pid='"+CURRENTAPPID+"'" + whereSql
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
        var uids = ""
        var modetype = "NewCL";
        var record = smOut.getSelected();
        if(record != null && record != ""){
            uids = record.get("uids");
        }else{
            Ext.example.msg('提示信息', '请先选择要打印的记录！');
            return;
        }
        //模板参数，固定值，在 系统管理  -> office模板 中配置
        var filePrintType = "WzGoodsOutBackView";
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
	cmOut.defaultSortable = true;
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
    	var lockedCol = colModel.getLockedCount()
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
 
	function cmSelectById(cm,str){
    	var cmHide = str.toString().split(',');
    	var lockedCol = colModel.getLockedCount()
        for(var i=lockedCol+1; i<cmOut.getColumnCount();i++){
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
	var gridPanelOut = new Ext.grid.GridPanel({
		ds : dsOut,
		cm : cmOut,
		sm : smOut,
		title : '冲回出库单信息',
		tbar : ['<font color=#15428b><B>冲回出库单信息<B></font>','-',doSelect,'-',delBtn,'-',/*printBtn,*/'->',chooseRow],
		header: false,
		enableHdMenu : false,
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
        'price' : {name : 'price', fieldLabel : '单价', allowBlank : false},
        'amount' : {name : 'amount', fieldLabel : '金额', allowBlank : false}
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
            hidden : true,
            width : 80
        },{
            id : 'amount',
            header : fcOutSub['amount'].fieldLabel,
            dataIndex : fcOutSub['amount'].name,
            align : 'right',
            hidden : true,
            width : 80
        },
			{
			id : 'stockNum',
			header : "库存数量",
			dataIndex:'stockNum',
			align : 'right',
			renderer:function(value,cell,record){
				var stocknum="";
				DWREngine.setAsync(false);
				wzbaseinfoMgm.getStockNumFromStock(record.get('stockId'),function(num){
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
					if(v == equWareArr[i][0]){
					   storage = equWareArr[i][2]+"-"+equWareArr[i][1];
					   break;
					}
				}
				return storage;
			},
			align : 'center',
            hidden : true,
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
		{name:'storage', type:'string'}
	];
	dsOutSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSub,
	    	business: businessOutSub,
	    	method: listMethodOutSub,
	    	params: ' 1=2 '//"pid='"+CURRENTAPPID+"'"
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
    var gridPanelOutSub = new Ext.grid.GridPanel({
		ds: dsOutSub,
		cm: cmOutSub,
		sm:smOutSub,
		title:"出库单详细信息",
		tbar : ['->',chooseRowSub],
		enableHdMenu : false,
		border: false,
		region: 'south',
		header: false, 
		height : document.body.clientHeight*0.5,
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: edit_flagLayout==''?false:true,
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
		title:'冲回出库单',
		layout:'border',
		region: 'center',
		items : [gridPanelOut,gridPanelOutSub]
	});
//	tabPanel = new Ext.TabPanel({
//		activeTab : 0,
//        border: false,
//        region: 'center',
//		items : [gridOutPanel]//gridPanel,
//	});
	
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridOutPanel]
	});
	
	if(edit_flagLayout&&edit_flagLayout=="WZBODY"){
		var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]
			});
	}else{
		var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, contentPanel]
			})
	}
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
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	dsOut.load({params:{start:0,limit:PAGE_SIZE}});
	
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
	    	  dsOut.baseParams.params=sqlWhere1;
	    	  var wzUids="";
	          DWREngine.setAsync(false);
		      var sql="select t.uids from wz_goods_out_back t where "+sqlWhere;
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
		      dsOutSub.baseParams.params=wzUids;
	    }
       	dsOut.load({params:{start:0,limit:PAGE_SIZE}});
		dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
	})	
	
	//权限控制
	if(ModuleLVL>=3){
		    doSelect.setDisabled(true);
		    delBtn.setDisabled(true);
	}	
	
	smOut.on('rowselect',function(){
		var record = smOut.getSelected();
		if(ModuleLVL>=3){
		    doSelect.setDisabled(true);
		    delBtn.setDisabled(true);
	    }else{
			if(record.get('finished') == 1){
	//			editBtn.setDisabled(true);
				delBtn.setDisabled(true);
	            printBtn.setDisabled(false);
			}else{
	//			editBtn.setDisabled(false);
				delBtn.setDisabled(false);
	            printBtn.setDisabled(false);
			}
	    }	

		dsOutSub.baseParams.params = "outId = '"+record.get('uids')+"'";
		dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
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
		if ('' != qstorage){
			querywheres += " and storage like '%"+qstorage+"%'";
		}
		if(selectParentid!=null&&selectParentid!=""){
			if(selectParentid == "0"){
				ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"'"+querywheres;
				ds.reload();
			}else{
					ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"'"+querywheres;
					ds.reload();
			}
		}else{
			ds.baseParams.params = "pid='"+CURRENTAPPID+"'"+querywheres;
		    ds.reload();
		}
	};
	//选择操作
	function EditHandler(){
		if(edit_flagLayout==''){
			if(selectParentid == '0'){
					Ext.example.msg('提示信息','请选择该分类下的合同！');
			    	return ;		
			}
			if(selectUuid == "" || selectConid == ""){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
		    	return ;
			}
		}
		var btnId = this.id;
		var record = smOut.getSelected();
		var url = BASE_PATH+"Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.estimate.list.jsp"
//		var records = sm.getSelections();
//    		if(records == null || records.length == 0){
//    			Ext.example.msg('提示信息','请先选择库存中的设备！');
//    			return;
//    		}
//    	var OutSubUids = new Array()
//		var sbType=records[0].get('equType');
//		for (var i = 0; i < records.length; i++) {
//			if(records[i].get('equType')!=sbType){
//				Ext.example.msg('提示信息','请先选择库存中相同设备类型的设备！');
//			    return;
//			}
//			OutSubUids.push(records[i].get("uids"));
//		}	
        url += "?conid="+selectConid+"&treeuids="+selectUuid+"&edit_flag=chck"+"&flagLayout="+edit_flagLayout;
		if(selectWin){
	    	selectWin.destroy();
	    }
		selectWin = new Ext.Window({
			id:'selectwin',
			width: document.body.clientWidth - 20,
			height: document.body.clientHeight - 20,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			closeAction :"hide",
			html:"<iframe id='equOut' src='' width='100%' height='100%' frameborder='0'></iframe>",
			listeners : {
				'close' : function(p){
					flagaddorupdate=false;
					changeRecord=smOut.getSelected();
//					tabPanel.hideTabStripItem(1);
					var subSql="select s.stock_id,s.equ_type from equ_goods_out_back_sub s where s.out_id='"+changeRecord.get('uids')+"'";
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
							selTreeuids.push(list[i]);
						}
					});	
					DWREngine.setAsync(true);
					treeuuidstr = treeuuidstr.substring(1);
					ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
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
					dsOut.reload();
					dsOutSub.reload();
					queHandler();
				},
				'show' : function(){
					equOut.location.href  = url;
				},
				'beforeshow':function(){
//					tabPanel.unhideTabStripItem(1);
//					tabPanel.setActiveTab(1);
				    dsOut.reload();
			}
		}
	    });
		selectWin.show();

	};
	function deleHandler(){
		var record = smOut.getSelected();
		Ext.Msg.show({
				title : '提示',
				msg : '是否删除该出库单及其出库详细信息？',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						gridPanelOut.getEl().mask("loading...");
						wzbaseinfoMgm.deleteWzOutBackAndOutBackSub(record.get('uids'), function(flag) {
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
						if(billstate == 1){
						   downloadStr="附件["+count+"]";
						   editable = false;
						}else{
						   downloadStr="附件["+count+"]";
						   editable = true;
						}	
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessType + '\', ' + editable + ', \''
									+ uidsStr
									+ '\', \''+'到货单附件'+'\')">' + downloadStr +'</a></div>'
					
			}
});
function finishOut(uids,finished){
//   if(!isFinance){
//        Ext.example.msg('提示信息','当前用户不是财务部用户，不能进行完结操作！');
//        finished.checked = false;
//        return;
//    }
	Ext.Msg.show({
		title : '提示',
		msg : '完结后不可取消，不可编辑，确认要完结吗？',
		buttons : Ext.Msg.YESNO,
		icon : Ext.MessageBox.QUESTION,
		fn : function(value) {
			if ("yes" == value) {
				DWREngine.setAsync(false);
				wzbaseinfoMgm.wzOutBackFinished(uids,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','出库单完结操作成功！');
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
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE,
				params :" orgid='" + USERORGID + "' and indexid in (select indexid from ZlTree) and  (billstate=2 or billstate=3 or billstate=1 or billstate=0) "
			} 
		});
	});
}