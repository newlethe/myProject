<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.service.BusinessConstants"%>
<%@page import="com.sgepit.frame.sysman.dao.SystemDao"%>
<%@page import="com.sgepit.frame.sysman.hbm.RockPower"%>
<%@page import="java.text.DateFormat"%>
<%@page import="java.text.SimpleDateFormat"%>
<% 
	//response.addHeader("Cache-Control","no-cache");   
	String path     = request.getContextPath();	
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";	
	String userid = (String)session.getAttribute(Constant.USERID);
	String username = (String)session.getAttribute(Constant.USERACCOUNT);
	String realname = (String)session.getAttribute(Constant.USERNAME);
	String userunitid = (String)session.getAttribute(Constant.USERUNITID);
	String userdeptid = (String)session.getAttribute(Constant.USERDEPTID);
	String userposid = (String)session.getAttribute(Constant.USERPOSID);
	String unitname = (String)session.getAttribute(Constant.USERUNITNAME);
	String userposname = (String)session.getAttribute(Constant.USERDEPTPOSNAME);
	String userMatDeptid = (String)session.getAttribute(Constant.matDeptId);
	
	String userBelongUnitid = (String)session.getAttribute(Constant.USERBELONGUNITID);
	String userBelongUnitName = (String)session.getAttribute(Constant.USERBELONGUNITNAME);
	String userBelongUnitTypeId = (String)session.getAttribute(Constant.USERBELONGUNITTYPEID);
	
	String currentAppid = (String)session.getAttribute(Constant.CURRENTAPPPID);
	String currentAppname = (String)session.getAttribute(Constant.CURRENTAPPPNAME);
	String userPids = (String)session.getAttribute(Constant.USERPIDS);
	String userPnames = (String)session.getAttribute(Constant.USERPNAMES);
	
	String aPPOrgRootID = (String)session.getAttribute(Constant.APPOrgRootID);
	String aPPOrgRootName = (String)session.getAttribute(Constant.APPOrgRootNAME);
	String defaultOrgRootID = Constant.DefaultOrgRootID;
	
	if (username == null) {
		out.println("<script>top.location.href='"+basePath+"'</script>");
		return;
	}
	
	String funId = request.getParameter("modid");
	String funName = Constant.DefaultModuleRootName+"首页";
	if(funId != null){
		SystemDao systemDao = SystemDao.getFromApplicationContext(Constant.wact);
		RockPower module = (RockPower)systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_MODULE),"powerpk='"+funId+"'",null,null,null).get(0);
		funName = module.getPowername();
	}
	
	String userorg = (String)session.getAttribute(Constant.USERDEPTPOSNAME);
	
	//角色类型(0:系统管理，1用户管理，2普通用户)
	String roletype = (String)session.getAttribute(Constant.ROLETYPE);
	//是否领导角色3
	String isLeader = (String)session.getAttribute(Constant.ISLEADER);
	
	DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	Date thisDate = new Date();
	String thisTimeStr = df.format(thisDate);
	String thisDateStr = thisTimeStr.substring(0, 10);
	
	String day = thisTimeStr.substring(8,10).indexOf("0")==0?thisTimeStr.substring(9,10):thisTimeStr.substring(8,10);
	String thisTimeDate = thisTimeStr.substring(0,4)+","+thisDate.getMonth()+","+day;
	thisTimeDate += ","+thisTimeStr.substring(11,13) + ","+thisTimeStr.substring(14,16) + ","+thisTimeStr.substring(17,19);
	String DEPLOY_MODE = Constant.propsMap.get("DEPLOY_MODE");
	//系统部署的单位：0集团公司；A项目单位
	String DEPLOY_UNITTYPE = Constant.propsMap.get("DEPLOY_UNITTYPE");
	
	String CON_FLOW_FLAG = Constant.propsMap.get("CON_FLOW_FLAG");
	String NTKOWAY=Constant.propsMap.get("NTKOWAY");	
