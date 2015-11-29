var beanOut = "com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimate"
var businessOut = "baseMgm"
var listMethodOut = "findWhereOrderby"
var primaryKeyOut = "uids"
var orderColumnOut = "uids"

var beanOutSub = "com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimateSub"
var businessOutSub = "baseMgm"
var listMethodOutSub = "findWhereOrderby"
var primaryKeyOutSub = "uids"
var orderColumnOutSub = "uids"
var whereDsOut = "";
var whereDsOutSub = ""
var equUids = ""

var dsOut;
var smOut;
var pid = CURRENTAPPID;
var loadFormRecord = null;//新增出库单  用于选中新增的出库单

var unitArr = new Array();
var flagaddorupdate=true;
var selTreeuids=new Array();
var equWareArr = new Array();
var equTypeArr = new Array();
var unitArr = new Array();
var bdgArr = new Array();

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

    baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    })
	if(editFlag == 'zgrk' ||  editFlag == 'chrk'){
			var whereSql = "conid='"+conidStr+"' and treeuids='"+treeuidsStr+"' and pid='" + pid+ "'";
			var whereStr = ""
			if(editFlag == 'zgrk'){
			   whereStr  = " and  out_no not in(select r.out_estimate_no from EQU_GOODS_STOCK_OUT r where "+whereSql+")" 
			}
			var endSql ="select t.uids from EQU_GOODS_OUT_ESTIMATE t where t.finished='1' and t.is_installation='0' and "+ whereSql+whereStr ;
		    baseMgm.getData( endSql,function(list) {
		        if(list.length>0){
		        	equUids +='(';
			        for (var i = 0; i < list.length; i++) {
			             if(list.length == 1){
			                equUids +="'"+list[i]+"'";
			                break;
			             }else{
				             if(i>=0 && i<list.length-1){
				                 equUids +="'"+list[i]+"',";
				             }else{
				                 equUids +="'"+list[i]+"'";
				             }
			             }
			        }
			        equUids +=")";
		        }
		    });
	  }
    DWREngine.setAsync(true);
	if(uidsStr == ""){
		if(editFlag =="zgrk" && equUids != ""){
		    whereDsOut = " and uids in "+equUids
		    whereDsOutSub = " and out_id in "+equUids;
		    
		}else if(editFlag =="zgrk" && equUids == ""){
            whereDsOut = " and conid ='"+conidStr+"'";
		    whereDsOutSub = " and outId in (select uids from EquGoodsOutEstimate where outNo in (select outEstimateNo from EquGoodsStockOut where conid='"+conidStr+"' and  treeuids='"+
		                treeuidsStr+"'))";		
		}else{
		    whereDsOut = " and conid='"+conidStr+"' and  treeuids='"+treeuidsStr+"' and finished='1'" +
		    		     " and isInstallation='0' and outNo not in (select outNo from  EquGoodsOutBack )";
		    var sql = "(select  uids from EquGoodsOutEstimate r where conid='"+conidStr+"' and  treeuids='"+
		                treeuidsStr+"' and finished='1' and isInstallation='0' and outNo not in (select outNo from EquGoodsOutBack)"+")";               
		    whereDsOutSub = " and out_id in "+sql;
		}
	}else{
	     whereDsOut = " and uids='"+uidsStr+"'";
	     whereDsOutSub = " and out_id='"+uidsStr+"'"
	}
    // 设备仓库系统编码下来框
    var getEquid = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : equWareArr
    });

	/*******************************暂估出库单基础信息start************************************************/
	var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
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
        'using' : {name : 'using',fieldLabel : '领料用途'},
        'equname' : {name : 'equname',fieldLabel : '设备名称'},
        'type' : {name : 'type',fieldLabel : '出库类型'},
        'dataType' : {name : 'dataType',fieldLabel : '数据类型'}
        
	}
	
	smOut = new Ext.grid.CheckboxSelectionModel({singleSelect: false});
	var cmOut = new Ext.grid.ColumnModel([
		
		smOut,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),{
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
			id:'isInstallation',
			header:fcOut['isInstallation'].fieldLabel,
			dataIndex: fcOut['isInstallation'].name,
			hidden: true
		},{
			id:'outNo',
			header: fcOut['outNo'].fieldLabel,
			dataIndex: fcOut['outNo'].name,
			width : 250
		},{
			id:'type',
			header: fcOut['type'].fieldLabel,
			dataIndex: fcOut['type'].name,
			width : 180,
			hidden: true
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
	                if (v == equWareArr[i][1])
	                    equid = equWareArr[i][3]+" - "+equWareArr[i][2];
	            }
	            return equid;
	        },
	        align : 'center',
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
		},{
			id:'dataType',
			header: fcOut['dataType'].fieldLabel,
			dataIndex: fcOut['dataType'].name,
            hidden: true,
			width : 180
		}
	]);
		var ColumnsOut = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'isInstallation', type : 'float'},
		{name : 'outNo', type : 'string'},
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
        {name : 'dataType', type : 'string'},
        {name : 'equname', type : 'string'}
	];

	dsOut = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOut,				
	    	business: businessOut,
	    	method: listMethodOut,
	    	//params: "conid='"+edit_conid+"'"
	    	params: "dataType='"+dataType+"' and finished='1' and pid='"+CURRENTAPPID+"'"+whereDsOut
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
    
    var estimateBtn = new Ext.Button({
		text : '确认冲回出库',
		iconCls : 'btn',
		handler : estimateHandler
	});
	
    var sureBtn = new Ext.Button({
		text : '确认选择',
		iconCls : 'btn',
		handler : sureChooseFn
	});	
	
	var chooseBtn = new Ext.Button({
		text : '选择',
		iconCls : 'btn',
		handler : ChooseFn
	});	
    var closeBtn = new Ext.Button({
		text : '关闭',
		iconCls : 'btn',
		handler : function(){
		   parent.selectWin.hide();
		}
	});	
	if(uidsStr == ""){
		if(editFlag == "zgrk"){
			chooseBtn.setVisible(true);
		    sureBtn.setVisible(false);
		    estimateBtn.setVisible(false);		
		}else{
			chooseBtn.setVisible(false);
		    sureBtn.setVisible(true);
		    estimateBtn.setVisible(false);
		}
	}else{ 
		    chooseBtn.setVisible(false);
	        sureBtn.setVisible(false);	
		    estimateBtn.setVisible(true);
			
		    
		    
	}
	var gridPanelOut = new Ext.grid.GridPanel({
		ds : dsOut,
		cm : cmOut,
		sm : smOut,
		title : '暂估出库单信息',
		tbar : ['<font color=#15428b><B>暂估出库单信息<B></font>','->',estimateBtn,sureBtn,chooseBtn,closeBtn],
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
				for(var i=0;i<equWareArr.length;i++){
					if(v == equWareArr[i][0])
						storage = equWareArr[i][3]+"-"+equWareArr[i][2];
				}
				return storage;
			},
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
		{name:'storage', type:'string'}
	];
	var 
	dsOutSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSub,
	    	business: businessOutSub,
	    	method: listMethodOutSub,
	    	params: "pid='"+CURRENTAPPID+"'"+whereDsOutSub
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
			forceFit: true,
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
	/*******************************暂估出库单明细信息end************************************************/
	var contentPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items : [gridPanelOut,gridPanelOutSub]
	});	
	
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [contentPanel]
        
	});
   dsOutSub.load();
   dsOut.load();
   smOut.on('rowselect',function(){
         var record = gridPanelOut.getSelectionModel().getSelected();
	     if(record == null || record == "")return;
		     dsOutSub.baseParams.params="out_id='"+record.get("uids")+"'";
             dsOutSub.load();
   })
  	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    }; 
   function estimateHandler(){
		var rec = smOut.getSelected();
		if (rec == null || rec == "") {
			Ext.Msg.alert("系统提示", "请选择要冲回入库的记录！")
			return;
		} else {
			Ext.MessageBox.confirm('确认', '冲回出库操作将不可恢复，确认要进行吗？', function(btn,text) {
                if(btn == 'yes'){
                    var uids = rec.get('uids');
		            DWREngine.setAsync(false);
					equMgm.resetGoodsOutEstimate(uids,function(str){
					     if(str == 'success'){
					     	  smOut.clearSelections(false);
					          dsOutSub.baseParams.params="out_id='"+uids+"'";
	                          dsOutSub.load();
	                          parent.selectWin.hide();
//	                          parent.dsOutSub.reload();
					     }else{
					         Ext.Msg.alert("系统提示","冲回入库不成功，请重操作！");
					     }
					})
                }else{
                   Ext.example.msg('提示信息', '您放弃了冲回入库的操作！');
//                 parent.selectWin.hide();
                   return;
                }
			})
		}
	}
	//确认选择
	function sureChooseFn(){
	    var rec = smOut.getSelected();
		if (rec == null || rec == "" ) {
			Ext.Msg.alert("系统提示", "请选择要冲回出库的记录！")
			return;
		} else {
		    Ext.MessageBox.confirm('确认', '冲回出库操作将不可恢复，确认要进行吗？', function(btn,text) {
                if(btn == 'yes'){
                    var uids = rec.get('uids');
					DWREngine.setAsync(false);
		            //处理暂估如库检验单编号
		            var newCkNo = rec.get('outNo');
		            var warehouseNoNo=newCkNo+"-";
					equMgm.getEquNewDhNo(CURRENTAPPID, warehouseNoNo, "out_out_no",
							"equ_goods_out_back", null, function(str) {
								newCkNo = str;
							});
					DWREngine.setAsync(true)
                    equMgm.insertEquGoodsOutBack(uids,newCkNo,function(str){
                         if(str == "success"){
                              smOut.clearSelections(false);
//	                          parent.dsOut.reload();
//	                          parent.dsOutSub.reload();
	                          parent.selectWin.hide(); 
                         }
                    })
                }
		    })
	   }
	}
	//正式入库选择
	function ChooseFn(){
	    var rec = smOut.getSelections();
	    if(rec == null || rec==""){
	        Ext.Msg.alert('提示','请选择！')
	        return;
	    } 
	    for(var i=0;i<rec.length;i++){
	    	var uidsS = "";
	    	uidsS = rec[i].get("uids");
	        var conmoneyno;//财务合同编码
			DWREngine.setAsync(false);
			baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOve", conidStr, function(obj) {
	            conmoneyno = obj.conmoneyno;
			});
			DWREngine.setAsync(true);
