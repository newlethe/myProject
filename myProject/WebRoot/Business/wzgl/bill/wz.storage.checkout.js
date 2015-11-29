var business = "baseMgm"
var listMethod = "findwhereorderby"
var bean_output = "com.sgepit.pmis.wzgl.hbm.WzOutput"
var primaryKey_output = 'uids'
var orderColumn_output = 'zdrq'

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
 	
 	
    
 	var fm_output = Ext.form;
   		
	var fc = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true},
		'billname':{name:'billname',fieldLabel:'单据名称',allowBlank: false,value:''},
		'bh':{name:'bh',fieldLabel:'单据编号',allowBlank: false},
		'rq':{name:'rq',fieldLabel:'日期',format: 'Y-m-d'},
		'bz':{name:'bz',fieldLabel:'备注'},
		'jjr':{name:'jjr',fieldLabel:'经手人'},
		'bmzg':{name:'bmzg',fieldLabel:'部门主管'},
		'bgr':{name:'bgr',fieldLabel:'保管员'},
		'wzzg':{name:'wzzg',fieldLabel:'物资主管'},
		'jhr':{name:'jhr',fieldLabel:'计划员'},
		'tl':{name:'tl',fieldLabel:'退料否'},
		'ckbh':{name:'ckbh',fieldLabel:'出库编号'},
		'rkbh':{name:'rkbh',fieldLabel:'入库编号'},
		'jhbh':{name:'jhbh',fieldLabel:'申请计划编号'},
		'bm':{name:'bm',fieldLabel:'编码',readOnly:true },
		'pm':{name:'pm',fieldLabel:'品名',readOnly:true},
		'gg':{name:'gg',fieldLabel:'规格',readOnly:true},
		'cz':{name:'cz',fieldLabel:'材质'},
		'dw':{name:'dw',fieldLabel:'计量单位'},
		'sqsl':{name:'sqsl',fieldLabel:'申请数量'},
		'sl':{name:'sl',fieldLabel:'实际领用数量'},
		'jhdj':{name:'jhdj',fieldLabel:'计划单价'},
		'jhdj_sl':{name:'jhdj_sl',fieldLabel:'总金额'},
		'jhzj':{name:'jhzj',fieldLabel:'计划总价'},
		'ckh':{name:'ckh',fieldLabel:'仓库号'},
		'billState':{name:'billState',fieldLabel:'审批状态'},
		'zdrq':{name:'zdrq',fieldLabel:'制单日期',format: 'Y-m-d'},
		'qrrq':{name:'qrrq',fieldLabel:'确认日期',format: 'Y-m-d'},
		'lyr':{name:'lyr',fieldLabel:'领用人'},
		'sqbm':{name:'sqbm',fieldLabel:'申请部门'},
		'tyfs':{name:'tyfs',fieldLabel:'提运方式'},
		'glfl':{name:'glfl',fieldLabel:'管理费率'},
		'glf':{name:'glf',fieldLabel:'管理费'},
		'stage':{name:'stage',fieldLabel:'期别'},
		'projectId':{name:'projectId',fieldLabel:'工程项目'},
		'khh':{name:'khh',fieldLabel:'开户行'},
		'zh':{name:'zh',fieldLabel:'账号'},
		'address':{name:'address',fieldLabel:'地址'},
		'dbyj':{name:'dbyj',fieldLabel:'调拨依据'},
		'dh':{name:'dh',fieldLabel:'电话'},
		'jsje':{name:'jsje',fieldLabel:'确认出库时的库存金额'},
		'stocks':{name:'stocks',fieldLabel:'确认出库时的库存数量'},
		'projectLb':{name:'projectLb',fieldLabel:'项目类别'},
		'hth':{name:'hth',fieldLabel:'合同号'},
		'sjdj':{name:'sjdj',fieldLabel:'实际单价'},
		'sjzj':{name:'sjzj',fieldLabel:'实际总价'},
		'wonum':{name:'wonum',fieldLabel:'工单编号'},
		'bgdid':{name:'bgdid',fieldLabel:'概算编号'}
	}
	
	var Columns_output = [
		{name:'uids',type:'string'},    {name:'billname',type:'string'},    {name:'bh',type:'string'},
		{name:'rq',type:'date',dateFormat:'Y-m-d H:i:s'},	             	
		{name:'bz',type:'string'}, 	   
		{name:'jjr',type:'string'},     {name:'bmzg',type:'string'},      	{name:'bgr',type:'string'}, 
		{name:'wzzg',type:'string'},    {name:'jhr',type:'string'},      	{name:'tl',type:'string'}, 
		{name:'ckbh',type:'string'},    {name:'rkbh',type:'string'},      	{name:'jhbh',type:'string'}, 
		{name:'bm',type:'string'},      {name:'pm',type:'string'},      	{name:'gg',type:'string'}, 
		{name:'cz',type:'string'},      {name:'dw',type:'string'},     		{name:'sqsl',type:'float'}, 
		{name:'sl',type:'float'},    	{name:'jhdj',type:'float'},         {name:'jhzj',type:'float'}, 
		{name:'ckh',type:'string'},     {name:'billState',type:'string'},   {name:'zdrq',type:'date',dateFormat:'Y-m-d H:i:s'},	 
		{name:'qrrq',type:'date',dateFormat:'Y-m-d H:i:s'},	   {name:'lyr',type:'string'},     	
		{name:'sqbm',type:'string'}, 
		{name:'tyfs',type:'string'},    {name:'glfl',type:'float'},         {name:'glf',type:'float'}, 
		{name:'stage',type:'string'},   {name:'projectId',type:'string'},   {name:'khh',type:'string'}, 
		{name:'zh',type:'string'},      {name:'address',type:'string'},     {name:'dbyj',type:'string'}, 
		{name:'dh',type:'string'},      {name:'jsje',type:'float'},         {name:'stocks',type:'float'}, 
		{name:'projectLb',type:'string'},{name:'hth',type:'string'},        {name:'sjdj',type:'float'}, 
		{name:'sjzj',type:'float'},      {name:'wonum',type:'string'},      {name:'bgdid',type:'string'} 
	]	
	
	var Plant_output = Ext.data.Record.create(Columns_output);

	PlantInt = {
		uids:'',billState:'N',bh:'',zdrq:new Date(),sqbm:USERDEPTID,lyr:USERID,bm:'',jhbh:'计划外',
		 sqsl:'',pm:'', gg:'',dw:'',billname:'领料出库单',sl:'',jhdj:'',qrrq:'',
		 
		 bz:'',jjr:'',bmzg:'', bgr:'', wzzg:'', jhr:'',tl:'',ckbh:'',
		 rkbh:'',cz:'',jhzj:'',ckh:'', rq:'',  tyfs:'',glfl:'',glf:'',stage:'',projectId:'',
		 khh:'',zh:'',address:'',dbyj:'',dh:'',jsje:'',stocks:'',
		 projectLb:'', hth:'',sjdj:'',sjzj:'',wonum:'',bgdid:''
	}
	var sm_output=  new Ext.grid.CheckboxSelectionModel();

	var cm_output = new Ext.grid.ColumnModel([
		sm_output,
		{   id:'uids',      header:fc['uids'].fieldLabel,        dataIndex:fc['uids'].name,          hidden: true},
		{	id:'billState', header:fc['billState'].fieldLabel,   dataIndex:fc['billState'].name ,
			renderer:function(value){
				if("N"==value){return"审批中"}else if("Y"==value){return "已处理"}
			} },
		{	id:'bh',   		header:fc['bh'].fieldLabel,      	dataIndex:fc['bh'].name,
			renderer:function(value){
				return value;
				//return "<u style='cursor:hand'  onclick=openCell()>"+value+"</u>";
			},
			editor:new Ext.form.TextField(fc['bh'])
		},
		{	id:'zdrq',   	header:fc['zdrq'].fieldLabel,      	dataIndex:fc['zdrq'].name,renderer: formatDate },
		{	id:'sqbm',   	header:fc['sqbm'].fieldLabel,      	dataIndex:fc['sqbm'].name,
			renderer:function(value){
				for(var i = 0;i<bmbzArr.length;i++){
					if(value == bmbzArr[i][0]){
						return bmbzArr[i][1]
					}
				}
			}},
		{	id:'lyr',   	header:fc['lyr'].fieldLabel,      	dataIndex:fc['lyr'].name,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{	id:'bm',   		header:fc['bm'].fieldLabel,      	dataIndex:fc['bm'].name,readOnly:true,editor:new Ext.form.TextField(fc['pm']),
			width:200,renderer:function (value){
				return value + "&nbsp;&nbsp;&nbsp;<u class=btn1_mouseout onclick=addWZ()> <font color ='green'> (选择)</font></u>"
			}
		},
		{	id:'pm',   		header:fc['pm'].fieldLabel,      	dataIndex:fc['pm'].name,readOnly:true,editor:new Ext.form.TextField(fc['pm']) },
		{	id:'gg',   		header:fc['gg'].fieldLabel,      	dataIndex:fc['gg'].name,readOnly:true,editor:new Ext.form.TextField(fc['gg'])},
		{	id:'dw',   		header:fc['dw'].fieldLabel,      	dataIndex:fc['dw'].name,readOnly:true,editor:new Ext.form.TextField(fc['dw'])},
		{	id:'sqsl',   	header:fc['sqsl'].fieldLabel,      	dataIndex:fc['sqsl'].name,editor:new Ext.form.TextField(fc['sqsl'])},
		{	id:'billname',  header:fc['billname'].fieldLabel,    dataIndex:fc['billname'].name,hidden: true  },
		{	id:'sl',   		header:fc['sl'].fieldLabel,      	dataIndex:fc['sl'].name,hidden: true},
		{	id:'jhbh',   	header:fc['jhbh'].fieldLabel,      	dataIndex:fc['jhbh'].name,hidden: true},
		{	id:'jhdj',   	header:fc['jhdj'].fieldLabel,      	dataIndex:fc['jhdj'].name},
		{	id:'jhdj_sl',   	header:fc['jhdj_sl'].fieldLabel,      	dataIndex:fc['jhdj_sl'].name,
			renderer:function(value,cellmeta,record){
				return record.data.sqsl*record.data.jhdj
			}
		},
		{	id:'qrrq',   	header:fc['qrrq'].fieldLabel,      	dataIndex:fc['qrrq'].name,  renderer: formatDate,hidden: true  },
		
		
		
		
	   {	id:'bz',   	header:fc['bz'].fieldLabel,      	dataIndex:fc['bz'].name,hidden: true},
	   {	id:'jjr',   	header:fc['jjr'].fieldLabel,      	dataIndex:fc['jjr'].name,hidden: true},
	   {	id:'bmzg',   	header:fc['bmzg'].fieldLabel,      	dataIndex:fc['bmzg'].name,hidden: true},
	   {	id:'bgr',   	header:fc['bgr'].fieldLabel,      	dataIndex:fc['bgr'].name,hidden: true},
	   {	id:'wzzg',   	header:fc['wzzg'].fieldLabel,      	dataIndex:fc['wzzg'].name,hidden: true},
	   {	id:'jhr',   	header:fc['jhr'].fieldLabel,      	dataIndex:fc['jhr'].name,hidden: true},
	   {	id:'tl',   	header:fc['tl'].fieldLabel,      	dataIndex:fc['tl'].name,hidden: true},
	   {	id:'ckbh',   	header:fc['ckbh'].fieldLabel,      	dataIndex:fc['ckbh'].name,hidden: true},
	   {	id:'rkbh',   	header:fc['rkbh'].fieldLabel,      	dataIndex:fc['rkbh'].name,hidden: true},
	   {	id:'cz',   	header:fc['cz'].fieldLabel,      	dataIndex:fc['cz'].name,hidden: true},
	   {	id:'jhzj',   	header:fc['jhzj'].fieldLabel,      	dataIndex:fc['jhzj'].name,hidden: true},
	   {	id:'ckh',   	header:fc['ckh'].fieldLabel,      	dataIndex:fc['ckh'].name,hidden: true},
	   {	id:'rq',   	header:fc['rq'].fieldLabel,      	dataIndex:fc['rq'].name,hidden: true},
	   {	id:'tyfs',   	header:fc['tyfs'].fieldLabel,      	dataIndex:fc['tyfs'].name,hidden: true},
	   {	id:'glfl',   	header:fc['glfl'].fieldLabel,      	dataIndex:fc['glfl'].name,hidden: true},
	   {	id:'glf',   	header:fc['glf'].fieldLabel,      	dataIndex:fc['glf'].name,hidden: true},
	   {	id:'stage',   	header:fc['stage'].fieldLabel,      	dataIndex:fc['stage'].name,hidden: true},
	   {	id:'projectId',   	header:fc['projectId'].fieldLabel,      	dataIndex:fc['projectId'].name,hidden: true},
	   {	id:'khh',   	header:fc['khh'].fieldLabel,      	dataIndex:fc['khh'].name,hidden: true},
	   {	id:'zh',   	header:fc['zh'].fieldLabel,      	dataIndex:fc['zh'].name,hidden: true},
	   {	id:'address',   	header:fc['address'].fieldLabel,      	dataIndex:fc['address'].name,hidden: true},
	   {	id:'dbyj',   	header:fc['dbyj'].fieldLabel,      	dataIndex:fc['dbyj'].name,hidden: true},
	   {	id:'dh',   	header:fc['dh'].fieldLabel,      	dataIndex:fc['dh'].name,hidden: true},
	   {	id:'jsje',   	header:fc['jsje'].fieldLabel,      	dataIndex:fc['jsje'].name,hidden: true},
	   {	id:'stocks',   	header:fc['stocks'].fieldLabel,      	dataIndex:fc['stocks'].name,hidden: true},
	   {	id:'projectLb',   	header:fc['projectLb'].fieldLabel,      	dataIndex:fc['projectLb'].name,hidden: true},
	   {	id:'hth',   	header:fc['hth'].fieldLabel,      	dataIndex:fc['hth'].name,hidden: true},
	   {	id:'sjdj',   	header:fc['sjdj'].fieldLabel,      	dataIndex:fc['sjdj'].name,hidden: true},
	   {	id:'sjzj',   	header:fc['sjzj'].fieldLabel,      	dataIndex:fc['sjzj'].name,hidden: true},
	   {	id:'wonum',   	header:fc['wonum'].fieldLabel,      	dataIndex:fc['wonum'].name,hidden: true},
	   {	id:'bgdid',   	header:fc['bgdid'].fieldLabel,      	dataIndex:fc['bgdid'].name,hidden: true}
		
		
	]);
	
	cm_output.defaultSortable = true;//可排序
	
    ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_output,
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
            id: primaryKey_output
		},Columns_output),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds.setDefaultSort(orderColumn_output, 'asc');
    
	var addBtn_wz = new Ext.Button({
    	text:'选择物资',
    	iconCls : 'add',
    	handler:addWZ
    })
	gridPanel_output = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm_output,
		sm : sm_output,
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
		tbar : ['<font color=#15428b><B>领料出库单<B></font>','-'],//addBtn_wz,'-'],
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
		plant : Plant_output,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean_output,
		business : business,
		primaryKey : primaryKey_output
	});
    if (isFlwTask == true || isFlwView == true){
		ds.baseParams.params = " bh='"+Flowuids+"' and jhbh='计划外' and  billName='领料出库单' ";
    }else{
		ds.baseParams.params = " jhbh='计划外' and  billName='领料出库单' ";
    }
	ds.load({params:{start:0,limit:PAGE_SIZE}});
    

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel_output]
    });	
    if (isFlwTask == true || isFlwView == true){
		with(gridPanel_output.getTopToolbar().items){
	    	get('del').setVisible(false);
  	  }
    } 
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
    
});

function addWZ(){
	if(gridPanel_output.getSelectionModel().getSelected()){
    	wz_treePanel.root.reload()
		wz_ds.reload();
		selectWin.show(true);
	}else{
		Ext.MessageBox.alert("提示","请选择要修改的行");    	
	}
}

function insertData(){
	if (isFlwTask == true || isFlwView == true){
		PlantInt.bh=Flowuids
	}
	gridPanel_output.defaultInsertHandler()
}
function saveData(){
	gridPanel_output.defaultSaveHandler();
	if (isFlwTask == true || isFlwView == true){
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
	if(gridPanel_output.getSelectionModel().getSelected()){
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
	if(gridPanel_output.getSelectionModel().getSelected()){
		var record = gridPanel_output.getSelectionModel().getSelected();
		var billName = "领料出库单"
		//var grid = document.all.dbnetgrid3
		var idArray = new Array(record.get('bh'))
		//outputCell(grid,CellWeb,billName,idArray)
		//outputCell(CellWeb,billName,idArray)
	}
}
/******************CELL*********************/