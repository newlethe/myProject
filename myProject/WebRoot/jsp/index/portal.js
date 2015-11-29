var setFastModWin,showNewsWin
var newsGridPageSize = 10
var docsGridPageSize = 10
var newsPortelHeight = 510
var flowGridHeight = 510
var newsGridHeight = (window["MessageCenter"]) ? MessageCenter.height - 29 : 270
var flowGridHeight = (window["FlowModules"]) ? FlowModules.height - 29 : 270
var docsPortelHeight = 320
var docsGridHeight = (window["DataRecommended"]) ? DataRecommended.height - 29 : 270;
var newsStr = "<div style='padding:8px;'><p>2009年8月11日下午，向家坝-上海±800千伏特高压直流输电示范工程启动验收委员会第一次会议在北京召开。会议正式宣布成立特高压直流示范工程启动验收委员会，公司党组书记、公司总经理刘振亚担任启动验收委员会主任委员；明确了工程建设的三个阶段目标... ...<a href='#'>&nbsp;&nbsp;[详细]&nbsp;&nbsp;"
var docStr = "<ul style='padding-top:5px;'><li class='li0'><a href='#'>《电网调度管理条例》</a><li class='li0'><a href='#'>《国家电网公司输变电工程可行性研究内容深度规定（试行）》</a><li class='li0'><a href='#'>《电网调度信息披露暂行办法》</a><li class='li0'><a href='#'>《电力系统技术导则》</a><li class='li0'><a href='#'>《电网调度信息披露实施细则(暂行)》</a><li class='li0'><a href='#'>《最新电网生产、运行标准、导则、规范》</a><li style='text-align:right;background:none'><a href='#'>&nbsp;&nbsp;更多...&nbsp;&nbsp;</a>";

