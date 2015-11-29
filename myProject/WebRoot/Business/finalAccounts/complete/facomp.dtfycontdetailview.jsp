<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/dhtmlxGridCommon/xgridCommon/xgridjs.jsp" %>
<html>
	<head>
	<base href="<%=basePath%>">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<title></title>
	<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/faReportService.js'></script>
	</head>
	<body>
	  	<div id="gridbox" ></div>
	</body>
<script> 
var param = window.dialogArguments;
var unit_id = param.unit_id==undefined?null:param.unit_id ;
var mygrid,myDataProcessor
Ext.onReady(function(){
    doExcelBtn = new Ext.Toolbar.Button({
		id: 'doExcel',
        icon: excelBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>导出excel</b>",
        handler: tranToExcel
    });
    
  xGridpanel=new Ext.grid.dhxGridPanel({
		region:'center',
		border: false,
        frame:true,
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
        tbar:[colMangeBtn,'-',doExcelBtn],
        items:xGridpanel
    });
    
   viewport = new Ext.Viewport({
		layout:'border',
		hideBorders :false,
		items:container
	});
	
	xGridpanel.render('gridbox');
    mygrid=xGridpanel.grid; 
    progressStart();
    init() ;
})

function init() {
	mygrid.setImagePath(xgridImagePath);
	mygrid.setSkin("light");
	mygrid.enableMathEditing(true);
	mygrid.enableSmartRendering(true,50);//异步加载
	
	mygrid.init();
	myDataProcessor = new dataProcessor("");
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.enableEditEvents(false,true,true)
	mygrid.attachEvent("onXLE",hideProgress);
	mygrid.clearAll();
	loadSQLXgrid()
  }
	
	//加载xgird数据
	function loadSQLXgrid(){
	    faReportService.getFacompDtfyContDetail3FXml(unit_id,function(data){
		   if(data) {
		      mygrid.clearAll();
		      mygrid.loadXMLString(data)
		   } else {
		      alert("配置错误，请检查配置")
		      hideProgress()
		   }
		})
	}
	
	//启动进度条
	function progressStart() {
	 	Ext.MessageBox.show({
		      width: 240,
		      progress: true,
		      closable: false
		     })
		    Ext.MessageBox.wait('数据读取中...','请等待',{interval: 30,increment:100,duration: 100000,fn:function(){window.frames["grid1"].hideprogress();alert("加载超时，请重新加载！")}})
	 }
	//隐藏进度条
	function hideProgress()  {
		if(Ext.MessageBox)  Ext.MessageBox.hide()
	}
	
	
	function trim(str,f){   //删除左右两端的空格
		str = str+"" ;
		if(f=="")  {
		   return str.replace(/(^\s*)|(\s*$)/g, "");
		} else if(f=="l") {  //删除左边的空格
		   return str.replace(/(^\s*)/g,"");
		} else if(f=="r") {   //删除右边的空格
		   return str.replace(/(\s*$)/g,"");
	    }
	}
	
	function tranToExcel()  {
		var grid = mygrid ;
		var widths = getWidthsData(grid) ;
		var head = getHeadData(grid) ;
		var data = getGridData(grid) ;
		var sheetname = null ;
		var widtds = null ;
		HeaderArrayToExcel(sheetname,widths,head,data)
	}
</script>
</html>
