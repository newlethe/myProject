/*Ext.onReady(function(){
	var container = new Ext.Panel({
		region: 'center',
		renderTo: document.body,
		border: false,
		tbar: ['<font color=#15428b><B>计划内领用<B></font>'],		
		html: '<iframe name="content1" src="Business/wzgl/wz.storage.storageOutGrid.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	 var  viewport = new Ext.Viewport({
		layout:'border',
		items:[container]
	});	
})*/




var bean = "com.sgepit.pmis.wzgl.hbm.WzCjspb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bh'

var bean_fw = "com.sgepit.pmis.wzgl.hbm.ViewWzCjsxbView"
var primaryKey_fw = 'uids,bh,bm'
var orderColumn_fw = 'bm'

var bean_output = "com.sgepit.pmis.wzgl.hbm.WzOutput"
var primaryKey_output = 'uids,billname'
var orderColumn_output = 'zdrq'

var insertFlag = 0;
var PlantInt_fw, selectedData,ds_ysp,ds_fw,bh_fw;
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
 	
	//-----------------概算（bdgno：bdg_info==bdgname)
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
 	DWREngine.setAsync(true);	
 	
	//-----------------申请计划细表中对应主表编号的申请总金额（wz_cjsxb)
	var cjxbdsArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select  bh,sum (dj*sl) from wz_cjsxb group by bh",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			cjxbdsArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);	
 	
 	
	//----------------------采购需用计划申请信息----------------------------//
	var fm = Ext.form;
	
	var fc = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'申请计划编号',allowBlank: false,anchor:'95%'},
		'bh_zje':{name:'bh_zje',fieldLabel:'申请总金额',allowBlank: false,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'工程项目编号',anchor:'95%'},
		'hth':{name:'hth',fieldLabel:'合同编号',anchor:'95%'},
		'fybh':{name:'fybh',fieldLabel:'预算项目',anchor:'95%'},
		'cwbm':{name:'cwbm',fieldLabel:'费用科目',anchor:'95%'},
		'sqrq':{name:'sqrq',fieldLabel:'申请日期',format: 'Y-m-d',anchor:'95%'},
		'jhlb':{name:'jhlb',fieldLabel:'计划类别(项目大类)',anchor:'95%'},
		'bmmc':{name:'bmmc',fieldLabel:'申请部门',anchor:'95%'},
		'sqr':{name:'sqr',fieldLabel:'申请人',anchor:'95%'},
		'spr':{name:'spr',fieldLabel:'审批人',anchor:'95%'},
		'billState':{name:'billState',fieldLabel:'审批状态',anchor:'95%'},
		'pzrq':{name:'pzrq',fieldLabel:'批准日期',format: 'Y-m-d',anchor:'95%'},
		'phbh':{name:'phbh',fieldLabel:'采购计划编号',anchor:'95%'},
		'xz':{name:'xz',fieldLabel:'是否汇总列入采购计划',anchor:'95%'},
		'userid':{name:'userid',fieldLabel:'用户ID',anchor:'95%'},
		'wonum':{name:'wonum',fieldLabel:'工单',anchor:'95%'},
		'wzlb':{name:'wzlb',fieldLabel:'物资类别',anchor:'95%'},
		'xmbm':{name:'xmbm',fieldLabel:'项目类别(概算编号)',anchor:'95%'},
		'cjyy':{name:'cjyy',fieldLabel:'年度',anchor:'95%'},
		'cjmm':{name:'cjmm',fieldLabel:'月度',anchor:'95%'},
		'stage':{name:'stage',fieldLabel:'期别',anchor:'95%'},
		'bgdid':{name:'bgdid',fieldLabel:'概算编号',anchor:'95%',
			renderer:function(value){
					for(var i = 0;i<bdgArr.length;i++){
						if(value == bdgArr[i][0]){
							return bdgArr[i][1]
						}
					}
				}
		}
	}
	
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'bh',type:'string'},		{name:'pid',type:'string'},
		{name:'hth',type:'string'},  	 {name:'fybh',type:'string'},	{name:'cwbm',type:'string'},
		{name:'sqrq',type:'date',dateFormat:'Y-m-d H:i:s'},       
		{name:'jhlb',type:'string'},{name:'bh_zje',type:'string'},
		{name:'bmmc',type:'string'},     {name:'sqr',type:'string'},	{name:'spr',type:'string'},
		{name:'billState',type:'string'},{name:'pzrq',type:'date',dateFormat:'Y-m-d H:i:s'},	    
		{name:'phbh',type:'string'},
		{name:'xz',type:'string'},		 {name:'userid',type:'string'}, {name:'wonum',type:'string'},
		{name:'wzlb',type:'string'},	 {name:'xmbm',type:'string'},   {name:'cjyy',type:'string'},
		{name:'cjmm',type:'string'},	 {name:'stage',type:'string'},  {name:'bgdid',type:'string'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids:'',  bh:'',    pid:'',   hth:'',    fybh:'',   cwbm:'',
		sqrq:'',   jhlb:'',  bmmc:'',  sqr:'',    spr:'',    billState:'',
		pzrq:'',  phbh:'',  xz:'',    userid:'', wonum:'',  wzlb:'',
		xmbm:'',  cjyy:'',  cjmm:'',  stage:'',  bgdid:'',bh_zje:''
	}

	//----------------------采购需用计划申请信息（已审批）----------------------------//
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids'     ,	  header:fc['uids'].fieldLabel     ,  dataIndex:fc['uids'].name, hidden: true},
		{id:'bh'       , 	  header:fc['bh'].fieldLabel       ,  dataIndex:fc['bh'].name},
		{id:'bmmc'     , 	  header:fc['bmmc'].fieldLabel     ,  dataIndex:fc['bmmc'].name,
			renderer:function(value){
				for(var i = 0;i<bmbzArr.length;i++){
					if(value == bmbzArr[i][0]){
						return bmbzArr[i][1]
					}
				}
			}
		},
		{id:'pid'      , 	  header:fc['pid'].fieldLabel      ,  dataIndex:fc['pid'].name, hidden: true},
		{id:'hth'      , 	  header:fc['hth'].fieldLabel      ,  dataIndex:fc['hth'].name, hidden: true},
		{id:'fybh'     , 	  header:fc['fybh'].fieldLabel     ,  dataIndex:fc['fybh'].name, hidden: true},
		{id:'cwbm'     , 	  header:fc['cwbm'].fieldLabel     ,  dataIndex:fc['cwbm'].name, hidden: true},
		{id:'sqrq'      , 	  header:fc['sqrq'].fieldLabel     ,  dataIndex:fc['sqrq'].name,renderer: formatDate},
		{id:'bh_zje'      ,   header:fc['bh_zje'].fieldLabel   ,  dataIndex:fc['bh_zje'].name,
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				for(var i = 0;i<cjxbdsArr.length;i++){
					if(record.data.bh == cjxbdsArr[i][0]){
						return cjxbdsArr[i][1]
					}
				}
			}
		},
		{id:'jhlb'     ,	  header:fc['jhlb'].fieldLabel     ,  dataIndex:fc['jhlb'].name, hidden: true},
		{id:'sqr'      ,  	  header:fc['sqr'].fieldLabel      ,  dataIndex:fc['sqr'].name,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'spr'      ,      header:fc['spr'].fieldLabel      ,  dataIndex:fc['spr'].name,hidden:true},
		{id:'billState',      header:fc['billState'].fieldLabel,  dataIndex:fc['billState'].name,hidden:true},
		{id:'pzrq'     , 	  header:fc['pzrq'].fieldLabel     ,  dataIndex:fc['pzrq'].name,renderer: formatDate, hidden: true},
		{id:'phbh'     , 	  header:fc['phbh'].fieldLabel     ,  dataIndex:fc['phbh'].name, hidden: true},
		{id:'xz'       ,  	  header:fc['xz'].fieldLabel       ,  dataIndex:fc['xz'].name, hidden: true},
		{id:'userid'   , 	  header:fc['userid'].fieldLabel   ,  dataIndex:fc['userid'].name,hidden:true},
		{id:'wonum'    ,  	  header:fc['wonum'].fieldLabel    ,  dataIndex:fc['wonum'].name, hidden: true},
		{id:'wzlb'     ,  	  header:fc['wzlb'].fieldLabel     ,  dataIndex:fc['wzlb'].name,hidden:true},
		{id:'xmbm'     , 	  header:fc['xmbm'].fieldLabel     ,  dataIndex:fc['xmbm'].name,hidden:true},
		{id:'cjyy'     , 	  header:fc['cjyy'].fieldLabel     ,  dataIndex:fc['cjyy'].name,hidden:true},
		{id:'cjmm'     ,  	  header:fc['cjmm'].fieldLabel     ,  dataIndex:fc['cjmm'].name,hidden:true},
		{id:'stage'    ,  	  header:fc['stage'].fieldLabel    ,  dataIndex:fc['stage'].name,hidden:true},
		{id:'bgdid'    ,   	  header:fc['bgdid'].fieldLabel    ,  dataIndex:fc['bgdid'].name,
			renderer:function(value){
					for(var i = 0;i<bdgArr.length;i++){
						if(value == bdgArr[i][0]){
							return bdgArr[i][1]
						}
					}
				}
		}
	]);
	
	cm.defaultSortable = true;//可排序
	
	var sm_ysp =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm_ysp = new Ext.grid.ColumnModel([
		sm_ysp,
		{id:'uids'     ,	  header:fc['uids'].fieldLabel     ,  dataIndex:fc['uids'].name, hidden: true},
		{id:'bh'       , 	  header:fc['bh'].fieldLabel       ,  dataIndex:fc['bh'].name},
		{id:'bmmc'     , 	  header:fc['bmmc'].fieldLabel     ,  dataIndex:fc['bmmc'].name,
			renderer:function(value){
				for(var i = 0;i<bmbzArr.length;i++){
					if(value == bmbzArr[i][0]){
						return bmbzArr[i][1]
					}
				}
			}
		},
		{id:'pid'      , 	  header:fc['pid'].fieldLabel      ,  dataIndex:fc['pid'].name},
		{id:'hth'      , 	  header:fc['hth'].fieldLabel      ,  dataIndex:fc['hth'].name},
		{id:'fybh'     , 	  header:fc['fybh'].fieldLabel     ,  dataIndex:fc['fybh'].name},
		{id:'cwbm'     , 	  header:fc['cwbm'].fieldLabel     ,  dataIndex:fc['cwbm'].name},
		{id:'sqrq'      , 	  header:fc['sqrq'].fieldLabel     ,  dataIndex:fc['sqrq'].name,renderer: formatDate},
		{id:'bh_zje'      ,   header:fc['bh_zje'].fieldLabel   ,  dataIndex:fc['bh_zje'].name,
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				for(var i = 0;i<cjxbdsArr.length;i++){
					if(record.data.bh == cjxbdsArr[i][0]){
						return cjxbdsArr[i][1]
					}
				}
			}
		},
		{id:'jhlb'     ,	  header:fc['jhlb'].fieldLabel     ,  dataIndex:fc['jhlb'].name, hidden: true},
		{id:'sqr'      ,  	  header:fc['sqr'].fieldLabel      ,  dataIndex:fc['sqr'].name,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'spr'      ,      header:fc['spr'].fieldLabel      ,  dataIndex:fc['spr'].name,hidden:true},
		{id:'billState',      header:fc['billState'].fieldLabel,  dataIndex:fc['billState'].name,hidden:true},
		{id:'pzrq'     , 	  header:fc['pzrq'].fieldLabel     ,  dataIndex:fc['pzrq'].name,renderer: formatDate},
		{id:'phbh'     , 	  header:fc['phbh'].fieldLabel     ,  dataIndex:fc['phbh'].name, hidden: true},
		{id:'xz'       ,  	  header:fc['xz'].fieldLabel       ,  dataIndex:fc['xz'].name, hidden: true},
		{id:'userid'   , 	  header:fc['userid'].fieldLabel   ,  dataIndex:fc['userid'].name,hidden:true},
		{id:'wonum'    ,  	  header:fc['wonum'].fieldLabel    ,  dataIndex:fc['wonum'].name, hidden: true},
		{id:'wzlb'     ,  	  header:fc['wzlb'].fieldLabel     ,  dataIndex:fc['wzlb'].name,hidden:true},
		{id:'xmbm'     , 	  header:fc['xmbm'].fieldLabel     ,  dataIndex:fc['xmbm'].name,hidden:true},
		{id:'cjyy'     , 	  header:fc['cjyy'].fieldLabel     ,  dataIndex:fc['cjyy'].name,hidden:true},
		{id:'cjmm'     ,  	  header:fc['cjmm'].fieldLabel     ,  dataIndex:fc['cjmm'].name,hidden:true},
		{id:'stage'    ,  	  header:fc['stage'].fieldLabel    ,  dataIndex:fc['stage'].name,hidden:true},
		{id:'bgdid'    ,   	  header:fc['bgdid'].fieldLabel    ,  dataIndex:fc['bgdid'].name,
			renderer:function(value){
					for(var i = 0;i<bdgArr.length;i++){
						if(value == bdgArr[i][0]){
							return bdgArr[i][1]
						}
					}
				}
		}
	]);
	
	cm_ysp.defaultSortable = true;//可排序
	
    ds_ysp = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds_ysp.setDefaultSort(orderColumn, 'desc');
	gridPanel_ysp = new Ext.grid.EditorGridTbarPanel({
		name:'ysp_panel',
		region:'center',
		ds : ds_ysp,
		cm : cm_ysp,
		sm : sm_ysp,
		border : false,
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>申请计划信息<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds_ysp,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});

	//bill_state:0新计划，-1审批中，1已审批
	ds_ysp.baseParams.params = "bill_state=1 and bmmc='"+USERDEPTID+"'";
	ds_ysp.load({
		params : {
			start : 0,
			limit : 20
		}
	});
    
    
    //----------------------物资清单----------------------------//
 	var fm_fw = Ext.form;
   		
	var fc_fw = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'工程编号',allowBlank: false,value:'',anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'申请计划编号',allowBlank: false,anchor:'95%'},
		'bm':{name:'bm',fieldLabel:'物资编码',anchor:'95%'},
		'pm':{name:'pm',fieldLabel:'品名',anchor:'95%'},
		'gg':{name:'gg',fieldLabel:'规格',anchor:'95%'},
		'cz':{name:'cz',fieldLabel:'材质',anchor:'95%'},
		'dw':{name:'dw',fieldLabel:'计量单位',anchor:'95%'},
		'xqrq':{name:'xqrq',fieldLabel:'需求日期',format: 'Y-m-d',anchor:'95%'},
		'sqsl':{name:'sqsl',fieldLabel:'申请数量',anchor:'95%'},
		'sl':{name:'sl',fieldLabel:'批准数量',anchor:'95%'},
		'dj':{name:'dj',fieldLabel:'单价',anchor:'95%'},
		'sqsl_dj':{name:'sqsl_dj',fieldLabel:'申请金额',anchor:'95%'},
		'ffsl':{name:'ffsl',fieldLabel:'发放数量',anchor:'95%'},
		'bz':{name:'bz',fieldLabel:'备注',anchor:'95%'},
		'sqje':{name:'sqje',fieldLabel:'申请金额',anchor:'95%'},
		'spje':{name:'spje',fieldLabel:'审批金额',anchor:'95%'},
		'ffje':{name:'ffje',fieldLabel:'发放金额',anchor:'95%'},
		'rate':{name:'rate',fieldLabel:'换算率',anchor:'95%'},
		'hsdw':{name:'hsdw',fieldLabel:'换算单位',anchor:'95%'},
		'jhbh':{name:'jhbh',fieldLabel:'采购计划编号',anchor:'95%'},
		'ftsl':{name:'ftsl',fieldLabel:'分摊数量',anchor:'95%'},
		'stage':{name:'stage',fieldLabel:'期别',anchor:'95%'},
		'isvalid':{name:'isvalid',fieldLabel:'是否有效',anchor:'95%'},
		'pzrq':{name:'pzrq',fieldLabel:'批准时间',format: 'Y-m-d',anchor:'95%'},
		'ztsl':{name:'ztsl',fieldLabel:'在途数量',anchor:'95%'},
		'klsl':{name:'klsl',fieldLabel:'可领数量',anchor:'95%'},
		'klsl_btn':{name:'klsl_btn',fieldLabel:'领料操作',anchor:'95%'}
	}
	
	var Columns_fw = [
		{name:'uids',type:'string'},   {name:'pid',type:'string'},     {name:'bh',type:'string'},
		{name:'bm',type:'string'},	   {name:'pm',type:'string'}, 	   {name:'gg',type:'string'},
		{name:'cz',type:'string'},	   {name:'dw',type:'string'}, 
		{name:'xqrq',type:'date',dateFormat:'Y-m-d H:i:s'},      	   {name:'sqsl',type:'float'},  
		{name:'sl',type:'float'},      {name:'dj',type:'float'},
		{name:'sqsl_dj',type:'float'},
		{name:'ffsl',type:'float'},    {name:'bz',type:'string'},  	   {name:'sqje',type:'float'},
		{name:'spje',type:'float'},    {name:'ffje',type:'float'},     {name:'rate',type:'float'},
		{name:'hsdw',type:'string'},   {name:'jhbh',type:'string'},    {name:'ftsl',type:'float'},
		{name:'stage',type:'string'},  {name:'isvalid',type:'string'}, {name:'pzrq',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'ztsl',type:'string'}, {name:'klsl',type:'string'}
	]	
	
	var Plant_fw = Ext.data.Record.create(Columns_fw);

	PlantInt_fw = {
		uids:'', pid:'',   bh:'',    bm:'',   pm:'',
		gg:'',	 cz:'',    dw:'',    xqrq:'', sqsl:'',
		sl:'',	 dj:'',	   ffsl:'',  bz:'',   sqje:'',
		spje:'', ffje:'',  rate:'',  hsdw:'', jhbh:'',
		ftsl:'', stage:'', isvalid:'',pzrq:'',sqsl_dj:'',ztsl:'',klsl:''
	}
	var sm_fw=  new Ext.grid.CheckboxSelectionModel();

	var cm_fw = new Ext.grid.ColumnModel([
		sm_fw,
		{   id:'uids',       header:fc_fw['uids'].fieldLabel,       dataIndex:fc_fw['uids'].name,     hidden: true},
		{	id:'pid',   	 header:fc_fw['pid'].fieldLabel,        dataIndex:fc_fw['pid'].name,      width:90,     hidden: true    },
		{	id:'bh',   		 header:fc_fw['bh'].fieldLabel,      	dataIndex:fc_fw['bh'].name,       width:90    },
		{	id:'bm',   		 header:fc_fw['bm'].fieldLabel,      	dataIndex:fc_fw['bm'].name,       width:90    },
		{	id:'pm',   	 	 header:fc_fw['pm'].fieldLabel,      	dataIndex:fc_fw['pm'].name,       width:90    },
		{	id:'gg',    	 header:fc_fw['gg'].fieldLabel,      	dataIndex:fc_fw['gg'].name,       width:90    },
		{	id:'cz',    	 header:fc_fw['cz'].fieldLabel,      	dataIndex:fc_fw['cz'].name,       width:90,     hidden: true    },
		{	id:'dw',    	 header:fc_fw['dw'].fieldLabel,      	dataIndex:fc_fw['dw'].name,       width:90    },
		{	id:'xqrq',  	 header:fc_fw['xqrq'].fieldLabel,       dataIndex:fc_fw['xqrq'].name,     width:90,
			renderer:function(value,cell){ return value ? value.dateFormat('Y-m-d') : '';}
		},
		{	id:'sqsl',       header:fc_fw['sqsl'].fieldLabel,       dataIndex:fc_fw['sqsl'].name,     width:90    },
		{	id:'sl',   		 header:fc_fw['sl'].fieldLabel,      	dataIndex:fc_fw['sl'].name,       width:90    },
		{	id:'dj',   		 header:fc_fw['dj'].fieldLabel,      	dataIndex:fc_fw['dj'].name,       width:90    },
		{	id:'sqsl_dj',    header:fc_fw['sqsl_dj'].fieldLabel,    dataIndex:fc_fw['sqsl_dj'].name,  width:90, 
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				return record.data.sqsl*record.data.dj;
			}
		},
		{	id:'ffsl',       header:fc_fw['ffsl'].fieldLabel,       dataIndex:fc_fw['ffsl'].name,     width:90    },
		{	id:'bz',    	 header:fc_fw['bz'].fieldLabel,      	dataIndex:fc_fw['bz'].name,       width:90    ,     hidden: true},
		{	id:'sqje',   	 header:fc_fw['sqje'].fieldLabel,       dataIndex:fc_fw['sqje'].name,     width:90,     hidden: true    },
		{	id:'spje',   	 header:fc_fw['spje'].fieldLabel,       dataIndex:fc_fw['spje'].name,     width:90,     hidden: true    },
		{	id:'ffje',   	 header:fc_fw['ffje'].fieldLabel,       dataIndex:fc_fw['ffje'].name,     width:90,     hidden: true    },
		{	id:'rate',   	 header:fc_fw['rate'].fieldLabel,       dataIndex:fc_fw['rate'].name,     width:90,     hidden: true    },
		{	id:'hsdw',   	 header:fc_fw['hsdw'].fieldLabel,       dataIndex:fc_fw['hsdw'].name,     width:90,     hidden: true    },
		{	id:'jhbh',    	 header:fc_fw['jhbh'].fieldLabel,       dataIndex:fc_fw['jhbh'].name,     width:90,     hidden: true    },
		{	id:'ftsl',    	 header:fc_fw['ftsl'].fieldLabel,       dataIndex:fc_fw['ftsl'].name,     width:90    },
		{	id:'ztsl',   	 header:fc_fw['ztsl'].fieldLabel,   	dataIndex:fc_fw['ztsl'].name,  width:90    },
		{	id:'klsl',    	 header:fc_fw['klsl'].fieldLabel,   	dataIndex:fc_fw['klsl'].name,  width:90    },
		{	id:'klsl_btn',   header:fc_fw['klsl_btn'].fieldLabel,   dataIndex:fc_fw['klsl'].name,  width:90,renderer:showBtn    },
		{	id:'isvalid',    header:fc_fw['isvalid'].fieldLabel,    dataIndex:fc_fw['isvalid'].name,  width:90 ,     hidden: true   },
		{	id:'pzrq',   	 header:fc_fw['pzrq'].fieldLabel,       dataIndex:fc_fw['pzrq'].name,     width:90,renderer: formatDate,     hidden: true    }
		
	]);
	
	function showBtn(value,cellmeta,record,rowIndex,columnIndex,store){
		if(value>0){
			//一料一单
			//return "<button class=btn1_mouseout onclick=getGoods('"+value+"','"+record.data.bh+"','"+record.data.bm+"')> 领料</button>"
			//一料多单
			return "<button class=btn1_mouseout onclick=getGoodsConfirm('"+value+"','"+record.data.bh+"','"+record.data.bm+"',1)> 领料</button>"
		}else{
			return "";
		}
	}
	
	cm_fw.defaultSortable = true;//可排序
	
    ds_fw = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_fw,
			business:business,
			method: listMethod,
			params: " bh='"+bh_fw+"'"
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey_fw
		},Columns_fw),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds_fw.setDefaultSort(orderColumn_fw, 'asc');
	
    
	gridPanel_fw = new Ext.grid.EditorGridTbarPanel({
		ds : ds_fw,
		cm : cm_fw,
		sm : sm_fw,
		border : false,
		title:'物资清单',
		height: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资清单<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds_fw,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_fw,
		plantInt : PlantInt_fw,
		servletUrl : MAIN_SERVLET,
		bean : bean_fw,
		business : business,
		primaryKey : primaryKey_fw
	});
	
 
    //----------------------领料清单wz_output----------------------------//
 	var fm_output = Ext.form;
   		
	var fc_output = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'billname':{name:'billname',fieldLabel:'单据名称',allowBlank: false,value:'',anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'单据编号',allowBlank: false,anchor:'95%'},
		'rq':{name:'rq',fieldLabel:'日期',format: 'Y-m-d',anchor:'95%'},
		'bz':{name:'bz',fieldLabel:'备注',anchor:'95%'},
		'jjr':{name:'jjr',fieldLabel:'经手人',anchor:'95%'},
		'bmzg':{name:'bmzg',fieldLabel:'部门主管',anchor:'95%'},
		'bgr':{name:'bgr',fieldLabel:'保管员',anchor:'95%'},
		'wzzg':{name:'wzzg',fieldLabel:'物资主管',anchor:'95%'},
		'jhr':{name:'jhr',fieldLabel:'计划员',anchor:'95%'},
		'tl':{name:'tl',fieldLabel:'退料否',anchor:'95%'},
		'ckbh':{name:'ckbh',fieldLabel:'出库编号',anchor:'95%'},
		'rkbh':{name:'rkbh',fieldLabel:'入库编号',anchor:'95%'},
		'jhbh':{name:'jhbh',fieldLabel:'申请计划编号',anchor:'95%'},
		'bm':{name:'bm',fieldLabel:'编码',anchor:'95%'},
		'pm':{name:'pm',fieldLabel:'品名',anchor:'95%'},
		'gg':{name:'gg',fieldLabel:'规格',anchor:'95%'},
		'cz':{name:'cz',fieldLabel:'材质',anchor:'95%'},
		'dw':{name:'dw',fieldLabel:'计量单位',anchor:'95%'},
		'sqsl':{name:'sqsl',fieldLabel:'申请数量',anchor:'95%'},
		'sl':{name:'sl',fieldLabel:'实际领用数量',anchor:'95%'},
		'jhdj':{name:'jhdj',fieldLabel:'计划单价',anchor:'95%'},
		'jhzj':{name:'jhzj',fieldLabel:'计划总价',anchor:'95%'},
		'ckh':{name:'ckh',fieldLabel:'仓库号',anchor:'95%'},
		'billState':{name:'billState',fieldLabel:'审批状态',anchor:'95%'},
		'zdrq':{name:'zdrq',fieldLabel:'制单日期',format: 'Y-m-d',anchor:'95%'},
		'qrrq':{name:'qrrq',fieldLabel:'确认日期',format: 'Y-m-d',anchor:'95%'},
		'lyr':{name:'lyr',fieldLabel:'领用人',anchor:'95%'},
		'sqbm':{name:'sqbm',fieldLabel:'申请部门',anchor:'95%'},
		'tyfs':{name:'tyfs',fieldLabel:'提运方式',anchor:'95%'},
		'glfl':{name:'glfl',fieldLabel:'管理费率',anchor:'95%'},
		'glf':{name:'glf',fieldLabel:'管理费',anchor:'95%'},
		'stage':{name:'stage',fieldLabel:'期别',anchor:'95%'},
		'projectId':{name:'projectId',fieldLabel:'工程项目',anchor:'95%'},
		'khh':{name:'khh',fieldLabel:'开户行',anchor:'95%'},
		'zh':{name:'zh',fieldLabel:'账号',anchor:'95%'},
		'address':{name:'address',fieldLabel:'地址',anchor:'95%'},
		'dbyj':{name:'dbyj',fieldLabel:'调拨依据',anchor:'95%'},
		'dh':{name:'dh',fieldLabel:'电话',anchor:'95%'},
		'jsje':{name:'jsje',fieldLabel:'确认出库时的库存金额',anchor:'95%'},
		'stocks':{name:'stocks',fieldLabel:'确认出库时的库存数量',anchor:'95%'},
		'projectLb':{name:'projectLb',fieldLabel:'项目类别',anchor:'95%'},
		'hth':{name:'hth',fieldLabel:'合同号',anchor:'95%'},
		'sjdj':{name:'sjdj',fieldLabel:'实际单价',anchor:'95%'},
		'sjzj':{name:'sjzj',fieldLabel:'实际总价',anchor:'95%'},
		'wonum':{name:'wonum',fieldLabel:'工单编号',anchor:'95%'},
		'bgdid':{name:'bgdid',fieldLabel:'概算编号',anchor:'95%'},
		'klsl_btn':{name:'klsl_btn',fieldLabel:'领料操作',anchor:'95%'}
	}
	
	var Columns_output = [
		{name:'uids',type:'string'},    {name:'billname',type:'string'},    {name:'bh',type:'string'},
		{name:'rq',type:'date',dateFormat:'Y-m-d H:i:s'},	             	{name:'bz',type:'string'}, 	   
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

	PlantInt_output = {
		uids:'',billname:'',bh:'',rq:'',bz:'',
		jjr:'',bmzg:'',bgr:'',wzzg:'',jhr:'',
		tl:'',ckbh:'',rkbh:'',jhbh:'',bm:'',
		pm:'',gg:'',cz:'',dw:'',
		sqsl:'',sl:'',hdj:'',hzj:'',
		ckh:'',billState:'',zdrq:'',
		qrrq:'',lyr:'',sqbm:'',tyfs:'',
		glfl:'',glf:'',stage:'',projectId:'',
		khh:'',zh:'',address:'',
		dbyj:'',dh:'',sje:'',tocks:'',
		projectLb:'',hth:'',jdj:'',jzj:'',
		wonum:'',bgdid:''
	}
	var sm_output=  new Ext.grid.CheckboxSelectionModel();

	var cm_output = new Ext.grid.ColumnModel([
		sm_output,
		{   id:'uids',      header:fc_output['uids'].fieldLabel,        dataIndex:fc_output['uids'].name,          hidden: true},
		{	id:'billState', header:fc_output['billState'].fieldLabel,   dataIndex:fc_output['billState'].name ,
			renderer:function(value){
				if("N"==value){return"未领用"}else if("Y"==value){return "已领用"}else if("1"==value){return "已处理"}
			} },
		{	id:'bh',   		header:fc_output['bh'].fieldLabel,      	dataIndex:fc_output['bh'].name,
			renderer:function(value){
				//return "<u style='cursor:hand'  onclick=openCell()>"+value+"</u>";
				return value;
			}
		},
		{	id:'zdrq',   	header:fc_output['zdrq'].fieldLabel,      	dataIndex:fc_output['zdrq'].name,renderer: formatDate },
		{	id:'sqbm',   	header:fc_output['sqbm'].fieldLabel,      	dataIndex:fc_output['sqbm'].name,
			renderer:function(value){
				for(var i = 0;i<bmbzArr.length;i++){
					if(value == bmbzArr[i][0]){
						return bmbzArr[i][1]
					}
				}
			}},
		{	id:'lyr',   	header:fc_output['lyr'].fieldLabel,      	dataIndex:fc_output['lyr'].name,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{	id:'bm',   		header:fc_output['bm'].fieldLabel,      	dataIndex:fc_output['bm'].name },
		{	id:'pm',   		header:fc_output['pm'].fieldLabel,      	dataIndex:fc_output['pm'].name },
		{	id:'gg',   		header:fc_output['gg'].fieldLabel,      	dataIndex:fc_output['gg'].name },
		{	id:'dw',   		header:fc_output['dw'].fieldLabel,      	dataIndex:fc_output['dw'].name},
		{	id:'sqsl',   	header:fc_output['sqsl'].fieldLabel,      	dataIndex:fc_output['sqsl'].name},
		{	id:'billname',  header:fc_output['billname'].fieldLabel,    dataIndex:fc_output['billname'].name,hidden: true  },
		{	id:'sl',   		header:fc_output['sl'].fieldLabel,      	dataIndex:fc_output['sl'].name,hidden: true},
		{	id:'jhdj',   	header:fc_output['jhdj'].fieldLabel,      	dataIndex:fc_output['jhdj'].name,hidden: true},
		{	id:'qrrq',   	header:fc_output['qrrq'].fieldLabel,      	dataIndex:fc_output['qrrq'].name,  renderer: formatDate,hidden: true  },
		{	id:'klsl_btn',   header:fc_fw['klsl_btn'].fieldLabel,       dataIndex:fc_fw['sqsl'].name,  width:90,renderer:showBtn_output    }
	]);
	
	function showBtn_output(value,cellmeta,record,rowIndex,columnIndex,store){
		return "<button class=btn1_mouseout onclick=deleteGoods('"+value+"','"+record.data.jhbh+"','"+record.data.bm+"')>取消领料 </button>"
	}
	
	cm_output.defaultSortable = true;//可排序
	
    ds_output = new Ext.data.Store({
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
	ds_output.setDefaultSort(orderColumn_output, 'asc');
    
	gridPanel_output = new Ext.grid.EditorGridTbarPanel({
		ds : ds_output,
		cm : cm_output,
		sm : sm_output,
		border : false,
		title:'领料清单',
		height: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>领料清单<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds_output,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_output,
		plantInt : PlantInt_output,
		servletUrl : MAIN_SERVLET,
		bean : bean_output,
		business : business,
		primaryKey : primaryKey_output
	});
    var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 255,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[gridPanel_fw,gridPanel_output]
    });	
    
	
	//----------------------------------关联----------------------------------
    
	sm_ysp.on('rowselect',function(sm,rowIndex,record){
	    bh_fw = record.get('bh');
		ds_fw.baseParams.params = " bh='"+bh_fw+"'";
		ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
		selectedData = record.get('bh');
		PlantInt_fw.bh = record.get('bh');
		if(flwbh!=""){
			//ds_output.baseParams.params = "bh='"+flwbh+"' and jhbh='"+bh_fw+"' and  billName='领料出库单' and bill_state<>'-1' and bill_state<>'1'";
			ds_output.baseParams.params = "jhbh='"+flwbh+"' and  billName='领料出库单' and bill_state<>'-1' and bill_state<>'1'";
			ds_output.load({params:{start:0,limit:PAGE_SIZE}});
		}else{
			ds_output.baseParams.params = "jhbh='"+bh_fw+"' and  billName='领料出库单' and bill_state<>'-1' and bill_state<>'1'";
			ds_output.load({params:{start:0,limit:PAGE_SIZE}});
		}
	})
	
	sm_fw.on('rowselect',function(sm,rowIndex,record){
	    bm_wz = record.get('bm');
		//ds_output.baseParams.params = " jhbh='"+bh_fw+"' and bm='"+bm_wz+"' and billName='领料出库单' and bill_state<>'-1' and bill_state<>'1'";
		//ds_output.load({params:{start:0,limit:PAGE_SIZE}});
	})
	

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel_ysp,tabs]
    });	
     
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
});

