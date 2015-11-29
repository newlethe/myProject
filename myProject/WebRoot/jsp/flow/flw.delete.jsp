 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>删除整个流程-后台方法[慎用]</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwInstanceMgm.js'></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<script type="text/javascript">
		function showWin(){
			new Ext.Window({
				title: '删除整个流程',
				iconCls: 'title',
				layout: 'fit',
				width: 260, //height: 320,
				modal: false, resizable: false,
				closable: false, //closeAction: 'hide',
				maximizable: false, plain: true,
				items: [
					new Ext.TabPanel({
						activeTab: 0,
						deferredRender: true,
						plain: true,
						border: false,
						forceFit: true,
						items: [{
							id: 'del_flw',
							title: '删除流程',
							layout: 'fit',
							bodyStyle: 'display: none;',
							tbar: [
								'<font color=#15428b>流程ID：</font>',
								{xtype: 'textfield', id: 'flowid'},
								'->', {
									text: '删除', iconCls:	'multiplication', handler: function(){
										var cmp = Ext.getCmp('flowid');
										if (cmp.getValue() != ''){
											flwInstanceMgm.DEL_FLOW(cmp.getValue(), function(message){
												Ext.Msg.show({
													title: '提示',
													msg: message,
													icon: Ext.Msg.INFO,
													buttons: Ext.Msg.OK,
													fn: function(value){
														if ('ok' == value){ window.location.reload(); }
													}
												});
											});
										} else {
											Ext.example.msg('提示', '请填写流程ID');
										}
									}
								}
							]
						}, {
							id: 'del_ins',
							title: '删除实例',
							layout: 'fit',
							bodyStyle: 'display: none;',
							tbar: [
								'<font color=#15428b>实例ID：</font>',
								{xtype: 'textfield', id: 'insid'},
								'->', {
									text: '删除', iconCls:	'multiplication', handler: function(){
										var cmp = Ext.getCmp('insid');
										if (cmp.getValue() != ''){
											flwInstanceMgm.DEL_INS(cmp.getValue(), function(message){
												Ext.Msg.show({
													title: '提示',
													msg: message,
													icon: Ext.Msg.INFO,
													buttons: Ext.Msg.OK,
													fn: function(value){
														if ('ok' == value){ window.location.reload(); }
													}
												});
											});
										} else {
											Ext.example.msg('提示', '请填写实例ID');
										}
									}
								}
							]
						}]
					})
				]
			}).show();
		};
		/*
		function showWin(){
			new Ext.Window({
				title: '删除整个流程',
				iconCls: 'title',
				layout: 'fit',
				width: 260, height: 320,
				modal: false, resizable: false,
				closable: false, //closeAction: 'hide',
				maximizable: false, plain: true,
				bodyStyle: 'display: none;',
				tbar: [
					'<font color=#15428b>流程ID：</font>',
					{xtype: 'textfield', id: 'flowid'},
					'->', {
						text: '删除', iconCls:	'multiplication', handler: function(){
							var cmp = Ext.getCmp('flowid');
							if (cmp.getValue() != ''){
								flwInstanceMgm.DEL_FLOW(cmp.getValue(), function(message){
									Ext.Msg.show({
										title: '提示',
										msg: message,
										icon: Ext.Msg.INFO,
										buttons: Ext.Msg.OK,
										fn: function(value){
											if ('ok' == value){ window.location.reload(); }
										}
									});
								});
							} else {
								Ext.example.msg('提示', '请填写流程ID');
							}
						}
					}
				]
			}).show();
			*/
		</script>
	</head>
	<body onload="showWin()">
		<span></span>
		<div id='win'></div>

	</body>
</html>