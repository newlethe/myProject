var bean = "com.sgepit.pmis.contract.hbm.ConPay"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "payid"
var orderColumn = "payno"
var gridPanelTitle = "合同付款综合查询";
var SPLITB = "`"
var pid = CURRENTAPPID;
var propertyName = "conid";
var billTypes = new Array();
var penaltytypes= new Array();
var changes = new Array();
var payTypes = new Array();
var dspenaltytype = new Array();
var compensateTypes = new Array();
var countInfoList = new Array();
var flowWindow;
var _conPer;

Ext.onReady(function (){

	// 1. 创建选择模式
    var sm =  new Ext.grid.RowSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）
    DWREngine.setAsync(false);	
    DWREngine.beginBatch(); 
    
    
    appMgm.getCodeValue('合同付款方式',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		payTypes.push(temp);
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
   
  ///-------获取年份
    DWREngine.endBatch();
    DWREngine.setAsync(true);
    
 	var sj_yearArray = new Array();
   	DWREngine.setAsync(false);
   	var sql_year ="select distinct substr(to_char(paydate,'yyyy-mm-dd'),1,4) year,  substr(to_char(paydate,'yyyy-mm-dd'),1,4)||'年' years from con_pay order by year ";
	baseMgm.getData(sql_year,function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			sj_yearArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getSj_yearSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:sj_yearArray
 	})   
    var payTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : payTypes
    });
    
    //1结算 0未结算 -1流程中
    var billTypestate = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : billTypes
    });
    
	//合同类型
    var contSort1 = new Array();
    DWREngine.setAsync(false);
    appMgm.getCodeValue('合同划分类型',function(list){ 
    	var com1 = new Array();
        com1.push('-1');
        com1.push('所有合同');
        contSort1.push(com1);
        for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			contSort1.push(temp);
        }
	})
    DWREngine.setAsync(true);
        var dsConDivno = new Ext.data.SimpleStore({
	        fields: ['k', 'v'],   
	        data:contSort1 //contractType
   		});
    
    var fc = {		// 创建编辑域配置
    	 'payid': {
			name: 'payid',
			fieldLabel: '付款编号',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'conid': {
			name: 'conid',
			fieldLabel: '合同名称',
			readOnly:true,
			//hidden:true,
			//hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'payno': {
			name: 'payno',
			fieldLabel: '付款编号',
			anchor:'95%'
         },'actman': {
			name: 'actman',
			fieldLabel: '经办人',
			anchor:'95%'
         }, 'paydate': {
			name: 'paydate',
			fieldLabel: '付款申请日期',
            format: 'Y-m-d',
            minValue: '2000-01-01',
            allowBlank: false,
			anchor:'95%'
         },'paytype': {
			name: 'paytype',
			fieldLabel: '付款类型',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: payTypeStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowBlank: false,
			anchor:'95%'
         },'payins': {
			name: 'payins',
			fieldLabel: '付款说明',
			height: 130,
			width: 490,
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: billTypestate,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '付款附件编号',
			anchor:'95%'
         }, 'appmoney': {
			name: 'appmoney',
			fieldLabel: '申请付款',
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         }, 'passmoney': {
			name: 'passmoney',
			fieldLabel: '批准付款',
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         }, 'paymoney': {
			name: 'paymoney',
			fieldLabel: '实际付款',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
         }, 'invoicemoney': {
			name: 'invoicemoney',
			fieldLabel: '发票金额',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '付款备注',
			allowBlank: true,
			anchor:'95%'
         }
    }

    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'payid',
           header: fc['payid'].fieldLabel,
           dataIndex: fc['payid'].name,
           hidden: true,
           width: 200
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,	
           dataIndex: fc['conid'].name,	
           //hidden: true,
           width: 120,
           renderer: renderConid
        },{
           id:'payno',
           header: fc['payno'].fieldLabel,
           dataIndex: fc['payno'].name,
           width: 120,
           renderer: renderPayno
        },{
           id:'paydate',
           header: fc['paydate'].fieldLabel,
           dataIndex: fc['paydate'].name,
           width: 90,
           renderer: formatDate
        },{
           header: fc['appmoney'].fieldLabel,
           dataIndex: fc['appmoney'].name,
           width: 100,
           align: 'right',
           renderer: cnMoney
        },{
           header: fc['passmoney'].fieldLabel,
           dataIndex: fc['passmoney'].name,
           width: 100,
           align: 'right',
           renderer: cnMoney
        },{
           header: fc['paymoney'].fieldLabel,
           dataIndex: fc['paymoney'].name,
           width: 100,
           align: 'right',
           renderer: cnMoney
        },{
           header: fc['invoicemoney'].fieldLabel,
           dataIndex: fc['invoicemoney'].name,
           width: 100,
           align: 'right',
           renderer: cnMoney
        },{
           id:'paytype',
           header: fc['paytype'].fieldLabel,
           dataIndex: fc['paytype'].name,
           width: 120//,
//           renderer: payTypeRender
        },{
           id:'remark',
           header: fc['remark'].fieldLabel,
           dataIndex: fc['remark'].name,
           width: 100
        },{
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 120,
           renderer: billTypeRender
        }
    ]);
    cm.defaultSortable = true;						//设置是否可排序


    // 3. 定义记录集
    var Columns = [
    	{name: 'payid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'payno', type: 'string'},
		{name: 'paydate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'appmoney', type: 'float'},
		{name: 'passmoney', type: 'float'},
		{name: 'paymoney', type: 'float'},
		{name: 'paytype', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'billstate', type: 'float'},
		{name: 'actman', type: 'string'},
		{name: 'payins', type: 'string'},
		{name: 'filelsh', type: 'string'},
		{name: 'invoicemoney', type: 'float'}
	];
	var Fields = Columns.concat([							//表单增加的列
		
	])
	
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantFields = Ext.data.Record.create(Fields);		
    var PlantFieldsInt = new Object();

    var PlantInt = {pid: pid, 
    				conid: '', 
    				payno: '', 
    				paydate: '', 
    				appmoney: '',
    				paymoney: '',
    				paytype: '', 
    				remark: '', 
    				invoicemoney:'',
    				billstate: ''};
    
    Ext.applyIf(PlantFieldsInt, PlantInt);	
    PlantFieldsInt = Ext.apply(PlantFieldsInt, {actman: '', payins: "", filelsh: ""});		


    
    // 4. 创建数据源
    var date = new Date()
    var currentDate=date.getYear()
                +"-"+(date.getMonth()+101+"").substring(1)
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
            params: ''
//	    	params: "billstate='1' and substr(to_char(paydate,'yyyy-mm-dd'),1,7)='"+currentDate+"'"//初始为当前月
	    	//params: propertyName+"='"+propertyValue+"'"//propertyName+SPLITB+propertyValue
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

	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
		iconCls: 'title'
	})
     var comboConDivno =  new Ext.form.ComboBox({
    		name:'condivno',
			readOnly : true,
			width:110,
			store:dsConDivno,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
            value : '-1',
			listeners:{select:function(combo,record,index){
                comboFilter_y.clearValue();
                comboFilter_m.clearValue();
				if(comboFilter_y.getValue()!="" && comboFilter_m.getValue()!=""){
					var filter_fl=" conid in(select conid from  com.sgepit.pmis.contract.hbm.ConOve where condivno='"+record.data.k+"') and ";
					if(record.data.k == '-1') filter_fl = ""; 
		        	ds.baseParams.params = filter_fl+"billstate='1' and to_char(paydate,'yyyy-mm')='"+comboFilter_y.getValue()+'-'+comboFilter_m.getValue()+"'";
					ds.load({params : {start : 0,limit : 20}});
				}else{
					var filter_fl=" conid in(select conid from  com.sgepit.pmis.contract.hbm.ConOve where condivno='"+record.data.k+"') and ";
		        	if(record.data.k == '-1') filter_fl = "";
		        	ds.baseParams.params = filter_fl+"billstate='1'";
					ds.load({params : {start : 0,limit : 20}});
				}
	        }}
    });
      
     var comboFilter_y =  new Ext.form.ComboBox({
    		name:'sj_y',
			readOnly : true,
			width:90,
			store:getSj_yearSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			listeners:{select:function(combo,record,index){
                comboFilter_m.clearValue();
				if(comboFilter_m.getValue()!="" && comboConDivno.getValue()!=""){
					var filter_fl=" conid in(select conid from  com.sgepit.pmis.contract.hbm.ConOve where condivno='"+comboConDivno.getValue()+"') and ";
					if(comboConDivno.getValue() == '-1') filter_fl = ""; 
		        	ds.baseParams.params = filter_fl+"billstate='1' and to_char(paydate,'yyyy-mm')='"+record.data.k+'-'+comboFilter_m.getValue()+"'";
					ds.load({params : {start : 0,limit : 20}});
				}else{
                  if(comboConDivno.getValue()){
                     var filter_fl=" conid in(select conid from  com.sgepit.pmis.contract.hbm.ConOve where condivno='"+comboConDivno.getValue()+"') and ";
                     if(comboConDivno.getValue() == '-1') filter_fl = ""; 
                     ds.baseParams.params = filter_fl+"billstate='1' and to_char(paydate,'yyyy')='"+record.data.k+"'";
                     ds.load({params : {start : 0,limit : 20}});
                  }
                }
	        }}
    });
    var comboFilter_m =  new Ext.form.ComboBox({
    		name:'sj_m',
			readOnly : true,
			width:90,
         	store: new Ext.data.SimpleStore({
         		fields: ['id', 'name'],
           		data: [
	                 ['01', '01月'],['02', '02月'],['03', '03月'], ['04', '04月'],
	                 ['05', '05月'],['06', '06月'],['07', '07月'], ['08', '08月'],
	                 ['09', '09月'],['10', '10月'],['11', '11月'], ['12', '12月']
                  ]}),
            mode: 'local',        
            displayField:'name',
            valueField:'id',
            triggerAction: 'all',
            listeners:{select:function(combo,record,index){
            	if(comboFilter_y.getValue()!="" && comboConDivno.getValue()!="" ){
	            	var filter_fl=" conid in(select conid from  com.sgepit.pmis.contract.hbm.ConOve where condivno='"+comboConDivno.getValue()+"') and ";
	            	if(comboConDivno.getValue() == '-1') filter_fl = ""; 
	            	ds.baseParams.params = filter_fl+"billstate='1' and to_char(paydate,'yyyy-mm')='"+comboFilter_y.getValue()+'-'+comboFilter_m.getValue()+"'";
					ds.load({params : {start : 0,limit : 20}});
            	}
            }}
    });   	
    //comboConDivno.setValue('-1');
	//comboFilter_y.setValue(currentDate.substring(0,4))
    //comboFilter_m.setValue(currentDate.substring(5,7))
    
    var addToolbar = new Ext.Toolbar({
		items : [
			'<font color=green>申请付款累计：</font>',{xtype: 'textfield', id: 'appmoneyTotal', readOnly: true, cls: 'shawsar'},
    		'<font color=green>批准付款累计：</font>',{xtype: 'textfield', id: 'passmoneyTotal', readOnly: true, cls: 'shawsar'},
    		'<font color=green>实际付款累计：</font>',{xtype: 'textfield', id: 'paymoneyTotal', readOnly: true, cls: 'shawsar'},
    		'<font color=green>发票金额累计：</font>',{xtype: 'textfield', id: 'invoicemoneyTotal', readOnly: true, cls: 'shawsar'}
		]
	})
			
    // 5. 创建可编辑的grid: grid-panel
    var grid = new Ext.grid.GridPanel({
        store: ds,
        cm: cm,
        sm: sm,
        tbar: [titleBar,'<font color=red>查询==>></font> 合同分类:',comboConDivno," 时间：",comboFilter_y,comboFilter_m,'->','计量单位： 元'
        ],
        //split: true,
        iconCls: 'icon-show-all',
        border: false, 
        region: 'center',
        header: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
        width:800,
	    height:450,
	    bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),		
	    listeners : {
		    "render" : function (){
		        addToolbar.render(this.bbar);
		    }
		}
	});
	
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var cmTotal = new Ext.grid.ColumnModel([
	        {header:'累计名称', dataIndex:'name'},
	        {header:'累计金额', dataIndex:'money', maxValue: 100000000, align: 'right', renderer: cnMoney}
	]);

    var dsTotal = new Ext.data.Store({
        proxy: new Ext.data.MemoryProxy(countInfoList),
        reader: new Ext.data.ArrayReader({}, [
            {name: 'name'},
            {name: 'money'}
        ])
    });
	//dsTotal.load();
    var gridTotal = new Ext.grid.GridPanel({
        ds: dsTotal,
        cm: cmTotal,
        title: '累计',
        header: true,
        iconCls: 'icon-show-all',
        split: true,
        autoScroll:true,
        minSize: 175,
        maxSize: 445,
        border: false,
        region: 'center',
        forceFit: true,
        loadMask: true,
        width: 180
    });
    
	
    var viewport = new Ext.Viewport({
        layout: 'border', border: false,
        items: grid
    });
  
    // 12. 加载数据
    //第一次打开查询所有已审批
    comboConDivno.setValue("-1");
    ds.baseParams.params = " billstate='1' ";
    //带合同类型和年份查询（合同分析综合查询 flex图形点击后参数）
    if (conttype != null && conttype != "") {
        comboConDivno.setValue(conttype);
        ds.baseParams.params = " billstate='1' and conid in(select conid from  com.sgepit.pmis.contract.hbm.ConOve where condivno='"+conttype+"') "
        if(conttype == "-1"){
            ds.baseParams.params = " billstate='1' ";
        }
        if (contyear != null && contyear != ""){
            comboFilter_y.setValue(contyear)
            ds.baseParams.params += " and paydate between to_date('"+contyear+"-01-01','YYYY-MM-DD')  and to_date('"+contyear+"-12-31','YYYY-MM-DD') ";
        }
    } 
    ds.load({params : {start : 0,limit : 20}});
    ds.on('load',function(){
		Ext.getCmp('appmoneyTotal').setValue(cnMoney(ds.sum('appmoney'))),//申请付款累计
		Ext.getCmp('passmoneyTotal').setValue(cnMoney(ds.sum('passmoney'))),//批准付款累计
		Ext.getCmp('paymoneyTotal').setValue(cnMoney(ds.sum('paymoney'))),//实际付款累计
		Ext.getCmp('invoicemoneyTotal').setValue(cnMoney(ds.sum('invoicemoney')))//发票金额累计
    })
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

	function renderConid(value, metadata, record){
		var conname_="";
		DWREngine.setAsync(false); 
			baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conid='"+value+"'", function(list1){
				conname_ = list1[0].conname;
			});
			DWREngine.setAsync(true); 
		return conname_;
	}
	
	function renderPayno(value, metadata, record){
		return value;
	}

    // 下拉列表中 k v 的mapping 
   	function payTypeRender(value){	//付款类型
   		var str = '';
   		for(var i=0; i<payTypes.length; i++) {
   			if (payTypes[i][0] == value) {
   				str = payTypes[i][1]
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