//	        //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
//	        var prefix = "";
//	        var sql = "select c.property_name from PROPERTY_CODE c " +
//	                " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
//	                " and c.property_code = '"+USERDEPTID+"' ";
//	        baseMgm.getData(sql, function(str){
//	            prefix = str.toString();
//	        });
//			// 处理出库单号
//			var newCkNo = prefix +"-"+conmoneyno + "-CK-";
//			equMgm.getEquNewDhNo(CURRENTAPPID, newCkNo, "out_No",
//					"equ_goods_stock_out", null, function(str) {
//						newCkNo = str;
//					});
//					
		   var newCkNo = "-"+conmoneyno.replace(/^\n+|\n+$/g,"")+ "-CK-";//prefix +"-"+
		   DWREngine.setAsync(false);
		   equMgm.getEquNewDhNoToSb(CURRENTAPPID, newCkNo, "out_No",
					"equ_goods_stock_out", null,"data_type='EQUBODY'", function(str) {
						newCkNo =  rec[i].get("outNo").substring(0,2)+str;
					});
			DWREngine.setAsync(true);
			DWREngine.setAsync(false);
			equMgm.insertFromOutEstimateToOutStock(uidsS,newCkNo,function(str){
			    if(str=='success'){
//			    	 parent.ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+conidStr+"' and treeuids in ("+treeuidsStr+")";
//			         parent.ds.load();
//			         parent.dsOut.baseParams.para="pid='"+CURRENTAPPID+"' and outId in (select uids from EquGoodsOutEstimate where outNo in (select outEstimateNo from EquGoodsStockOut where conid='"+conidStr+"' and  treeuids='"+
//		                treeuidsStr+"'))";	
//					 parent.dsOut.load();
					 parent.selectWin.hide();
			    }else{
			       Ext.Msg.alert("系统提示","操作失败");
			       return;
			    }
			})
			DWREngine.setAsync(true);    
	    }
	}
});