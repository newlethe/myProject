
var bean = "com.sgepit.pmis.gczl.hbm.Gczljjzbzb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bh'

var bean_fw = "com.sgepit.pmis.gczl.hbm.Gczljjzbxb"
var primaryKey_fw = 'uids'
var orderColumn_fw = 'bh'

var insertFlag = 0;
var PlantInt_fw, selectedData,ds_fw;
Ext.onReady(function(){
 	maxStockBhPrefix = USERNAME + new Date().format('ym');
	DWREngine.setAsync(false);	
	stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","Gczljjzbzb",null,function(dat){
		if(dat != "")	{
			maxStockBh = dat;
			incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
		}	
	})
	DWREngine.setAsync(true);
	//----------------------主表信息----------------------------//
	var fm = Ext.form;
	
	var fc = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'工程项目编号',allowBlank: false,anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'序号',allowBlank: false,anchor:'95%'},
		'rq':{name:'rq',fieldLabel:'<font color=red>填写日期</font>',anchor:'95%'},
		'scdw':{name:'scdw',fieldLabel:'<font color=red>生产单位</font>', anchor:'95%'},
		'jsdw':{name:'jsdw',fieldLabel:'<font color=red>建设单位</font>',anchor:'95%'},
		'zjz':{name:'zjz',fieldLabel:'<font color=red>质监站</font>',anchor:'95%'},
		'jz':{name:'jz',fieldLabel:'<font color=red>机组</font>', anchor:'95%'},
		'rq1':{name:'rq1',fieldLabel:'<font color=red>统计期间开始</font>',format: 'Y-m-d',anchor:'95%'},
		'rq2':{name:'rq2',fieldLabel:'<font color=red>统计期间结束</font>',format: 'Y-m-d',anchor:'95%'}
	}
	
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'bh',type:'string'},		{name:'pid',type:'string'},{name:'zjz',type:'string'},
		{name:'rq',type:'date',dateFormat:'Y-m-d H:i:s'}, {name:'scdw',type:'string'}, {name:'jsdw',type:'string'},     
		{name:'jz',type:'string'}, {name:'rq1',type:'date',dateFormat:'Y-m-d H:i:s'},	
		{name:'rq2',type:'date',dateFormat:'Y-m-d H:i:s'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		bh:'',    pid:CURRENTAPPID,   rq:new Date(),jz:'',rq1:'',rq2:'',scdw:'',jsdw:'',zjz:''
	}

	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids'     ,	  header:fc['uids'].fieldLabel     , dataIndex:fc['uids'].name, hidden: true},
		{id:'bh'       , 	  header:fc['bh'].fieldLabel       , dataIndex:fc['bh'].name},
		{id:'pid'       , 	  header:fc['pid'].fieldLabel       ,dataIndex:fc['pid'].name},
		{id:'rq'      , 	  header:fc['rq'].fieldLabel     ,   dataIndex:fc['rq'].name,renderer: formatDate,editor:new fm.DateField(fc['rq'])},
		{id:'jz'       , 	  header:fc['jz'].fieldLabel       , dataIndex:fc['jz'].name,editor:new fm.TextField(fc['jz'])},
		{id:'zjz'       , 	  header:fc['zjz'].fieldLabel       , dataIndex:fc['zjz'].name,editor:new fm.TextField(fc['zjz'])},
		{id:'jsdw'       , 	  header:fc['jsdw'].fieldLabel       , dataIndex:fc['jsdw'].name,editor:new fm.TextField(fc['jsdw'])},
		{id:'scdw'       , 	  header:fc['scdw'].fieldLabel       , dataIndex:fc['scdw'].name,editor:new fm.TextField(fc['scdw'])},
		{id:'rq1'      , 	  header:fc['rq1'].fieldLabel     ,  dataIndex:fc['rq1'].name,renderer: formatDate,editor:new fm.DateField(fc['rq1'])},
		{id:'rq2'      , 	  header:fc['rq2'].fieldLabel     ,  dataIndex:fc['rq2'].name,renderer: formatDate,editor:new fm.DateField(fc['rq2'])} 
	]);
	
	cm.defaultSortable = true;//可排序
	
	var ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params: "pid = '"+CURRENTAPPID+"' "
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
	
    
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		name:'xjh_panel',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>工程质量经济技术指标主表<B></font>'],
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
		deleteHandler : deleteZb,
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	function deleteZb(){
		if(sm.getSelected()==null) return false;
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
					text) {
			if (btn == "yes") {
				var record = sm.getSelected();
				DWREngine.setAsync(false);
				gczlMgm.deleteGczlZb(bean,bean_fw,record.get("bh"),function(bool){
					if(bool == true){
						ds.reload();
						ds_fw.reload();
					}
				})
				DWREngine.setAsync(true);
			}
		});
	}
	gridPanel.on("afterinsert",function(){
		var rec = sm.getSelected();
		if(maxStockBh!= null){
			rec.set("bh",maxStockBh);
		} else{
			incrementLsh = incrementLsh +1
			rec.set("bh",maxStockBhPrefix + String.leftPad(incrementLsh,4,"0"))
		}
		maxStockBh = null;
	})
	ds.on('load',function(ds1){
		sm.selectFirstRow();
   	});
	ds.load({
		params : {
			start : 0,
			limit : 20
		}
	});
    
    
    //---------------------- 细表范围----------------------------//
 	//var fm_fw = Ext.form;
	var fc_fw = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'工程项目编号',allowBlank: false,value:'',anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'编号',allowBlank: false,anchor:'95%'},
		'mc':{name:'mc',fieldLabel:'名称',anchor:'95%'},
		'bzz':{name:'bzz',fieldLabel:'<font color=red>标准值</font>',anchor:'95%'},
		'sjz':{name:'sjz',fieldLabel:'<font color=red>实际值</font>',anchor:'95%'},
		'bzxmbh':{name:'bzxmbh',fieldLabel:'<font color=red>标准项目代码</font>',anchor:'95%'},
		'jz':{name:'jz',fieldLabel:'<font color=red>机组</font>',anchor:'95%'},
		'bz':{name:'bz',fieldLabel:'<font color=red>备注</font>',anchor:'95%'},
		'lvl':{name:'lvl',fieldLabel:'<font color=red>层次</font>',anchor:'95%'},
		'yy':{name:'yy',fieldLabel:'<font color=red>未达到标准原因</font>',anchor:'95%'}
	}
	
	var Columns_fw = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
		{name:'bh',type:'string'},
		{name:'sjz',type:'string'},
		{name:'mc',type:'string'},
		{name:'yy',type:'string'},
		{name:'lvl',type:'string'},
		{name:'bzz',type:'string'},
		{name:'bz',type:'string'},
	    {name:'bzxmbh',type:'string'}, 	              
		{name:'jz',type:'string'}
	]	
	
	var Plant_fw = Ext.data.Record.create(Columns_fw);

	PlantInt_fw = {
		uids:'',
		pid:CURRENTAPPID,
		bh:'',
		mc:'',
		yy:'',
		bz:'',
		lvl:'',
		bzz:'',
		sjz:'',
		bzxmbh:'',
		jz:''
	}
	var sm_fw=  new Ext.grid.CheckboxSelectionModel();

	var cm_fw = new Ext.grid.ColumnModel([
		sm_fw,
		{   id:'uids',       header:fc_fw['uids'].fieldLabel,       dataIndex:fc_fw['uids'].name,     hidden: true},
		{	id:'pid',   	 header:fc_fw['pid'].fieldLabel,        dataIndex:fc_fw['pid'].name,      width:90 ,hidden: true},
		{	id:'bh',   		 header:fc_fw['bh'].fieldLabel,      	dataIndex:fc_fw['bh'].name,       width:90 },
		{	id:'bzxmbh',     header:fc_fw['bzxmbh'].fieldLabel,     dataIndex:fc_fw['bzxmbh'].name,   width:90 ,editor:new fm.TextField(fc_fw['bzxmbh'])},
		{	id:'mc',    	 header:fc_fw['mc'].fieldLabel,      	dataIndex:fc_fw['mc'].name,       width:90 ,editor:new fm.TextField(fc_fw['mc'])},
		{	id:'bzz',        header:fc_fw['bzz'].fieldLabel,        dataIndex:fc_fw['bzz'].name,      width:90 ,editor:new fm.TextField(fc_fw['bzz']) },
		{	id:'sjz',  	     header:fc_fw['sjz'].fieldLabel,        dataIndex:fc_fw['sjz'].name,      width:90 ,editor:new fm.TextField(fc_fw['sjz']) },
		{	id:'bz',         header:fc_fw['bz'].fieldLabel,         dataIndex:fc_fw['bz'].name,       width:90 ,editor:new fm.TextField(fc_fw['bz']) },
		{	id:'yy',         header:fc_fw['yy'].fieldLabel,         dataIndex:fc_fw['yy'].name,       width:90 ,editor:new fm.TextField(fc_fw['yy']) },
		{	id:'jz',         header:fc_fw['jz'].fieldLabel,         dataIndex:fc_fw['jz'].name,       width:90 ,editor:new fm.TextField(fc_fw['jz']) },
		{	id:'lvl',   	 header:fc_fw['lvl'].fieldLabel,      	dataIndex:fc_fw['lvl'].name,      width:90 ,editor:new fm.TextField(fc_fw['lvl'])  }
	]);
	
	cm_fw.defaultSortable = true;//可排序
	
    ds_fw = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_fw,
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
            id: primaryKey_fw
		},Columns_fw),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds_fw.setDefaultSort(orderColumn_fw, 'asc');
	var addBtn = new Ext.Button({
    	text:'新增',
    	iconCls : 'add',
    	handler:insertFun
    })
    var saveBtn = new Ext.Button({
    	text:'保存',
    	iconCls:'save',
    	handler:saveFun
    })
    var delBtn = new Ext.Button({
    	text:'删除',
    	iconCls:'remove',
    	handler:DelFun
    })
	function saveFun(){
    	gridPanel_fw.defaultSaveHandler()
    }	
	function DelFun(){
    	gridPanel_fw.defaultDeleteHandler()
    }	
    
	gridPanel_fw = new Ext.grid.EditorGridTbarPanel({
		ds : ds_fw,
		cm : cm_fw,
		sm : sm_fw,
		border : false,
		region : 'south',
		height: 300, 
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>工程质量经济技术指标<B></font>',addBtn,saveBtn,delBtn],
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
	
 
	
	//----------------------------------关联----------------------------------
	
	sm.on('rowselect',function(sm,rowIndex,record){
		var bh_fw = record.get('bh');
		ds_fw.baseParams.params = " bh='"+bh_fw+"'";
		ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
		selectedData = record.get('bh');
		PlantInt_fw.bh = record.get('bh');
	})

    function insertFun(){
    	if(sm.getSelected()==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择上面的主表信息！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		gridPanel_fw.defaultInsertHandler()
    	}
    }	

    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel,gridPanel_fw]
    });	
     
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
});