<%@ page language="java" pageEncoding="UTF-8" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    
    <title>物资基本信息</title>
	
  </head>
  
  <body>
  </body>
</html>
<script>
Ext.onReady(function(){
	var panel_dj = new Ext.Panel({
		title:'单据类型',
		border: false,
		html: '<iframe src="Business/wzgl/baseinfo/wz.baseinfo.billDefine.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panel_ck = new Ext.Panel({
		title:'物资仓库信息',
		border: false,
		html: '<iframe src="Business/wzgl/baseinfo/wz.baseinfo.ckh.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panel_ry = new Ext.Panel({
		title:'物资人员',
		border: false,
		html: '<iframe src="Business/wzgl/baseinfo/wz.baseinfo.resPerson.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'center',
        forceFit: true,
        //items:[panel_ry,panel_ck,panel_dj]
        items:[panel_ry,panel_ck]//去掉单据类型后的
    });	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[tabs]
    });
});
</script>