//一料一单
function getGoods(value,bh,bm){
	var flag=false; var delbh="";delbm="";
	for(var i=0;i<ds_fw.getTotalCount();i++){
		if(ds_fw.getAt(i).data.klsl==0){
			flag=true
			delbh = ds_fw.getAt(i).data.bh;
			delbm=ds_fw.getAt(i).data.bm;
		}
	}
	if(flag){
		Ext.MessageBox.confirm('提示','确认领用？',function(btn){
			if(btn=='yes'){
				storageMgmImpl.deleteGoods(delbh,delbm,function(dat){
					if(dat){getGoodsConfirm(value,bh,bm,0)}
				});
			}else{return}
		})
	}else{
		getGoodsConfirm(value,bh,bm,1)
	}
}

function deleteGoods(value,bh,bm){
	Ext.MessageBox.confirm('提示','确认取消领料？',function(btn){
			if(btn=='yes'){
				storageMgmImpl.deleteGoods(bh,bm,function(dat){
					if(dat){
						Ext.example.msg('提示！', '取消领料成功！');
			
						ds_fw.baseParams.params = " bh='"+bh_fw+"'";
						ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
						
						ds_output.baseParams.params = " jhbh='"+bh_fw+"' and bm='"+bm_wz+"' and billName='领料出库单' ";
						ds_output.load({params:{start:0,limit:PAGE_SIZE}});
					}
				});
			}else{return}
		})
}

