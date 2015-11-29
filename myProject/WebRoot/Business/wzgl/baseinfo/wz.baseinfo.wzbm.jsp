<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>物资编码</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/gantDwr.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
		
		<script type='text/javascript' src='dwr/util.js'></script>

		<script type="text/javascript">
		    var initialize=false;
		    var pk=CURRENTAPPID+'0';
		    DWREngine.setAsync(false);
		    	baseMgm.getData("select uids,pm from wz_ckclb where bm='0' and pid='"+CURRENTAPPID+"'",function(list){
		    	if(list.length<=0){initialize=true;}
		    })
		    DWREngine.setAsync(true);
		    if(initialize){		    
			    DWREngine.setAsync(false);
			    var sql="insert into wz_ckclb (uids,bm,pm,parentbm,leaf,pid) values('"+pk+"','0','物资分类','root','0','"+CURRENTAPPID+"')";
			    gantDwr.execute(sql,function(b){
			    	})
			    DWREngine.setAsync(true);
			}
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo/wz.baseinfo.wzbm.js"></script>
		<script type="text/javascript" src="Business/wzgl/common/queryGrid.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo/wz.baseinfo.wzbm.treeaddoredit.js"></script>
	    <style type="text/css">
		</style>
	</head>
	<body>
		<span></span>
	</body>
</html>
