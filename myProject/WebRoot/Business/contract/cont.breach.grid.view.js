var bean = "com.sgepit.pmis.contract.hbm.ConBre"
var business = "conbreMgm"
var listMethod = "findByProperty"
var ServletUrl = MAIN_SERVLET
var primaryKey = "breid"
var propertyName = "conid"
var propertyValue = g_conid;
var SPLITB = "`"
var penaltytypes= new Array();
var billTypes = new Array();
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
    appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });        
	DWREngine.setAsync(true);


	
    var fcBreach = {		
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
         }, 'breno': {
			name: 'breno',
			fieldLabel: '违约编号',
			anchor:'95%'
         } , 'breid': {
			name: 'breid',
			fieldLabel: '违约流水号',
			hidden:true,
			anchor:'95%'
         }, 'brereason': {
			name: 'brereason',
			fieldLabel: '违约原因',          
			anchor:'95%'
         }, 'bredate': {
			name: 'bredate',
			fieldLabel: '违约日期', 
			format: 'Y-m-d',
            minValue: '2000-01-01',         
			anchor:'95%'
         }, 'dedmoney': {
			name: 'dedmoney',
			fieldLabel: '违约金额',          
			anchor:'95%'
         }, 'bretype': {
			name: 'bretype',
			fieldLabel: '违约类型',      
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
         },'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         }     
    }

    var cmBreach = new Ext.grid.ColumnModel([		
    	{
           id:'conid',
           header: fcBreach['conid'].fieldLabel,
           dataIndex: fcBreach['conid'].name,  
           hidden: true,       
           width: 200
        },{
           id:'pid',
           header: fcBreach['pid'].fieldLabel,
           dataIndex: fcBreach['pid'].name,
           hidden: true,
           width: 120
        },{
           header: fcBreach['breid'].fieldLabel,
           dataIndex: fcBreach['breid'].name,
           hidden:true,
           width: 120
        },{
           header: fcBreach['breno'].fieldLabel,
           dataIndex: fcBreach['breno'].name,
           align  : 'center',
           width: 120
        }, {
           header: fcBreach['brereason'].fieldLabel,
           dataIndex: fcBreach['brereason'].name,
           align  : 'center',
           hidden:true,
           width: 120
        },{
           header: fcBreach['bredate'].fieldLabel,
           dataIndex: fcBreach['bredate'].name,
           renderer: formatDate,
           align  : 'center',
           width: 120
        },{
           header: fcBreach['dedmoney'].fieldLabel,
           dataIndex: fcBreach['dedmoney'].name,
           width: 90,
           align:'right',
           renderer: cnMoney
        },{
           header: fcBreach['bretype'].fieldLabel,
           dataIndex: fcBreach['bretype'].name,
           renderer: bretypeRender,
           align  : 'center',
           width: 120
        },{
           header: fcBreach['remark'].fieldLabel,
           dataIndex: fcBreach['remark'].name,
           align  : 'center',
           hidden:true,
           width: 200
        },{
           header: fcBreach['brework'].fieldLabel,
           dataIndex: fcBreach['brework'].name,
           align  : 'center',
           hidden:true,
           width: 200
        },{
           header: fcBreach['filelsh'].fieldLabel,
           dataIndex: fcBreach['filelsh'].name,
           hidden:true,
           width: 120
        },{
           header : fcBreach['billstate'].fieldLabel,
           dataIndex :fcBreach['billstate'].name,
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
    cmBreach.defaultSortable = true;	

    // 3. 定义记录集
    var ColumnsBreach = [
    	    {name: 'conid', type: 'string'},		
			{name: 'pid', type: 'string'},
			{name: 'breid', type: 'string'}, 
			{name: 'breno', type: 'string'},    	
			{name: 'brereason', type: 'string'},    	
			{name: 'bredate', type: 'date',dateFormat: 'Y-m-d H:i:s'},
			{name: 'dedmoney', type: 'float'},
			{name: 'bretype', type: 'string'},
			{name: 'remark', type: 'string'},
			{name: 'brework', type: 'string'},
			{name: 'filelsh', type: 'string'},
			{name :'billstate',type :'string'}
	];
 
    // 4. 创建数据源
    var storeBreach = new Ext.data.Store({
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
        }, ColumnsBreach),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });

	storeBreach.on("load", function(ds){
		if (ds.getCount() > 0){
			parent.tabBreach.getEl().setDisplayed("block");
		}
	})

	var gridBreach = new Ext.grid.GridPanel({
        store: storeBreach,
        cm: cmBreach,
        border: false,
        //width:800,   
        autoScroll: true,			//自动出现滚动条
        autoShow: true,
        forceFit: true,
        region: 'center',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}/*,        
        bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: storeBreach,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
        	})*/
    });

    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [gridBreach],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [gridBreach]
        });
    }

    storeBreach.load(/*{params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    }}*/);

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

	function bretypeRender(value){
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