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
var treeNodeUrl = CONTEXT_PATH + "/servlet/GuidelineServlet?ac=tree&treeType=columnTree&treeName=GuidelineXDTree&parentId=d";

Ext.onReady(function(){
	var tbar = new Ext.Toolbar({height:25})
	
	downBtn = new Ext.Toolbar.Button({
		id: 'down',
        iconCls: "download",
        text: "下达单位",
        handler: confirm
    });
    
    historyBtn = new Ext.Toolbar.Button({
		id: 'history',
        iconCls: "download",
        text: "下达历史记录",
        handler: confirm
    });
    
    var guideStore = new Ext.data.SimpleStore({
        fields: ['val','txt']
    });
    
    var sql = "select distinct t.unit_id property_code , decode(t.unit_id,'','全网',(select unitname from sgcc_ini_unit where unitid=t.unit_id)) property_value  from sgcc_guideline_info t"
    db2Json.selectSimpleData(sql,function(data) {
    	guideStore.loadData(eval(data))
    })
	
	var guideType = new Ext.form.ComboBox({
		id:'guideType',
		store: guideStore,
		width:120,
		allowBlank: false,
		displayField:'txt',
		valueField : 'val',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
	});
	
	guideType.on('select',function(){
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
	  {header:'指标名称',width:document.body.clientWidth-700,dataIndex:'realname'},
	  {header:'计量单位',width:100,dataIndex:'jldw'},
	  {header:'可用状态',width:100,dataIndex:'state',renderer:transState},
	  {header:'指标类型',width:100,dataIndex:'ifpub',renderer:transType},
	  {header:'所属单位',width:100,dataIndex:'ssdw',renderer:transUnit},
	  {header:'下达状态',width:100,dataIndex:'ifxd',renderer:transXD},
	  {header:'下达时间',width:150,dataIndex:'xdsj'}
    ];
	
    tree = new Ext.tree.ColumnTree({
    	id:'checkTree',
        region: 'center',  
        tbar: tbar,
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
		items:[tree]
	});
	
	treeLoad.on('beforeload',function(treeLoader) {
		treeLoad.baseParams.guideType = guideType.getValue()
	})

	tbar.add(downBtn,"-","&nbsp;&nbsp;&nbsp;指标类型：",guideType,"&nbsp;&nbsp;","-","&nbsp;",historyBtn)
	
});

function transState(value,n) {
	if(n.attributes.id == "d")
		return ""
	else {
		if(value == "0")
			return "<div style='color:red;'>无效</div>"
		else
			return "有效"
	}
}

function transType(value,n) {
	if(n.attributes.id == "d")
		return ""
	else {
		if(value == "1")
			return "国网"
		else if(value == "2")
			return "网省"
		else
			return "地市"
	}
}

function transUnit(value,n) {
	if(n.attributes.id == "d")
		return ""
	else {
		if(value == "")
			return "全网"
		else {
			DWREngine.setAsync(false);
	    	var unitname = ""
	    	guidelineService.getUnitName(value,function(data) {
	    		unitname = data
	    	})
	    	DWREngine.setAsync(true);
	    	return unitname
		}
	}
}

function transXD(value,n) {
	var zbId = n.attributes.id
	if(value == "已下达")
		return "<font color=red>已下达</font>&nbsp;&nbsp;&nbsp;<span style='color:green;' onclick=showDownUnit('"+zbId+"')>查看</span>"
	else
		return value
}

function confirm(item) {
	switch(item.id) {
		case 'down' :
			showDialog("选择单位","jsp/guideline/guidelineTree.jsp?type=xsdw",300,450,false)
			break;
		case 'history' :
			showDialog("查看下达历史","jsp/guideline/guidelineDownHistory.jsp",700,450,true)
			break;
	}
}

function showDownUnit(zbId) {
	var rs = Ext.data.Record.create([
			{name: 'unitid', type: 'string'},
			{name: 'xdsj', type: 'string'}
		  ]);
		 
	var nm = new Ext.grid.RowNumberer();
	var cm = new Ext.grid.ColumnModel([
		nm,
		{header: "单位名称" , dataIndex: "unitid" , width: 270 ,
				 renderer: function(value) {
				 	DWREngine.setAsync(false);
			    	var unitname = ""
			    	guidelineService.getUnitName(value,function(data) {
			    		unitname = data
			    	})
			    	DWREngine.setAsync(true);
			    	return unitname
			   	 }
		},
		{header: "下达时间" , dataIndex: "xdsj" , width: 150 , align: 'center'}
	]);
	
	var reader = new Ext.data.JsonReader({},rs);
	var store = new Ext.data.Store({ reader: reader })

	var sql = "select unitid , to_char(xdsj,'yyyy-mm-dd hh:mi:ss') xdsj from sgcc_guideline_info_xd where zb_seqno='"+zbId+"' order by unitid"
	db2Json.selectData(sql, function (data) {
		store.loadData(eval(data),false)
	});
	
	var unitGrid = new Ext.grid.GridPanel({
		id: 'unitGrid',
		renderTo: document.body,
		title:'',
		height:345,
		width:495, 
		cm: cm,
		store:store
	})

	contentWin = new Ext.Window({title:"已下达单位查看", 			
		width:500, 			
		height:350, 
		items:unitGrid,	
		maximizable:false}); 	 
	contentWin.show()
	
}

function showDialog(dialogTitle , frameaddress , w , h , flag) {
	win = new Ext.Window({
        title: dialogTitle,
        width: w,
        height: h,
        layout: 'fit',
        resizable: false,
		plain: true,
		modal: true,
        buttonAlign: 'center',
        html:"<iframe scrolling='no' name='content' src='"+frameaddress+"' width='100%' height='100%'></iframe>",
        buttons: [
        {
            text: '发布',
            hidden: flag,
            handler: pubInfo
        },
        {
            text: '关闭',
            handler: function(){
                win.hide();
            }
        }]
    });
    win.show()
}

function pubInfo() {
	var zbId = ""
	var unitId = window.frames["content"].getUnitId()
	var ob_id =tree.getChecked('id') 
	for(var i=0;i<ob_id.length;i++)
		  zbId += "``"+ob_id[i]
	zbId = zbId.substring(2)
	if(unitId.length > 0) {
		if(zbId == "")
			alert("请选择要发布的指标!")
		else
			DataExchangeDwr.downGuideline("DOWN_GUIDELINE",zbId,unitId,function(data) {
				if(data) {
					showExtMsg("发布成功!")
					tree.root.reload()
				}
				else
					showExtMsg("发布失败!")
				win.hide()
			})
	} else 
		alert("请选择要发布的单位!")
}

function showExtMsg( txt ) {
	Ext.MessageBox.show({
		title:'提示: ',
		msg: txt,
		maxWidth: 400,
		minWidth:150,
		buttons:Ext.MessageBox.OK
	});
}

</script>