Ext.onReady(function(){

    var tools = [{
        id:'gear',
        handler: function(){
            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
        }
    },{
        id:'close',
        handler: function(e, target, panel){
            panel.ownerCt.remove(panel, true);
        }
    }];
    
    var toolbarBtns ={
    	close: function(){
    		return { id:'close', handler: function(e, target, panel){ alert(panel.title); panel.ownerCt.remove(panel, true);} }
   		},
   		gear: function(){
    		return { id:'gear', handler: function(){ Ext.Msg.alert('Message', 'The Settings tool was clicked.');} }
   		},
   		favouritesGear: {
			id:'gear',
			handler: function(){
				if (!setFastModWin){
					setFastModWin = new Ext.Window({
						title : "配置常用操作",
						width : 460,
						height: 480,
						html: "<iframe src='../system/sys.fast.moudule.setting.jsp' frameborder=0 width=100% height=100%></iframe>",
						closeAction: 'hide', modal: true, plain: true, 
						closable: true, border: true, maximizable: false,
						listeners:{
							hide : afterConfig
						}
					});
					configChanged = false
					setFastModWin.show();
				}
			}
		}
    }
    
    /* 待办事项*/
	var flowSm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var flowCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
		}), {
			id: 'insid',
			type: 'string',
			header: '流程实例ID',
			dataIndex: 'insid',
			hidden: true,
			width: 100
		},{
			id: 'flowid',
			type: 'string',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true,
			width: 0
		},{
			id: 'flowtitle',
			type: 'string',
			header: '流程类型',
			dataIndex: 'flowtitle',
			width: 150
		},{
			id: 'title',
			type: 'string',
			header: '主题',
			dataIndex: 'title',
			renderer : function(value,md,rec,rInx,cInx,ds1){
				return "<a title=【处理】"+value+" href=javascript:doFlow('"+rec.data.insid+"')>"+value+"</a>"
			},
			width: 420
		},{
			id: 'ftime',
			type: 'date',
			header: '发送时间',
			dataIndex: 'ftime',
			renderer: function(value){
		        return value ? value.dateFormat('Y-m-d H:i:s') : '';
		    },
		    hidden : true,
		    width : 0
		},{
			id: 'fromname',
			type: 'string',
			type: 'string',
			header: '发送人',
			dataIndex: 'fromname',
			hidden : true,
		    width : 0
		}
	]);
	flowCm.defaultSortable = true;
	
	var flowColumns = [
		{name: 'logid', type: 'string'},
		{name: 'flowid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromnode', type: 'string'},
		{name: 'tonode', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'flag', type: 'string'},
		{name: 'nodename', type: 'string'},
		{name: 'fromname', type: 'string'},
		{name: 'toname', type: 'string'},
		{name: 'nodeid', type: 'string'}
	];
	
	flowDs = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: "com.sgepit.frame.flow.hbm.TaskView",
			business: "baseMgm",
			method: "findWhereOrderBy",
			params: "tonode='"+USERID+"' and flag=0"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'logid'
		}, flowColumns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	flowDs.setDefaultSort('ftime', 'desc');

	flowGrid = new Ext.grid.QueryExcelGridPanel({
		ds: flowDs,
		cm: flowCm,
		sm: flowSm,
        enableColumnResize: false,
        enableColumnMove: false,
        enableColumnHide: false,
        enableDragDrop : false,
        loadMask: true,
		height : flowGridHeight,
		loadMask: true,
		bbar: new Ext.PagingToolbar({
			id: 'my008',
            pageSize: PAGE_SIZE,
            store: flowDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	flowDs.load({
		params: {
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
	});
    /*  信息发布查询  */
    var newsGridPanel = new Ext.Panel({
    	height: newsGridHeight,
    	html:'<iframe name="newsGridFrame" src='+CONTEXT_PATH+'/Business/fileAndPublish/search/com.fileSearch.publish.jsp frameborder=0 style="width:100%;height:100%;"></iframe>'
    })
    /* 系统介绍 */
	//见portal.jsp页面中的introduction
	
    /* 常用操作 */
	//见portal.jsp页面中的favourites
	
	
	/* 消息中心 */
	var newsPlant = Ext.data.Record.create([
	    {name: 'pubinfoId',type:'string'},
	    {name: 'pubTitle', type: 'string'},
	    {name: 'fileType', type: 'string',sortable: true},
	    {name: 'fileLsh', type: 'string',sortable:false},
	    {name: 'pubDate', type: 'date',sortable: true, dateFormat: 'Y-m-d H:m:s'}
    ]);    
    var newsStore = new Ext.data.Store({
        baseParams:{
        	userid:USERID,
        	unitid:USERUNITID
        },
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url: "../../servlet/InfopubServlet?ac=getPublishByUnit"
		}),
        reader: new Ext.data.JsonReader({
               totalProperty: "results",    
               root: "rows", 
               id: "pubinfoId"
           }, newsPlant),
		remoteSort: true,
		sortInfo: {field:"pubDate", direction:'DESC'}
    });
    var newsGridPanel1 = new Ext.grid.GridPanel({
        ds: newsStore,
        cm: new Ext.grid.ColumnModel([
		{
			id:'fileType',
			header: '&nbsp;',
			dataIndex: 'fileType',
			hidden: false,
			width:50,
			renderer: function(vl){
				var fileTypes = [['1','通知'],['2','通告'],['3','公告'],['4','其它']]
	           	for(var i=0; i<fileTypes.length; i++){ if (fileTypes[i][0]==vl) return fileTypes[i][1]; }
			}
        },{
			id:'pubinfoId',
			header: 'pubinfoId',
			dataIndex: 'pubinfoId',
			hidden:true,
			width: 200
        },{
			id:'pubTitle',
			header: '标题',
			width: 320,
			dataIndex: 'pubTitle',
			renderer: function(value,p,r){
			var newGif = r.data['pubDate'].dateFormat('Y-m-d')==parent.TODAY ? "<img src='../res/images/new.gif' align=absmiddle>&nbsp;":"";
				return value!=""?newGif+"<a href=javascript: showNews('" + r.data["pubinfoId"] + "') title='" + value + "'>"+value+"</a>":newGif+"标题";
			}
        },{
			id:'pubDate',
			header: '日期',
			dataIndex: 'pubDate',
			width: 80,
			renderer: formatDateTime
        },{
			id:'fileLsh',
			header: '附件',
			dataIndex: 'fileLsh',
			width: 50,
			align: 'center',
			renderer: function(value){
				return value!=""?"<a href="+CONTEXT_PATH+"/filedownload?method=fileDownload&id="+value+" target='blank' title='下载阅读'><img src=../res/images/page_attach.png border=0></a>":""
			}
        }
		]),
        title: false,
        border: false,
        height: newsGridHeight,
        enableColumnResize: false,
        //autoExpandColumn: 'pubTitle',
        enableColumnMove: false,
        enableColumnHide: false,
        enableDragDrop : false,
        loadMask: true,
        bbar: new Ext.PagingToolbar({
            pageSize: newsGridPageSize,
            store: newsStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
    });

	/* 推荐资料 */
	var docPlant = Ext.data.Record.create([
	    {name: 'uuid',type:'string'},
	    {name: 'title',type:'string'},
	    {name: 'author', type: 'string'},
	    {name: 'userid', type: 'string'},
	    {name: 'fileLsh', type: 'string'},
	    {name: 'fileName', type: 'string'},
	    {name: 'createTime', type: 'string'}
	]);
	var docsStore = new Ext.data.Store({
        baseParams:{
        	userid: USERID,
        	recent: 'false'
        },
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : "../../business/docManager/docManager/docManagerPortal2.jsp"
		}),
        reader: new Ext.data.JsonReader({
               totalProperty: "results",    
               root: "rows", 
               id: "uuid"
           }, docPlant),
		remoteSort: true,
		sortInfo: {field:"createTime", direction:'DESC'}
    });
	var docsGridPanel = new Ext.grid.GridPanel({
		ds: docsStore,
		tbar: [{
			text:'查看其他最新',
			iconCls:'icon-by-date',
			handler:function(obj){
				var flag = obj.text == "查看其他最新"
				obj.setText(flag?"查看我的推荐":"查看其他最新")
				obj.setIconClass(flag?"orangeUser":"icon-by-date")
				docsStore.baseParams.recent = flag?"true":'false'
				docsStore.load(); 
			}
		}],
	    cm: new Ext.grid.ColumnModel([{
           id:'uuid',
           header: 'uuid',
           dataIndex: 'uuid',
           hidden: true,
           width:200
        },{
           id:'title',
           header: '标题',
           dataIndex: 'title',
           hidden: false,
           width: 360,
           renderer: function(vl, p ,d){
           	return String.format("<b><a href='"+ CONTEXT_PATH +"/filedownload?method=fileBlobDownload&compress=0&id="+d.data["fileLsh"]+"&fileName="+ d.data["fileName"] +"' title='{0}'>{0}</a></b><br><img src='../res/images/icons/user_gray.png' align=absmiddle>作者：{1}", vl, d.data["author"])
           }
        },{
           id:'userid',
           header: '上传用户',
           dataIndex: 'userid',
           hidden: true,
           width: 100
        },{
           id:'createTime',
           header: '上传时间',
           dataIndex: 'createTime',
           hidden: false,
           width: 140
        }]),
		title: false,
        border: false,
        loadMask: true,
        border: false,
        height: docsGridHeight,
        enableColumnResize: false,
        enableColumnMove: false,
        enableColumnHide: false,
        enableDragDrop : false,
		autoScroll: true,
        bbar: new Ext.PagingToolbar({
            pageSize: docsGridPageSize,
            store: docsStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })        
	});
	
	
	/* 文档和资料查询 */
	var searchFormPanel = new Ext.form.FormPanel({
		title: false,
		autoHeight: true,
		width:'100%',
		bodyStyle:{paddingLeft:"20px",paddingTop:"5px"},
		defaultType: 'textfield',
		items: [
			new Ext.form.ComboBox({
			    fieldLabel: '类型',
			    hiddenName:'state',
			    store: new Ext.data.SimpleStore({
			        fields: ['abbr', 'state'],
			        data : [['1','年度工作报告'],['2','年中工作报告'],['3','季度工作报告'],['4','重大事项'],['5','总部重要专项会议'],['6','上级有关部门的重要讲话']]
			    }),
			    valueField:'abbr',
			    displayField:'state',
			    triggerAction: 'all',
			    mode:'local',
			    selectOnFocus:true,
			    width:190
			}),{
			    fieldLabel: '关键字',
			    name: 'first',
			    width:190
			},
			new Ext.form.DateField({
			    fieldLabel: '日期',
			    name: 'dob',
			    width:190
			})
		],
		buttons:[{
			text: '查询'
		}]
	})
    
	/* 工作进展 */
	var workReportPanel = new Ext.TabPanel({
        activeTab: 0,
        autoWidth:true,
        height:151,
        tabPosition: 'bottom',
        autoScroll: true,
        border:false,
        defaults:{autoScroll: true},
        items:[{
                title: '公司各部门',
                html: newsStr
            },{
                title: '本部门各处室',
                html: newsStr
            },{
                title: '公司各单位',
                html: newsStr
            }
        ]
    })
	
	/* 运行情况 */
    var runStatusGridPanel = new Ext.grid.GridPanel({
		store: new Ext.data.Store({
            reader: new Ext.data.ArrayReader({}, [
		        {name: 'm', type: 'float'},
		        {name: 'v1', type: 'float'},
		        {name: 'v2', type: 'float'},
		        {name: 'v3', type: 'float'},
		        {name: 'v4'}
            ]),
	        data: [
	        ['1',1597.11,1614.75,40.28,0.983],
	        ['2',1657.43,1597.11,33.93,0.981],
	        ['3',1895.51,1760.64,47.74,0.968],
	        ['4',1832.68,1760.34,46.81,0.993],
	        ['5',1897.57,1778.62,60.29,0.98],
	        ['6',2027.27,1894.55,61.7,0.99],
	        ['7',2266.98,2065.41,63.85,0.973],
	        ['8',2278.04,2153.1,62.07,0.98]]
       	}),
	    columns: [
	        {id:'m',header: "月份", width: 35, sortable: true, align: 'center', dataIndex: 'm'},
	        {header: "供电", width: 75, sortable: true, align: 'right', dataIndex: 'v1'},
	        {header: "售电", width: 75, sortable: true, align: 'right', dataIndex: 'v2'},
	        {header: "发电", width: 75, sortable: true, align: 'right', dataIndex: 'v3'},
	        {header: "电量和经济相关性", width: 105, align: 'right', renderer: pctChange, dataIndex: 'v4'}
	    ],
	    stripeRows: true,
	    height: '100%',
	    title:false
	})
	
	
	/* Portlet 代码段 */
	if (window.ApplicationIntroduce) {
		Ext.applyIf(ApplicationIntroduce, 
		{
			tools: [toolbarBtns.close()], 
			autoLoad: "introduction.htm"
			//contentEl: "introduction"
		})
	}
	if (window.FlowModules) {
		Ext.applyIf(FlowModules,
		{
			tools: [toolbarBtns.close()],
	        items: flowGrid
	    })
	}
	if (window.FavorateModules) {
		Ext.applyIf(FavorateModules,
		{
			tools: [toolbarBtns.favouritesGear, toolbarBtns.close()],
	        contentEl: 'favourites'
	    })
	}
	   
    if (window.DataRecommended) {
		Ext.applyIf(DataRecommended, 
		{
			tools: [toolbarBtns.close()], 
			items: docsGridPanel
		})
	}
	
	if (window.MessageCenter) {
		Ext.applyIf(MessageCenter,
		{
			tools: [toolbarBtns.close()],
			items: newsGridPanel
		})
	}
	
	if (window.ComboDataSearch) {
	    Ext.applyIf(ComboDataSearch, 
		{
	       tools: [toolbarBtns.gear(), toolbarBtns.close()],
	       items: searchFormPanel
	    })
    }
    
    if (window.WorkReports) {
		Ext.applyIf(WorkReports,
		{
		    tools: [toolbarBtns.gear(), toolbarBtns.close()],
		    items: workReportPanel
	    })
	}

    if (window.RunStatus) {
		Ext.applyIf(RunStatus,
		{
			tools: [toolbarBtns.gear(), toolbarBtns.close()],
			items: runStatusGridPanel
		})
	}    
    
    /* 根据配置自动排列Portlet */
    var portlets = [];
    var colWidth = maxColIdx > 2 ? 0.33 : (maxColIdx>1?0.5:1);
    var unPlacedPortlets = [];
    for(var i=1; i<=maxColIdx; i++){
    	var tempArray = [];
    	for(var j=0; j<portletConfigObj.length; j++){
    		if (portletConfigObj[j].colIdx!="null"){
    			if (portletConfigObj[j].colIdx+"" == i+""){
    				if (typeof(eval(portletConfigObj[j].portletCode))!="undefined"){
    					tempArray.push(eval(portletConfigObj[j].portletCode));
    				}
    			}
    		} else {
    			try{
    				if (typeof(eval(portletConfigObj[j].portletCode))!="undefined"){
    					unPlacedPortlets.push(eval(portletConfigObj[j].portletCode));
    				}
    			}catch(e){
    			}
    		}
    	}
    	portlets.push({
    		columnWidth:colWidth,
    		style:i<maxColIdx?'padding:10px 0 10px 10px':(unPlacedPortlets.length>0?'padding:10px 0 10px 10px':'padding:10px'),
    		items: tempArray
    	})
    }

    if (unPlacedPortlets.length>0){
    	portlets.push({
    		columnWidth: colWidth,
    		style: 'padding:10px 0 10px 10px',
    		items: unPlacedPortlets
    	})
    }
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[{
            xtype: 'portal',
            region: 'center',
            border: false,
            items: portlets
        }]
    });
    
    
    
    
    newsStore.load({
    	params:{
    		start: 0,
    		limit: newsGridPageSize
    	}
    });
    docsStore.load({
    	params:{
    		start: 0,
    		limit: docsGridPageSize
    	}
    });
    
    
	/*	处理进度条	*/
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
   
	function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    }; 
    
    function pctChange(val){
      if (val!=''){
        if(val*1 >= 0.98){
            return '<span style="color: red;">' + val*100 + '%</span>';
        } else {
            return '<span style="color:green;">' + val*100 + '%</span>';
        }
      }
    }
});


