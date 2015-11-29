<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.util.DateUtil"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title><%=Constant.DefaultModuleRootName%></title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<link rel="stylesheet" type="text/css" href="../res/css/index.styles.css"></link>
		<link rel="stylesheet" type="text/css" href="../res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>jsp/res/css/feed-viewer.css">
		
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseDao.js'></script>
		<!-- include everything after the loading indicator -->
		<script type="text/javascript" src="<%=request.getContextPath()%>/jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="info.js"></script>
		<script type="text/javascript" src="flow.js"></script>
		<script type="text/javascript" src="FeedPanel.js"></script>
		<script type="text/javascript" src="main.js"></script>
	</head>
	<body scroll="no" id="docs">
		<OBJECT id="RemoveIEToolbar" codeBase="nskey.dll" height="1" width="1" classid="CLSID:2646205B-878C-11d1-B07C-0000C040BCDB" VIEWASTEXT>
			<PARAM NAME="ToolBar" VALUE="0">
		</OBJECT>
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="loading-indicator">&nbsp;&nbsp;&nbsp; 
				<img src="../res/images/index/extanim32.gif" width="32" height="32"	style="margin-right: 8px;" align="absmiddle" />
				页面加载中...
			</div>
		</div>
		<div id="headerDiv">
			<div id="headerDiv2" style="width: 100%; height:100%;" class="c4">
				<div style="float: right; display: inline;">
					<div style="height: 40px;text-align:right; padding-top:25px;padding-right:11px;">
						<!-- a href="#" onclick='css(0)'>0</a>&nbsp;<a href="#" onclick='css(1)'>1</a>&nbsp;<a href="#" onclick='css(2)'>2</a>&nbsp;
						<a href="#" onclick='css(3)'>3</a>&nbsp;<a href="#" onclick='css(4)'>4</a>&nbsp;<a href="#" onclick='css(5)'>5</a-->&nbsp;<img src="../res/images/bullet_star.png" align="absmiddle">&nbsp;
						<a href='<%=request.getContextPath()%>/jsp/index/portal2.jsp' target=contentFrame>首页</a>&nbsp;<img src="../res/images/bullet_star.png" align="absmiddle">&nbsp;
						<!-- a href="#" onclick='portalConfig()'>设置</a>&nbsp;<img src="../res/images/bullet_star.png" align="absmiddle"-->
						<a href="#" onclick='modifyPwd()'>修改口令</a>&nbsp;<img src="../res/images/bullet_star.png" align="absmiddle">&nbsp;
						<a href="#" onclick='showHelp()'>帮助</a>&nbsp;<img src="../res/images/bullet_star.png" align="absmiddle">&nbsp;
						<a href="#" onclick='logout()'>注销</a>
					</div>
				</div>
				<div style="height:26px; text-align: left;"></div>
			</div>
		</div>
		<div id="bottomDiv">
			<table cellpadding=0 cellspacing=0 width=100% height=100% border=0>
				<tr>
					<td width=30%>你好！<%=realname%>同志，欢迎进入本系统。</td>
					<td align=center>&nbsp;
					<a href="#" onclick='chanageColor("normal")'><img src="../res/images/login_web/normal.jpg"  alt="原始主题"/></a>
					<a href="#" onclick='chanageColor("red")'><img src="../res/images/login_web/red.jpg" alt="红色主题"/></a>
					<a href="#" onclick='chanageColor("green")'><img src="../res/images/login_web/green.jpg" alt="绿色主题"/></a>
					<td width=30% align=right><%=DateUtil.getSystemDateTimeStr("yyyy年MM月dd日")%>&nbsp;&nbsp;<%=DateUtil.getLocaleDayOfWeek()%></td>
				</tr>
			</table>
		</div>
	</body>
</html>
<script>
//window.onload = init;
//var naviTopObj =
//var naviTopSt;
function init(){
	//naviTopSt = naviObjectToArray(naviTopObj);
};
function naviObjectToArray(obj){
	var arr = new Array(); 
	for (var i=0; i<obj.length; i++){
		var o = {}
		o.title = obj[i]["powername"]
		o.id = obj[i]["powerpk"]
		o.iconCls = obj[i]["iconcls"]!=""&&obj[i]["iconcls"]!="null"?obj[i]["iconcls"].split(".")[0]:''
		arr.push(o)
	}
	return arr;
};
function css(n){
	document.all.headerDiv2.className = "c"+n;
};
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
	})
};
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
};	
</script>