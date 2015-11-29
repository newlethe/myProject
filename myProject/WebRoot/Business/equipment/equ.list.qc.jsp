<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>设备清册</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
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
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equRecMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equlistMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/gantDwr.js'></script> 
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript">
		    var initialize=false;
		    var pk=CURRENTAPPID+'1';
		    DWREngine.setAsync(false);
		    	baseMgm.getData("select sbid,kks from equ_list_qc where kks='1' and pid='"+CURRENTAPPID+"'",function(list){		    	
		    		if(list.length<=0){initialize=true;}
		    	})
		    DWREngine.setAsync(true);
		    if(initialize){		    
			    DWREngine.setAsync(false);
			    var sql="insert into equ_list_qc (sbid,kks,sb_mc,parent,isleaf,pid) values('"+pk+"','1','设备清册','0',0,'"+CURRENTAPPID+"')"
			    gantDwr.execute(sql,function(b){
			    	})
			    DWREngine.setAsync(true);
			}
		</script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<script type="text/javascript" src="Business/equipment/equ.list.qc.grid.js"></script>
		<script type="text/javascript" src="Business/equipment/equ.list.qc.js"></script>
	</head>
	<body >
		<span></span>
		<div id="loading-mask" style="display:none"></div>
		<div id="loading" style="display:none">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
	</body>
</html>
