<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.dao.BaseDAO"%>
<%@page import="com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  <%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>项目进度一览</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<link rel="stylesheet" type="text/css" href="<%=basePath%>PCBusiness/zhxx/schedule/style.css"/>
    <script type='text/javascript' src='<%=basePath%>dwr/engine.js'></script>
    <script type="text/javascript" src="<%=basePath%>dwr/interface/pcPrjService.js"></script> 
    <script type="text/javascript" src="<%=basePath%>PCBusiness/zhxx/schedule/projectSchedule.js"></script> 
  <%  
      BaseDAO baseDAO = BaseDAO.getFromApplicationContext(Constant.wact);
      List list = baseDAO.findByProperty(PcZhxxPrjInfo.class.getName(),"pid",currentAppid);
      PcZhxxPrjInfo  pcZhxxPrjInfo=new PcZhxxPrjInfo();
      if(list.size()>0){
          pcZhxxPrjInfo = (PcZhxxPrjInfo)list.get(0);
      }
  %>
  <script>
  	 var totaltouzi ='<%=pcZhxxPrjInfo.getInvestScale()==null?'0':pcZhxxPrjInfo.getInvestScale()%>';
  	 var prjState = '<%=pcZhxxPrjInfo.getPrjStage()%>';
  </script>
</head>
<body onload="changeCss();" id="body">
  <div id="main">
     <div class="main_bt">
	     <h1><%=pcZhxxPrjInfo.getPrjName()%></h1>
	     <div style="position:absolute;top:6px;right:10px;font-size:10px;color:gray;display:none;">
	     	<button style="border:none;background:transparent" onclick="history.back()">返回</button>
	     </div>
	 </div>
	 
	 <div class="main_bt_f">
	     <p>
	     	投资规模：</b><span id="totaltouzi">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
	     	&nbsp;&nbsp;建设周期：<span><b><%=pcZhxxPrjInfo.getBuildLimit()==null?"":pcZhxxPrjInfo.getBuildLimit()%></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
	     	<!-- 项目简介：<span><%//pcZhxxPrjInfo.getPrjSummary()%></span></p> -->
     </div>
	 
	 <div class="content">
	   <div class="content_bg">
	        
	       <table width="100%" border="0" cellspacing="0" cellpadding="0">
			  <tr>
				<td width="11%" height="396" align="left" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="23" align="center" valign="middle">&nbsp;</td>
                  </tr>
                  <tr>
                    <td height="29" align="center" valign="middle"><h1>前期策划阶段</h1></td>
                  </tr>
                  <tr>
                    <td height="18" align="center" valign="middle"><span>&nbsp;</span></td>
                  </tr>
                  <tr>
                    <td height="50" align="center" valign="middle">&nbsp;</td>
                  </tr>
                  <tr>
                    <td height="29" align="center" valign="middle"><h1>设计招标阶段</h1></td>
                  </tr>
                  <tr>
                    <td align="center" valign="middle"><span>&nbsp;&nbsp;</span></td>
                  </tr>
                  <tr>
                    <td height="71" align="center" valign="middle">&nbsp;&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center" valign="middle"><h1>建设施工阶段</h1></td>
                  </tr>
                  <tr>
                    <td align="center" valign="middle"><span>&nbsp;&nbsp;</span></td>
                  </tr>
                  <tr>
                    <td height="62" align="center" valign="middle">&nbsp;&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center" valign="middle"><h1>竣工验收阶段</h1></td>
                  </tr>
                  <tr>
                    <td align="center" valign="middle"><span>&nbsp;&nbsp;</span></td>
                  </tr>
                  <tr>
                    <td align="center" valign="middle">&nbsp;</td>
                  </tr>
                </table></td>
				<td width="89%" align="left" valign="top">&nbsp;</td>
			  </tr>
	     </table>
		 
		 <div class="s1_c_01 p_01" id="div1">
	     <a href="javascript:newWin('PCBusiness/approvl/pc.approvl.pw.query.main.jsp');"  style="text-decoration:none"> <h2>项目建议书</h2></a></div>
		 
		 <div class="s1_c_01 p_02" id="div2">
	     <a href="javascript:newWin('PCBusiness/approvl/pc.approvl.pw.query.main.jsp');"  style="text-decoration:none"><h2>初可研报告</h2></a></div>
		 
		 <div class="s1_c_01 p_03" id="div3">
	     <a href="javascript:newWin('PCBusiness/approvl/pc.approvl.pw.query.main.jsp');"  style="text-decoration:none"> <h2>可研报告</h2></a></div>
		 
		 <div class="s1_c_01 p_04" id ="div4">
	     <a href="javascript:newWin('PCBusiness/approvl/pc.approvl.pw.query.main.jsp');"  style="text-decoration:none"> <h2>初设报告</h2></a> </div>
		 
		 <div class="s1_c_01 p_05" id="div5">
	     <a href="javascript:newWin('PCBusiness/zhxx/query/pc.zhxx.projinfo.unitStructure.jsp');"  style="text-decoration:none"> <h2>项目组织结构</h2></a></a> </div>
		 
		 <div class="s1_c_02 p_06" id="div6">
	     <a href="javascript:newWin('gantt/frame/index.jsp');"  style="text-decoration:none"> <h2>里程碑计划</h2></a></div>
		 
		 <div class="s2_c_02 p_07" id="div7">
                   <a href="javascript:void(0)" style="text-decoration:none">
							<h3>招投标</h3>
							<p>已完成招标项目：<b id="bidcompletePro"></b></p>
							<p>已签订合同金额：<b id="bidsingedCon" title=""></b></p>
							<p>占总投资：<b id="bidpercentage" title=""></b></p>
							</a>
		 </div>
		 
		 <div class="s2_c_01 p_08" id="div8">
						 <a href="javascript:newWin('Business/budget/bdg.frame.edit.default.jsp');"  style="text-decoration:none">  <h3>概算执行</h3>
						   <p>概算执行进度：：<b id="bdgPercent" title=""></b></p>
						   </a> 
		 </div>
		 
		 <div class="s2_c_02 p_09" id="div9">
						   <a href="javascript:newWin('Business/contract/cont.generalInfo.gridview.jsp');"  style="text-decoration:none">  <h3>合同执行</h3>
							<p>已签订合同数：<b id="sigedConNum"></b></p>
							<p>合同执行金额：<b id="contractMoney" title=""></b></p>
							</a>
		 </div>
		 
		 <div class="s2_c_02 p_10" id="div10">
			 <h3>投资完成</h3>
			 <p>累计投资完成：<b>10项</b></p>
			 <p>进度百分比：<b>30%</b></p>
		 </div>
		 
		 <div class="s2_c_02 p_11" id="div11">
			 <h3>质量管控</h3>
			 <p>已完验评项目：<b id="assNum"></b></p>
			 <p>占比：<b id="zlpercentage"></b></p>
			 <p>优良率：<b id="goodRage"></b></p>
		 </div>
		 
		 <div class="s2_c_02 p_12" id="div12">
                        <a href="javascript:void(0)" style="text-decoration:none">
						    <h3>安全管控</h3>
							<p>人身事故数：<b id="rsAcc"></b></p>
							<p>设备事故数：<b id="sbAcc"></b></p>
							<p>其他事故数：<b id="otherAcc"></b></p>
							</a>
		 </div>
		 
		 <div class="s2_c_02 p_13" id="div13">
                        <a href="javascript:newWin('gantt/frame/index.jsp');"  style="text-decoration:none">
						    <h3>工程进度</h3>
							<p></p>
							<p>进度百分比：<b id="propercentage"></b></p>
							</a>
		 </div>
		 
		 <div class="s1_c_03 p_14" id="div14">
	     <a href="javascript:void(0)" style="text-decoration:none"> <h2>竣工验收申请报告</h2></a>
	     </div>
		 
		 <div class="s1_c_03 p_15" id="div15">
	     <a href="javascript:void(0)"  style="text-decoration:none"> <h2>竣工验收报表</h2></a>
	     </div>
		 
		 <div class="s1_c_03 p_16" id="div16">
	     <a href="javascript:void(0)" style="text-decoration:none"> <h2>竣工验收报告</h2></a>
	     </div>
		 
		 <div class="s1_c_03 p_17" id="div17">
	    <a href="javascript:void(0)" style="text-decoration:none"> <h2>项目后评估报告</h2></a>
	    </div>
      </div>
	 </div>
	 <div class="main_botton">
	     <p>说明：</p>
		 <img src="PCBusiness/zhxx/schedule/images/xyt_06.jpg"/>
		 <img src="PCBusiness/zhxx/schedule/images/xyt_07.jpg"/>
		 <img src="PCBusiness/zhxx/schedule/images/xyt_08.jpg"/>
	 </div>
  </div>
</body>
</html>