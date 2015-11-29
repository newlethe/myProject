<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.util.DateUtil"%>
<%@ page import="com.sgepit.frame.util.JSONUtil"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@page import="com.sgepit.frame.sysman.dao.PropertyCodeDAO"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
List<RockPower> list = systemMgm.getChildRockPowersByParentId(Constant.DefaultModuleRootID, request.getSession());
String naviTop = JSONUtil.formObjectsToJSONStr(list);
String iconClsStr = systemMgm.getModulesIconClsStr();
String imagePath = request.getContextPath() + "/login/gj/images";
 %>
 <%
 String unitType = request.getSession().getAttribute(Constant.UNITTYPE).toString();
	
	String posNum = PropertyCodeDAO.getInstence().getCodeValueByPropertyName("参建单位", "组织机构类型" );
	if ( posNum == null ){
		posNum = "2";
	}
	else if ( posNum.equals("") ){
		posNum = "2";
	}
	
	//参建单位不能点击“公司网站”和“OA”
	Boolean enableExtLink = false;
	if ( ! unitType.equals(posNum) ){
		enableExtLink = true;
		//网站和OA的地址
		Map<String, String> externalLinkMap = new HashMap<String, String>();
		externalLinkMap.put("compWebUrl", Constant.companyWebUrl);

		//如果基建MIS系统通过外网访问，则OA访问地址也变更为外网地址；
		int ind = Constant.companyOAUrl.indexOf("names.nsf");
		String oaUrl = Constant.companyOAUrl+username;
		if(basePath.startsWith("http://124.165.233.138")){
			oaUrl = "http://124.165.233.138/" + Constant.companyOAUrl.substring(ind);
		}
		
		externalLinkMap.put("compOAUrl", oaUrl);
		request.setAttribute("linkMap", externalLinkMap);
	}
	request.setAttribute("enableExtLink", enableExtLink);
 %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title><%=Constant.DefaultModuleRootName%></title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
<link rel="stylesheet" type="text/css" href="../res/css/index.styles.css"></link>
		<link rel="stylesheet" type="text/css" href="../res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>jsp/res/css/feed-viewer.css">
		<style type="text/css">
			.module-gray {text-decoration:underline};
			.c0 { background:url('../res/images/sgcclogo.jpg') no-repeat}
			.c1 { background:url('../res/images/sgcclogo1.jpg') no-repeat}
			.c2 { background:url('../res/images/sgcclogo2.jpg') no-repeat}
			.c3 { background:url('../res/images/sgcclogo3.jpg') no-repeat}
			 //.c4 { background:url('../res/images/sgcclogo4.jpg') no-repeat}
			 //.c4 { background:url('../res/images/top_bg.jpg') no-repeat}
			.c4 { background:url('../res/images/top.jpg') no-repeat}
			.c5 { background:url('../res/images/sgcclogo5.jpg') no-repeat}
			 li.lin1 {line-height:16px; margin-top:5px; background:url('../res/images/bullet_star.png') no-repeat; text-indent:16px;}
			.icon-index {background-image:url(../res/images/icons/application_home.png) !important;}
			.icon-expand-all {
				background-image: url("<%=path%>/jsp/res/images/expand-all.gif") !important;
			}
			.icon-collapse-all {
				background-image: url("<%=path%>/jsp/res/images/collapse-all.gif") !important;
			}
			.icon-submit {
				background-image: url("<%=path%>/jsp/res/images/accept.png") !important;
			}
			ul.x-tab-strip {
				display:block;
			    width:300;
			    zoom:1;
			}
			<%=iconClsStr%>
			.x-tool-left{
				overflow:hidden;
				width:15px;
				height:15px;
				float:left!important;
				cursor:pointer;
				background:transparent url(/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/images/default/panel/tool-sprites.gif) no-repeat;
				margin-left:2px;
			}
	</style>
		<style type="text/css">
		body {
	margin: 0;
	padding: 0;
	background: #F4F5F5;
}

div,h1,h2,h3,h4,p,form,label,input,textarea,img,span {
	margin: 0;
	padding: 0;
	
}
		
#naviContnet{
	margin : 0px;
	padding : 0px;
	background: url(<%=imagePath%>/map_left.jpg) 0 0 no-repeat #EBF4FB;
	background-position : top left;
	width: 100%;
	height : 100%;
}

div.menu {
	padding-top : 145px;
	padding-left : 30px;
}

#naviContnet ul.extLinkMenu li{

	padding:0 30px 45px 30px;
}
#naviContnet ul.extLinkMenu li a.menuBtn{
	display:block;
	height:160px;
	width:190px;
	padding-top : 100px;
	padding-left : 17px;
	font-size:15px;
	background-color:inherit;
	font-weight:bold;
	text-decoration:none;
	text-align:left;
	text-transform:uppercase;
}

#naviContnet ul.extLinkMenu li a.active{
	color:#CA0D11;
}

#naviContnet ul.extLinkMenu li a.active:hover{
	color:#FF3300;
}

#naviContnet ul.extLinkMenu li a.inactive{
	color:#A4A49D;
	cursor: default;
}

#OALink{
	background:url(<%= imagePath %>/TB_OA.png) 0 0 no-repeat;
}

#WEBLink{
	background:url(<%= imagePath %>/信息网站.png) 0 0 no-repeat;
}
		</style>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseDao.js'></script>
		<script type="text/javascript" src="FeedPanel.js"></script>
		<script type="text/javascript" src="left.js"></script>
		
	</head>
	<body scroll="no" id="docs">
		<script>
window.onload = init;
var naviTopObj = <%=naviTop%>
var naviTopSt;
function init(){
	naviTopSt = naviObjectToArray(naviTopObj);
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

</script>
	<div id="naviContnet">
		<c:if test="${enableExtLink}">
		<div class = "menu">
			<ul class="extLinkMenu">
				<li><a href="${linkMap['compOAUrl'] }" target="blank" class="menuBtn active" id="OALink" >OA系统</a></li>
			</ul>
			</div>
		</c:if>

	</div>

	</body>
</html>
