<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>投资计划_季度【其他费用】</title>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
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
	var orderColumn = "bdg_id";
	var business = "baseMgm";
	var listMethod = "findwhereorderby";
	PAGE_SIZE = 10;
	var masterRecord = null;
	var bdgArr = new Array();
	var editable = true;
	
	Ext.onReady(function (){
		if(fromM!="" && fromM=="collect") {
			editable = false;
		}
	
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
		
	 	baseMgm.getData("select bdgid,bdgname from bdg_info",function(list){  
			for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				bdgArr.push(temp);
			}
	    });
		DWREngine.setAsync(true);
		
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
		
		var fm = Ext.form; 
		var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true})
		
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
	        }, 'bdgId': {
				name: 'bdgId',
				fieldLabel: '费用项目',
				allowBlank: false,
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	        }, 'unitId': {
				name: 'unitId',
				fieldLabel: '单位',
				allowBlank: false,
				hidden:true,
				hideLabel:true,
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
			{name: 'bdgId', type: 'string'},
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
	           id:'bdgId',
	           header: fc['bdgId'].fieldLabel,
	           dataIndex: fc['bdgId'].name,
	           renderer: showBdgNameFun,
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
		    	params: "masterId='"+masterId+"'"   // where 子句
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
	        tbar: ['<font color=#15428b><b>&nbsp;投资计划明细</b></font>','-'],
	        border: false,
	        region: 'center',
	        clicksToEdit: 2,
	        autoScroll: true,
	        collapsible: false,
	        animCollapse: false,
	        autoExpandColumn: 1,
	        loadMask: true,
	        addBtn : false,
			saveBtn : editable,
			delBtn : false,
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
				ds.load({params:{start: 0,limit: PAGE_SIZE}});
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
	    
	    if(editable){
		    var gridTopBar = gridPanel.getTopToolbar()
			with(gridTopBar){
				add('->', initDataBtn, '-', calAddupBtn);
			}
	    }
	});    
	    
    function showBdgNameFun(value){
    	var str = '';
   		for(var i=0; i<bdgArr.length; i++) {
   			if (bdgArr[i][0] == value) {
   				str = bdgArr[i][1]
   				break; 
   			}
   		}
   		return str;
    }
  </script>
</html>
