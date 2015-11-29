var bean = "com.sgepit.pmis.contract.hbm.ConOve"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var gridPanelTitle = "所有记录"
var formPanelTitle = "编辑记录（查看详细信息）"
var propertyName = "conid"
var propertyValue = "03"
var SPLITB = "`"
var pid = CURRENTAPPID;
var partBs= new Array();
var contractType= new Array();
var BillState = new Array();
var payways = new Array();
var arrConids;


Ext.onReady(function (){
	
	DWREngine.setAsync(false);  
	DWREngine.beginBatch(); 
	conCompletionMgm.getCompleteConids(function(conids){
		if (conids.length > 0) {
			arrConids = "(";
			for (var i = 0; i < conids.length; i++){
				arrConids += "'"+conids[i].CONID+"'";
				if (i < conids.length - 1) arrConids += ","
			}
			arrConids += ")";
		}
	});
	
	conpartybMgm.getPartyB(function(list){         //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
    
    appMgm.getCodeValue('合同状态',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			BillState.push(temp);			
		}
    });  
    
    appMgm.getCodeValue('合同付款方式',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			payways.push(temp);			
		}
    });  
    appMgm.getCodeValue('合同划分类型',function(list){      //获取合同划分
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			contractType.push(temp);
		}
		contractType.push([-1,'所有合同']);
    });
    DWREngine.endBatch();
  	DWREngine.setAsync(true);	
    
	var dsPartB = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: partBs
    });
    
    var dsContractType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:contractType
    });
    
    var dsPayway = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: payways
    });
    
    var dsBillState = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:BillState
    });
      
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 	'conid': {
			name: 'conid',
			fieldLabel: '主键',
			anchor:'95%',
			hidden: true,
			readOnly:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly:true,
			hidden: true,
			allowBlank: false,
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
         },'condivno': {
			name: 'condivno',
			fieldLabel: '合同分类编码',
			valueField:'k',
			displayField: 'v',
			inputType: 'select-one',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsContractType,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         },'signdate': {
			name: 'signdate',
			fieldLabel: '签订日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
			anchor:'95%'
         }, 'convalue': {
			name: 'convalue',
			fieldLabel: '合同金额',
			readOnly : true,
			anchor:'95%'
         },'conmoney': {
			name: 'conmoney',
			fieldLabel: '合同签定金额',
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         }, 'bidno': {
			name: 'bidno',
			fieldLabel: '招标编号',  
			anchor:'95%'
         }, 'partya': {
			name: 'partya',
			fieldLabel: '甲方',
			anchor:'95%'
         }, 'actionpartya': {
			name: 'actionpartya',
			fieldLabel: '甲方经办人', 
			anchor:'95%'
         }, 'partybno': {
			name: 'partybno',
			fieldLabel: '乙方编号',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsPartB,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         },'partybman': {
			name: 'partybman',
			fieldLabel: '乙方代表',
			anchor:'95%'
         },'partybphone': {
			name: 'partybphone',
			fieldLabel: '乙方代表电话',
			anchor:'95%'
         },'advmoney': {
			name: 'advmoney',
			fieldLabel: '预付款',
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         },'matmoney': {
			name: 'matmoney',
			fieldLabel: '质保金',
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         },'context': {
			name: 'context',
			fieldLabel: '合同摘要',
			height:200,
			width:200,
			anchor:'95%'
         },'billstate': {
			name: 'billstate',
			fieldLabel: '合同状态',
			readOnly : true,
			valueField:'k',
			displayField: 'v',
			emptyText:'合同审定', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsBillState,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         },'payper': {
			name: 'payper',
			fieldLabel: '付款比例',
			anchor:'95%'
         },'payway': {
			name: 'payway',
			fieldLabel: '付款方式',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsPayway,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         },'conadmin': {
			name: 'conadmin',
			fieldLabel: '合同管理员',
			anchor:'95%'
         }
    }
    //partBFiled = new fm.ComboBox(fc['partybno']);
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,
           width: 200
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'conno',
           header: fc['conno'].fieldLabel,
           dataIndex: fc['conno'].name,
           width: 60,
           renderer: renderConno
        },{
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 120
        },{
           header: fc['partybno'].fieldLabel,
           dataIndex: fc['partybno'].name,
           width: 120,
           renderer: partbRender
        },{
           header: fc['conmoney'].fieldLabel,
           dataIndex: fc['conmoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoney
        },{
           header: fc['signdate'].fieldLabel,
           dataIndex: fc['signdate'].name,
           width: 90,
           renderer: formatDate
        },{
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           disabled : true,
           width: 80,
           renderer: BillStateRender
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
		{name: 'billstate', type: 'string'},
		{name: 'signdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}];
	var Fields = Columns.concat([	
		{name: 'condivno', type: 'string'},
		{name: 'convalue', type: 'double'},						//表单增加的列
		{name: 'bidno', type: 'string'},
		{name: 'partya', type: 'string'},
		{name: 'actionpartya', type: 'string'},
		{name: 'advmoney', type: 'Double'},
		{name: 'matmoney', type: 'Double'},
		{name: 'context', type: 'long'},
		{name: 'payper', type: 'string'},
		{name: 'payway', type: 'string'},
		{name: 'conadmin', type: 'string'}
	])
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantFields = Ext.data.Record.create(Fields);		
    var PlantInt = {pid:CURRENTAPPID, conno:'',conname:'',partybno:'',conmoney:0,billstate:1}	//设置初始值
    var PlantFieldsInt = new Object();
    Ext.applyIf(PlantFieldsInt, PlantInt)
    PlantFieldsInt = Ext.apply(PlantFieldsInt, {condivno:'',convalue:0,bidno:'',partya:'',actionpartya:'',
    											advmoney:0,matmoney:0,context:'',
    											payper:'',payway:'',clearway:'',conadmin:''	
    											});		

    
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: null//propertyName+" in "+arrConids
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
            id: 'conid'
        }, Columns),
		//sortInfo:{field:'conid',direction:'DESC'},
        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    var grid = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    title: gridPanelTitle,
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
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
	    width:800,
	    height:300
	});

    var viewport = new Ext.Viewport({
        layout:'border',
        items: [grid]
    });

	// 11. 事件绑定
   	sm.on('rowselect', function(sm){ // grid 行选择事件
   		var record = sm.getSelected();
   		
   		parent.conid = record.get('conid');
   		parent.conno = record.get('conno');
   		parent.conname = record.get('conname');
   		
		var tb = parent.mainPanel.getTopToolbar();
   		if (record!=null) {
   			tb.items.get("equipment").enable();
    	}else{
   			tb.items.get("equipment").enable();
    	}
    });
   	
    // 12. 加载数据
    reload();
    function reload(){
	    ds.load({
	    	params: {
		    	start: 0,
		    	params: propertyName+" in "+arrConids,
		    	limit: PAGE_SIZE
	    	}
	    });
    }

    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };


	function renderConno(value, metadata, record){
		var getConid = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ value+'</span>'
		return output;
	}

   	
   	// 下拉列表中 k v 的mapping 
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
   	// 合同状态
   	function BillStateRender(value){
   		var str = '';
   		for(var i=0; i<BillState.length; i++) {
   			if (BillState[i][0] == value) {
   				str = BillState[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	 
});
   




