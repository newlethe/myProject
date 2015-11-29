var beanB = "com.sgepit.pmis.wzgl.hbm.ConMat"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";
var gridPanelMat
var servletUrl = basePath + "servlet/MatServlet"
var smB = new Ext.grid.CheckboxSelectionModel()	
var matGridSaveBtn	
var dsB
var addBtn;
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

matGridSaveBtn = new Ext.Button({
	name: 'save',
          text: '保存',
          iconCls: 'save',
          handler: matGridSave
})   

var fcB = { 
	'uids' : {
		name : 'uids',
		fieldLabel : '主键',  
		hideLabel : true
	},'hth' : {
		name : 'hth',
		fieldLabel : '采购合同',  
		hideLabel : true
	},'pid' : {
		name : 'pid',
		fieldLabel : 'PID',  
		hideLabel : true
	},'cgjhbh' : {
		name : 'cgjhbh',
		fieldLabel : '采购计划',  
		hideLabel : true
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
		fieldLabel : '规格型号',
		anchor : '95%'
	},'dw' : {
		name : 'dw',
		fieldLabel : '单位',
		anchor : '95%'
	},'jhdj' : {
		name : 'jhdj',
		fieldLabel : '采购计划单价',
		anchor : '95%'
	},'dj' : {
		name : 'dj',
		fieldLabel : '合同价格',
		anchor : '95%'
	},'sl' : {
		name : 'sl',
		fieldLabel : '合同数量',
		anchor : '95%'
	},'dhsl' : {
		name : 'dhsl',
		fieldLabel : '到货数量',
		anchor : '95%'
	},'zj' : {
		name : 'zj',
		fieldLabel : '总价',
		anchor : '95%'
	},'dhrq' : {
		name : 'dhrq',
		fieldLabel : '到货日期',
		anchor : '95%'
	},'bz' : {  
		name : 'bz',
		fieldLabel : '备注',
		anchor : '95%'
	},'zzcs' : {  
		name : 'zzcs',
		fieldLabel : '制造厂商',
		anchor : '95%'
	},'wzbm' : {
		name : 'wzbm',
		fieldLabel : '物资编码',
		anchor : '95%'
	}
	
}


  var ColumnsB = [
  	{name: 'uids', type: 'string'},
  	{name: 'hth', type: 'string'},
  	{name: 'pid', type: 'string'},
  	{name: 'cgjhbh', type: 'string'},
  	{name: 'bm', type: 'string'},    		
	{name: 'pm', type: 'string'},
	{name: 'gg', type: 'string' },
	{name: 'dw', type: 'string'},
	{name: 'jhdj', type: 'float'},
	{name: 'dj', type: 'float'},	
	{name: 'sl', type: 'float'},
	{name: 'dhsl', type: 'float'},
	{name: 'zj', type: 'float'},
	{name: 'dhrq', type: 'date'},
	{name: 'zzcs', type: 'string'},
	{name: 'bz', type: 'string'},
	{name: 'wzbm', type: 'string'}
	
];
dsB = new Ext.data.Store({
	baseParams : {
		ac : 'list',
		bean : beanB,
		business : businessB,
		method : listMethodB,
		params : pidWhereString
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
	id : 'pid',
	header : fcB['pid'].fieldLabel,
	dataIndex : fcB['pid'].name,
	hidden : true
},{
	id : 'hth',
	header : fcB['hth'].fieldLabel,
	dataIndex : fcB['hth'].name,
	hidden : true
},{
	id : 'bm',
	header : fcB['bm'].fieldLabel,
	dataIndex : fcB['bm'].name,
	hidden : true,
	width :100
}, {
	id : 'wzbm',
	header : fcB['wzbm'].fieldLabel,
	dataIndex : fcB['wzbm'].name,
	width :100
}, {
	id : 'pm',
	header : fcB['pm'].fieldLabel,
	dataIndex : fcB['pm'].name,
	align:"center",
	width :100
	
}, {
	id : 'gg',
	header : fcB['gg'].fieldLabel,
	dataIndex : fcB['gg'].name,
	align:"center",
	width :100
}, {
	id : 'dw',
	header : fcB['dw'].fieldLabel,
	dataIndex : fcB['dw'].name,
	align:"center",
	width :40
}, {
	id : 'jhdj',
	header : fcB['jhdj'].fieldLabel,
	dataIndex : fcB['jhdj'].name,
	align:"center",
	//hidden:true,
	width :80
}, {
	id : 'dj',
	header : fcB['dj'].fieldLabel,
	dataIndex : fcB['dj'].name,
	align:"center",
	hidden:true,
	width :80
	//editor : new Ext.form.NumberField(fcB['dj']),
	//renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
}, {
	id : 'sl',
	header : fcB['sl'].fieldLabel,
	dataIndex : fcB['sl'].name,
	align:"center",
	width :60,
	editor : new Ext.form.NumberField(fcB['sl']),
	renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
}, {
	id : 'dhsl',
	header : fcB['dhsl'].fieldLabel,
	dataIndex : fcB['dhsl'].name,
	width :80,
	hidden:true,
	align:"center"
}, {
	id : 'zj',
	header : fcB['zj'].fieldLabel,
	dataIndex : fcB['zj'].name,
	align:"center",
	width :100,
	
	renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
		return record.data.sl*record.data.jhdj;
	}
}, {
	id : 'dhrq',
	header : fcB['dhrq'].fieldLabel,
	dataIndex : fcB['dhrq'].name,
	hidden:true,
	align:"center"
}, {
	id : 'cgjhbh',
	header : fcB['cgjhbh'].fieldLabel,
	dataIndex : fcB['cgjhbh'].name,
	width :80
},{
	id : 'zzcs',
	header : fcB['zzcs'].fieldLabel,
	dataIndex : fcB['zzcs'].name,
	hidden: true,
	hidden:true,
	align:"center"
}, {
	id : 'bz',
	header : fcB['bz'].fieldLabel,
	dataIndex : fcB['bz'].name,
	editor : new Ext.form.TextField(fcB['bz'])
}
])
cmB.defaultSortable = true;

