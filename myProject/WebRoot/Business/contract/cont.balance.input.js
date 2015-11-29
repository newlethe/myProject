var bean = "com.sgepit.pmis.contract.hbm.ConBal"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "balid"
var orderColumn = "conid"
var gridPanelTitle = "合同：" + selectedConName + "，编号：" + selectedConNo + "，结算记录";
var billTypes = [['0','未发送'],['-1','处理中'],['1','处理完毕']];
var propertyName = "conid"
var propertyValue = selectedConId;
var SPLITB = "`"
var pid = CURRENTAPPID;
var countInfoList = new Array();
var conObj = new Object();
var totalMoney = "";
var whereStr =propertyName+"='"+propertyValue+"'";
var outFilter ="1=1";
if(UIDS!=""){
	var len=UIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
	    str+="'"+len[i]+"'";
	    if(i<len.length-1){
	       str+=","
	    }
	}
   outFilter=" balid in ("+str+")";
}
Ext.onReady(function (){
    DWREngine.setAsync(false);
    var beanName = "com.sgepit.pmis.contract.hbm.ConOve";
    baseMgm.findById(beanName, selectedConId, function(obj){
    	conObj = obj;
    });
    DWREngine.setAsync(true);
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'			
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'balid': {
			name: 'balid',
			fieldLabel: '结算编号',
			readOnly: true,
			anchor: '95%'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号', 
			readOnly : true,         
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称', 
			readOnly: true,         
			anchor:'95%'
         }, 'baldate': {
			name: 'baldate',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
			fieldLabel: '结算日期',          
			anchor:'95%'
         }, 'convalue': {
			name: 'convalue',
			fieldLabel: '合同金额',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'balappmoney': {
			name: 'balappmoney',
			fieldLabel: '结算审定金额',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'actpaymoney': {
			name: 'actpaymoney',
			fieldLabel: '实际支付金额',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',  
			allowNegative:false,
			readOnly : true,        
			anchor:'95%'
         }, 'actman': {
			name: 'actman',
			fieldLabel: '经办人',
			readOnly : true,          
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			readOnly : true,          
			anchor:'95%'
         }
    }
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name, 
           hidden:true,
           width: 90
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'balid',
           header: fc['balid'].fieldLabel,
           dataIndex: fc['balid'].name,
           hidden: true,
           width: 120
        },{
           header: fc['conno'].fieldLabel,
           dataIndex: fc['conno'].name,
           width: 120,
           renderer: renderConno
        },{
           header: fc['conname'].fieldLabel,
           dataIndex: fc['conname'].name,
           width: 120,
           renderer: function(){ return conObj.conname; }
        },{
           header: fc['baldate'].fieldLabel,
           dataIndex: fc['baldate'].name,
           width: 120,
           renderer: formatDate
        },{
           header: fc['convalue'].fieldLabel,
           dataIndex: fc['convalue'].name,
           width: 90, 
           align:'right',
           renderer: function(){ return cnMoneyToPrec(conObj.convalue) }
        },{
           header: fc['balappmoney'].fieldLabel,
           dataIndex: fc['balappmoney'].name,
           width: 90, 
           align:'right',
           renderer: cnMoneyToPrec        
        },{
           header: fc['actpaymoney'].fieldLabel,
           dataIndex: fc['actpaymoney'].name,
           width: 90, 
           align:'right',
           renderer: cnMoneyToPrec        
        },{
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 90,
           renderer: billTypeRender
        }
    ]);
    cm.defaultSortable = true;						//设置是否可排序
	
    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'balid', type: 'string'},
		{name: 'conno', type: 'string'},
		{name: 'conname', type: 'string'},
		{name: 'convalue', type: 'float'},
		{name: 'balappmoney', type: 'float'},
		{name: 'actpaymoney', type: 'float'},
		{name: 'baldate', type: 'date', dateFormat:'Y-m-d H:i:s'},    	
		{name: 'billstate', type: 'float'}
	];
	var Fields = Columns.concat([							//表单增加的列
		{name: 'actman', type: 'string'},
		{name: 'remark', type: 'string'}
	])
  
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: whereStr,
	    	outFilter :outFilter
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
	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			var url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?";
			window.location.href = url + "isBack=1&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE;
		}
	});
	
	var btnBal = new Ext.Button({
		id: 'balance',
		text: '结算初始化',
		tooltip: '结算初始化',
		iconCls: 'btn',
		handler: function(){
			var url = BASE_PATH+"Business/contract/cont.balance.addorupdate.jsp?";
			window.location.href = url + "conid="+selectedConId;
		}
	});
	
    // 5. 创建可编辑的grid: grid-panel
    var grid = new Ext.grid.GridPanel({
        store: ds,
        cm: cm,
        sm: sm,
        tbar: [titleBar, '->', btnBal, '-', btnReturn],
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
	    height:450
	});
    
	//--------------------------------------------------------------------------------------
    var cmTotal = new Ext.grid.ColumnModel([
	        {header:'累计名称',dataIndex:'name'},
	        {header:'累计金额',dataIndex:'money',renderer:cnMoneyToPrec,align:'right'}
	]);

    var dsTotal = new Ext.data.Store({
        proxy: new Ext.data.MemoryProxy(countInfoList),
        reader: new Ext.data.ArrayReader({}, [
            {name: 'name'},
            {name: 'money'}
        ])
    });
	
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
        region: 'south',
        forceFit: true,
        loadMask: true,
	    height:180
    });
	
    var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("balid");
		gridMenu.removeAll();
	    gridMenu.addMenuItem({
	    	id: 'menu_edit',
            text: '　修改',
            value: data,
            iconCls: 'btn',   
            handler : toHandler
	    })
	    gridMenu.add('-');
		gridMenu.addMenuItem({
	    	id: 'menu_view',
            text: '　查看',
            value: data,
            iconCls: 'form',
            handler : toHandler
	    })
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}

	function toHandler(){
		var state = this.id;
		var menu_balid = this.value;
		var url = BASE_PATH+"Business/contract/cont.balance.addorupdate.jsp?";
		if ("" != state){
			Ext.get('loading-mask').show();
			Ext.get('loading').show();
		    if ("menu_view" == state){
		    	var viewUrl = BASE_PATH+"Business/contract/cont.balance.view.jsp?";
		    	window.location.href = viewUrl+"conid="+selectedConId+"&conname="+selectedConName+"&conno="+selectedConNo+"&balid="+menu_balid;
			}else if ("menu_edit" == state){
				window.location.href = url + "conid="+selectedConId+"&balid="+menu_balid+"&totalMoney="+totalMoney;
			}else{return}
		}
	}

	var viewport = new Ext.Viewport({
	    layout:'border',
	    items: [grid, gridTotal]
	});

	// 12. 加载数据
    ds.load();
    
	// 11 事件绑定
    ds.on('load', function(store){
    	if (!store.getCount() > 0) return
    	btnBal.setDisabled(true);
    	var selBalId = store.getAt(0).get('balid');
    	DWREngine.setAsync(false);
    	conexpMgm.getCountInfo('合同结算',selectedConId, selBalId, function(list){
	    	for (i = 0; i < list.length; i++){
	    		var temp = new Array();
	    		temp.push(list[i][0]);
	    		temp.push(list[i][1]);
	    		countInfoList.push(temp);
	    	}
	    	dsTotal.load();
	    });
	    DWREngine.setAsync(true);
    });
    
    dsTotal.on('load', function(store){
    	for (var i = 0; i < store.getCount(); i++){
    		var tName = store.getAt(i).get('name');
    		if ('累计实际付款' == tName){
    			totalMoney = store.getAt(i).get('money');
    			break;
    		}
    	}
    });
    
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
	function renderConno(value, metadata, record){
		var getConid = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ conObj.conno+'</span>'
		return output;
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




