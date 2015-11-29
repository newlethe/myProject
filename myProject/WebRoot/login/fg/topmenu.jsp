<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ include file="/jsp/common/golobalJs.jsp"%>	

	<%
		String imagePath = path + "/login/fg/images/user_home";
	%>

	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<title>HOME</title>
		<style type="text/css" media="screen">

body {
	margin: 0;
	padding: 0;
	background: #FFF;
}

div,h1,h2,h3,h4,p,form,label,input,textarea,img,span {
	margin: 0;
	padding: 0;
	border: none;
}

ul {
	margin: 0;
	padding: 0;
	list-style-type: none;
	font-size: 0;
}

.spacer {
	clear: both;
	font-size: 0;
	line-height: 0;
}

.home_bg {
	background: url(<%=imagePath%>/fg_07.jpg) right bottom repeat-x;
	width: 100%;
	height: 551px !important;
	height: 580px;
	display: block;
	bottom: 0px;
	position: fixed;
}

.home_bg #home_bg2 {
	background: url(<%=imagePath%>/fg_08.jpg) no-repeat;
	width: 100%;
	height: 551px !important;
	height: 580px;
	background-position: right bottom;


}

#home_bg2 .menu {
	width: 800px;
	height: 340px;
	padding: 70px 0 0 80px !important;
	padding: 120px 0 0 80px;


}

#home_bg2 .menu a {
	display: block;
	width: 100px;
	font: bold 14px/ 26px Verdana, Arial, Helvetica, sans-serif;
	color: #333333;
	text-decoration: none;
	text-align: center;
}

#home_bg2 .menu a:hover {
	color: #FF3300;
}

#home_bg2 .menu a.inactive,#home_bg2 .menu a.inactive:hover {
	color: #86867D;
	cursor: default;
}

.sx {
	width: 800px;
	height: 90px;
	padding: 45px 0 0 80px !important;
	padding:48px 0 10px 80px;
}

.sx img {
	width: 65px;
	height: 89px;
	padding: 0;
	margin: 5px 0 0 0;
	float: left;
}

.sx .text {
	width: 600px;
	height: 75px;
	margin: 0 0 0 100px;
}

.sx .text ul {
	padding: 15px 0 0 11px;
}

.sx .text ul li {
	background: url(<%=imagePath%>/tb_jt.png) 0 6px no-repeat;
	padding: 0 0 3px 25px;
}

.sx .text ul li a {
	display: block;
	font: bold 14px/ 26px Verdana, Arial, Helvetica, sans-serif;
	color: #333333;
	background-color: inherit;
	text-decoration: none;
}

.sx .text ul li a:hover {
	color: #000;
}

.sx .text ul li a span {
	font: bold 14px/ 26px Verdana, Arial, Helvetica, sans-serif;
	color: #CC3333;
	background-color: inherit;
	text-decoration: underline;
}


