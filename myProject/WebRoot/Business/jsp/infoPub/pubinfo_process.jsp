<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String type = request.getParameter("type");
	String pub = request.getParameter("pub");
	String pubid = request.getParameter("pubId");
%>
<html>
	<head>
		<title>发布处理</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath %>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<script type="text/javascript" src="<%=path%>/extExtend/columnNodeUI.js"></script>
        <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnTree.css" />
  </head>
  
  <body>
  </body>
</html>
<script>
var tabPan,container,viewport
var type = '<%=type%>'
var pub = '<%=pub%>'
var pubId = '<%=pubid%>'
Ext.onReady(function(){
    if(type == 'bdw' && pub == 'pub') 
		tabPan = new Ext.TabPanel({
			region: 'center',
			border: false,
			enableTabScroll:true,//允许面板的tab项宽度超过可用时,自动出现滚动条
			animScroll:true,//出现滚动条时,有动画效果
			activeTab:0,
			items:[ {xtype:"panel",
			        id:"bdw",
			        title:"部门列表",
			        html:'<iframe name="content1" src="Business/jsp/infoPub/unit_list.jsp?type=bdw&pubId='+pubId+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				    },
			        {xtype:"panel",
			        id:'bdwyh',
			        title:"用户列表",
			        html:'<iframe name="content2" src="Business/jsp/infoPub/user_list.jsp?type=bdwyh&pubId='+pubId+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
			        }]	        
		});
		
    if(type == 'xsdw' && pub == 'pub') 
		tabPan = new Ext.TabPanel({
			region: 'center',
			border: false,
			enableTabScroll:true,//允许面板的tab项宽度超过可用时,自动出现滚动条
			animScroll:true,//出现滚动条时,有动画效果
			activeTab:0,
			items:[ {xtype:"panel",
			        id:"xsdw",
			        title:"下属单位列表",
			        html:'<iframe name="content1" src="Business/jsp/infoPub/unit_list.jsp?type=xsdw&pubId='+pubId+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				    }]	        
		});
		
	if(type == 'bdw' && pub == 'pubed')
		tabPan = new Ext.TabPanel({
			region: 'center',
			border: false,
			enableTabScroll:true,//允许面板的tab项宽度超过可用时,自动出现滚动条
			animScroll:true,//出现滚动条时,有动画效果
			activeTab:0,
			items:[ {xtype:"panel",
			        id:"bdw_pubed",
			        title:"已发布部门",
			        html:'<iframe name="content1" src="Business/jsp/infoPub/unit_list.jsp?type=bdw_pubed&pubId='+pubId+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				    },
			        {xtype:"panel",
			        id:'bdwyh_pubed',
			        title:"已发布用户",
			        html:'<iframe name="content2" src="Business/jsp/infoPub/user_list.jsp?type=bdwyh_pubed&pubId='+pubId+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
			        }]	        
		});
		
	if(type == 'xsdw' && pub == 'pubed')
		tabPan = new Ext.TabPanel({
			region: 'center',
			border: false,
			enableTabScroll:true,//允许面板的tab项宽度超过可用时,自动出现滚动条
			animScroll:true,//出现滚动条时,有动画效果
			activeTab:0,
			items:[ {xtype:"panel",
			        id:"xsdw_pubed",
			        title:"已发布下属单位",
			        html:'<iframe name="content1" src="Business/jsp/infoPub/unit_list.jsp?type=xsdw_pubed&pubId='+pubId+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				    }]	        
		});
		
	container = new Ext.Panel({
    	region: 'center',    	
		margins:'0 0 0 0',
		layout:'fit',
		items: tabPan
	});
	
	viewport = new Ext.Viewport({
		layout:'border',
		items:[container]
	});
	

});

function getUnitId() {
	var tabId = tabPan.getActiveTab().id
	var data = ""
	if(tabId == "bdw" || tabId == "xsdw" || tabId == "bdw_pubed" || tabId == "xsdw_pubed") {
		data = window.frames["content1"].getUnitId()
	}
	if(tabId == "bdwyh" || tabId == "bdwyh_pubed") {
		data = window.frames["content2"].getUserId()
	}
	return data
}

</script>
