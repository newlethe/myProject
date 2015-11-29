var bean = "com.sgepit.pmis.contract.hbm.ConPay"
var business = "conpayMgm"
var listMethod = "findByProperty"
var ServletUrl = MAIN_SERVLET
var primaryKey = "payid"
var propertyName = "pid"
var propertyValue = pid_plan;
var SPLITB = "`"
var payTypes = new Array();
var billTypes = new Array();
Ext.onReady(function (){

 	DWREngine.setAsync(false);
    appMgm.getCodeValue('合同付款方式',function(list){			//获取付款类型
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
	DWREngine.setAsync(true);

 ///-------获取合同
 	var conArray = new Array();
   	DWREngine.setAsync(false);
   	var sql_con ="select conid,conname from con_ove ";
	baseMgm.getData(sql_con,function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			conArray.push(temp);
		}
	})
	DWREngine.setAsync(true);	
	//1结算 0未结算 -1流程中
    var billTypestate = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : billTypes
    });
	
    var fcPay = {		// 创建编辑域配置
    	 'payid': {
			name: 'payid',
			fieldLabel: '付款流水号',
			hidden:true,
			anchor:'95%'
         },'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			anchor:'95%'
         },'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			readOnly:true,
			hidden:true,
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
			anchor:'95%'
         },'paytype': {
			name: 'paytype',
			fieldLabel: '付款类型',
			anchor:'95%'
         },'payins': {
			name: 'payins',
			fieldLabel: '付款说明',
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '付款附件编号',
			anchor:'95%'
         }, 'appmoney': {
			name: 'appmoney',
			fieldLabel: '申请付款',
            allowNegative: false,
            renderer: cnMoney,
            //maxValue: 100000000,
			anchor:'95%'
         }, 'paymoney': {
			name: 'paymoney',
			fieldLabel: '实际付款',
            allowNegative: false,
            renderer: cnMoney,
            //maxValue: 100000000,
			anchor:'95%'
         }, 'demoney': {
			name: 'demoney',
			fieldLabel: '应扣款',
            allowNegative: false,
            renderer: cnMoney,
            //maxValue: 100000000,
			anchor:'95%'
         },  'passmoney': {
			name: 'passmoney',
			fieldLabel: '批准付款',
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '付款备注',
			allowBlank: true,
			anchor:'95%'
         }
    }

    var cmPay = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           header: fcPay['conid'].fieldLabel,	
           dataIndex: fcPay['conid'].name,	
           renderer:function(value){
           		for(var i=0;i<conArray.length;i++){
	           		if(value==conArray[i][0]){
	           			return conArray[i][1]
	           		}
           		}
           }
        },{
           id: 'paymoney',
           header: fcPay['paymoney'].fieldLabel,
           dataIndex: fcPay['paymoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoney
        },{
           id:'billstate',
           header: fcPay['billstate'].fieldLabel,
           dataIndex: fcPay['billstate'].name,
           width: 120,
           renderer: billTypeRender
        }/*,{
           id:'payid',
           header: fcPay['payid'].fieldLabel,
           dataIndex: fcPay['payid'].name,
           hidden: true,
           width: 0
        },{
           id:'payno',
           header: fcPay['payno'].fieldLabel,
           dataIndex: fcPay['payno'].name,
           width: 120
        },{
           id:'paydate',
           header: fcPay['paydate'].fieldLabel,
           dataIndex: fcPay['paydate'].name,
           width: 90,
           renderer: formatDate
        },{
           id: 'appmoney',
           header: fcPay['appmoney'].fieldLabel,
           dataIndex: fcPay['appmoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoney
        },{
           id: 'passmoney',
           header: fcPay['passmoney'].fieldLabel,
           dataIndex: fcPay['passmoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoney
        },{
           id: 'demoney',
           header: fcPay['demoney'].fieldLabel,
           dataIndex: fcPay['demoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoney
        },{
           id:'paytype',
           header: fcPay['paytype'].fieldLabel,
           dataIndex: fcPay['paytype'].name,
           width: 120//,
           //renderer: payTypeRender
        },{
           id:'remark',
           header: fcPay['remark'].fieldLabel,
           dataIndex: fcPay['remark'].name,
           width: 120
        },{
           id:'actman',
           header: fcPay['actman'].fieldLabel,
           dataIndex: fcPay['actman'].name,
           width: 120,
           renderer:getUserName
        },{
           id: 'payins',
           header: fcPay['payins'].fieldLabel,
           dataIndex: fcPay['payins'].name,
           width: 120
        },{
           id:'pid',
           header: fcPay['pid'].fieldLabel,
           dataIndex: fcPay['pid'].name,
           hidden: true,
           width: 120
        }*/
    ]);
    cmPay.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var ColumnsPay = [
    	{name: 'payid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'payno', type: 'string'},
		{name: 'paydate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'appmoney', type: 'float'},
		{name: 'paymoney', type: 'float'},
		{name: 'demoney', type: 'float'},
		{name: 'paytype', type: 'string'},
		{name: 'billstate', type: 'float'},
		{name: 'actman', type: 'string'},
		{name: 'payins', type: 'string'},
		{name: 'passmoney', type: 'float'},
		{name: 'remark', type: 'string'}
	];
 
    // 4. 创建数据源
    var storePay = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+SPLITB+propertyValue
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: ServletUrl
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, ColumnsPay),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    
	
	var gridPay = new Ext.grid.GridPanel({
        store: storePay,
        cm: cmPay,
        border: false,
        //width:800,   
        autoScroll: true,			//自动出现滚动条
        autoShow: true,
        region: 'center',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
    });

    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [gridPay],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [gridPay]
        });
    }

    storePay.load();
    
 	var notesTip = new Ext.ToolTip({
		width: 500,
		target: gridPay.getEl()
	});	   
	
	gridPay.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("11" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('payins')
			});
			point = e.getXY();
			notesTip.showAt(e.getX-100,e.getY);
		}
	});	    

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

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
   	function getUserName(value){ //取得用户真实姓名
   		var result="";
   		DWREngine.setAsync(false);
   		baseMgm.getData("select realname from rock_user where useraccount ='"+ value +"'",function(list){
   			if(null !=list){
   				result = list[0];
   			}
   		})
   		DWREngine.setAsync(true);
   		return result;
   	}
	
});