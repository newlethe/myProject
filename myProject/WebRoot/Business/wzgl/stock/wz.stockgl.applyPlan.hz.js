var bean = "com.sgepit.pmis.wzgl.hbm.WzCjspbHz"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'flowid'

var beanSub = "com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub"
var orderColumnSub = "bm";

var beanHz = "com.sgepit.pmis.wzgl.hbm.ViewWzCjspbHz"
var primaryKeyHz = 'uids'
var orderColumnHz = 'pm'


var maxStockBh = "";
var incrementLsh = 0;
var maxStockBhPrefix;

var PAGE_SIZE = 10;
var PAGE_SIZE_SUB = 20;
var selectedData,selectUids,selectBh;
var flowFilter=" 1=1 ";

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function(){

	if(isFlwTask || isFlwView){
		flowFilter = " flowid = '"+flowid+"' "
	}
	
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
	
	//汇总编号生成
	maxStockBhPrefix = USERNAME + new Date().format('ym');
	DWREngine.setAsync(false);	
	stockMgm.getStockPlanNewBh(maxStockBhPrefix,"flowid","wz_cjspb_hz",null,function(dat){
		if(dat != "")	{
			maxStockBh = dat;
			incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
		}	
	})
	DWREngine.setAsync(true); 
	if(isFlwTask && flowid!=null && flowid!="") maxStockBh = flowid;
	
	//申请总金额
	var hzMoneyArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select hzuids,sum(dj*sqzsl) from wz_cjspb_hz_sub where "+pidWhereString+"  group by hzuids ",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			hzMoneyArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
	
	
	var addBtnWz = new Ext.Button({
    	text:'选择汇总物资',
    	iconCls : 'add',
    	handler:addWZ
    })

	var fm = Ext.form;
	var fc = {
		'uids':{name:'uids',fieldLabel:'编号',hidden:true,hideLabel:true},
		'flowid':{name:'flowid',fieldLabel:'申请计划汇总编号'},
		'hzdate':{name:'hzdate',fieldLabel:'汇总日期',format:'Y-m-d H:i:s'},
		'hzdept':{name:'hzdept',fieldLabel:'汇总部门'},
		'hzuser':{name:'hzuser',fieldLabel:'汇总人'},
		'hzmoney':{name:'hzmoney',fieldLabel:'申请总金额'},
		'hzwzflbm':{name:'hzwzflbm',fieldLabel:'物资分类编码'},
		'billState':{name:'billState',fieldLabel:'审批状态'},
		'pid':{name:'pid',fieldLabel:'PID',value:CURRENTAPPID}
	};
	
	var Columns = [
		{name:'uids',type:'string'},
		{name:'flowid',type:'string'},
		{name:'hzdate',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'hzdept',type:'string'},
		{name:'hzuser',type:'string'},
		{name:'hzmoney',type:'string'},
		{name:'hzwzflbm',type:'string'},
		{name:'billState',type:'string'},
		{name:'pid',type:'string'}
	];
	
	
	var Plant = Ext.data.Record.create(Columns);
	var bill = "0";
	if(isFlwTask) bill = "-1"
	PlantInt = {
		uids:'',
		flowid:'',
		hzdate:new Date(),
		hzdept:USERDEPTID,
		hzuser:USERID,
		hzmoney:0,
		hzwzflbm:'',
		billState:bill,
		pid:CURRENTAPPID
	};
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
		{id:'flowid',header:fc['flowid'].fieldLabel,dataIndex:fc['flowid'].name,align:"center"},
		{id:'hzdate',header:fc['hzdate'].fieldLabel,dataIndex:fc['hzdate'].name,align:"center",
			editor:new fm.DateField(fc['hzdate']),
			renderer:formatDate},
		{id:'hzdept',header:fc['hzdept'].fieldLabel,dataIndex:fc['hzdept'].name,align:"center",
			renderer:function(value){
				for(var i = 0;i<deptArray.length;i++){
					if(value == deptArray[i][0]){
						return deptArray[i][1]
					}
				}
			}
		},
		{id:'hzuser',header:fc['hzuser'].fieldLabel,dataIndex:fc['hzuser'].name,align:"center",
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'hzmoney',header:fc['hzmoney'].fieldLabel,dataIndex:fc['hzmoney'].name,align:"center",
			renderer:function(value,cell,record){
				for(var i = 0;i<hzMoneyArr.length;i++){
					if(record.data.uids == hzMoneyArr[i][0]){
						return hzMoneyArr[i][1]
					}
				}
			}
		},
		{id:'hzwzflbm',header:fc['hzwzflbm'].fieldLabel,dataIndex:fc['hzwzflbm'].name,hidden:true},
		{id:'billState',header:fc['billState'].fieldLabel,dataIndex:fc['billState'].name,align:"center",
			renderer:function(value){
				for(var i=0;i<billArray.length;i++){
					if(billArray[i][0]==value){
						return billArray[i][1] 
					}
				}
			}
		},
		{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true}
	]);
	
	cm.defaultSortable = true;//可排序
	
	var ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params:" hzuser = '"+USERID+"' and "+flowFilter+" and "+pidWhereString
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
	});
	
	ds.setDefaultSort(orderColumn, 'desc');
	
	var height=286;
	if(isFlwTask||isFlwView) height=120;
	var gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		region:'north',
		border : false,
		height: height, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>申请计划汇总<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		insertHandler:insertData,
		//saveHandler:saveData,
		deleteHandler:deleteData,
		//expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey,
		//流程状态不为0时，取消编辑
		listeners: {
			beforeedit:function(e){
	            var currRecord = e.record;   
	            if (currRecord.get("billState") != '0')   
	                e.cancel = true;   
	        }
		}
	});
	
	gridPanel.on("afterinsert",function(){
		var rec = sm.getSelected();
		if(maxStockBh!= null){
			rec.set("flowid",maxStockBh);
		} else{
			incrementLsh = incrementLsh +1
			rec.set("flowid",maxStockBhPrefix + String.leftPad(incrementLsh,4,"0"))
		}
		maxStockBh = null;
	})
	
	ds.on('load',function(){
   		sm.selectFirstRow();   
   	});
	
	ds.load({params:{start:0,limit:PAGE_SIZE}});
    
    
    //-------------------------子表
    
    var fcSub = {
		'uids':{name:'uids',fieldLabel:'主键',hidden:true,hideLabel:true},
		'hzuids':{name:'hzuids',fieldLabel:'汇总主键',hidden:true,hideLabel:true},
		'bm':{name:'bm',fieldLabel:'编码'},
		'pm':{name:'pm',fieldLabel:'品名'},
		'gg':{name:'gg',fieldLabel:'规格'},
		'dj':{name:'dj',fieldLabel:'单价'},
		'dw':{name:'dw',fieldLabel:'单位'},
		'sqzsl':{name:'sqzsl',fieldLabel:'汇总数量'},
		'sqjhbh':{name:'sqjhbh',fieldLabel:'汇总申请计划编号'},
		'sqjhhzbh':{name:'sqjhhzbh',fieldLabel:'申请计划汇总编号'},
		'bz':{name:'bz',fieldLabel:'备注'}
	};
	
	var ColumnsSub = [
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
		{name:'bz',type:'string'}
	];
	
	
	var PlantSub = Ext.data.Record.create(ColumnsSub);

	PlantIntSub = {
		uids:'',
		hzuids:'',
		bm:'',
		pm:'',
		gg:'',
		dj:'',
		dw:'',
		sqzsl:'',
		sqjhbh:'',
		sqjhhzbh:'',
		bz:''
	};
	
	var smSub =  new Ext.grid.CheckboxSelectionModel();

	var cmSub = new Ext.grid.ColumnModel([
		smSub,
		{id:'uids',header:fcSub['uids'].fieldLabel,dataIndex:fcSub['uids'].name,hidden:true},
		{id:'hzuids',header:fcSub['hzuids'].fieldLabel,dataIndex:fcSub['hzuids'].name,hidden:true},
		{id:'bm',header:fcSub['bm'].fieldLabel,dataIndex:fcSub['bm'].name,align:"center",width:30},
		{id:'pm',header:fcSub['pm'].fieldLabel,dataIndex:fcSub['pm'].name,align:"center",width:40},
		{id:'gg',header:fcSub['gg'].fieldLabel,dataIndex:fcSub['gg'].name,align:"center",width:60},
		{id:'dj',header:fcSub['dj'].fieldLabel,dataIndex:fcSub['dj'].name,align:"center",width:30,
			renderer : function(value,cell){
				cell.attr = "style=background-color:#FBF8BF";
				return value.split(".")[0];
			},
			editor:new fm.NumberField(fc['dj'])
		},
		{id:'dw',header:fcSub['dw'].fieldLabel,dataIndex:fcSub['dw'].name,align:"center",width:20},
		{id:'sqzsl',header:fcSub['sqzsl'].fieldLabel,dataIndex:fcSub['sqzsl'].name,align:"center",width:30,
			renderer : function(value,cell){
				cell.attr = "style=background-color:#FBF8BF";
				return value;
			},
			editor:new fm.NumberField(fc['sqzsl'])
		},
		{id:'zje',header:'申请总金额',dataIndex:'',align:'center',width:50,
			renderer:function(value,cell,record){
				return record.data.sqzsl*record.data.dj
			}
		},
		{id:'bz',header:fcSub['bz'].fieldLabel,dataIndex:fcSub['bz'].name,align:"center",width:100,
			editor:new fm.TextField(fc['bz'])
		},
		{id:'sqjhbh',header:fcSub['sqjhbh'].fieldLabel,dataIndex:fcSub['sqjhbh'].name,align:"center",hidden:true},
		{id:'sqjhhzbh',header:fcSub['sqjhhzbh'].fieldLabel,dataIndex:fcSub['sqjhhzbh'].name,align:"center",hidden:true}
	]);
	
	cmSub.defaultSortable = true;//可排序
	
	var dsSub = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:beanSub,
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
            id: primaryKey
		},ColumnsSub),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	
	dsSub.setDefaultSort(orderColumnSub, 'asc');
	
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		region:'center',
		border : false,
		//height: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		addBtn:false,
		//delBtn:false,
		//saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : [],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE_SUB,
			store : dsSub,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		//insertHandler:insertData,
		//saveHandler:saveSubData,
		deleteHandler:deleteSubData,
		// expend properties
		plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSub,
		business : business,
		primaryKey : primaryKey
	});
	
	//dsSub.load({params:{start:0,limit:PAGE_SIZE_SUB}});
	
	
	//------------------汇总
	var huizongSave = new Ext.Button({
		text: '保存汇总',
		iconCls: 'save',
		handler: saveHzSub
	})
	var fcHz = {
		'uuid':{name:'uuid',fieldLabel:'主键'},
		'userid':{name:'userid',fieldLabel:'物资管理员'},
		'bm':{name:'bm',fieldLabel:'编码'},
		'pm':{name:'pm',fieldLabel:'品名'},
		'gg':{name:'gg',fieldLabel:'规格'},
		'dj':{name:'dj',fieldLabel:'单价'},
		'dw':{name:'dw',fieldLabel:'单位'},
		'sqzsl':{name:'sqzsl',fieldLabel:'数量'},
		'sqjhbh':{name:'sqjhbh',fieldLabel:'申请计划编号'},
		'xqrq':{name:'xqrq',fieldLabel:'需求日期',format:'Y-m-d H:i:s'},
		'pid':{name:'pid',fieldLabel:'PID',value:CURRENTAPPID,hidden:true}
	};
	
	var ColumnsHz = [
		{name:'uuid',type:'string'},
		{name:'userid',type:'string'},
		{name:'bm',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dj',type:'string'},
		{name:'dw',type:'string'},
		{name:'sqzsl',type:'float'},
		{name:'sqjhbh',type:'string'},
		{name:'xqrq',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'pid',type:'string'}
	];
	var smHz =  new Ext.grid.CheckboxSelectionModel();
	var cmHz = new Ext.grid.ColumnModel([
		smHz,
		{id:'uuid',header:fcHz['uuid'].fieldLabel,dataIndex:fcHz['uuid'].name,hidden:true},
		{id:'userid',header:fcHz['userid'].fieldLabel,dataIndex:fcHz['userid'].name,hidden:true},
		{id:'bm',header:fcHz['bm'].fieldLabel,dataIndex:fcHz['bm'].name,width:40},
		{id:'pm',header:fcHz['pm'].fieldLabel,dataIndex:fcHz['pm'].name,width:60},
		{id:'gg',header:fcHz['gg'].fieldLabel,dataIndex:fcHz['gg'].name,width:90},
		{id:'dj',header:fcHz['dj'].fieldLabel,dataIndex:fcHz['dj'].name,width:30},
		{id:'dw',header:fcHz['dw'].fieldLabel,dataIndex:fcHz['dw'].name,width:30},
		{id:'sqzsl',header:fcHz['sqzsl'].fieldLabel,dataIndex:fcHz['sqzsl'].name,width:30},
		{id:'xqrq',header:fcHz['xqrq'].fieldLabel,dataIndex:fcHz['xqrq'].name,renderer:formatDate,width:50},
		{id:'sqjhbh',header:fcHz['sqjhbh'].fieldLabel,dataIndex:fcHz['sqjhbh'].name,width:200},
		{id:'pid',header:fcHz['pid'].fieldLabel,dataIndex:fcHz['pid'].name,hidden:true}
	]);
		
	cmHz.defaultSortable = true;//可排序
	
	var dsHz = new Ext.data.GroupingStore({
		baseParams:{
			ac:'list',
			bean: beanHz,
			business:business,
			method: listMethod,
			params:" userid = '"+USERID+"' and "+pidWhereString+" "
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyHz
		},ColumnsHz),
        remoteSort : true,
        pruneModifiedRecords : true,
        
		remoteGroup : false,
		sortInfo : {
			field : orderColumnHz,
			direction : "ASC"
		}, // 分组
		groupField : orderColumnHz // 分组
		
	});
	
	dsHz.setDefaultSort(orderColumnHz, 'asc');
	
	var huizongPanel = new Ext.grid.GridPanel({
		ds: dsHz,
		cm: cmHz,
		sm: smHz,
		tbar : ['<font color=#15428b><B>物资管理员：'+REALNAME+'<B></font>','->',huizongSave],
		region:'center',
		border : false,
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE_SUB,
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
	
	dsHz.load({params:{start:0,limit:PAGE_SIZE_SUB}});
	
	var huizongWin = new Ext.Window({
		title:'选择申请计划汇总物资',
		//width:880,
		//height:450,
		width: document.body.clientWidth*0.9,
    	height: document.body.clientHeight*0.9,
		closeAction: 'hide',
		modal:true,
		plain:true,
		border: false,
		resizable: false,
		layout: 'fit',
		items: [huizongPanel]
	});

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel,gridPanelSub]
    });
    
    if (ModuleLVL < 3){
		gridPanelSub.getTopToolbar().add(addBtnWz,'-');
	}
    
    if(isFlwTask){
		DWREngine.setAsync(false);
		baseMgm.getData("select uids,flowid from wz_cjspb_hz where flowid='"+flowid+"' and "+pidWhereString+" ",function(list){
			if(list.length==0){
				gridPanel.defaultInsertHandler();
    			gridPanel.defaultSaveHandler();
			}
		})
		DWREngine.setAsync(true);
	}    
    
    //-------关联
    sm.on('rowselect',function(sm,rowIndex,record){
		selectUids = record.get('uids');
		selectBh = record.get('flowid');
		dsSub.baseParams.params = " hzuids = '"+selectUids+"' and "+pidWhereString+" "
		dsSub.reload({params:{start:0,limit:PAGE_SIZE}});

		if (record.get('billState') != '0') {
			if(isFlwView){
				gridPanel.getTopToolbar().disable();
				gridPanelSub.getTopToolbar().disable();
			}else if(isFlwTask){
				with(gridPanel.getTopToolbar().items){
			    	get('add').disable();
			    	get('del').disable();
			    }
				if(record.get('billState')!='-1') gridPanelSub.getTopToolbar().disable();
			}else{
				with(gridPanel.getTopToolbar().items){
			    	get('save').disable();
			    	get('del').disable();
			    }
				gridPanelSub.getTopToolbar().disable();
			}
		} else {
			if(isFlwView){
				gridPanel.getTopToolbar().disable();
				gridPanelSub.getTopToolbar().disable();
			}else if(isFlwTask){
				with(gridPanel.getTopToolbar().items){
			    	get('add').disable();
			    	get('del').disable();
			    }
				//gridPanelSub.getTopToolbar().disable();
			}else{
				with(gridPanel.getTopToolbar().items){
			    	get('save').enable();
			    	get('del').enable();
			    }
				gridPanelSub.getTopToolbar().enable()
			}
		}
	})
    
    //主表新增
    function insertData(){
    	this.defaultInsertHandler();
    	this.defaultSaveHandler();
    }
    
    //主表数据删除，同时删除对应从表数据
    function deleteData(){
    	//this.defaultDeleteHandler();
    	if(gridPanel.getSelectionModel().getSelected()){
			Ext.MessageBox.confirm('确认','删除操作将不可恢复，确认要删除吗？',function(btn,text){
				if (btn == "yes") {
					var record = sm.getSelected();
					var uids = record.data.uids; 
					DWREngine.setAsync(false);
					stockMgm.deleteApplyHzById(uids,function(bool){
						//alert(bool)
					})
					DWREngine.setAsync(true);
					ds.reload({params:{start:0,limit:PAGE_SIZE}});
					dsSub.reload({params:{start:0,limit:PAGE_SIZE_SUB}});
				}
			});
		}else{
			Ext.MessageBox.alert("提示","请选择需要删除的申请计划汇总");    	
		}
		
    }
    
	function addWZ(){
		if(gridPanel.getSelectionModel().getSelected()){
			dsHz.reload({params:{start:0,limit:PAGE_SIZE_SUB}});
			huizongWin.show(true);
		}else{
			Ext.MessageBox.alert("提示","请选择上面的申请计划汇总");    	
		}
	}
	
	function saveHzSub(){
		var records = smHz.getSelections();
		var dataArr = new Array();
		for(var i=0;i<records.length;i++){
    		dataArr.push(records[i].data);
    	}
		DWREngine.setAsync(false);
		stockMgm.saveApplyHzSub(dataArr,selectUids,selectBh,function(bool){
			if(bool){
				//Ext.MessageBox.alert("提示","物资汇总成功");
				if(isFlwTask == true){
					Ext.MessageBox.confirm(
						'保存成功！','您成功汇总了申请计划物资信息！<br>点击“Yes”可以发送到流程下一步操作！<br>点击“No”继续在本页汇总申请计划物资！',
						function(value){
							if ('yes' == value){
								parent.IS_FINISHED_TASK = true;
								parent.mainTabPanel.setActiveTab('common');
							}
						}
					);	   				
				}	
			}else{
				Ext.Msg.show({
					title : '提示',
					msg : "物资汇总失败",
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.ERROR
				});  	
			}
		})
		DWREngine.setAsync(true);
		huizongWin.hide();
		dsSub.reload({params:{start:0,limit:PAGE_SIZE_SUB}});
		dsHz.reload({params:{start:0,limit:PAGE_SIZE_SUB}});
	}
	
	function deleteSubData(){
		var records = smSub.getSelections();
		if(records.length>0){
			Ext.Msg.show({
				title : '确认',
				msg : '删除操作将不可恢复，确认要删除吗？',
				buttons : Ext.Msg.YESNO,
				icon: Ext.Msg.WARNING,
				fn : function(value) {
					if ('yes' == value) {
						var idsArr = new Array();
					for(var i=0;i<records.length;i++){
						idsArr.push(records[i].data.uids);
					}
					DWREngine.setAsync(false);
					stockMgm.deleteApplyHzSubById(idsArr,function(bool){
						if(bool){
							//Ext.MessageBox.alert("提示","删除物资成功"); 
						}else{
							Ext.Msg.show({
								title : '提示',
								msg : "物资汇总失败",
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});    	
						}
					})
					DWREngine.setAsync(true);
					dsSub.reload({params:{start:0,limit:PAGE_SIZE_SUB}});
					}
				}
			});
		}else{
			Ext.MessageBox.alert("提示","请选择需要删除的物资！");
		}
	}
	
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    }
    
})