<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.util.DateUtil"%>
<%@ page import="com.sgepit.frame.util.JSONUtil"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
List<RockPower> list = systemMgm.getChildRockPowersByParentId(Constant.DefaultModuleRootID, request.getSession());
String naviTop = JSONUtil.formObjectsToJSONStr(list);
String naviSecondStr = "[]";//systemMgm.getChildRockPowerStr(((RockPower)list.get(0)).getPowerpk());
String TODAY = DateUtil.getSystemDateTimeStr("yyyy-MM-dd");
 %>

<%@ include file="/jsp/common/golobalJs.jsp"%>
 <%
	String imagePath = path + "/login/guoj/images";
	String sysImagePath = path + "/jsp/res/images/icons";
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title><%=Constant.DefaultModuleRootName%>
				你好！<%=realname%>同志，欢迎进入本系统。
				<%=DateUtil.getSystemDateTimeStr("yyyy年MM月dd日")%>&nbsp;&nbsp;<%=DateUtil.getLocaleDayOfWeek()%>
		</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<link rel="stylesheet" type="text/css"
			href="index.styles.css"></link>
		<link rel="stylesheet" type="text/css" href="style.css" />
		<script>
			var TODAY = "<%=TODAY%>";
			var portalTab = [{id:'portal',title:'首页',iconCls:'icon-index'}]
			function naviObjectToArray(obj){
				var arr = new Array(); 
				for (var i=0; i<obj.length; i++){
					var o = {}
					o.title = obj[i]["powername"]
					o.id = obj[i]["powerpk"]
					//o.iconCls = obj[i]["iconcls"]!=""&&obj[i]["iconcls"]!="null"?obj[i]["iconcls"].split(".")[0]:'icon-config'
					arr.push(o)
				}
				return arr;
			}
			var naviTopObj = <%=naviTop%>
			var naviTopSt = portalTab.concat(naviObjectToArray(naviTopObj));
			var firstTopLevel = naviTopSt[0];
		</script>
		<style>
			.module-gray {text-decoration:underline};      
			.c4 { background:url('<%=imagePath%>/top_bg.jpg') no-repeat}
			li.lin1 {line-height:16px; margin-top:5px; background:url('<%=imagePath%>/bullet_star.png') no-repeat; text-indent:16px;}
			.icon-index {background-image:url(<%=imagePath%>/application_home.png) !important;}
			<%
				out.println(systemMgm.getModulesIconClsStr());
			%>
		</style>
		<style>
.downloadLink {
	color: #1E4176;
	cursor: hand;
}

.downloadLink img {
	height: 16px;
}

.msgCount{
	color : red;
}

</style>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/ComFileManageDWR.js'></script>
	</head>

	<body scroll="no" id="docs">
	<OBJECT id="RemoveIEToolbar" codeBase="<%=request.getContextPath()%>/jsp/common/nskey.dll" height="1" width="1" classid="CLSID:2646205B-878C-11d1-B07C-0000C040BCDB" VIEWASTEXT>
	<PARAM NAME="ToolBar" VALUE="0">
	</OBJECT>
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="loading-indicator">&nbsp;&nbsp;&nbsp; 
				<img src="<%=imagePath%>/extanim32.gif" width="32" height="32"
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
		//用户右侧消息窗口的布局
		<script type="text/javascript" src="main.js"></script>

		<div id="headerDiv">
			<div id="headerDiv2" style="width: 100%; height:100%;" class="c4">
					<div style="height: 20px;text-align:right; padding-top:17px;padding-right:10px;">
						<a href="#" onclick='chanageColor("normal")'><img src="<%=imagePath%>/normal.jpg"  alt="原始主题"/></a>
						<a href="#" onclick='chanageColor("red")'><img src="<%=imagePath%>/red.jpg" alt="红色主题"/></a>
						<a href="#" onclick='chanageColor("green")'><img src="<%=imagePath%>/green.jpg" alt="绿色主题"/></a>
					</div>
					<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
					</form>
				<div style="float: right; display: inline;">
					<div style="height: 20px;text-align:right;padding-top:12px; padding-right:11px;">
						<!-- a href="#" onclick='css(0)'>0</a>&nbsp;<a href="#" onclick='css(1)'>1</a>&nbsp;<a href="#" onclick='css(2)'>2</a>&nbsp;
						<a href="#" onclick='css(3)'>3</a>&nbsp;<a href="#" onclick='css(4)'>4</a>&nbsp;<a href="#" onclick='css(5)'>5</a-->
						<!-- <a href="#" onclick='portalConfig()'>设置</a--> 
						&nbsp;<img src="<%=imagePath%>/pencil.png" align="absmiddle">&nbsp;
						<a href="#" onclick='modifyPwd()'>修改口令</a>&nbsp;<img src="<%=imagePath%>/current-work.png" align="absmiddle">&nbsp;
						<a href="#" onclick='showHelp()'>帮助</a>&nbsp;<img src="<%=imagePath%>/logout.png" align="absmiddle">&nbsp;
						<a href="#" onclick='logout()'>注销</a>
					</div>  
				</div>
				<div style="height:26px; text-align: left; padding-top:12px;padding-left:10px;">;
					<span id="naviHeader" style="width:97%;"></span>
				</div>
			</div>
		</div>
		<!-- 
		<div id="bottomDiv" style="border-top:1px #FF0000 solid;">
			<table cellpadding=0 cellspacing=0 width=100% height=100% >
			<tr>
				<td width=30%>你好！<%=realname%>同志，欢迎进入本系统。</td>
				<td align=center>&nbsp;
				<a href="#" onclick='chanageColor("normal")'><img src="<%=imagePath%>/normal.jpg"  alt="原始主题"/></a>
				<a href="#" onclick='chanageColor("red")'><img src="<%=imagePath%>/red.jpg" alt="红色主题"/></a>
				<a href="#" onclick='chanageColor("green")'><img src="<%=imagePath%>/green.jpg" alt="绿色主题"/></a>
				<td width=30% align=right><%=DateUtil.getSystemDateTimeStr("yyyy年MM月dd日")%>&nbsp;&nbsp;<%=DateUtil.getLocaleDayOfWeek()%></td>
			</tr>
			</table>
		</div>
	 -->	
			
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