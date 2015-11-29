var bean = "com.sgepit.pmis.contract.hbm.ConCha";
var business = "conchaMgm";
var listMethod = "findByProperty";
var ServletUrl = MAIN_SERVLET;
var primaryKey = "chaid";
var propertyName = "conid";
var propertyValue = g_conid;
var SPLITB = "`";
var changes = new Array();
var billTypes = new Array();

Ext.onReady(function (){

 	DWREngine.setAsync(false);
	appMgm.getCodeValue('合同变更类型',function(list){      //获取变更类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			changes.push(temp);			
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


	
	var fcChange = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			anchor:'95%'
         }, 'chaid': {
			name: 'chaid',
			fieldLabel: '变更流水号',
			hidden:true,
			anchor:'95%'
         }, 'chano': {
			name: 'chano',
			fieldLabel: '变更单编号',
			anchor:'95%'
         }, 'chamoney': {
			name: 'chamoney',
			fieldLabel: '变更金额', 
			allowNegative: false,
            //maxValue: 100000000,         
			anchor:'95%'
         }, 'actionman': {
			name: 'actionman',
			fieldLabel: '经办人',
			anchor:'95%'
         }, 'chamoney': {
			name: 'chamoney',
			fieldLabel: '变更金额', 
			allowNegative: false,
            //maxValue: 100000000,         
			anchor:'95%'
         }, 'chadate': {
			name: 'chadate',
			fieldLabel: '变更日期',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',          
			anchor:'95%'
         },'chatype': {
			name: 'chatype',
			fieldLabel: '变更类型',
			anchor:'95%'
         }, 'chareason': {
			name: 'chareason',
			fieldLabel: '变更原因',          
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '变更附件号',
			hidden:true,
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         }
	}

	var cmChange = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'conid',
           header: fcChange['conid'].fieldLabel,
           dataIndex: fcChange['conid'].name, 
           hidden:true,        
           width: 200
        },{
           id:'pid',
           header: fcChange['pid'].fieldLabel,
           dataIndex: fcChange['pid'].name,
           hidden: true,
           width: 120
        },{
           header: fcChange['chaid'].fieldLabel,
           dataIndex: fcChange['chaid'].name,
           hidden:true,
           width: 120
        },{
           header: fcChange['chano'].fieldLabel,
           dataIndex: fcChange['chano'].name,
           align:'center',
           width: 120
        },{
           header: fcChange['chamoney'].fieldLabel,
           dataIndex: fcChange['chamoney'].name,
           align:'right',
           width: 120
        },{
           header: fcChange['chadate'].fieldLabel,
           dataIndex: fcChange['chadate'].name,
           renderer: formatDate,
           align : 'center',
           width: 120
        },{
           header: fcChange['chatype'].fieldLabel,
           dataIndex: fcChange['chatype'].name,
           renderer: changeRender,
           align : 'center',
           width: 120
        },{
           header: fcChange['actionman'].fieldLabel,
           dataIndex: fcChange['actionman'].name,
           width: 120,
           align : 'center',
           renderer:getUserName
        },{
           header: fcChange['billstate'].fieldLabel,
           dataIndex: fcChange['billstate'].name,
           width: 120,
           align : 'center',
           renderer:billTypeRender
        },{
           header: fcChange['chareason'].fieldLabel,
           dataIndex: fcChange['chareason'].name,
           align :'center',
           hidden : DEPLOY_UNITTYPE != "0",
           width: 90
        },{
           header: fcChange['remark'].fieldLabel,
           dataIndex: fcChange['remark'].name,
           align : 'center',
           hidden:true,
           width: 120
        },{
           header: fcChange['filelsh'].fieldLabel,
           dataIndex: fcChange['filelsh'].name,
           hidden:true,
           width: 120
        }
      
    ]);
    cmChange.defaultSortable = true;						//设置是否可排序


    // 3. 定义记录集
    var ColumnsChange = [
    		{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
			{name: 'pid', type: 'string'},
			{name: 'chaid', type: 'string'},
			{name: 'chano', type: 'string'},
			{name: 'chamoney', type: 'float'},
			{name: 'chatype', type: 'string'},
			{name: 'chadate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'actionman', type: 'string'},
			{name: 'chareason', type: 'string'},
			{name: 'remark', type: 'string'},
			{name: 'filelsh', type: 'string'},
			{name: 'billstate', type: 'string'}
	];
 
    // 4. 创建数据源
    var storeChange = new Ext.data.Store({
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
        }, ColumnsChange),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });

	storeChange.on("load", function(ds){
		if (ds.getCount() > 0){
			parent.tabChange.getEl().setDisplayed("block");
		}
	})

	var gridChange = new Ext.grid.GridPanel({
        store: storeChange,
        cm: cmChange,
        border: false,
        //width:800,   
        autoScroll: true,			//自动出现滚动条
        autoShow: true,
        region: 'center',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}/*,        
        bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: storeChange,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
        	})*/
    });

    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [gridChange],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [gridChange]
        });
    }

    storeChange.load();
    
 	var notesTip = new Ext.ToolTip({
		width: 500,
		target: gridChange.getEl()
	});	   
	
	gridChange.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("9" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('chareason')
			});
			point = e.getXY();
			notesTip.showAt(e.getX-100,e.getY);
		}
	});	    
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

	function changeRender(value){
   		var str = '';
   		for(var i=0; i<changes.length; i++) {
   			if (changes[i][0] == value) {
   				str = changes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function getUserName(value){ //取得用户真实姓名
   		var result="";
   		DWREngine.setAsync(false);
   		baseMgm.getData("select realname from rock_user where userid ='"+ value +"'",function(list){
   			if(null !=list){
   				result = list;
   			}
   		})
   		DWREngine.setAsync(true);
   		return result;
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