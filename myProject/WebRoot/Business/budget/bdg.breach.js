/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量


var ServletUrl = CONTEXT_PATH + "/servlet/BdgServlet";
var bean = "com.sgepit.pmis.contract.hbm.ConBre"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "breid"
var orderColumn = "breno"
var gridPanelTitle = "合同:" +　selectedConName +" 编号:"+ selectedConNo +　"   所有违约记录"
var SPLITB = "`"
var pid = CURRENTAPPID;
var propertyName = "conid"
var propertyValue = selectedConId;
var penaltytypes = new Array();
var formWindow;
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
   outFilter=" breid in ("+str+")";
}
Ext.onReady(function (){
    DWREngine.setAsync(false);  
	appMgm.getCodeValue('合同违约类型',function(list){         //获取违约类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			penaltytypes.push(temp);			
		}
    });
    DWREngine.setAsync(true);
    
    var dspenaltytype = new Ext.data.SimpleStore({
        fields: ['k', 'v'],     
        data: penaltytypes
    });	 

	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href =BASE_PATH+"Business/budget/bdg.generalInfo.input.jsp?conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnBreach = new Ext.Button({
		id: 'breach',
		text: '合同违约分摊',
		tooltip: '合同违约分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			var record = sm.getSelected();
			var id = record.get('conid');
			if (id){
			var breachAppUrl;
			if ( hasNk == '0' ){
				breachAppUrl = "Business/budget/bdg.breach.apportion.jsp";
			}
			else{
				breachAppUrl = "Business/budget/bdg.breach.apportion.combine.jsp";
			}
			window.location.href = BASE_PATH + breachAppUrl + "?conid=" 
				+ id + "&conname=" + encodeURIComponent(selectedConName) + "&conno="+selectedConNo+"&breid="+ record.get('breid') + "&breno=" + record.get('breno')
				+"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
								}
							}
	});
	
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			anchor:'95%'
         },'breid': {
			name: 'breid',
			fieldLabel: '违约流水号',
			hidden:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			anchor:'95%'
         }, 'breno': {
			name: 'breno',
			fieldLabel: '违约编号',
			anchor:'95%'
         }, 'brereason': {
			name: 'brereason',
			fieldLabel: '违约原因',  
			height:200, 
			allowBlank: false,        
			anchor:'95%'
         },'bredate': {
			name: 'bredate',
			fieldLabel: '违约日期',
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         }, 'dedmoney': {
			name: 'dedmoney',
			fieldLabel: '违约金额', 
			allowNegative:false, 
			renderer: cnMoneyToPrec, 
			anchor:'95%'
         }, 'breachappmoney': {
			name: 'breachappmoney',
			fieldLabel: '违约分摊金额', 
			allowNegative:true, 
			anchor:'95%'
         }, 'bretype': {
			name: 'bretype',
			fieldLabel: '违约类型', 
            allowBlank: false,      
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
         },'brework': {
			name: 'brework',
			fieldLabel: '违约处理',
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '附件流水号',
			hidden:true,
			anchor:'95%'
         }    
    }
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden: true,         
           width: 120
        },{
           id:'breid',
           header: fc['breid'].fieldLabel,
           dataIndex: fc['breid'].name,  
           hidden: true,       
           width: 110
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           header: fc['breno'].fieldLabel,
           dataIndex: fc['breno'].name,
           width: 120,
           align : 'center',
           renderer: renderBreno
        },{
           header: fc['bredate'].fieldLabel,
           dataIndex: fc['bredate'].name,
           width: 120,
            align : 'center',
           renderer: formatDate
        },{
           header: fc['dedmoney'].fieldLabel,
           dataIndex: fc['dedmoney'].name,
            align : 'right',
           width: 90
           
        },{
           header: fc['breachappmoney'].fieldLabel,
           dataIndex: fc['breachappmoney'].name,
            align : 'right',
           width: 90
        },{
           header: fc['bretype'].fieldLabel,
           dataIndex: fc['bretype'].name,
           width: 120,
            align : 'center',
           renderer: penaltytypeRender
        },{
           header: fc['filelsh'].fieldLabel,
           dataIndex: fc['filelsh'].name,
           width: 90,
           hidden:true
        }
      
    ]);
    cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'breid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'breno', type: 'string'},    	
		{name: 'bredate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'dedmoney', type: 'float'},
		{name: 'breachappmoney', type: 'float'},
		{name: 'bretype', type: 'string'},
		{name: 'filelsh', type: 'string'}
		];
	
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'listBre',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+"='"+propertyValue+"'",
	    	outFilter :outFilter,
	    	conid:selectedConId
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
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });

    var grid = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    header: false,
	    //title: gridPanelTitle,
	    viewConfig: {
	        forceFit: true
	    },
	    tbar: [],
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
	    width:800,
	    height:300,
	    iconCls: 'icon-show-all',
        border: false,
        region: 'center'
	});
    
	grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("conid")+":"+record.get("breid")+":"+record.get("breno");
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
		                text: '违约分摊',
		                iconCls: 'btn',
		                value: data,
		                handler : toHandler
                    }]
	    });
	
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}

	function toHandler(){
		var params = this.value.split(":");
		window.location.href = BASE_PATH+"Business/budget/bdg.breach.apportion.jsp?conid="+params[0]+"&breid="+params[1]+"&breno="+params[2]+"&conname="+selectedConName+"&conno='"+selectedConNo;
	}
    
	
	
	// 9. 创建viewport，加入面板action和content
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
            items: [grid]
        });
    }

   	grid.getTopToolbar().add({
					text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
					iconCls: 'title'
				})
    grid.getTopToolbar().add('->')
    grid.getTopToolbar().add(btnBreach);
    grid.getTopToolbar().add('-');
	grid.getTopToolbar().add(btnReturn);
	
	sm.on('selectionchange', function(sm){ // grid 行选择事件
	 		var record = sm.getSelected()
	var tb = grid.getTopToolbar()
	 		if (record!=null) {
	 			if(dyView=='true'){
	 				
	 			}else {
	 				tb.items.get("breach").enable()
	 			}
	  	}
	  	else
	  	{
	 			tb.items.get("breach").disable()
	  	}
	  	
    });	
    // 12. 加载数据
    ds.load({params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });
    
    
    // 13. 其他自定义函数，如格式化，校验等
    function renderBreno(value, metadata, record){
    dyView=true;
	var getBreid = record.get('breid');
	var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
	output += 'onmouseout="this.style.cursor = \'default\';"'
	output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
	output += 'window.location.href=\''+BASE_PATH
	output += 'Business/contract/cont.breach.view.jsp?conid='+selectedConId+'&breid='+getBreid+'&conname='+selectedConName+'&conno='+selectedConNo+'&uids='+UIDS+'&conids='+CONIDS+'&optype='+OPTYPE+'&dyView='+dyView+'\'">'+ value+'</span>'
	return output;
	}
    
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
 
    function penaltytypeRender(value){
   		var str = '';
   		for(var i=0; i<penaltytypes.length; i++) {
   			if (penaltytypes[i][0] == value) {
   				str = penaltytypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}

});




