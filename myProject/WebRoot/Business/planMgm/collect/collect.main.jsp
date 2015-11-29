<%@ page language="java" pageEncoding="UTF-8" %>
<%@page import="com.sgepit.pmis.planMgm.PlanMgmConstant"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>上报情况查询</title>
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
		
		/* 数据期别参数 Y：年度；M：月度； Q：季度 */
		var sjFlag = "<%=(String)request.getParameter("sjFlag")==null?"Y": (String)request.getParameter("sjFlag")%>";
		
		/* 计划业务类型 I：投资计划；F：资金计划；*/
		var businessFlag = "<%=(String)request.getParameter("businessFlag")==null?"I": (String)request.getParameter("businessFlag")%>";
		
		/* 时间 */
		var sjType = "<%=(String)request.getParameter("sjType")==null?"": (String)request.getParameter("sjType")%>";
		var userArr = new Array();
		var conOveArr = new Array();
		var unitArr = new Array();
		var whereStr = "";
	</script>	
	
  </head>
  
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
	    
		 	baseMgm.getData("select userid,realname from rock_user ",function(list){  
				for(i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArr.push(temp);
				}
		    });
		    
		 	baseMgm.getData("select unitid, unitname from sgcc_ini_unit ",function(list){  
				for(i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					unitArr.push(temp);
				}
		    });
		 	DWREngine.setAsync(true);
		 	
			//----------------------主记录信息----------------------------//
			var masterUrl = "Business/planMgm/collect/collect.master.jsp";
			var masterPanel = new Ext.Panel({
				region: 'north',
				layout: 'fit',
				height: 200,
				border:false,
				html: '<iframe name="masterFrame" src="' + masterUrl + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});	
			
			//----------------------合同的投资计划明细信息----------------------------//
			var dataPanel = new Ext.Panel({
				region: 'center',
				layout: 'fit',
				border:false,
				html: '<iframe name="detailFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});	
			
		    var viewport = new Ext.Viewport({
		        layout:'border',
		        items:[masterPanel, dataPanel]
		    });
		});
		
		function reloadDetailData(masterRec) {
			var dataDetailUrl = "";
			if (masterRec.data["businessType"]=='<%=PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR%>') {
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.year.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER%>') {
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.quarter.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.INSTALL_INVEST_PLAN_MONTH%>') {
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.month.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.OtherCost_PLAN_YEAR%>'
				|| masterRec.data["businessType"]=='<%=PlanMgmConstant.OtherCost_PLAN_QUARTER%>'
				|| masterRec.data["businessType"]=='<%=PlanMgmConstant.OtherCost_PLAN_MONTH%>') {
				//部门其他费用投资计划
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.OtherCost.main.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.EQUIPMENT_PLAN_YEAR%>') {
				//设备购置费费用投资计划
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.year.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.EQUIPMENT_PLAN_QUARTER%>') {
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.quarter.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.EQUIPMENT_PLAN_MONTH%>') {
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.month.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.INSTALL_FUND_PLAN_YEAR%>') {
				//建筑安装资金计划
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.year.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER%>') {
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.quarter.bycontract.jsp";
			} else if (masterRec.data["businessType"]=='<%=PlanMgmConstant.INSTALL_FUND_PLAN_MONTH%>') {
				dataDetailUrl = "Business/planMgm/investmentPlan/dept/investment.data.month.bycontract.jsp";
			}
			dataDetailUrl = dataDetailUrl + "?fromM=collect&masterId=" + masterRec.data["uids"];
			document.all.detailFrame.src = dataDetailUrl;
		}
		
		function initInvestmentData(sjType){
			investmentPlanService.initInvestmentPlanData(businessType, USERDEPTID, sjType, function(d){
				if(d) {
				}
			});
		}
		
		//保存主记录，并初始化数据；
		function saveFun(gridPanel){
			var mainStore = gridPanel.getStore()
			var mainRecords = mainStore.getModifiedRecords()
			
			DWREngine.setAsync(false);
			var sjTypes = "";
			for(var i = 0;i<mainRecords.length;i++){
				sjTypes += "`" + mainRecords[i].data["sjType"];
			}
			if (sjTypes.length>0) {
				sjTypes = sjTypes.substring(1);
				investmentPlanService.checkSaveData(businessType, sjTypes, USERDEPTID, "", function(d) {
					if(d) {
						gridPanel.defaultSaveHandler();
						investmentPlanService.initInvestmentPlanDatas(businessType, USERDEPTID, sjTypes, function(d1){
							if(d1) {
							}
						});						
					} else {
						Ext.Msg.alert('新增失败！', '新增的数据数据库中已存在，请确认填写的内容是否正确！');
					}
				});
			}
			DWREngine.setAsync(true);
		}
		
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
	    
	    //单位名称
		function showUnitNameFun(value){
	    	var str = '';
	   		for(var i=0; i<unitArr.length; i++) {
	   			if (unitArr[i][0] == value) {
	   				str = unitArr[i][1]
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
	    
	    //初始化计划的明细数据；
	    function initDataFun(g, sjType) {
	    	DWREngine.setAsync(false);
	    	investmentPlanService.initInvestmentPlanData(businessType, USERDEPTID, sjType, function(d){
				if(d) {
					g.getStore().reload();
				}
			});
			DWREngine.setAsync(true);
	    }
	    
	    //重新计算累计及累计%；
	    function calAddupFun(g, sjType) {
	    	investmentPlanService.updateDataAddup(businessType, USERDEPTID, sjType, function(d){
				if(d) {
					g.getStore().reload();
				}
			});
	    }
	    
	    function formatReportStateFun(val){
	    	if(!val || val==null || val=='null' || val=="0") {
	    		return "未上报";
	    	} else if (val=="1") {
	    		return "已上报";
	    	} else if (val=="-1") {
	    		return "退回重报";
	    	}
	    }
	</script>
</html>

