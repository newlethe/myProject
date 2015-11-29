var bean = "com.sgepit.pmis.contract.hbm.ConOve "
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var propertyName = "condivno"
var partBs= new Array();
var BillState = new Array();
var gridPanelCon
var fm = Ext.form;


var gridfiter = "partybno ='" + g_csdm+ "'"

DWREngine.setAsync(false);  
DWREngine.beginBatch(); 
conpartybMgm.getPartyB(function(list){         //获取乙方单位
	for(i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].cpid);			
		temp.push(list[i].partyb);		
		partBs.push(temp);			
	}
   });
   appMgm.getCodeValue('合同状态',function(list){         //获取合同状态
	for(i = 0; i < list.length; i++) {
		var temp = new Array();	
		temp.push(list[i].propertyCode);		
		temp.push(list[i].propertyName);	
		BillState.push(temp);			
	}
   }); 
    
DWREngine.endBatch();
DWREngine.setAsync(true);	
  
var dsPartB = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: partBs
});

var dsBillState = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data:BillState
});
      
 // 1. 创建选择模式
var smMain =  new Ext.grid.RowSelectionModel({singleSelect:true})
 // 2. 创建列模型
var fc = {		// 创建编辑域配置
	'conid': {name: 'conid',
		fieldLabel: '主键',
		anchor:'95%',
		hidden: true,
		hideLabel:true
	}, 
	'pid': {
		name: 'pid',
		fieldLabel: '工程项目编号',
		hidden: true,
		hideLabel:true,
		anchor:'95%'
	}, 'conno': {
		name: 'conno',
		fieldLabel: '合同编号',
		anchor:'95%'
	}, 'conname': {
		name: 'conname',
		fieldLabel: '合同名称',
		anchor:'95%'
	},'signdate': {
		name: 'signdate',
		fieldLabel: '签订日期',
        format: 'Y-m-d',
        minValue: '2000-01-01',
		anchor:'95%'
	},'conmoney': {
		name: 'conmoney',
		fieldLabel: '合同签定金额',
		anchor:'95%'
	},'convalue': {
		name: 'convalue',
		fieldLabel: '合同总金额',
		anchor:'95%'
	}, 'partybno': {
		name: 'partybno',
		fieldLabel: '乙方单位',
		valueField:'k',
		displayField: 'v',
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: dsPartB,
        lazyRender:true,
        listClass: 'x-combo-list-small',
		anchor:'95%'
	},'billstate': {
		name: 'billstate',
		fieldLabel: '合同状态',
		readOnly : true,
		valueField:'k',
		displayField: 'v',
		emptyText:'合同审定', 
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: dsBillState,
        lazyRender:true,
        listClass: 'x-combo-list-small',
		hidden: true,
		hideLabel:true,            
		anchor:'95%'
	},'isChange': {
		name: 'isChange',
		fieldLabel: '是否变更',
		hidden: true,
		hideLabel:true,
		anchor:'95%'
	}
}
   
var cm = new Ext.grid.ColumnModel([		// 创建列模型
	{
       id:'conid',
       type: 'string',
       header: fc['conid'].fieldLabel,
       dataIndex: fc['conid'].name,
       hidden: true
    },{
       id:'pid',
       type: 'string',
       header: fc['pid'].fieldLabel,
       dataIndex: fc['pid'].name,
       hidden: true
    },{
       id:'conno',
       type: 'string',
       header: fc['conno'].fieldLabel,
       dataIndex: fc['conno'].name,
       width: 60
    },{
       id: 'conname',
       type: 'string',
       header: fc['conname'].fieldLabel,
       dataIndex: fc['conname'].name,
       width: 180
    },{
       id: 'partybno',
       type: 'combo',
       header: fc['partybno'].fieldLabel,
       dataIndex: fc['partybno'].name,
       width: 120,
       renderer: partbRender,
       store:dsPartB
    },{
       id: 'conmoney',
       type: 'float',
       header: fc['conmoney'].fieldLabel,
       dataIndex: fc['conmoney'].name,
       width: 70,
       align: 'right',
       renderer: cnMoney
    },{
       id: 'convalue',
       type: 'float',
       header: fc['convalue'].fieldLabel,
       dataIndex: fc['convalue'].name,
       width: 70,
       align: 'right',
       renderer: isChange
    },{
       id: 'signdate',
       type: 'date',
       header: fc['signdate'].fieldLabel,
       dataIndex: fc['signdate'].name,
       width: 40,
       renderer: formatDate
    },{
       id: 'billstate',
       type:'combo',
       header: fc['billstate'].fieldLabel,
       dataIndex: fc['billstate'].name,
       disabled : true,
       width: 40,
       renderer: BillStateRender,
       store:dsBillState
    },{
       id: 'isChange',
       header: fc['isChange'].fieldLabel,
       dataIndex: fc['isChange'].name,
       hidden: true
    }
  
]);
cm.defaultSortable = true;   						//设置是否可排序

