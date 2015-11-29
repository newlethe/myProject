<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
	
<html>
	<head>
		<title>指标下达</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
        <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnTree.css" />
		<script type="text/javascript" src="<%=path%>/extExtend/columnNodeUI.js"></script>
		<script src='dwr/interface/guidelineService.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
		<script src='dwr/interface/DataExchangeDwr.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script>
			var defaultParentId = '<%= Constant.APPOrgRootID %>';
			var defaultParentName = '<%= Constant.APPOrgRootNAME %>';
		</script>
		
  </head>
  
  <body>
  </body>
</html>
<script>

var tree , treeLoad , win
var treeNodeUrl = CONTEXT_PATH + "/servlet/GuidelineServlet?ac=tree&treeType=columnTree&treeName=GuidelineXDHistory";
var unitCombo

var username = '<%=username%>'
var unitid = '<%=userunitid%>'

Ext.onReady(function(){
	var northBar = new Ext.Toolbar({region:'north' , height:25})
	
	var unitStore = new Ext.data.SimpleStore({
        fields: ['val','txt']
    });
    
    var sql = "select t.unitid unitid, t.unitname unitname from sgcc_ini_unit t where t.unit_type_id in ('1', '2', '3', '4', '6') and t.unitid <> '10000100000000' "
    		+ "start with t.unitid = '"+unitid+"' connect by prior t.unitid = t.upunit order by t.unitid "
    db2Json.selectSimpleData(sql,function(data) {
    	unitStore.loadData(eval(data))
    })
    
	unitCombo = new Ext.form.ComboBox({
		id:'unit',
		store: unitStore,
		width:250,
		allowBlank: false,
		displayField:'txt',
		valueField : 'val',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
	});
	unitCombo.on('select',function(){
		//tree.loader.dataUrl = treeNodeUrl
		tree.root.reload()
	})
	
    treeLoad = new Ext.tree.TreeLoader({
            dataUrl:treeNodeUrl,
            requestMethod: "GET",
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
    });
	
    var cm = [
	  {header:'指标名称',width:380,dataIndex:'realname'},
	  {header:'计量单位',width:120,dataIndex:'jldw'},
	  {header:'下达时间',width:150,dataIndex:'xdsj'}
    ];
	
    tree = new Ext.tree.ColumnTree({
    	id:'checkTree',
        region: 'center',  
        width:1200,
        height:document.body.clientHeight,
        rootVisible:false,
        autoScroll:true,
        title:'',
        checkModel: 'cascade',
        columns:cm,       
        loader: treeLoad,
        root: new Ext.tree.AsyncTreeNode()
    });
    
	viewport = new Ext.Viewport({
		layout:'border',
		items:[northBar,tree]
	});
	
	treeLoad.on('beforeload',function(treeLoader) {
		treeLoad.baseParams.unitId = unitCombo.getValue()
	})

	northBar.add("&nbsp;选择查看单位：",unitCombo)
	
});

</script>

