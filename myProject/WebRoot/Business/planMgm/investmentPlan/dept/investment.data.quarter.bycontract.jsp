<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>投资计划_季度</title>
	
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
	var bean = "com.sgepit.pmis.planMgm.hbm.PlanQuarter";
	var primaryKey = "uids";
	var orderColumn = "sjType";
	var business = "baseMgm";
	var listMethod = "findwhereorderby";
	PAGE_SIZE = 10;
	var masterRecord = null;
	var editable = true;
	var title = "投资计划明细";
	if(parent && parent.businessType && parent.businessType.indexOf("F_P")>-1){
		title = "资金计划明细";
	} else if(businessType && businessType.indexOf("F_P")>-1){
		title = "资金计划明细";
	}
	
	Ext.onReady(function (){
		DWREngine.setAsync(false);
		if(masterId!="") {
			investmentPlanService.getPlanMasterInfoById(masterId, function(d) {
				masterRecord = d;
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
		
		var fm = Ext.form; 
		var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: false})
		
		var fc = {		
	    	'uids': {
				name: 'uids',
				fieldLabel: '主键',
				anchor:'95%',
				hidden:true,
				hideLabel:true
			}, 'sjType': {
				name: 'sjType',
				fieldLabel: '时间',
	           	hidden:true,
				hideLabel:true,
				anchor:'95%'
	        }, 'contractId': {
				name: 'contractId',
				fieldLabel: '合同主键',
				allowBlank: false,
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	        }, 'unitId': {
				name: 'unitId',
				fieldLabel: '乙方单位',
				allowBlank: false,
				anchor:'95%'
	        }, 'm1': {
				name: 'm1',
				fieldLabel: '头月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm2': {
				name: 'm2',
				fieldLabel: '中月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm3': {
				name: 'm3',
				fieldLabel: '末月',
				allowBlank: false,
				anchor:'95%'
	        }, 'quarterAmount': {
				name: 'quarterAmount',
				fieldLabel: '总金额',
				allowBlank: false,
				anchor:'95%'
	        }, 'amountAddup': {
				name: 'amountAddup',
				fieldLabel: '累计',
				allowBlank: false,
				anchor:'95%'
	        }, 'perAmountAddup': {
				name: 'perAmountAddup',
				fieldLabel: '累计%',
				allowBlank: false,
				anchor:'95%'
			}
		}
		
	    var Columns = [
	    	{name: 'uids', type: 'string'},
			{name: 'contractId', type: 'string'},
			{name: 'unitId', type: 'string'},
			{name: 'm1', type: 'float'},
			{name: 'm2', type: 'float'},
			{name: 'm3', type: 'float'},
			{name: 'quarterAmount', type: 'float'},
			{name: 'amountAddup', type: 'float'},
			{name: 'perAmountAddup', type: 'float'},
			{name: 'sjType', type: 'string'}];
			
	    var cm = new Ext.grid.ColumnModel([
	    	sm,{
	           id:'uids',
	           header: fc['uids'].fieldLabel,
	           dataIndex: fc['uids'].name,
			   hidden:true,
			   hideLabel:true
	        }, {
	           id:'contractId',
	           header: fc['contractId'].fieldLabel,
	           dataIndex: fc['contractId'].name,
	           renderer: parent.showConNameFun,
	           width: 260
	        }, {
	           id:'unitId',
	           header: fc['unitId'].fieldLabel,
	           dataIndex: fc['unitId'].name,
	           hidden:true,
			   hideLabel:true
	        }, {
	           id:'m1',
	           header: fc['m1'].fieldLabel,
	           dataIndex: fc['m1'].name,
	           editor: new fm.NumberField(fc['m1'])
	        }, {
	           id:'m2',
	           header: fc['m2'].fieldLabel,
	           dataIndex: fc['m2'].name,
	           editor: new fm.NumberField(fc['m2'])
	        }, {
	           id:'m3',
	           header: fc['m3'].fieldLabel,
	           dataIndex: fc['m3'].name,
	           editor: new fm.NumberField(fc['m3'])
	        }, {
	           id:'quarterAmount',
	           header: fc['quarterAmount'].fieldLabel,
	           dataIndex: fc['quarterAmount'].name
	        }, {
	           id:'amountAddup',
	           header: fc['amountAddup'].fieldLabel,
	           dataIndex: fc['amountAddup'].name
	        }, {
	           id:'perAmountAddup',
	           header: fc['perAmountAddup'].fieldLabel,
	           dataIndex: fc['perAmountAddup'].name
	        }, {
	           id:'sjType',
	           header: fc['sjType'].fieldLabel,
	           dataIndex: fc['sjType'].name,
	           hidden:true,
	           hideLabel:true
	        }
		])
	    cm.defaultSortable = true;
	
	    var ds = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',
		    	bean: bean,				
		    	business: business,
		    	method: listMethod,
		    	params: "masterId='"+masterId+"' and contract_id is not null"   // where 子句
			},
	        proxy: new Ext.data.HttpProxy({
	            method: 'GET',
	            url: MAIN_SERVLET
	        }),
	        reader: new Ext.data.JsonReader({
	            root: 'topics',
	            totalProperty: 'totalCount',
	            id: primaryKey
	        }, Columns),
	        remoteSort: true,
	        pruneModifiedRecords: true
	    });
	    ds.setDefaultSort(orderColumn, 'asc');
		
		gridPanel = new Ext.grid.EditorGridTbarPanel({
	    	id: 'cat-grid-panelas',
	        ds: ds,
	        cm: cm,
	        sm: sm,
	        tbar: ['<font color=#15428b><b>&nbsp;'+title+'</b></font>','-'],
	        iconCls: 'icon-by-category',
	        border: false,
	        region: 'center',
	        clicksToEdit: 2,
	        header: false,
	        autoScroll: true,
	        collapsible: false,
	        animCollapse: false,
	        autoExpandColumn: 1,
	        loadMask: true,
	        addBtn : false,
			saveBtn : editable,
			delBtn : editable,
			viewConfig:{
				forceFit: true,
				ignoreAdd: true
			},
			bbar: new Ext.PagingToolbar({
	            pageSize: PAGE_SIZE,
	            store: ds,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        }),
	      	servletUrl: MAIN_SERVLET,		
	      	bean: bean,					
	      	business: business,	
	      	primaryKey: primaryKey	
		});	
		ds.load({params:{start: 0,limit: PAGE_SIZE}})
		
		gridPanel.on('aftersave', function(){
			investmentPlanService.calCollectData(masterRecord.businessType, masterRecord.unitId, masterRecord.sjType, function(d) {
				ds.reload();
			});
		});
		
		gridPanel.on('beforeedit', function(e){
			e.cancel = !editable;
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
	    	if(editable){
				add('->', initDataBtn, '-', calAddupBtn);
			}
			if (fromM!="" && fromM=="collect"){
	    	} else {
				add('->', exportExcelBtn);
	    	}
	    }
	});    
  </script>
</html>