// 3. 定义记录集
var Columns = [
	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
	{name: 'pid', type: 'string'},
	{name: 'conno', type: 'string'},    	
	{name: 'conname', type: 'string'},
	{name: 'partybno', type: 'string'},
	{name: 'conmoney', type: 'float'},
	{name: 'convalue', type: 'float'},
	{name: 'billstate', type: 'string'},
	{name: 'isChange', type: 'string'},
	{name: 'signdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
];
		
    
    // 4. 创建数据源
var dsMain = new Ext.data.Store({
	baseParams: {
	   	ac: 'list',				
	   	bean: bean,				
	   	business: business,
	   	method: listMethod,
	   	params: gridfiter
	},
    // 设置代理（保持默认）
    proxy: new Ext.data.HttpProxy({
        method: 'GET',
        url: MAIN_SERVLET
    }),
    // 创建reader读取数据（保持默认）
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount',
        id: 'cpid'
    }, Columns),
    // 设置是否可以服务器端排序
    remoteSort: true,
    pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
 });

dsMain.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

//合同物资清单
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
		fieldLabel : 'pid',  
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
		fieldLabel : '计划单价',
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
	{name: 'bz', type: 'string'}
	
];
dsB = new Ext.data.Store({
	baseParams : {
		ac : 'list',
		bean : beanB,
		business : businessB,
		method : listMethodB,
		params : null
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
	hidden:true,
	width :80
}, {
	id : 'dj',
	header : fcB['dj'].fieldLabel,
	dataIndex : fcB['dj'].name,
	align:"center",
	width :80,
	editor : new Ext.form.NumberField(fcB['dj']),
	renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
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
		return record.data.sl*record.data.dj;
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

// 下拉列表中 k v 的mapping 
	//乙方单位
function partbRender(value){
	var str = '';
	for(var i=0; i<partBs.length; i++) {
		if (partBs[i][0] == value) {
			str = partBs[i][1]
			break; 
		}
	}
	return str;
}
   	// 合同状态
function BillStateRender(value){
	var str = '';
	for(var i=0; i<BillState.length; i++) {
		if (BillState[i][0] == value) {
			str = BillState[i][1]
			break; 
		}
	}
	return str;
}
   	
 // 如果变更了 就颜色区分
function isChange(value, cellMeta, record){
	if (record.get('isChange') == "是"){
		value = '<font color=#0000ff>'+cnMoney(value)+'</font>';
	}else{
		value = cnMoney(value);
	}
	return value;
}
function formatDate(value){
     return value ? value.dateFormat('Y-m-d') : '';
};
Ext.onReady(function(){      
    dsMain.on('load',function(ds1){
	  	smMain.selectFirstRow(); 	  	   
   		
	 });
    gridPanelCon = new Ext.grid.EditorGridTbarPanel({
	    store: dsMain,
	    cm: cm,
	    sm: smMain,
	    title: "合同列表",
	    border: true,
	    layout: 'fit',
	    height: 200,
	    region: 'north',
	    split:true,
	    header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: true,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsMain,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	gridPanelMat = new Ext.grid.EditorGridTbarPanel({
		id : 'matPanel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		clicksToEdit : 1,
		loadMask: true,		
		region: 'center',
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

		bbar: new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
			store: dsB,
			displayInfo: true,
			displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		})
		
	});
  
    reload();
    
    function reload(){
	    dsMain.load({ params: {start: 0,limit: PAGE_SIZE}  });
    }
    smMain.on('rowselect', function(sm, rowIndex, record){  	
   		var selectedConId = record.get('conid'); 		
		dsB.baseParams.params = " hth ='" + selectedConId + "'";
		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })
   
   
   
   
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanelCon,gridPanelMat]
    }); 

    // 13. 其他自定义函数，如格式化，校验等
   
  

   	
});