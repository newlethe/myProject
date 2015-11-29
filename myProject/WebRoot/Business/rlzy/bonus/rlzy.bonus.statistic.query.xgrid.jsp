<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/Business/rlzy/salary/xgridjs.jsp" %>
<html>
	<head>
	<base href="<%=basePath%>">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<%	
	    String unitIds= request.getParameter("unitIds")==null ? "" : request.getParameter("unitIds");
		String sjType = request.getParameter("sjType")==null ? "" : request.getParameter("sjType");
		String saveable = (request.getParameter("saveable")!=null && request.getParameter("saveable").equals("true")) ? "true" : "false";
	%>
	<title>公司奖金汇总</title>
	</head>
	<body> 
	  	<div id="gridbox"></div>
	  	<form action="" id="formAc" method="post" name="formAc"></form>
	</body>
<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
<script type='text/javascript' src='<%=path%>/dwr/interface/XgridBean.js'></script>
<script type='text/javascript' src='<%=path%>/dwr/interface/rlzyXcglMgm.js'></script>
<script>
var mygrid,myDataProcessor
var param = window.dialogArguments;
var unitIds="";
var sjType = "";
var saveable = false;

if(param) {
    unitIds=param.unitIds;
	sjType = param.sjType;
	saveable = param.saveable;
} else {
    unitIds= "<%=unitIds%>";
    unitIds=unitIds.split(",");
	sjType = "<%=sjType%>";
	saveable = "<%=saveable%>"=="true" ? true : false;
}
var readonly = !saveable;

Ext.onReady(function(){
	doSaveBtn = new Ext.Toolbar.Button({
		id: 'saveData',
        icon: saveBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>保存</b>",
        disabled: !saveable,
        handler: saveData
    });
    
    doExcelBtn = new Ext.Toolbar.Button({
		id: 'doExcel',
        icon: excelBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>导出excel</b>",
        tooltip: "导出工资单到Excel",
        handler: exportToExcelFun
    });
    
  	xGridpanel=new Ext.grid.dhxGridPanel({
		region:'center',
		border: false,
        align: 'right'
    });
    
    var container = new Ext.Panel({
        id:'content-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        tbar:[colMangeBtn,doExcelBtn],
        items:xGridpanel
    });
    
   	viewport = new Ext.Viewport({
		layout:'border',
		border: false,
		items:container
	});
	
	xGridpanel.render('gridbox');
    mygrid=xGridpanel.grid; 
    init() ;
})

function init() {
	mygrid.setImagePath(xgridImagePath);
	mygrid.setSkin("xp");
	mygrid.init();
	myDataProcessor = new dataProcessor("");
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.enableEditEvents(false,true,true) ;
	mygrid.attachEvent("onXLE",hideprogress);
	//mygrid.attachEvent("onEditCell",cellOnEdit);
	mygrid.enableMathEditing(false);
	mygrid.clearAll();
	mygrid.setDateFormat("y-m-d");
	
	loadXgrid()
}
	
	//加载xgird数据
	function loadXgrid(){
	    progressstart() 
	    rlzyXcglMgm.getBonusStatisticXml(unitIds, sjType,CURRENTAPPID,function(data){
		   if(data) {
		      mygrid.clearAll();  
		      mygrid.loadXMLString(data) ;
		    
		   } else {
		      alert("模板有误，请检查配置！")
		      hideprogress()
		   }
		});
	}
	
	//启动进度条
	function progressstart() {
	 	Ext.MessageBox.show({
		      width: 240,
		      progress: true,
		      closable: false
	     })
		Ext.MessageBox.wait('数据读取中...','请等待',{interval: 30,increment:100,duration: 100000,fn:function(){window.frames["grid1"].hideprogress();alert("加载超时，请重新加载！")}})
	 }
	 
	//隐藏进度条
	function hideprogress()  {
		if(Ext.MessageBox)  Ext.MessageBox.hide()
	}
	
	//保存
	function saveData(flag)  {
		mygrid.editStop()
		//获取xgrid的xml数据
		var dataXml = mygrid.serialize();
		var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
		xmlDoc.setProperty("SelectionLanguage", "XPath");
		xmlDoc.async = false;
		xmlDoc.loadXML(dataXml)
		var root = xmlDoc.selectSingleNode("/rows");
		root.setAttribute("report_id",reportId) ;
		root.setAttribute("sj_type",sjType) ;
		XgridBean.saveXgrid(templateId, xmlDoc.xml,function(data){
			if(flag && flag=='1') {
			} else {
			    if(data=="OK")  {
			        alert("保存完成！")
			    	loadXgrid();
			    } else {
			       	alert("保存失败!")
			    }
			}
		});
	}
	
	function exportToExcelFun(){ 
	    var CONTEXT_PATH = '<%= path %>';
		var openUrl = CONTEXT_PATH + "/servlet/RlzyServlet?ac=exportBonusGrid&startSj=" + sjType + "&depts=" + unitIds+"&pid="+CURRENTAPPID;     
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}
</script>
</html>
