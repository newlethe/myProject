var beanGetGoods = "com.sgepit.pmis.equipment.hbm.EquGetGoodsArr";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var primaryKey = "ggid";
var orderColumn = "ggid";
var propertyName = "conid";
var propertyValue = conid;
//var macTypes = [[1,'#1'],[2,'#2'],[3,'公共'],[-1,'  ']];
var macTypes = new Array();
var SPLITB = "`";
var sm;
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 设备到货";

Ext.onReady(function(){
	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号',function(list){         //获取机组号
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				macTypes.push(temp);	
			}
	    });
    DWREngine.setAsync(true);
    var BUTTON_CONFIG = {
    	'btnQuery':{
		   text: '选择',
		   iconCls: 'option',
		   handler: selectFun
          }
    };
    
	
    var dsMachine = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: macTypes
	});
    
	var fm = Ext.form;
	
	var fc = {
		'conid': {name: 'conid',fieldLabel: '合同内部流水号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true
		}, 'pid': {name: 'pid',fieldLabel: '工程项目编号',readOnly: true,hidden: true,allowBlank: false,hideLabel: true,anchor: '95%'
		}, 'ggid': {name: 'ggid',fieldLabel: '到货主键',readOnly: true,hidden: true,allowBlank: false,hideLabel: true,nchor: '95%'
		}, 'ggNo': {name: 'ggNo',fieldLabel: '到货批号',anchor:'95%'
		}, 'ggDate': {name: 'ggDate',fieldLabel: '到货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'ggNum': {name: 'ggNum',fieldLabel: '到货件数',allowNegative: false,hidden: true,maxValue: 100000000,anchor:'95%'
		}, 'sgNo': {name: 'sgNo',fieldLabel: '发货通知单号',anchor:'95%'
		}, 'sgDate': {name: 'sgDate',fieldLabel: '发货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'sgMan': {name: 'sgMan',fieldLabel: '发运人',anchor:'95%'
		}, 'incasementNo': {name: 'incasementNo',fieldLabel: '装箱号',hidden: true,anchor:'95%'
		}, 'conveyance': {name: 'conveyance',fieldLabel: '运输工具',anchor:'95%'
		}, 'conveyanceNo': {name: 'conveyanceNo',fieldLabel: '运输工具号',hidden: true,anchor:'95%'
		}, 'faceNote': {name: 'faceNote',fieldLabel: '外观记录',hidden: true,anchor:'95%'
		}, 'layPlace': {name: 'layPlace',fieldLabel: '放置位置',anchor:'95%'
		}, 'remark': {name: 'remark',fieldLabel: '备注',hidden: true,anchor:'95%'
		}, 'receivenum': {name: 'receivenum',fieldLabel: '到货单号',hidden: true,anchor:'95%'
		
		}, 'yjfhrq': {name: 'yjfhrq',fieldLabel: '预计发货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',hidden: true,anchor:'95%'
		}, 'sjfhrq': {name: 'sjfhrq',fieldLabel: '发货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'yjdhrq': {name: 'yjdhrq',fieldLabel: '预计到货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',hidden: true,anchor:'95%'
		}, 'csno': {name: 'csno',fieldLabel: '供货厂商',anchor:'95%'
		}, 'dhph': {name: 'dhph',fieldLabel: '到货批号',anchor:'95%'
		}, 'fhtzd': {name: 'fhtzd',fieldLabel: '发货通知单编号',hidden: true,anchor:'95%'
		}, 'fhgz': {name: 'fhgz',fieldLabel: '发货港站',anchor:'95%'
		}, 'dhgz': {name: 'dhgz',fieldLabel: '到货港站',anchor:'95%'
		}, 'thr': {name: 'thr',fieldLabel: '提货人',anchor:'95%'
		}, 'fph': {name: 'fph',fieldLabel: '发票号',anchor:'95%'
		}, 'fpje': {name: 'fpje',fieldLabel: '发票金额',anchor:'95%'
		}, 'dhzt': {name: 'dhzt',fieldLabel: '到货状态',anchor:'95%'
		}, 'conjh_date': {name: 'conjh_date',fieldLabel: '合同交货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'consj_date': {name: 'consj_date',fieldLabel: '实际交货日期',width:45,format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'conys': {name: 'conys',fieldLabel: '运输合同',anchor:'95%'
		}, 'dhsb': {name: 'dhsb',fieldLabel: '到货设备概述',anchor:'95%'
		}
	};
	
	var Columns = [
		{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'ggid', type: 'string'},
		{name: 'ggNo', type: 'string'},
		{name: 'ggDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ggNum', type: 'float'},
		{name: 'sgNo', type: 'string'},
		{name: 'sgDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'sgMan', type: 'string'},
		{name: 'incasementNo', type: 'string'},
		{name: 'conveyance', type: 'string'},
		{name: 'conveyanceNo', type: 'string'},
		{name: 'faceNote', type: 'string'},
		{name: 'layPlace', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'receivenum', type: 'string'},
		
		{name:'yjfhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'sjfhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'yjdhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'csno',type:'string'},
		{name:'dhph',type:'string'},
		{name:'fhtzd',type:'string'},
		{name:'fhgz',type:'string'},
		{name:'dhgz',type:'string'},
		{name:'thr',type:'string'},
		{name:'fph',type:'string'},
		{name:'fpje',type:'float'},
		{name:'dhzt',type:'string'},
		{name:'conjh_date',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'consj_date',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'conys',type:'string'},
		{name:'dhsb',type:'string'}
	];
	
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		sm,
		{id: 'conid',header: fc['conid'].fieldLabel,dataIndex: fc['conid'].name,hidden: true,width: 100
		}, {id: 'pid',header: fc['pid'].fieldLabel,dataIndex: fc['pid'].name,hidden: true,width: 100
		}, {id: 'ggid',header: fc['ggid'].fieldLabel,dataIndex: fc['ggid'].name,hidden: true,width: 100
		//}, {id: 'ggNo',header: fc['ggNo'].fieldLabel,dataIndex: fc['ggNo'].name,hidden:true,editor: new fm.TextField(fc['ggNo'])
		}, {id: 'ggNo',header: fc['ggNo'].fieldLabel,dataIndex: fc['ggNo'].name
		}, {id: 'receivenum',header: fc['receivenum'].fieldLabel,dataIndex: fc['receivenum'].name,width: 100,hidden: true
		}, {id: 'ggDate',header: fc['ggDate'].fieldLabel,dataIndex: fc['ggDate'].name,width: 120,renderer: formatDate,editor: new fm.DateField(fc['ggDate'])
		}, {id: 'dhsb',header: fc['dhsb'].fieldLabel,dataIndex: fc['dhsb'].name,width: 80
		}, {id: 'ggNum',header: fc['ggNum'].fieldLabel,dataIndex: fc['ggNum'].name,hidden:true,hidden: true
		}, {id: 'sgNo',header: fc['sgNo'].fieldLabel,dataIndex: fc['sgNo'].name,hidden: true,width: 100,editor: new fm.TextField(fc['sgNo'])
		}, {id: 'sgDate',header: fc['sgDate'].fieldLabel,dataIndex: fc['sgDate'].name,width: 120,hidden: true,renderer: formatDate,editor: new fm.DateField(fc['sgDate'])
		}, {id: 'sgMan',header: fc['sgMan'].fieldLabel,dataIndex: fc['sgMan'].name,width: 80,hidden: true,editor: new fm.TextField(fc['sgMan'])
		}, {id: 'incasementNo',header: fc['incasementNo'].fieldLabel,dataIndex: fc['incasementNo'].name,width: 80,hidden: true
		}, {id: 'conveyance',header: fc['conveyance'].fieldLabel,dataIndex: fc['conveyance'].name,width: 80,editor: new fm.TextField(fc['conveyance'])
		}, {id: 'conveyanceNo',header: fc['conveyanceNo'].fieldLabel,dataIndex: fc['conveyanceNo'].name,width: 80,hidden: true 
		}, {id: 'faceNote',header: fc['faceNote'].fieldLabel,dataIndex: fc['faceNote'].name,width: 80,hidden:true,editor: new fm.TextField(fc['faceNote'])
		}, {id: 'layPlace',header: fc['layPlace'].fieldLabel,dataIndex: fc['layPlace'].name,width: 80,editor: new fm.TextField(fc['layPlace'])
		}, {id: 'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name,width: 80,hidden: true
		
		
		}, {id: 'yjfhrq',header: fc['yjfhrq'].fieldLabel,dataIndex: fc['yjfhrq'].name,width: 120,renderer: formatDate ,hidden: true
		}, {id: 'sjfhrq',header: fc['sjfhrq'].fieldLabel,dataIndex: fc['sjfhrq'].name,width: 120,renderer: formatDate 
		}, {id: 'yjdhrq',header: fc['yjdhrq'].fieldLabel,dataIndex: fc['yjdhrq'].name,width: 120,renderer: formatDate,hidden: true
		}, {id: 'csno',header: fc['csno'].fieldLabel,dataIndex: fc['csno'].name,width: 80
		}, {id: 'dhph',header: fc['dhph'].fieldLabel,dataIndex: fc['dhph'].name,width: 80
		}, {id: 'fhtzd',header: fc['fhtzd'].fieldLabel,dataIndex: fc['fhtzd'].name,width: 80,hidden: true
		}, {id: 'fhgz',header: fc['fhgz'].fieldLabel,dataIndex: fc['fhgz'].name,width: 80
		}, {id: 'dhgz',header: fc['dhgz'].fieldLabel,dataIndex: fc['dhgz'].name,width: 80
		}, {id: 'thr',header: fc['thr'].fieldLabel,dataIndex: fc['thr'].name,width: 80
		}, {id: 'fph',header: fc['fph'].fieldLabel,dataIndex: fc['fph'].name,width: 80
		}, {id: 'fpje',header: fc['fpje'].fieldLabel,dataIndex: fc['fpje'].name,width: 80
		}, {id: 'dhzt',header: fc['dhzt'].fieldLabel,dataIndex: fc['dhzt'].name,width: 80
		}, {id: 'conjh_date',header: fc['conjh_date'].fieldLabel,dataIndex: fc['conjh_date'].name,width: 120,renderer: formatDate 
		}, {id: 'consj_date',header: fc['consj_date'].fieldLabel,dataIndex: fc['consj_date'].name,width: 120,renderer: formatDate 
		}, {id: 'conys',header: fc['conys'].fieldLabel,dataIndex: fc['conys'].name,width: 80
		}
	]);
	cm.defaultSortable = true;
	
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanGetGoods,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName + "= '"+propertyValue+"' and ggid not in (select ggId from EquOpenBox where conid='"+conid+"')"  
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
    ds.setDefaultSort(orderColumn, 'asc');
    ds.load({
		params: {
			start: 0,
			limit: PAGE_SIZE2
		}
	});
	gridPanel = new Ext.grid.GridPanel({
    	id: 'cat-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [
        	 '-', 
        	BUTTON_CONFIG['btnQuery'], '-'
		],
        border: false,
        region: 'center',
        height: 400,
        title: bodyPanelTitle,
        enableDragDrop: true,          //一旦选中某行，就不能取消选中，除非选中其他行
        header: false,				//
        frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			//forceFit: true,
			ignoreAdd: true
		},bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE3,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});

 
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gridPanel] 
    });
    //数据加载
    
   	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
 function selectFun(){
 	var record = gridPanel.getSelectionModel().getSelected();
	if(record){
		window.close()
	    window.returnValue = record.get('dhsb')+"||"+record.get('csno')+"||"+record.get('ggDate')+"||"+record.get('ggid')
	}
 }   
});


