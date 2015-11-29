<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<html>
	<head>
		<title>修改密码</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath %>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="jsp/index/MD5.js"></script>
		<style>
			#cat-grid-panel {border-right:1px solid #99bbe8;}
			#code-grid-panel {border-left:1px solid #99bbe8;}
		</style>
  </head>
  
  <body>
  </body>
</html>
<script>
	var fromPanel;

	Ext.onReady(function (){
	    fromPanel = new Ext.FormPanel({
	        labelWidth: 75,
	        labelAlign: 'top',
	        bodyStyle:'padding:25px 25px 0',
			region: 'center',
			layout: 'form',
			border: false,
			title: '修改口令',
			//iconCls: 'icon-modify-key',
	        items: [new Ext.form.TextField({
	            fieldLabel: '用户登录名',
	            name: 'username',
	            inputType: 'username',
	            disabled: true,
	            width: 180,
	            readOnly: true,
	            value: USERNAME
	        }),new Ext.form.TextField({
	            fieldLabel: '姓名',
	            name: 'usernamereal',
	            inputType: 'usernamereal',
	            disabled: true,
	            width: 180,
	            readOnly: true,
	            value: REALNAME
	        }),new Ext.form.TextField({
	            fieldLabel: '旧口令',
	            name: 'oldpassword',
	            inputType: 'password',
	            width: 180,
	            allowBlank: false
	        }),new Ext.form.TextField({
	            fieldLabel: '新口令',
	            name: 'newpassword1',
	            inputType: 'password',
	            width: 180,
	            invalidText: '两次输入的新口令必须相同！',
	            validator: checkValid,
	            allowBlank: false
	        }),new Ext.form.TextField({
	            fieldLabel: '确认新口令',
	            name: 'newpassword2',
	            inputType: 'password',
	            width: 180,
	            invalidText: '两次输入的新口令必须相同！',
	            validator: checkValid,
	            allowBlank: false
	        })],
	
	        buttons: [{
	            text: '保存',
	            handler: save
	        },{
	            text: '关闭',
	            handler: cancel
	        }]
	    });
		
	var signUrl = BASE_PATH + "/jsp/flow/flw.upload.sign.jsp";
	var tabSign = new Ext.TabPanel({
		height : 370,
		enableTabScroll : false,
		resizeTabs : true,
		activeTab : 0,  
		bodyStyle : 'text-align:left', 
		items : [ 
		fromPanel,
		{
			id : "sign",
			title : "上传用户签名",
			collapsible : true,
			html : '<iframe id="uploadsign" scrolling="auto" frameborder="0" width="100%" height="100%" src="'
					+ signUrl + '"> </iframe>'
		}]
	});
	    var viewport = new Ext.Viewport({  
	        //layout:'border',
	        items:[tabSign]	
	    });

		function checkValid(){
			var form = fromPanel.getForm();
			var f1 = form.findField("newpassword1")
			var f2 = form.findField("newpassword2")
			if (f1.getValue() == f2.getValue()){
				f1.clearInvalid()
				f2.clearInvalid()
			}
			return (f2.getValue() == "" || f1.getValue() == f2.getValue())
		}
		
		function save(){
			var form = fromPanel.getForm();
			if (!form.isValid())
				return
			var oldpwd = form.findField("oldpassword").getValue()
			var newpwd = form.findField("newpassword1").getValue()
			Ext.Ajax.request({
				waitMsg: '保存新口令 ...',
				url: SYS_SERVLET,
				params: {ac: "savepassword", userid: USERID, oldpwd: MD5(oldpwd), newpwd: MD5(newpwd)},
		   		method: "GET",
		   		success: function(response, params) {
		   			var rspXml = response.responseXML
		   			var sa = rspXml.documentElement.getElementsByTagName("done").item(0).firstChild.nodeValue;
		   			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue;
		   			if(msg == "ok"){
		   				Ext.example.msg('保存成功！', '您成功修改了口令！', "");
		   			}
		   			else
		   			{
		   				var stackTrace = rspXml.documentElement.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
				        Ext.MessageBox.show({
				           title: '口令修改失败！',
				           msg: msg,
				           width:400,
				           value:stackTrace,
				           buttons: Ext.MessageBox.OK,
				           multiline: true,
				           icon: Ext.MessageBox.ERROR
						});
		   			}
				},
				failure: function(response, params) {
					alert('Error: Save failed!');
				}
	   		});		
		}
		
		function cancel(){
			var form = fromPanel.getForm();
			parent.pwdWindow.hide()
		}  	    
	});
	
</script>