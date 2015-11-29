<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>GridComboPanel</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="<%=path%>/extExtend/columnNodeUI.js"></script>
	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnTree.css" />
	    
	    
   		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	    <link rel="stylesheet" type="text/css" href="<%=path%>/gantt/frame/project/resource/css/multiselect.css"/>
	    <script type="text/javascript" src="gantt/frame/project/resource/js/DDView.js"></script>
	    <script type="text/javascript" src="gantt/frame/project/resource/js/MultiSelect.js"></script>
	    <script type="text/javascript" src="gantt/frame/project/resource/js/ItemSelector.js"></script>   
	    <script type="text/javascript" src="Business/pubinfo/fbyh/prjmember.js"></script>  	    
	    <script type="text/javascript" src="Business/pubinfo/fbyh/fileupload.js"></script>  	    
		    
  		<script type='text/javascript' src='<%=path%>/dwr/util.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/infoDwr.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/gantDwr.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		
		<script>var myuserid='<%=userid%>'</script>
		<script>var myusername='<%=username%>'</script>
		<script>var pubinfoQueryId = "<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";</script>
  </head>
  
  <body>
  </body>
</html>
<script>
var pubinfoId="";
var stateArray = [['all','全部'],['tz','通知'],['gg','公告'],['tb','通报'],['qt','其他']];
Ext.onReady(function(){
	var stateStr = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : stateArray
	});
	 var stateCombo = new Ext.form.ComboBox({
	 	 id : 'state_combo',
	 	 fieldLabel: '信息类型',
	 	 disable: true,
	 	 width: 150,
	 	 readOnly: true,
	 	 valueField: 'k',
	 	 displayField: 'v',
	 	 mode : 'local',
	 	 typeAhead: true,
	 	 triggerAction : 'all',
		 store : stateStr,
		 lazyRender : true,
		 listClass : 'x-combo-list-small',
		 listeners : {'collapse':function(com){
		 	if(com.value!="all"){
	        	window.frames["content1"].dbnetgrid1.fixedFilterPart="file_type='"+com.value+"'"
		 	}else{window.frames["content1"].dbnetgrid1.fixedFilterPart=""}
        	window.frames["content1"].dbnetgrid1.loadData()
	      }
	     } 
	})
	var tbar = new Ext.Toolbar({height:25})
	editBtn = new Ext.Toolbar.Button({
			id : 'edit',
			text : '查看详细信息',
			iconCls : 'btn',
			handler : onItemClick
		});
	var container = new Ext.Panel({
		region: 'center',
		renderTo: document.body,
		title: '发布信息查询',
		border: false,
		tbar: tbar,
		html: '<iframe name=content1 src=Business/pubinfo/pubinfoQueryGrid.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	
	tbar.add(editBtn,'-','类型查询：',stateCombo,"->","<font color=red>(可双击查看详细资料)</font>")
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[container]
	});

	
	function onItemClick(item) {
		var content1 = window.frames["content1"]
		var masterGrid = content1.document.all.dbnetgrid1;
		switch(item.id) {
			case 'edit':
				masterGrid.toolbar.all.updateBtn.click()
				break;
		}
	}
	

})


</script>