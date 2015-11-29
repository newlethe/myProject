var saveBtn;
var treePanelTitle = "设备清单维护";
var partBs= new Array();
var bean = "com.sgepit.pmis.finalAccounts.interfaces.vo.MatStockOutVO"
var business = "financialAuditService"
var listMethod = "getMatStockOut"
var primaryKey = "outId"
var orderColumn = "outType"
var ds ;

Ext.onReady(function (){
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
	
	//---------------------------------------------------物资出库单 grid begin ----------------------------------------------------------------
	// 1. 创建选择模式
    sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
    // 2. 创建列模型
    var fm = Ext.form;			

    var fc = {		// 创建编辑域配置
    	 	'outId': {
			name: 'outId',
			fieldLabel: '出库单主键',
			anchor:'95%',
			hidden: true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			hidden: true,
			hideLabel:true,
			anchor:'95%'
         }, 'outNo': {
			name: 'outNo',
			fieldLabel: '出库单编号',
			anchor:'95%'
         }, 'outType': {
			name: 'outType',
			fieldLabel: '出库类型',
			anchor:'95%'
         },'applyTime': {
			name: 'applyTime',
			fieldLabel: '出库申请日期',
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         },'applyUser': {
			name: 'applyUser',
			fieldLabel: '申请人',
			anchor:'95%'
         }
    }
   
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,{
           id:'outId',
           type: 'string',
           header: fc['outId'].fieldLabel,
           dataIndex: fc['outId'].name,
           hidden: true
        },{
           id:'pid',
           type: 'string',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true
        },{
           id:'outNo',
           type: 'string',
           header: fc['outNo'].fieldLabel,
           dataIndex: fc['outNo'].name,
           width: 50
        },{
           id: 'outType',
           type: 'string',
           header: fc['outType'].fieldLabel,
           dataIndex: fc['outType'].name,
           width: 40
        },{
           id: 'applyTime',
           type: 'date',
           header: fc['applyTime'].fieldLabel,
           dataIndex: fc['applyTime'].name,
           width: 60,
           renderer: formatDate
        },{
           id: 'applyUser',
           header: fc['applyUser'].fieldLabel,
           dataIndex: fc['applyUser'].name,
           width: 60,
           renderer: getApplyUserNameFun
        }
    ]);
    cm.defaultSortable = true;   						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'outId', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'outNo', type: 'string'},    	
		{name: 'outType', type: 'string'},
		{name: 'applyTime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'applyUser', type: 'string'}
	];
		
    
    // 4. 创建数据源
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: 'pid`' + CURRENTAPPID 
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount'
        }, Columns),
        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

	ds.on('beforeload', function(d){
		//ds.baseParams.params = " condivno = 'SB' ";
	});
	
	ds.on('load', function(d){
		sm.selectFirstRow();
	});
    
    var grid = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    tbar: [],
	    iconCls: 'icon-show-all',
	    border: false,
	    layout: 'fit',
	    region: 'center',
	    header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 5,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	//----------------------------------------------------------------出库单物资明细
	
// 7. 创建viewport加入面板content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [grid, gridSub]
    });
    
    if (ModuleLVL < 3) {
		gridSub.getTopToolbar().add(singleAuditBtn, '-', deleteAuditBtn);
	}
	gridSub.getTopToolbar().add('-', btnLook)
    
    ds.load({params:{start: 0, limit: 5}});
    
	sm.on('rowselect', function(){
		if (sm.hasSelection()){
			var outId = sm.getSelected().get('outId');
			dsSub.baseParams.params = "outId`"+ outId+";pid`"+CURRENTAPPID;
			dsSub.load({params:{start: 0,limit: PAGE_SIZE}});
		}
	})
	
   	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function getApplyUserNameFun(value) {
    	if(value && value.length>0) {
    		for(var i = 0;i<userArray.length;i++){
				if(value == userArray[i][0]){
					return userArray[i][1]
				}
			}
    	}
    }
});