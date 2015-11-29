// 全局变量
var bean = "com.sgepit.pmis.contract.hbm.ConOve"
var beanSub = "com.sgepit.pmis.equipment.hbm.EquList"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var propertyName = "condivno"
var propertyValue = "04"  
var primaryKey = "conid"
var orderColumn = "conno"
var sxValue = "4"
var SPLITB = "`"
var pid = CURRENTAPPID;
var selectedConId = "";
var partBs= new Array();
var contractType= new Array();
var BillState = new Array();
var payways = new Array(); 
var macTypes = new Array();
var data_part = new Array();
 
Ext.onReady(function (){

	DWREngine.setAsync(false);  
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
			temp.push(list[i].codekey);		
			temp.push(list[i].codevalue);	
			BillState.push(temp);			
		}
    });  
    appMgm.getCodeValue('合同付款方式',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].codekey);		
			temp.push(list[i].codevalue);	
			payways.push(temp);			
		}
    });  
    appMgm.getCodeValue('合同划分类型',function(list){      //获取合同划分
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].codekey);
			temp.push(list[i].codevalue);
			contractType.push(temp);
		}
		contractType.push([-1,'所有合同']);
    });
    
    appMgm.getCodeValue('机组号',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].codekey);		
			temp.push(list[i].codevalue);	
			macTypes.push(temp);
		}
    });
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
	
	//----------------------------------------------主表grid----------------------------------------
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true })
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
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,
           type: 'string',
           width: 200
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           type: 'string',
           width: 120
        },{
           id:'conno',
           header: fc['conno'].fieldLabel,
           dataIndex: fc['conno'].name,
           width: 120,
           type: 'string',
           renderer: renderConno
        },{
           id: 'conname',
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           type: 'string',
           width: 120
        },{
           id: 'partybno',
           header: fc['partybno'].fieldLabel,
           dataIndex: fc['partybno'].name,
           width: 120,
           type: 'combo',
           store: dsPartB,
           renderer: partbRender
        },{
           id: 'conmoney',
           header: fc['conmoney'].fieldLabel,
           dataIndex: fc['conmoney'].name,
           width: 70,
           type: 'float',
           align: 'right',
           renderer: cnMoney
        },{
           id: 'signdate',
           header: fc['signdate'].fieldLabel,
           dataIndex: fc['signdate'].name,
           width: 90,
           type: 'date',
           renderer: formatDate
        },{
           id: 'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           disabled : true,
           type: 'combo',
           store: dsBillState,
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
	    	params: propertyName+"="+propertyValue
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        remoteSort: true,
        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    var grid = new Ext.grid.QueryExcelGridPanel({
        // basic properties
    	id: 'main-grid-panel',			
        ds: ds,						
        cm: cm,						
        sm: sm,						
        tbar: [{text: '合同信息'}],					
        height: 200,				
        iconCls: 'icon-show-all',	
        border: false,				
        region: 'center',
        clicksToEdit: 2,			
        header: false,				
        //frame: false,				
        autoScroll: true,			
        collapsible: false,			
        animCollapse: false,		
        autoExpandColumn: 2,		
        loadMask: true,				
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 7,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
   });
   
	//=======================================end========================================================
	//**************************************************************************************************
    //--------------------------------从表grid----------------------------------------------------------
    var smSub = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
    
    var fcSub = {		// 创建编辑域配置
    	 'sbId': {
			name: 'SB_ID',
			fieldLabel: '设备主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'sbMc': {
			name: 'SB_MC',
			fieldLabel: '专用工器具名称',
			anchor:'95%'
         },'ggxh': {
			name: 'GGXH',
			fieldLabel: '型号与规格',
			anchor:'95%'
		 },'dw': {
			name: 'DW',
			fieldLabel: '单位',
			anchor:'95%'
         }, 'zs': {
			name: 'ZS',
			fieldLabel: '数量',
			anchor:'95%'
		 }, 'dhsl': {
			name: 'DHSL',
			fieldLabel: '到货数量',
			anchor:'95%'
		 }, 'sccj': {
			name: 'SCCJ',
			fieldLabel: '制造商',
			anchor:'95%'
         }, 'dj': {
			name: 'DJ',
			fieldLabel: '单价',
			anchor:'95%'
         }, 'zj': {
			name: 'ZJ',
			fieldLabel: '现场到货总价',
			anchor:'95%'
         }, 'jzh': {
			name: 'JZH',
			fieldLabel: '机组号',
			anchor:'95%'
         }, 'ggDate': {
			name: 'GG_DATE',
			fieldLabel: '到货日期',
			format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         }
    }
    
    var ColumnsSub = [
		{name: 'SB_ID', type: 'string'},
		{name: 'SB_MC', type: 'string'},
		{name: 'GGXH', type: 'string'},
		{name: 'DW', type: 'string'},
		{name: 'ZS', type: 'float'},
		{name: 'DHSL', type: 'float'},
		{name: 'SCCJ', type: 'string'},		
		{name: 'DJ', type: 'float'},	
		{name: 'ZJ', type: 'float'},
		{name: 'JZH', type: 'string'},
		{name: 'GG_DATE', type: 'date', dateFormat: 'Y-m-d H:i:s'},
	];
	
	var cmSub = new Ext.grid.ColumnModel([
		smSub, {
			id: 'sbId',
			header: fcSub['sbId'].fieldLabel,
            dataIndex: fcSub['sbId'].name,
			hidden: true,
			width: 100
		}, {
			id: 'sbMc',
			header: fcSub['sbMc'].fieldLabel,
            dataIndex: fcSub['sbMc'].name,
			width: 150
		}, {
			id: 'ggxh',
			header: fcSub['ggxh'].fieldLabel,
            dataIndex: fcSub['ggxh'].name,
			width: 100
		}, {
			id: 'dw',
			header: fcSub['dw'].fieldLabel,
            dataIndex: fcSub['dw'].name,
			width: 50
		}, {
			id: 'zs',
			header: fcSub['zs'].fieldLabel,
            dataIndex: fcSub['zs'].name,
			width: 80
		}, {
			id: 'dhsl',
			header: fcSub['dhsl'].fieldLabel,
            dataIndex: fcSub['dhsl'].name,
			width: 80
		}, {
			id: 'sccj',
			header: fcSub['sccj'].fieldLabel,
            dataIndex: fcSub['sccj'].name,
			width: 150
		}, {
			id: 'dj',
			header: fcSub['dj'].fieldLabel,
            dataIndex: fcSub['dj'].name,
			width: 80
		}, {
			id: 'zj',
			header: fcSub['zj'].fieldLabel,
            dataIndex: fcSub['zj'].name,
			width: 80
		}, {
			id: 'jzh',
			header: fcSub['jzh'].fieldLabel,
            dataIndex: fcSub['jzh'].name,
			width: 80
		}, {
			id: 'ggDate',
			header: fcSub['ggDate'].fieldLabel,
            dataIndex: fcSub['ggDate'].name,
			width: 80,
			type: 'date',
            renderer: formatDate
		}
	]);
	cmSub.defaultSortable = true;					//设置是否可排序
   	
    // 4. 创建数据源
    dsSub = new Ext.data.SimpleStore({
    	fields: ColumnsSub
    });
	
    // 5. 创建grid: grid-panel
    var gridSub = new Ext.grid.GridPanel({
        // basic properties
    	id: 'sub-grid-panel',			//id,可选
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        tbar : [{text: '专用工器具信息'}],					//顶部工具栏，可选
        width : 800,				//宽
        height: 300,				//高
        iconCls: 'icon-show-all',	//面板样式
        border: false,				// 
        region: 'south',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
        split: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
   });
   
   if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [grid,gridSub],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [grid,gridSub]
        });
    }
    
    // 12. 加载数据
    ds.load({params:{
	    	start: 0,
	    	limit: 7
    }});
    
   // =======================================end========================================================
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
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
   	function BillStateRender(value, cellmeta, record){
   		var str = '';
   		for(var i=0; i<BillState.length; i++) {
   			if (BillState[i][0] == value) {
   				str = BillState[i][1]
   				break; 
   			}
   		}
   		
		var conid  = record.get('conid');
   		DWREngine.setAsync(false); 
   		conoveMgm.isEquInfo(conid, function(flag){
   			if (flag == true)
   				str = '<font color=#00ff00>'+str+'</font>';
   		});
   		DWREngine.setAsync(true);  
   		
   		return str;
   	}

    // 11. 事件绑定
	//sm.on('selectionchange', function(sm){ // grid 行选择事件
		//var record = sm.getSelected();
		//appid =record.get('conid')
		//dsSub.baseParams.params = "conid='"+appid+"' and sx='"+sxValue+"'";
		//dsSub.load();
    //});
    
    sm.on('selectionchange', catGridRowSelected);
    
    function catGridRowSelected(obj){
    	var record = sm.getSelected();
    	if (record == null || (record.get("conid")=="")) {
    		if (selectedConId != ""){
	    		selectedConId = "";
    		}
    	} else {
    		if (selectedConId != record.get("conid")) {
	    		selectedConId = record.get("conid");
    		}
    	}
    	if (selectedConId != "" && obj != null){
    		data_part.length = 0;
    		DWREngine.setAsync(false);
    		equInstruMgm.equInstruSub(selectedConId, sxValue, function(list){
    			for (var i = 0; i < list.length; i++) {
	    			var obj = new Array();
		    		obj.push(list[i].SB_ID);
		    		obj.push(list[i].SB_MC);
		    		obj.push(list[i].GGXH);
		    		obj.push(list[i].DW);
		    		obj.push(list[i].ZS);
		    		obj.push(list[i].DHSL);
		    		obj.push(list[i].SCCJ);
		    		obj.push(list[i].DJ);
		    		obj.push(list[i].ZJ);
		    		obj.push(list[i].JZH);
		    		obj.push(list[i].GG_DATE);
		    		data_part.push(obj);
    			}
    		});
    		DWREngine.setAsync(true);
    		dsSub.loadData(data_part);
    	}
    }
    
});





