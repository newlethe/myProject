var bean = "com.sgepit.pmis.contract.hbm.ConBal"
var primaryKey = "balid"
var billTypes = [['0','未发送'],['-1','处理中'],['1','处理完毕']];
var countInfoList = new Array();
var conObj = new Object();
Ext.onReady(function (){
    DWREngine.setAsync(false);
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowNumberer()
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
    var cm = new Ext.grid.ColumnModel([
        sm,
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
            align : 'center',
           renderer: renderConno
        },{
           header: fc['baldate'].fieldLabel,
           dataIndex: fc['baldate'].name,
           width: 120,
           align : 'center',
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
  
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	beanName: bean,				
	    	primaryKey: "balid",
	    	pid: PID,
	    	uids: UIDS
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
    // 5. 创建可编辑的grid: grid-panel
    var grid = new Ext.grid.GridPanel({
        store: ds,
        cm: cm,
    	tbar: ['->',new Ext.Button({
					text: '返回',
					iconCls: 'returnTo',
					handler: function(){
						history.back();
					}
				})],
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
    
	
	


	var viewport = new Ext.Viewport({
	    layout:'border',
	    items: [grid]
	});

	// 12. 加载数据
    ds.load();
    
    
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
	function renderConno(value, metadata, record){
		var getConid = record.get('conid');
		DWREngine.setAsync(false);
		var conObj;
		baseMgm.findById('com.sgepit.pmis.contract.hbm.ConOve',getConid,function (obj){
		    conObj=obj
		})
		DWREngine.setAsync(true);
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'PCBusiness/dynamicdata/conove/con_ove.detail.jsp?conid='+getConid+'&balid='+record.get('balid')+'\'">'+conObj.conno+'</span>'
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
 	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("balid");
		gridMenu.removeAll();
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
		if ("" != state){
			Ext.get('loading-mask').show();
			Ext.get('loading').show();
		    if ("menu_view" == state){
		    	var viewUrl = BASE_PATH+"PCBusiness/dynamicdata/conove/conbal_detail.jsp?";
		    	window.location.href = viewUrl+"balid="+menu_balid;
			}
		}
	}
});




