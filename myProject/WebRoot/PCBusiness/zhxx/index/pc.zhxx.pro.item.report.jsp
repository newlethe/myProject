<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.util.JSONUtil"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>综合报表功能首页</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<style type="text/css">
		body{
			background:#fff;
			padding:0;
		}
		.power_title{
			font:bold 16px/28px  "宋体";
			/*border:1px solid #000;*/
			padding:20px 0 10px 40px;
			background:#fff;
		}
		td{
			background:#fff;
		}
		td a{
			font: 14px/28px  "宋体";
			/*border:1px solid #000;*/
			padding-left:65px;
			background:#fff;
			dispaly:block;
		}
		td a:hover{
			font: 14px/28px  "宋体";
		}

		</style>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	</head>
	<script type="text/javascript">
	    var getArr = new Array();
		DWREngine.setAsync(false);
		baseDao.getData("select t.powerpk, t.powername, t.url  from ROCK_POWER t where t.parentid in  (select r.powerpk from ROCK_POWER r  where r.PARENTID = (select t.powerpk  from ROCK_POWER t   where t.powername = '综合报表查询')  and r.powername = '集团监管项目报表' union  select r.powerpk from ROCK_POWER r  where r.PARENTID = (select t.powerpk from ROCK_POWER t where t.powername = '综合报表查询')  and  r.powername='电源固定资产投资统计报表' )",function(rtn){
			if(rtn.length>0){
				for(i = 0; i < rtn.length; i++){
	        		var temp = new Array();
	       			temp.push(rtn[i][0]);
	        		temp.push(rtn[i][1]);
	        		temp.push(rtn[i][2]);
	       			getArr.push(temp);
				}
			}
		});
		DWREngine.setAsync(true);
		function openMeetingFun(str) {
			var url  = '';
			for(var j = 0; j < getArr.length; j ++ ){
				if(str == getArr[j][0]){
					url = getArr[j][2];
					break;
				}
			}
			window.showModalDialog(
				BASE_PATH+url,
				"","dialogWidth:"+(window.screen.availWidth)+"px;dialogHeight:"+(window.screen.availHeight)+"px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
	
	 	function imgOnerror(obj, flag){
		obj.onerror = null
		if(flag) {
			obj.src= "<%=basePath%>/login/jit/images/user_home/default.png"
		} else {
			obj.src= "<%=basePath%>/login/jit/images/user_home/default_f.png"
		}
	}
	</script>
	<body>
	
	<table id="report" width="70%" style="height:100%;" border="0" cellspacing="0" bgcolor="#cccccc" cellpadding="0" >
	<tr>
	<%
			String parentPowerpk = "";
		try{
						javax.naming.Context initCtx = new javax.naming.InitialContext();
						javax.sql.DataSource ds = (javax.sql.DataSource)com.sgepit.frame.util.JNDIUtil.lookup(initCtx) ;
						java.sql.Connection conn = ds.getConnection();
						java.sql.Statement st = conn.createStatement();
						String parentSql = "select t.powerpk  from ROCK_POWER t where t.powername = '综合报表查询'";
						java.sql.ResultSet rs = st.executeQuery(parentSql);
						List<RockPower> list = new ArrayList<RockPower>();
						while(rs.next()){
							parentPowerpk = rs.getString("powerpk");
						}
		
						rs.close();
						st.close();
						conn.close();
						}catch(Exception ex) {
							ex.printStackTrace();
						}
			SystemMgmFacade systemMgm1 = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
			List<RockPower> listPK = systemMgm1.getChildRockPowersByParentId(parentPowerpk, request.getSession());
			for(int i = 0; i<listPK.size(); i++){
				RockPower rock1 = listPK.get(i);
				if(rock1.getLeaf() == 1) continue;
				String powername = rock1.getPowername();
				String powerpk = rock1.getPowerpk();
			%>	
				<td valign="top" width="50%">
				
				<div class="power_title"><%=powername%></div>
				
				
			<%
				List<RockPower> list2 = systemMgm1.getChildRockPowersByParentId(powerpk, request.getSession());
				for(int j = 0; j<list2.size(); j++){
					RockPower rock2 = list2.get(j);
					
			%>
				<a href="javascript:void(0);" onclick="openMeetingFun('<%=rock2.getPowerpk()%>')">·<%=rock2.getPowername()%></a><br>
			<%		
					
				}
					out.println("</td>");
			}
	%>
	</tr>
	</table>
	
	<script type="text/javascript">
	if(parent.ct_tool){
		parent.ct_tool.el.parent().dom.style.display = 'none';
	}
	window.onunload = function(){
        if(parent.ct_tool){
        	parent.ct_tool.el.parent().dom.style.display = 'block';
        }
    }
	if(parent.wanyuan){
	    parent.wanyuan.setText('');
	}
	</script>
	</body>
</html>
