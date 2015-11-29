<%@ page language="java" pageEncoding="UTF-8" %>
<%@page import="com.sgepit.pmis.planMgm.PlanMgmConstant"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>汇总数据_年度</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>	
    
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用:来自addorupdate */
		var isFlwTask = "<%=request.getParameter("isFlwTask") %>"=="true"?true:false;
		/* 流程任务调用所提供的参数 */
		var bh_flow = "<%=(String)request.getParameter("bhflow")==null?"": (String)request.getParameter("bhflow")%>";
		
		/*业务类型*/
		var businessFlag = "<%=(String)request.getParameter("businessFlag")==null?"": (String)request.getParameter("businessFlag")%>";
		
		var yearArr = new Array();
		var conOveArr = new Array();
		var masterRec = null;
		var collectUrl = "Business/planMgm/collect/collect.data.year.jsp";
		var sjType = "";
		var unitID = CURRENTAPPID;
		var tab1Title = "投资计划汇总表";
		var tab2Title = "建筑安装投资计划";
		var businessType = "<%=PlanMgmConstant.INVEST_PLAN_YEAR%>";
		if(businessFlag=="F") {
			tab1Title = "资金计划汇总表";
			tab2Title = "建筑安装资金计划";
			businessType = "<%=PlanMgmConstant.FUND_PLAN_YEAR%>";
		}
		var url1="", url2="", url3="";
	</script>	
	
  </head>
  	<form action="" id="formAc" method="post" name="formAc" TARGET="frm" >
    </form>
	<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
  
	<script type="text/javascript">
		Ext.onReady(function(){
			DWREngine.setAsync(false);
			investmentPlanService.getConOveInfo("", function(list){
				for(i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].conid);			
					temp.push(list[i].conname);		
					conOveArr.push(temp);			
				}
		    });
		    
		 	baseMgm.getData("select distinct sj_type, sj_type||'年' from plan_master where unit_id='" + unitID + "' and business_type='" + "<%=PlanMgmConstant.INVEST_PLAN_YEAR%>" + "' and length(sj_type)=4 order by sj_type desc",function(list){  
				for(i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					yearArr.push(temp);
				}
		    });
		 	DWREngine.setAsync(true);
		 	
		 	var dsYear = new Ext.data.SimpleStore({
				fields:['k','v'],
				data:yearArr
			});
		 	
		 	var yearCombo = new Ext.form.ComboBox({
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
			});
			
			yearCombo.on('select', function(c, r, i){
				sjType = c.getValue();
				reloadAllData(businessType, unitID, sjType);
			});
			
			var viewReportBtn = new Ext.Button({
				id: 'viewReport',
				text: '查看部门报送情况',
				tooltip: '查看部门报送情况',
				iconCls: 'btn',
				handler: viewReportFun
			});
			
			var exportExcelBtn = new Ext.Button({
				id: 'export',
				text: '导出数据',
				tooltip: '导出数据到Excel',
				cls: 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/page_excel.png',
				handler: function() {
					exportDataFile(sjType);
				}
			});
			
			var tab1 = new Ext.Panel({
				id: 'tab1',
				title: tab1Title,
				html: '<iframe name="collectFrame" src="' + collectUrl + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});
			
			if(businessFlag=="I") {
				url1 = "Business/planMgm/investmentPlan/dept/investment.data.year.bycontract.jsp?fromM=collect&businessType=" + "<%=PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR%>" + "&unitId=" + unitID;
			} else if(businessFlag=="F") {
			 	url1= "Business/planMgm/investmentPlan/dept/investment.data.year.bycontract.jsp?fromM=collect&businessType=" + "<%=PlanMgmConstant.INSTALL_FUND_PLAN_YEAR%>" + "&unitId=" + unitID;
			}
			var tab2 = new Ext.Panel({
				id: 'tab2',
				title: tab2Title,
				html: '<iframe name="data1Frame" src="' + url1 + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});
			url2 = "Business/planMgm/investmentPlan/dept/investment.data.year.bycontract.jsp?fromM=collect&businessType=" + "<%=PlanMgmConstant.EQUIPMENT_PLAN_YEAR%>" + "&unitId=" + unitID;
			var tab3 = new Ext.Panel({
				id: 'tab3',
				title: '设备购置费计划',
				html: '<iframe name="data2Frame" src="' + url2 + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});
			url3 = "Business/planMgm/investmentPlan/dept/investment.OtherCost.main.jsp?fromM=collect&businessType=" + "<%=PlanMgmConstant.OtherCost_PLAN_YEAR%>" + "&unitId=" + unitID;
			var tab4 = new Ext.Panel({
				id: 'tab4',
				title: '其他费用',
				html: '<iframe name="data3Frame" src="' + url3 + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});
			//----------------------合同的投资计划明细信息----------------------------//
			var dataPanel = new Ext.TabPanel({
				region: 'center',
				border:false,
				tabPosition: 'bottom',
				activeTab: 0,
				items: [tab1, tab2, tab3, tab4]
			});
			
			dataPanel.on("tabchange", function(tp, p){
				if(p.id=="tab2") {
					document.all.data1Frame.src = url1 + "&sjType=" + sjType;
				} else if(p.id=="tab3") {
					document.all.data2Frame.src = url2 + "&sjType=" + sjType;
				} else if(p.id=="tab4") {
					document.all.data3Frame.src = url3 + "&sjType=" + sjType;
				}
			});
			
			var mainPanel = new Ext.Panel({
				title: '年度计划汇总',
				region: 'center',
				border:false,
				layout: 'border',
				tbar: [yearCombo, '->', viewReportBtn, '-', exportExcelBtn],
				items: [dataPanel]
			});

		    var viewport = new Ext.Viewport({
		        layout:'border',
		        items:[mainPanel]
		    });
		    
		    if(yearArr.length>0){
		    	sjType = yearArr[0][0];
				yearCombo.setValue(yearArr[0][0]);
				reloadAllData(businessType, unitID, yearArr[0][0]);
			}
		});
		
		function showBusinessTypeNameFun(value){
	    	var str = '';
			if (value.indexOf('Install_I')==0) {
				str = "建筑安装投资计划"
			} else if (value.indexOf('OtherCost')==0) {
				str = "其他费用"
			} else if (value.indexOf('Equipment')==0) {
				str = "设备购置费计划"
			} else if (value.indexOf('Install_F')==0) {
				str = "建筑安装资金计划"
			} else {
				str = "合计";
			}
	   		return str;
	    }
		
		function showUserNameFun(value){
	    	var str = '';
	   		for(var i=0; i<userArr.length; i++) {
	   			if (userArr[i][0] == value) {
	   				str = userArr[i][1]
	   				break; 
	   			}
	   		}
	   		return str;
	    }
	    
		function showConNameFun(value){
	    	var str = '';
	   		for(var i=0; i<conOveArr.length; i++) {
	   			if (conOveArr[i][0] == value) {
	   				str = conOveArr[i][1]
	   				break; 
	   			}
	   		}
	   		return str;
	    }
	    
	    function formatDate(value){ 
	        return value ? value.dateFormat('Y-m-d H:i:s') : ''
	    };
	    
	    //重新加载数据；
	    function reloadAllData(thisBusinessType, thisUnitId, thisSjType) {
	    	DWREngine.setAsync(false);
	    	investmentPlanService.getPlanMasterInfo(thisBusinessType, thisUnitId, thisSjType, function(d){
				if(d && d!=null && d!='null') {
					masterRec = d;
					document.all.collectFrame.src = collectUrl + "?masterId=" + masterRec.uids;
				} else {
					Ext.Msg.alert("提示", '没有本期计划的汇总数据！');
					document.all.collectFrame.src = collectUrl + "?masterId=" + "";
				}
			});
			DWREngine.setAsync(true);
			if(window.frames["data1Frame"]) {
				document.all.data1Frame.src = url1 + "&sjType=" + thisSjType;
			} else if(window.frames["data2Frame"]) {
				document.all.data2Frame.src = url2 + "&sjType=" + thisSjType;
			} else if(window.frames["data3Frame"]) {
				document.all.data3Frame.src = url3 + "&sjType=" + thisSjType;
			}
	    }
	    
	    function viewReportFun(){
			var param = new Object()
			var url = CONTEXT_PATH + "/Business/planMgm/collect/collect.main.jsp?sjFlag=Y&businessFlag=" + businessFlag+"&sjType=" + sjType;
			window.showModalDialog(url, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;")
	    }
	    
	    //导出数据
		function exportDataFile(sjType){
			if(masterRec && masterRec!=null) {
				var openUrl = CONTEXT_PATH + "/servlet/InvestmentPlanServlet?ac=exportData&sjType=" + sjType + "&businessType=" + businessType + "&unitId=" + USERDEPTID + "&masterId=" + masterRec.uids;
				document.all.formAc.action =openUrl
				document.all.formAc.submit();
			} else {
				Ext.Msg.alert("没有导出的数据；");
			}
		}
	</script>
</html>

