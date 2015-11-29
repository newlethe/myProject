var bean1 = "com.sgepit.pmis.budget.hbm.BdgProject"
var listMethod = "findWhereOrderby";
var primaryKey1 = "proappid";
var orderColumn = "conid";
var SPLITB = "`";
var business = "baseMgm";
var currentPid = CURRENTAPPID;
var gridProject;
var widNew ;
var dsNew ;
var smNew ;
Ext.onReady(function (){
     var fm = Ext.form;
	 var fc = {		// 创建编辑域配置
    	'proappid': {
			name: 'proappid',
			fieldLabel: '工程量主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        }, 'pid':{
        	name : 'pid',
        	fieldLabel : 'pid',
        	hidden : true
        
        },
        'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			allowBlank: false,
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'prono': {
			name: 'prono',
			fieldLabel: '工程量编号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
        }, 'proname': {
			name: 'proname',
			fieldLabel: '工程量名称',
			allowBlank: false,
			anchor:'95%'
        }, 'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
		}, 'price': {
			name: 'price',
			fieldLabel: '单价',
			decimalPrecision:6,
			allowBlank: false,
			anchor:'95%'
		}, 'amount': {
			name: 'amount',
			fieldLabel: '总工程量',
			allowBlank: false,
			anchor:'95%'
		}, 'money': {
			name: 'money',
			fieldLabel: '金额',
			anchor:'95%'
		}, 'state': {
			name: 'state',
			fieldLabel: '状态',
			anchor:'95%'
		}, 'isper': {
			name : 'isper',
			fieldLabel : '总工程量是否带百分号'
		}
	}
	
    var Columns = [
    	{name: 'proappid', type: 'string'},
    	{name: 'pid', type : 'string'},
		{name: 'conid', type: 'string'},
		{name: 'bdgid', type: 'string'},    	
		{name: 'prono', type: 'string'},
    	{name: 'proname', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'amount', type: 'float'},
		{name: 'money', type: 'float'},
		{name: 'state', type: 'string'},
		{name: 'isper', type: 'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);
    	var PlantInt = {
    		pid : currentPid,
	    	conid:  null, 
	    	bdgid: null,
	    	prono: null,
	    	proname: null,
	    	unit: null,
	    	price: null,
	    	amount: null,
	    	money:null,
	    	state:'4'
    }
    smNew =  new Ext.grid.CheckboxSelectionModel({singleSelect : false})
    var cm = new Ext.grid.ColumnModel([
        smNew,
    	new Ext.grid.RowNumberer(),
    	{
           id:'proappid',
           header: fc['proappid'].fieldLabel,
           dataIndex: fc['proappid'].name,
		   hidden:true,
		   hideLabel:true
        }, {
        	id : 'pid',
        	header : fc['pid'].fieldLabel,
        	dataIndex : fc['pid'].name,
        	hidden : true
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'bdgid',
           header: fc['bdgid'].fieldLabel,
           dataIndex: fc['bdgid'].name,
           hidden:true,
           hideLabel:true
        },{
           id:'prono',
           header : fc['prono'].fieldLabel,
           dataIndex : fc['prono'].name,
           width :80,
           align : 'center'
        },{
           id:'proname',
           header: fc['proname'].fieldLabel,
           dataIndex: fc['proname'].name,
           width: 120,
           align : 'center'
        }, {
           id:'unit',
           header: fc['unit'].fieldLabel,
           dataIndex: fc['unit'].name,
           width: 50,
           align : 'center'
        }, {
           id:'price',
           align: 'price',
           header: fc['price'].fieldLabel,
           dataIndex: fc['price'].name,
           width: 50,
           align: 'right',
           renderer : cnMoney,
           allowBlank: true
        }, {
           id:'amount',
           header: fc['amount'].fieldLabel,
           dataIndex: fc['amount'].name,
           width: 70,
           align: 'right',
           allowBlank: true,
           renderer : function(v,m,r){
				return r.get('isper') == '1' ? (v*100).toFixed(2) + "%" : v;
           }
        }, {
           id:'money',
           header: fc['money'].fieldLabel,
           dataIndex: fc['money'].name,
           align: 'right',
           renderer: cnMoneyToPrec,
           width: 70
        }, {
           id:'state',
           header: fc['state'].fieldLabel,
           dataIndex: fc['state'].name,
           width: 40,
           align : 'center',
           renderer: function(value){
           		if(value == '4'){
           			value = '签订';
           		}
           	    return value;
           }
        }, {
			id:'isper',
			header: fc['isper'].fieldLabel,
			dataIndex: fc['isper'].name,
        	hidden : true
        }
	])
    cm.defaultSortable = true;
	    var totalField = new Ext.Button({
    		id:'total'
    		});
   	
    dsNew = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean1,				
	    	business: business,
	    	method: listMethod,
	    	params:  " conid = '"+ conid + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey1
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    dsNew.setDefaultSort(orderColumn, 'asc');		

    //分页保存勾选项
    storeSelects(dsNew,smNew,primaryKey1);

   gridProject = new Ext.grid.EditorGridTbarPanel({
    	id: 'module-grid-panel',
//    	renderTo : Ext.getBody(),
        ds: dsNew,
        cm: cm,
        sm: smNew,
        header: false,
//        tbar: [],
        iconCls: 'icon-by-category',
        region: 'center',
        split: true,
        width: 850,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 100,
        maxSize: 800,
        border: true,
        autoScroll: true,			//自动出现滚动条
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean1,	
      	saveBtn : true,
      	addBtn : true,
        delBtn : true,
      	business: "baseMgm",	
      	primaryKey: primaryKey1,	
		bbar:new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 10,
            store: dsNew,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
})