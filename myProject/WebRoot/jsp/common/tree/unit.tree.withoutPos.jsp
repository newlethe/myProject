<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String type = (String)request.getParameter("model");
	String parentId = (String)request.getParameter("parentId");
	String year = (String)request.getParameter("year");
	String selUnits = (String)request.getParameter("selectedUnits");
	//year为空默认取当前年，year为‘all’则取所有年度
	if(type == null)
		type = "multiple";
	if(parentId == null)
		parentId = "0";
	if(year==null)
		year = "";
	selUnits = selUnits==null?"":selUnits;
%>
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>单位树</title>
	    <script type="text/javascript" src="<%=path%>/extExtend/extTreeNodeUI.js"></script>
	</head>
	<body>
	</body>
<script type="text/javascript">

//定义全局变量
var type = '<%=type%>'
var parentID= '<%=parentId%>'
var year = '<%=year%>'
var selUnits = '<%=selUnits%>'

var viewport
var unitTree,treeLoad;
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=unitTreeWithoutPos";

if(year !=''){
	treeNodeUrl += "&year="+year;
}
if(selUnits!=''){
	treeNodeUrl += "&selUnits="+selUnits;
}

Ext.onReady(function(){

	treeLoad = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId="+parentID,
		baseAttrs: { uiProvider: Ext.tree.TreeCheckNodeUI },
		requestMethod: "GET"
	})
	
	unitTree = new Ext.tree.TreePanel({
    	region: 'west',
    	title: '',
    	collapsible: false,
		split:true,
		border: false,
        width: 280,
        minSize: 175,
        maxSize: 300,
        margins:'0 0 0 2',
        rootVisible: true,
        autoScroll: true,
        checkModel: type,			//多项选择multiple,是否级联选择
        //onlyLeafCheckable:false,  //只有叶子节点可以选择
        loader: treeLoad,
        root: new Ext.tree.AsyncTreeNode({
        	text: "组织机构",
            id: parentID,
            draggable: false,
            expanded: true
        })
    });
    unitTree.on('beforeload', function(node){ 
		unitTree.loader.dataUrl = treeNodeUrl+"&parentId="+node.id; 
	});
    
    viewport = new Ext.Viewport({
		layout:'fit',
		items:[unitTree]
	});
	
});

//返回Grid的json串
function getArray() {
	var arr = unitTree.getChecked()
	var json = ""
	if(arr.length > 0) {
		json = "["
		for(var i = 0; i < arr.length-1; i++)
			json += "{unitid:'"+arr[i].id+"',unitname:'"+arr[i].text+"'},"
		json += "{unitid:'"+arr[arr.length-1].id+"',unitname:'"+arr[arr.length-1].text+"'}]"
	}
	return json
}

//获得单位id
function getUnitIds(){
	var unit_list = ''
	
	var arr = unitTree.getChecked()
	if(arr.length > 0) {
	   	for(var i=0;i<arr.length-1;i++) 
	   			unit_list += "'"+arr[i].id+ "'," 
		unit_list +=  "'"+  arr[arr.length-1].id+ "'"
	}
	return unit_list
}

//获得单位id和名称
function getSelectZb(){
	var unit_list = ''
	var unitname_list =''
	
	var arr = unitTree.getChecked()
   	for(var i=0;i<arr.length;i++) {
   			unit_list +=    arr[i].id+ "`" 
   			unitname_list +=  arr[i].text + "`" 
   			
   	}
	if(unit_list.length > 0) {
		unit_list = unit_list.substr(0,unit_list.length -1)
		unitname_list = unitname_list.substr(0,unitname_list.length -1)
	}
	return unit_list + "&&" + unitname_list
}

</script>
</html>
