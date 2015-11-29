var currentPid = CURRENTAPPID;
Ext.onReady(function() {
	var btnDisabled = ModuleLVL != '1';

		DWREngine.setAsync(false);
		systemMgm.getUnitById(CURRENTAPPID, function(u) {
			if (u && u != null && u != 'null') {
				currentPid = u.upunit;
			}
		});
		DWREngine.setAsync(true);
	
	
	var fm=Ext.form;
	var userPassPanelPB = new Ext.FormPanel( {
			id : 'partB-panel',
			header : false,
			border : false,
			iconCls : 'icon-detail-form', //面板样式
			labelAlign : 'right',
			autoScroll : true,
			buttonAlign : 'center', 
			items : [ new fm.TextField( {
						fieldLabel : '用户名',
						value :USERNAME,
						name : 'userName'
					}), new fm.TextField( {
						fieldLabel : '密码',
						name : 'passW',
						inputType :'password'
					})],
			buttons : [ {
				id : 'save',
				text : '确定',
				handler : formSavePB
			}, {
				id : 'cancel',
				text : '取消',
				handler : formCancelPB
			} ]
		});
	
	var userPassWin = new Ext.Panel( {
					//title : '请输入用户名，密码',
					layout : 'fit',
					width : 200,
					region:'center',
					height : 125,
					modal : true,
					closeAction : 'hide',
			
					items : [userPassPanelPB]
				});
	
	function formCancelPB() {
			parent.closeUsePassWin();
	}
	
	function formSavePB(){
		var form = userPassPanelPB.getForm()
		var userNameForm = form.findField('userName').getValue();
		var passWordForm=form.findField('passW').getValue();
		if(userNameForm==null||userNameForm==''){
			Ext.MessageBox.show({
			           title: '验证失败！',
			           msg: '用户名不能为空',
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
			});
			return;
		}
		if(passWordForm==null||passWordForm==''){
			Ext.MessageBox.show({
			           title: '验证失败！',
			           msg: '密码不能为空',
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
			});
			return;
		}
		if(userNameForm!=USERNAME){
			Ext.MessageBox.show({
			           title: '验证失败！',
			           msg: '只能为当前登录用户才能进行交接班',
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
			});
			parent.yzSucessFull=false;
		}else{
			Ext.Ajax.request({
			url: 'servlet/SysServlet',  
			params: {ac:'login',target:'window', username:userNameForm, password: MD5(passWordForm)},
	  		method: "POST",
	  		success: function(response, params) {
				var rspXml = response.responseXML;	  			
	  			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue
	  			if(msg=='ok'){
	  				parent.yzSucessFull=true;
	  				formCancelPB();
	  			}else{
	  				Ext.MessageBox.show({
			           title: '验证失败！',
			           msg: msg,
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});
	  				parent.yzSucessFull=false;
	  			}
			},
			failure: function(response, params) {
				Ext.MessageBox.show({
		           title: '验证失败！',
		           msg: '系统不能处理当前请求',
		           width:300,
		           buttons: Ext.MessageBox.OK,
		           icon: Ext.MessageBox.ERROR
				});
				yzSucess=false;
				}
			});
			
		}
	}
	
	var viewport = new Ext.Viewport( {
			layout : 'border',
			items : [userPassWin]
	});
	
})