Ext.onReady(function (){
	addBtn = new Ext.Button({
    	text:'选择库存物资',
    	tooltip:'从库存物资中选择',
    	iconCls : 'add',
    	handler:selectStorageFun
    })
     
	gridPanelMat = new Ext.grid.EditorGridTbarPanel({
		id : 'matPanel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		clicksToEdit : 1,
		loadMask: true,		
		tbar : [],
		//border : false,
		title:'合同物资清单',
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		saveBtn: false,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		business : businessB,		
		primaryKey : primaryKeyB ,		
		crudText: {add:'选择采购计划'},
		bbar: new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
			store: dsB,
			displayInfo: true,
			displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		}),
		insertHandler: selectStockFun,
		deleteHandler: deleteConMatFun
		
	});
	
	
	function selectStorageFun(){
		if(smMain.getSelected()==null){
			Ext.Msg.alert("提示", "请选择合同记录！");
			return 
		}
		var obj = new Object()
		obj.conId = smMain.getSelected().get("conid")
		obj.conNo =  smMain.getSelected().get("conno")		
        var rtn = window.showModalDialog(BASE_PATH + 'Business/wzgl/stock/stockConSelectStorage.jsp',obj,"dialogWidth:1024px;dialogHeight:600px;center:yes;resizable:yes;")
		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
	}
	
		//汇总采购计划
	function selectStockFun(){
		if(smMain.getSelected()==null){
			Ext.Msg.alert("提示", "请选择合同记录！");
			return 
		}
		var obj = new Object()
		obj.conId = smMain.getSelected().get("conid")
		obj.conNo =  smMain.getSelected().get("conno")		
		var rtn = window.showModalDialog(BASE_PATH + 'Business/wzgl/stock/stockConSelectCgjh.jsp',obj,"dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;")
		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
	}
		
	function deleteConMatFun(){
		if (smB.getCount() > 0) {
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
					text) {
				if (btn == "yes") {
					var records = smB.getSelections()
					var codes = []
					for (var i = 0; i < records.length; i++) {
						var m = records[i].get("uids")
						if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
							continue;
						}
						codes[codes.length] = m
					}
					var mrc = codes.length
					if (mrc > 0) {
						var ids = codes.join(",");
						doDeleteConMat(mrc, ids)
					} else {
						dsB.reload();
					}
				}
			});
		}
	}
	
	function doDeleteConMat(mrc, ids) {
		Ext.Ajax.request({
			url : servletUrl,
			params : {
				ac : 'deleteConMat',
				ids : ids			
			},
			method : "GET",
			success : function(response, params) {
				var rspXml = response.responseXML
				var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue
				if (msg == "ok") {
					Ext.example.msg('删除成功！', '您成功删除了 {0} 条记录。', mrc);
					dsB.reload();
					dsB.rejectChanges(); // TODO 方法作用待进一步理解

				} else {
					var sa = rspXml.documentElement
							.getElementsByTagName("done").item(0).firstChild.nodeValue;
					var stackTrace = rspXml.documentElement
							.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
					var str = '第 ' + (sa * 1 + 1) + ' 条记录删除出错！<br>失败原因：' + msg;
					str += (sa * 1 > 0) ? '<br>本次操作保存删除 ' + sa + ' 条记录。' : "";
					Ext.MessageBox.show({
						title : '删除失败！',
						msg : str,
						width : 500,
						value : stackTrace,
						buttons : Ext.MessageBox.OK,
						multiline : true,
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			failure : function(response, params) {
				alert('Error: Delete failed!');
			}
		});
	}
})

function matGridSave(){
	var records = dsB.getModifiedRecords();
	for(var i=0;i<records.length;i++){
		records[i].data.zj = records[i].data.sl*records[i].data.dj
	}
	gridPanelMat.defaultSaveHandler()
}