%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
<!--  
<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-normal.css"" />  
<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-green.css" />  
<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-gray.css" />  
-->
<link rel="stylesheet" type="text/css" href="<%=basePath %>jsp/res/css/style.css">
<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/source/debug.js"></script>
<script type="text/javascript" src="<%=basePath%>extExtend/formTextFieldSize.js"></script>
<script type="text/javascript" src="<%=basePath%>extExtend/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath %>extExtend/examples.js"></script>
<script type="text/javascript" src="<%=basePath %>extExtend/EditorGridTbarPanel.js"></script>   
<script type="text/javascript" src="<%=basePath %>extExtend/QueryExcelGridPanel.js"></script>  
<script type="text/javascript" src="<%=basePath %>extExtend/GridCheckColumn.js"></script>
<script type="text/javascript" src="<%=basePath %>extExtend/FileUploadField.js"></script>
<script type="text/javascript" src="<%=basePath %>extExtend/columnTreeNodeUI.js"></script>
<script type="text/javascript" src="<%=basePath %>extExtend/TreeCombo.js"></script>
<!-- 切换项目 -->
<script src='<%=basePath %>dwr/engine.js'></script>
<script src='<%=basePath %>dwr/interface/commonUtilDwr.js'></script>
<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/systemMgm.js'></script>
<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/baseDao.js'></script>
<style>
html, body {
	height: 100%;
}
*{
	font-family:"微软雅黑" !important;
	font-size:12px !important;
}
.x-grid3-hd-inner{
	text-align:center !important;
	padding-right:3px !important;
}
.x-grid3-row td{
	/* font-size:12px; */
	line-height:20px !important;
}
.x-form-field-wrap .x-form-trigger{
	height:19px !important;
}
.x-item-disabled {
	color: #000;
	opacity: 1;
	background: #f0f0f0;
}
input[readOnly]{
	color: #666;
	border: 1px solid #ccc;
	background: #f0f0f0;
}
.grid-row-cell-button{
	height:20px;
	line-height:20px;
	margin:0 10px;
	color:#fff;
	background:#65A6FF;
	cursor:pointer;
}
.grid-row-cell-button:hover{
	background: #3388ff;
}
.x-editor {
	padding-top: 3px !important;
}
.grid-record-yollow table{
	background: #FAF6B6;
}
.grid-record-blue table{
	background: #82B1FF;
}

