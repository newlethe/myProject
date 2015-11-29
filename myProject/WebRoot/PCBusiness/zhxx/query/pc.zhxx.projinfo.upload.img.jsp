<%@ page language="java" pageEncoding="UTF-8" %>
<html>
	<HEAD>
		<title>上传照片</title>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
	</HEAD>

	<body>
		<span></span>
	</body>
	<script type="text/javascript">
var _flag= false;

Ext.onReady(function(){
	
	var saveBtn = new Ext.Button({
		text: '确定',
		disabled: true,
		handler: function(){
			fileForm.getForm().submit({
				waitTitle: 'Please waiting...',
				waitMsg: 'Upload data...',
				success: function(form, action){
					Ext.getCmp('photo').el.dom.src = "<%=basePath%>servlet/FlwServlet?ac=loadDoc&fileid=1&random="+Math.random()
				},
				failure: function(form, action){
					Ext.Msg.show({
						title: '提示',
						msg: action.result.msg,
						icon: Ext.Msg.ERROR,
						buttons: Ext.Msg.OK,
						fn: function(value){
							if('ok' == value){
								//parent.uploadWindow.hide();
							}
						}
					});
				}
			})
		}
	});
	
	function checkFileFormat(filename){
		var _filename = filename.split('\\')[filename.split('\\').length-1];
		return (_filename.indexOf('.jpg') != -1) ? true : false;
	}
	
	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		bodyStyle: 'padding: 10px 10px;',
		url: ""+CONTEXT_PATH+"/servlet/FlwServlet?ac=uploadSign&userid="+parent.USERID,
		autoScroll: true,
		labelAlign: 'right',
		buttons:[saveBtn],
		items: [{
			xtype: 'fileuploadfield',
			id: 'uploadsign',
			fieldLabel: '照片',
			hideLabel:true,
			width: 260,
			value: _flag ? '已上传文件' : '',
			buttonText: '上传照片',
			listeners: {
				'fileselected': function(fup, v){
					if (checkFileFormat(v)) {
						saveBtn.enable();
					} else {
						fup.setValue("");
						Ext.example.msg('警告', '请上传jpg格式图片！');
					}
				}
			}
		}]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [fileForm]
	});
});
	
	</script>
</html>