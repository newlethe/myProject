var addBackWin = addBackWin || {}; 

(function(){
	
	var bean = "com.imfav.business.customer.hbm.CustBack";
	
	var Columns = [
		{name: 'uids', type: 'string'}
		,{name: 'custUids', type: 'string'}
		,{name: 'backMoney', type: 'float'}
		,{name: 'backTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'addUser', type: 'string'}
		,{name: 'addTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	uids:''
    	,custUids: ''
    	,backMoney: 0
    	,backTime: SYS_DATE_DATE
    	,addUser: USERID
    	,addTime: SYS_DATE_DATE
    }	
    
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'custUids':{name:'custUids',fieldLabel:'客户'}
		,'backMoney':{name:'backMoney',fieldLabel:'定金'}
		,'backTime':{name:'backTime',fieldLabel:'回款时间',format:'Y-m-d',readOnly:true}
		,'addUser':{name:'addUser',fieldLabel:'添加人'}
		,'addTime':{name:'addTime',fieldLabel:'添加时间',format:'Y-m-d'}
	};
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm
    	, {id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hideable:false,hidden:true}
    	, {id:'custUids',header: fc['custUids'].fieldLabel,dataIndex: fc['custUids'].name,hideable:false,hidden:true}
    	, {id:'backMoney',header: fc['backMoney'].fieldLabel,dataIndex: fc['backMoney'].name,width:80,
    		align:'right',editor:new Ext.form.NumberField(fc['backMoney'])}
    	, {id:'backTime',header: fc['backTime'].fieldLabel,dataIndex: fc['backTime'].name,
    		align:"center",editor:new Ext.form.DateField(fc['backTime']),
    		renderer:formatDate}
    	, {id:'addUser',header: fc['addUser'].fieldLabel,dataIndex: fc['addUser'].name,
    		align:"center",renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'addTime',header: fc['addTime'].fieldLabel,dataIndex: fc['addTime'].name,
    		align:"center",renderer : formatDate}
	]);
	cm.defaultSortable = true;

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
	
	
	
	var tbarArr  = [];
	
	var gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: tbarArr,
		addBtn : true,
		saveBtn : !hideBtn,
		delBtn : !hideBtn,
		border: false,
		header: false,
		region: 'center',
		autoScroll: true,
		collapsible: false,
		animCollapse: false,
		loadMask: true,
		bbar: new Ext.PagingToolbar({
		    pageSize: PAGE_SIZE,
		    store: ds,
		    displayInfo: true,
		    displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		}),
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		plant: Plant,				
		plantInt: PlantInt,	
		servletUrl: MAIN_SERVLET,		
		bean: bean,					
		business: business,	
		primaryKey: primaryKey
		,listeners: {
			'beforeedit' : function(obj){
				if(hideBtn){
					 return false;
				}
			}
		}
	});
	
	
	addBackWin = new Ext.Window({
		width: 600,
		height: 400,
		modal: true, 
		plain: true, 
		border: false,
		title: '编辑回款信息',
		resizable: false,
		layout: 'fit',
		closeAction : 'hide',
		items: [gridPanel]
		,showBackWin: showBackWin
		,closeBackWin: closeBackWin
		,listeners : {
			hide : function(){
				var sql = "UPDATE CRM_CUSTOMER T SET T.BACK = (SELECT NVL(SUM(C.BACK_MONEY),0) FROM CRM_CUST_BACK C WHERE C.CUST_UIDS = T.UIDS)";
				baseDao.updateBySQL(sql);
			}
		}
	});
	
	var closeBtn = new Ext.Button({
		id:'close',
		text:'关闭窗口',
		iconCls: 'remove',
		handler:function(){
			addBackWin.hide();
		}
	});
	
	function showBackWin(custUids,editable){
		addBackWin.show();
		if(!editable){
//			gridPanel.getTopToolbar().disable();
			gridPanel.getTopToolbar().items.get('add').disable();
			gridPanel.getTopToolbar().items.get('save').disable();
			gridPanel.getTopToolbar().items.get('del').disable();
		}
		gridPanel.getTopToolbar().add('->',closeBtn);
		PlantInt.custUids = custUids;
		ds.baseParams.params = " 1=1 and custUids = '"+custUids+"'";
		ds.load({params:{start:0,limit: PAGE_SIZE}});
	}
	
	function closeBackWin(custDs){
		custDs.reload();
	}
	
})();