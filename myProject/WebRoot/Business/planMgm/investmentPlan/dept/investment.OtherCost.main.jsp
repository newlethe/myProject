<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>其他费用投资计划</title>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>
	
	<!-- EXT -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	
	<script type='text/javascript'>
		var masterId = "<%=request.getParameter("masterId")==null?"":request.getParameter("masterId")%>";
		
		var businessType = "<%=request.getParameter("businessType")==null?"":request.getParameter("businessType")%>";
		var sjType = "<%=request.getParameter("sjType")==null?"":request.getParameter("sjType")%>";
		var unitId = "<%=request.getParameter("unitId")==null?"":request.getParameter("unitId")%>";
		
		var fromM = "<%=request.getParameter("fromM")==null?"":request.getParameter("fromM")%>";
	</script>
  </head>
  <script type="text/javascript">
	var masterRecord = null;
	var editable = true;
	Ext.onReady(function (){
		DWREngine.setAsync(false);
		if(masterId!="") {
			investmentPlanService.getPlanMasterInfoById(masterId, function(d) {
				if(d) {
					masterRecord = d;
				}
			});
		} else {
			investmentPlanService.getPlanMasterInfo(businessType, unitId, sjType, function(d) {
				if(d) {
					masterId = d.uids;
					masterRecord = d;
				}
			});
		}
		DWREngine.setAsync(true);

		if((fromM!="" && fromM=="collect") || (masterRecord && masterRecord.state=="1")) {
			editable = false;
		}
		
		var saveBtn = new Ext.Button({
			id: 'save',
			text: '保存',
			tooltip: '保存数据',
			cls: 'x-btn-text-icon',
			icon : 'jsp/res/images/shared/icons/save.gif',
			handler: function(){
				window.frames["xgrid"].saveXgrid();
			}
		});
		
		var addBtn = new Ext.Button({
			id: 'add',
			text: '新增',
			tooltip: '新增数据',
			cls: 'x-btn-text-icon',
			icon : 'jsp/res/images/shared/icons/add.gif',
			handler: function(){
				window.frames["xgrid"].addFun();
			}
		});
		
		var delBtn = new Ext.Button({
			id: 'del',
			text: '删除',
			tooltip: '删除数据',
			cls: 'x-btn-text-icon',
			icon : 'jsp/res/images/shared/icons/delete.gif',
			handler: function(){
				window.frames["xgrid"].deleteFun();
			}
		});
		
		var initDataBtn = new Ext.Button({
			id: 'initData',
			text: '初始化数据',
			tooltip: '初始化计划数据',
			iconCls: 'btn',
			handler: function(){
				parent.initDataFun(gridPanel, masterRecord.sjType);
			}
		});
		var calAddupBtn = new Ext.Button({
			id: 'calAddup',
			text: '计算累计值',
			tooltip: '计算累计值',
			iconCls: 'btn',
			handler: function(){
				parent.calAddupFun(gridPanel, masterRecord.sjType);
			}
		});
		
		var exportExcelBtn = new Ext.Button({
			id: 'export',
			text: '导出数据',
			tooltip: '导出数据到Excel',
			cls: 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/page_excel.png',
			handler: function() {
				parent.exportDataFile(masterRecord.sjType);
			}
		});
		
		var xgridUrl = "Business/planMgm/investmentPlan/dept/investment.OtherCost.xgrid.tree.jsp";
		if(masterRecord && masterRecord!=null) {
			xgridUrl += "?businessType=" + masterRecord.businessType + "&sjType=" + masterRecord.sjType + "&unitId=" + masterRecord.unitId;
		}
		gridPanel = new Ext.Panel({
	        tbar: ['<font color=#15428b><b>&nbsp;投资计划明细</b></font>','-'],
	        border: false,
	        region: 'center',
	        autoScroll: true,
	        collapsible: false,
	        animCollapse: false,
	        loadMask: true,
			viewConfig:{
				forceFit: true,
				ignoreAdd: true
			},
			html: '<iframe name="xgrid" src="' + xgridUrl + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
		});	
		
	   // 9. 创建viewport，加入面板action和content
	    var viewport = new Ext.Viewport({
	        layout: 'border',
	        border: false,
	        frame: false,
	        items: [gridPanel]
	    });

	    var gridTopBar = gridPanel.getTopToolbar()
		with(gridTopBar){
	    	if(editable) {
				add(addBtn, '-', saveBtn, '-', delBtn, '->', initDataBtn, '-', calAddupBtn);
	    	}
	    	if (fromM!="" && fromM=="collect"){
	    	} else {
				add('->', exportExcelBtn);
	    	}
		}
	});    
	    
  </script>
</html>