var configChanged = false;
function afterConfig(){
	if (configChanged){
		configChanged = false;
		window.location.reload();
	}
}

function fastIntoModule(modid){
	changePortal()
	window.location.href = CONTEXT_PATH+"/servlet/SysServlet?ac=loadmodule&modid="+modid
}

function showNews(){
	if (!showNewsWin) {
		showNewsWin = new Ext.Window({
			title : "查看消息",
			width : 460,
			height: 480,
			html: "",
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: true, maximizable: false
		});
	}
	showNewsWin.show();
}



function switchToNaviTab(resourcepk){
	with(parent){
		for(var i=0; i<naviTopObj.length; i++){
			if (naviTopObj[i].resourcepk == resourcepk){
				naviTabs.activate(naviTopObj[i].powerpk)
			}
		}
	}
}

function doFlow(flowInstantId){
	changePortal()
	window.location.href = CONTEXT_PATH+"/jsp/flow/flw.main.frame.jsp?flowInstantId="+flowInstantId;
}
//首页标签转换方法
function changePortal(){
	/*var tabP = parent.naviTabs;
	var ap = tabP.getActiveTab();
	var apId = ap.getId();
	if(apId=="portal"){
		tabP.hideTabStripItem("portal")
		tabP.unhideTabStripItem("portal2")
	}else{
		tabP.hideTabStripItem("portal2")
		tabP.unhideTabStripItem("portal")
	}*/
}