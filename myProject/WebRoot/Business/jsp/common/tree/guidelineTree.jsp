<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String type = (String)request.getParameter("model");
	if(type == null)
		type = "multiple";
	String hasCheckBox ="false";
	if(request.getParameter("hasCheckBox") ==null)
		hasCheckBox = "true";
	String state = "";
	if(request.getParameter("state") !=null)
		state = request.getParameter("state");
%>
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>指标树</title>
	    <script type="text/javascript" src="<%=path%>/extExtend/extTreeNodeUI.js"></script>
	</head>
	<body>
	</body>
<script type="text/javascript">

//定义全局变量
var viewport
var type = '<%=type%>'
var guideTree,treeLoad;
var zbSeqno = "";
var treeNodeUrl = CONTEXT_PATH + "/servlet/GuidelineServlet?ac=tree";
var parentID='d'
var hasCheckBox = '<%=hasCheckBox%>';
var state='<%=state%>';

Ext.onReady(function(){
	var dataUrl = treeNodeUrl + "&parentId="+parentID+"&treeName=GuidelineTree&hasCheckBox="+hasCheckBox
	if(state!=''){
		dataUrl += "&state="+state;
	}
	treeLoad = new Ext.tree.TreeLoader({
		dataUrl: dataUrl,
		requestMethod: "GET"
	})
	if(hasCheckBox=='true'){
		treeLoad.baseAttrs =  { uiProvider: Ext.tree.TreeCheckNodeUI }
	}
	
	guideTree = new Ext.tree.TreePanel({
		id:'guideline_tree',
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
        checkModel: type,			//多项选择multiple
        //onlyLeafCheckable:false,//只有叶子节点可以选择
        loader: treeLoad,
        root: new Ext.tree.AsyncTreeNode({
        	text: "指标",
            id: parentID,
            ifpercent:"0",
            jldw:'',
            draggable: false,
            expanded: true
        })
    });
    guideTree.on('beforeload', function(node){ 
    	var dataUrl = treeNodeUrl + "&parentId="+node.id+"&treeName=GuidelineTree&hasCheckBox="+hasCheckBox
		if(state!=''){
			dataUrl += "&state="+state;
		}
		guideTree.loader.dataUrl = dataUrl; 
	});
    
    viewport = new Ext.Viewport({
		layout:'fit',
		items:[guideTree]
	});
	
});

//返回Grid的json串
function getArray() {
	var arr = guideTree.getChecked()
	var json = ""
	if(arr.length > 0) {
		json = "["
		for(var i = 0; i < arr.length-1; i++)
			json += "{zb_seqno:'"+arr[i].id+"',zb_name:'"+arr[i].text+"'},"
		json += "{zb_seqno:'"+arr[arr.length-1].id+"',zb_name:'"+arr[arr.length-1].text+"'}]"
	}
	return json
}

//获得指标id
function getZbIds(){
	var zbid_list = ''
	
	var arr = guideTree.getChecked()
	if(arr.length > 0) {
	   	for(var i=0;i<arr.length-1;i++) 
	   			zbid_list += "'"+arr[i].id+ "'," 
		zbid_list +=  "'"+  arr[arr.length-1].id+ "'"
	}
	return zbid_list
}

//获得指标id和名称
function getSelectZb(){
	var zbid_list = ''
	var zbname_list =''
	var jldw_list = ''
	var zbStr = '';
	
	var arr = guideTree.getChecked()
   	for(var i=0;i<arr.length;i++) {
   			zbid_list +=    arr[i].id+ "`" 
   			zbname_list +=  arr[i].text + "`" 
   			jldw_list += arr[i].attributes.jldw + "`" 
   			
   	}
	if(zbid_list.length > 0) {
		zbid_list = zbid_list.substr(0,zbid_list.length -1)
		zbname_list = zbname_list.substr(0,zbname_list.length -1)
		jldw_list = jldw_list.substr(0,jldw_list.length -1)
		zbStr = zbid_list + "&&" + zbname_list +"&&"+jldw_list
	}
	return zbStr;
}

</script>
</html>
