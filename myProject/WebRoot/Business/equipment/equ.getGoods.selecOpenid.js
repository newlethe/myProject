
var uuid;
var bean = "com.sgepit.pmis.equipment.hbm.EquOpenBox"
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "uuid"
var orderColumn = "boxno"
var SPLITB = "`"
var pid = CURRENTAPPID;
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 所有开箱记录";
var selectWindow;
var selectedGgId;
var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];
var jzhType2 = [[5,'#1、#2机组'],[1,'#1机组-'],[2,'#2机组'],['','所有机组']];
var wzType = [[2,'设备'],[1,'备品备件'],[4,'专用工具'],['','所有类型']];
var formWindow;
var data = new Array();
var data_sub = new Array();
var data_rec = new Array();
var partBs= new Array();
var dsSub;
var queryWin,queryWin2;
var kxState='';
var billTypes = [[0,'待开箱'],[1,'处理中'],[2,'处理完毕'],[3,'被退回']];
var flowWindow;

Ext.onReady(function (){
	
     var BUTTON_CONFIG = {
	    'EDIT': {
	    	id: 'edit',
	    	text: '选择',
	    	iconCls: 'btn',
	    	handler: toHandler
	    }
    };
	
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
    
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    });   
    var dsJzh2 = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType2
    });       
	 var combox_wztype = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : wzType
    });
	// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'uuid': {
			name: 'uuid',
			fieldLabel: '开箱主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'ggId': {
			name: 'ggId',
			fieldLabel: '到货批次',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'buildPart': {
			name: 'buildPart',
			fieldLabel: '供货单位',
			anchor:'95%'
         }, 'fixPart': {
			name: 'fixPart',
			fieldLabel: '安装单位',
			anchor:'95%'
         }, 'boxno': {
			name: 'boxno',
			fieldLabel: '开箱单号',
			anchor:'95%'
         },'opendate': {
			name: 'opendate',
			fieldLabel: '开箱日期',
			readOnly:true,
			width:60,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //allowBlank: false,
            readOnly:false,
			anchor:'95%'
         },'checkdate': {
			name: 'checkdate',
			fieldLabel: '到货日期',
			width:60,
            format: 'Y-m-d H:i:s',
            minValue: '2000-01-01',
            allowBlank: false,
			anchor:'95%'
         }, 'appearance': {
			name: 'appearance',
			fieldLabel: '外观记录', 
			anchor:'95%'
         }, 'openAddress': {
			name: 'openAddress',
			fieldLabel: '开箱地点', 
			anchor:'95%'
         },'equipment': {
			name: 'equipment',
			fieldLabel: '设备及附件外观质量情况',
			height:200, 
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'filedetail': {
			name: 'filedetail',
			fieldLabel: '质量证明文件， 技术资料',
			height:200, 
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'problems': {
			name: 'problems',
			fieldLabel: '存在的问题及处理意见 ',
			height:200, 
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'comments': {
			name: 'comments',
			fieldLabel: '开箱检验评定 ',
			height:200,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }  ,'partno': {
			name: 'partno',
			fieldLabel: '部件号 ',
			anchor:'95%'
         }  ,'box_no': {
			name: 'box_no',
			fieldLabel: '箱件号 ',
			anchor:'95%'
         } ,'bz': {
			name: 'bz',
			fieldLabel: '备注 ',
			anchor:'95%'
         } ,'jzh': {
			name: 'jzh',
			fieldLabel: '机组号 ',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsJzh,
            lazyRender:true,
            listClass: 'x-combo-list-small',			
			anchor:'95%'
         } ,'sysbh': {
			name: 'sysbh',
			fieldLabel: '系统 ',
			anchor:'95%'
         } ,'sysmc': {
			name: 'sysmc',
			fieldLabel: '系统名称 ',
			anchor:'95%'
         }  ,'sbmc': {
			name: 'sbmc',
			fieldLabel: '到货设备概述',
			anchor:'95%'
         }  ,'jsbm': {
			name: 'jsbm',
			fieldLabel: '到货编号',
			anchor:'95%'
         }  ,'ggxh': {
			name: 'ggxh',
			fieldLabel: '规格型号',
			anchor:'95%'
         } ,'wztype': {
			name: 'wztype',
			fieldLabel: '物资类别',
			anchor:'95%'
         } ,'sbid': {
			name: 'sbid',
			fieldLabel: 'id',
			anchor:'95%'
         } ,'billstate': {
            name: 'billstate',
			fieldLabel: '流程状态',
			anchor:'95%'
         },
         'kxzt': { name: 'kxzt',fieldLabel: '开箱状态',anchor:'95%'},         
         'ghfwys': { name: 'ghfwys',fieldLabel: '供货范围验收',anchor:'95%'},         
         'qdys': { name: 'qdys',fieldLabel: '清单验收',anchor:'95%'},         
         'zlys': { name: 'zlys',fieldLabel: '资料验收',anchor:'95%'},         
         'hjdwjry': { name: 'hjdwjry',fieldLabel: '会检单位及人员',anchor:'95%'}    
    }
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,{
           id:'uuid',
           header: fc['uuid'].fieldLabel,
           dataIndex: fc['uuid'].name,
           hidden: true        
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,  
           hidden: true      
        },{
           id:'boxno',
           header: fc['boxno'].fieldLabel,
           dataIndex: fc['boxno'].name,
           width: 160
        },{
           header: fc['openAddress'].fieldLabel,
           dataIndex: fc['openAddress'].name,
           width: 120
        },{
           header: fc['opendate'].fieldLabel,
           dataIndex: fc['opendate'].name,
           width: 120,
           css : 'background: pink;',
           renderer:formatDate
        },{
           id:'wztype',
           header: fc['wztype'].fieldLabel,
           dataIndex: fc['wztype'].name,
           hidden:true,
           width: 100
        },{
           id:'sbmc',
           header: fc['sbmc'].fieldLabel,
           dataIndex: fc['sbmc'].name,
           width: 150
        },{
           id:'ggxh',
           header: fc['ggxh'].fieldLabel,
           dataIndex: fc['ggxh'].name,
           width: 100
        },{
           id:'jsbm',
           header: fc['jsbm'].fieldLabel,
           dataIndex: fc['jsbm'].name,
           width: 100
        },{
           header: fc['checkdate'].fieldLabel,
           dataIndex: fc['checkdate'].name,
           width: 120,
           renderer:formatDate
        },{
           id:'jzh',
           header: fc['jzh'].fieldLabel,
           dataIndex: fc['jzh'].name,
           renderer:jzhRender,
           width: 100
        },{
           id:'box_no',
           header: fc['box_no'].fieldLabel,
           dataIndex: fc['box_no'].name,
           width: 100
        },{
           id:'partno',
           header: fc['partno'].fieldLabel,
           dataIndex: fc['partno'].name,hidden:true,
           width: 100
        },{
           id:'ggId',
           header: fc['ggId'].fieldLabel,
           dataIndex: fc['ggId'].name,
           hidden: true
        },{
           id:'sysbh',
           header: fc['sysbh'].fieldLabel,
           dataIndex: fc['sysbh'].name,hidden:true,
           width: 100
        },{
           id:'buildPart',
           header: fc['buildPart'].fieldLabel,
           dataIndex: fc['buildPart'].name,
           renderer:partbRender,hidden:true,
           width: 250
        },
        {id:'kxzt',  header: fc['kxzt'].fieldLabel, dataIndex: fc['kxzt'].name,
        	renderer:function (value){//（0申请开箱，1开箱检验，2通过检验，3未通过检验）
        		if(value==0){return "申请开箱"}
        		if(value=1){return "开箱检验"}
        		if(value==2){return "通过检验"}
        		if(value==3){return "未通过检验"}
        	}
        },	
        {id:'ghfwys',  header: fc['ghfwys'].fieldLabel,hidden:true, dataIndex: fc['ghfwys'].name },	
        {id:'qdys',  header: fc['qdys'].fieldLabel, hidden:true,dataIndex: fc['qdys'].name },	
        {id:'zlys',  header: fc['zlys'].fieldLabel, hidden:true,dataIndex: fc['zlys'].name },	
        {id:'hjdwjry',  header: fc['hjdwjry'].fieldLabel,hidden:true, dataIndex: fc['hjdwjry'].name},	
        {
           id:'fixPart',
           header: fc['fixPart'].fieldLabel,
           dataIndex: fc['fixPart'].name,
           hidden: true
        },{
           header: fc['appearance'].fieldLabel,
           dataIndex: fc['appearance'].name,hidden:true,
           width: 80
        },{
           header: fc['equipment'].fieldLabel,
           dataIndex: fc['equipment'].name,
           hidden: true, 
           width: 120
        },{
           header: fc['filedetail'].fieldLabel,
           dataIndex: fc['filedetail'].name,
           hidden: true, 
           width: 120
        },{
           header: fc['problems'].fieldLabel,
           dataIndex: fc['problems'].name,
           hidden: true, 
           width: 120
        },{
           header: fc['comments'].fieldLabel,
           dataIndex: fc['comments'].name,
           width: 120
        },{
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           width: 90,
           hidden:true
        },{
           header: fc['sbid'].fieldLabel,
           dataIndex: fc['sbid'].name,
           width: 90,
           hidden:true
        },{
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 120,hidden:true,
           renderer:billTypeRender
        }
      
    ]);
    cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'uuid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'boxno', type: 'string'},
		{name: 'ggId', type: 'string'},
		{name: 'opendate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'checkdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'appearance', type: 'string'},
		{name: 'equipment', type: 'string'},
		{name: 'filedetail', type: 'string'},
		{name: 'problems', type: 'string'},
		{name: 'buildPart', type: 'string'},
		{name: 'fixPart', type: 'string'},
		{name: 'openAddress', type: 'string'},
		{name: 'comments', type: 'string'},
		{name: 'partno', type: 'string'},
		{name: 'box_no', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'sysbh', type: 'string'},
		{name: 'sysmc', type: 'string'},
		{name: 'sbmc', type: 'string'},
		{name: 'jsbm', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'wztype', type: 'string'},
		{name: 'sbid', type: 'string'},
		{name: 'billstate', type: 'string'},
		{name: 'kxzt', type: 'float'},
		{name: 'ghfwys', type: 'string'},
		{name: 'qdys', type: 'string'},
		{name: 'zlys', type: 'string'},
		{name: 'hjdwjry', type: 'string'}
		];
		
	 
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: "conid='"+conid+"'"
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
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    
    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.EditorGridTbarPanel({
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],	
        border: false,				// 
        region: 'center',
        title: bodyPanelTitle,
        header: true,
        delBtn : false, // 是否显示删除按钮
        addBtn : false, // 是否显示新增按钮				
        saveBtn:false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        enableDragDrop: true,       //一旦选中某行，就不能取消选中，除非选中其他行
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE3,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: 'uuid'
	});
    ds.load({
    	params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });

	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [grid]
    });
    
    grid.getTopToolbar().add(BUTTON_CONFIG['EDIT']);
    
    
 
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    function jzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType.length; i++) {
   			if (jzhType[i][0] == value) {
   				str = jzhType[i][1]
   				break; 
   			}
   		}
   		return str;
   }    
   function partbRender(value){
   		var str = value;
   		for(var i=0; i<partBs.length; i++) {
   			if (partBs[i][0] == value) {
   				str = partBs[i][1]
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
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////从表表查询部分
	function toHandler(){
		var record = grid.getSelectionModel().getSelected();
		if(record){
			window.close();
			window.returnValue = record.get('boxno')
		}
	}
   
});