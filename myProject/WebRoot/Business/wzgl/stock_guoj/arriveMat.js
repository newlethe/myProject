var beanB = "com.sgepit.pmis.wzgl.hbm.WzInput"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";
;
var smB = new Ext.grid.CheckboxSelectionModel()	
var fm = Ext.form;		
var conoveWindow
var fcB = { 
	'uids' : {
		name : 'uids',
		fieldLabel : '主键',  
		hideLabel : true
	},'bh' : {
		name : 'bh',
		fieldLabel : '入库单编号',  
		hideLabel : true
	},'hth' : {
		name : 'hth',
		fieldLabel : '采购合同',  
		hideLabel : true
	},'cgbh' : {
		name : 'cgbh',
		fieldLabel : '采购计划',  
		hideLabel : true
	},'ckh' : {
		name : 'ckh',
		fieldLabel : '仓库',
		anchor : '95%'
	},'bm' : {
		name : 'bm',
		fieldLabel : '编码',  
		hideLabel : true
	},'pm' : {
		name : 'pm',
		fieldLabel : '品名',
		anchor : '95%'
	},'gg' : {
		name : 'gg',
		fieldLabel : '规格',
		anchor : '95%'
	},'dw' : {
		name : 'dw',
		fieldLabel : '单位',
		anchor : '95%'
	},'jhdj' : {
		name : 'jhdj',
		fieldLabel : '计划单价',
		anchor : '95%'
	},'sjdj' : {
		name : 'sjdj',
		fieldLabel : '实际单价',
		anchor : '95%'
	},'sv' : {
		name : 'sv',
		fieldLabel : '税率',
		anchor : '95%'
	},'sqsl' : {
		name : 'sqsl',
		fieldLabel : '到货数量',
		anchor : '95%'
	},'jhzj' : {
		name : 'jhzj',
		fieldLabel : '总价',  
		anchor : '95%'
	},'zjbh' : {
		name : 'zjbh',
		fieldLabel : '发票号',
		anchor : '95%'
	},'jhbh' : {
		name : 'jhbh',
		fieldLabel : '申请计划编号',
		anchor : '95%'
	},'pbbh' : {
		name : 'pbbh',
		fieldLabel : '到货记录编号',
		anchor : '95%'
	},'bz' : {  
		name : 'bz',
		fieldLabel : '备注',
		anchor : '95%'
	},'billType' : {  
		name : 'billType',
		fieldLabel : '记录类型',
		anchor : '95%'
	},'billname' : {  
		name : 'billname',
		fieldLabel : '单据名称',
		anchor : '95%'
	},'billState' : {  
		name : 'billState',
		fieldLabel : '操作',
		anchor : '95%'
	},'pid' : {
		name : 'pid',
		fieldLabel : 'PID'
	}
	
	/* GHDW, BGR, JHR,BILL_TYPE,BILL_STATE,
	SL,SJDJ,JHDJ,JHZJ,SJZJ,BILL_TYPE,ZDRQ,QRRQ,
	*/	
}

  var ColumnsB = [
  	{name: 'uids', type: 'string'},
  	{name: 'bh', type: 'string'},
  	{name: 'hth', type: 'string'},
  	{name: 'cgbh', type: 'string'},
  	{name: 'ckh', type: 'string'},
  	{name: 'bm', type: 'string'},    		
	{name: 'pm', type: 'string'},
	{name: 'gg', type: 'string' },
	{name: 'dw', type: 'string'},
	{name: 'jhdj', type: 'float'},
	{name: 'sjdj', type: 'float'},		
	{name: 'sv', type: 'float'},
	{name: 'sqsl', type: 'float'},
	{name: 'jhzj', type: 'float'},
	{name: 'zjbh', type: 'string'},
	{name: 'jhbh', type: 'string'},
	{name: 'pbbh', type: 'string'},
	{name: 'billType', type: 'string'},
	{name: 'billname', type: 'string'},
	{name: 'billState', type: 'string'},
	{name: 'bz', type: 'string'},
	{name: 'pid', type: 'string'}
	
];
var dsB = new Ext.data.Store({
	baseParams : {
		ac : 'list',
		bean : beanB,
		business : businessB,
		method : listMethodB,
		params : 'pid = '+CURRENTAPPID
	},
	proxy : new Ext.data.HttpProxy({
		method : 'GET',
		url : MAIN_SERVLET
	}),
	reader : new Ext.data.JsonReader({
		root : 'topics',
		totalProperty : 'totalCount',
		id : primaryKeyB
	}, ColumnsB),
	remoteSort : true,
	pruneModifiedRecords : true
});
dsB.setDefaultSort(orderColumnB, 'asc');	
//-----------------------------------------从grid begin-------------------------
var cmB = new Ext.grid.ColumnModel([
smB, {
	id : 'uids',
	header : fcB['uids'].fieldLabel,
	dataIndex : fcB['uids'].name,
	hidden : true
}, { 
	id : 'bh',
	header : fcB['bh'].fieldLabel,
	dataIndex : fcB['bh'].name,
	hidden : true
},{
	id : 'hth',
	header : fcB['hth'].fieldLabel,
	dataIndex : fcB['hth'].name,
	width:130,
	renderer:function(value){
		return value+ "<U style='cursor:hand' onclick=selectCon() ><font color=red>选择</font></U>"
	}
},{
	id : 'cgbh',
	header : fcB['cgbh'].fieldLabel,
	dataIndex : fcB['cgbh'].name
},{
	id : 'zjbh',
	header : fcB['zjbh'].fieldLabel,
	dataIndex : fcB['zjbh'].name,
	hidden : true
},{
	id : 'jhbh',
	header : fcB['jhbh'].fieldLabel,
	dataIndex : fcB['jhbh'].name,
	hidden : true
},{
	id : 'pbbh',
	header : fcB['pbbh'].fieldLabel,
	dataIndex : fcB['pbbh'].name,
	hidden : true
},{
	id : 'bm',
	header : fcB['bm'].fieldLabel,
	dataIndex : fcB['bm'].name
}, {
	id : 'ckh',
	header : fcB['ckh'].fieldLabel,
	dataIndex : fcB['ckh'].name,
	hidden : true
}, {
	id : 'pm',
	header : fcB['pm'].fieldLabel,
	dataIndex : fcB['pm'].name,
	width :80
	
}, {
	id : 'gg',
	header : fcB['gg'].fieldLabel,
	dataIndex : fcB['gg'].name,
	
	width :80
}, {
	id : 'dw',
	header : fcB['dw'].fieldLabel,
	dataIndex : fcB['dw'].name,
	align:"center",
	width :80
}, {
	id : 'jhdj',
	header : fcB['jhdj'].fieldLabel,
	dataIndex : fcB['jhdj'].name,
	align:"center",
	width :80
}, {
	id : 'sjdj',
	header : fcB['sjdj'].fieldLabel,
	dataIndex : fcB['sjdj'].name,
	align:"center",
	width :80,
	renderer:function(value,cell,record,rowIndex,columnIndex,store)
			{ 
				if(record.get("billType") =="到货"  && record.get("cgbh") == "计划外"){
					cell.attr = "style=background-color:#FBF8BF";
				}
				
				return value
			}
},{
	id : 'sv',
	header : fcB['sv'].fieldLabel,
	dataIndex : fcB['sv'].name,
	align:"center",
	width :40,
	renderer:function(value,cell,record,rowIndex,columnIndex,store)
			{ 
				if(record.get("billType") =="到货"  && record.get("cgbh") == "计划外"){
					cell.attr = "style=background-color:#FBF8BF";
				}
				
				return value
			}
}, {
	id : 'sqsl',
	header : fcB['sqsl'].fieldLabel,
	dataIndex : fcB['sqsl'].name,
	align:"center",
	renderer:function(value,cell,record,rowIndex,columnIndex,store)
			{ 
				if(record.get("billType") =="到货"  && record.get("cgbh") == "计划外"){
					cell.attr = "style=background-color:#FBF8BF";
				}
				
				return value
			}
}, {id :'jhzj',
	header : fcB['jhzj'].fieldLabel,
	dataIndex :fcB['jhzj'].name,
	align:"center",
	//editor : new Ext.form.NumberField(fcB['jhzj']),
	renderer:function(value,cell,record,rowIndex,columnIndex,store){
				record.data.jhzj = record.data.sqsl*record.data.sjdj
				record.set('jhzj',record.data.sqsl*record.data.sjdj)
				return record.data.sqsl*record.data.sjdj
		
	}
	
},{
	id : 'billType',
	header : fcB['billType'].fieldLabel,
	dataIndex : fcB['billType'].name,
	hidden: true,
	align:"center"
}, {
	id : 'billname',
	header : fcB['billname'].fieldLabel,
	dataIndex : fcB['billname'].name,
	hidden: true,
	align:"center"
}, {
	id : 'billState',
	header : fcB['billState'].fieldLabel,
	dataIndex : fcB['billState'].name,	
	align:"center",
	renderer : function(val,metadata,rec ){		
		var cgbh = rec.get("cgbh")
		var bm = rec.get("bm")
		var uids = rec.get("uids")
		var billState = rec.get("billState")
		var billType= rec.get("billType")
		if(rec.get("billType")=='到货') {
			return  "<button onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"') style='height:18' class='pageBtn'>入库</button>"
		}
		else {
			if(val=='1' || val=='S') {
				//return "<U style='cursor:hand' onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"')><font color=green>已验收</font></U>"
				return "<font color=green>已验收</font>"
			}
			else if(val=='F') {
				return "<U style='cursor:hand' onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"')>已作废</U>"
			}
			else {
				return  "<U style='cursor:hand' onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"') ><font color=red>待验收</font></U>"
			}
		}	
	}
},{
	id : 'bz',
	header : fcB['bz'].fieldLabel,
	dataIndex : fcB['bz'].name
},{
	id : 'pid',
	header : fcB['pid'].fieldLabel,
	dataIndex : fcB['pid'].name,
	hidden : true
}
])
cmB.defaultSortable = true;
//------------------选择合同
	var dsConove = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: 'com.sgepit.pmis.contract.hbm.ConOve',
			business: 'baseMgm',
			method: 'findWhereOrderBy',
			params: "pid = '"+CURRENTAPPID+"'"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'conid'
		}, [
			{name: 'conid', type: 'string'},
			{name: 'conno', type: 'string'},
			{name: 'conname', type: 'string'}
		]),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	
	gridConove = new Ext.grid.GridPanel({
		ds: dsConove,
		cm: new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer({
				width: 20
			}), {
				id: 'conid',
				header: '合同ID',
				dataIndex: 'conid',
				hidden: true
			}, {
				id: 'conno',
				header: '合同编号',
				dataIndex: 'conno',
				width: .3
			}, {
				id: 'conname',
				header: '合同名称',
				dataIndex: 'conname',
				width: .6
			}
		]),
		region: 'center',
		border: false,
		header: false,
		autoScroll: true,
		loadMask: true, stripeRows: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsConove,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
       
     
	});
	dsConove.baseParams.params="billstate=2";
	dsConove.load({ params:{start: 0, limit: PAGE_SIZE }});
