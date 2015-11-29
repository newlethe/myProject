<%@ page language="java" pageEncoding="UTF-8" %>
<%@page import="com.sgepit.pmis.planMgm.PlanMgmConstant"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>部门投资费用计划</title>
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
		/* 业务类型：
			建安工程投资年度计划：Install_I_P_Y
			建安工程投资季度计划：Install_I_P_Q
			建安工程投资月度计划：Install_I_P_M
			
			部门其他费用投资年度计划：OtherCost_P_Y
			部门其他费用投资季度计划：OtherCost_P_Q
			部门其他费用投资月度计划：OtherCost_P_M
		*/
		var businessType = "<%=(String)request.getParameter("businessType")==null?"": (String)request.getParameter("businessType")%>";
		var userArr = new Array();
		var conOveArr = new Array();
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
	    
		 	baseMgm.getData("select userid,realname from rock_user where userid = '"+USERID+"'",function(list){  
				for(i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArr.push(temp);
				}
		    });
		 	DWREngine.setAsync(true);
		 	
			//----------------------主记录信息----------------------------//
			var masterUrl = "Business/planMgm/investmentPlan/dept/investment.year.master.jsp";
	    	if (sjFlag=="Y") {
	    		masterUrl = "Business/planMgm/investmentPlan/dept/investment.year.master.jsp";
	    	} else if (sjFlag=="Q") {
	    		masterUrl = "Business/planMgm/investmentPlan/dept/investment.quarter.master.jsp";
	    	} else if (sjFlag=="M") {
	    		masterUrl = "Business/planMgm/investmentPlan/dept/investment.month.master.jsp";
	    	}
	    	masterUrl = masterUrl + "?businessType=" + businessType;
	    	
			var masterPanel = new Ext.Panel({
				region: 'north',
				layout: 'fit',
				height: 200,
				border:false,
				collapsed: false,
		        collapsible: true,
		        loadMask: true,
				viewConfig:{
					forceFit: true,
					ignoreAdd: true
				},
				html: '<iframe name="masterFrame" src="' + masterUrl + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});	
			
			//----------------------合同的投资计划明细信息----------------------------//
			var dataPanel = new Ext.Panel({
				region: 'center',
				layout: 'fit',
				border:false,
				collapsible: true,
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
			dataDetailUrl = dataDetailUrl + "?masterId=" + masterRec.data["uids"];
			/*
			//根据上报状态、流程状态判断表格是否可编辑保存
			var tempState = masterRec.data["state"];
			if(tempState && tempState=="1") {
				dataDetailUrl += "&stateFlag=collect"
			}
			*/
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
				var v_sjType = mainRecords[i].data["sjType"] ? (mainRecords[i].data["sjType"]+"") : "";
				var v_year = mainRecords[i].data["year"] ? (mainRecords[i].data["year"]+"") : "";
				var v_quarter = mainRecords[i].data["quarter"] ? (mainRecords[i].data["quarter"]+"") : "";
				var v_month = mainRecords[i].data["month"] ? (mainRecords[i].data["month"]+"") : "";
				if(!v_sjType || v_sjType.length==0) {
					if(v_year && v_year.length>0 && v_quarter && v_quarter.length>0) {
						v_sjType = v_year + v_quarter;
					}
					if(v_year && v_year.length>0 && v_month && v_month.length>0) {
						v_sjType = v_year + v_month;
					}
				}
				if (!v_sjType || v_sjType.length==0) {
					Ext.Msg.alert('提示！', '请正确填写的时间信息！');
					return;
				}
				investmentPlanService.checkSaveData(businessType, v_sjType, USERDEPTID, "", function(d) {
					if(d) {
						mainRecords[i].data["sjType"] = v_sjType;
						sjTypes += "`" + v_sjType;
					} else {
						Ext.Msg.alert('新增失败！', '新增的数据数据库中已存在，请确认填写的内容是否正确！');
					}
				});
			}
			if (sjTypes.length>0) {
				sjTypes = sjTypes.substring(1);
				gridPanel.defaultSaveHandler();
				investmentPlanService.initInvestmentPlanDatas(businessType, USERDEPTID, sjTypes, function(d1){
					if(d1) {
					}
				});						
			}
			DWREngine.setAsync(true);
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
	    
	    //初始化计划的明细数据；
	    function initDataFun(g, sjType) {
	    	DWREngine.setAsync(false);
	    	investmentPlanService.initInvestmentPlanData(businessType, USERDEPTID, sjType, function(d){
				if(d) {
					if(businessType.indexOf("OtherCost")==0) {
						window.frames["detailFrame"].location.reload(true);
					} else {
						g.getStore().reload();
					}
				}
			});
			DWREngine.setAsync(true);
	    }
	    
	    //重新计算累计及累计%；
	    function calAddupFun(g, sjType) {
	    	investmentPlanService.updateDataAddup(businessType, USERDEPTID, sjType, function(d){
				if(businessType.indexOf("OtherCost")==0) {
					window.frames["detailFrame"].location.reload(true);
				} else {
					g.getStore().reload();
				}
			});
	    }
	    
	    /* 上报状态： 0：未上报； 1：已上报； -1:	退回重报；*/
	    function reportFun(gridPanel, state){
	    	Ext.Msg.confirm("提示", "确认报送填写的数据？",function(btn, text) {
				if (btn == "yes") {
					var selArr = gridPanel.getSelectionModel().getSelections();
			    	var masterIds = "";
			    	for(i=0; i<selArr.length; i++) {
			    		var r = selArr[i].data;
			    		if(r.uids && r.uids!=null && r.uids!="") {
			    			masterIds += "`" + r.uids;
			    		}
			    	}
			    	if(masterIds.length>0) {
			    		masterIds = masterIds.substring(1);
				    	investmentPlanService.reportPlanData(masterIds, state, function(d){
							if(d) {
								Ext.Msg.alert('提示', '上报成功！');
								gridPanel.getStore().reload();
							} else {
								Ext.Msg.alert('提示', '上报失败！');
							}
						});
			    	}
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
	    
	    //导出数据
		function exportDataFile(sjType){
			var openUrl = CONTEXT_PATH + "/servlet/InvestmentPlanServlet?ac=exportData&sjType=" + sjType + "&businessType=" + businessType + "&unitId=" + USERDEPTID;
			document.all.formAc.action =openUrl
			document.all.formAc.submit();
		}
	</script>
</html>

