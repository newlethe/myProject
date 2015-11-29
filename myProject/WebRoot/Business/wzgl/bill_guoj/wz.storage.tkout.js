var business = "baseMgm"
var listMethod = "findwhereorderby"
var bean_tk = "com.sgepit.pmis.wzgl.hbm.WzTk"
var primaryKey_tk = 'uids'
var orderColumn_tk = 'zdrq'
var gridPanel_tk
var insertFlag = 0;
var PlantInt, selectedData,ds_fw,bh_fw;
Ext.onReady(function(){
	//--用户userid:realname
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getuserSt = new Ext.data.SimpleStore({
 		fields:['userid','realname'],
 		data:userArray
 	})
 	
 
	//--物资编码bm:pm
	var wzArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select bm,pm from wz_ckclb ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			wzArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
	
	//--可用库存数量bm,kysl
	var kyslArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select bm,kysl from view_wz_collect_apply ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			kyslArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
	
	//-----------------部门（bmbz：sgcc_ini_unit==unitname)
	var bmbzArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit order by unitid",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			bmbzArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);	
 	
/*	//-----------------概算（bdgno：bdg_info==bdgname)
	var bdgArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select bdgno,bdgname from bdg_info ",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			bdgArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);	*/
 	
//----------------------领料出库单wz_output----------------------------//
	/*var cjxbdsArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select  bh,sum (dj*sl) from wz_cjsxb group by bh",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			cjxbdsArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);	*/
 	
 	
    
 	var fm_tk = Ext.form;
   		
	var fc = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true},
		'billname':{name:'billname',fieldLabel:'单据名称',allowBlank: false,value:''},
		'bh':{name:'bh',fieldLabel:'单据编号',allowBlank: false},
		'rq':{name:'rq',fieldLabel:'日期',format: 'Y-m-d'},
		'bm':{name:'bm',fieldLabel:'编码',readOnly:true },
		'pm':{name:'pm',fieldLabel:'品名',readOnly:true},
		'gg':{name:'gg',fieldLabel:'规格',readOnly:true},
		'dw':{name:'dw',fieldLabel:'计量单位'},
		'sl':{name:'sl',fieldLabel:'退库数量'},
		'zdrq':{name:'zdrq',fieldLabel:'制单日期',format: 'Y-m-d'},
		'jhdj':{name:'jhdj',fieldLabel:'计划单价'},
		'jhdj_sl':{name:'jhdj_sl',fieldLabel:'总金额'},
		'billState':{name:'billState',fieldLabel:'审批状态'},
		'pid':{name:'pid',fieldLabel:'PID'}
	}
	
	var Columns_tk = [
		{name:'uids',type:'string'},                          {name:'sl',type:'float'},           {name:'billname',type:'string'},    
		{name:'rq',type:'date',dateFormat:'Y-m-d H:i:s'},	  {name:'jhdj',type:'float'},         {name:'gg',type:'string'},       	
		{name:'zdrq',type:'date',dateFormat:'Y-m-d H:i:s'},	    {name:'billState',type:'string'}, {name:'jhdj_sl',type:'string'},
		{name:'bm',type:'string'},                            {name:'pm',type:'string'},      	  //{name:'qrrq',type:'date',dateFormat:'Y-m-d H:i:s'},   
	    {name:'dw',type:'string'},     	                    	  {name:'bh',type:'string'},
	    {name:'pid',type:'string'}
	]	
	
	var Plant_tk = Ext.data.Record.create(Columns_tk);

	PlantInt = {
			uids:'', billState:'N', bh:'', bm:'', zdrq:new Date(),     sl:'',  
            pm:'',    jhdj_sl:'',     gg:'', dw:'', billname:'退库单',   rq:'',  jhdj:'',
            pid:CURRENTAPPID
	}
	var sm_tk=  new Ext.grid.CheckboxSelectionModel();

	var cm_tk = new Ext.grid.ColumnModel([
		sm_tk,
		{   id:'uids',      header:fc['uids'].fieldLabel,        dataIndex:fc['uids'].name,          hidden: true},
	
		{	id:'billState', header:fc['billState'].fieldLabel,   dataIndex:fc['billState'].name ,
			renderer:function(value){
				if("N"==value){return"未审批"}else if("Y"==value||"1"==value){return "已审批"}else if("-1"==value){return "审批中"}
			} },
		{	id:'bh',   		header:fc['bh'].fieldLabel,      	dataIndex:fc['bh'].name,
			editor:new Ext.form.TextField(fc['bh'])
		},
		//{	id:'jhbh',   	header:fc['jhbh'].fieldLabel,      	dataIndex:fc['jhbh'].name,hidden: true},
		{	id:'zdrq',   	header:fc['zdrq'].fieldLabel,      	dataIndex:fc['zdrq'].name,renderer: formatDate },
	
		{	id:'bm',   		header:fc['bm'].fieldLabel,      	dataIndex:fc['bm'].name,readOnly:true,editor:new Ext.form.TextField(fc['pm']),
			width:200,renderer:function (value){
				return value + "&nbsp;&nbsp;&nbsp;<u class=btn1_mouseout onclick=addWZ()> <font color ='green'> (选择)</font></u>"
			}
		},
		{	id:'pm',   		header:fc['pm'].fieldLabel,      	dataIndex:fc['pm'].name,readOnly:true,editor:new Ext.form.TextField(fc['pm']) },
		{	id:'gg',   		header:fc['gg'].fieldLabel,      	dataIndex:fc['gg'].name,readOnly:true,editor:new Ext.form.TextField(fc['gg'])},
		{	id:'dw',   		header:fc['dw'].fieldLabel,      	dataIndex:fc['dw'].name,readOnly:true,editor:new Ext.form.TextField(fc['dw'])},
		{	id:'sl',   	header:fc['sl'].fieldLabel,      	dataIndex:fc['sl'].name,editor:new Ext.form.NumberField(fc['sl'])},
		{	id:'jhdj',   	header:fc['jhdj'].fieldLabel,      	dataIndex:fc['jhdj'].name},
		{	id:'billname',  header:fc['billname'].fieldLabel,    dataIndex:fc['billname'].name,hidden: true  },
		{	id:'jhdj_sl',   	header:fc['jhdj_sl'].fieldLabel,      	dataIndex:fc['jhdj_sl'].name,
			renderer:function(value,cellmeta,record){
				return record.data.sl*record.data.jhdj
			}
		},
		//{	id:'qrrq',   	header:fc['qrrq'].fieldLabel,      	dataIndex:fc['qrrq'].name,  renderer: formatDate,hidden: true  },
	   {	id:'rq',   	header:fc['rq'].fieldLabel,      	dataIndex:fc['rq'].name,hidden: true},
		{	id:'pid',   	header:fc['pid'].fieldLabel,      	dataIndex:fc['pid'].name,hidden: true}
		
		
	]);
	
	cm_tk.defaultSortable = true;//可排序
	
    ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_tk,
			business:business,
			method: listMethod,
			params:''
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey_tk
		},Columns_tk),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds.setDefaultSort(orderColumn_tk, 'asc');
    
	var addBtn_wz = new Ext.Button({
    	text:'选择物资',
    	iconCls : 'add',
    	handler:addWZ
    })
	gridPanel_tk = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm_tk,
		sm : sm_tk,
		region:'center',
		border : false,
		height: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		//addBtn:false,
		//delBtn:false,
		//saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>退库单<B></font>','-'],//addBtn_wz,'-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		insertHandler:insertData,
		saveHandler:saveData,
		// expend properties
		plant : Plant_tk,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean_tk,
		business : business,
		primaryKey : primaryKey_tk
	});
	if (isFlwTask == true || isFlwView == true){
		//ds.baseParams.params = "lyr='"+USERID+"' and bh='"+Flowuids+"' and jhbh='计划外' and  billName='领料出库单' ";
    	ds.baseParams.params =" bh='"+isFlwUids+"' and pid='"+CURRENTAPPID+"' ";
    }else{
		//ds.baseParams.params = "lyr='"+USERID+"' and pid='"+CURRENTAPPID+"' ";
    	ds.baseParams.params = " pid='"+CURRENTAPPID+"' ";
    }
	ds.load({params:
		{start:0,limit:PAGE_SIZE}});
    

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel_tk]
    });	
    if (isFlwTask == true || isFlwView == true){
		with(gridPanel_tk.getTopToolbar().items){
	    	//get('del').disable();
  	  }
    } 
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
    
});

