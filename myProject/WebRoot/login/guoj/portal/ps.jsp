<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%@ page import="com.sgepit.frame.util.DateUtil"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html> 
    <head>
    <%
    	String year_=thisTimeStr.substring(0,4);
   		String month_=thisTimeStr.substring(5,7);
        String day_=day;
    %>
		<!-- DWR -->
		<script type='text/javascript' src='<%=path %>/dwr/util.js'>
</script>
		<script type='text/javascript' src='<%=path %>/dwr/engine.js'>
</script>
		<script type='text/javascript' src='<%=path %>/dwr/interface/ComFileManageDWR.js'>
</script>    
		<script type='text/javascript' src='<%=path %>/dwr/interface/pcPrjService.js'>
</script>

<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
    <script type="text/javascript">
    var publishUnReadCount=0;
    var flowCount=0;
    var latMonthScore = '0';
   	DWREngine.setAsync(false);
  		ComFileManageDWR.getUnreadMsgNumPublish(USERID, USERDEPTID,"info_root",function(retVal){
			if(retVal){
				publishUnReadCount=retVal;
			}
		}); 
        db2Json.selectData("select count(flowid) as flowid from TASK_VIEW where TONODE ='"+USERID+"' and FLAG = 0", function (jsonData) {
	   		var list = eval(jsonData);
	    	if(list!=null){
	   	 		flowCount=list[0].flowid;
	     		 }  
	      	 });      	 
		pcPrjService.getLastMonthNum(CURRENTAPPID,function(score){
			if('none'==score) {
				score = '0';
			}
			latMonthScore=score;
		});	
	 DWREngine.setAsync(true);
	 function goUnReadPublish(){
		parent.window.location.href = CONTEXT_PATH+"/jsp/messageCenter/search/com.fileSearch.publish.query.jsp?rootId=info_root";	 
	 }
	function goFlow(){
		parent.window.location.href = CONTEXT_PATH+"/jsp/flow/flw.main.frame.jsp";	
	}
	function openScoreNum(){
		//var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
		window.showModalDialog(
			BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp?view=1",
			"","dialogWidth:980px;dialogHeight:450px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}	
    </script>
    <style>
    	.bea-portal-body
			{
			    display: inline;
			    text-decoration: none;
			    color: black;
			  	padding:10px 5px 5px 40px;
			    font-size:16px;
			    font-family:"宋体";
			    bold:true;
			    font-weight:bold;
			}
			
    </style>
    </head>
   <body >   		
		<table width="100%" height="100%" border="0" align="center">
			<tr>
				<td >
		  			<table cellspacing="1" border="0" width="100%">
					    <tr>
							<td class="bea-portal-body" width="100%">今天是 <font style="text-decoration:underline;"><%=year_%></font>年<font style="text-decoration:underline;"><%=month_%></font>月<font style="text-decoration:underline;"><%=day_%></font>日&nbsp;&nbsp;&nbsp;<%=DateUtil.getLocaleDayOfWeek()%> </td>									
					    </tr>
					    <tr>
							<td class="bea-portal-body" width="100%">您目前有：&nbsp;&nbsp; <img src="<%=path %>/jsp/res/images/icons/button-b01.png"></img>待办事项&nbsp;&nbsp;<font style="text-decoration:underline;color:red">
							 <script type="text/javascript">
							 var htmlStr="<span onclick='goFlow()' style='cursor:hand;font-size:18px;font-family:'宋体';'>"+flowCount+"</span>";
							document.write(htmlStr);
							 </script>							

							</font>&nbsp;&nbsp;个 </td>									
					    </tr>
					    <tr>
							<td class="bea-portal-body" width="100%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="<%=path %>/jsp/res/images/icons/button-b02.png"></img>未读信息&nbsp;&nbsp;<font style="text-decoration:underline;color:red">
							 <script type="text/javascript">
							 var htmlStr="<span onclick='goUnReadPublish()' style='cursor:hand;font-size:18px;font-family:'宋体';'>"+publishUnReadCount+"</span>";
							document.write(htmlStr);
							 </script>
							</font>&nbsp;&nbsp;条</td>									
						</tr>
					    <tr>
							<td class="bea-portal-body" width="100%">上月数据完整性考核分数&nbsp;&nbsp;<font style="text-decoration:underline;color:red">
							 <script type="text/javascript">
							 var htmlStr="<span onclick='openScoreNum()' style='cursor:hand;font-size:18px;font-family:'宋体';'>"+latMonthScore+"</span>";
							document.write(htmlStr);
							 </script>
							</font>&nbsp;&nbsp;分</td>									
						</tr>						
						
					</table>
					
				</td>
			</tr>
		</table>
			

	</body>

</html>
<script LANGUAGE="JavaScript">
	function openContact(type){
		var url=""
		if(type=="dept"){
			url ="<%=basePath%>jsp/index/portal/contact/phone/dept.htm"
		}
		if(type=="yjs"){
			url = "<%=basePath%>jsp/index/portal/contact/phone/yjs.htm"
		}
		if(url!= ""){
			window.open(url)
		} else{
			parent.window.alert("暂无通讯录的信息!")
		}
    	
	}
 </script>

