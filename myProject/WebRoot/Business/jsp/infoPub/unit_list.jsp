<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String pubid = request.getParameter("pubId");
	String type = request.getParameter("type");
%>
<html>
	<head>
		<title>发布处理</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath %>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<script type="text/javascript" src="<%=path%>/extExtend/columnNodeUI.js"></script>
        <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnTree.css" />
		<script src='dwr/engine.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		
  </head>
  
  <body>
  	<div id="unit"></div>
  </body>
</html>
<script>
var tree,gridPane,unitGrid,container,viewport
var pubId = '<%=pubid%>'
var type = '<%=type%>'
var username = '<%=username%>'
var unitid = '<%=userunitid%>'

if(unitid == defaultOrgRootID){
	unitid = defaultOrgRootID
}
else {
	if(username == "system" || username == "Administrator") 
		unitid = '<%=userunitid%>'
	else 
		unitid = '<%=userposid%>'
}

var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=unitTree";
var sm

Ext.onReady(function(){
	if(type == 'bdw' || type == 'xsdw') {
	    load = new Ext.tree.TreeLoader({
	            dataUrl:treeNodeUrl + "&treeType=columnCheck&parentId="+unitid+"&pubId="+pubId+"&type="+type,
	            requestMethod: "GET",
	            uiProviders:{
	                'col': Ext.tree.ColumnNodeUI
	            }
	    });
		
		var cm1 = [
		  {header:'单位名称',width:450,dataIndex:'unitname'},
		  {header:'发布状态', width:100,dataIndex:'flag',renderer:transState},
		  {header:'单位类型ID', width:0,dataIndex:'unitTypeId',hidden:true}
	    ];
		var root = new Ext.tree.AsyncTreeNode({
			text: defaultOrgRootName,
            id: defaultOrgRootID,
            draggable: false,            
            expanded: true
			
		})
	    tree = new Ext.tree.ColumnTree({
	    	id:'checkTree',
	        region: 'center',  
	        width:800,
	        height:document.body.clientHeight,
	        rootVisible:false,
	        autoScroll:true,
	        title:'',
	        checkModel: 'cascade',
	        columns:cm1,       
	        loader: load,
	        root: root
	    });
	    
	    tree.on('beforeload', function(node){ 
			tree.loader.dataUrl = treeNodeUrl+"&treeType=columnCheck&parentId="+node.id+"&pubId="+pubId+"&type="+type; 
		});
		
		viewport = new Ext.Viewport({
			layout:'border',
			items:[tree]
		});
	}
	
	if(type == 'bdw_pubed' || type == 'xsdw_pubed') {
	
		var bean = "com.sgepit.lab.ocean.infopub.hbm.SgccInfoPub";
		var business = "infoPubService";
		var listMethod = "getPublishUnitOrUser";
		var primaryKey = "pubinfoId";
		var orderColumn = "pubDate";
		var listWhere = "pubId"+SPLITB+pubId+SPLITA+"unitId"+SPLITB+unitid+SPLITA+"type"+SPLITB+type
		
		var Columns = [
    	{name: 'lsh', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'unitid', type: 'string'},		
		{name: 'unitName', type: 'string'},
		{name: 'pubDate', type: 'date',dateFormat : 'Y-m-d H:i:s'}]
		
	    var Plant = Ext.data.Record.create(Columns);			//定义记录集
	    var PlantInt = {
	    	lsh: '',
	    	unitid: '',
	    	unitName: '',
	    	pubDate: ''
	    }
	    
	    sm =  new Ext.grid.CheckboxSelectionModel()
	    cm = new Ext.grid.ColumnModel([		// 创建列模型
	    	sm,{
	           id:"unitid",
	           header: "单位ID",
	           dataIndex: "unitid",
	           hidden:true,
	           width: 0
	        },{
	           id:"unitName",
	           header: "发布单位",
	           dataIndex: "unitName",
	           width: 400
	        }, {
	           id:"pubDate",
	           header: "发布时间",
	           dataIndex: "pubDate",
	           align: 'center',
	           width: 150,
	           renderer: function(value) {
	           		return value ? value.dateFormat('Y-m-d H:i:s') : '';
	           }
	        }
		])
		
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
	    //ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
		
		unitGrid = new Ext.grid.EditorGridTbarPanel({
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
	
		gridPane = new Ext.Panel({
	    	id: 'grid',
	    	region: 'center',
			collapsible: false,
			collapsed: false,
			margins:'0 0 0 0',
			layout:'fit',
			border: false,
			items: unitGrid
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

function transState(value) {
	if(value == 'true')
		return "<div style='color:red;'>已发布</div>"
	else if(value == 'false')
		return "未发布"
	else 
		return ""
}

function getUnitId() {
	var data = ""
	if(type == 'bdw') {
		 var selNodes = tree.getChecked()
		 for(var i=0; i<selNodes.length; i++) {
		 	if(selNodes[i].attributes.flag == 'false' && (selNodes[i].attributes.unitTypeId != '3' && selNodes[i].attributes.unitTypeId != '5'))
			    data += "``"+selNodes[i].id	    
		 }
		 data = data.substr(2)
	} else if(type == 'xsdw') {
		 var selNodes = tree.getChecked()
		 for(var i=0; i<selNodes.length; i++) {
		 	if(selNodes[i].attributes.unitTypeId != '3' && selNodes[i].attributes.unitTypeId != '5')
			    data += "``"+selNodes[i].id	    
		 }	    
		 data = data.substr(2)
	} else {
		var arr = sm.getSelections()
		for(var i = 0; i < arr.length; i++) {
			data += "``"+arr[i].get("unitid")
		}
		data = data.substr(2)
		if(data.length > 0)
			data += ";update"
	}
	return data
}

</script>
