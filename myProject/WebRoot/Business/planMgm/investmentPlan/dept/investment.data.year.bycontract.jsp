<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>投资计划_年度</title>
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
	var bean = "com.sgepit.pmis.planMgm.hbm.PlanYear";
	var primaryKey = "uids";
	var orderColumn = "sjType";
	var business = "baseMgm";
	var listMethod = "findwhereorderby";
	PAGE_SIZE = 10;
	var masterRecord = null;
	var editable = true;
	var modifiedRecArr = new Array();
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
				fieldLabel: '合同',
				allowBlank: false,
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	        }, 'unitId': {
				name: 'unitId',
				fieldLabel: '乙方单位',
				allowBlank: false,
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	        }, 'm01': {
				name: 'm01',
				fieldLabel: '1月',
				allowBlank: true,
				emptyText: '90',
				anchor:'95%'
	        }, 'm02': {
				name: 'm02',
				fieldLabel: '2月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm03': {
				name: 'm03',
				fieldLabel: '3月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm04': {
				name: 'm04',
				fieldLabel: '4月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm05': {
				name: 'm05',
				fieldLabel: '5月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm06': {
				name: 'm06',
				fieldLabel: '6月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm07': {
				name: 'm07',
				fieldLabel: '7月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm08': {
				name: 'm08',
				fieldLabel: '8月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm09': {
				name: 'm09',
				fieldLabel: '9月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm10': {
				name: 'm10',
				fieldLabel: '10月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm11': {
				name: 'm11',
				fieldLabel: '11月',
				allowBlank: false,
				anchor:'95%'
	        }, 'm12': {
				name: 'm12',
				fieldLabel: '12月',
				allowBlank: false,
				anchor:'95%'
	        }, 'yearAmount': {
				name: 'yearAmount',
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
			{name: 'm01', type: 'float'},
			{name: 'm02', type: 'float'},
			{name: 'm03', type: 'float'},
			{name: 'm04', type: 'float'},
			{name: 'm05', type: 'float'},
			{name: 'm06', type: 'float'},
			{name: 'm07', type: 'float'},
			{name: 'm08', type: 'float'},
			{name: 'm09', type: 'float'},
			{name: 'm10', type: 'float'},
			{name: 'm11', type: 'float'},
			{name: 'm12', type: 'float'},
			{name: 'yearAmount', type: 'float'},
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
	           id:'m01',
	           header: fc['m01'].fieldLabel,
	           dataIndex: fc['m01'].name,
	           editor: new fm.NumberField(fc['m01'])
	        }, {
	           id:'m02',
	           header: fc['m02'].fieldLabel,
	           dataIndex: fc['m02'].name,
	           editor: new fm.NumberField(fc['m02'])
	        }, {
	           id:'m03',
	           header: fc['m03'].fieldLabel,
	           dataIndex: fc['m03'].name,
	           editor: new fm.NumberField(fc['m03'])
	        }, {
	           id:'m04',
	           header: fc['m04'].fieldLabel,
	           dataIndex: fc['m04'].name,
	           editor: new fm.NumberField(fc['m04'])
	        }, {
	           id:'m05',
	           header: fc['m05'].fieldLabel,
	           dataIndex: fc['m05'].name,
	           editor: new fm.NumberField(fc['m05'])
	        }, {
	           id:'m06',
	           header: fc['m06'].fieldLabel,
	           dataIndex: fc['m06'].name,
	           editor: new fm.NumberField(fc['m06'])
	        }, {
	           id:'m07',
	           header: fc['m07'].fieldLabel,
	           dataIndex: fc['m07'].name,
	           editor: new fm.NumberField(fc['m07'])
	        }, {
	           id:'m08',
	           header: fc['m08'].fieldLabel,
	           dataIndex: fc['m08'].name,
	           editor: new fm.NumberField(fc['m08'])
	        }, {
	           id:'m09',
	           header: fc['m09'].fieldLabel,
	           dataIndex: fc['m09'].name,
	           editor: new fm.NumberField(fc['m09'])
	        }, {
	           id:'m10',
	           header: fc['m10'].fieldLabel,
	           dataIndex: fc['m10'].name,
	           editor: new fm.NumberField(fc['m10'])
	        }, {
	           id:'m11',
	           header: fc['m11'].fieldLabel,
	           dataIndex: fc['m11'].name,
	           editor: new fm.NumberField(fc['m11'])
	        }, {
	           id:'m12',
	           header: fc['m12'].fieldLabel,
	           dataIndex: fc['m12'].name,
	           editor: new fm.NumberField(fc['m12'])
	        }, {
	           id:'yearAmount',
	           header: fc['yearAmount'].fieldLabel,
	           dataIndex: fc['yearAmount'].name
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
			delBtn : editable,
			viewConfig:{
				forceFit: true,
				ignoreAdd: true
			},
			bbar: new Ext.PagingToolbar({
				id: 'pagingToolbar',
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
		
		ds.on('beforeload', function(ds){
			//记录翻页前后编辑的内容；
			var modifiedRecords = ds.getModifiedRecords();
			if(modifiedRecords.length>0){
				/*
				for(i=0; i<modifiedRecords.length; i++){
					var rec = modifiedRecords[i];
					var found = false;
					for(j=0; j<modifiedRecArr.length; j++) {
						var r = modifiedRecArr[j];
						if(r.data.uids == rec.data.uids) {
							found = true;
							modifiedRecArr[j] = rec;
							break;
						}
					}
					if(!found) {
						modifiedRecArr[modifiedRecArr.length] = rec;
					}
				}
				*/
				alert("您有数据尚未保存，请先保存数据！");
				return false;
			}
		});
			
		/*
		ds.on('load', function(ds, thisPageRecords){	
			alert(modifiedRecArr)
			//对当前加载的数据处理
			for(i=0; i<modifiedRecArr.length; i++) {
				var rec1 = modifiedRecArr[i];
				for (j=0; j<thisPageRecords.length; j++) {
					var rec2 = thisPageRecords[j];
					if(rec1.data.uids = rec2.data.uids) {
						thisPageRecords[j] = rec1;
						break;
					}
				}
			}
			alert(thisPageRecords)
			
			var dataArr = new Array();
			for (j=0; j<thisPageRecords.length; j++) {
				var rec2 = thisPageRecords[j];
				dataArr[j] = Ext.encode(rec2.data);
			}
			alert(dataArr[0]);
			ds.loadData(dataArr, false);
		});
		*/
		
		gridPanel.on('aftersave', function(){
			investmentPlanService.calCollectData(masterRecord.businessType, masterRecord.unitId, masterRecord.sjType, function(d) {
				ds.load({params:{start: 0,limit: PAGE_SIZE}});
			});
		});
		
		gridPanel.on('beforeedit', function(e){
			e.cancel = !editable;
		});
		
		/*
		gridPanel.get("pagingToolbar").on('change', function(bar ,pd){
			
		});
		*/
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
				add('->', initDataBtn, '-', calAddupBtn);
			}
			if(fromM!="" && fromM=="collect") {
			} else {
				add('->', exportExcelBtn);
			}
	    }
	});    
	    
  </script>
</html>