function selectCon(){
if (!conoveWindow) {
		conoveWindow = new Ext.Window({
			title: '合同列表',
			iconCls: 'form', layout: 'border',
			closeAction: 'hide',
			width: 592, height: 280,
			modal: true, resizable: false,
			closable: true, border: false,
			maximizable: false, plain: true,
			tbar: [
				'<font color=#15428b>合同编号：</font>',
				{xtype: 'textfield', id: 'q-conno', name: 'conno', width: 110}, '-',
				'<font color=#15428b>合同名称：</font>',
				{xtype: 'textfield', id: 'q-conname', name: 'conname', width: 110}, '-', '->',
				{text: '查询', iconCls: 'btn', handler: qConOve}, '-',
				{text: '选择', iconCls: 'save', handler: function(){
						var sm = gridConove.getSelectionModel()
						if (sm.getSelected()){
							var record = gridPanelMat.getSelectionModel().getSelected();
							var num_h = gridPanelMat.getStore().indexOf(record);
							gridPanelMat.getStore().getAt(num_h).set("hth",sm.getSelected().get('conno'));  
							conoveWindow.hide();
						} else {
							Ext.example.msg('提示', '请选择数据！');
						}
					}
				}
			],
			items: [gridConove]
		});
	}
	conoveWindow.show();
	gridConove.on('rowdblclick', function(grid, rowIndex, e){
		cmp.setValue(grid.getStore().getAt(rowIndex).get('conno'));
		conoveWindow.hide();
	});
	gridConove.getStore().load();
}


