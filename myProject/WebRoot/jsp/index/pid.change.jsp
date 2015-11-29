<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>切换项目</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/commonUtilDwr.js'></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
</html>

<script type="text/javascript">
Ext.onReady(function(){
	var pidDataArr = new Array();
	var pidArr = USERPIDS.split(",");
	var pNameArr = USERPNAMES.split(",");
	var grid;
	for (i=0; i<pidArr.length; i++) {
		var temp = new Array();
		temp[0] = pidArr[i];
		temp[1] = pNameArr[i];
		pidDataArr.push(temp);
	}

	 //构建历史数据范围Grid
	var rs = Ext.data.Record.create([
		{name: 'pid'},
		{name: 'pname'}
	]);
	var reader = new Ext.data.ArrayReader({idIndex: 0},rs);

	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm,
		{header: '项目编号', width: 120, hidden: true, dataIndex: 'pid'},
		{header: '项目名称', width: 200, dataIndex: 'pname'}
	]);

  	var ds = new Ext.data.Store({
		reader: reader
   	});

   	var saveBtn = new Ext.Button({
		text: '确定',
		iconCls: 'save',
		handler: saveFun 
	});
	    
	grid = new Ext.grid.GridPanel({
		store: ds,
		cm: cm,
		sm: sm,
		tbar: ['->', saveBtn],
	    width:600,
	    height:300,
	    region: 'center'
	});
	
	ds.on("load", function(ds1){
  		var recArr = ds1.getRange();
  		for(i=0; i<recArr.length; i++) {
  			if(recArr[i].data["pid"] == CURRENTAPPID) {
  				grid.getSelectionModel().selectRow(i);
  			}
  		}
  	});

	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [grid]
    });
    
    ds.loadData(pidDataArr, false);
  	
    function saveFun(){
    	var rec = grid.getSelectionModel().getSelected();
		commonUtilDwr.changeCurrentAppPid(rec.data["pid"], rec.data["pname"], function() {
			parent.changePnameFun(rec.data["pname"]);
			parent.frames["contentFrame"].location.reload();
	    	parent.changeCurrentPIDWin.hide()
		});
    }
});
</script>
