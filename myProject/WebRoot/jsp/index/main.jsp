<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.util.DateUtil"%>
<%@ page import="com.sgepit.frame.util.JSONUtil"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%
if(request.getSession().getAttribute(Constant.USERID)==null){
	out.println("<script>top.location.href='"+basePath+"'</script>");
	return;
}
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
List<RockPower> list = systemMgm.getChildRockPowersByParentId(Constant.DefaultModuleRootID, request.getSession());
String naviTop = JSONUtil.formObjectsToJSONStr(list);
String naviSecondStr = "[]";//systemMgm.getChildRockPowerStr(((RockPower)list.get(0)).getPowerpk());
String TODAY = DateUtil.getSystemDateTimeStr("yyyy-MM-dd");
 %>
<%@ include file="/jsp/common/golobalJs.jsp"%>
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
		<link rel="stylesheet" type="text/css"
			href="../res/css/index.styles.css" />
		<link rel="stylesheet" type="text/css" href="../res/css/style.css" />
	<style type="text/css">
			
			.icon-submit {
				background-image: url("<%=path%>/jsp/res/images/accept.png") !important;
			}
			
	</style>
		
		<script>
			var TODAY = "<%=TODAY%>";
			var portalTab = [
				{id:'dummy',title:'dummy'},//隐藏标签，使用“常用操作”和直接进流程时激活
				{id:'portal',title:'首页',iconCls:'icon-index'}]
			function naviObjectToArray(obj){
				var arr = new Array(); 
				for (var i=0; i<obj.length; i++){
					var o = {}
					o.title = obj[i]["powername"]
					o.id = obj[i]["powerpk"]
					o.url = obj[i]["url"]
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
			.c0 { background:url('../res/images/sgcclogo.jpg') no-repeat}
			.c1 { background:url('../res/images/sgcclogo1.jpg') no-repeat}
			.c2 { background:url('../res/images/sgcclogo2.jpg') no-repeat}
			.c3 { background:url('../res/images/sgcclogo3.jpg') no-repeat}
			//.c4 { background:url('../res/images/sgcclogo4.jpg') no-repeat}
			.c4 { background:url('../res/images/top_bg.jpg') no-repeat}
			.c5 { background:url('../res/images/sgcclogo5.jpg') no-repeat}
			li.lin1 {line-height:16px; margin-top:5px; background:url('../res/images/bullet_star.png') no-repeat; text-indent:16px;}
			.icon-index {background-image:url(../res/images/icons/application_home.png) !important;}
			.toolbar-c{overflow:hidden!important;background:transparent;border-style:none;}
			.current-c{background-image: url(../res/images/bullet_star.png) !important;}
			.pid-check {background-image: url(../res/images/icon-complete.gif) !important;}
			.pid-no-check {background-image: url(../res/images/icon-active.gif) !important;}
			<%
				out.println(systemMgm.getModulesIconClsStr());
			%>
		</style>
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
		<div id="loading">
			<div class="loading-indicator">&nbsp;&nbsp;&nbsp; 
				<img src="../res/images/index/extanim32.gif" width="32" height="32"
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
		<script type="text/javascript" src="info.js"></script>
		<script type="text/javascript" src="flow.js"></script>
		<script type="text/javascript" src="FeedPanel.js"></script>
		<script type="text/javascript" src="main.js"></script>

		<div id="headerDiv">
			<div id="headerDiv2" style="width: 100%; height:100%;" class="c4">
					<div style="height: 15px;text-align:right; padding-top:5px;padding-bottom:0px;padding-right:10px;">
						<div id='menu1' style="width: 80px;"></div>
					</div>
					<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
					</form>
				<div style="float: right; display: inline;">
					<div style="height: 20px;text-align:right;padding-top:11px; padding-right:11px;">
						<!-- a href="#" onclick='css(0)'>0</a>&nbsp;<a href="#" onclick='css(1)'>1</a>&nbsp;<a href="#" onclick='css(2)'>2</a>&nbsp;
						<a href="#" onclick='css(3)'>3</a>&nbsp;<a href="#" onclick='css(4)'>4</a>&nbsp;<a href="#" onclick='css(5)'>5</a-->
						<!-- <a href="#" onclick='portalConfig()'>设置</a-->
						&nbsp;<img src="../res/images/index/upcoming-work.png" align="absmiddle">&nbsp;
						<a href="plug/downloda.jsp" >下载插件</a>
						&nbsp;<img src="../res/images/index/pencil.png" align="absmiddle">&nbsp;
						<a href="#" onclick='modifyPwd()'>修改口令</a>&nbsp;<img src="../res/images/index/current-work.png" align="absmiddle">&nbsp;
						<a href="#" onclick='showHelp()'>帮助</a>&nbsp;<img src="../res/images/index/logout.png" align="absmiddle">&nbsp;
						<a href="#" onclick='logout()'>注销</a>
					</div>
				</div>
				<div style="height:26px; text-align: left; padding-top:12px;padding-left:10px;">;
					<span id="naviHeader" style="width:97%;"></span>
				</div>
			</div>
		</div>
		<div id=modulePath value=当前位置：<%=Constant.DefaultModuleRootName %>首页></div>
		<!-- 
		<div id="bottomDiv" style="border-top:1px #FF0000 solid;">
			<table cellpadding=0 cellspacing=0 width=100% height=100% >
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
	 -->	
			
	</body>
</html>
<script>
var btn;
Ext.onReady(function(){
    var tb = new Ext.Toolbar({
    	cls: "toolbar-c"
    });
    tb.render('menu1');
    
    var menu = new Ext.menu.Menu({
        id: 'mainMenu'
	});
	
	btn = new Ext.Toolbar.Button({
		tooltip: "切换项目",
		tooltipType: 'title',
		iconCls: 'current-c',
        text: CURRENTAPPNAME,
        menu: menu  // assign menu by instance
	});
	
	tb.add(btn);
    
	var pidArr = USERPIDS.split(",");
	var pNameArr = USERPNAMES.split(",");
	for (i=0; i<pidArr.length; i++) {
		var menuText = pNameArr[i];
		var iconClsTemp = "pid-no-check";
		if(pidArr[i]==CURRENTAPPID){
			menuText = "<b>" + pNameArr[i] + "</b>";
			iconClsTemp = "pid-check";
		}
		var menuItem = new Ext.menu.Item({id: pidArr[i], text: menuText, iconCls: iconClsTemp, handler: onItemClick});
		menu.add(menuItem);
	}
        
	function onItemClick(item){
		if(item.id!=CURRENTAPPID) {
			commonUtilDwr.changeCurrentAppPid(item.id, item.text, function() {
				CURRENTAPPID = item.id;
				CURRENTAPPNAME = item.text;
				btn.setText(CURRENTAPPNAME);
				var itemArr = menu.items;
				for(var i=0; i<itemArr.length; i++) {
					var itemTemp = itemArr.itemAt(i);
					if(itemTemp.id == item.id) {
						itemTemp.setText("<b>" + item.text + "</b>");
						itemTemp.setIconClass("pid-check");
					}
					if(itemTemp.id != item.id && itemTemp.text.indexOf("<b>")==0){
						itemTemp.setIconClass("pid-no-check");
						itemTemp.setText(itemTemp.text.substring(3, itemTemp.text.length-4));
					}
				}
				window.frames["contentFrame"].location.reload();
			});
		}
    }
});

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