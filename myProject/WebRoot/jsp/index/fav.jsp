<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%
	String id = request.getParameter("id")==null?"":request.getParameter("id");
 %>
<html>
  <head>
  	<%@ include file="/jsp/common/golobalJs.jsp"%>
    <base href="<%=basePath%>">
    <title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="<%=basePath%>/extExtend/columnTree.css" />
	<link rel="stylesheet" type="text/css" href="<%=basePath%>/index/feed-viewer.css">
	<script type="text/javascript" src="<%=basePath%>/extExtend/extTreeNodeUI.js"></script>	
	<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
	<script type='text/javascript' src='<%=path%>/dwr/interface/systemMgm.js'></script>
  </head>
  
  <body>
  <script>
  	var pWinId = '<%=id%>'
    var chooseFunPanel,powerTree;
    var selectedList = new Array();
    var unSelectedList = new Array();
  	Ext.onReady(function(){
 		 	chooseFunPanel = new Ext.Panel({
		        margins:'0 0 0 0',
		        cmargins:'0 0 0 0',
		        deferredRender:false,
				border: false,
				layout:'fit',
				listeners:{
					render:function(){
						if(pWinId&&parent.Ext){
							var win = parent.Ext.getCmp(pWinId);
							if(win&&win.getTopToolbar&&win.getTopToolbar()){
								win.getTopToolbar().enable();
							}
						}
					}
				}
			});
			DWREngine.setAsync(false);
			systemMgm.getFavTree(USERID, function(rtn){
				if(rtn&&rtn!=""&&rtn!=null){
					powerTree = eval(rtn);
					powerTree.on("check",function(node,checked){
				    	if(node.leaf){
				    		if(checked){
					    		selectedList.push(node.id)
							}else{
								var flag = "false"
								for(var i=0;i<selectedList.length;i++){
									if(node.id == selectedList[i]){
										selectedList.splice(i,1);
										flag = "true"
										return;
									}
								}
								if(flag == "false"){
									unSelectedList.push(node.id)
								}
							}
				    	}
				    	
				    });
					chooseFunPanel.add(powerTree)
				}else{
					powerTree = null;
				}
			})
			DWREngine.setAsync(true);
			
  		 var viewport = new Ext.Viewport({
	        layout:'fit',
	        items:[chooseFunPanel]
	     });
	});
  </script>
  </body>
</html>
