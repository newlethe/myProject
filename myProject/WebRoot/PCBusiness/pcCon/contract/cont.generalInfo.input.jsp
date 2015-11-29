 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>合同基本信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
       <script type="text/javascript">
       var backFlag = "<%=request.getParameter("isBack") %>"==1?"<%=request.getParameter("isBack") %>":0;
       var CONIDS ="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
       var OPTYPE ="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
       var UIDS ="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
       var dyView ="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
       var pid="<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";
       var sj="<%=request.getParameter("sj")==null?"":request.getParameter("sj")%>";
       var type="<%=request.getParameter("sj")==null?"":request.getParameter("type")%>";
       </script>
        <script type="text/javascript">
         var query =true;
         var MODID='<%=request.getParameter("modid")%>'
         if(MODID=='null'){
             DWREngine.setAsync(false);
             systemMgm.getModuleIdByName('合同基本信息', null, function(flag) {
	         	MODID = flag
             })
             DWREngine.setAsync(true);
         }
        </script> 
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/equlistMgm.js'></script> 
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcContractMgm.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<!-- EXTEND -->
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		<script type="text/javascript" src="extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="PCBusiness/pcCon/contract/cont.generalInfo.input.js"></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		.x-grid-record-red table{   
            color: #FF0000;   
         }  
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
	<body >
		<span></span>
		<form action="" id="formAc" method="post" name="formAc"></form>
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