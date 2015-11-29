var mainPanel , viewport , north , box
var helpWindow, pwdWindow 

var tempCount , count = 0 , count1 = 0
var btn = new Array()
var menus = new Array()
var items = new Array()

DocPanel = Ext.extend(Ext.Panel, {
    closable: true,
    autoScroll:true,

    initComponent : function(){
        //var ps = this.cclass.split('.');
        this.title = this.title;
        DocPanel.superclass.initComponent.call(this);
    }
});


MainPanel = function(){
	
	this.tabPanel = this;

	
    MainPanel.superclass.constructor.call(this, {
        id:'doc-body',
        region:'center',
        //border: false , 
        //margins:'0 0 0 0',
        margins:'-1 0 0 -2',
        resizeTabs: true,
        minTabWidth: 135,
        tabWidth: 135,
        plugins: new Ext.ux.TabCloseMenu(),
        enableTabScroll: true,
        activeTab: 0,
		
        items: [{
            id:'welcome-panel',
            title: '欢迎使用',
            autoLoad: {url: 'welcome.html',  scope: this},
            iconCls:'icon-docs',
            autoScroll: true
        }]
    });
};

Ext.extend(MainPanel, Ext.TabPanel, {

    initEvents : function(){
        MainPanel.superclass.initEvents.call(this);
        this.body.on('click', this.onClick, this);
    },

    onClick: function(e, target){
        if(target = e.getTarget('a:not(.exi)', 3)){
            var cls = Ext.fly(target).getAttributeNS('ext', 'cls');
            e.stopEvent();
            if(cls){
                var member = Ext.fly(target).getAttributeNS('ext', 'member');
                this.loadClass(target.href, cls, member, true);
            }else if(target.className == 'inner-link'){
                this.getActiveTab().scrollToSection(target.href.split('#')[1]);
            }else{
                window.open(target.href);
            }
        }else if(target = e.getTarget('.micon', 2)){
            e.stopEvent();
            var tr = Ext.fly(target.parentNode);
            if(tr.hasClass('expandable')){
                tr.toggleClass('expanded');
            }
        }
    },
    loadClass : function(href, cls, member, node, _closable){
        var id = 'docs-' + cls;
        var tab = this.getComponent(id);
        if(tab){
            this.setActiveTab(tab);
            if(member){
                tab.scrollToMember(member);
            }
        }else{
        	if(this.items.length >= 6){
        		Ext.MessageBox.show({
			           title: '提示',
			           msg: "为了不影响应用性能，请您关闭一些应用窗口再打开！",
			           width:300,

			           buttons: Ext.MessageBox.OK,
			           multiline: false,
			           icon: Ext.MessageBox.INFO
					});
        		return
        	}
            var autoLoad = {url: href, scope: this, params:{modid:node.id}, method:'GET'};
            if(member){
                autoLoad.callback = function(){
                    Ext.getCmp(id).scrollToMember(member);
                }
            }
            
            var p = this.add(new DocPanel({
                id: id,
                //cclass : node.getPath(),
                title: node.text,
                autoLoad: autoLoad.url!="" ? autoLoad : null,
                iconCls: node.iconCls,
				closable: _closable
            }));
            
            this.setActiveTab(p);
        }
    }
	
	
});

