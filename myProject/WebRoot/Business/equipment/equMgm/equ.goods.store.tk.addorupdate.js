var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreTk"
var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreTkSub"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"

var beanOutSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub"
var businessOutSub = "baseMgm"
var listMethodOutSub = "findWhereOrderby"
var primaryKeyOutSub = "uids"
var orderColumnOutSub = "outNo"

var equTypeArr = new Array();
var getEquidstore = new Array();
//var stockmarr = new Array();
var conno;
var formPanel;

var flagOutId="";
Ext.onReady(function(){
	var formPanelName = CURRENTAPPID == "1031902"? "设备/材料退库单":"设备退库单";
	DWREngine.setAsync(false);
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
//	var sqlman = "select t.userid,t.realname from rock_user t where t.userid in (select r.userid from rock_role2user r where r.rolepk='4028814829fe2fc80129fe79a1b3003b')";
//	baseDao.getData(sqlman,function(list){
//		for(i = 0; i < list.length; i++) {
//			var temp = new Array();
//			temp.push(list[i][0]);			
//			temp.push(list[i][1]);			
//			stockmarr.push(temp);			
//		}
//	});
	DWREngine.setAsync(true);
	var equTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: equTypeArr
    });
//    var stockManDs = new Ext.data.SimpleStore({
//    	fields: ['k', 'v'],   
//        data: stockmarr
//    });
//    var dsindexid = new Ext.data.SimpleStore({
//				fields: ['k', 'v'],   
//                data: getEquidstore
//			});
    var fm = Ext.form;
    /**********************************************退库单基本信息start*********************************************************************/
    var fc = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'tkNo' : {name : 'tkNo',fieldLabel : '退库单据号',readOnly : true,width : 160},
		'tkDate' : {name : 'tkDate',fieldLabel : '退库日期',
			readOnly : true,
			format: 'Y-m-d',
			width : 160},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号',
			triggerClass: 'x-form-date-trigger',
			onTriggerClick: showOutWin,
			width : 160
		},
		'stockManager' : 
		{
		    name : 'stockManager',
		    fieldLabel : '库管员',
			width : 160
		},
		'makeUser' : {name : 'makeUser',fieldLabel : '制单人',width : 160},
		'remark' : {name : 'remark',fieldLabel : '退库备注',width : 160}
	}
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveTk
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '取消',
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
	{name : 'tkNo', type : 'string'},
	{name : 'tkDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
	{name : 'outId', type : 'string'},
	{name : 'outNo', type : 'string'},
	{name : 'stockManager', type : 'string'},
	{name : 'makeUser', type : 'string'},
	{name : 'remark', type : 'string'}
	];
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    
    if(edit_uids == null || edit_uids == ""){
    	DWREngine.setAsync(false);
		baseMgm.findById(beanCon, edit_conid,function(obj){
			conno = obj.conno;
		});
		//处理退库批号
		var newTkNo = conno+"-TK-"
		equMgm.getEquNewDhNo(CURRENTAPPID,newTkNo,"tk_no","equ_goods_store_tk",null,function(str){
			newTkNo = str;
		});
		DWREngine.setAsync(true);
		loadFormRecord = new formRecord({
			uids : '',
			pid : CURRENTAPPID,
			conid : edit_conid,
			treeuids : edit_treeuids,
			finished : 0,
			tkNo : newTkNo,
			tkDate : new Date(),
			outId : '',
			outNo : '',
			stockManager : '',
			makeUser : REALNAME,
			remark : ''
   		});
    }else{
	    DWREngine.setAsync(false);
		baseMgm.findById(bean, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
    }
	
	formPanel = new Ext.FormPanel({
		id:"form",
		region : 'north',
		height : 140,
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
						new fm.TextField(fc['tkNo']),
						new fm.TextField(fc['stockManager']),					
						new fm.TextField(fc['remark'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						new fm.DateField(fc['tkDate']),
						new fm.TextField(fc['makeUser'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
					    new fm.Hidden(fc['outId']),
						new fm.TriggerField(fc['outNo'])
					]
				}]
			}
		]
	});
	//打开出库单选择窗口
	function showOutWin(){
		var uids = formPanel.getForm().findField("uids").getValue();
		var conid = formPanel.getForm().findField("conid").getValue();
		flagOutId=formPanel.getForm().findField("outId").getValue();
		if(uids == null || uids == ""){
			Ext.example.msg('提示信息','请先保存退库单基本信息！');
			return;
		}
		outWin.show();
		//此处还需要考虑设备安装单中已安装设备数量,
		//过滤掉完结出库单中已经全部退库的设备
		var sql="select t.out_sub_id from (select out_sub_id, sum(tk_num) alltknum "+
		        "from equ_goods_store_tk_sub group by out_sub_id) t join "+
		        "(select os.uids,os.out_num from equ_goods_stock_out_sub os "+
		        "where os.out_id in (select o.uids from equ_goods_stock_out o "+
		        "where finished='1' and conid='"+conid+"')) e on(t.out_sub_id=e.uids) where t.alltknum>=e.out_num";
		//过滤该退库单中已经选择的设备
		var selsql="select t.out_sub_id from equ_goods_store_tk_sub t where t.tk_id='"+uids+"'";
		var outsubidstr = "";
		DWREngine.setAsync(false);
		baseDao.getData(sql,function(list){
			for(i = 0; i < list.length; i++) {
				outsubidstr += ",'"+list[i]+"'";		
			}
		});	
		baseDao.getData(selsql,function(list){
			for(i = 0; i < list.length; i++) {
				outsubidstr += ",'"+list[i]+"'";		
			}
		});	
		DWREngine.setAsync(true);
		var outSubWhere = " outId in (select uids from EquGoodsStockOut where finished='1' " +
				" and conid='"+conid+"') " ;
		outsubidstr = outsubidstr.substring(1);
		if(outsubidstr!=""){
		     outSubWhere+=" and uids not in ("+outsubidstr+")";
		}
		dsOutSub.baseParams.params = outSubWhere;
		dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
		
	}
	/**********************************************退库单基本信息end*********************************************************************/
	/**********************************************选择出库单信息start*********************************************************************/
	var fcOutSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '设备库存主键'},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单编号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'outNum' : {name : 'outNum',fieldLabel : '出库数量'},
		'storage' : {name : 'storage',fieldLabel : '存放库位'}
	};
	var smOutSub = new Ext.grid.CheckboxSelectionModel();
	var cmOutSub = new Ext.grid.ColumnModel([
        smOutSub,
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
			id : 'yazNum',
			header : "已安装数量",
			align : 'right',
			dataIndex:'yazNum',
			renderer:function(value,cell,record){
				var yazNum=0;
				//需要取自设备安装信息中的"安装数量"
    			return yazNum;
			}
		},{
			id : 'ktkNum',
			header : '<font color=red>可退库数量</font>',
			align : 'right',
			dataIndex:'ktkNum',
			renderer:function(value,cell,record){
				var ktkNum="";
				var texist="";
				var sql="select avg(nvl(o.out_Num,0))-sum(nvl(t.tk_Num,0)) from  equ_goods_stock_out_sub o , equ_goods_store_tk_sub t"+
				        " where o.uids='"+record.get('uids')+"'"+" and t.out_sub_id='"+record.get('uids')+"' and t.pid='"+CURRENTAPPID+"' ";
				var sqlexist="select uids from equ_goods_store_tk_sub  where out_sub_id='"+record.get('uids')+"' and pid='"+CURRENTAPPID+"' ";
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					texist = list;
				})
				if(texist!=""){
				    baseMgm.getData(sql,function(list){
					ktkNum = list;
				})
				}else{
				    ktkNum=record.get('outNum')
				}
				
				DWREngine.setAsync(true);
    			return ktkNum;
			}
		},{
			id : 'storage',
			header : fcOutSub['storage'].fieldLabel,
			dataIndex : fcOutSub['storage'].name,
			align : 'center',
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
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
		{name:'unit', type:'string'},,
		{name:'outNum', type:'float'},
		{name:'storage', type:'string'}
	];
	var dsOutSub = new Ext.data.GroupingStore({
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
        pruneModifiedRecords: true,
        remoteGroup : false,
		sortInfo : {
			field : orderColumnOutSub,
			direction : "ASC"
		}, // 分组
		groupField : orderColumnOutSub // 分组
    });
    dsOutSub.setDefaultSort(orderColumnOutSub, 'desc');	//设置默认排序列
    
    var selectTkBtn = new Ext.Button({
    	text : '选择',
    	iconCls : 'btn',
    	handler : function(){
    		var records = smOutSub.getSelections();
    		if(records == null || records.length == 0){
    			Ext.example.msg('提示信息','请先选择出库单中的设备！');
    			return;
    		}
    		var outSubUids = new Array();
    		var outIdType=records[0].get('outId');
    		if(flagOutId!=""){
    			outIdType=flagOutId;
    		}
    		for (var i = 0; i < records.length; i++) {
    			if(records[i].get('outId')!=outIdType){
    				Ext.example.msg('提示信息','请先选择同一出库单中的设备！');
    			    return;
    			}
    			outSubUids.push(records[i].get("uids"));
    		}
    		var id = formPanel.getForm().findField('uids').getValue();
    		var no = formPanel.getForm().findField('tkNo').getValue();
    		var outId = records[0].get("outId");
    		var outNo = records[0].get("outNo");
    		DWREngine.setAsync(false);
    		equMgm.insertTkSubFromOutSub(outSubUids,id,no,outId,outNo,function(str){
    			if(str == "1"){
    				Ext.example.msg('提示信息','退库单设备选择成功！');
    				outWin.hide();
    				dsSub.reload();
    				formPanel.getForm().findField("outId").setValue(outId);
    				formPanel.getForm().findField("outNo").setValue(outNo);
    			}else{
    				Ext.example.msg('提示信息','退库单设备选择失败！');
    			}
    		});
    		DWREngine.setAsync(true);
    	}
    });
    var gridPanelOutSub = new Ext.grid.GridPanel({
		ds: dsOutSub,
		cm: cmOutSub,
		sm: smOutSub,
		title:"出库单详细信息",
		tbar : ['<font color=#15428b><B>选择出库单<B></font>','->',selectTkBtn],
		border: false,
		region: 'center',
		header: false, 
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: false,
			ignoreAdd: true
		},
		view : new Ext.grid.GroupingView({ // 分组
			forceFit : false,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		}),
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsOutSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	//通知单选择窗口
	var outWin = new Ext.Window({
		width : 900,
		height : 450,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [gridPanelOutSub]
	});
	/**********************************************选择出库单信息end*********************************************************************/
	/**********************************************退库单明细start*********************************************************************/
	var fcSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '设备库存主键'},
		'outSubId' : {name : 'outSubId',fieldLabel : '出库单明细中设备主键'},
		'tkId' : {name : 'tkId',fieldLabel : '退库单主键'},
		'tkNo' : {name : 'tkNo',fieldLabel : '退库单据号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'tkNum' : {name : 'tkNum',fieldLabel : '退库数量'},
		'storage' : {
		    name : 'storage',fieldLabel : '退库存放库位'
//		    id: 'storage',
//		    mode : 'local',
//			editable:false,
//			valueField: 'k',
//			displayField: 'v',
//			readOnly:true,
//            listWidth: 180,
//            lazyRender:true,
//            maxHeight: 180,
//            triggerAction: 'all',
//            store: dsindexid,
//			tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
//            listClass: 'x-combo-list-small',
//			anchor : '95%',
//			listeners : {
//			     "expand" :function(){
//							newtreePanel.render('tree');
//							newroot.reload();
//			     }
//			}
		},
		'remark' : {name : 'remark',fieldLabel : '退库备注'}
	};
