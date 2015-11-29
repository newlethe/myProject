var bean = "com.sgepit.pmis.wzgl.hbm.WzCdjinPb"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "bh desc";
var fm = Ext.form;	


var dsSupplier = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: supplierSt
});
var dsKeeper = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: keeperSt
});
var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true})	
sm.on('rowselect', function(sm, rowIndex, record){
	var arriveBh = record.get('bh');
	dsB.baseParams.params = " pbbh ='" + arriveBh + "'";
	dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
})

var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			hideLabel : true
		},'bh' : {
			name : 'bh',
			fieldLabel : '采购编号',
			readOnly : true,
			
			anchor : '95%'
		},'jhr' : {
			name : 'jhr',
			fieldLabel : '经办人',
			anchor : '95%'
		},'dhrq' : { 
			name : 'dhrq',
			fieldLabel : '<font color="red"> 到货日期</font>',
			format: 'Y-m-d',
			anchor : '95%'
		},'billState' : { 
			name : 'billState',
			fieldLabel : '状态',
			anchor : '95%'
		},'ghdw' : { 
			name : 'ghdw',
			hiddenName:'name',
			fieldLabel : '<font color="red">供货单位</font>',
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: dsSupplier,
          	lazyRender: true,
          	listClass: 'x-combo-list-small',
		    allowBlank: false,
			anchor : '95%'
		},'bgr' : {  
			name : 'bgr',
			hiddenName :'bgr',
			fieldLabel : '<font color="red">保管人</font>',  
			valueField:'k',
			displayField: 'v',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: dsKeeper,              
	        lazyRender:true,
	        listClass: 'x-combo-list-small',
			anchor : '95%'
		},'bz' : { 
			name : 'bz',
			fieldLabel : '<font color="red">备注</font>',
			anchor : '95%'
		}
	}
var ghdwField = new Ext.form.ComboBox(fc['ghdw']); 
//ghdwField.onTriggerClick = function (){newWin()}

var Columns = [
  	{name: 'uids', type: 'string'},
  	{name: 'bh', type: 'string'},
  	{name: 'hth', type: 'string'},
  	{name: 'cgbh', type: 'string'},
  	{name: 'ghdw', type: 'string'},    		
	{name: 'rq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'dhrq', type: 'date', dateFormat: 'Y-m-d H:i:s' },
	{name: 'jhr', type: 'string'},
	{name: 'bgr', type: 'string'},	
	{name: 'bz', type: 'string'},	
	{name: 'billState', type: 'string'}
	
];

var Plant = Ext.data.Record.create(Columns);

var stockRq = new Date();
var PlantInt = {
	uids : '',
	hth : '',
	cgbh:"",
	bh : "",
	jhr : USERID,
	rq: stockRq,
	dhrq: stockRq,
	ghdw: "",
	bz: "",
	bgr:"",
	billState: '0'
}
var ds = new Ext.data.Store({
	baseParams : {
		ac : 'list',
		bean : bean,
		business : business,
		method : listMethod,
		params : null
	},
	proxy : new Ext.data.HttpProxy({
		method : 'GET',
		url : MAIN_SERVLET
	}),
	reader : new Ext.data.JsonReader({
		root : 'topics',
		totalProperty : 'totalCount',
		id : primaryKey
	}, Columns),
	remoteSort : true,
	pruneModifiedRecords : true
});
ds.setDefaultSort(orderColumn, 'asc');	
ds.on('load',function(ds1){
 	sm.selectFirstRow(); 		
});

//-----------------------------------------从grid begin-------------------------
var cm = new Ext.grid.ColumnModel([

	{id : 'uids',header: "流水号", dataIndex:"uids",hidden : true}, 
	{id : 'bh',	header : "到货编号",dataIndex : "bh",width: 60,align:"center"},
	{id : 'hth',header : "合同号", dataIndex : "hth",	hidden : true},
	{id : 'cgbh',header: "采购计划",dataIndex : "cgbh",hidden : true},
	{id : 'ghdw',header : fc["ghdw"].fieldLabel, dataIndex : "ghdw", width: 200,align:"center",editor : ghdwField,renderer: function(value) {
        	for(var i=0; i<supplierSt.length; i++){
           	 	if (value == supplierSt[i][0])
           	 		return supplierSt[i][1]
           	 }
        }
    },
	{id : 'rq',header : "录入日期", dataIndex : "rq",hidden: true},
	{id : 'dhrq',header : fc["dhrq"].fieldLabel, dataIndex : "dhrq",width: 60,align:"center",renderer: formatDate,editor : new fm.DateField(fc['dhrq'])},
	{id : 'jhr',header : fc["jhr"].fieldLabel,dataIndex : "jhr",width: 60,align:"center",renderer: function(value) {
        	for(var i=0; i<userInfoSt.length; i++){
           	 	if (value == userInfoSt[i][0])
           	 		return userInfoSt[i][1]
           	 }
        }
    },
	{id : 'bgr',header : fc["bgr"].fieldLabel,dataIndex : "bgr",width: 60,align:"center",renderer: function(value) {
        	for(var i=0; i<keeperSt.length; i++){
           	 	if (value == keeperSt[i][0])
           	 		return keeperSt[i][1]
           	 }
        },editor : new fm.ComboBox(fc['bgr'])
    },
    {id : 'bz',	header :fc["bz"].fieldLabel,dataIndex : "bz",width: 150,editor : new fm.TextField(fc['bz'])},
    {id : 'billState',header : "状态", dataIndex : "billState",	hidden : true}])
cm.defaultSortable = true;	
function formatDate(value){ 
	return value ? value.dateFormat('Y-m-d') : '';
};	
function newWin(){
	var csdm = window.showModalDialog(BASE_PATH + 'Business/wzgl/common/supplierChoose.jsp',null,"dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;")
	if(csdm && csdm!=""){
		var rec = sm.getSelected();
		ghdwField.setValue(csdm)
		//rec.set("ghdw",csdm)
	}
 }	