function getGoodsConfirm(value,bh,bm,flag){
		storageMgmImpl.getGoods(bh,bm,value,USERID,USERNAME,flwbh,function(dat){
		if(dat){
			Ext.example.msg('提示！', '领取成功！');
			
			ds_fw.baseParams.params = " bh='"+bh_fw+"'";
			ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
			
			ds_output.baseParams.params = " jhbh='"+bh_fw+"' and bm='"+bm_wz+"' and billName='领料出库单' ";
			ds_output.load({params:{start:0,limit:PAGE_SIZE}});
			
			
			ds_ysp.baseParams.params = " bh='"+bh_fw+"'";
			ds_ysp.load({params:{start:0,limit:PAGE_SIZE}});
			
			Ext.MessageBox.confirm('提示','领料成功,是否继续领料？',function(btn){
				if(btn=='yes'){
					return;
				}else{
					if(isFlwTask){
						Ext.Msg.show({
						   title: '保存成功！',
						   msg: '领料成功！　　　<br>可以发送流程到下一步操作！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			storageMgmImpl.updateBillState(flwbh);
						   			parent.IS_FINISHED_TASK = true;
									parent.mainTabPanel.setActiveTab('common');
						   		}
						   }
						});
					
					}				
				}
			})
		}else{
			Ext.example.msg('提示！', '领取失败！');
		}
	});
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