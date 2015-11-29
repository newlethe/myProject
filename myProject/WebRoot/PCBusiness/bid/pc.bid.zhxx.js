var bean = "com.sgepit.pcmis.bid.hbm.PcBidZbZhxxView";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var grid,ds,sm;
var primaryKey = 'uids';
var beanSub = "com.sgepit.pcmis.bid.hbm.PcBidZbZhxxViewSub";
var bidNoticeBusinessType = "PCBidNotice";
var disableBtn = ModuleLVL != '1';
Ext.onReady(function(){
/***************************主表start***************************/
	//评标方式,系统属性维护
	var fc = {		// 创建编辑域配置
    	 'uids': {name: 'uids',fieldLabel: '评标报告'}, 
    	 'pid': {name: 'pid',fieldLabel: '工程项目编号',hidden:true,hideLabel:true},
    	 'zbUids': {name: 'zbUids',fieldLabel: '招标信息主键',hidden:true,hideLabel:true},
    	 'contentes': {name: 'contentes',fieldLabel: '招标内容' ,anchor:'95%'},
    	 'zbName': {name: 'zbName',fieldLabel: '招标项目', anchor:'95%'},
    	 'pubDocument':{name: 'pubDocument',fieldLabel: '招标公告', anchor:'95%'},
	  	 'pbWays' : {name : 'pbWays',fieldLabel : '评标办法',anchor:'95%'},
		 'zbUnit':{name: 'zbUnit',fieldLabel: '中标单位', anchor:'95%'}
    };
     var Columns = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'zbUids', type: 'string'},
    	{name: 'contentes', type: 'string'},
    	{name: 'zbName', type: 'string'},
    	{name: 'pubDocument', type: 'string'},
    	{name: 'pbWays', type: 'string'},
    	{name: 'zbUnit', type: 'string'}
	];
		
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {uids:'',pid:CURRENTAPPID, zbUids:'',contentes: '', zbName:''}	//设置初始值 
        
    sm =  new Ext.grid.CheckboxSelectionModel({})
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	//sm,
    	{	id:'pid',
    		header: fc['pid'].fieldLabel,
    		dataIndex: fc['pid'].name,
    		hidden: true
    	},
    	{	id:'zbUids',
    		header: fc['zbUids'].fieldLabel,
    		dataIndex: fc['zbUids'].name,
    		hidden: true
    	},
    	{	id:'zbName', 
        	header: fc['zbName'].fieldLabel, 
        	hidden:true,
        	dataIndex: fc['zbName'].name
        },
        {	id:'contentes',
        	header: fc['contentes'].fieldLabel,
        	dataIndex: fc['contentes'].name
        },
        
        {	id:"uids",
    		header:fc['uids'].fieldLabel,
    		dataIndex: fc['uids'].name,
				renderer:function(value, metadata, record, rowIndex,colIndex, store){
					var uids;
					DWREngine.setAsync(false);	
			        db2Json.selectData("select uids from pc_bid_progress where progress_type='BidAssess' and content_uids='"+value+"'", function (jsonData) {
				    var list = eval(jsonData);
				    if(list!=null&&list[0]){
				   	 uids=list[0].uids;
				     		 }  
				      	 });		
					var editable=false;	
					var count=0;
			        db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where transaction_Type='PCBidAssessReport' and transaction_Id='"+uids+"'", function (jsonData) {
				    var list = eval(jsonData);
				    if(list!=null&&list[0]){
				   	 count=list[0].count;
				     		 }  
				      	 });
				    DWREngine.setAsync(true);	
				    var  bidprojectType="PCBidAssessReport";
				    var downloadStr="查看["+count+"]";								
					return '<a href="javascript:showUploadWin(\''
							+ bidprojectType + '\', ' + editable + ', \''
							+ uids + '\', \'评标报告\' )">' + downloadStr +'</a>'	
			}
    	},{
			id : 'pubDocument',
			header : fc['pubDocument'].fieldLabel,
			dataIndex : fc['pubDocument'].name,
			width:70,
			align : 'center',
			renderer : function(value, metadata, record, rowIndex,
					colIndex, store) {
				var count=0;
				DWREngine.setAsync(false);
		        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+value+"' and transaction_type='"+bidNoticeBusinessType+"'", function (jsonData) {
			    var list = eval(jsonData);
			    if(list!=null){
			   	 count=list[0].num;
			     		 }  
			      	 });
			    DWREngine.setAsync(true);
			    var downloadStr="附件["+count+"]";
				return '<a href="javascript:showUploadWin(\''
						+ bidNoticeBusinessType + '\', '+ !disableBtn +', \''
						+ value + '\', \'公告文件\' )">' + downloadStr +'</a>'
			}

		},{	id:'pbWays',
        	header: fc['pbWays'].fieldLabel,
        	dataIndex: fc['pbWays'].name
        },
        {
			id : 'zbUnit',
			header : fc['zbUnit'].fieldLabel,
			dataIndex : fc['zbUnit'].name,
			width : 200
		}
    ]);

    cm.defaultSortable = true;						//设置是否可排序
      
    // 4. 创建数据源
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: "pid='" + CURRENTAPPID + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.EditorGridPanel({
    	id: 'grffid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [
        	'<font color=#15428b><B>招标综合信息<B></font>'
        ],					//顶部工具栏，可选
        region: 'north',
        height:document.body.clientHeight * 0.55,
       // clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
      	autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			ignoreAdd: true,
			forceFit:true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 10,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,
      	primaryKey: primaryKey
   });
   grid.addListener({
   		"click":function(){
   			var contentUids = sm.getSelected().get("uids");
   			dsSub.baseParams.params = "pid='" + CURRENTAPPID + "' and contentUids='"+contentUids+"'";
   			dsSub.load({params : {start : 0,limit : 10}});
   		}
   });
   ds.load({params : {start : 0,limit : 10}});
   
   /***************************主表end***************************/
   /***************************子表start***************************/
   var fcSub = {		// 创建编辑域配置
    	 'uids': {name: 'uids',fieldLabel: '评标报告'}, 
    	 'pid': {name: 'pid',fieldLabel: '工程项目编号',hidden:true,hideLabel:true},
    	 'contentUids': {name: 'contentUids',fieldLabel: '招标内容主键' ,hidden:true,hideLabel:true},
    	 'tbUnit': {name: 'tbUnit',fieldLabel: '投标单位', anchor:'95%'},
    	 'preHearResult': {name: 'preHearResult',fieldLabel: '预审结果', anchor:'95%'},
    	 'offer': {name: 'offer',fieldLabel: '报价（元）', anchor:'95%'}
    };
     var ColumnsSub = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'contentUids', type: 'string'},
    	{name: 'tbUnit', type: 'string'},
    	{name: 'preHearResult', type: 'string'},
    	{name: 'offer', type: 'float'}
	];
		
    var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {uids:'',pid:CURRENTAPPID, contentUids: '', tbUnit:'',preHearResult:'',offer:''}	//设置初始值 
        
    var smSub =  new Ext.grid.CheckboxSelectionModel({})
    var cmSub = new Ext.grid.ColumnModel([		// 创建列模型
    	{	id:'pid',
    		header: fcSub['pid'].fieldLabel,
    		dataIndex: fcSub['pid'].name,
    		hidden: true
    	},
    	{	id:'tbUnit', 
        	header: fcSub['tbUnit'].fieldLabel, 
        	dataIndex: fcSub['tbUnit'].name
        },
        {	id:'preHearResult',
        	header: fcSub['preHearResult'].fieldLabel,
        	dataIndex: fcSub['preHearResult'].name,
        	hidden:true,
        	renderer:function(v){
        		var str = '';
        		if(v=='1'){
        			str = '通过';
        		}else{
        			str = '未通过';
        		}
        		return str;
        	}
        },
        {	id:"offer",
    		header:fcSub['offer'].fieldLabel,
    		align:'right',
    		dataIndex: fcSub['offer'].name
    	}
    ]);

    cmSub.defaultSortable = true;						//设置是否可排序
      
    // 4. 创建数据源
    var dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: business,
	    	method: listMethod,
	    	params: "pid='" + CURRENTAPPID + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uids'
        }, ColumnsSub)
        //remoteSort: true,
        //pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsSub.setDefaultSort('offer','DESC');
    // 5. 创建可编辑的grid: grid-panel
    var gridSub = new Ext.grid.EditorGridPanel({
    	id: 'grffid-panel1',			//id,可选
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        region: 'center',
       // clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
      	autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			ignoreAdd: true,
			forceFit:true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 10,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantSub,				
      	plantInt: PlantIntSub,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanSub,					
      	business: business,
      	primaryKey: 'uids'
   });
   //dsSub.load({params : {start : 0,limit : 10}});
   /***************************子表end***************************/
   var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [grid,gridSub]
	});
   var viewport = new Ext.Viewport({
        layout:'border',
        items: [contentPanel]
    });
    
    if(zbUids !=""){
			
			ds.baseParams.params = "pid='" + CURRENTAPPID + "' and zbUids = '"+zbUids+"'";
			ds.load({
				params:{
					start:0,
					limit:10
				}
			});
		}		
});

//评标报告查看
function showUploadWin(businessType, editable, businessId, winTitle) {
	
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}
//招标公告查看
function showUploadWin(businessType, editable, businessId, winTitle) {
	
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	fileWin.on("close",function(){
		ds.load();
	});
}