/*修改grid单元格边框*/
/*
.x-grid3-row{
	border:0;
}
.x-grid3-col {
    border-right: 1px solid #D2D2D2;
    border-bottom: 1px solid #D2D2D2;
}
.x-grid3-row td, .x-grid3-summary-row td {
    padding: 0px;
}
*/
</style>
<script type="text/javascript">
<!--
	var DEBUG = true;//全局调试标志,在开发调试时可以显示异常信息,显示是一些按钮等，更新到服务器时需要修改为false
	Ext.BLANK_IMAGE_URL= '/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/images/default/s.gif';
	Ext.useShims=true;
	Ext.QuickTips.init();
	
	var CONTEXT_PATH = '<%= path %>';
	var BASE_PATH    = '<%= basePath %>';
	var basePath    = '<%= basePath %>';
	var RES_PATH    = CONTEXT_PATH+'/jsp/res/';
	var MAIN_SERVLET = CONTEXT_PATH + "/servlet/MainServlet"
	var SYS_SERVLET = CONTEXT_PATH + "/servlet/SysServlet"
	var UNITID = "<%=userunitid%>";
	var PAGE_SIZE = 20;
	var PAGE_SIZE2 = 20;
	var PAGE_SIZE3 = 20;
	var SPLITA = '<%= Constant.SPLITA %>';
	var SPLITB = '<%= Constant.SPLITB %>';
	var SPLITC = '<%= Constant.SPLITC %>';
	var SPLITD = '<%= Constant.SPLITD %>';
	var SPLITE = '<%= Constant.SPLITE %>';
	var SUCCESS = '<%= Constant.SUCCESS %>';
	var USERID = '<%= userid%>'
	var USERNAME = '<%= username %>';
	var USERUNITID = '<%= userunitid%>'
	var USERDEPTID = '<%= userdeptid%>'
	var USERPOSID = '<%= userposid%>'
	var USERORGID = '<%= userdeptid%>'
	var USERORG = '<%= userorg%>'
	var UNITNAME = '<%=unitname%>'
	var USERPOSNAME = '<%=userposname%>'
	var REALNAME = '<%= realname%>';
	var ROLETYPE =  '<%= roletype %>';
	var ISLEADER =  '<%= isLeader %>';
	var MODULE_ROOT_ID = '<%= Constant.DefaultModuleRootID %>';
	var MODULE_ROOT_NAME = '<%= Constant.DefaultModuleRootName %>';
	var defaultOrgRootID = '<%=Constant.DefaultOrgRootID%>'
	var defaultOrgRootName = '<%=Constant.DefaultOrgRootNAME%>'
	var COMPANY = '<%= Constant.DefaultOrgRootNAME %>';
	var g_path = "<%=path%>";
	var SYS_TIME_STR = "<%=thisTimeStr%>"
	var SYS_DATE_STR = "<%=thisDateStr%>";
	var SYS_DATE_DATE = new Date(<%=thisTimeDate%>);
	var ModuleActions = {//功能操作名称：[操作的名称, 权限级别]
	<%
		String lvl = session.getAttribute(Constant.ModuleLVL)!= null ? (String)session.getAttribute(Constant.ModuleLVL):"";
		HashMap map = (HashMap)session.getAttribute(Constant.ModuleActions);
		if (map!=null) {
			Iterator itr = map.entrySet().iterator();
			while (itr.hasNext()) {
				Map.Entry entry = (Map.Entry) itr.next();
				out.print("'" + (String) entry.getKey() + "':'" + (String) entry.getValue() + "'");
				if (itr.hasNext()){
					out.println(",");
				}
			}
		}
	%>};
	var ModuleLVL = "<%=lvl%>";	//模块的权限级别(1完全控制 > 2写、运行 > 3读 > 4禁止访问)
	var DEPLOY_MODE = "<%=DEPLOY_MODE%>";//部署模式
	var DEPLOY_UNITTYPE = "<%=DEPLOY_UNITTYPE%>";//系统部署位置0集团公司A项目单位
	if(DEPLOY_UNITTYPE == "0")PAGE_SIZE = 10
	var USERBELONGUNITID = "<%=userBelongUnitid%>";//用户所属组织结构ID(公司层面)
	var USERBELONGUNITNAME = "<%=userBelongUnitName%>";//用户所有组织机构名称(公司层面)
	var USERBELONGUNITTYPEID = "<%=userBelongUnitTypeId%>";//用户所有组织机构类型(公司层面)
	
	var CURRENTAPPID = "<%=currentAppid%>";//当前项目单位ID
	var CURRENTAPPNAME = "<%=currentAppname%>";//当前项目单位名称
	var USERPIDS =  "<%=userPids%>";//用户可管理项目单位ID（逗号分隔）
	var USERPNAMES =  "<%=userPnames%>";//用户可管理项目单位名称（逗号分隔）
	var FUN_ID = '<%=funId%>';
	var FUN_NAME = '<%=funName%>';	
	
	var CON_FLOW_FLAG = '<%=CON_FLOW_FLAG%>';
	var NTKOWAY=<%=NTKOWAY%>;
	
	var ROOT_EXT = '<%=Constant.propsMap.get("ROOT_EXT")%>'
	var ROOT_CELL = '<%=Constant.propsMap.get("ROOT_CELL")%>'
	var ROOT_CHART = '<%=Constant.propsMap.get("ROOT_CHART")%>'
	var ROOT_GRID = '<%=Constant.propsMap.get("ROOT_GRID")%>'
	
	function loadModule(modid, target, param){
		target.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=loadmodule&modid="+modid+"&"+param
	}
	function objectToArray(obj){ 
		var arr = new Array(); 
		var k = arguments.length>1 ? arguments[1] : "propertyCode"; 
		var v = arguments.length>1 ? arguments[2] : "propertyName"; 
		for (var i=0; i<obj.length; i++){ 
				arr.push([obj[i][k], obj[i][v]]); 
			} 
		return arr; 
	}	
	
	function releaseIframes(){ 
		try{ 
			var frames = window.frames; 
			for(var i=0; i<frames.length; i++) { 
				if (frames[i].name!=""){ 
					frames[i] = null; 
				}
			}
		} catch(e){
		} 
	}
	
	function cnMoney(v) {
		v = (Math.round((v - 0) * 100)) / 100;
		v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
		v = String(v);
		var ps = v.split(".");
		var whole = ps[0];
		var sub = ps[1] ? "." + ps[1] : ".00";
		var r = /(\d+)(\d{3})/;
		while (r.test(whole)) {
			whole = whole.replace(r, "$1" + "," + "$2");
		}
		v = whole + sub;
		if (v.charAt(0) == "-") {
			return "-￥" + v.substr(1);
		}
		return "￥" + v;
	}
	
	//参数p保留小数位数
	function cnMoneyToPrec(v, p){
		if ( isNaN(v) ){
			v = 0;
		}
		v = Number(v);
	
		var retVal = v.toFixed(p);
		var ps = retVal.split(".");
		var whole = ps[0];
		var r = /(\d+)(\d{3})/;
		while (r.test(whole)) {
			whole = whole.replace(r, "$1" + "," + "$2");
		}
		retVal = whole;
		if ( ps.length > 1 ){
			retVal = retVal + '.' + ps[1];
		}
		
		return retVal;
	}
	
	function setCookie(sName, sValue) {
		date = new Date();
		if (sValue==null)
			date.setYear(date.getFullYear() - 10);
		else
			date.setYear(date.getFullYear() + 10);
		document.cookie = sName + "=" + escape(sValue);
	}

	function getCookie(sName) {
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0])
				return unescape(aCrumb[1]);
		}
		return null;
	}
	
	function deleteCookie(name) { 
	    var expdate = new Date(); 
	    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
	    setCookie(name, "", expdate); 
	} 
	//切换PID
	function switchoverProj(pid,pname){
		try{
			DWREngine.setAsync(false);
			commonUtilDwr.changeCurrentAppPid(pid,pname,function(){
				CURRENTAPPID = pid;
				CURRENTAPPNAME = name;
				if(top){
					top.CURRENTAPPID = pid;
					top.CURRENTAPPNAME = name;
				};
				if(top.btn&&top.btn.setText){
					top.btn.setText(pname);
				}
			});
			DWREngine.setAsync(true);
			return true;
		}catch(e){
			return false;
		}
	}
	function loadFirstModule(pid,pname,param){
		systemMgm.getFirstPowerFromSubSystem(parent.selectedSubSystemId,USERID,function(dat){
			if(dat != null){
				DWREngine.setAsync(false);
				switchoverProj(pid,pname)
				DWREngine.setAsync(true);
				//parent.lt.expand();
				ifaloneShowOrHide(dat.ifalone);
				//parent.pathButton.setText("<b>当前位置:"+parent.selectedSubSystemName+"/"+dat.powername+"</b>")
				parent.pathButton.setText("<font color=#15428b><b>&nbsp;"+dat.powername+"</b></font>")
				if(!param) param = null;
				loadModule(dat.powerpk,parent.frames["contentFrame"],param)
				//parent.frames["contentFrame"].location.href = CONTEXT_PATH +"/"+ dat.url
				if(parent.CT_TOOL_DISPLAY){
    				parent.CT_TOOL_DISPLAY(true);
				}
			}
		})
	}
	
	changeUnitsCombo();
	//功能模块页面切换项目的combo中过滤本模块不显示的项目单位。
	function changeUnitsCombo(){
		var unitPageCombo = parent.proTreeCombo;	//模块页面切换项目的combo
		var sub2Modid = parent.selectedSubSystemId;	//二级模块首页id
		var unitsData = new Array();
		if(unitPageCombo && !unitPageCombo.hidden){
			DWREngine.setAsync(false);
			systemMgm.findUnitsByModid(sub2Modid,USERBELONGUNITID,function(list){
				for(var i=0;i<list.length;i++){
					var temp = new Array();
					temp.push(list[i].unitid);
					temp.push(list[i].unitname);
					unitsData.push(temp);
				}
			});
			DWREngine.setAsync(true);
			unitPageCombo.store.loadData(unitsData);
			//combo重新加载数据后隐藏下拉框
			if(unitPageCombo.list)unitPageCombo.list.hide();	
		}
	}
	function ifaloneShowOrHide(ifalonecode){
		if(parent.proTreeCombo&&parent.backToSubSystemBtn){
			switch(ifalonecode){
				//0：不显示，1：只显示返回子系统按钮，2：只显示项目选择框，3：两者均显示';
				case "0":
					parent.proTreeCombo.hide();
					parent.backToSubSystemBtn.hide();
					break;
				case "1":
					parent.proTreeCombo.hide();
					parent.backToSubSystemBtn.show();
					break;
				case "2":
					parent.proTreeCombo.show();
					parent.proTreeCombo.setValue(CURRENTAPPID)
					parent.backToSubSystemBtn.hide();
					break;
				case "3":
					parent.proTreeCombo.show();
					parent.proTreeCombo.setValue(CURRENTAPPID)
					parent.backToSubSystemBtn.show();
					break;
				default:
					parent.proTreeCombo.hide();
					parent.backToSubSystemBtn.hide();
						break;
			}
		}
	}
	//判断功能模块页面是否显示项目选择框和返回按钮
	isShowOrHide=function(){
		var curl=window.location.href;
		if(curl.indexOf("?")!=-1&&curl.indexOf("modid=")==-1){
			curl=curl.replace(BASE_PATH,"");
			var aurl=curl.split("?")[0];
			DWREngine.setAsync(false);
			baseDao.getData("select s.url,s.ifalone from (select * from user_power_view where userid='"+USERID+"') s "+
				"where s.url like '"+aurl+"%' start with s.powerpk = '"+parent.selectedSubSystemId+"' connect by prior s.powerpk = s.parentid",function(list){
				if(list.length<1){
					
				}else if(list.length>1){
					for(var i=0;i<list.length;i++){
						if(list[i][0].indexOf("?")!=-1){
							var arguments=list[i][0].split("?")[1].split("&");
							var matchFlag=true;
							for(var j=0;j<arguments.length;j++){
								if(curl.indexOf(arguments[j])==-1){
									matchFlag=false;
								}
							}
							if(matchFlag){
								ifaloneShowOrHide(list[i][1]);
								break;
							}
						}else{
							ifaloneShowOrHide(list[i][1]);
							break;
						}
					}
				}else if(list.length==1){
					ifaloneShowOrHide(list[0][1]);
				}
			});
			DWREngine.setAsync(true);
		}
	}();
		
//-->
</script>