Ext.onReady(function(){
	north = new Ext.Toolbar({
		region: 'north',
		border: true,
        height: 30
	});
	
	mainPanel = new MainPanel();
	
	viewport = new Ext.Viewport({
		layout:'border',
		items:[north,mainPanel]
	});
	
	var nodes = new Array()
	
	for(var i=0; i<treedata.length; i++) { // 遍历生成节点
		var obj = new Object()
			obj.id = treedata[i][0]
			obj.name = treedata[i][1]
	 		obj.flag = treedata[i][2]=='1' ? true : false
	 		obj.parentId = treedata[i][3]
	 		obj.first = treedata[i][4]=='1' ? true : false
	 		obj.url = (treedata[i][5]=="null") ? "" : "jspDispatcher.jsp";
	 		obj.lvl = treedata[i][6]
	 	
	 	nodes.push(obj)
	 	
	 	
	 	//flag代表是否是叶子，1代表是叶子
	 	//first代表是不是一级根节点，1代表是一级根节点
	 	
	 	//如果是根节点，就创建一个主菜单项
	 	if(obj.first) {
	 		menus[count] = new Ext.menu.Menu({
	 			id: (obj.id+obj.name).toString()
	 		})
	 		tempCount = count
	 		var title = '<font style="font-weight: bold; color: black;">'+obj.name+'</font>'
	 		north.add("-",{id: obj.id , text: title , iconCls: "icon-pkg" , menu: menus[count++]})
	 	} else{
	 		append(obj)
	 	}
	}
	
	var html = companyInfo+'&nbsp;<img src="../res/images/shared/icons/user.png" align="absmiddle"></img><span>&nbsp;'+realname+'</span>&nbsp;'
			   + '<img src="../res/images/index/key.png" align="absmiddle"></img>&nbsp;<a href="#" style="color:black" onclick="modifyPwd()">修改口令</a>&nbsp;'
			   + '<img src="../res/images/index/docs.gif" align="absmiddle"></img>&nbsp;<a href="#" style="color:black" onclick="showHelp()">帮助</a>&nbsp;'
			   + '<img src="../res/images/index/logout.gif" align="absmiddle"></img>&nbsp;<a href="#" style="color:red" onclick="logout()">注销</a>'
	
	north.add("-","->",html)

    function append(obj) {
		if(nodes.length > 1) {
		
			//获得当前菜单节点的前一个节点
			var temp = nodes[nodes.length-2]
			
			//可以肯定的是当前菜单肯定不是一级根节点，也就是first不为1
			//那么可以通过flag来判断是否是叶子节点，1表示是叶子
			//当前节点是叶子
			if(obj.flag && obj.parentId ==  temp.id) {
				
				//当前节点的父节点是一级节点,并且当前节点是叶子节点
				if(temp.first) {
					items[count1] = new Ext.menu.Item({
							id: obj.id+'`'+obj.url , 
		 					text: obj.name,
		 					iconCls: "icon-cmp",
		 					handler: loadModule
					})						
					menus[tempCount].addItem(items[count1++])
				}
				//当前节点的父节点不是一级节点，父节点可能就是二级或以下的节点
				else {
					items[count1] = new Ext.menu.Item({
						id: obj.id+'`'+obj.url , 
						text: obj.name,
						iconCls: "icon-cmp",
		 				handler: loadModule
					}) 
					items[--count1].addItem(items[++count1])
					//count1++
				}
				nodes.pop()
			}
			//当前节点不是叶子节点 ,并且也不是一级根节点,可能是二级或以下的节点
			else if(!obj.flag && obj.parentId == temp.id) {
				//如果当前节点的父节点是个一级节点
				if(temp.first) {
					items[count1] = new Ext.menu.Menu({
						id: (obj.id+obj.name).toString()
					})
					var title = '<font style="font-weight: bold;">'+obj.name+'</font>'
					menus[tempCount].add({id: obj.id , text: title  , iconCls: "icon-pkg" , menu: items[count1++]})
				} 
				//如果当前节点的父节点不是个一级节点,但也是个节点,也就是不是叶子
				else {
					items[count1] = new Ext.menu.Menu({
						id: (obj.id+obj.name).toString()
					})
					var title = '<font style="font-weight: bold;">'+obj.name+'</font>'
					items[--count1].add({id: obj.id , text: title  , iconCls: "icon-pkg" , menu: items[++count1]})
					count1++
				}
				
			} else {
				var tt = temp
				nodes[nodes.length - 2] = obj
				nodes[nodes.length - 1] = tt
				count1--
				nodes.pop()
				
				append(obj)
			}
		}
	}
	
	function loadModule(obj) {
		var arr = obj.id.split('`')
		var id = arr[0]
		var href = arr[1]
		
		var node = new Object()
			node.id = id
			node.text = obj.text
			node.iconCls = obj.iconCls
			
		mainPanel.loadClass(href, id, false, node, true);
	}
	
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
	
});

function modifyPwd(){
	if (!pwdWindow){
		pwdWindow = new Ext.Window({
			title: '修改口令', iconCls: 'icon-modify-key',
			html: "<iframe id='tree' scrolling='no' align='center' src='"+basePath+"jsp/system/sys.password.setting.jsp' width='100%' height='100%'></iframe>",
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: false, maximizable: false,
			width: 500, height: 400
		});
	}
	pwdWindow.show();
}

var help = '<table align="center" width="200" border="0" cellpadding="0" cellspacing="0"> '
		 + '<tr><td valign="middle" height="50"><a href="'+basePath+'cell/CellWeb.exe">CELL插件下载</a></td></tr>'
         + '<tr><td valign="middle" height="50"><a href="'+basePath+'jsp/CheckOFFICE.jsp" target="_blank">OFFICE控件检查</a></td></tr>'
         + '<tr><td valign="middle" height="50" ><a href="'+basePath+'MasterPlan/appendix/NTKOSetupControlClient4032.exe">OFFICE控件手动安装版下载</a></td></tr></table>'

function showHelp(){
	if (!helpWindow){
		helpWindow = new Ext.Window({
			title: '系统帮助', iconCls: 'bookmark',
			html: help,
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: false, maximizable: false,
			width: 300, height: 200
		});
	}
	helpWindow.show();
}

function logout(){
	window.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=logout";
}