function qConOve(){
	
	
	var fConno = Ext.getCmp('q-conno');
	var fConname = Ext.getCmp('q-conname');
	var sql = '';
	if (fConno.getValue() != ''){
		sql += "conno like '%"+fConno.getValue()+"%'";
	}
	if (fConname.getValue() != ''){
		if (sql != '') sql += " and ";
		sql += "conname like '%"+fConname.getValue()+"%'";
	}
	var _ds = gridConove.getStore();
	_ds.baseParams.params = sql;
	_ds.load();
}


function stockIn(p_cgbh,p_bm,p_uids,p_billState,p_billType){
	var sbmAccount = dsB.getTotalCount();
	var flag=0;
	for(var i=0;i<sbmAccount;i++){
		if(dsB.getAt(i).data.billType=="到货"){flag+=1}
	}

//如果flag=1 标识为最后一条入库数据	
	var recordMain = sm.getSelected();
	var obj = new Object()
	obj.cgbh = p_cgbh;
	obj.bm = p_bm;
	obj.uids = p_uids;
	obj.arriveBh = recordMain.get("bh");
	obj.billState = p_billState;
	obj.billType = p_billType;
	obj.flag = flag;
	obj.jhzj =smB.getSelected().get('jhzj');
	obj.hth = smB.getSelected().get('hth');	
	obj.isFlwTask = isFlwTask;
	var sfeature = "dialogWidth:1024px;dialogHeight:768px;center:yes;resizable:yes;"
	if(p_cgbh =="计划外"){
		sfeature = "dialogWidth:1024px;dialogHeight:300px;center:yes;resizable:yes;"
	}else{
		if(obj.hth==""||obj.hth==null){
			Ext.MessageBox.alert("提示","请先选择要采购合同！");return;
		}
    	if(dsB.getModifiedRecords().length>0){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先保存信息！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
	} 
	
	var re = window.showModalDialog(BASE_PATH + 'Business/wzgl/stock_guoj/arriveInput.jsp',obj,sfeature)
	if(re==0){
		if(isFlwTask==true){
		   Ext.Msg.show({
			   title: '保存成功！',
			   msg: '已经全部入库！　　　<br>可以发送流程到下一步操作！',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO,
			   fn: function(value){
			   		if ('ok' == value){
			   			parent.IS_FINISHED_TASK = true;
						parent.mainTabPanel.setActiveTab('common');
			   		}
			   }
			});
		}
	}
	dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
	
}