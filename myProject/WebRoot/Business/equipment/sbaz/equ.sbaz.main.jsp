<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.sysman.dao.PropertyCodeDAO"%>
<%@page import="com.sgepit.frame.sysman.hbm.*"%>
<%@page import="com.sgepit.pmis.contract.hbm.*"%>
<%
	String rootNodeType = request.getParameter("rootNodeType")==null?"SortOne":request.getParameter("rootNodeType").toString();
	String rootNodeId = request.getParameter("rootNodeId")==null?"0":request.getParameter("rootNodeId").toString();
	String rootNodeText = "设备合同";
	
	String conid = request.getParameter("conid").replaceAll("'","");
	if(conid != null){
		rootNodeId = conid;
		rootNodeType = "Ht";
	}
	
	if(!rootNodeType.equals("SortOne")){
		PropertyCodeDAO pcDao = PropertyCodeDAO.getInstence();
		if(rootNodeType.equals("SortTwo")){
			String sbHtFlMc = pcDao.getCodeNameByPropertyName("02", "合同划分类型");
			PropertyType pt = (PropertyType) pcDao.findBeanByProperty("com.sgepit.frame.sysman.hbm.PropertyType", "typeName", sbHtFlMc);
			rootNodeText = pcDao.getCodeNameByPropertyName(rootNodeId,pt.getTypeName());			
		}
		if(rootNodeType.equals("Ht")){
			List<ConOve> htList = pcDao.findByWhere("com.sgepit.pmis.contract.hbm.ConOve","conid='"+rootNodeId+"'"); 
			rootNodeText = htList.get(0).getConname();
		}
	}
	
 %>
<html>
	<head>   
		<title>设备安装</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<style type="text/css">
			#loading-mask{
				position:absolute;
				left:0;
				top:0;
			    width:100%;
			    height:100%;
			    z-index:20000;
			    background-color: black;
			    filter:alpha(opacity=20);
			}
			#loading{
				background:white;
				position:absolute;
				left:40%;
				top:40%;
				padding:2px;
				z-index:20001;
			    height:auto;
			    border:1px solid #99bbe8;
			}
			#loading img {
			    margin-bottom:5px;
			}
			#loading .loading-indicator{
				background:white;
				color:#555;
				font:bold 13px tahoma,arial,helvetica;
				padding:3px;
				margin:0;
			    text-align:center;
			    border:1px solid #99bbe8;
			    height:auto;
			}
		
		</style>
		<!-- DWR -->
		<script type='text/javascript'>
			var  rootNodeType = "<%=rootNodeType%>";
			var  rootNodeId = "<%=rootNodeId%>";
			var rootNodeText = "<%=rootNodeText%>";
		</script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equRecMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equlistMgm.js'></script> 
		<script type='text/javascript' src='dwr/interface/equSetupMgm.js'></script> 
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<script type="text/javascript" src="Business/equipment/sbaz/equ.sbaz.tree.js"></script>
		<script type="text/javascript" src="Business/equipment/sbaz/equ.sbaz.main.js"></script>
	</head>
	<body >
		<br><span></span>
		
		<div id="loading" style="display:none">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
	<br></body>
</html>
