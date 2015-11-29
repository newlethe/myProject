var showWin;//新增预警规则窗口
var disPerWin;//分配预警管理员窗口
var selectUids;
var showPersonWin ; // 新增责任人窗口
var moduleArray = new Array();// 模块名称
var personArrar = new Array();//人员列表
var unitArr = new Array();//项目单位列表
var addPersonFormPanel;
var nodeId;//节点ID
var str; //查询条件
Ext.onReady(function(){

//获取模块名称列表
     DWREngine.setAsync(false);
     baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.RockPower",
	     "parentid='01' and leaf=0",
		  function(list){
			  for(var i=0;i<list.length;i++){
			      var temp = new Array();
			      temp.push(list[i].powerpk);
			      temp.push(list[i].powername);
			      moduleArray.push(temp);
			  }
		 }
	 );
	 DWREngine.setAsync(true);
	 //获取人员信息
     DWREngine.setAsync(false);
     baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.RockUser",
	     "1=1",
		  function(list){
			  for(var i=0;i<list.length;i++){
			      var temp = new Array();
			      temp.push(list[i].userid);
			      temp.push(list[i].realname);
			      personArrar.push(temp);
			  }
		 }
	 );
	 DWREngine.setAsync(true);
	 
	 	 
    var moduleStore = new Ext.data.SimpleStore({
        fields : ['moduleid','modulename'],
        data : moduleArray
    })
    var mstore = new Ext.data.SimpleStore({
         fields : ['moduleid','modulename']
    })
    var personStore = new Ext.data.SimpleStore({
        fields : ['userid','realname'],
        data : personArrar
    })
    var unitStore = new Ext.data.SimpleStore({
        id : 0,
        fields : ['userid','unitname','unitid','unit_type_id']
    })
    var unitStr ="select r.userid,s.unitid, s.unitname, s.unit_type_id ";
        unitStr+= " from rock_user r ";
        unitStr+=" left join sgcc_ini_unit s ";
        unitStr+=" on r.unitid = s.unitid ";
        unitStr+=" where s.unit_type_id in ('0', '1', '2', '3', '4', '5', 'A')";
     db2Json.selectSimpleData(unitStr,
    function(dat){
        unitStore.loadData(eval(dat));
    })
    
    var projectStore = new Ext.data.SimpleStore({
        id : 0,
        fields : ['unitid','unitname']
    })
    
    db2Json.selectSimpleData("select s.unitid,s.unitname from sgcc_ini_unit s where s.unit_type_id='A'",
    function(dat){
        projectStore.loadData(eval(dat));
    })    
    
    var root = new Ext.tree.AsyncTreeNode({
        text : '模块名称',
        id : '模块名称',
        expanded : true
    })
    var treeloader = new Ext.tree.TreeLoader({
        dataUrl :MAIN_SERVLET,
        requestMethod : 'GET',
        baseParams :{
            ac :'tree',
            parent : '01',
            treeName : 'ModuleTree',
            businessName: 'PcWarnService',
            leaf:'0'
        }
    })
    var treePanel = new Ext.tree.TreePanel({
        region : 'west',
        id : 'treePanel',
        frame : false,
        Height : true,
        width : 150,
        minSize : 200,
        maxSize : 500,
        margins : '5 0 5 5',
        cmargins : '0 0 0 0',
        rootVisible :true,
        line :false,
        autoScroll : true,
        collapsible : true,
        animCollapse : true,
        animate : false,
        collapseMode : 'mini',
        loader : treeloader,
        root : root,
        listeners :{
            click : function(n,e){
            	nodeId =n.id;
            	mstore.removeAll();
            	DWREngine.setAsync(false);
                PcWarnService.getModuleNameByother(nodeId,
		             function(list){
		                 var Rec = new Ext.data.Record.create([
               	                   {name : 'moduleid',type : 'string'},
               	                   {name : 'modulename',type : 'string'}
               	                 ]);
			             for(var i=0;i<list.length;i++){
			              	 mstore.add(new Rec({moduleid:list[i].powerpk,modulename:list[i].powername}));
			                   }
		                    }
	                      );
	                   DWREngine.setAsync(true);
	                   str ='';
	                   for(var i = 0;i<mstore.getCount();i++){
	                       var rec = mstore.getAt(i);
	                       str+="'"+rec.get('moduleid')+"'"
	                       if(i<mstore.getCount()-1){
	                          str+=" , "
	                       }
	                   }
                if(n.id!=''){
                    if('模块名称'==n.id){
                    store.baseParams.params=" 1=1 ";
                    }else {
                    store.baseParams.params=" moduleid in("+str+")";
                    }
                    northReload();
                }
            }
        }
    })
    
    var store = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
            url :MAIN_SERVLET,
            method : 'GET'
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty: 'totalCount',
            id : 'uids'
        },[
            {name : 'uids',type : 'string'},
            {name : 'pid', type : 'string'},
            {name : 'warnrulename', type : 'string'},
            {name :　'sourcedatatable',type : 'string'},
            {name : 'sourcedataitem', type : 'string'},
            {name : 'comdatatable', type : 'string'},
            {name : 'comdataitem', type : 'string'},
            {name : 'calculatetype', type : 'string'},
            {name : 'rangemin', type : 'float' },
            {name : 'rangemax', type : 'float'},
            {name : 'warnlevel',type : 'string'},
            {name : 'warnhelp', type : 'string'},
            {name : 'moduleid', type : 'string'},
            {name : 'sourcerelateitem', type : 'string'},
            {name : 'sourcehidecon', type : 'string'},
            {name : 'scalculatemode', type : 'string'},
            {name : 'comrelateitem', type : 'string'},
            {name : 'comhidecon', type : 'string'},
            {name : 'comcalculatemode', type : 'string'},
            {name : 'mid', type : 'string'}
        ]),
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnRules',
            business :'baseMgm',
            method :'findwhereorderby',
            params : '1=1'
        }
        
    })
    var selModel = new Ext.grid.CheckboxSelectionModel({
        singleSelect :true,
        header :'',
        listeners : {
            rowselect :function (sm,index,rec){
                selectUids = rec.get('uids');
                nodeId = rec.get('mid');
            	mstore.removeAll();
            	DWREngine.setAsync(false);
	                PcWarnService.getModuleNameByother(nodeId,
			             function(list){
			                 var Rec = new Ext.data.Record.create([
	               	                   {name : 'moduleid',type : 'string'},
	               	                   {name : 'modulename',type : 'string'}
	               	                 ]);
				             for(var i=0;i<list.length;i++){
				              	 mstore.add(new Rec({moduleid:list[i].powerpk,modulename:list[i].powername}));
				                   }
			                    }
		                      );
	            DWREngine.setAsync(true);
                southStore.baseParams.params = "warnrulesid ='"+selectUids+"'";
                southStoreReload();
                rangeStore.baseParams.params = "warnrulesid='"+selectUids+"'";
                rangeStoreReload();
            },
            rowdeselect : function (sm,index,rec){
                selectUids = '';
                southStore.baseParams.params = "warnrulesid ='"+selectUids+"'";
                southStoreReload();
                rangeStore.baseParams.params = "warnrulesid='"+selectUids+"'";
                rangeStoreReload();
            }
        }
    })
    var columnModel = new Ext.grid.ColumnModel([selModel,
        {
            header : '主键',
            dataIndex:'uids',
            width:20,
            hidden:true
         },{
            header : '规则名称',
            width :120,
            align : 'center',
            dataIndex : 'warnrulename'
         },{
            header :'源数据表',
            width : 60,
            align : 'center',
            dataIndex : 'sourcedatatable'
         },{
            header : '比较数据表',
            width : 60,
            align : 'center',
            dataIndex : 'comdatatable',
            renderer : function (value){
                if(value=='null'){
                    return "";
                }else {
                    return value;
                }
            }
         },{
            header : '范围最小值',
            width : 0,
            hidden : true,
            align : 'right',
            dataIndex : 'rangemin'
         },{
            header : '范围最大值',
            width : 0,
            hidden : true,
            align : 'right',
            dataIndex : 'rangemax'
         },{
            header : '预警内容说明',
            width : 0,
            hidden : true,
            dataIndex : 'warnhelp'
         }
    ]);
    var grid = new Ext.grid.GridPanel({
        title : '预警规则定义列表',
        id : 'north-grid',
        region : 'north',
        height : 300,
        width :1050,
	    store: store,
	    sm :selModel,
	    cm: columnModel,
	    iconCls: 'icon-show-all',
	    border: false,
	    layout: 'fit',
	    header: true,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,			//加载时是否显示进度
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    tbar:[
	        {text: '新增',
	         iconCls:'add',
	         handler:opWin},'-',{
	         text :'修改',
	         iconCls : 'select',
	         handler :modifyfunction
	        },'-',{
	         text : '删除',
	         iconCls : 'remove',
	         handler : removeRules
	        },'-',{
	          text : '分配责任人',
	          iconCls : 'option',
	          handler : distributePerson   
	        }
	    ],
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: store,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	northReload();
	
	function northReload(){
	    store.load({params:{start : 0,limit : PAGE_SIZE}});
	}
	
	var roleTypeStore = new Ext.data.SimpleStore({
	    id : 0,
	    fields : ['k','v']
	})
	
    DWREngine.setAsync(false);
	db2Json.selectSimpleData("select p.property_code,p.property_name from PROPERTY_CODE p where p.TYPE_NAME ='组织机构类型' and p.property_code in ('0','2','3')",
	   function (rtn){
	       roleTypeStore.loadData(eval(rtn));
	   }
	)
	DWREngine.setAsync(true);
		
	var fc = {
	    'uids' : {
	        name : 'uids',
	        fieldLabel : '主键',
	        anchor : '95%',
	        readOnly : true,
	        hidden : true,
	        hideLabel:true
	    },'roletype' : {
	        name : 'roletype',
	        fieldLabel : '预警权限层级',
	        anchor : '95%',
	        valueField : 'k',
	        displayField : 'v',
	        typeAhead : true,
	        allowBlank: false,
	        readOnly : true,
	        mode : 'local',
	        triggerAction: 'all',
	        listClass : 'x-combo-list-small',
	        lazyRender:true,
	        emptyText : '请选择预警权限层级',
	        store : roleTypeStore
	    },'rolelevel' : {
	       name : 'rolelevel',
	       fieldLabel : '权限级别',
	       anchor : '95%',
	       valueField : 'k',
	       displayField : 'v',
	       typeAhead : true,
	       allowBlank : false,
	       readOnly : true,
	       mode : 'local',
	       triggerAction : 'all',
	       lazyRender:true,
	       emptyText : '请选择预警权限级别',
	       listClass : 'x-combo-list-small',
	       store : new Ext.data.SimpleStore({
	           fields : ['k','v'],
	           data : [['责任权限','责任权限'],['查询权限','查询权限']]
	       }) 
	    },'warnrulesid' : {
	       name : 'warnrulesid',
	       fieldLabel : '规则表外键',
	       anchor : '95%',
	       hidden : true,
	       hideLabel : true 
	    },'mid':{
            xtype : 'textfield',
            id : 'mid',
            name : 'mid',
            fieldLabel : '模块名称',
            hidden : true,
            hideLabel : true,
            anchor : '95%'
        }
	}
	
	var columns = [
	    {name : 'uids', type : 'string'},
	    {name : 'roletype', type : 'string'},
	    {name : 'rolelevel', type : 'string'},
	    {name : 'warnrulesid', type : 'string'}
	]
	
	var plant = new Ext.data.Record.create(columns);
	plantInt = {
	    uids : '',
	    roletype : '0',
	    rolelevel : '',
	    warnrulesid : selectUids
	}
	var southSelModel =  new Ext.grid.CheckboxSelectionModel();
	var southColumnModel = new Ext.grid.ColumnModel([
	    southSelModel,
	    {
	        id : fc['uids'].name,
	        header : fc['uids'].fieldLabel,
	        dataIndex : fc['uids'].name,
	        width : 200,
	        hidden : true
	    },{
	        id : fc['roletype'].name,
	        header : fc['roletype'].fieldLabel,
	        dataIndex : fc['roletype'].name,
	        width : 120,
	        renderer : function (val){
	            for(var i=0;i<roleTypeStore.getCount();i++){
	                if(val==roleTypeStore.getAt(i).get('k')){
	                    return roleTypeStore.getAt(i).get('v');
	                }
	            }
	        },
	        editor: new Ext.form.ComboBox(fc['roletype'])
	    },{
	        id : fc['rolelevel'].name,
	        header : fc['rolelevel'].fieldLabel,
	        dataIndex : fc['rolelevel'].name,
	        width : 120,
	        editor: new Ext.form.ComboBox(fc['rolelevel'])
	    },{
	        id : fc['warnrulesid'].name,
	        header : fc['warnrulesid'].fieldLabel,
	        dataIndex : fc['warnrulesid'].name,
	        width : 120,
	        hidden : true
	    }
	])
	var southStore = new Ext.data.Store({
	    baseParams :{
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnRoleInfo',
            business :'baseMgm',
            method :'findwhereorderby',
            params : '1=1'
	        
	    },
	    proxy : new Ext.data.HttpProxy({
	        url : MAIN_SERVLET,
	        method : 'GET'
	    }),
	    reader : new Ext.data.JsonReader({
	        root : 'topics',
	        totalProperty : 'totalCount',
	        id : 'uids'
	    },columns)
	})
	
	
    var southgrid = new Ext.grid.EditorGridTbarPanel({
        region : 'center',
        height :277,
        width :845,
	    store: southStore,
	    sm :southSelModel,
	    cm: southColumnModel,
        tbar: [],
        border: false, 
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: southStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: plant,				
      	plantInt: plantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: 'com.sgepit.pcmis.warn.hbm.PcWarnRoleInfo',					
      	business: 'PcWarnService',	
      	primaryKey: 'uids',		
      	insertHandler: insertPcWarnRolefn,
      	saveHandler : savePcWarnRolefn,
      	deleteHandler: null,
      	saveMethod : 'updatePcWarnrole',
      	deleteMethod : 'deletePcWarnrole',
      	insertMethod : 'insertPcWarnrole'
	});
	
	function southStoreReload(){
	    southStore.load({params:{start : 0,limit : PAGE_SIZE}});	
	}
	
	
	var rangefc ={
	    'uids' : {
	        name : 'uids',
	        fieldLabel : '主键',
	        anchor : '95%',
	        readOnly : true,
	        hidden : true,
	        hideLabel:true
	    },'projectid' : {
	        name : 'projectid',
	        fieldLabel : '项目单位名称',
	        anchor : '95%',
	        valueField : 'unitid',
	        displayField : 'unitname',
	        typeAhead : true,
	        allowBlank: false,
	        readOnly : true,
	        mode : 'local',
	        triggerAction: 'all',
	        listClass : 'x-combo-list-small',
	        lazyRender:true,
	        emptyText : '请选择项目单位名称',
	        store : projectStore
	    },'rangemax' : {
	       name : 'rangemax',
	       fieldLabel : '范围最大值',
	       anchor : '95%'
	    },'rangemin' :{
	       name : 'rangemin',
	       fieldLabel : '范围最小值',
	       anchor : '95%'
	    },'warnrulesid' : {
	       name : 'warnrulesid',
	       fieldLabel : '规则表外键',
	       anchor : '95%',
	       hidden : true,
	       hideLabel : true 
	    }	    
	}
	var rangecolumns = [
	    {name : 'uids', type : 'string'},
	    {name : 'projectid', type : 'string'},
	    {name : 'rangemax', type : 'float'},
	    {name : 'rangemin', type : 'float'},
	    {name : 'warnrulesid',type : 'string'}
	]
	
	var rangeplant = new Ext.data.Record.create(rangecolumns);
	rangeplantInt = {
	    uids : '',
	    projectid : '',
	    rangemax : '0',
	    rangemin : '0',
	    warnrulesid : selectUids
	}
	var rangeSelModel =  new Ext.grid.CheckboxSelectionModel();
	var rangeColumnModel = new Ext.grid.ColumnModel([
	    rangeSelModel,
	    {
	        id : rangefc['uids'].name,
	        header : rangefc['uids'].fieldLabel,
	        dataIndex : rangefc['uids'].name,
	        width : 200,
	        hidden : true
	    },{
	        id : rangefc['projectid'].name,
	        header : rangefc['projectid'].fieldLabel,
	        dataIndex : rangefc['projectid'].name,
	        width : 120,
	        align : 'center',
	        renderer : function (val){
	            for(var i=0;i<projectStore.getCount();i++){
	                if(val==projectStore.getAt(i).get('unitid')){
	                    return projectStore.getAt(i).get('unitname');
	                }
	            }
	        },
	        editor: new Ext.form.ComboBox(rangefc['projectid'])
	    },{
	        id : rangefc['rangemax'].name,
	        header : rangefc['rangemax'].fieldLabel,
	        dataIndex : rangefc['rangemax'].name,
	        align : 'right',
	        width : 120,
	        editor: new Ext.form.NumberField(rangefc['rangemax'])
	    },{
	        id : rangefc['rangemin'].name,
	        header : rangefc['rangemin'].fieldLabel,
	        dataIndex : rangefc['rangemin'].name,
	        align : 'right',
	        width : 120,
	        editor: new Ext.form.NumberField(rangefc['rangemin'])	    
	    },{
	        id : rangefc['warnrulesid'].name,
	        header : rangefc['warnrulesid'].fieldLabel,
	        dataIndex : rangefc['warnrulesid'].name,
	        width : 120,
	        hidden : true
	    }
	])
	var rangeStore = new Ext.data.Store({
	    baseParams :{
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnRangeInfo',
            business :'baseMgm',
            method :'findwhereorderby',
            params : '1=1'
	        
	    },
	    proxy : new Ext.data.HttpProxy({
	        url : MAIN_SERVLET,
	        method : 'GET'
	    }),
	    reader : new Ext.data.JsonReader({
	        root : 'topics',
	        totalProperty : 'totalCount',
	        id : 'uids'
	    },rangecolumns)
	})
	
	
    var rangegrid = new Ext.grid.EditorGridTbarPanel({
        region : 'center',
        height :277,
        width :845,
	    store: rangeStore,
	    sm :rangeSelModel,
	    cm: rangeColumnModel,
        tbar: [],
        border: false, 
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: rangeStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: rangeplant,				
      	plantInt: rangeplantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: 'com.sgepit.pcmis.warn.hbm.PcWarnRangeInfo',					
      	business: 'PcWarnService',	
      	primaryKey: 'uids',		
      	insertHandler: insertPcWarnRangefn,
      	saveHandler : savePcWarnRangefn,
      	deleteHandler: null,
      	saveMethod : 'updatePcWarnRange',
      	deleteMethod : 'deletePcWarnRange',
      	insertMethod : 'insertPcWarnRange'
	});
	
	function rangeStoreReload(){
	    rangeStore.load({params:{start : 0,limit : PAGE_SIZE}});	
	}		
	function insertPcWarnRangefn(){
	     var record = selModel.getSelected();
         if(record==null||record.get('uids')==''){
             Ext.Msg.alert("提示","请先选择规则，再新增记录！");
             return ;
         }else {
           rangeplantInt.warnrulesid=record.get('uids');
           rangegrid.defaultInsertHandler();
        }
	}
	function savePcWarnRangefn(){
	    var records = rangegrid.getStore().getModifiedRecords();
        for(var i =0;i<records.length;i++){
        var results='';
         var rec =records[i];
        DWREngine.setAsync(false);
        PcWarnService.checkPcWarnRangeExist(rec.get('uids'),rec.get('projectid'),rec.get('warnrulesid'),function (rtn){
            results =rtn;
        })
        DWREngine.setAsync(true);
            if(results=='1'){
                rangegrid.defaultSaveHandler();	    
            }else {
                Ext.Msg.alert('提示信息','预警范围项目单位不能对应2条范围记录');
                break;
            }
        }
	}
	    var tabpanel = new Ext.TabPanel({
        activeTab : 0,
        deferredRender : true,
        height : 240,
        minSize : 100,
        maxSize : 460,
        frame : true,
        plain : true,
        border : false,
        region : 'center',
        forceFit : true,
        items :[
            {
                title : '预警规则权限',
                iconCls: 'title',
                frame : true,
                layout : 'fit',
                items : [southgrid]
            },{
                title : '预警范围',
                iconCls : 'option',
                frame : true,
                layout : 'fit',
                items : [rangegrid]
            }
        ]
    })
	var panel = new Ext.Panel({
	    region :'center',
	    layout : 'border',
	    items :[grid,tabpanel]
	})
	
	
    new Ext.Viewport({
        layout : 'border',
        border : false,
        items:[treePanel,panel]
    })
    
    //设置源数据表字段Store
    var tableStore = new Ext.data.SimpleStore({
        id : 0,
        fields :['val','txt']
    })
    //设置比较数据表选择项
    var comtableStore = new Ext.data.SimpleStore({
        id : 0,
        fields :['val','txt']
    })
    var sqlStr=" select ut.object_name as A, u.table_name || '(' || nvl(u.comments, '--') || ')' as B";
        sqlStr+=" from user_objects ut ";
        sqlStr+=" left join user_tab_comments u";
        sqlStr+=" on ut.object_name = u.TABLE_NAME  where ";
//      sqlStr+=" u.table_name not like '%VIEW%'";
        sqlStr += "1=1";
        sqlStr+=" and u.table_name not like '%FLOW%'";
        sqlStr+=" and u.table_name not like 'SB%'";
        sqlStr+=" and u.table_name not like 'APP%'";
        sqlStr+=" and u.table_name not like 'SGCC%'";
        sqlStr+=" and u.table_name not like 'FLW%'";
        sqlStr+=" and u.table_name not like 'HR%'";
        sqlStr+=" and u.table_name not like 'MAT%'";
        sqlStr+=" and u.table_name not like 'ROCK%'";
        sqlStr+=" and u.table_name not like 'SGCC%'";
        sqlStr+=" and u.table_name not like 'ASFE%'";
        sqlStr+=" and u.table_name not like 'SYS%'";
        sqlStr+=" and u.table_name not like 'V_%'";
        sqlStr+=" and u.table_name not like 'FA%'";
        sqlStr+=" and u.table_name not like 'GCZL%'";
        sqlStr+=" and u.table_name not like 'SAFE%'";
        sqlStr+=" and u.table_name not like 'WZ%'";
        sqlStr+=" and u.table_name not like 'CELL%'";
        sqlStr+=" and u.table_name not like 'COM%'";
        sqlStr+=" and u.table_name not like 'SGCC%'";
        sqlStr+=" and u.table_name not like 'CW%'";
        sqlStr+=" and u.table_name not like 'EQU%'";
        sqlStr+=" and u.table_name not like 'KQ%'";
        sqlStr+=" and u.table_name not like 'ZB%'";
        sqlStr+=" and u.table_name not like 'SGCC%'";
        sqlStr+=" and u.table_name not like 'TEN%'";
        sqlStr+=" and u.table_name not like '%_NK'";
        sqlStr+=" union ( select v.VIEW_NAME as A,v.VIEW_NAME as B from user_views v where v.VIEW_NAME like 'V_WARN_%' )";
    db2Json.selectSimpleData(sqlStr,
    function(dat){
        tableStore.loadData(eval(dat));
        comtableStore.loadData(eval(dat));
    })
    //源数据项
    var sourceitemStore = new Ext.data.SimpleStore({
        id : 0,
        fields :['val','txt']
    })
    //预警说明中配置
    var warnStore = new Ext.data.SimpleStore({
        id : 0,
        fields : ['val','txt']
    })
    //比较数据项
    var comitemStore = new Ext.data.SimpleStore({
        id :0,
        fields : ['val','txt']
    })
    //比较关联字段
    var comrelateitem = new Ext.data.SimpleStore({
        id : 0,
        fields : ['val','txt']
    })
    
    //设置自定义标签
    var minValueBtn = new Ext.Toolbar.Button({
        text : '最小值',
        tooltip :'{minValue}',
        handler : function (){
            setResults('{minValue}');
        }
    })
    var maxValueBtn = new Ext.Toolbar.Button({
        text : '最大值',
        tooltip : '{maxValue}',
        handler : function (){
            setResults('{maxValue}');
        }
    })
    
    var resValueBtn = new Ext.Toolbar.Button({
        text : '结果值',
        tooltip : '{resValue}',
        handler : function (){
            setResults('{resValue}');
        }
    })
    
    var selectCombox = new Ext.form.ComboBox({
         id : 'selectitem',
         name : 'selectitem',
         fieldLabel : '源数据项',
         displayField : 'val',
         valueField : 'txt',
         anchor : '95%',
         allowBlank : true,
         typeAhead : true,
         mode : 'local',
         triggerAction : 'all',
         lazyRender : true,
         editable : false,
         emptyText : '请选择定义标签',
         selectOnFocus : true,
         store : warnStore,
         hideLabel : true,
         listeners :{
             select  : function (com,r,index){
                 setResults('['+r.get('val')+','+r.get('txt')+']');
             }
         }
    })
    
    function setResults(val){
        var text = Ext.getCmp('warnhelp');
        text.setValue(text.getValue()+val);
    }
    var formPanel = new Ext.form.FormPanel({
        id : 'form-panel',
        frame : false,
        buttonAlign : 'center',
        bodyStyle:'padding:5px',
        labelAlign : 'right',
        items:[{
            xtype : 'fieldset',
            baseCls:"x-fieldset",
            autoShow :true, 
            autoHeight : true,
            autoWidth : true,
            border :false,
            width :300,
            layout : 'column',
            items:[
                {  columnWidth :0.5,
                   layout : 'form',
                   bodyStyle: 'border: 0px;',
                   items :[
                       {
                           xtype : 'combo',
                           id : 'moduleid',
			               name : 'moduleid',
			               fieldLabel : '模块名称',
			               anchor : '95%',
			               allowBlank : false,
			               store : mstore,
        	               displayField :'modulename',
        	               valueField : 'moduleid',
        	               typeAhead : true,
        	               mode : 'local',
        	               lazyRender : true,
        	               width :500,
        	               editable :false,
        	               triggerAction: 'all',
        	               emptyText:"选择预警的模块名称",
        	               selectOnFocus:true,
        	               listeners :{
        	               }                           
                       },{
                           xtype : 'combo',
                           id : 'sourcedatatable',
                           name : 'sourcedatatable',
                           fieldLabel : '源数据表',
                           displayField : 'txt',
                           valueField : 'val',
                           anchor : '95%',
                           allowBlank : false,
                           typeAhead : true,
                           mode : 'local',
                           lazyRender : true,
                           editable : false,
                           triggerAction :'all',
                           emptyText : '请选择源数据表',
                           selectOnFocus  : true,
                           store : tableStore,
                           listeners :{
                               change : function (f,n,o){
             	    	           db2Json.selectSimpleData("select column_name,column_name||'('||comments||')' from user_col_comments  where table_name = '"+n+"'",
			                           function(dat){
				                           sourceitemStore.loadData(eval(dat))
			                       });
			                       Ext.getCmp('sourcedataitem').reset();                      
			                       Ext.getCmp('sourcerelateitem').reset();
			                       db2Json.selectSimpleData("select column_name,data_type from all_tab_columns where table_name='"+n+"'",function(rtn){
			                       warnStore.loadData(eval(rtn));
			                       })
			                       Ext.getCmp('selectitem').reset();
			                       Ext.getCmp('warnhelp').reset(); 
			                       Ext.getCmp('selectitem').disable(); 
			                       
                               },
                               select: function (com,rec,index){
                                   Ext.getCmp('selectitem').disable(); 
                               }
                           }
                       },{
                           xtype : 'combo',
                           id : 'sourcedataitem',
                           name : 'sourcedataitem',
                           fieldLabel : '源数据项',
                           displayField : 'txt',
                           valueField : 'val',
                           anchor : '95%',
                           allowBlank : false,
                           typeAhead : true,
                           mode : 'local',
                           triggerAction : 'all',
                           lazyRender : true,
                           editable : false,
                           emptyText : '请选择源数据项',
                           selectOnFocus : true,
                           store : sourceitemStore,
                           listeners :{
                           }
                       },{
                           xtype : 'combo',
                           id : 'sourcerelateitem',
                           name : 'sourcerelateitem',
                           fieldLabel : '源数据关联字段',
                           displayField : 'txt',
                           valueField : 'val',
                           typeAhead : true,
                           lazyRender : true,
                           mode : 'local',
                           triggerAction : 'all',
                           selectOnFocus : true,
                           editable : false,
                           emptyText : '请选择源数据关联字段',
                           anchor : '95%',
                           store : sourceitemStore,
                           listeners :{
                           }
                       },{
                           xtype : 'textfield',
                           id : 'sourcehidecon',
                           name : 'sourcehidecon',
                           fieldLabel : '源数据其他条件',
                           anchor : '95%'
                       },{
                           xtype : 'combo',
                           id : 'scalculatemode',
                           name : 'scalculatemode',
                           fieldLabel : '源计算方式',
                           displayField : 'calname',
                           valueField : 'caltype',
                           typeAhead : true,
                           allowBlank : false,
                           lazyRender : true,
                           editable : false,
                           mode : 'local',
                           triggerAction : 'all',
                           emptyText : '源数据计算方式',
                           selectOnFocus : true,
                           anchor : '95%',
                           store : new Ext.data.SimpleStore({
                               fields : ['caltype','calname']
                           }),
                           listeners : {
                               beforeRender: function (com){
                                   var _store = com.store;
                                   var rec = new Ext.data.Record.create([
                                       {name : 'caltype'},
                                       {name : 'calname'}
                                   ])
                                   _store.add(new rec({caltype:'other',calname:'其他'}));
                                   _store.add(new rec({caltype:'sum',calname:'求和'}));
                                   _store.add(new rec({caltype:'count',calname:'计数'}));
                               },
                               select : function (com,rec,index){
                               	if(rec.get('caltype')=='sum'||rec.get('caltype')=='count'){
                               	    Ext.getCmp('selectitem').disable(); 
                               	}else {
                               	    Ext.getCmp('selectitem').enable(); 
                               	}
                               }
                           }
                       }
                   ]
                },{
                columnWidth :0.5,
                layout : 'form',
                bodyStyle: 'border: 0px;',
                items :[
                    {
                        xtype :'textfield',
                        fieldLabel : '预警规则名称',
                        allowBlank : false,
                        id :'warnrulename',
                        name : 'warnrulename',
                        anchor :'95%'
                    },{
                        xtype : 'combo',
                        id : 'comdatatable',
                        name : 'comdatatable',
                        fieldLabel : '比较数据表名称',
                        allowBlank : false,
                        displayField : 'txt',
                        valueField : 'val',
                        anchor : '95%',
                        typeAhead : true,
                        mode : 'local',
                        lazyRender : true,
                        editable : false,
                        triggerAction : 'all',
                        emptyText : '请选择比较数据表',
                        selectOnFocus : true,
                        store : comtableStore,
                        listeners : {
                            beforeRender : function(combo){
                                var _store = combo.store;
                                var rec = new Ext.data.Record.create([
                                    {name : 'val'},
                                    {name : 'txt'}
                                ])
                                _store.insert(0,new rec({val:'null',txt:'无'}))
                            },
                            change : function (f,n,o){
                                   DWREngine.setAsync(false);
             	    	           db2Json.selectSimpleData("select column_name,column_name||'('||comments||')' from user_col_comments  where table_name = '"+n+"'",
			                           function(dat){
				                           comitemStore.loadData(eval(dat))
				                           comrelateitem.loadData(eval(dat));
			                       });
			                       DWREngine.setAsync(true);
			                       var rec = new Ext.data.Record.create([
			                           {name : 'val'},
			                           {name : 'txt'}
			                       ])
			                       comitemStore.insert(0,new rec({val:'null',txt:'无'}));
			                       Ext.getCmp('comdataitem').reset();
			                       Ext.getCmp('comrelateitem').reset();
			                                                         
                            }
                        }
                    },{
                        xtype : 'combo',
                        id : 'comdataitem',
                        name : 'comdataitem',
                        fieldLabel : '比较数据项',
                        allowBlank : false,
                        displayField : 'txt',
                        valueField : 'val',
                        anchor : '95%',
                        typeAhead : true,
                        lazyRender : true,
                        mode : 'local',
                        editable :false,
                        emptyText : '请选择比较数据项',
                        triggerAction : 'all',
                        selectOnFocus : true,
                        store : comitemStore,
                        listeners : {
                        }
                    },{
                        xtype : 'combo',
                        id : 'comrelateitem',
                        name : 'comrelateitem',
                        fieldLabel : '比较关联字段',
                        displayField : 'txt',
                        valueField : 'val',
                        typeAhead : true,
                        lazyRender : true,
                        mode : 'local',
                        triggerAction : 'all',
                        selectOnFocus : true,
                        emptyText : '请选择比较数据项关联字段',
                        anchor : '95%',
                        store : comrelateitem,
                        listenrers : {
                        }
                    },{
                        xtype : 'textfield',
                        id : 'comhidecon',
                        name : 'comhidecon',
                        fieldLabel : '比较其他条件',
                        anchor : '95%'
                    },{
                        xtype : 'combo',
                        id : 'comcalculatemode',
                        fieldLabel : '比较计算方式',
                        displayField : 'calname',
                        valueField : 'caltype',
                        typeAhead : true,
                        lazyRender : true,
                        allowBlank : false,
                        mode : 'local',
                        triggerAction : 'all',
                        selectOnFocus : true,
                        emptyText : '请选择比较数据计算方式',
                        anchor : '95%',
                        store : new Ext.data.SimpleStore({
                            fields : ['caltype','calname'],
                            data : [['sum','求和计算'],['count','计数计算']]
                        }),
                        listeners : {
                        }
                    }
                ]
                }
            ]
        },{
            xtype : 'combo',
            id : 'calculatetype',
            fieldLabel : '计算方式',
            allowBlank : false,
            displayField : 'v',
            valueField : 'k',
            typeAhead : true,
            mode : 'local',
            triggerAction : 'all',
            editable : false,
            lazyRender : true,
            selectOnFoucs : true,
            anchor : '95%',
            store : new Ext.data.SimpleStore({
                fields :['k','v']
            }),
            listeners : {
                beforeRender : function (com){
                    var _store = com.store;
                    var rec = new Ext.data.Record.create([
                        {name : 'k'},
                        {name : 'v'}
                    ])
                    _store.add(new rec({k:'-',v:'源数据项-比较数据项'}));
                    _store.add(new rec({k:'%',v:'源数据项/比较数据项'}));
                    _store.add(new rec({k:'/',v:'（源数据项-比较数据项）/比较数据项'}));
                    
                }
            }
        },{
            xtype : 'numberfield',
            id : 'rangemin',
            name : 'rangemin',
            fieldLabel : '范围最小值',
            allowBlank : false,
            anchor : '95%'
        },{
            xtype : 'numberfield',
            id : 'rangemax',
            name : 'rangemax',
            fieldLabel : '范围最大值',
            allowBlank : false,
            anchor : '95%'
        },{
            xtype : 'fieldset',
            title : '数据校验结果',
            layout : 'column',
            labelWidth : 0,
            items :[{
                columnWidth : .15,
                layout : 'form',
                items : [minValueBtn]
            },{
                columnWidth : .15,
                layout : 'form',
                items : [resValueBtn]
            },{
                columnWidth : .17,
                layout : 'form',
                items : [maxValueBtn]
            },{
                columnWidth :.3,
                layout : 'form',
                items : [selectCombox]
            },{
                columnWidth :1,
                layout : 'form',
                items : [{
                           xtype : 'textarea',
                           id : 'warnhelp',
                           name : 'warnhelp',
                           allowBlank : false,
                           hideLabel : true,
                           height : 60,
                           width : 590
                }]
            }
            ]
        
        },
        	new Ext.form.Hidden(fc['uids']),
        	new Ext.form.Hidden(fc['mid'])
        ],
        buttons:[
            {
                text : '保存',
                handler : function (){
                    if(formPanel.getForm().isValid()){
                        var basicForm = formPanel.getForm();
                        var moduleid = basicForm.findField('moduleid').getValue();
                        var sourcedatatable = basicForm.findField('sourcedatatable').getValue();
                        var sourcedataitem = basicForm.findField('sourcedataitem').getValue();
                        var sourcerelateitem = basicForm.findField('sourcerelateitem').getValue();
                        var sourcehidecon = basicForm.findField('sourcehidecon').getValue();
                        var scalculatemode = basicForm.findField('scalculatemode').getValue();
                        var warnrulename = basicForm.findField('warnrulename').getValue();
                        var comdatatable = basicForm.findField('comdatatable').getValue();
                        var comdataitem = basicForm.findField('comdataitem').getValue();
                        var comrelateitem = basicForm.findField('comrelateitem').getValue();
                        var comhidecon = basicForm.findField('comhidecon').getValue();
                        var comcalculatemode = basicForm.findField('comcalculatemode').getValue();
                        var calculatetype = basicForm.findField('calculatetype').getValue();
                        var rangemin = basicForm.findField('rangemin').getValue();
                        var rangemax = basicForm.findField('rangemax').getValue();
                        var warnhelp = basicForm.findField('warnhelp').getValue();
                        var uids = basicForm.findField('uids').getValue();
                        var mid = basicForm.findField('mid').getValue();
                        if((sourcerelateitem!=''&&comrelateitem=='')||(sourcerelateitem==''&&comrelateitem!='')){
                            Ext.Msg.alert('提示信息','源数据关联字段与比较数据关联字段同时选择或者同时不选择');
                            return ;
                        }
                        var souStr ="";
                            DWREngine.setAsync(false);
                        if(scalculatemode=='other'||scalculatemode=='sum'){
                            PcWarnService.validateDataType(sourcedatatable,sourcedataitem,function (rtn){
                                souStr=rtn;
                            })
                        }
                            DWREngine.setAsync(true);
                            if(souStr=='0'){
                                  Ext.Msg.alert('提示信息','源数据项求和计算及其他计算时源数据项必须为数字类型');
                                  return ;   
                                }
                        var obj =  new Object();
                        obj.moduleid = moduleid;
                        obj.sourcedatatable = sourcedatatable;
                        obj.sourcedataitem = sourcedataitem;
                        obj.sourcerelateitem = sourcerelateitem;
                        obj.sourcehidecon = sourcehidecon;
                        obj.scalculatemode = scalculatemode;
                        obj.warnrulename = warnrulename;
                        obj.comdatatable = comdatatable;
                        obj.comdataitem = comdataitem;
                        obj.comrelateitem = comrelateitem;
                        obj.comhidecon = comhidecon;
                        obj.comcalculatemode = comcalculatemode;
                        obj.calculatetype = calculatetype;
                        obj.rangemin = rangemin;
                        obj.rangemax = rangemax;
                        obj.warnhelp = warnhelp;
                        DWREngine.setAsync(false);
                        if(uids == ''){
                        obj.mid = nodeId
                        PcWarnService.savePCRules(obj,function(rtn){
                            if(rtn=='1')
                            Ext.Msg.alert('提示信息','源数据项配置出错');
                            if(rtn=='2')
                            Ext.Msg.alert('提示信息','比较数据项配置出错')
                            if(rtn=='3')
                            Ext.Msg.alert('提示信息','配置数据项成功')
                        });
                        }else if(uids!=''){
                            obj.uids = uids;
                            obj.mid = mid;
                            ///////////////////////////////////////////////////////////////////
                            PcWarnService.updatePCRules(obj,function (rtn){
                            if(rtn=='1')
                            Ext.Msg.alert('提示信息','源数据项配置出错');
                            if(rtn=='2')
                            Ext.Msg.alert('提示信息','比较数据项配置出错')
                            if(rtn=='3')
                            Ext.Msg.alert('提示信息','配置数据项成功')
                            })
                        }
                        DWREngine.setAsync(true);
                        formPanel.getForm().reset();
                        showWin.hide();
                        northReload(); 
                    }
                }
            },{
                text : '取消',
                handler : function (){
                    formPanel.getForm().reset();
                    showWin.hide();  
                }
            } 
        ]
    }) 
    
    function opWin(){
    	if(typeof(nodeId)=='undefined'||nodeId=='模块名称'){
    	    Ext.Msg.alert('提示信息','请先选择左侧系统模块');
    	    return ;
    	}
        if(!showWin){
            showWin = new Ext.Window({
                id : 'showWin',
			    title: '预警规则',
			    iconCls: 'form',
			    width: 800,
			    height: 500,
			    modal: true,
			    closeAction: 'hide',
			    maximizable: true,
			    minimizable: true,
			    resizable: true,
			    autoScroll:true,
			    plain: true,
			    items:[formPanel],
			    listeners : {
			        hide : function (win){
			            win.items.get(0).getForm().reset();
			            win.hide();
			        }
			    }
		    });               
            }
        addflag = false;    
        showWin.show();
        }
        
    function modifyfunction(){
        var rec = grid.getSelectionModel().getSelected();
        if(typeof(rec) == 'undefined'){
            Ext.Msg.alert('提示信息','请选择一条数据')
            return ;
        };
        if(!showWin){
            showWin = new Ext.Window({
                id : 'showWin',
			    title: '修改预警规则',
			    iconCls: 'form',
			    width: 800,
			    height: 500,
			    modal: true,
			    closeAction: 'hide',
			    maximizable: false,
			    resizable: true,
			    autoScroll:true,
			    plain: true,
			    items:[formPanel],
			    listeners : {
			        hide : function (win){
			            win.items.get(0).getForm().reset();
			            win.hide();
			        }
			    }                
            })
        }
        showWin.show();
        rec.get('mid')
            	mstore.removeAll();
            	DWREngine.setAsync(false);
                PcWarnService.getModuleNameByother(rec.get('mid'),
		             function(list){
		                 var Rec = new Ext.data.Record.create([
               	                   {name : 'moduleid',type : 'string'},
               	                   {name : 'modulename',type : 'string'}
               	                 ]);
			             for(var i=0;i<list.length;i++){
			              	 mstore.add(new Rec({moduleid:list[i].powerpk,modulename:list[i].powername}));
			                   }
		                    }
	                      );
	                   DWREngine.setAsync(true);        
        formPanel.getForm().loadRecord(rec);
        //设置源数据表字段选择
        DWREngine.setAsync(false);
        db2Json.selectSimpleData("select column_name,column_name||'('||comments||')' from user_col_comments  where table_name = '"+rec.get('sourcedatatable')+"'",
	        function(dat){
		        sourceitemStore.loadData(eval(dat))
			});
		// 设置比较数据表选择
 	    db2Json.selectSimpleData("select column_name,column_name||'('||comments||')' from user_col_comments  where table_name = '"+rec.get('comdatatable')+"'",
        function(dat){
           comitemStore.loadData(eval(dat))
           comrelateitem.loadData(eval(dat));
        });
       db2Json.selectSimpleData("select column_name,data_type from all_tab_columns where table_name='"+rec.get('sourcedatatable')+"'",function(rtn){
       warnStore.loadData(eval(rtn));
       })
        DWREngine.setAsync(true);
        var rec = new Ext.data.Record.create([
            {name : 'val'},
            {name : 'txt'}
        ])
        comitemStore.add(new rec({val:'null',txt:'无'}));
        
    }
    
    function removeRules(){
        var rec = grid.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择要删除的规则名称');
            return ;
        }
        var str =rec.get('uids');
             DWREngine.setAsync(false);
             PcWarnService.deletePCRulesById(str,function(ren){
             })
             DWREngine.setAsync(true);
             northReload();
             southStoreReload();
    }
    function insertPcWarnRolefn(){
        var record = selModel.getSelected();
        if(record==null||record.get('uids')==''){
            Ext.Msg.alert("提示","请先选择规则，再新增记录！");
            return ;
        }else {
          plantInt.warnrulesid=record.get('uids');
          southgrid.defaultInsertHandler();
        }
    }
    function savePcWarnRolefn(){
        var records = southgrid.getStore().getModifiedRecords();
        var results='';
        DWREngine.setAsync(false);
        baseDao.findByWhere2("com.sgepit.pcmis.warn.hbm.PcWarnRoleInfo"," warnrulesid ='"+selectUids+"' and rolelevel ='责任权限'",function(rtn){
            results = rtn.length;
        });
        DWREngine.setAsync(true);
        var k=0;//计算责任权限个数
        for(var i=0;i<records.length;i++){
            var rec =records[i];
                if(rec.get('rolelevel')=='责任权限'){
                   k+=1;
                }
         }
         if(results==0&&k>1){
             Ext.Msg.alert('提示信息','一条预警规则只能对应个责任权限');
             return ;
         }else if(results>0&&k>0){
             Ext.Msg.alert('提示信息','一条预警规则只能对应个责任权限');
             return ;
         }
                southgrid.defaultSaveHandler();
        }
        
        
// 以上为配置预警定义规则 以下为分配预警管理员功能       
    var dutyPersonStore = new Ext.data.Store({
        baseParams :{
            ac : 'list',
            bean : 'com.sgepit.pcmis.warn.hbm.PcWarnRuleDutyperson',
            business :'baseMgm',
            method :'findwhereorderby',
            params : '1=1'            
        },
        proxy : new Ext.data.HttpProxy({
            url : MAIN_SERVLET,
            method : 'GET'
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : 'uids'
         },[
            {name :'uids',type : 'string'},
            {name : 'moduleid' ,type : 'string'},
            {name : 'dutyperson' , type : 'string'}
        ]),
        remoteSort : true
    })
    dutyPersonStore.setDefaultSort('uids',"ASC");
    var dutyPerSelMoel = new Ext.grid.CheckboxSelectionModel({
        header : '',
        singleSelect : true
    });
    var dutyPerColModel = new Ext.grid.ColumnModel([
        dutyPerSelMoel,
        {
            header : '主键',
            dataIndex : 'uids',
            width : 30,
            hidden : true
        },{
            header : '模块名称',
            dataIndex : 'moduleid',
            width : 30,
            renderer : function (val){
                for(var i=0;i<moduleStore.getCount();i++){
                    if(moduleStore.getAt(i).get('moduleid')==val){
                        return moduleStore.getAt(i).get('modulename');
                    }
                }
            }
        },{
            header : '机构级别',
            dataIndex : 'dutyperson',
            width : 30,
            renderer :function (val){
                for(var i=0;i<unitStore.getCount();i++){
                    if(unitStore.getAt(i).get('userid')==val){
                       var str =unitStore.getAt(i).get('unit_type_id');
                       if(str=='0'){
                           return "集团公司"
                       }else if(str=='1'){
                           return "集团总部"
                       }else if(str=='2'){
                           return "二级企业";
                       }else if(str=='3'){
                           return "三级企业";
                       }else if(str=='A'){
                           return "项目单位";
                       }
                    }
                }
            }
        },{
            header : '责任人',
            dataIndex : 'dutyperson',
            width : 30,
            renderer : function (val){
                for(var i=0;i<personStore.getCount();i++){
                    if(personStore.getAt(i).get('userid')==val){
                        return personStore.getAt(i).get('realname');
                    }
                }
            }
        },{
            header : '所属单位',
            dataIndex : 'dutyperson',
            width : 30,
            renderer : function (val){
                for(var i=0;i<unitStore.getCount();i++){
                    if(unitStore.getAt(i).get('userid')==val){
                        return unitStore.getAt(i).get('unitid');
                    }
                }
            }
        }
    ])
    var dutyPersonGrid = new Ext.grid.GridPanel({
        height : 300,
        width : 500,
        title : '预警责任人列表',
        sm : dutyPerSelMoel,
        cm : dutyPerColModel,
        store : dutyPersonStore,
        iconCls: 'icon-show-all',
        border: false,
        layout: 'fit',
        header: true,
        autoScroll: true,
        collapsible: false,	
        animCollapse: false,
        loadMask: true,	
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    tbar : [
	        {
	           text :'新增',
	           iconCls : 'add',
	           handler : addDutyPerson
	        },'-',{
	           text : '修改',
	           iconCls : 'select',
	           handler : modifyDutyPerson
	        },'-',{
	           text : '删除',
	           iconCls : 'remove',
	           handler : deleteDutyPerson
	        },'-','模块名称',{
	           xtype : 'combo',
	           id : 'selectmodulecom',
	           fieldLabel : '模块名称',
	           displayField : 'modulename',
	           valueField : 'moduleid',
	           typeAhead : true,
	           editable : false,
	           mode : 'local',
	           triggerAction : 'all',
	           lazyRender : true,
	           store :moduleStore,
	           listeners :{
	               select : function (com,rec,index){
	                   dutyPersonStore.baseParams.params = "moduleid='"+rec.get('moduleid')+"'";
	                   dutyPersonStoreReload();
	               }
	           }
	        }
	    ],
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dutyPersonStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
    })          
        
    function dutyPersonStoreReload(){
        dutyPersonStore.load({params:{start : 0,limit : PAGE_SIZE}});
    } 
    dutyPersonStoreReload();   
    function distributePerson(){
    	if(typeof(nodeId)=='undefined'){
    	    Ext.Msg.alert('提示信息','请先选择左侧系统模块');
    	    return ;
    	}
        if(!disPerWin){
            disPerWin = new Ext.Window({
                id : 'disPerWin',
                title : '预警责任人列表',
                iconCls : 'form',
                modal : true,
                closeAction : 'hide',
			    width: 520,
			    height: 360,
			    modal: true,
			    maximizable: false,
			    resizable: true,
			    autoScroll:true,
			    plain: true,
			    items :[dutyPersonGrid]                
            });
        }
        disPerWin.show();
        Ext.getCmp('selectmodulecom').setValue(nodeId);
        Ext.getCmp('personmoduleid').setValue(nodeId);
        //dutyPersonStore.baseParams.params="moduleid ='"+nodeId+"'";
        dutyPersonStoreReload();
    }
    
     addPersonFormPanel = new Ext.form.FormPanel({
        id : 'addPersonFormPanel',
        frame : false,
        buttonAlign : 'center',
        bodyStyle:'padding:5px',
        labelAlign : 'right',
        items :[
          {
               xtype : 'combo',
               id : 'personmoduleid',
               name : 'personmoduleid',
               fieldLabel : '模块名称',
               anchor : '95%',
               allowBlank : false,
               store : moduleStore,
               displayField :'modulename',
               valueField : 'moduleid',
               typeAhead : true,
               mode : 'local',
               lazyRender : true,
               editable :false,
               triggerAction: 'all',
               emptyText:"选择预警的模块名称",
               selectOnFocus:true,
               width : 30,
               listeners :{
               } 
          },new Ext.form.TriggerField({
               name : 'dutyperson',
               fieldLabel : '责任人',
               triggerClass: 'x-form-date-trigger',
               readOnly: true,
               allowBlank : false,
               selectOnFocus: true,
               onTriggerClick: changePersonShow,
               width: 200   
          }),{
              xtype : 'textfield', 
              name : 'dutyperosnid',
              fieldLabel: '责任人', 
              hidden: true, 
              hideLabel: true
          },{
             xtype: 'textfield',
             name: 'dutyperson', fieldLabel: '责任人',
             width: 161, 
             readOnly: true, 
             hideLabel: true, 
             hidden: true
          },{
             xtype : 'textfield',
             name : 'uids',
             name : 'uids',
             fieldLabel : '主键',
             width : 161,
             readOnly : true,
             hideLabel : true,
             hidden : true
          }
        ],
        buttons : [
            {
                text : '保存',
                handler : savedutyperson
            },{
                text : '取消',
                handler : function (){
                    addPersonFormPanel.getForm().reset();
                    showPersonWin.hide();
                }
            }
        ]        
    })
    
    function addDutyPerson(){
        if(!showPersonWin){
            showPersonWin = new Ext.Window({
                id : 'showPersonWin',
                title : '分配预警责任人',
                iconCls : 'form',
                modal : true,
                closeAction : 'hide',
                width : 350,
                height : 200,
                maximizable: false,
                resizable: true,
                autoScroll:true,
                items :[addPersonFormPanel]  
            })
        }
        showPersonWin.show();
    }
    function modifyDutyPerson(){
        var rec = dutyPersonGrid.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择需要修改的数据');
            return ;
        }  
        if(!showPersonWin){
            showPersonWin = new Ext.Window({
                id : 'showPersonWin',
                title : '修改预警责任人',
                iconCls : 'form',
                modal : true,
                closeAction : 'hide',
                width : 350,
                height : 220,
                maximizable: false,
                resizable: true,
                autoScroll:true,
                items :[addPersonFormPanel]  
            })
        }
        addPersonFormPanel.title='修改预警责任人';
        showPersonWin.show();
        var basicForm = addPersonFormPanel.getForm();
        basicForm.findField('personmoduleid').setValue(rec.get('moduleid'));
        basicForm.findField('dutyperosnid').setValue(rec.get('dutyperson'));
        var dutyperson ="";
        for(var i=0;i<personStore.getCount();i++){
            if(personStore.getAt(i).get('userid')==rec.get('dutyperson')){
                dutyperson=personStore.getAt(i).get('realname');
                break;
            }
        }
         basicForm.findField('dutyperson').setValue(dutyperson);
         basicForm.findField('uids').setValue(rec.get('uids'));
        
    }
    function deleteDutyPerson(){
        var rec = dutyPersonGrid.getSelectionModel().getSelected();
        if(typeof(rec)=='undefined'){
            Ext.Msg.alert('提示信息','请选择要删除的数据');
            return ;
        }
        DWREngine.setAsync(false);
        PcWarnService.deleteDutyPerson(rec.get('uids'),function(rtn){
        })
        //dutyPersonStore.baseParams.params=' moduleid in ('+str+')';
        dutyPersonStoreReload();
        DWREngine.setAsync(true);
    } 
    function changePersonShow(){
		cuserWindow.show();
    }
    function savedutyperson(){
        //保存记录
       var basicForm = addPersonFormPanel.getForm();
       if(basicForm.isValid()){
           var moduleid = basicForm.findField('personmoduleid').getValue();
           var dutyperosnid = basicForm.findField('dutyperosnid').getValue();
           var uids = basicForm.findField('uids').getValue();
           if(dutyperosnid==''){
               Ext.Msg.alert('提示信息','请选择责任人');
               return ;
           }
           var obj = new Object();
               obj.moduleid = moduleid;
               obj.dutyperson = dutyperosnid;
               if(uids!=''){
                  obj.uids = uids;
               }
               DWREngine.setAsync(false);
               
               PcWarnService.vilidatePersonOnly(moduleid,dutyperosnid,uids,function (rtn){
                   if(rtn =='2'){
                       Ext.Msg.alert('提示信息','一个项目单位只能对应一个责任人');
                       return ;
                   }else {
                   
                       PcWarnService.addDutyPerson(obj,function(rtn){
                       });
                   }
               })
               DWREngine.setAsync(true);
               addPersonFormPanel.getForm().reset();
               showPersonWin.hide();
               //dutyPersonStore.baseParams.params=' moduleid in ('+str+')';
               dutyPersonStoreReload();
       }
    }       
})