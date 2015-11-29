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
/*用户可访问的第一个URL不为空的子系统*/
RockPower rp = systemMgm.getFirstPowerFromSubSystem(Constant.DefaultModuleRootID, userid);
String rpJson = JSONUtil.formObjectToJSONStr(rp);
String naviSecondStr = "[]";//systemMgm.getChildRockPowerStr(((RockPower)list.get(0)).getPowerpk());
String TODAY = DateUtil.getSystemDateTimeStr("yyyy-MM-dd");
 %>

<html>
	<head>
		<title>
				<%=Constant.DefaultModuleRootName%>
				您好！<%=realname%>同志，欢迎进入本系统。
				<%=DateUtil.getSystemDateTimeStr("yyyy年MM月dd日")%>&nbsp;&nbsp;<%=DateUtil.getLocaleDayOfWeek()%>
		</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<LINK rel="shortcut icon" HREF="<%=path%>/login/jit/images/appshortcut.ico"> 
		<link rel="stylesheet" type="text/css"	href="index.jt.styles.css" />
		<style type="text/css">
			.icon-submit {
				background-image: url("<%=path%>/jsp/res/images/accept.png") !important;
			}
			.module-gray {text-decoration:underline};
			li.lin1 {line-height:16px; margin-top:5px; background:url('../res/images/bullet_star.png') no-repeat; text-indent:16px;}
			.icon-index {background-image:url(<%=path%>/jsp/res/images/icons/application_home.png) !important;}
			<%
				out.println(systemMgm.getModulesIconClsStr());
			%>
		</style>
		
		<script>
			var TODAY = "<%=TODAY%>";
			var portalTab = [
				{id:'dummy',title:'dummy'}//,隐藏标签，使用“常用操作”和直接进流程时激活
				//{id:'portal',title:'首页',iconCls:'icon-index'}
			]
			var rp = <%=rpJson%>;
			var url = "PCBusiness/zhxx/query/pc.zhxx.projinfo.index.jsp";
			var selectId = "";
			function naviObjectToArray(obj){
				var arr = new Array();
				for (var i=0; i<obj.length; i++){
					var o = {}
					o.title = obj[i]["powername"]
					o.id = obj[i]["powerpk"]
					o.url = obj[i]["url"]
					arr.push(o)
					if(o.url.indexOf(url)>-1){
						selectId = o.id
						o.url = "PCBusiness/zhxx/baseInfoInput/welcomePage.jsp"
					}
					else if(o.url.indexOf(rp[0]["url"])>-1){
						selectId = o.id
						o.url = rp[0]["url"]
					}
				}
				
				return arr;
			}
			var naviTopObj = <%=naviTop%>
			var naviTopSt = portalTab.concat(naviObjectToArray(naviTopObj));
			var firstTopLevel = naviTopSt[0];
		</script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/ComFileManageDWR.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/commonUtilDwr.js'></script>
	</head>

	<body id="docs">
	<OBJECT id="RemoveIEToolbar" codeBase="nskey.dll" height="1" width="1" classid="CLSID:2646205B-878C-11d1-B07C-0000C040BCDB" VIEWASTEXT>
	<PARAM NAME="ToolBar" VALUE="0">
	</OBJECT>
		<div id="loading-mask" style=""></div>
		<div id="loading" style="position:absolute; top:50%; left:50%">
			<div class="loading-indicator">&nbsp;&nbsp;&nbsp; 
				<img src="<%=path%>/jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				页面加载中...
			</div>
		</div>
		<!-- include everything after the loading indicator -->
		<script>
			var naviSecondObj = <%=naviSecondStr%>;
			var naviSecondSt = new Array();
			for(var i=0; i<naviSecondObj.length; i++){
				naviSecondSt.push(naviSecondObj[i]);
			}
			function css(n){
				document.all.headerDiv2.className = "c"+n
			}
		</script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/index/info.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/index/flow.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/index/FeedPanel.js"></script>
		<script type="text/javascript" src="main.js"></script>

		<div id="headerDiv">
			<div class="logo"></div>
			<div class="logo2"></div>
			<div class="right_nav">
				   <table width="100%" border="0" cellspacing="0" cellpadding="0">
					  <tr>
					  	<td width="25%" align="left" valign="middle"><a href="#" onclick='modifyPwd()'>修改密码</a></td>
						<td width="5%" align="left" valign="middle">|</td>
						<td width="25%" align="left" valign="middle"><a href="<%=request.getContextPath()%>/jsp/common/MIS_Plus_V2.exe">下载插件</a></td>
						<td width="5%" align="left" valign="middle">|</td>
						<td width="15%" align="left" valign="middle"><a href="#" onclick='showHelp()'>帮助</a></td>
						<td width="5%" align="left" valign="middle">|</td>
						<td width="20%" align="left" valign="middle"><a href="#" onclick='logout()'>注销</a></td>
					  </tr>
				  </table>
			</div>
			<div id="naviHeader" style="text-align: left; padding-top:3px;padding-left:3px;"/>
		</div>
		<div id=modulePath value=当前位置：<%=Constant.DefaultModuleRootName %>首页></div>
	</body>
</html>
<script>
 function chanageColor(color){
		Ext.MessageBox.confirm("更改主题方案", '更改主题方案将刷新该页面', function (btn){
			if(btn=='yes'){
				 	if(color == "green"){
					  		 changeBgColor("xtheme-green.css")
					  	}else if("red"==color){
					  		 changeBgColor("xtheme-red5.css")
					  	}else{
					  		 changeBgColor("xtheme-normal.css")
					  	}
			}
		}
		)
 }
 
 
 	// 更换皮肤
	function changeBgColor(bgColor){	
		// 更换皮肤，
		Ext.util.CSS.swapStyleSheet("theme", "/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/"+bgColor);
		// 并将此皮肤的颜色存储到 Cookie 中，下次登录或者刷新则显示这个颜色的皮肤
		var date=new Date();//今天的日期
	    date.setTime(date.getTime()+30*24*3066*1000);//30天后的日期
		//如果不设置expires的话，会在关闭浏览器后cookies失效。
		document.cookie="theme="+bgColor+";expires="+date.toGMTString();//设置30天后过期的cookies(名称为css)
		window.location.reload();
	}
	
</script>