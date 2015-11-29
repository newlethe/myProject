var bean = "com.sgepit.pmis.planMgm.hbm.PlanQuarter";
var business = "baseMgm";
var listMethod = "findwhereorderby"; 
var primaryKey = "uids";
var orderColumn = "quantitiesId"
var selectBdgId = "";
//页面布局描述
/*
   west 为概算树 center 为工程量投资计划明细表
*/
Ext.onReady(function(){
	var calAddupBtn = new Ext.Button({
			id: 'calAddup',
			text: '重新计算累计值',
			tooltip: '计算累计值',
			iconCls: 'btn',
			hidden :true,
			handler: function(){
				gridSave();
			}
		});
	var initDataBtn = new Ext.Button({
			id: 'initData',
			text: '重新初始化数据',
			tooltip: '初始化计划数据',
			iconCls: 'btn',
			handler: function(){
				if(parent.selectMasterId != ""){
					investmentPlanService.initQuantitiesPlanData(parent.selectMasterId,function(dat){
						if(dat){
							ds.reload();
						}else{
							Ext.example.msg('错误', '数据初始化失败！', null);
						}
					});
				}else{
					Ext.example.msg('提示', '请先选择主记录！', null);
				}
				
			}
		});
	//	导出Excel
	var exportExcelBtn = new Ext.Button({
		id: 'export',
		text: '导出数据',
		tooltip: '导出数据到Excel',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler: function() {
			parent.exportDataFile();
		}
	});
	//DWREngine.setAsync(false);  
	//DWREngine.setAsync(true);  
	// 3. 定义记录集
	var Columns = [
		{name: 'pid', type: 'string'},
		{name: 'uids', type: 'string'},
		{name: 'masterId', type: 'string'},
		{name: 'sjType', type: 'string'},
		{name: 'businessType', type: 'string'},
		{name: 'quantitiesId', type: 'string'},//工程量ID
		{name: 'quantitiesName', type: 'string'},//工程量名称
		{name: 'quantitiesPrice', type: 'float'},//工程量单价
		{name: 'bdgId', type: 'string'},//概算ID
		{name: 'contractId', type: 'string'},//合同ID
		{name: 'unitId', type: 'string'},
		{name: 'dataType', type: 'string'},
		{name: 'quarterQuantities', type: 'float'},
		{name: 'quarterAmount', type: 'float'},
		{name: 'quantitiesAddup', type: 'float'},
		{name: 'perQuantitiesAddup', type: 'float'},
		{name: 'amountAddup', type: 'float'},
		{name: 'perAmountAddup', type: 'float'},
		{name: 'm1', type: 'float'},
		{name: 'm2', type: 'float'},
		{name: 'm3', type: 'float'},
		{name: 'remark', type: 'string'}
	];
	var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	pid: CURRENTAPPID,
    	uids:'',
    	masterId: parent.selectMasterId,
    	contractId: parent.selectConId,
    	sjType: parent.selectSjType,
    	businessType: parent.businessType,
    	bdgId: '',
    	unitId: parent.unitId,
    	dataType: "PLAN",
    	quarterQuantities: null,
    	quarterAmount: null,
    	quantitiesAddup: null,
    	amountAddup: null,
    	perAmountAddup: null,
    	m1: null,
    	m2: null,
    	m3: null,
    	remark: ''
    }	
	ds = new Ext.data.Store({ // 分组
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params : "master_id = '"+parent.selectMasterId+"'"
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    ds.on("beforeload",function(ds1){
    	var baseParams = ds.baseParams
    	if(selectBdgId != ""){
    		baseParams.params = "quantities_id is not null and master_id = '"+parent.selectMasterId+"' and bdg_id in ("+selectBdgId+")"
    	}else{
    		baseParams.params = "quantities_id is not null and master_id = '"+parent.selectMasterId+"'"
    	}
		
    })
    ds.on("load",function(ds1){
    	if(!parent.editEnalbe){
    		if(Ext.getCmp("save")) {
	    		Ext.getCmp("save").setDisabled(true)
    		}
    		initDataBtn.setDisabled(true)
    	}else{
    		if(Ext.getCmp("save")) {
	    		Ext.getCmp("save").setDisabled(false)
    		}
    		initDataBtn.setDisabled(false)
    		if (ModuleLVL >= 3) {
	    		initDataBtn.setDisabled(true)
    		}
    	}
    })
	var sm =  new Ext.grid.CheckboxSelectionModel()
	var fc = {
		'pid':   {name: 'pid',fieldLabel: '工程项目编号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true}
		, 'uids':   {name: 'uids',fieldLabel: '主键',ancher: '95%',readOnly: true,hidden: true,hideLabel: true}
		,'masterId':   {name: 'masterId',fieldLabel: '主记录编号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true}
		, 'sjType': {name: 'sjType',fieldLabel: '数据期别',disabled: true,allowBlank: false,anchor: '95%',hidden: true,hideLabel: true}
		, 'businessType': {name: 'businessType',fieldLabel: '业务类型',disabled: true,anchor: '95%',hidden: true,hideLabel: true}
		, 'quantitiesId': {	name: 'quantitiesId',fieldLabel: '工程量ID',allowBlank: false,anchor:'95%',hidden: true,hideLabel: true}
		, 'quantitiesName': {	name: 'quantitiesName',fieldLabel: '工程量名称',allowBlank: false,anchor:'95%',hidden: true,hideLabel: true}
		, 'bdgId': {name: 'bdgId',fieldLabel: '概算ID',allowBlank: false,anchor:'95%',hidden: true,hideLabel: true}
		, 'contractId': {name: 'contractId',fieldLabel: '合同ID',allowNegative: false,hidden: true,hideLabel: true,allowBlank: false,anchor:'95%'}
		, 'unitId': {name: 'unitId',fieldLabel: '填报单位ID',allowNegative: false,allowBlank: false,anchor:'95%',disabled: true,hidden: true,hideLabel: true}
		, 'dataType': {name: 'dataType',fieldLabel: '数据类型',anchor:'95%',hidden: true,hideLabel: true}
		, 'quarterQuantities': {name: 'quarterQuantities',fieldLabel: '本季度工程量',anchor:'95%'}
		, 'quantitiesAddup': {name: 'quantitiesAddup',fieldLabel: '工程量累计',anchor:'95%'}
		, 'perQuantitiesAddup': {name: 'perQuantitiesAddup',fieldLabel: '累计%',anchor:'95%'}
		, 'quantitiesPrice': {name: 'quantitiesPrice',fieldLabel: '单价',anchor:'95%'}
		, 'quarterAmount': {name: 'quarterAmount',fieldLabel: '本季度金额',anchor:'95%'}
		, 'amountAddup': {name: 'amountAddup',fieldLabel: '金额累计',anchor:'95%'}
		, 'perAmountAddup': {name: 'perAmountAddup',fieldLabel: '累计%',anchor:'95%'}
		, 'm1': {name: 'm1',fieldLabel: '头月',anchor:'95%'}
		, 'm2': {name: 'm2',fieldLabel: '中月',anchor:'95%'}
		, 'm3': {name: 'm3',fieldLabel: '末月',anchor:'95%'}
		,'remark':{name:'remark',fieldLabel:'备注',anchor:'95%'}
	};
	
	var editField = new Ext.form.NumberField(fc['quarterQuantities'])
	editField.on("change",function(obj,nv,ov){
		//alert(obj.)
	}) 
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hidden:true,width: 0}
    	, {id:'pid',header: fc['pid'].fieldLabel,dataIndex: fc['pid'].name,hidden:true,width: 0}
    	, {id:'sjType',header: fc['sjType'].fieldLabel,dataIndex: fc['sjType'].name,hidden:true,width: 0}
    	, {id:'unitId',header: fc['unitId'].fieldLabel,dataIndex: fc['unitId'].name,hidden:true,width: 0}
    	, {id:'dataType',header: fc['dataType'].fieldLabel,dataIndex: fc['dataType'].name,hidden:true,width: 0}
    	, {id:'businessType',header: fc['businessType'].fieldLabel,dataIndex: fc['businessType'].name,hidden:true,width: 0}
    	, {id:'contractId',header: fc['contractId'].fieldLabel,dataIndex: fc['contractId'].name,hidden:true,width: 0}
    	, {id:'bdgId',header: fc['bdgId'].fieldLabel,dataIndex: fc['bdgId'].name,hidden:true,width: 0}
    	, {id:'masterId',header: fc['masterId'].fieldLabel,dataIndex: fc['masterId'].name,hidden:true,width: 0}
    	, {id:'quantitiesId',header: fc['quantitiesId'].fieldLabel,dataIndex: fc['quantitiesId'].name,hidden:true,width: 0}
    	, {id:'quantitiesName',header: fc['quantitiesName'].fieldLabel,dataIndex: fc['quantitiesName'].name,width: 200,sortable : false}
    	
    	, {id:'m1',header: fc['m1'].fieldLabel,dataIndex: fc['m1'].name,width: 100,editor: new Ext.form.NumberField(fc['m1'])}
    	, {id:'m2',header: fc['m2'].fieldLabel,dataIndex: fc['m2'].name,width: 100,editor: new Ext.form.NumberField(fc['m2'])}
    	, {id:'m3',header: fc['m3'].fieldLabel,dataIndex: fc['m3'].name,width: 100,editor: new Ext.form.NumberField(fc['m3'])}
    	, {id:'quarterQuantities',header: fc['quarterQuantities'].fieldLabel,dataIndex: fc['quarterQuantities'].name,width: 100,
    		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
	           	var price = record.data.quantitiesPrice;
	           	var m1 = record.data.m1==""?0:record.data.m1;
	           	var m2 = record.data.m2==""?0:record.data.m2;
	           	var m3 = record.data.m3==""?0:record.data.m3;
	           	var val = parseFloat(m1)+parseFloat(m2)+parseFloat(m3);
	           	record.data.quarterQuantities = val;
	           	return val;
           }}    	
    	, {id:'quantitiesAddup',header: fc['quantitiesAddup'].fieldLabel,dataIndex: fc['quantitiesAddup'].name,width: 100}
    	, {id:'perQuantitiesAddup',header: fc['perQuantitiesAddup'].fieldLabel,dataIndex: fc['perQuantitiesAddup'].name,width: 100}
    	, {id:'quantitiesPrice',header: fc['quantitiesPrice'].fieldLabel,dataIndex: fc['quantitiesPrice'].name,width: 100,sortable : false }
    	, {id:'quarterAmount',header: fc['quarterAmount'].fieldLabel,dataIndex: fc['quarterAmount'].name,width: 100,
    		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
	           	var price = record.data.quantitiesPrice;
	           	var gcl = record.data.quarterQuantities;
	           	var val = price*gcl;
	           	record.data.quarterAmount = val;
	           	return val;
           }}
    	, {id:'amountAddup',header: fc['amountAddup'].fieldLabel,dataIndex: fc['amountAddup'].name,width: 100}
    	, {id:'perAmountAddup',header: fc['perAmountAddup'].fieldLabel,dataIndex: fc['perAmountAddup'].name,width: 100}
    	, {id:'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name,width: 200}
	])
    cm.defaultSortable = true;	
    gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        //title: "",		//面板标题
        //iconCls: 'icon-by-category',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant: Plant,				
      	plantInt: PlantInt,	
        addBtn : false,
        delBtn : false,
        saveHandler : gridSave,
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey
	});
	gridPanel.on("aftersave",function(){
		calAddData();
	})
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel,treePanelNew]
	});	
	gridPanel.getTopToolbar().add("->",calAddupBtn,'-',initDataBtn, '-', exportExcelBtn)
	ds.load({params:{start:0,limit: PAGE_SIZE}});
})
function gridSave(){
	gridPanel.defaultSaveHandler();	
}
function calAddData(){
	if(parent.selectMasterId != ""){
		investmentPlanService.updateDataAddup(parent.businessType, parent.selectConId, parent.selectSjType, function(d){
					if(d) {
						ds.reload();
					}
				});
	}else{
		Ext.example.msg('提示', '请先选择主记录！', null);
	}
	
}