</style>
		<base href="<%=basePath%>">
			<!-- DWR -->
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/ComFileManageDWR.js'></script>
		<script type='text/javascript' src='<%=path %>/dwr/interface/pcPrjService.js'></script>
		<script type="text/javascript">
 
    /**
 	var USERID = '<%=userid%>'
	var USERDEPTID = '<%=userdeptid%>'
 	var pidsArray = USERPIDS.split(',');
 	*/
 	
 	window.onload = initAll;
 	
 	function initAll(){
 		getUnreadNum();
 		getAuditScore();
 	}
 
 	function openMsgWindow(){
		var msgWin = parent.showMsgWin();
		
		msgWin.on('hide', function(p){
	
			getUnreadNum();
		});
	}
	
	function getUnreadNum(){
	ComFileManageDWR.getUnreadMsgNum(USERID, USERDEPTID, function(retVal){
				document.getElementById('msgNum').innerHTML = retVal;
			});
	}
	
	function getAuditScore(){
		DWREngine.setAsync(false);
			pcPrjService.getLastMonthNums(USERBELONGUNITID, function(score){
				document.getElementById('lastMonthScore').innerHTML = score;
			})
		DWREngine.setAsync(true);
	}
	
	function openTaskWindow(){
		parent.showTaskWin();
	}
	
	function openFun(rockId){
		parent.openSecondNaviTab(rockId);
	}
	
	function openScoreNum(){
		//var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
		window.showModalDialog(
			BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp?view=1",
			"","dialogWidth:980px;dialogHeight:450px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
	
	function openUrl(url){
		if ( url == '' )
			return;
		var newWindow = window.open(url, '_blank');
		newWindow.focus();
		return false;
	}
	
	function imgOnerror(obj, flag){
		obj.onerror = null
		if(flag) {
			obj.src= "<%=imagePath%>/default.png"
		} else {
			obj.src= "<%=imagePath%>/default_f.png"
		}
	}
	
 </script>

	</head>
	<body>
		<div class="home_bg">
			<div id="home_bg2">
				<div class="menu">
					<table width="90%" border="0" cellspacing="0" cellpadding="0">
				<c:set var="btnPerRow" scope="page"
							value="6"></c:set>
				<c:set var="menuCount" scope="page"
							value="${ fn:length(allRockPower) }"></c:set>

						<tr>
						<c:forEach items="${allRockPower}" var="rock" varStatus="status">
								<c:if test="${ not empty rockPowerMap[rock.powerpk] }">
									<td width="85" align="left" valign="top"
										onclick="openFun('${rock.powerpk }')">
										<a href="javascript:void(0)"><img
												src="<%=imagePath%>/${rock.powername }.png" alt=""
												width="70" height="70" onerror="imgOnerror(this, true)"/> </a><a href="javascript:void(0)">${rock.powername
											}</a>
									</td>
									<td width="34" align="left" valign="top">
										&nbsp;
									</td>

								</c:if>
								<c:if test="${empty rockPowerMap[rock.powerpk] }">
									<td width="85" align="left" valign="top">
										<a href="javascript:void(0)" class="inactive"><img
												src="<%=imagePath%>/${rock.powername }-f.png" alt=""
												width="70" height="70" onerror="imgOnerror(this, false)"/> </a><a href="javascript:void(0)"
											class="inactive">${rock.powername }</a>
									</td>
									<td width="34" align="left" valign="top">
										&nbsp;
									</td>
								</c:if>

								<c:if
									test="${ (status.count mod btnPerRow eq 0) and status.count ne 0 }">
						</tr>
						<tr>
							<td height="50" align="left" valign="top" colspan="14">
								&nbsp;
							</td>
						</tr>
						<tr>
							</c:if>

							</c:forEach>
							<c:if test="${menuCount mod btnPerRow ne 0  }">
								<c:forEach begin="1" end="${btnPerRow - ( menuCount mod btnPerRow )  }">
									<td width="85" align="left" valign="top">
										&nbsp;
									</td>
									<td width="34" align="left" valign="top">
										&nbsp;
									</td>
								</c:forEach>
							</c:if>

						</tr>
				</table>

				</div>
				<div class="sx">
					<img src="<%=imagePath%>/fg_09.jpg" />
					<div class="text">
						<ul>
							<li>
								<a href="javascript:void(0)" onclick="openTaskWindow()">您目前有<span>&nbsp;&nbsp;${taskNum
										}&nbsp;&nbsp;</span>条待办事项未处理。</a>
							</li>
							<li>
								<a href="javascript:void(0)" onclick="openMsgWindow()"
									title="打开信息发布查询窗口">您目前有<span>&nbsp;&nbsp;<span
										id="msgNum">0</span>&nbsp;&nbsp;</span>个MIS文件未阅读。</a>
							</li>
							<li>
								<a href="javascript:void(0)" onclick="openScoreNum()"
									title="打开信息发布查询窗口">上月数据完整性考核分数<span>&nbsp;&nbsp;<span
										id="lastMonthScore">0</span>&nbsp;&nbsp;</span>分。</a>
									
							</li>
						</ul>
						<br class="spacer" />
					</div>
				</div>
			</div>
		</div>
	</body>
</html>