function addWZ(){
	if(gridPanel_tk.getSelectionModel().getSelected()){
    	wz_treePanel.root.reload()
		wz_ds.reload();
		selectWin.show(true);
	}else{
		Ext.MessageBox.alert("提示","请选择要修改的行");    	
	}
}

function insertData(){
	if (isFlwTask == true){
		PlantInt.bh=isFlwUids
	}
	gridPanel_tk.defaultInsertHandler()
}
function saveData(){
	/*
	DWREngine.setAsync(false);
	var records = ds.getModifiedRecords();
	var flag = false;
	for(var i=0;i<records.length;i++){
		var m_sl = records[i].data.tksl;
			baseDao.updateBySQL("update wz_bm set sl=(sl+"+records[i].data.tksl+")where bm = '"+records[i].data.bm+"'",function(flag){
			if(flag==false){
					Ext.MessageBox.alert("提示","退库失败！");
					return;
			}
		})
	}
	*/
	DWREngine.setAsync(true);
	gridPanel_tk.defaultSaveHandler();
	if (isFlwTask == true){
		Ext.Msg.show({
				   title: '保存成功！',
				   msg: '成功添加领料单！　　　<br>可以发送流程到下一步操作！',
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

/******************CELL*********************/
function openCell() {
	if(gridPanel_tk.getSelectionModel().getSelected()){
		with(document.all.dbnetcell0) {
			code = 'WZBILL'
			report_no = '0502'
			lsh = ''
			readOnly = true
			reportArgs = new Object()
			onReportOpened = "reportOpened"
		}
		var lsh = document.all.dbnetcell0.open()
	}
}

function reportOpened(CellWeb) {
	if(gridPanel_tk.getSelectionModel().getSelected()){
		var record = gridPanel_tk.getSelectionModel().getSelected();
		var billName = "退库单"
		//var grid = document.all.dbnetgrid3
		var idArray = new Array(record.get('bh'))
		//outputCell(grid,CellWeb,billName,idArray)
		//outputCell(CellWeb,billName,idArray)
	}
}
/******************CELL*********************/