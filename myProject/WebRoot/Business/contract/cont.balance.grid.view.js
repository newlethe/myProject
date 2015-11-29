var bean = "com.sgepit.pmis.contract.hbm.ConBal"
var business = "conbalMgm"
var listMethod = "findByProperty"
var primaryKey = "balid"
var propertyName = "conid"
var propertyValue = g_conid;
var billTypes = [['1','未发送'],['0','处理中'],['-1','处理完毕']];
var SPLITB = "`"
var conObj = new Object();

Ext.onReady(function (){
	DWREngine.setAsync(false);
    var beanName = "com.sgepit.pmis.contract.hbm.ConOve";
    baseMgm.findById(beanName, g_conid, function(obj){
    	conObj = obj;
    });
    DWREngine.setAsync(true);
	
    var fcBalance = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'			
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'balid': {
			name: 'balid',
			fieldLabel: '结算编号',
			readOnly : true,
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称', 
			readOnly : true,         
			anchor:'95%'
         }, 'baldate': {
			name: 'baldate',
			format: 'Y-m-d',
            minValue: '2000-01-01',
			fieldLabel: '结算日期',          
			anchor:'95%'
         }, 'balappmoney': {
			name: 'balappmoney',
			fieldLabel: '结算审定金额',  
			allowNegative:false,   
			readOnly : true,     
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',  
			allowNegative:false,
			readOnly : true,        
			anchor:'95%'
         }, 'actman': {
			name: 'actman',
			fieldLabel: '经办人',
			readOnly : true,          
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			readOnly : true,          
			anchor:'95%'
         }, 'filelsh': {
			name: 'filelsh',
			fieldLabel: '结算附件编号',   
			hidden: true,   
			hideLabel:true,  
			readOnly : true,  
			anchor:'95%'
         }
    }

    var cmBalance = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           header: fcBalance['conid'].fieldLabel,
           dataIndex: fcBalance['conid'].name, 
           hidden:true,        
           width: 200
        },{
           id:'pid',
           header: fcBalance['pid'].fieldLabel,
           dataIndex: fcBalance['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'balid',
           header: fcBalance['balid'].fieldLabel,
           dataIndex: fcBalance['balid'].name,
           hidden: true,
           width: 120
        },{
           header: fcBalance['conname'].fieldLabel,
           dataIndex: fcBalance['conname'].name,
           width: 120,
           renderer: function(){return conObj.conname}
        },{
           header: fcBalance['baldate'].fieldLabel,
           dataIndex: fcBalance['baldate'].name,
           width: 120,
           renderer: formatDate
        },{
           header: fcBalance['balappmoney'].fieldLabel,
           dataIndex: fcBalance['balappmoney'].name,
           width: 90, 
           align: 'right',
           renderer: cnMoney        
        },{
           header: fcBalance['billstate'].fieldLabel,
           dataIndex: fcBalance['billstate'].name,
           width: 90,
           renderer: billTypeRender
        },{
           header: fcBalance['filelsh'].fieldLabel,
           dataIndex: fcBalance['filelsh'].name,
           width: 120,
           hidden:true
        }
    ]);
    cmBalance.defaultSortable = true;

    // 3. 定义记录集
    var ColumnsBalance = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'balid', type: 'string'},
		{name: 'conname', type: 'string'},
		{name: 'balappmoney', type: 'float'},
		{name: 'baldate', type: 'date', dateFormat:'Y-m-d H:i:s'},    	
		{name: 'billstate', type: 'float'},
		{name: 'filelsh', type: 'string'},
		{name: 'actman', type: 'string'},
		{name: 'remark', type: 'string'}
	];
 
    // 4. 创建数据源
    var storeBalance = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+SPLITB+propertyValue
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
        }, ColumnsBalance),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });

	storeBalance.on("load", function(ds){
		if (ds.getCount() > 0){
			parent.tabBalance.getEl().setDisplayed("block");
		}
	})

	var gridBalance = new Ext.grid.GridPanel({
        store: storeBalance,
        cm: cmBalance,
        border: false,
        //width:800,   
        autoScroll: true,			//自动出现滚动条
        autoShow: true,
        region: 'center',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}/*,        
        bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: storeBalance,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
        	})*/
    });

    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [gridBalance],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [gridBalance]
        });
    }

    storeBalance.load(/*{params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    }}*/);

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

	function billTypeRender(value){	//单据状态类型
   		var str = '';
   		for(var i=0; i<billTypes.length; i++) {
   			if (billTypes[i][0] == value) {
   				str = billTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
	
});