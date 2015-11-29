var bean = "com.sgepit.pmis.contract.hbm.ConOve"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var propertyName = "condivno"
var propertyValue = "-1"
var SPLITB = "`"
//var contractType= [['01', '工程合同'],['02', '其他合同'],['03', '总承包合同'],['04', '设备(自营)合同'],['05','前期合同'],['06', '设备(总包)合同'],['-1', '所有合同']];
var partBs = new Array();
var contractType = new Array();
var BillState = new Array()
var conWindow;
var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true})

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
    
      
	// 1. 创建选择模式
    var smCon =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
    
    var btnConfirm = new Ext.Button({
		text: '确定选择',
		iconCls: 'save',
		handler: function(){
			var conid = smCon.getSelected().get('conid');
			if (conid){
				sm.getSelected().set('conid',conid);
				conWindow.hide();
			}else{
				Ext.Msg.show({
					title: '提示',
		            msg: '请选择一个合同',
		            icon: Ext.Msg.WARNING, 
		            width:300,
		            buttons: Ext.MessageBox.OK
				})
			}
		}
	});
    
    // 2. 创建列模型
    var fm = Ext.form;			

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
            disabledDays: [0, 6],
            disabledDaysText: '只能选择工作日！',
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
//            store: dsBillState,
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
    var cmCon = new Ext.grid.ColumnModel([		// 创建列模型
    	smCon,{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,
           type: 'string',
           width: 200
        },{
           id:'conno',
           header: fc['conno'].fieldLabel,
           dataIndex: fc['conno'].name,
           width: 120,
           type: 'string',
           renderer: renderConno
        },{
           id:'conname',	
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 120,
           type: 'string'
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
           width: 60,
           renderer: formatDate
        }
      
    ]);
    cmCon.defaultSortable = true;   						//设置是否可排序

    // 3. 定义记录集
    var ColumnsCon = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conno', type: 'string'},    	
		{name: 'conname', type: 'string'},
    	{name: 'partybno', type: 'string'},
		{name: 'conmoney', type: 'float'},
		{name: 'billstate', type: 'string'},
		{name: 'signdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}];
	var Fields = ColumnsCon.concat([	
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
	

    
    // 4. 创建数据源
    var dsCon = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business, 
	    	method: listMethod,
	    	params: null
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
        }, ColumnsCon),
		//sortInfo:{field:'conid',direction:'DESC'},
        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsCon.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    
    // 在grid的tbar上增加 ComboBox
    var combo = new Ext.form.ComboBox({
        store: dsContractType,
        displayField:'v',
        valueField:'k',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'选择合同分类....',
        selectOnFocus:true,
        width:135
    });
	combo.on('select',comboselect);   
    
    function comboselect(){
    	var conDiv = combo.getValue();
	     if (conDiv == "-1") {
	    	dsCon.baseParams.params = null
	    } else if (conDiv == "-2") {
	    	dsCon.baseParams.params = propertyName+" is null"
	    } else {
	    	dsCon.baseParams.params = propertyName+"='"+conDiv+"'"
	    }
	    dsCon.load({
	    	params:{
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
	    })
    }
    
    var gridCon = new Ext.grid.GridPanel({
	    store: dsCon,
	    cm: cmCon,
	    sm: smCon,
	    tbar: [combo,'-', btnConfirm, '-'],
	    iconCls: 'icon-show-all',
	    border: false,
	    layout: 'fit',
	    region: 'center',
	    header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: false,				//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsCon,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
	    width:800,
	    height:300
	});
	
	

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
		output += 'jsp/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ value+'</span>'
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
   	 
   



