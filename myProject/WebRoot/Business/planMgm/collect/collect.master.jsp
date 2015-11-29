<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.pmis.planMgm.PlanMgmConstant"%>
<html>
	<head>   
		<title>投资计划管理-主记录-年度</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>
		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	</head>
	
	<script type="text/javascript">
		var bean = 'com.sgepit.pmis.planMgm.hbm.PlanMaster'
		var business = 'baseMgm'
		var listMethod = 'findWhereOrderby'
		var primaryKey = 'uids'
		var orderColumns = 'sjType'
		var PAGE_SIZE = 4
		var yearArray = new Array()
		var userArr = new Array();
		var mainGrid;
		var title = "投资计划主表";
		if(parent && parent.businessFlag && parent.businessFlag=="F"){
			title = "资金计划主表";
		}
		
		Ext.onReady(function(){
		
			//建安工程投资计划年度主表 相关
			//初始化年度的combo，上下五年，数组一个10个元素
			var beginYear = new Date().getFullYear() - 5
			for(var i = beginYear;i<beginYear+10;i++){
				var temp = new Array()
				temp.push(i)
				temp.push(i+'年')
				yearArray.push(temp)
			}
			
			var dsYear = new Ext.data.SimpleStore({
				fields:['k','v'],
				data:yearArray
			})
			
			var mainFc = {
				'uids':{
					name:'uids',
					fieldLabel:'主键',
					hidden:true,
					hideLabel:true
				},'sjType':{
					name:'sjType',
					fieldLabel:'时间'	,
					store:dsYear,
					displayField:'v',
					valueField:'k',
					typeAhead:true,
					mode:'local',
					triggerAction:'all',
					emptyText:'请选择...',
					selectOnFocus:true,		
					width:125,			
					readOnly:true,
					anchor:'95%'
				},'operator':{
					name:'operator',
					fieldLabel:'填报人',
					readOnly:true,
					anchor:'95%'
				},'operateTime':{
					name:'operateTime',
					fieldLabel:'填报日期',
					readOnly:true,
					format:'Y-m-d H:i:s',
					anchor:'95%'
				},'remark':{
					name:'remark',
					fieldLabel:'备注',			
					anchor:'95%'
				},'businessType':{
					name:'businessType',
					fieldLabel:'业务类型'	,
					readOnly:true		
				},'unitId':{
					name:'unitId',
					fieldLabel:'上报部门'	,
					readOnly:true		
				},'state':{
					name:'state',
					fieldLabel:'上报状态'	,
					readOnly:true		
				},'billState':{
					name:'billState',
					fieldLabel:'流程状态'	,
					readOnly:true		
				}
			}
			
			var MainColumns = [
				{name:'uids',type:'string'},
				{name:'sjType',type:'string'},
				{name:'operator',type:'string'},
				{name:'operateTime',type:'date',dateFormat:'Y-m-d H:i:s'},
				{name:'remark',type:'string'},
				{name:'unitId',type:'string'},
				{name:'state',type:'string'},
				{name:'billState',type:'string'},
				{name:'businessType',type:'string'}
			]
			
			var MainPlant = Ext.data.Record.create(MainColumns)
			var MainPlantInt = {
				uids:'',
				sjType: '',
				operator: USERID,
				remark: '',
				operateTime: new Date(),
				unitId: USERDEPTID,
				businessType: parent.businessType
			};
			
			var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true})
			
			var cm = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer(),sm,{
					id:'uids',
					header:mainFc['uids'].fieldLabel,
					dataIndex:mainFc['uids'].name,
					hidden:true
				},{
					id:'sjType',
					type:'combo',
					header:mainFc['sjType'].fieldLabel,
					dataIndex:mainFc['sjType'].name,
					editor:new Ext.form.ComboBox(mainFc['sjType']),
					renderer: getYearFun,
					width:90
				},{
					id:'businessType',
					header:mainFc['businessType'].fieldLabel,
					dataIndex:mainFc['businessType'].name,
					renderer: parent.showBusinessTypeNameFun,
					width: 130
				},{
					id:'unitId',
					header:mainFc['unitId'].fieldLabel,
					dataIndex:mainFc['unitId'].name,
					renderer: parent.showUnitNameFun,
					width: 120
				},{
					id:'operator',
					header:mainFc['operator'].fieldLabel,
					dataIndex:mainFc['operator'].name,
					renderer: parent.showUserNameFun,
					width:100
				},{
					id:'operateTime',
					header:mainFc['operateTime'].fieldLabel,
					dataIndex:mainFc['operateTime'].name,
					renderer: parent.formatDate,
					width:120
				},{
					id:'state',
					header:mainFc['state'].fieldLabel,
					dataIndex:mainFc['state'].name,
					renderer: parent.formatReportStateFun,
					width:80
				},{
					id:'billState',
					header:mainFc['billState'].fieldLabel,
					dataIndex:mainFc['billState'].name,
					width:80
				},{
					id:'remark',
					header:mainFc['remark'].fieldLabel,
					dataIndex:mainFc['remark'].name,
					editor:new Ext.form.TextArea(mainFc['remark']),		
					width:220
				},{
					id:'state',
					header:mainFc['state'].fieldLabel,
					dataIndex:mainFc['state'].name,
					renderer: doBackReportFun,		
					width:80
				}
			])
			cm.defaultSortable = true
			
			var whereStr = "";
			if(parent.businessFlag=="I") {
				whereStr += "business_type in ('" + "<%=PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR%>" 
				+ "', '" + "<%=PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER%>"
				+ "', '" + "<%=PlanMgmConstant.INSTALL_INVEST_PLAN_MONTH%>"
				+ "', '" + "<%=PlanMgmConstant.EQUIPMENT_PLAN_YEAR%>"
				+ "', '" + "<%=PlanMgmConstant.EQUIPMENT_PLAN_QUARTER%>"
				+ "', '" + "<%=PlanMgmConstant.EQUIPMENT_PLAN_MONTH%>"
				+ "', '" + "<%=PlanMgmConstant.OtherCost_PLAN_YEAR%>"
				+ "', '" + "<%=PlanMgmConstant.OtherCost_PLAN_QUARTER%>"
				+ "', '" + "<%=PlanMgmConstant.OtherCost_PLAN_MONTH%>" + "')";
			} else if (parent.businessFlag=="F") {
				whereStr += "business_type in ('" + "<%=PlanMgmConstant.INSTALL_FUND_PLAN_YEAR%>" 
				+ "', '" + "<%=PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER%>"
				+ "', '" + "<%=PlanMgmConstant.INSTALL_FUND_PLAN_MONTH%>"
				+ "', '" + "<%=PlanMgmConstant.EQUIPMENT_PLAN_YEAR%>"
				+ "', '" + "<%=PlanMgmConstant.EQUIPMENT_PLAN_QUARTER%>"
				+ "', '" + "<%=PlanMgmConstant.EQUIPMENT_PLAN_MONTH%>"
				+ "', '" + "<%=PlanMgmConstant.OtherCost_PLAN_YEAR%>"
				+ "', '" + "<%=PlanMgmConstant.OtherCost_PLAN_QUARTER%>"
				+ "', '" + "<%=PlanMgmConstant.OtherCost_PLAN_MONTH%>" + "')";
			}
			if (parent.sjFlag=="Y") {
				whereStr += " and length(sj_type)=4 and unit_id<>'" + CURRENTAPPID + "'";
			} else if (parent.sjFlag=="Q") {
				whereStr += " and length(sj_type)=5 and unit_id<>'" + CURRENTAPPID + "'";
			} else if (parent.sjFlag=="M") {
				whereStr += " and length(sj_type)=6 and unit_id<>'" + CURRENTAPPID + "'";
			}
			if(parent.sjType && parent.sjType!="") {
				whereStr += " and sj_type = '" + parent.sjType + "'";
			}
			whereStr += " and pid ='" + CURRENTAPPID + "'";
			
			var mainDs = new Ext.data.Store({
				baseParams:{
					ac:'list',
					bean:bean,
					business:business,
					method:listMethod,
					params: whereStr
				},
				proxy:new Ext.data.HttpProxy({
					method:'GET',
					url:MAIN_SERVLET
				}),
				reader:new Ext.data.JsonReader({
					root:'topics',
					totalProperty:'totalCount',
					id:primaryKey
				},MainColumns),
				remoteSort:true,
				pruneModifiedRecords:true
			})
			mainDs.setDefaultSort(orderColumns,'asc')
			
			mainGrid = new Ext.grid.EditorGridTbarPanel({
				id:'plan-money-main',
				ds:mainDs,
				cm:cm,
				sm:sm,
				width:400,
		//		height:230,
				border:false,
				region:'center',
				clicksToEditor:2,
				border:false,
				autoScroll:true,
				collapsible:false,
				animaCollapse:false,
				loadMask:true,
				stripeRows:true,
				addBtn:false,
				saveBtn:false,
				delBtn:false,
				tbar: ['<font color=#15428b><b>&nbsp;'+title+'</b></font>','-'],
				viewConfig:{
					ignoreAadd:true
				},
				bbar:new Ext.PagingToolbar({
					pageSize:PAGE_SIZE,
					store:mainDs,
					displayInfo:true,
					displayMsg:'{0}-{1}/{2}',
					emptyMsg:'无记录。'
				}),
				plant:MainPlant,
				plantInt:MainPlantInt,
				servletUrl:MAIN_SERVLET,
				bean:bean,
				business:business,
				primaryKey:primaryKey
			})
		
			mainDs.load({
				params:{start:0,limit:PAGE_SIZE},
				callback:function(){
					sm.selectFirstRow()
				}
			})
			
			mainDs.on('load', function(){
				if(mainDs.getCount()==0){
					parent.frames[ "detailFrame"].location.reload(true);
				} else {
					sm.selectFirstRow();
				}
			});
			
			function checkSaveHandler(){
				parent.saveFun(this);
			}
			
			function checkDeleteHandler(){
				var sm = mainGrid.getSelectionModel()
				if(sm.getCount() == 0){
					Ext.Msg.alert('提示!','您尚未选择一条记录!')
					return
				} else {
					Ext.Msg.confirm('确认','您确认删除所选记录及其相关的明细数据信息？', function(btn, text) {
						if (btn == "yes") {
							var records = sm.getSelections()
							var codes = []
							for (var i = 0; i < records.length; i++) {
								var m = records[i].get(this.primaryKey)
								if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
									continue;
								}
								codes[codes.length] = m
							}
							var mrc = codes.length
							DWREngine.setAsync(false);
							if (mrc > 0) {
								var ids = codes.join(",");
								investmentPlanService.deleteMasterAndDetailData(parent.sjFlag, ids, function (d) {
									if (d) {
										Ext.example.msg('删除成功！', '您成功删除了 {0} 条主记录及关联的明细数据信息。', mrc);
										mainDs.reload();
									} else {
										Ext.example.msg('删除失败！', '删除失败！', mrc);
									}
								});
							} else {
								mainDs.reload();
							}
							DWREngine.setAsync(true);
						}
					});
				}
			}
			
			//主记录选中，刷新明细grid
			sm.on('rowselect',function(sm,rowIndex,record){
				if(record && record.data["uids"] && record.data["uids"]!=null) {
					parent.reloadDetailData(record);
				}
			});
			
			var viewport = new Ext.Viewport({
				layout:'border',
				border:false,
				items:[mainGrid]
			});
			
			function formatDate(value){ 
		        return value ? value.dateFormat('Y-m-d') : ''
		    };
		});
		
	    function getYearFun(value, m, rec){
			if(value && value!="") {
				if(value.length==4) {
			        return value + '年';
				} else if (value.length==5) {
			        return value.substring(0,4) + '年' + value.substring(4,5) + "季度";
				} else if (value.length==6) {
			        return value.substring(0,4) + '年' + value.substring(4,6) + "月";
				}
			}
	    }
	    
	    function doBackReportFun(val, m, rec){
	    	if(val && val!=null && val=='1') {
	    		var thisMasterId = rec.get('uids');
				var output = "<u style='cursor:hand;'><a title='退回' onclick=\"doBackFun('" + thisMasterId + "');return false;\"><font color=blue>退回</font></a></u>";
				return output;
	    	} else {
	    		return "";
	    	}
	    }
	    
	    function doBackFun(tempMasterId){
	    	investmentPlanService.reportPlanData(tempMasterId, "-1", function(d){
				if(d) {
					Ext.Msg.alert('提示', '退回成功！');
					mainGrid.getStore().reload();
				} else {
					Ext.Msg.alert('提示', '退回失败！');
				}
			});
	    }
	</script>
</html>
