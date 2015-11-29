var bean = "com.sgepit.pmis.wzgl.hbm.WzBillDefine"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bill_type'

Ext.onReady(function(){
	//--单据类型
	var billtypeArray = [['1','出库'],['-1','入库']];
 	var getBillTypeSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:billtypeArray
 	})
 	
	//--是否使用
 	var validArray = [['1','是'],['0','否']];
 	var getValidSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:validArray
 	}) 	
	
	//----------------------单据类型信息----------------------------//
	
	var fc = {
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},
		'billName':{
			name:'billName',
			fieldLabel:'单据名称',
			allowBlank: false,
			anchor:'95%'
		},
		'billType':{
			name:'billType',
			fieldLabel:'单据类型',
			valueField:'k',
			displayField:'v',
			mode:'local',
			store:getBillTypeSt,
			triggerAction: 'all',
			allowBlank: false,
			anchor:'95%'
		},
		'isvalid':{
			name:'isvalid',
			fieldLabel:'是否使用',
			valueField:'k',
			displayField:'v',
			triggerAction: 'all',
			mode:'local',
			store:getValidSt,
			anchor:'95%'
		}
	}
	
	var Columns = [
		{name:'uids',type:'string'},
		{name:'billName',type:'string'},
		{name:'billType',type:'string'},
		{name:'isvalid',type:'string'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids : '',
		billName : '',
		billType : '',
		isvalid:''
	}
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{	id:'uids'    ,  
			header:fc['uids'].fieldLabel    ,  
			dataIndex:fc['uids'].name, 
			hidden: true
		},
		{	id:'billName'    ,  
			header:fc['billName'].fieldLabel    ,  
			dataIndex:fc['billName'].name,
			width:70,
			editor:new Ext.form.TextField(fc['billName'])
		},
		{	id:'billType',  
			header:fc['billType'].fieldLabel,  
			dataIndex:fc['billType'].name,  
			width:40,
			renderer:function(value){
				for(var i = 0;i<billtypeArray.length;i++){
					if(value == billtypeArray[i][0]){
						return billtypeArray[i][1]
					}
				}
			},
			editor:new Ext.form.ComboBox(fc['billType'])},
		{	id:'isvalid'  ,  
			header:fc['isvalid'].fieldLabel  ,  
			dataIndex:fc['isvalid'].name, 
			width:40,
			renderer:function(value){
				for(var i = 0;i<validArray.length;i++){
					if(value == validArray[i][0]){
						return validArray[i][1]
					}
				}
			},
			editor:new Ext.form.ComboBox(fc['isvalid'])
		}
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
	
	var openCellBtn = new Ext.Button({
		id:'opencllbtn',
		text:'打开单据',
		iconCls:'btn',
		handler:openCell
	})
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>单据类型信息<B></font>','-',openCellBtn,'-'],
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
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel]
    });	
    
    
    function openCell(){
    	//打开CELL报表
    	if(gridPanel.getSelectionModel().getSelected()){
    		var record = gridPanel.getSelectionModel().getSelected();
    		//alert(record.get('uids')+"=="+record.get('billName')+"=="+record.get('billType')+"=="+record.get('isvalid'))
			with(document.all.dbnetcell0) {
				code = 'WZBILL'
				var t = record.get('billType')
				var n = record.get('billName')
				if(t == '1') {
					report_no = 'mat01'
				}
				else {
					report_no = 'mat02'
				}
				lsh = ''
				readOnly = true
				reportArgs = new Object()
				onReportOpened = "reportOpened"
				open()
			}
			
			
    	}
    }
    function reportOpened() {
	}

});