//   var storageComboTree = new fm.ComboBox(fcSub['storage'])
//   newtreePanel.on('beforeload', function(node) {
//		var parent = node.attributes.equid;
//
//		if (parent == null || parent == "")
//			parent = '01';
//		var baseParams = newtreePanel.loader.baseParams
//		baseParams.orgid = '0';
//		baseParams.parent = parent;
//	})
//	storageComboTree.on('beforequery', function(){
//		newtreePanel.render('tree');
//		newtreePanel.getRootNode().reload();
//	});
//	
//	newtreePanel.on('click', function(node,e){
//		var elNode = node.getUI().elNode;
//		var treename = node.attributes.treename;
//		var uids = elNode.all("uids").innerText;
//		storageComboTree.setValue(uids)
//		storageComboTree.collapse();
//	});
	var smSub = new Ext.grid.CheckboxSelectionModel();
	var cmSub = new Ext.grid.ColumnModel([
		smSub,
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
			id : 'stockId',
			header : fcSub['stockId'].fieldLabel,
			dataIndex : fcSub['stockId'].name,
			hidden : true
		},{
			id : 'outSubId',
			header : fcSub['outSubId'].fieldLabel,
			dataIndex : fcSub['outSubId'].name,
			hidden : true
		},{
			id : 'tkId',
			header : fcSub['tkId'].fieldLabel,
			dataIndex : fcSub['tkId'].name,
			hidden : true
		},{
			id : 'tkNo',
			header : fcSub['tkNo'].fieldLabel,
			dataIndex : fcSub['tkNo'].name,
			hidden : true
		},{
			id : 'boxNo',
			header : fcSub['boxNo'].fieldLabel,
			dataIndex : fcSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'equType',
			header : fcSub['equType'].fieldLabel,
			dataIndex : fcSub['equType'].name,
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
			header : fcSub['equPartName'].fieldLabel,
			dataIndex : fcSub['equPartName'].name,
			align : 'center',
			width : 180
		},{
			id : 'ggxh',
			header : fcSub['ggxh'].fieldLabel,
			dataIndex : fcSub['ggxh'].name,
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
			width : 80
		},{
			id : 'outNum',
			header : "出库数量",
			align : 'right',
			dataIndex:'outNum',
			renderer:function(value,cell,record){
				var outNum="";
				var sql="select out_Num from equ_goods_stock_out_sub where uids='"+record.get('outSubId')+"'";
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					outNum = list;
				})
				DWREngine.setAsync(true);
    			return outNum;
			}
		},{
			id : 'yazNum',
			header : "已安装数量",
			align : 'right',
			dataIndex:'yazNum',
			renderer:function(value,cell,record){
				var yazNum=0;
				//需要取自设备安装信息中的"安装数量"
    			return yazNum;
			}
		},{
			id : 'ktkNum',
			header : '<font color=red>可退库数量</font>',
			align : 'right',
			dataIndex:'ktkNum',
			renderer:function(value,cell,record){
				var ktkNum="";
				var sql="select avg(nvl(o.out_Num,0))-sum(nvl(t.tk_Num,0)) from  equ_goods_stock_out_sub o , equ_goods_store_tk_sub t"+
				        " where o.uids='"+record.get('outSubId')+"'"+" and t.out_sub_id='"+record.get('outSubId')+"' and t.pid='"+CURRENTAPPID+"' ";
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					ktkNum = list;
				})
				DWREngine.setAsync(true);
    			return ktkNum;
			}
		},{
			id : 'tkNum',
			header : fcSub['tkNum'].fieldLabel,
			dataIndex : fcSub['tkNum'].name,
			editor : new fm.NumberField(fcSub['tkNum']),
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			align : 'right',
			width : 80
		},{
			id : 'storage',
			header : fcSub['storage'].fieldLabel,
			dataIndex : fcSub['storage'].name,
//			editor : storageComboTree,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
			align : 'center',
			width : 100
		},{
			id : 'remark',
			header : fcSub['remark'].fieldLabel,
			dataIndex : fcSub['remark'].name,
			editor : new fm.TextField(fcSub['remark']),
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			align : 'center',
			width : 180
		}
	]);
	var ColumnsSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'stockId', type:'string'},
		{name:'outSubId', type:'string'},
		{name:'tkId', type:'string'},
		{name:'tkNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'tkNum', type:'float'},
		{name:'storage', type:'string'},
		{name:'remark', type:'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		stockId : '',
		tkId : '',
		tkNo : '',
		boxNo : '',
		equType : '',
		equPartName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		tkNum : 0,
		storage : '',
		remark : ''
	}
	var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanSub,
	    	business: businessSub,
	    	method: listMethodSub,
	    	params: "pid='"+CURRENTAPPID+"' and tkId='"+edit_uids+"'"
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
    dsSub.load({params:{start:0,limit:10}});
    var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
    	id:"gridPanelSub",
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '退库单明细',
		clicksToEdit : 2,
		tbar : ['<font color=#15428b><B>'+formPanelName+'明细<B></font>','-'],
		addBtn : false,
		saveHandler : saveSub,
		deleteHandler : deleteSub,
		saveBtn : true,
		delBtn : true,
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
		listeners:{
			afteredit:function(e){
				if(e.field == 'tkNum'){
					var record = e.record;
					var realOld=e.originalValue ;
					var valOld="" ;
			    	var realNew = e.value;
			    	if(realNew<0){
			    		record.set('tkNum',realOld);
			    		return false;
			    	}
			    	var ktkNum="";
					var sql="select avg(nvl(o.out_Num,0))-sum(nvl(t.tk_Num,0)) from  equ_goods_stock_out_sub o , equ_goods_store_tk_sub t"+
					        " where o.uids='"+record.get('outSubId')+"'"+" and t.out_sub_id='"+record.get('outSubId')+"' and t.pid='"+CURRENTAPPID+"' ";
					var sqlold="select tk_num from equ_goods_store_tk_sub where uids='"+record.get('uids')+"'"
					DWREngine.setAsync(false);
					baseMgm.getData(sql,function(list){
						ktkNum = list;
					})
					baseMgm.getData(sqlold,function(list){
						valOld = list;
					})
					DWREngine.setAsync(true);
	    			if(realNew - valOld > ktkNum){
						Ext.Msg.show({
							title: '提示',
				            msg: '退库数量修改出错，退库数量只能再增加'+ktkNum+record.get('unit'),
				            icon: Ext.Msg.WARNING, 
				            width:200,
				            buttons: Ext.MessageBox.OK
						});
						record.set('tkNum',realOld);
					}
				 }
			}
		}
	});
	/**********************************************退库单明细end*********************************************************************/
	var view = new Ext.Viewport({
		layout:'border',
        items: [formPanel, gridPanelSub]
	});
	
	formPanel.getForm().loadRecord(loadFormRecord);
	function saveTk(){
		var form = formPanel.getForm();
    	var obj = form.getValues();
		for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	equMgm.addOrUpdateEquTk(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','设备退库保存失败！');
    		}else{
    			Ext.example.msg('提示信息','设备退库保存成功！');
    			form.findField("uids").setValue(str);
    			edit_uids=str;
    			dsSub.baseParams.params = "pid='"+CURRENTAPPID+"' and tkId='"+str+"'"
    		}
    	});
    	DWREngine.setAsync(true);
	}
	//保存设备部件信息，
	function saveSub(){
		var records=dsSub.getModifiedRecords();
		var flag=true;
		if(records.length!=0){
			for(var i=0;i<records.length;i++){
				var ktkNum="";
				var realOld="";
				var sql="select avg(nvl(o.out_Num,0))-sum(nvl(t.tk_Num,0)) from  equ_goods_stock_out_sub o , equ_goods_store_tk_sub t"+
				        " where o.uids='"+records[i].get('outSubId')+"'"+" and t.out_sub_id='"+records[i].get('outSubId')+"' and t.pid='"+CURRENTAPPID+"' ";
				var sqlold="select tk_num from equ_goods_store_tk_sub where uids='"+records[i].get('uids')+"'"
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					ktkNum = list;
				})
				baseMgm.getData(sqlold,function(list){
					realOld = list;
				})
				DWREngine.setAsync(true);
    			var newstockNum=(ktkNum+realOld)-records[i].get('tkNum');
    			if(newstockNum<0){
					Ext.Msg.show({
						title: '提示',
			            msg: '设备'+records[i].get('equPartName')+'的退库数量不能大于可退库数量',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					});
					flag = false;
					break;
			    }
			}
			if(flag){
		        gridPanelSub.defaultSaveHandler();
		    }
		}
	};
	function deleteSub(){
		var records = smSub.getSelections();
		if(records == null || records.length == 0){
    			Ext.example.msg('提示信息','请先选择要删除的退库单明细设备！');
    			return;
    		}
		var dtkSubUids = new Array();
		var dtkid=records[0].get('tkId');
		for (var i = 0; i < records.length; i++) {
			dtkSubUids.push(records[i].get("uids"));
		}
		Ext.Msg.show({
			title : '提示',
			msg : '是否删除选中的退库单明细设备信息？',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,
			fn : function(value) {
				if ("yes" == value) {
					gridPanelSub.getEl().mask("loading...");
					equMgm.deleteTkSub(dtkSubUids,dtkid, function(flag) {
						if ("0" == flag) {
							Ext.example.msg('删除成功！',
									'您成功删除了'+records.length+'条退库单明细设备信息！');
							dsSub.reload();
							if((dsSub.getTotalCount()-records.length)<1){
								formPanel.getForm().findField("outId").setValue("");
    		                    formPanel.getForm().findField("outNo").setValue("");
							}
						} else{
							Ext.Msg.show({
								title : '提示',
								msg : '数据删除失败！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
						gridPanelSub.getEl().unmask();
					});
				}
			}
		});
	}
});