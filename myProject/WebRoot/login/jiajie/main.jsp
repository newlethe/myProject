<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.util.DateUtil"%>
<%@ page import="com.sgepit.frame.util.JSONUtil"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
List<RockPower> list = systemMgm.getChildRockPowersByParentId(Constant.DefaultModuleRootID, request.getSession());
String naviTop = JSONUtil.formObjectsToJSONStr(list);
String naviSecondStr = "[]";//systemMgm.getChildRockPowerStr(((RockPower)list.get(0)).getPowerpk());
String TODAY = DateUtil.getSystemDateTimeStr("yyyy-MM-dd");
String imagePath = path + "/login/jiajie/images";
String sysImagePath = path + "/jsp/res/images/icons";
 %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title><%=Constant.DefaultModuleRootName%>
				您好！<%=realname%>同志，欢迎进入本系统。
				<%=DateUtil.getSystemDateTimeStr("yyyy年MM月dd日")%>&nbsp;&nbsp;<%=DateUtil.getLocaleDayOfWeek()%>
		</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<link href="style.css" rel="stylesheet" type="text/css" />
	</head>
	<style>
			.module-gray {text-decoration:underline};
			.c4 { background:url('<%=imagePath%>/top_bg.jpg') no-repeat}
			li.lin1 {line-height:16px; margin-top:5px; background:url('<%=path%>/jsp/res/images/bullet_star.png') no-repeat; text-indent:16px;}
			.icon-index {background-image:url(<%=path%>/jsp/res/images/icons/application_home.png) !important;}
			.toolbar-c{overflow:hidden!important;background:transparent;border-style:none;}
			.current-c{background-image: url(<%=path%>/jsp/res/images/bullet_star.png) !important;color:#666666 !important;}
			.pid-check {background-image: url(<%=path%>/jsp/res/images/icon-complete.gif) !important;}
			.pid-no-check {background-image: url(<%=path%>/jsp/res/images/icon-active.gif) !important;}
			<%
				out.println(systemMgm.getModulesIconClsStr());
			%>
			.proTextCss-no-check{font:italic normal 12pt Arial;}
			.proTextCss-check{font:italic normal 12pt bolder Arial;}
		</style>
	<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/systemMgm.js'></script>
	<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/engine.js'></script>
	<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/db2Json.js'></script>
	<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/ComFileManageDWR.js'></script>
	<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/commonUtilDwr.js'></script>
	<body>
		<OBJECT id="RemoveIEToolbar" codeBase="nskey.dll" height="1" width="1" classid="CLSID:2646205B-878C-11d1-B07C-0000C040BCDB" VIEWASTEXT>
		<PARAM NAME="ToolBar" VALUE="0">
		</OBJECT>
		<!-- include everything after the loading indicator -->		
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="info.js"></script>
		<script type="text/javascript" src="flow.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/index/FeedPanel.js"></script>
		<script type="text/javascript">
			var portalTab = new Array();
			function naviObjectToArray(obj){
				var arr = new Array();
				var home={id:'homePage',title:'首页'};
				arr.push(home);
				for (var i=0; i<obj.length; i++){
					var o = {}
					o.title = obj[i]["powername"]
					o.id = obj[i]["powerpk"]
					o.url = obj[i]["url"]
					arr.push(o)
				}
				return arr;
			}
			var naviTopObj = <%=naviTop%>;
			var naviTopSt = portalTab.concat(naviObjectToArray(naviTopObj));
		</script>
		<script type="text/javascript" src="main.js"></script>
		<div id="top">
		    <img src="images/fg_01.jpg" class="logo">
		  
			<div class="right_nav">
				   <table width="100%" border="0" cellspacing="0" cellpadding="0">
					  <tr>
						<td width="7%" align="left" valign="middle"></td>
						<td width="10%" align="left" valign="middle"></td>
						<td width="3%" align="left" valign="middle">&nbsp;</td>
						<td width="7%" align="left" valign="middle"><img src="images/tb_xg.png" alt="" width="16" height="16" /></td>
						<td width="17%" align="left" valign="middle"><a href="javascript:modifyPwd()">修改密码</a></td>
						<td width="4%" align="left" valign="middle">&nbsp;</td>
						<td width="6%" align="left" valign="middle"><img src="images/tb_bz.png" alt="" width="16" height="16" /></td>
						<td width="10%" align="left" valign="middle"><a href="javascript:showHelp()">帮助</a></td>
						<td width="3%" align="left" valign="middle">&nbsp;</td>
						<td width="7%" align="left" valign="middle"><img src="images/tb_zx.png" alt="" width="16" height="16" /></td>
						<td width="17%" align="left" valign="middle"><a href="javascript:logout()">注销</a></td>
					  </tr>
				  </table>
			</div>
			<div class="proj_name"><div id='menu1' style="width:80px;"></div></div>
	<%--		<div class="topNav">
			    <ul>
					<li><a id="homePage" href="javascript:loadHomePage()"  class="hover"><span>首页</span></a></li>
					<% for(int i=0;i<list.size();i++){ %>
						<li><a id="<%=list.get(i).getPowerpk()%>" href="javascript:loadSecondNavi('<%=list.get(i).getPowerpk()%>')"><span><%=list.get(i).getPowername()%></span></a></li>
					<% }%>
			    </ul>
		  	</div>
		--%>
			<div id="naviHeader" style="text-align: left;"/>
		</div>
	</body>
</html>
<script>
function logout() {
	window.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=logout";
}

function modifyPwd() {
	if (!pwdWindow) {
		pwdWindow = new Ext.Window({
			title : '修改口令',
			iconCls : 'icon-modify-key',
			html : "<iframe id='tree' scrolling='no' align='center' src='<%=path%>/jsp/system/sys.password.setting.jsp' width='100%' height='100%'></iframe>",
			closeAction : 'hide',
			modal : true,
			plain : true,
			closable : true,
			border : true,
			maximizable : false,
			width : 500,
			height : 400
		});
	}
	pwdWindow.show();
}

function showHelp() {
	if(Ext.isIE){
		var url = BASE_PATH+"help/index.html";
		var sFeatures = "toolbar=no,resizable=yes,height="+screen.availHeight+",width="+screen.availWidth
		var sFeatures = "top=0,left=0,toolbar=no,resizable=yes,height="+screen.availHeight+",width="+screen.availWidth
		window.open(url,"_blank",sFeatures);
	}else{
		if (!helpWindow) {
			helpWindow = new Ext.Window({
						title : '帮助',
						iconCls : 'icon-sys-help',
						closeAction : 'hide',
						modal : true,
						plain : true,
						closable : true,
						border : true,
						maximizable : true,
						width : 800,
						height : 600,
						layout : 'fit',
						items : [new Ext.TabPanel({
									border : false,
									bodyBorder : false,
									activeTab : 0,
									enableTabScroll : true,
									defaults : {
										autoScroll : true
									},
									items : [{
												title : '使用须知',
												bodyStyle : {
													padding : "10,10,10,10"
												},
												autoLoad : '<%=path%>/jsp/system/sys.user.readme.html'
											}]
								})]
					});
		}
		helpWindow.show();
	}
}
</script>