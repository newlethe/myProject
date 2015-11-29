
var bean = "com.sgepit.pmis.reimburse.hbm.DeptReimburse"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'reDate'



var gridPanel;
var filterStr=" bill_state<>'0' "
Ext.onReady(function(){
	//var jhztArr = [['0','新增'],['1','上报'],['2','汇总'],['3','审批中'],['4','审批完成'],['5','下达']];
	var jhztArr = [['0','新增'],['1','上报'],['2','汇总'],['4','审批完成'],['5','下达']];
	var billStateArr = [['1','已完成'],['-1','处理中'],['2','退回']];
	//--用户userid:realname
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getuserSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:userArray
 	})
 	
 
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
    
    var deptStore = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:bmbzArr
 	})
    var jhStore = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:jhztArr
 	})
    var billStore = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:billStateArr
 	})
 	
	var fm = Ext.form;
	
	var fc = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'title':{name:'title',fieldLabel:'标题',anchor:'95%'},
		'reUser' : {
			name : 'reUser',
			fieldLabel : '报销人',
			valueField:'k',
			displayField: 'v', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: getuserSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            allowBlank: false,
			anchor : '95%'
		},
		'reDept' : {
			name : 'reDept',
			fieldLabel : '报销部门',
			valueField:'k',
			displayField: 'v', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: deptStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            allowBlank: false,
			anchor : '95%'
		},
		'reZje':{name:'reZje',fieldLabel:'报销总金额',anchor:'95%'},
		'jhje':{name:'jhje',fieldLabel:'计划金额',anchor:'95%'},
		'relj':{name:'relj',fieldLabel:'报销累计金额',anchor:'95%'},
		'reDate':{name:'reDate',fieldLabel:'报销时间',format: 'Y-m-d',anchor:'95%'},
		'reStyle':{name:'reStyle',fieldLabel:'报销类型',anchor:'95%'},
		'jhcontent':{name:'jhcontent',fieldLabel:'计划内容',allowBlank: false,anchor:'95%'},
		'jhuid':{name:'jhuid',fieldLabel:'计划主键',anchor:'95%'},
		'memo':{name:'memo',fieldLabel:'编号',anchor:'95%'},
		'memo1':{name:'memo1',fieldLabel:'明细附件',anchor:'95%'},
		'billState':{name:'billState',fieldLabel:'流程状态',anchor:'95%'},
		'djState':{name:'djState',fieldLabel:'单据状态',anchor:'95%'}
	}
	
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'title',type:'string'},		{name:'reUser',type:'string'},
		{name:'reDept',type:'string'}, 	 {name:'memo1',type:'string'},
		{name:'reZje',type:'float'},     {name:'jhje',type:'float'},        {name:'relj',type:'float'},
		{name:'reDate',type:'date',dateFormat:'Y-m-d H:i:s'},       
		{name:'reStyle',type:'string'},   {name:'jhcontent',type:'string'},
		{name:'jhuid',type:'string'},	  {name:'memo',type:'string'},
		{name:'billState',type:'string'}, {name:'djState',type:'string'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids:'',  title:'',  reUser:USERID,  reDept:USERDEPTID,   reZje:0,jhje:0,    relj:0,   reDate:new Date(),
		reStyle:'0',   jhcontent:'',  jhuid:'',memo:'',memo1:'',billState:'0',djState:'0'
	}

	var sm =  new Ext.grid.CheckboxSelectionModel();

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids'     ,	  header:fc['uids'].fieldLabel     ,  dataIndex:fc['uids'].name, hidden: true},
		{id:'title'       , 	  header:fc['title'].fieldLabel       ,  dataIndex:fc['title'].name,type:'string'},
		{id:'reUser'      ,  	  header:fc['reUser'].fieldLabel      ,  dataIndex:fc['reUser'].name,store: getuserSt,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			},type: 'combo'
		},
		{id:'reDept'      ,  	  header:fc['reDept'].fieldLabel      ,  dataIndex:fc['reDept'].name,store:deptStore,
			renderer:function(value){
				for(var i = 0;i<bmbzArr.length;i++){
					if(value == bmbzArr[i][0]){
						return bmbzArr[i][1]
					}
				}
			},type: 'combo'
		},
		{id:'reZje'       , 	  header:fc['reZje'].fieldLabel       ,  dataIndex:fc['reZje'].name },
		{id:'jhje'     , 	  header:fc['jhje'].fieldLabel     ,  dataIndex:fc['jhje'].name },
		{id:'relj'      , 	  header:fc['relj'].fieldLabel     ,  dataIndex:fc['relj'].name },
		{id:'reDate'      , 	  header:fc['reDate'].fieldLabel     ,  dataIndex:fc['reDate'].name,renderer: formatDate},
		{id:'reStyle'       ,  	  header:fc['reStyle'].fieldLabel       ,  dataIndex:fc['reStyle'].name,hidden:true},
		{id:'jhcontent'   , 	  header:fc['jhcontent'].fieldLabel   ,  dataIndex:fc['jhcontent'].name},
		{id:'jhuid'   , 	  header:fc['jhuid'].fieldLabel   ,  dataIndex:fc['jhuid'].name,hidden:true},
		{id:'memo'   , 	  header:fc['memo'].fieldLabel   ,  dataIndex:fc['memo'].name},
		{id:'memo1'   , 	  header:fc['memo1'].fieldLabel   ,  dataIndex:fc['memo1'].name,renderer:function(value,cellmeta,record){
			return "<u style='cursor:hand' onclick=showFileWin('bussiness_deptreimburse','"+record.data.memo+"',false,'','')><font color=green>明细附件</font></u>";
		}},
		//'bussiness_deptreimburse',"+record.data.uids+",true,'',new Date()
		{id:'billState'   , 	  header:fc['billState'].fieldLabel   ,  dataIndex:fc['billState'].name,store:billStore,renderer:function(value){
			for(var i = 0;i<billStateArr.length;i++){
				if(value == billStateArr[i][0]){
					return billStateArr[i][1]
					}
				}
			},type:'combo'
		},
		{id:'djState'   , 	  header:fc['djState'].fieldLabel   ,  dataIndex:fc['djState'].name,hidden:true}
	]);
	
	cm.defaultSortable = true;//可排序
	
	var ds = new Ext.data.Store({
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
	ds.setDefaultSort(orderColumn, 'desc');
	
    var QuerBtn = new Ext.Button({
    	text:'查询',
    	iconCls:'btn',
    	handler:showWindow
    })
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		name:'fybx',
		title:'费用报销',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>部门费用报销<B></font>','-',QuerBtn],
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
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});

	//bill_state:0新计划，-1审批中，1已审批
	ds.baseParams.params = "reUser='"+USERID+"'";
	
	ds.load({
		params : {
			start : 0,
			limit : 20
		}
	});
    
    var viewport = new Ext.Viewport({
        layout:'border',
       // items:[gridPanel]
        items:[gridPanel]
    });	
     
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
});