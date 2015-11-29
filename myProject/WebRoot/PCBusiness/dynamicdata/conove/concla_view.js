// 全局变量
var bean = "com.sgepit.pmis.contract.hbm.ConCla"
var primaryKey = "claid"
var orderColumn = "conid"
var billTypes = new Array();
var compensateTypes = new Array(); 
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
    appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });     
    DWREngine.setAsync(true);
    
    var dspenaltytype = new Ext.data.SimpleStore({
        fields: ['k', 'v'],     
        data: compensateTypes
    });	 

	
	// 1. 创建选择模式
    var sm =  new Ext.grid.RowNumberer()
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
			height: 120,
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
         }, 'clatype': {
			name: 'clatype',
			fieldLabel: '索赔类型',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选择违约类型...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dspenaltytype,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            maxValue: 100000000,   
            allowBlank: false,        
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
         },'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         }   
    }

    var cm = new Ext.grid.ColumnModel([	
      sm,
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
           align : 'center',
           width: 120,
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
           header: fc['clatype'].fieldLabel,
           dataIndex: fc['clatype'].name,
           align : 'center',
           width: 120,
           renderer : function (v){
               for(var i=0;i<dspenaltytype.getCount();i++){
                   if(dspenaltytype.getAt(i).get('k')==v)
                   return dspenaltytype.getAt(i).get('v');
               }
           }
        },{
           header : fc['billstate'].fieldLabel,
           dataIndex :fc['billstate'].name,
           align : 'center',
           width: 120,
           renderer : function (v){
               for(var i=0;i<billTypes.length;i++){
                   if(v==billTypes[i][0]){
                       return billTypes[i][1]
                   }
               }
           }
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
		{name: 'clatype', type: 'string'},
		{name: 'cladate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'filelsh', type: 'string'},
		{name :'billstate',type:'string'}
		];
      
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	beanName: bean,				
	    	primaryKey: primaryKey,
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
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.GridPanel({
        // basic properties
    	id: 'grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        tbar: ['->',new Ext.Button({
            text : '返回',
            iconCls :'returnTo',
            handler : function (){
                history.back();
            }
        })],					//顶部工具栏，可选
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
		}
//		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
//            pageSize: pageSize,
//            store: ds,
//            displayInfo: true,
//            displayMsg: ' {0} - {1} / {2}',
//            emptyMsg: "无记录。"
//        })
   });
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
    
  
	    ds.load();
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
     
    function renderClano(value, metadata, record){
	var getConid = record.get('conid');
	var getClaid = record.get('claid');
	var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
	output += 'onmouseout="this.style.cursor = \'default\';"'
	output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
	output += 'window.location.href=\''+BASE_PATH
	output += 'PCBusiness/dynamicdata/conove/concla_detail.jsp?claid='+getClaid+'\'">'+ value+'</span>'
	return output;
	}
     
 	
});




