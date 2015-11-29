﻿var bean = "com.sgepit.pmis.contract.hbm.ConOve"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"  
var gridPanelTitle = "所有记录"
var formPanelTitle = "编辑记录（查看详细信息）"
var propertyName = "condivno"
var propertyValue = "1"
var SPLITB = "`"
var partBs= new Array();
var payways = new Array();
var contSort2_sb = new Array();
var BillState = new Array();
var partbWindow;
var partbDet;
var partBField;

Ext.onReady(function (){
	
	var contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
	var contractType = new Array();		//合同一级分类
	//根据属性代码中对应“合同划分类型”中查询出设备合同，“详细设置”列包含SB
	var sbSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.detail_type like '%SB%'";
	DWREngine.setAsync(false);
	baseMgm.getData(sbSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			contractType.push(temp);			
			contFilterId+="'"+list[i][0]+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length-1);
	})
	//搜索过滤条件
	fixedFilterPart = "condivno in ("+contFilterId+") and pid='" + CURRENTAPPID+"'";
	DWREngine.setAsync(true);
	
	
	DWREngine.setAsync(false);
	DWREngine.beginBatch(); 
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
    
    var dsContractType2 = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:contSort2_sb
    });
    
    var dsBillState = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:BillState
    });
      
	// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true})
    
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
            store: dsContractType2,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         },'signdate': {
			name: 'signdate',
			fieldLabel: '签订日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         }, 'convalue': {
			name: 'convalue',
			fieldLabel: '合同金额',
			readOnly : true,
			anchor:'95%'
         },'conmoney': {
			name: 'conmoney',
			fieldLabel: '合同签定金额',
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
			anchor:'95%'
         },'matmoney': {
			name: 'matmoney',
			fieldLabel: '质保金',
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
            hidden: true,
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
//            store: dsPayway,
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
           width: 100,
           renderer: renderConno
        },{
           id: 'conname',
           type: 'string',
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 150
        },{
           id: 'partybno',
           type: 'combo',
           header: fc['partybno'].fieldLabel,
           dataIndex: fc['partybno'].name,
           width: 120,
           renderer: partbRender,
           store: dsPartB
        },/*{
           id: 'conmoney',
           type: 'float',
           header: fc['conmoney'].fieldLabel,
           dataIndex: fc['conmoney'].name,
           width: 70,
           align: 'right',
           hidden: true,
           renderer: cnMoney
        },*/{
           id: 'signdate',
           type: 'date',
           header: fc['signdate'].fieldLabel,
           dataIndex: fc['signdate'].name,
           width: 90,
           renderer: formatDate
        },{
           id: 'billstate',
           type: 'combo',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           disabled : true,
           renderer: BillStateRender,
           store: dsBillState,
           hidden: true
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
	    	params: fixedFilterPart
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'cpid'
        }, Columns),
		//sortInfo:{field:'conid',direction:'DESC'},
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    // 在grid的tbar上增加 ComboBox
    var combo = new Ext.form.ComboBox({
        store: dsContractType,
        displayField:'v',
        valueField:'k',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'选择合同一级分类',
        selectOnFocus:true,
        width:135
    });
	
	combo.on('select',comboselect);   
    
    function comboselect(){
    	var value = combo.getValue();
    	var name = combo.getRawValue();
    	fixedFilterPart = "condivno = '"+value+"' and pid='" + CURRENTAPPID+"'";
	    ds.baseParams.params = fixedFilterPart
	    ds.load({params:{start: 0,limit: PAGE_SIZE}});
	    
	    //选择合同分类一后查询出合同分类二
    	var contSort2 = new Array();
    	contSort2.push(['-1','所有合同'])
	    DWREngine.setAsync(false);
	    appMgm.getCodeValue(name, function(list){
	    	for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);	
				temp.push(list[i].propertyName);
				contSort2.push(temp);
			}
			dsContractType2.loadData(contSort2)
			combo2.setValue('-1');
	    });
	    DWREngine.setAsync(true);
    }
    
    var combo2 = new Ext.form.ComboBox({
	    store: dsContractType2,
	    displayField:'v',
	    valueField:'k',
	    typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    emptyText:'选择合同二级分类',
	    selectOnFocus:true,
	    width:135
    });
    
    combo2.on('select',comboselect2); 	    
    function comboselect2(){
		var value = combo.getValue();
		var value2 = combo2.getValue();
		if(value2 != '-1'){
			fixedFilterPart =  " CONDIVNO = '"+value+"' and sort = '"+ value2 +"' and pid='" + CURRENTAPPID+"'" ;
		}else{
			fixedFilterPart =  " CONDIVNO = '"+value+"' and pid='" + CURRENTAPPID+"'" ;;
		}
		ds.baseParams.params = fixedFilterPart;
	    ds.load({params:{start: 0, limit: PAGE_SIZE }})		
    }   
    
    var grid = new Ext.grid.QueryExcelGridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    tbar: [combo,'-',combo2,'-'],
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

	// 10. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [grid],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [grid,{
        		id: 'form-remark',
        		collapsible:true,
				xtype: 'form', region: 'south', 
				border: false, height: 0,title:'设备合同状态分类',
				bodyStyle: 'padding: 5px 5px;', layout: 'fit',
				tbar: [
	        {id: 'con-getgoods', text: '<font color=green>已到货合同</font>', pressed: true, handler: doContractFilter,iconCls: 'btn'},'-',
	    	{id: 'con-open', text: '<font color=blue>已开箱合同</font>', pressed: true, handler: doContractFilter,iconCls: 'btn'},'-',
	    	{id: 'con-input', text: '<font color=green>已入库合同</font>', pressed: true, handler: doContractFilter,iconCls: 'btn'},'-',
	    	{id: 'con-out', text: '<font color=blue>已出库合同</font>', pressed: true, handler: doContractFilter,iconCls: 'btn'},'->',
	    	//{id: 'con-rec', text: '<font color=purple>已领用合同</font>', pressed: true, handler: doContractFilter,iconCls: 'btn'},'->',
	        {id: 'con-all', text: '<font color=green>所有合同</font>', pressed: true, handler: doContractFilter,iconCls: 'finish'} ,'-'    
	             ],
				items: [{}]
        	}]
        });
    }
   	 grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("4" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('conname')
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});

   var notesTip = new Ext.ToolTip({
	    	autoHeight : true, 
	    	autowidth : true,
	    	target: grid.getEl()
	    });
    // 12. 加载数据
    reload();
    function reload(){
	    ds.load({
	    	params: {
		    	start: 0,
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
		//if(USERORGID=='8a402a131bd9bff0011bde2419680027'){
		if(USERUNITID=='8a402a131bd9bff0011bde2419680027'){
			var getConid = record.get('conid');
			var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH;
			output += 'Business/contract/cont.generalInfo.pageview.jsp?conid='+getConid+'\'">'+ value+'</span>'
			return output;
		}else {
			return value;
		}
	}

   	  function doContractFilter(){
   	  	var conFilter = "";
   		var _type = this.id;
   		var _SQL = "-1", _conids = "";
   		if ('con-getgoods' == _type){
   		_SQL="select distinct conid from equ_get_goods_arr";
   		}else if ('con-open' == _type){
   		_SQL="select distinct conid from equ_open_box";
   		}else if ('con-rec' == _type){
   		_SQL="select distinct conid from equ_rec";
   		}else if ('con-input' == _type){
   		_SQL="select distinct conid from equ_get_goods";
   		}else if ('con-out' == _type){
   		_SQL="select distinct conid from equ_houseout";
   		}
    	if(_SQL!="-1"){
   		DWREngine.setAsync(false);
    	baseMgm.getData(_SQL, function(list){
    		if (list){
    			for (var i=0; i<list.length; i++){
    				_conids += "'"+list[i]+"'";
    				if (list.length - 1 != i) _conids += ',';
    			}
    			if (list.length == 0) _conids = "''";
    		}
    	});
    	DWREngine.setAsync(true);}
    	conFilter = _SQL=="-1"?'':(" and conid  in (" + _conids + ")");
    	ds.baseParams.params = fixedFilterPart + conFilter
    	ds.load({
	    	params:{start: 0, limit: PAGE_SIZE }
	    });
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

   sm.on('rowselect', function(sm){ // grid 行选择事件
   		var record = sm.getSelected();
   		parent.conid = record.get('conid');
   		parent.conno = record.get('conno');
   		parent.conname = record.get('conname');
   		parent.conmoney = record.get('conmoney');
   		parent.partyb = record.get('partybno');
   		
		var tb = parent.mainPanel.getTopToolbar();
		tb.items.get("getGoods").enable();
		tb.items.get("exitGoods").enable();
		//tb.items.get("rec").enable();
		tb.items.get("urge").enable();
		tb.items.get("arrival").enable();
		tb.items.get("openbox").enable();
		tb.items.get("setup").enable();
		tb.items.get("equipment").enable();		
    });
    
   sm.on('rowdeselect', function(sm){ // grid 行选择事件
		var tb = parent.mainPanel.getTopToolbar();
		tb.items.get("getGoods").disable();
		tb.items.get("exitGoods").disable();
		//tb.items.get("rec").disable();
		tb.items.get("urge").disable();
		tb.items.get("arrival").disable();
		tb.items.get("openbox").disable();
		tb.items.get("setup").disable();
		tb.items.get("equipment").disable();
    });
   	 
});