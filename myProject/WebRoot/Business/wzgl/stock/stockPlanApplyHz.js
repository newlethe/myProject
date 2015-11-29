var bean = "com.sgepit.pmis.wzgl.hbm.WzCjsxb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'pm'

var beanHz = "com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub"
var primaryKeyHz = 'uids'
var orderColumnHz = 'pm'

var gridPanelHz,gridPanel;
var flowFilter;
var viewport;

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function(){	
	//汇总人
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user where unitid = '"+CURRENTAPPID+"' ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
	
	//汇总部门
	var deptArray = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where upunit = '"+CURRENTAPPID+"' order by unitid",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			deptArray.push(temp);
		}
    });
 	DWREngine.setAsync(true);	
	
	//流程状态
	var billArray = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('流程状态',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			billArray.push(temp);			
		}
    }); 
	DWREngine.setAsync(true);
	
	//是否有申请计划汇总模块
	var hzArray = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('申请计划汇总',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			hzArray.push(temp);			
		}
    }); 
	DWREngine.setAsync(true);
	//多项目不需要申请计划汇总模块，直接配置
	hzArray = [0,0];
	
	//汇总申请总金额
	var hzMoneyArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select hzuids,sum(dj*sqzsl) from wz_cjspb_hz_sub  where "+pidWhereString+"  group by hzuids",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			hzMoneyArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
	
	
	//-----------------申请计划细表中对应主表编号的申请总金额（wz_cjsxb)
	var cjxbdsArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select  bh,sum (dj*sqsl) from wz_cjsxb  where "+pidWhereString+"  group by bh",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			cjxbdsArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
	

	var selectWzHz = new Ext.Button({
		text: '选择物资',
		iconCls: 'save',
		handler: selectWzHzFun
	})
	
	var selectWz = new Ext.Button({
		text: '选择物资',
		iconCls: 'save',
		handler: selectWzFun
	})
    var queryWz = new Ext.Button({
        text : '查询',
        iconCls : 'option',
        handler : function(){
            showWindow(gridPanel);
        }
    });
    
	//从申请计划汇总从表中选择物资
	function selectWzHzFun(){
		var records = smHz.getSelections();
		if(records.length>0){
			var uidsArr = new Array();
			for(var i=0;i<records.length;i++){
	    		uidsArr.push(records[i].data.uids);
	    	}
			DWREngine.setAsync(false);
			stockMgm.saveStockPlanWzFromApplyHz(uidsArr,buyId,function(bool){
				if(bool){
					Ext.MessageBox.alert("提示","物资汇总成功"); 
				}else{
					Ext.MessageBox.alert("提示","物资汇总失败");    	
				}
			})
			DWREngine.setAsync(true);
			parent.selectWin.close();
			//parent.selectWin.hide();
		}else{
			Ext.MessageBox.alert("提示","请选择需要汇总的物资");
		}
	}
	//从未汇总的申请计划从表选择物资
	function selectWzFun(){
		var records = sm.getSelections();
		if(records.length>0){
			var uidsArr = new Array();
			for(var i=0;i<records.length;i++){
	    		uidsArr.push(records[i].data.uids);
	    	}
			DWREngine.setAsync(false);
			stockMgm.saveStockPlanWzFromApply(uidsArr,buyId,function(bool){
				if(bool){
					Ext.MessageBox.alert("提示","物资汇总成功"); 
				}else{
					Ext.MessageBox.alert("提示","物资汇总失败");    	
				}
			})
			DWREngine.setAsync(true);
			parent.selectWin.close();
			//parent.selectWin.hide();
		}else{
			Ext.MessageBox.alert("提示","请选择需要汇总的物资");
		}
	}
	
	
	//----从申请计划中选择物资
	
	var fc={
		'uids':{name:'uids',fieldLabel:'主键',hidden:true,hideLabel:true},
		'bh':{name:'bh',fieldLabel:'申请计划编号',allowBlank: false},
		'bm':{name:'bm',fieldLabel:'编码'},
		'pm':{name:'pm',fieldLabel:'品名'},
		'gg':{name:'gg',fieldLabel:'规格'},
		'dw':{name:'dw',fieldLabel:'单位'},
		'sqsl':{name:'sqsl',fieldLabel:'数量'},
		'dj':{name:'dj',fieldLabel:'单价'}
	}

	var Columns = [
		{name:'uids',type:'string'},
		{name:'bm',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dj',type:'string'},
		{name:'dw',type:'string'},
		{name:'sqsl',type:'float'},
		{name:'bh',type:'string'}
	]	
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
		{id:'bm',header:fc['bm'].fieldLabel,dataIndex:fc['bm'].name,type:'string',width:40},
		{id:'pm',header:fc['pm'].fieldLabel,dataIndex:fc['pm'].name,type:'string',width:60},
		{id:'gg',header:fc['gg'].fieldLabel,dataIndex:fc['gg'].name,type:'string',width:90},
		{id:'dj',header:fc['dj'].fieldLabel,dataIndex:fc['dj'].name,width:30},
		{id:'dw',header:fc['dw'].fieldLabel,dataIndex:fc['dw'].name,width:30},
		{id:'sqsl',header:fc['sqsl'].fieldLabel,dataIndex:fc['sqsl'].name,width:30},
		{id:'bh',header:fc['bh'].fieldLabel,dataIndex:fc['bh'].name,width:100}
	]);
	
	cm.defaultSortable = true;

	var ds = new Ext.data.GroupingStore({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params:" bh in (select bh from WzCjspb where billState=1 and "+pidWhereString+" ) and sqhzState='0' and cghzState='0' and "+pidWhereString+" "
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
		pruneModifiedRecords : true,
		
		remoteGroup : false,
		sortInfo : {
			field : orderColumn,
			direction : "ASC"
		}, // 分组
		groupField : orderColumn // 分组
	});
	ds.setDefaultSort(orderColumn, 'asc');	
	
	gridPanel = new Ext.grid.GridPanel({
		name:'panel',
		title:'未汇总申请计划',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>从申请计划中选择物资<B></font>&nbsp;','-',queryWz,'-',selectWz],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		view : new Ext.grid.GroupingView({ // 分组
			forceFit : true,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		})
	});
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	
	//----从申请计划汇总中选择物资
	var fcHz = {
		'uids':{name:'uids',fieldLabel:'主键'},
		'hzuids':{name:'hzuids',fieldLabel:'汇总主键'},
		'bm':{name:'bm',fieldLabel:'编码'},
		'pm':{name:'pm',fieldLabel:'品名'},
		'gg':{name:'gg',fieldLabel:'规格'},
		'dj':{name:'dj',fieldLabel:'单价'},
		'dw':{name:'dw',fieldLabel:'单位'},
		'sqzsl':{name:'sqzsl',fieldLabel:'数量'},
		'sqjhbh':{name:'sqjhbh',fieldLabel:'申请计划编号'},
		'sqjhhzbh':{name:'sqjhhzbh',fieldLabel:'申请计划汇总编号'},
		'bz':{name:'bz',fieldLabel:'备注'},
		'cghzState':{name:'cghzState',fieldLabel:'采购状态'}
	};
	
	var ColumnsHz = [
		
		{name:'uids',type:'string'},
		{name:'hzuids',type:'string'},
		{name:'bm',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dj',type:'string'},
		{name:'dw',type:'string'},
		{name:'sqzsl',type:'float'},
		{name:'sqjhbh',type:'string'},
		{name:'sqjhhzbh',type:'string'},
		{name:'bz',type:'string'},
		{name:'cghzState',type:'string'}
		
	];
		
	var smHz = new Ext.grid.CheckboxSelectionModel({singleSelect:false});

	var cmHz = new Ext.grid.ColumnModel([
		smHz,
		{id:'uids',header:fcHz['uids'].fieldLabel,dataIndex:fcHz['uids'].name,hidden:true},
		{id:'hzuids',header:fcHz['hzuids'].fieldLabel,dataIndex:fcHz['hzuids'].name,hidden:true},
		{id:'bm',header:fcHz['bm'].fieldLabel,dataIndex:fcHz['bm'].name,width:40},
		{id:'pm',header:fcHz['pm'].fieldLabel,dataIndex:fcHz['pm'].name,width:60},
		{id:'gg',header:fcHz['gg'].fieldLabel,dataIndex:fcHz['gg'].name,width:90},
		{id:'dj',header:fcHz['dj'].fieldLabel,dataIndex:fcHz['dj'].name,width:30},
		{id:'dw',header:fcHz['dw'].fieldLabel,dataIndex:fcHz['dw'].name,width:30},
		{id:'sqzsl',header:fcHz['sqzsl'].fieldLabel,dataIndex:fcHz['sqzsl'].name,width:30},
		{id:'sqjhbh',header:fcHz['sqjhbh'].fieldLabel,dataIndex:fcHz['sqjhbh'].name,hidden:true},
		{id:'sqjhhzbh',header:fcHz['sqjhhzbh'].fieldLabel,dataIndex:fcHz['sqjhhzbh'].name,width:100},
		{id:'bz',header:fcHz['bz'].fieldLabel,dataIndex:fcHz['bz'].name,hidden:true},
		{id:'cghzState',header:fcHz['cghzState'].fieldLabel,dataIndex:fcHz['cghzState'].name,hidden:true}
	]);
	
	cmHz.defaultSortable = true;//可排序
	
	var dsHz = new Ext.data.GroupingStore({
		baseParams:{
			ac:'list',
			bean:beanHz,
			business:business,
			method: listMethod,
			params:" hzuids in (select uids from WzCjspbHz where billState='1' and "+pidWhereString+" ) and cghzState='0' and "+pidWhereString+" "
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},ColumnsHz),
		remoteSort: true,
        pruneModifiedRecords: true,
        
        remoteGroup : false,
		sortInfo : {
			field : orderColumnHz,
			direction : "ASC"
		}, // 分组
		groupField : orderColumnHz // 分组
	});
	
	dsHz.setDefaultSort(orderColumnHz, 'desc');
	
	gridPanelHz = new Ext.grid.EditorGridTbarPanel({
		name:'hzPanel',
		title:'已汇总申请计划',
		ds : dsHz,
		cm : cmHz,
		sm : smHz,
		border : false,
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>从申请计划汇总中选择物资<B></font>&nbsp;','-',selectWzHz],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : dsHz,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		
		view : new Ext.grid.GroupingView({ // 分组
			forceFit : true,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		})
	});
	
	dsHz.load({params:{start:0,limit:PAGE_SIZE}});

	var tabs = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: false,
        split: true,
        plain: true,
        border: true,
        region: 'center',
        forceFit: true,
        items:[gridPanelHz,gridPanel]
    });	
    
    tabs.on('tabchange',function(value){
    	if('hzPanel'==value.getActiveTab().name){
    		//addBtn_fw.disable()
    		//delBtn_fw.disable()
    		//saveBtn_fw.disable()
    		//selectedData="";
    		//ds_fw.removeAll();
    	}else{
    		//addBtn_fw.enable()
    		//delBtn_fw.enable()
    		//saveBtn_fw.enable()
    		//selectedData="";
    		//ds_fw.removeAll();
    	}
    })
	
    if(hzArray.length>0 && hzArray[0][0]=='1'){
    	viewport = new Ext.Viewport({
		    layout:'border',
		    items:[tabs]
		});
    }else{
    	viewport = new Ext.Viewport({
		   layout:'fit',
		   items:[gridPanel] 
		});
    }


	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    }	
});