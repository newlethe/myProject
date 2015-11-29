/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量


var ServletUrl = CONTEXT_PATH + "/servlet/BdgServlet";
var bean = "com.sgepit.pmis.contract.hbm.ConCla"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "claid"
var orderColumn = "conid"
var formPanelTitle = "新增一条记录"
var PAGE_SIZE = 5;
var propertyName = "conid"
var propertyValue = conid;
var SPLITB = "`"
var pid = CURRENTAPPID;
var compensateTypes = new Array(); 
var headerTitle = "合同："+ conname + " , 所有赔偿记录"
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
   outFilter=" claid in ("+str+")";
}
Ext.onReady(function (){
    DWREngine.setAsync(false);  
	appMgm.getCodeValue('合同索赔类型',function(list){         //获取索赔类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			compensateTypes.push(temp);			
		}
    });
    DWREngine.setAsync(true);
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href =BASE_PATH+"Business/budget/bdg.generalInfo.input.jsp?conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnCompensate = new Ext.Button({
		id: 'compensate',
		text: '合同索赔分摊',
		tooltip: '合同索赔分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			var record = sm.getSelected();
			var id = record.get('conid');
			if (id){
			var compensateAppUrl;
			if ( hasNk == '0' ){
				compensateAppUrl = "Business/budget/bdg.compensate.apportion.jsp";
			}
			else{
				compensateAppUrl = "Business/budget/bdg.compensate.apportion.combine.jsp";
			}
			window.location.href = BASE_PATH + compensateAppUrl + "?conid=" 
				+ id + "&conname=" + encodeURIComponent(conname) + "&conno="+conno+"&claid="+ record.get('claid') + "&clano=" + record.get('clano')
				+"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
								}
							}
	});
	
	// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'claid': {
			name: 'claid',
			fieldLabel: '索赔流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'clano': {
			name: 'clano',
			fieldLabel: '索赔编号',
			anchor:'95%'
         }, 'clatext': {
			name: 'clatext',
			fieldLabel: '索赔情况', 
			height:200, 
			allowBlank: false,       
			anchor:'95%'
         }, 'clawork': {
			name: 'clawork',
			fieldLabel: '索赔处理',
			height:200,          
			anchor:'95%'
         }, 'clamoney': {
			name: 'clamoney',
			fieldLabel: '索赔金额', 
			allowNegative:false,  
			allowBlank: false,       
			anchor:'95%'
         }, 'claappmoney': {
			name: 'claappmoney',
			fieldLabel: '索赔分摊金额', 
			allowNegative:false,  
			allowBlank: false,       
			anchor:'95%'
         }, 'clatype': {
			name: 'clatype',
			fieldLabel: '索赔类型',
			anchor:'95%'
			
         },'cladate': {
			name: 'cladate',
			fieldLabel: '索赔日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            allowBlank: false,  
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '索赔附件流水号',
			hidden:true,
			hideLabel:true,
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
           id:'claid',
           header: fc['claid'].fieldLabel,
           dataIndex: fc['claid'].name,  
           hidden: true, 
           width: 110
        },{
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           header: fc['filelsh'].fieldLabel,
           dataIndex: fc['filelsh'].name,
           width: 90,
           hidden:true
           
        },{
           header: fc['clano'].fieldLabel,
           dataIndex: fc['clano'].name,
           width: 120,
           align : 'center',
           renderer: renderClano
        },{
           header: fc['cladate'].fieldLabel,
           dataIndex: fc['cladate'].name,
           width: 120,
           align : 'center',
           renderer: formatDate
        },{
           header: fc['clamoney'].fieldLabel,
           dataIndex: fc['clamoney'].name,
           width: 90,
           align:'right',
           allowNegative:false,
           renderer: cnMoneyToPrec
        },{
           header: fc['claappmoney'].fieldLabel,
           dataIndex: fc['claappmoney'].name,
           width: 90,
           align:'right',
           allowNegative:false,
           renderer: cnMoneyToPrec
        },{
           header: fc['clatype'].fieldLabel,
           dataIndex: fc['clatype'].name,
           renderer: function(val){
           		for(var i=0; i<compensateTypes.length; i++){
				 	if (val == compensateTypes[i][0])
						return compensateTypes[i][1]
				}
           },
           align : 'center',
           width: 120
        }
      
    ]);
    cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'claid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'clano', type: 'string'},    	
		{name: 'clamoney', type: 'float'},
		{name: 'claappmoney', type: 'float'},
		{name: 'clatype', type: 'string'},
		{name: 'cladate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'filelsh', type: 'string'}
		];
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {pid:pid, conid: conid,clano:'',clamoney:0,clatype:'',filelsh:'',claappmoney:0}	//设置初始值   
      
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'listCla',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+"='"+propertyValue+"'",
	    	outFilter :outFilter,
	    	conid:conid
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
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.GridPanel({
        // basic properties
    	id: 'grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        height: 300,				//高
        iconCls: 'icon-show-all',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
   });
    
  
    
  
    grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
		                text: '索赔分摊',
		                iconCls: 'btn',
		                value: record,
		                handler : function (){
						    window.location.href = BASE_PATH + "Business/budget/bdg.compensate.apportion.jsp?conid=" 
							+ conid + "&conname=" + conname + "&conno="+conno+"&claid="+ record.get('claid') + "&clano=" + record.get('clano');			
						}
                    }]
	    });
	
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}

	

	
   
    // 7. 创建内容面板content-panel，加入grid-panel和form-panel
    var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[grid]
    });
    
	// 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [contentPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [contentPanel]
        });
    }
    
    grid.getTopToolbar().add({
					text: '<font color=#15428b><b>&nbsp;'+headerTitle+'</b></font>',
					iconCls: 'title'
				})
    grid.getTopToolbar().add('->')
    grid.getTopToolbar().add(btnCompensate);
    grid.getTopToolbar().add('-');
	grid.getTopToolbar().add(btnReturn);
    
	// 11. 事件绑定
	 sm.on('selectionchange', function(sm){ // grid 行选择事件
   		var record = sm.getSelected()
		var tb = grid.getTopToolbar()
   		if (record!=null) {
   			if(dyView=='true'){
   			
   			}else {
   				tb.items.get("compensate").enable()
   			}
    	}
    	else
    	{
   			tb.items.get("compensate").disable()
    	}
    	
    });	
   	
    // 12. 加载数据
    ds.load({params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });
    
    
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
     
    function renderClano(value, metadata, record){
		var getConid = record.get('conid');
		var getClaid = record.get('claid');
		return '<a href="'+BASE_PATH + 'Business/contract/cont.compensate.view.jsp?conid='+getConid+'&claid='+getClaid+'&conname='+conname+'&conno='+conno+'&uids='+UIDS+'&conids='+CONIDS+'&optype='+OPTYPE+'&dyView=true">'+ value+'</a>'
	}
     
 	
});




