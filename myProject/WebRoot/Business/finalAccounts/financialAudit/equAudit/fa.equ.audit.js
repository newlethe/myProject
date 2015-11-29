var saveBtn;
var treePanelTitle = "设备清单维护";
var partBs= new Array();
var bean = "com.sgepit.pmis.contract.hbm.ConOve"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var ds ;

Ext.onReady(function (){
	//---------------------------------------------------合同 grid begin ----------------------------------------------------------------
	DWREngine.setAsync(false);  
	conpartybMgm.getPartyB(function(list){         //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
  	DWREngine.setAsync(true);	
   
	var dsPartB = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: partBs
    });
    
	// 1. 创建选择模式
    sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
    // 2. 创建列模型
    var fm = Ext.form;			

    var fc = {		// 创建编辑域配置
    	 	'conid': {
			name: 'conid',
			fieldLabel: '主键',
			anchor:'95%',
			hidden: true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			hidden: true,
			hideLabel:true,
			anchor:'95%'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号',
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称',
			anchor:'95%'
         },'signdate': {
			name: 'signdate',
			fieldLabel: '签订日期',
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         },'conmoney': {
			name: 'conmoney',
			fieldLabel: '合同签定金额',
			anchor:'95%'
         },'convalue': {
			name: 'convalue',
			fieldLabel: '合同总金额',
			anchor:'95%'
         }, 'partybno': {
			name: 'partybno',
			fieldLabel: '乙方单位',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsPartB,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         }
    }
   
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,{
           id:'conid',
           type: 'string',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true
        },{
           id:'pid',
           type: 'string',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true
        },{
           id:'conno',
           type: 'string',
           header: fc['conno'].fieldLabel,
           dataIndex: fc['conno'].name,
           width: 120
        },{
           id: 'conname',
           type: 'string',
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 120
        },{
           id: 'partybno',
           type: 'combo',
           header: fc['partybno'].fieldLabel,
           dataIndex: fc['partybno'].name,
           width: 120,
           renderer: partbRender
        },{
           id: 'conmoney',
           type: 'float',
           header: fc['conmoney'].fieldLabel,
           dataIndex: fc['conmoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoney
        },{
           id: 'convalue',
           type: 'float',
           header: fc['convalue'].fieldLabel,
           dataIndex: fc['convalue'].name,
           width: 70,
           align: 'right'
        },{
           id: 'signdate',
           type: 'date',
           header: fc['signdate'].fieldLabel,
           dataIndex: fc['signdate'].name,
           width: 40,
           renderer: formatDate
        }
    ]);
    cm.defaultSortable = true;   						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conno', type: 'string'},    	
		{name: 'conname', type: 'string'},
    	{name: 'partybno', type: 'string'},
		{name: 'conmoney', type: 'float'},
		{name: 'convalue', type: 'float'},
		{name: 'signdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
		
    
    // 4. 创建数据源
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
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
            id: 'cpid'
        }, Columns),
		//sortInfo:{field:'conid',direction:'DESC'},
        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

	ds.on('beforeload', function(d){
		ds.baseParams.params = " condivno = 'SB' and pid='" + CURRENTAPPID + "'";
	});
	ds.on('load', function(d){
		sm.selectFirstRow();
	});
    
    var grid = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    tbar: ["<font color=#15428b><b>&nbsp;设备合同</b></font>"],
	    iconCls: 'icon-show-all',
	    border: false,
	    height: 200,
	    region: 'north',
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
	
// 7. 创建viewport加入面板content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [grid,gridSub]
    });
    
    if (ModuleLVL < 3) {
		gridSub.getTopToolbar().add(singleAuditBtn, mergeAuditBtn, mergeToAuditBtn, '-', deleteAuditBtn);
	}
	gridSub.getTopToolbar().add('-', btnLook)
    
    ds.load({params:{start: 0, limit: 5}});
    
	sm.on('rowselect', function(){
		if (sm.hasSelection()){
			var conid = sm.getSelected().get('conid');
			dsSub.baseParams.params = "conid`"+ conid;
			dsSub.load({params:{start: 0,limit: PAGE_SIZE}});
		}
	})
	
//-----------------------------------------function --------------------------------------
	//乙方单位
   	function partbRender(value){
   		var str = '';
   		for(var i=0; i<partBs.length; i++) {
   			if (partBs[i][0] == value) {
   				str = partBs[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
});