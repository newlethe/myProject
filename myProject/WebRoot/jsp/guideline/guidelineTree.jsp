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

var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=unitTree";
var sm

Ext.onReady(function(){
    load = new Ext.tree.TreeLoader({
            dataUrl:treeNodeUrl + "&treeType=columnCheck&parentId="+unitid+"&pubId="+pubId+"&type="+type,
            requestMethod: "GET",
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
    });
	
	var cm1 = [
	  {header:'单位名称',width:282,dataIndex:'unitname'},
	  {header:'发布状态', width:0,dataIndex:'flag',hidden:true},
	  {header:'单位类型ID', width:0,dataIndex:'unitTypeId',hidden:true}
    ];
	
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
        root: new Ext.tree.AsyncTreeNode()
    });
	
	viewport = new Ext.Viewport({
		layout:'border',
		items:[tree]
	});
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
	var selNodes = tree.getChecked()
	for(var i=0; i<selNodes.length; i++) {
		if(selNodes[i].attributes.flag == 'false' && (selNodes[i].attributes.unitTypeId != '3' && selNodes[i].attributes.unitTypeId != '5'))
	    data += "``"+selNodes[i].id	    
	}
	data = data.substr(2)
	return data
}

</script>
