var bean = "com.sgepit.pmis.contract.hbm.ConCha";
var primaryKey = "chaid";
var orderColumn = "chadate";
var propertyName = "conid";
var changeTypes = new Array();
var billTypes = new Array();
Ext.onReady(function (){
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowNumberer()
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);	
    appMgm.getCodeValue('合同变更类型',function(list){		//付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		changeTypes.push(temp);
    	}
    });
	appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });
    DWREngine.setAsync(true);

    var changeTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : changeTypes
    });
    
    var billTypestate = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : billTypes
    });
    
    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'chaid': {
			name: 'chaid',
			fieldLabel: '变更流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chano': {
			name: 'chano',
			fieldLabel: '变更编号',
			anchor:'95%'
         },'actionman': {
			name: 'actionman',
			fieldLabel: '经办人',
			anchor:'95%'
         }, 'chamoney': {
			name: 'chamoney',
			fieldLabel: '变更金额*',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
         }, 'chadate': {
			name: 'chadate',
			fieldLabel: '变更日期*',
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
			anchor:'95%'
         },'chatype': {
			name: 'chatype',
			fieldLabel: '变更类型*',
			displayField: 'v',
			valueField: 'k',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			store: changeTypeStore,
			lazyRender: true,
			listClass: 'x-combo-list-small',
			allowBlank: false,
			anchor:'95%'
         },'chareason': {
			name: 'chareason',
			fieldLabel: '变更原因*',
			height: 130,
			width: 490,
			allowBlank: false,
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注',
			height: 175,
			width: 490,
			anchor:'95%'
         }, 'filelsh': {
			name: 'filelsh',
			fieldLabel: '变更附件编号',
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '变更内容',
			//readOnly:true,
			hideLabel:true,
			height: 100,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         }
    }
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,						//第0列，checkbox,行选择器
    	{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,
           width: 120
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'chaid',
           header: fc['chaid'].fieldLabel,
           dataIndex: fc['chaid'].name,
           hidden: true,
           width: 120
        },{
           id:'chano',
           header: fc['chano'].fieldLabel,
           dataIndex: fc['chano'].name,
           width: 120,
           align : 'center',
       		renderer: renderchano
        },{
           id:'chamoney',
           header: fc['chamoney'].fieldLabel,
           dataIndex: fc['chamoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoneyToPrec
        },{
           id:'chadate',
           header: fc['chadate'].fieldLabel,
           dataIndex: fc['chadate'].name,
           width: 90,
           align : 'center',
           renderer: formatDate
        },{
           id:'chatype',
           header: fc['chatype'].fieldLabel,
           dataIndex: fc['chatype'].name,
           width: 120,
           align : 'center',
           renderer: changeTypesRender
        },{
           id:'actionman',
           header: fc['actionman'].fieldLabel,
           dataIndex: fc['actionman'].name,
           align : 'center',
           width: 120
        },{
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 120,
           align : 'center',
           renderer: billTypeRender
        },{
           id:'remark',
           header: fc['remark'].fieldLabel,
           dataIndex: fc['remark'].name,
           hidden: true,
           width: 120
        }
    ]);
    cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'chaid', type: 'string'},
		{name: 'chano', type: 'string'},
		{name: 'chamoney', type: 'float'},
		{name: 'chatype', type: 'string'},
		{name: 'chadate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'actionman', type: 'string'},
		{name: 'billstate', type: 'float'},
		{name: 'remark', type: 'string'}
	];

	
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	beanName: bean,				
	    	primaryKey: primaryKey,
	    	pid: PID,
	    	uids:UIDS
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: CONTEXT_PATH + "/servlet/DynamicServlet"
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    ds.load();
    // 5. 创建可编辑的grid: grid-panel
	var grid = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    tbar: ['->',new Ext.Button({
	                    text:'返回',
	                    iconCls :'returnTo',
	                    handler : function (){
	                        history.back();
	                     }
	    })],
	    border: false,
	    layout: 'fit',
	    region: 'center',
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    }
	});
	// 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
        	grid
        ],
        listeners: {
        }
    });
    
	
	
	
	

  
     function renderchano(value, metadata, record){
		var getChaid = record.get('chaid');
		var conId = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'PCBusiness/dynamicdata/conove/concha_detail.jsp?chaid='+getChaid+'\'">'+ value+'</span>'
		return output;
	}
  
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
	function renderConno(value){
		var output = '<div id="toLink" style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';">'+ value+'</div>'
		return output;
	}
    
    
    
    // 下拉列表中 k v 的mapping 
   	function changeTypesRender(value){	//变更类型
   		var str = '';
   		for(var i=0; i<changeTypes.length; i++) {
   			if (changeTypes[i][0] == value) {
   				str = changeTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
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




