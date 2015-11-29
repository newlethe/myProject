<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>选择资料信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	   <base href="<%=basePath%>">
	   <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/zlMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>

		<script type="text/javascript">
			var username = REALNAME;
		    var uploaded = false;
		    var uploadFileInfo
		    var selectdaid="<%= request.getParameter("selectdaid")==null?"":request.getParameter("selectdaid")%>"
		    //判断是否显示资料的所有分类，如果orgdata为空则显示当前用户所属部门的资料分类，否则显示资料的所有分类,不论用户所属什么部门                                                            
		    var orgdata="<%= request.getParameter("orgdata")==null?"USERDEPTID":""%>"
		    if(orgdata=="USERDEPTID"){
		    	orgdata=USERDEPTID;
		    }                                                      
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<script type="text/javascript" src="Business/document/flw.adjunct.js"></script>	
		<script type="text/javascript" src="Business/document/zl.select.tree.js"></script>
		<script type="text/javascript" src="Business/document/da.zl.query.js"></script>
        <script type="text/javascript" src="Business/document/choose.zl.js"></script>
        <link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
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
	</head>
	<body>

		<span></span>
		<div id="uploadWin" style='display:none' class='uploadWin'>
			<div id="uploadDiv">
				<iframe id="uploadIFrame" name="uploadIFrame" style="width:100%; height:100%" src="Business/document/uploadFile.htm" ></iframe>
			</div>
			<div id='uploadMsg' style='display:none' class='uploadMsg'>
				<b>上传成功</b>
				<hr size=1>
				  <p class='uploadMsg'>
				  上传成功了一个文件,请关闭窗口保存!
			</div>
		</div>
		
		<div id="grid-example"></div>
		
		<div id="loading-mask" style="display:none"></div>
		<div id="loading" style="display:none">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
		<div id="dbnetcell0" style="behavior:url('/cell/control/cell.htc')"></div> 
	</body>
</html>
