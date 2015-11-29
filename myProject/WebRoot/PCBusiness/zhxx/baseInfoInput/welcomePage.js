var store =null;
Ext.onReady(function (){
        store = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "",				
	    	business: "pcPrjServiceImpl",
	    	method: "welcomePage",
	    	params:""
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "pid"
        }, [
        	{name: 'unitname', type: 'string'},
        	{name: 'unitid', type: 'string'},
        	{name: 'prjTotal', type: 'float'},
        	{name: 'xjTotal', type: 'float'},
        	{name: 'kjTotal', type: 'float'},
        	{name: 'gjTotal', type: 'float'},
        	{name: 'investTotal', type: 'float'},
        	{name: 'fundSrcTotal', type: 'float'},
        	{name: 'zbjjtTotal', type: 'float'},
        	{name: 'zbjzyTotal', type: 'float'},
        	{name: 'zbjqtTotal', type: 'float'},
        	{name: 'dkTotal', type: 'float'},
        	{name: 'qtTotal', type: 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	
	var grid = new Ext.grid.GridPanel({
		//title:'<div style="float:right">单位：万元</div>',
		region:'center',
	    store: store,
        border:false,
	    columns: [new Ext.grid.RowNumberer(),
	        {header: "公司名称", width:200, dataIndex: 'unitname',
	         renderer:function(v,m,record,row){
	            var unitid=record.get('unitid');
	         	return "<a href='javascript:jumpWindow(\""+unitid+"\",\""+v+"\")'>"+v+"</a>"}
	        },
	        {header: "项目概览", align:'center', dataIndex: 'prjTotal',
	         renderer:function(v,m,record,row){
	          	var unitid=record.get('unitid');
	         	return "<a href='javascript:showEditWindow(\""+unitid+"\")'>共"+v+"个项目</a>";
	         }
	        },
	        {header: "新建项目", align:'center', dataIndex: 'xjTotal'},
	        {header: "扩建项目", align:'center', dataIndex: 'kjTotal'},
	        {header: "改建项目", align:'center', dataIndex: 'gjTotal'},
	        {header: "投资规模", align:'right', dataIndex: 'investTotal',
	         renderer:function(v){
	         	var value=cnMoneyToPrec(v/10000,2);
	         	return value;
	         }
	        },
	        {header: "资金来源", align:'right', dataIndex: 'fundSrcTotal',
	         renderer:function(v,m,record,row){
	         	var value=cnMoneyToPrec(v/10000,2);
	         	return "<a href='javascript:foundSrcEditWindow(\""+row+"\")'>"+value+"</a>"}
	        }],
	    viewConfig:{
	    	forceFit:true
	    }    
	});
	
	store.load();
	var viewport = new Ext.Viewport({
            layout: 'border',
            autoWidth:true,
            items: [grid,{
					region:'south',
					height:240,
					split:true,
					layout:'border',
					items:[{
						region:'center',
						html:'<div id="myChart" style="height:100%"></div>'
					},{
						region:'east',
						width:240,
						title:'我关注的内容',
						collapsible :true,
						collapsed : false,
						html:'<div id="msg" style="height:100%"></div>'
					}]
				}]
           
    });
    
    chart = new Carton("/XCarton/XCarton.swf", "ChartId", "100%", "100%", "#FFFFFF", "1");
    chart.render("myChart");
    chart.setDataURL("PCBusiness/cml/welcomeChart.cml");
    chart.setParam("UNITID",USERBELONGUNITID);
	chart.setParam("UNITNAME",USERBELONGUNITNAME);
	loadMsg();
	
});

function loadMsg(){
	var tpl = new Ext.Template(
				'<div class="bq">',
			    '<a href="javascript:openTaskWindow()" class="tb01">您目前有<span>{unFlow}</span>条待办事项未处理</a>',
	  			'<a href="javascript:openMsgWindow()" class="tb02">您目前有<span id="msgNum">{unMsg}</span>条信息未阅读</a>' +
	  			'<a href="javascript:jumpToWarnInfo()" class="tb02">共有<span id="warnCount">{warnCount}</span>条预警信息</a>',
	  			'<a href="javascript:openDynamicdataWindow()" class="tb02"><span id="dynamicData">本月业务数据动态概览</span></a>	</div>'
			 )
	var taskSql = "select count(*) from task_view where tonode='" + USERID + "' and flag='0'";
	baseDao.getDataAutoCloseSes(taskSql,function(list){
		var o = new Object();
		var publishUrl='';
		var uploadUrl='';
		o.unFlow = list[0];
		DWREngine.setAsync(false);
		
		//warnSql 找到登陆用户所在二级公司下所有项目单位的预警信息, 并且该预警信息状态为"未处理",或"处理中"(不能为"已关闭")
		/*
		var warnSql = "select count(*) from pc_warn_info "
					+ "where pid in ("
					+ "select unitid from sgcc_ini_unit where unit_type_id = 'A'"
					+ "connect by prior unitid = upunit start with unitid='"+USERBELONGUNITID+"')"
				+ " and warnstatus<>'3'";
				*/
		var warnSql = "select count(pc.uids) from pc_warn_dowith_info p left join pc_warn_info pc on p.warninfoid=pc.uids where  p.dowithperson='" + USERID + "' and pc.uids is not null and p.dowithtype='1'"
		baseDao.getDataAutoCloseSes(warnSql, function(list1){
			o.warnCount = list1[0];
		})
		
	    ComFileManageDWR.getModuleUrlByUserId('发布消息提醒', USERID, function(url) {
        	if(url){
        		publishUrl=url;
        	}
         }); 
	    ComFileManageDWR.getModuleUrlByUserId('上报消息提醒', USERID, function(url) {
        	if(url){
        		uploadUrl=url;
        	}
         });  
         
         if(publishUrl&&uploadUrl){//两类消息查看权限都存在
         	var rootPublishId=getRootId(publishUrl);
         	var rootUploadId=getRootId(uploadUrl);
			ComFileManageDWR.getUnreadMsgNumTotal(CURRENTAPPID,USERID, USERDEPTID,rootPublishId,rootUploadId,function(retVal){
				o.unMsg = retVal;
				tpl.overwrite('msg',o);
			});
         }
         else if(publishUrl&&!uploadUrl){//有发布消息查看权限
         	var rootId=getRootId(publishUrl);
			ComFileManageDWR.getUnreadMsgNumPublish(USERID, USERDEPTID,rootId,function(retVal){
				o.unMsg = retVal;
				tpl.overwrite('msg',o);
			});          	
         }
         else if(!publishUrl&&uploadUrl){//有上报消息查看权限
         	var rootId=getRootId(uploadUrl);
			ComFileManageDWR.getUnreadMsgNumUpload(USERID, USERDEPTID,rootId,function(retVal){
				o.unMsg = retVal;
				tpl.overwrite('msg',o);
			});          	
         }  
         else if(!publishUrl&&!uploadUrl){//发布与消息模块查看权限都没有
				o.unMsg = 0;
				tpl.overwrite('msg',o);         	
         }            
		DWREngine.setAsync(true);
	})
}
//解析url得到rootid的值
function getRootId(url){
	var params="";
	var array=url.split("?");
    if(array.length>1){
    	var paramArr = array[1].split("&");
    	for (i=0; i<paramArr.length; i++) {
    		if(paramArr[i].indexOf("rootId=")==0) {
    			params = (paramArr[i].split("="))[1];
    		}
    	}
    }
    return params;
}

function openTaskWindow(){
	parent.showTaskWin();
}
function openMsgWindow(){
	var msgWin = parent.showMsgWin();
	
	msgWin.on('hide', function(p){
		getUnreadNum();
	});
}

function jumpToWarnInfo(){
	var url = BASE_PATH+"PCBusiness/warn/dowithmanager/warn.dowith.index.jsp";
	window.location.href=url;
}

function getUnreadNum(){
	var publishUrl='';
	var uploadUrl='';
		DWREngine.setAsync(false);
	    ComFileManageDWR.getModuleUrlByUserId('发布消息提醒', USERID, function(url) {
        	if(url){
        		publishUrl=url;
        	}
         }); 
	    ComFileManageDWR.getModuleUrlByUserId('上报消息提醒', USERID, function(url) {
        	if(url){
        		uploadUrl=url;
        	}
         });  
         if(publishUrl&&uploadUrl){//两类消息查看权限都存在
          	var rootPublishId=getRootId(publishUrl);
         	var rootUploadId=getRootId(uploadUrl);        	
			ComFileManageDWR.getUnreadMsgNumTotal(CURRENTAPPID,USERID, USERDEPTID,rootPublishId,rootUploadId,function(retVal){
				document.getElementById('msgNum').innerHTML = retVal;
			});
         }
         else if(publishUrl&&!uploadUrl){//有发布消息查看权限
         	var rootId=getRootId(publishUrl);
			ComFileManageDWR.getUnreadMsgNumPublish(USERID, USERDEPTID,rootId,function(retVal){
				document.getElementById('msgNum').innerHTML = retVal;
			});          	
         }
         else if(!publishUrl&&uploadUrl){//有上报消息查看权限
         	var rootId=getRootId(uploadUrl);
			ComFileManageDWR.getUnreadMsgNumUpload(USERID, USERDEPTID,rootId,function(retVal){
				document.getElementById('msgNum').innerHTML = retVal;
			});          	
         }  
         else if(!publishUrl&&!uploadUrl){//发布与消息模块查看权限都没有
			document.getElementById('msgNum').innerHTML = 0;       	
         }            
		DWREngine.setAsync(true);		
}
function openDynamicdataWindow(){
	var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
	window.location.href=url;
}
function foundSrcEditWindow(row){
	var record=store.getAt(row);
	 var srcStore = new Ext.data.Store({
        proxy: "",
        reader: new Ext.data.JsonReader({}, [
        	{name: 'unitname', type: 'string'},
        	{name: 'unitid', type: 'string'},
        	{name: 'prjTotal', type: 'float'},
        	{name: 'xjTotal', type: 'float'},
        	{name: 'kjTotal', type: 'float'},
        	{name: 'gjTotal', type: 'float'},
        	{name: 'investTotal', type: 'float'},
        	{name: 'fundSrcTotal', type: 'float'},
        	{name: 'zbjjtTotal', type: 'float'},
        	{name: 'zbjzyTotal', type: 'float'},
        	{name: 'zbjqtTotal', type: 'float'},
        	{name: 'dkTotal', type: 'float'},
        	{name: 'qtTotal', type: 'float'}
        ])
    });
	srcStore.add(record);
	var editWin;
	if(!editWin){
		var src_grid = new Ext.grid.GridPanel({
			title:'<div style="float:left">资金来源</div><div style="float:right">单位：元</div>',
			region:'center',
		    store: srcStore,
		    columns: [
		        {header: "资本金（集团出资）", width:130,align:'center', dataIndex: 'zbjjtTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "资本金（自有资金）", width:130,align:'center', dataIndex: 'zbjzyTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "资本金（其他）", width:120,align:'center', dataIndex: 'zbjqtTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "贷款", width:110,align:'center', dataIndex: 'dkTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        },
		        {header: "其它", width:110, align:'center', dataIndex: 'qtTotal',
		        	renderer:function(v){return cnMoneyToPrec(v,0)}
		        }]
		});
		
		eidtWin = new Ext.Window({
			width:630,
			height:150,	
			y:100,		
			buttonAlign:"center",
			plain:true,//颜色匹配
			collapsible:false,//折叠
			modal:true,//变灰
			draggable:true,//拖动
			layout:"fit",
			resizable:false,//尺寸变换
			items:[src_grid],
			buttons:[]
		});
	}
	eidtWin.show();
}

function jumpWindow(unitid,unitname){
	parent.lt.collapse();
	if(unitid == "103"){
		parent.pathButton.setText("<b>欢迎进入综合信息管理首页</b>");
		parent.frames["contentFrame"].location.href =CONTEXT_PATH+'/PCBusiness/zhxx/index/pc.zhxx.pro.index.jsp?unitid='+unitid;
	}else{
		parent.pathButton.setText("<b>当前位置:"+parent.selectedSubSystemName+"</b>");
		parent.frames["contentFrame"].location.href =CONTEXT_PATH+'/PCBusiness/zhxx/query/pc.zhxx.projinfo.index.jsp?unitid='+unitid+'&unitname='+unitname;
	}
}

function showEditWindow(unitid){
	if(unitid){
		window.showModalDialog(
			CONTEXT_PATH+ "/PCBusiness/zhxx/baseInfoInput/prjCountIndex.jsp",
			unitid,"dialogWidth:980px;dialogHeight:450px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
}
if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}
