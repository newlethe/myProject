/*
 * Ext JS Library 2.0 RC 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
var win, banner, loginForm, form;
var ServletUrl = "servlet/SysServlet";

var indexPage = "jsp/index/index.jsp";
Ext.onReady(function(){

	Ext.QuickTips.init();		//Ext风格工具栏提示

	bannerPanel = new Ext.Panel({
	    header: false,
	    border: false,
	    region: 'north',
	    height: 200,
	    el: 'banner',
	    baseCls: 'login-banner'
	})
	
    loginForm = new Ext.FormPanel({
        frame:false,
        header:false,
        region: 'center',
        bodyStyle:'padding:10px 5px;background: none;text-align:center;',
        border: false,
        bodyBorder: false,
        region: 'center',
        baseCls: 'login-form',
        labelAlign: 'right',
        items: [{
            layout:'column',
            width: '80%',
            border: false,
            bodyStyle:'background: none;',
            items:[
                {
                columnWidth:.7,
                layout: 'form',
                border: false,
                bodyStyle:'background: none;',
                items: [{
				    xtype:'textfield',
				    labelStyle: 'text-right:right;',
				    fieldLabel: '用户名',
				    name: 'username',
				    allowBlank:false,
                    width:'100%'
                }, {
				    xtype:'textfield',
				    labelStyle: 'text-right:right;',
				    fieldLabel: '口&nbsp;&nbsp;&nbsp;令',
				    inputType : 'password',
				    name: 'password',
				    allowBlank: false,
                    width:'100%'
                },{
				    xtype:'textfield',
				    labelStyle: 'text-right:right;',
				    fieldLabel: '验证码',
				    name: 'verifycode',
				    allowBlank: false,
                    width:'100%'
                }]
            },{
                columnWidth:.3,
                border: false,
                layout: 'form',
                bodyStyle:'background: none;',
                items: [{
				    xtype:'textfield',
				    fieldLabel: '保存我的信息',
				    name: 'assignUser',
				    inputType : 'checkbox',
                    anchor:'95%'
                },
                {
				    xtype:'textfield',
				    name: 'span',
				   	inputType : 'hidden',
                    anchor:'95%',
                    hidden:true
                },
                {
				    xtype:'panel',
				    name: 'verifyImg',
				    html:'<IMG name="verifyImg" src="/'+basePath+'/validateImg?width=50&height=22&now="'+new Date().getTime()
						  +'style="width: 50; height: 100; border: 1px solid #7b7b7b" id="verifyImg" align="left" valign="center"/>',
                    anchor:'95%'
                }]
            }]
        }]
    });
    
    win = new Ext.Window({
                el:'hello-win',
                title: '综合计划&nbsp;<sup>&copy</sup>',
                layout:'fit',
                width:595,
                height:370,
                plain: true,
                resizable: false,
                closable: false,
                iconCls: 'add',
                items: new Ext.Panel({
				    header: false,
				    layout: 'border',
				    items: [
	                	bannerPanel,loginForm
					]
				}),
                buttons: [{
                    text: '登  录',
                    handler: function(){
                        doLogin();
                    }
                }]
            });
    win.show();
    
    form = loginForm.getForm();
	
    assignUserInfo();

	others()
});

function assignUserInfo(){
    var pfield = form.findField("password");
    var ufield = form.findField("username");
	
	// form submit() while press "Enter"
    pfield.on("specialkey", function(f, e){
    	if (f.getValue().trim()!="" && e.getKey() == 13) {
    		doLogin()
    	}
    })
    ufield.on("specialkey", function(f, e){
    	if (f.getValue().trim()!="" && e.getKey() == 13) {
    		doLogin()
    	}
    })
    if (getCookie("username") !== null){
    	ufield.setRawValue(getCookie("username"));
    }
    if (getCookie("username") !== null){
    	document.all("assignUser").checked = true;
    }    
}

function others(){
    var div = document.createElement("DIV")
    div.className = "x-panel-btns x-panel-btns-left"
    div.style.fontSize = '12px'
    div.style.color = '#3685C0'
    div.innerHTML = "推荐使用Internet Explorer浏览器"
    var d = win.footer.dom.childNodes[0]
    d.appendChild(div)
}

function doLogin(){

	var vls = form.getValues();
	
	if (!form.isValid()){
		return;
	}
	
	var processbar = Ext.MessageBox.show({
		title: '请稍候...',
		msg: '登录中 ...',
		width:240,
		progress:true,
		closable:false
	});
	
	var t = 0;
	var f = function(){
		t = (t == 100) ? 0 : t+1;
		Ext.MessageBox.updateProgress(t/100, '');
	};
    var timer = setInterval(f, 30);

	Ext.Ajax.request({
		url: ServletUrl,
		params: {ac:'login',target:'window', username:vls['username'], password: MD5(vls["password"]),verifycode:vls["verifycode"]},
  		method: "POST",
  		success: function(response, params) {
  			var rspXml = response.responseXML;
  			/* IE only  
  			var sa = rspXml.selectSingleNode("//root/done").text;
  			var msg = rspXml.selectSingleNode("//root/msg").text;
  			var stackTrace = rspXml.selectSingleNode("//root/stackTrace").text;
  			*/
  			/* FireFox, IE */
  
  			
  			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue
  			if(msg == "ok"){
				if (vls['assignUser'] == "on"){
					setCookie("username", vls['username']);
				} else {
					setCookie("username", null);
				}
				var jsp = rspXml.documentElement.getElementsByTagName("jsp").item(0).firstChild.nodeValue
  				window.location.href = jsp;
  			} else {
				window.clearInterval(timer);
				processbar.updateProgress(0, '');
				processbar.hide();
				
				Ext.example.msg('登录失败！', msg, 0);
				form.findField('username').focus();
  			}
		},
		failure: function(response, params) {
			window.clearInterval(timer);
			processbar.updateProgress(0, '');
			processbar.hide();
	  		var msg = response.statusText;
	  		if (response.statusText == "" || "communication failure"){
	  			msg = "系统不能处理当前登录请求！可能是：<li>服务器已当机<li>网络故障，无法连接到服务器</span>";
	  		}
			Ext.MessageBox.show({
	           title: '登录失败！',
	           msg: msg,
	           width:300,
	           //multiline: true,
	           //value: stackTrace,
	           buttons: Ext.MessageBox.OK,
	           icon: Ext.MessageBox.ERROR
			});
		}
		
	})
	
}

function setCookie(sName, sValue)
{
	date = new Date();
	if (sValue==null)
		date.setYear(date.getFullYear() - 10);
	else
		date.setYear(date.getFullYear() + 10);
	document.cookie = sName + "=" + escape(sValue) + "; expires=" + date.toGMTString();
}

function getCookie(sName)
{
	var aCookie = document.cookie.split("; ");
	for (var i=0; i < aCookie.length; i++)
	{
		var aCrumb = aCookie[i].split("=");
		if (sName == aCrumb[0])
			return unescape(aCrumb[1]);
	}
	return null;
}

