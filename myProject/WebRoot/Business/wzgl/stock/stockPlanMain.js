var bean = "com.sgepit.pmis.wzgl.hbm.WzCjhpb"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "BH desc";
//var fm = Ext.form;
var sm = new Ext.grid.RowSelectionModel({singleSelect: true})    
var fm = Ext.form;			// 包名简写（缩写）

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
var hasFlow=false;//页面是否配置流程
    var billStateTemp=0;
DWREngine.setAsync(false);
    var rtnState='';
	systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
	    rtnState=rtn;
	})
	if(isFlwTask != true && isFlwView != true){
		if(rtnState=='BusinessProcess'){
		    billStateTemp=0;
		    hasFlow=true;
		}else if(rtnState=='ChangeStateAuto'){
		    billStateTemp=1;
		    hasFlow=false;
		}else if(rtnState=='None'){
		    billStateTemp=1;
		    hasFlow=false;
		}else{
			billStateTemp=1;
			hasFlow=false;
		}
	}else{
		hasFlow=true;
	}
DWREngine.setAsync(true);
var dsCgr = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: cgrSt
});

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
		fieldLabel : '计划人',
		anchor : '95%'
	},'cgr' : {  
		name : 'cgr',
		hiddenName :'cgr',
		fieldLabel : '<font color="red">采购人</font>',  
		valueField:'k',
		displayField: 'v',
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: dsCgr,              
        lazyRender:true,
        listClass: 'x-combo-list-small',
		anchor : '95%'
	},'rq' : { 
		name : 'rq',
		fieldLabel : '<font color="red"> 计划日期</font>',
		format: 'Y-m-d',
		anchor : '95%'
	},'billState' : { 
		name : 'billState',
		fieldLabel : '状态',
		anchor : '95%'
	},'userid' : { 
		name : 'userid',
		fieldLabel : '计划创建人',
		anchor : '95%'
	},'pid' : {
		name : 'pid',
		fieldLabel : 'PID',
		value : CURRENTAPPID,
		hidden : true
	}
	
}

var Columns = [
  	{name: 'uids', type: 'string'},
  	{name: 'bh', type: 'string'},    		
	{name: 'jhr', type: 'string'},
	{name: 'cgr', type: 'string'},
	{name: 'rq',  type: 'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'billState', type: 'string'},
	{name: 'userid', type: 'string'},
	{name: 'pid', type: 'string'}
	];
	
var Plant = Ext.data.Record.create(Columns);
	
var stockRq = new Date();
var PlantInt = {
	uids : '',
	bh : "",
	jhr : USERID,
	cgr: "",
	userid: USERID,
	rq: stockRq,
	billState: billStateTemp,
	pid : CURRENTAPPID
}

var cm = new Ext.grid.ColumnModel([
 {
	id : 'uids',
	header : fc['uids'].fieldLabel,
	dataIndex : fc['uids'].name,
	hidden : true
}, {
	id : 'bh',
	header : fc['bh'].fieldLabel,
	dataIndex : fc['bh'].name,
	width : 60,
	align:"center"
}, {
	id : 'jhr',
	header : fc['jhr'].fieldLabel,
	dataIndex : fc['jhr'].name,
	align:"center",
	width : 100,
	renderer: function(value) {
       	for(var i=0; i<userInfoSt.length; i++){
          	 	if (value == userInfoSt[i][0])
          	 		return userInfoSt[i][1]
          	 }
       }
}/*, {
	id : 'cgr',
	header : fc['cgr'].fieldLabel,
	dataIndex : fc['cgr'].name,
	align:"center",
	width : 0,        
	renderer: function(value) {
		for(var i=0; i<cgrSt.length; i++){
			if (value == cgrSt[i][0])
			return cgrSt[i][1]
		}
    },
	editor : new fm.ComboBox(fc['cgr'])
}*/, {
	id : 'rq',
	header : fc['rq'].fieldLabel,
	dataIndex : fc['rq'].name,
	width : 100,
	renderer: formatDate,
	align:"center",
	editor : new fm.DateField(fc['rq'])
}, {
	id : 'userid',
	header : fc['userid'].fieldLabel,
	dataIndex : fc['userid'].name,
	width : 100,
	hidden: true		
    },{
	id : 'billState',
	header : fc['billState'].fieldLabel,
	dataIndex : fc['billState'].name,
	width : 100,
	align:"center",
	hidden:!hasFlow,
	renderer: function(value) {
       	for(var i=0; i<flowStateSt.length; i++){
          	 	if (value == flowStateSt[i][0])
          	 		return flowStateSt[i][1]
          	 }
       }
},
{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true}
])
cm.defaultSortable = true;

var ds = new Ext.data.Store({
	baseParams : {
		ac : 'list',
		bean : bean,
		business : business,
		method : listMethod,
		params : "jhr='" + USERID +"' and "+pidWhereString+" "
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
if(isFlwTask || isFlwView){
	ds.baseParams.params=" bh='"+bh+"' and "+pidWhereString+" ";
}
ds.on('load',function(ds1){
  	sm.selectFirstRow();   	  		
 });
ds.load({ params:{start: 0, limit: 10 }});

function formatDate(value){ 
     return value ? value.dateFormat('Y-m-d') : '';
 };
   
   	


