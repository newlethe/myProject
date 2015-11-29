<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	
	String pubid = request.getParameter("pubId");
	String type = request.getParameter("type");
%>
<html>
	<head>
		<title>信息发布</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath %>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script src='dwr/engine.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
  </head>
  
  <body>
  	<div id="user"></div>
  </body>
</html>
<script>
var gridPane,userGrid,container,viewport,root
var unitName = '<%=unitname%>'
var pubId = '<%=pubid%>'
var type = '<%=type%>'
var username = '<%=username%>'
var unitId = '<%=userunitid%>'

if(unitId == defaultOrgRootID){
	unitId = defaultOrgRootID
} else
{
	if(username == "system" || username == "Administrator") {
		unitId = '<%=userunitid%>'
	}
	else {
		unitId = '<%=userposid%>'
	}
}


var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=unitTree";

var Columns,Plant,PlantInt,sm,cm

Ext.onReady(function(){
	var bean = "com.sgepit.frame.sysman.hbm.RockUser";
	var business = "infoPubService";
	var listMethod = "getPublishUnitOrUser";
	var primaryKey = "userid";
	var orderColumn = "pubDate";
	var listWhere = "pubId"+SPLITB+pubId+SPLITA+"unitId"+SPLITB+unitId+SPLITA+"type"+SPLITB+type
	
	
	if(type == 'bdwyh') {
		Columns = [
			{name: 'userid', type: 'string'},
			{name: 'unitname', type: 'string'},
			{name: 'realname', type: 'string'},
			{name: 'phone', type: 'string'},
			{name: 'pubState', type: 'string'}]
		
	    Plant = Ext.data.Record.create(Columns);			//定义记录集
	    PlantInt = {
	    	userid: '',
	    	unitname: '',
	    	realname: '',
	    	phone: '',
	    	pubState: ''
	    }
	    
	    sm =  new Ext.grid.CheckboxSelectionModel()
	    cm = new Ext.grid.ColumnModel([		// 创建列模型
	    	sm,
	    	{header: "单位名称" , width:150 , dataIndex: "unitname"},
			{header: "接受人" , width: 100 , dataIndex: "realname"},
			{header: "联络电话" , width: 100 , dataIndex: "phone"},
			{header: "发布状态" , dataIndex: "pubState" , renderer: function(value) {
				 	if(value == 'true') 
				 		return "<div style='color:red;'>已发布</div>"
				 	else
				 		return "未发布"
				}
			}
		]) 
	}
	
	if(type == 'bdwyh_pubed') {
		Columns = [
			{name: 'userid', type: 'string'},
			{name: 'unitname', type: 'string'},
			{name: 'realname', type: 'string'},
			{name: 'phone', type: 'string'},
			{name: 'pubDate', type: 'date',dateFormat : 'Y-m-d H:i:s'}]
		
	    Plant = Ext.data.Record.create(Columns);			//定义记录集
	    PlantInt = {
	    	userid: '',
	    	unitname: '',
	    	realname: '',
	    	phone: '',
	    	pubDate: ''
	    }
	    
	    sm =  new Ext.grid.CheckboxSelectionModel()
	    cm = new Ext.grid.ColumnModel([		// 创建列模型
	    	sm,
	    	{header: "单位名称" , width:200 , dataIndex: "unitname"},
			{header: "接受人" , width: 150 , dataIndex: "realname"},
			{header: "联络电话" , width: 150 , dataIndex: "phone"},
			{header: "发布时间" ,  width: 150 , dataIndex: "pubDate",renderer: function(value) {return value ? value.dateFormat('Y-m-d H:i:s') : '';}}
			
		]) 
	}
	
	cm.defaultSortable = true;						//设置是否可排序
    ds = new Ext.data.Store({ // 分组
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: listWhere
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
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
	
	userGrid = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			//id,可选
        ds: ds,							//数据源
        cm: cm,							//列模型
        sm: sm,							//行选择模式
        //tbar: [],						//顶部工具栏，可选
        //title: "",					//面板标题
        //iconCls: 'icon-by-category',	//面板样式
        addBtn: false ,
        saveBtn: false ,
        delBtn: false ,
        refreshBtn: false,
        border: false,				// 
        region: 'center',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        //header: true,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,	
        viewConfig : {
			ignoreAdd : true
		},			//加载时是否显示进度
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            beforePageText:"第",
	        afterPageText :"页,共{0}页",
            store: ds,
            displayInfo: true,
	        firstText: '第一页',  
	   		prevText: '前一页',  
	        nextText: '后一页',  
	        lastText: '最后一页',  
	        refreshText: '刷新',  
	        displayMsg: '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
            emptyMsg: "无记录。"
        }),
        
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: "infoPubService",	
      	primaryKey: primaryKey
	});

	if(type == 'bdwyh') {
	    root = new Ext.tree.AsyncTreeNode({
	       text: '国家电网公司',
	       id: unitId,
	       expanded:true
	    });
	    
	    treeLoader = new Ext.tree.TreeLoader({
			dataUrl:treeNodeUrl + "&parentId="+unitId+"&pubId="+pubId+"&type="+type,
			requestMethod: "GET"
		})

		treePanel = new Ext.tree.TreePanel({
	        id:'orgs-tree',
	        region:'west',
	        split:true,
	        width: 196,
	        minSize: 175,
	        maxSize: 500,
	        frame: false,
	        layout: 'accordion',
	        margins:'0 0 0 0',
	        cmargins:'0 0 0 0',
	        rootVisible: false,
	        lines:false,
	        autoScroll:true,
	        collapsible: true,
	        animCollapse:false,
	        animate: false,
	        collapseMode:'mini',
	        tbar: [{
	            iconCls: 'icon-expand-all',
				tooltip: '全部展开',
	            handler: function(){ root.expand(true); }
	        }, '-', {
	            iconCls: 'icon-collapse-all',
	            tooltip: '全部折叠',
	            handler: function(){ root.collapse(true); }
	        }],
	        loader: treeLoader,
	        root: root,
	        collapseFirst:false
		});
		treePanel.on('beforeload', function(node){ 
			treePanel.loader.dataUrl = treeNodeUrl + "&parentId="+node.id+"&pubId="+pubId+"&type="+type
		});
		
		treePanel.on('click', function(node, e){
			e.stopEvent();
			var listWhere = "pubId"+SPLITB+pubId+SPLITA+"unitId"+SPLITB+node.id+SPLITA+"type"+SPLITB+type
			ds.baseParams.params = listWhere
			ds.load({
				params:{
					start: 0,
					limit: PAGE_SIZE
				}
			});
	    });
	    
		gridPane = new Ext.Panel({
	    	id: 'grid',
	    	region: 'center',
	    	title:'单位用户',
			collapsible: false,
			collapsed: false,
			margins:'0 0 0 0',
			layout:'fit',
			border: false,
			items: userGrid
	    });
		
		container = new Ext.Panel({
	    	region: 'center',    	
			margins:'0 0 0 0',
			layout:'fit',
			items: gridPane
		});
		
		viewport = new Ext.Viewport({
			layout:'border',
			items:[treePanel , container]
		});
		
		ds.load({
	    	params:{
		    	start: 0,			//起始序号
		    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
	    	}
	    });
		
		root.select()
	}
	if(type == 'bdwyh_pubed') {
		gridPane = new Ext.Panel({
	    	id: 'grid',
	    	region: 'center',
	    	//title:'单位用户',
			collapsible: false,
			collapsed: false,
			margins:'0 0 0 0',
			layout:'fit',
			border: false,
			items: userGrid
	    });
		
		container = new Ext.Panel({
	    	region: 'center',    	
			margins:'0 0 0 0',
			layout:'fit',
			items: gridPane
		});
		
		viewport = new Ext.Viewport({
			layout:'border',
			items:[container]
		});
		
		ds.load({
	    	params:{
		    	start: 0,			//起始序号
		    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
	    	}
	    });
	}
});

function getUserId() {
	var data = ""
	if(type == 'bdwyh') {
		var arr = sm.getSelections()
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].get("flag") !=  'true')
				data += "``"+arr[i].get("userid")
		}
		data = data.substr(2)
	} else {
		var arr = sm.getSelections()
		for(var i = 0; i < arr.length; i++)
			data += "``"+arr[i].get("userid")
		data = data.substr(2)
		if(data.length > 0)
			data += ";update"
	}
	return data
}

</script>
