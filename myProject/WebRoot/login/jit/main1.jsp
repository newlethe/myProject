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

String naviMenusObject = systemMgm.getNaviMenus(Constant.DefaultModuleRootID, request.getSession(),"");
 %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>
		<%=Constant.DefaultModuleRootName%>
		您好！<%=realname%>同志，欢迎进入本系统。
		<%=DateUtil.getSystemDateTimeStr("yyyy年MM月dd日")%>&nbsp;&nbsp;<%=DateUtil.getLocaleDayOfWeek()%>
		</title>
		<link rel="shortcut icon" HREF="<%=path%>/login/jit/images/appshortcut.ico"/> 
		<link href="<%=basePath%>login/jit/images/appshortcut.ico" type="image/x-icon" rel="icon"/>
		<link href="<%=basePath%>login/jit/images/appshortcut.ico" type="image/x-icon" rel="shortcut icon"/>
		<link rel="stylesheet" type="text/css"	href="index.jt.styles.css" />
		<style type="text/css">
			/*
			.icon-submit {
				background-image: url("<%=path%>/jsp/res/images/accept.png") !important;
			}
			.module-gray {text-decoration:underline};
			li.lin1 {line-height:16px; margin-top:5px; background:url('../res/images/bullet_star.png') no-repeat; text-indent:16px;}
			.icon-index {background-image:url(<%=path%>/jsp/res/images/icons/application_home.png) !important;}
			.x-layout-split-north .x-layout-mini{display:none;left:48%;height:1px;width:35px;background-image:url(../images/default/layout/mini-top.gif);}
			.x-layout-cmini-north .x-layout-mini{display:none;left:48%;height:1px;width:35px;background-image:url(../images/default/layout/mini-bottom.gif);}
			<%
				out.println(systemMgm.getModulesIconClsStr());
			%>
			*/
	.mapInfoTop{
		width:149px;
		height:10px;
		background:url(<%=basePath%>PCBusiness/zhxx/index/images/info.png) no-repeat 0 0px ;
	}
	.mapInfoBody{
		width:149px;
		text-align:center;
		background:url(<%=basePath%>PCBusiness/zhxx/index/images/info_m.png) repeat-y;
	}
	.mapInfoFoot{
		width:149px;
		height:30px;
		cursor:pointer;
		background:url(<%=basePath%>PCBusiness/zhxx/index/images/info.png) no-repeat 0 -36px ;
	}
	.mapInfoBody a.infoUnit{
		color : #fff;
		font-size:12px;
		line-height:16px;
		font-weight:100;
		text-decoration:none;
	}
	.mapInfoBody a.infoUnit:hover{
		color : #fff;
		font-size:12px;
		line-height:16px;
		font-weight:100;
		text-decoration:underline;
	}
	.x-toolbar-pro{
		background : #fff !important;
		border:1px solid #fff !important;
		padding:2px !important;
	}
	
	/*控制按钮导航按钮样式*/
	
	#naviHeader{
		background:url(./images/jt_02.jpg) 0 -135px repeat-x !important;
		height:24px;
		text-align: left;
	}
	
	#naviHeader .x-toolbar{
		background:transparent !important;
	}
	#naviHeader .x-btn {
		border-right : 1px #fff dashed;
		/*border-right : 1px #fff dotted;*/
	}
	#naviHeader .x-btn-with-menu .x-btn-center em{
		/*background:url(./images/btn-arrow.gif) no-repeat right 3px !important;*/
		background:none;
		padding-right:0 !important;
	}
	#naviHeader .x-btn-text{
		font-size:14px !important;
		font-weight:100 !important;
		color:#fff !important;
		margin:0 5px !important;
	}
	
	#naviHeader .x-btn-over .x-btn-text{
		color:#000 !important;
		background:#fff !important;
	}
	#naviHeader .x-btn-over .x-btn-left{
		color:#000 !important;
		background:#fff !important;
	}
	#naviHeader .x-btn-over .x-btn-center{
		color:#000 !important;
		background:#fff !important;
	}
	#naviHeader .x-btn-over .x-btn-right{
		color:#000 !important;
		background:#fff !important;
	}
	
	
	#naviHeader .x-btn-menu-active .x-btn-text{
		color:#000 !important;
		background:#fff !important;
	}
	#naviHeader .x-btn-menu-active .x-btn-left{
		color:#000 !important;
		background:#fff !important;
	}
	#naviHeader .x-btn-menu-active .x-btn-center{
		color:#000 !important;
		background:#fff !important;
	}
	#naviHeader .x-btn-menu-active .x-btn-right{
		color:#000 !important;
		background:#fff !important;
	}
	
	.x-menu{
		border:none !important;
	}
	.x-menu A.x-menu-item:hover{
		font-weight:100 !important;
		padding : 1px 21px 0px 3px !important;
	}
	.x-menu-item-icon{
		display:none;
	}
	
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
						if(USERBELONGUNITTYPEID=="0"){//集团公司用户首页
							o.url = "PCBusiness/zhxx/baseInfoInput/welcomePage.jsp"
						}
						if(USERBELONGUNITID=="103"){//新兴能源用户
							o.url = "PCBusiness/zhxx/index/pc.zhxx.pro.index.jsp";
						}
					}else if(o.url.indexOf(rp[0]["url"])>-1){
						selectId = o.id
						o.url = rp[0]["url"]
					}
				}
				return arr;
			}
			var naviTopObj = <%=naviTop%>
			var naviTopSt = portalTab.concat(naviObjectToArray(naviTopObj));
			var firstTopLevel = naviTopSt[0];
			
			//新版导航菜单数据
			var naviMenusObject = eval("[<%=naviMenusObject%>]");
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
	<PARAM NAME="ToolBar" VALUE="0"/>
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
		<script type="text/javascript" src="main1.js"></script>
		
		<div id="show" style="position: absolute; display:none; z-index:99999" 
  			onmouseout="this.style.display='none';" onmouseover="this.style.display='block';" 
  			oncontextmenu="this.style.display='none';" ></div>
  			
		<div id="headerDiv" style="height:100px;">
			<div class="logo" style="height:100px;"></div>
			<div class="logo2" style="height:100px;"></div>
			<div class="right_nav">
				<a href="#" onclick='tohome()'>首页</a> |
				<a href="#" onclick='modifyPwd()'>修改密码</a> | 
				<a href="#" onclick='showHelp()'>帮助</a> |
				<a href="#" onclick='logout()'>注销</a>
				<!-- 
			   <table width="100%" border="0" cellspacing="0" cellpadding="0">
				  <tr>
				  	<td width="25%" align="left" valign="middle"><a href="#" onclick='modifyPwd()'>修改密码</a></td>
					<td width="5%" align="left" valign="middle">|</td>
					<%--<td width="25%" align="left" valign="middle"><a href="<%=request.getContextPath()%>/jsp/common/MIS_Plus_V2.exe">下载插件</a></td>
					<td width="5%" align="left" valign="middle">|</td>--%>
					<td width="15%" align="left" valign="middle"><a href="#" onclick='showHelp()'>帮助</a></td>
					<td width="5%" align="left" valign="middle">|</td>
					<td width="20%" align="left" valign="middle"><a href="#" onclick='logout()'>注销</a></td>
				  </tr>
			  </table>
			   -->
			</div>
		</div>
		<div style="height:24px;" >
			<div id="naviHeader"></div>
		</div>
		<div id=modulePath value=当前位置：<%=Constant.DefaultModuleRootName %>首页></div>
	</body>
</html>
<script>
var showMode = document.getElementById("show");
var headerDiv = document.getElementById("headerDiv");
function loadFirstModuleFromMap(pid,name,type){
	//loadFirstModule(pid,name);
				DWREngine.setAsync(false);
				switchoverProj(pid,name)
				DWREngine.setAsync(true);
				parent.lt.expand();
				parent.proTreeCombo.show();
				parent.proTreeCombo.setValue(CURRENTAPPID)
				parent.backToSubSystemBtn.show();
				parent.pathButton.setText("<b>当前位置:"+parent.selectedSubSystemName+"</b>")
	var url = BASE_PATH+"PCBusiness/zhxx/index/pc.zhxx.pro.item.index.jsp";;
	if(type == "GF")
		url = BASE_PATH+"PCBusiness/zhxx/index/pc.zhxx.pro.item.index.gf.jsp";;
	parent.frames["contentFrame"].location.href = url;
	showMode.style.display = "none";
}
	
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