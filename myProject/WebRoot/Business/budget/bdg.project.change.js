var ServletUrl = CONTEXT_PATH + "/servlet/BdgServlet";
var bean = "com.sgepit.pmis.contract.hbm.ConCha";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "chaid";
var orderColumn = "chadate";
var gridPanelTitle = "合同：" + selectedConName + "  ,所有变更记录";
var formPanelTitle = "编辑记录（查看详细信息）";
var SPLITB = "`";
var pid = CURRENTAPPID;
var propertyName = "conid";
var propertyValue = selectedConId;
var formDialogWin;
var changeTypes = new Array();

Ext.onReady(function (){
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href = BASE_PATH + "Business/budget/bdg.generalInfo.input.jsp"
		}
	});
	
	
	var btnProject = new Ext.Button({
		id: 'project',
		text: '工程量变更',
		tooltip: '工程量变更',
		iconCls: 'btn',
		hidden : true,
		disabled: true,
		handler: function(){
			if (sm.hasSelection()){
				var record = sm.getSelected();
				var id = record.get('conid');
				var changeid = record.get('chaid');
				window.location.href = BASE_PATH + "Business/budget/bdg.project.apportion.change.jsp?conid=" 
					+ selectedConId + "&conname=" + selectedConName + "&conno="+g_conno+ "&conmoney="+conmoney +"&changeid="+changeid;
			}
		}
	});
	
	
	DWREngine.setAsync(false);	
    appMgm.getCodeValue('合同变更类型',function(list){		//付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		changeTypes.push(temp);
    	}
    });
	
    bdgChangeMgm.isProject(selectedConId, function(flag){
    	if (flag == 1){
    		btnProject.setVisible(true);
    	}
    });
    
    DWREngine.setAsync(true);

    var changeTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : changeTypes
    });
    
    var sm =  new Ext.grid.CheckboxSelectionModel()
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'chaid': {
			name: 'chaid',
			fieldLabel: '变更流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chano': {
			name: 'chano',
			fieldLabel: '变更编号',
			anchor:'95%'
         },'actionman': {
			name: 'actionman',
			fieldLabel: '经办人',
			anchor:'95%'
         }, 'chamoney': {
			name: 'chamoney',
			fieldLabel: '变更金额',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
         }, 'changeappmoney': {
			name: 'changeappmoney',
			fieldLabel: '变更分摊金额',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
         }, 'chadate': {
			name: 'chadate',
			fieldLabel: '变更日期',
            format: 'Y-m-d',
            minValue: '2000-01-01',
            disabledDays: [0, 6],
            disabledDaysText: '只能选择工作日！',
            allowBlank: false,
			anchor:'95%'
         },'chatype': {
			name: 'chatype',
			fieldLabel: '变更类型',
			displayField: 'v',
			valueField: 'k',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			store: changeTypeStore,
			lazyRender: true,
			listClass: 'x-combo-list-small',
			allowBlank: false,
			anchor:'95%'
         },'chareason': {
			name: 'chareason',
			fieldLabel: '变更原因',
			height: 130,
			width: 490,
			allowBlank: false,
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注',
			height: 175,
			width: 490,
			anchor:'95%'
         }, 'filelsh': {
			name: 'filelsh',
			fieldLabel: '变更附件编号',
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
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden: true,
           width: 120
        },{
           id:'chaid',
           header: fc['chaid'].fieldLabel,
           dataIndex: fc['chaid'].name,
           hidden: true,
           width: 120
        },{
           id:'chano',
           header: fc['chano'].fieldLabel,
           dataIndex: fc['chano'].name,
           width: 120,
           align : 'center',
           renderer: renderchano
        },{
           id:'chamoney',
           header: fc['chamoney'].fieldLabel,
           dataIndex: fc['chamoney'].name,
           width: 70,
           align: 'right',
           renderer: cnMoneyToPrec
        },{
           id:'changeappmoney',
           header: fc['changeappmoney'].fieldLabel,
           dataIndex: fc['changeappmoney'].name,
           width: 70,
           align: 'right',
		   renderer: cnMoneyToPrec
        },{
           id:'chadate',
           header: fc['chadate'].fieldLabel,
           dataIndex: fc['chadate'].name,
           width: 90,
           align : 'center',
           renderer: formatDate
        },{
           id:'chatype',
           header: fc['chatype'].fieldLabel,
           dataIndex: fc['chatype'].name,
           width: 120,
           align : 'center',
           renderer: changeTypesRender
        },{
           id:'actionman',
           header: fc['actionman'].fieldLabel,
           dataIndex: fc['actionman'].name,
           align : 'center',
           width: 120,
           renderer:function(data){
				           var data1="";
							DWREngine.setAsync(false);
							baseMgm.getData("select useraccount,realname from rock_user where userid='"+data+"'",function(list){
							    for(var i = 0;i<list.length;i++){
							       data1=list[i][1];
                                   return data1
				                 }
				            })
                            return data1;
                           DWREngine.setAsync(true);
				        }
        }
    ]);
    cm.defaultSortable = true;						//设置是否可排序
    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'chaid', type: 'string'},
		{name: 'chano', type: 'string'},
		{name: 'chamoney', type: 'float'},
		{name: 'changeappmoney', type: 'float'},
		{name: 'chatype', type: 'string'},
		{name: 'chadate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'actionman', type: 'string'}
	];
	var Fields = Columns.concat([
		{name: 'chareason', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'filelsh', type: 'string'}
	]);
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantFields = Ext.data.Record.create(Fields);
    var PlantFieldsInt = new Object();
    
    var PlantInt = {pid: pid, 
    				conid: selectedConId, 
    				chano: '', 
    				chamoney: 0,
    				changeappmoney:0,
    				chatype: '', 
    				chadate: '',
    				actionman: '' }	//设置初始值

    Ext.applyIf(PlantFieldsInt, PlantInt);
    PlantFieldsInt = Ext.apply(PlantFieldsInt, {chareason: '', remark: '', filelsh: ''});
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'listCha',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+"='"+propertyValue+"' ",
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
        title: gridPanelTitle,		//面板标题
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
	}

	

	// 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout: 'border',
            items: [grid],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout: 'border',
            items: [grid]
        });
    }
   
	grid.getTopToolbar().add({
								text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
								iconCls: 'title'
							})
	grid.getTopToolbar().add('->')
	grid.getTopToolbar().add(btnProject); 
	grid.getTopToolbar().add('-'); 
	grid.getTopToolbar().add(btnReturn);  
	
	// 11. 事件绑定
    sm.on('selectionchange', function(sm){ // grid 行选择事件
		var tb = grid.getTopToolbar()
   		if (sm.hasSelection()) {
   			tb.items.get("project").enable()
    	}
    	else
    	{
   			tb.items.get("project").disable()
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

    
    
     function renderchano(value, metadata, record){
		var getChaid = record.get('chaid');
		return '<a href="'+BASE_PATH + 'Business/contract/cont.change.view.jsp?dyView=true&conid='+selectedConId + '&chaid='+getChaid+'">'+ value+'</a>'
		
		
		
		return output;
	}
	
    // 下拉列表中 k v 的mapping 
   	function changeTypesRender(value){	//变更类型
   		var str = '';
   		for(var i=0; i<changeTypes.length; i++) {
   			if (changeTypes[i][0] == value) {
   				str = changeTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
});




